import React from 'react';
import { History, GitCommit, Calendar, Rocket, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Changelog() {
  const versions = [
    {
      version: '5.2.5',
      date: '7 Juni 2026',
      badge: 'Terbaru',
      icon: <Rocket className="w-5 h-5 text-blue-600" />,
      commits: [
        'Mengganti alur login langsung ke Dashboard dengan Halaman Utama (Landing Page) pemasaran.',
        'Menambahkan bagian Hero dengan Call-to-Action, metrik statistik (Social Proof), dan 3 langkah Cara Kerja.',
        'Mengimplementasikan FAQ interaktif berbasis Accordion untuk menjawab keraguan dan optimalisasi SEO.',
        'Menambahkan seksi Ulasan dan Testimoni Pendidik untuk membangun kepercayaan pengguna baru.',
        'Menerapkan deteksi transisi halaman via localStorage, agar pengguna baru masuk ke Landing Page sedangkan pengguna lama masuk ke Dashboard.'
      ]
    },
    {
      version: '5.2.4',
      date: '7 Juni 2026',
      icon: <CheckCircle2 className="w-5 h-5 text-gray-500" />,
      commits: [
        'Memperbaiki tampilan tata letak (layout) secara massal di seluruh halaman generator dengan menyeragamkan desain kartu (cards) berlatar belakang putih agar tidak menyatu dengan background.',
        'Mengganti warna latar dan garis batas (border) pada seluruh kolom input agar lebih kontras dan mudah dibaca.',
        'Menghapus animasi melompat (bounce/translate-Y) yang mengganggu pada kartu-kartu antarmuka generator saat diarahkan oleh kursor (hover).',
        'Mengimplementasikan fitur antarmuka akordion (accordion) pada halaman generator dengan form panjang (seperti Modul Kokurikuler, Supervisi, Jurnal Harian, Rencana Pembelajaran Mendalam) agar tampilan tidak terlalu panjang dan mempermudah navigasi pada layar kecil.',
        'Memperbaiki masalah (bug) layout dan struktur komponen yang sempat rusak pada Modul Kokurikuler dan Modul Ajar pasca penambahan akordion.',
        'Menambahkan seed (nilai acak) pada parameter AI Image Generation agar gambar visual yang dihasilkan selalu bervariasi dan unik di setiap permintaan.',
        'Menyematkan indikator loading (spinner visual) pada fitur regenerate (pembuatan ulang) soal individual untuk memberikan umpan balik kepada pengguna.',
        'Menerapkan aturan CSS secara menyeluruh agar semua elemen interaktif otomatis memunculkan kursor tangan (pointer) saat di-hover.',
        'Menyempurnakan format spasi baris pada Kunci Jawaban AI di pembuat soal agar tulisan terbaca lebih jelas dan rapi tanpa terpotong.'
      ]
    },
    {
      version: '5.2.3',
      date: '7 Juni 2026',
      icon: <CheckCircle2 className="w-5 h-5 text-gray-500" />,
      commits: [
        'Merombak tata letak antarmuka (UI) menjadi model Kartu (Cards) bersusun vertikal agar terlihat lebih rapi, modern, dan mudah dinavigasi di perangkat mobile maupun desktop, serta tidak saling berhimpitan satu sama lain.',
        'Memperbaiki masalah dropdown fase/kelas yang kosong saat pergantian jenjang.',
        'Menyelesaikan masalah layar putih (white screen error) pada Worksheet Generator akibat undefined error.',
        'Mengembalikan Worksheet Generator untuk menggunakan useState alih-alih useLocalStorage demi menghindari bug.'
      ]
    },
    {
      version: '5.2.2',
      date: '6 Juni 2026',
      icon: <CheckCircle2 className="w-5 h-5 text-gray-500" />,
      commits: [
        'Menambahkan panel informasi instruksi pelaporan Bug & Error pada antarmuka Dashboard.',
        'Mengintegrasikan pengiriman otomatis form Masukan & Saran (Feedback) langsung ke pesan WhatsApp Admin.',
        'Menambahkan fitur penyimpanan otomatis (Auto-Save) progress dengan localStorage pada seluruh modul generator.',
        'Menambahkan instruksi meta AI crawler (llms.txt) untuk optimasi asisten AI.',
        'Mengintegrasikan Google Analytics untuk pelacakan performa web.'
      ]
    },
    {
      version: '5.2.1',
      date: '4 Juni 2026',
      icon: <CheckCircle2 className="w-5 h-5 text-gray-500" />,
      commits: [
        'Memperbarui branding Footer dengan menambahkan seksi "Global Partners & Tech Support" beserta deretan logo ekosistem AI.',
        'Merapikan struktur direktori aset publik dengan memindahkan seluruh logo SVG eksternal ke dalam folder khusus /asset.',
        'Menambahkan menu pintasan khusus "Admin Dashboard" pada dropdown profil untuk hak akses admin/owner.',
        'Mengimplementasikan sistem navigasi Breadcrumbs dinamis di Topbar sesuai dengan menu yang sedang aktif.',
        'Memperbaiki error tipe TypeScript terkait HTMLRewriter pada fungsi Cloudflare Pages dan tipe response unknown pada App & AdminPanel.',
        'Menambahkan teks tautan digen.id pada judul Dashboard dan memberikan warna khusus (sorotan) pada bagian teks "di Gen".',
        'Memperbarui indikator System Online di Dashboard dengan animasi titik radar berwarna hijau yang berkedip.',
        'Menambahkan prefix www (https://www.digen.id) pada Authorized redirect URIs dan Authorized JavaScript origins di konsol Google OAuth.'
      ]
    },
    {
      version: '5.2.0',
      date: '4 Juni 2026',
      icon: <CheckCircle2 className="w-5 h-5 text-gray-500" />,
      commits: [
        'Menambahkan lebih banyak variasi kalimat pada animasi mengetik di Dashboard.',
        'Memperbaiki tampilan nama aplikasi untuk keperluan kelancaran verifikasi Google OAuth.',
        'Pembersihan kode dan skrip utilitas lama.',
        'Memperbarui desain OG Image (gambar bagikan sosial media) dengan tema pendidikan yang elegan.',
        'Meningkatkan fitur Programmatic SEO dan perluasan fitur Admin Panel.',
        'Penyelesaian konflik kode (merge conflicts) dan perbaikan komponen WelcomePopup.',
        'Membuat halaman dokumentasi Riwayat Versi (Changelog) interaktif yang dapat diakses langsung dari Footer.'
      ]
    },
    {
      version: '5.1.9',
      date: '3 Juni 2026',
      icon: <Sparkles className="w-5 h-5 text-gray-500" />,
      commits: [
        'Memperbarui instruksi sistem Chatbot AI, UI, dan memperbaiki tampilan modal login.',
        'Melakukan refaktor besar-besaran pada App.tsx menjadi komponen tata letak (layout) modular.',
        'Mengamankan sistem autentikasi untuk akses mode pengembang (Dev Mode).',
        'Pembaruan logo dan branding pada header dan footer digen.id.',
        'Penguatan keamanan antarmuka dari celah XSS (Penambahan dompurify).'
      ]
    },
    {
      version: '5.1.8',
      date: '1 - 2 Juni 2026',
      icon: <CheckCircle2 className="w-5 h-5 text-gray-500" />,
      commits: [
        'Menerapkan sinkronisasi format administrasi agar sesuai dengan standar Kemendikbud & Kemenag.',
        'Menyembunyikan kolom tanda tangan (Signature) yang dibiarkan kosong di seluruh halaman cetak dokumen.',
        'Memperbarui UI antarmuka Profil Singkat (QuickProfile) dan logika Paket Harga (Pricing).',
        'Memperbaiki pembacaan saldo Token pada paket pengguna gratis (Free Tier).'
      ]
    },
    {
      version: '5.1.7',
      date: '30 - 31 Mei 2026',
      icon: <CheckCircle2 className="w-5 h-5 text-gray-500" />,
      commits: [
        'Menambahkan notifikasi peringatan penggunaan Token bagi pengguna gratis sebelum men-generate modul AI.',
        'Optimalisasi tampilan tata letak cetak kertas (Print Layouts), manajemen hak akses, dan Ekspor/Impor JSON.',
        'Penyesuaian tata letak KOP Surat Sekolah dan perbaikan fitur logika cetak khusus Kemenag.',
        'Meningkatkan fitur AI Image Generation untuk menyertakan pengaturan model AI secara lengkap ke seluruh form visual.',
        'Penyempurnaan antarmuka modul RPM (Rencana Pembelajaran Mendalam) dan peralihan dari karakter Emoji standar ke Ikon UI.'
      ]
    },
    {
      version: '5.1.6',
      date: '29 Mei 2026',
      icon: <CheckCircle2 className="w-5 h-5 text-gray-500" />,
      commits: [
        'Menambahkan komponen kepatuhan hukum: Kebijakan Privasi (Privacy Policy), Persyaratan Layanan (Terms of Service) dan Meta Tag verifikasi Google Sites.',
        'Integrasi PWA, optimalisasi caching offline, dan bypass autentikasi untuk localhost.',
        'Peningkatan UI dan Estetika: Penyesuaian kontras layar, animasi AI Sparkles, peralihan ke react-simple-maps, desain logo baru, animasi Dadu 3D murni dan Ikon Lucide untuk Game Ular Tangga.',
        'Penyempurnaan Sistem Admin Panel: Sensitivitas peran Admin, CRUD Pengguna, visibilitas Token dan Watermark.',
        'Pembaruan Sistem Paket Langganan: Perincian masa aktif paket Premium dan pembaruan tabel langganan.',
        'Perbaikan tata letak kerangka utama (Dashboard grid layout) serta form umpan balik (feedback form) resizable.'
      ]
    },
    {
      version: '5.0.0',
      date: '19 April 2026',
      icon: <CheckCircle2 className="w-5 h-5 text-gray-500" />,
      commits: [
        'Initial Commit: Inisialisasi awal repositori proyek digen.id.',
        'Menyiapkan fondasi dan kerangka awal sistem dengan integrasi AI Studio.'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header Section - Clean & Lightweight */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 p-6 sm:p-8 rounded-t-3xl sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <History size={26} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">Riwayat Versi</h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">Melacak setiap evolusi dan pembaruan sistem digen.id.</p>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white px-6 sm:px-10 py-8 rounded-b-3xl border border-t-0 border-gray-100 shadow-sm">
        <div className="relative border-l-2 border-gray-100/80 ml-3 sm:ml-4 space-y-12 pb-8">
          
          {versions.map((ver, idx) => {
            const isLatest = idx === 0;
            return (
              <div key={ver.version} className="relative group pl-8 sm:pl-10">
                {/* Timeline Icon / Dot */}
                <div className={`absolute -left-[17px] top-0 flex items-center justify-center w-8 h-8 rounded-full border-[3px] bg-white transition-transform duration-300 ${isLatest ? 'border-blue-100 scale-110' : 'border-gray-50 group-hover:scale-110'}`}>
                  {ver.icon}
                </div>
                
                {/* Version Title & Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                  <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${isLatest ? 'text-blue-700' : 'text-gray-800'}`}>
                    Versi {ver.version}
                  </h2>
                  <div className="flex items-center gap-3">
                    {ver.badge && (
                      <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-sm">
                        {ver.badge}
                      </span>
                    )}
                    <span className="text-xs sm:text-sm font-semibold text-gray-400 flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                      <Calendar size={14} className="text-gray-400" /> {ver.date}
                    </span>
                  </div>
                </div>

                {/* Commits List */}
                <div className="space-y-3">
                  {ver.commits.map((commit, cIdx) => (
                    <div key={cIdx} className="flex gap-3 items-start">
                      <GitCommit size={18} className={`mt-0.5 shrink-0 ${isLatest ? 'text-blue-400' : 'text-gray-300'}`} />
                      <p className={`text-sm leading-relaxed ${isLatest ? 'text-gray-700 font-medium' : 'text-gray-600'}`}>
                        {commit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
