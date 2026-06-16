import React from 'react';
import { LayoutDashboard, Users, Gamepad2, BookOpen, BarChart } from 'lucide-react';

interface PhoneMockupProps {
  className?: string;
}

export default function PhoneMockup({ className = '' }: PhoneMockupProps) {
  return (
    <div className={`relative mx-auto w-[300px] h-[600px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden ${className}`}>
      {/* Phone Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-3xl z-50 flex justify-center items-center">
        <div className="w-12 h-1.5 bg-slate-900 rounded-full"></div>
      </div>

      {/* Screen Content - App Simulation */}
      <div className="w-full h-full bg-slate-950 text-white relative overflow-hidden flex flex-col pt-8">
        
        {/* Topbar Simulation */}
        <div className="px-4 py-3 flex justify-between items-center border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="h-4 w-24 bg-slate-800 rounded animate-pulse"></div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800"></div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          
          {/* Welcome Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
            <h3 className="text-sm font-bold text-white mb-1">Selamat Datang!</h3>
            <p className="text-[10px] text-slate-400">Siap untuk produktif hari ini?</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
              <Users size={16} className="text-blue-400" />
              <div className="h-3 w-12 bg-slate-800 rounded"></div>
              <div className="text-lg font-bold">1,240</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
              <BarChart size={16} className="text-emerald-400" />
              <div className="h-3 w-12 bg-slate-800 rounded"></div>
              <div className="text-lg font-bold">85%</div>
            </div>
          </div>

          {/* Recent Activity or Modules */}
          <div>
            <div className="h-3 w-20 bg-slate-800 rounded mb-3"></div>
            <div className="space-y-2">
              {[
                { icon: <LayoutDashboard size={14} className="text-purple-400" />, title: 'Supervisi Akademik' },
                { icon: <BookOpen size={14} className="text-orange-400" />, title: 'Modul Ajar' },
                { icon: <Gamepad2 size={14} className="text-pink-400" />, title: 'Games Hub' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 flex items-center gap-3 backdrop-blur-sm">
                  <div className="p-2 rounded-lg bg-slate-800">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold">{item.title}</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Baru saja diakses</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Navigation Simulation */}
        <div className="h-16 border-t border-slate-800/50 bg-slate-900 flex justify-around items-center px-4 pb-2 z-10">
          <div className="flex flex-col items-center gap-1">
            <div className="w-5 h-5 rounded bg-blue-500"></div>
            <div className="w-8 h-1 rounded-full bg-blue-500/50"></div>
          </div>
          <div className="w-5 h-5 rounded bg-slate-700"></div>
          <div className="w-5 h-5 rounded bg-slate-700"></div>
          <div className="w-5 h-5 rounded bg-slate-700"></div>
        </div>
      </div>

      {/* Screen Glare Effect */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent transform rotate-45 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
    </div>
  );
}
