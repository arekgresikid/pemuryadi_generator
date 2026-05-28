# Pemuryadi Generator 🚀

**Pemuryadi Generator** adalah platform komprehensif berbasis Artificial Intelligence (AI) yang dirancang khusus untuk membantu guru, pendidik, dan siswa dalam kegiatan belajar mengajar. Ditenagai oleh teknologi **Google Gemini AI**, aplikasi ini menyediakan berbagai generator cerdas untuk mengotomatiskan pembuatan administrasi guru dan media pembelajaran interaktif.

## ✨ Fitur Utama

- 📚 **Modul Ajar Generator** - Buat modul ajar Kurikulum Merdeka secara otomatis.
- 📝 **Pembuat Soal (Evaluasi)** - Buat berbagai jenis soal pilihan ganda, essay, dll.
- 🎯 **KKTP Generator** - Buat Kriteria Ketercapaian Tujuan Pembelajaran dengan mudah.
- 📋 **Generator Rubrik Penilaian** - Buat rubrik asesmen komprehensif.
- 📑 **RPP Generator** - Rencana Pelaksanaan Pembelajaran instan.
- 🤖 **Chatbot Pintar** - Asisten AI interaktif untuk diskusi dan tanya jawab.
- 🧩 **Teka-Teki Silang (Crossword)** - Buat game edukasi TTS dari materi pelajaran.
- 🎨 **Visual Generator** - Hasilkan gambar ilustrasi menggunakan AI.
- 📓 **Jurnal Mengajar Guru** - Catat dan kelola jurnal mengajar harian.
- 📊 **Analisis Nilai** - Analisis hasil evaluasi belajar siswa.

## 🛠️ Teknologi yang Digunakan

- **Frontend:** React.js, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend & Hosting:** Cloudflare Pages, Cloudflare Workers
- **Database:** Cloudflare D1 (Serverless SQLite)
- **Autentikasi:** Google OAuth
- **AI Engine:** Google Gemini API (`gemini-2.5-pro`, `gemini-2.5-flash`)

## 🚀 Cara Menjalankan Secara Lokal (Development)

**Prasyarat:** 
- Node.js (versi 18 atau terbaru)
- Akun Cloudflare (untuk akses Wrangler & D1 Database)

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/arekgresikid/pemuryadi_generator.git
   cd pemuryadi_generator
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Atur Environment Variables (Backend Cloudflare):**
   Buat file `.dev.vars` di root directory, isi dengan credential Google OAuth:
   ```env
   GOOGLE_CLIENT_ID=client_id_anda
   GOOGLE_CLIENT_SECRET=client_secret_anda
   ```

4. **Atur API Key Gemini (Frontend Vite):**
   Buat file `.env` di root directory:
   ```env
   VITE_GEMINI_API_KEY=api_key_gemini_anda
   ```

5. **Jalankan aplikasi (2 Terminal Berbeda):**
   - Jalankan frontend (Vite):
     ```bash
     npm run dev
     ```
   - Jalankan backend (Cloudflare Pages/Workers dev server):
     ```bash
     npx wrangler pages dev .
     ```

## ☁️ Deployment (Cloudflare Pages)

Aplikasi ini dideploy ke Cloudflare Pages dengan command berikut:

```bash
npm run build
npx wrangler pages deploy dist
```

## 🔒 Privasi dan Ketentuan
Aplikasi ini sudah menyertakan dokumen [Privacy Policy](public/privacy-policy.html) dan [Terms of Service](public/terms-of-service.html) untuk menunjang verifikasi integrasi layanan pihak ketiga seperti Google OAuth.

---
*Dibuat dengan ❤️ untuk pendidikan Indonesia.*
