import React from 'react';
import { MapPin, Radio, Compass, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { STATUS_THEMES } from '../../utils/statusEngine';

export default function AntarcticOverview({ onSelectStation, maitriMetrics, bharatiMetrics, weather }) {
  const maitriWeather = weather?.maitri;
  const bharatiWeather = weather?.bharati;

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center p-6 bg-[#050811] text-slate-100 overflow-auto">
      {/* Top Banner */}
      <div className="text-center mb-6 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
          <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span>INDIAN ANTARCTIC SCIENTIFIC EXPEDITION (ISEA) NETWORK</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white uppercase font-sans">
          Antarctic Continental Digital Twin Overview
        </h2>
        <p className="text-sm text-slate-400 font-mono mt-1">
          Synchronized dual-station telemetry across 3,000 km polar baseline vector
        </p>
      </div>

      {/* Main Continental SVG & Station Nodes */}
      <div className="w-full max-w-5xl aspect-[16/10] max-h-[580px] relative rounded-3xl border border-cyan-500/30 bg-[#070d1a] shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
        {/* Technical polar background grid */}
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full absolute inset-0 select-none"
        >
          <defs>
            <radialGradient id="polarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#082f49" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.8" />
            </radialGradient>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.07)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="1000" height="650" fill="url(#polarGlow)" />
          <rect width="1000" height="650" fill="url(#gridPattern)" />

          {/* Latitude Concentric Rings (South Polar Coordinates) */}
          <circle cx="500" cy="360" r="120" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="500" cy="360" r="220" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="500" cy="360" r="300" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Antarctica Continental Landmass Outline */}
          <path
            d="M 280,240 Q 320,160 450,150 T 640,160 T 780,220 Q 860,300 840,420 T 720,540 T 520,580 T 360,520 T 260,380 Z"
            fill="rgba(15, 23, 42, 0.85)"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeOpacity="0.6"
            style={{ filter: 'drop-shadow(0 0 15px rgba(56, 189, 248, 0.2))' }}
          />

          {/* Ice Shelves & Glacial Contours */}
          <path
            d="M 290,260 Q 420,200 620,200 T 760,260"
            fill="none"
            stroke="rgba(148, 163, 184, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />

          {/* 3,000 km Inter-Station Baseline Vector */}
          <g id="baseline-link">
            {/* Animated link beam */}
            <line
              x1="390"
              y1="210"
              x2="720"
              y2="280"
              stroke="#06B6D4"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              className="animate-[dash_2s_linear_infinite]"
            />
            {/* Baseline Distance Label */}
            <g transform="translate(555, 232)">
              <rect x="-60" y="-12" width="120" height="24" rx="6" fill="#0B132B" stroke="#06B6D4" strokeWidth="1" />
              <text x="0" y="4" textAnchor="middle" fill="#38BDF8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                ~3,000 km LINK
              </text>
            </g>
          </g>

          {/* SOUTH POLE MARKER */}
          <g transform="translate(500, 360)">
            <circle cx="0" cy="0" r="3" fill="#94A3B8" />
            <text x="0" y="16" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="monospace">
              90°S SOUTH POLE
            </text>
          </g>

          {/* 1. MAITRI STATION PIN (Queen Maud Land, 70°45′S 11°44′E) */}
          <g
            transform="translate(390, 210)"
            className="cursor-pointer group"
            onClick={() => onSelectStation('maitri')}
          >
            <circle cx="0" cy="0" r="28" fill="rgba(6, 182, 212, 0.15)" stroke="#06B6D4" strokeWidth="1" className="animate-pulse" />
            <circle cx="0" cy="0" r="10" fill="#0E7490" stroke="#22D3EE" strokeWidth="2" />
            <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
            {/* Callout Card */}
            <g transform="translate(-130, -50)">
              <rect x="0" y="0" width="120" height="42" rx="6" fill="#090E17" stroke="#06B6D4" strokeWidth="1.5" />
              <text x="10" y="16" fill="#22D3EE" fontSize="11" fontWeight="bold" fontFamily="monospace">
                MAITRI
              </text>
              <text x="10" y="30" fill="#94A3B8" fontSize="8" fontFamily="monospace">
                Schirmacher Oasis
              </text>
              <circle cx="106" cy="18" r="4" fill="#10B981" />
            </g>
          </g>

          {/* 2. BHARATI STATION PIN (Princess Elizabeth Land, 69°24′S 76°11′E) */}
          <g
            transform="translate(720, 280)"
            className="cursor-pointer group"
            onClick={() => onSelectStation('bharati')}
          >
            <circle cx="0" cy="0" r="28" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981" strokeWidth="1" className="animate-pulse" />
            <circle cx="0" cy="0" r="10" fill="#047857" stroke="#34D399" strokeWidth="2" />
            <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
            {/* Callout Card */}
            <g transform="translate(20, -50)">
              <rect x="0" y="0" width="120" height="42" rx="6" fill="#090E17" stroke="#10B981" strokeWidth="1.5" />
              <text x="10" y="16" fill="#34D399" fontSize="11" fontWeight="bold" fontFamily="monospace">
                BHARATI
              </text>
              <text x="10" y="30" fill="#94A3B8" fontSize="8" fontFamily="monospace">
                Larsemann Hills
              </text>
              <circle cx="106" cy="18" r="4" fill="#10B981" />
            </g>
          </g>
        </svg>

        {/* Bottom Station Cards (Interactive Click-Through) */}
        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-1 md:grid-cols-2 gap-4 pointer-events-auto">
          {/* Maitri Card */}
          <div
            onClick={() => onSelectStation('maitri')}
            className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 hover:bg-slate-800/90 transition-all cursor-pointer shadow-xl flex items-center justify-between group"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h4 className="text-base font-bold text-white font-mono">Maitri Research Station</h4>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Schirmacher Oasis • 70°45′57″S 11°44′09″E
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs font-mono text-slate-300">
                <span>Temp: <strong className="text-cyan-300">{maitriWeather?.outdoorTemp || -34}°C</strong></span>
                <span>Wind: <strong className="text-cyan-300">{maitriWeather?.windSpeed || 42} km/h</strong></span>
                <span>Health: <strong className="text-emerald-400">{maitriMetrics?.healthScore || 87}%</strong></span>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 group-hover:bg-cyan-500 group-hover:text-black font-bold font-mono text-xs flex items-center gap-1 transition-all">
              <span>Open 2D Site</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bharati Card */}
          <div
            onClick={() => onSelectStation('bharati')}
            className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 hover:bg-slate-800/90 transition-all cursor-pointer shadow-xl flex items-center justify-between group"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="text-base font-bold text-white font-mono">Bharati Research Station</h4>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Larsemann Hills • 69°24′28″S 76°11′14″E
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs font-mono text-slate-300">
                <span>Temp: <strong className="text-emerald-300">{bharatiWeather?.outdoorTemp || -28}°C</strong></span>
                <span>Wind: <strong className="text-emerald-300">{bharatiWeather?.windSpeed || 36} km/h</strong></span>
                <span>Health: <strong className="text-emerald-400">{bharatiMetrics?.healthScore || 94}%</strong></span>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 group-hover:bg-emerald-500 group-hover:text-black font-bold font-mono text-xs flex items-center gap-1 transition-all">
              <span>Open 2D Site</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
