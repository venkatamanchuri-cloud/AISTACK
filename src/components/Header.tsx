import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  RotateCw,
  Globe,
  SlidersHorizontal,
  FileText,
  AlertTriangle,
  Sparkles,
  Layers,
  Building2,
  Bell,
  Sun,
  Moon,
  BookOpen,
} from 'lucide-react';
import { LocationInfo } from '../types';
import { GLOBAL_HUBS } from '../data/mockEnterpriseData';

interface HeaderProps {
  currentLocation: LocationInfo;
  onSelectLocation: (loc: LocationInfo) => void;
  onGeolocate: () => void;
  isCelsius: boolean;
  onToggleUnit: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  onOpenExportModal: () => void;
  onOpenDocsModal: () => void;
  activeAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  onGeolocate,
  isCelsius,
  onToggleUnit,
  activeTab,
  onTabChange,
  onRefresh,
  isLoading,
  onOpenExportModal,
  onOpenDocsModal,
  activeAlertsCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Debounced search via backend geocode API
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/weather/geocode?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch (err) {
        console.error('Search geocode error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectResult = (loc: LocationInfo) => {
    onSelectLocation(loc);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-slate-950 italic text-lg shadow-md shadow-sky-500/20">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight uppercase text-white">
                  AETHER INTEL <span className="text-sky-500">v4.2</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full hidden sm:inline-block">
                  SYSTEM_STABLE
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden md:block">Enterprise Meteorological Radar</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="SEARCH STATION, FACILITY, AIRPORT OR REGION..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full pl-10 pr-10 py-2 text-xs font-mono bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition"
              />
              {isSearching ? (
                <RotateCw className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400 animate-spin" />
              ) : searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono uppercase text-slate-400 hover:text-white px-1.5 py-0.5"
                >
                  Clear
                </button>
              ) : null}
            </div>

            {/* Search Dropdown */}
            {showSearchResults && (searchQuery.length >= 2 || searchResults.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
                {searchResults.length > 0 ? (
                  searchResults.map((res, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectResult(res)}
                      className="w-full px-4 py-2.5 text-left text-xs hover:bg-slate-800/80 flex items-center justify-between text-slate-200 transition"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <div>
                          <span className="font-bold text-white">{res.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 ml-2">
                            {res.admin1 ? `${res.admin1}, ` : ''}{res.country}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {res.latitude.toFixed(2)}°, {res.longitude.toFixed(2)}°
                      </span>
                    </button>
                  ))
                ) : !isSearching ? (
                  <div className="px-4 py-3 text-xs font-mono text-slate-500 uppercase">No matching station targets found.</div>
                ) : null}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onGeolocate}
              title="Locate via GPS"
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-sky-400 rounded-xl border border-slate-800 transition flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden lg:inline">GPS STN</span>
            </button>

            {/* Units Toggle */}
            <button
              onClick={onToggleUnit}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-mono tracking-wider transition"
            >
              {isCelsius ? '°C | km/h' : '°F | mph'}
            </button>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition"
              title="Refresh Live Data"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
            </button>

            {/* Alert Counter Indicator */}
            <button
              onClick={() => onTabChange('alerts')}
              className="relative p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition"
              title="Alert Rules & Incidents"
            >
              <Bell className="w-3.5 h-3.5 text-slate-400" />
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                  {activeAlertsCount}
                </span>
              )}
            </button>

            {/* Docs/Readme Modal Trigger */}
            <button
              onClick={onOpenDocsModal}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-sky-400 font-mono text-xs uppercase tracking-wider rounded-xl border border-slate-800 transition flex items-center gap-1.5"
              title="System Manual & Readme"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Docs</span>
            </button>

            {/* Export PDF/CSV Modal Trigger */}
            <button
              onClick={onOpenExportModal}
              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-sky-500/20 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Preset Enterprise Hub Chips Bar */}
        <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar border-t border-slate-800/80 text-xs">
          <span className="text-slate-500 font-mono text-[10px] uppercase tracking-widest shrink-0 flex items-center gap-1">
            <Globe className="w-3 h-3 text-sky-400" /> Hub Stations:
          </span>
          {GLOBAL_HUBS.map((hub) => {
            const isSelected = currentLocation.name.toLowerCase() === hub.name.toLowerCase();
            return (
              <button
                key={hub.name}
                onClick={() => onSelectLocation(hub)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900 border border-slate-800'
                }`}
              >
                <span>{hub.name}</span>
                <span className="text-[9px] text-slate-500">[{hub.countryCode}]</span>
              </button>
            );
          })}
        </div>

        {/* Primary View Nav Tabs */}
        <nav className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1 pb-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Layers },
            { id: 'impact', label: 'Industry Decision Engine', icon: SlidersHorizontal },
            { id: 'map', label: 'Active Radar Map', icon: Globe },
            { id: 'assets', label: 'Facility Fleet', icon: Building2 },
            { id: 'ai-brief', label: 'AI Intelligence', icon: Sparkles },
            { id: 'alerts', label: 'Threshold Alerts', icon: AlertTriangle, badge: activeAlertsCount },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase whitespace-nowrap transition ${
                  isActive
                    ? 'bg-slate-900 text-sky-400 border border-slate-700 shadow-lg shadow-sky-500/5 ring-1 ring-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span className="px-1.5 py-0.2 bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] rounded-full">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
