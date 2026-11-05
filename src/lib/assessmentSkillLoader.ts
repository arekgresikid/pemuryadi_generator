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
  const isSurvey = isSulingjar || isSurveiKarakter;
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
  if (jenjangUpper === 'PAUD' || jenjangUpper === 'TK') {
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
