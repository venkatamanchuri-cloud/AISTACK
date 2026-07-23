import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Building2,
  AlertTriangle,
  Wind,
  CloudRain,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { EnterpriseAsset, LocationInfo } from '../types';

interface InteractiveWeatherMapProps {
  location: LocationInfo;
  assets: EnterpriseAsset[];
  onSelectAsset?: (asset: EnterpriseAsset) => void;
}

export const InteractiveWeatherMap: React.FC<InteractiveWeatherMapProps> = ({
  location,
  assets,
  onSelectAsset,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeLayer, setActiveLayer] = useState<'radar' | 'clouds' | 'wind' | 'temp'>('radar');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeStep, setTimeStep] = useState(3); // 0 = -3h, 3 = Now, 6 = +6h forecast
  const [selectedAsset, setSelectedAsset] = useState<EnterpriseAsset | null>(null);

  // Time labels
  const timeLabels = ['-3 Hours', '-2 Hours', '-1 Hour', 'LIVE NOW', '+2 Hours', '+4 Hours', '+6 Hours'];

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create Map instance
      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: 7,
        zoomControl: false,
      });

      // CartoDB Dark Matter tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Custom Zoom control position
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    } else {
      mapInstanceRef.current.setView([location.latitude, location.longitude], mapInstanceRef.current.getZoom());
    }

    // Render Markers in layerGroup
    if (layerGroupRef.current) {
      layerGroupRef.current.clearLayers();

      // 1. Target Location Pulse Marker
      const targetIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 rounded-full bg-cyan-400/30 animate-ping"></span>
            <div class="w-5 h-5 rounded-full bg-cyan-500 border-2 border-white shadow-lg flex items-center justify-center">
              <div class="w-2 h-2 rounded-full bg-slate-950"></div>
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const locationMarker = L.marker([location.latitude, location.longitude], { icon: targetIcon });
      locationMarker.bindPopup(`
        <div style="color: #0f172a; font-family: system-ui; font-size: 13px; padding: 2px;">
          <strong style="color: #0284c7;">${location.name}</strong><br/>
          <span style="font-size: 11px; color: #64748b;">Primary Regional Hub</span>
        </div>
      `);
      layerGroupRef.current.addLayer(locationMarker);

      // 2. Enterprise Asset Markers
      assets.forEach((asset) => {
        let badgeColor = 'bg-emerald-500';
        if (asset.riskLevel === 'Critical') badgeColor = 'bg-rose-500 animate-pulse';
        else if (asset.riskLevel === 'High') badgeColor = 'bg-orange-500';
        else if (asset.riskLevel === 'Moderate') badgeColor = 'bg-amber-500';

        const assetIcon = L.divIcon({
          className: 'custom-asset-marker',
          html: `
            <div class="cursor-pointer p-1 rounded-xl bg-slate-900 border border-slate-700 shadow-xl flex items-center gap-1.5 px-2 hover:scale-110 transition">
              <span class="w-2.5 h-2.5 rounded-full ${badgeColor}"></span>
              <span class="text-[11px] font-bold text-white font-mono whitespace-nowrap">${asset.name}</span>
            </div>
          `,
          iconSize: [120, 28],
          iconAnchor: [60, 14],
        });

        const assetMarker = L.marker([asset.latitude, asset.longitude], { icon: assetIcon });
        assetMarker.on('click', () => {
          setSelectedAsset(asset);
          if (onSelectAsset) onSelectAsset(asset);
        });
        layerGroupRef.current?.addLayer(assetMarker);
      });
    }
  }, [location, assets]);

  // Handle Play/Pause timeline animation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeStep((prev) => (prev >= timeLabels.length - 1 ? 0 : prev + 1));
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative flex flex-col h-[600px]">
      {/* Map Header Overlay Bar */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 z-10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">SPATIAL TELEMETRY RADAR</span>
          <h3 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2 mt-0.5">
            <Layers className="w-4 h-4 text-sky-400" />
            SPATIAL DOPPLER & ASSET VULNERABILITY RADAR
          </h3>
        </div>

        {/* Map Overlay Layer Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono">
          {[
            { id: 'radar', label: 'Precipitation Radar' },
            { id: 'clouds', label: 'Cloud Density' },
            { id: 'wind', label: 'Wind Vector Field' },
            { id: 'temp', label: 'Thermal Anomaly' },
          ].map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as any)}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
                activeLayer === layer.id
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative flex-1 w-full bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Simulated Layer Color Legend Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-xl text-xs space-y-2 font-mono">
          <div className="font-semibold text-slate-200 flex items-center justify-between gap-2">
            <span className="uppercase text-[10px] tracking-wider">{activeLayer} Intensity Scale</span>
            <span className="text-[10px] font-mono text-sky-400">Live</span>
          </div>
          <div className="w-36 h-2 rounded-full bg-gradient-to-r from-blue-500 via-sky-400 via-emerald-400 via-amber-400 to-rose-600" />
          <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase">
            <span>Light</span>
            <span>Moderate</span>
            <span>Severe</span>
          </div>
        </div>

        {/* Selected Asset Floating Information Drawer */}
        {selectedAsset && (
          <div className="absolute bottom-16 left-4 z-20 bg-slate-900 border border-sky-500/40 p-4 rounded-2xl shadow-2xl max-w-sm text-xs space-y-2 font-mono animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-white text-sm uppercase">{selectedAsset.name}</span>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-white px-1.5 py-0.5 text-xs rounded bg-slate-950 font-mono"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
              <div>Type: <span className="text-white font-sans">{selectedAsset.type}</span></div>
              <div>Risk Level: <span className={`font-bold ${selectedAsset.riskLevel === 'Critical' ? 'text-rose-400' : 'text-amber-400'}`}>{selectedAsset.riskLevel} ({selectedAsset.riskScore}/100)</span></div>
              <div>Temp: <span className="text-white">{selectedAsset.temperature}°C</span></div>
              <div>Wind: <span className="text-white">{selectedAsset.windSpeed} km/h</span></div>
            </div>
            <p className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 p-2 rounded-xl font-mono">
              ⚠️ Primary Threat: {selectedAsset.primaryRiskFactor}
            </p>
          </div>
        )}
      </div>

      {/* Map Timeline Playback Bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 z-10 flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition shrink-0 flex items-center justify-center shadow-md shadow-sky-500/20"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        <div className="flex-1 w-full space-y-1 font-mono">
          <div className="flex justify-between text-xs text-slate-500 uppercase">
            <span>Timeline Sweep</span>
            <span className="text-sky-400 font-bold">{timeLabels[timeStep]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={timeLabels.length - 1}
            value={timeStep}
            onChange={(e) => setTimeStep(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        <button
          onClick={() => {
            setTimeStep(3);
            setIsPlaying(false);
          }}
          className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Live
        </button>
      </div>
    </div>
  );
};
