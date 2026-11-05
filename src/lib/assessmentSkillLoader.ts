/**
 * Digen.id Runtime Assessment Skill Loader (v1.0.0)
 * Dynamically composes modular pedagogical instructions, stimulus budgeting policies,
 * Bloom/SOLO cognitive task repertoires (Anti-Pseudo-HOTS), distractor engineering,
 * and self-verification rules based on the active Assessment Contract.
 *
 * Invariant: Does NOT modify Subscription Tiers (Free, Guru Pertama, Guru Muda, Guru Madya, Guru Utama)
 * or alter any database/API contracts.
 */

export interface AssessmentSkillContext {
  jenjang: string;
  mapel: string;
  tipeUjian: string;
  subTipeUjian?: string;
  kerangkaTaksonomi: 'Bloom' | 'SOLO' | string;
  levelKognitif: string[];
  totalSoal: number;
  terdapatSoalBergambar?: boolean;
  jumlahSoalBergambar?: number;
  hasInklusi?: boolean;
}

export function buildRuntimeAssessmentSkillPrompt(ctx: AssessmentSkillContext): string {
  const sections: string[] = [];

  // 1. Stimulus Budgeting Policy (Anti-Stimulus Overload 1-50)
  const isAKMOrTKA =
    ctx.tipeUjian === 'Asesmen Nasional' ||
    (ctx.tipeUjian === 'Other' && ctx.subTipeUjian && ctx.subTipeUjian.startsWith('TKA:'));
  const isSurvey =
    ctx.subTipeUjian?.includes('Sulingjar') || ctx.subTipeUjian?.includes('Survei Karakter');
  const isLiveQuiz = ctx.tipeUjian === 'Live Quiz';
  const isOlimpiade = ctx.tipeUjian === 'Olimpiade';

  if (isLiveQuiz) {
    sections.push(
      `- KEBIJAKAN ANGGARAN STIMULUS (LIVE QUIZ): 90%–100% butir soal WAJIB berupa SOAL MANDIRI (Standalone) yang ringkas, padat, dan cepat dibaca (<25 kata) tanpa wacana panjang (biarkan "stimulusId" kosong ""). Opsi jawaban tepat 4 pilihan singkat.`
    );
  } else if (isAKMOrTKA) {
    const estimatedClusters = Math.max(1, Math.ceil(ctx.totalSoal / 4));
    sections.push(
      `- KEBIJAKAN STIMULUS BERSAMA (AKM / TKA CLUSTER): DILARANG membuat 1 wacana terpisah untuk setiap 1 soal! Buat sekitar ${estimatedClusters} Stimulus Induk di "stimulusList" (S1, S2, ...), di mana SETIAP 1 stimulus dipakai bersama oleh 3–5 soal berurutan. Pastikan setiap soal di bawah stimulus mengukur aspek yang berbeda dan tidak saling membocorkan jawaban.`
    );
  } else if (isOlimpiade) {
    sections.push(
      `- KEBIJAKAN STIMULUS (OLIMPIADE SAINS): Fokus pada kepadatan informasi ilmiah/matematis dan skenario masalah non-rutin. Jangan menambahkan cerita naratif berbunga-bunga yang tidak dibutuhkan dalam perhitungan atau pembuktian.`
    );
  } else {
    // Ujian Biasa & Try Out Umum: Hybrid Proportional (Anti 1-50 Stimulus Semua!)
    const maxSharedGroups = ctx.totalSoal >= 30 ? 3 : ctx.totalSoal >= 15 ? 2 : 1;
    sections.push(
      `- KEBIJAKAN ANGGARAN STIMULUS (ANTI STIMULUS OVERLOAD 1–${ctx.totalSoal}): JANGAN membuat wacana/stimulus untuk semua nomor! Gunakan distribusi proporsional:\n` +
        `  1) Minimal 60%–70% butir soal WAJIB berupa SOAL MANDIRI (Standalone / Konteks Singkat 1–2 kalimat langsung di pokok soal, dengan "stimulusId": "").\n` +
        `  2) Maksimal hanya boleh ada ${maxSharedGroups} wacana bersama di "stimulusList" (masing-masing untuk 3–5 soal kontekstual/HOTS).\n` +
        `  3) Jika "Terdapat Soal Bergambar" aktif (${ctx.jumlahSoalBergambar || 0} soal), hanya isi "gambarDeskripsi" pada ${ctx.jumlahSoalBergambar || 0} nomor soal tersebut saja; soal lainnya tetap mandiri tanpa gambar/wacana paksa.`
    );
  }

  // 2. Cognitive Task Design Repertoire (Bloom C1-C6 & SOLO Operational Rules — Anti Pseudo-HOTS)
  if (!isSurvey) {
    if (ctx.kerangkaTaksonomi === 'SOLO') {
      sections.push(
        `- OPERASIONALISASI TAKSONOMI SOLO (BUKAN SEKADAR LABEL):\n` +
          `  * Unistructural: Soal menuntut identifikasi 1 informasi/konsep tunggal secara langsung (Zero-Fluff: tanpa cerita panjang).\n` +
          `  * Multistructural: Soal menuntut identifikasi >= 2 informasi/prosedur terpisah secara berurutan.\n` +
          `  * Relational (HOTS): Soal WAJIB menuntut siswa mengintegrasikan hubungan sebab-akibat, perbandingan struktural, atau kaitan antarkonsep dari beberapa bukti (Jawaban DILARANG tertulis literal di teks stimulus).\n` +
          `  * Extended Abstract (HOTS Puncak): Soal WAJIB menuntut generalisasi prinsip ke situasi/konteks baru, prediksi kondisi ekstrem (What-If), atau evaluasi rancangan di bawah batasan kriteria.`
      );
    } else {
      sections.push(
        `- KONTRAK OPERASI KOGNITIF BLOOM REVISI (ANTI PSEUDO-HOTS):\n` +
          `  * Level C1–C2 (Mengingat/Memahami): Gunakan aturan Zero-Fluff (langsung ke konsep/interpretasi dasar tanpa cerita pengantar panjang yang dekoratif).\n` +
          `  * Level C3 (Menerapkan): Sajikan kasus/data konkret yang menuntut eksekusi prosedur atau penerapan konsep.\n` +
          `  * Level C4 (Menganalisis - HOTS): Gunakan pola Manipulasi Variabel ("Jika faktor X diubah sementara Y tetap, apa dampaknya pada Z?"), Diagnosis Anomali Data/Grafik, atau Sintesis Lintas-Bukti.\n` +
          `  * Level C5 (Mengevaluasi - HOTS): Gunakan pola Deteksi Kekeliruan Klaim/Argumen (sajikan klaim/kesimpulan yang memiliki cacat logika/metodologi untuk dinilai) atau Evaluasi Trade-off berdasarkan kriteria.\n` +
          `  * Level C6 (Mencipta - HOTS): Untuk Uraian, minta siswa merancang solusi/prosedur baru; untuk Pilihan Ganda, gunakan Constrained Design Evaluation (memilih rancangan solusi yang memenuhi seluruh syarat batasan).\n` +
          `  * ATURAN MUTLAK NO-LOOKUP (ANTI CTRL+F UNTUK C4–C6): Untuk setiap soal berlabel C4, C5, atau C6 (HOTS), kunci jawaban DILARANG KERAS tertulis secara eksplisit/literal di dalam teks stimulus! Siswa harus menggabungkan bukti di stimulus dengan konsep materi untuk menarik kesimpulan.`
      );
    }
  } else {
    sections.push(
      `- INSTRUMEN SURVEI NON-AKADEMIK (SULINGJAR / SURVEI KARAKTER): Instrumen ini mengukur profil sikap/karakter atau iklim lingkungan belajar (Situational Judgement Test / Skala Berjangkar), BUKAN hafalan akademik. Pembahasan berisi deskriptor interpretasi profil perilaku.`
    );
  }

  // 3. Cognitive Diversity & Distractor Engineering
  sections.push(
    `- REKAYASA PENGECOH (DISTRACTOR ENGINEERING) & KEBERAGAMAN SOAL:\n` +
      `  * Setiap opsi pengecoh (pilihan salah) WAJIB dirancang dari jalur miskonsepsi siswa yang masuk akal (salah konsep, salah langkah hitung, atau salah baca tabel/grafik).\n` +
      `  * Panjang kalimat dan struktur tata bahasa opsi A sampai E WAJIB homogen/setara (DILARANG membuat kunci jawaban tampak paling panjang/detail sendirian).\n` +
      `  * Variasikan sudut pandang dan operasi berpikir antar-nomor (jangan mengulang pola kalimat tanya yang sama berturut-turut).`
  );

  // 4. Level-Specific Safeguards (PAUD to SMK)
  const jenjangUpper = (ctx.jenjang || '').toUpperCase();
  if (jenjangUpper === 'PAUD' || jenjangUpper === 'TK') {
    sections.push(
      `- PENGAMANAN KHUSUS PAUD (FASE FONDASI): Fokus pada asesmen perkembangan autentik melalui aktivitas bermain konkret, pengenalan pola/warna/bentuk, pemantik lisan guru, dan indikator perilaku teramati (hindari beban baca tulis abstrak).`
    );
  } else if (jenjangUpper === 'SMK') {
    sections.push(
      `- KONTEKS KEJURUAN SMK (DUDI): Kaitkan studi kasus soal dengan dunia kerja/industri, penerapan SOP, analisis keselamatan kerja (K3), atau troubleshooting praktis sesuai bidang mata pelajaran.`
    );
  }

  return '\n' + sections.join('\n');
}

