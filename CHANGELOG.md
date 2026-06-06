# Changelog & Riwayat Versi Pemuryadi Generator

Berisi rekapitulasi riwayat pembaruan sistem yang ditarik dari Git Commits.

## Versi 5.2.3
**Tanggal:** 7 Juni 2026

- **Peningkatan UI/UX Pembuat Soal:** Merombak tata letak antarmuka (UI) menjadi model Kartu (*Cards*) bersusun vertikal agar terlihat lebih rapi, modern, dan mudah dinavigasi di perangkat *mobile* maupun *desktop*.
- **Pembaruan Grid Responsif:** Memperbaiki masalah elemen formulir (seperti kolom Fase, Kelas, dan jumlah Bentuk Soal) yang saling berhimpitan dan bertumpuk pada layar sedang/besar.
- **Fitur Baru "Live Quiz":** Menambahkan opsi Tipe Ujian "Live Quiz" yang secara otomatis menyesuaikan *prompt* AI dan menyediakan antarmuka pratinjau kuis interaktif untuk uji coba soal secara langsung.
- **Pembaruan Kurikulum Madrasah:** Menambahkan daftar mata pelajaran spesifik Pendidikan Agama Islam (PAI) & Bahasa Arab seperti Qur'an Hadist, Akidah Akhlak, Fikih, dan SKI.
- **Perbaikan Kutu (*Bug Fix*):** Memperbaiki masalah dropdown "Fase" dan "Kelas" yang kosong tidak memuat opsi akibat kegagalan sinkronisasi state inisialisasi pada *LocalStorage*.

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
