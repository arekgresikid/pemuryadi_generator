import React from 'react';
import { X, DownloadCloud, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApkDownloadModal({ isOpen, onClose }: ApkDownloadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-2"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6 text-blue-600">
          <div className="p-3 bg-blue-100 rounded-2xl">
            <ShieldCheck size={28} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Download APK Android</h2>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800">
            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold mb-1">Aplikasi Masih Tahap Pengembangan (BETA)</p>
              <p>APK ini belum tersedia secara publik di Google Play Store resmi. Saat Anda menginstal, sistem Android (Google Play Protect) mungkin akan memperingatkan bahwa aplikasi ini tidak dikenal atau berbahaya karena belum kami verifikasi di Play Store.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">i</span>
              Cara Install yang Aman:
            </h3>
            <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2 ml-1">
              <li>Klik tombol download di bawah dan tunggu hingga selesai.</li>
              <li>Buka file <code className="bg-slate-200 px-1 py-0.5 rounded text-xs">PemuryadiGenerator.apk</code> yang terunduh.</li>
              <li>Jika muncul peringatan <strong>Google Play Protect</strong>, klik <strong>"Detail selengkapnya"</strong> (More details).</li>
              <li>Lalu pilih <strong>"Tetap install"</strong> (Install anyway).</li>
              <li>Jika diminta izin install dari sumber tidak dikenal, berikan izin kepada browser atau File Manager Anda.</li>
              <li>Jika ada perintah untuk memindai aplikasi, silakan klik tombol pindai agar Google Play Protect dapat memastikan aplikasinya aman.</li>
            </ol>
          </div>
        </div>

        <div className="flex gap-3 justify-end flex-wrap">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-full font-bold text-slate-600 hover:bg-slate-100 transition-colors w-full sm:w-auto"
          >
            Batal
          </button>
          <a 
            href="/PemuryadiGenerator.apk" 
            download
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/30 w-full sm:w-auto"
          >
            <DownloadCloud size={20} />
            Saya Mengerti, Download
          </a>
        </div>
      </div>
    </div>
  );
}
