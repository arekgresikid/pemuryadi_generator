import React from 'react';
import { LogIn, X } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { loginWithGoogle } from '../../api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginRequiredModal({ isOpen, onClose }: Props) {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="gen-card relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner mx-auto">
            <LogIn size={32} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">Akses Ditolak</h2>
          
          <p className="text-gray-600 mb-8 text-center leading-relaxed">
            Fitur AI ini memerlukan akun untuk mengelola penggunaan token Anda. Silakan <strong className="text-gray-900">Login</strong> secara gratis untuk mulai menggunakan AI.
          </p>
          
          <button 
            onClick={() => {
              onClose();
              loginWithGoogle();
            }}
            className="w-full py-4 px-4 bg-white border border-gray-200 text-gray-800 rounded-xl flex items-center justify-center gap-3 font-semibold shadow-sm hover:bg-gray-50 transition-all hover:shadow-md hover:border-gray-300"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            Lanjutkan dengan Google
          </button>
        </div>
      </div>
    </div>
  );
}
