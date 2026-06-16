import React from 'react';
import { Lock, Sparkles, X } from 'lucide-react';

interface PremiumLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  title?: string;
  description?: string;
}

export default function PremiumLockModal({ isOpen, onClose, onUpgrade, title = "Fitur Terkunci", description = "Tingkatkan akun Anda ke paket Essential, Premium, Ultimate, Supreme, atau Titan untuk membuka akses penuh ke semua alat dan generator tanpa batasan." }: PremiumLockModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center animate-in fade-in p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex flex-col items-center justify-center text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <Lock size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-center">{title}</h2>
          <p className="text-blue-100 text-center mt-2 text-sm">
            Alat ini eksklusif untuk pengguna Berbayar
          </p>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 text-center mb-6 text-sm leading-relaxed">
            {description}
          </p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={onUpgrade}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg transform active:scale-[0.98]"
            >
              <Sparkles size={18} />
              Lihat Opsi Berlangganan
            </button>
            <button 
              onClick={onClose}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors text-sm"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
