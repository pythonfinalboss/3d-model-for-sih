import React from 'react';
import {
  Thermometer,
  Wind,
  Zap,
  Battery,
  Flame,
  Users,
  Bell,
  Radio,
  Sliders,
  Volume2,
  VolumeX,
} from 'lucide-react';
import StationSelector from '../StationSelector';

export default function DashboardHeader({
  selectedStation,
  onSelectStation,
  viewMode,
  onToggleViewMode,
  weather,
  stationMetrics,
  maitriHealth,
  bharatiHealth,
  onOpenSimulator,
  soundEnabled,
  onToggleSound,
}) {
  const currentWeather = weather?.[selectedStation] || weather?.maitri || {};
  const activeAlertsCount = stationMetrics?.activeAlertsCount || 0;

  // Calculate station aggregates
  const totalPowerKW = stationMetrics?.totalPowerOutput || 1240;
  const powerDisplay = totalPowerKW >= 1000
    ? `${(totalPowerKW / 1000).toFixed(2)} MW`
    : `${totalPowerKW} kW`;

  // Aggregate fuel & battery
  const avgBattery = selectedStation === 'maitri' ? 78 : 88;
  const avgFuel = selectedStation === 'maitri' ? 68 : 82;
  const totalOccupancy = selectedStation === 'maitri' ? 24 : 38;

  return (
    <header className="h-16 bg-[#060a14]/95 border-b border-cyan-500/30 px-4 flex items-center justify-between shadow-2xl backdrop-blur-xl z-40 text-slate-100 font-mono select-none">
      {/* Brand Title & Station Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <Radio className="w-5 h-5 animate-pulse text-cyan-400" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-extrabold text-white tracking-widest uppercase font-sans">
              ANTARCTIC DIGITAL TWIN
            </h1>
            <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2 font-sans">
            <span className="text-cyan-300 font-bold font-mono uppercase">
              {selectedStation === 'overview'
                ? 'PAN-ANTARCTIC CONTINENTAL OVERVIEW'
                : selectedStation === 'maitri'
                ? 'MAITRI RESEARCH STATION'
                : 'BHARATI RESEARCH STATION'}
            </span>
            <span>•</span>
            <span className="text-slate-400 font-mono text-[10px]">
              Health: <strong className="text-emerald-400">{stationMetrics?.healthScore || 87}%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Middle Station & View Mode Switcher */}
      <div className="hidden lg:flex items-center gap-3">
        <StationSelector
          selectedStation={selectedStation}
          onSelectStation={onSelectStation}
          viewMode={viewMode}
          onToggleViewMode={onToggleViewMode}
          maitriHealth={maitriHealth}
          bharatiHealth={bharatiHealth}
        />
      </div>

      {/* Right Telemetry KPI Ticker */}
      <div className="flex items-center gap-3">
        {/* KPI Ticker Widgets */}
        <div className="hidden xl:flex items-center gap-2.5 bg-slate-900/80 px-3 py-1.5 rounded-2xl border border-slate-800 text-xs">
          {/* Temperature */}
          <div className="flex items-center gap-1.5 px-2 border-r border-slate-800">
            <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 text-[11px]">Temp:</span>
            <strong className="text-cyan-300 font-bold">
              {currentWeather.outdoorTemp !== undefined ? `${currentWeather.outdoorTemp}°C` : '-31.4°C'}
            </strong>
          </div>

          {/* Wind */}
          <div className="flex items-center gap-1.5 px-2 border-r border-slate-800">
            <Wind className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 text-[11px]">Wind:</span>
            <strong className="text-indigo-300 font-bold">
              {currentWeather.windSpeed !== undefined ? `${currentWeather.windSpeed} km/h` : '42 km/h'}
            </strong>
          </div>

          {/* Power */}
          <div className="flex items-center gap-1.5 px-2 border-r border-slate-800">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-slate-400 text-[11px]">Power:</span>
            <strong className="text-yellow-300 font-bold">{powerDisplay}</strong>
          </div>

          {/* Battery */}
          <div className="flex items-center gap-1.5 px-2 border-r border-slate-800">
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 text-[11px]">Battery:</span>
            <strong className="text-emerald-300 font-bold">{avgBattery}%</strong>
          </div>

          {/* Fuel */}
          <div className="flex items-center gap-1.5 px-2 border-r border-slate-800">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 text-[11px]">Fuel:</span>
            <strong className="text-amber-300 font-bold">{avgFuel}%</strong>
          </div>

          {/* Occupancy */}
          <div className="flex items-center gap-1.5 px-2 border-r border-slate-800">
            <Users className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-400 text-[11px]">Crew:</span>
            <strong className="text-white font-bold">{totalOccupancy}</strong>
          </div>

          {/* Alerts */}
          <div className="flex items-center gap-1.5 px-1">
            <Bell className={`w-3.5 h-3.5 ${activeAlertsCount > 0 ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
            <span className="text-slate-400 text-[11px]">Alerts:</span>
            <strong className={`font-bold ${activeAlertsCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {activeAlertsCount}
            </strong>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Simulator Trigger Button */}
          <button
            onClick={onOpenSimulator}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            title="Inject Fault Scenarios (Overheat, Blizzard, Fuel Leak)"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Simulate Fault</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors text-xs"
            title={soundEnabled ? 'Disable Mission Control Sound' : 'Enable Mission Control Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
