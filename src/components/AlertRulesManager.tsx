import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Bell,
  CheckCircle2,
  Trash2,
  Radio,
  Clock,
  ShieldAlert,
  Send,
  Zap,
} from 'lucide-react';
import { AlertRule } from '../types';

interface AlertRulesManagerProps {
  rules: AlertRule[];
  onToggleRule: (id: string) => void;
  onAddRule: (newRule: AlertRule) => void;
  onDeleteRule: (id: string) => void;
}

export const AlertRulesManager: React.FC<AlertRulesManagerProps> = ({
  rules,
  onToggleRule,
  onAddRule,
  onDeleteRule,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // New rule form state
  const [ruleName, setRuleName] = useState('');
  const [metric, setMetric] = useState<'temperature' | 'windSpeed' | 'precipitation' | 'uvIndex' | 'usAqi' | 'visibility'>('windSpeed');
  const [operator, setOperator] = useState<'>' | '<' | '>='>('>');
  const [threshold, setThreshold] = useState('35');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [assetTarget, setAssetTarget] = useState('All Assets');

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    const created: AlertRule = {
      id: `rule-${Date.now().toString().slice(-4)}`,
      name: ruleName.trim(),
      metric,
      operator,
      threshold: parseFloat(threshold) || 30,
      severity,
      assetTarget,
      enabled: true,
      lastTriggered: 'Never',
    };

    onAddRule(created);
    setRuleName('');
    setShowAddModal(false);
  };

  // Mock Incident Log Data
  const incidentLogs = [
    {
      id: 'inc-101',
      ruleName: 'High Wind Velocity Hazard (> 40 km/h)',
      facility: 'Botany Bay Construction Site 9',
      triggeredAt: '12 minutes ago',
      value: '44.0 km/h',
      severity: 'critical',
      status: 'Dispatched to Site Manager & Webhook',
    },
    {
      id: 'inc-102',
      ruleName: 'Hazardous Air Quality Index (> 150 US AQI)',
      facility: 'JFK Aviation Air Cargo Terminal 4',
      triggeredAt: '1 hour ago',
      value: '162 AQI',
      severity: 'high',
      status: 'Notification Sent to Environmental Team',
    },
    {
      id: 'inc-103',
      ruleName: 'Extreme Heat Stress (> 35°C)',
      facility: 'Jurong Offshore Port Terminal',
      triggeredAt: '3 hours ago',
      value: '36.2°C',
      severity: 'high',
      status: 'Hydration Protocol Auto-Triggered',
    }
  ];

  return (
    <div className="space-y-6">
      {/* Threshold Rules Panel in Bento style */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">RULE ENGINE</span>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              AUTOMATED THRESHOLD ALERT RULES ENGINE
            </h3>
            <p className="text-[11px] font-mono text-slate-500 mt-0.5">Configure continuous meteorological breach monitoring across facility target groups</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-sky-500/20 transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Create Rule
          </button>
        </div>

        {/* Rules List in Bento cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => {
            let sevBadge = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
            if (rule.severity === 'critical') sevBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            else if (rule.severity === 'high') sevBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/30';

            return (
              <div
                key={rule.id}
                className={`p-4 rounded-2xl border transition flex items-start justify-between gap-3 ${
                  rule.enabled
                    ? 'bg-slate-950/60 border-slate-800'
                    : 'bg-slate-950/20 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 font-mono">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${sevBadge}`}>
                      {rule.severity}
                    </span>
                    <span className="text-[11px] text-sky-400 uppercase">Target: {rule.assetTarget}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white uppercase tracking-tight">{rule.name}</h4>

                  <p className="text-xs text-slate-400 font-mono">
                    Condition: <span className="text-amber-300 font-bold">{rule.metric} {rule.operator} {rule.threshold}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Toggle Switch */}
                  <button
                    onClick={() => onToggleRule(rule.id)}
                    className={`w-10 h-6 rounded-full p-1 transition ${
                      rule.enabled ? 'bg-sky-500' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                        rule.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => onDeleteRule(rule.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                    title="Delete Rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Incident Breach History Log in Bento style */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">TELEMETRY INCIDENT AUDIT</span>
              <h4 className="text-base font-bold text-white uppercase tracking-tight mt-0.5">LIVE INCIDENT BREACH DISPATCH LOG</h4>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase">AUTO-WEBHOOK SYNC ACTIVE</span>
        </div>

        <div className="space-y-2.5">
          {incidentLogs.map((inc) => (
            <div
              key={inc.id}
              className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white uppercase tracking-tight">{inc.ruleName}</span>
                  <span className="text-rose-400 font-mono font-bold">[{inc.value}]</span>
                </div>
                <div className="text-slate-400 text-[11px] font-mono">
                  Facility: <span className="text-slate-200 font-medium">{inc.facility}</span> • {inc.triggeredAt}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sky-400 font-mono text-[11px] bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-500/30 shrink-0 uppercase">
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>{inc.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white uppercase tracking-tight">Configure Threshold Alert Trigger</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white font-mono">✕</button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono uppercase text-[10px] tracking-widest mb-1">Rule Identifier / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Extreme Gale Wind Threshold Alert"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-mono uppercase text-[10px] tracking-widest mb-1">Target Metric</label>
                  <select
                    value={metric}
                    onChange={(e: any) => setMetric(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  >
                    <option value="windSpeed">Wind Speed (km/h)</option>
                    <option value="temperature">Temperature (°C)</option>
                    <option value="precipitation">Precipitation (mm)</option>
                    <option value="uvIndex">UV Index</option>
                    <option value="usAqi">Air Quality (US AQI)</option>
                    <option value="visibility">Visibility (km)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono uppercase text-[10px] tracking-widest mb-1">Operator & Value</label>
                  <div className="flex items-center gap-1">
                    <select
                      value={operator}
                      onChange={(e: any) => setOperator(e.target.value)}
                      className="px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                    >
                      <option value=">">&gt;</option>
                      <option value="<">&lt;</option>
                      <option value=">=">&gt;=</option>
                    </select>
                    <input
                      type="number"
                      required
                      value={threshold}
                      onChange={(e) => setThreshold(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono uppercase text-[10px] tracking-widest mb-1">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e: any) => setSeverity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                >
                  <option value="low">Low - Informational</option>
                  <option value="medium">Medium - Operational Notice</option>
                  <option value="high">High - High Threat</option>
                  <option value="critical">Critical - Emergency Lockout</option>
                </select>
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
                  Save Trigger Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
