---
name: digen-assessment-engine
description: Sistem Rekayasa Asesmen Modular untuk Pemuryadi Generator (digen.id) yang mengendalikan perencanaan kisi-kisi, anggaran stimulus, repertoar kognitif Bloom/SOLO (Anti Pseudo-HOTS), rekayasa pengecoh miskonsepsi, dan audit mutu lintas jenjang PAUD s.d. SMK.
version: 1.0.0
---

# 🏛️ Digen.id Assessment Engineering Skill (Master Router)

Skill ini adalah pintu masuk utama (*Master Router*) untuk perancangan, pembuatan, dan penelaahan instrumen asesmen pada **Pemuryadi Generator (digen.id)**.

---

## 1. Kapan Skill Ini Digunakan
Gunakan skill ini setiap kali merancang, men-generate, atau mengaudit:
- **Ujian Biasa** (Formatif Harian, STS, SAS, Ujian Sekolah).
- **Asesmen Nasional (AKM)** (Literasi Membaca & Numerasi).
- **Olimpiade Sains** (OSN Kabupaten/Provinsi/Nasional, IMO, IPhO, IChO, IBO).
- **Live Quiz Interaktif** (Mode gamifikasi kelas).
- **Other: TKA & Try Out** (TKA Literasi B. Indonesia, Numerasi Matematika, Literasi B. Inggris, Try Out).
- **Instrumen Survei Non-Akademik** (Survei Karakter & Survei Lingkungan Belajar / Sulingjar).

---

## 2. Aturan Pemuatan Modul (*Selective Context Loading*)

Jangan memuat seluruh file referensi sekaligus. Muat hanya modul yang relevan dengan permintaan:

1. **Selalu Muat (Core Foundation):**
   - `scope-and-invariants.md`
   - `runtime/00-orchestrator.md`
   - `runtime/core/stimulus-policy.md`
   - `runtime/core/cognitive-task-design.md`
   - `runtime/core/distractor-engineering.md`
2. **Muat Sesuai Tipe Ujian (Pilih 1 dari `runtime/archetypes/`):**
   - `ujian-biasa.md` | `akm.md` | `olimpiade.md` | `live-quiz.md` | `tka-tryout.md` | `survey-non-academic.md`
3. **Muat Sesuai Kebutuhan Kondisional (`runtime/specialized-agents/` & `references/`):**
   - `visual-architect.md` (hanya jika terdapat soal bergambar/grafik).
   - `inclusive-abk-adapter.md` (hanya jika toggle Anak Inklusi/ABK aktif).
   - `jenjang-paud-smk.md` (untuk pengamanan batas beban baca & format observasi PAUD/DUDI SMK).
   - `adversarial-quality-auditor.md` (untuk pemeriksaan kunci buta & pendeteksian *Pseudo-HOTS*).

---

## 3. Urutan Kerja Wajib (*Blueprint-First Workflow*)

1. **Normalisasi & Kontrak (`AssessmentContract`):** Kunci jenjang, mapel, tipe ujian, jumlah soal, target kognitif, dan kebijakan stimulus.
2. **Perencanaan Paket (`Blueprint & Stimulus Budget`):** Tetapkan distribusi nomor mandiri (*standalone*), konteks singkat (*embedded*), dan wacana bersama (*shared cluster*) serta variasi operasi berpikir sebelum menulis butir pertama.
3. **Penulisan Terkendali (`Cluster-Aware Generation`):** Tulis butir soal dengan mematuhi repertoar operasi kognitif (Bloom C1–C6 / SOLO) dan larangan *No-Lookup Rule* untuk soal HOTS.
4. **Pemeriksaan Mutu (`Quality Gate`):** Pastikan kunci tunggal valid, pengecoh berbasis miskonsepsi, stimulus benar-benar diperlukan, dan tidak ada *Pseudo-HOTS*.
5. **Proyeksi 5 Tab Output:** Rakit ke dalam format JSON yang konsisten untuk `Kisi-kisi`, `Naskah Soal`, `Kunci & Bahas`, `Kartu Soal`, dan `Live Quiz`.

