import React, { useState } from 'react';
import { useStationData } from '../../context/StationDataContext';
import { getStatusColor } from '../../utils/stationHealth';
import {
  X,
  Activity,
  Zap,
  Thermometer,
  ShieldCheck,
  Clock,
  Wrench,
  AlertTriangle,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function AssetDetailPanel() {
  const { selectedAsset, setSelectedAssetId, setAssets } = useStationData();
  const [activeGraphTab, setActiveGraphTab] = useState('load'); // 'load' | 'temp' | 'power'
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  if (!selectedAsset) return null;

  const statusColor = getStatusColor(selectedAsset.status);
  const stationName = selectedAsset.stationId === 'maitri' ? 'Maitri' : 'Bharati';

  // Format data for Recharts
  const chartData = selectedAsset.history || [];

  // Actions
  const handleRunDiagnostic = () => {
    setDiagnosticRunning(true);
    setActionFeedback('Running sub-system telemetry scan...');
    setTimeout(() => {
      setDiagnosticRunning(false);
      setActionFeedback('✓ Diagnostic complete: All sensors calibrated.');
      setTimeout(() => setActionFeedback(null), 3500);
    }, 1200);
  };

  const handleAcknowledge = () => {
    setActionFeedback('✓ Warning acknowledged by mission operator.');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleResetAlarm = () => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === selectedAsset.id) {
          return {
            ...a,
            status: 'healthy',
            health: Math.max(a.health, 92),
            temperature: a.type === 'generator' ? 82.0 : a.temperature,
            load: a.type === 'fuel_tank' ? 75 : a.load,
          };
        }
        return a;
      })
    );
    setActionFeedback('✓ System reset to healthy nominal baseline.');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  return (
    <div className="absolute top-20 right-4 w-96 max-h-[calc(100vh-6rem)] glass-panel border border-cyan-500/30 rounded-2xl shadow-2xl z-30 flex flex-col select-none overflow-hidden animate-in fade-in slide-in-from-right-8 duration-300">
      {/* Top Header Bar */}
      <div className="p-4 border-b border-slate-800 flex items-start justify-between bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase tracking-wider">
              {selectedAsset.category || 'Station Asset'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Station: <strong className="text-slate-200">{stationName}</strong>
            </span>
          </div>
          <h2 className="text-base font-display font-bold text-slate-100 leading-snug">
            {selectedAsset.name}
          </h2>
          <div className="text-[11px] font-mono text-slate-400">
            ID: <span className="text-slate-300">{selectedAsset.id}</span>
          </div>
        </div>

        <button
          onClick={() => setSelectedAssetId(null)}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          title="Close Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
        {/* Status & Core KPIs Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Status Badge Card */}
          <div
            className={`p-3 rounded-xl border flex flex-col justify-between ${statusColor.tailwindBg} ${statusColor.tailwindBorder}`}
          >
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">
              Operational Status
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: statusColor.hex }}
              />
              <span className={`font-mono font-extrabold text-sm ${statusColor.tailwindText}`}>
                {statusColor.label}
              </span>
            </div>
          </div>

          {/* Health Score Card */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wide flex items-center justify-between">
              <span>Asset Health</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono font-extrabold text-lg text-slate-100">
                {selectedAsset.health}%
              </span>
              <span className="text-[10px] text-slate-500">INDEX</span>
            </div>
          </div>

          {/* Load % Card */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wide flex items-center justify-between">
              <span>Operating Load</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono font-extrabold text-lg text-cyan-300">
                {selectedAsset.load}%
              </span>
            </div>
          </div>

          {/* Temperature Card */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wide flex items-center justify-between">
              <span>Core Temp</span>
              <Thermometer
                className={`w-3.5 h-3.5 ${
                  selectedAsset.temperature > 85 ? 'text-rose-400' : 'text-blue-400'
                }`}
              />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span
                className={`font-mono font-extrabold text-lg ${
                  selectedAsset.temperature > 85 ? 'text-rose-400' : 'text-slate-100'
                }`}
              >
                {selectedAsset.temperature}°C
              </span>
            </div>
          </div>
        </div>

        {/* Primary Power / Fuel Metric Readout */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30">
              <Zap className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                {selectedAsset.powerOutput
                  ? 'Power Output'
                  : selectedAsset.powerDraw
                  ? 'Power Draw'
                  : 'Fuel Reserve Level'}
              </div>
              <div className="font-mono font-bold text-sm text-slate-100">
                {selectedAsset.powerOutput
                  ? `${selectedAsset.powerOutput} kW`
                  : selectedAsset.powerDraw
                  ? `${selectedAsset.powerDraw} kW`
                  : `${selectedAsset.load}% (${selectedAsset.metrics?.fuelLevel || 'Nominal'})`}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-500">Last Updated</div>
            <div className="text-[11px] font-mono text-slate-300 flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3 text-slate-400" />
              {selectedAsset.lastUpdated}
            </div>
          </div>
        </div>

        {/* Historical Performance Graph (Recharts) */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-300">
              Recent Performance Trend
            </span>
            <div className="flex items-center p-0.5 rounded bg-slate-800 text-[10px] font-mono">
              <button
                onClick={() => setActiveGraphTab('load')}
                className={`px-2 py-0.5 rounded ${
                  activeGraphTab === 'load'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Load
              </button>
              <button
                onClick={() => setActiveGraphTab('temp')}
                className={`px-2 py-0.5 rounded ${
                  activeGraphTab === 'temp'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Temp
              </button>
            </div>
          </div>

          <div className="h-28 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="assetGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={
                        activeGraphTab === 'temp' && selectedAsset.temperature > 85
                          ? '#ef4444'
                          : '#06b6d4'
                      }
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={
                        activeGraphTab === 'temp' && selectedAsset.temperature > 85
                          ? '#ef4444'
                          : '#06b6d4'
                      }
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  stroke="#475569"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={activeGraphTab === 'load' ? 'load' : 'temperature'}
                  stroke={
                    activeGraphTab === 'temp' && selectedAsset.temperature > 85
                      ? '#ef4444'
                      : '#22d3ee'
                  }
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#assetGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subsystem Health Checklist */}
        {selectedAsset.subsystems && selectedAsset.subsystems.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono font-bold text-slate-300 px-1">
              Subsystem Diagnostic Mesh
            </div>
            <div className="space-y-1">
              {selectedAsset.subsystems.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[11px] font-mono"
                >
                  <span className="text-slate-300">{sub.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">{sub.value}</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        sub.status === 'warning'
                          ? 'bg-amber-400'
                          : sub.status === 'critical'
                          ? 'bg-rose-500'
                          : 'bg-emerald-400'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls & Diagnostic Trigger */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          {actionFeedback && (
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] text-center animate-in fade-in">
              {actionFeedback}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleRunDiagnostic}
              disabled={diagnosticRunning}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] font-semibold border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${diagnosticRunning ? 'animate-spin' : ''}`} />
              <span>Run Diagnostic</span>
            </button>

            {selectedAsset.status === 'warning' || selectedAsset.status === 'critical' ? (
              <button
                onClick={handleResetAlarm}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-[11px] font-semibold border border-amber-500/50 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Reset Alarm</span>
              </button>
            ) : (
              <button
                onClick={handleAcknowledge}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] font-semibold border border-slate-700 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Calibrate</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
