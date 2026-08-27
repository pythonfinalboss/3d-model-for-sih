import React from 'react';
import { useStationData } from '../../context/StationDataContext';
import {
  Compass,
  Wind,
  Eye,
  Zap,
  Radio,
  Bell,
  Volume2,
  VolumeX,
  RotateCcw,
  Layers,
  Sparkles,
  Camera,
  Play,
  Pause,
  SlidersHorizontal,
  Flame,
  Snowflake,
} from 'lucide-react';
import { getStatusColor } from '../../utils/stationHealth';

export default function TopHeader({ onOpenSimulator }) {
  const {
    selectedStation,
    setSelectedStation,
    weather,
    alerts,
    currentStationMetrics,
    syncSecondsAgo,
    soundEnabled,
    toggleSound,
    cameraPreset,
    setCameraPreset,
    showLabels3D,
    setShowLabels3D,
    simulationRunning,
    setSimulationRunning,
    setActiveTab,
  } = useStationData();

  const currentStationKey = selectedStation === 'combined' ? 'maitri' : selectedStation;
  const currentWeather = weather[currentStationKey] || weather.maitri;

  // Station power consumption total in MW
  const totalPowerMW = (currentStationMetrics.totalPowerDraw / 1000).toFixed(2);
  const totalGenMW = (currentStationMetrics.totalPowerOutput / 1000).toFixed(2);

  const activeAlerts = alerts.filter(
    (a) => a.active && (selectedStation === 'combined' || a.stationId === selectedStation)
  );
  const hasCritical = activeAlerts.some((a) => a.severity === 'critical');

  return (
    <header className="h-16 w-full glass-panel border-b border-cyan-500/20 px-4 flex items-center justify-between z-30 select-none relative">
      {/* LEFT: Branding & Station Network Title */}
      <div className="flex items-center gap-4">
        {/* National Flag / Mission Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Snowflake className="w-5 h-5 text-cyan-300 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-display font-extrabold tracking-wider text-slate-100 uppercase">
                Antarctic Digital Twin
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
                v2.4 LIVE
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 tracking-tight">
              MAITRI + BHARATI RESEARCH NETWORK
            </p>
          </div>
        </div>

        {/* Station Switcher Tabs */}
        <div className="hidden lg:flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800 shadow-inner ml-2">
          <button
            onClick={() => setSelectedStation('maitri')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all duration-200 ${
              selectedStation === 'maitri'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            MAITRI
          </button>
          <button
            onClick={() => setSelectedStation('bharati')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all duration-200 ${
              selectedStation === 'bharati'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            BHARATI
          </button>
          <button
            onClick={() => setSelectedStation('combined')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all duration-200 ${
              selectedStation === 'combined'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            COMBINED
          </button>
        </div>
      </div>

      {/* CENTER: Live Polar Weather & Telemetry Ticker */}
      <div className="hidden xl:flex items-center gap-6 font-mono text-xs text-slate-300 bg-slate-900/60 border border-slate-800/80 px-4 py-1.5 rounded-xl">
        {/* Temperature */}
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">🌡</span>
          <span className="font-bold text-slate-100">{currentWeather.outdoorTemp}°C</span>
          <span className="text-[10px] text-slate-500">OUTDOOR</span>
        </div>

        <div className="w-px h-3.5 bg-slate-800" />

        {/* Wind Speed */}
        <div className="flex items-center gap-2">
          <Wind className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-slate-100">{currentWeather.windSpeed} km/h</span>
          <span className="text-[10px] text-slate-500">{currentWeather.windDirection}</span>
        </div>

        <div className="w-px h-3.5 bg-slate-800" />

        {/* Visibility */}
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-bold text-slate-100">Vis {currentWeather.visibility} km</span>
        </div>

        <div className="w-px h-3.5 bg-slate-800" />

        {/* Power */}
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>
            Power: <strong className="text-amber-300">{totalPowerMW} MW</strong>
          </span>
        </div>

        <div className="w-px h-3.5 bg-slate-800" />

        {/* Connected Sensors */}
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            Sensors:{' '}
            <strong className="text-emerald-300">{currentStationMetrics.sensorRatio}</strong> Online
          </span>
        </div>
      </div>

      {/* RIGHT: Quick Controls, Active Alerts Badge & Sync Pulse */}
      <div className="flex items-center gap-3">
        {/* Active Alerts Pill Button */}
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
            hasCritical
              ? 'bg-rose-500/20 border border-rose-500/60 text-rose-300 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.4)]'
              : activeAlerts.length > 0
              ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
              : 'bg-slate-800/80 border border-slate-700 text-slate-300'
          }`}
          title="View Live Alarms"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="font-bold">Alerts: {activeAlerts.length}</span>
        </button>

        {/* Camera Views Selector */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800">
          <button
            onClick={() => setCameraPreset('default')}
            className={`p-1.5 rounded text-xs transition-colors ${
              cameraPreset === 'default'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Perspective Orbit View"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCameraPreset('topDown')}
            className={`p-1.5 rounded text-xs transition-colors ${
              cameraPreset === 'topDown'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Top-Down CAD Satellite View"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCameraPreset('orbit')}
            className={`p-1.5 rounded text-xs transition-colors ${
              cameraPreset === 'orbit'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Cinematic Auto-Orbit"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3D Floating Tags Toggle */}
        <button
          onClick={() => setShowLabels3D(!showLabels3D)}
          className={`p-2 rounded-lg border transition-colors ${
            showLabels3D
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle 3D Floating Asset Tags"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={toggleSound}
          className={`p-2 rounded-lg border transition-colors ${
            soundEnabled
              ? 'bg-slate-900 border-slate-800 text-cyan-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
          title={soundEnabled ? 'Mute Telemetry SFX' : 'Enable Telemetry SFX'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Scenario Simulator Modal Launcher */}
        <button
          onClick={onOpenSimulator}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border border-cyan-500/40 text-cyan-200 hover:border-cyan-400 text-xs font-mono font-semibold transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Scenario Injector</span>
        </button>

        {/* Live Sync Indicator */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] text-slate-400 whitespace-nowrap">
            Sync: <strong className="text-slate-200">{syncSecondsAgo}s ago</strong>
          </span>
        </div>
      </div>
    </header>
  );
}
