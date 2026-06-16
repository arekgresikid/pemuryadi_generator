---
name: pemuryadi-generator-dev
description: Panduan komprehensif untuk proyek Pemuryadi Generator (digen.id), mencakup arsitektur lengkap, daftar komponen (Kurikulum, AI, Evaluasi, Game), database D1, API Hono, dan standar operasional developer.
---

# 🎓 Pemuryadi Generator Development Skill

Panduan komprehensif ini dirancang untuk memandu agen dan developer saat mengerjakan proyek **Pemuryadi Generator** (di direktori kerja saat ini), sebuah platform AI pendidikan inovatif (https://digen.id) yang dirancang untuk pendidik di Indonesia.

---

## 🏗️ Arsitektur & Tech Stack

Platform ini menggunakan arsitektur modern berbasis serverless dan edge computing:

### Frontend
- **Framework:** React 18.3, TypeScript 5.6
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3.4
- **Animation & Icons:** Framer Motion, Lucide React
- **Notifications:** React Hot Toast
- **Lainnya:** `react-markdown` (render output AI), `pdfjs-dist` (PDF parsing), `react-simple-maps`, `qrcode.react`, html2canvas, jspdf.

### Backend & Infrastructure
- **Hosting:** Cloudflare Pages
- **Serverless API:** Cloudflare Workers menggunakan framework **Hono** (`functions/api/[[route]].ts`).
- **Database:** Cloudflare D1 (Serverless SQLite).
- **AI Engines:** 
  - **Google Gemini API** / **OpenAI SDK Wrapper** (`@google/genai`) dari `src/lib/genai.ts`.
  - **Pollinations AI Proxy** (sebagai fallback Text & Image generator bypass).
- **Authentication:** Google OAuth 2.0 via Hono JWT Cookies.

---

## 📂 Peta Komponen (Component Map)

Semua komponen utama berada di `src/components/`. Terdapat puluhan alat cerdas, dikelompokkan menjadi:

### 1. Kurikulum & Perangkat Ajar
- `ModuleGenerator.tsx` - Modul Ajar Kurikulum Merdeka (dilengkapi integrasi format "Kemenag RPM Berbasis Cinta").
- `ModulP5.tsx`, `ModulKokurikuler.tsx` - Proyek P5 dan Kokurikuler.
- `ProgramTahunan.tsx`, `ProgramSemester.tsx`, `KalenderPendidikan.tsx`, `AnalisisHariEfektif.tsx` - Perangkat perencanaan waktu.
- `KKTP.tsx`, `RubrikPenilaian.tsx` - Alat penilaian.
- `Supervision.tsx`, `EvaluasiMutu.tsx`, `SNP.tsx` - Standar Nasional dan Instrumen Supervisi.
- `DailyJournal.tsx`, `MengajarHarian.tsx` - Jurnal/Buku Kerja.

### 2. Generator Evaluasi & Soal
- `BuatSoal.tsx` - Generator soal cerdas.
- `WorksheetGenerator.tsx` - LKPD interaktif.
- `AIAssistedInput.tsx`, `AIAssistedTextarea.tsx` - Komponen cerdas injeksi AI pada form.

### 3. EduGames (Gamifikasi Pembelajaran)
- `GamesHub.tsx` - Portal utama permainan.
- `CrosswordGenerator.tsx` (Teka Teki Silang)
- `WordSearch.tsx` (Cari Kata)
- `SnakeLadder.tsx` (Ular Tangga Edukasi)
- `MatchingPairs.tsx` (Mencocokkan Kartu)
- `RankingSatu.tsx` (Kuis Interaktif)
- `MemoryMatrix.tsx`, `FillBlanks.tsx`, `UnscrambleLetters.tsx`, `GameIFP.tsx`, `AdventureJourney.tsx`.

### 4. Asisten AI & Tools Ekstra
- `Chatbot.tsx` - Chatbot edukasi dengan context awareness "RuangRiung".
- `AIVisualGenerator.tsx` - Pembuat gambar/sketsa untuk presentasi (terintegrasi dengan Pollinations).
- `StrategicAdvisor.tsx` - AI Konsultan Strategi Sekolah.
- `DeepLearningPlan.tsx` - Perencanaan pembelajaran mendalam.
- `GroupGenerator.tsx`, `BarcodeGenerator.tsx`, `InvoiceGenerator.tsx`.
- `PDFRemixUpload.tsx`, `DocumentUpload.tsx` - Pengolah dokumen cerdas.

### 5. Layout & Core
- `MainLandingPage.tsx`, `SEOLandingPage.tsx` - Halaman depan (Landing Pages).
- `App.tsx` - React Router Setup (terdapat route untuk Admin, Pricing, Changelog, dsb).
- `layout/Dashboard.tsx`, `layout/Sidebar.tsx`, `layout/Topbar.tsx` - Shell navigasi utama aplikasi.
- `AdminPanel.tsx` - Super admin dashboard (CRM, Analytics via Recharts, User Editor).
- `QuickProfile.tsx` - Komponen profil sekolah / identitas personal pengguna yang datanya dikirim sebagai prefix prompt ke AI.

---

## 🔒 Keamanan, Autentikasi & Context

Aplikasi memiliki manajemen kredensial dan hak akses yang solid:

1. **`src/AuthContext.tsx`**
   - Mengelola state global user. Memanggil `/api/auth/me`.
   - Mengurus logika tier (`Free`, `Premium`, `Ultimate`, `Titan`, `admin`, `owner`).
   - Fungsi `consumeToken()` di frontend akan menahan request API `/api/tokens/use` jika user memiliki peran *privileged* (Titan/Admin), mencegah penghabisan token API tak perlu.

2. **Backend API (`functions/api/[[route]].ts`)**
   - Routing Hono mengatur endpoint: `/auth/google`, `/auth/me`, `/users`, `/tokens`, `/admin/...`
   - Semua route dilindungi middleware JWT. Endpoint admin divalidasi dengan `role === 'admin' || role === 'owner'`.

---

## 💾 Skema Database (D1 SQLite)

Berada di `schema.sql`.

1. **`users`**
   - `uid` (PK), `email`, `role`, `tier`, `tokens`, `activeUntil`, `isBanned`, `suspendedUntil`.
   - **Profil:** `nip`, `jenjang`, `tahunPelajaran`, `namaSekolah`, `kepalaSekolah`, `jenisNipKepalaSekolah`, `nipKepalaSekolah`, `nama`, `jenisNipGuru`.
2. **`activity_logs`** & **`admin_logs`**
   - Pencatatan notifikasi sistem dan jejak langkah admin.
3. **`stats`**
   - Pengumpulan data analitik (seperti jumlah visitor/favorit).

*(Beberapa kolom database di-patch runtime menggunakan fungsi `ensureDbSchema()` di `[[route]].ts` untuk menghindari migrasi manual).*

---

## 🎨 Logika Kecerdasan Buatan (AI Prompt Engineering)

Pendekatan aplikasi ini: **Semua logika AI dikendalikan dari komponen Frontend**.

1. **`src/lib/genai.ts`**
   - Wrapper cerdas. Meneruskan request ke backend Hono `/api/ai/generate` atau ke Pollinations.
   - Menyematkan *Watermark Gratis* bagi user tier bawah untuk response teks non-JSON.
2. **JSON Schema Enforcement**
   - Di `ModuleGenerator.tsx`, `BuatSoal.tsx`, dll, prompt dikirim bersamaan dengan *interface/schema* untuk memaksa model memberikan jawaban berstruktur terprediksi.
3. **`src/constants.ts` (The Brain Dictionary)**
   - Ribuan baris pemetaan Capaian Pembelajaran (CP) Merdeka, ATP, Fase, TPACK, level kognitif taksonomi Bloom. Form generator tidak ada yang *hardcode* pilihan, semua bersumber dari file ini.

---

## 🤖 Referensi Integrasi Pollinations AI

Aplikasi ini sangat bergantung pada **Pollinations AI** (`gen.pollinations.ai`) sebagai penyedia API multifungsi untuk *Text, Image, Audio*, dan *Video*. Pollinations 100% kompatibel dengan standar OpenAI SDK (`@google/genai` atau `openai`).

### Authentication & Base URL
- **Base URL:** `https://gen.pollinations.ai`
- **Dashboard API Key:** `enter.pollinations.ai` (Gratis untuk prototyping)
- **Tipe Key:** Gunakan prefix `sk_` (Secret) untuk backend (tanpa rate-limit), dan `pk_` (Publishable) untuk klien frontend. Autentikasi bisa via Header `Authorization: Bearer <KEY>` atau Query Param `?key=<KEY>`.

### Contoh Penggunaan Cepat
1. **Text Generation (OpenAI SDK / Python/JS):**
   Gunakan SDK OpenAI dan ubah Base URL. Endpoint: `POST /v1/chat/completions`.
   ```js
   const client = new OpenAI({ baseURL: "https://gen.pollinations.ai", apiKey: "YOUR_API_KEY" });
   const response = await client.chat.completions.create({ model: "openai", messages: [...] });
   ```
   **Model Teks Unggulan:** `openai`, `gemini-3.5-flash`, `claude-opus-4.8`, `deepseek-pro`, `qwen-coder-large`, `llama-scout`. (Gunakan `GET /text/{prompt}` untuk plain text response).

2. **Image Generation (URL Langsung):**
   Sangat cocok untuk merender placeholder atau komponen visual seperti di `AIVisualGenerator.tsx`.
   ```
   https://gen.pollinations.ai/image/a%20cat%20in%20space?model=flux
   ```
   **Model Gambar Unggulan:** `flux`, `ideogram-v4-turbo`, `nanobanana-pro`, `nova-canvas`.

3. **Video & Audio Generation:**
   - **Video:** `https://gen.pollinations.ai/video/sunset?model=veo&duration=4` (Model: `veo`, `wan-pro`, `nova-reel`).
   - **Audio (TTS):** Gunakan `POST /v1/audio/speech` (OpenAI format) atau `GET /audio/{text}?voice=nova`.
   - **Realtime Voice:** Tersedia proxy WebSocket di `wss://gen.pollinations.ai/v1/realtime?model=gpt-realtime-2`.

4. **Safety Filter:**
   Anda dapat menambahkan parameter `?safe=privacy` atau `?safe=true` pada URL atau request body untuk mensensor otomatis PII (Personal Identifiable Information) atau NSFW konten.

---

## 🖨️ Sistem Cetak (Printing System)

Sistem cetak harus berjalan di luar modal / frame utama karena layout HTML ke PDF:

- **Wajib Gunakan Utility `createPrintWindow`:** Dari `src/utils/print.ts`. Hindari penggunaan `window.print()` standar langsung yang seringkali error/blank.
- **Implementasi:** Di dalam fungsi tombol cetak Anda, panggil `createPrintWindow(contentHtml, title, styles)`.
- **CSS Helper:** Tambahkan *class* `.print-hidden` pada elemen (seperti tombol aksi, footer navigasi) atau gunakan `display: none` khusus `@media print` agar elemen tidak ikut tercetak.
- **Watermark:** Terintegrasi di `getWatermarkHtml(profile?.role)` menyematkan "PEMURYADI - MAJU PENDIDIKAN INDONESIA".

---

## 🤝 Standar Git & Kolaborasi Tim

1. **Pencatatan Changelog:** Sebelum melakukan *commit* dan *push*, agen AI **WAJIB** mencatat perubahan di dalam file `src/data/changelog.json`. File `CHANGELOG.md` digenerate secara otomatis dari file JSON saat proses `npm run build`. **JANGAN mengedit `CHANGELOG.md` secara manual!**
2. **Gunakan Branch `main`:** Aplikasi menggunakan `main` sebagai dasar utama.
3. **Pembersihan Terminal & Lokal:** Setelah merge atau task selesai, agen harus membuang test file, *feature branch* lama, dan sisa *checkout* yang tak lagi digunakan agar bersih saat pindah ke task selanjutnya.

---

## 🚀 Deployment

Deployment via **Cloudflare Pages**:
```bash
npm run build
npx wrangler pages deploy dist
```

*(Saat menjalankan testing lokal backend, gunakan `npx wrangler pages dev .` yang akan melayani folder `dist` build terakhir)*
