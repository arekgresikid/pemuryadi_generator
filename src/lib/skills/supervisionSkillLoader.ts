/**
 * Digen.id Runtime Clinical Supervision Skill Loader (v1.0.0)
 * Menegakkan instrumen supervisi akademik klinis:
 * Penilaian berbasis bukti dokumen (evidence-based), rubrik operasional skala 1-4,
 * pemisahan tahap Pra-Observasi, Pelaksanaan, Asesmen, dan Refleksi,
 * serta Rencana Tindak Lanjut (RTL) berbasis pembinaan (coaching).
 *
 * Invariant: Pure functional, zero state, zero database modification.
 */

export interface SupervisionSkillContext {
  sources: {
    rpm?: string;
    modulAjar?: string;
    modulKokurikuler?: string;
  };
  indicatorsCount?: number;
}

export function buildSupervisionSkillPrompt(ctx: SupervisionSkillContext): string {
  const sections: string[] = [];

  sections.push(`
=== STANDAR SUPERVISI AKADEMIK KLINIS (ANTI-HALUSINASI) ===
1. PRINSIP EVALUASI BERBASIS BUKTI (EVIDENCE-BASED):
   - Skor yang diberikan WAJIB berdasarkan bukti nyata dari teks sumber (Alur RPM, Modul Ajar, atau Modul Kokurikuler) yang disediakan guru.
   - Jika dokumen sumber TIDAK mencantumkan suatu aspek (misal asesmen awal/diagnostik tidak ada sama sekali), berikan skor 1 atau 2 secara objektif, JANGAN mengasumsikan aspek tersebut ada jika tidak tertulis.`);

  sections.push(`
2. RUBRIK SKALA 1–4 OPERASIONAL:
   - Skor 4 (Sangat Baik / Lengkap): Aspek tercantum lengkap, sistematis, mencerminkan pembelajaran aktif/bermakna, dan terintegrasi asesmen yang jelas.
   - Skor 3 (Baik / Cukup Lengkap): Aspek tercantum dan memenuhi standar esensial, namun masih memerlukan penguatan pada detail aktivitas atau diferensiasi.
   - Skor 2 (Kurang / Perlu Perbaikan): Aspek hanya disebutkan secara garis besar/singkat tanpa penjabaran langkah operasional yang memadai.
   - Skor 1 (Tidak Ada / Sangat Kurang): Aspek sama sekali tidak ditemukan atau tidak relevan dengan standar kurikulum.`);

  sections.push(`
3. CATATAN SUPERVISOR & COACHING:
   - Dilarang memberikan catatan supervisi yang hanya berisi pujian umum tanpa substansi.
   - Struktur Catatan Supervisor WAJIB memuat:
     a. Apresiasi Aspek Unggul (Kekuatan yang ditemukan pada dokumen).
     b. Area Prioritas Perbaikan (Bagian spesifik yang perlu ditingkatkan).
     c. Rekomendasi Rencana Tindak Lanjut / RTL (Langkah konkret yang harus dilakukan guru sebelum observasi kelas selanjutnya).`);

  return sections.join('\n');
}

