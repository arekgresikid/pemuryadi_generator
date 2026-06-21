# Product Requirements Document (PRD)
## 🎓 Pemuryadi Generator (digen.id)

---

### 1. Visi & Objektif Produk
**Visi:** Menjadi asisten AI pendidikan terbaik dan paling komprehensif bagi guru dan tenaga pendidik di seluruh Indonesia dalam mengelola administrasi kelas dan media pembelajaran.

**Objektif:**
- Mengotomatiskan tugas-tugas administratif guru (pembuatan RPP, Modul Ajar, dll) sehingga menghemat waktu hingga 10 jam/minggu per guru.
- Meningkatkan kualitas materi pembelajaran dan soal evaluasi berbasis AI.
- Mendukung implementasi Kurikulum Merdeka secara praktis dan mudah digunakan.

### 2. Target Pengguna (Target Audience)
- **Guru TK, SD, SMP, SMA, SMK**: Membutuhkan alat bantu cepat untuk membuat modul ajar, soal ujian, dan administrasi kelas.
- **Tenaga Kependidikan / Asesor**: Membutuhkan alat analisis seperti Evaluasi Mutu (KSP/SPMI).
- **Admin Sekolah**: Membutuhkan akses rekapitulasi atau panel pengawasan aktivitas pembelajaran.

---

### 3. Ruang Lingkup Fitur (Feature Requirements)

#### 3.1. Manajemen Pengguna & Autentikasi
- **Google OAuth 2.0 Login**: Pengguna hanya dapat masuk menggunakan akun Google untuk keamanan dan kemudahan.
- **Profil Pengguna**: Menampilkan nama, email, foto profil, sisa token, dan status langganan (Free/Premium).
- **Sistem Token & Kuota**:
  - Pengguna *Free* mendapatkan 2 token per hari.
  - Setiap kali pengguna melakukan *generate* menggunakan AI, saldo token akan berkurang.
- **Manajemen Langganan (Subscription)**: Upgrade ke paket Premium (bebas watermark, kuota token lebih banyak, prioritas antrean).

#### 3.2. Administrasi Guru (Kurikulum Merdeka)
- **Modul Ajar Generator**: Otomatis menghasilkan Modul Ajar lengkap dengan CP (Capaian Pembelajaran), TP (Tujuan Pembelajaran), dan ATP.
- **RPP Generator**: Otomatis membuat RPP 1 Lembar terstandarisasi.
- **KKTP Generator**: Pembuatan Kriteria Ketercapaian Tujuan Pembelajaran secara instan.
- **Rubrik Penilaian**: Menyediakan matriks asesmen Pengetahuan, Keterampilan, dan Sikap.
- **Prota & Promes**: Penyusunan Program Tahunan dan Program Semester berdasarkan alokasi waktu otomatis.
- **Kalender Pendidikan & Analisis Hari Efektif**: Menghitung jam mengajar bersih secara real-time.

#### 3.3. Evaluasi & Soal
- **AI Soal Generator**: Pembuatan soal Pilihan Ganda, Essay, AKM (Literasi & Numerasi), HOTS.
- **Isian Rumpang (Fill in the Blank)**: Soal melengkapi kalimat.
- **Kisi-kisi Soal**: Template otomatis untuk pedoman ujian.
- **Evaluasi Mutu (KSP/SPMI)**: Evaluasi berbasis AI (menggunakan 5 Why, Fishbone, Venn Diagram) untuk memberikan rekomendasi program strategis lintas standar KSP.

#### 3.4. Gamifikasi & Media Interaktif
- **Game Edukasi AI**: Adventure Journey, Ranking 1 Game, Snake & Ladder, Memory Matrix, Matching Pairs, dan Unscramble Letters.
- **Crossword & Word Search Generator**: Membuat teka-teki silang dan cari kata otomatis dari materi bahan ajar.

#### 3.5. AI Tools & Produktivitas
- **Chatbot Pendidikan**: Chat AI untuk diskusi pedagogik.
- **AI Visual Generator**: *Text-to-image* khusus untuk ilustrasi bahan ajar.
- **Analisis Dokumen (PDF/Word)**: Upload dokumen untuk diringkas atau dianalisis.
- **Pembagi Kelompok (Group Generator)** & **Barcode/QR Generator**.
- **Jurnal Mengajar Guru**: Catatan refleksi harian guru.

---

### 4. Spesifikasi Teknis (Technical Requirements)

#### 4.1. Teknologi & Arsitektur
- **Frontend**: React.js 18.3, TypeScript 5.6, Vite, Tailwind CSS 3.4, Framer Motion (untuk UI UX & Animasi).
- **Backend / Infrastruktur**: Cloudflare Pages (Hosting) & Cloudflare Workers (Serverless API).
- **Database**: Cloudflare D1 (Serverless SQLite) untuk menyimpan data pengguna, riwayat generasi, dan transaksi token.
- **AI Engine**: Google Gemini AI (Models: `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-2.0-flash-exp`).

#### 4.2. Skema Database Utama
- **`users`**: Menyimpan ID, email, nama, tier langganan, saldo token.
- **`subscriptions`**: Mencatat histori dan status aktif langganan pengguna premium.
- **`generation_history`**: Mencatat log setiap aktivitas AI untuk audit dan pemotongan token.

---

### 5. Persyaratan Non-Fungsional (Non-Functional Requirements)

- **Performa & Skalabilitas**: 
  - Waktu respons memuat antarmuka di bawah 2 detik.
  - Generasi AI harus selesai dalam waktu < 10-15 detik tergantung kompleksitas (dengan *loading state* interaktif).
  - Infrastruktur Cloudflare memungkinkan auto-scaling untuk menampung >10.000 pengguna aktif.
- **Keamanan (Security)**:
  - Seluruh komunikasi harus dienkripsi menggunakan HTTPS.
  - Implementasi kebijakan *Privacy Policy* terkait keamanan data anak dan pendidikan.
  - Token API Google Gemini tidak boleh terekspos di sisi klien (diproses aman melalui backend/Workers).
- **Aksesibilitas (Accessibility) & UX**:
  - Desain *Mobile First* (Responsif untuk penggunaan via Smartphone / Tablet oleh guru).
  - Progressive Web App (PWA) agar bisa di-install selayaknya aplikasi *native*.

---

### 6. Roadmap Proyek

- **Q1 2026 (Selesai)**
  - Peluncuran dengan >20 fitur utama.
  - Integrasi Google Gemini 2.0, sistem token berlangganan, dashboard analitik, dan *mobile responsive*.
- **Q2 2026 (Tahap Pengembangan)**
  - Aplikasi Mobile Native (React Native).
  - Pengeditan Dokumen secara kolaboratif (*real-time*).
  - *Template marketplace* untuk berbagi RPP antar guru.
  - API eksternal dan *Batch Generation*.
- **Q3 & Q4 2026 (Perencanaan)**
  - Integrasi AI Tutor langsung untuk siswa.
  - Dukungan multibahasa.
  - Integrasi Sistem Informasi Manajemen (SIM) Sekolah dan panel orang tua.
  - AI Asisten Grading (koreksi otomatis ujian essai).
