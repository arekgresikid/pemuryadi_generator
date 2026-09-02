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

export const TKA_LITERASI_CONFIG = {
  nama: 'TKA Literasi (Bahasa Indonesia)',
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
      deskripsi: 'Kemampuan untuk memahami informasi yang dikemukakan secara eksplisit, mengelompokkan, menyusun ulang, dan menyajikan kembali informasi secara eksplisit dari teks.',
      subkompetensiList: [
        {
          ringkasan: 'Kosakata Umum & Khusus',
          subkompetensi: 'Mengidentifikasi penggunaan kosakata umum dan khusus dalam berbagai bidang.',
          materiDefault: 'Penggunaan Kosakata Umum dan Khusus'
        },
        {
          ringkasan: 'Objek Berdasarkan Kosakata',
          subkompetensi: 'Mengidentifikasi objek berdasarkan kosakata yang digunakan dalam teks fiksi atau nonfiksi.',
          materiDefault: 'Identifikasi Objek Teks Fiksi/Nonfiksi'
        },
        {
          ringkasan: 'Ikhtisar & Bagan Informasi',
          subkompetensi: 'Menyusun kembali informasi dari teks dalam bentuk ikhtisar/bagan.',
          materiDefault: 'Penyusunan Ikhtisar dan Bagan Informasi'
        },
        {
          ringkasan: 'Informasi Tersurat',
          subkompetensi: 'Mengidentifikasi informasi tersurat dalam teks.',
          materiDefault: 'Informasi Tersurat Teks'
        }
      ]
    },
    {
      kompetensi: 'Pemahaman Inferensial',
      deskripsi: 'Kemampuan untuk menarik kesimpulan berdasarkan informasi yang tersirat dalam teks.',
      subkompetensiList: [
        {
          ringkasan: 'Ide Pokok, Amanat & Nilai',
          subkompetensi: 'Menyimpulkan ide pokok, gagasan pendukung, amanat, tokoh, peristiwa, dan/atau nilai-nilai dalam teks.',
          materiDefault: 'Ide Pokok, Amanat, Tokoh, dan Nilai Teks'
        },
        {
          ringkasan: 'Perubahan Objek/Latar',
          subkompetensi: 'Menyimpulkan perubahan sederhana pada objek, karakter, dan/atau latar dalam teks fiksi atau nonfiksi.',
          materiDefault: 'Perubahan Karakter dan Latar Teks'
        },
        {
          ringkasan: 'Makna Ungkapan',
          subkompetensi: 'Menjelaskan makna ungkapan yang digunakan dalam teks.',
          materiDefault: 'Makna Ungkapan dan Konotasi Terbatas'
        }
      ]
    },
    {
      kompetensi: 'Evaluasi dan Apresiasi',
      deskripsi: 'Kemampuan untuk membuat penilaian terhadap ide, menanggapi teks secara emosional dan estetis dengan mempertimbangkan dampaknya terhadap perasaan, imajinasi, serta penggunaan bahasa oleh penulis.',
      subkompetensiList: [
        {
          ringkasan: 'Relevansi Kehidupan Nyata',
          subkompetensi: 'Menilai relevansi peristiwa dalam teks dengan kehidupan sehari-hari berdasarkan pengalaman atau pengetahuan pribadi.',
          materiDefault: 'Relevansi Peristiwa Teks dengan Kehidupan Sehari-hari'
        },
        {
          ringkasan: 'Kesesuaian Antarunsur',
          subkompetensi: 'Menilai kesesuaian antarunsur dan/atau antarinformasi dalam teks.',
          materiDefault: 'Kesesuaian Antarunsur dan Informasi Teks'
        },
        {
          ringkasan: 'Respons Emosional Teks Fiksi',
          subkompetensi: 'Menyimpulkan respons emosional terhadap unsur teks fiksi.',
          materiDefault: 'Apresiasi dan Respons Emosional Teks Fiksi'
        }
      ]
    }
  ],
  promptRules: `STANDAR DAN KAIDAH KHUSUS TKA LITERASI (Membaca Bahasa Indonesia):
- JENIS TEKS STIMULUS:
  1. Teks Informasi: Berisi fakta sederhana dari berbagai bidang/topik berskala lokal dan nasional.
  2. Teks Fiksi: Cerita rekaan fantasi atau faktual (sejarah/biografi) dengan latar cerita konkret, tokoh berkarakter datar, konflik tunggal penyelesaian tertutup, alur maju, dan sudut pandang orang pertama.
- KARAKTERISTIK TEKS:
  * Kosakata: Gunakan kata dasar, kata berimbuhan, kata konkret, dominan makna denotatif, dan makna konotatif dalam konteks terbatas.
  * Kalimat: Panjang kalimat WAJIB 3–7 kata per kalimat dengan pola dasar SPOK, struktur bahasa tulis bercampur bahasa lisan terbatas yang mudah dicerna peserta didik.
  * Wacana: Menjaga kohesi pengacuan/referensi dan konjungsi antarparagraf penambahan/penjelasan.
  * Panjang Teks Stimulus: WAJIB berkisar antara 150–200 kata (kecuali bentuk puisi). Cantumkan teks stimulus secara utuh sebelum butir soal!
- DISTRIBUSI KOMPETENSI:
  Soal harus menguji 3 kompetensi membaca:
  1. Pemahaman Tekstual (informasi tersurat, kosakata umum/khusus, objek kosakata, ikhtisar/bagan).
  2. Pemahaman Inferensial (ide pokok, gagasan pendukung, amanat, tokoh, perubahan objek/karakter/latar, makna ungkapan).
  3. Evaluasi dan Apresiasi (relevansi dengan kehidupan nyata, kesesuaian antarunsur/informasi, respons emosional).`
};

export const TKA_NUMERASI_CONFIG = {
  nama: 'TKA Numerasi (Matematika SD/MI/Sederajat)',
  elemen: ['Bilangan', 'Geometri dan Pengukuran', 'Data'],
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
        'Pecahan senilai menggunakan gambar dan simbol matematika',
        'Perbandingan dan pengurutan bilangan pecahan',
        'Relasi berbagai bentuk pecahan (pecahan sederhana, desimal, persen)',
        'Operasi penjumlahan, pengurangan, perkalian, dan pembagian bilangan cacah',
        'Operasi penjumlahan dan pengurangan bilangan pecahan, serta operasi perkalian dan pembagian bilangan pecahan dengan bilangan asli',
        'Kelipatan, faktor, KPK, dan FPB bilangan asli'
      ],
      catatan: 'Fokus pada pemecahan masalah kontekstual bilangan cacah dan pecahan.'
    },
    {
      elemen: 'Geometri dan Pengukuran',
      subElemen: 'Objek Geometri',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Objek Geometri.',
      cakupan: [
        'Bentuk bangun datar (segitiga, segiempat, dan segi banyak)',
        'Konstruksi bangun ruang dan visualisasi spasial (tampak depan, atas, dan samping) mencakup kubus, balok, dan gabungannya'
      ],
      catatan: 'Bangun datar mencakup segitiga, segiempat, dan segi banyak. Bangun ruang mencakup kubus, balok, dan gabungannya.'
    },
    {
      elemen: 'Geometri dan Pengukuran',
      subElemen: 'Pengukuran',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Pengukuran.',
      cakupan: [
        'Panjang benda menggunakan satuan baku & hubungan antar-satuan baku panjang (mm, dm, cm, m, dam, hm, km)',
        'Volume benda menggunakan satuan baku & hubungan antar-satuan baku volume (ml, dl, cl, l, dal, hl, kl)',
        'Berat benda menggunakan satuan baku & hubungan antar-satuan baku berat (mg, dg, cg, g, dag, hg, kg)',
        'Waktu & hubungan antar-satuan waktu (detik, menit, jam, hari, pekan, bulan, tahun)',
        'Laju perubahan (kecepatan)',
        'Keliling dan luas bangun datar (segitiga, segiempat, dan segi banyak)',
        'Volume bangun ruang (kubus, balok, dan gabungannya)',
        'Besar sudut',
        'Penaksiran ukuran'
      ],
      catatan: 'Konversi satuan baku, pengukuran bangun datar & ruang, laju perubahan kecepatan.'
    },
    {
      elemen: 'Data',
      subElemen: 'Penyajian dan Penggunaan Data',
      kompetensi: 'Memahami, mengaplikasikan, dan bernalar yang lebih tinggi untuk menyelesaikan permasalahan terkait Penyajian dan Penggunaan Data.',
      cakupan: [
        'Penyajian data (gambar, piktogram, diagram batang, dan tabel frekuensi)',
        'Pengambilan informasi dan penggunaan data'
      ],
      catatan: 'Membaca, menafsirkan, dan menganalisis sajian data piktogram/diagram/tabel.'
    }
  ],
  promptRules: `STANDAR DAN KAIDAH KHUSUS TKA NUMERASI (Matematika SD/MI/Sederajat):
- MUATAN & ELEMEN: Merujuk kurikulum (K13 & Kurikulum Merdeka) yang mencakup 3 elemen utama:
  1. Bilangan (Sub-elemen: Bilangan Rasional - pecahan senilai, urutan pecahan, desimal, persen, operasi cacah & pecahan, KPK & FPB).
  2. Geometri dan Pengukuran:
     - Objek Geometri (segitiga, segiempat, segi banyak; bangun ruang kubus, balok, gabungannya & visualisasi spasial depan/atas/samping).
     - Pengukuran (satuan baku panjang mm-km, volume ml-kl, berat mg-kg, waktu detik-tahun, kecepatan, keliling & luas, volume kubus/balok, besar sudut, penaksiran ukuran).
  3. Data (Sub-elemen: Penyajian dan Penggunaan Data - gambar/piktogram, diagram batang, tabel frekuensi, pengambilan info & analisis data).
- KONTEKS ASESMEN:
  Soal WAJIB disajikan melalui permasalahan dalam konteks matematika dan konteks kehidupan nyata peserta didik (personal, keluarga, sekolah, atau lingkungan sekitar).
- 5 KEMAMPUAN MATEMATIS YANG DIUKUR:
  Pastikan setiap butir soal mengukur salah satu dari: Pengetahuan matematika, Representasi matematis, Penalaran, Pemecahan masalah matematis, atau Koneksi matematis.`
};
