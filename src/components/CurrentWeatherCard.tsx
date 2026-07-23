import React from 'react';
import {
  Sun,
  CloudRain,
  Cloud,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Wind,
  Droplets,
  Eye,
  Compass,
  Thermometer,
  Gauge,
  SunMedium,
  MapPin,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { CurrentWeather, LocationInfo } from '../types';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  location: LocationInfo;
  isCelsius: boolean;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  location,
  isCelsius,
}) => {
  // Weather icon mapping function
  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun className="w-16 h-16 text-amber-400 animate-pulse" />;
    if (code === 2 || code === 3) return <Cloud className="w-16 h-16 text-slate-300" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-16 h-16 text-cyan-400" />;
    if (code >= 71 && code <= 77) return <CloudSnow className="w-16 h-16 text-indigo-300" />;
    if (code >= 80 && code <= 82) return <CloudRain className="w-16 h-16 text-blue-400" />;
    if (code >= 95) return <CloudLightning className="w-16 h-16 text-yellow-400 animate-bounce" />;
    if (code === 45 || code === 48) return <CloudFog className="w-16 h-16 text-slate-400" />;
    return <Sun className="w-16 h-16 text-amber-400" />;
  };

  const displayTemp = isCelsius
    ? Math.round(weather.temperature)
    : Math.round(weather.temperatureF);

  const displayApparentTemp = isCelsius
    ? Math.round(weather.apparentTemperature)
    : Math.round(weather.apparentTemperature * 9/5 + 32);

  const displayWind = isCelsius
    ? `${Math.round(weather.windSpeed)} km/h`
    : `${Math.round(weather.windSpeedMph)} mph`;

  const displayGusts = isCelsius
    ? `${Math.round(weather.windGusts)} km/h`
    : `${Math.round(weather.windGusts * 0.621371)} mph`;

  // UV risk category
  let uvCategory = 'Low';
  let uvColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (weather.uvIndex >= 8) {
    uvCategory = 'Very High';
    uvColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  } else if (weather.uvIndex >= 6) {
    uvCategory = 'High';
    uvColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  } else if (weather.uvIndex >= 3) {
    uvCategory = 'Moderate';
    uvColor = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Top Header info in Bento style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              STATION ID: {location.countryCode || '77'}-A
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider">
              {location.name}, {location.country}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight uppercase mt-0.5 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
            {location.name} METEOROLOGICAL TELEMETRY
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            COORDS: {location.latitude.toFixed(2)}° N, {location.longitude.toFixed(2)}° W {location.timezone && `| ZONE: ${location.timezone}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE_SYNC
          </div>
          <div className="text-right text-[10px] font-mono text-slate-500 hidden sm:block">
            <span className="block uppercase tracking-widest">OBSERVATION</span>
            <span className="text-slate-300 font-bold flex items-center gap-1 justify-end mt-0.5">
              <Clock className="w-3 h-3 text-sky-400" />
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Bento Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-6">
        {/* Left Bento: Current Temp Big Hero (5 cols) */}
        <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-inner">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">PRIMARY TELEMETRY</span>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
              {getWeatherIcon(weather.weatherCode)}
            </div>
          </div>

          <div className="my-4">
            <div className="flex items-baseline">
              <span className="text-6xl font-light tracking-tighter text-white">
                {displayTemp}
              </span>
              <span className="text-2xl text-sky-500 italic font-medium ml-1">
                °{isCelsius ? 'C' : 'F'}
              </span>
            </div>
            <div className="text-base font-bold text-sky-400 tracking-wide uppercase mt-1">
              {weather.weatherLabel}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Apparent Thermal: <span className="text-white font-bold">{displayApparentTemp}°{isCelsius ? 'C' : 'F'}</span>
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase">
            <span>Barometric Baseline</span>
            <span className="text-slate-300 font-bold">{weather.pressureMsl} hPa</span>
          </div>
        </div>

        {/* Right Bento Grid Metrics (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Wind Bento */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">WIND VELOCITY</span>
              <Compass className="w-3.5 h-3.5 text-sky-400" style={{ transform: `rotate(${weather.windDirection}deg)` }} />
            </div>
            <div className="my-2">
              <div className="text-2xl font-light tracking-tight text-white font-mono">{displayWind}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">GUSTS: {displayGusts}</div>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: `${Math.min(100, (weather.windSpeed / 60) * 100)}%` }} />
            </div>
          </div>

          {/* Humidity Bento */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">HUMIDITY</span>
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-light tracking-tight text-white font-mono">{weather.humidity}%</div>
              <div className="text-[10px] font-mono text-sky-400 uppercase mt-0.5">OPTIMAL RANGE</div>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-sky-400 h-full rounded-full" style={{ width: `${weather.humidity}%` }} />
            </div>
          </div>

          {/* UV Index Bento */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">UV INDEX</span>
              <SunMedium className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-light tracking-tight text-amber-400 font-mono">{weather.uvIndex}</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">{uvCategory} HAZARD</div>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(weather.uvIndex / 12) * 100}%` }} />
            </div>
          </div>

          {/* Pressure Bento */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">PRESSURE</span>
              <Gauge className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-light tracking-tight text-white font-mono">{weather.pressureMsl}</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">hPa (STABLE)</div>
            </div>
            <div className="text-[9px] font-mono text-slate-500">Surface: {weather.surfacePressure} hPa</div>
          </div>

          {/* Visibility Bento */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">VISIBILITY</span>
              <Eye className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-light tracking-tight text-white font-mono">{weather.visibility} <span className="text-xs text-slate-500">km</span></div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase mt-0.5">NOMINAL SIGHT</div>
            </div>
            <div className="text-[9px] font-mono text-slate-500">Optics: {weather.visibility >= 10 ? 'Unrestricted' : 'Attenuated'}</div>
          </div>

          {/* Cloud Cover Bento */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">CLOUD COVER</span>
              <Cloud className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-light tracking-tight text-white font-mono">{weather.cloudCover}%</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">OVERCAST FRACTION</div>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-slate-400 h-full rounded-full" style={{ width: `${weather.cloudCover}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
