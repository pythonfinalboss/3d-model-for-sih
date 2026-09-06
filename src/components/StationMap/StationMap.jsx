import React, { useState } from 'react';
import Building from './Building';
import Road from './Road';
import Equipment from './Equipment';
import SensorMarker from './SensorMarker';
import { useSvgPanZoom } from '../../hooks/useSvgPanZoom';
import { useStationData } from '../../context/StationDataContext';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Compass,
  Check,
  Eye,
  Sliders,
  Maximize2,
  Crosshair,
  Box,
} from 'lucide-react';

export default function StationMap({
  layout,
  buildingsTelemetry = [],
  selectedBuildingId,
  onSelectBuilding,
  activeLayers,
  onToggleLayer,
}) {
  const { setViewMode, setActiveTab } = useStationData();
  const { viewBoxString, svgRef, zoomIn, zoomOut, resetView, focusOn, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp } =
    useSvgPanZoom({ x: 0, y: 0, width: 1400, height: 950 });

  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Map building ID to its current live telemetry data
  const telemetryMap = React.useMemo(() => {
    const map = {};
    buildingsTelemetry.forEach((b) => {
      map[b.id] = b;
    });
    return map;
  }, [buildingsTelemetry]);

  // Handle building hover
  const handleHover = (bDef, tData, e) => {
    setHoveredBuilding({ ...bDef, telemetry: tData });
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 12,
      });
    }
  };

  const handleLeave = () => {
    setHoveredBuilding(null);
  };

  const handleBuildingClick = (id) => {
    onSelectBuilding(id);
    const target = layout.buildings.find((b) => b.id === id);
    if (target && target.center) {
      // Smooth focus
      focusOn(target.center[0], target.center[1], 0.65);
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#040813] select-none">
      {/* SVG Canvas with Pan & Zoom */}
      <svg
        ref={svgRef}
        viewBox={viewBoxString}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          {/* Engineering CAD Grid 40x40 */}
          <pattern id="stationGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="rgba(56, 189, 248, 0.05)"
              strokeWidth="1"
            />
            {/* 10m Micro Dots */}
            <circle cx="25" cy="25" r="0.8" fill="rgba(56, 189, 248, 0.12)" />
          </pattern>

          {/* Radial Center Lighting */}
          <radialGradient id="siteAmbientLight" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#0a192f" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#050a14" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#02050b" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* 1. Technical Dark Ambient Background */}
        <rect width="2000" height="1500" x="-300" y="-300" fill="url(#siteAmbientLight)" />
        <rect width="2000" height="1500" x="-300" y="-300" fill="url(#stationGrid)" />

        {/* 2. Station Infrastructure (Roads, Pipelines, Power Conduits, Contours) */}
        <Road infrastructure={layout.infrastructure} activeLayers={activeLayers} />

        {/* 3. Specialized Equipment (Helipad, Staged Vehicles, Tanks) */}
        <Equipment layout={layout} activeLayers={activeLayers} />

        {/* 4. Interactive Buildings (Layer toggle: buildings) */}
        {activeLayers.buildings && (
          <g id="buildings-layer">
            {layout.buildings.map((b) => (
              <Building
                key={b.id}
                buildingDef={b}
                telemetryData={telemetryMap[b.id]}
                isSelected={selectedBuildingId === b.id}
                isHovered={hoveredBuilding?.id === b.id}
                onSelect={handleBuildingClick}
                onHover={handleHover}
                onLeave={handleLeave}
              />
            ))}
          </g>
        )}

        {/* 5. Sensor Markers (Layer toggle: sensors) */}
        {activeLayers.sensors && layout.sensors && (
          <g id="sensors-layer">
            {layout.sensors.map((s) => (
              <SensorMarker
                key={s.id}
                sensor={s}
                telemetryData={telemetryMap[s.assetId]}
                onClick={handleBuildingClick}
              />
            ))}
          </g>
        )}
      </svg>

      {/* Hover Tooltip HUD Floating Badge */}
      {hoveredBuilding && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-75"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="bg-slate-900/95 border border-cyan-500/50 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs font-mono min-w-[200px]">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
              <span className="font-bold text-white uppercase tracking-wider">
                {hoveredBuilding.shortLabel}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                  hoveredBuilding.telemetry?.status === 'critical'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : hoveredBuilding.telemetry?.status === 'warning'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {hoveredBuilding.telemetry?.status || 'HEALTHY'}
              </span>
            </div>
            <div className="space-y-1 text-slate-300">
              <div className="text-[11px] text-slate-400 font-sans">
                {hoveredBuilding.name}
              </div>
              {hoveredBuilding.telemetry?.telemetry?.Generator_Load !== undefined && (
                <div className="flex justify-between text-slate-300">
                  <span>Gen Load:</span>
                  <strong className="text-cyan-300">
                    {hoveredBuilding.telemetry.telemetry.Generator_Load}%
                  </strong>
                </div>
              )}
              {hoveredBuilding.telemetry?.telemetry?.Fuel_Level !== undefined && (
                <div className="flex justify-between text-slate-300">
                  <span>Fuel Reserve:</span>
                  <strong className="text-amber-300">
                    {hoveredBuilding.telemetry.telemetry.Fuel_Level}%
                  </strong>
                </div>
              )}
              {hoveredBuilding.telemetry?.telemetry?.Temperature !== undefined && (
                <div className="flex justify-between text-slate-300">
                  <span>Temperature:</span>
                  <strong className="text-emerald-300">
                    {hoveredBuilding.telemetry.telemetry.Temperature.toFixed(1)}°C
                  </strong>
                </div>
              )}
              {hoveredBuilding.telemetry?.telemetry?.Occupancy !== undefined && (
                <div className="flex justify-between text-slate-300">
                  <span>Occupancy:</span>
                  <strong className="text-slate-200">
                    {hoveredBuilding.telemetry.telemetry.Occupancy} pers
                  </strong>
                </div>
              )}
            </div>
            <div className="mt-2 pt-1 border-t border-slate-800 text-[10px] text-cyan-400/80 text-center">
              Click building to open 2D telemetry
            </div>
          </div>
        </div>
      )}

      {/* Top Right: Convert to 3D Action & Compass */}
      <div className="absolute top-4 right-4 flex items-center gap-2.5 z-20 pointer-events-auto">
        <button
          onClick={() => {
            setViewMode('3d');
            setActiveTab('3d');
          }}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-extrabold flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.5)] border border-cyan-300/50 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Convert this 2D model directly into full 3D"
        >
          <Box className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wider">CONVERT TO 3D</span>
        </button>

        <div className="glass-panel border border-cyan-500/30 rounded-2xl p-2.5 shadow-2xl flex flex-col items-center gap-1 pointer-events-none select-none">
          <div className="w-8 h-8 rounded-full border border-cyan-500/40 flex items-center justify-center relative">
            <div className="w-0.5 h-6 bg-gradient-to-t from-transparent via-cyan-400 to-rose-500" />
            <span className="absolute -top-3.5 text-[10px] font-mono font-bold text-rose-400">N</span>
          </div>
          <span className="text-[9px] font-mono text-cyan-300 uppercase tracking-wider">True Grid</span>
        </div>
      </div>

      {/* Bottom Left: Engineering Scale Bar & Coordinates */}
      <div className="absolute bottom-4 left-4 glass-panel border border-slate-800 rounded-2xl p-3 shadow-2xl z-20 pointer-events-none select-none">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            {layout.name}
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
          <div>{layout.location}</div>
          <div className="text-cyan-300/80">{layout.coordinates} • {layout.elevation}</div>
        </div>
        {/* Scale Bar */}
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[10px] font-mono text-slate-400">
          <div className="w-24 h-1.5 bg-slate-700 border border-slate-600 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-cyan-500/70" />
          </div>
          <span>50 METERS</span>
        </div>
      </div>

      {/* Bottom Right: Interactive Map Controls Bar */}
      <div className="absolute bottom-4 right-4 glass-panel border border-slate-800 rounded-2xl p-1.5 shadow-2xl z-20 flex items-center gap-1 pointer-events-auto">
        {/* Layers Toggle Button */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`p-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all ${
              showLayerMenu
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle Map Layers"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Layers</span>
          </button>

          {/* Layer Menu Dropdown */}
          {showLayerMenu && (
            <div className="absolute bottom-full right-0 mb-2 w-52 bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md z-40 text-xs font-mono space-y-1.5">
              <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider pb-1 border-b border-slate-800">
                Map Layers
              </div>
              {Object.keys(activeLayers).map((layerKey) => (
                <label
                  key={layerKey}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-800/80 cursor-pointer text-slate-300 hover:text-white transition-colors capitalize"
                >
                  <span>{layerKey}</span>
                  <input
                    type="checkbox"
                    checked={activeLayers[layerKey]}
                    onChange={() => onToggleLayer(layerKey)}
                    className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-slate-800 mx-0.5" />

        {/* Zoom In */}
        <button
          onClick={zoomIn}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-slate-300" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={zoomOut}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-slate-300" />
        </button>

        {/* Reset View */}
        <button
          onClick={resetView}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Reset View & Recenter"
        >
          <RotateCcw className="w-4 h-4 text-slate-300" />
        </button>
      </div>
    </div>
  );
}
