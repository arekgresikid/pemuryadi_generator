export interface TKASubKompetensi {
  subkompetensi: string;
  materiDefault?: string;
  ringkasan: string;
}

export interface TKACompetencyGroup {
  kompetensi: string;
  deskripsi: string;
  subkompetensiList: TKASubKompetensi[];
}

export interface TKANumerasiItem {
  elemen: string;
  subElemen: string;
  kompetensi: string;
  cakupan: string[];
  catatan?: string;
}

export interface TKACognitiveProcess {
  level: string;
  namaLevel: string;
  prosesBerpikir: {
    nama: string;
    deskripsi: string;
  }[];
}

// ==========================================
// 1. JENJANG SD / MI / SEDERAJAT
// ==========================================

export const TKA_SD_LITERASI_CONFIG = {
  nama: 'TKA Literasi (Bahasa Indonesia SD/MI)',
  jenjang: 'sd',
  jenisTeks: [
    {
      tipe: 'Teks Informasi',
      deskripsi: 'Teks yang berisi fakta sederhana dari berbagai bidang atau topik serta berskala lokal dan nasional.'
    },
    {
      tipe: 'Teks Fiksi',
      deskripsi: 'Cerita rekaan berupa fantasi atau faktual (sejarah/biografi) dengan latar cerita konkret, tokoh berkarakter datar, konflik tunggal dengan penyelesaian tertutup, alur maju, dan sudut pandang orang pertama.'
    }
  ],
  karakteristik: {
    kosakata: 'Kata dasar, kata berimbuhan, kata konkret, dominan makna denotatif, makna konotatif konteks terbatas.',
    kalimat: 'Jumlah kata 3–7 per kalimat, pola kalimat dasar SPOK, struktur bahasa tulis bercampur bahasa lisan terbatas.',
    wacana: 'Kohesi pengacuan/referensi, konjungsi antarparagraf penambahan/penjelasan; panjang teks 150–200 kata (kecuali teks puisi).'
  },
  kompetensiMembaca: [
    'Mengidentifikasi informasi tersurat dalam teks.',
    'Menyusun ulang, mengelompokkan, membuat ikhtisar, dan menyajikan kembali informasi tersurat dalam teks.',
    'Mengidentifikasi dan menyimpulkan informasi tersirat dalam teks.',
    'Menilai gagasan, fakta, atau opini dalam teks.',
    'Menanggapi isi teks, merefleksi diri dengan tokoh atau kejadian, dan menanggapi bahasa penulis dalam teks.'
  ],
  matriksAsesmen: [
    {
      kompetensi: 'Pemahaman Tekstual',
      deskripsi: 'Kemampuan memahami informasi eksplisit, menyusun kerangka ikhtisar/bagan, menemukan informasi tersurat, dan mengidentifikasi objek kosakata.',
      subkompetensiList: [
        {
          ringkasan: 'Ikhtisar & Bagan Informasi',
          subkompetensi: 'Menyusun kembali informasi dari teks dalam bentuk ikhtisar/bagan (menentukan bagian kerangka isi/informasi dalam teks).',
          materiDefault: 'Penyusunan Kerangka Ikhtisar dan Bagan Informasi Teks'
        },
        {
          ringkasan: 'Informasi Tersurat',
          subkompetensi: 'Mengidentifikasi dan menentukan informasi tersurat dalam teks fiksi maupun nonfiksi.',
          materiDefault: 'Identifikasi Informasi Tersurat Teks'
        },
        {
          ringkasan: 'Objek Berdasarkan Kosakata',
          subkompetensi: 'Mengidentifikasi objek berdasarkan kosakata yang digunakan dalam teks fiksi atau nonfiksi.',
          materiDefault: 'Penentuan Kosakata Sesuai Objek Teks'
        }
      ]
    },
    {
      kompetensi: 'Pemahaman Inferensial',
      deskripsi: 'Kemampuan menarik kesimpulan makna ungkapan/idiom/peribahasa, ide pokok, unsur intrinsik, serta perubahan karakter/latar yang tersirat.',
      subkompetensiList: [
        {
          ringkasan: 'Makna Ungkapan & Peribahasa',
          subkompetensi: 'Menjelaskan makna ungkapan, idiom, atau peribahasa sederhana yang digunakan dalam teks.',
          materiDefault: 'Makna Ungkapan, Idiom, dan Peribahasa Kontekstual'
        },
        {
          ringkasan: 'Ide Pokok, Nilai & Unsur Intrinsik',
          subkompetensi: 'Menyimpulkan ide pokok, gagasan pendukung, amanat, nilai-nilai, substansi isi, serta perasaan dan sifat tokoh dalam teks.',
          materiDefault: 'Simpulan Ide Pokok, Nilai-nilai, dan Unsur Intrinsik Cerita'
        },
        {
          ringkasan: 'Perubahan Karakter & Latar',
          subkompetensi: 'Menyimpulkan perubahan sederhana pada objek, watak/karakter tokoh, dan/atau latar dalam teks fiksi atau nonfiksi.',
          materiDefault: 'Analisis Perubahan Karakter Tokoh dan Latar Cerita'
        }
      ]
    },
    {
      kompetensi: 'Evaluasi dan Apresiasi',
      deskripsi: 'Kemampuan menilai kesesuaian antarunsur teks, merefleksikan peristiwa ke kehidupan sehari-hari, dan menyimpulkan respons emosional.',
      subkompetensiList: [
        {
          ringkasan: 'Kesesuaian Antarunsur Teks',
          subkompetensi: 'Menilai kesesuaian antarunsur dan antarinformasi dalam teks (kesesuaian judul dengan isi teks, kesesuaian ilustrasi gambar dengan teks).',
          materiDefault: 'Penilaian Kesesuaian Judul, Ilustrasi, dan Isi Teks'
        },
        {
          ringkasan: 'Refleksi Kehidupan Nyata & Keteladanan',
          subkompetensi: 'Menilai relevansi peristiwa dalam teks dengan kehidupan sehari-hari serta merefleksikan pengetahuan baru dan nilai keteladanan.',
          materiDefault: 'Refleksi Peristiwa dan Nilai Keteladanan Teks pada Kehidupan Nyata'
        },
        {
          ringkasan: 'Respons Emosional Teks Fiksi',
          subkompetensi: 'Menyimpulkan respons emosional terhadap peristiwa atau konflik yang dialami tokoh dalam teks fiksi.',
          materiDefault: 'Apresiasi dan Respons Emosional terhadap Konflik Tokoh'
        }
      ]
    }
  ],
  promptRules: `STANDAR DAN KAIDAH KHUSUS TKA LITERASI (SD/MI):
- TIGA HIRARKI RESMI:
  1. Pemahaman Tekstual: Informasi tersurat eksplisit, kerangka ikhtisar/bagan, dan kosakata objek fiksi/nonfiksi.
  2. Pemahaman Inferensial: Makna ungkapan/idiom/peribahasa sederhana, simpulan ide pokok, amanat, nilai keteladanan, unsur intrinsik, serta perubahan watak/karakter tokoh dan latar cerita.
  3. Evaluasi dan Apresiasi: Kesesuaian judul vs isi teks, ilustrasi gambar vs teks, refleksi peristiwa ke kehidupan nyata, serta respons emosional terhadap konflik tokoh.
- KARAKTERISTIK TEKS & STIMULUS:
  * Wacana Teks Informasi faktual atau Teks Fiksi (150–200 kata) dengan struktur kalimat 3–7 kata per kalimat yang ramah dicerna siswa SD.
  * Kluster Berbasis Stimulus (65%–75%): Wajib menaungi kelompok soal dengan ragam format (Pilihan Ganda, Pilihan Ganda Kompleks, Pernyataan Benar/Salah, dan Menjodohkan).
  * Soal Standalone / Mandiri (25%–35%): Soal mandiri to-the-point tanpa wacana panjang untuk materi konsep langsung (seperti makna ungkapan/idiom/peribahasa atau kosakata objek).
- BENTUK SOAL LENGKAP:
  Wajib mengintegrasikan 4 format resmi: Pilihan Ganda (A–D), Pilihan Ganda Kompleks (centang ganda), Pernyataan Benar/Salah (tabel), dan Menjodohkan.
- LARANGAN KERAS:
  DILARANG KERAS memunculkan nomor kurung indeks (seperti (1), (2), (25), dst.) pada teks soal, stimulus, maupun indikator.`
};

export const TKA_SD_NUMERASI_CONFIG = {
  nama: 'TKA Numerasi (Matematika SD/MI)',
  jenjang: 'sd',
  elemen: ['Bilangan', 'Geometri dan Pengukuran', 'Data dan Ketidakpastian'],
  kemampuanMatematis: [
    'Pengetahuan matematika',
    'Representasi matematis',
    'Penalaran',
    'Pemecahan masalah matematis',
    'Koneksi matematis'
  ],
  konteks: 'Permasalahan dalam konteks matematika dan konteks keseharian (personal, keluarga, atau lingkungan sekitar).',
  matriksAsesmen: [
    {
      elemen: 'Bilangan',
      subElemen: 'Bilangan Rasional',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Bilangan Rasional.',
      cakupan: [
        'Pecahan senilai menggunakan gambar dan simbol matematika (menentukan representasi pecahan dari bagian suatu objek utuh)',
        'Membandingkan dan mengurutkan beberapa bilangan dalam bentuk berbeda (bilangan cacah, pecahan, desimal, dan persentase)',
        'Menentukan faktor suatu bilangan cacah dan mengenal bilangan prima',
        'Menggunakan operasi aritmetika penjumlahan, pengurangan, perkalian, pembagian dua bilangan cacah (maksimal empat angka) dan estimasi hasil operasi',
        'Memodelkan masalah kontekstual ke dalam bentuk kalimat matematika yang melibatkan bilangan cacah',
        'Mengevaluasi kebenaran hasil operasi aritmetika bilangan cacah pada diagram alir',
        'Menentukan hasil operasi hitung campuran yang melibatkan pecahan dan bilangan asli (penjumlahan, pengurangan, perkalian, dan pembagian)',
        'Menyelesaikan persamaan sederhana menggunakan operasi penjumlahan atau pengurangan dalam bentuk sederhana',
        'Menyelesaikan dan mengevaluasi persamaan sederhana menggunakan berbagai bentuk operasi bilangan (penjumlahan, pengurangan, perkalian, dan pembagian)',
        'Menentukan KPK dan FPB dari informasi kontekstual'
      ],
      catatan: 'Fokus pada representasi pecahan, operasi 4 angka, diagram alir aritmetika, persamaan dasar, dan KPK/FPB.'
    },
    {
      elemen: 'Geometri dan Pengukuran',
      subElemen: 'Objek Geometri',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Objek Geometri.',
      cakupan: [
        'Membedakan ciri-ciri berbagai jenis bangun datar',
        'Mengidentifikasi berbagai bangun datar penyusun suatu bangun segi banyak',
        'Menyelesaikan masalah terkait konstruksi bangun ruang dan visualisasi spasial (bagian depan, atas, dan samping)',
        'Mengidentifikasi bentuk gambar benda berdasarkan ciri-ciri dari segiempat, segitiga, segibanyak, dan lingkaran'
      ],
      catatan: 'Fokus pada ciri bangun datar, dekomposisi segi banyak, visualisasi spasial proyeksi depan/atas/samping, dan bangun ruang.'
    },
    {
      elemen: 'Geometri dan Pengukuran',
      subElemen: 'Pengukuran',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Pengukuran.',
      cakupan: [
        'Mengidentifikasi kelogisan penggunaan satuan baku panjang dalam masalah pengukuran',
        'Menentukan representasi visual dari volume benda menggunakan satuan baku',
        'Menentukan representasi kesetimbangan neraca berdasarkan perbandingan berat benda menggunakan satuan baku',
        'Menentukan durasi suatu aktivitas berdasarkan keterangan waktu pada jam analog',
        'Menghitung keliling bangun datar segi banyak tidak beraturan yang diketahui panjang semua sisinya',
        'Menentukan luas bangun datar segi banyak yang terbentuk dari gabungan beberapa segitiga',
        'Menggunakan konsep keliling atau luas persegi dan persegi panjang dalam menyelesaikan permasalahan',
        'Menganalisis dan mengevaluasi pernyataan berdasarkan konsep pengukuran panjang dan berat benda menggunakan satuan baku',
        'Menentukan besar sudut yang terbentuk dari ilustrasi masalah kontekstual berdasarkan jenis sudutnya'
      ],
      catatan: 'Meliputi satuan baku panjang/berat/volume, representasi neraca, jam analog, keliling/luas bangun gabungan, dan sudut.'
    },
    {
      elemen: 'Data dan Ketidakpastian',
      subElemen: 'Penyajian dan Penggunaan Data',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Penyajian dan Penggunaan Data.',
      cakupan: [
        'Mengidentifikasi kesalahan penyajian data dalam bentuk diagram batang',
        'Menginterpretasi informasi diagram atau tabel frekuensi untuk menyelesaikan permasalahan yang disajikan',
        'Menginterpretasi data berdasarkan kategori tertentu',
        'Menyelesaikan permasalahan berkaitan dengan penyajian data dalam bentuk diagram batang atau tabel'
      ],
      catatan: 'Membaca, mendeteksi kekeliruan diagram batang, menafsirkan, dan menganalisis penyajian data tabel/grafik.'
    }
  ],
  promptRules: `STANDAR DAN KAIDAH KHUSUS TKA NUMERASI (SD/MI):
- TIGA ELEMEN DAN SUB-ELEMEN RESMI:
  1. Bilangan (Sub-elemen: Bilangan Rasional - pecahan senilai, urutan bilangan pecahan/desimal/persen, faktor & prima, operasi 4 angka, kalimat matematika, evaluasi diagram alir, hitung campuran pecahan, persamaan sederhana, KPK & FPB).
  2. Geometri dan Pengukuran:
     - Objek Geometri (ciri bangun datar, dekomposisi segi banyak, konstruksi ruang & visualisasi spasial tampak depan/atas/samping, ciri segiempat/segitiga/segibanyak/lingkaran).
     - Pengukuran (satuan baku panjang & berat, representasi neraca kesetimbangan, visualisasi volume, durasi jam analog, keliling segi banyak tidak beraturan, luas gabungan segitiga, persegi & persegi panjang, besar sudut).
  3. Data dan Ketidakpastian (Sub-elemen: Penyajian dan Penggunaan Data - deteksi kesalahan diagram batang, interpretasi tabel frekuensi & grafik batang, pemecahan masalah data).
- DISTRIBUSI SOAL (STIMULUS VS STANDALONE):
  * Kluster Soal Berbasis Stimulus (65%–75%): Sajikan infografis kontekstual, tabel angka otentik, skema neraca, diagram alir, atau denah yang menaungi 2 s.d. 4 butir soal berjenjang.
  * Soal Standalone / Mandiri (25%–35%): Soal mandiri to-the-point tanpa wacana panjang untuk materi konsep langsung (misal: persamaan sederhana langsung, hitung pecahan campuran, KPK/FPB, atau durasi jam analog).
- BENTUK SOAL LENGKAP:
  Wajib mengintegrasikan 4 format resmi TKA: Pilihan Ganda (A–D), Pilihan Ganda Kompleks (centang ganda), Pernyataan Benar/Salah (tabel), dan Menjodohkan.
- LARANGAN KERAS:
  DILARANG KERAS memunculkan nomor kurung indeks (seperti (1), (2), (13), dst.) pada kalimat soal, stimulus, maupun indikator.`
};


// ==========================================
// 2. JENJANG SMP / MTS / SEDERAJAT
// ==========================================

export const TKA_SMP_LITERASI_CONFIG = {
  nama: 'TKA Literasi (Bahasa Indonesia SMP/MTs)',
  jenjang: 'smp',
  jenisTeks: [
    {
      tipe: 'Teks Informasi',
      deskripsi: 'Teks yang berisi fakta, konsep, atau prosedur dari berbagai bidang atau topik yang berskala lokal, nasional, atau global. Teks informasi dapat berupa teks tunggal maupun teks jamak.'
    },
    {
      tipe: 'Teks Fiksi',
      deskripsi: 'Cerita rekaan yang dapat bersifat faktual (sejarah/biografi) atau realisme dengan latar cerita konkret atau abstrak, tokoh berkarakter bulat, konflik tunggal atau jamak dengan penyelesaian tertutup, alur campuran, dan sudut pandang orang ketiga.'
    }
  ],
  karakteristik: {
    kosakata: 'Kata umum, kata berimbuhan/konfiks, kata abstrak, makna denotatif, istilah teknis, makna konotatif konteks tertentu.',
    kalimat: 'Jumlah kata per kalimat 5–9 kata, kalimat tunggal berbagai pola, kalimat majemuk setara.',
    wacana: 'Kohesi penyulihan/substitusi, konjungsi antarparagraf perbandingan dan penekanan/intensifikasi, penggunaan tanda baca untuk mendukung deskripsi; panjang teks 200–250 kata (kecuali teks puisi).'
  },
  kompetensiMembaca: [
    'Mengidentifikasi informasi tersurat dalam teks.',
    'Menyusun ulang, mengelompokkan, membuat ikhtisar, dan menyajikan kembali informasi tersurat dalam teks.',
    'Mengidentifikasi dan menyimpulkan informasi tersirat dalam teks.',
    'Menilai gagasan, fakta, atau opini dalam teks.',
    'Menanggapi isi teks, merefleksi diri dengan tokoh atau kejadian, dan menanggapi bahasa penulis dalam teks.'
  ],
  matriksAsesmen: [
    {
      kompetensi: 'Pemahaman Tekstual',
      deskripsi: 'Kemampuan untuk memahami informasi yang dikemukakan secara eksplisit, mengelompokkan, menyusun ulang, dan menyajikan kembali informasi secara eksplisit dari teks.',
      subkompetensiList: [
        {
          ringkasan: 'Penggunaan Istilah Berbagai Bidang',
          subkompetensi: 'Mengidentifikasi penggunaan istilah dalam berbagai bidang.',
          materiDefault: 'Identifikasi Istilah Teknis dalam Teks'
        },
        {
          ringkasan: 'Objek & Latar Teks',
          subkompetensi: 'Mengidentifikasi objek dan/atau latar berdasarkan kosakata yang digunakan dalam teks fiksi atau nonfiksi.',
          materiDefault: 'Identifikasi Objek dan Latar Berdasarkan Kosakata'
        },
        {
          ringkasan: 'Informasi Penting Tersurat',
          subkompetensi: 'Mengidentifikasi informasi penting yang tersurat dalam teks.',
          materiDefault: 'Informasi Penting Tersurat'
        },
        {
          ringkasan: 'Kerangka & Bagan Teks',
          subkompetensi: 'Menyusun kerangka atau bagan berdasarkan bagian-bagian penting dalam teks.',
          materiDefault: 'Penyusunan Kerangka atau Bagan Informasi Teks'
        }
      ]
    },
    {
      kompetensi: 'Pemahaman Inferensial',
      deskripsi: 'Kemampuan untuk menarik kesimpulan berdasarkan informasi yang tersirat dalam teks.',
      subkompetensiList: [
        {
          ringkasan: 'Ide Pokok, Tokoh & Nilai',
          subkompetensi: 'Menyimpulkan ide pokok, gagasan pendukung, tokoh, peristiwa, latar, dan/atau nilai-nilai dalam dan/atau antarteks.',
          materiDefault: 'Ide Pokok, Gagasan Pendukung, Tokoh, dan Nilai'
        },
        {
          ringkasan: 'Kelogisan Hubungan Antarperistiwa',
          subkompetensi: 'Menjelaskan kelogisan hubungan antarperistiwa, antargagasan, dan/atau antarinformasi dalam dan/atau antarteks.',
          materiDefault: 'Kelogisan Hubungan Antarperistiwa dan Antargagasan'
        },
        {
          ringkasan: 'Prediksi Peristiwa',
          subkompetensi: 'Memprediksi peristiwa dalam teks.',
          materiDefault: 'Prediksi Kelanjutan Peristiwa dalam Teks'
        },
        {
          ringkasan: 'Bahasa Kias & Citraan',
          subkompetensi: 'Menjelaskan bahasa kias dan citraan yang digunakan dalam teks fiksi.',
          materiDefault: 'Bahasa Kias (Majas) dan Citraan Teks Fiksi'
        }
      ]
    },
    {
      kompetensi: 'Evaluasi dan Apresiasi',
      deskripsi: 'Kemampuan untuk membuat penilaian terhadap ide, menanggapi teks secara emosional dan estetis dengan mempertimbangkan dampaknya terhadap perasaan, imajinasi, serta penggunaan bahasa oleh penulis.',
      subkompetensiList: [
        {
          ringkasan: 'Relevansi Kehidupan Sehari-hari',
          subkompetensi: 'Menilai relevansi peristiwa dalam teks dengan kehidupan sehari-hari.',
          materiDefault: 'Relevansi Peristiwa Teks dengan Realitas Keseharian'
        },
        {
          ringkasan: 'Kesesuaian & Keakuratan Informasi',
          subkompetensi: 'Menilai kesesuaian dan/atau keakuratan unsur, kebahasaan, atau isi berdasarkan perbandingan informasi dalam dan/atau antarteks.',
          materiDefault: 'Evaluasi Keakuratan dan Kesesuaian Unsur Teks'
        },
        {
          ringkasan: 'Respons Emosional Teks Fiksi',
          subkompetensi: 'Menyimpulkan respons emosional terhadap unsur teks fiksi.',
          materiDefault: 'Apresiasi dan Respons Emosional terhadap Teks Fiksi'
        }
      ]
    }
  ],
  promptRules: `STANDAR DAN KAIDAH KHUSUS TKA LITERASI (SMP/MTs/SEDERAJAT):
- JENIS TEKS STIMULUS:
  1. Teks Informasi: Berisi fakta, konsep, atau prosedur dari berbagai bidang/topik skala lokal, nasional, atau global (teks tunggal maupun jamak).
  2. Teks Fiksi: Cerita rekaan faktual (sejarah/biografi) atau realisme dengan latar konkret/abstrak, tokoh berkarakter bulat, konflik tunggal/jamak penyelesaian tertutup, alur campuran, dan sudut pandang orang ketiga.
- KARAKTERISTIK TEKS:
  * Kosakata: Kata umum, kata berimbuhan/konfiks, kata abstrak, makna denotatif, istilah teknis, makna konotatif konteks tertentu.
  * Kalimat: Panjang kalimat 5–9 kata per kalimat, kalimat tunggal berbagai pola, kalimat majemuk setara.
  * Wacana: Kohesi penyulihan/substitusi, konjungsi antarparagraf perbandingan & penekanan/intensifikasi, tanda baca pendukung deskripsi.
  * Panjang Teks Stimulus: WAJIB berkisar antara 200–250 kata (kecuali puisi). Cantumkan teks stimulus secara utuh sebelum butir soal!
- DISTRIBUSI KOMPETENSI RESMI:
  1. Pemahaman Tekstual: Istilah berbagai bidang, objek/latar kosakata fiksi/nonfiksi, info penting tersurat, kerangka/bagan.
  2. Pemahaman Inferensial: Ide pokok/tokoh/nilai dalam/antarteks, kelogisan hubungan antarperistiwa/gagasan, prediksi peristiwa, bahasa kias dan citraan.
  3. Evaluasi dan Apresiasi: Relevansi peristiwa dengan keseharian, kesesuaian & keakuratan unsur/kebahasaan perbandingan antarteks, respons emosional fiksi.`
};

export const TKA_SMP_NUMERASI_CONFIG = {
  nama: 'TKA Numerasi (Matematika SMP/MTs)',
  jenjang: 'smp',
  elemen: ['Bilangan', 'Aljabar', 'Geometri dan Pengukuran', 'Data dan Peluang'],
  levelKognitifList: [
    {
      level: 'Level 1',
      namaLevel: 'Pengetahuan dan Pemahaman (Knowing and Understanding)',
      prosesBerpikir: [
        { nama: 'Menghitung', deskripsi: 'Melakukan perhitungan berdasarkan prosedur operasi hitung aritmatika (+, -, ×, ÷), aljabar, atau operasi matematika lainnya.' },
        { nama: 'Memahami informasi', deskripsi: 'Memahami informasi dari grafik fungsi, tabel, diagram, infografis, atau bentuk visual lainnya.' },
        { nama: 'Mengelompokkan', deskripsi: 'Mengelompokkan objek berdasarkan fakta, konsep, dan prinsip matematika dalam cakupan sub-elemen.' },
        { nama: 'Mengidentifikasi', deskripsi: 'Melakukan identifikasi terhadap objek menggunakan konsep, fakta, dan prinsip matematika dalam cakupan sub-elemen.' }
      ]
    },
    {
      level: 'Level 2',
      namaLevel: 'Aplikasi (Applying)',
      prosesBerpikir: [
        { nama: 'Memodelkan', deskripsi: 'Memodelkan permasalahan kontekstual terkait cakupan sub-elemen ke dalam kalimat matematika.' },
        { nama: 'Mengaplikasikan', deskripsi: 'Mengaplikasikan strategi dan operasi matematika untuk menyelesaikan permasalahan yang melibatkan konsep dan prosedur matematis familiar dan rutin.' },
        { nama: 'Menginterpretasikan', deskripsi: 'Memahami dan menjelaskan makna dari berbagai situasi, kejadian, pernyataan, representasi, atau masalah matematika.' }
      ]
    },
    {
      level: 'Level 3',
      namaLevel: 'Penalaran (Reasoning)',
      prosesBerpikir: [
        { nama: 'Menganalisis', deskripsi: 'Menentukan, menjelaskan, dan menggunakan hubungan beberapa konsep, fakta, prinsip, atau prosedur matematika dalam cakupan sub-elemen.' },
        { nama: 'Memecahkan masalah', deskripsi: 'Mengaitkan beberapa konsep, fakta, prinsip, prosedur, dan representasi matematika untuk menyelesaikan permasalahan dalam situasi baru atau non-rutin.' },
        { nama: 'Mengevaluasi', deskripsi: 'Mengevaluasi alternatif strategi dan solusi dari suatu pemecahan masalah.' },
        { nama: 'Menyimpulkan', deskripsi: 'Menarik kesimpulan yang valid dari informasi, data, atau bukti yang diberikan.' },
        { nama: 'Melakukan generalisasi', deskripsi: 'Menyusun pernyataan matematis yang menggambarkan hubungan yang lebih umum terkait konsep, fakta, prinsip, dan prosedur.' }
      ]
    }
  ],
  konteks: 'Permasalahan dalam konteks matematika dan konteks keseharian (personal, keluarga, atau lingkungan sekitar bersifat lokal).',
  matriksAsesmen: [
    {
      elemen: 'Bilangan',
      subElemen: 'Bilangan Real',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Bilangan Real.',
      cakupan: [
        'Perbandingan dan sifat-sifat bilangan',
        'Operasi aritmetika pada bilangan',
        'Estimasi/perkiraan hasil perhitungan',
        'Faktorisasi prima bilangan asli',
        'Rasio (skala, proporsi, dan laju perubahan)',
        'Perbandingan senilai dan berbalik nilai'
      ],
      catatan: 'Bilangan mencakup bilangan bulat, bilangan rasional dan irasional, bilangan berpangkat bulat, bilangan akar, dan bilangan dalam notasi ilmiah.'
    },
    {
      elemen: 'Aljabar',
      subElemen: 'Persamaan dan Pertidaksamaan Linier',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Persamaan dan Pertidaksamaan Linier.',
      cakupan: [
        'Persamaan linear satu variabel (PLSV)',
        'Pertidaksamaan linear satu variabel (PtLSV)',
        'Sistem persamaan linear dua variabel (SPLDV)'
      ],
      catatan: 'Penyelesaian masalah aljabar linear konteks nyata.'
    },
    {
      elemen: 'Aljabar',
      subElemen: 'Bentuk Aljabar',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Bentuk Aljabar.',
      cakupan: [
        'Bentuk aljabar dan sifat-sifat operasinya (komutatif, asosiatif, dan distributif)'
      ],
      catatan: 'Operasi dan manipulasi ekspresi aljabar.'
    },
    {
      elemen: 'Aljabar',
      subElemen: 'Fungsi',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Fungsi.',
      cakupan: [
        'Relasi dan fungsi (domain, kodomain, range), serta penyajiannya (diagram panah, tabel, himpunan pasangan berurutan, grafik)'
      ],
      catatan: 'Representasi relasi dan fungsi linear.'
    },
    {
      elemen: 'Aljabar',
      subElemen: 'Barisan dan Deret',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Barisan dan Deret.',
      cakupan: [
        'Barisan berhingga bilangan',
        'Deret berhingga bilangan'
      ],
      catatan: 'Pola bilangan, barisan aritmetika/geometri berhingga.'
    },
    {
      elemen: 'Geometri dan Pengukuran',
      subElemen: 'Objek Geometri',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Objek Geometri.',
      cakupan: [
        'Hubungan antar-sudut yang terbentuk oleh dua garis berpotongan dan dua garis sejajar dipotong transversal (termasuk besar sudut segitiga)',
        'Teorema Pythagoras dan tripel Pythagoras',
        'Kekongruenan dan kesebangunan bangun datar',
        'Jaring-jaring bangun ruang (prisma, tabung, limas, dan kerucut)'
      ],
      catatan: 'Analisis sudut, hubungan segitiga, kesebangunan & jaring-jaring bangun ruang.'
    },
    {
      elemen: 'Geometri dan Pengukuran',
      subElemen: 'Transformasi Geometri',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Transformasi Geometri.',
      cakupan: [
        'Transformasi tunggal (refleksi, translasi, rotasi, dan dilatasi) terhadap titik, garis, dan bangun datar pada bidang koordinat'
      ],
      catatan: 'Transformasi geometri tunggal 2D.'
    },
    {
      elemen: 'Geometri dan Pengukuran',
      subElemen: 'Pengukuran',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Pengukuran.',
      cakupan: [
        'Keliling dan luas bangun datar (daerah segi banyak dan daerah lingkaran, serta daerah gabungannya)',
        'Volume bangun ruang (prisma, limas, dan bola)'
      ],
      catatan: 'Pengukuran keliling, luas bidang gabungan, dan volume prisma/limas/bola.'
    },
    {
      elemen: 'Data dan Peluang',
      subElemen: 'Data',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Data.',
      cakupan: [
        'Perumusan pertanyaan untuk mendapatkan data, serta penyajian dan penginterpretasian data (diagram batang, diagram garis, diagram lingkaran, dan tabel)',
        'Penentuan dan penaksiran rerata (mean), median, modus, dan jangkauan (range) dari data',
        'Perbandingan ukuran pemusatan dan ukuran penyebaran beberapa kelompok data'
      ],
      catatan: 'Penyajian data meliputi: diagram batang, diagram garis, diagram lingkaran, dan tabel.'
    },
    {
      elemen: 'Data dan Peluang',
      subElemen: 'Peluang',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Peluang.',
      cakupan: [
        'Peluang dan frekuensi relatif dari kejadian tunggal'
      ],
      catatan: 'Peluang teoritik & empirik kejadian tunggal.'
    }
  ],
  promptRules: `STANDAR DAN KAIDAH KHUSUS TKA NUMERASI (SMP/MTs/SEDERAJAT):
- MUATAN & ELEMEN MATEMATIKA:
  1. Bilangan: Bilangan Real (bulat, rasional, irasional, pangkat bulat, akar, notasi ilmiah, perbandingan senilai/berbalik nilai, rasio/skala/laju, aritmetika).
  2. Aljabar: PLSV, PtLSV, SPLDV, Bentuk Aljabar (sifat komutatif/asosiatif/distributif), Relasi & Fungsi (domain, kodomain, range), Barisan & Deret berhingga.
  3. Geometri dan Pengukuran: Objek Geometri (sudut transversal & segitiga, Pythagoras, kesebangunan & kekongruenan, jaring-jaring prisma/tabung/limas/kerucut), Transformasi Geometri (refleksi, translasi, rotasi, dilatasi tunggal), Pengukuran (keliling & luas segi banyak/lingkaran/gabungan, volume prisma/limas/bola).
  4. Data dan Peluang: Data (sajian diagram batang/garis/lingkaran/tabel, mean/median/modus/jangkauan, perbandingan ukuran pemusatan & penyebaran), Peluang (peluang & frekuensi relatif kejadian tunggal).
- 3 LEVEL KOGNITIF & PROSES BERPIKIR RESMI:
  * Level 1 (Knowing & Understanding): Menghitung, Memahami informasi (grafik/tabel/diagram), Mengelompokkan, Mengidentifikasi.
  * Level 2 (Applying): Memodelkan konteks ke kalimat matematika, Mengaplikasikan operasi rutin, Menginterpretasikan situasi.
  * Level 3 (Reasoning): Menganalisis hubungan konsep, Memecahkan masalah situasi baru/non-rutin, Mengevaluasi solusi, Menyimpulkan, Melakukan generalisasi.
- KONTEKS:
  Permasalahan kontekstual nyata (personal, keluarga, sekolah, lingkungan sekitar bersifat lokal).`
};


// ==========================================
// 3. JENJANG SMA / MA / SMK / MAK / SEDERAJAT
// ==========================================

export const TKA_SMA_LITERASI_CONFIG = {
  nama: 'TKA Literasi (Bahasa Indonesia SMA/MA/SMK)',
  jenjang: 'sma',
  jenisTeks: [
    {
      tipe: 'Teks Informasi',
      deskripsi: 'Teks tunggal maupun jamak yang berisi fakta, konsep, prosedur, dan metakognisi dari berbagai bidang atau topik, genre, dan konteks pada skala lokal, nasional, dan global.'
    },
    {
      tipe: 'Teks Fiksi',
      deskripsi: 'Cerita rekaan berupa realisme atau absurd, dengan latar cerita konkret atau abstrak, tokoh dengan karakter bulat, konflik tunggal atau jamak dengan penyelesaian terbuka, alur campuran, dan sudut pandang campuran.'
    }
  ],
  karakteristik: {
    kosakata: 'Kata khusus dan kata umum, kata berimbuhan kompleks, kata abstrak, makna denotatif, istilah teknis, konotatif konteks luas.',
    kalimat: 'Jumlah kata per kalimat 8–12 kata, kalimat kompleks berbagai pola dan kalimat inversi.',
    wacana: 'Konjungsi antarparagraf makna "pertentangan" dan "sebab akibat", tanda baca untuk mendukung ungkapan dan makna; panjang teks 250–300 kata (kecuali teks puisi).'
  },
  kompetensiMembaca: [
    'Mengidentifikasi informasi tersurat dalam teks.',
    'Menyusun ulang, mengelompokkan, membuat ikhtisar, dan menyajikan kembali informasi tersurat dalam teks.',
    'Mengidentifikasi dan menyimpulkan informasi tersirat dalam teks.',
    'Menilai gagasan, fakta, atau opini dalam teks.',
    'Menanggapi isi teks, mengidentifikasi diri dengan tokoh atau kejadian, dan menanggapi bahasa penulis dalam teks.'
  ],
  matriksAsesmen: [
    {
      kompetensi: 'Pemahaman Tekstual',
      deskripsi: 'Kemampuan untuk memahami informasi yang dikemukakan secara eksplisit, mengelompokkan, menyusun ulang, dan menyajikan kembali informasi secara eksplisit dari teks.',
      subkompetensiList: [
        {
          ringkasan: 'Kata Serapan Daerah/Asing',
          subkompetensi: 'Mengidentifikasi penggunaan kata serapan dari bahasa daerah/asing dalam berbagai bidang.',
          materiDefault: 'Penggunaan Kata Serapan Bahasa Daerah dan Asing'
        },
        {
          ringkasan: 'Latar, Karakter & Fenomena Kosakata',
          subkompetensi: 'Mengidentifikasi latar, karakter, dan/atau fenomena berdasarkan kosakata yang digunakan dalam teks fiksi atau nonfiksi.',
          materiDefault: 'Identifikasi Latar, Karakter, dan Fenomena Teks'
        },
        {
          ringkasan: 'Kerangka / Bagan Bagian Penting',
          subkompetensi: 'Menyusun kerangka atau bagan berdasarkan bagian-bagian penting dalam teks.',
          materiDefault: 'Penyusunan Bagan dan Kerangka Berpikir Teks'
        }
      ]
    },
    {
      kompetensi: 'Pemahaman Inferensial',
      deskripsi: 'Kemampuan untuk menarik kesimpulan berdasarkan informasi yang tersirat dalam teks.',
      subkompetensiList: [
        {
          ringkasan: 'Ide Pokok, Konflik & Nilai',
          subkompetensi: 'Menyimpulkan ide pokok, gagasan pendukung, tokoh, peristiwa, latar, konflik, atau nilai-nilai dalam teks.',
          materiDefault: 'Analisis Ide Pokok, Konflik, dan Nilai-nilai Teks'
        },
        {
          ringkasan: 'Hubungan Makna Antarkalimat & Paragraf',
          subkompetensi: 'Menjelaskan hubungan makna antarkalimat dan/atau antarparagraf dalam teks.',
          materiDefault: 'Hubungan Kohesi dan Makna Antarkalimat/Paragraf'
        },
        {
          ringkasan: 'Prediksi Akhir Uraian / Cerita',
          subkompetensi: 'Memprediksi lanjutan atau akhir uraian/cerita berdasarkan bagian tertentu dalam teks.',
          materiDefault: 'Prediksi Lanjutan dan Resolusi Cerita/Uraian'
        }
      ]
    },
    {
      kompetensi: 'Evaluasi dan Apresiasi',
      deskripsi: 'Kemampuan untuk membuat penilaian terhadap ide, menanggapi teks secara emosional dan estetis dengan mempertimbangkan dampaknya terhadap perasaan, imajinasi, serta penggunaan bahasa oleh penulis.',
      subkompetensiList: [
        {
          ringkasan: 'Relevansi Peristiwa Kehidupan Nyata',
          subkompetensi: 'Menilai relevansi peristiwa dalam teks dengan kehidupan sehari-hari.',
          materiDefault: 'Evaluasi Relevansi Kontekstual Teks dengan Kehidupan'
        },
        {
          ringkasan: 'Keakuratan & Kecukupan Informasi',
          subkompetensi: 'Menilai keakuratan, kesesuaian, kecukupan, atau ketepatan informasi dalam teks.',
          materiDefault: 'Kritik Keakuratan dan Kecukupan Informasi Teks'
        },
        {
          ringkasan: 'Ketepatan Penggunaan Bahasa',
          subkompetensi: 'Menilai ketepatan dan kesesuaian penggunaan bahasa dalam teks.',
          materiDefault: 'Evaluasi Diksi, Gaya Bahasa, dan Efektivitas Kalimat'
        },
        {
          ringkasan: 'Kesesuaian Penggambaran Karakter/Latar',
          subkompetensi: 'Menilai ketepatan bagian teks untuk menggambarkan karakter, peristiwa, atau latar dalam teks fiksi.',
          materiDefault: 'Evaluasi Deskripsi Karakter, Peristiwa, dan Latar Fiksi'
        },
        {
          ringkasan: 'Respons Emosional Puisi, Prosa, Drama',
          subkompetensi: 'Menyimpulkan respons emosional terhadap unsur puisi, prosa, dan drama.',
          materiDefault: 'Apresiasi Emosional dan Estetika Puisi/Prosa/Drama'
        }
      ]
    }
  ],
  promptRules: `STANDAR DAN KAIDAH KHUSUS TKA LITERASI (SMA/MA/SMK/MAK):
- JENIS TEKS STIMULUS:
  1. Teks Informasi: Berisi fakta, konsep, prosedur, dan metakognisi dari berbagai topik/genre/konteks skala lokal, nasional, dan global (tunggal maupun jamak).
  2. Teks Fiksi: Realisme atau absurd, latar konkret/abstrak, tokoh karakter bulat, konflik tunggal/jamak penyelesaian terbuka, alur campuran, dan sudut pandang campuran.
- KARAKTERISTIK TEKS:
  * Kosakata: Kata khusus & umum, kata berimbuhan kompleks, kata abstrak, makna denotatif, istilah teknis, konotatif konteks luas.
  * Kalimat: 8–12 kata per kalimat, kalimat kompleks berbagai pola dan kalimat inversi.
  * Wacana: Konjungsi antarparagraf pertentangan & sebab-akibat, tanda baca ekspresif pendukung makna.
  * Panjang Teks Stimulus: WAJIB berkisar antara 250–300 kata (kecuali puisi). Cantumkan teks stimulus secara utuh sebelum butir soal!
- DISTRIBUSI KOMPETENSI RESMI:
  1. Pemahaman Tekstual: Kata serapan daerah/asing, latar/karakter/fenomena kosakata, kerangka/bagan penting.
  2. Pemahaman Inferensial: Ide pokok/konflik/nilai, hubungan makna antarkalimat/paragraf, prediksi kelanjutan uraian/cerita terbuka.
  3. Evaluasi dan Apresiasi: Relevansi kehidupan, keakuratan/kecukupan info, ketepatan bahasa/diksi, ketepatan deskripsi karakter fiksi, respons emosional puisi/prosa/drama.`
};

export const TKA_SMA_INGGRIS_CONFIG = {
  nama: 'TKA Literasi Bahasa Inggris (SMA/MA/SMK)',
  jenjang: 'sma',
  jenisTeks: [
    {
      tipe: 'Descriptive, Recount, Narrative, Procedure, Analytical Exposition',
      deskripsi: 'Teks yang menggambarkan komunikasi sehari-hari, di tempat kerja (vokasional), dan akademik secara proporsional.'
    }
  ],
  karakteristik: {
    cefr: 'Tingkat kemahiran B1 (Intermediate) & A2 (Pre-Intermediate) CEFR.',
    teksB1: 'Panjang sekitar 250–350 kata, kosakata frekuensi tinggi hingga 3000 kata, kalimat sederhana & kompleks, konteks daily life, workplace, basic academic.',
    teksA2: 'Panjang sekitar 200–300 kata, kosakata frekuensi tinggi hingga 2000 kata, kalimat sederhana & majemuk dasar, konteks kehidupan sehari-hari & vokasional konkret.'
  },
  matriksAsesmen: [
    {
      kompetensi: 'Pemahaman Tekstual (Textual Understanding)',
      deskripsi: 'Mampu memahami informasi yang eksplisit, mengelompokkan, menyusun ulang, dan menyajikan kembali informasi eksplisit dari teks.',
      subkompetensiList: [
        {
          ringkasan: 'Identify Explicit Information',
          subkompetensi: 'Menemukan/mengidentifikasi Informasi: mampu menemukan atau mengidentifikasi informasi penting yang disebutkan secara eksplisit dalam teks.',
          materiDefault: 'Scanning and Identifying Explicit Information'
        },
        {
          ringkasan: 'Classify Elements',
          subkompetensi: 'Mengklasifikasi: mampu mengelompokkan orang, benda, tempat, atau peristiwa dalam teks berdasarkan kategori tertentu.',
          materiDefault: 'Classifying Characters, Objects, and Events'
        },
        {
          ringkasan: 'Create Outlines',
          subkompetensi: 'Membuat kerangka: mampu menyusun poin-poin utama dari teks dalam bentuk kerangka atau daftar.',
          materiDefault: 'Outlining Main Ideas and Supporting Points'
        },
        {
          ringkasan: 'Summarize Information',
          subkompetensi: 'Meringkas: mampu menyajikan kembali isi teks secara ringkas dengan mengutip bagian penting.',
          materiDefault: 'Summarizing Text Content'
        },
        {
          ringkasan: 'Synthesize Sources',
          subkompetensi: 'Mensintesis: mampu menggabungkan informasi dari sumber lain untuk mendapatkan pemahaman yang lebih komprehensif tentang suatu isu atau topik.',
          materiDefault: 'Synthesizing Multiple Information Sources'
        }
      ]
    },
    {
      kompetensi: 'Pemahaman Inferensial (Inferential Understanding)',
      deskripsi: 'Mampu menarik kesimpulan berdasarkan informasi tersirat dalam teks, pengalaman pribadi, serta intuisi untuk memahami isi teks.',
      subkompetensiList: [
        {
          ringkasan: 'Supporting Details',
          subkompetensi: 'Menyimpulkan detail pendukung: mampu menentukan fakta tambahan yang membuat teks lebih informatif, menarik, atau persuasif.',
          materiDefault: 'Inferring Supporting Details and Facts'
        },
        {
          ringkasan: 'Main Idea, Purpose & Moral Values',
          subkompetensi: 'Menyimpulkan topik, ide pokok/gagasan utama, makna, target pembaca, tujuan penulisan teks, atau pesan moral yang tidak secara eksplisit dinyatakan dalam teks.',
          materiDefault: 'Main Idea, Author Purpose, and Moral Message'
        },
        {
          ringkasan: 'Sequence of Events',
          subkompetensi: 'Menyimpulkan urutan kejadian: mampu memperkirakan isi selanjutnya dari teks.',
          materiDefault: 'Predicting Chronological Sequence and Next Events'
        },
        {
          ringkasan: 'Compare & Contrast',
          subkompetensi: 'Menyimpulkan perbandingan: mampu menyimpulkan persamaan atau perbedaan antara tokoh, waktu, tempat, benda, atau gagasan dalam teks.',
          materiDefault: 'Comparing and Contrasting Characters or Concepts'
        },
        {
          ringkasan: 'Cause & Effect Relations',
          subkompetensi: 'Menyimpulkan hubungan sebab-akibat: mampu menafsirkan hubungan/kaitan antara gagasan/tindakan satu dan lainnya yang dinyatakan dalam teks.',
          materiDefault: 'Identifying Cause and Effect Relationships'
        },
        {
          ringkasan: 'Character Traits',
          subkompetensi: 'Menyimpulkan karakter tokoh: mampu menyimpulkan sifat atau kepribadian tokoh berdasarkan petunjuk eksplisit dalam teks.',
          materiDefault: 'Analyzing Character Personality and Traits'
        },
        {
          ringkasan: 'Predict Story Outcomes',
          subkompetensi: 'Memprediksi hasil cerita: mampu memprediksi akhir cerita setelah membaca bagian awal.',
          materiDefault: 'Predicting Story Endings and Outcomes'
        }
      ]
    },
    {
      kompetensi: 'Evaluasi dan Apresiasi (Evaluation & Appreciation)',
      deskripsi: 'Mampu membuat penilaian terhadap ide, menanggapi teks secara emosional dan estetis dengan mempertimbangkan dampaknya terhadap perasaan, imajinasi, serta penggunaan bahasa oleh penulis.',
      subkompetensiList: [
        {
          ringkasan: 'Reality vs Fantasy',
          subkompetensi: 'Menilai realitas atau fantasi: mampu menganalisis peristiwa dalam teks dapat terjadi dalam kehidupan nyata berdasarkan pengalaman dan pengetahuan pribadi.',
          materiDefault: 'Distinguishing Reality from Fantasy'
        },
        {
          ringkasan: 'Fact vs Opinion',
          subkompetensi: 'Menilai fakta atau opini: mampu menilai fakta/opini yang diberikan penulis untuk mendukung pendapatnya berdasarkan bukti atau persuasif.',
          materiDefault: 'Evaluating Fact vs Opinion in Arguments'
        },
        {
          ringkasan: 'Validity & Adequacy of Information',
          subkompetensi: 'Menilai kecukupan dan validitas informasi: Menilai kesesuaian, kelengkapan, keakuratan informasi dalam teks (dengan membandingkannya dengan sumber lain).',
          materiDefault: 'Assessing Information Validity and Completeness'
        },
        {
          ringkasan: 'Appropriateness of Character/Scene',
          subkompetensi: 'Menilai kesesuaian: mampu menentukan bagian teks yang paling sesuai untuk menggambarkan karakter utama atau aspek lain dari bacaan.',
          materiDefault: 'Evaluating Appropriateness of Descriptions'
        },
        {
          ringkasan: 'Emotional & Reader Response',
          subkompetensi: 'Menanggapi isi teks: mampu mengungkapkan perasaan/kesan/pendapat terhadap bacaan (interest, amusement, empathy, appreciation).',
          materiDefault: 'Expressing Personal and Critical Response to Text'
        }
      ]
    }
  ],
  promptRules: `STANDAR DAN KAIDAH KHUSUS TKA BAHASA INGGRIS (SMA/MA/SMK/MAK):
- GENRE TEKS: Descriptive, Recount, Narrative, Procedure, Analytical Exposition.
- KONTEKS: Daily life, workplace/vocational context, and basic academic contexts.
- KOMPLEKSITAS TEKS (CEFR LEVEL B1 / A2):
  * Level B1: 250–350 words, vocabulary up to 3000 high-frequency words, simple & complex structures.
  * Level A2: 200–300 words, vocabulary up to 2000 words, simple & basic compound structures.
  * Cantumkan teks reading comprehension utuh berbahasa Inggris sebelum butir pertanyaan!
- KOMPETENSI ASESMEN:
  1. Textual Understanding: Identifying explicit info, classifying, outlining, summarizing, synthesizing.
  2. Inferential Understanding: Supporting details, main idea, author's purpose, moral value, sequence, comparison/contrast, cause-effect, character traits, predicting outcome.
  3. Evaluation & Appreciation: Reality vs fantasy, fact vs opinion, validity/accuracy, appropriateness, personal reader response.`
};

export const TKA_SMA_NUMERASI_CONFIG = {
  nama: 'TKA Numerasi (Matematika SMA/MA/SMK)',
  jenjang: 'sma',
  elemen: ['Bilangan', 'Aljabar', 'Geometri dan Pengukuran', 'Trigonometri', 'Data dan Peluang'],
  levelKognitifList: [
    {
      level: 'Level 1',
      namaLevel: 'Pengetahuan dan Pemahaman (Knowing and Understanding)',
      prosesBerpikir: [
        { nama: 'Menghitung', deskripsi: 'Melakukan perhitungan berdasarkan prosedur operasi aritmatika (+, -, ×, ÷), operasi aljabar, atau operasi matematika lainnya.' },
        { nama: 'Memahami informasi', deskripsi: 'Memahami informasi dari grafik fungsi, tabel, diagram, infografis, atau bentuk visual lainnya.' },
        { nama: 'Mengelompokkan', deskripsi: 'Mengelompokkan objek berdasarkan fakta, konsep, dan prinsip matematika dalam cakupan sub-elemen.' },
        { nama: 'Mengidentifikasi', deskripsi: 'Melakukan identifikasi terhadap objek menggunakan konsep, fakta, dan prinsip matematika dalam cakupan sub-elemen.' }
      ]
    },
    {
      level: 'Level 2',
      namaLevel: 'Aplikasi (Applying)',
      prosesBerpikir: [
        { nama: 'Memodelkan', deskripsi: 'Memodelkan permasalahan kontekstual terkait cakupan sub-elemen ke dalam pernyataan matematika.' },
        { nama: 'Menerapkan', deskripsi: 'Menerapkan strategi dan operasi matematika untuk menyelesaikan permasalahan yang melibatkan konsep dan prosedur matematis familiar dan rutin.' },
        { nama: 'Menginterpretasikan', deskripsi: 'Memahami dan menjelaskan makna dari berbagai situasi, kejadian, pernyataan, representasi, atau masalah matematika.' }
      ]
    },
    {
      level: 'Level 3',
      namaLevel: 'Penalaran (Reasoning)',
      prosesBerpikir: [
        { nama: 'Menganalisis', deskripsi: 'Menentukan, menjelaskan, dan menggunakan hubungan beberapa konsep, fakta, prinsip, atau prosedur matematika.' },
        { nama: 'Memecahkan masalah', deskripsi: 'Mengaitkan beberapa konsep, fakta, prinsip, prosedur, dan representasi matematika untuk menyelesaikan permasalahan situasi baru atau non-rutin.' },
        { nama: 'Mengevaluasi', deskripsi: 'Mengevaluasi alternatif strategi dan solusi dari suatu pemecahan masalah.' },
        { nama: 'Menyimpulkan', deskripsi: 'Menarik kesimpulan yang valid dari informasi, data, atau bukti yang diberikan.' },
        { nama: 'Melakukan generalisasi', deskripsi: 'Menyusun pernyataan matematis yang menggambarkan hubungan yang lebih umum terkait konsep, fakta, prinsip, dan prosedur.' },
        { nama: 'Menjustifikasi', deskripsi: 'Memberikan argumen matematis atau langkah/prosedur operasi matematika secara logis untuk mendukung strategi atau solusi.' }
      ]
    }
  ],
  konteks: 'Permasalahan dalam konteks matematika dan konteks keseharian (personal, keluarga, atau lingkungan sekitar baik lokal maupun global).',
  matriksAsesmen: [
    {
      elemen: 'Bilangan',
      subElemen: 'Bilangan Real',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Bilangan Real.',
      cakupan: [
        'Jenis dan sifat bilangan real',
        'Operasi bilangan (penjumlahan, pengurangan, perkalian, pembagian, gabungan) beserta sifat komutatif, asosiatif, distributif',
        'Bilangan asli berpangkat bulat atau pecahan'
      ],
      catatan: 'Bilangan meliputi bilangan real, termasuk eksponen berpangkat bulat atau pecahan.'
    },
    {
      elemen: 'Aljabar',
      subElemen: 'Persamaan dan Pertidaksamaan Linear',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Persamaan dan Pertidaksamaan Linear.',
      cakupan: [
        'Sistem persamaan linear multivariabel (SPLTV maksimum 3 variabel)',
        'Sistem pertidaksamaan linear multivariabel (SPtLDV)',
        'Program linear dan optimasi fungsi objektif'
      ],
      catatan: 'Maksimum banyaknya variabel yang digunakan adalah tiga.'
    },
    {
      elemen: 'Aljabar',
      subElemen: 'Fungsi',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Fungsi.',
      cakupan: [
        'Domain, kodomain, daerah hasil (range), dan representasi fungsi linear, kuadrat, dan rasional dalam berbagai bentuk (analitis dan grafis)',
        'Invers fungsi dan representasinya',
        'Fungsi komposisi dan representasinya'
      ],
      catatan: 'Identifikasi dan manipulasi fungsi secara analitis dan grafis.'
    },
    {
      elemen: 'Aljabar',
      subElemen: 'Barisan dan Deret',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Barisan dan Deret.',
      cakupan: [
        'Barisan dan deret aritmetika',
        'Barisan dan deret geometri',
        'Penerapan barisan dan deret dalam masalah pertumbuhan, peluruhan, bunga tunggal, dan bunga majemuk'
      ],
      catatan: 'Termasuk aplikasi matematika keuangan (bunga tunggal, majemuk, pertumbuhan, peluruhan).'
    },
    {
      elemen: 'Geometri dan Pengukuran',
      subElemen: 'Objek Geometri',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Objek Geometri.',
      cakupan: [
        'Hubungan dua sudut, dua garis, dan dua bidang',
        'Hubungan objek geometri pada bangun datar (segitiga, segi empat, lingkaran, gabungan) dan bangun ruang beraturan (sisi datar dan lengkung)',
        'Kesebangunan dan kekongruenan bangun datar',
        'Teorema Pythagoras dan penerapannya',
        'Jarak dua objek geometri (jarak dua titik, dua garis, dua bidang, titik-garis, titik-bidang)'
      ],
      catatan: 'Geometri ruang (dimensi tiga): jarak titik ke garis/bidang, sudut antargaris/bidang.'
    },
    {
      elemen: 'Geometri dan Pengukuran',
      subElemen: 'Transformasi Geometri',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Transformasi Geometri.',
      cakupan: [
        'Transformasi geometri (translasi, refleksi, rotasi, dan dilatasi, serta komposisinya) dari titik, garis, atau kurva'
      ],
      catatan: 'Komposisi transformasi geometri menggunakan matriks atau pemetaan.'
    },
    {
      elemen: 'Geometri dan Pengukuran',
      subElemen: 'Pengukuran',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Pengukuran.',
      cakupan: [
        'Keliling dan luas bangun datar',
        'Volume dan luas permukaan bangun ruang',
        'Jarak dan perhitungan sudut dua objek geometri'
      ],
      catatan: 'Pengukuran luas permukaan dan volume bangun ruang beraturan.'
    },
    {
      elemen: 'Trigonometri',
      subElemen: 'Perbandingan Trigonometri',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Perbandingan Trigonometri.',
      cakupan: [
        'Perbandingan trigonometri segitiga siku-siku (sinus, kosinus, tangen, kotangen, sekan, kosekan)',
        'Sudut istimewa dan sudut berelasi di berbagai kuadran',
        'Penerapan perbandingan trigonometri dalam masalah kontekstual (sudut elevasi & depresi)'
      ],
      catatan: 'Perbandingan trigonometri sin, cos, tan, cot, sec, csc dan aplikasinya.'
    },
    {
      elemen: 'Data dan Peluang',
      subElemen: 'Data & Statistika',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Data.',
      cakupan: [
        'Penyajian data dalam bentuk diagram batang, garis, lingkaran, grafik histogram/poligon/ogive, tabel distribusi frekuensi, dan bentuk visual',
        'Ukuran pemusatan (mean, median, modus) data tunggal dan data kelompok',
        'Ukuran penyebaran (jangkauan, kuartil, desil, simpangan rata-rata, variansi, standar deviasi) data tunggal dan kelompok',
        'Aturan pencacahan (aturan penjumlahan, perkalian, permutasi, kombinasi) dan peluang kejadian majemuk'
      ],
      catatan: 'Statistika data tunggal & kelompok serta aturan pencacahan dan peluang.'
    }
  ],
  promptRules: `STANDAR DAN KAIDAH KHUSUS TKA NUMERASI (SMA/MA/SMK/MAK):
- 5 ELEMEN UTAMA MATEMATIKA SMA:
  1. Bilangan: Bilangan Real (sifat bilangan real, operasi aljabar & eksponen bulat/pecahan).
  2. Aljabar: SPLTV (maks 3 variabel), SPtLDV, Program Linear, Relasi & Fungsi (linear, kuadrat, rasional, invers, fungsi komposisi), Barisan & Deret (aritmetika, geometri, pertumbuhan, peluruhan, bunga tunggal & majemuk).
  3. Geometri dan Pengukuran: Objek Geometri Dimensi 3 (jarak titik-garis, titik-bidang, garis-bidang), Kesebangunan/Kekongruenan, Pythagoras, Transformasi Geometri (translasi, refleksi, rotasi, dilatasi & komposisinya), Pengukuran Luas & Volume bangun ruang.
  4. Trigonometri: Perbandingan trigonometri (sin, cos, tan, sec, csc, cot), sudut relasi, aplikasi sudut elevasi/depresi.
  5. Data dan Peluang: Sajian data (histogram, ogive, diagram), Ukuran pemusatan & penyebaran data tunggal & kelompok, Aturan pencacahan (permutasi, kombinasi) dan peluang kejadian.
- 3 LEVEL KOGNITIF RESMI SMA:
  * Level 1 (Knowing & Understanding): Menghitung, Memahami info (grafik/tabel/infografis), Mengelompokkan, Mengidentifikasi.
  * Level 2 (Applying): Memodelkan konteks ke ekspresi/sistem matematika, Menerapkan strategi rutin, Menginterpretasikan makna hasil.
  * Level 3 (Reasoning): Menganalisis relasi konsep, Memecahkan masalah situasi baru/kompleks, Mengevaluasi solusi, Menyimpulkan, Melakukan generalisasi, Menjustifikasi (memberikan argumen matematis logis).
- KONTEKS: Permasalahan matematika murni serta situasi nyata personal, keluarga, lokal, hingga global.`
};


// ==========================================
// BACKWARD COMPATIBILITY & HELPER UTILITIES
// ==========================================

export const TKA_LITERASI_CONFIG = TKA_SD_LITERASI_CONFIG;
export const TKA_NUMERASI_CONFIG = TKA_SD_NUMERASI_CONFIG;

export function getTKALiterasiConfig(jenjang: string = 'sd') {
  const norm = jenjang.toLowerCase();
  if (norm.includes('sma') || norm.includes('smk') || norm.includes('ma')) {
    return TKA_SMA_LITERASI_CONFIG;
  }
  if (norm.includes('smp') || norm.includes('mts')) {
    return TKA_SMP_LITERASI_CONFIG;
  }
  return TKA_SD_LITERASI_CONFIG;
}

export function getTKANumerasiConfig(jenjang: string = 'sd') {
  const norm = jenjang.toLowerCase();
  if (norm.includes('sma') || norm.includes('smk') || norm.includes('ma')) {
    return TKA_SMA_NUMERASI_CONFIG;
  }
  if (norm.includes('smp') || norm.includes('mts')) {
    return TKA_SMP_NUMERASI_CONFIG;
  }
  return TKA_SD_NUMERASI_CONFIG;
}

export function getTKABahasaInggrisConfig(jenjang: string = 'sma') {
  return TKA_SMA_INGGRIS_CONFIG;
}

export function getTKAConfigBySubtype(subTipe: string, jenjang: string = 'sd') {
  if (subTipe === 'TKA Literasi Bahasa Inggris') {
    return TKA_SMA_INGGRIS_CONFIG;
  }
  if (subTipe === 'TKA Literasi') {
    return getTKALiterasiConfig(jenjang);
  }
  if (subTipe === 'TKA Numerasi') {
    return getTKANumerasiConfig(jenjang);
  }
  return null;
}

/**
 * Serialisasi Matriks Asesmen resmi TKA menjadi teks untuk disisipkan ke prompt AI.
 * Matriks tidak lagi ditampilkan di UI; Model AI yang memilih elemen/subkompetensi secara otomatis.
 */
export function buildTKAMatriksText(cfg: any): string {
  if (!cfg || !Array.isArray(cfg.matriksAsesmen)) return '';
  return cfg.matriksAsesmen.map((item: any, idx: number) => {
    if (Array.isArray(item.subkompetensiList)) {
      const subs = item.subkompetensiList.map((s: any) => `   - ${s.subkompetensi}`).join('\n');
      return `${idx + 1}. ${item.kompetensi}${item.deskripsi ? ` — ${item.deskripsi}` : ''}\n${subs}`;
    }
    if (Array.isArray(item.cakupan)) {
      const cak = item.cakupan.map((c: string) => `   - ${c}`).join('\n');
      return `${idx + 1}. ${item.elemen} – ${item.subElemen}${item.kompetensi ? ` (${item.kompetensi})` : ''}${item.catatan ? ` [Catatan: ${item.catatan}]` : ''}\n${cak}`;
    }
    return '';
  }).filter(Boolean).join('\n');
}
