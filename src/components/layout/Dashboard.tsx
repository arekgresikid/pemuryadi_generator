import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, Activity, Coffee, ShoppingCart, MessageSquare, X, Send, AlertTriangle, Zap,
  TrendingUp, Clock, Target, Award, Bell, Sparkles, BarChart3, ChevronRight,
  Calendar, Users, FileText, CheckCircle2, Star, Flame, Trophy
} from 'lucide-react';
import QuickProfile from '../QuickProfile';
import FeedbackForm from '../FeedbackForm';
import { useAuth } from '../../AuthContext';

export interface DashboardProps {
  osName: string;
  ramInfo: string;
  userAgentStr: string;
  visitors: { today: number; month: number; total: number };
  favorites: number;
  activityClicks: Record<string, number>;
  menuItems: any[];
  onTabChange: (tabId: string) => void;
  onOpenChat: () => void;
  onIncrementFavorites: () => void;
}

export default function Dashboard({
  osName,
  ramInfo,
  userAgentStr,
  visitors,
  favorites,
  activityClicks,
  menuItems,
  onTabChange,
  onOpenChat,
  onIncrementFavorites
}: DashboardProps) {
  const { user, profile } = useAuth();
  const [showPromo, setShowPromo] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const currentTier = profile?.tier || profile?.role || (user ? 'Free' : null);

  // Calculate statistics
  const totalClicks = useMemo(() => 
    Object.values(activityClicks).reduce((sum, count) => sum + count, 0), 
    [activityClicks]
  );

  const mostUsedFeature = useMemo(() => {
    const entries = Object.entries(activityClicks);
    if (entries.length === 0) return null;
    const [featureId, count] = entries.reduce((max, curr) => curr[1] > max[1] ? curr : max);
    const menuItem = menuItems.flatMap(item => [item, ...(item.dropdown || [])]).find(item => item.id === featureId);
    return { label: menuItem?.label || featureId, count };
  }, [activityClicks, menuItems]);

  // Mock data for enhanced features
  const [recentActivity] = useState([
    { id: 1, action: 'Membuat Modul Ajar', time: '5 menit lalu', icon: FileText, color: 'blue' },
    { id: 2, action: 'Generate RPP', time: '15 menit lalu', icon: CheckCircle2, color: 'green' },
    { id: 3, action: 'Buat Soal Pilihan Ganda', time: '1 jam lalu', icon: Target, color: 'purple' },
  ]);

  const [achievements] = useState([
    { id: 1, title: 'First Steps', desc: 'Membuat dokumen pertama', icon: Star, earned: true },
    { id: 2, title: 'Productive', desc: 'Generate 10 dokumen', icon: Flame, earned: true },
    { id: 3, title: 'Master Educator', desc: 'Generate 50 dokumen', icon: Trophy, earned: false },
  ]);

  const [quickActions] = useState([
    { id: 'modul-ajar', label: 'Modul Ajar', icon: FileText, color: 'blue' },
    { id: 'buat-soal', label: 'Buat Soal', icon: Target, color: 'green' },
    { id: 'rpp-generator', label: 'RPP Generator', icon: Calendar, color: 'purple' },
    { id: 'chatbot', label: 'AI Assistant', icon: MessageSquare, color: 'orange' },
  ]);

  const [notifications] = useState([
    { id: 1, title: 'Update Fitur Baru', desc: 'Generator Soal AKM telah tersedia!', time: '2 jam lalu', unread: true },
    { id: 2, title: 'Token Hampir Habis', desc: 'Tersisa 5 token. Segera upgrade!', time: '1 hari lalu', unread: true },
  ]);



  const [typedText, setTypedText] = useState('');
  const phrases = [
    "Welcome to the future Education.",
    "Solusi AI cerdas untuk para Pendidik.",
    "Susun Modul Ajar & RPP dalam hitungan detik.",
    "Tingkatkan efisiensi Administrasi Sekolah Anda.",
    "Analisis kebutuhan belajar siswa lebih mudah.",
    "Satu klik untuk semua dokumen kelas.",
    "Bebaskan waktu Anda untuk lebih fokus mengajar.",
    "Membangun ekosistem pendidikan yang lebih maju."
  ];

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;
    let isMounted = true;
    let phraseIndex = 0;

    const startTyping = () => {
      let currentText = '';
      let charIndex = 0;
      setTypedText('');
      const currentPhrase = phrases[phraseIndex];
      
      intervalId = setInterval(() => {
        if (!isMounted) return;
        if (charIndex < currentPhrase.length) {
          currentText += currentPhrase[charIndex];
          setTypedText(currentText);
          charIndex++;
        } else {
          clearInterval(intervalId);
          phraseIndex = (phraseIndex + 1) % phrases.length;
          timeoutId = setTimeout(() => {
            if (isMounted) startTyping();
          }, 4000); // Tunggu 4 detik sebelum ganti kalimat
        }
      }, 60); // Kecepatan ketik 60ms
    };

    startTyping();

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Promo Banner */}
      {showPromo && (!currentTier || currentTier.toLowerCase() === 'free') && (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/20 relative overflow-hidden">
          <button 
            onClick={() => setShowPromo(false)}
            className="absolute top-3 right-3 text-white/70 hover:text-white p-1 z-20 transition-colors bg-black/10 hover:bg-black/20 rounded-full"
            title="Tutup Promo"
          >
            <X size={20} />
          </button>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "20px 20px" }}></div>
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Spesial Pengguna Baru</span>
            </div>
            <h2 className="text-xl md:text-3xl font-black mb-1 drop-shadow-md">Voucher Diskon 20%</h2>
            <p className="text-white/90 text-sm md:text-base font-medium">Klaim potongan harga eksklusif Anda untuk berlangganan paket Premium atau Ultimate sekarang juga!</p>
          </div>
          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <button 
              onClick={() => onTabChange('pricing')}
              className="w-full md:w-auto bg-white text-indigo-600 hover:bg-gray-50 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:scale-105"
            >
              <Zap size={18} />
              Gunakan Sekarang
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        
        {/* Hero Dashboard Section */}
        <div className="bg-white border border-gray-200 shadow-sm p-8 rounded-2xl flex flex-col justify-center col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 mb-6 w-max">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
            </span>
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">System Online</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter leading-none flex flex-col items-start gap-1">
            <span className="text-blue-600">
              Pemurya<span className="text-amber-500">di Gen</span>erator
            </span>
            <a href="https://digen.id" target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-400 hover:text-blue-500 transition-colors tracking-normal">https://digen.id</a>
          </h2>
          <p className="text-lg text-gray-500 font-medium italic mb-4 min-h-[28px]">
            {typedText}<span className="animate-pulse inline-block w-[2px] h-[1em] bg-blue-500 ml-1 align-middle"></span>
          </p>
          <div className="flex flex-wrap gap-4 mt-auto mb-8">
            <button onClick={() => onTabChange('pricing')} className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors px-6 py-3 text-left w-max">
              <div className="font-bold text-sm mb-1">Operation System: {osName} | RAM: {ramInfo}</div>
              <div className="text-[9px] font-mono opacity-80 max-w-sm">USER AGENT: {userAgentStr}</div>
            </button>
            <button onClick={onOpenChat} className="px-8 py-3 text-sm font-bold uppercase tracking-widest border border-gray-300 text-blue-500 hover:bg-blue-500 hover:text-white transition-all italic">
              Consult AI Assistant
            </button>
          </div>
        </div>

        {/* Quick Profile */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1 flex items-stretch">
          <div className="w-full flex-1">
            <QuickProfile />
          </div>
        </div>

        {/* Traffic Analytics */}
        <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl flex flex-col h-full col-span-1 md:col-span-1 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest">Traffic Analytics</h3>
            <Activity size={16} className="text-blue-500" />
          </div>
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Daily Access</span>
              <span className="text-lg font-mono font-bold text-blue-600">{visitors.today}</span>
            </div>
            <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-3/4 shadow-sm"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Monthly Load</span>
              <span className="text-lg font-mono font-bold text-blue-500">{visitors.month}</span>
            </div>
            <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden mb-4">
              <div className="bg-blue-500 h-full w-1/2 shadow-sm"></div>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <Heart size={14} className="text-blue-300" />
                <span className="text-xs text-gray-500">Favorites</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-mono font-bold text-blue-300">{favorites}</span>
                <button onClick={onIncrementFavorites} className="p-1.5 rounded bg-blue-50 text-blue-300 hover:bg-blue-100 hover:text-white transition-colors" title="Favorite this app">
                  <Heart size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Aktivitas Paling Sering Diklik */}
        <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl flex flex-col h-full col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 animate-pulse rounded-full"></div>
              Aktivitas Paling Sering Diklik
            </h3>
          </div>
          <div className="space-y-4 font-mono text-[10px] flex-1 overflow-y-auto">
            {Object.entries(activityClicks).length > 0 ? (
              Object.entries(activityClicks)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([activity, count], index) => {
                  const menuItem = menuItems.flatMap(item => [item, ...(item.dropdown || [])]).find(item => item.id === activity);
                  const label = menuItem ? menuItem.label : activity;
                  return (
                    <div key={activity} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-2 gap-1 sm:gap-4">
                      <div className="flex items-start sm:items-center gap-2 sm:gap-4 overflow-hidden">
                        <span className="text-slate-600 shrink-0">#{index + 1}</span>
                        <span className="text-gray-700 truncate sm:whitespace-normal sm:break-words">{label}</span>
                      </div>
                      <span className="text-blue-600 font-bold self-end sm:self-auto shrink-0">{count} klik</span>
                    </div>
                  );
                })
            ) : (
              <div className="text-gray-500 italic">Belum ada aktivitas...</div>
            )}
          </div>
        </div>

        {/* Support Network */}
        <div className="bg-white border border-gray-200 shadow-sm p-6 lg:p-8 rounded-2xl flex flex-col justify-between bg-gradient-to-br from-blue-50 to-transparent hover:shadow-md transition-shadow h-full col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1">
            <div>
              <h3 className="text-lg font-black italic text-blue-600 mb-3 uppercase tracking-tight flex items-center gap-2">
                 <Coffee size={20} /> Support Network
              </h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                Kontribusi Anda menjaga sistem ini tetap online dan gratis bagi seluruh pendidik. Mari wujudkan ekosistem pendidikan yang lebih baik.
              </p>
            </div>
            <a href="https://saweria.co/pemuryadi" target="_blank" rel="noreferrer" className="inline-flex justify-center items-center gap-2 px-6 py-3 w-full bg-blue-100 text-blue-700 font-bold uppercase text-xs tracking-wider rounded-xl hover:scale-[1.02] transition-transform mt-auto">
              Donate via Saweria
            </a>
        </div>

        {/* Premium Assets */}
        <div className="bg-white border border-gray-200 shadow-sm p-6 lg:p-8 rounded-2xl flex flex-col justify-between bg-gradient-to-br from-red-50 to-transparent hover:shadow-md transition-shadow h-full col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-1">
            <div>
              <h3 className="text-lg font-black italic text-red-600 mb-3 uppercase tracking-tight flex items-center gap-2">
                 <ShoppingCart size={20} /> Premium Assets
              </h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                Dapatkan akses ke materi ajar eksklusif, template premium, dan sumber daya tingkat lanjut untuk kebutuhan mengajar kelas Anda.
              </p>
            </div>
            <a href="https://lynk.id/pemuryadi" target="_blank" rel="noreferrer" className="inline-flex justify-center items-center gap-2 px-6 py-3 w-full bg-red-600 text-white font-bold uppercase text-xs tracking-wider rounded-xl hover:scale-[1.02] transition-transform shadow-sm mt-auto">
              Buka Marketplace
            </a>
        </div>

        {/* Feedback & Bug Report */}
        <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl flex flex-col justify-center h-full col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
           <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
             <MessageSquare size={18} className="text-blue-600" /> Masukan, Saran, & Laporan Bug
           </h3>
           <div className="text-xs text-gray-600 mb-4 space-y-3">
             <p>Punya ide fitur, saran pengembangan, atau menemui kendala teknis? Beritahu kami agar aplikasi ini terus berkembang!</p>
             <div className="bg-red-50 text-red-800 p-3.5 rounded-xl border border-red-100 flex items-start gap-3">
               <AlertTriangle size={18} className="shrink-0 mt-0.5 text-red-600" />
               <p className="leading-relaxed">
                 <strong className="text-red-900 block mb-1">Mendapati Bug atau Error?</strong> 
                 Mohon kirimkan kronologi kejadiannya secara rinci. Jika memungkinkan, sertakan <strong>screenshot atau video</strong> agar tim kami dapat segera menindaklanjutinya.<br/>
                 Silakan kirimkan laporan Anda melalui email ke <a href="mailto:p.e.muryadi@gmail.com" className="font-bold underline hover:text-red-900 transition-colors">p.e.muryadi@gmail.com</a> atau <a href="mailto:arekgresikid@gmail.com" className="font-bold underline hover:text-red-900 transition-colors">arekgresikid@gmail.com</a>.
               </p>
             </div>
           </div>
           <FeedbackForm inline={true} />
        </div>

      </div>
    </div>
  );
}
