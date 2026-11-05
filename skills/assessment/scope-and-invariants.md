# Scope & System Invariants — Digen.id Assessment Engineering System

> **Version**: 1.0.0  
> **Status**: Locked Invariants  
> **Applies To**: Both Coding Agents and Runtime Assessment Orchestration

---

## 1. Subscription Tier Invariant (Hukum Mutlak)

Kelima tingkatan langganan resmi pada Pemuryadi Generator (Digen.id) adalah:
1. **`Free`**
2. **`Guru Pertama`**
3. **`Guru Muda`**
4. **`Guru Madya`**
5. **`Guru Utama`**

### Aturan Penguncian (Zero-Modification Policy):
- **DILARANG** mengubah nama, urutan, harga, kuota token, struktur *entitlements*, maupun logika *billing* pada `src/AuthContext.tsx`, `functions/api/[[route]].ts`, dan `schema.sql`.
- Seluruh modul di dalam `skills/assessment/` wajib mengikuti mekanisme *subscription* yang sudah berjalan di produksi.
- **Subscription Regression Guard**: Setiap perubahan pada sistem pembuat soal wajib memastikan bahwa *snapshot* nama tier, pemeriksaan kuota token, dan hak akses pengguna pada kelima tier di atas tetap 100% utuh.

---

## 2. Pemisahan Dua Lingkungan (Dual-Environment Separation)

| Dimensi | Coding Agent Environment | Runtime Assessment Skill Engine |
| :--- | :--- | :--- |
| **Lokasi Berkas** | `.agents/SKILL.md` & `.agents/AGENTS.md` | `skills/assessment/` & `src/lib/assessmentSkillLoader.ts` |
| **Target Pembaca** | Developer & AI Coding Assistant | Mesin Pembuat Soal (`BuatSoal.tsx` / Orchestrator) |
| **Tujuan** | Menjaga stabilitas kode React, Hono, dan D1 | Mengendalikan mutu pedagogis, anggaran stimulus, dan operasi kognitif |

---

## 3. Batas Klaim Validitas & Keamanan Payload

1. **Kejujuran Status Mutu**:
   - Soal yang lolos pemeriksaan AI diberi status `SUBSTANTIVE_REVIEW_PASSED` (Lolos Telaah Substantif).
   - Sistem **tidak mengklaim** soal telah "Tervalidasi Psikometrik 100%" sebelum diujikan secara empiris kepada peserta didik.
2. **Keamanan Data Siswa (Live Quiz Server Allowlist)**:
   - Payload yang dikirim ke perangkat siswa (`StudentAssessmentView`) hanya boleh memuat properti yang diizinkan (`allowlist`: `item_id`, `stimulus`, `stem`, `options[{option_id, text}]`).
   - Kunci jawaban (`scoring`), pembahasan guru, dan diagnosis pengecoh wajib tertahan di server.
3. **Kebenaran Dasar di Semua Tier**:
   - Kebenaran kunci jawaban, kejelasan rumusan soal, dan keamanan data siswa berlaku wajib di seluruh tier (`Free` s.d. `Guru Utama`).

