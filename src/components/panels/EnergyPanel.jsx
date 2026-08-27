import React, { useState } from 'react';
import { useStationData } from '../../context/StationDataContext';
import {
  Zap,
  BatteryCharging,
  Fuel,
  ArrowDown,
  Activity,
  Server,
  Sun,
  Wind,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { getStatusColor } from '../../utils/stationHealth';

export default function EnergyPanel() {
  const { energyData, selectedStation } = useStationData();
  const [selectedEnergyStation, setSelectedEnergyStation] = useState(
    selectedStation === 'combined' ? 'maitri' : selectedStation
  );

  const currentEnergy = energyData[selectedEnergyStation] || energyData.maitri;

  const totalGenMW = (currentEnergy.totalGeneration / 1000).toFixed(2);
  const totalConMW = (currentEnergy.totalConsumption / 1000).toFixed(2);
  const netSurplusKW = currentEnergy.totalGeneration - currentEnergy.totalConsumption;

  return (
    <div className="w-full h-full p-6 space-y-6 select-none overflow-y-auto bg-[#070b12]/95 backdrop-blur-xl">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
            <span>Station Microgrid & Energy Infrastructure</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              SYNCHRONIZED MICROGRID
            </span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time power generation, cogeneration heat recovery, battery storage buffers, and sub-tier distribution.
          </p>
        </div>

        {/* Station Selector */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 self-start">
          <button
            onClick={() => setSelectedEnergyStation('maitri')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              selectedEnergyStation === 'maitri'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Maitri Microgrid
          </button>
          <button
            onClick={() => setSelectedEnergyStation('bharati')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              selectedEnergyStation === 'bharati'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bharati Microgrid
          </button>
        </div>
      </div>

      {/* Main KPI Stats Row (from Prompt specifications) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Total Power */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Total Power</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-slate-100 mt-2">
            {totalConMW} <span className="text-sm font-normal text-slate-400">MW</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-1">Grid Active Load</div>
        </div>

        {/* Generation */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Generation</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-2">
            {totalGenMW} <span className="text-sm font-normal text-slate-400">MW</span>
          </div>
          <div className="text-[10px] font-mono text-emerald-500 mt-1">
            +{netSurplusKW} kW Surplus
          </div>
        </div>

        {/* Consumption */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Consumption</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-cyan-300 mt-2">
            {totalConMW} <span className="text-sm font-normal text-slate-400">MW</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-1">415V / 50 Hz Synchronized</div>
        </div>

        {/* Battery */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Battery</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-emerald-300 mt-2">
            {currentEnergy.batteryStoragePercent}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full"
              style={{ width: `${currentEnergy.batteryStoragePercent}%` }}
            />
          </div>
        </div>

        {/* Fuel */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Fuel Storage</span>
            <Fuel
              className={`w-4 h-4 ${
                currentEnergy.fuelStoragePercent < 30 ? 'text-rose-400' : 'text-amber-400'
              }`}
            />
          </div>
          <div
            className={`text-2xl font-mono font-extrabold mt-2 ${
              currentEnergy.fuelStoragePercent < 30 ? 'text-rose-400' : 'text-amber-300'
            }`}
          >
            {currentEnergy.fuelStoragePercent}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                currentEnergy.fuelStoragePercent < 30 ? 'bg-rose-500' : 'bg-amber-400'
              }`}
              style={{ width: `${currentEnergy.fuelStoragePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Animated Interactive Energy-Flow Diagram */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-display font-bold text-slate-100 flex items-center gap-2">
              <span>Dynamic Microgrid Energy Flow Vector</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                LIVE REAL-TIME ROUTING
              </span>
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Power flow cascading from primary generation → buffers → station distribution.
            </p>
          </div>
        </div>

        {/* Tiered Flow Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* TIER 1: POWER GENERATION */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono font-bold text-emerald-400">
              <span>1. GENERATION SOURCES</span>
              <Zap className="w-3.5 h-3.5" />
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs font-semibold text-slate-100">
                    {selectedEnergyStation === 'maitri'
                      ? 'CAT Diesel Gensets (DG-1 & 2)'
                      : 'Scania Cogeneration CHP Units'}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Base-load Thermal</div>
                </div>
                <div className="text-right font-mono text-xs font-bold text-amber-300">
                  {selectedEnergyStation === 'maitri' ? '500 kW' : '1,000 kW'}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs font-semibold text-slate-100">
                    Polar Wind Turbines + Solar
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Zero-Emission Buffer</div>
                </div>
                <div className="text-right font-mono text-xs font-bold text-emerald-300">
                  {selectedEnergyStation === 'maitri' ? '185 kW' : '140 kW'}
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <div className="inline-flex items-center gap-1.5 text-cyan-400 font-mono text-xs font-bold animate-pulse">
                <span>Output: {currentEnergy.totalGeneration} kW</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* TIER 2: STORAGE & BUFFERS */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono font-bold text-cyan-400">
              <span>2. STORAGE & RESERVES</span>
              <BatteryCharging className="w-3.5 h-3.5" />
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs font-semibold text-slate-100">
                    LiFePO4 Battery Bank
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Grid Stabilization</div>
                </div>
                <div className="text-right font-mono text-xs font-bold text-emerald-300">
                  {currentEnergy.batteryStoragePercent}%
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs font-semibold text-slate-100">
                    Fuel Reserve Depots
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">ATF Sub-zero Grade</div>
                </div>
                <div
                  className={`text-right font-mono text-xs font-bold ${
                    currentEnergy.fuelStoragePercent < 30 ? 'text-rose-400' : 'text-amber-300'
                  }`}
                >
                  {currentEnergy.fuelStoragePercent}%
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <div className="inline-flex items-center gap-1.5 text-cyan-400 font-mono text-xs font-bold animate-pulse">
                <span>Synchronized Feed</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* TIER 3: RESEARCH STATION MAIN BUS */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono font-bold text-amber-400">
              <span>3. MAIN 415V BUS</span>
              <Server className="w-3.5 h-3.5" />
            </div>

            <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-center space-y-1">
              <div className="text-[11px] font-mono text-cyan-300 font-bold uppercase">
                {selectedEnergyStation === 'maitri'
                  ? 'Maitri Microgrid Distribution Switchboard'
                  : 'Bharati High-Efficiency Smart Grid'}
              </div>
              <div className="text-xl font-mono font-extrabold text-slate-100">
                {currentEnergy.totalConsumption} kW
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Frequency: 50.04 Hz • PF: 0.98
              </div>
            </div>

            <div className="pt-2 text-center">
              <div className="inline-flex items-center gap-1.5 text-cyan-400 font-mono text-xs font-bold animate-pulse">
                <span>Branching Out</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* TIER 4: SUBSYSTEM CONSUMERS */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono font-bold text-blue-400">
              <span>4. SUBSYSTEMS & LIVING</span>
              <Layers className="w-3.5 h-3.5" />
            </div>

            <div className="space-y-1.5">
              <div className="p-2 rounded bg-slate-800/80 flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-300">Habitats & Life Support</span>
                <span className="text-slate-100 font-bold">188 kW</span>
              </div>
              <div className="p-2 rounded bg-slate-800/80 flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-300">Scientific Laboratories</span>
                <span className="text-slate-100 font-bold">150 kW</span>
              </div>
              <div className="p-2 rounded bg-slate-800/80 flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-300">Satellite Comms & ISRO Link</span>
                <span className="text-slate-100 font-bold">86 kW</span>
              </div>
              <div className="p-2 rounded bg-slate-800/80 flex items-center justify-between font-mono text-[11px]">
                <span className="text-slate-300">Water Pump / De-icing Grids</span>
                <span className="text-slate-100 font-bold">88 kW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
