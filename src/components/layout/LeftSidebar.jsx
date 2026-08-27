import React from 'react';
import { useStationData } from '../../context/StationDataContext';
import {
  Box,
  LayoutDashboard,
  Zap,
  CloudSun,
  Server,
  AlertTriangle,
  BarChart3,
  SlidersHorizontal,
  Radio,
  Building2,
  Compass,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { getStatusColor } from '../../utils/stationHealth';

export default function LeftSidebar({ onOpenSimulator }) {
  const {
    activeTab,
    setActiveTab,
    selectedStation,
    setSelectedStation,
    maitriMetrics,
    bharatiMetrics,
    alerts,
  } = useStationData();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: '3d', label: '3D Digital Twin', icon: Box, badge: 'PRIMARY' },
    { id: 'energy', label: 'Energy & Power', icon: Zap },
    { id: 'environment', label: 'Environment', icon: CloudSun },
    { id: 'fleet', label: 'Equipment Fleet', icon: Server },
    { id: 'alerts', label: 'Live Alerts', icon: AlertTriangle, count: alerts.filter(a => a.active).length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleStationClick = (stationId) => {
    setSelectedStation(stationId);
    setActiveTab('3d');
  };

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] glass-panel border-r border-cyan-500/20 flex flex-col justify-between p-3 select-none z-20 overflow-y-auto">
      {/* Upper Navigation Sections */}
      <div className="space-y-4">
        {/* Primary Station Focus Section */}
        <div>
          <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400 px-3 uppercase mb-2">
            Research Stations
          </div>
          <div className="space-y-1">
            {/* Maitri Button */}
            <button
              onClick={() => handleStationClick('maitri')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                selectedStation === 'maitri' && activeTab === '3d'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="tracking-wide">Maitri Station</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                {maitriMetrics.healthScore}%
              </span>
            </button>

            {/* Bharati Button */}
            <button
              onClick={() => handleStationClick('bharati')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                selectedStation === 'bharati' && activeTab === '3d'
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="tracking-wide">Bharati Station</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                {bharatiMetrics.healthScore}%
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div>
          <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400 px-3 uppercase mb-2">
            Mission Control
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 shadow-[0_0_10px_rgba(6,182,212,0.15)] font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-bold tracking-wider">
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Health Gauges & Scenario Simulator Button */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        {/* Dynamic Station Health Scores */}
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              MAITRI HEALTH
            </span>
            <span className="font-bold text-amber-300">{maitriMetrics.healthScore}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${maitriMetrics.healthScore}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono pt-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              BHARATI HEALTH
            </span>
            <span className="font-bold text-cyan-300">{bharatiMetrics.healthScore}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${bharatiMetrics.healthScore}%` }}
            />
          </div>
        </div>

        {/* Fault Injection Button */}
        <button
          onClick={onOpenSimulator}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-semibold transition-all shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Fault Injector / Sim</span>
        </button>

        {/* Mission Identification Footnote */}
        <div className="text-center">
          <p className="text-[10px] font-mono text-slate-400 tracking-tight">
            NCPOR • Ministry of Earth Sciences
          </p>
        </div>
      </div>
    </aside>
  );
}
