---
name: pemuryadi-generator-dev
description: Panduan komprehensif dan instruksi pengembangan tingkat lanjut untuk proyek Pemuryadi Generator (digen.id), mencakup arsitektur Hono, struktur komponen, logika keamanan (AuthContext & AdminPanel), dan integrasi AI (Chatbot & Proxy API).
---

# 🎓 Pemuryadi Generator Development Skill

Panduan komprehensif ini dirancang untuk memandu agen dan developer saat mengerjakan proyek **Pemuryadi Generator** (di direktori kerja saat ini), sebuah platform AI pendidikan terbaik untuk Guru Indonesia (https://digen.id).

---

## 🏗️ Arsitektur & Tech Stack

Platform ini menggunakan arsitektur modern berbasis serverless dan edge computing:

### Frontend
- **Framework:** React 18.3
- **Language:** TypeScript 5.6
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3.4
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Other Libs:** `react-markdown`, `pdfjs-dist` (untuk PDF parsing), `react-simple-maps`, `qrcode.react`.

### Backend & Infrastructure
- **Hosting (Frontend):** Cloudflare Pages
- **Serverless API:** Cloudflare Workers menggunakan framework **Hono**.
- **Database:** Cloudflare D1 (Serverless SQLite).
- **AI Engines:** 
  - **Google Gemini API** / **OpenAI SDK Wrapper** (`@google/genai`) yang dipanggil dari sisi klien melalui `src/lib/genai.ts`.
  - **Pollinations AI Proxy** (sebagai API text & image fallback/bypass di backend Hono).
- **Authentication:** Google OAuth 2.0 (diimplementasikan manual di backend dengan Hono JWT Cookies).

---

## 🔒 Logika Keamanan & Autentikasi (AuthContext)

Aplikasi memiliki manajemen kredensial dan hak akses yang solid:

1. **`src/AuthContext.tsx`**
   - Komponen ini membungkus aplikasi dan menggunakan `fetchSession()` untuk memanggil `/api/auth/me`.
   - Mengelola state `user` dan `profile` (termasuk status tier langganan dan `tokens`).
   - Terdapat fungsi `consumeToken()`: Jika user berada pada tier privileged (`Titan`, `owner`, atau `admin`), token *tidak akan dikurangi* melalui API (langsung direturn `true`). Jika bukan, ia memanggil `useToken()` dari `src/api.ts`.
2. **`src/api.ts`**
   - Fungsi `useToken()` memanggil POST `/api/tokens/use`. Jika token habis (status 403) atau tidak login (status 401), ia akan men-*dispatch* event kustom secara global ke `window` (contoh: `showLoginModal`, `tokenConsumed`, `showFreeTokenWarning`). Ini mempermudah UI update tanpa perlu *prop drilling*.
3. **Backend Middleware (`functions/api/[[route]].ts`)**
   - Semua route Hono dilindungi oleh middleware yang memvalidasi *JWT Cookie*. Route spesifik `/api/admin/*` memiliki pengecekan ganda di mana `user.role` wajib sama dengan `owner` atau `admin`.

---

## 🤖 Logika AI & Chatbot

1. **AI Wrapper (`src/lib/genai.ts`)**
   - Meski nama modulnya `GoogleGenAI`, di bawah *hood* kelas ini sebenarnya membuat instansiasi dari library `openai` yang di-proxy ke `baseURL: /api`. Ini meneruskan *request* ke backend Hono, lalu backend Hono memanggil URL `https://gen.pollinations.ai`.
   - Modul ini menyematkan **watermark** ("*Dibuat menggunakan versi Gratis...*") secara otomatis ke jawaban AI khusus bagi pengguna pada **tier Free** jika bukan respon array atau JSON schema khusus.
2. **Chatbot Component (`src/components/Chatbot.tsx`)**
   - Asisten AI disetup dengan *System Instruction* yang sangat ketat: *“Anda adalah asisten AI resmi dari Pemuryadi Generator & RuangRiung (Cyber Education Workspace)...”*
   - Memiliki *context awareness* terhadap istilah pendidikan (e.g. RPM wajib diartikan sebagai "Rencana Pembelajaran Mendalam", bukan "Rencana Pekerjaan Mingguan").
   - History percakapan (`user` vs `model`) disimpan di dalam *local state* `messages`.

---

## 📁 Struktur Direktori & Pola Komponen

Sebagian besar logika aplikasi tertanam langsung dalam komponen di `src/components`:

- **Modul & RPP:** `ModuleGenerator.tsx`, `ModulP5.tsx`, `ModulKokurikuler.tsx`, `ProgramTahunan.tsx`, `ProgramSemester.tsx`, `KKTP.tsx`, `RubrikPenilaian.tsx`
- **Soal & Evaluasi:** `BuatSoal.tsx`, `CrosswordGenerator.tsx`, `WordSearch.tsx`, `FillBlanks.tsx`
- **Game & Media:** `AdventureJourney.tsx`, `RankingSatu.tsx`, `SnakeLadder.tsx`, `MemoryMatrix.tsx`, `MatchingPairs.tsx`
- **Admin & Dashboard:** `AdminPanel.tsx` -> Merupakan panel super-admin yang sangat masif, memuat ratusan baris kode untuk mengelola:
  - **Analitik (Overview):** Visualisasi data pengguna berdasarkan Tier dan Role menggunakan grafik *Recharts*.
  - **Manajemen Pengguna:** *CRUD User*, *Bulk Actions* (Suspend/Ubah Tier), impor/ekspor pengguna ke file Excel (CSV).
  - **Pengaturan:** Modifikasi tabel D1 dinamis, *Global Announcements*, dan manajemen harga langganan.

---

## 💾 Skema Database D1 (`schema.sql`)

D1 menggunakan SQLite dialect. Tabel-tabel utama yang sering digunakan:

1. **`users`**
   - Field Penting: `uid` (PK), `email`, `role` (owner/admin/guest/siswa), `tier` (Free, Premium, Ultimate, Supreme, Titan, dll), `tokens`, `activeUntil`, `isBanned`, `suspendedUntil`.
   - Menampung informasi profile pengguna dan detail sekolah (`nip`, `jenjang`, `namaSekolah`, dll).
2. **`token_usage_logs`**
   - Mencatat log pemakaian token per `uid` (nama action, tokens spent, timestamp) untuk melacak aktivitas generator.
3. **`admin_logs` & `activity_logs`**
   - Untuk memantau pergerakan admin (seperti saat admin merubah setting) dan log aktivitas (seperti notifikasi pembelian yang bisa jadi ditrigger dari luar / Webhook).
4. **Tabel `settings`**
   - Meski tidak selalu dijabarkan di skema SQL awal, *backend* sering membaca `settings` (misal: `promo_trial_active`, `maintenance_active`) untuk mengatur keadaan global sistem.

*(Catatan: Beberapa kolom seperti `activeUntil` dan `isBanned` di-patch secara dinamis saat runtime oleh fungsi `ensureDbSchema()` di `[[route]].ts`.)*

---

## 🛠️ Setup & Development Local

**Prasyarat**: Node.js v18+ dan akun Cloudflare dengan Wrangler.

**1. Environment Variables:**
Frontend (`.env`):
```env
VITE_GEMINI_API_KEY=api_key_gemini_anda
```
Backend (`.dev.vars`):
```env
GOOGLE_CLIENT_ID=client_id_anda
GOOGLE_CLIENT_SECRET=client_secret_anda
JWT_SECRET=secret_string
ADMIN_EMAILS=admin@domain.com
```

**2. Setup Database Lokal:**
```bash
npx wrangler d1 create pemuryadi-db
npx wrangler d1 execute pemuryadi-db --local --file=./schema.sql
```

**3. Run App (2 Terminal):**
```bash
npm run dev                 # Frontend di localhost:5173
npx wrangler pages dev .    # Backend API di localhost:8788
```

---

## 🏗️ Struktur Komponen Generator & Frontend Prompt Engineering

Aplikasi ini menggunakan pendekatan unik di mana **semua logika kecerdasan buatan (Prompt Engineering) dikendalikan dari komponen Frontend**.

1. **`src/components/ModuleGenerator.tsx` (dan generator lainnya seperti `BuatSoal.tsx`)**
   - Komponen ini tidak hanya merender UI, namun merakit *prompt* yang sangat kompleks berdasarkan input *form* pengguna.
   - **JSON Schema Enforcement:** Prompt diatur untuk memaksa model (via `responseSchema`) mengembalikan format JSON yang ketat (misal: struktur `capaianPembelajaran`, `tujuanPembelajaran`, objek `kegiatanPembelajaran` terpisah menjadi `pembuka`, `inti`, dan `penutup`).
   - Terdapat logika *fallback* dan kondisional seperti integrasi mode "Kemenag RPM Berbasis Cinta" yang secara dinamis menyuntikkan instruksi khusus (misal: penambahan nilai "Heartful Learning" dan "Profil Pelajar Rahmatan Lil 'Alamin") jika format Kemenag dipilih.
2. **Kamus Data Sentral (`src/constants.ts`)**
   - Merupakan "otak" data statis dari aplikasi ini. Berisi ribuan baris pemetaan untuk standar pendidikan Kurikulum Merdeka Indonesia.
   - Mendefinisikan Capaian Pembelajaran (CP) per fase, topik materi per mata pelajaran, tingkatan kelas (PAUD hingga SMA), dan prinsip-prinsip pedagogi (TPACK, STEAM).
   - *Penting:* Jangan hapus variabel di file ini karena seluruh *dropdown* form generator sangat bergantung padanya.
3. **Cetak & Ekspor (`src/utils/print.ts` & Logika Print HTML)**
   - Semua hasil AI di-*render* menjadi dokumen PDF/Cetak melalui pembukaan jendela baru (`window.open`) yang diinjeksi dengan elemen HTML dan blok CSS khusus (`@media print`).
   - Fungsi `getWatermarkHtml(profile?.role)` menyematkan *watermark* transparan (seperti "PEMURYADI - MAJU PENDIDIKAN INDONESIA") yang sulit dihapus oleh pengguna karena menempel langsung di latar dokumen yang dicetak.

---

## 🤝 Git Workflow & Kolaborasi Tim

Untuk menjaga kebersihan riwayat *commit* dan menghindari konflik antar kontributor, agen dan developer **wajib** mengikuti standar *workflow* berikut:

1. **Gunakan `main` sebagai dasar utama:** Pastikan seluruh pengembangan fitur baru selalu berawal dari *branch* `main` yang paling mutakhir.
2. **Pembersihan Branch Lokal:** Jika sebuah *feature branch* atau *fix branch* (seperti `fix/ui-layout-and-dropdown`) telah di-*merge* ke `main` dan dihapus dari repositori remote (GitHub), kontributor **wajib** segera menyingkirkan *branch* tersebut di lokal mereka untuk mencegah *push* yang tidak disengaja.
3. **Pencatatan Changelog:** Sebelum melakukan *commit* dan *push* (baik untuk fitur baru, revisi, maupun perbaikan bug), agen AI **WAJIB** mencatat perubahan tersebut di dalam file `CHANGELOG.md`. Hal ini penting agar seluruh rekam jejak pengembangan terekam dengan baik.
4. **Standar Perintah Pembersihan:**
   ```bash
   git checkout main
   git pull origin main
   git fetch --prune
   # Hapus branch lama secara lokal (opsional namun sangat disarankan)
   git branch -D nama-branch-yang-sudah-selesai
   ```
5. **Agen AI:** Jika agen AI menemukan *branch* lama setelah *merge*, agen harus proaktif berpindah ke `main` dan membersihkan sisa *checkout* sebelum melanjutkan instruksi.

---

## 🚀 Deployment ke Production

Deployment sepenuhnya dikelola oleh **Cloudflare Pages**.

```bash
npm run build
npx wrangler pages deploy dist
```

**Penting untuk Agen Selanjutnya:** 
- Saat menambahkan/memperbarui fitur *generator* baru, perhatikan struktur *Prompt Engineering* yang ada (gunakan instruksi sistematis, batasi output dengan JSON Schema).
- Untuk mengubah atau menambah opsi mata pelajaran, selalu lakukan melalui pembaruan di `constants.ts`.
- Jika ada masalah integrasi AI, periksa alur `Chatbot.tsx` -> `genai.ts` -> `[[route]].ts` (Hono proxy). Keamanan limit akses dipegang oleh *React Context* (`AuthContext.tsx`).

