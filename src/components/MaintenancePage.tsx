import React, { useState, useEffect } from 'react';
import { Settings, Phone, Clock } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

interface MaintenancePageProps {
  endTime: string; // ISO date string or generic text
  waNumber: string;
  reason?: string;
}

export default function MaintenancePage({ endTime, waNumber, reason }: MaintenancePageProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

  useEffect(() => {
    if (!endTime) return;
    
    const targetDate = new Date(endTime).getTime();
    if (isNaN(targetDate)) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const handleWhatsApp = () => {
    let num = waNumber;
    if (num && num.startsWith('0')) num = '62' + num.substring(1);
    window.open(`https://wa.me/${num}?text=Halo%20Admin,%20saya%20ingin%20bertanya%20seputar%20maintenance%20website...`, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-0 bg-slate-950 pointer-events-none" />
      <div 
        className="fixed inset-0 z-0 pointer-events-none animate-slow-pan opacity-60" 
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="max-w-xl w-full bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden text-center relative border border-slate-700 p-6 md:p-10">
          
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500 blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500 blur-[100px] animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-full flex items-center justify-center mb-8 animate-bounce">
              <Settings size={48} className="animate-spin-slow" style={{ animationDuration: '4s' }} />
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
              Sistem Dalam Pemeliharaan
            </h1>
            <p className="text-slate-300 mb-6 max-w-lg mx-auto text-base">
              {reason ? reason : "Kami sedang melakukan peningkatan sistem. Semua layanan akan segera online kembali untuk Anda."}
            </p>

            {/* Countdown Timer */}
            {timeLeft && (
              <div className="mb-10 w-full max-w-lg bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <div className="flex flex-col items-center justify-center gap-1 mb-6 text-slate-300 font-medium">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Clock size={18} /> <span>Akan online kembali pada:</span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    {new Date(endTime).toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 md:gap-4">
                  <div className="bg-slate-800 rounded-xl shadow-inner border border-slate-700/50 p-3 flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-4xl font-bold text-white mb-1">{timeLeft.days}</span>
                    <span className="text-[10px] md:text-xs text-blue-400 uppercase font-bold tracking-wider">Hari</span>
                  </div>
                  <div className="bg-slate-800 rounded-xl shadow-inner border border-slate-700/50 p-3 flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-4xl font-bold text-white mb-1">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-[10px] md:text-xs text-blue-400 uppercase font-bold tracking-wider">Jam</span>
                  </div>
                  <div className="bg-slate-800 rounded-xl shadow-inner border border-slate-700/50 p-3 flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-4xl font-bold text-white mb-1">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-[10px] md:text-xs text-blue-400 uppercase font-bold tracking-wider">Menit</span>
                  </div>
                  <div className="bg-slate-800 rounded-xl shadow-inner border border-slate-700/50 p-3 flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-4xl font-bold text-white mb-1">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-[10px] md:text-xs text-blue-400 uppercase font-bold tracking-wider">Detik</span>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Button */}
            {waNumber && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-slate-400">Punya pertanyaan penting atau keluhan?</span>
                <button 
                  onClick={handleWhatsApp}
                  className="flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full font-bold transition-all shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:-translate-y-1 text-sm"
                >
                  <FaWhatsapp size={20} /> Hubungi WhatsApp (+{waNumber.startsWith('0') ? '62' + waNumber.substring(1) : waNumber})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
