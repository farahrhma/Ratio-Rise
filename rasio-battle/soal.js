// 50 soal Bab Rasio - Kelas VII
// a = indeks jawaban benar (0=A, 1=B, 2=C, 3=D), p = pembahasan, pts = poin kategori soal (Mudah=10, Sedang=20, Sulit=30)
const SOAL = [
  {
    "id": 1,
    "q": "Rasio banyak pensil merah dan biru adalah 3 : 5. Jika pensil merah ada 12, berapa pensil biru?",
    "o": [
      "15",
      "18",
      "20",
      "24"
    ],
    "a": 2,
    "p": "3 bagian = 12, jadi 1 bagian = 4. Pensil biru = 5 × 4 = 20.",
    "pts": 20
  },
  {
    "id": 2,
    "q": "Rasio 8 buku terhadap 12 buku dapat disederhanakan menjadi ...",
    "o": [
      "2 : 3",
      "3 : 4",
      "4 : 5",
      "4 : 6"
    ],
    "a": 0,
    "p": "8 : 12 dibagi 4 menjadi 2 : 3.",
    "pts": 10
  },
  {
    "id": 3,
    "q": "Di kelas terdapat 14 murid laki-laki dan 21 murid perempuan. Rasio laki-laki terhadap seluruh murid adalah ...",
    "o": [
      "2 : 3",
      "2 : 5",
      "3 : 5",
      "3 : 7"
    ],
    "a": 1,
    "p": "Jumlah murid 35, sehingga 14 : 35 = 2 : 5.",
    "pts": 20
  },
  {
    "id": 4,
    "q": "Rasio 750 gram terhadap 1,5 kg dalam bentuk paling sederhana adalah ...",
    "o": [
      "1 : 2",
      "1 : 3",
      "2 : 3",
      "3 : 2"
    ],
    "a": 0,
    "p": "1,5 kg = 1.500 gram, sehingga 750 : 1.500 = 1 : 2.",
    "pts": 20
  },
  {
    "id": 5,
    "q": "Rasio 18 : 24 ekuivalen dengan ...",
    "o": [
      "2 : 3",
      "3 : 4",
      "4 : 5",
      "6 : 7"
    ],
    "a": 1,
    "p": "18 : 24 dibagi 6 menjadi 3 : 4.",
    "pts": 10
  },
  {
    "id": 6,
    "q": "Rasio 5 : 7 ekuivalen dengan rasio ...",
    "o": [
      "10 : 12",
      "15 : 21",
      "20 : 25",
      "25 : 28"
    ],
    "a": 1,
    "p": "Kedua suku dikalikan 3: 5 × 3 : 7 × 3 = 15 : 21.",
    "pts": 10
  },
  {
    "id": 7,
    "q": "Pasangan rasio berikut yang tidak ekuivalen dengan 4 : 6 adalah ...",
    "o": [
      "2 : 3",
      "8 : 12",
      "10 : 15",
      "6 : 8"
    ],
    "a": 3,
    "p": "4 : 6 = 2 : 3, sedangkan 6 : 8 = 3 : 4.",
    "pts": 20
  },
  {
    "id": 8,
    "q": "Jika a : b = 3 : 8 dan a = 18, nilai b adalah ...",
    "o": [
      "36",
      "42",
      "48",
      "54"
    ],
    "a": 2,
    "p": "3 bagian = 18, maka 1 bagian = 6 dan b = 8 × 6 = 48.",
    "pts": 20
  },
  {
    "id": 9,
    "q": "Rasio jumlah kelereng Rani dan Dito adalah 2 : 5. Jika jumlah kelereng mereka 28, kelereng Dito sebanyak ...",
    "o": [
      "8",
      "12",
      "16",
      "20"
    ],
    "a": 3,
    "p": "Total bagian 7, satu bagian 28 ÷ 7 = 4. Dito memiliki 5 × 4 = 20.",
    "pts": 20
  },
  {
    "id": 10,
    "q": "Rasio tepung dan gula untuk resep adalah 4 : 1. Jika tepung yang digunakan 600 gram, gula yang dibutuhkan adalah ...",
    "o": [
      "100 gram",
      "120 gram",
      "150 gram",
      "200 gram"
    ],
    "a": 2,
    "p": "600 ÷ 4 = 150 gram untuk satu bagian gula.",
    "pts": 10
  },
  {
    "id": 11,
    "q": "Rasio apel dan jeruk adalah 2 : 3. Jika jumlah seluruh buah 25, jumlah jeruk adalah ...",
    "o": [
      "10",
      "12",
      "15",
      "18"
    ],
    "a": 2,
    "p": "Total bagian 5, satu bagian 25 ÷ 5 = 5. Jeruk = 3 × 5 = 15.",
    "pts": 10
  },
  {
    "id": 12,
    "q": "Rasio umur kakak dan adik adalah 5 : 3. Jika jumlah umur mereka 32 tahun, umur kakak adalah ...",
    "o": [
      "12 tahun",
      "16 tahun",
      "20 tahun",
      "24 tahun"
    ],
    "a": 2,
    "p": "Total bagian 8, satu bagian 4. Umur kakak = 5 × 4 = 20 tahun.",
    "pts": 20
  },
  {
    "id": 13,
    "q": "Perbandingan uang Sinta dan Riko adalah 3 : 4. Jika selisih uang mereka Rp8.000, uang Riko adalah ...",
    "o": [
      "Rp24.000",
      "Rp28.000",
      "Rp32.000",
      "Rp36.000"
    ],
    "a": 2,
    "p": "Selisih 1 bagian = Rp8.000. Uang Riko = 4 × Rp8.000 = Rp32.000.",
    "pts": 20
  },
  {
    "id": 14,
    "q": "Rasio banyak kucing dan kelinci adalah 7 : 4. Jika jumlah kucing 21 ekor, selisih jumlah kucing dan kelinci adalah ...",
    "o": [
      "3 ekor",
      "6 ekor",
      "9 ekor",
      "12 ekor"
    ],
    "a": 2,
    "p": "Satu bagian = 21 ÷ 7 = 3. Kelinci = 4 × 3 = 12, selisih = 21 − 12 = 9.",
    "pts": 20
  },
  {
    "id": 15,
    "q": "Rasio siswa yang mengikuti klub musik dan olahraga adalah 5 : 8. Jika selisihnya 12 siswa, jumlah seluruh siswa dalam kedua klub adalah ...",
    "o": [
      "36 siswa",
      "44 siswa",
      "48 siswa",
      "52 siswa"
    ],
    "a": 3,
    "p": "Selisih 3 bagian = 12, satu bagian = 4. Total 13 bagian = 52.",
    "pts": 30
  },
  {
    "id": 16,
    "q": "Perbandingan panjang pita merah dan kuning adalah 9 : 5. Jika pita merah 28 cm lebih panjang, panjang pita kuning adalah ...",
    "o": [
      "28 cm",
      "32 cm",
      "35 cm",
      "63 cm"
    ],
    "a": 2,
    "p": "Selisih 4 bagian = 28, satu bagian = 7. Pita kuning = 5 × 7 = 35 cm.",
    "pts": 20
  },
  {
    "id": 17,
    "q": "Rasio umur ibu dan anak adalah 6 : 1. Jika selisih umur mereka 30 tahun, jumlah umur mereka adalah ...",
    "o": [
      "36 tahun",
      "40 tahun",
      "42 tahun",
      "48 tahun"
    ],
    "a": 2,
    "p": "Selisih 5 bagian = 30, satu bagian = 6. Jumlah umur = 7 × 6 = 42 tahun.",
    "pts": 30
  },
  {
    "id": 18,
    "q": "Rasio harga buku dan pensil adalah 5 : 2. Jika selisih harganya Rp9.000, harga buku adalah ...",
    "o": [
      "Rp6.000",
      "Rp12.000",
      "Rp15.000",
      "Rp18.000"
    ],
    "a": 2,
    "p": "Selisih 3 bagian = Rp9.000, satu bagian Rp3.000. Harga buku = 5 × Rp3.000 = Rp15.000.",
    "pts": 20
  },
  {
    "id": 19,
    "q": "Umur Tia 12 tahun. Umur kakaknya dua kali umur Tia. Umur ibu tiga kali umur kakaknya. Umur ibu adalah ...",
    "o": [
      "36 tahun",
      "48 tahun",
      "60 tahun",
      "72 tahun"
    ],
    "a": 3,
    "p": "Kakak = 2 × 12 = 24 tahun. Ibu = 3 × 24 = 72 tahun.",
    "pts": 10
  },
  {
    "id": 20,
    "q": "Uang Damar dua kali uang Raka. Uang Nisa tiga kali uang Damar. Jika uang Raka Rp5.000, uang Nisa adalah ...",
    "o": [
      "Rp10.000",
      "Rp15.000",
      "Rp20.000",
      "Rp30.000"
    ],
    "a": 3,
    "p": "Uang Damar = 2 × Rp5.000 = Rp10.000. Uang Nisa = 3 × Rp10.000 = Rp30.000.",
    "pts": 20
  },
  {
    "id": 21,
    "q": "Panjang tali A tiga kali panjang tali B. Jika tali B 7 cm, jumlah panjang kedua tali adalah ...",
    "o": [
      "21 cm",
      "24 cm",
      "28 cm",
      "30 cm"
    ],
    "a": 2,
    "p": "Tali A = 3 × 7 = 21 cm. Jumlah = 21 + 7 = 28 cm.",
    "pts": 10
  },
  {
    "id": 22,
    "q": "Jumlah kelereng Ali empat kali jumlah kelereng Bima. Jika Bima memiliki 9 kelereng, selisih kelereng mereka adalah ...",
    "o": [
      "18",
      "27",
      "36",
      "45"
    ],
    "a": 1,
    "p": "Ali = 4 × 9 = 36. Selisih = 36 − 9 = 27.",
    "pts": 10
  },
  {
    "id": 23,
    "q": "Umur ayah lima kali umur anak. Jika umur anak 8 tahun, jumlah umur mereka adalah ...",
    "o": [
      "40 tahun",
      "42 tahun",
      "45 tahun",
      "48 tahun"
    ],
    "a": 3,
    "p": "Umur ayah = 5 × 8 = 40 tahun. Jumlah = 40 + 8 = 48 tahun.",
    "pts": 10
  },
  {
    "id": 24,
    "q": "Pada peta, jarak dua kota 4 cm. Jika skala peta 1 : 250.000, jarak sebenarnya adalah ...",
    "o": [
      "1 km",
      "2,5 km",
      "10 km",
      "100 km"
    ],
    "a": 2,
    "p": "Jarak sebenarnya = 4 × 250.000 cm = 1.000.000 cm = 10 km.",
    "pts": 20
  },
  {
    "id": 25,
    "q": "Jarak sebenarnya dua tempat adalah 15 km. Pada peta berskala 1 : 300.000, jarak pada peta adalah ...",
    "o": [
      "3 cm",
      "5 cm",
      "10 cm",
      "15 cm"
    ],
    "a": 1,
    "p": "15 km = 1.500.000 cm. Jarak peta = 1.500.000 ÷ 300.000 = 5 cm.",
    "pts": 20
  },
  {
    "id": 26,
    "q": "Jarak pada peta 6 cm mewakili jarak sebenarnya 24 km. Skala peta tersebut adalah ...",
    "o": [
      "1 : 40.000",
      "1 : 240.000",
      "1 : 400.000",
      "1 : 4.000.000"
    ],
    "a": 2,
    "p": "24 km = 2.400.000 cm. Skala = 6 : 2.400.000 = 1 : 400.000.",
    "pts": 30
  },
  {
    "id": 27,
    "q": "Sebuah denah menggunakan skala 1 : 100. Panjang ruang pada denah 8 cm. Panjang ruang sebenarnya adalah ...",
    "o": [
      "0,8 m",
      "4 m",
      "8 m",
      "80 m"
    ],
    "a": 2,
    "p": "8 × 100 = 800 cm = 8 m.",
    "pts": 10
  },
  {
    "id": 28,
    "q": "Jarak sebenarnya 2 km digambarkan sepanjang 5 cm pada peta. Skala peta adalah ...",
    "o": [
      "1 : 4.000",
      "1 : 20.000",
      "1 : 40.000",
      "1 : 400.000"
    ],
    "a": 2,
    "p": "2 km = 200.000 cm. Skala 5 : 200.000 = 1 : 40.000.",
    "pts": 30
  },
  {
    "id": 29,
    "q": "Foto berukuran 4 cm × 6 cm diperbesar dengan faktor skala 2. Ukuran foto baru adalah ...",
    "o": [
      "6 cm × 8 cm",
      "8 cm × 12 cm",
      "8 cm × 10 cm",
      "12 cm × 16 cm"
    ],
    "a": 1,
    "p": "Setiap ukuran dikalikan 2: 4 × 2 = 8 cm dan 6 × 2 = 12 cm.",
    "pts": 10
  },
  {
    "id": 30,
    "q": "Sebuah gambar panjangnya 15 cm diperkecil menjadi 5 cm. Faktor skalanya adalah ...",
    "o": [
      "1/5",
      "1/3",
      "3",
      "5"
    ],
    "a": 1,
    "p": "Faktor skala = ukuran baru ÷ ukuran awal = 5 ÷ 15 = 1/3.",
    "pts": 20
  },
  {
    "id": 31,
    "q": "Sebuah persegi sisi 7 cm diperbesar dengan faktor skala 3. Panjang sisi baru adalah ...",
    "o": [
      "10 cm",
      "14 cm",
      "21 cm",
      "28 cm"
    ],
    "a": 2,
    "p": "Sisi baru = 7 × 3 = 21 cm.",
    "pts": 10
  },
  {
    "id": 32,
    "q": "Panjang sebuah model 12 cm dan panjang benda sebenarnya 3 m. Faktor skala model terhadap benda sebenarnya adalah ...",
    "o": [
      "1 : 4",
      "1 : 12",
      "1 : 25",
      "1 : 30"
    ],
    "a": 2,
    "p": "3 m = 300 cm. Skala = 12 : 300 = 1 : 25.",
    "pts": 20
  },
  {
    "id": 33,
    "q": "Rasio 6 : 9 dan 10 : 15 merupakan rasio ekuivalen karena ...",
    "o": [
      "jumlah sukunya sama",
      "keduanya menyederhana menjadi 2 : 3",
      "selisih sukunya sama",
      "semua bilangannya genap"
    ],
    "a": 1,
    "p": "6 : 9 = 2 : 3 dan 10 : 15 = 2 : 3.",
    "pts": 10
  },
  {
    "id": 34,
    "q": "Nilai x agar 4 : 7 = x : 21 adalah ...",
    "o": [
      "8",
      "10",
      "12",
      "14"
    ],
    "a": 2,
    "p": "7 menjadi 21 dikali 3, maka 4 juga dikali 3 sehingga x = 12.",
    "pts": 20
  },
  {
    "id": 35,
    "q": "Pasangan bilangan yang membentuk proporsi dengan 3 : 5 adalah ...",
    "o": [
      "6 : 8",
      "8 : 10",
      "9 : 15",
      "12 : 25"
    ],
    "a": 2,
    "p": "9 : 15 disederhanakan dengan membagi 3 menjadi 3 : 5.",
    "pts": 10
  },
  {
    "id": 36,
    "q": "Jika 7/9 = 21/x, nilai x adalah ...",
    "o": [
      "18",
      "21",
      "24",
      "27"
    ],
    "a": 3,
    "p": "7 menjadi 21 dikali 3, sehingga 9 juga dikali 3: x = 27.",
    "pts": 20
  },
  {
    "id": 37,
    "q": "Perbandingan jumlah air dan sirup adalah 5 : 2. Jika digunakan 20 gelas air, sirup yang diperlukan adalah ... gelas.",
    "o": [
      "4",
      "6",
      "8",
      "10"
    ],
    "a": 2,
    "p": "20 ÷ 5 = 4, sehingga sirup = 2 × 4 = 8 gelas.",
    "pts": 10
  },
  {
    "id": 38,
    "q": "Harga 3 buku tulis adalah Rp18.000. Jika harga setiap buku sama, harga 5 buku adalah ...",
    "o": [
      "Rp24.000",
      "Rp27.000",
      "Rp30.000",
      "Rp36.000"
    ],
    "a": 2,
    "p": "Harga satu buku Rp18.000 ÷ 3 = Rp6.000. Lima buku = Rp30.000.",
    "pts": 10
  },
  {
    "id": 39,
    "q": "Sebuah mesin menghasilkan 120 botol dalam 4 menit. Dengan kecepatan tetap, botol yang dihasilkan dalam 7 menit adalah ...",
    "o": [
      "180 botol",
      "200 botol",
      "210 botol",
      "240 botol"
    ],
    "a": 2,
    "p": "Laju = 120 ÷ 4 = 30 botol per menit. Dalam 7 menit: 30 × 7 = 210.",
    "pts": 20
  },
  {
    "id": 40,
    "q": "Untuk membuat 6 potong kue diperlukan 18 ons gula. Gula yang diperlukan untuk 9 potong kue adalah ...",
    "o": [
      "24 ons",
      "27 ons",
      "30 ons",
      "36 ons"
    ],
    "a": 1,
    "p": "Faktor pengali 9 ÷ 6 = 1,5. Gula = 18 × 1,5 = 27 ons.",
    "pts": 10
  },
  {
    "id": 41,
    "q": "Sebuah mobil menempuh 44 km dengan 8 liter bensin. Jika konsumsi tetap, bensin untuk menempuh 165 km adalah ...",
    "o": [
      "24 liter",
      "28 liter",
      "30 liter",
      "32 liter"
    ],
    "a": 2,
    "p": "Bensin per km = 8/44 liter. Untuk 165 km: 165 × 8/44 = 30 liter.",
    "pts": 30
  },
  {
    "id": 42,
    "q": "Enam pekerja menyelesaikan pekerjaan dalam 12 hari. Jika kemampuan setiap pekerja sama, 8 pekerja menyelesaikannya dalam ... hari.",
    "o": [
      "6 hari",
      "8 hari",
      "9 hari",
      "16 hari"
    ],
    "a": 2,
    "p": "Pekerja × hari tetap: 6 × 12 = 72. Waktu = 72 ÷ 8 = 9 hari.",
    "pts": 20
  },
  {
    "id": 43,
    "q": "Sebuah proyek selesai dalam 50 hari oleh 100 pekerja. Agar selesai dalam 40 hari, jumlah pekerja yang diperlukan adalah ...",
    "o": [
      "80 pekerja",
      "100 pekerja",
      "120 pekerja",
      "125 pekerja"
    ],
    "a": 3,
    "p": "100 × 50 = 5.000 hari-orang. Pekerja = 5.000 ÷ 40 = 125.",
    "pts": 30
  },
  {
    "id": 44,
    "q": "Empat keran identik mengisi bak dalam 6 jam. Jika digunakan 3 keran, waktu yang diperlukan adalah ...",
    "o": [
      "4 jam",
      "6 jam",
      "8 jam",
      "10 jam"
    ],
    "a": 2,
    "p": "Keran × waktu tetap: 4 × 6 = 24. Waktu dengan 3 keran = 24 ÷ 3 = 8 jam.",
    "pts": 20
  },
  {
    "id": 45,
    "q": "Sebuah perjalanan ditempuh dalam 6 jam dengan kecepatan 60 km/jam. Jika kecepatan menjadi 90 km/jam untuk jarak yang sama, waktu tempuhnya ...",
    "o": [
      "3 jam",
      "4 jam",
      "5 jam",
      "9 jam"
    ],
    "a": 1,
    "p": "Jarak = 60 × 6 = 360 km. Waktu baru = 360 ÷ 90 = 4 jam.",
    "pts": 20
  },
  {
    "id": 46,
    "q": "Sebuah kendaraan menempuh 360 km dalam 6 jam. Jika kecepatannya menjadi dua kali semula untuk jarak yang sama, waktu tempuhnya adalah ...",
    "o": [
      "2 jam",
      "3 jam",
      "4 jam",
      "12 jam"
    ],
    "a": 1,
    "p": "Kecepatan dua kali lipat membuat waktu menjadi setengahnya: 6 ÷ 2 = 3 jam.",
    "pts": 10
  },
  {
    "id": 47,
    "q": "Jarak 150 km ditempuh dengan kecepatan 50 km/jam. Laju perubahan jarak terhadap waktu tersebut adalah ...",
    "o": [
      "3 km/jam",
      "50 km/jam",
      "100 km/jam",
      "150 km/jam"
    ],
    "a": 1,
    "p": "Laju = jarak ÷ waktu. Waktu = 150 ÷ 50 = 3 jam, sehingga lajunya 50 km/jam.",
    "pts": 10
  },
  {
    "id": 48,
    "q": "Sebuah keran mengalirkan 24 liter air dalam 3 menit. Laju aliran airnya adalah ...",
    "o": [
      "6 liter/menit",
      "8 liter/menit",
      "12 liter/menit",
      "72 liter/menit"
    ],
    "a": 1,
    "p": "Laju = 24 ÷ 3 = 8 liter per menit.",
    "pts": 10
  },
  {
    "id": 49,
    "q": "Sebuah sepeda menempuh 18 km dalam 45 menit. Kecepatan rata-ratanya dalam km/jam adalah ...",
    "o": [
      "18 km/jam",
      "20 km/jam",
      "24 km/jam",
      "27 km/jam"
    ],
    "a": 2,
    "p": "45 menit = 0,75 jam. Kecepatan = 18 ÷ 0,75 = 24 km/jam.",
    "pts": 30
  },
  {
    "id": 50,
    "q": "Sebuah printer mencetak 90 halaman dalam 5 menit. Dengan laju tetap, waktu untuk mencetak 270 halaman adalah ...",
    "o": [
      "10 menit",
      "12 menit",
      "15 menit",
      "18 menit"
    ],
    "a": 2,
    "p": "Laju = 90 ÷ 5 = 18 halaman/menit. Waktu = 270 ÷ 18 = 15 menit.",
    "pts": 20
  }
];
