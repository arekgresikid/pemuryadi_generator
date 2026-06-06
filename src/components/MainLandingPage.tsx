import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, BrainCircuit, ShieldCheck, Clock, BookOpen, Layers, Users, Zap, CheckCircle2, PlayCircle, FileText, Star, Grid, FileEdit, DownloadCloud, ChevronDown } from 'lucide-react';

export default function MainLandingPage({ onEnterApp }: { onEnterApp: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
      metaKeywords.setAttribute('content', 'aplikasi guru, pembuat modul ajar ai, rpp merdeka otomatis, generator soal ai, kktp, jurnal harian guru, administrasi pendidikan');
    } else {
      const meta = document.createElement('meta');
      meta.name = "keywords";
      meta.content = "aplikasi guru, pembuat modul ajar ai, rpp merdeka otomatis, generator soal ai, kktp, jurnal harian guru, administrasi pendidikan";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-blue-500/30 text-slate-300">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-950/50 backdrop-blur-md absolute top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">Pemuryadi Generator</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onEnterApp}
              className="text-sm font-bold text-white px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/10 cursor-pointer"
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles size={16} />
              <span>Sistem Cerdas Bertenaga AI Generatif</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
              Revolusi Administrasi <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
                Pendidikan Kurikulum Merdeka
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              Pangkas 90% waktu Anda dalam menyusun Modul Ajar, RPP, Bank Soal, hingga Analisis Hari Efektif. Biarkan Artificial Intelligence mengerjakan rutinitas administratif, sehingga Anda bisa fokus pada mengajar siswa.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in zoom-in duration-700 delay-300">
              <button 
                onClick={onEnterApp}
                className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer"
              >
                Mulai Akses Dashboard <ArrowRight size={20} />
              </button>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm font-medium text-slate-500 animate-in fade-in duration-1000 delay-500">
              <span className="flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={18}/> 100% Sesuai Kemdikbud</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={18}/> Anti-Plagiasi & Unik</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={18}/> Ekspor ke Word & PDF</span>
            </div>
          </div>
        </section>

        {/* Visual Mockup & Stats */}
        <section className="relative z-20 pb-24 px-6 mt-10">
          <div className="max-w-6xl mx-auto">

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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Clock, title: 'Hemat Waktu Ekstrim', desc: 'Selesaikan Modul Ajar yang biasanya memakan waktu berhari-hari hanya dalam hitungan detik.' },
                { icon: BrainCircuit, title: 'Kecerdasan Buatan (AI)', desc: 'Setiap modul, soal, dan rubrik penilaian dibuat dinamis, unik, dan disesuaikan dengan konteks sekolah Anda.' },
                { icon: ShieldCheck, title: 'Standar Nasional', desc: 'Format luaran (output) secara otomatis mengikuti struktur yang disyaratkan oleh Kurikulum Merdeka.' }
              ].map((benefit, i) => (
                <div key={i} className="bg-slate-950 p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-colors group">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                    <benefit.icon className="text-blue-400" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 px-6 bg-slate-950 relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Cara Kerja yang Sangat Mudah</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Tidak perlu keahlian teknis. Siapa pun bisa menghasilkan perangkat pembelajaran berkualitas dalam 3 langkah sederhana.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0"></div>

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

        {/* Features Showcase */}
        <section className="py-24 px-6 relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Satu Platform, <br/><span className="text-blue-400">Semua Solusi Administrasi</span></h2>
                <p className="text-slate-400 text-lg">Dilengkapi dengan belasan modul cerdas untuk mendukung setiap aspek tugas keguruan Anda.</p>
              </div>
              <button onClick={onEnterApp} className="text-white font-bold flex items-center gap-2 hover:text-blue-400 transition-colors pb-2 border-b border-white/20 hover:border-blue-400 cursor-pointer">
                Lihat Semua Fitur <ArrowRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: BookOpen, title: 'Generator Modul Ajar', desc: 'Lengkap dengan ATP, TP, dan Rubrik', color: 'from-blue-500 to-cyan-400' },
                { icon: Zap, title: 'Bank Soal AI', desc: 'Soal HOTS, Pilihan Ganda & Uraian', color: 'from-purple-500 to-pink-500' },
                { icon: Layers, title: 'RPP Merdeka (RPM)', desc: 'Rencana Pembelajaran Mendalam', color: 'from-emerald-400 to-teal-500' },
                { icon: Users, title: 'Modul Kokurikuler', desc: 'Proyek Penguatan Profil Pelajar', color: 'from-amber-400 to-orange-500' }
              ].map((feat, i) => (
                <div key={i} className="bg-slate-900 p-8 rounded-3xl border border-white/5 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group cursor-pointer" onClick={onEnterApp}>
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feat.color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6">
                    <feat.icon className="text-white" size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{feat.title}</h4>
                  <p className="text-slate-400 text-sm">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-slate-900/50 border-y border-white/5 relative z-20 px-6">
          <div className="max-w-7xl mx-auto">
             <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Apa Kata Rekan Pendidik?</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Bergabunglah dengan komunitas guru modern yang telah beralih menggunakan AI.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Budi Santoso', role: 'Guru SMP Negeri 1', text: 'Sangat luar biasa! Dulu membuat modul ajar bisa memakan waktu berhari-hari, sekarang hanya dalam 5 menit. Modulnya sangat relevan dengan Kurikulum Merdeka.' },
                { name: 'Siti Aminah', role: 'Guru SD', text: 'Bank Soalnya sangat membantu. Saya tidak perlu pusing lagi mencari referensi soal HOTS. Fitur analisis hari efektif juga sangat presisi.' },
                { name: 'Ahmad Fauzi', role: 'Kepala Sekolah', text: 'Saya merekomendasikan aplikasi ini untuk seluruh guru di sekolah saya. Administrasi rapi, guru tidak stres, dan bisa lebih fokus mendidik anak-anak.' }
              ].map((testi, i) => (
                <div key={i} className="bg-slate-950 p-8 rounded-3xl border border-white/5 relative hover:-translate-y-1 transition-transform duration-300">
                  <div className="text-blue-500 mb-6 flex gap-1">
                    {[1,2,3,4,5].map(star => <Star key={star} size={18} fill="currentColor" />)}
                  </div>
                  <p className="text-slate-300 mb-8 italic">"{testi.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-lg text-slate-400">
                      {testi.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{testi.name}</h4>
                      <p className="text-xs text-slate-500">{testi.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 px-6 relative z-20 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pertanyaan Umum (FAQ)</h2>
            <p className="text-slate-400">Temukan jawaban cepat untuk pertanyaan tentang platform Pemuryadi Generator.</p>
          </div>
          
          <div className="space-y-4">
            {[
              { q: 'Apakah aplikasi ini sepenuhnya gratis?', a: 'Saat ini kami menyediakan banyak fitur yang bisa Anda akses secara gratis untuk membantu meringankan administrasi Anda.' },
              { q: 'Apakah hasil dokumen sesuai dengan standar Kemdikbudristek?', a: 'Ya, seluruh struktur dokumen seperti Modul Ajar, RPP, dan Analisis Hari Efektif telah diprogram untuk menyesuaikan format Kurikulum Merdeka terbaru dari Kemdikbudristek.' },
              { q: 'Apakah dokumen yang dihasilkan terhindar dari plagiarisme?', a: 'Betul. Karena menggunakan teknologi Generative AI, setiap dokumen disusun secara real-time dan unik berdasarkan konteks sekolah serta topik yang Anda berikan.' },
              { q: 'Apakah data saya aman di platform ini?', a: 'Sangat aman. Kami menggunakan sistem autentikasi modern dan tidak membagikan atau menjual data pengguna kepada pihak ketiga mana pun.' }
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
            <span className="font-bold tracking-tight">Pemuryadi Generator</span>
          </div>
          
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="/about.html" className="hover:text-white transition-colors">Tentang Kami</a>
            <a href="/privacy-policy.html" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms-of-service.html" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} Pemuryadi & RuangRiung. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
