import React from 'react';
import { useStationData } from '../../context/StationDataContext';
import {
  Layers,
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
  FileText,
  Globe,
} from 'lucide-react';

export default function LeftSidebar({ onOpenSimulator }) {
  const {
    activeTab,
    setActiveTab,
    selectedStation,
    setSelectedStation,
    viewMode,
    setViewMode,
    maitriHealth,
    bharatiHealth,
    alerts,
    setIsBlueprintOpen,
  } = useStationData();

  const activeAlertsCount = alerts.filter((a) => a.active).length;

  const handleStationClick = (stationId) => {
    setSelectedStation(stationId);
    if (stationId === 'overview') {
      setActiveTab('overview');
    } else {
      setActiveTab(viewMode || '2d');
    }
  };

  const navTabs = [
    { id: '2d', label: '2D Site Plan', icon: Layers, badge: 'PRIMARY' },
    { id: '3d', label: '3D Spatial Twin', icon: Box },
    { id: 'alerts', label: 'Active Alerts', icon: AlertTriangle, count: activeAlertsCount },
    { id: 'energy', label: 'Energy & Power', icon: Zap },
    { id: 'environment', label: 'Environment & AWS', icon: CloudSun },
    { id: 'fleet', label: 'Equipment Fleet', icon: Server },
    { id: 'overview', label: 'Station Macro KPI', icon: LayoutDashboard },
    { id: 'analytics', label: 'Research Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 h-full glass-panel border-r border-cyan-500/20 flex flex-col justify-between p-3 select-none z-20 overflow-y-auto font-mono text-slate-100 custom-scrollbar">
      {/* Upper Navigation Sections */}
      <div className="space-y-4">
        {/* Primary Station Focus Section */}
        <div>
          <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400 px-3 uppercase mb-2">
            Research Stations
          </div>
          <div className="space-y-1.5">
            {/* Maitri Button */}
            <button
              onClick={() => handleStationClick('maitri')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                selectedStation === 'maitri' && activeTab !== 'overview'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="tracking-wide">Maitri Station</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                {maitriHealth}%
              </span>
            </button>

            {/* Bharati Button */}
            <button
              onClick={() => handleStationClick('bharati')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                selectedStation === 'bharati' && activeTab !== 'overview'
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="tracking-wide">Bharati Station</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                {bharatiHealth}%
              </span>
            </button>

            {/* Continental Overview Button */}
            <button
              onClick={() => handleStationClick('overview')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                selectedStation === 'overview' || activeTab === 'overview'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Pan-Antarctic Link</span>
              </div>
              <span className="text-[10px] text-slate-400">3,000km</span>
            </button>
          </div>
        </div>

        {/* View & Monitoring Tabs */}
        <div>
          <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400 px-3 uppercase mb-2">
            Operations & Views
          </div>
          <div className="space-y-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === '2d' || tab.id === '3d') {
                      setViewMode(tab.id);
                      if (tab.id === '3d' && selectedStation === 'overview') {
                        setSelectedStation('maitri');
                      }
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                      {tab.badge}
                    </span>
                  )}

                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-red-500/25 text-red-400 font-bold animate-pulse">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Tool Shortcuts */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2">
        {/* Blueprint Master Plan Button */}
        <button
          onClick={() => setIsBlueprintOpen(true)}
          className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono flex items-center gap-2 transition-all shadow-sm"
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Blueprint Reference</span>
        </button>

        {/* Fault Simulator Button */}
        <button
          onClick={onOpenSimulator}
          className="w-full px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-mono flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Scenario Simulator</span>
          </div>
          <span className="text-[9px] text-amber-400">TEST</span>
        </button>
      </div>
    </aside>
  );
}
