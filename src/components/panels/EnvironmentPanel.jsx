import React, { useState } from 'react';
import { useStationData } from '../../context/StationDataContext';
import {
  Thermometer,
  Wind,
  Compass,
  Gauge,
  Snowflake,
  Eye,
  Sun,
  Sparkles,
  CloudRain,
  Activity,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function EnvironmentPanel() {
  const { weather, selectedStation } = useStationData();
  const [selectedEnvStation, setSelectedEnvStation] = useState(
    selectedStation === 'combined' ? 'maitri' : selectedStation
  );

  const currentWeather = weather[selectedEnvStation] || weather.maitri;

  // Mock historical curves for charts
  const tempHistory = Array.from({ length: 12 }, (_, i) => ({
    time: `${12 - i * 2}h`,
    outdoor: (currentWeather.outdoorTemp + Math.sin(i * 0.8) * 3).toFixed(1),
    indoor: (currentWeather.indoorTemp + Math.cos(i * 0.5) * 0.4).toFixed(1),
  }));

  const windHistory = Array.from({ length: 12 }, (_, i) => ({
    time: `${12 - i * 2}h`,
    wind: Math.max(10, Math.round(currentWeather.windSpeed + Math.sin(i * 0.7) * 12)),
    gust: Math.max(20, Math.round(currentWeather.windGust + Math.cos(i * 0.6) * 16)),
  }));

  const baroHistory = Array.from({ length: 12 }, (_, i) => ({
    time: `${12 - i * 2}h`,
    pressure: (currentWeather.pressure + Math.sin(i * 0.4) * 4).toFixed(1),
  }));

  return (
    <div className="w-full h-full p-6 space-y-6 select-none overflow-y-auto bg-[#070b12]/95 backdrop-blur-xl">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
            <span>Antarctic Synoptic Meteorology & Climate Sensors</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              WMO SYNOP LINK
            </span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Surface observation telemetry transmitted to Indian Meteorological Department (IMD) & Global Telecommunication System (GTS).
          </p>
        </div>

        {/* Station Weather Selector */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 self-start">
          <button
            onClick={() => setSelectedEnvStation('maitri')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              selectedEnvStation === 'maitri'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Maitri (Schirmacher Oasis)
          </button>
          <button
            onClick={() => setSelectedEnvStation('bharati')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              selectedEnvStation === 'bharati'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bharati (Larsemann Hills)
          </button>
        </div>
      </div>

      {/* Main Environmental Sensor KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature Card (Outdoor vs Indoor) */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>SURFACE TEMPERATURE</span>
            <Thermometer className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-mono font-extrabold text-cyan-300">
                {currentWeather.outdoorTemp}°C
              </div>
              <div className="text-[10px] font-mono text-slate-400">OUTDOOR AMBIENT</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-mono font-bold text-emerald-400">
                +{currentWeather.indoorTemp}°C
              </div>
              <div className="text-[10px] font-mono text-slate-400">INDOOR HABITAT</div>
            </div>
          </div>
        </div>

        {/* Wind Speed & Direction Compass */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>KATABATIC WIND VECTOR</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-mono font-extrabold text-slate-100">
                {currentWeather.windSpeed}{' '}
                <span className="text-sm font-normal text-slate-400">km/h</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                GUST: <strong className="text-amber-300">{currentWeather.windGust} km/h</strong>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold text-cyan-300">
                {currentWeather.windDirection}
              </div>
              <div className="text-[10px] font-mono text-slate-400">DIRECTION</div>
            </div>
          </div>
        </div>

        {/* Atmospheric Pressure */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>BAROMETRIC PRESSURE</span>
            <Gauge className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-extrabold text-blue-300">
              {currentWeather.pressure}{' '}
              <span className="text-sm font-normal text-slate-400">hPa</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              TREND: <span className="text-emerald-400 font-semibold">Steady / Rising (+0.3 hPa/3h)</span>
            </div>
          </div>
        </div>

        {/* Visibility & Snow Drift */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>VISIBILITY & DRIFT</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-mono font-extrabold text-emerald-300">
                {currentWeather.visibility}{' '}
                <span className="text-sm font-normal text-slate-400">km</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">OPTICAL VISIBILITY</div>
            </div>
            <div className="text-right">
              <div className="text-base font-mono font-bold text-slate-200">
                {currentWeather.snowAccumulationRate} cm/h
              </div>
              <div className="text-[10px] font-mono text-slate-400">SNOW DRIFT RATE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Solar Radiation Flux */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">
              Solar Global Irradiance
            </div>
            <div className="text-lg font-mono font-bold text-slate-100">
              {currentWeather.solarRadiation} W/m²{' '}
              <span className="text-xs font-normal text-slate-400">(Albedo + Polar Flux)</span>
            </div>
          </div>
        </div>

        {/* Aurora Australis Ionosphere Activity */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">
              Aurora Australis Geomagnetic
            </div>
            <div className="text-lg font-mono font-bold text-slate-100">
              {currentWeather.auroraActivity}
            </div>
          </div>
        </div>

        {/* Relative Humidity */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">
              Relative Polar Humidity
            </div>
            <div className="text-lg font-mono font-bold text-slate-100">
              {currentWeather.humidity}%{' '}
              <span className="text-xs font-normal text-slate-400">(Super-Dry Polar Air)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Telemetry Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Temperature Comparison Chart */}
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-slate-200">
              24-Hour Temperature Delta (Outdoor vs Habitat)
            </h3>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-cyan-400">• Outdoor</span>
              <span className="text-emerald-400">• Indoor</span>
            </div>
          </div>

          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempHistory}>
                <XAxis dataKey="time" stroke="#475569" fontSize={10} />
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
                <Line
                  type="monotone"
                  dataKey="outdoor"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="indoor"
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wind Speed & Gusts Chart */}
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-slate-200">
              Katabatic Wind Profile & Gust Dynamics (km/h)
            </h3>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-blue-400">• Sustained</span>
              <span className="text-amber-400">• Gust</span>
            </div>
          </div>

          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={windHistory}>
                <defs>
                  <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={10} />
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
                <Area
                  type="monotone"
                  dataKey="gust"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  fill="none"
                />
                <Area
                  type="monotone"
                  dataKey="wind"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fill="url(#windGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
