import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Wind,
  Thermometer,
  ShieldAlert,
  ArrowUpRight,
  Trash2,
} from 'lucide-react';
import { EnterpriseAsset } from '../types';

interface EnterpriseAssetTrackerProps {
  assets: EnterpriseAsset[];
  onAddAsset: (newAsset: EnterpriseAsset) => void;
  onRemoveAsset: (id: string) => void;
}

export const EnterpriseAssetTracker: React.FC<EnterpriseAssetTrackerProps> = ({
  assets,
  onAddAsset,
  onRemoveAsset,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<'All' | 'Critical' | 'High' | 'Moderate' | 'Low'>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding new asset
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'Warehouse Hub' | 'Solar Farm' | 'Port Terminal' | 'Fleet Corridor' | 'Construction Site' | 'Data Center'>('Warehouse Hub');
  const [newCity, setNewCity] = useState('Tokyo');
  const [newLat, setNewLat] = useState('35.6762');
  const [newLon, setNewLon] = useState('139.6503');

  // Filter logic
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'All' || asset.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created: EnterpriseAsset = {
      id: `asset-${Date.now().toString().slice(-4)}`,
      name: newName.trim(),
      type: newType,
      city: newCity,
      latitude: parseFloat(newLat) || 35.6762,
      longitude: parseFloat(newLon) || 139.6503,
      riskScore: Math.floor(Math.random() * 40) + 15,
      riskLevel: 'Low',
      temperature: 21.5,
      windSpeed: 12.0,
      precipitationProb: 10,
      activeAlertsCount: 0,
      primaryRiskFactor: 'Monitoring Active',
      lastUpdated: 'Just now',
    };

    onAddAsset(created);
    setNewName('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Title & Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">FACILITY FLEET MONITOR</span>
          <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2 mt-0.5">
            <Building2 className="w-4 h-4 text-sky-400" />
            ENTERPRISE ASSET VULNERABILITY FLEET
          </h3>
          <p className="text-[11px] font-mono text-slate-500 mt-0.5">Real-time risk scoring across infrastructure hubs, solar farms, and fleet corridors</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-sky-500/20 transition flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Facility
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="SEARCH FACILITY, TYPE, OR CITY..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 uppercase tracking-wider"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto font-mono text-xs">
          {(['All', 'Critical', 'High', 'Moderate', 'Low'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilterRisk(level)}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider whitespace-nowrap transition ${
                filterRisk === level
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Grid in Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => {
            let riskBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            if (asset.riskLevel === 'Critical') riskBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse';
            else if (asset.riskLevel === 'High') riskBadge = 'bg-orange-500/10 text-orange-400 border-orange-500/30';
            else if (asset.riskLevel === 'Moderate') riskBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/30';

            return (
              <div
                key={asset.id}
                className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl hover:border-slate-700 transition flex flex-col justify-between space-y-4 relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">{asset.type}</span>
                      <h4 className="text-base font-bold text-white uppercase tracking-tight mt-0.5">{asset.name}</h4>
                      <p className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-500" /> {asset.city} ({asset.latitude.toFixed(2)}°, {asset.longitude.toFixed(2)}°)
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded-lg border shrink-0 uppercase ${riskBadge}`}>
                      {asset.riskLevel}
                    </span>
                  </div>

                  {/* Primary Threat Banner */}
                  <div className="mt-3 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Primary Threat Factor</span>
                    <span className="text-amber-300 font-mono font-medium block truncate">{asset.primaryRiskFactor}</span>
                  </div>

                  {/* Live Metrics row */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Temperature</span>
                      <span className="text-white font-bold">{asset.temperature}°C</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Wind Velocity</span>
                      <span className="text-white font-bold">{asset.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>

                {/* Footer action bar */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase">
                  <span>Updated {asset.lastUpdated}</span>
                  <button
                    onClick={() => onRemoveAsset(asset.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition"
                    title="Remove Facility Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs uppercase">
            No enterprise assets matching criteria. Click "Add Facility" to register new infrastructure.
          </div>
        )}
      </div>

      {/* Add New Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white uppercase tracking-tight">Register Enterprise Facility</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white font-mono">✕</button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono uppercase text-[10px] tracking-widest mb-1">Facility Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pacific Northwest Distribution Hub"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono uppercase text-[10px] tracking-widest mb-1">Facility Category</label>
                <select
                  value={newType}
                  onChange={(e: any) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="Warehouse Hub">Warehouse Hub</option>
                  <option value="Solar Farm">Solar Farm</option>
                  <option value="Port Terminal">Port Terminal</option>
                  <option value="Fleet Corridor">Fleet Corridor</option>
                  <option value="Construction Site">Construction Site</option>
                  <option value="Data Center">Data Center</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono uppercase text-[10px] tracking-widest mb-1">City / Region</label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-mono uppercase text-[10px] tracking-widest mb-1">Latitude (°)</label>
                  <input
                    type="text"
                    value={newLat}
                    onChange={(e) => setNewLat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono uppercase text-[10px] tracking-widest mb-1">Longitude (°)</label>
                  <input
                    type="text"
                    value={newLon}
                    onChange={(e) => setNewLon(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800 font-mono">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold uppercase tracking-wider rounded-xl shadow-md shadow-sky-500/20"
                >
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
