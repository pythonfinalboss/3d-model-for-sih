import React from 'react';
import { useStationData } from '../../context/StationDataContext';
import {
  BarChart3,
  TrendingUp,
  Cpu,
  Radio,
  FileCheck,
  Award,
  Zap,
  Globe,
  Database,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AnalyticsPanel() {
  const { maitriMetrics, bharatiMetrics } = useStationData();

  // Scientific data throughput by discipline
  const scienceData = [
    { name: 'Atmospheric Physics', dataGB: 480 },
    { name: 'ISRO Satellite Imagery', dataGB: 1850 },
    { name: 'Oceanography & Marine', dataGB: 620 },
    { name: 'Glaciology Ice-Cores', dataGB: 340 },
    { name: 'Geomagnetism & Seismo', dataGB: 520 },
    { name: 'Meteorological Synop', dataGB: 210 },
  ];

  // Energy source distribution
  const powerMixData = [
    { name: 'Cogeneration CHP', value: 55, color: '#3b82f6' },
    { name: 'CAT Diesel Gensets', value: 28, color: '#f59e0b' },
    { name: 'Polar Wind Turbines', value: 14, color: '#10b981' },
    { name: 'Snow-Albedo Solar PV', value: 3, color: '#06b6d4' },
  ];

  return (
    <div className="w-full h-full p-6 space-y-6 select-none overflow-y-auto bg-[#070b12]/95 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
            <span>Mission Science Throughput & Infrastructure Analytics</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              EXPEDITION TELEMETRY
            </span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Aggregated data downlinks, diesel burn conservation indexes, and MTBF operational reliability.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TOTAL DATA DOWNLINKED</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-cyan-300 mt-2">
            4.02 <span className="text-sm font-normal text-slate-400">TB</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-1">Direct to NCAOR & ISRO</div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>CLEAN ENERGY OFFSET</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-emerald-300 mt-2">
            18.4%
          </div>
          <div className="text-[10px] font-mono text-emerald-500 mt-1">42,000 L Fuel Saved</div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>COMMUNICATION UPTIME</span>
            <Radio className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-slate-100 mt-2">
            99.82%
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-1">GSAT-14 & Iridium Links</div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>EQUIPMENT MTBF RATING</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-amber-300 mt-2">
            4,850 <span className="text-sm font-normal text-slate-400">Hrs</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-1">Polar Cold Survival Spec</div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Science Data Throughput Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-slate-200">
              Weekly Research Telemetry & Downlink Volume (GB)
            </h3>
            <span className="text-xs font-mono text-cyan-400">Total: 4,020 GB</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scienceData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  stroke="#475569"
                  fontSize={10}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#475569" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="dataGB" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Energy Mix Distribution Pie */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3 flex flex-col justify-between">
          <h3 className="text-sm font-mono font-bold text-slate-200">
            Network Energy Generation Mix
          </h3>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={powerMixData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={4}
                >
                  {powerMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-xs font-mono">
            {powerMixData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px]">{item.name}</span>
                </div>
                <span className="font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
