import React, { useState } from 'react';
import { useStationData } from '../../context/StationDataContext';
import { getStatusColor } from '../../utils/stationHealth';
import {
  X,
  Layers,
  MapPin,
  Eye,
  Radio,
  Zap,
  Activity,
  Flame,
  Plane,
  Wrench,
  Droplet,
  Compass,
  Maximize2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export default function BlueprintModal() {
  const {
    isBlueprintOpen,
    setIsBlueprintOpen,
    assets,
    setSelectedAssetId,
    interiorCutaway,
    setInteriorCutaway,
    setCameraPreset,
  } = useStationData();

  const [activeFigure, setActiveFigure] = useState('fig3'); // 'fig1' | 'fig2' | 'fig3' | 'fig4'
  const [hoveredNode, setHoveredNode] = useState(null);

  if (!isBlueprintOpen) return null;

  const maitriAssets = assets.filter((a) => a.stationId === 'maitri');
  const getAsset = (id) => maitriAssets.find((a) => a.id === id) || null;

  const handleSelectAsset = (assetId, cameraPresetTarget = null) => {
    setSelectedAssetId(assetId);
    if (cameraPresetTarget) {
      setCameraPreset(cameraPresetTarget);
    }
  };

  const handleFocus3D = (assetId, preset) => {
    setSelectedAssetId(assetId);
    if (preset) setCameraPreset(preset);
    setIsBlueprintOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-6xl h-[88vh] bg-[#070e1b] border-2 border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden text-slate-100 font-mono">
        
        {/* ================= BLUEPRINT MODAL HEADER ================= */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-[#0a192f] to-slate-900 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-wider text-cyan-300 uppercase">
                  Antarctic Research Station - Maitri, India
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-400/30">
                  REV 2.4 | SCHIRMACHER OASIS
                </span>
              </div>
              <div className="text-xs text-slate-400 tracking-wide font-sans">
                Integrated Site Master Plan & Detailed Compartment Layouts
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setInteriorCutaway((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all border ${
                interiorCutaway
                  ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{interiorCutaway ? 'Cutaway 3D Active' : 'Enable 3D Roof Cutaway'}</span>
            </button>

            <button
              onClick={() => setIsBlueprintOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= FIGURE NAVIGATION TABS ================= */}
        <div className="px-6 py-2.5 bg-[#050c18] border-b border-cyan-500/20 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'fig3', label: 'Figure 3: Main Station Complex (Central Hub)', tag: 'PRIMARY HUB' },
            { id: 'fig4', label: 'Figure 4: Peripheral Logistics & Utilities (Fuel, Workshop, Helipad)', tag: 'PERIPHERAL' },
            { id: 'fig2', label: 'Figure 2: Schematic Site Flow & Utility Conduits', tag: 'CONNECTIVITY' },
            { id: 'fig1', label: 'Figure 1: Site Plan (Overhead View)', tag: 'OVERVIEW' },
          ].map((fig) => (
            <button
              key={fig.id}
              onClick={() => setActiveFigure(fig.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeFigure === fig.id
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span>{fig.label}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                {fig.tag}
              </span>
            </button>
          ))}
        </div>

        {/* ================= MAIN BLUEPRINT VIEWPORT & INTERACTIVE MAP ================= */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left / Center: Interactive Vector Blueprint Canvas */}
          <div className="lg:col-span-8 p-6 bg-[#030914] relative flex flex-col justify-between overflow-y-auto border-r border-cyan-500/20">
            {/* Background CAD Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e2238_1px,transparent_1px),linear-gradient(to_bottom,#0e2238_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />

            {/* --- FIGURE 3: MAIN STATION COMPLEX (CENTRAL HUB) --- */}
            {activeFigure === 'fig3' && (
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                  <div className="text-xs font-bold text-cyan-400 tracking-wider">
                    FIGURE 3: MAIN STATION COMPLEX (CENTRAL HUB & WING COMPARTMENTS)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Coordinates: 70°45′57″S 11°44′09″E | Stilt Elevation: +1.4m
                  </div>
                </div>

                {/* Blueprint Diagram Schematic Box */}
                <div className="border-2 border-cyan-500/40 rounded-2xl p-6 bg-[#06152a]/60 relative shadow-inner">
                  {/* North Indicator */}
                  <div className="absolute top-4 right-4 flex flex-col items-center text-cyan-400">
                    <Compass className="w-6 h-6 animate-pulse" />
                    <span className="text-[10px] font-bold">N</span>
                  </div>

                  {/* L-Shaped Central Hub Room Grid */}
                  <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto my-4">
                    {/* West Wing: Labs */}
                    <div
                      onMouseEnter={() => setHoveredNode('maitri-labs')}
                      onClick={() => handleSelectAsset('maitri-labs', 'hub')}
                      className="p-3.5 rounded-xl border border-cyan-400/60 bg-cyan-950/40 hover:bg-cyan-500/20 cursor-pointer transition-all hover:scale-105 group"
                    >
                      <div className="text-[10px] text-cyan-400 font-bold">WEST WING</div>
                      <div className="text-xs font-bold text-slate-100 group-hover:text-cyan-300">
                        Labs & Research
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">Spectrometer • Magnetometer</div>
                    </div>

                    {/* West Wing: Comms */}
                    <div
                      onMouseEnter={() => setHoveredNode('maitri-comms')}
                      onClick={() => handleSelectAsset('maitri-comms', 'hub')}
                      className="p-3.5 rounded-xl border border-cyan-400/60 bg-cyan-950/40 hover:bg-cyan-500/20 cursor-pointer transition-all hover:scale-105 group"
                    >
                      <div className="text-[10px] text-cyan-400 font-bold">WEST WING</div>
                      <div className="text-xs font-bold text-slate-100 group-hover:text-cyan-300">
                        Comms & Radio Room
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">HF Transceiver • GSAT-14</div>
                    </div>

                    {/* West Wing: Admin */}
                    <div
                      onMouseEnter={() => setHoveredNode('maitri-admin')}
                      onClick={() => handleSelectAsset('maitri-admin', 'hub')}
                      className="p-3.5 rounded-xl border border-cyan-400/60 bg-cyan-950/40 hover:bg-cyan-500/20 cursor-pointer transition-all hover:scale-105 group"
                    >
                      <div className="text-[10px] text-cyan-400 font-bold">WEST WING</div>
                      <div className="text-xs font-bold text-slate-100 group-hover:text-cyan-300">
                        Admin & Commander
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">Command Cabin • Logs</div>
                    </div>

                    {/* Central Node: Reception & Airlock */}
                    <div
                      onMouseEnter={() => setHoveredNode('maitri-reception')}
                      onClick={() => handleSelectAsset('maitri-reception', 'hub')}
                      className="p-3.5 rounded-xl border border-amber-400/60 bg-amber-950/40 hover:bg-amber-500/20 cursor-pointer transition-all hover:scale-105 group"
                    >
                      <div className="text-[10px] text-amber-400 font-bold">CENTRAL NODE</div>
                      <div className="text-xs font-bold text-slate-100 group-hover:text-amber-300">
                        Reception & Airlock
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">Pressurized Thermal Port</div>
                    </div>

                    {/* Central Node: Medical Bay */}
                    <div
                      onMouseEnter={() => setHoveredNode('maitri-medical')}
                      onClick={() => handleSelectAsset('maitri-medical', 'hub')}
                      className="p-3.5 rounded-xl border border-emerald-400/60 bg-emerald-950/40 hover:bg-emerald-500/20 cursor-pointer transition-all hover:scale-105 group"
                    >
                      <div className="text-[10px] text-emerald-400 font-bold">CENTRAL NODE</div>
                      <div className="text-xs font-bold text-slate-100 group-hover:text-emerald-300">
                        Medical Bay
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">Polar Trauma • Telemedicine</div>
                    </div>

                    {/* East Wing: Quarters */}
                    <div
                      onMouseEnter={() => setHoveredNode('maitri-quarters')}
                      onClick={() => handleSelectAsset('maitri-quarters', 'hub')}
                      className="p-3.5 rounded-xl border border-blue-400/60 bg-blue-950/40 hover:bg-blue-500/20 cursor-pointer transition-all hover:scale-105 group"
                    >
                      <div className="text-[10px] text-blue-400 font-bold">EAST WING</div>
                      <div className="text-xs font-bold text-slate-100 group-hover:text-blue-300">
                        Living Quarters
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">25 Wintering Bunks</div>
                    </div>

                    {/* East Wing: Kitchen/Mess */}
                    <div
                      onMouseEnter={() => setHoveredNode('maitri-mess')}
                      onClick={() => handleSelectAsset('maitri-mess', 'hub')}
                      className="p-3.5 rounded-xl border border-orange-400/60 bg-orange-950/40 hover:bg-orange-500/20 cursor-pointer transition-all hover:scale-105 group"
                    >
                      <div className="text-[10px] text-orange-400 font-bold">SOUTH-EAST WING</div>
                      <div className="text-xs font-bold text-slate-100 group-hover:text-orange-300">
                        Kitchen & Mess Hall
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">35-Seat Dining • Larder</div>
                    </div>

                    {/* East Wing: Internal Generator */}
                    <div
                      onMouseEnter={() => setHoveredNode('maitri-internal-gen')}
                      onClick={() => handleSelectAsset('maitri-internal-gen', 'hub')}
                      className="p-3.5 rounded-xl border border-yellow-400/60 bg-yellow-950/40 hover:bg-yellow-500/20 cursor-pointer transition-all hover:scale-105 group"
                    >
                      <div className="text-[10px] text-yellow-400 font-bold">POWER NODE</div>
                      <div className="text-xs font-bold text-slate-100 group-hover:text-yellow-300">
                        Generator Room (Internal)
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">500 kVA Cogen Genset</div>
                    </div>

                    {/* Water Reservoir */}
                    <div
                      onMouseEnter={() => setHoveredNode('maitri-water-reservoir')}
                      onClick={() => handleSelectAsset('maitri-water-reservoir', 'hub')}
                      className="p-3.5 rounded-xl border border-sky-400/60 bg-sky-950/40 hover:bg-sky-500/20 cursor-pointer transition-all hover:scale-105 group"
                    >
                      <div className="text-[10px] text-sky-400 font-bold">WATER UTILITY</div>
                      <div className="text-xs font-bold text-slate-100 group-hover:text-sky-300">
                        Water Reservoir Tanks
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">48,000L • Priyadarshini Line</div>
                    </div>
                  </div>

                  {/* Connected Summer Camp Strip */}
                  <div
                    onMouseEnter={() => setHoveredNode('maitri-summer-camp')}
                    onClick={() => handleSelectAsset('maitri-summer-camp')}
                    className="mt-3 p-3 rounded-xl border border-dashed border-cyan-400/40 bg-slate-900/60 flex items-center justify-between cursor-pointer hover:bg-cyan-500/10 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-xs font-bold text-slate-200">Camp (Summer / Transit) Area</span>
                      <span className="text-[10px] text-slate-400">— 8 Quick-Deploy Modular Pods</span>
                    </div>
                    <span className="text-[10px] text-cyan-300 font-bold">VIEW TELEMETRY →</span>
                  </div>
                </div>
              </div>
            )}

            {/* --- FIGURE 4: PERIPHERAL LOGISTICS & UTILITIES --- */}
            {activeFigure === 'fig4' && (
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                  <div className="text-xs font-bold text-cyan-400 tracking-wider">
                    FIGURE 4: PERIPHERAL LOGISTICS & UTILITIES
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Sections A (Fuel), B (Workshop), C (Helipad & Containers)
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Section A: Liquid Storage */}
                  <div
                    onMouseEnter={() => setHoveredNode('maitri-fuel-farm')}
                    onClick={() => handleSelectAsset('maitri-fuel-farm', 'fuelfarm')}
                    className="border border-red-500/40 rounded-2xl p-4 bg-red-950/20 hover:bg-red-950/40 cursor-pointer transition-all hover:scale-102 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">
                        Section A: Liquid Storage
                      </div>
                      <div className="text-sm font-bold text-slate-100 mb-2">Fuel / Water Tanks</div>
                      <div className="text-xs text-slate-300 space-y-1">
                        <div>• 16 Clustered Fuel Storage Tanks</div>
                        <div>• 185,000L ATF / Arctic Diesel</div>
                        <div>• Dedicated Vehicle Refueling Pad</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFocus3D('maitri-fuel-farm', 'fuelfarm');
                      }}
                      className="mt-4 w-full py-1.5 rounded-lg bg-red-500/20 text-red-300 text-xs font-bold hover:bg-red-500/30 border border-red-500/40"
                    >
                      Focus 3D View
                    </button>
                  </div>

                  {/* Section B: Repair Workshop */}
                  <div
                    onMouseEnter={() => setHoveredNode('maitri-workshop')}
                    onClick={() => handleSelectAsset('maitri-workshop', 'workshop')}
                    className="border border-amber-500/40 rounded-2xl p-4 bg-amber-950/20 hover:bg-amber-950/40 cursor-pointer transition-all hover:scale-102 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                        Section B: Repair & Maintenance
                      </div>
                      <div className="text-sm font-bold text-slate-100 mb-2">Vehicle & Energy Workshop</div>
                      <div className="text-xs text-slate-300 space-y-1">
                        <div>• Curved Aerodynamic Shell Hangar</div>
                        <div>• 5-Ton Overhead Gantry Crane</div>
                        <div>• Snowcat Engine & Battery Bay</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFocus3D('maitri-workshop', 'workshop');
                      }}
                      className="mt-4 w-full py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold hover:bg-amber-500/30 border border-amber-500/40"
                    >
                      Focus 3D View
                    </button>
                  </div>

                  {/* Section C: Helipad */}
                  <div
                    onMouseEnter={() => setHoveredNode('maitri-helipad')}
                    onClick={() => handleSelectAsset('maitri-helipad', 'helipad')}
                    className="border border-cyan-500/40 rounded-2xl p-4 bg-cyan-950/20 hover:bg-cyan-950/40 cursor-pointer transition-all hover:scale-102 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                        Section C: Logistics & Aviation
                      </div>
                      <div className="text-sm font-bold text-slate-100 mb-2">Helipad & Storage Array</div>
                      <div className="text-xs text-slate-300 space-y-1">
                        <div>• 12-Ton Rated Elevated Helipad ("H")</div>
                        <div>• Flanking Twin Rows of 4 Containers</div>
                        <div>• Heated Windsock & LED Beacons</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFocus3D('maitri-helipad', 'helipad');
                      }}
                      className="mt-4 w-full py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30 border border-cyan-500/40"
                    >
                      Focus 3D View
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- FIGURE 2 & 1: FLOW & OVERHEAD --- */}
            {(activeFigure === 'fig2' || activeFigure === 'fig1') && (
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                  <div className="text-xs font-bold text-cyan-400 tracking-wider">
                    {activeFigure === 'fig2' ? 'FIGURE 2: SCHEMATIC SITE FLOW' : 'FIGURE 1: SITE PLAN (OVERHEAD VIEW)'}
                  </div>
                  <div className="text-[11px] text-slate-400">Master Utility Grid & Satellite Link</div>
                </div>

                <div className="border border-cyan-500/30 rounded-2xl p-6 bg-[#06152a]/60 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10px]">SATELLITE GROUND DISH</div>
                      <div className="font-bold text-cyan-300 mt-1">4.2m Cassegrain</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">RF Link to West Wing</div>
                    </div>
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10px]">WATER CONDUIT PIPELINE</div>
                      <div className="font-bold text-orange-300 mt-1">Lake Priyadarshini</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Continuous Trace Heated</div>
                    </div>
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10px]">POWER DISTRIBUTION</div>
                      <div className="font-bold text-yellow-300 mt-1">415V 3-Phase Microgrid</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Dual Genset + Wind/Solar</div>
                    </div>
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10px]">VEHICLE PARKING LOT</div>
                      <div className="font-bold text-emerald-300 mt-1">Snowcat Convoys</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Staged Block Heaters</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-300 leading-relaxed font-sans">
                    <span className="font-bold text-cyan-300">Master Flow Summary: </span>
                    Maitri Research Station operates as a resilient closed-loop polar habitat. Power is generated from the internal Caterpillar diesel cogeneration plant supplemented by the hybrid wind-solar array. Raw water is pumped through an elevated 200-meter heat-traced pipeline from freshwater Lake Priyadarshini into dual insulated buffer reservoirs, and telecommunications are bridged continuously via the 4.2m ground tracking dish.
                  </div>
                </div>
              </div>
            )}

            {/* Quick 3D Camera Jump Navigation Bar at bottom */}
            <div className="pt-4 border-t border-cyan-500/20 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-sans">
                Quick Camera Presets:
              </div>
              <div className="flex items-center gap-2">
                {[
                  { label: 'Central Hub', preset: 'hub', assetId: 'maitri-main' },
                  { label: 'Helipad', preset: 'helipad', assetId: 'maitri-helipad' },
                  { label: 'Workshop', preset: 'workshop', assetId: 'maitri-workshop' },
                  { label: 'Fuel Farm', preset: 'fuelfarm', assetId: 'maitri-fuel-farm' },
                  { label: 'Top-Down 90°', preset: 'topDown', assetId: null },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => {
                      setCameraPreset(btn.preset);
                      if (btn.assetId) setSelectedAssetId(btn.assetId);
                      setIsBlueprintOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-slate-700 hover:border-cyan-400 transition-all font-mono"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Active Telemetry & Node Inspection */}
          <div className="lg:col-span-4 p-6 bg-[#050e1b] flex flex-col justify-between overflow-y-auto">
            {hoveredNode ? (
              (() => {
                const asset = getAsset(hoveredNode);
                if (!asset) return null;
                const statusColor = getStatusColor(asset.status);
                return (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                        {asset.category}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                        style={{ backgroundColor: `${statusColor.hex}25`, color: statusColor.hex }}
                      >
                        {asset.status}
                      </span>
                    </div>

                    <div>
                      <div className="text-base font-bold text-white">{asset.name}</div>
                      <div className="text-xs text-slate-400 mt-1">{asset.description}</div>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800 space-y-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Live Compartment Telemetry
                      </div>
                      {Object.entries(asset.metrics || {}).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="text-cyan-300 font-bold">{val}</span>
                        </div>
                      ))}
                    </div>

                    {/* Subsystems List */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Subsystems & Circuit Health
                      </div>
                      {(asset.subsystems || []).map((sub, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 border border-slate-800/80 text-xs font-mono"
                        >
                          <span className="text-slate-300">{sub.name}</span>
                          <span className="text-slate-400 text-[11px]">{sub.value}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleFocus3D(asset.id)}
                      className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Jump to 3D Compartment</span>
                    </button>
                  </div>
                );
              })()
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                <Compass className="w-10 h-10 text-cyan-400/40 animate-spin" style={{ animationDuration: '12s' }} />
                <div className="text-sm font-bold text-slate-200">Interactive Blueprint Hotspot Mode</div>
                <div className="text-xs text-slate-400 leading-relaxed font-sans max-w-xs">
                  Hover or click on any room, wing, or peripheral module in the blueprint to inspect live telemetry, temperature, and subsystem diagnostic health.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
