import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Gamepad2, BookOpen, FileText, MonitorPlay, Shield, Map, Puzzle, Dices, Trophy, Search, Grid, Calendar, Calculator, ClipboardList, ClipboardCheck, Clipboard, BookMarked, BookText, Target, Tent, FileQuestion, Leaf, Smile, BarChart, Book, Library, Coins, MessageSquare, X, Share2, History, QrCode } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { loginWithGoogle, logout, incrementFavorites, addActivityLog } from './api';
import { useAuth } from './AuthContext';
import changelogData from './data/changelog.json';
import { Toaster } from 'react-hot-toast';
// Feature Components
import GroupGenerator from './components/GroupGenerator';
import WordSearch from './components/WordSearch';
import SnakeLadder from './components/SnakeLadder';
import CrosswordGenerator from './components/CrosswordGenerator';
import Supervision from './components/Supervision';
import ModuleGenerator from './components/ModuleGenerator';
import DailyJournal from './components/DailyJournal';
import DeepLearningPlan from './components/DeepLearningPlan';
import Chatbot from './components/Chatbot';
import WorksheetGenerator from './components/WorksheetGenerator';
import ModulKokurikuler from './components/ModulKokurikuler';
import GameIFP from './components/GameIFP';
import AdventureJourney from './components/AdventureJourney';
import KalenderPendidikan from './components/KalenderPendidikan';
import AnalisisHariEfektif from './components/AnalisisHariEfektif';
import ProgramSemester from './components/ProgramSemester';
import ProgramTahunan from './components/ProgramTahunan';
import MengajarHarian from './components/MengajarHarian';
import KKTP from './components/KKTP';
import BuatSoal from './components/BuatSoal';
import SNP from './components/SNP';
import ModulP5 from './components/ModulP5';
import RubrikPenilaian from './components/RubrikPenilaian';
import RankingSatu from './components/RankingSatu';
import Pricing from './components/Pricing';
import AdminPanel from './components/AdminPanel';
import Changelog from './components/Changelog';
import BarcodeGenerator from './components/BarcodeGenerator';
import MaintenancePage from './components/MaintenancePage';
import MemoryMatrix from './components/MemoryMatrix';
import MatchingPairs from './components/MatchingPairs';
import FillBlanks from './components/FillBlanks';
import UnscrambleLetters from './components/UnscrambleLetters';
import GamesHub from './components/GamesHub';

import EvaluasiMutu from './components/EvaluasiMutu';
import Reports from './components/Reports';
import StrategicAdvisor from './components/StrategicAdvisor';
import LaporanKegiatan from './components/LaporanKegiatan';

// Layout Components
import Sidebar, { MenuItem } from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Dashboard from './components/layout/Dashboard';
import DevModeModal from './components/layout/DevModeModal';
import PremiumLockModal from './components/layout/PremiumLockModal';
import LoginRequiredModal from './components/layout/LoginRequiredModal';
import WelcomePopup from './components/WelcomePopup';
import SEOLandingPage from './components/SEOLandingPage';
import MainLandingPage from './components/MainLandingPage';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [isSlow, setIsSlow] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 99) return 99;
        const diff = 100 - p;
        const increment = Math.max(1, Math.floor(diff * 0.1));
        return p + increment;
      });
    }, 50);

    const slowTimer = setTimeout(() => setIsSlow(true), 6000);
    const errorTimer = setTimeout(() => setIsError(true), 15000);

    return () => {
      clearInterval(timer);
      clearTimeout(slowTimer);
      clearTimeout(errorTimer);
    };
  }, []);

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (isError) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Koneksi Terputus</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Gagal terhubung ke server. Periksa koneksi internet Anda atau coba lagi nanti.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="text-blue-500 transition-all duration-100 ease-out" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white">{progress}</span>
            <span className="text-[10px] font-bold text-blue-400 -mt-1">%</span>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-white tracking-widest uppercase mb-2">Memuat Sistem</h2>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          {isSlow && (
            <p className="text-amber-500/80 text-xs animate-pulse max-w-[250px]">
              Koneksi internet lambat atau server sedang memproses. Mohon tunggu sebentar...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.substring(1);
      if (path && !path.startsWith('kota/') && !path.startsWith('sekolah/')) {
        return path;
      }
      const saved = localStorage.getItem('pemuryadi_activeTab');
      if (saved) return saved;
    }
    return 'beranda';
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 1024) return false;
      const saved = localStorage.getItem('pemuryadi_isSidebarOpen');
      if (saved !== null) return saved === 'true';
      return true;
    }
    return true;
  });
  const [isSeoLanding, setIsSeoLanding] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path.startsWith('/kota/') || path.startsWith('/sekolah/');
    }
    return false;
  });
  const [hasEnteredApp, setHasEnteredApp] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pemuryadi_hasEnteredApp');
      return saved === 'true';
    }
    return false;
  });
  
  const [visitors, setVisitors] = useState({ today: 0, month: 0, total: 0 });
  const [favorites, setFavorites] = useState(0);
  const [activityClicks, setActivityClicks] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pemuryadi_activityClicks');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse activityClicks from localStorage', e);
        }
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('pemuryadi_activityClicks', JSON.stringify(activityClicks));
  }, [activityClicks]);
  
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pemuryadi_animationsEnabled');
      if (saved !== null) return saved === 'true';
    }
    return true;
  });
  const [gradientsEnabled, setGradientsEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pemuryadi_gradientsEnabled');
      if (saved !== null) return saved === 'true';
    }
    return true;
  });
  const [brightness, setBrightness] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pemuryadi_brightness');
      if (saved) return parseInt(saved, 10);
    }
    return 100;
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [osName, setOsName] = useState('Unknown OS');
  const [browserName, setBrowserName] = useState('Unknown Browser');
  const [userAgentStr, setUserAgentStr] = useState('');
  const [ramInfo, setRamInfo] = useState('Unknown');
  const [usageTime, setUsageTime] = useState(0);
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDevUnlocked, setIsDevUnlocked] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pemuryadi_isDevUnlocked');
      if (saved !== null) return saved === 'true';
    }
    return false;
  });

  const [globalAnnouncement, setGlobalAnnouncement] = useState('');
  const [maintenanceActive, setMaintenanceActive] = useState(false);
  const [maintenanceEndTime, setMaintenanceEndTime] = useState('');
  const [maintenanceReason, setMaintenanceReason] = useState('');
  const [waNumber, setWaNumber] = useState('');
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);

  useEffect(() => { localStorage.setItem('pemuryadi_activeTab', activeTab); }, [activeTab]);
  useEffect(() => { localStorage.setItem('pemuryadi_isSidebarOpen', String(isSidebarOpen)); }, [isSidebarOpen]);
  useEffect(() => { localStorage.setItem('pemuryadi_animationsEnabled', String(animationsEnabled)); }, [animationsEnabled]);
  useEffect(() => { localStorage.setItem('pemuryadi_gradientsEnabled', String(gradientsEnabled)); }, [gradientsEnabled]);
  
  // Path sync for SEO-friendly URL slugs
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.substring(1);
      if (path && !path.startsWith('kota/') && !path.startsWith('sekolah/')) {
        setActiveTab(path);
      } else if (!path) {
        setActiveTab('beranda');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  useEffect(() => { localStorage.setItem('pemuryadi_brightness', String(brightness)); }, [brightness]);
  useEffect(() => { localStorage.setItem('pemuryadi_isDevUnlocked', String(isDevUnlocked)); }, [isDevUnlocked]);
  const [devPromptTarget, setDevPromptTarget] = useState<string | null>(null);
  const [showTokenWarning, setShowTokenWarning] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const { user, profile, loading } = useAuth();


  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    setUserAgentStr(userAgent);
    
    let os = 'Unknown OS';
    if (userAgent.indexOf('Win') !== -1) os = 'Windows';
    if (userAgent.indexOf('Mac') !== -1) os = 'MacOS';
    if (userAgent.indexOf('Linux') !== -1) os = 'Linux';
    if (userAgent.indexOf('Android') !== -1) os = 'Android';
    if (userAgent.indexOf('like Mac') !== -1) os = 'iOS';
    setOsName(os);
    
    let browser = 'Unknown Browser';
    if (userAgent.indexOf("Firefox") > -1) browser = "Mozilla Firefox";
    else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) browser = "Opera";
    else if (userAgent.indexOf("Trident") > -1) browser = "Internet Explorer";
    else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1) browser = "Microsoft Edge";
    else if (userAgent.indexOf("Chrome") > -1) browser = "Google Chrome";
    else if (userAgent.indexOf("Safari") > -1) browser = "Apple Safari";
    setBrowserName(browser);
    
    const ram = (navigator as any).deviceMemory;
    if (ram) {
      setRamInfo(`${ram} GB`);
    }

    const interval = setInterval(() => {
      setUsageTime(prev => prev + 1);
    }, 1000);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    let warningTimeout: any;
    const handleShowWarning = () => {
      setShowTokenWarning(false);
      setTimeout(() => {
        setShowTokenWarning(true);
        clearTimeout(warningTimeout);
        warningTimeout = setTimeout(() => {
          setShowTokenWarning(false);
        }, 5000);
      }, 50);
    };
    window.addEventListener('showFreeTokenWarning', handleShowWarning);

    const handleShowLoginModal = () => setIsLoginRequiredOpen(true);
    window.addEventListener('showLoginModal', handleShowLoginModal);

    return () => {
      clearInterval(interval);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('showFreeTokenWarning', handleShowWarning);
      window.removeEventListener('showLoginModal', handleShowLoginModal);
      clearTimeout(warningTimeout);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const trackClick = (activityName: string) => {
    setActivityClicks(prev => ({
      ...prev,
      [activityName]: (prev[activityName] || 0) + 1
    }));
  };

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      addActivityLog('User logged in', 'SUCCESS', 'text-blue-400');
      incrementFavorites();
    } catch (error) {
      addActivityLog('Login failed', 'ERROR', 'text-blue-600');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      addActivityLog('User logged out', 'INFO', 'text-blue-600');
    } catch (error) {
      addActivityLog('Logout failed', 'ERROR', 'text-blue-600');
    }
  };

  const menuItems: MenuItem[] = [
    { id: 'beranda', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'kelompok', icon: <Users size={20} />, label: 'Kelompok' },
    { 
      id: 'games', 
      icon: <Gamepad2 size={20} />, 
      label: 'Games',
      dropdown: [
        { id: 'adventure-journey', icon: <Map size={16} />, label: 'Adventure Journey', premiumOnly: true },
        { id: 'snake', icon: <Dices size={16} />, label: 'Snake & Ladder', premiumOnly: true },
        { id: 'ranking-satu', icon: <Trophy size={16} />, label: 'Ranking #1', premiumOnly: true },
        { id: 'games-hub', icon: <Gamepad2 size={16} />, label: 'Games Center' }
      ]
    },
    { 
      id: 'admin', 
      icon: <BookOpen size={20} />, 
      label: 'Administrasi',
      dropdown: [
        { id: 'mengajar-harian', icon: <Clipboard size={16} />, label: 'Mengajar Harian' },
        { id: 'kalender-pendidikan', icon: <Calendar size={16} />, label: 'Kalender Pendidikan' },
        { id: 'analisis-hari-efektif', icon: <Calculator size={16} />, label: 'Analisis Hari Efektif' },
        { id: 'program-tahunan', icon: <ClipboardList size={16} />, label: 'Program Tahunan', premiumOnly: true },
        { id: 'program-semester', icon: <ClipboardCheck size={16} />, label: 'Program Semester', premiumOnly: true },
        { id: 'deeplearning', icon: <Clipboard size={16} />, label: 'RPM', premiumOnly: true },
        { id: 'modul', icon: <BookMarked size={16} />, label: 'Modul Ajar', premiumOnly: true },
        { id: 'jurnal', icon: <BookText size={16} />, label: 'Jurnal' },
        { id: 'modul-p5', icon: <BookMarked size={16} />, label: 'Modul P5', isBeta: true },
        { id: 'supervisi', icon: <Search size={16} />, label: 'Supervisi' },
        { id: 'kktp', icon: <Target size={16} />, label: 'KKTP' },
        { id: 'rubrik-penilaian', icon: <ClipboardCheck size={16} />, label: 'Rubrik Penilaian', isBeta: true },
        { id: 'modul-kokurikuler', icon: <Tent size={16} />, label: 'Modul Kokurikuler', premiumOnly: true },
        { id: 'buat-soal', icon: <FileQuestion size={16} />, label: 'Buat Soal', premiumOnly: true },
        { id: 'laporan-kegiatan', icon: <FileText size={16} />, label: 'Laporan Kegiatan', premiumOnly: true }
      ]
    },
    {
      id: 'kurikulum-evaluasi',
      icon: <Library size={20} />,
      label: 'Kurikulum & Evaluasi',
      titanOnly: true,
      dropdown: [
        { id: 'snp-ksp', icon: <Library size={16} />, label: 'KSP', titanOnly: true },
        { id: 'evaluasi-mutu', icon: <BarChart size={16} />, label: 'Evaluasi Mutu' },
        { id: 'snp-rapor', icon: <BarChart size={16} />, label: 'Rapor Pendidikan', titanOnly: true }
      ]
    },
    {
      id: 'manajemen-sekolah',
      icon: <FileText size={20} />,
      label: 'Manajemen Sekolah',
      titanOnly: true,
      dropdown: [
        { id: 'snp-spmi', icon: <Book size={16} />, label: 'SPMI', titanOnly: true },
        { id: 'snp-adiwiyata', icon: <Leaf size={16} />, label: 'Program Adiwiyata', titanOnly: true },
        { id: 'snp-sra', icon: <Smile size={16} />, label: 'Sekolah Ramah Anak', titanOnly: true },
        { id: 'snp-ssk', icon: <Users size={16} />, label: 'Sekolah Siaga Kependudukan', titanOnly: true },
        { id: 'reports', icon: <ClipboardList size={16} />, label: 'Laporan Mutu', premiumOnly: true },
        { id: 'strategic-advisor', icon: <Target size={16} />, label: 'Penasihat Strategis', premiumOnly: true }
      ]
    },
    { id: 'worksheet', icon: <FileText size={20} />, label: 'Worksheet' },
    { id: 'barcode-generator', icon: <QrCode size={20} />, label: 'Generator Barcode' },
    { 
      id: 'game-ifp', 
      icon: <MonitorPlay size={20} />, 
      label: 'Game IFP',
      disabled: !isDevUnlocked,
      disabledMessage: 'Fitur ini masih dalam tahap pengembangan 🚧 (Terkunci)'
    },
    { id: 'pricing', icon: <Coins size={20} className="text-amber-400" />, label: 'Langganan' }
  ];

  const userRole = (profile?.role || 'siswa').toLowerCase();
  if (userRole === 'owner' || userRole === 'admin') {
    menuItems.push({ id: 'admin-panel', icon: <Shield size={20} className="text-blue-600" />, label: 'Admin Dashboard' });
  }

  const isTitanOrAdmin = (profile?.tier || '').toLowerCase() === 'titan' || ['owner', 'admin'].includes(userRole);
  const visibleMenuItems = menuItems
    .filter(item => !item.titanOnly || isTitanOrAdmin)
    .map(item => {
      if (item.dropdown) {
        return {
          ...item,
          dropdown: item.dropdown.filter(sub => !sub.titanOnly || isTitanOrAdmin)
        };
      }
      return item;
    });

  const handleTabChange = (tabId: string) => {
    // Check if the tab is premium only
    let isPremiumTab = false;
    for (const item of menuItems) {
      if (item.id === tabId && item.premiumOnly) isPremiumTab = true;
      if (item.dropdown) {
        for (const sub of item.dropdown) {
          if (sub.id === tabId && (sub.premiumOnly || item.premiumOnly)) isPremiumTab = true;
        }
      }
    }

    if (isPremiumTab) {
      const tier = (profile?.tier || 'Free').toLowerCase();
      const role = (profile?.role || 'siswa').toLowerCase();
      const isPrivileged = tier === 'titan' || role === 'owner' || role === 'admin';
      
      if (!isPrivileged && (tier === 'free' || tier === 'guest')) {
        setIsPremiumModalOpen(true);
        return;
      }
    }

    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/${tabId}`);
    }
    trackClick(tabId);
    addActivityLog(`Navigated to ${tabId}`, 'OK', 'text-blue-500');
    incrementFavorites();
    
    // Auto scroll ke atas dengan animasi yang mulus
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const todayVis = Math.floor(Math.random() * 50) + 10;
    const monthVis = Math.floor(Math.random() * 500) + 100;
    const totalVis = Math.floor(Math.random() * 5000) + 1000;

    setVisitors({
      today: todayVis,
      month: monthVis,
      total: totalVis
    });

    const popularActivities = [
      'modul', 'mengajar-harian', 'jurnal', 'kktp', 'buat-soal', 
      'supervisi', 'crossword', 'puzzle', 'kelompok', 'worksheet',
      'program-semester', 'program-tahunan', 'kalender-pendidikan',
      'analisis-hari-efektif', 'ranking-satu', 'snake'
    ];
    
    const simulatedClicks: Record<string, number> = {};
    const shuffled = [...popularActivities].sort(() => 0.5 - Math.random());
    const numActivities = 6;
    
    let currentMax = Math.floor(totalVis * (0.15 + Math.random() * 0.15));
    
    for (let i = 0; i < numActivities; i++) {
      simulatedClicks[shuffled[i]] = currentMax;
      currentMax = Math.floor(currentMax * (0.6 + Math.random() * 0.25));
    }
    
    setActivityClicks(simulatedClicks);
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const fetchStats = async () => {
      try {
        const resStats = await fetch('/api/stats');
        if (resStats.ok && mounted) {
          const data = (await resStats.json()) as any;
          setFavorites(data.favorites || 0);
        }
      } catch (e) {
        console.error('API Error:', e);
      }
    };

    fetchStats();
    const intervalId = setInterval(fetchStats, 5000);

    const fetchGlobalSettings = async () => {
      try {
        const res1 = await fetch('/api/settings/global_announcement');
        if (res1.ok) { const data = await res1.json() as any; if (data.value) setGlobalAnnouncement(data.value); }
        
        const res2 = await fetch('/api/settings/maintenance_active');
        if (res2.ok) { const data = await res2.json() as any; setMaintenanceActive(data.value === 'true'); }

        const res3 = await fetch('/api/settings/maintenance_end_time');
        if (res3.ok) { const data = await res3.json() as any; if (data.value) setMaintenanceEndTime(data.value); }

        const res3b = await fetch('/api/settings/maintenance_reason');
        if (res3b.ok) { const data = await res3b.json() as any; if (data.value) setMaintenanceReason(data.value); }

        const res4 = await fetch('/api/settings/whatsapp_admin_number');
        if (res4.ok) { const data = await res4.json() as any; if (data.value) setWaNumber(data.value); }
      } catch(e) {
        console.error("Failed to fetch settings", e);
      } finally {
        setIsSettingsLoading(false);
      }
    };
    fetchGlobalSettings();

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [user]);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12' || e.keyCode === 123) e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (loading || isSettingsLoading) {
    return <LoadingScreen />;
  }

  // Check if the URL contains a secret bypass parameter to prevent admin lockouts if cookies are cleared
  const isMaintenanceBypass = typeof window !== 'undefined' && window.location.search.includes('bypass=admin');

  if (maintenanceActive && !isMaintenanceBypass && profile?.role !== 'admin' && profile?.role !== 'owner') {
    return <MaintenancePage endTime={maintenanceEndTime} waNumber={waNumber} reason={maintenanceReason} />;
  }

  if (isSeoLanding) {
    return (
      <SEOLandingPage 
        onEnterApp={(tab?: string) => {
          setIsSeoLanding(false);
          setHasEnteredApp(true);
          localStorage.setItem('pemuryadi_hasEnteredApp', 'true');
          if (tab) setActiveTab(tab);
        }}
      />
    );
  }

  if (!hasEnteredApp && !user && window.location.pathname === '/') {
    return (
      <MainLandingPage 
        onEnterApp={() => {
          setHasEnteredApp(true);
          localStorage.setItem('pemuryadi_hasEnteredApp', 'true');
        }}
      />
    );
  }


  return (
    <div 
      className={`app-wrapper min-h-screen font-sans bg-gray-50 text-gray-900 overflow-x-hidden ${animationsEnabled ? '' : 'disable-animations'} ${gradientsEnabled ? '' : 'disable-gradients'}`}
      style={brightness !== 100 ? { filter: `brightness(${brightness}%)` } : undefined}
    >
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        visibleMenuItems={visibleMenuItems}
        handleTabChange={handleTabChange}
        onDisabledClick={(id) => setDevPromptTarget(id)}
      />

      <main className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} pb-20 min-h-screen flex flex-col w-full md:w-auto`}>
        {globalAnnouncement && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 text-center text-xs sm:text-sm font-bold shadow-md z-40 relative flex justify-between items-center">
            <div className="flex-1"></div>
            <div className="flex-1 flex justify-center items-center gap-2">
              <span className="animate-pulse">📢</span>
              <span>{globalAnnouncement}</span>
            </div>
            <div className="flex-1 flex justify-end">
              <button onClick={() => setGlobalAnnouncement('')} className="text-white/80 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>
        )}
        <Topbar 
          setIsSidebarOpen={setIsSidebarOpen}
          usageTime={usageTime}
          brightness={brightness}
          setBrightness={setBrightness}
          animationsEnabled={animationsEnabled}
          setAnimationsEnabled={setAnimationsEnabled}
          gradientsEnabled={gradientsEnabled}
          setGradientsEnabled={setGradientsEnabled}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          deferredPrompt={deferredPrompt}
          handleInstallClick={handleInstallClick}
          user={user}
          profile={profile}
          loading={loading}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          handleTabChange={handleTabChange}
          activeTab={activeTab}
          menuItems={menuItems}
        />

        {/* Dynamic Content */}
        <div className={`p-4 md:p-6 mx-auto w-full ${isFullscreen ? 'max-w-none px-6 md:px-12' : 'max-w-full lg:max-w-[95%] xl:max-w-[92%] 2xl:max-w-[1536px]'}`}>
          {activeTab === 'beranda' && (
            <Dashboard 
              osName={osName}
              ramInfo={ramInfo}
              userAgentStr={userAgentStr}
              visitors={visitors}
              favorites={favorites}
              activityClicks={activityClicks}
              menuItems={menuItems}
              onTabChange={handleTabChange}
              onOpenChat={() => setIsChatOpen(true)}
              onIncrementFavorites={() => {
                incrementFavorites();
                setFavorites(prev => prev + 1);
              }}
            />
          )}

          {/* Generator Tabs Container */}
          <div className="transition-all duration-300 ease-in-out">
            {activeTab === 'kelompok' && <GroupGenerator />}
            {activeTab === 'adventure-journey' && <AdventureJourney />}
            {activeTab === 'snake' && <SnakeLadder />}
            {activeTab === 'ranking-satu' && <RankingSatu />}
            {activeTab === 'games-hub' && <GamesHub />}
            {activeTab === 'supervisi' && <Supervision />}
            {activeTab === 'modul' && <ModuleGenerator />}
            {activeTab === 'mengajar-harian' && <MengajarHarian />}
            {activeTab === 'jurnal' && <DailyJournal />}
            {activeTab === 'deeplearning' && <DeepLearningPlan />}
            {activeTab === 'worksheet' && <WorksheetGenerator />}
            {activeTab === 'modul-kokurikuler' && <ModulKokurikuler />}
            {activeTab === 'modul-p5' && <ModulP5 />}
            {activeTab === 'rubrik-penilaian' && <RubrikPenilaian />}
            {activeTab === 'buat-soal' && <BuatSoal />}
            {activeTab === 'laporan-kegiatan' && <LaporanKegiatan />}
            {activeTab === 'evaluasi-mutu' && <EvaluasiMutu />}
            {activeTab === 'reports' && <Reports />}
            {activeTab === 'strategic-advisor' && <StrategicAdvisor />}
            {activeTab === 'kalender-pendidikan' && <KalenderPendidikan />}
            {activeTab === 'analisis-hari-efektif' && <AnalisisHariEfektif />}
            {activeTab === 'program-semester' && <ProgramSemester />}
            {activeTab === 'program-tahunan' && <ProgramTahunan />}
            {activeTab === 'kktp' && <KKTP />}
            {activeTab === 'barcode-generator' && <BarcodeGenerator />}
            {activeTab === 'game-ifp' && <GameIFP />}
            {activeTab.startsWith('snp-') && isTitanOrAdmin && <SNP subTab={activeTab} />}
            {activeTab === 'pricing' && <Pricing />}
            {activeTab === 'admin-panel' && <AdminPanel />}
            {activeTab === 'changelog' && <Changelog />}
          </div>
        </div>
      </main>

      {/* Social Floating Bar */}      
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className={`absolute top-0 -left-1/4 w-1/2 h-1/2 rounded-full transition-opacity duration-1000 ${gradientsEnabled ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'radial-gradient(circle, rgba(188, 0, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)' }}></div>
        <div className={`absolute bottom-0 -right-1/4 w-1/2 h-1/2 rounded-full transition-opacity duration-1000 ${gradientsEnabled ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'radial-gradient(circle, rgba(0, 243, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)' }}></div>
      </div>
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 no-print items-center animate-float">
        <div className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${isSocialOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'}`}>
          <a href="https://www.facebook.com/p.e.muryadi" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform">
            <FaFacebook size={18} />
          </a>
          <a href="https://www.instagram.com/p.e.muryadi" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform">
            <FaInstagram size={18} />
          </a>
          <a href="https://www.tiktok.com/@p.e.muryadi" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white border border-white/20 flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform">
            <FaTiktok size={18} />
          </a>
        </div>
        
        <button 
          onClick={() => setIsSocialOpen(!isSocialOpen)} 
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all ${isSocialOpen ? 'bg-red-100 text-black' : 'bg-gray-200 text-gray-700 backdrop-blur-md border border-white/20'}`}
          title="Toggle Social Media"
        >
          {isSocialOpen ? <X size={18} /> : <Share2 size={18} />}
        </button>

        <button onClick={() => setIsChatOpen(true)} className="w-12 h-12 mt-2 rounded-full bg-blue-600 text-black flex items-center justify-center shadow-sm hover:scale-110 transition-transform pulse-glow">
          <MessageSquare size={24} />
        </button>
      </div>

      {/* Chatbot Overlay */}
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Toaster for modern notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 'bold',
          },
          success: {
            style: {
              background: '#059669',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#059669',
            },
          },
          error: {
            style: {
              background: '#DC2626',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#DC2626',
            },
          },
        }}
      />

      {/* Footer */}
      <footer className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} bg-white/40 border-t border-gray-100 py-8 px-6 no-print`}>
        <div className="max-w-5xl mx-auto text-center">
          {/* Brand Logos / Global Partners */}
          <div className="text-center space-y-2 mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Global Partners & Tech Support</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Didukung oleh ekosistem teknologi AI terbaik di dunia</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700 mb-10">
            <div title="nanobanana" className="flex items-center gap-2"><img src="/asset/nanobanana.svg" className="h-5" alt="Nanobanana" /><span className="font-bold text-[10px] text-gray-700">Nanobanana</span></div>
            <div title="Meta" className="flex items-center gap-2"><img src="/asset/meta.svg" className="h-4" alt="Meta" /><span className="font-bold text-[10px] text-gray-700">Meta</span></div>
            <div title="YouTube" className="flex items-center gap-2"><img src="/asset/yt-favicon.svg" className="h-5" alt="YouTube" /><span className="font-bold text-[10px] text-gray-700">YouTube</span></div>
            <div title="Google AdSense" className="flex items-center gap-2"><img src="/asset/googleadsense.svg" className="h-5" alt="Google AdSense" /><span className="font-bold text-[10px] text-gray-700">AdSense</span></div>
            <div title="Cloudflare" className="flex items-center"><img src="/asset/logo-cloudflare-dark.svg" className="h-4" alt="Cloudflare" /></div>
            <div title="Google" className="flex items-center gap-2"><img src="/asset/google-icon.svg" className="h-4" alt="Google" /><span className="font-bold text-[10px] text-gray-700">Google</span></div>
            <div title="Google Cloud" className="flex items-center gap-2"><img src="/asset/gcp.svg" className="h-4.5" alt="Google Cloud" /><span className="font-bold text-[10px] text-gray-700">GCP</span></div>
            <div title="GitHub" className="flex items-center gap-2"><img src="/asset/github.svg" className="h-5" alt="GitHub" /><span className="font-bold text-[10px] text-gray-700">GitHub</span></div>
            <div title="Antigravity" className="flex items-center gap-2"><img src="/asset/antigravity.svg" className="h-6" alt="Antigravity" /><span className="font-bold text-[10px] text-gray-700">Antigravity</span></div>
            <div title="DeepSeek" className="flex items-center"><img src="/asset/deepseek.svg" className="h-6" alt="DeepSeek" /></div>
            <div title="Gemini" className="flex items-center gap-2"><img src="/asset/gemini.svg" className="h-6" alt="Gemini" /><span className="font-bold text-[10px] text-gray-700">Gemini</span></div>
            <div title="OpenAI" className="flex items-center"><img src="/asset/openai.svg" className="h-6" alt="OpenAI" /></div>
            <div title="Grok" className="flex items-center"><img src="/asset/grok.svg" className="h-5" alt="Grok" /></div>
            <div title="Pollinations AI" className="flex items-center gap-2"><img src="/asset/pollinations.svg" className="h-6" alt="Pollinations" /><span className="font-bold text-[10px] text-gray-700">Pollinations</span></div>
            <div title="Node.js" className="flex items-center"><img src="/asset/nodejs.svg" className="h-5" alt="Node.js" /></div>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-blue-600/30"></div>
            <button onClick={() => handleTabChange('changelog')} className="text-center group flex flex-col items-center">
              <p className="text-xs font-mono text-blue-600 uppercase tracking-widest group-hover:underline">System Version {changelogData[0].version}</p>
              <p className="text-[9px] text-gray-400 group-hover:text-blue-500 transition-colors mt-1 uppercase tracking-widest">Lihat Riwayat Versi</p>
            </button>
            <div className="h-[1px] w-12 bg-blue-600/30"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-500 font-medium">
            <button onClick={() => {
              setHasEnteredApp(false);
              localStorage.setItem('pemuryadi_hasEnteredApp', 'false');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} className="hover:text-black transition-colors">Beranda</button>
            <a href="/about.html" className="hover:text-black transition-colors">Tentang Kami</a>
            <a href="/privacy-policy.html" className="hover:text-black transition-colors" target="_blank" rel="noreferrer">Kebijakan Privasi</a>
            <a href="/terms-of-service.html" className="hover:text-black transition-colors" target="_blank" rel="noreferrer">Syarat & Ketentuan</a>
          </div>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold text-center mb-6">
            © 2026 <span className="text-black">Pemuryadi Generator</span> & RuangRiung. Cyber Education Workspace.
          </p>
          <div className="flex justify-center mt-6">
            <img 
              src="/Pemuryadi_QRCode.png" 
              alt="QR Code Pemuryadi Generator" 
              className="w-24 h-24 object-contain rounded-lg shadow-sm border border-gray-200 bg-white p-1 hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      </footer>

      {/* Floating Free Token Warning Notification */}
      {showTokenWarning && (
        <div className="fixed bottom-24 right-6 bg-gradient-to-r from-amber-500 to-orange-500 border border-amber-600 text-black px-5 py-4 rounded-2xl shadow-2xl z-50 max-w-sm animate-in slide-in-from-bottom duration-300 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-xs font-black uppercase tracking-wider">Pemberitahuan Token</p>
            <p className="text-xs font-semibold">generate ini memakan token harian anda</p>
          </div>
          <button onClick={() => setShowTokenWarning(false)} className="text-black/60 hover:text-black font-bold text-xs ml-2">
            ✖
          </button>
        </div>
      )}

      <DevModeModal 
        target={devPromptTarget}
        onClose={() => setDevPromptTarget(null)}
        onSuccess={(target) => {
          setIsDevUnlocked(true);
          setDevPromptTarget(null);
          handleTabChange(target);
          if (window.innerWidth < 768) setIsSidebarOpen(false);
        }}
      />
      
      <PremiumLockModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        onUpgrade={() => {
          setIsPremiumModalOpen(false);
          setActiveTab('pricing');
        }} 
      />
      
      <LoginRequiredModal 
        isOpen={isLoginRequiredOpen}
        onClose={() => setIsLoginRequiredOpen(false)}
      />

      <WelcomePopup 
        onComplete={(role) => console.log('Welcome completed', role)} 
        onNavigateToPricing={() => handleTabChange('pricing')}
      />
    </div>
  );
}
