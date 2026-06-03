import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Gamepad2, BookOpen, FileText, MonitorPlay, Shield, Map, Puzzle, Dices, Trophy, Search, Grid, Calendar, Calculator, ClipboardList, ClipboardCheck, Clipboard, BookMarked, BookText, Target, Tent, FileQuestion, Leaf, Smile, BarChart, Book, Library, Coins, MessageSquare, X, Share2 } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { loginWithGoogle, logout, incrementFavorites, addActivityLog } from './api';
import { useAuth } from './AuthContext';

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
import RankingSatu from './components/RankingSatu';
import Pricing from './components/Pricing';
import AdminPanel from './components/AdminPanel';

// Layout Components
import Sidebar, { MenuItem } from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Dashboard from './components/layout/Dashboard';
import DevModeModal from './components/layout/DevModeModal';
import PremiumLockModal from './components/layout/PremiumLockModal';
import LoginRequiredModal from './components/layout/LoginRequiredModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('beranda');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  
  const [visitors, setVisitors] = useState({ today: 0, month: 0, total: 0 });
  const [favorites, setFavorites] = useState(0);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [activityClicks, setActivityClicks] = useState<Record<string, number>>({});
  
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [gradientsEnabled, setGradientsEnabled] = useState(true);
  const [brightness, setBrightness] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [osName, setOsName] = useState('Unknown OS');
  const [browserName, setBrowserName] = useState('Unknown Browser');
  const [userAgentStr, setUserAgentStr] = useState('');
  const [ramInfo, setRamInfo] = useState('Unknown');
  const [usageTime, setUsageTime] = useState(0);
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDevUnlocked, setIsDevUnlocked] = useState(false);
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
  const visibleMenuItems = menuItems.filter(item => item.id !== 'snp' || isTitanOrAdmin);

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
    const intervalId = setInterval(fetchStats, 5000);

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

      {/* Main Content Area */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} pb-20 min-h-screen flex flex-col w-full md:w-auto`}>
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
            © 2026 <span className="text-black">Pemuryadi Generator</span> & RuangRiung. Cyber Education Workspace.
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
    </div>
  );
}
