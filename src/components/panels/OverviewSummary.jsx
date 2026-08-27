import React from 'react';
import { useStationData } from '../../context/StationDataContext';
import {
  ShieldCheck,
  Zap,
  Radio,
  Thermometer,
  Wind,
  Layers,
  Activity,
  ArrowRight,
  Sparkles,
  Award,
  Users,
  Compass,
} from 'lucide-react';

export default function OverviewSummary() {
  const {
    maitriMetrics,
    bharatiMetrics,
    weather,
    setSelectedStation,
    setActiveTab,
  } = useStationData();

  return (
    <div className="w-full h-full p-6 space-y-6 select-none overflow-y-auto bg-[#070b12]/95 backdrop-blur-xl">
      {/* Overview Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-cyan-950/80 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
              43rd Indian Scientific Expedition to Antarctica (ISEA)
            </span>
            <span className="text-xs font-mono text-emerald-400">• MISSION DAY 268</span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-slate-100">
            Indian Antarctic Research Station Network
          </h2>
          <p className="text-xs text-slate-300 font-mono mt-1 max-w-2xl">
            Autonomous Digital Twin synchronizing real-time microgrid operations, polar meteorological arrays, cryogenic laboratory suites, and satellite ground links for Maitri and Bharati.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('3d')}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-extrabold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 self-start lg:self-auto"
        >
          <span>Launch 3D Command View</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dual Station Comparative Showcase Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MAITRI CARD */}
        <div className="p-6 rounded-3xl glass-panel border border-amber-500/30 hover:border-amber-500/50 transition-all space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                ESTABLISHED 1989 • QUEEN MAUD LAND
              </span>
              <h3 className="text-xl font-display font-bold text-slate-100 mt-1">
                Maitri Research Station
              </h3>
              <div className="text-xs font-mono text-slate-400">
                Coordinates: 70°45′57″S 11°44′09″E • Schirmacher Oasis
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-extrabold text-amber-300">
                {maitriMetrics.healthScore}%
              </div>
              <div className="text-[10px] font-mono text-slate-400">STATION HEALTH</div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400 text-[10px]">TEMP / WIND</div>
              <div className="font-bold text-slate-100 mt-1">
                {weather.maitri.outdoorTemp}°C / {weather.maitri.windSpeed} km/h
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400 text-[10px]">CREW CAPACITY</div>
              <div className="font-bold text-slate-100 mt-1">22 / 25 Wintering</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400 text-[10px]">ACTIVE ALERTS</div>
              <div className="font-bold text-amber-400 mt-1">
                {maitriMetrics.activeAlertsCount} Warning
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Maitri features containerized two-tier modular architecture on steel stilts with district heating recovery from diesel generators and freshwater supplied through a heated pipeline from Lake Priyadarshini.
          </p>

          <button
            onClick={() => {
              setSelectedStation('maitri');
              setActiveTab('3d');
            }}
            className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-colors flex items-center justify-center gap-2"
          >
            <span>Explore Maitri 3D Twin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* BHARATI CARD */}
        <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 hover:border-cyan-500/50 transition-all space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                COMMISSIONED 2012 • PRINCESS ELIZABETH LAND
              </span>
              <h3 className="text-xl font-display font-bold text-slate-100 mt-1">
                Bharati Research Station
              </h3>
              <div className="text-xs font-mono text-slate-400">
                Coordinates: 69°24′28″S 76°11′14″E • Larsemann Hills
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-extrabold text-cyan-300">
                {bharatiMetrics.healthScore}%
              </div>
              <div className="text-[10px] font-mono text-slate-400">STATION HEALTH</div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400 text-[10px]">TEMP / WIND</div>
              <div className="font-bold text-slate-100 mt-1">
                {weather.bharati.outdoorTemp}°C / {weather.bharati.windSpeed} km/h
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400 text-[10px]">CREW CAPACITY</div>
              <div className="font-bold text-slate-100 mt-1">47 / 72 Total</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400 text-[10px]">ACTIVE ALERTS</div>
              <div className="font-bold text-cyan-400 mt-1">
                {bharatiMetrics.activeAlertsCount} Warning
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Bharati features state-of-the-art aerodynamic architecture elevated on hydraulic stilts to prevent snow drifts. Houses specialized oceanographic labs, cryogenic ice-core vaults, and an ISRO satellite earth station.
          </p>

          <button
            onClick={() => {
              setSelectedStation('bharati');
              setActiveTab('3d');
            }}
            className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-colors flex items-center justify-center gap-2"
          >
            <span>Explore Bharati 3D Twin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
