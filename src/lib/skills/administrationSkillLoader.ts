/**
 * Digen.id Runtime Administration & Module Skill Loader (v1.0.0)
 * Menegakkan standar pedagogik Kurikulum Merdeka resmi (Kemendikdasmen) & Kemenag (KBC/PPRA).
 * Mengunci taksonomi fase, sintaks model pembelajaran operasional, kaidah ABCD pada TP,
 * integrasi TPACK/STEAM, serta modul inklusi adaptif.
 *
 * Invariant: Pure functional, zero state, zero database modification.
 */

export interface AdministrationSkillContext {
  jenjang: string;
  fase: string;
  kelas: string;
  mapel: string;
  topik?: string;
  model: string;
  formatPerangkat: 'standar' | 'kemenag';
  hasInklusi?: boolean;
  jumlahInklusi?: number | string;
  kerangkaTaksonomi?: string;
  levelTaksonomi?: string;
}

export function buildAdministrationSkillPrompt(ctx: AdministrationSkillContext): string {
  const sections: string[] = [];

  // 1. Standar Regulasi & Taksonomi Fase
  sections.push(`
=== STANDAR REGULASI & PEDAGOGIK KURIKULUM MERDEKA (ANTI-HALUSINASI) ===
1. ALUR FASE PENDIDIKAN:
   - Pastikan tingkat kedalaman materi dan bahasa sesuai fase ${ctx.fase.toUpperCase()} (Jenjang ${ctx.jenjang.toUpperCase()}, Kelas ${ctx.kelas}).
   - DILARANG menggunakan istilah Kurikulum 2013 seperti 'Kompetensi Inti (KI)', 'Kompetensi Dasar (KD)', 'Silabus', atau 'KKM'.
   - Gunakan istilah resmi: 'Capaian Pembelajaran (CP)', 'Tujuan Pembelajaran (TP)', 'Alur Tujuan Pembelajaran (ATP)', dan 'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)'.
   - DILARANG memuat singkatan 'P5' atau 'Proyek Penguatan Profil Pelajar Pancasila'. Selalu gunakan istilah 'Kegiatan Kokurikuler' atau 'Modul Kokurikuler'.`);

  // 2. Operasionalisasi Model Pembelajaran
  const modelKey = (ctx.model || '').toLowerCase();
  let sintaksModel = '';
  if (modelKey.includes('pbl') || modelKey.includes('problem')) {
    sintaksModel = `Wajib ikuti 5 sintaks Problem-Based Learning: (1) Orientasi siswa pada masalah, (2) Mengorganisasi siswa untuk belajar, (3) Membimbing penyelidikan individu/kelompok, (4) Mengembangkan dan menyajikan hasil karya, (5) Menganalisis dan mengevaluasi proses pemecahan masalah.`;
  } else if (modelKey.includes('pjbl') || modelKey.includes('project')) {
    sintaksModel = `Wajib ikuti 6 sintaks Project-Based Learning: (1) Menentukan pertanyaan mendasar, (2) Mendesain perencanaan produk, (3) Menyusun jadwal pembuatan, (4) Memonitor keaktifan dan perkembangan proyek, (5) Menguji hasil, (6) Mengevaluasi pengalaman belajar.`;
  } else if (modelKey.includes('inquiry') || modelKey.includes('discovery')) {
    sintaksModel = `Wajib ikuti 6 tahap Discovery/Inquiry: (1) Stimulation (pemberian rangsangan), (2) Problem statement (identifikasi masalah), (3) Data collection (pengumpulan data), (4) Data processing (pengolahan data), (5) Verification (pembuktian), (6) Generalization (penarikan kesimpulan).`;
  } else if (modelKey.includes('cinta')) {
    sintaksModel = `Pendekatan Kurikulum Berbasis Cinta (KBC): Terapkan 3 pilar utama: Hubungan Kasih Sayang Guru-Siswa (Welcoming Atmosphere), Makna Mendalam (Meaningful Discovery), dan Refleksi Syukur/Etika Kehidupan.`;
  } else if (modelKey.includes('diferensiasi')) {
    sintaksModel = `Pembelajaran Berdiferensiasi: Rancang variasi pada Konten (materi bertingkat), Proses (aktivitas visual/auditori/kinestetik), dan Produk (pilihan bentuk tugas akhir siswa).`;
  } else {
    sintaksModel = `Terapkan sintaks model pembelajaran aktif yang berpusat pada siswa (student-centered), bukan ceramah satu arah.`;
  }

  sections.push(`
2. OPERASIONALISASI MODEL PEMBELAJARAN:
   - Model Pembelajaran: ${ctx.model}.
   - SINTAKS WAJIB PADA KEGIATAN INTI: ${sintaksModel}
   - Rincikan aktivitas guru dan siswa secara konkret dan interaktif di setiap fase/sintaks, bukan sekadar teori umum.`);

  // 3. Konteks Khusus Kemenag (Jika Dipilih)
  if (ctx.formatPerangkat === 'kemenag') {
    sections.push(`
3. MANDAT KHUSUS KEMENAG & KURIKULUM BERBASIS CINTA (KBC):
   - Integrasikan 10 Nilai Profil Pelajar Rahmatan Lil 'Alamin (PPRA): Berkeadaban (Ta’addub), Keteladanan (Qudwah), Kewarganegaraan & Kebangsaan (Muwatanah), Mengambil Jalan Tengah (Tawassut), Berimbang (Tawazun), Lurus & Tegas (I’tidal), Kesetaraan (Musawah), Musyawarah (Syura), Toleransi (Tasamuh), Dinamis & Inovatif (Tatawwur wa Ibtikar).
   - Terapkan 'Heartful & Meaningful Learning' pada setiap tahap pembelajaran (sapaan doa yang tulus, apresiasi potensi anak, pemaknaan spiritual di materi ajar, dan akhlak mulia).`);
  }

  // 4. Adaptasi Inklusi (ABK)
  if (ctx.hasInklusi && (Number(ctx.jumlahInklusi) || 0) > 0) {
    sections.push(`
4. MODIFIKASI PEMBELAJARAN INKLUSI (ABK):
   - Di kelas terdapat ${ctx.jumlahInklusi} peserta didik berkebutuhan khusus/inklusi.
   - Sediakan catatan diferensiasi akomodatif pada bagian kegiatan inti dan rubrik penilaian (misal: instruksi visual konkret, waktu pengerjaan yang fleksibel, dan pendampingan tutor sebaya).`);
  }

  // 5. Aturan Larangan Keras (Negative Constraints)
  sections.push(`
5. LARANGAN KERAS:
   - DILARANG menghasilkan teks pembuka atau penutup basa-basi di luar format JSON.
   - DILARANG membiarkan bagian ringkasan materi atau contoh nyata kosong atau terlalu singkat. Berikan penjelasan yang mendalam dan mudah dipahami guru.`);

  return sections.join('\n');
}

