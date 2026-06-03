import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface WelcomePopupProps {
  onComplete: (role: string) => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onComplete }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👋</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Selamat Datang!</h2>
          <p className="text-gray-600 mb-6">
            Jelajahi berbagai fitur menarik di Pendidikan Generator. Tingkatkan pengalaman belajar mengajar Anda.
          </p>
          <button
            onClick={handleClose}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Mulai Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
