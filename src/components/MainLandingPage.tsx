import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, BrainCircuit, ShieldCheck, Clock, BookOpen, Layers, Users, Zap, CheckCircle2, PlayCircle, FileText, Star, Grid, FileEdit, DownloadCloud, ChevronDown, HelpCircle, CalendarCheck, ClipboardCheck, Target, ListChecks, Award, CalendarRange, Calculator, Trophy } from 'lucide-react';
import PhoneMockup from './PhoneMockup';
import ApkDownloadModal from './ApkDownloadModal';



export default function MainLandingPage({ onEnterApp }: { onEnterApp: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  useEffect(() => {
    // Inject SEO Metadata
    document.title = "Pembuat Modul Ajar & RPP AI Otomatis | Pemuryadi Generator";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Revolusi administrasi guru dengan AI. Buat Modul Ajar Kurikulum Merdeka, RPP, Jurnal Harian, dan Bank Soal otomatis dalam hitungan detik. Hemat waktu 90%!');
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Revolusi administrasi guru dengan AI. Buat Modul Ajar Kurikulum Merdeka, RPP, Jurnal Harian, dan Bank Soal otomatis dalam hitungan detik. Hemat waktu 90%!";
      document.head.appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'aplikasi guru, pembuat modul ajar ai, rpp merdeka otomatis, generator soal ai, kktp, jurnal harian guru, administrasi pendidikan, modul p5, rubrik penilaian');
    } else {
      const meta = document.createElement('meta');
      meta.name = "keywords";
      meta.content = "aplikasi guru, pembuat modul ajar ai, rpp merdeka otomatis, generator soal ai, kktp, jurnal harian guru, administrasi pendidikan, modul p5, rubrik penilaian";
      document.head.appendChild(meta);
    }


  }, []);

  return (
    <>
      {/* Global Background Image (Dipindah ke luar container agar tidak kena bug iOS Safari absolute) */}
      <div className="fixed inset-0 z-0 bg-slate-950 pointer-events-none" />
      <div
        className="fixed inset-0 z-0 pointer-events-none animate-slow-pan"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div className="min-h-screen font-sans selection:bg-blue-500/30 text-slate-300 overflow-x-hidden w-full relative z-10">


        {/* Navbar */}
        <nav className="border-b border-white/10 bg-slate-950/50 backdrop-blur-md absolute top-0 inset-x-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="text-white w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="font-bold text-lg md:text-xl text-white tracking-tight">digen.id</span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={onEnterApp}
                className="text-xs md:text-sm font-bold text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/10 cursor-pointer"
              >
                Masuk
              </button>
              <button
                onClick={onEnterApp}
                className="hidden sm:flex text-sm font-bold text-slate-900 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 hover:scale-105 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] items-center gap-2 cursor-pointer"
              >
                Coba Gratis <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </nav>

        <main>
          {/* Hero Section */}
          <section className="relative overflow-hidden pt-28 pb-12 lg:pt-32 lg:pb-16 px-6">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

            <div className="max-w-5xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Sparkles size={16} />
                <span className="text-shine-blue">Sistem Cerdas Bertenaga AI Generatif</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:mb-6 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                Revolusi Administrasi <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
                  Pendidikan Kurikulum Merdeka
                </span>
              </h1>

              <p className="text-base md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                Biarkan AI menyusun Modul Ajar, RPP, Bank Soal, Modul P5, hingga Rubrik Penilaian dalam hitungan detik. Hemat 90% waktu administrasi Anda, kembali fokus mendidik siswa.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in zoom-in duration-700 delay-300">
                <button
                  onClick={onEnterApp}
                  className="px-6 py-3 md:px-8 md:py-4 bg-white text-slate-900 rounded-2xl font-bold text-base md:text-lg hover:scale-105 transition-transform flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer"
                >
                  Mulai Akses Dashboard <ArrowRight size={20} />
                </button>
              </div>

              <div className="mt-8 grid grid-cols-2 md:flex md:flex-wrap justify-center gap-y-3 gap-x-2 md:gap-6 text-xs md:text-sm font-medium text-slate-500 animate-in fade-in duration-1000 delay-500 max-w-4xl mx-auto">
                <div className="flex items-start md:items-center gap-1.5 md:gap-2 text-left"><CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5 md:mt-0" size={16} /> <span>100% Sesuai Kemdikbud</span></div>
                <div className="flex items-start md:items-center gap-1.5 md:gap-2 text-left"><CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5 md:mt-0" size={16} /> <span>Anti-Plagiasi & Unik</span></div>
                <div className="flex items-start md:items-center gap-1.5 md:gap-2 text-left"><CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5 md:mt-0" size={16} /> <span>Ekspor ke Word & PDF</span></div>
                <div className="flex items-start md:items-center gap-1.5 md:gap-2 text-left"><CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5 md:mt-0" size={16} /> <span>Kurikulum Merdeka</span></div>
                <div className="flex items-start md:items-center gap-1.5 md:gap-2 text-left"><CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5 md:mt-0" size={16} /> <span>Privasi Data Terjamin</span></div>
                <div className="flex items-start md:items-center gap-1.5 md:gap-2 text-left"><CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5 md:mt-0" size={16} /> <span>Generate Detik</span></div>
                <div className="flex items-start md:items-center gap-1.5 md:gap-2 text-left"><CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5 md:mt-0" size={16} /> <span>Sangat Mudah Digunakan</span></div>
                <div className="flex items-start md:items-center gap-1.5 md:gap-2 text-left"><CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5 md:mt-0" size={16} /> <span>Tanpa Instalasi</span></div>
              </div>
            </div>
          </section>

          {/* Visual Mockup & Stats */}
          <section className="relative z-20 pb-24 px-6 mt-10">
            <div className="max-w-6xl mx-auto">

              {/* Visual Phone Mockup */}
              <div className="flex justify-center items-center py-10 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
                <PhoneMockup className="transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out shadow-2xl z-10" />
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-white/5">
                {[
                  { label: 'Pendidik Aktif', value: '15,000+', icon: Users },
                  { label: 'Modul Dihasilkan', value: '1.2M+', icon: FileText },
                  { label: 'Jam Terselamatkan', value: '500k+', icon: Clock },
                  { label: 'Tingkat Kepuasan', value: '98%', icon: Star }
                ].map((stat, i) => (
                  <div key={i} className="text-center animate-in fade-in slide-in-from-bottom-4 delay-[400ms]">
                    <div className="flex items-center justify-center mb-2 text-blue-400">
                      <stat.icon size={24} />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</h3>
                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-24 bg-slate-900/50 border-y border-white/5 relative z-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Mengapa Pendidik Memilih Kami?</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Kami memahami bahwa beban kerja administratif guru sangat berat. Alat ini dirancang spesifik untuk mengatasi masalah tersebut.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: Clock, title: 'Hemat Waktu Ekstrim', desc: 'Selesaikan Modul Ajar yang biasanya memakan waktu berhari-hari hanya dalam hitungan detik.', color: 'from-blue-500 to-cyan-400', iconColor: 'text-blue-400', iconBg: 'bg-blue-500/10' },
                  { icon: BrainCircuit, title: 'Kecerdasan Buatan (AI)', desc: 'Setiap modul, soal, dan rubrik penilaian dibuat dinamis, unik, dan disesuaikan dengan konteks sekolah.', color: 'from-purple-500 to-pink-500', iconColor: 'text-purple-400', iconBg: 'bg-purple-500/10' },
                  { icon: ShieldCheck, title: 'Standar Nasional', desc: 'Format luaran (output) secara otomatis mengikuti struktur yang disyaratkan oleh Kurikulum Merdeka.', color: 'from-emerald-400 to-teal-500', iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10' },
                  { icon: DownloadCloud, title: 'Praktis & Siap Pakai', desc: 'Satu kali klik untuk menyalin teks atau mengunduh hasil dokumen secara utuh, siap dicetak langsung.', color: 'from-amber-400 to-orange-500', iconColor: 'text-amber-400', iconBg: 'bg-amber-500/10' }
                ].map((benefit, i) => (
                  <div key={i} className="bg-slate-950 p-8 rounded-3xl border border-white/5 hover:-translate-y-1 transition-all group relative overflow-hidden shadow-lg card-shimmer">
                    <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${benefit.color} opacity-70 group-hover:opacity-100 transition-opacity`}></div>
                    <div className={`w-14 h-14 rounded-2xl ${benefit.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-all`}>
                      <benefit.icon className={benefit.iconColor} size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Modules/Features Section */}
          <section className="py-24 px-6 relative z-20">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Satu Platform, Semua Solusi Administrasi</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Dilengkapi dengan belasan modul cerdas untuk mendukung setiap aspek tugas keguruan Anda.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: BookOpen, title: 'Modul Ajar & RPP', desc: 'Susun perangkat ajar Kurikulum Merdeka lengkap dengan rubrik.', color: 'from-blue-500 to-cyan-400', iconColor: 'text-blue-400', iconBg: 'bg-blue-500/10' },
                  { icon: HelpCircle, title: 'Bank Soal & Kuis', desc: 'Buat soal formatif/sumatif otomatis beserta kunci jawaban.', color: 'from-purple-500 to-pink-500', iconColor: 'text-purple-400', iconBg: 'bg-purple-500/10' },
                  { icon: FileEdit, title: 'Lembar Kerja Siswa', desc: 'Hasilkan LKPD interaktif dan berdiferensiasi sesuai profil.', color: 'from-emerald-400 to-teal-500', iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10' },
                  { icon: CalendarCheck, title: 'Jurnal Harian', desc: 'Catat agenda mengajar dan refleksi harian secara praktis.', color: 'from-amber-400 to-orange-500', iconColor: 'text-amber-400', iconBg: 'bg-amber-500/10' },
                  { icon: ClipboardCheck, title: 'Supervisi Akademik', desc: 'Siapkan instrumen observasi dan penilaian guru.', color: 'from-indigo-500 to-purple-500', iconColor: 'text-indigo-400', iconBg: 'bg-indigo-500/10' },
                  { icon: Target, title: 'Pembelajaran Mendalam', desc: 'Rancang Deep Learning dengan pendekatan mutakhir.', color: 'from-rose-400 to-red-500', iconColor: 'text-rose-400', iconBg: 'bg-rose-500/10' },
                  { icon: ListChecks, title: 'KKTP', desc: 'Rumuskan kriteria ketercapaian tujuan dengan presisi.', color: 'from-cyan-400 to-blue-600', iconColor: 'text-cyan-400', iconBg: 'bg-cyan-500/10' },
                  { icon: Award, title: 'Projek P5', desc: 'Rancang Modul Projek Penguatan Profil Pelajar Pancasila lengkap.', color: 'from-yellow-400 to-amber-600', iconColor: 'text-yellow-400', iconBg: 'bg-yellow-500/10' },
                  { icon: CheckCircle2, title: 'Rubrik Penilaian', desc: 'Hasilkan kriteria asesmen dan evaluasi formatif/sumatif.', color: 'from-pink-500 to-rose-600', iconColor: 'text-pink-400', iconBg: 'bg-pink-500/10' },
                  { icon: CalendarRange, title: 'Program Semester', desc: 'Petakan distribusi alokasi waktu dan materi ajar 1 semester.', color: 'from-teal-400 to-emerald-600', iconColor: 'text-teal-400', iconBg: 'bg-teal-500/10' },
                  { icon: Calculator, title: 'Analisis Hari Efektif', desc: 'Hitung otomatis jumlah minggu efektif sesuai kalender.', color: 'from-fuchsia-500 to-pink-600', iconColor: 'text-fuchsia-400', iconBg: 'bg-fuchsia-500/10' },
                  { icon: Trophy, title: 'Rangkuman Materi', desc: 'Pilah intisari bab untuk persiapan lomba Ranking 1.', color: 'from-orange-400 to-red-500', iconColor: 'text-orange-400', iconBg: 'bg-orange-500/10' }
                ].map((module, i) => (
                  <div key={i} className="bg-slate-900/80 p-6 rounded-2xl border border-white/5 hover:-translate-y-1 transition-all group cursor-default relative overflow-hidden shadow-lg">
                    <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${module.color} opacity-70 group-hover:opacity-100 transition-opacity`}></div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${module.iconBg} flex items-center justify-center group-hover:scale-110 transition-all`}>
                        <module.icon className={module.iconColor} size={24} />
                      </div>
                      <h3 className="font-bold text-white text-lg leading-tight">{module.title}</h3>
                    </div>
                    <p className="text-slate-400 text-sm">{module.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* AI Models Section */}
          <section className="py-24 bg-slate-900/30 border-y border-white/5 relative z-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold text-sm mb-6">
                  <BrainCircuit size={16} />
                  <span>Multi-Model AI Engine</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Didukung Beragam Model AI Terkemuka</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Kami mengintegrasikan model bahasa dan pembuat gambar paling canggih di dunia. Fleksibilitas ini memastikan perangkat ajar dan media visual yang dihasilkan selalu presisi, relevan, dan mutakhir.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Text Models */}
                <div className="bg-slate-950 p-8 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden group mb-8">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Generasi Teks Cerdas</h3>
                      <p className="text-slate-400 text-sm">Untuk RPP, Modul Ajar, dan Soal</p>
                    </div>
                  </div>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Menyusun dokumen pendidikan yang terstruktur sempurna dengan model bahasa (LLM) tercanggih. Mulai dari penalaran tingkat tinggi hingga kecepatan respons ekstra cepat.
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['OpenAI', 'Gemini', 'DeepSeek', 'Claude', 'Mistral', 'Llama', 'Qwen', 'Perplexity', 'Grok'].map((model, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-full shadow-sm">{model}</span>
                  ))}
                </div>
              </div>

              {/* Image Models */}
              <div className="bg-slate-950 p-8 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden group mb-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Visualisasi Gambar</h3>
                    <p className="text-slate-400 text-sm">Media Pembelajaran & Ilustrasi</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Menghasilkan gambar beresolusi tinggi, diagram, dan ilustrasi buku teks untuk memperjelas materi yang abstrak menjadi lebih nyata bagi siswa.
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['Nanobanana', 'Ideogram', 'Flux', 'Seedream', 'GPTImage', 'Grok Imagine', 'Wan Image'].map((model, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-full shadow-sm">{model}</span>
                  ))}
                </div>
              </div>
              </div>
            </div>
          </section>

          {/* How it Works */}
          <section className="py-24 px-6 relative z-20">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Cara Kerja yang Sangat Mudah</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Tidak perlu keahlian teknis. Siapa pun bisa menghasilkan perangkat pembelajaran berkualitas dalam 3 langkah sederhana.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Connecting Line (Desktop: Horizontal) */}
                <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 rounded-full">
                  <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-300 to-transparent data-flow-animation shadow-[0_0_10px_#22d3ee]"></div>
                </div>

                {/* Connecting Line (Mobile: Vertical) */}
                <div className="block md:hidden absolute top-[10%] bottom-[10%] left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0 rounded-full">
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-transparent via-cyan-300 to-transparent data-flow-y-animation shadow-[0_0_10px_#22d3ee]"></div>
                </div>

                {[
                  { step: '1', title: 'Pilih Kebutuhan Anda', desc: 'Pilih modul yang ingin dibuat, misalnya Modul Ajar, RPP, atau Bank Soal dari dashboard utama.', icon: Grid },
                  { step: '2', title: 'Masukkan Topik Dasar', desc: 'Ketikkan mata pelajaran, fase/kelas, dan topik materi secara singkat dalam formulir.', icon: FileEdit },
                  { step: '3', title: 'Selesai & Unduh', desc: 'AI akan menyusun dokumen lengkap dalam hitungan detik. Siap disalin atau diekspor.', icon: DownloadCloud }
                ].map((item, i) => (
                  <div key={i} className="relative text-center">
                    <div className="w-24 h-24 mx-auto bg-slate-900 border border-slate-700 rounded-3xl flex items-center justify-center relative z-10 mb-6 shadow-xl">
                      <div className="absolute -top-4 -right-4 w-10 h-10 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                        {item.step}
                      </div>
                      <item.icon className="text-blue-400" size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>





          {/* FAQ */}
          <section className="py-24 px-6 relative z-20 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pertanyaan Umum (FAQ)</h2>
              <p className="text-slate-400">Temukan jawaban cepat untuk pertanyaan tentang platform digen.id.</p>
            </div>

            <div className="space-y-4">
              {[
                { q: 'Apakah aplikasi ini sepenuhnya gratis?', a: 'Saat ini kami menyediakan banyak fitur yang bisa Anda akses secara gratis untuk membantu meringankan administrasi Anda.' },
                { q: 'Apakah hasil dokumen sesuai dengan standar Kemdikbudristek?', a: 'Ya, seluruh struktur dokumen seperti Modul Ajar, RPP, dan Analisis Hari Efektif telah diprogram untuk menyesuaikan format Kurikulum Merdeka terbaru dari Kemdikbudristek.' },
                { q: 'Bagaimana cara memindahkan dokumen ini ke Microsoft Word?', a: 'Sangat mudah. Di setiap hasil yang dibuat, tersedia tombol "Copy" (Salin). Anda cukup mengkliknya lalu mem-paste (tempel) di Microsoft Word. Format tabel, judul, dan paragraf akan langsung menyesuaikan dengan rapi.' },
                { q: 'Apakah dokumen yang dihasilkan terhindar dari plagiarisme?', a: 'Betul. Karena menggunakan teknologi Generative AI, setiap dokumen disusun secara unik berdasarkan konteks sekolah, materi, dan variabel spesifik yang Anda masukkan. Tidak ada dua dokumen yang 100% sama.' },
                { q: 'Apakah saya bisa membuat Modul Ajar untuk mata pelajaran Muatan Lokal (Mulok) atau Kejuruan SMK?', a: 'Tentu bisa! Kecerdasan buatan (AI) kami sangat fleksibel. Anda cukup mengetikkan nama mata pelajaran secara spesifik pada form yang disediakan, dan sistem akan mengontekstualisasikannya secara akurat.' },
                { q: 'Berapa lama waktu yang dibutuhkan sistem untuk menghasilkan dokumen?', a: 'Rata-rata hanya membutuhkan hitungan detik hingga maksimal 1 menit. Jauh lebih cepat dibandingkan menyusun administrasi berhari-hari secara manual.' },
                { q: 'Apakah hasil dokumen sebelumnya bisa saya lihat lagi?', a: 'Bisa. Semua riwayat pembuatan dokumen Anda akan tersimpan di dalam menu Riwayat (History) pada peramban (browser) Anda. Anda bisa mengaksesnya kapan pun selama Anda tidak menghapus cache peramban.' },
                { q: 'Apakah data pribadi atau sekolah saya aman?', a: 'Sangat aman. Seluruh data input yang Anda masukkan dienkripsi dan kami sama sekali tidak membagikan atau menjual data spesifik pengguna kepada pihak ketiga.' }
              ].map((faq, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300">
                  <button
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none cursor-pointer hover:bg-slate-800/50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-bold text-lg text-slate-200">{faq.q}</span>
                    <ChevronDown className={`text-slate-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div
                    className="px-6 text-slate-400 overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: openFaq === i ? '200px' : '0', paddingBottom: openFaq === i ? '1.25rem' : '0' }}
                  >
                    <p className="pt-2 border-t border-slate-800">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Bottom */}
          <section className="py-24 px-6">
            <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900 to-slate-900 rounded-[3rem] p-12 md:p-20 text-center border border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">Siap Transformasi Cara Kerja Anda?</h2>
              <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto relative z-10">Tinggalkan cara lama yang menguras energi. Masuk sekarang dan nikmati kecanggihan teknologi pendidikan.</p>
              <button
                onClick={onEnterApp}
                className="px-10 py-5 bg-white text-blue-900 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-xl relative z-10 cursor-pointer"
              >
                Buka Aplikasi Sekarang
              </button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-slate-950 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 opacity-50">
              <Sparkles size={18} />
              <span className="font-bold tracking-tight">digen.id</span>
            </div>

            <div className="flex gap-6 text-sm font-medium text-slate-500">
              <a href="/about.html" className="hover:text-white transition-colors">Tentang Kami</a>
              <a href="/privacy-policy.html" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms-of-service.html" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Terms of Service</a>
              <button onClick={() => setIsApkModalOpen(true)} className="hover:text-blue-400 transition-colors flex items-center gap-1 font-bold text-blue-500"><DownloadCloud size={16} /> Download APK</button>
            </div>

            <div className="text-sm text-slate-600">
              © {new Date().getFullYear()} Pemuryadi & RuangRiung. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
      <ApkDownloadModal isOpen={isApkModalOpen} onClose={() => setIsApkModalOpen(false)} />
    </>
  );
}
