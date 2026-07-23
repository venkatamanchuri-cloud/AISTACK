import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import {
  Calendar,
  Clock,
  CloudRain,
  Sun,
  Wind,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { DailyForecast, HourlyForecast } from '../types';

interface ForecastChartsProps {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  isCelsius: boolean;
}

export const ForecastCharts: React.FC<ForecastChartsProps> = ({
  hourly,
  daily,
  isCelsius,
}) => {
  const [viewMode, setViewMode] = useState<'hourly' | 'daily' | 'wind'>('hourly');

  // Format hourly data for charts
  const hourlyChartData = hourly.map((h) => ({
    time: h.time,
    temp: isCelsius ? Math.round(h.temperature) : Math.round(h.temperature * 9/5 + 32),
    rainProb: h.precipitationProbability,
    precip: h.precipitation,
    wind: Math.round(h.windSpeed),
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">PREDICTIVE trajectory</span>
          <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2 mt-0.5">
            <Calendar className="w-4 h-4 text-sky-400" />
            METEOROLOGICAL FORECAST ENGINE
          </h3>
          <p className="text-[11px] font-mono text-slate-500 mt-0.5">High-frequency atmospheric modeling (24h & 7-day outlook)</p>
        </div>

        {/* View mode toggle tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto font-mono text-xs">
          <button
            onClick={() => setViewMode('hourly')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 uppercase tracking-wider ${
              viewMode === 'hourly'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            24h Thermal
          </button>

          <button
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 uppercase tracking-wider ${
              viewMode === 'daily'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            7-Day Outlook
          </button>

          <button
            onClick={() => setViewMode('wind')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 uppercase tracking-wider ${
              viewMode === 'wind'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Wind Vector
          </button>
        </div>
      </div>

      {/* Chart View Mode: Hourly */}
      {viewMode === 'hourly' && (
        <div className="pt-6">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.8} />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis yAxisId="left" stroke="#0ea5e9" tick={{ fontSize: 11, fontFamily: 'monospace' }} domain={['dataMin - 2', 'dataMax + 2']} />
                <YAxis yAxisId="right" orientation="right" stroke="#38bdf8" tick={{ fontSize: 11, fontFamily: 'monospace' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#1e293b',
                    borderRadius: '1rem',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#f8fafc',
                  }}
                  formatter={(value: any, name: any) => [
                    name === 'temp' ? `${value}°${isCelsius ? 'C' : 'F'}` : `${value}%`,
                    name === 'temp' ? 'Temperature' : 'Rain Probability',
                  ]}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="temp"
                  stroke="#0ea5e9"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#tempGradient)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="rainProb"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#rainGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick hourly scroller */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pt-4 border-t border-slate-800">
            {hourly.slice(0, 16).map((item, index) => (
              <div
                key={index}
                className="shrink-0 p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-center min-w-[70px] hover:border-sky-500/40 transition"
              >
                <div className="text-[10px] font-mono text-slate-500">{item.time}</div>
                <div className="text-sm font-bold text-white font-mono my-1">
                  {isCelsius ? Math.round(item.temperature) : Math.round(item.temperature * 9/5 + 32)}°
                </div>
                <div className="flex items-center justify-center gap-0.5 text-[10px] text-sky-400 font-mono font-medium">
                  <CloudRain className="w-3 h-3" />
                  {item.precipitationProbability}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart View Mode: Wind Profile */}
      {viewMode === 'wind' && (
        <div className="pt-6">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(value: any) => [`${value} km/h`, 'Wind Velocity']}
                />
                <Bar dataKey="wind" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* View Mode: 7-Day Outlook */}
      {viewMode === 'daily' && (
        <div className="pt-6 space-y-3">
          {daily.map((day, idx) => {
            const maxTemp = isCelsius ? Math.round(day.tempMax) : Math.round(day.tempMax * 9/5 + 32);
            const minTemp = isCelsius ? Math.round(day.tempMin) : Math.round(day.tempMin * 9/5 + 32);

            return (
              <div
                key={idx}
                className="p-3.5 bg-slate-800/40 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3 w-40 shrink-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <Sun className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{day.dayName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{day.date}</div>
                  </div>
                </div>

                <div className="text-xs font-medium text-cyan-300 flex-1 truncate">
                  {day.weatherLabel}
                </div>

                <div className="flex items-center gap-2 text-xs text-blue-400 font-mono w-28 shrink-0">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>{day.precipitationProbability}% prob</span>
                </div>

                {/* Sunrise & Sunset */}
                <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 font-mono w-36 shrink-0">
                  <span className="flex items-center gap-1" title="Sunrise">
                    <Sunrise className="w-3.5 h-3.5 text-amber-400" /> {day.sunrise}
                  </span>
                  <span className="flex items-center gap-1" title="Sunset">
                    <Sunset className="w-3.5 h-3.5 text-orange-400" /> {day.sunset}
                  </span>
                </div>

                {/* Min/Max Temperature bar */}
                <div className="flex items-center gap-2 w-36 justify-end shrink-0 font-mono text-sm font-bold">
                  <span className="text-slate-400 flex items-center"><ArrowDown className="w-3 h-3 text-blue-400 inline" />{minTemp}°</span>
                  <div className="w-16 bg-slate-700/80 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-400 to-amber-400 h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                  <span className="text-white flex items-center"><ArrowUp className="w-3 h-3 text-amber-400 inline" />{maxTemp}°</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
