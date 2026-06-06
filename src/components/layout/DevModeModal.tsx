import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Cpu } from 'lucide-react';

export interface DevModeModalProps {
  target: string | null;
  onClose: () => void;
  onSuccess: (target: string) => void;
}

export default function DevModeModal({ target, onClose, onSuccess }: DevModeModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!target) return null;

  const handleVerify = async () => {
    if (!password) return;
    setIsVerifying(true);
    setError('');
    try {
      const res = await fetch('/api/verify-dev-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = (await res.json()) as any;
      if (data.success) {
        onSuccess(target);
        // Reset state for future opens
        setPassword('');
        setError('');
      } else {
        setError('Kode salah! Silakan coba lagi.');
      }
    } catch (e) {
      setError('Gagal memverifikasi kode. Periksa koneksi.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 shadow-inner">
            <Lock size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Akses Terkunci</h3>
          <p className="text-sm text-gray-500 mb-6">Fitur ini masih dalam tahap pengembangan. Masukkan kode akses developer untuk membuka.</p>
          
          <div className="space-y-4">
            <div>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isVerifying) {
                      handleVerify();
                    }
                  }}
                  placeholder="Kode Akses"
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-4 pr-12 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  autoFocus
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-xs mt-2 animate-in slide-in-from-top-1">{error}</p>
              )}
            </div>
            
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  setPassword('');
                  setError('');
                  onClose();
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleVerify}
                disabled={isVerifying || !password}
                className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isVerifying ? <Cpu size={18} className="animate-spin" /> : 'Buka Kunci'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
