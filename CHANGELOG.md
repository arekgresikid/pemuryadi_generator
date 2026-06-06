# Changelog & Riwayat Versi Pemuryadi Generator

Berisi rekapitulasi riwayat pembaruan sistem yang ditarik dari Git Commits.

## Versi 5.2.5
**Tanggal:** 7 Juni 2026

- **Branding Landing Page Khusus:** Menerapkan identitas "digen.id" secara khusus hanya pada elemen visual halaman Landing Page (seperti logo navbar dan teks hero) untuk kebutuhan pemasaran, sementara bagian utama aplikasi serta **judul tab browser (SEO & Google Auth)** tetap menggunakan nama otentik "Pemuryadi Generator".
- **Penyempurnaan Responsivitas Mobile:** Mengoptimalkan ukuran *font* judul, *padding* navbar, serta mengatur jarak antar-elemen di *Hero Section* agar tampilan di layar gawai pintar (mobile) tidak lagi saling bertumpuk atau berhimpitan.
- **Normalisasi Bilah Gulir (Scrollbar):** Menghapus seluruh manipulasi *scrollbar* kustom dan restriksi `height: 100%` pada CSS global agar peramban (browser) pengguna dapat menangani guliran halaman secara natural (*native scrolling*).
- **Landing Page Baru yang SEO-Friendly:** Mengganti alur login langsung ke Dashboard dengan Halaman Utama (Landing Page) bergaya pemasaran modern (*Marketing-oriented*).
- **Elemen Peningkatan Konversi (CTA):** Menambahkan blok *Hero Section* dengan tajuk tebal yang lebih padat & ringkas, tombol *Call-to-Action* (Coba Gratis), metrik statistik (*Social Proof*), dan alur 3 langkah mudah penggunaan (Cara Kerja).
- **FAQ Interaktif & Relevan:** Menambahkan 8 Pertanyaan Umum (FAQ) interaktif berbasis *Accordion* lengkap dengan konteks spesifik sistem (anti-plagiasi, ekspor Word, Mulok/Kejuruan) untuk meyakinkan calon pengguna baru dan membantu pengindeksan SEO.
- **Penyempurnaan Tampilan Antarmuka:** Membuang bagian mockup statis dan seksi testimoni untuk menjaga kebersihan visual (karena aplikasi masih baru). Menyempurnakan posisi *Navbar*, memangkas tinggi *Hero Section*, serta memberikan palet warna dinamis lengkap dengan ikon pada seluruh kartu modul dan kartu benefit ("Mengapa Pendidik Memilih Kami").
- **Transisi Halus Mulus:** Menerapkan sistem deteksi akses `hasEnteredApp` via `localStorage` sehingga Landing Page hanya muncul pada kunjungan pertama atau pengguna baru, sementara pengguna setia akan langsung diarahkan ke Dashboard.

## Versi 5.2.4
**Tanggal:** 7 Juni 2026

- **Standardisasi Desain UI Secara Massal:** Menyeragamkan keseluruhan tata letak untuk seluruh komponen *generator* (termasuk Modul Ajar, RPM, Program Semester, Instrumen Supervisi, Jurnal, KKTP, Modul Kokurikuler, dll). Menghapus warna latar belakang lama (`bg-red-50`) yang terkesan menyatu, serta mengadopsi format kartu putih bersih (`bg-white`) dengan garis luar tipis dan bayangan lembut agar lebih kontras dan tidak membingungkan pengguna.
- **Pembaruan Kolom Input:** Mengganti warna latar belakang dan garis batas (border) pada seluruh kolom isian teks dan menu tarik-turun (dropdown) untuk meningkatkan visibilitas dan kemudahan membaca.
- **Penghapusan Animasi Mengganggu:** Menghapus efek animasi melompat (efek seolah-olah bergeser ke atas atau *translate-Y*) pada kartu-kartu antarmuka utama saat kursor diarahkan (hover), memberikan pengalaman penggunaan form yang lebih tenang dan stabil.
- **Implementasi Akordion (Collapsible):** Mengubah tata letak kartu formulir panjang (long-form cards) pada seluruh halaman generator (seperti Supervisi, Jurnal Harian, Rencana Pembelajaran Mendalam, Program Semester, Modul Kokurikuler, dll) menjadi antarmuka akordion. Hal ini mencegah halaman menjadi terlalu panjang dan mempermudah navigasi pada layar kecil.
- **Optimalisasi Ruang Layar:** Merapikan lebar dropdown teks panjang pada Modul Kokurikuler serta membuang elemen kontainer berlapis tak perlu di komponen KKTP dan modul-modul lainnya.
- **Perbaikan Bug (Struktur UI):** Memperbaiki masalah (*bug*) tata letak dan kesalahan sintaks (error render) yang sempat muncul pada komponen `ModulKokurikuler` dan `ModuleGenerator` setelah penerapan perubahan akordion.
- **Penyempurnaan Kursor Global:** Menerapkan aturan CSS secara menyeluruh agar semua elemen interaktif (seperti tombol, link, akordion/summary, checkbox, dan radio button) otomatis memunculkan kursor tangan (pointer) saat diarahkan (hover).
- **Perbaikan Keterbacaan Kunci Jawaban:** Menyempurnakan format spasi baris (*whitespace-pre-wrap*) pada bagian luaran teks Kunci Jawaban AI di pembuat soal agar tulisan terbaca lebih jelas dan rapi.
- **Variasi Gambar Visual AI:** Menambahkan seed (nilai acak) ke dalam parameter prompt pembuatan gambar AI (Kartu Soal) agar *output* gambar yang dihasilkan tidak selalu sama/redundan.
- **Indikator Loading Spesifik:** Menyematkan indikator memuat (spinner berputar) secara individual ketika pengguna me-regenerate ulang soal, memberikan umpan balik visual yang interaktif.

## Versi 5.2.3
**Tanggal:** 7 Juni 2026

- **Peningkatan UI/UX Pembuat Soal:** Merombak tata letak antarmuka (UI) menjadi model Kartu (*Cards*) bersusun vertikal agar terlihat lebih rapi, modern, dan mudah dinavigasi di perangkat *mobile* maupun *desktop*.
- **Pembaruan Grid Responsif:** Memperbaiki masalah elemen formulir (seperti kolom Fase, Kelas, dan jumlah Bentuk Soal) yang saling berhimpitan dan bertumpuk pada layar sedang/besar.
- **Fitur Baru "Live Quiz":** Menambahkan opsi Tipe Ujian "Live Quiz" yang secara otomatis menyesuaikan *prompt* AI dan menyediakan antarmuka pratinjau kuis interaktif untuk uji coba soal secara langsung.
- **Pembaruan Kurikulum Madrasah:** Menambahkan daftar mata pelajaran spesifik Pendidikan Agama Islam (PAI) & Bahasa Arab seperti Qur'an Hadist, Akidah Akhlak, Fikih, dan SKI.
- **Perbaikan Kutu (*Bug Fix*):** Memperbaiki masalah dropdown "Fase" dan "Kelas" yang kosong tidak memuat opsi akibat kegagalan sinkronisasi state inisialisasi pada *LocalStorage*.
- **Penggantian Emoji dengan Ikon Standar:** Mengganti seluruh penggunaan emoji teks (*native emoji*) yang tampil tidak konsisten di berbagai perangkat keras dengan Ikon Lucide React standar yang seragam, rapi, dan konsisten di seluruh browser/platform.

## Versi 5.2.2
**Tanggal:** 6 Juni 2026

- Mengimplementasikan fitur penyimpanan otomatis (*Auto-Save*) dengan `localStorage` pada seluruh modul generator, memastikan data yang telah diketik tidak akan hilang walau halaman di-*refresh*.
- Mengintegrasikan pengiriman otomatis form Masukan & Saran (*Feedback*) langsung ke pesan WhatsApp Admin.
- Menambahkan panel informasi instruksi pelaporan *Bug & Error* pada antarmuka *Dashboard* (dilengkapi dengan panduan *screenshot* dan opsi kirim via email).

## Versi 5.2.1
**Tanggal:** 4 Juni 2026

- Peningkatan Besar-besaran (Refactoring) Arsitektur Barcode & QR Code Generator:
  - Mengubah library ke `react-qrcode-logo` untuk menjamin logo tetap ter-render saat QR Code diunduh.
  - Memperbarui layout menjadi sistem 2 kolom modern (Grid) dengan kolom Pratinjau melayang (*sticky*).
  - Menambahkan fitur animasi mulus menggunakan library `framer-motion` (*motion/react*).
  - Menambahkan kustomisasi gaya bentuk Barcode (Kotak/Titik) dan kelengkungan sudut mata (*Eye Radius*).
  - Menambahkan dukungan tombol cepat (Preset Data) seperti tautan WhatsApp Admin dan URL *digen.id*.
  - Menambahkan tombol *Salin Teks* dan *Bagikan* (*Native Share API*).
- Menambahkan gambar logo QR Code Pemuryadi di bawah bagian hak cipta Footer.

## Versi 5.2.0
**Tanggal:** 4 Juni 2026

- Menambahkan lebih banyak variasi kalimat pada animasi mengetik di Dashboard.
- Memperbaiki tampilan nama aplikasi untuk keperluan kelancaran verifikasi Google OAuth.
- Pembersihan kode dan skrip utilitas lama.
- Memperbarui desain OG Image (gambar bagikan sosial media) dengan tema pendidikan yang elegan.
- Meningkatkan fitur Programmatic SEO dan perluasan fitur Admin Panel.
- Penyelesaian konflik kode (merge conflicts) dan perbaikan komponen WelcomePopup.
- Mengganti logo favicon aplikasi menjadi bentuk bulat (circle) yang baru.
- Memperbarui resolusi gambar Open Graph (og-image.jpg) menjadi 1200x630px dan menukar posisi teks sesuai pesanan.
- Membuat halaman dokumentasi Riwayat Versi (Changelog) interaktif yang dapat diakses langsung dari Footer.
- Menambahkan banner promo diskon 20% khusus pengguna baru di halaman Pricing, Dashboard, dan pada modal WelcomePopup.
- Menambahkan fitur Generator Barcode dan QR Code gratis dengan fitur kustomisasi warna, logo, dan unduh gambar beresolusi tinggi, beserta peringatan privasi tidak disimpannya data di server.
- Memperbarui nomor rekening tujuan hanya ke BCA (a.n. Praswara Eko Muryadi).
- Memperbarui nomor E-Wallet ke xxx, menghapus OVO dari opsi pembayaran, serta mengubah nomor tujuan klaim WhatsApp ke xxx.
- Menyempurnakan teks pesan klaim otomatis WhatsApp dan SEO menjadi "Pemuryadi Generator".

## Versi 5.1.9
**Tanggal:** 3 Juni 2026

- Memperbarui instruksi sistem Chatbot AI, UI, dan memperbaiki tampilan modal login.
- Melakukan refaktor besar-besaran pada App.tsx menjadi komponen tata letak (layout) modular.
- Mengamankan sistem autentikasi untuk akses mode pengembang (Dev Mode).
- Pembaruan logo dan branding pada header dan footer Pemuryadi Generator.
- Penguatan keamanan antarmuka dari celah XSS (Penambahan dompurify).

## Versi 5.1.8
**Tanggal:** 1 - 2 Juni 2026

- Menerapkan sinkronisasi format administrasi agar sesuai dengan standar Kemendikbud & Kemenag.
- Menyembunyikan kolom tanda tangan (Signature) yang dibiarkan kosong di seluruh halaman cetak dokumen.
- Memperbarui UI antarmuka Profil Singkat (QuickProfile) dan logika Paket Harga (Pricing).
- Memperbaiki pembacaan saldo Token pada paket pengguna gratis (Free Tier).

## Versi 5.1.7
**Tanggal:** 30 - 31 Mei 2026

- Menambahkan notifikasi peringatan penggunaan Token bagi pengguna gratis sebelum men-generate modul AI.
- Optimalisasi tampilan tata letak cetak kertas (Print Layouts), manajemen hak akses, dan Ekspor/Impor JSON.
- Penyesuaian tata letak KOP Surat Sekolah dan perbaikan fitur logika cetak khusus Kemenag.
- Meningkatkan fitur AI Image Generation untuk menyertakan pengaturan model AI secara lengkap ke seluruh form visual.
- Penyempurnaan antarmuka modul RPM (Rencana Pembelajaran Mingguan) dan peralihan dari karakter Emoji standar ke Ikon UI.

## Versi 5.1.6
**Tanggal:** 29 Mei 2026

- Menambahkan komponen kepatuhan hukum: Kebijakan Privasi (Privacy Policy), Persyaratan Layanan (Terms of Service) dan Meta Tag verifikasi Google Sites untuk kelancaran verifikasi OAuth.
- Integrasi PWA, optimalisasi caching offline (pengecualian /api), dan bypass autentikasi untuk localhost.
- Peningkatan UI dan Estetika: Penyesuaian kontras layar, pengaplikasian animasi AI Sparkles, peralihan ke react-simple-maps, desain logo baru, serta animasi Dadu 3D murni dan Ikon Lucide untuk Game Ular Tangga.
- Penyempurnaan Sistem Admin Panel: Memperbaiki sensitivitas peran (role) Admin, manajemen fitur CRUD Pengguna (termasuk displayName), serta mengontrol visibilitas batasan Token dan Watermark bagi para Admin.
- Pembaruan Sistem Paket Langganan: Perincian masa aktif paket Premium dan pembaruan tabel tingkat (tier) layanan berlangganan.
- Perbaikan tata letak kerangka utama (Dashboard grid layout) serta form umpan balik (feedback form) yang kini dapat disesuaikan ukurannya.

## Versi 5.0.0
**Tanggal:** 19 April 2026

- Initial Commit: Inisialisasi awal repositori proyek Pemuryadi Generator.
- Menyiapkan fondasi dan kerangka awal sistem dengan integrasi AI Studio.
