import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Settings, User, LogIn, LogOut, Shield, Coins, Zap } from 'lucide-react';
import Logo from '../Logo';
import { MenuItem } from './Sidebar';

function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/:/g, '.');
  const dateString = currentTime.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="flex flex-col items-end font-mono">
      <div className="text-xl font-bold text-blue-600 tracking-tighter">
        {timeString}
      </div>
      <div className="text-[10px] uppercase tracking-widest text-blue-500 font-medium">
        {dateString}
      </div>
    </div>
  );
}

function Breadcrumb({ activeTab, menuItems }: { activeTab?: string, menuItems?: MenuItem[] }) {
  if (!activeTab || !menuItems) return null;
  
  let parentLabel = '';
  let currentLabel = '';
  
  for (const item of menuItems) {
    if (item.id === activeTab) {
      currentLabel = item.label;
      break;
    }
    if (item.dropdown) {
      for (const sub of item.dropdown) {
        if (sub.id === activeTab) {
          parentLabel = item.label;
          currentLabel = sub.label;
          break;
        }
      }
    }
    if (currentLabel) break;
  }
  
  if (!currentLabel) return null;
  
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
      <span className="text-gray-400">Beranda</span>
      {parentLabel && (
        <>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">{parentLabel}</span>
        </>
      )}
      {currentLabel !== 'Beranda' && (
        <>
          <span className="text-gray-300">/</span>
          <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{currentLabel}</span>
        </>
      )}
    </div>
  );
}

export interface TopbarProps {
  setIsSidebarOpen: (v: boolean) => void;
  usageTime: number;
  brightness: number;
  setBrightness: (v: number) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (v: boolean) => void;
  gradientsEnabled: boolean;
  setGradientsEnabled: (v: boolean) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  deferredPrompt: any;
  handleInstallClick: () => void;
  user: any;
  profile: any;
  loading: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
  handleTabChange: (id: string) => void;
  activeTab?: string;
  menuItems?: MenuItem[];
}

export default function Topbar({
  setIsSidebarOpen,
  usageTime,
  brightness,
  setBrightness,
  animationsEnabled,
  setAnimationsEnabled,
  gradientsEnabled,
  setGradientsEnabled,
  isFullscreen,
  toggleFullscreen,
  deferredPrompt,
  handleInstallClick,
  user,
  profile,
  loading,
  handleLogin,
  handleLogout,
  handleTabChange,
  activeTab,
  menuItems
}: TopbarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between no-print w-full" style={{ willChange: 'transform' }}>
      <div className="flex items-center gap-3 md:hidden">
        <button onClick={() => setIsSidebarOpen(true)} className="text-blue-600 p-1">
          <Menu size={24} />
        </button>
        <Logo className="w-8 h-8" />
        <h1 className="text-sm font-bold text-blue-600">digen.id</h1>
      </div>

      <div className="flex-1 hidden md:flex items-center ml-6">
        <Breadcrumb activeTab={activeTab} menuItems={menuItems} />
      </div>

      <div className="flex items-center gap-2 sm:gap-6 ml-auto">
        <div className="hidden sm:block">
          <Clock />
        </div>
        <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>
        <div className="flex items-center gap-1 sm:gap-3">
          
          {/* Notifications */}
          <div className="relative" ref={notifDropdownRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`p-2 rounded-lg transition-colors relative ${isNotificationsOpen ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-600 hover:text-blue-600'}`}
            >
              <Bell size={18} />
              {usageTime > 7200 && <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>}
              {usageTime > 7200 && <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></span>}
            </button>
            
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white backdrop-blur-xl border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest">Peringatan Sistem</h3>
                </div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
                  {usageTime > 7200 ? (
                    <div className="p-3 bg-blue-50 border border-gray-200 rounded-lg">
                      <h4 className="text-sm font-bold text-blue-500 mb-1">Peringatan Kesehatan</h4>
                      <p className="text-xs text-gray-700">Anda telah menggunakan perangkat ini lebih dari 2 jam. Harap istirahatkan mata dan tubuh Anda sejenak untuk menjaga kesehatan.</p>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-gray-500 italic">Tidak ada peringatan. Waktu penggunaan: {Math.floor(usageTime / 60)} menit.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="relative hidden sm:block" ref={settingsDropdownRef}>
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`p-2 rounded-lg transition-colors ${isSettingsOpen ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600 hover:text-blue-600'}`}
            >
              <Settings size={18} className={isSettingsOpen ? 'animate-spin-slow' : ''} />
            </button>
            
            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white backdrop-blur-xl border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b border-gray-200 bg-blue-600/5">
                  <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest">System Settings</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700 font-medium">UI Animations</span>
                    <button 
                      onClick={() => setAnimationsEnabled(!animationsEnabled)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${animationsEnabled ? 'bg-blue-600' : 'bg-red-100'}`}
                    >
                      <span className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${animationsEnabled ? 'left-6' : 'left-1'}`}></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700 font-medium">Moving Gradients</span>
                    <button 
                      onClick={() => setGradientsEnabled(!gradientsEnabled)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${gradientsEnabled ? 'bg-blue-600' : 'bg-red-100'}`}
                    >
                      <span className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${gradientsEnabled ? 'left-6' : 'left-1'}`}></span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700 font-medium">Brightness</span>
                      <span className="text-[10px] text-blue-600 font-mono">{brightness}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="150" 
                      value={brightness} 
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full h-1 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700 font-medium">Fullscreen Mode</span>
                    <button 
                      onClick={toggleFullscreen}
                      className={`w-10 h-5 rounded-full transition-colors relative ${isFullscreen ? 'bg-blue-600' : 'bg-red-100'}`}
                    >
                      <span className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isFullscreen ? 'left-6' : 'left-1'}`}></span>
                    </button>
                  </div>
                  {deferredPrompt && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700 font-medium">Install App (IFP/Desktop)</span>
                      <button 
                        onClick={handleInstallClick}
                        className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-gray-200 rounded text-[10px] font-bold uppercase tracking-widest transition-colors"
                      >
                        Install
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700 font-medium">Clear Local Cache</span>
                    <button 
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                      className="px-3 py-1 bg-blue-50 text-blue-500 hover:bg-blue-600 hover:text-white border border-gray-200 rounded text-[10px] font-bold uppercase tracking-widest transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileDropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-full bg-blue-500 p-[1px] hover:scale-110 transition-transform focus:outline-none"
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {profile?.photoURL || user?.photoURL ? (
                  <img 
                    src={profile?.photoURL || user?.photoURL || ''} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <User size={16} className={user ? "text-blue-400" : "text-blue-600"} />
                )}
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white backdrop-blur-xl border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  {loading ? (
                    <div className="animate-pulse flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-50"></div>
                      <div className="space-y-2">
                        <div className="h-3 w-20 bg-red-50 rounded"></div>
                        <div className="h-2 w-16 bg-red-50 rounded"></div>
                      </div>
                    </div>
                  ) : user && profile ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5 shrink-0">
                        {profile.photoURL || user.photoURL ? (
                          <img 
                            src={profile.photoURL || user.photoURL || ''} 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover" 
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <div className="gen-card w-full h-full bg-red-50 rounded-full flex items-center justify-center text-blue-600">
                            <User size={24} />
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-sm font-bold text-black tracking-tight truncate">{profile.displayName || user.email}</div>
                        <div className="text-[10px] text-blue-600 font-mono uppercase mt-1 flex items-center gap-1">
                          <Shield size={10} /> ROLE: {profile.role?.toUpperCase() || 'SISWA'} | TIER: {profile.tier || 'Free'}
                        </div>
                        <div className="text-[10px] text-blue-300 font-mono uppercase mt-1 flex items-center gap-1">
                          <Coins size={10} /> TOKEN: {['owner', 'admin'].includes(profile.role?.toLowerCase()) || profile.tier?.toLowerCase() === 'titan' ? 'Unlimited' : profile.tokens !== undefined ? profile.tokens : '2 / hari'}
                        </div>
                        {['owner', 'admin'].includes(profile.role?.toLowerCase()) || profile.tier?.toLowerCase() === 'titan' ? (
                          <div className="mt-2 text-[10px] bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold uppercase tracking-widest px-2 py-1 rounded w-full flex justify-center items-center gap-1 cursor-default shadow-sm">
                            <Shield size={10} /> Akses Unlimited
                          </div>
                        ) : (
                          <button onClick={() => { handleTabChange('pricing'); setIsProfileOpen(false); }} className="mt-2 text-[10px] bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold uppercase tracking-widest px-2 py-1 rounded w-full flex justify-center items-center gap-1 hover:brightness-105 transition-all shadow-sm">
                            <Zap size={10} /> Upgrade Tier
                          </button>
                        )}
                        {['owner', 'admin'].includes(profile.role?.toLowerCase()) && (
                          <button onClick={() => { handleTabChange('admin-panel'); setIsProfileOpen(false); }} className="mt-2 text-[10px] bg-blue-600 text-white font-bold uppercase tracking-widest px-2 py-1 rounded w-full flex justify-center items-center gap-1 hover:bg-blue-700 transition-all shadow-sm">
                            <Shield size={10} /> Admin Dashboard
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2">
                      <User size={24} className="text-gray-500 mb-2" />
                      <span className="text-xs text-gray-600 mb-3">Guest User</span>
                      <button onClick={handleLogin} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 rounded-lg transition-colors text-xs font-bold uppercase tracking-widest">
                        <LogIn size={14} />
                        Login with Google
                      </button>
                    </div>
                  )}
                </div>
                
                {user && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-[10px] uppercase font-bold text-gray-500 flex justify-between items-center">
                      <span>System Access</span>
                      <span className="text-blue-400">GRANTED</span>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-700 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
