import React, { JSX, useState } from 'react';
import { History, GitCommit, Calendar, Rocket, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';
import changelogData from '../data/changelog.json';

export default function Changelog() {
  const [visibleCount, setVisibleCount] = useState(5);

  const iconMap: Record<string, JSX.Element> = {
    'Rocket': <Rocket className="w-5 h-5 text-blue-600" />,
    'CheckCircle2': <CheckCircle2 className="w-5 h-5 text-gray-500" />,
    'Sparkles': <Sparkles className="w-5 h-5 text-gray-500" />
  };

  const versions = changelogData.map((v) => ({
    ...v,
    icon: iconMap[v.icon] || <CheckCircle2 className="w-5 h-5 text-gray-500" />
  }));

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
          
          {versions.slice(0, visibleCount).map((ver, idx) => {
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

        {/* Load More Button */}
        {visibleCount < versions.length && (
          <div className="flex justify-center mt-8 pt-4">
            <button 
              onClick={() => setVisibleCount(prev => prev + 5)}
              className="px-6 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-full transition-colors duration-200 flex items-center gap-2 group"
            >
              Muat Lebih Banyak
              <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
