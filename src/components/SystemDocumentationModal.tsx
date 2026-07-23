import React, { useState } from 'react';
import {
  FileText,
  X,
  BookOpen,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Globe,
  SlidersHorizontal,
  Building2,
  AlertTriangle,
  Download,
  Terminal,
} from 'lucide-react';

interface SystemDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemDocumentationModal: React.FC<SystemDocumentationModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'features' | 'architecture' | 'api' | 'setup'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-slate-950 font-bold font-mono">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">SYSTEM DOCUMENTATION & MANUAL</span>
              <h3 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2 mt-0.5">
                AETHER INTEL v4.2 READ-ME & ARCHITECTURE SPEC
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 font-mono transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body with Sidebar Navigation */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Section Navigation Tabs */}
          <div className="w-full md:w-56 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 p-3 space-y-1 shrink-0 font-mono text-xs uppercase">
            {[
              { id: 'overview', label: '1. Executive Summary', icon: BookOpen },
              { id: 'features', label: '2. Core Modules', icon: Layers },
              { id: 'architecture', label: '3. Technical Stack', icon: Cpu },
              { id: 'api', label: '4. API Reference', icon: Terminal },
              { id: 'setup', label: '5. Quick Start', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`w-full px-3 py-2.5 rounded-xl text-left font-bold tracking-wider transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section Content Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-slate-300 text-xs leading-relaxed font-sans">
            {activeSection === 'overview' && (
              <div className="space-y-4">
                <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-2xl space-y-2 font-mono">
                  <span className="text-[10px] text-sky-400 uppercase tracking-widest font-bold block">PLATFORM MISSION</span>
                  <p className="text-xs text-sky-200">
                    AETHER INTEL is a mission-critical enterprise weather intelligence and decision support engine designed for logistical hubs, power grid dispatchers, airport terminals, and civil infrastructure managers.
                  </p>
                </div>

                <h4 className="text-sm font-bold text-white uppercase tracking-tight font-mono flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-400" /> Operational Scope
                </h4>
                <p>
                  Modern commercial enterprises face severe monetary penalties and safety risks from sudden high-impact weather anomalies. AETHER INTEL bridges raw meteorological satellite telemetry with automated sector decision engines, providing live risk scoring, threshold breach dispatch, and C-suite operational intelligence summaries.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono">
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500 uppercase block">Telemetry Source</span>
                    <span className="text-white font-bold block mt-0.5">High-Res Open-Meteo API (0.05° Grid)</span>
                  </div>
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-500 uppercase block">Intelligence Engine</span>
                    <span className="text-white font-bold block mt-0.5">Google Gemini AI (@google/genai)</span>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'features' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-tight font-mono">Core Platform Functional Modules</h4>

                <div className="space-y-3 font-mono">
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-sky-400 font-bold uppercase text-xs">
                      <Layers className="w-3.5 h-3.5" /> 1. Executive Telemetry & Aviation/Marine Radar
                    </div>
                    <p className="font-sans text-slate-400 text-[11px]">
                      Displays real-time ambient metrics, apparent index, UV density, density altitude offsets, cloud ceiling height, wave swell, and flight rule status (VFR/MVFR/IFR).
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-sky-400 font-bold uppercase text-xs">
                      <SlidersHorizontal className="w-3.5 h-3.5" /> 2. Cross-Sector Industry Decision Engine
                    </div>
                    <p className="font-sans text-slate-400 text-[11px]">
                      Algorithmic risk evaluation and mitigation protocol checklists for Logistics, Aviation, Energy Grids, Construction, Precision Agriculture, and Maritime operations.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-sky-400 font-bold uppercase text-xs">
                      <Globe className="w-3.5 h-3.5" /> 3. Spatial Doppler Telemetry Radar Map
                    </div>
                    <p className="font-sans text-slate-400 text-[11px]">
                      Interactive Leaflet map with Doppler layer overlays (Precipitation, Cloud Cover, Temperature, Wind Shear) and time-sweep playback controls.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-sky-400 font-bold uppercase text-xs">
                      <Building2 className="w-3.5 h-3.5" /> 4. Enterprise Facility Vulnerability Fleet
                    </div>
                    <p className="font-sans text-slate-400 text-[11px]">
                      Real-time risk scoring across global warehouse hubs, solar fields, and data centers with custom asset registration and threat monitoring.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-sky-400 font-bold uppercase text-xs">
                      <Sparkles className="w-3.5 h-3.5" /> 5. Gemini AI Operational Assistant & Chatbot
                    </div>
                    <p className="font-sans text-slate-400 text-[11px]">
                      Automated executive briefing generator producing risk ratings, threat windows, and natural language query response console backed by Gemini AI.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-sky-400 font-bold uppercase text-xs">
                      <AlertTriangle className="w-3.5 h-3.5" /> 6. Threshold Alert Trigger Rules & Incident Audit
                    </div>
                    <p className="font-sans text-slate-400 text-[11px]">
                      Rule builder monitoring continuous telemetry parameters (wind speed, temp, precip) with live incident breach log and webhook dispatch triggers.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-sky-400 font-bold uppercase text-xs">
                      <Download className="w-3.5 h-3.5" /> 7. Operational Report Exporter
                    </div>
                    <p className="font-sans text-slate-400 text-[11px]">
                      Export compliance documents in text (.txt), tabular CSV (.csv), or structured JSON (.json) formats for C-suite archive or BI tool integration.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'architecture' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-tight font-mono">System Architecture & Design Patterns</h4>

                <p>
                  AETHER INTEL strictly implements a server-proxy architecture where API credentials and Gemini keys remain hidden behind the Node.js/Express backend (`server.ts`).
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
                  <div className="text-sky-400 font-bold border-b border-slate-800 pb-2 uppercase">DATA FLOW ARCHITECTURE</div>
                  <div className="space-y-1 text-slate-400">
                    <div>[Client SPA React App]</div>
                    <div className="pl-4">├── GET /api/weather/forecast → Node Express → Open-Meteo Satellite API</div>
                    <div className="pl-4">├── GET /api/weather/geocode  → Node Express → Geocoding Engine</div>
                    <div className="pl-4">├── POST /api/ai/briefing     → Node Express → Google Gemini SDK (@google/genai)</div>
                    <div className="pl-4">└── POST /api/ai/chat         → Node Express → Google Gemini SDK (@google/genai)</div>
                  </div>
                </div>

                <div className="space-y-2 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">SECURITY GUARANTEES</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 font-sans text-xs">
                    <li>Zero API key leakage in browser context or bundle output.</li>
                    <li>Lazy instantiation of GoogleGenAI SDK to ensure high server stability without startup crashes.</li>
                    <li>Container-ready ingress binding on host `0.0.0.0` and port `3000`.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'api' && (
              <div className="space-y-4 font-mono">
                <h4 className="text-sm font-bold text-white uppercase tracking-tight">Backend Express API Specification</h4>

                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">GET</span>
                    <span className="text-white font-bold ml-2">/api/weather/forecast</span>
                    <p className="font-sans text-slate-400 text-[11px] mt-1">
                      Query parameters: <code className="text-sky-400">lat</code>, <code className="text-sky-400">lon</code>. Returns 7-day hourly and daily forecast telemetry.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">GET</span>
                    <span className="text-white font-bold ml-2">/api/weather/geocode</span>
                    <p className="font-sans text-slate-400 text-[11px] mt-1">
                      Query parameters: <code className="text-sky-400">q</code>. Searches worldwide location station targets.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded text-[10px] font-bold">POST</span>
                    <span className="text-white font-bold ml-2">/api/ai/briefing</span>
                    <p className="font-sans text-slate-400 text-[11px] mt-1">
                      Body payload: <code className="text-sky-400">&#123; locationName, currentWeather, dailyForecast &#125;</code>. Invokes Gemini AI to synthesize operational threat briefs.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded text-[10px] font-bold">POST</span>
                    <span className="text-white font-bold ml-2">/api/ai/chat</span>
                    <p className="font-sans text-slate-400 text-[11px] mt-1">
                      Body payload: <code className="text-sky-400">&#123; prompt, locationName, currentWeather &#125;</code>. Interactive AI conversation regarding weather risk impact.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'setup' && (
              <div className="space-y-4 font-mono">
                <h4 className="text-sm font-bold text-white uppercase tracking-tight">Deployment & Execution Manual</h4>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">1. Development Bootup</div>
                  <pre className="text-sky-400 p-2 bg-slate-900 rounded border border-slate-800 overflow-x-auto">
                    npm run dev
                  </pre>

                  <div className="text-slate-500 text-[10px] uppercase font-bold pt-2">2. Production Build (esbuild + Vite)</div>
                  <pre className="text-sky-400 p-2 bg-slate-900 rounded border border-slate-800 overflow-x-auto">
                    npm run build
                  </pre>

                  <div className="text-slate-500 text-[10px] uppercase font-bold pt-2">3. Production Server Start</div>
                  <pre className="text-sky-400 p-2 bg-slate-900 rounded border border-slate-800 overflow-x-auto">
                    npm start
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0 font-mono text-xs">
          <span className="text-slate-500 text-[10px] uppercase">AETHER INTEL v4.2 • ENTERPRISE READY</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold uppercase tracking-wider rounded-xl transition shadow-md shadow-sky-500/20"
          >
            Close Manual
          </button>
        </div>
      </div>
    </div>
  );
};
