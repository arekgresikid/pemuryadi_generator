# Core — Stimulus Budgeting & Necessity Policy

> **Purpose**: Mencegah gejala "Nomor 1–50 Berwacana Semua" (*Stimulus Fatigue*) dan memastikan setiap stimulus memiliki fungsi pengukuran yang sah.

---

## 1. Tiga Kategori Konteks Butir Soal

1. **`STANDALONE` (Soal Mandiri Tanpa Stimulus):**
   - Langsung menanyakan konsep, prosedur, perhitungan, atau analisis singkat dalam 1–2 kalimat pokok soal (*stem*).
   - **Wajib 0% wacana pengantar.**Field `stimulusId` wajib dikosongkan (`""`).
2. **`EMBEDDED_CONTEXT` (Konteks Ringkas di Dalam Pokok Soal):**
   - Situasi atau data singkat (maksimal 2–3 kalimat) yang menyatu langsung di dalam `soal` karena seluruh informasinya digunakan untuk menjawab satu nomor tersebut.
3. **`SHARED_STIMULUS_CLUSTER` (Stimulus Bersama di `stimulusList`):**
   - Satu teks bacaan utuh, tabel data eksperimen, atau infografis (`id: "S1", "S2", ...`) yang digunakan bersama oleh **3 hingga 5 butir soal berurutan** (`rentangSoal: "1-5"`).
   - **DILARANG** membuat 1 stimulus panjang hanya untuk 1 butir soal.

---

## 2. Kebijakan Proporsi Stimulus Berdasarkan Tipe Ujian

| Tipe Ujian | Proporsi Soal Mandiri (`STANDALONE` + `EMBEDDED`) | Proporsi Stimulus Bersama (`SHARED_STIMULUS_CLUSTER`) | Batas Jumlah Wacana Induk (`stimulusList`) |
| :--- | :--- | :--- | :--- |
| **Ujian Biasa** *(Formatif, STS, SAS, US)* | **65% – 75% dari total soal** | **25% – 35% dari total soal** | Maksimal **2–3 wacana induk** untuk paket 30–50 soal (kecuali mapel Bahasa/Sastra boleh 3–4 wacana). |
| **Asesmen Nasional (AKM) & TKA** | **0% – 20% dari total soal** | **80% – 100% dari total soal** | **1 wacana induk untuk setiap 3–5 soal** (misal: 30 soal = 6–8 wacana induk, **bukan** 30 wacana!). |
| **Olimpiade Sains** | **70% – 85% kasus mandiri padat** | **15% – 30% kasus multi-part** | Stimulus hanya berupa spesifikasi sistem/eksperimen yang datanya wajib dihitung. |
| **Live Quiz** | **90% – 100% soal mandiri cepat** | **0% – 10% gambar/data cepat** | Dilarang menggunakan wacana teks panjang agar terbaca dalam <15 detik. |

---

## 3. Uji Kebutuhan Stimulus (*Stimulus Necessity Test*)

Setiap soal yang merujuk ke `stimulusId` wajib lulus dua pemeriksaan:
1. **Uji Hapus Stimulus:** Jika teks/tabel stimulus dihapus, apakah soal tersebut masih bisa dijawab hanya dengan pengetahuan umum? Jika **YA**, maka stimulus tersebut hanya dekorasi kosmetik (wajib dihapus atau soalnya diubah agar mengolah data spesifik dari stimulus).
2. **Kemandirian Antar-Butir:** Jawaban pada butir nomor $k$ tidak boleh membocorkan kunci jawaban butir nomor $k+1$ di bawah stimulus yang sama.

