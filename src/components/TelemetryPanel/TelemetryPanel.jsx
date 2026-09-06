import React, { useState } from 'react';
import {
  X,
  Activity,
  Zap,
  Thermometer,
  Wind,
  Sun,
  Users,
  Battery,
  Flame,
  Cpu,
  AlertTriangle,
  Clock,
  Layers,
  Sparkles,
  Box,
} from 'lucide-react';
import { useStationData } from '../../context/StationDataContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  BUILDING_RELEVANT_METRICS,
  METRIC_METADATA,
} from '../../data/mockTelemetry';
import { STATUS_THEMES } from '../../utils/statusEngine';

export default function TelemetryPanel({
  building,
  secondsAgo = 0,
  onClose,
}) {
  const { setViewMode, setActiveTab, selectBuilding, activeTab } = useStationData();
  if (!building) return null;

  const {
    name,
    stationName,
    type,
    category,
    status = 'healthy',
    blueprintRef,
    description,
    telemetry = {},
    history = [],
    activeAlarms = [],
  } = building;

  const theme = STATUS_THEMES[status] || STATUS_THEMES.healthy;

  // Determine relevant metrics for this building type
  const relevantKeys =
    BUILDING_RELEVANT_METRICS[type] ||
    BUILDING_RELEVANT_METRICS.building;

  // Selected metric to graph in historical chart
  const defaultMetricKey = relevantKeys[0] || 'Temperature';
  const [activeGraphMetric, setActiveGraphMetric] = useState(defaultMetricKey);

  // Sync activeGraphMetric if building changes and current metric isn't in relevantKeys
  React.useEffect(() => {
    if (!relevantKeys.includes(activeGraphMetric)) {
      setActiveGraphMetric(relevantKeys[0] || 'Temperature');
    }
  }, [type, relevantKeys]);

  const activeMetricMeta = METRIC_METADATA[activeGraphMetric] || {
    label: activeGraphMetric,
    unit: '',
    format: (v) => `${v}`,
  };

  const getMetricIcon = (key) => {
    switch (key) {
      case 'Temperature':
        return <Thermometer className="w-4 h-4 text-cyan-400" />;
      case 'Wind_Speed':
        return <Wind className="w-4 h-4 text-indigo-400" />;
      case 'Solar_Radiation':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'Occupancy':
        return <Users className="w-4 h-4 text-emerald-400" />;
      case 'Battery_Level':
        return <Battery className="w-4 h-4 text-emerald-400" />;
      case 'Generator_Load':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'Fuel_Level':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'Energy_Consumption':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <aside className="w-80 sm:w-96 h-full bg-[#080d19]/95 border-l border-cyan-500/30 shadow-[-10px_0_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col z-30 font-mono text-slate-100 select-none overflow-hidden animate-in slide-in-from-right-8 duration-200">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-800/80 bg-gradient-to-r from-slate-900/90 to-[#0c1527] flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
              {stationName || 'Antarctic Station'}
            </span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight font-sans leading-tight">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
            <span>{category}</span>
            {blueprintRef && (
              <>
                <span>•</span>
                <span className="text-cyan-300/80">{blueprintRef}</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Body - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Status Banner */}
        <div
          className={`p-3 rounded-2xl border flex items-center justify-between ${theme.badgeBg}`}
        >
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full ${theme.dotBg} ${theme.pulseClass}`} />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider">
                {theme.label} STATUS
              </span>
              <div className="text-[10px] text-slate-400 font-sans">
                {status === 'healthy'
                  ? 'All operating parameters nominal'
                  : `${activeAlarms.length || 1} active warning/alert condition`}
              </div>
            </div>
          </div>
        </div>

        {/* Active Alarms list if any */}
        {activeAlarms.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Active Condition Alerts</span>
            </div>
            {activeAlarms.map((alm, idx) => (
              <div
                key={idx}
                className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                <span>{alm}</span>
              </div>
            ))}
          </div>
        )}

        {/* Building-Specific Live Telemetry Cards */}
        <div>
          <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Building Telemetry</span>
            <span className="text-[9px] text-slate-400 font-normal">Real-time values</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {relevantKeys.map((key) => {
              const meta = METRIC_METADATA[key] || {
                label: key,
                unit: '',
                format: (v) => `${v}`,
              };
              const rawVal = telemetry[key];
              const isSelectedForGraph = activeGraphMetric === key;

              return (
                <div
                  key={key}
                  onClick={() => setActiveGraphMetric(key)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelectedForGraph
                      ? 'bg-cyan-500/15 border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/60">
                      {getMetricIcon(key)}
                    </div>
                    <div>
                      <div className="text-xs text-slate-300">{meta.label}</div>
                      <div className="text-[9px] text-slate-500">{meta.description}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-white">
                      {rawVal !== undefined ? meta.format(rawVal) : 'N/A'}
                    </div>
                    {isSelectedForGraph && (
                      <span className="text-[9px] text-cyan-300 font-bold uppercase">
                        Charted
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 24-Hour Historical Performance Graph */}
        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                24H PERFORMANCE
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {activeMetricMeta.label}
            </span>
          </div>

          <div className="w-full h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={history}
                margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="telemetryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.stroke} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={theme.stroke} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#64748B', fontSize: 8 }}
                  interval={5}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 8 }}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: theme.stroke,
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                  formatter={(val) => [activeMetricMeta.format(val), activeMetricMeta.label]}
                />
                <Area
                  type="monotone"
                  dataKey={activeGraphMetric}
                  stroke={theme.stroke}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#telemetryGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Building Description */}
        {description && (
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400 font-sans leading-relaxed">
            {description}
          </div>
        )}
      </div>

      {/* Panel Footer */}
      <div className="p-3 border-t border-slate-800 bg-[#060a14] flex items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{secondsAgo}s ago</span>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === '3d' ? (
            <button
              onClick={() => {
                selectBuilding(building.id);
                setViewMode('2d');
                setActiveTab('2d');
              }}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all text-xs font-mono font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(59,130,246,0.4)]"
              title="Inspect this building on 2D Blueprint"
            >
              <Layers className="w-3 h-3 text-blue-200" />
              <span>2D PLAN</span>
            </button>
          ) : (
            <button
              onClick={() => {
                selectBuilding(building.id);
                setViewMode('3d');
                setActiveTab('3d');
              }}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all text-xs font-mono font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
              title="Inspect this building in 3D"
            >
              <Box className="w-3 h-3 text-cyan-200" />
              <span>3D TWIN</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs font-bold"
          >
            CLOSE
          </button>
        </div>
      </div>
    </aside>
  );
}
