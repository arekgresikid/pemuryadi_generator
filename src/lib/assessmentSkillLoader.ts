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

  // 0. Pre-Reasoning Field Order Instruction (Autoregressive Alignment)
  sections.push(
    `- URUTAN BERPIKIR SEBELUM MENULIS SOAL (PRE-REASONING PROTOCOL): Untuk setiap butir soal di "soalList", Anda WAJIB menetapkan "levelKognitif" dan merumuskan "indikatorSoal" yang spesifik TERLEBIH DAHULU sebelum menulis kalimat "pertanyaan". Pastikan kalimat "pertanyaan" benar-benar mengeksekusi tuntutan berpikir pada "indikatorSoal" tersebut, bukan sekadar tempelan label.`
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
        `  1) FOKUS DOMAIN: Seluruh wacana dan butir soal WAJIB menguji Literasi Membaca Bahasa Indonesia (Teks Informasi Faktual & Teks Fiksi/Sastra sesuai matriks TKA ${jenjangUpper}). Abaikan mata pelajaran lain jika tidak relevan.\n` +
        `  2) STIMULUS WAJIB BERBOBOT: Setiap stimulus di "stimulusList" WAJIB memiliki panjang ${wordRange}, memuat beberapa paragraf utuh atau data informasi yang kaya, dan menaungi 3–5 butir soal.\n` +
        `  3) TIGA KOMPETENSI TKA LITERASI: Sebarkan soal (atau fokuskan sesuai level yang dipilih) pada: (a) Pemahaman Tekstual/Tersurat, (b) Pemahaman Inferensial (menyimpulkan ide pokok, kaitan sebab-akibat, makna ungkapan, perubahan karakter/latar yang tersirat), dan (c) Evaluasi & Apresiasi (menilai keakuratan fakta vs opini, kesesuaian antarunsur, relevansi kehidupan nyata, dan ketepatan penggunaan bahasa penulis).`
    );
  } else if (isTKANumerasi) {
    sections.push(
      `- ARSITEKTUR KHUSUS TKA NUMERASI (MATEMATIKA ${jenjangUpper}):\n` +
        `  1) FOKUS DOMAIN: Seluruh stimulus dan butir soal WAJIB menguji Numerasi / Matematika ${jenjangUpper} sesuai elemen resmi TKA (Bilangan, Aljabar, Geometri & Pengukuran, Data & Peluang${jenjangUpper.includes('SMA') || jenjangUpper.includes('SMK') ? ', serta Trigonometri' : ''}).\n` +
        `  2) STIMULUS DATA NUMERIK OTENTIK: Setiap stimulus di "stimulusList" WAJIB memuat data numerik nyata (rincian tabel angka, perbandingan skema harga/diskon/keuangan, ukuran bangun/denah, atau data statistik eksperimen) yang menaungi 3–5 soal.\n` +
        `  3) TUNTUTAN KOGNITIF NUMERASI: Pastikan soal tidak hanya menghitung rutin, melainkan menuntut pemodelan situasi nyata ke bentuk matematika (Applying) dan penalaran/evaluasi klaim matematis serta multi-step problem solving (Reasoning).`
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
  } else if (isCPNSTWK) {
    sections.push(
      `- ARSITEKTUR KHUSUS SELEKSI CPNS SKD - TES WAWASAN KEBANGSAAN (TWK):\n` +
        `  1) STANDAR REGULASI RESMI: Disusun mengacu pada KepmenPANRB No. 321/2024 (Passing Grade 65, Skor Benar = 5, Salah = 0, Pilihan Ganda Tunggal 5 Opsi A–E).\n` +
        `  2) RUANG LINGKUP 5 PILAR UTAMA RESMI TWK:\n` +
        `     a) Nasionalisme: Mampu mewujudkan kepentingan nasional melalui cita-cita dan tujuan yang sama dengan tetap mempertahankan identitas nasional (patriotisme, cinta tanah air, sejarah pergerakan nasional, kedaulatan bangsa di tengah percaturan global, dan menjaga persatuan dari ancaman disintegrasi).\n` +
        `     b) Integritas: Menjunjung tinggi kejujuran, ketangguhan, komitmen, dan konsistensi sikap bernegara, nilai integritas antikorupsi, transparansi birokrasi, serta keteladanan tokoh pejuang bangsa.\n` +
        `     c) Bela Negara: Berperan aktif mempertahankan eksistensi bangsa dan kedaulatan negara berdasarkan 5 Nilai Dasar Bela Negara (UU No. 23/2019): Cinta Tanah Air, Sadar Berbangsa & Bernegara, Setia pada Pancasila, Rela Berkorban, dan Memiliki Kemampuan Awal Bela Negara; menghadapi ancaman militer, non-militer, dan hibrida.\n` +
        `     d) Pilar Negara: Karakter positif melalui pemahaman & pengamalan nilai-nilai:\n` +
        `        - Pancasila: Falsafah, dasar negara, ideologi terbuka, butir pengamalan Sila 1 s.d. Sila 5, perumusan BPUPKI/PPKI.\n` +
        `        - UUD 1945: Pembukaan (makna alinea & pokok pikiran), Batang Tubuh amandemen I–IV (sistem ketatanegaraan, lembaga negara MPR, DPR, DPD, Presiden, MK, MA, KY, BPK, pemilu, HAM pasal 28A–J, pendidikan pasal 31, perekonomian pasal 33).\n` +
        `        - NKRI: Bentuk negara kesatuan, kedaulatan wilayah Deklarasi Djuanda, wawasan nusantara, otonomi daerah, sejarah diplomasi & perjuangan mempertahankan kemerdekaan (KMB, Linggarjati, Renville, Agresi Militer).\n` +
        `        - Bhinneka Tunggal Ika: Lambang Garuda Pancasila, Kitab Sutasoma karya Mpu Tantular, integrasi nasional, toleransi dan penanganan konflik multikultural.\n` +
        `     e) Bahasa Negara: Menggunakan Bahasa Indonesia sebagai bahasa persatuan (Pasal 36 UUD 1945, UU No. 24/2009). Menguji kaidah PUEBI/EYD V (huruf kapital, tanda baca, penulisan kata serapan/gabungan), kalimat efektif, ide pokok paragraf, simpulan bacaan, serta diksi baku kedinasan.\n` +
        `  3) PERBEDAAN TEGAS DENGAN TKP (DILARANG MEMBUAT SOAL BERGAYA TKP/SJT!):\n` +
        `     * PERINGATAN KERAS: TWK BUKAN TES KARAKTERISTIK PRIBADI ATAU SITUATIONAL JUDGEMENT TEST! DILARANG KERAS membuat pertanyaan bergaya "Sebagai seorang ASN, apa tindakan yang Anda ambil jika..." atau menanyakan respon perilaku pribadi!\n` +
        `     * BENTUK SOAL TWK: Soal TWK adalah tes kognitif/pengetahuan & analisis berbasis teks peristiwa, fakta sejarah, wacana ketatanegaraan, atau fenomena kebangsaan di mana pertanyaannya menguji pemahaman konsep konstitusi, butir Pancasila, unsur bela negara, atau kaidah bahasa. Contoh pola kalimat tanya TWK yang benar:\n` +
        `       - "Tindakan warga negara pada wacana di atas merupakan wujud pengamalan Pancasila, khususnya Sila..."\n` +
        `       - "Berdasarkan UUD 1945, kewenangan lembaga X dalam menyelesaikan sengketa tersebut adalah..."\n` +
        `       - "Unsur nilai dasar bela negara yang paling dominan tercermin pada peristiwa tersebut adalah..."\n` +
        `       - "Kalimat tidak efektif atau kesalahan tanda baca pada kutipan teks kedinasan di atas terdapat pada nomor..."\n` +
        `  4) SISTEM SKOR & KUNCI: Tepat HANYA 1 OPSI BENAR (skor 5 poin), dan 4 opsi lainnya salah (skor 0 poin). Kunci jawaban HANYA berisi 1 huruf (misal: "B" atau "B. Setia pada Pancasila sebagai ideologi negara"). DILARANG membuat bobot bertingkat 1-5 pada TWK!\n` +
        `  5) PEMBAHASAN: Uraikan landasan hukum, pasal UUD 1945, butir sila Pancasila, atau fakta sejarah yang menjadi dasar opsi benar.`
    );
  } else if (isCPNSTIU) {
    sections.push(
      `- ARSITEKTUR KHUSUS SELEKSI CPNS SKD - TES INTELIGENSI UMUM (TIU):\n` +
        `  1) STANDAR REGULASI RESMI: Disusun mengacu pada KepmenPANRB No. 321/2024 (Passing Grade 80, Skor Benar = 5, Salah = 0, Pilihan Ganda Tunggal 5 Opsi A–E).\n` +
        `  2) RUANG LINGKUP 3 KEMAMPUAN UTAMA RESMI TIU:\n` +
        `     a) Kemampuan Verbal:\n` +
        `        - Analogi: Mengukur penalaran melalui perbandingan dua konsep kata yang memiliki hubungan setara (A : B = C : D).\n` +
        `        - Silogisme: Menarik kesimpulan logis dari premis-premis (premis mayor dan minor, modus ponens/tollens/silogisme hipotesis atau kategoris dengan kata kuantor: semua, sebagian, tidak ada).\n` +
        `        - Penalaran Analitis: Menganalisis informasi kondisi batasan untuk menarik kesimpulan urutan posisi, jadwal kegiatan, atau perbandingan bertingkat.\n` +
        `     b) Kemampuan Numerik:\n` +
        `        - Berhitung Cepat: Operasi hitung bilangan pecahan, desimal, persentase, aljabar sederhana yang menuntut trik hitung efisien.\n` +
        `        - Deret Angka: Menemukan pola barisan angka (aritmetika, geometri, lompat selang-seling, Fibonacci, bertingkat).\n` +
        `        - Perbandingan Kuantitatif: Menentukan hubungan matematis antara dua besaran nilai x dan y (x > y, x < y, x = y, atau hubungan tidak dapat ditentukan).\n` +
        `        - Soal Cerita: Memodelkan situasi nyata matematis (kecepatan-jarak-waktu, perbandingan senilai/berbalik nilai, usia, aritmetika sosial untung-rugi-diskon, dan kerja bersama).\n` +
        `     c) Kemampuan Figural:\n` +
        `        - Analogi Gambar: Hubungan perubahan bentuk gambar A ke B setara dengan C ke D.\n` +
        `        - Ketidaksamaan Gambar: Mengidentifikasi 1 gambar yang tidak mengikuti pola/prinsip dari 5 gambar yang disajikan.\n` +
        `        - Serial Pola Gambar: Melanjutkan pola urutan transformasi visual berikutnya.\n` +
        `  3) FORMAT SOAL: Seluruh butir soal WAJIB memiliki tepat 1 jawaban pasti benar (skor 5) dan 4 opsi pengecoh yang masuk akal (skor 0). Rumusan soal to the point, padat informasi, bebas narasi basa-basi yang tidak relevan dengan logika/hitungan.\n` +
        `  4) PROTOKOL PRE-REASONING DI PEMBAHASAN: Pada field "pembahasan", jabarkan langkah pembuktian logika formal/matematis bertahap (premis silogisme, rumus hitung, pola deret angka, atau analisis aturan posisi) secara rinci dan bebas halusinasi.`
    );
  } else if (isCPNSTKP) {
    sections.push(
      `- ARSITEKTUR KHUSUS SELEKSI CPNS SKD - TES KARAKTERISTIK PRIBADI (TKP):\n` +
        `  1) STANDAR REGULASI RESMI: Disusun mengacu pada KepmenPANRB No. 321/2024 (Passing Grade 166, Pilihan Ganda 5 Opsi A–E dengan Skala Bobot 1 sampai 5 poin, TIDAK ADA nilai 0).\n` +
        `  2) RUANG LINGKUP 6 ASPEK PERILAKU ASN BERAKHLAK:\n` +
        `     a) Pelayanan Publik: Menampilkan keramahtamahan, empati, responsif terhadap kebutuhan masyarakat/pengguna layanan, mengutamakan kepuasan publik sesuai tupoksi wewenang, tidak emosional saat dikritik.\n` +
        `     b) Jejaring Kerja: Membangun hubungan kemitraan, kolaborasi tim kerja, bersedia berbagi informasi, dan menjaga hubungan profesional yang sehat antarpegawai/instansi.\n` +
        `     c) Sosial Budaya: Beradaptasi dan bekerja efektif di lingkungan kerja yang majemuk (beragam suku, agama, ras, dan budaya), menghormati perbedaan tanpa prasangka, inklusif terhadap rekan kerja.\n` +
        `     d) Teknologi Informasi & Komunikasi (TIK): Mampu memanfaatkan teknologi digital secara efektif untuk mempercepat kerja, antusias mempelajari sistem/aplikasi baru kedinasan, menjaga keamanan data kantor.\n` +
        `     e) Profesionalisme: Melaksanakan tugas dan fungsi sesuai standar jabatan, tuntas tugas tepat waktu, disiplin, mengutamakan tanggung jawab kedinasan di atas urusan pribadi, tidak mudah teralihkan.\n` +
        `     f) Anti-Radikalisme: Peka dan tanggap menjaring informasi terkait bahaya radikalisme, memegang teguh moderasi beragama, setia pada ideologi Pancasila dan kedaulatan NKRI, tidak mentolerir bibit intoleransi.\n` +
        `  3) KONSTRUKSI BUTIR SOAL SITUATIONAL JUDGEMENT TEST (SJT):\n` +
        `     * Setiap butir soal berupa skenario situasi dilema kerja/pelayanan/sosial yang dihadapi pegawai ASN.\n` +
        `     * Kalimat pertanyaan berupa: "Tindakan yang paling tepat Anda lakukan adalah..." atau "Sikap Anda dalam menghadapi situasi tersebut adalah..."\n` +
        `     * Seluruh 5 opsi jawaban (A, B, C, D, E) harus tampak wajar dan manusiawi dilakukan, namun merefleksikan gradasi kedewasaan perilaku dari bobot 1 (paling pasif/reaktif) hingga bobot 5 (paling proaktif, solutif, matang, dan berintegritas tinggi).\n` +
        `  4) ATURAN MUTLAK SKALA BOBOT 1–5 (NON-SEKUENSIAL):\n` +
        `     * DILARANG membuat urutan bobot sekuensial (seperti A=5, B=4, C=3, D=2, E=1). Sebar bobot secara alami dan acak pada setiap nomor (misal No 1: A=3, B=5, C=2, D=4, E=1; No 2: A=4, B=1, C=5, D=3, E=2).\n` +
        `     * Anda WAJIB mengisi field "skorOpsi" dengan bobot integer { "A": x, "B": y, "C": z, "D": w, "E": v } di mana nilai 1 s.d. 5 terdistribusi lengkap.\n` +
        `     * Field "kunci" WAJIB memuat rekapitulasi bobot (contoh: "A=3 | B=5 | C=2 | D=4 | E=1"). Field "skor" diisi "Skala 1 - 5".\n` +
        `  5) PEMBAHASAN: Uraikan analisis rubrik gradasi respon mengapa opsi berbobot 5 merupakan tindakan paling tepat dan sesuai dengan prinsip Core Values ASN BerAKHLAK.`
    );
  }

  // 2. Stimulus Budgeting Policy
  if (isLiveQuiz) {
    sections.push(
      `- KEBIJAKAN ANGGARAN STIMULUS (LIVE QUIZ): 90%–100% butir soal WAJIB berupa SOAL MANDIRI (Standalone) yang ringkas, padat, dan cepat dibaca (<25 kata) tanpa wacana panjang (biarkan "stimulusId" kosong ""). Opsi jawaban tepat 4 pilihan singkat.`
    );
  } else if (isAKM || isTKAAcademic) {
    const estimatedClusters = Math.max(1, Math.ceil(ctx.totalSoal / 4));
    sections.push(
      `- KEBIJAKAN STIMULUS BERSAMA (AKM / TKA CLUSTER): DILARANG membuat 1 wacana terpisah untuk setiap 1 soal! Buat sekitar ${estimatedClusters} Stimulus Induk di "stimulusList" (S1, S2, ...), di mana SETIAP 1 stimulus dipakai bersama oleh 3–5 soal berurutan. Pastikan setiap soal di bawah stimulus mengukur subkompetensi/level yang berbeda dan tidak saling membocorkan jawaban.`
    );
  } else if (isOlimpiade) {
    sections.push(
      `- KEBIJAKAN STIMULUS (OLIMPIADE SAINS): Fokus pada kepadatan informasi ilmiah/matematis dan skenario masalah non-rutin. Jangan menambahkan cerita naratif berbunga-bunga yang tidak dibutuhkan dalam perhitungan atau pembuktian.`
    );
  } else if (isCPNS) {
    sections.push(
      `- KEBIJAKAN STIMULUS CPNS SKD (STANDAR CAT BKN - WAJIB MURNI SOAL MANDIRI):\n` +
        `  * DILARANG KERAS MEMBUAT WACANA BERSAMA ("stimulusList")! Biarkan array "stimulusList": [] KOSONG!\n` +
        `  * 100% butir soal WAJIB berupa SOAL MANDIRI BERKONTEKS (seluruh narasi kasus/skenario masalah 2–5 kalimat ditulis LANGSUNG di dalam field "pertanyaan", dengan "stimulusId": "").\n` +
        `  * Opsi jawaban tepat 5 pilihan (A, B, C, D, E). DILARANG memecah skenario kasus menjadi stimulus wacana terpisah!`
    );
  } else if (!isSurvey) {
    const maxSharedGroups = ctx.totalSoal >= 30 ? 3 : ctx.totalSoal >= 15 ? 2 : 1;
    sections.push(
      `- KEBIJAKAN ANGGARAN STIMULUS (ANTI STIMULUS OVERLOAD 1–${ctx.totalSoal}): JANGAN membuat wacana/stimulus untuk semua nomor! Gunakan distribusi proporsional:\n` +
        `  1) Minimal 60%–70% butir soal WAJIB berupa SOAL MANDIRI (Standalone / kasus singkat 1–3 kalimat langsung di dalam "pertanyaan", dengan "stimulusId": "").\n` +
        `  2) Maksimal hanya boleh ada ${maxSharedGroups} wacana bersama di "stimulusList" (masing-masing untuk 3–5 soal kontekstual/HOTS).\n` +
        `  3) Jika "Terdapat Soal Bergambar" aktif (${ctx.jumlahSoalBergambar || 0} soal), hanya isi "gambarDeskripsi" pada tepat ${ctx.jumlahSoalBergambar || 0} nomor soal tersebut saja.`
    );
  }

  // 3. Strict HOTS Enforcement & Cognitive Task Design Repertoire
  const pureHOTS = isHOTSSelectionOnly(ctx.levelKognitif);
  const anyHOTS = hasAnyHOTSSelection(ctx.levelKognitif) || isOlimpiade;

  if (!isSurvey) {
    if (pureHOTS) {
      sections.push(
        `- MANDAT MUTLAK 100% HOTS MURNI (PENGGUNA MEMILIH MODE HOTS):\n` +
          `  * PERINGATAN KERAS: Pengunjung secara eksplisit meminta soal HOTS (${ctx.levelKognitif.join(', ')}). Anda DILARANG KERAS membuat soal hafalan (C1), pemahaman definisi langsung (C2), atau substitusi satu rumus rutin (C3)!\n` +
          `  * SELURUH 100% BUTIR SOAL (Nomor 1 s.d. Nomor ${ctx.totalSoal}) WAJIB berada pada level penalaran tingkat tinggi (C4 Menganalisis / C5 Mengevaluasi / C6 Mencipta, atau Level 3 Penalaran, atau SOLO Relasional / Abstrak Diperluas).\n` +
          `  * SETIAP BUTIR SOAL WAJIB menerapkan salah satu dari 5 Mekanika Kognitif HOTS berikut:\n` +
          `    1) Manipulasi Variabel / "What-If" Analysis (C4): Sajikan suatu kondisi/data/sistem, lalu ubah satu variabel kunci dan minta siswa menganalisis dampak berantainya.\n` +
          `    2) Evaluasi Klaim & Deteksi Kekeliruan / Error Analysis (C5): Sajikan dua pendapat, argumen, atau langkah penyelesaian yang saling bertentangan, lalu minta siswa mengevaluasi klaim mana yang valid/keliru beserta bukti logisnya.\n` +
          `    3) Sintesis Lintas-Data & Diagnosis Anomali (C4–C5): Sajikan perbandingan dua kasus/data/fenomena, lalu minta siswa menemukan pola hubungan sebab-akibat atau penyebab anomali yang tidak tertulis secara eksplisit.\n` +
          `    4) Keputusan Berbasis Trade-off Kriteria (C5): Minta siswa menentukan solusi/keputusan paling tepat di bawah minimal 2–3 syarat batasan yang saling mengunci (misal: efisiensi vs biaya vs dampak lingkungan/keamanan).\n` +
          `    5) Evaluasi Rancangan / Hipotesis Baru (C6): Minta siswa merancang atau memilih rancangan prosedur/model solusi baru yang memenuhi seluruh spesifikasi batasan.\n` +
          `  * ATURAN MUTLAK NO-LOOKUP (ANTI CTRL+F): Tidak boleh ada satu pun soal yang jawabannya bisa ditemukan hanya dengan menyalin kalimat dari teks bacaan! Siswa wajib mengolah bukti di soal dengan konsep ilmu untuk menjawab.\n` +
          `  * PEMBAHASAN WAJIB MENDALAM: Pada field "pembahasan", jabarkan: (a) Premis/Bukti Kunci pada Soal, (b) Langkah Penalaran Multi-Tahap (Step 1 -> Step 2 -> Kesimpulan), dan (c) Analisis Mengapa Pengecoh Salah.`
      );
    } else if (anyHOTS) {
      const targetHotsCount = Math.max(2, Math.ceil(ctx.totalSoal * 0.4));
      sections.push(
        `- KUOTA & MEKANIKA WAJIB SOAL HOTS (KOMBINASI LEVEL KOGNITIF):\n` +
          `  * Karena pilihan level kognitif mencakup unsur HOTS/Penalaran (${ctx.levelKognitif.join(', ')}), minimal ${targetHotsCount} dari ${ctx.totalSoal} butir soal WAJIB merupakan soal HOTS sejati (C4 Menganalisis / C5 Mengevaluasi / C6 Mencipta / Level 3 Penalaran / SOLO Relasional–Abstrak Diperluas).\n` +
          `  * Untuk setiap nomor yang berlabel C4/C5/C6/Level 3 Penalaran/Relasional/Abstrak Diperluas:\n` +
          `    - DILARANG membuat pertanyaan definisi/ingatan yang hanya diberi kalimat pembuka panjang (Pseudo-HOTS).\n` +
          `    - WAJIB menuntut manipulasi variabel (What-If), perbandingan dua data/kasus, evaluasi klaim yang mengandung kekeliruan, atau pengambilan keputusan berbasis kriteria.\n` +
          `    - Kunci jawaban DILARANG tertulis secara eksplisit/literal di dalam teks stimulus (No-Lookup / Anti Ctrl+F Rule).`
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
    `- REKAYASA PENGECOH (DISTRACTOR ENGINEERING) & ANTI TEST-WISENESS:\n` +
      `  * Setiap opsi pengecoh (pilihan salah) WAJIB dirancang dari jalur miskonsepsi yang masuk akal (salah konsep, salah langkah prosedur/perhitungan, atau salah tafsir data).\n` +
      `  * Panjang kalimat dan kerumitan bahasa pada semua opsi jawaban (A–D atau A–E) WAJIB setara/homogen (DILARANG membuat kunci jawaban tampak paling panjang atau paling lengkap sendirian).\n` +
      `  * Pastikan variasi kalimat tanya antar-nomor beragam (jangan mengulang pola kalimat yang sama berturut-turut).`
  );

  // 5. Level-Specific Safeguards (PAUD to SMK)
  if (isCPNS) {
    sections.push(
      `- STANDAR SASARAN CALON ASN: Target audiens adalah Sarjana / Profesional / Calon Aparatur Sipil Negara. Gunakan register bahasa birokrasi resmi, baku, profesional, dan menantang daya nalar tingkat tinggi.`
    );
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
