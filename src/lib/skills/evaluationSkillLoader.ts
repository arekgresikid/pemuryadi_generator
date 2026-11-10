/**
 * Digen.id Runtime Quality Evaluation Skill Loader (v1.0.0)
 * Menegakkan metodologi penjaminan mutu pendidikan:
 * Fishbone Analysis (Input-Proses-Output), 5-Why Analysis akar masalah,
 * keterkaitan Rapor Pendidikan, serta sinkronisasi program intervensi berbasis data.
 *
 * Invariant: Pure functional, zero state, zero database modification.
 */

export interface EvaluationSkillContext {
  step: number;
  jenjang?: string;
  data?: any;
}

export function buildEvaluationSkillPrompt(ctx: EvaluationSkillContext): string {
  const sections: string[] = [];

  sections.push(`
=== STANDAR EVALUASI MUTU PENDIDIKAN & SPMI (ANTI-HALUSINASI) ===
1. LANDASAN ANALISIS MUTU:
   - Evaluasi berakar pada Rapor Pendidikan & Standar Pelayanan Minimal (SPM) Kemendikdasmen/Kemenag.
   - Analisis TIDAK BOLEH bersifat menghakimi atau menyalahkan guru/sekolah, melainkan berfokus pada 'Akar Masalah Sistemik & Solusi Berkelanjutan'.`);

  sections.push(`
2. METODOLOGI ANALISIS OPERASIONAL:
   - METODE 5-WHY: Telusuri gejala masalah hingga 5 tingkat ke bawah sampai menemukan faktor pemicu utama (kebijakan sekolah, sarana esensial, atau kultur belajar).
   - FISHBONE DIAGRAM: Kelompokkan akar masalah ke dalam 4 dimensi: SDM/Manusia (Guru/Tendik), Metode (Kurikulum & Pembelajaran), Lingkungan (Iklim Sekolah), dan Sarana/Finansial (BOS/BOSP).
   - DIAGRAM VENN (IRISAN MASALAH): Jika terdapat kesenjangan data antara sarana dan keterlaksanaan, temukan irisan kendala operasional yang paling menghambat.`);

  if (ctx.step === 3) {
    sections.push(`
3. REGULASI ANGGARAN & FINANSIAL:
   - Pastikan alokasi dana lingkungan dan pembelajaran sesuai ketentuan pengelolaan dana bantuan operasional sekolah (BOS/BOSP).
   - Jika alokasi anggaran khusus belum memenuhi proporsi memadai (<20%), berikan rekomendasi pergeseran mata anggaran (reallocation) yang realistis dan sah menurut aturan dinas.`);
  }

  sections.push(`
4. REKOMENDASI INTERVENSI TERINTEGRASI:
   - Setiap program yang diusulkan wajib memiliki 'Target Capaian Terukur (KPI)', 'Penanggung Jawab', dan 'Jadwal Monitoring'.
   - Arahkan sekolah untuk melengkapi instrumen administratif yang selaras di aplikasi (Modul Ajar, KKTP, Jurnal Harian, Supervisi).`);

  return sections.join('\n');
}

