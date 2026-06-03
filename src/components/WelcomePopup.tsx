import React, { useState, useEffect } from 'react';
import { X, Crown } from 'lucide-react';

interface WelcomePopupProps {
  onComplete: (role: string) => void;
  onNavigateToPricing?: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onComplete, onNavigateToPricing }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenWelcomePopup');
    if (!hasSeenPopup) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcomePopup', 'true');
    onComplete('guest'); // Default role or user choice
  };

  const handlePricing = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcomePopup', 'true');
    onComplete('guest');
    if (onNavigateToPricing) {
      onNavigateToPricing();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👋</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Pemuryadi Generator</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Selamat datang di <strong>Pemuryadi Generator</strong>! Jelajahi berbagai fitur pendidikan bertenaga AI untuk memudahkan administrasi dan kegiatan belajar mengajar Anda. 
            <br/><br/>
            Sebagian besar fitur dasar tersedia secara gratis, namun kami juga menyediakan paket langganan premium untuk akses penuh ke seluruh alat tingkat lanjut.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleClose}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Mulai Eksplorasi Gratis
            </button>
            <button
              onClick={handlePricing}
              className="w-full py-3 bg-amber-100 text-amber-700 rounded-xl font-bold hover:bg-amber-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown size={18} /> Lihat Paket Langganan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
