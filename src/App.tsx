import React, { useState, useEffect, useRef } from 'react';
import { Heart, ChevronDown, LayoutDashboard, Users, Gamepad2, BookOpen, FileText, MonitorPlay, School, MessageSquare, Menu, X, Bell, Search, Settings, User, Activity, Zap, Globe, Shield, Cpu, Share2, LogIn, LogOut, Coins, Map, Puzzle, Dices, Trophy, Grid, Calendar, Calculator, ClipboardList, ClipboardCheck, Clipboard, BookMarked, BookText, Target, Tent, FileQuestion, Leaf, Smile, BarChart, Book, Library, Coffee, ShoppingCart } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { loginWithGoogle, logout, incrementFavorites, addActivityLog } from './api';
import { useAuth } from './AuthContext';
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
import FeedbackForm from './components/FeedbackForm';
import ModulKokurikuler from './components/ModulKokurikuler';
import GameIFP from './components/GameIFP';
import AdventureJourney from './components/AdventureJourney';
import KalenderPendidikan from './components/KalenderPendidikan';
import Logo from './components/Logo';
import AnalisisHariEfektif from './components/AnalisisHariEfektif';
import ProgramSemester from './components/ProgramSemester';
import ProgramTahunan from './components/ProgramTahunan';
import MengajarHarian from './components/MengajarHarian';
import KKTP from './components/KKTP';
import BuatSoal from './components/BuatSoal';
import QuickProfile from './components/QuickProfile';
import SNP from './components/SNP';
import RankingSatu from './components/RankingSatu';
import Pricing from './components/Pricing';
import AdminPanel from './components/AdminPanel';
import WelcomePopup from './components/WelcomePopup';
import { translations } from './constants';

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

export default function App() {
  const [activeTab, setActiveTab] = useState('beranda');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [language, setLanguage] = useState('id');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [visitors, setVisitors] = useState({ today: 0, month: 0, total: 0 });
  const [favorites, setFavorites] = useState(0);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [osName, setOsName] = useState('Unknown OS');
  const [browserName, setBrowserName] = useState('Unknown Browser');
  const [userAgentStr, setUserAgentStr] = useState('');
  const [ramInfo, setRamInfo] = useState('Unknown');
  const [usageTime, setUsageTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activityClicks, setActivityClicks] = useState<Record<string, number>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [brightness, setBrightness] = useState(100);
  const [gradientsEnabled, setGradientsEnabled] = useState(true);
  const [showTokenWarning, setShowTokenWarning] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
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

    return () => {
      clearInterval(interval);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('showFreeTokenWarning', handleShowWarning);
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
        alert('Fitur ini khusus untuk pengguna berbayar. Silakan upgrade akun Anda ke plan Essential, Premium, atau lainnya.');
        return;
      }
    }

    setActiveTab(tabId);
    trackClick(tabId);
    addActivityLog(`Navigated to ${tabId}`, 'OK', 'text-blue-500');
    incrementFavorites();
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
    setVisitors({
      today: Math.floor(Math.random() * 50) + 10,
      month: Math.floor(Math.random() * 500) + 100,
      total: Math.floor(Math.random() * 5000) + 1000
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const fetchStats = async () => {
      try {
        const resStats = await fetch('/api/stats');
        if (resStats.ok && mounted) {
          const data = await resStats.json();
          setFavorites(data.favorites || 0);
        }
        
        if (user) {
          const resLogs = await fetch('/api/logs');
          if (resLogs.ok && mounted) {
            const logs = await resLogs.json();
            setActivityLogs(logs);
          }
        }
      } catch (e) {
        console.error('API Error:', e);
      }
    };

    fetchStats();
    // Poll every 5 seconds instead of real-time websocket
    const intervalId = setInterval(fetchStats, 5000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const todayStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  const monthStr = new Date().toLocaleDateString('id-ID', { month: 'long' });

  type MenuItem = {
    id: string;
    icon: React.ReactNode;
    label: string;
    link?: string;
    premiumOnly?: boolean;
    dropdown?: { id: string; icon: React.ReactNode; label: string; link?: string; premiumOnly?: boolean }[];
  };

  const menuItems: MenuItem[] = [
    { id: 'beranda', icon: <LayoutDashboard size={20} />, label: 'Beranda' },
    { id: 'kelompok', icon: <Users size={20} />, label: 'Kelompok' },
    { 
      id: 'games', 
      icon: <Gamepad2 size={20} />, 
      label: 'Games',
      dropdown: [
        { id: 'adventure-journey', icon: <Map size={16} />, label: 'Adventure Journey', premiumOnly: true },
        { id: 'puzzle', icon: <Puzzle size={16} />, label: 'Puzzle Kata' },
        { id: 'snake', icon: <Dices size={16} />, label: 'Snake & Ladder', premiumOnly: true },
        { id: 'ranking-satu', icon: <Trophy size={16} />, label: 'Ranking #1', premiumOnly: true },
        { id: 'crossword', icon: <Grid size={16} />, label: 'Teka Teki Silang' }
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
        { id: 'supervisi', icon: <Search size={16} />, label: 'Supervisi' },
        { id: 'kktp', icon: <Target size={16} />, label: 'KKTP' },
        { id: 'modul-kokurikuler', icon: <Tent size={16} />, label: 'Modul Kokurikuler', premiumOnly: true },
        { id: 'buat-soal', icon: <FileQuestion size={16} />, label: 'Buat Soal', premiumOnly: true }
      ]
    },
    {
      id: 'snp',
      icon: <FileText size={20} />,
      label: 'SNP',
      dropdown: [
        { id: 'snp-adiwiyata', icon: <Leaf size={16} />, label: 'Adiwiyata' },
        { id: 'snp-sra', icon: <Smile size={16} />, label: 'Sekolah Ramah Anak' },
        { id: 'snp-ssk', icon: <Users size={16} />, label: 'Sekolah Siaga Kependudukan' },
        { id: 'snp-rapor', icon: <BarChart size={16} />, label: 'Rapor Pendidikan' },
        { id: 'snp-spmi', icon: <Book size={16} />, label: 'SPMI' },
        { id: 'snp-ksp', icon: <Library size={16} />, label: 'KSP' }
      ]
    },
    { id: 'worksheet', icon: <FileText size={20} />, label: 'Worksheet' },
    { id: 'game-ifp', icon: <MonitorPlay size={20} />, label: 'Game IFP' },
    { id: 'pricing', icon: <Coins size={20} className="text-amber-400" />, label: 'Langganan' }
  ];

  const userRole = (profile?.role || 'siswa').toLowerCase();
  if (userRole === 'owner' || userRole === 'admin') {
    menuItems.push({ id: 'admin-panel', icon: <Shield size={20} className="text-blue-600" />, label: 'Admin Dashboard' });
  }

  const isTitanOrAdmin = (profile?.tier || '').toLowerCase() === 'titan' || ['owner', 'admin'].includes(userRole);
  const visibleMenuItems = menuItems.filter(item => item.id !== 'snp' || isTitanOrAdmin);

  return (
    <div 
      className={`app-wrapper min-h-screen font-sans bg-gray-50 text-gray-900 overflow-x-hidden ${animationsEnabled ? '' : 'disable-animations'} ${gradientsEnabled ? '' : 'disable-gradients'}`}
      style={brightness !== 100 ? { filter: `brightness(${brightness}%)` } : undefined}
    >
      <WelcomePopup onComplete={(role) => handleTabChange('pricing')} />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-1000 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed top-0 left-0 h-full z-50 bg-white border-r border-gray-200 transition-all duration-300 ${
        isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'
      }`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            {isSidebarOpen && (
              <div className="animate-in fade-in slide-in-from-left-2">
                <h1 className="text-lg font-bold text-blue-600 tracking-tighter">Pendidikan Generator</h1>
                <p className="text-[8px] text-blue-500 uppercase tracking-widest font-bold">Featuring pemuryadi and RuangRiung</p>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100%-100px)] custom-scrollbar">
          {visibleMenuItems.map(item => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.dropdown) {
                    setActiveDropdown(activeDropdown === item.id ? null : item.id);
                  } else {
                    handleTabChange(item.id);
                    setActiveDropdown(null);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all group ${
                  activeTab === item.id || (item.dropdown && item.dropdown.some(d => d.id === activeTab))
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
                {isSidebarOpen && <span className="text-sm font-bold tracking-tight uppercase flex items-center gap-2">{item.label} {item.premiumOnly && <span className="text-[8px] bg-blue-100 text-black px-1 rounded">PRO</span>}</span>}
                {isSidebarOpen && item.dropdown && <ChevronDown size={14} className={`ml-auto transition-transform ${activeDropdown === item.id ? 'rotate-180' : ''}`} />}
              </button>

              {isSidebarOpen && item.dropdown && activeDropdown === item.id && (
                <div className="mt-2 ml-8 space-y-1 border-l border-gray-200 pl-4 animate-in fade-in slide-in-from-top-2">
                  {item.dropdown.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        handleTabChange(sub.id);
                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left p-2 text-xs font-medium rounded-md transition-all flex items-center justify-between ${
                        activeTab === sub.id ? 'text-white bg-blue-500' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <span>{sub.label}</span>
                      {sub.premiumOnly && <span className="text-[8px] bg-blue-100 text-black px-1 rounded ml-2">PRO</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-20 right-[-12px] w-6 h-6 bg-blue-600 rounded-full hidden md:flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform z-50"
        >
          {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} pb-20 min-h-screen flex flex-col w-full md:w-auto`}>
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between no-print w-full" style={{ willChange: 'transform' }}>
          <div className="flex items-center gap-3 md:hidden">
             <button onClick={() => setIsSidebarOpen(true)} className="text-blue-600 p-1">
               <Menu size={24} />
             </button>
             <Logo className="w-8 h-8" />
             <h1 className="text-sm font-bold text-blue-600">Pendidikan Generator</h1>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4 lg:mx-8 relative" ref={searchDropdownRef}>
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search modules, games, documents..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-gray-100 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-xs focus:border-blue-500 outline-none transition-all"
              />
            </div>
            {isSearchFocused && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 max-h-64 overflow-y-auto custom-scrollbar">
                 {visibleMenuItems.flatMap(item => [
                  item,
                  ...(item.dropdown || [])
                ]).filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                  visibleMenuItems.flatMap(item => [
                    item,
                    ...(item.dropdown || [])
                  ]).filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleTabChange(item.id);
                        setSearchQuery('');
                        setIsSearchFocused(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-0 flex items-center gap-3 transition-colors"
                    >
                      <span className="text-blue-600">{typeof item.icon === 'string' ? item.icon : <Search size={14} />}</span>
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">No results found</div>
                )}
              </div>
            )}
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

        {/* Dynamic Content */}
        <div className={`p-4 md:p-6 mx-auto w-full ${isFullscreen ? 'max-w-none px-6 md:px-12' : 'max-w-full lg:max-w-[95%] xl:max-w-[92%] 2xl:max-w-[1536px]'}`}>
          {activeTab === 'beranda' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                
                {/* Hero Dashboard Section */}
                <div className="bg-white border border-gray-200 shadow-sm p-8 rounded-2xl flex flex-col justify-center col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-3 h-full">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-gray-200 mb-6 w-max">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span> 
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">System Online</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter leading-none italic">
                    welcome to <span className="text-blue-600">the future education.</span>
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-auto mb-8">
                    <button onClick={() => handleTabChange('pricing')} className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors px-6 py-3 text-left w-max">
                      <div className="font-bold text-sm mb-1">Operation System: {osName} | RAM: {ramInfo}</div>
                      <div className="text-[9px] font-mono opacity-80 max-w-sm">USER AGENT: {userAgentStr}</div>
                    </button>
                    <button onClick={() => setIsChatOpen(true)} className="px-8 py-3 text-sm font-bold uppercase tracking-widest border border-gray-300 text-blue-500 hover:bg-blue-500 hover:text-white transition-all italic">
                      Consult AI Assistant
                    </button>
                  </div>
                </div>

                {/* Quick Profile */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1 flex items-stretch h-full">
                  <div className="w-full flex-1">
                    <QuickProfile />
                  </div>
                </div>

                {/* Traffic Analytics */}
                <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl flex flex-col h-full col-span-1 md:col-span-1 lg:col-span-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest">Traffic Analytics</h3>
                    <Activity size={16} className="text-blue-500" />
                  </div>
                  <div className="space-y-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Daily Access</span>
                      <span className="text-lg font-mono font-bold text-blue-600">{visitors.today}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full w-3/4 shadow-sm"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Monthly Load</span>
                      <span className="text-lg font-mono font-bold text-blue-500">{visitors.month}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden mb-4">
                      <div className="bg-blue-500 h-full w-1/2 shadow-sm"></div>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <Heart size={14} className="text-blue-300" />
                        <span className="text-xs text-gray-500">Favorites</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-mono font-bold text-blue-300">{favorites}</span>
                        <button onClick={incrementFavorites} className="p-1.5 rounded bg-blue-50 text-blue-300 hover:bg-blue-100 hover:text-white transition-colors" title="Favorite this app">
                          <Heart size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aktivitas Paling Sering Diklik */}
                <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl flex flex-col h-full col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-1">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 animate-pulse rounded-full"></div>
                      Aktivitas Paling Sering Diklik
                    </h3>
                  </div>
                  <div className="space-y-4 font-mono text-[10px] flex-1 overflow-y-auto">
                    {Object.entries(activityClicks).length > 0 ? (
                      Object.entries(activityClicks)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([activity, count], index) => {
                          const menuItem = menuItems.flatMap(item => [item, ...(item.dropdown || [])]).find(item => item.id === activity);
                          const label = menuItem ? menuItem.label : activity;
                          return (
                            <div key={activity} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-2 gap-1 sm:gap-4">
                              <div className="flex items-start sm:items-center gap-2 sm:gap-4 overflow-hidden">
                                <span className="text-slate-600 shrink-0">#{index + 1}</span>
                                <span className="text-gray-700 truncate sm:whitespace-normal sm:break-words">{label}</span>
                              </div>
                              <span className="text-blue-600 font-bold self-end sm:self-auto shrink-0">{count} klik</span>
                            </div>
                          );
                        })
                    ) : (
                      <div className="text-gray-500 italic">Belum ada aktivitas...</div>
                    )}
                  </div>
                </div>

                {/* Support Network */}
                <div className="bg-white border border-gray-200 shadow-sm p-6 lg:p-8 rounded-2xl flex flex-col justify-between bg-gradient-to-br from-blue-50 to-transparent hover:shadow-md transition-shadow h-full col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <div>
                      <h3 className="text-lg font-black italic text-blue-600 mb-3 uppercase tracking-tight flex items-center gap-2">
                         <Coffee size={20} /> Support Network
                      </h3>
                      <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                        Kontribusi Anda menjaga sistem ini tetap online dan gratis bagi seluruh pendidik. Mari wujudkan ekosistem pendidikan yang lebih baik.
                      </p>
                    </div>
                    <a href="https://saweria.co/pemuryadi" target="_blank" rel="noreferrer" className="inline-flex justify-center items-center gap-2 px-6 py-3 w-full bg-blue-100 text-blue-700 font-bold uppercase text-xs tracking-wider rounded-xl hover:scale-[1.02] transition-transform mt-auto">
                      Donate via Saweria
                    </a>
                </div>

                {/* Premium Assets */}
                <div className="bg-white border border-gray-200 shadow-sm p-6 lg:p-8 rounded-2xl flex flex-col justify-between bg-gradient-to-br from-red-50 to-transparent hover:shadow-md transition-shadow h-full col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-1">
                    <div>
                      <h3 className="text-lg font-black italic text-red-600 mb-3 uppercase tracking-tight flex items-center gap-2">
                         <ShoppingCart size={20} /> Premium Assets
                      </h3>
                      <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                        Dapatkan akses ke materi ajar eksklusif, template premium, dan sumber daya tingkat lanjut untuk kebutuhan mengajar kelas Anda.
                      </p>
                    </div>
                    <a href="https://lynk.id/pemuryadi" target="_blank" rel="noreferrer" className="inline-flex justify-center items-center gap-2 px-6 py-3 w-full bg-red-600 text-white font-bold uppercase text-xs tracking-wider rounded-xl hover:scale-[1.02] transition-transform shadow-sm mt-auto">
                      Buka Marketplace
                    </a>
                </div>

                {/* Feedback */}
                <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl flex flex-col justify-center h-full col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
                   <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                     <MessageSquare size={18} className="text-blue-600" /> Masukan & Saran
                   </h3>
                   <p className="text-xs text-gray-500 mb-4">Punya ide fitur atau kendala? Beritahu kami agar aplikasi ini terus berkembang!</p>
                   <FeedbackForm inline={true} />
                </div>

              </div>
            </div>
          )}

          {/* Generator Tabs Container */}
          <div className="transition-all duration-300 ease-in-out">
            {activeTab === 'kelompok' && <GroupGenerator />}
            {activeTab === 'adventure-journey' && <AdventureJourney />}
            {activeTab === 'puzzle' && <WordSearch />}
            {activeTab === 'snake' && <SnakeLadder />}
            {activeTab === 'ranking-satu' && <RankingSatu />}
            {activeTab === 'crossword' && <CrosswordGenerator />}
            {activeTab === 'supervisi' && <Supervision />}
            {activeTab === 'modul' && <ModuleGenerator />}
            {activeTab === 'mengajar-harian' && <MengajarHarian />}
            {activeTab === 'jurnal' && <DailyJournal />}
            {activeTab === 'deeplearning' && <DeepLearningPlan />}
            {activeTab === 'worksheet' && <WorksheetGenerator />}
            {activeTab === 'modul-kokurikuler' && <ModulKokurikuler />}
            {activeTab === 'buat-soal' && <BuatSoal />}
            {activeTab === 'kalender-pendidikan' && <KalenderPendidikan />}
            {activeTab === 'analisis-hari-efektif' && <AnalisisHariEfektif />}
            {activeTab === 'program-semester' && <ProgramSemester />}
            {activeTab === 'program-tahunan' && <ProgramTahunan />}
            {activeTab === 'kktp' && <KKTP />}
            {activeTab === 'game-ifp' && <GameIFP />}
            {activeTab.startsWith('snp-') && isTitanOrAdmin && <SNP subTab={activeTab} />}
            {activeTab === 'pricing' && <Pricing />}
            {activeTab === 'admin-panel' && <AdminPanel />}
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

      {/* Footer */}
      <footer className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} bg-white/40 border-t border-gray-100 py-8 px-6 no-print`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-blue-600/30"></div>
            <p className="text-xs font-mono text-blue-600 uppercase tracking-widest">System Version 5.1.6</p>
            <div className="h-[1px] w-12 bg-blue-600/30"></div>
          </div>
          <div className="flex justify-center gap-6 mb-4">
            <a href="/privacy-policy.html" target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-widest text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="/terms-of-service.html" target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-widest text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</a>
          </div>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">
            ©2026 <span className="text-black">PEMURYADI</span> - Cyber Education & RuangRiung
          </p>
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
    </div>
  );
}
