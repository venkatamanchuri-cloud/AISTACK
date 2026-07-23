import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastCharts } from './components/ForecastCharts';
import { AirAndMarineCard } from './components/AirAndMarineCard';
import { InteractiveWeatherMap } from './components/InteractiveWeatherMap';
import { IndustryImpactBoard } from './components/IndustryImpactBoard';
import { EnterpriseAssetTracker } from './components/EnterpriseAssetTracker';
import { AIThreatBriefing } from './components/AIThreatBriefing';
import { AlertRulesManager } from './components/AlertRulesManager';
import { ExportReportModal } from './components/ExportReportModal';
import { SystemDocumentationModal } from './components/SystemDocumentationModal';

import {
  LocationInfo,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  AirQualityData,
  MarineData,
  EnterpriseAsset,
  AlertRule,
} from './types';
import { GLOBAL_HUBS, INITIAL_ENTERPRISE_ASSETS, DEFAULT_ALERT_RULES } from './data/mockEnterpriseData';
import { AlertTriangle, RotateCw, Sparkles, ShieldAlert, Globe, Layers } from 'lucide-react';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(GLOBAL_HUBS[0]); // Default Tokyo
  const [isCelsius, setIsCelsius] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Weather states
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [marine, setMarine] = useState<MarineData | null>(null);

  // Asset & Alert states
  const [assets, setAssets] = useState<EnterpriseAsset[]>(INITIAL_ENTERPRISE_ASSETS);
  const [alertRules, setAlertRules] = useState<AlertRule[]>(DEFAULT_ALERT_RULES);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  // Fetch Meteorological Telemetry Data
  const fetchWeatherData = useCallback(async (loc: LocationInfo) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/weather/data?lat=${loc.latitude}&lon=${loc.longitude}`);
      if (!res.ok) throw new Error('Failed to retrieve meteorological data');

      const data = await res.json();
      setCurrentWeather(data.current);
      setHourlyForecast(data.hourly || []);
      setDailyForecast(data.daily || []);
      setAirQuality(data.airQuality);
      setMarine(data.marine);
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      setErrorMsg(err.message || 'Unable to connect to meteorological data feed.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load & location change
  useEffect(() => {
    fetchWeatherData(currentLocation);
  }, [currentLocation, fetchWeatherData]);

  // GPS Geolocate
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLoc: LocationInfo = {
          name: 'My Current Location',
          country: 'Local GPS Target',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setCurrentLocation(userLoc);
      },
      (err) => {
        console.warn('Geolocation denied/failed:', err);
        setIsLoading(false);
        alert('Geolocation permission denied or unavailable. Defaulting to Tokyo Hub.');
      }
    );
  };

  // Asset Handlers
  const handleAddAsset = (newAsset: EnterpriseAsset) => {
    setAssets((prev) => [newAsset, ...prev]);
  };

  const handleRemoveAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  // Alert Handlers
  const handleToggleRule = (id: string) => {
    setAlertRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleAddRule = (newRule: AlertRule) => {
    setAlertRules((prev) => [newRule, ...prev]);
  };

  const handleDeleteRule = (id: string) => {
    setAlertRules((prev) => prev.filter((r) => r.id !== id));
  };

  const activeAlertsCount = alertRules.filter((r) => r.enabled).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Header
        currentLocation={currentLocation}
        onSelectLocation={(loc) => setCurrentLocation(loc)}
        onGeolocate={handleGeolocate}
        isCelsius={isCelsius}
        onToggleUnit={() => setIsCelsius(!isCelsius)}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onRefresh={() => fetchWeatherData(currentLocation)}
        isLoading={isLoading}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenDocsModal={() => setIsDocsModalOpen(true)}
        activeAlertsCount={activeAlertsCount}
      />

      {/* High Threat Weather Warning Banner (if wind > 35 or precip > 10) */}
      {currentWeather && (currentWeather.windSpeed > 35 || currentWeather.precipitation > 5) && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
              <span className="font-bold">METEOROLOGICAL WARNING:</span>
              <span>
                {currentWeather.windSpeed > 35 ? `High wind velocity (${currentWeather.windSpeed} km/h) active.` : ''}
                {currentWeather.precipitation > 5 ? ` Heavy precipitation (${currentWeather.precipitation} mm) reported.` : ''}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('ai-brief')}
              className="underline font-bold hover:text-white shrink-0 ml-2"
            >
              Run AI Risk Assessment →
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Loading Spinner State */}
        {isLoading && !currentWeather ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
            <p className="text-sm font-bold text-cyan-400 font-mono tracking-wider">
              Ingesting Global Meteorological Telemetry...
            </p>
          </div>
        ) : errorMsg ? (
          <div className="p-8 bg-slate-900 border border-rose-500/40 rounded-2xl text-center space-y-3 max-w-lg mx-auto my-12">
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Telemetry Sync Error</h3>
            <p className="text-xs text-slate-300">{errorMsg}</p>
            <button
              onClick={() => fetchWeatherData(currentLocation)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            {/* View Tab 1: Executive Radar Dashboard */}
            {activeTab === 'dashboard' && currentWeather && (
              <div className="space-y-6 animate-in fade-in">
                {/* Hero Current Telemetry Card */}
                <CurrentWeatherCard
                  weather={currentWeather}
                  location={currentLocation}
                  isCelsius={isCelsius}
                />

                {/* 24h & 7-Day Forecast Charts */}
                <ForecastCharts
                  hourly={hourlyForecast}
                  daily={dailyForecast}
                  isCelsius={isCelsius}
                />

                {/* Air Quality & Marine Environmental Metrics */}
                {airQuality && marine && (
                  <AirAndMarineCard airQuality={airQuality} marine={marine} />
                )}
              </div>
            )}

            {/* View Tab 2: Cross-Industry Decision Engine */}
            {activeTab === 'impact' && currentWeather && (
              <div className="animate-in fade-in">
                <IndustryImpactBoard weather={currentWeather} location={currentLocation} />
              </div>
            )}

            {/* View Tab 3: Spatial Map & Radar */}
            {activeTab === 'map' && (
              <div className="animate-in fade-in space-y-4">
                <InteractiveWeatherMap
                  location={currentLocation}
                  assets={assets}
                />
              </div>
            )}

            {/* View Tab 4: Enterprise Asset Tracker */}
            {activeTab === 'assets' && (
              <div className="animate-in fade-in">
                <EnterpriseAssetTracker
                  assets={assets}
                  onAddAsset={handleAddAsset}
                  onRemoveAsset={handleRemoveAsset}
                />
              </div>
            )}

            {/* View Tab 5: AI Threat Briefing & Chat */}
            {activeTab === 'ai-brief' && currentWeather && (
              <div className="animate-in fade-in">
                <AIThreatBriefing
                  location={currentLocation}
                  weather={currentWeather}
                  daily={dailyForecast}
                  airQuality={airQuality}
                />
              </div>
            )}

            {/* View Tab 6: Threshold Rules & Alert Logs */}
            {activeTab === 'alerts' && (
              <div className="animate-in fade-in">
                <AlertRulesManager
                  rules={alertRules}
                  onToggleRule={handleToggleRule}
                  onAddRule={handleAddRule}
                  onDeleteRule={handleDeleteRule}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Export Report Modal */}
      {currentWeather && (
        <ExportReportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          location={currentLocation}
          weather={currentWeather}
          daily={dailyForecast}
        />
      )}

      {/* System Documentation / Readme Modal */}
      <SystemDocumentationModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-900/80 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Open-Meteo & Gemini AI Telemetry Feed Operational</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="text-sky-400 hover:underline uppercase font-bold"
            >
              System Manual / Readme
            </button>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">
              Aether Weather Intelligence Platform • Enterprise Edition 4.2
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
