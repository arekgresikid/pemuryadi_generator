import React, { useEffect, useState } from 'react';
import { MapPin, School, ArrowRight, ShieldCheck, Zap, Sparkles, BookOpen, Clock, Users, BrainCircuit } from 'lucide-react';

export default function SEOLandingPage({ onEnterApp }: { onEnterApp: (tab?: string) => void }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'kota' | 'sekolah' | ''>('');

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/kota/')) {
      setType('kota');
      const rawCity = path.replace('/kota/', '').replace(/-/g, ' ');
      setTitle(rawCity.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    } else if (path.startsWith('/sekolah/')) {
      setType('sekolah');
      const rawSchool = path.replace('/sekolah/', '').replace(/-/g, ' ');
      setTitle(rawSchool.split(' ').map(w => {
        const lw = w.toLowerCase();
        if (['sdn', 'smpn', 'sman', 'smkn', 'min', 'mtsn', 'man', 'sd', 'smp', 'sma', 'smk'].includes(lw)) {
          return lw.toUpperCase();
        }
        return w.charAt(0).toUpperCase() + w.slice(1);
      }).join(' '));
    }
  }, []);

  if (!type) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-200">
      {/* Header/Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
            <Sparkles size={20} />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">digen.id</span>
        </div>
        <button 
          onClick={() => onEnterApp()} 
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-100"
        >
          Masuk ke Dashboard
        </button>
      </nav>

      <main className="flex-1">
        {/* Combined Hero & About Section */}
        <section className="relative overflow-hidden bg-slate-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-200 rounded-full blur-[100px] opacity-40"></div>
          <div className="absolute top-40 -left-40 w-[400px] h-[400px] bg-indigo-200 rounded-full blur-[100px] opacity-40"></div>

          <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Hero Content */}
            <div className="flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 font-bold text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
                {type === 'kota' ? <MapPin size={18} /> : <School size={18} />}
                <span>Tersedia Khusus untuk Pendidik di <span className="font-black underline decoration-blue-300 underline-offset-4">{title}</span></span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 leading-[1.1]">
                Revolusi Administrasi <br className="hidden md:block"/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Pendidikan Modern
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-12 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 font-medium">
                {type === 'kota' ? (
                  <>Bergabunglah dengan ribuan pendidik di <strong className="text-slate-900 font-black">Kota {title}</strong> yang telah menghemat waktu berjam-jam menggunakan Artificial Intelligence untuk menyusun <strong>Modul Belajar {title}</strong>, <strong>Modul Ajar {title}</strong>, dan <strong>RPP Kurikulum Merdeka {title}</strong>.</>
                ) : (
                  <>Mendukung penuh aktivitas belajar mengajar di <strong className="text-slate-900 font-black">{title}</strong>. Tingkatkan produktivitas Anda dengan alat cerdas <strong>Generator Modul Ajar {title}</strong> dan <strong>RPP {title}</strong> yang dirancang khusus untuk Kurikulum Merdeka.</>
                )}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in zoom-in duration-700 delay-300">
                <button 
                  onClick={() => onEnterApp()}
                  className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 group cursor-pointer w-full sm:w-auto"
                >
                  Mulai Gunakan Gratis 
                  <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column: About Cards (Compact) */}
            <div className="space-y-6 lg:mt-0 mt-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-all duration-500 group">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex-shrink-0">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Lahir dari Kepedulian</h3>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      Diinisiasi oleh <strong><a href="https://pemuryadi.my.id" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-indigo-600 underline decoration-blue-200 transition-all">Praswara Eko Muryadi</a></strong> dan berkolaborasi dengan komunitas <strong><a href="https://ruangriung.my.id" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-indigo-600 underline decoration-blue-200 transition-all">RuangRiung</a></strong> untuk memangkas tugas administratif guru.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-[2rem] shadow-2xl shadow-slate-900/20 border border-slate-700 hover:-translate-y-1 transition-all duration-500 group text-white">
                <div className="flex items-start gap-5">
                   <div className="w-14 h-14 bg-slate-700/50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 border border-slate-600 flex-shrink-0">
                    <BrainCircuit className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 tracking-tight">Teknologi Bertemu Edukasi</h3>
                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                      Memangkas 90% waktu administrasi dengan standar kualitas tinggi yang terselaraskan dengan <strong>Kurikulum Merdeka</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-all duration-500 group">
                <div className="flex items-start gap-5">
                   <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex-shrink-0">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Dampak Luas Bagi Siswa</h3>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      Evaluasi berbasis HOTS, <em>Bank Soal AI</em>, dan <em>Game Edukasi</em> interaktif merangsang nalar kritis sekaligus mengusir kebosanan belajar di kelas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Quick Stats/Features Section */}
        <section className="py-16 bg-white border-t border-slate-200 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: BookOpen, title: `Modul Ajar ${title}`, desc: 'Sesuai Kurikulum Merdeka', bg: 'bg-blue-50', text: 'text-blue-600', shadow: 'hover:shadow-blue-500/20' },
                { icon: BrainCircuit, title: `Bank Soal AI ${title}`, desc: 'Otomatisasi Soal HOTS', bg: 'bg-indigo-50', text: 'text-indigo-600', shadow: 'hover:shadow-indigo-500/20' },
                { icon: ShieldCheck, title: 'SNP Ready', desc: 'Terintegrasi Adiwiyata', bg: 'bg-emerald-50', text: 'text-emerald-600', shadow: 'hover:shadow-emerald-500/20' },
                { icon: Clock, title: `RPP Otomatis ${title}`, desc: 'Pangkas Waktu Rutin', bg: 'bg-amber-50', text: 'text-amber-600', shadow: 'hover:shadow-amber-500/20' }
              ].map((stat, i) => (
                <div key={i} className={`bg-slate-50 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl ${stat.shadow} transition-all duration-300 group cursor-default`}>
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.text} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <stat.icon size={26} strokeWidth={2.5} />
                  </div>
                  <h4 className="font-bold text-xl text-slate-900 mb-2">{stat.title}</h4>
                  <p className="text-slate-500 font-medium">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-slate-900 text-white px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Siap Mempermudah Tugas Anda?</h2>
            <p className="text-xl text-slate-300 mb-10">
              Pendidik di <strong className="text-white font-black underline decoration-blue-500 underline-offset-4">{title}</strong> sudah mulai menggunakan AI untuk menghemat waktu mereka. Sekarang giliran Anda.
            </p>
            <button 
              onClick={() => onEnterApp()}
              className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-xl flex items-center justify-center gap-3 mx-auto group cursor-pointer"
            >
              Mulai Akses Dashboard Sekarang
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-blue-600" />
            </button>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">P</div>
              <span className="font-bold text-xl text-white">digen.id</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-6">
              Platform AI inovatif yang memberdayakan guru Indonesia untuk menciptakan perangkat pembelajaran Kurikulum Merdeka berkualitas tinggi dengan efisien.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                <School size={18} />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                <MapPin size={18} />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Layanan Utama {title}</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onEnterApp('modul')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Generator Modul Belajar {title}</button></li>
              <li><button onClick={() => onEnterApp('deeplearning')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Pembuat RPP Otomatis {title}</button></li>
              <li><button onClick={() => onEnterApp('buat-soal')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Sistem Bank Soal AI {title}</button></li>
              <li><button onClick={() => onEnterApp('kalender-pendidikan')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Administrasi Sekolah {title}</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Dukungan</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onEnterApp('beranda')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Panduan Penggunaan</button></li>
              <li><a href="/about.html" className="hover:text-blue-400 transition-colors cursor-pointer">Tentang Kami</a></li>
              <li><a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors cursor-pointer">Kebijakan Privasi</a></li>
              <li><a href="/terms-of-service.html" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors cursor-pointer">Syarat & Ketentuan</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Hak Cipta Dilindungi. Didedikasikan untuk guru {type === 'kota' ? (
              <>se-Kota <strong className="font-bold text-white">{title}</strong></>
            ) : (
              <>di <strong className="font-bold text-white">{title}</strong></>
            )}.
          </p>
          <div className="text-sm flex gap-4">
            <span>
              Dibuat dengan ❤️ oleh <a href="https://pemuryadi.my.id" target="_blank" rel="noreferrer" className="text-white hover:text-blue-400 underline decoration-slate-600 hover:decoration-blue-400 transition-all">Pemuryadi</a> & <a href="https://ruangriung.my.id" target="_blank" rel="noreferrer" className="text-white hover:text-blue-400 underline decoration-slate-600 hover:decoration-blue-400 transition-all">RuangRiung</a> untuk Pendidikan Indonesia
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
