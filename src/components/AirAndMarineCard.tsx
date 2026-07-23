import React from 'react';
import {
  Activity,
  Waves,
  ShieldCheck,
  AlertTriangle,
  Wind,
  Thermometer,
  Compass,
  Info,
} from 'lucide-react';
import { AirQualityData, MarineData } from '../types';

interface AirAndMarineCardProps {
  airQuality: AirQualityData;
  marine: MarineData;
}

export const AirAndMarineCard: React.FC<AirAndMarineCardProps> = ({
  airQuality,
  marine,
}) => {
  // AQI color indicator helper
  let aqiBadgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  if (airQuality.usAqi > 150) {
    aqiBadgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  } else if (airQuality.usAqi > 100) {
    aqiBadgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (airQuality.usAqi > 50) {
    aqiBadgeStyle = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Air Quality Index Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">CHEMICAL TELEMETRY</span>
              <div className="flex items-center gap-2 mt-0.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-tight">ATMOSPHERIC AIR QUALITY (AQI)</h3>
              </div>
            </div>
            <span className={`px-2.5 py-1 text-xs font-mono font-bold uppercase rounded-lg border ${aqiBadgeStyle}`}>
              {airQuality.category}
            </span>
          </div>

          <div className="flex items-center gap-6 my-5">
            <div className="text-center p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl shrink-0">
              <div className="text-4xl font-light tracking-tighter text-white font-mono">{airQuality.usAqi}</div>
              <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mt-0.5">US AQI INDEX</div>
            </div>

            <div className="flex-1 space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {airQuality.healthAdvice}
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (airQuality.usAqi / 300) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Pollutant particle breakdown in Bento cells */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {[
              { label: 'PM2.5', value: `${airQuality.pm25} µg/m³`, desc: 'Fine Particles' },
              { label: 'PM10', value: `${airQuality.pm10} µg/m³`, desc: 'Coarse Dust' },
              { label: 'NO₂', value: `${airQuality.no2} ppb`, desc: 'Nitrogen Oxide' },
              { label: 'SO₂', value: `${airQuality.so2} ppb`, desc: 'Sulfur Dioxide' },
              { label: 'O₃', value: `${airQuality.o3} ppb`, desc: 'Ground Ozone' },
              { label: 'CO', value: `${airQuality.co} ppb`, desc: 'Carbon Monoxide' },
            ].map((p, idx) => (
              <div key={idx} className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <div className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest">{p.label}</div>
                <div className="text-xs font-mono font-bold text-white my-0.5">{p.value}</div>
                <div className="text-[9px] font-mono text-slate-500 truncate">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Real-time CAMS & EPA chemical sensor sync</span>
        </div>
      </div>

      {/* Marine & Ocean Metrics Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">MARITIME RADAR</span>
              <div className="flex items-center gap-2 mt-0.5">
                <Waves className="w-4 h-4 text-sky-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-tight">MARINE & OFFSHORE TELEMETRY</h3>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30">
              COASTAL WAVE BUOY
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-5">
            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">WAVE HEIGHT</span>
              <span className="text-2xl font-light tracking-tight text-white font-mono mt-1 block">{marine.waveHeight} m</span>
              <span className="text-[10px] font-mono text-slate-500 mt-0.5 block">SWELL: {marine.swellHeight} m</span>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">WAVE PERIOD</span>
              <span className="text-2xl font-light tracking-tight text-white font-mono mt-1 block">{marine.wavePeriod} s</span>
              <span className="text-[10px] font-mono text-slate-500 mt-0.5 flex items-center gap-1">
                <Compass className="w-3 h-3 text-sky-400" style={{ transform: `rotate(${marine.waveDirection}deg)` }} />
                HEADING {marine.waveDirection}°
              </span>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">SEA TEMP</span>
              <span className="text-2xl font-light tracking-tight text-sky-400 font-mono mt-1 block">{marine.seaSurfaceTemperature}°C</span>
              <span className="text-[10px] font-mono text-slate-500 mt-0.5 block">ANOMALY: NOMINAL</span>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">NAV RISK</span>
              <span className="text-base font-bold text-emerald-400 font-mono mt-1 block uppercase">LOW SHEAR</span>
              <span className="text-[10px] font-mono text-slate-500 mt-0.5 block">SAFE HARBOR STATUS</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 uppercase flex items-center justify-between">
          <span>Wave buoy network & satellite bathymetry</span>
          <span className="text-sky-400 font-bold">PORT OPERATIONS SAFE</span>
        </div>
      </div>
    </div>
  );
};
