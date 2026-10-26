/* =========================================================
   Rasio Battle – Kelas VII (TGT)
   Sesuai "Aturan Bermain". Data soal ada di soal.js (SOAL).
   ========================================================= */
(function () {
  'use strict';

  // ---------- Konstanta ----------
  var COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
  var EMOJI  = ['🦁', '🐯', '🐼', '🐸', '🐙', '🦄', '🐧', '🦊'];
  var HUES   = [350, 25, 45, 140, 185, 215, 265, 320];
  var LETTERS = ['A', 'B', 'C', 'D'];
  var STORE_KEY = 'rasio-game-state-v1';
  var MAX_LIVES = 3;
  var PICK_SEC = 10;      // aturan 1: maks 10 detik memilih nomor
  var THROW_SEC = 15;     // aturan 5: 15 detik untuk soal lemparan
  var ADJ_POINTS = 10;
  var PTS_HUE = { 10: 140, 20: 38, 30: 350 };       // warna kotak menurut poin
  var TIME_BY_PTS = { 10: 30, 20: 45, 30: 60 };   // detik menjawab menurut kategori poin    // langkah koreksi skor manual oleh guru

  // ---------- Variabel ----------
  var state = null;
  var teamCount = 4;
  var attempt = null;     // soal yang sedang dibuka (juga disimpan di state.attempt)
  var paused = false;
  var pick = { left: 0, active: false };
  var att  = { left: 0, total: 0, active: false };
  var lastTick = Date.now();
  var lastSave = 0;
  var spinning = false;
  var audioCtx = null;
  var toastId = null;

  // ---------- Helper ----------
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }
  function showScreen(id) {
    ['setup', 'game', 'result'].forEach(function (s) { $(s).classList.toggle('active', s === id); });
    window.scrollTo(0, 0);
  }
  function onGameScreen() { return $('game').classList.contains('active'); }
  function hearts(n) {
    var s = '';
    for (var i = 0; i < MAX_LIVES; i++) s += i < n ? '❤️' : '🖤';
    return s;
  }
  function fmt(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(s / 60), r = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
  }
  function toast(msg, ms) {
    var el = $('toast');
    el.textContent = msg; el.hidden = false;
    clearTimeout(toastId);
    toastId = setTimeout(function () { el.hidden = true; }, ms || 3500);
  }

  // ---------- Penyimpanan ----------
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }
  function clearSave() { try { localStorage.removeItem(STORE_KEY); } catch (e) {} }
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      var ok = s && Array.isArray(s.teams) && s.teams.length >= 1 && s.teams.length <= 8 &&
               s.teams.every(function (t) { return typeof t.lives === 'number'; }) &&
               Array.isArray(s.order) && s.order.length === SOAL.length &&
               Array.isArray(s.done) && s.done.length === SOAL.length;
      return ok ? s : null;
    } catch (e) { return null; }
  }

  // ---------- Suara ----------
  function tone(freq, start, dur, type, vol) {
    var o = audioCtx.createOscillator();
    var g = audioCtx.createGain();
    var t0 = audioCtx.currentTime + start;
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.15, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(t0); o.stop(t0 + dur);
  }
  function playSound(kind) {
    if (!state || !state.sound) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      if (kind === 'correct') { tone(523, 0, .15); tone(659, .13, .15); tone(784, .26, .3); }
      else if (kind === 'wrong') { tone(200, 0, .35, 'sawtooth', .1); }
      else if (kind === 'timeup') { tone(330, 0, .25, 'square', .08); tone(330, .3, .25, 'square', .08); }
      else if (kind === 'tick') { tone(880, 0, .08, 'sine', .06); }
      else if (kind === 'finish') { tone(523, 0, .15); tone(659, .15, .15); tone(784, .3, .15); tone(1047, .45, .5); }
    } catch (e) {}
  }

  // ======================================================
  //  LAYAR PENGATURAN
  // ======================================================
  function buildCountButtons() {
    var wrap = $('teamCountBtns');
    wrap.innerHTML = '';
    for (var n = 1; n <= 8; n++) {
      (function (num) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'count-btn' + (num === teamCount ? ' active' : '');
        b.textContent = num;
        b.addEventListener('click', function () { teamCount = num; buildCountButtons(); buildNameInputs(); });
        wrap.appendChild(b);
      })(n);
    }
  }

  function buildNameInputs() {
    var wrap = $('teamNames');
    var old = Array.prototype.map.call(wrap.querySelectorAll('input'), function (i) { return i.value; });
    wrap.innerHTML = '';
    for (var i = 0; i < teamCount; i++) {
      var row = document.createElement('label');
      row.className = 'name-row';
      row.style.setProperty('--c', COLORS[i]);
      var dot = document.createElement('span');
      dot.className = 'dot';
      dot.textContent = EMOJI[i];
      var inp = document.createElement('input');
      inp.type = 'text';
      inp.maxLength = 20;
      inp.value = (old[i] !== undefined) ? old[i] : ('Kelompok ' + (i + 1));
      row.appendChild(dot);
      row.appendChild(inp);
      wrap.appendChild(row);
    }
  }

  function updateResumeButton() { $('btnResume').hidden = !load(); }

  function startGame() {
    var inputs = document.querySelectorAll('#teamNames input');
    var names = Array.prototype.map.call(inputs, function (inp, i) {
      return inp.value.trim() || ('Kelompok ' + (i + 1));
    });
    var order = SOAL.map(function (_, i) { return i; });
    if ($('optShuffle').checked) shuffle(order);
    var minutes = parseInt($('optGameTime').value, 10) || 0;

    state = {
      teams: names.map(function (n) { return { name: n, score: 0, lives: MAX_LIVES }; }),
      order: order,
      done: SOAL.map(function () { return null; }),   // null | {w: indeksKelompok atau -1, pts}
      turn: 0,
      timer: $('optTimerOn').checked ? 1 : 0,   // 1 = timer aktif (durasi sesuai kategori soal)
      sound: $('optSound').checked,
      throwLife: $('optThrowLife').checked,
      gameMinutes: minutes,
      gameLeft: minutes * 60000,
      timeUp: false,
      attempt: null
    };
    attempt = null; paused = false;
    save();
    enterGame();
  }

  function enterGame() {
    showScreen('game');
    renderGame();
    lastTick = Date.now();
    if (state.attempt) {
      attempt = state.attempt;
      renderModal();
    } else {
      startPick();
    }
  }

  // ======================================================
  //  LAYAR PERMAINAN
  // ======================================================
  function renderGame() { renderTurn(); renderBoard(); renderScoreboard(); renderClock(); }

  function renderTurn() {
    var done = state.done.filter(Boolean).length;
    if (state.turn >= 0) {
      var t = state.teams[state.turn];
      $('turnInfo').innerHTML =
        '<span class="turn-dot" style="background:' + COLORS[state.turn] + '">' + EMOJI[state.turn] + '</span>' +
        '<span>Giliran memilih: <strong>' + esc(t.name) + '</strong></span>';
    } else {
      $('turnInfo').innerHTML =
        '<span class="turn-dot" style="background:#6b7280">⚠️</span>' +
        '<span>Semua kelompok nyawa 0 — guru memilih soal (lemparan)</span>';
    }
    $('progress').textContent = 'Soal selesai: ' + done + '/' + SOAL.length;
  }

  function renderClock() {
    ['gameClock', 'gameClockModal'].forEach(function (id) {
      var el = $(id);
      if (!state || state.gameMinutes <= 0) { el.hidden = true; return; }
      el.hidden = false;
      el.textContent = state.timeUp ? '⏰ Waktu habis' : (paused ? '⏸ ' : '⏳ ') + fmt(state.gameLeft);
      el.classList.toggle('low', state.timeUp || state.gameLeft <= 60000);
    });
  }

  function renderBoard() {
    var board = $('board');
    board.innerHTML = '';
    state.order.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tile';
      b.style.setProperty('--h', HUES[(i + Math.floor(i / 10)) % HUES.length]);
      var d = state.done[i];
      if (d) {
        b.classList.add('done');
        b.disabled = true;
        if (d.w >= 0) {
          b.style.setProperty('--tc', COLORS[d.w]);
          b.innerHTML = '<span class="tile-emoji">' + EMOJI[d.w] + '</span><span>' + (i + 1) + '</span>';
        } else {
          b.classList.add('nobody');
          b.innerHTML = '<span class="tile-emoji">✖</span><span>' + (i + 1) + '</span>';
        }
      } else {
        var pts = SOAL[state.order[i]].pts;
        b.style.setProperty('--h', PTS_HUE[pts] || 265);
        b.innerHTML = '<span>' + (i + 1) + '</span><span class="tile-pts">⭐ ' + pts + '</span>';
        b.addEventListener('click', function () { openQuestion(i); });
      }
      board.appendChild(b);
    });
  }

  function renderScoreboard() {
    var sb = $('scoreboard');
    sb.innerHTML = '';
    state.teams.forEach(function (t, i) {
      var card = document.createElement('div');
      card.className = 'team' + (i === state.turn ? ' active' : '') + (t.lives <= 0 ? ' out' : '');
      card.style.setProperty('--c', COLORS[i]);
      card.innerHTML =
        '<button type="button" class="team-main" data-turn="' + i + '" title="Jadikan giliran kelompok ini">' +
          '<span class="team-emoji">' + EMOJI[i] + '</span>' +
          '<span class="team-name">' + esc(t.name) + '</span>' +
        '</button>' +
        '<div class="team-lives">' +
          '<button type="button" class="adj sm" data-life="-1" data-i="' + i + '" title="Nyawa −1">−</button>' +
          '<span class="hearts" title="Nyawa: ' + t.lives + '">' + hearts(t.lives) + '</span>' +
          '<button type="button" class="adj sm" data-life="1" data-i="' + i + '" title="Nyawa +1">+</button>' +
        '</div>' +
        '<div class="team-score">' +
          '<button type="button" class="adj" data-adj="-1" data-i="' + i + '" title="Kurangi ' + ADJ_POINTS + ' poin">−</button>' +
          '<span class="score">' + t.score + '</span>' +
          '<button type="button" class="adj" data-adj="1" data-i="' + i + '" title="Tambah ' + ADJ_POINTS + ' poin">+</button>' +
        '</div>';
      sb.appendChild(card);
    });
  }

  function onScoreboardClick(e) {
    if (attempt) return;
    var turnBtn = e.target.closest('[data-turn]');
    if (turnBtn) {
      var k = parseInt(turnBtn.getAttribute('data-turn'), 10);
      if (state.teams[k].lives <= 0) { toast('Kelompok dengan nyawa 0 tidak boleh memilih soal.'); return; }
      state.turn = k;
      save(); renderTurn(); renderScoreboard(); startPick();
      return;
    }
    var adj = e.target.closest('[data-adj]');
    if (adj) {
      var i = parseInt(adj.getAttribute('data-i'), 10);
      state.teams[i].score += parseInt(adj.getAttribute('data-adj'), 10) * ADJ_POINTS;
      save(); renderScoreboard();
      return;
    }
    var life = e.target.closest('[data-life]');
    if (life) {
      var j = parseInt(life.getAttribute('data-i'), 10);
      var t = state.teams[j];
      t.lives = Math.min(MAX_LIVES, Math.max(0, t.lives + parseInt(life.getAttribute('data-life'), 10)));
      if (state.turn >= 0 && state.teams[state.turn].lives <= 0) state.turn = nextTurn(state.turn);
      else if (state.turn < 0 && t.lives > 0) state.turn = j;
      save(); renderTurn(); renderScoreboard();
    }
  }

  // Giliran berikutnya: lewati kelompok bernyawa 0 (aturan 7). -1 bila semua 0.
  function nextTurn(from) {
    var n = state.teams.length;
    for (var k = 1; k <= n; k++) {
      var idx = ((from + k) % n + n) % n;
      if (state.teams[idx].lives > 0) return idx;
    }
    return -1;
  }

  // ======================================================
  //  WAKTU PILIH NOMOR (10 detik, lewat -> guru memilih acak)
  // ======================================================
  function startPick() {
    if (!state || state.timeUp || attempt) { stopPick(); return; }
    if (state.done.every(Boolean)) { stopPick(); return; }
    pick.left = PICK_SEC * 1000;
    pick.active = true;
    renderPick();
  }
  function stopPick() { pick.active = false; $('pickTimer').hidden = true; }
  function renderPick() {
    var el = $('pickTimer');
    el.hidden = !pick.active;
    if (pick.active) {
      el.textContent = '🎯 Pilih nomor: ' + Math.ceil(pick.left / 1000) + ' dtk';
      el.classList.toggle('low', pick.left <= 3000);
    }
  }
  function openTiles() {
    var r = [];
    state.done.forEach(function (d, i) { if (!d) r.push(i); });
    return r;
  }
  function randomPick(auto) {
    if (attempt || !state) return;
    var open = openTiles();
    if (!open.length) return;
    var tile = open[Math.floor(Math.random() * open.length)];
    toast((auto ? 'Waktu memilih habis — ' : 'Guru memilih acak — ') + 'soal nomor ' + (tile + 1));
    openQuestion(tile);
  }

  // ======================================================
  //  MODAL SOAL
  //  Fase: answering (ketua menjawab) -> throw (angkat tangan/spin) -> resolved
  // ======================================================
  function currentQ() { return SOAL[state.order[attempt.tile]]; }
  function teamLabel(i) { return EMOJI[i] + ' ' + state.teams[i].name; }
  function persistAttempt() { state.attempt = attempt; save(); }

  function openQuestion(tile) {
    stopPick();
    attempt = {
      tile: tile, owner: state.turn, tried: [], current: -1, selected: null, wrong: [],
      phase: 'answering', cands: [], lempar: false, msg: ''
    };
    if (state.turn >= 0) {
      attempt.tried = [state.turn];
      attempt.current = state.turn;
    } else {
      // semua kelompok nyawa 0: soal langsung dilempar
      attempt.phase = 'throw';
      attempt.lempar = true;
      attempt.msg = '⚠️ Semua kelompok bernyawa 0 — soal langsung dilempar.';
    }
    persistAttempt();
    renderModal();
  }

  function renderModal() {
    var q = currentQ();
    $('qBadge').textContent = 'Soal ' + (attempt.tile + 1);
    $('qPts').textContent = '⭐ ' + q.pts + ' poin';
    $('qText').textContent = q.q;

    var opts = $('qOptions');
    opts.innerHTML = '';
    q.o.forEach(function (text, k) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'opt';
      d.innerHTML = '<span class="opt-l">' + LETTERS[k] + '</span><span>' + esc(text) + '</span>';
      d.addEventListener('click', function () { selectOption(k); });
      opts.appendChild(d);
    });

    $('timeUpBanner').hidden = !state.timeUp;
    $('modal').hidden = false;
    $('modalBox').focus();
    setAttemptChip();
    showPhase();

    if (attempt.phase === 'answering') startAttemptTimer();
    else if (attempt.phase === 'throw') renderThrow();
    else if (attempt.phase === 'resolved') showResolved();
  }

  function setAttemptChip() {
    var chip = $('qTurn');
    if (attempt.current >= 0 && attempt.phase === 'answering') {
      chip.textContent = teamLabel(attempt.current) + (attempt.lempar ? ' (lemparan)' : '');
      chip.style.background = COLORS[attempt.current];
    } else if (attempt.phase === 'resolved' && attempt.current >= 0) {
      chip.textContent = teamLabel(attempt.current) + (attempt.lempar ? ' (lemparan)' : '');
      chip.style.background = COLORS[attempt.current];
    } else {
      chip.textContent = attempt.phase === 'throw' ? '↪ Soal lemparan' : 'Soal selesai';
      chip.style.background = '#6b7280';
    }
  }

  function showPhase() {
    var ph = attempt.phase;
    $('answerControls').hidden = ph !== 'answering';
    $('wrongBox').hidden = ph !== 'throw';
    $('nextBox').hidden = ph !== 'resolved';
    if (ph !== 'resolved') $('explain').hidden = true;
    if (ph !== 'answering') $('timerWrap').hidden = true;
    $('btnLock').disabled = attempt.selected === null;

    Array.prototype.forEach.call($('qOptions').children, function (el, k) {
      var isWrong = attempt.wrong.indexOf(k) >= 0;
      el.disabled = ph !== 'answering' || isWrong;
      el.classList.toggle('selected', ph === 'answering' && attempt.selected === k);
      el.classList.toggle('wrong', isWrong);
    });
  }

  function selectOption(k) {
    if (!attempt || attempt.phase !== 'answering' || attempt.wrong.indexOf(k) >= 0 ) return;
    attempt.selected = k;
    showPhase();
  }

  // ----- Timer menjawab -----
  function startAttemptTimer() {
    var sec = attempt.lempar ? THROW_SEC : (state.timer ? (TIME_BY_PTS[currentQ().pts] || 60) : 0);
    if (sec > 0) {
      att.total = sec * 1000; att.left = att.total; att.active = true;
      $('timerWrap').hidden = false;
      $('timerWrap').classList.remove('warn', 'over');
      renderAttemptTimer();
    } else {
      att.active = false;
      $('timerWrap').hidden = true;
    }
  }
  function stopAttemptTimer() { att.active = false; }
  function renderAttemptTimer() {
    $('timerBar').style.width = (att.left / att.total * 100) + '%';
    $('timerText').textContent = Math.ceil(att.left / 1000) + ' detik';
    $('timerWrap').classList.toggle('warn', att.left / att.total <= 0.25 && att.left > 0);
  }

  // ----- Ketua menjawab -----
  function lockAnswer() {
    if (!attempt || attempt.phase !== 'answering' || attempt.selected === null) return;
    stopAttemptTimer();
    if (attempt.selected === currentQ().a) correctAnswer(); else wrongAnswer();
  }

  // Aturan 3: benar -> poin kategori + nyawa +1 (maks 3)
  function correctAnswer() {
    var i = attempt.current, t = state.teams[i], q = currentQ();
    t.score += q.pts;
    var lifeNote = '';
    if (!attempt.lempar || state.throwLife) {
      if (t.lives < MAX_LIVES) { t.lives++; lifeNote = ', nyawa +1'; }
      else lifeNote = ', nyawa sudah maksimal';
    }
    state.done[attempt.tile] = { w: i, pts: q.pts };
    playSound('correct');
    resolveQuestion('✅ Benar! ' + teamLabel(i) + ' mendapat +' + q.pts + ' poin' + lifeNote + '.');
  }

  // Aturan 3 & 5: salah -> nyawa −1, poin tetap, soal dilempar
  function wrongAnswer() {
    var i = attempt.current, t = state.teams[i], sel = attempt.selected;
    if (sel !== null) attempt.wrong.push(sel);
    attempt.selected = null;
    t.lives = Math.max(0, t.lives - 1);
    playSound('wrong');
    goThrow('❌ Jawaban ' + t.name + ' (' + LETTERS[sel] + ') salah. Nyawa −1 (sisa ' + t.lives + '), poin tetap.');
  }

  // Aturan 3 & 5: waktu habis / tidak menjawab -> tanpa pengurangan, soal dilempar
  function timeoutAnswer() {
    if (!attempt || attempt.phase !== 'answering') return;
    stopAttemptTimer();
    attempt.selected = null;
    playSound('timeup');
    goThrow('⏱ Waktu ' + state.teams[attempt.current].name + ' habis. Tidak ada pengurangan nyawa atau poin.');
  }

  // ----- Lemparan: angkat tangan -> (spin) -> menjawab 15 detik -----
  function eligibleTeams() {
    var r = [];
    state.teams.forEach(function (_, i) { if (attempt.tried.indexOf(i) < 0) r.push(i); });
    return r;
  }

  function goThrow(msg) {
    attempt.phase = 'throw';
    attempt.msg = msg;
    attempt.cands = [];
    attempt.current = -1;
    if (!eligibleTeams().length) {
      resolveNobody(msg + ' Semua kelompok sudah mencoba.');
      return;
    }
    persistAttempt();
    setAttemptChip();
    showPhase();
    renderThrow();
  }

  function renderThrow() {
    $('wrongMsg').textContent = attempt.msg;
    var list = $('throwList');
    list.innerHTML = '';
    eligibleTeams().forEach(function (i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hand' + (attempt.cands.indexOf(i) >= 0 ? ' on' : '');
      b.dataset.team = i;
      b.style.setProperty('--c', COLORS[i]);
      b.innerHTML = EMOJI[i] + ' ' + esc(state.teams[i].name) + '<small>' + hearts(state.teams[i].lives) + '</small>';
      b.addEventListener('click', function () { toggleCand(i); });
      list.appendChild(b);
    });
    updateSpinButton();
  }

  function toggleCand(i) {
    if (spinning) return;
    var p = attempt.cands.indexOf(i);
    if (p >= 0) attempt.cands.splice(p, 1); else attempt.cands.push(i);
    persistAttempt();
    renderThrow();
  }

  function updateSpinButton() {
    var b = $('btnSpin'), n = attempt.cands.length;
    b.disabled = n === 0 || spinning;
    b.textContent = n === 0 ? 'Pilih kelompok dulu'
      : n === 1 ? '▶ ' + state.teams[attempt.cands[0]].name + ' menjawab'
      : '🎡 Spin (' + n + ' kelompok)';
  }

  function onSpin() {
    if (!attempt || attempt.phase !== 'throw' || spinning) return;
    var c = attempt.cands.slice(), n = c.length;
    if (n === 0) return;
    if (n === 1) { chooseTeam(c[0]); return; }
    spinning = true;
    updateSpinButton();
    var steps = 18 + Math.floor(Math.random() * n * 3);   // jumlah langkah acak (seragam mod n)
    var step = 0;
    var chips = {};
    Array.prototype.forEach.call($('throwList').children, function (el) { chips[el.dataset.team] = el; });
    (function run() {
      Object.keys(chips).forEach(function (k) { chips[k].classList.remove('spin'); });
      var idx = c[step % n];
      if (chips[idx]) chips[idx].classList.add('spin');
      playSound('tick');
      if (step >= steps) {
        spinning = false;
        setTimeout(function () { if (attempt && attempt.phase === 'throw') chooseTeam(idx); }, 900);
        return;
      }
      step++;
      setTimeout(run, 70 + step * 9);
    })();
  }

  function chooseTeam(i) {
    attempt.current = i;
    attempt.tried.push(i);
    attempt.lempar = true;
    attempt.selected = null;
    attempt.cands = [];
    attempt.phase = 'answering';
    persistAttempt();
    setAttemptChip();
    showPhase();
    startAttemptTimer();
  }

  function onNobody() {
    if (!attempt || attempt.phase !== 'throw' || spinning) return;
    resolveNobody('Tidak ada kelompok yang mau menjawab.');
  }

  function resolveNobody(msg) {
    state.done[attempt.tile] = { w: -1, pts: 0 };
    resolveQuestion(msg);
  }

  // Aturan 6: soal selesai -> guru membahas singkat
  function resolveQuestion(message) {
    attempt.phase = 'resolved';
    attempt.msg = message;
    state.turn = nextTurn(state.turn);
    persistAttempt();
    renderGame();
    setAttemptChip();
    showPhase();
    showResolved();
  }

  function showResolved() {
    var q = currentQ();
    Array.prototype.forEach.call($('qOptions').children, function (el, k) {
      el.classList.remove('selected');
      el.disabled = true;
      if (k === q.a) { el.classList.remove('wrong'); el.classList.add('correct'); }
      else if (!el.classList.contains('wrong')) el.classList.add('dim');
    });
    $('explain').innerHTML = '<strong>' + esc(attempt.msg) + '</strong><br>' +
      'Jawaban: <strong>' + LETTERS[q.a] + '</strong> — ' + esc(q.p);
    $('explain').hidden = false;
    $('nextBox').hidden = false;
    $('nextBox').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function afterModal() {
    if (state.timeUp || state.done.every(Boolean)) { setTimeout(finishGame, 300); return; }
    renderGame();
    startPick();
  }

  function closeModalUI() {
    stopAttemptTimer();
    spinning = false;
    $('modal').hidden = true;
    attempt = null;
    state.attempt = null;
    save();
  }

  function nextQuestion() {
    if (!attempt || attempt.phase !== 'resolved') return;
    closeModalUI();
    afterModal();
  }

  function requestClose() {
    if ($('modal').hidden || !attempt) return;
    if (attempt.phase === 'resolved') { nextQuestion(); return; }
    var touched = attempt.phase === 'throw' || attempt.wrong.length > 0 || attempt.tried.length > 1 || attempt.lempar;
    if (!touched) { closeModalUI(); afterModal(); return; }   // belum dijawab: kotak tetap bisa dipilih
    if (confirm('Soal ini sudah dijawab/dilempar. Tutup dan tandai terpakai tanpa poin?')) {
      state.done[attempt.tile] = { w: -1, pts: 0 };
      state.turn = nextTurn(state.turn);
      closeModalUI();
      afterModal();
    }
  }

  // ======================================================
  //  JAM PERMAINAN (satu ticker untuk semua timer)
  // ======================================================
  function tick() {
    var now = Date.now(), dt = now - lastTick;
    lastTick = now;
    if (!state || !onGameScreen() || paused || !$('rulesModal').hidden) return;

    if (state.gameMinutes > 0 && !state.timeUp) {
      state.gameLeft -= dt;
      if (state.gameLeft <= 0) { state.gameLeft = 0; gameTimeUp(); }
      renderClock();
      if (now - lastSave > 2000) { lastSave = now; save(); }
    }
    if (pick.active) {
      pick.left -= dt;
      renderPick();
      if (pick.left <= 0) { stopPick(); randomPick(true); }
    }
    if (att.active && attempt && attempt.phase === 'answering') {
      att.left -= dt;
      if (att.left <= 0) {
        // Waktu habis hanya jadi penanda; jawaban tetap bisa dikunci, guru yang memutuskan
        att.left = 0; att.active = false;
        renderAttemptTimer();
        $('timerWrap').classList.add('over');
        $('timerText').textContent = 'Waktu habis!';
        playSound('timeup');
      } else renderAttemptTimer();
    }
  }

  function gameTimeUp() {
    state.timeUp = true;
    playSound('timeup');
    save();
    if (attempt) { $('timeUpBanner').hidden = false; toast('⏰ Waktu permainan habis — selesaikan soal ini.'); }
    else { stopPick(); setTimeout(finishGame, 400); }
  }

  function setPaused(p) {
    paused = p;
    document.body.classList.toggle('paused', p);
    $('btnPause').textContent = p ? '▶ Lanjut' : '⏸ Jeda';
    $('btnPauseModal').textContent = p ? '▶' : '⏸';
    renderClock();
    if (p) { pick.active && renderPick(); }
    lastTick = Date.now();
  }

  // ======================================================
  //  HASIL AKHIR (aturan 8: poin tertinggi, seri -> nyawa terbanyak)
  // ======================================================
  function finishGame() {
    if (!state) return;
    stopPick(); stopAttemptTimer();
    setPaused(false);
    if (attempt) { $('modal').hidden = true; attempt = null; state.attempt = null; }

    var list = state.teams.map(function (t, i) { return { name: t.name, score: t.score, lives: t.lives, i: i }; });
    list.sort(function (a, b) { return b.score - a.score || b.lives - a.lives; });
    var rank = 0, pScore = null, pLives = null;
    list.forEach(function (t, idx) {
      if (t.score !== pScore || t.lives !== pLives) { rank = idx + 1; pScore = t.score; pLives = t.lives; }
      t.rank = rank;
    });

    var winners = list.filter(function (t) { return t.rank === 1; });
    var tieBreak = list.length > 1 && list[1].score === list[0].score && list[0].lives !== list[1].lives;
    if (list.length === 1) {
      $('resultTitle').textContent = '🎉 Permainan Selesai!';
      $('resultSub').textContent = 'Skor akhir ' + list[0].name + ': ' + list[0].score + ' poin';
    } else {
      $('resultTitle').textContent = winners.length > 1 ? '🏆 Juara Bersama!' : '🏆 Juara!';
      $('resultSub').textContent = winners.map(function (w) { return w.name; }).join(' & ') +
        ' dengan ' + winners[0].score + ' poin' + (tieBreak ? ' (menang berkat nyawa terbanyak)' : '');
    }

    var medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
    var ol = $('rankList');
    ol.innerHTML = '';
    list.forEach(function (t) {
      var li = document.createElement('li');
      li.className = 'rank-item' + (t.rank === 1 ? ' first' : '');
      li.style.setProperty('--c', COLORS[t.i]);
      li.innerHTML =
        '<span class="rank-medal">' + (medals[t.rank] || t.rank + '.') + '</span>' +
        '<span class="rank-name">' + EMOJI[t.i] + ' ' + esc(t.name) +
          ' <span class="rank-lives">' + hearts(t.lives) + '</span></span>' +
        '<span class="rank-score">' + t.score + '</span>';
      ol.appendChild(li);
    });

    clearSave();
    showScreen('result');
    confetti();
    playSound('finish');
  }

  function confetti() {
    for (var i = 0; i < 90; i++) {
      var c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = COLORS[i % COLORS.length];
      c.style.animationDuration = (2.5 + Math.random() * 3) + 's';
      c.style.animationDelay = (Math.random() * 1.2) + 's';
      document.body.appendChild(c);
      (function (el) { setTimeout(function () { el.remove(); }, 7000); })(c);
    }
  }

  // ======================================================
  //  INISIALISASI
  // ======================================================
  function init() {
    buildCountButtons();
    buildNameInputs();
    updateResumeButton();

    $('btnStart').addEventListener('click', startGame);
    $('btnResume').addEventListener('click', function () {
      var s = load();
      if (!s) { updateResumeButton(); return; }
      state = s; attempt = null; paused = false;
      enterGame();
    });

    $('scoreboard').addEventListener('click', onScoreboardClick);

    $('btnLock').addEventListener('click', lockAnswer);
    $('btnGiveUp').addEventListener('click', timeoutAnswer);
    $('btnSpin').addEventListener('click', onSpin);
    $('btnNobody').addEventListener('click', onNobody);
    $('btnNext').addEventListener('click', nextQuestion);
    $('btnClose').addEventListener('click', requestClose);

    $('btnRandom').addEventListener('click', function () { randomPick(false); });
    $('btnPause').addEventListener('click', function () { setPaused(!paused); });
    $('btnPauseModal').addEventListener('click', function () { setPaused(!paused); });

    function openRules() { $('rulesModal').hidden = false; }
    $('btnRules').addEventListener('click', openRules);
    $('btnRulesSetup').addEventListener('click', openRules);
    $('btnRulesClose').addEventListener('click', function () { $('rulesModal').hidden = true; lastTick = Date.now(); });

    $('btnFinish').addEventListener('click', function () {
      if (confirm('Akhiri permainan sekarang dan tampilkan hasil akhir?')) finishGame();
    });
    $('btnMenu').addEventListener('click', function () {
      if (confirm('Kembali ke menu? Permainan tetap tersimpan dan bisa dilanjutkan.')) {
        stopPick(); stopAttemptTimer();
        if (attempt) { $('modal').hidden = true; attempt = null; }   // state.attempt tetap tersimpan
        save();
        updateResumeButton();
        showScreen('setup');
      }
    });
    $('btnAgain').addEventListener('click', function () { updateResumeButton(); showScreen('setup'); });

    document.addEventListener('keydown', function (e) {
      if (!$('rulesModal').hidden) { if (e.key === 'Escape') $('rulesModal').hidden = true; return; }
      if ((e.key === 'p' || e.key === 'P') && onGameScreen() && e.target.tagName !== 'INPUT') { setPaused(!paused); return; }
      if ($('modal').hidden || !attempt) return;
      var t = e.target;
      var isOpt = t.classList && t.classList.contains('opt');
      var otherControl = (t.tagName === 'BUTTON' && !isOpt) || t.tagName === 'INPUT';
      if (e.key === 'Escape') { requestClose(); return; }
      if (attempt.phase === 'answering') {
        var k = LETTERS.indexOf(e.key.toUpperCase());
        if (e.key.length === 1 && k >= 0) selectOption(k);
        else if (e.key === 'Enter' && !otherControl) { e.preventDefault(); lockAnswer(); }
      } else if (attempt.phase === 'resolved' && e.key === 'Enter' && !otherControl) {
        e.preventDefault(); nextQuestion();
      }
    });

    setInterval(tick, 200);
  }

  init();
})();
