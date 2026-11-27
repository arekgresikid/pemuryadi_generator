/**
 * Digen.id Runtime Assessment Skill Loader (v2.0.0)
 * Dynamically composes modular pedagogical instructions, stimulus budgeting policies,
 * Strict HOTS Enforcement (Anti-Pseudo-HOTS & Operational Cognitive Repertoire),
 * Official TKA/AKM/Olimpiade/Ujian Biasa Architectures, Misconception-Driven Distractors,
 * Key Balancing, and Document Attachment Priority rules.
 *
 * Invariant: Does NOT modify Subscription Tiers or alter any database/API contracts.
 */

export interface AssessmentSkillContext {
  jenjang: string;
  fase?: string;
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
  hasReferenceFiles?: boolean;
}

export function isEnglishAssessment(ctx: { mapel?: string; tipeUjian?: string; subTipeUjian?: string }): boolean {
  const m = String(ctx.mapel || '').toLowerCase();
  const sub = String(ctx.subTipeUjian || '').trim();
  return m === 'bahasa-inggris' || (ctx.tipeUjian === 'Other' && sub === 'TKA Literasi Bahasa Inggris');
}

export function getEnglishCEFRBand(jenjang: string, fase?: string): string {
  const j = (jenjang || '').toUpperCase();
  const f = (fase || '').toUpperCase();
  if (j.includes('SMA') || j.includes('SMK') || j.includes('MA') || f === 'E' || f === 'F') {
    return 'CEFR B1–B2 (Academic & Workplace English: Analytical/Hortatory Exposition, Discussion, Report, Procedure, Narrative, News Item)';
  }
  if (j.includes('SMP') || j.includes('MTS') || f === 'D') {
    return 'CEFR A2–B1 (Junior High English: Descriptive, Recount, Narrative, Procedure, Notice/Announcement, Functional Dialogues)';
  }
  if (f === 'C') {
    return 'CEFR A1–A2 (Upper Elementary English: Short Contextual Dialogues, Daily Activities, Simple Descriptive & Functional Texts)';
  }
  return 'CEFR Pre-A1 – A1 (Elementary English: Clear Simple Sentences, Everyday Vocabulary, Short Greetings & Basic Dialogues)';
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

/**
 * Membangun System Instruction terdedikasi agar model AI memprioritaskan
 * ketajaman kognitif, akurasi pengecoh, keseimbangan kunci, serta kepatuhan pada lampiran.
 */
export function buildAssessmentSystemInstruction(ctx: AssessmentSkillContext): string {
  const jenjangUpper = (ctx.jenjang || 'SD').toUpperCase();
  const tipe = ctx.tipeUjian === 'Other' && ctx.subTipeUjian ? `${ctx.tipeUjian} (${ctx.subTipeUjian})` : ctx.tipeUjian;
  const isEnglish = isEnglishAssessment(ctx);
  const cefrBand = isEnglish ? getEnglishCEFRBand(ctx.jenjang, ctx.fase) : '';

  return `PERAN & OTORITAS:
Anda adalah Tim Pakar Pengembang Instrumen Asesmen Pendidikan Nasional (Pusmendik Kemendikbudristek & Standar Evaluasi Kurikulum Merdeka) untuk jenjang ${jenjangUpper}, tipe asesmen ${tipe}.

PRINSIP MUTLAK KUALITAS BUTIR SOAL (TIDAK BOLEH DILANGGAR):
1. ANTI SOAL RECEH & ANTI PSEUDO-HOTS:
   - Setiap butir soal WAJIB menguji pemahaman konseptual, aplikasi terukur, atau penalaran analitis yang sepadan dengan jenjang ${jenjangUpper}.
   - DILARANG membuat soal hafalan dangkal yang bisa dijawab tanpa berpikir, menyalin definisi buku mentah, atau sekadar menempel kata "Analisislah/Evaluasilah" pada pertanyaan ingatan sederhana (Pseudo-HOTS).
   - Untuk soal C4–C6 / Level 3 / Relasional-Abstrak, terapkan NO-LOOKUP RULE (Anti-Ctrl+F): jawaban tidak boleh tertulis secara literal di stimulus/pertanyaan; siswa wajib mengolah, membandingkan, atau menarik inferensi.
2. REKAYASA PENGECOH BERBASIS MISKONSEPSI (MISCONCEPTION-DRIVEN DISTRACTORS):
   - Pilihan jawaban salah (pengecoh) WAJIB masuk akal dan merepresentasikan miskonsepsi umum siswa, kesalahan konversi satuan, kekeliruan langkah hitung separuh jalan, atau generalisasi parsial.
   - DILARANG membuat opsi konyol, opsi terlalu mencolok salahnya, atau opsi "Semua jawaban benar/salah".
   - Panjang kalimat dan gaya bahasa seluruh opsi A–D / A–E WAJIB homogen (Anti Longest-Key Bias: jangan membuat kunci selalu paling panjang).
3. PROTOKOL KESEIMBANGAN KUNCI (KEY BALANCING):
   - Pada soal Pilihan Ganda, distribusikan kunci jawaban secara acak dan merata di seluruh huruf opsi (A, B, C, D — dan E bila 5 opsi). DILARANG menumpuk mayoritas kunci di huruf A atau B.
4. VERIFIKASI MANDIRI:
   - Pastikan secara objektif hanya ada TEPAT 1 kunci benar pada Pilihan Ganda reguler, semua hitungan matematika/sains 100% presisi, dan gunakan notasi Unicode bersih (x², √, ≤, ≥, ×, ÷) tanpa sintaks LaTeX mentah.
5. ANTI-TEMPLATE VISUAL & SINKRONISASI GAMBAR:
   - DILARANG KERAS menyalin topik visual klise lintas-mapel (seperti rantai makanan padi-belalang-katak-ular atau grafik titik koordinat kartesius generik) apabila tidak relevan langsung dengan mata pelajaran dan materi yang diminta!
   - Hanya tulis rujukan visual (${isEnglish ? '"Look at the picture/diagram..."' : '"Perhatikan gambar/diagram berikut..."'}) pada nomor soal yang memang ditugaskan memiliki "gambarDeskripsi". Pada nomor tanpa gambar, DILARANG merujuk ke gambar yang tidak ada.
   - Jangan memaksakan atribut warna bila soal tidak menanyakan warna. Namun SAAT butir soal atau pilihan jawaban memuat warna tertentu, WAJIB cantumkan warna tersebut beserta label teks warna yang sesuai (${isEnglish ? 'contoh: label teks "Blue"' : 'contoh: teks "Biru"'}) di dalam "gambarDeskripsi".
${isEnglish ? `6. STRICT 100% FULL-ENGLISH STUDENT PAPER MANDATE (ALL LEVELS — ZERO INDONESIAN ALLOWED):
   - Mata pelajaran aktif adalah BAHASA INGGRIS (${jenjangUpper}${ctx.fase ? ` / Fase ${ctx.fase}` : ''} — ${cefrBand}).
   - SELURUH teks yang dilihat siswa WAJIB 100% dalam BAHASA INGGRIS alami dan gramatikal: "stimulusList" ("judul" & "teks"), "pertanyaan", "opsiTambahan", "pernyataanBenarSalah" ("pernyataan" dalam Bahasa Inggris & "kunci" WAJIB "True" atau "False"), "pasanganMenjodohkan" ("kiri" & "kanan"), "soalABKList", serta "kunci" jawaban!
   - DILARANG KERAS menyelipkan SATU KATA PUN Bahasa Indonesia ke dalam naskah soal siswa (JANGAN menulis "Perhatikan dialog berikut...", "Bacalah teks...", "Manakah pernyataan yang benar...", "Artikan...", atau terjemahan dalam kurung seperti "(artinya ...)").
   - HANYA field pegangan guru ("pembahasan" dan tabel "kisiKisi": elemen, tujuanPembelajaran, indikatorSoal) yang boleh ditulis dalam Bahasa Indonesia / Dwibahasa agar mudah dibaca guru.` : ''}${ctx.hasReferenceFiles ? `\n${isEnglish ? '7' : '6'}. PRIORITAS MUTLAK DOKUMEN LAMPIRAN:
   - Pengguna telah melampirkan dokumen referensi. Jadikan dokumen lampiran sebagai SUMBER OTORITATIF UTAMA untuk materi, konteks, data, istilah, dan struktur. JANGAN menimpa isi dokumen lampiran dengan materi umum di luar lampiran.` : ''}`;
}

export function buildRuntimeAssessmentSkillPrompt(ctx: AssessmentSkillContext): string {
  const sections: string[] = [];
  const sub = (ctx.subTipeUjian || '').trim();
  const jenjangUpper = (ctx.jenjang || 'SD').toUpperCase();

  // Detect exact exam family
  const isUjianBiasa = ctx.tipeUjian === 'Ujian Biasa';
  const isTKALiterasi = ctx.tipeUjian === 'Other' && sub === 'TKA Literasi';
  const isTKANumerasi = ctx.tipeUjian === 'Other' && sub === 'TKA Numerasi';
  const isTKAInggris = ctx.tipeUjian === 'Other' && sub === 'TKA Literasi Bahasa Inggris';
  const isSulingjar = ctx.tipeUjian === 'Other' && sub.includes('Survei Lingkungan Belajar');
  const isSurveiKarakter = ctx.tipeUjian === 'Other' && sub.includes('Survei Karakter');
  const isTryOut = ctx.tipeUjian === 'Other' && sub === 'Try Out';
  const isSurvey = isSulingjar || isSurveiKarakter;
  const isAKM = ctx.tipeUjian === 'Asesmen Nasional';
  const isTKAAcademic = isTKALiterasi || isTKANumerasi || isTKAInggris;
  const isLiveQuiz = ctx.tipeUjian === 'Live Quiz';
  const isOlimpiade = ctx.tipeUjian === 'Olimpiade';

  // 0. Panduan Konstruksi Soal yang Bersih, Berbobot & Fokus
  sections.push(
    `- PANDUAN KONSTRUKSI BUTIR SOAL: Rumuskan pertanyaan yang tajam, terukur, menantang secara intelektual sesuai jenjang ${jenjangUpper}, dan langsung menguji kompetensi operasional tanpa basa-basi yang tidak berfungsi.`
  );

  // 1. Dedicated Sub-Type Architecture
  if (isUjianBiasa) {
    sections.push(
      `- ARSITEKTUR KHUSUS UJIAN BIASA (FORMATIF / STS / SAS / UJIAN SEKOLAH — STANDAR MUTU TINGGI ${jenjangUpper}):\n` +
        `  1) BATAS MINIMUM KUALITAS (ANTI SOAL TERLALU MUDAH):\n` +
        `     * DILARANG membuat soal tebak-tebakan definisi mentah ("Apa pengertian dari...", "Yang termasuk contoh X adalah..." dengan 3 pengecoh konyol) atau substitusi 1 angka langsung ke 1 rumus dasar.\n` +
        `     * Setiap butir soal WAJIB menghadirkan konteks mini bermakna (1–3 kalimat kasus nyata, data angka/tabel singkat, potongan fenomena, atau pernyataan eksperimen/kejadian) yang benar-benar harus diolah siswa untuk menemukan jawaban.\n` +
        `  2) KEBERAGAMAN OPERASI BERPIKIR (ANTI-REPETISI):\n` +
        `     * Dilarang mengulang pola kalimat tanya identik lebih dari 2 kali berturut-turut. Variasikan tugas mental antar-nomor: tafsir data/fenomena, perbandingan konsep berdekatan, analisis sebab-akibat (What-If), deteksi kesalahan langkah/klaim (Error Analysis), dan pemecahan masalah multi-langkah.\n` +
        `  3) STANDAR OPSI JAWABAN: Gunakan 4 opsi (A–D) untuk SD/SMP atau 5 opsi (A–E) untuk SMA/SMK pada Pilihan Ganda, dengan panjang kalimat seimbang dan pengecoh berbasis miskonsepsi nyata siswa.`
    );
  } else if (isTKALiterasi) {
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
    const cefrBand = getEnglishCEFRBand(ctx.jenjang, ctx.fase);
    const wordRange =
      jenjangUpper.includes('SMA') || jenjangUpper.includes('SMK')
        ? '250–350 kata'
        : jenjangUpper.includes('SMP')
        ? '180–250 kata'
        : '100–160 kata';
    sections.push(
      `- ARSITEKTUR KHUSUS TKA LITERASI BAHASA INGGRIS (${jenjangUpper} — ${cefrBand}):\n` +
        `  1) WAJIB 100% FULL ENGLISH (ZERO INDONESIAN): Seluruh teks bacaan di "stimulusList" ("judul" dan "teks" sepanjang ${wordRange}), "pertanyaan", "opsiTambahan", "pernyataanBenarSalah" ("pernyataan" dalam Bahasa Inggris & "kunci" wajib "True"/"False"), "pasanganMenjodohkan", dan "soalABKList" WAJIB ditulis 100% dalam Bahasa Inggris alami sesuai ${cefrBand}. DILARANG ada satu kata pun Bahasa Indonesia di naskah siswa!\n` +
        `  2) KOMPETENSI YANG DIUJI: Mencakup Textual Comprehension (detail eksplisit, klasifikasi), Inferential Comprehension (main idea, implied meaning, communicative purpose, author's tone/attitude, predicting outcomes), dan Evaluation & Appreciation (fact vs opinion, validity of arguments, real-life relevance).\n` +
        `  3) PEMBAHASAN & KISI-KISI PEGANGAN GURU: Bagian "pembahasan" dan "indikatorSoal" boleh ditulis dalam Bahasa Indonesia / Dwibahasa dengan kutipan bukti kalimat Bahasa Inggris dari teks.`
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
        `  * Susun paket simulasi ujian standar yang mencakup lintas topik/materi esensial pada mata pelajaran ini secara menyeluruh, dengan tingkat kesulitan berjenjang (aplikasi hingga penalaran HOTS) menyerupai ujian akhir sesungguhnya.`
    );
  } else if (isOlimpiade) {
    const taraf = ctx.tarafOlimpiade || 'Kabupaten (OSN-K / SASMO)';
    sections.push(
      `- ARSITEKTUR KHUSUS OLIMPIADE SAINS & MATEMATIKA BERTARAF NASIONAL & INTERNASIONAL:\n` +
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
  }

  // 2. Stimulus Policy (Tegas & Tanpa Kontradiksi)
  if (isLiveQuiz || isUjianBiasa) {
    sections.push(
      `- KEBIJAKAN SOAL MANDIRI (STANDALONE): Seluruh butir soal WAJIB berupa SOAL MANDIRI yang padat dan kontekstual tanpa wacana bacaan bersama ("stimulusList": [] KOSONG, dan "stimulusId": ""). Deskripsi kasus, data angka, atau skenario masalah (1–3 kalimat) ditulis langsung di dalam field "pertanyaan" masing-masing nomor.`
    );
  } else if (isTKAAcademic) {
    const estimatedClusters = Math.max(1, Math.ceil((ctx.totalSoal * 0.7) / 3));
    sections.push(
      `- KEBIJAKAN STIMULUS HYBRID (TKA KISI-KISI RESMI: STIMULUS CLUSTER + STANDALONE):\n` +
        `  * Kelompokkan sekitar 65%–75% butir soal ke dalam ${estimatedClusters} Stimulus Induk di "stimulusList" (S1, S2, ...), di mana setiap stimulus menaungi 2–4 butir soal beragam bentuk (PG, PGK, Benar/Salah, Menjodohkan) dengan "stimulusId" terisi.\n` +
        `  * Sisanya sekitar 25%–35% butir soal WAJIB berupa SOAL MANDIRI / STANDALONE ("stimulusId": "") yang to-the-point langsung menguji konsep operasional tanpa wacana pengantar panjang.`
    );
  } else if (isAKM) {
    const estimatedClusters = Math.max(1, Math.ceil((ctx.totalSoal * 0.7) / 2));
    sections.push(
      `- KEBIJAKAN STIMULUS BERSAMA & STANDALONE (AKM): Kelompokkan sebagian besar soal ke dalam sekitar ${estimatedClusters} Stimulus Induk di "stimulusList" (S1, S2, ...), di mana 1 teks wacana/infografis bersama menaungi 1–3 butir soal berurutan dengan variasi bentuk soal resmi Pusmendik (Pilihan Ganda, Pilihan Ganda Kompleks, Benar/Salah tabel, dan Menjodohkan). Sebagian soal lainnya dapat berupa soal mandiri/standalone ("stimulusId": "").`
    );
  } else if (isOlimpiade) {
    sections.push(
      `- KEBIJAKAN STIMULUS (OLIMPIADE SAINS): Fokus pada skenario masalah non-rutin, kepadatan data matematis/ilmiah presisi, kondisi batas, dan struktur invarian tanpa basa-basi naratif.`
    );
  }

  // 3. Operational Cognitive Task Design (Selalu Aktif — Anti-Pseudo-HOTS)
  const pureHOTS = isHOTSSelectionOnly(ctx.levelKognitif);
  const anyHOTS = hasAnyHOTSSelection(ctx.levelKognitif) || isOlimpiade;

  if (!isSurvey) {
    if (ctx.kerangkaTaksonomi === 'Bloom') {
      sections.push(
        `- OPERASIONALISASI TAKSONOMI BLOOM REVISI (WAJIB DIPATUHI — ANTI PSEUDO-HOTS):\n` +
          `  * Target level aktif: ${ctx.levelKognitif.join(', ')}.\n` +
          `  * C1 (Mengingat): Identifikasi istilah/fakta esensial secara presisi tanpa pengantar tidak perlu.\n` +
          `  * C2 (Memahami): WAJIB parafrasa konsep, mengklasifikasi contoh/non-contoh baru, atau menafsirkan satu data/fenomena. DILARANG menyalin kalimat definisi buku teks mentah!\n` +
          `  * C3 (Mengaplikasikan): WAJIB menerapkan konsep/rumus/prosedur pada situasi konkret minimal 2 langkah pengerjaan atau konversi. DILARANG substitusi 1 angka langsung yang terlalu mudah!\n` +
          `  * C4 (Menganalisis): WAJIB menggunakan operasi mental nyata — (a) manipulasi variabel What-If ("jika X diubah, dampak terhadap Y..."), (b) sintesis lintas ≥2 informasi/data, atau (c) diagnosis penyebab anomali. Terapkan NO-LOOKUP RULE (jawaban tidak tertulis literal di teks)!\n` +
          `  * C5 (Mengevaluasi): WAJIB menyajikan klaim/langkah penyelesaian/solusi lalu menilai letak kekeliruan (Error Analysis) atau mengevaluasi keputusan (trade-off) berdasarkan kriteria terukur.\n` +
          `  * C6 (Mencipta): Pada Uraian: merancang prosedur/solusi baru; pada PG: memilih desain/strategi optimal yang memenuhi beberapa batasan syarat secara simultan.\n` +
          (pureHOTS
            ? `  * MODE PURE HOTS AKTIF: 100% butir soal WAJIB berada pada level C4–C6 (penalaran tinggi). TOLAK seluruh butir hafalan C1–C2 atau hitungan rutin 1 langkah!`
            : anyHOTS
            ? `  * DISTRIBUSI BERJENJANG: Sebarkan proporsi soal secara seimbang pada level yang dipilih (${ctx.levelKognitif.join(', ')}) dengan minimal 35%–50% butir menuntut penalaran analitis (C4–C6).`
            : `  * PENJAGAAN KEDALAMAN C2–C3: Meskipun fokus pada C2–C3, pastikan soal tetap berbobot aplikasi kontekstual multi-langkah dan pemahaman mendalam — BUKAN soal hafalan klise!`)
      );
    } else if (ctx.kerangkaTaksonomi === 'SOLO') {
      sections.push(
        `- OPERASIONALISASI TAKSONOMI SOLO (ANTI SOAL DANGKAL):\n` +
          `  * Uni-struktural: Mengidentifikasi 1 aspek tunggal yang relevan pada konteks konkret.\n` +
          `  * Multi-struktural: Mengolah ≥2 aspek relevan secara terpisah dari data/kasus.\n` +
          `  * Relasional: WAJIB mengintegrasikan hubungan sebab-akibat/struktural antar-beberapa aspek menjadi kesimpulan baru yang tidak tertulis eksplisit (No-Lookup Rule).\n` +
          `  * Abstrak Diperluas: WAJIB menarik prinsip umum (generalisasi) dan mentransfernya ke situasi/konteks baru atau mengevaluasi hipotesis.`
      );
    } else if (ctx.kerangkaTaksonomi === 'TKA') {
      sections.push(
        `- OPERASIONALISASI 3 LEVEL KOGNITIF STANDAR TKA:\n` +
          `  * Level 1 - Pengetahuan & Pemahaman (Knowing & Understanding): Mengidentifikasi informasi tersurat, mengenali konsep esensial, atau membaca nilai akurat dari tabel/grafik.\n` +
          `  * Level 2 - Aplikasi (Applying): Menyimpulkan informasi tersirat (inferensial), menerapkan konsep/rumus multi-langkah ke masalah kontekstual, atau memodelkan situasi nyata.\n` +
          `  * Level 3 - Penalaran (Reasoning / HOTS): Mengevaluasi kevalidan klaim/argumen, menganalisis hubungan multi-konsep pada situasi baru (No-Lookup Rule), melakukan generalisasi, dan memberikan justifikasi berbasis bukti.`
      );
    }
  }

  // 4. Distractor Engineering & Key Balancing
  sections.push(
    `- REKAYASA PENGECOH & KESEIMBANGAN KUNCI (DISTRACTOR ENGINEERING & KEY BALANCING):\n` +
      `  * Misconception-Driven: Setiap pengecoh salah WAJIB lahir dari kesalahan konsep/hitung nyata (lupa konversi satuan, berhenti di langkah pertama, terbalik konsep berdekatan, atau salah baca data). DILARANG membuat opsi konyol atau "Semua benar/salah".\n` +
      `  * Anti Longest-Key Bias: Panjang kalimat dan tata bahasa opsi A–D / A–E wajib setara; DILARANG membuat opsi kunci selalu paling panjang atau paling lengkap sendirian.\n` +
      `  * Key Balancing: Distribusikan huruf kunci jawaban Pilihan Ganda secara acak dan merata di semua huruf (A, B, C, D/E) agar tidak menumpuk di A atau B.`
  );

  // 5. Level-Specific Safeguards & Attachment Priority
  if (jenjangUpper === 'PAUD' || jenjangUpper === 'TK') {
    sections.push(
      `- PENGAMANAN KHUSUS PAUD (FASE FONDASI): Fokus pada asesmen perkembangan autentik melalui aktivitas bermain konkret, pengenalan pola/warna/bentuk, pemantik lisan guru, dan indikator perilaku teramati.`
    );
  } else if (jenjangUpper === 'SMK' && !isSurvey) {
    sections.push(
      `- KONTEKS KEJURUAN SMK (DUDI): Kaitkan studi kasus soal dengan dunia kerja/industri, penerapan SOP, analisis keselamatan kerja (K3), atau troubleshooting praktis sesuai konteks mata pelajaran.`
    );
  }

  if (isEnglishAssessment(ctx) && !isTKAInggris) {
    const cefrBand = getEnglishCEFRBand(ctx.jenjang, ctx.fase);
    sections.push(
      `- ATURAN MUTLAK BAHASA NASKAH SOAL BAHASA INGGRIS (${jenjangUpper}${ctx.fase ? ` / Fase ${ctx.fase}` : ''} — ${cefrBand}):\n` +
        `  * 100% FULL ENGLISH (ZERO INDONESIAN IN STUDENT PAPER): Seluruh "stimulusList" ("judul", "teks"), "pertanyaan", "opsiTambahan", "pernyataanBenarSalah" ("pernyataan" dalam Bahasa Inggris & "kunci" wajib "True" atau "False"), "pasanganMenjodohkan" ("kiri", "kanan"), "soalABKList", serta "kunci" jawaban WAJIB 100% menggunakan BAHASA INGGRIS yang natural dan sesuai tingkat ${cefrBand}.\n` +
        `  * DILARANG KERAS menyelipkan kalimat pengantar Bahasa Indonesia ("Perhatikan dialog berikut...", "Bacalah teks di bawah ini...", "Manakah jawaban yang tepat...", "Artikan ke dalam bahasa Indonesia...") ataupun terjemahan dalam kurung "(artinya ...)" pada soal maupun opsi!\n` +
        `  * HANYA bagian pegangan guru ("pembahasan" & kisi-kisi) yang boleh berbahasa Indonesia/dwibahasa.`
    );
  } else if (ctx.mapel === 'bahasa-arab') {
    sections.push(
      `- ATURAN BAHASA NASKAH SOAL BAHASA ARAB (${jenjangUpper}): Gunakan teks Arab asli (Arabic script) berharakat lengkap dan jelas untuk wacana, dialog, kalimat pertanyaan, dan pilihan jawaban Bahasa Arab tanpa membocorkan terjemahan di samping opsi kecuali soal secara khusus menguji terjemahan.`
    );
  } else if (String(ctx.mapel || '').startsWith('mulok-bahasa-')) {
    sections.push(
      `- ATURAN BAHASA NASKAH SOAL MUATAN LOKAL BAHASA DAERAH (${jenjangUpper}): Gunakan ragam bahasa daerah target secara autentik dan santun pada teks bacaan, dialog, dan kutipan soal sesuai unggah-ungguh/tata krama bahasa daerah tersebut.`
    );
  }

  if (ctx.hasReferenceFiles) {
    sections.push(
      `- PRIORITAS DOKUMEN LAMPIRAN AKTIF: Seluruh materi, konteks, angka, istilah, dan ruang lingkup soal WAJIB bersumber langsung dari dokumen lampiran yang diunggah guru di bagian awal prompt. Jangan memaksakan materi CP/topik bawaan apabila tidak tercantum dalam dokumen lampiran.`
    );
  }

  return '\n' + sections.join('\n');
}
