import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import Logo from '../Logo';

export interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  link?: string;
  premiumOnly?: boolean;
  disabled?: boolean;
  disabledMessage?: string;
  dropdown?: { id: string; icon: React.ReactNode; label: string; link?: string; premiumOnly?: boolean; disabled?: boolean; disabledMessage?: string }[];
}

export interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
  activeTab: string;
  visibleMenuItems: MenuItem[];
  handleTabChange: (id: string) => void;
  onDisabledClick: (id: string) => void;
}

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  visibleMenuItems,
  handleTabChange,
  onDisabledClick
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full z-50 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'
      }`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            {isSidebarOpen && (
              <div className="animate-in fade-in slide-in-from-left-2">
                <h1 className="text-lg font-bold text-blue-600 tracking-tighter">Pemuryadi Generator</h1>
                <p className="text-[8px] text-blue-500 uppercase tracking-widest font-bold">Co-Created with RuangRiung</p>
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

        <div className={`px-4 pt-4 pb-2 relative transition-all ${!isSidebarOpen ? 'flex justify-center' : ''}`} ref={searchDropdownRef}>
          {isSidebarOpen ? (
            <>
              <div className="relative w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Quick search..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-xs focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </div>
              {isSearchFocused && searchQuery && (
                <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 max-h-64 overflow-y-auto custom-scrollbar">
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
                          if (window.innerWidth < 768) setIsSidebarOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center gap-2 transition-colors"
                      >
                        <span className="text-gray-500">{typeof item.icon === 'string' ? item.icon : <Search size={14} />}</span>
                        <span className="text-xs text-gray-700">{item.label}</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-gray-500">No results found</div>
                  )}
                </div>
              )}
            </>
          ) : (
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors" title="Quick Search">
              <Search size={18} />
            </button>
          )}
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto flex-1 custom-scrollbar">
          {visibleMenuItems.map(item => (
            <div key={item.id}>
              <button
                title={item.disabled ? item.disabledMessage : (!isSidebarOpen ? item.label : undefined)}
                onClick={() => {
                  if (item.disabled) {
                    onDisabledClick(item.id);
                    return;
                  }
                  if (item.dropdown) {
                    const isOpening = activeDropdown !== item.id || !isSidebarOpen;
                    if (!isSidebarOpen) {
                      setIsSidebarOpen(true);
                    }
                    setActiveDropdown(isOpening ? item.id : null);
                    
                    // Hapus auto-navigate agar pengguna bebas memilih sub-menu tanpa tidak sengaja membuka fitur premium
                  } else {
                    handleTabChange(item.id);
                    setActiveDropdown(null);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all group relative ${
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed bg-gray-50/50 grayscale'
                    : activeTab === item.id || (item.dropdown && item.dropdown.some(d => d.id === activeTab))
                    ? 'bg-gray-100 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {/* Active Indicator Line */}
                {(activeTab === item.id || (item.dropdown && item.dropdown.some(d => d.id === activeTab))) && !item.disabled && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full" />
                )}
                
                <span className={`shrink-0 transition-transform ${!item.disabled && 'group-hover:scale-110'} ${
                  activeTab === item.id || (item.dropdown && item.dropdown.some(d => d.id === activeTab)) ? 'text-blue-600' : 'text-gray-500'
                }`}>{item.icon}</span>
                {isSidebarOpen && (
                  <span className="text-sm tracking-tight flex items-center flex-wrap gap-2 text-left">
                    {item.label} 
                    {item.premiumOnly && <span className="text-[8px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded uppercase">PRO</span>}
                    {item.disabled && <span className="text-[9px] bg-orange-100 text-orange-800 font-bold px-1.5 py-0.5 rounded">DEV</span>}
                  </span>
                )}
                {isSidebarOpen && item.dropdown && <ChevronDown size={14} className={`ml-auto transition-transform ${activeDropdown === item.id ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />}
              </button>

              {isSidebarOpen && item.dropdown && activeDropdown === item.id && (
                <div className="mt-1 ml-9 space-y-0.5 border-l-2 border-gray-100 pl-3 animate-in fade-in slide-in-from-top-2 py-1">
                  {item.dropdown.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        handleTabChange(sub.id);
                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-md transition-all flex items-center justify-between ${
                        activeTab === sub.id 
                          ? 'text-blue-700 font-semibold bg-blue-50/50' 
                          : 'text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span>{sub.label}</span>
                      {sub.premiumOnly && <span className="text-[8px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded uppercase ml-2">PRO</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 hidden md:flex items-center justify-center shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`flex items-center justify-center p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors ${isSidebarOpen ? 'w-full gap-3' : 'w-10 h-10'}`}
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isSidebarOpen ? (
              <>
                <PanelLeftClose size={20} />
                <span className="text-sm font-bold tracking-tight uppercase mr-auto">Collapse</span>
              </>
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
