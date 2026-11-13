/**
 * Digen.id Runtime Assessment Skill Loader (v1.1.0)
 * Dynamically composes modular pedagogical instructions, stimulus budgeting policies,
 * Strict HOTS Enforcement (Anti-Pseudo-HOTS & Pre-Reasoning Contract), Official TKA Subtype
 * Architectures (Literasi, Numerasi, Bahasa Inggris, Sulingjar, Survei Karakter, Try Out),
 * and Distractor Engineering rules based on the active Assessment Contract.
 *
 * Invariant: Does NOT modify Subscription Tiers (Free, Guru Pertama, Guru Muda, Guru Madya, Guru Utama)
 * or alter any database/API contracts.
 */

export interface AssessmentSkillContext {
  jenjang: string;
  mapel: string;
  tipeUjian: string;
  subTipeUjian?: string;
  kerangkaTaksonomi: 'Bloom' | 'TKA' | 'SOLO' | string;
  levelKognitif: string[];
  totalSoal: number;
  terdapatSoalBergambar?: boolean;
  jumlahSoalBergambar?: number;
  hasInklusi?: boolean;
  tarafOlimpiade?: string;
}

export function isHOTSSelectionOnly(levels: string[]): boolean {
  if (!levels || levels.length === 0) return false;
  const hotsPatterns = /c4|c5|c6|hots|level 3|penalaran|relasional|relational|abstrak|extended/i;
  const lotsPatterns = /c1|c2|c3|level 1|level 2|pra-struktural|uni-struktural|multi-struktural/i;
  const hasHots = levels.some((l) => hotsPatterns.test(l));
  const hasLots = levels.some((l) => lotsPatterns.test(l));
  return hasHots && !hasLots;
}

export function hasAnyHOTSSelection(levels: string[]): boolean {
  if (!levels || levels.length === 0) return false;
  return levels.some((l) =>
    /c4|c5|c6|hots|level 3|penalaran|relasional|relational|abstrak|extended|kombinasi/i.test(l)
  );
}

export function buildRuntimeAssessmentSkillPrompt(ctx: AssessmentSkillContext): string {
  const sections: string[] = [];
  const sub = (ctx.subTipeUjian || '').trim();
  const jenjangUpper = (ctx.jenjang || 'SD').toUpperCase();

  // Detect exact exam family
  const isTKALiterasi = ctx.tipeUjian === 'Other' && sub === 'TKA Literasi';
  const isTKANumerasi = ctx.tipeUjian === 'Other' && sub === 'TKA Numerasi';
  const isTKAInggris = ctx.tipeUjian === 'Other' && sub === 'TKA Literasi Bahasa Inggris';
  const isSulingjar = ctx.tipeUjian === 'Other' && sub.includes('Survei Lingkungan Belajar');
  const isSurveiKarakter = ctx.tipeUjian === 'Other' && sub.includes('Survei Karakter');
  const isTryOut = ctx.tipeUjian === 'Other' && sub === 'Try Out';
  const isCPNSTWK = ctx.tipeUjian === 'Other' && sub.includes('CPNS SKD - TWK');
  const isCPNSTIU = ctx.tipeUjian === 'Other' && sub.includes('CPNS SKD - TIU');
  const isCPNSTKP = ctx.tipeUjian === 'Other' && sub.includes('CPNS SKD - TKP');
  const isCPNS = isCPNSTWK || isCPNSTIU || isCPNSTKP;
  const isSurvey = isSulingjar || isSurveiKarakter || isCPNSTKP;
  const isAKM = ctx.tipeUjian === 'Asesmen Nasional';
  const isTKAAcademic = isTKALiterasi || isTKANumerasi || isTKAInggris;
  const isLiveQuiz = ctx.tipeUjian === 'Live Quiz';
  const isOlimpiade = ctx.tipeUjian === 'Olimpiade';

  // 0. Panduan Konstruksi Soal yang Bersih & Fokus
  sections.push(
    `- PANDUAN KONSTRUKSI BUTIR SOAL: Rumuskan pertanyaan yang jelas, terukur, dan bermakna edukatif. Pastikan kalimat pertanyaan langsung menguji capaian pembelajaran tanpa bertele-tele.`
  );

  // 1. Dedicated Sub-Type Architecture for Tab "Other (TKA / Try Out)"
  if (isTKALiterasi) {
    const wordRange =
      jenjangUpper.includes('SMA') || jenjangUpper.includes('SMK')
        ? '250–300 kata'
        : jenjangUpper.includes('SMP')
        ? '200–250 kata'
        : '150–200 kata';
    sections.push(
      `- ARSITEKTUR KHUSUS TKA LITERASI (BAHASA INDONESIA ${jenjangUpper}):\n` +
        `  1) FOKUS DOMAIN & 3 HIRARKI RESMI: Seluruh wacana dan butir soal WAJIB menguji Literasi Membaca Bahasa Indonesia sesuai kisi-kisi resmi:\n` +
        `     a. Pemahaman Tekstual: Menyusun kembali informasi (ikhtisar/bagan), mengidentifikasi informasi tersurat, kosakata/istilah objek fiksi & nonfiksi.\n` +
        `     b. Pemahaman Inferensial: Makna ungkapan/idiom/peribahasa, menyimpulkan ide pokok/amanat/tokoh/nilai, perubahan objek/karakter/latar, prediksi kelanjutan kejadian sebab-akibat.\n` +
        `     c. Evaluasi dan Apresiasi: Menilai kesesuaian ilustrasi dengan teks, akurasi fakta vs opini, relevansi kehidupan nyata, serta merefleksi gaya bahasa/aspek kebahasaan penulis.\n` +
        `  2) ATURAN MUTLAK LARANGAN NOMOR INDEKS (..): DILARANG KERAS memunculkan nomor kurung seperti (1), (2), (13), dst. baik di dalam kalimat soal, pilihan jawaban, maupun indikatorSoal! Tulis indikator dan kalimat murni berbasis konsep operasional.\n` +
        `  3) VARIASI 4 BENTUK SOAL RESMI: Dalam satu paket soal, wajib hadirkan variasi seimbang dari 4 bentuk soal resmi TKA:\n` +
        `     - Pilihan Ganda (PG reguler 4 opsi A-D).\n` +
        `     - Pilihan Ganda Kompleks (PGK kotak centang, multi-jawaban benar).\n` +
        `     - Pernyataan Benar/Salah (tabel pernyataan baris dengan pilihan Benar / Salah).\n` +
        `     - Menjodohkan (pasangan premis wacana atau makna ungkapan dengan respon yang tepat).\n` +
        `  4) KOMBINASI SOAL BERBASIS STIMULUS & SOAL STANDALONE:\n` +
        `     - Soal Berbasis Stimulus (65%–75%): Mengacu pada teks stimulus di "stimulusList" (${wordRange}) yang menaungi 2–4 butir soal berurutan.\n` +
        `     - Soal Mandiri / Standalone (25%–35%): Soal to-the-point tanpa wacana panjang ("stimulusId": ""), misal menentukan makna ungkapan/peribahasa langsung, pembentukan kata baku, atau kelogisan kalimat.`
    );
  } else if (isTKANumerasi) {
    sections.push(
      `- ARSITEKTUR KHUSUS TKA NUMERASI (MATEMATIKA ${jenjangUpper}):\n` +
        `  1) FOKUS DOMAIN & 3 ELEMEN RESMI:\n` +
        `     a. Bilangan (Bilangan Rasional): Pecahan senilai, perbandingan & pengurutan berbagai bentuk bilangan (cacah, pecahan, desimal, persen), faktor & bilangan prima, operasi hitung empat angka, pemodelan matematika, diagram alir aritmetika, operasi hitung campuran pecahan & bilangan asli, persamaan sederhana, KPK & FPB.\n` +
        `     b. Geometri dan Pengukuran: Objek Geometri (ciri bangun datar, segi banyak tidak beraturan, konstruksi bangun ruang & visualisasi spasial tampak depan/atas/samping, segiempat/segitiga/lingkaran) serta Pengukuran (satuan baku panjang & berat, representasi visual volume, kesetimbangan neraca, durasi waktu jam analog, keliling & luas bangun datar gabungan segitiga/persegi panjang, besar sudut kontekstual).\n` +
        `     c. Data dan Ketidakpastian: Penyajian & penggunaan data (evaluasi kesalahan diagram batang, interpretasi tabel/diagram batang, analisis data kategori tertentu, pemecahan masalah kontekstual berbasis data).\n` +
        `  2) ATURAN MUTLAK LARANGAN NOMOR INDEKS (..): DILARANG KERAS memunculkan nomor kurung seperti (1), (2), (13), (26), dst. baik di dalam kalimat soal, pilihan jawaban, maupun indikatorSoal!\n` +
        `  3) VARIASI 4 BENTUK SOAL RESMI: Dalam satu paket soal, wajib hadirkan variasi seimbang dari 4 bentuk soal resmi TKA:\n` +
        `     - Pilihan Ganda (PG reguler 4 opsi A-D).\n` +
        `     - Pilihan Ganda Kompleks (PGK kotak centang, multi-jawaban benar).\n` +
        `     - Pernyataan Benar/Salah (tabel pernyataan verifikasi hitungan/klaim matematis dengan kolom Benar / Salah).\n` +
        `     - Menjodohkan (pasangan premis operasi/bangun/satuan dengan respon/nilai yang tepat).\n` +
        `  4) KOMBINASI SOAL BERBASIS STIMULUS & SOAL STANDALONE:\n` +
        `     - Soal Berbasis Stimulus (65%–75%): Mengacu pada stimulus data numerik di "stimulusList" (tabel angka kontekstual, denah/neraca, diagram batang) yang menaungi 2–4 butir soal.\n` +
        `     - Soal Mandiri / Standalone (25%–35%): Soal to-the-point tanpa wacana besar ("stimulusId": ""), seperti hitung cepat KPK/FPB, durasi jam analog, operasi pecahan senilai, atau identifikasi sifat bangun datar.`
    );
  } else if (isTKAInggris) {
    sections.push(
      `- ARSITEKTUR KHUSUS TKA LITERASI BAHASA INGGRIS (SMA/SMK - CEFR B1/B2):\n` +
        `  1) WAJIB BERBAHASA INGGRIS PENUH: Seluruh teks bacaan di "stimulusList" ("judul" dan "teks" sepanjang 250–350 kata), kalimat "pertanyaan", "opsiTambahan", dan "pernyataanBenarSalah" WAJIB ditulis dalam Bahasa Inggris akademik/kontekstual setara CEFR B1–B2 (Descriptive, Recount, Narrative, Procedure, Analytical/Hortatory Exposition, atau Discussion text).\n` +
        `  2) KOMPETENSI YANG DIUJI: Mencakup Textual Comprehension (detail eksplisit, klasifikasi), Inferential Comprehension (main idea, implied meaning, communicative purpose, author's tone/attitude, predicting outcomes), dan Evaluation & Appreciation (fact vs opinion, validity of arguments, real-life relevance).\n` +
        `  3) PEMBAHASAN DWI-BAHASA / JELAS: Bagian "pembahasan" dan "indikatorSoal" ditulis jelas (boleh menggunakan Bahasa Indonesia dengan kutipan bukti kalimat Bahasa Inggris dari teks).`
    );
  } else if (isSulingjar) {
    sections.push(
      `- ARSITEKTUR KHUSUS TKA SURVEI LINGKUNGAN BELAJAR (SULINGJAR):\n` +
        `  1) BUKAN TES HAFALAN MATA PELAJARAN: Jangan membuat soal rumus atau hafalan materi pelajaran! Instrumen ini adalah asesmen Situational Judgement Test (SJT) & evaluasi iklim satuan pendidikan sesuai standar Pusmendik.\n` +
        `  2) 5 DIMENSI UTAMA SULINGJAR YANG WAJIB DICAKUP:\n` +
        `     a) Iklim Keamanan Satuan Pendidikan (pencegahan & penanganan perundungan/bullying, kekerasan fisik/psikis, intoleransi).\n` +
        `     b) Iklim Kebinekaan & Inklusivitas (toleransi keberagaman latar belakang, ramah disabilitas/ABK, kesetaraan hak belajar).\n` +
        `     c) Kualitas Pembelajaran di Kelas (manajemen kelas positif, dukungan afektif guru, aktivasi kognitif & diskusi kritis).\n` +
        `     d) Refleksi & Perbaikan Pembelajaran (kolaborasi antarpendidik, umpan balik konstruktif).\n` +
        `     e) Kepemimpinan & Kebijakan Sekolah yang Berpihak pada Murid.\n` +
        `  3) KONSTRUKSI BUTIR & INTERPRETASI: Setiap soal menyajikan skenario kasus nyata di lingkungan sekolah. Pilihan jawaban merepresentasikan gradasi tindakan/kebijakan (dari yang kurang tepat hingga yang paling berpihak pada keselamatan, inklusivitas, dan kualitas belajar). Pada "pembahasan", jelaskan Pedoman Interpretasi Dimensi Sulingjar dan mengapa respons kunci mencerminkan iklim belajar yang positif.`
    );
  } else if (isSurveiKarakter) {
    sections.push(
      `- ARSITEKTUR KHUSUS TKA SURVEI KARAKTER:\n` +
        `  1) BUKAN TES AKADEMIK MATA PELAJARAN: Jangan membuat soal pengetahuan kognitif mapel! Instrumen ini mengukur kematangan karakter dan nilai etika peserta didik melalui studi kasus Dilema Moral & Situational Judgement Test (SJT).\n` +
        `  2) 6 DIMENSI KARAKTER UTAMA YANG WAJIB DICAKUP: (a) Beriman, Bertakwa, & Berakhlak Mulia (integritas, kejujuran, empati), (b) Berkebinekaan Global (menghargai perbedaan budaya/pendapat, anti-prasangka), (c) Bergotong Royong (kolaborasi, kepedulian sosial, berbagi beban kerja), (d) Mandiri (regulasi emosi, inisiatif, tanggung jawab atas kesalahan), (e) Bernalar Kritis (cek fakta sebelum menyebar informasi/hoaks, objektif), dan (f) Kreatif (mencari solusi alternatif yang konstruktif).\n` +
        `  3) KONSTRUKSI SKENARIO DILEMA NYATA: Sajikan dilema keseharian siswa (misal: konflik kerja kelompok, menemukan kecurangan teman dekat, perdebatan di media sosial, atau dilema tanggung jawab). Hindari opsi jawaban yang terlalu hitam-putih; buat seluruh opsi tampak wajar dilakukan siswa, di mana kunci jawaban mewakili kematangan karakter tertinggi. Pada "pembahasan", uraikan Rubrik Gradasi Karakter untuk setiap opsi.`
    );
  } else if (isTryOut) {
    sections.push(
      `- ARSITEKTUR KHUSUS TRY OUT KOMPREHENSIF:\n` +
        `  * Susun paket simulasi ujian standar yang mencakup lintas topik/materi esensial pada mata pelajaran ini secara menyeluruh, dengan tingkat kesulitan berjenjang menyerupai ujian akhir sesungguhnya.`
    );
  } else if (isOlimpiade) {
    const taraf = ctx.tarafOlimpiade || 'Kabupaten (OSN-K / SASMO)';
    sections.push(
      `- ARSITEKTUR KHUSUS OLIMPIADE SAINS & MATEMATIKA BERTAARAF NASIONAL & INTERNASIONAL:\n` +
        `  1) TARAF KOMPETISI: "${taraf.toUpperCase()}" (${jenjangUpper}).\n` +
        `     * Bobot soal, kedalaman abstraksi, dan kompleksitas analisis WAJIB disesuaikan ketat dengan taraf kompetisi ini.\n` +
        `     * Kabupaten (OSN-K / SASMO Foundation): Fondasi penalaran kompetisi, pemecahan masalah non-rutin awal, teka-teki logika, dan sifat-sifat dasar matematika/sains analitis.\n` +
        `     * Provinsi (OSN-P / AMC 10-12): Masalah multi-tahap tingkat lanjut dengan jebakan aljabar/konsep, keterkaitan antartopik, dan eliminasi kasus batas.\n` +
        `     * Nasional (OSN): Eksplorasi mendalam, pemodelan sistem fisika/biologi/kimia kompleks, geometri sintetis, dan pembuktian formal.\n` +
        `     * Internasional (IMO / IPhO / IChO / IBO / IOI / AIME / IJSO): Standar dunia, menuntut penemuan invarian, teorema lanjutan (AM-GM, Cauchy-Schwarz, Fermat, Ptolemy, Navier-Stokes/Gauss, CFT/Nernst, linkage/enzymatic kinetics), dan ketelitian tingkat tinggi.\n` +
        `  2) ATURAN MUTLAK ANTI PLUG-AND-CHUG (LARANGAN RUMUS INSTAN):\n` +
        `     * DILARANG KERAS membuat soal yang selesai hanya dengan memasukkan angka ke 1 rumus baku buku teks sekolah!\n` +
        `     * Setiap soal WAJIB menuntut minimal 3 lompatan penalaran: (a) Eksplorasi kondisi/invarian tersembunyi, (b) Transformasi pemodelan matematis/ilmiah, dan (c) Eksekusi perhitungan presisi serta eliminasi solusi semu.\n` +
        `  3) FORMAT ISIAN SINGKAT ANGKA BULAT (AIME / SASMO SECTION B STYLE):\n` +
        `     * Jika butir soal bertipe "Isian Singkat" atau terdapat petunjuk angka bulat, jawaban akhir WAJIB berupa BILANGAN BULAT NON-NEGATIF PASTI (misal: 42, 128, 750) atau format p+q pecahan paling sederhana, sehingga 100% kedap dari tebakan acak.\n` +
        `  4) REKAYASA PENGECOH JEBAKAN KOMPETISI OTENTIK (PILIHAN GANDA):\n` +
        `     * Pengecoh BUKAN angka acak! Wajib merefleksikan perangkap khas kompetisi: off-by-one error, kelalaian kasus batas/nol, solusi separuh jalan, atau pembalikan tanda/vektor.\n` +
        `  5) PEMBAHASAN NATURAL & JELAS: Tulis langkah penyelesaian secara runtut, logis, dan to-the-point menuju jawaban akhir tanpa berbelit-belit atau memecah pembahasan menjadi sub-paragraf kaku yang memicu halusinasi.\n` +
        `  6) NOTASI MATEMATIKA BERSIH & RAMAH BACA (UNICODE): Gunakan notasi matematika standar Indonesia dan simbol Unicode yang bersih (contoh: 1/a + 1/b = 11/12, a ≤ b ≤ c, x², √x, ±, ≥, ≤). DILARANG KERAS menggunakan kode pemrograman LaTeX mentah seperti \\[ ... \\], \\frac{a}{b}, \\qquad, atau tanda dolar $ matematika yang merusak tampilan cetak.`
    );
  } else if (isCPNSTWK) {
    sections.push(
      `- ARSITEKTUR KHUSUS SELEKSI CPNS SKD - TES WAWASAN KEBANGSAAN (TWK):\n` +
        `  1) STANDAR REGULASI RESMI: Disusun mengacu pada KepmenPANRB No. 321/2024 (Nilai Ambang Batas / Passing Grade: 65, Skor Benar = 5 poin, Salah = 0 poin, Pilihan Ganda 5 Opsi A–E).\n` +
        `  2) RUANG LINGKUP 5 PILAR UTAMA RESMI TWK (KEPMENPANRB NO. 321/2024):\n` +
        `     a) Nasionalisme: Mampu mewujudkan kepentingan nasional melalui cita-cita dan tujuan yang sama dengan tetap mempertahankan identitas nasional. Mencakup: sejarah pergerakan nasional (Boedi Oetomo, Sarekat Islam, Indische Partij, Sumpah Pemuda 1928, BPUPKI/PPKI), wawasan kebangsaan, kedaulatan bangsa di era globalisasi, patriotisme, dan menjaga integrasi dari ancaman disintegrasi bangsa.\n` +
        `     b) Integritas: Menjunjung tinggi kejujuran, ketangguhan moral, komitmen, dan konsistensi sikap bernegara. Mencakup: nilai integritas antikorupsi, ketentuan delik pidana UU Tipikor, sejarah kelembagaan pemberantasan korupsi, etika ketatanegaraan, transparansi birokrasi, serta keteladanan integritas tokoh bangsa (Bung Hatta, Baharuddin Lopa, Agus Salim, Hoegeng). CATATAN PENTING: Soal Integritas TWK menguji pengetahuan/analisis ketentuan hukum, sejarah, dan nilai moral tokoh bangsa, BUKAN menanyakan "Apa yang Anda lakukan jika diajak korupsi" (itu adalah ranah TKP)!\n` +
        `     c) Bela Negara: Berperan aktif mempertahankan eksistensi bangsa dan kedaulatan negara berdasarkan 5 Nilai Dasar Bela Negara (UU No. 23/2019): 1. Cinta Tanah Air, 2. Sadar Berbangsa & Bernegara, 3. Setia pada Pancasila sebagai Ideologi Negara, 4. Rela Berkorban untuk Bangsa & Negara, 5. Memiliki Kemampuan Awal Bela Negara. Menguji identifikasi wujud bela negara menghadapi ancaman militer, non-militer (ideologi, politik, ekonomi, sosial budaya, teknologi/siber), dan ancaman hibrida.\n` +
        `     d) Pilar Negara: Karakter positif melalui pemahaman & analisis mendalam:\n` +
        `        - Pancasila: Kedudukan & fungsi Pancasila (dasar negara, ideologi terbuka, pandangan hidup), butir-butir pengamalan Sila 1 s.d. Sila 5, perbandingan ideologi Pancasila vs Liberalisme vs Komunisme/Sosialisme.\n` +
        `        - UUD NRI 1945: Pembukaan UUD 1945 (makna alinea I-IV & pokok pikiran), Batang Tubuh Amandemen I–IV (sistem ketatanegaraan, kewenangan & tugas lembaga negara MPR, DPR, DPD, Presiden, MK, MA, KY, BPK, pemilu, HAM pasal 28A–J, pendidikan pasal 31, perekonomian pasal 33).\n` +
        `        - NKRI: Bentuk negara kesatuan (Pasal 1 ayat 1), Deklarasi Djuanda 13 Desember 1957, wawasan nusantara, otonomi daerah, sejarah perjuangan fisik & diplomasi kemerdekaan (Perjanjian Linggarjati, Renville, Roem-Royen, KMB 1949, Agresi Militer Belanda I & II).\n` +
        `        - Bhinneka Tunggal Ika: Asal-usul semboyan dari Kitab Kakawin Sutasoma karya Mpu Tantular, integrasi nasional, harmoni kemajemukan suku/agama/ras, dan resolusi konflik sosial multikultural.\n` +
        `     e) Bahasa Negara: Bahasa Indonesia sebagai bahasa resmi negara (Pasal 36 UUD 1945, UU No. 24/2009). Menguji: kaidah Ejaan Bahasa Indonesia yang Disempurnakan (EYD Edisi V / PUEBI: huruf kapital, tanda baca koma/titik dua/titik koma/hubung, penulisan kata baku/serapan/gabungan), kalimat efektif (kesepadanan, keparalelan, kehematan, kelogisan), ide pokok & simpulan paragraf teks kedinasan, serta pilihan kata (diksi) resmi.\n` +
        `  3) LARANGAN KERAS TWK BERUBAH MENJADI TKP (ANTI-SJT MANDATE):\n` +
        `     * PERINGATAN MUTLAK: TWK BUKAN TES KARAKTERISTIK PRIBADI (TKP) DAN BUKAN SITUATIONAL JUDGEMENT TEST (SJT)!\n` +
        `     * DILARANG KERAS menggunakan sudut pandang orang pertama atau orang kedua ('Anda', 'sikap Anda', 'tindakan Anda', 'sebagai seorang ASN apa yang Anda lakukan', 'bagaimana reaksi Anda').\n` +
        `     * DILARANG membuat soal yang menguji respon perilaku, preferensi kepribadian, atau dilema moral pribadi calon pegawai!\n` +
        `     * WAJIB MENGGUNAKAN SUDUT PANDANG OBJEKTIF / ORANG KETIGA: Pertanyaan menguji pemahaman konsep, pasal konstitusi, peristiwa sejarah, analisis wacana, atau kaidah bahasa.\n` +
        `     * CONTOH POLA PERTANYAAN TWK RESMI CAT BKN YANG BENAR:\n` +
        `       - 'Peristiwa pengibaran bendera Merah Putih di Hotel Yamato Surabaya pada tanggal 19 September 1945 merupakan cerminan dari semangat...'\n` +
        `       - 'Berdasarkan UUD NRI Tahun 1945 Pasal 23E, lembaga yang berwenang memeriksa pengelolaan dan tanggung jawab tentang keuangan negara adalah...'\n` +
        `       - 'Wacana aksi gotong royong pemuda membersihkan sampah sungai pada bacaan di atas mencerminkan pengamalan Pancasila, khususnya Sila...'\n` +
        `       - 'Pernyataan berikut yang paling tepat menggambarkan kedudukan Deklarasi Djuanda bagi kedaulatan wilayah perairan Republik Indonesia adalah...'\n` +
        `       - 'Penggunaan tanda baca yang TIDAK sesuai dengan ketentuan EYD Edisi V terdapat pada kalimat...'\n` +
        `  4) SISTEM SKOR & KUNCI: Tepat HANYA 1 OPSI BENAR (skor 5 poin), dan 4 opsi lainnya salah (skor 0 poin). Kunci jawaban HANYA berupa 1 huruf kapital (misal: 'B' atau 'B. Pasal 24C UUD 1945'). DILARANG membuat bobot bertingkat 1-5 pada TWK!`
    );
  } else if (isCPNSTIU) {
    sections.push(
      `- ARSITEKTUR KHUSUS SELEKSI CPNS SKD - TES INTELIGENSI UMUM (TIU):\n` +
        `  1) STANDAR REGULASI RESMI: Disusun mengacu pada KepmenPANRB No. 321/2024 (Nilai Ambang Batas / Passing Grade: 80, Skor Benar = 5 poin, Salah = 0 poin, Pilihan Ganda 5 Opsi A–E).\n` +
        `  2) RUANG LINGKUP 3 DOMAIN RESMI TIU:\n` +
        `     a) Kemampuan Verbal:\n` +
        `        - Analogi Kata: Mengukur penalaran melalui perbandingan dua konsep kata yang memiliki hubungan setara (Format standar: KATA 1 : KATA 2 = KATA 3 : KATA 4).\n` +
        `        - Silogisme: Penarikan kesimpulan logis dan mutlak dari premis-premis (premis mayor dan minor, modus ponens/tollens/silogisme hipotesis atau kategoris dengan kuantor: semua, sebagian/beberapa, tidak ada).\n` +
        `        - Penalaran Analitis: Menganalisis kondisi batasan untuk menarik kesimpulan urutan posisi, antrean, jadwal kegiatan, atau perbandingan ranking bertingkat.\n` +
        `     b) Kemampuan Numerik:\n` +
        `        - Berhitung Cepat: Operasi hitung bilangan pecahan, desimal, persentase, aljabar sederhana yang menuntut trik hitung efisien.\n` +
        `        - Deret Angka: Menemukan pola barisan angka logis (aritmetika, geometri, lompat selang-seling, Fibonacci, bertingkat).\n` +
        `        - Perbandingan Kuantitatif: Menentukan hubungan matematis antara dua besaran nilai x dan y (Opsi: A. x > y, B. x < y, C. x = y, D. 2x = y, E. Hubungan x dan y tidak dapat ditentukan).\n` +
        `        - Soal Cerita: Memodelkan situasi nyata matematis (kecepatan-jarak-waktu menyusul/berpapasan, perbandingan senilai/berbalik nilai, usia, aritmetika sosial untung-rugi-diskon, dan kerja bersama 1/t = 1/t1 + 1/t2).\n` +
        `     c) Kemampuan Figural: Analogi gambar (A:B = C:D), Ketidaksamaan gambar (mencari 1 gambar yang berbeda pola dari 5 gambar), dan Serial pola gambar (kelanjutan transformasi visual).\n` +
        `  3) FORMAT SOAL: Seluruh butir soal WAJIB memiliki tepat 1 jawaban pasti benar (skor 5) dan 4 opsi salah yang terukur (skor 0). Rumusan soal to the point, padat informasi, bebas narasi basa-basi.\n` +
        `  4) PROTOKOL PEMBAHASAN: Pada field 'pembahasan', jabarkan langkah pembuktian logika formal/matematis bertahap (premis silogisme, rumus hitung, pola deret angka, atau analisis aturan posisi) secara rinci.`
    );
  } else if (isCPNSTKP) {
    sections.push(
      `- ARSITEKTUR KHUSUS SELEKSI CPNS SKD - TES KARAKTERISTIK PRIBADI (TKP):\n` +
        `  1) STANDAR REGULASI RESMI: Disusun mengacu pada KepmenPANRB No. 321/2024 (Nilai Ambang Batas / Passing Grade: 166, Pilihan Ganda 5 Opsi A–E dengan Skala Bobot Bertingkat 1 sampai 5 poin, TIDAK ADA nilai 0).\n` +
        `  2) RUANG LINGKUP 6 ASPEK PERILAKU ASN BERAKHLAK:\n` +
        `     a) Pelayanan Publik: Keramahan, empati, responsif terhadap kebutuhan masyarakat/pengguna layanan, mengutamakan kepuasan publik sesuai tupoksi wewenang, tidak emosional saat dikritik.\n` +
        `     b) Jejaring Kerja: Membangun hubungan kemitraan, kolaborasi tim kerja, bersedia berbagi informasi, dan menjaga hubungan profesional yang sehat antarpegawai/instansi.\n` +
        `     c) Sosial Budaya: Beradaptasi dan bekerja efektif di lingkungan kerja yang majemuk (beragam suku, agama, ras, dan budaya), menghormati perbedaan tanpa prasangka, inklusif terhadap rekan kerja.\n` +
        `     d) Teknologi Informasi & Komunikasi (TIK): Mampu memanfaatkan teknologi digital secara efektif untuk mempercepat kerja, antusias mempelajari sistem/aplikasi baru kedinasan, menjaga keamanan data kantor.\n` +
        `     e) Profesionalisme: Melaksanakan tugas dan fungsi sesuai standar jabatan, tuntas tugas tepat waktu, disiplin, mengutamakan tanggung jawab kedinasan di atas urusan pribadi, tidak mudah teralihkan.\n` +
        `     f) Anti-Radikalisme: Peka dan tanggap menjaring informasi terkait bahaya radikalisme, memegang teguh moderasi beragama, setia pada ideologi Pancasila dan kedaulatan NKRI, tidak mentolerir bibit intoleransi.\n` +
        `  3) FORMAT MURNI SITUATIONAL JUDGEMENT TEST (SJT):\n` +
        `     * Kalimat soal menyajikan skenario dilema kedinasan orang kedua ('Anda') yang dihadapi calon ASN di tempat kerja/pelayanan.\n` +
        `     * Pertanyaan berupa: 'Tindakan yang paling tepat Anda lakukan adalah...' atau 'Sikap Anda dalam menghadapi situasi tersebut adalah...'\n` +
        `     * Seluruh 5 pilihan jawaban merefleksikan gradasi kedewasaan perilaku dari bobot 1 (paling pasif/reaktif) hingga bobot 5 (paling proaktif, solutif, matang, dan berintegritas tinggi).\n` +
        `  4) ATURAN MUTLAK SKALA BOBOT 1–5 (NON-SEKUENSIAL):\n` +
        `     * DILARANG membuat urutan bobot berurutan (seperti A=5, B=4, C=3, D=2, E=1). Sebar bobot secara alami dan acak pada setiap nomor (misal No 1: A=3, B=5, C=2, D=4, E=1; No 2: A=4, B=1, C=5, D=3, E=2).\n` +
        `     * WAJIB mengisi field 'skorOpsi' dengan bobot integer { 'A': x, 'B': y, 'C': z, 'D': w, 'E': v } di mana nilai 1 s.d. 5 terdistribusi lengkap.\n` +
        `     * Field 'kunci' WAJIB memuat rekapitulasi bobot (contoh: 'A=3 | B=5 | C=2 | D=4 | E=1'). Field 'skor' diisi 'Skala 1 - 5'.\n` +
        `  5) PEMBAHASAN: Uraikan analisis rubrik gradasi respon mengapa opsi berbobot 5 merupakan tindakan paling tepat dan sesuai dengan prinsip Core Values ASN BerAKHLAK.`
    );
  }

  // 2. Stimulus Policy (Tegas & Tanpa Kontradiksi)
  if (isLiveQuiz || ctx.tipeUjian === 'Ujian Biasa') {
    sections.push(
      `- KEBIJAKAN SOAL MANDIRI (STANDALONE): Seluruh butir soal WAJIB berupa SOAL MANDIRI yang to the point dan kontekstual tanpa wacana bacaan bersama ("stimulusList": [] KOSONG, dan "stimulusId": ""). Deskripsi, data, atau skenario masalah ditulis langsung di dalam field "pertanyaan" masing-masing nomor.`
    );
  } else if (isTKAAcademic) {
    const estimatedClusters = Math.max(1, Math.ceil((ctx.totalSoal * 0.7) / 3));
    sections.push(
      `- KEBIJAKAN STIMULUS HYBRID (TKA KISI-KISI RESMI: STIMULUS CLUSTER + STANDALONE):\n` +
        `  * Kelompokkan sekitar 65%–75% butir soal ke dalam ${estimatedClusters} Stimulus Induk di "stimulusList" (S1, S2, ...), di mana setiap stimulus menaungi 2–4 butir soal beragam bentuk (PG, PGK, Benar/Salah, Menjodohkan) dengan "stimulusId" terisi.\n` +
        `  * Sisanya sekitar 25%–35% butir soal WAJIB berupa SOAL MANDIRI / STANDALONE ("stimulusId": "") yang to-the-point langsung menguji konsep operasional tanpa wacana pengantar panjang.`
    );
  } else if (isAKM) {
    const estimatedClusters = Math.max(1, Math.ceil(ctx.totalSoal / 4));
    sections.push(
      `- KEBIJAKAN STIMULUS BERSAMA (AKM CLUSTER): Kelompokkan soal ke dalam sekitar ${estimatedClusters} Stimulus Induk di "stimulusList" (S1, S2, ...), di mana setiap 1 stimulus dipakai bersama oleh 3–5 soal berurutan. Setiap butir soal mengukur kompetensi yang berbeda dan mengisi "stimulusId" sesuai id stimulus.`
    );
  } else if (isOlimpiade) {
    sections.push(
      `- KEBIJAKAN STIMULUS (OLIMPIADE SAINS): Fokus pada skenario masalah non-rutin, kepadatan data matematis/ilmiah presisi, kondisi batas, dan struktur invarian tanpa basa-basi naratif.`
    );
  } else if (isCPNS) {
    if (isCPNSTWK) {
      sections.push(
        `- KEBIJAKAN STIMULUS TWK CPNS (STANDAR CAT BKN - SOAL KOGNITIF MANDIRI):\n` +
          `  * DILARANG KERAS MEMBUAT WACANA BERSAMA ("stimulusList")! Biarkan array "stimulusList": [] KOSONG!\n` +
          `  * 100% butir soal WAJIB berupa SOAL KOGNITIF MANDIRI OBJEKTIF: Teks wacana peristiwa sejarah/hukum konstitusi/fakta kebangsaan/teks kedinasan 1–3 kalimat ditulis LANGSUNG di dalam field "pertanyaan" dengan sudut pandang orang ketiga. DILARANG menggunakan kata 'Anda' atau menanyakan respon perilaku pribadi!\n` +
          `  * Opsi jawaban tepat 5 pilihan (A, B, C, D, E) dengan 1 KUNCI BENAR (5 POIN) dan 4 OPSI SALAH (0 POIN).`
      );
    } else if (isCPNSTIU) {
      sections.push(
        `- KEBIJAKAN STIMULUS TIU CPNS (STANDAR CAT BKN - SOAL LOGIKA/NUMERIK MANDIRI):\n` +
          `  * DILARANG KERAS MEMBUAT WACANA BERSAMA ("stimulusList")! Biarkan array "stimulusList": [] KOSONG!\n` +
          `  * 100% butir soal ditulis to the point langsung di dalam field "pertanyaan" (analogi kata, premis silogisme, batasan kondisi analitis, deret angka, soal cerita matematis, atau pola figural).\n` +
          `  * Opsi jawaban tepat 5 pilihan (A, B, C, D, E) dengan 1 KUNCI BENAR (5 POIN) dan 4 OPSI SALAH (0 POIN).`
      );
    } else if (isCPNSTKP) {
      sections.push(
        `- KEBIJAKAN STIMULUS TKP CPNS (STANDAR CAT BKN - SKENARIO DILEMA SJT MANDIRI):\n` +
          `  * DILARANG MEMBUAT WACANA BERSAMA ("stimulusList")! Biarkan array "stimulusList": [] KOSONG!\n` +
          `  * 100% butir soal berupa SKENARIO DILEMA PELAYANAN/KERJA BIROKRASI yang ditulis LANGSUNG di dalam field "pertanyaan" dengan sudut pandang orang kedua ('Anda') dan menanyakan tindakan/sikap terbaik yang Anda ambil.\n` +
          `  * Opsi jawaban tepat 5 pilihan (A, B, C, D, E) dengan SKALA BOBOT 1 SAMPAI 5 POIN (TIDAK ADA NILAI 0).`
      );
    }
  }

  // 3. HOTS Guidance & Cognitive Task Design (Proporsional Sesuai Jenjang)
  const pureHOTS = isHOTSSelectionOnly(ctx.levelKognitif);
  const anyHOTS = hasAnyHOTSSelection(ctx.levelKognitif) || isOlimpiade;

  if (!isSurvey && !isCPNS) {
    if (pureHOTS) {
      sections.push(
        `- PANDUAN SOAL HOTS (PENALARAN TINGKAT TINGGI):\n` +
          `  * Fokuskan butir soal pada level penalaran/analisis (C4–C6 / Level 3 TKA / SOLO Relasional-Abstrak) sesuai usia dan jenjang ${jenjangUpper}.\n` +
          `  * Terapkan konteks nyata pemecahan masalah: analisis hubungan sebab-akibat, evaluasi klaim/kondisi, atau penyelesaian multi-langkah.\n` +
          `  * Berikan pembahasan yang menjelaskan alur pemikiran dan justifikasi jawaban yang benar.`
      );
    } else if (anyHOTS) {
      sections.push(
        `- PANDUAN LEVEL KOGNITIF:\n` +
          `  * Sebarkan tingkat kesulitan secara seimbang (${ctx.levelKognitif.join(', ')}). Sertakan variasi soal pemahaman konsep, aplikasi kontekstual, dan penalaran analitis yang sesuai jenjang ${jenjangUpper}.`
      );
    }

    if (ctx.kerangkaTaksonomi === 'SOLO') {
      sections.push(
        `- OPERASIONALISASI TAKSONOMI SOLO:\n` +
          `  * Uni-struktural: Mengidentifikasi 1 aspek tunggal yang relevan.\n` +
          `  * Multi-struktural: Mengidentifikasi >= 2 aspek terpisah yang relevan.\n` +
          `  * Relasional: Mengintegrasikan hubungan sebab-akibat/struktural antar-beberapa aspek menjadi kesimpulan utuh.\n` +
          `  * Abstrak Diperluas: Menggeneralisasi prinsip ke situasi/konteks baru atau mengevaluasi hipotesis.`
      );
    } else if (ctx.kerangkaTaksonomi === 'TKA') {
      sections.push(
        `- OPERASIONALISASI 3 LEVEL KOGNITIF STANDAR TKA:\n` +
          `  * Level 1 - Pengetahuan & Pemahaman (Knowing & Understanding): Mengidentifikasi informasi tersurat, mengenali konsep/fakta dasar, atau membaca nilai langsung dari tabel/grafik.\n` +
          `  * Level 2 - Aplikasi (Applying): Menyimpulkan informasi tersirat (inferensial), menerapkan konsep/rumus ke masalah kontekstual, atau memodelkan situasi nyata.\n` +
          `  * Level 3 - Penalaran (Reasoning / HOTS): Mengevaluasi kevalidan klaim/argumen, menganalisis hubungan multi-konsep pada situasi baru, melakukan generalisasi, dan memberikan justifikasi berbasis bukti.`
      );
    }
  }

  // 4. Distractor Engineering & Cognitive Diversity
  sections.push(
    `- REKAYASA PENGECOH (DISTRACTOR ENGINEERING):\n` +
      `  * Setiap pilihan salah dirancang masuk akal (miskonsepsi umum atau kekeliruan perhitungan lazim).\n` +
      `  * Panjang kalimat dan tata bahasa opsi A–D / A–E dibuat proporsional dan homogen.`
  );

  // 5. Level-Specific Safeguards (PAUD to CPNS)
  if (isCPNS) {
    if (isCPNSTWK) {
      sections.push(
        `- STANDAR SASARAN TWK CPNS: Target audiens adalah Calon ASN yang diuji wawasan kebangsaan, pemahaman konstitusi, dan penalaran materi 5 Pilar Kebangsaan secara akademis, objektif, dan terstandar CAT BKN.`
      );
    } else if (isCPNSTIU) {
      sections.push(
        `- STANDAR SASARAN TIU CPNS: Target audiens adalah Calon ASN yang diuji kecerdasan logika deduktif-induktif, kecepatan numerik, dan ketelitian spasial-figural secara objektif.`
      );
    } else if (isCPNSTKP) {
      sections.push(
        `- STANDAR SASARAN TKP CPNS: Target audiens adalah Calon ASN yang dinilai kematangan kepribadian, integritas moral, orientasi pelayanan publik, dan keselarasan dengan Core Values ASN BerAKHLAK melalui Situational Judgement Test.`
      );
    }
  } else if (jenjangUpper === 'PAUD' || jenjangUpper === 'TK') {
    sections.push(
      `- PENGAMANAN KHUSUS PAUD (FASE FONDASI): Fokus pada asesmen perkembangan autentik melalui aktivitas bermain konkret, pengenalan pola/warna/bentuk, pemantik lisan guru, dan indikator perilaku teramati.`
    );
  } else if (jenjangUpper === 'SMK' && !isSurvey) {
    sections.push(
      `- KONTEKS KEJURUAN SMK (DUDI): Kaitkan studi kasus soal dengan dunia kerja/industri, penerapan SOP, analisis keselamatan kerja (K3), atau troubleshooting praktis sesuai konteks mata pelajaran.`
    );
  }

  return '\n' + sections.join('\n');
}
