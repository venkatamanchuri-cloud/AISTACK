import React, { useState } from 'react';
import {
  Truck,
  Zap,
  Sprout,
  HardHat,
  Plane,
  ShoppingBag,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Info,
} from 'lucide-react';
import { CurrentWeather, IndustryType, LocationInfo } from '../types';

interface IndustryImpactBoardProps {
  weather: CurrentWeather;
  location: LocationInfo;
}

export const IndustryImpactBoard: React.FC<IndustryImpactBoardProps> = ({
  weather,
  location,
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>('logistics');

  // Calculate industry risk scores based on current live weather telemetry
  const calculateLogistics = () => {
    let score = 15;
    let status: 'optimal' | 'notice' | 'warning' | 'severe' = 'optimal';
    if (weather.visibility < 3 || weather.windSpeed > 45) {
      score = 82;
      status = 'severe';
    } else if (weather.precipitation > 5 || weather.windSpeed > 30) {
      score = 55;
      status = 'warning';
    } else if (weather.humidity > 80 || weather.windSpeed > 20) {
      score = 35;
      status = 'notice';
    }

    return {
      industry: 'logistics' as IndustryType,
      title: 'Supply Chain, Freight & Logistics Engine',
      score,
      status,
      summary: `Road surface traction remains ${weather.precipitation > 2 ? 'compromised due to rainfall' : 'optimal'}. Transit delays estimated at +${Math.round(score * 0.25)} minutes per 100km corridor.`,
      keyMetrics: [
        { label: 'Corridor Visibility', value: `${weather.visibility} km`, trend: weather.visibility < 5 ? 'down' : 'neutral' },
        { label: 'Crosswind Hazard', value: `${weather.windSpeed} km/h`, trend: weather.windSpeed > 30 ? 'up' : 'neutral' },
        { label: 'Surface Grip Index', value: weather.precipitation > 5 ? 'Low (0.62)' : 'Nominal (0.94)', trend: 'neutral' },
      ],
      actionItems: [
        'Enforce 10% headway distance increase for heavy-class freight vehicles.',
        'Alert regional port terminals for potential container stack wind locks.',
        'Recalibrate GPS routing engines for micro-climate fog zones.',
      ],
    };
  };

  const calculateEnergy = () => {
    const solarFactor = Math.max(0, 100 - weather.cloudCover);
    const windPowerFactor = Math.min(100, Math.round((weather.windSpeed / 50) * 100));

    return {
      industry: 'energy' as IndustryType,
      title: 'Renewable Power & Grid Load Intelligence',
      score: Math.round((weather.cloudCover * 0.5) + (weather.windSpeed > 40 ? 40 : 10)),
      status: weather.windSpeed > 50 ? 'severe' : weather.cloudCover > 70 ? 'notice' : 'optimal',
      summary: `Solar PV output estimated at ${solarFactor}% of nominal peak. Wind turbine generation efficiency at ${windPowerFactor}%.`,
      keyMetrics: [
        { label: 'PV Irradiance Estimate', value: `${Math.round(850 * (solarFactor / 100))} W/m²`, trend: 'neutral' },
        { label: 'Turbine Cut-Out Risk', value: weather.windSpeed > 45 ? 'High Cut-Out' : 'Safe Operating Zone', trend: 'neutral' },
        { label: 'Grid Cooling Load (CDD)', value: `${Math.max(0, Math.round(weather.temperature - 18))} Degree Days`, trend: 'up' },
      ],
      actionItems: [
        'Engage peak-shaving battery storage units during midday solar ramp down.',
        'Monitor regional distribution transformers for ambient heat threshold limits.',
        'Schedule wind farm pitch control adjustments for gust dampening.',
      ],
    };
  };

  const calculateAgriculture = () => {
    return {
      industry: 'agriculture' as IndustryType,
      title: 'Precision AgTech & Crop Protection',
      score: weather.temperature < 2 ? 85 : weather.uvIndex > 8 ? 60 : 20,
      status: weather.temperature < 2 ? 'severe' : 'optimal',
      summary: `Soil moisture level at 0.28 m³/m³. Frost hazard: ${weather.temperature < 3 ? 'CRITICAL FROST WARNING' : 'Low'}.`,
      keyMetrics: [
        { label: 'Soil Temp (0cm)', value: `${(weather.temperature - 2).toFixed(1)}°C`, trend: 'neutral' },
        { label: 'Evapotranspiration', value: '3.4 mm/day', trend: 'up' },
        { label: 'Chemical Spray Window', value: weather.windSpeed > 18 ? 'Unsuitable (High Drift)' : 'Optimal', trend: 'neutral' },
      ],
      actionItems: [
        'Halt aerial pesticide and liquid fertilizer spraying when wind exceeds 15 km/h.',
        'Activate anti-frost wind machines if night thermal drops below 2°C.',
        'Adjust automated drip irrigation based on current dew point deficit.',
      ],
    };
  };

  const calculateConstruction = () => {
    const windStop = weather.windSpeed > 35;
    return {
      industry: 'construction' as IndustryType,
      title: 'Civil Infrastructure & Site Labor Safety',
      score: windStop ? 78 : weather.temperature > 35 ? 70 : 25,
      status: windStop ? 'warning' : 'optimal',
      summary: `Outdoor labor thermal safety: ${weather.temperature > 32 ? 'Heat Stress Caution' : 'Safe'}. Crane operation: ${windStop ? 'SUSPENDED (High Wind)' : 'Permitted'}.`,
      keyMetrics: [
        { label: 'Tower Crane Wind Limit', value: `${weather.windSpeed} / 35 km/h`, trend: windStop ? 'up' : 'neutral' },
        { label: 'Wet Bulb Globe Temp', value: `${(weather.temperature * 0.85).toFixed(1)}°C`, trend: 'neutral' },
        { label: 'Concrete Pour Window', value: weather.precipitation > 1 ? 'Rain Delay' : 'Favorable', trend: 'neutral' },
      ],
      actionItems: [
        'Secure scaffold sheetings and high-elevation loose materials immediately.',
        'Enforce mandatory 15-minute hydration breaks per hour for outdoor crews.',
        'Verify site drainage pumps prior to incoming rain shower fronts.',
      ],
    };
  };

  const calculateAviation = () => {
    return {
      industry: 'aviation' as IndustryType,
      title: 'Commercial Aviation & Airport Operations',
      score: weather.visibility < 2 || weather.windGusts > 45 ? 88 : 30,
      status: weather.windGusts > 40 ? 'warning' : 'optimal',
      summary: `Runway visual range: ${weather.visibility} km. Terminal de-icing requirement: ${weather.temperature < 3 ? 'Active' : 'Standby'}.`,
      keyMetrics: [
        { label: 'Crosswind Component', value: `${weather.windSpeed} km/h`, trend: 'neutral' },
        { label: 'Low-Level Wind Shear', value: weather.windGusts > 35 ? 'Moderate Shear' : 'Low Shear', trend: 'neutral' },
        { label: 'Ceiling & Cloud Base', value: `${weather.cloudCover}% Overcast`, trend: 'neutral' },
      ],
      actionItems: [
        'Prepare runway de-icing fluid trucks for scheduled apron departures.',
        'Brief ground handlers on high-wind baggage cart safety locks.',
        'Issue pilot SIGMET advisories for localized thermal updrafts.',
      ],
    };
  };

  const calculateRetail = () => {
    return {
      industry: 'retail' as IndustryType,
      title: 'Retail Commerce & Foot Traffic Index',
      score: weather.precipitation > 10 ? 65 : 15,
      status: weather.precipitation > 10 ? 'notice' : 'optimal',
      summary: `Weather-driven foot traffic index: ${weather.precipitation > 5 ? '-18% Drop (In-Store)' : '+8% Boost'}. E-commerce delivery demand surge expected.`,
      keyMetrics: [
        { label: 'Outdoor Pedestrian Rate', value: weather.precipitation > 5 ? 'Suppressed' : 'High Traffic', trend: 'neutral' },
        { label: 'Seasonal Item Lift', value: weather.temperature > 28 ? '+24% Cold Beverage' : 'Standard', trend: 'up' },
        { label: 'Last-Mile Delivery Buffer', value: '+8 minutes', trend: 'neutral' },
      ],
      actionItems: [
        'Adjust local store staffing shifts to match rain-impacted shopping windows.',
        'Promote quick app-based delivery fulfillment options.',
        'Optimize HVAC comfort thresholds inside retail shopping centers.',
      ],
    };
  };

  const industriesMap: Record<IndustryType, any> = {
    logistics: calculateLogistics(),
    energy: calculateEnergy(),
    agriculture: calculateAgriculture(),
    construction: calculateConstruction(),
    aviation: calculateAviation(),
    retail: calculateRetail(),
  };

  const currentData = industriesMap[selectedIndustry];

  const industryTabItems = [
    { id: 'logistics', name: 'Logistics & Supply Chain', icon: Truck },
    { id: 'energy', name: 'Energy & Utilities', icon: Zap },
    { id: 'agriculture', name: 'Agriculture & AgTech', icon: Sprout },
    { id: 'construction', name: 'Construction & Civil', icon: HardHat },
    { id: 'aviation', name: 'Aviation & Maritime', icon: Plane },
    { id: 'retail', name: 'Retail & Commerce', icon: ShoppingBag },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">CROSS-SECTOR IMPACT</span>
          <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2 mt-0.5">
            <SlidersHorizontal className="w-4 h-4 text-sky-400" />
            OPERATIONAL DECISION ENGINE
          </h3>
          <p className="text-[11px] font-mono text-slate-500 mt-0.5">Automated meteorological risk modeling tailored for enterprise sectors in {location.name}</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-sky-400 bg-sky-500/10 border border-sky-500/30 px-3 py-1.5 rounded-xl uppercase">
          <TrendingUp className="w-4 h-4 text-sky-400" /> Real-time Algorithms Active
        </div>
      </div>

      {/* Sector Selection Tabs in Bento style */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {industryTabItems.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedIndustry === item.id;
          const data = industriesMap[item.id as IndustryType];

          let scoreColor = 'text-emerald-400';
          if (data.score > 70) scoreColor = 'text-rose-400';
          else if (data.score > 40) scoreColor = 'text-amber-400';

          return (
            <button
              key={item.id}
              onClick={() => setSelectedIndustry(item.id as IndustryType)}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-24 ${
                isSelected
                  ? 'bg-slate-950 border-sky-500 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                <span className={`text-xs font-mono font-bold ${scoreColor}`}>
                  {data.score} <span className="text-[9px] text-slate-500 font-normal">/100</span>
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-white block truncate uppercase tracking-wider">{item.name}</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold block mt-0.5">
                  {data.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Sector Impact Panel */}
      <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">SECTOR ANALYSIS</span>
            <h4 className="text-xl font-bold text-white uppercase tracking-tight mt-0.5">{currentData.title}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{currentData.summary}</p>
          </div>

          <div className="shrink-0 p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-right">
            <span className="text-[10px] uppercase font-mono text-slate-500 block tracking-widest">Sector Risk Index</span>
            <span className="text-2xl font-light tracking-tight text-sky-400 font-mono mt-0.5 block">{currentData.score} / 100</span>
          </div>
        </div>

        {/* Sector Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {currentData.keyMetrics.map((m: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-900/80 border border-slate-800/80 rounded-xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">{m.label}</span>
              <span className="text-lg font-mono font-bold text-white mt-1 block">{m.value}</span>
            </div>
          ))}
        </div>

        {/* Actionable Protocol Checklist */}
        <div className="space-y-3">
          <h5 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-sky-400" /> Operational Protocol & Mitigation Checklist
          </h5>
          <div className="space-y-2">
            {currentData.actionItems.map((action: string, i: number) => (
              <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-200 font-sans leading-normal">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
