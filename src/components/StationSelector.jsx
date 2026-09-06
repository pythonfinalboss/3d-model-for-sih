import React from 'react';
import { MapPin, Globe, Compass, Eye, Layers } from 'lucide-react';

export default function StationSelector({
  selectedStation,
  onSelectStation,
  viewMode = '2d',
  onToggleViewMode,
  maitriHealth = 87,
  bharatiHealth = 94,
}) {
  return (
    <div className="flex items-center gap-2">
      {/* Station Selector Buttons */}
      <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-inner">
        <button
          onClick={() => onSelectStation('maitri')}
          className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
            selectedStation === 'maitri'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>MAITRI</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-cyan-300">
            {maitriHealth}%
          </span>
        </button>

        <button
          onClick={() => onSelectStation('bharati')}
          className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
            selectedStation === 'bharati'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>BHARATI</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-emerald-300">
            {bharatiHealth}%
          </span>
        </button>

        <button
          onClick={() => onSelectStation('overview')}
          className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
            selectedStation === 'overview'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>OVERVIEW</span>
        </button>
      </div>

      {/* 2D Plan / 3D View Mode Switcher */}
      {selectedStation !== 'overview' && (
        <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => onToggleViewMode('2d')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
              viewMode === '2d'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Switch to 2D Top-Down Site Plan"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>2D PLAN</span>
          </button>

          <button
            onClick={() => onToggleViewMode('3d')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
              viewMode === '3d'
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Switch to 3D Spatial Visualization"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D VIEW</span>
          </button>
        </div>
      )}
    </div>
  );
}
