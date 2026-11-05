# 00 — Master Assessment Orchestrator

> **Role**: Deterministic Control Plane & Multi-Agent Dispatcher  
> **Version**: 1.0.0

---

## 1. Tanggung Jawab Utama
Master Orchestrator mengendalikan siklus hidup pembuatan asesmen tanpa membebani satu panggilan LLM dengan seluruh pekerjaan:
1. Membentuk **Assessment Contract** dari input form pengguna.
2. Memeriksa hak akses pengguna berdasarkan **Subscription Tier eksisting** (`Free`, `Guru Pertama`, `Guru Muda`, `Guru Madya`, `Guru Utama`) tanpa mengubah logika *billing*.
3. Mengatur **Generation Unit** dan **Generation Batch** agar kelompok stimulus bersama tidak pernah terpotong di tengah batch.
4. Menjalankan **Lifecycle State Machine** dan menghentikan loop revisi maksimal 2 siklus.
5. Mencatat **Model Provenance** dan memisahkan proyeksi `TeacherAssessmentView` dari `StudentAssessmentView`.

---

## 2. Unit Konteks vs Batch Eksekusi

- **`generation_unit`**: Unit konteks terkecil yang tidak boleh dipisahkan.
  - 1 soal mandiri (*standalone*) = 1 unit.
  - 1 stimulus bersama (`S1`) + seluruh 3–5 soal turunannya = 1 unit utuh (`must_generate_together: true`).
- **`generation_batch`**: Kumpulan beberapa `generation_unit` dalam satu pemanggilan model:
  - Soal Mandiri L1–L2: 8–10 butir/batch.
  - Soal Analisis/Evaluasi HOTS (C4–C6) & AKM: 3–6 butir/batch (mengikuti keutuhan kelompok stimulus).
  - Pembuktian Olimpiade / Uraian Analitik: 1–4 butir/batch.

---

## 3. State Machine & Kondisi Berhenti
- `DRAFT` $\to$ `PLANNED` $\to$ `GENERATED` $\to$ `VALIDATING`
- Jika audit gagal $\to$ `REVISION_REQUIRED` (revisi terarah hanya pada butir yang bermasalah, **maksimal 2 siklus**).
- Jika lolos $\to$ `SUBSTANTIVE_REVIEW_PASSED` $\to$ `HUMAN_APPROVED` $\to$ `PUBLISHED`.
- Jika masih gagal setelah 2 siklus revisi $\to$ `HUMAN_REVIEW_REQUIRED` (hentikan pemanggilan ulang AI otomatis dan tampilkan catatan temuan).

