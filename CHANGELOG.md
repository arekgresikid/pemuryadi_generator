# Changelog

Semua riwayat pembaruan (versi) dari aplikasi ini akan dicatat di dalam file ini.

## [5.3.0] - 11 Juni 2026
- Menyinkronkan logika paket Harga (Pricing) di Frontend dengan daftar paket yang tersimpan di Database Cloudflare D1 agar konsisten.
- Menambahkan fitur kontrol penuh bagi Admin untuk menambah atau mengurangi token pengguna secara manual melalui Admin Panel.
- Menambahkan fitur Suspend Sementara (dengan batas hari) pada status pengguna, melengkapi opsi Banned permanen.
- Menambahkan riwayat Log Audit Penggunaan Token (Token Usage Logs) yang dapat dilihat admin untuk memantau aliran masuk dan keluar token tiap pengguna.
- Merapikan tata letak (layout) dan ukuran lebar Modal di perangkat Desktop/Laptop agar tidak terpotong dan elemen tabel admin tidak saling berhimpitan.
- Menyempurnakan Aksi Massal (Bulk Actions) pada Admin Panel yang mencakup Banned, Suspend Sementara, dan Unsuspend.

## [5.2.9] - 10 Juni 2026
- Memastikan kolom users.activeUntil tersedia pada database (runtime migration).
- Menghapus berkas old_landing.txt yang sudah tidak digunakan.
- Menghapus pemanggilan log aktivitas yang tidak terpakai di App.tsx dan menambahkan logo Google pada tombol login.
- Memperbarui penamaan, deskripsi, dan pengelompokkan kategori paket harga (Administrasi, Games, Kombinasi) pada halaman berlangganan.
- Menambahkan 4 game arcade zero-g dengan dukungan pembuat soal AI (AI generation).
- Menambahkan opsi paket Free dan Free Trial pada kategori Administrasi dan Games agar pengguna dapat melakukan eksplorasi fitur gratis.
- Memperbaiki masalah (bug) pada game Fill in the Blanks yang sebelumnya hanya bisa memuat 1 soal dan langsung selesai secara prematur.

## [5.2.8] - 8 Juni 2026
- Merombak total desain kartu Harga (Pricing) menjadi lebih modern dengan gaya bersih (clean) dan penambahan lencana diagonal (ribbon badge) untuk paket unggulan.
- Mengintegrasikan 5 pilihan varian harga paket berlangganan secara dinamis ke dalam panel Admin Dashboard.
- Menambahkan kolom input kode voucher diskon (XXXX) yang memotong harga paket secara otomatis di halaman Berlangganan.
- Mengubah tautan promo banner di Dashboard dan Welcome Popup untuk mengarahkan pengguna ke halaman Berlangganan alih-alih ke WhatsApp Admin.
- Mengubah nama menu dan navigasi breadcrumb dari "Beranda" menjadi "Dashboard".
- Mengubah nama tautan "Halaman Landing" di bagian footer (bawah halaman) menjadi "Beranda".
- Menambahkan fitur Maintenance Mode (Mode Pemeliharaan) di Admin Panel beserta halaman countdown, dilengkapi rute khusus dan akses prioritas untuk Owner/Admin.
- Menyempurnakan halaman Maintenance dengan fitur yang lebih responsif, perbaikan ikon kalender, menampilkan kontak nomor WhatsApp secara eksplisit, dan menambahkan fitur Pesan/Alasan kustom.
- Memperbaiki isu Server Error (500) akibat bentrok nama tabel saat mencatat log aktivitas pada Pengaturan Global di Admin Panel.
- Merombak UI Pop-up native (browser) untuk aksi krusial (seperti Hapus, Hapus Massal, dan Impor Pengguna) dengan Modal interaktif bergaya modern.
- Menambahkan verifikasi ganda (Checkbox Konfirmasi) pada dialog Impor dan Hapus Massal untuk keamanan tambahan.
- Merelokasi widget Grafik Tren Pendaftaran dari atas ke bagian bawah daftar Tabel Pengguna untuk hirarki UI yang lebih fokus.
- Mengoptimalkan tabel Log Sistem dengan fitur Virtualization (maksimal ketinggian) dan Pagination (Muat Lebih Banyak) untuk mencegah halaman memanjang tanpa batas.
- Menambahkan penanda (badge) BETA merah pada menu sidebar untuk fitur Modul P5 dan Rubrik Penilaian sebagai indikator masih dalam tahap penyempurnaan dan pemilik web [Praswara Eko Muryadi](https://pemuryadi.my.id).
- Merombak UI halaman Tentang Kami dengan desain kartu profil melingkar yang modern untuk kolaborator [Praswara Eko Muryadi](https://pemuryadi.my.id) dan [Arif Tirtana](https://ariftirtana.my.id), serta menambahkan blok kemitraan [RuangRiung](https://ruangriung.my.id) yang memukau.
- Memperbaiki tata letak (layout) kotak input dan tombol klaim voucher diskon pada halaman Berlangganan agar tersusun secara vertikal di perangkat mobile sehingga tidak lagi terpotong/melebihi layar.
- Menambahkan fitur Manajemen Uji Coba (Free Trial) di Admin Panel dengan konfigurasi terperinci seperti masa aktif (hari), jumlah token awal, dan pilihan tier (termasuk kontrol watermark).
- Mengimplementasikan fitur Whitelist Email berbasis sistem *badge/tag* di Admin Panel agar akses Free Trial dapat dibatasi hanya untuk daftar email spesifik yang dipilih oleh Admin.

## [5.2.7] - 8 Juni 2026
- Menambahkan modul baru: Modul P5 (Projek Penguatan Profil Pelajar Pancasila) dengan generator dimensi dan alur kegiatan.
- Menambahkan modul baru: Rubrik Penilaian & Asesmen Kurikulum Merdeka lengkap dengan skala skor dan lembar observasi.
- Menambahkan antarmuka daftar tunggu (Whitelist) menggunakan email khusus untuk pengguna uji coba
- Menambahkan modal konfirmasi (popup) dengan ringkasan fitur saat admin mengaktifkan Manajemen Uji Coba
- Menambahkan tautan Halaman Landing pada bagian bawah (footer) aplikasi untuk mempermudah akses navigasi.
- Memperbaiki masalah (bug) gambar latar belakang pada browser mobile (terutama iOS Safari) yang tergulung bersama konten halaman.
- Memperbaiki tata letak tombol simpan di Admin Panel agar tidak tumpang tindih di perangkat seluler

## [5.2.6] - 7 Juni 2026
- Menghapus animasi efek jatuh penuh (sliding lines) dari latar belakang Halaman Utama (Landing Page) agar lebih bersih dan elegan.
- Menerapkan animasi efek cahaya sapuan (shimmer & shine) pada teks lencana sistem AI dan pada fitur-fitur "Mengapa Pendidik Memilih Kami?".
- Menambahkan animasi aliran data (data flow) bercahaya secara horisontal (desktop) dan vertikal (mobile) pada garis penghubung di seksi "Cara Kerja yang Sangat Mudah".

## [5.2.5] - 7 Juni 2026
- Mengganti alur login langsung ke Dashboard dengan Halaman Utama (Landing Page) pemasaran.
- Menambahkan bagian Hero dengan Call-to-Action, metrik statistik (Social Proof), dan 3 langkah Cara Kerja.
- Mengimplementasikan FAQ interaktif berbasis Accordion untuk menjawab keraguan dan optimalisasi SEO.
- Menambahkan seksi Ulasan dan Testimoni Pendidik untuk membangun kepercayaan pengguna baru.
- Menerapkan deteksi transisi halaman via localStorage, agar pengguna baru masuk ke Landing Page sedangkan pengguna lama masuk ke Dashboard.

## [5.2.4] - 7 Juni 2026
- Memperbaiki tampilan tata letak (layout) secara massal di seluruh halaman generator dengan menyeragamkan desain kartu (cards) berlatar belakang putih agar tidak menyatu dengan background.
- Mengganti warna latar dan garis batas (border) pada seluruh kolom input agar lebih kontras dan mudah dibaca.
- Menghapus animasi melompat (bounce/translate-Y) yang mengganggu pada kartu-kartu antarmuka generator saat diarahkan oleh kursor (hover).
- Mengimplementasikan fitur antarmuka akordion (accordion) pada halaman generator dengan form panjang (seperti Modul Kokurikuler, Supervisi, Jurnal Harian, Rencana Pembelajaran Mendalam) agar tampilan tidak terlalu panjang dan mempermudah navigasi pada layar kecil.
- Memperbaiki masalah (bug) layout dan struktur komponen yang sempat rusak pada Modul Kokurikuler dan Modul Ajar pasca penambahan akordion.
- Menambahkan seed (nilai acak) pada parameter AI Image Generation agar gambar visual yang dihasilkan selalu bervariasi dan unik di setiap permintaan.
- Menyematkan indikator loading (spinner visual) pada fitur regenerate (pembuatan ulang) soal individual untuk memberikan umpan balik kepada pengguna.
- Menerapkan aturan CSS secara menyeluruh agar semua elemen interaktif otomatis memunculkan kursor tangan (pointer) saat di-hover.
- Menyempurnakan format spasi baris pada Kunci Jawaban AI di pembuat soal agar tulisan terbaca lebih jelas dan rapi tanpa terpotong.

## [5.2.3] - 7 Juni 2026
- Merombak tata letak antarmuka (UI) menjadi model Kartu (Cards) bersusun vertikal agar terlihat lebih rapi, modern, dan mudah dinavigasi di perangkat mobile maupun desktop, serta tidak saling berhimpitan satu sama lain.
- Memperbaiki masalah dropdown fase/kelas yang kosong saat pergantian jenjang.
- Menyelesaikan masalah layar putih (white screen error) pada Worksheet Generator akibat undefined error.
- Mengembalikan Worksheet Generator untuk menggunakan useState alih-alih useLocalStorage demi menghindari bug.

## [5.2.2] - 6 Juni 2026
- Menambahkan panel informasi instruksi pelaporan Bug & Error pada antarmuka Dashboard.
- Mengintegrasikan pengiriman otomatis form Masukan & Saran (Feedback) langsung ke pesan WhatsApp Admin.
- Menambahkan fitur penyimpanan otomatis (Auto-Save) progress dengan localStorage pada seluruh modul generator.
- Menambahkan instruksi meta AI crawler (llms.txt) untuk optimasi asisten AI.
- Mengintegrasikan Google Analytics untuk pelacakan performa web.

## [5.2.1] - 4 Juni 2026
- Memperbarui branding Footer dengan menambahkan seksi "Global Partners & Tech Support" beserta deretan logo ekosistem AI.
- Merapikan struktur direktori aset publik dengan memindahkan seluruh logo SVG eksternal ke dalam folder khusus /asset.
- Menambahkan menu pintasan khusus "Admin Dashboard" pada dropdown profil untuk hak akses admin/owner.
- Mengimplementasikan sistem navigasi Breadcrumbs dinamis di Topbar sesuai dengan menu yang sedang aktif.
- Memperbaiki error tipe TypeScript terkait HTMLRewriter pada fungsi Cloudflare Pages dan tipe response unknown pada App & AdminPanel.
- Menambahkan teks tautan digen.id pada judul Dashboard dan memberikan warna khusus (sorotan) pada bagian teks "di Gen".
- Memperbarui indikator System Online di Dashboard dengan animasi titik radar berwarna hijau yang berkedip.
- Menambahkan prefix www (https://www.digen.id) pada Authorized redirect URIs dan Authorized JavaScript origins di konsol Google OAuth.

## [5.2.0] - 4 Juni 2026
- Menambahkan lebih banyak variasi kalimat pada animasi mengetik di Dashboard.
- Memperbaiki tampilan nama aplikasi untuk keperluan kelancaran verifikasi Google OAuth.
- Pembersihan kode dan skrip utilitas lama.
- Memperbarui desain OG Image (gambar bagikan sosial media) dengan tema pendidikan yang elegan.
- Meningkatkan fitur Programmatic SEO dan perluasan fitur Admin Panel.
- Penyelesaian konflik kode (merge conflicts) dan perbaikan komponen WelcomePopup.
- Membuat halaman dokumentasi Riwayat Versi (Changelog) interaktif yang dapat diakses langsung dari Footer.

## [5.1.9] - 3 Juni 2026
- Memperbarui instruksi sistem Chatbot AI, UI, dan memperbaiki tampilan modal login.
- Melakukan refaktor besar-besaran pada App.tsx menjadi komponen tata letak (layout) modular.
- Mengamankan sistem autentikasi untuk akses mode pengembang (Dev Mode).
- Pembaruan logo dan branding pada header dan footer digen.id.
- Penguatan keamanan antarmuka dari celah XSS (Penambahan dompurify).

## [5.1.8] - 1 - 2 Juni 2026
- Menerapkan sinkronisasi format administrasi agar sesuai dengan standar Kemendikbud & Kemenag.
- Menyembunyikan kolom tanda tangan (Signature) yang dibiarkan kosong di seluruh halaman cetak dokumen.
- Memperbarui UI antarmuka Profil Singkat (QuickProfile) dan logika Paket Harga (Pricing).
- Memperbaiki pembacaan saldo Token pada paket pengguna gratis (Free Tier).

## [5.1.7] - 30 - 31 Mei 2026
- Menambahkan notifikasi peringatan penggunaan Token bagi pengguna gratis sebelum men-generate modul AI.
- Optimalisasi tampilan tata letak cetak kertas (Print Layouts), manajemen hak akses, dan Ekspor/Impor JSON.
- Penyesuaian tata letak KOP Surat Sekolah dan perbaikan fitur logika cetak khusus Kemenag.
- Meningkatkan fitur AI Image Generation untuk menyertakan pengaturan model AI secara lengkap ke seluruh form visual.
- Penyempurnaan antarmuka modul RPM (Rencana Pembelajaran Mendalam) dan peralihan dari karakter Emoji standar ke Ikon UI.

## [5.1.6] - 29 Mei 2026
- Menambahkan komponen kepatuhan hukum: Kebijakan Privasi (Privacy Policy), Persyaratan Layanan (Terms of Service) dan Meta Tag verifikasi Google Sites.
- Integrasi PWA, optimalisasi caching offline, dan bypass autentikasi untuk localhost.
- Peningkatan UI dan Estetika: Penyesuaian kontras layar, animasi AI Sparkles, peralihan ke react-simple-maps, desain logo baru, animasi Dadu 3D murni dan Ikon Lucide untuk Game Ular Tangga.
- Penyempurnaan Sistem Admin Panel: Sensitivitas peran Admin, CRUD Pengguna, visibilitas Token dan Watermark.
- Pembaruan Sistem Paket Langganan: Perincian masa aktif paket Premium dan pembaruan tabel langganan.
- Perbaikan tata letak kerangka utama (Dashboard grid layout) serta form umpan balik (feedback form) resizable.

## [5.0.0] - 19 April 2026
- Initial Commit: Inisialisasi awal repositori proyek digen.id.
- Menyiapkan fondasi dan kerangka awal sistem dengan integrasi AI Studio.

