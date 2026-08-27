import React from 'react';
import { useStationData } from '../../context/StationDataContext';
import {
  X,
  SlidersHorizontal,
  Flame,
  Snowflake,
  Fuel,
  Sparkles,
  RefreshCw,
  Play,
  Pause,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function SimulatorModal({ isOpen, onClose }) {
  const {
    injectScenario,
    simulationRunning,
    setSimulationRunning,
    simulationSpeed,
    setSimulationSpeed,
  } = useStationData();

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'normal',
      title: 'Nominal Routine Baseline',
      desc: 'Restores all generator temperatures, fuel levels, and microgrids to optimal green states.',
      icon: CheckCircle2,
      badge: 'STABLE',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300 hover:border-emerald-400',
    },
    {
      id: 'gen_overheat',
      title: 'Maitri Generator 01 Thermal Runaway',
      desc: 'Simulates cylinder head overheat to 98.4°C and heavy load vibration (triggers 3D red warning beacon).',
      icon: Flame,
      badge: 'CRITICAL',
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-300 hover:border-rose-400',
    },
    {
      id: 'fuel_critical',
      title: 'Bharati Fuel Depot Low Capacity',
      desc: 'Drops Bharati fuel reserve to 14% (< 20% critical threshold) and triggers rationing alert.',
      icon: Fuel,
      badge: 'WARNING',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300 hover:border-amber-400',
    },
    {
      id: 'blizzard',
      title: 'Polar Blizzard Category 3 Storm',
      desc: 'Ramps katabatic winds to 104 km/h with heavy snow drift particles, drops temp to -48°C.',
      icon: Snowflake,
      badge: 'WEATHER',
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-300 hover:border-blue-400',
    },
    {
      id: 'aurora',
      title: 'Severe Aurora Australis Geomagnetic Storm',
      desc: 'Simulates high Kp-index 7.8 ionospheric storm with intense Southern Lights sky glow.',
      icon: Sparkles,
      badge: 'IONOSPHERE',
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300 hover:border-cyan-400',
    },
  ];

  const handleSelectScenario = (id) => {
    injectScenario(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-xl glass-panel border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-display font-bold text-slate-100">
                Digital Twin Telemetry & Scenario Injector
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Trigger real-time telemetry anomalies to verify that 3D assets, alerts, and health scores dynamically update.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Engine Speed & Pause Controls */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSimulationRunning(!simulationRunning)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                simulationRunning
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
              }`}
            >
              {simulationRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Telemetry: ACTIVE</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Telemetry: PAUSED</span>
                </>
              )}
            </button>
          </div>

          {/* Speed Multiplier */}
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
            <span>Tick Speed:</span>
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd)}
                className={`px-2 py-1 rounded-lg ${
                  simulationSpeed === spd
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/50'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Scenario Selection Grid */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider px-1">
            Pre-Configured Fault & Climate Scenarios
          </div>

          <div className="space-y-2">
            {scenarios.map((sc) => {
              const Icon = sc.icon;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc.id)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all hover:scale-[1.01] ${sc.color}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-slate-100 flex items-center gap-2">
                        <span>{sc.title}</span>
                      </div>
                      <p className="text-[11px] font-sans text-slate-300 mt-0.5 leading-tight">
                        {sc.desc}
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 font-bold uppercase shrink-0">
                    {sc.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
