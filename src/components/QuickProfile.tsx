import React, { useState, useEffect } from 'react';
import { User, Shield, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { updateProfile } from '../api';
import AIAssistedInput from './AIAssistedInput';

export default function QuickProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    nip: '',
    jenjang: 'SD',
    tahunPelajaran: '2025/2026',
    namaSekolah: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        nip: profile.nip || '',
        jenjang: profile.jenjang || 'SD',
        tahunPelajaran: profile.tahunPelajaran || '2025/2026',
        namaSekolah: profile.namaSekolah || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) {
      alert('Silakan login terlebih dahulu untuk menyimpan profil.');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(user.uid, formData);
      if (typeof refreshProfile === 'function') {
        await refreshProfile();
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan profil.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-red-100 shadow-sm p-6 rounded-2xl w-full h-full flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-4 border-b border-red-500/10 pb-3">
        <User size={18} className="text-red-500" />
        <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest">Identitas Profil</h3>
        {['owner', 'admin'].includes(profile?.role?.toLowerCase()) && <Shield size={14} className="text-red-200 ml-auto" />}
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="col-span-2">
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">Nama Lengkap</label>
          <AIAssistedInput type="text" 
            value={formData.displayName}
            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-black focus:border-red-500 focus:bg-white outline-none transition-all"
            placeholder="Nama Lengkap"
          />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">NIP / NUPTK</label>
          <AIAssistedInput type="text" 
            value={formData.nip}
            onChange={(e) => setFormData({...formData, nip: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-black focus:border-red-500 focus:bg-white outline-none transition-all"
            placeholder="NIP"
          />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">Jenjang</label>
          <select 
            value={formData.jenjang}
            onChange={(e) => setFormData({...formData, jenjang: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-black focus:border-red-500 focus:bg-white outline-none transition-all"
          >
            <option value="PAUD/TK">PAUD/TK</option>
            <option value="SD">SD</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA</option>
            <option value="SMK">SMK</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">Tahun Pelajaran</label>
          <AIAssistedInput type="text" 
            value={formData.tahunPelajaran}
            onChange={(e) => setFormData({...formData, tahunPelajaran: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-black focus:border-red-500 focus:bg-white outline-none transition-all"
            placeholder="2025/2026"
          />
        </div>
        <div className="flex items-end">
          <button 
            onClick={handleSave}
            disabled={isSaving || !user}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              showSuccess 
                ? 'bg-red-300 text-black' 
                : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200'
            } ${(!user || isSaving) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? (
              <span className="animate-spin">⏳</span>
            ) : showSuccess ? (
              <><CheckCircle size={12} /> Tersimpan</>
            ) : (
              <><Save size={12} /> Simpan</>
            )}
          </button>
        </div>
      </div>
      {!user && (
        <p className="text-[9px] text-red-400 mt-2 italic text-center animate-pulse">
          Silakan login untuk menyimpan identitas secara permanen.
        </p>
      )}
    </div>
  );
}
