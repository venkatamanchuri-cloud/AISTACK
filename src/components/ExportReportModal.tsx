import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, X } from 'lucide-react';
import { CurrentWeather, DailyForecast, LocationInfo } from '../types';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationInfo;
  weather: CurrentWeather;
  daily: DailyForecast[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  location,
  weather,
  daily,
}) => {
  const [reportType, setReportType] = useState<'summary' | 'csv' | 'json'>('summary');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      let content = '';
      let filename = `Aether_Weather_Report_${location.name}_${new Date().toISOString().slice(0, 10)}`;
      let mimeType = 'text/plain';

      if (reportType === 'json') {
        content = JSON.stringify({ location, current: weather, daily }, null, 2);
        filename += '.json';
        mimeType = 'application/json';
      } else if (reportType === 'csv') {
        content = `Date,Temperature_C,ApparentTemp_C,Precipitation_mm,WindSpeed_kmh,Humidity_pct\n`;
        content += `${new Date().toISOString().slice(0, 10)},${weather.temperature},${weather.apparentTemperature},${weather.precipitation},${weather.windSpeed},${weather.humidity}\n`;
        daily.forEach((d) => {
          content += `${d.date},${d.tempMax},${d.tempMin},${d.precipitationSum},${d.windSpeedMax},50\n`;
        });
        filename += '.csv';
        mimeType = 'text/csv';
      } else {
        content = `AETHER ENTERPRISE WEATHER INTELLIGENCE EXECUTIVE REPORT
=========================================================
Location: ${location.name}, ${location.country}
Coordinates: ${location.latitude}°, ${location.longitude}°
Generated: ${new Date().toUTCString()}

CURRENT METEOROLOGICAL TELEMETRY:
---------------------------------
Condition: ${weather.weatherLabel}
Temperature: ${weather.temperature}°C (Feels like ${weather.apparentTemperature}°C)
Wind Velocity: ${weather.windSpeed} km/h (Gusts: ${weather.windGusts} km/h)
Barometric Pressure: ${weather.pressureMsl} hPa
Precipitation: ${weather.precipitation} mm
UV Index: ${weather.uvIndex}
Relative Humidity: ${weather.humidity}%
Visibility: ${weather.visibility} km

7-DAY PREDICTIVE FORECAST SUMMARY:
----------------------------------
${daily.map((d) => `${d.dayName} (${d.date}): ${d.weatherLabel} | Max: ${d.tempMax}°C, Min: ${d.tempMin}°C | Rain Prob: ${d.precipitationProbability}%`).join('\n')}

=========================================================
End of Report - Aether Weather Intelligence Platform
`;
        filename += '.txt';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setDownloadComplete(true);
      setTimeout(() => {
        setDownloadComplete(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-tight">EXPORT WEATHER INTELLIGENCE REPORT</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-mono"><X className="w-4 h-4" /></button>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          Generate official operational briefing documents for compliance, logistics dispatch, or C-suite reporting for <span className="font-bold text-white">{location.name}</span>.
        </p>

        {/* Format Selector */}
        <div className="space-y-2 text-xs">
          <label className="block text-slate-400 font-mono text-[10px] uppercase tracking-widest">Select Export Format</label>
          <div className="space-y-2 font-mono">
            {[
              { id: 'summary', label: 'Executive Operational Summary (.txt)', desc: 'Human-readable executive briefing format' },
              { id: 'csv', label: 'CSV Telemetry Data (.csv)', desc: 'Tabular time-series metrics for Excel or BI tools' },
              { id: 'json', label: 'Structured JSON Schema (.json)', desc: 'Raw API dataset for automated enterprise pipeline ingestion' },
            ].map((fmt) => (
              <label
                key={fmt.id}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  reportType === fmt.id
                    ? 'bg-slate-950 border-sky-500 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-950/80'
                }`}
              >
                <input
                  type="radio"
                  name="reportType"
                  value={fmt.id}
                  checked={reportType === fmt.id}
                  onChange={() => setReportType(fmt.id as any)}
                  className="mt-0.5 accent-sky-500"
                />
                <div>
                  <span className="font-bold block text-xs uppercase tracking-wider">{fmt.label}</span>
                  <span className="text-[11px] font-sans text-slate-400 block mt-0.5">{fmt.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800 font-mono">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-sky-500/20 transition flex items-center gap-1.5"
          >
            {downloadComplete ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-slate-950" />
                <span>{isExporting ? 'Generating...' : 'Download File'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
