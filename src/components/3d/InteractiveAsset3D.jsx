import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStationData } from '../../context/StationDataContext';
import { getStatusColor } from '../../utils/stationHealth';
import { AlertTriangle, AlertCircle, Zap, Thermometer, Flame, Users, Wind, Activity } from 'lucide-react';

export default function InteractiveAsset3D({
  asset = {},
  children,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  badgeOffset = [0, 4.8, 0],
}) {
  const {
    selectedAssetId,
    selectedBuildingId,
    selectBuilding,
    hoveredAssetId,
    setHoveredAssetId,
    showLabels3D,
    telemetryBuildings = [],
  } = useStationData();

  const [isHovered, setIsHovered] = useState(false);
  const ringRef = useRef();
  const outerRingRef = useRef();
  const popRef = useRef();

  const assetId = asset?.id || '';
  const assetNormHyphen = assetId ? assetId.replace(/_/g, '-') : '';
  const assetNormUnderscore = assetId ? assetId.replace(/-/g, '_') : '';

  // Robust matching across underscore and hyphen naming conventions
  const isSelected = Boolean(
    assetId && (
      (selectedAssetId && (
        selectedAssetId === assetId ||
        selectedAssetId === assetNormHyphen ||
        selectedAssetId === assetNormUnderscore ||
        assetId.includes(selectedAssetId.replace(/-/g, '_')) ||
        selectedAssetId.replace(/-/g, '_').includes(assetId)
      )) ||
      (selectedBuildingId && (
        selectedBuildingId === assetId ||
        selectedBuildingId === assetNormHyphen ||
        selectedBuildingId === assetNormUnderscore ||
        assetId.includes(selectedBuildingId.replace(/-/g, '_')) ||
        selectedBuildingId.replace(/-/g, '_').includes(assetId)
      ))
    )
  );

  const isHoveredGlobally = assetId && (hoveredAssetId === assetId || isHovered);

  // Real-time telemetry object for readings lookup
  const telemetryData = telemetryBuildings.find(
    (b) =>
      assetId && (
        b.id === assetId ||
        b.id === assetNormHyphen ||
        b.id === assetNormUnderscore ||
        b.id.includes(assetId) ||
        assetId.includes(b.id)
      )
  );

  const status = telemetryData?.status || asset?.status || 'healthy';
  const statusColor = getStatusColor(status);

  // Smooth pop-out elevation & scale animation when building is clicked / selected
  useFrame((_, delta) => {
    if (popRef.current) {
      // Elevate building by 1.3 units when selected, 0.25 units when hovered
      const targetY = isSelected ? 1.3 : isHovered ? 0.25 : 0;
      popRef.current.position.y = THREE.MathUtils.lerp(
        popRef.current.position.y,
        targetY,
        Math.min(delta * 10, 0.25)
      );

      // Subtle scale pop when selected
      const targetScale = isSelected ? 1.05 : isHovered ? 1.02 : 1.0;
      const curScale = popRef.current.scale.x;
      const nextScale = THREE.MathUtils.lerp(curScale, targetScale, Math.min(delta * 10, 0.25));
      popRef.current.scale.set(nextScale, nextScale, nextScale);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.75;
      if (status === 'warning' || status === 'critical' || isSelected) {
        const t = Date.now() * 0.003 * (status === 'critical' ? 2 : 1);
        const s = (isSelected ? 1.15 : 1.0) + Math.sin(t) * 0.08;
        ringRef.current.scale.set(s, s, s);
      }
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z -= delta * 0.5;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (assetId) selectBuilding(assetId);
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setIsHovered(true);
    if (assetId) setHoveredAssetId(assetId);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    setHoveredAssetId(null);
    document.body.style.cursor = 'default';
  };

  // Primary live metric readings to display in 3D badge
  const t = telemetryData?.telemetry;
  const primaryMetric =
    t?.Generator_Load !== undefined
      ? `${t.Generator_Load}% LOAD`
      : t?.Fuel_Level !== undefined
      ? `${t.Fuel_Level}% FUEL`
      : t?.Battery_Level !== undefined
      ? `${t.Battery_Level}% BATT`
      : t?.Temperature !== undefined
      ? `${t.Temperature.toFixed(1)}°C`
      : t?.Wind_Speed !== undefined
      ? `${t.Wind_Speed} km/h`
      : asset?.temperature !== undefined
      ? `${asset.temperature}°C`
      : `${asset?.health || 96}% HLT`;

  const showBadge =
    showLabels3D || isHoveredGlobally || isSelected || status === 'critical' || status === 'warning';

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 1. Ground Projection Holographic Gradient Energy Rings */}
      {(isSelected || status === 'warning' || status === 'critical') && (
        <group position={[0, 0.05, 0]}>
          {/* Inner Glowing Gradient Target Disk */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[3.2, 36]} />
            <meshBasicMaterial
              color={statusColor.hex}
              transparent
              opacity={isSelected ? 0.22 : 0.08}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Rotating Holographic Border Ring */}
          <mesh
            ref={ringRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.01, 0]}
          >
            <ringGeometry args={[3.2, 3.6, 36]} />
            <meshBasicMaterial
              color={statusColor.hex}
              transparent
              opacity={isSelected ? 0.95 : 0.5}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Outer Rotating Counter-Ring */}
          <mesh
            ref={outerRingRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.015, 0]}
          >
            <ringGeometry args={[4.2, 4.35, 36]} />
            <meshBasicMaterial
              color="#06b6d4"
              transparent
              opacity={isSelected ? 0.65 : 0.2}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Vertical Lift Guide Columns from ground to elevated building */}
          {isSelected && (
            <group>
              {[-1.5, 1.5].map((gx, gi) =>
                [-1.5, 1.5].map((gz, gj) => (
                  <mesh key={`beam-${gi}-${gj}`} position={[gx, 0.65, gz]}>
                    <cylinderGeometry args={[0.02, 0.02, 1.3, 6]} />
                    <meshBasicMaterial
                      color="#38bdf8"
                      transparent
                      opacity={0.4}
                    />
                  </mesh>
                ))
              )}
            </group>
          )}
        </group>
      )}

      {/* 2. Dual Multi-Tonal Pop-Out Lighting Highlights */}
      {isSelected && (
        <>
          {/* Overhead Spotlight */}
          <pointLight
            color={statusColor.hex || '#22d3ee'}
            intensity={5.5}
            distance={15}
            position={[0, 4.5, 0]}
          />
          {/* Ground Upward Soft Cyan Fill */}
          <pointLight
            color="#38bdf8"
            intensity={2.8}
            distance={10}
            position={[0, 0.6, 0]}
          />
        </>
      )}

      {/* 3. Popping 3D Mesh Geometry Container */}
      <group ref={popRef}>
        {children}
      </group>

      {/* 4. Floating 3D HUD Tag / Holographic Live Readings Card */}
      {showBadge && (
        <Html
          position={[badgeOffset[0], badgeOffset[1] + (isSelected ? 1.6 : 0), badgeOffset[2]]}
          center
          distanceFactor={20}
          zIndexRange={[100, 0]}
        >
          {isSelected ? (
            /* EXPANDED 3D READINGS POP-OUT CARD (WHEN CLICKED - MATCHING 2D TELEMETRY READINGS) */
            <div className="pointer-events-auto select-none transition-all duration-200 animate-in zoom-in-95 -translate-y-4">
              <div
                className="w-72 rounded-2xl p-3.5 border backdrop-blur-xl font-mono text-xs bg-slate-950/95 text-slate-100 shadow-[0_0_30px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400/50"
                style={{
                  borderColor: status === 'critical' ? '#f43f5e' : status === 'warning' ? '#f59e0b' : '#22d3ee',
                  boxShadow: `0 0 25px ${status === 'critical' ? 'rgba(244,63,94,0.45)' : status === 'warning' ? 'rgba(245,158,11,0.45)' : 'rgba(34,211,238,0.45)'}`,
                }}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className="w-2.5 h-2.5 rounded-full animate-ping"
                      style={{ backgroundColor: statusColor.hex }}
                    />
                    <span className="font-bold text-white tracking-wide truncate text-[12px] font-sans">
                      {telemetryData?.name || asset?.name || assetId}
                    </span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider whitespace-nowrap"
                    style={{
                      backgroundColor: `${statusColor.hex}25`,
                      color: statusColor.hex,
                      border: `1px solid ${statusColor.hex}60`,
                    }}
                  >
                    {status}
                  </span>
                </div>

                {/* 4 Live Telemetry Reading Grid Tiles */}
                <div className="grid grid-cols-2 gap-2 mb-2.5">
                  {/* Temp */}
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-cyan-400" />
                      <span>Temp</span>
                    </div>
                    <div className="text-sm font-bold text-cyan-300">
                      {t?.Temperature !== undefined ? `${t.Temperature.toFixed(1)}°C` : `${asset.temperature || 21.4}°C`}
                    </div>
                  </div>

                  {/* Load / Power */}
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>{t?.Generator_Load !== undefined ? 'Gen Load' : 'Power Draw'}</span>
                    </div>
                    <div className="text-sm font-bold text-amber-300">
                      {t?.Generator_Load !== undefined ? `${t.Generator_Load}%` : `${t?.Energy_Consumption || asset.powerDraw || 120} kW`}
                    </div>
                  </div>

                  {/* Fuel / Battery */}
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-emerald-400" />
                      <span>{t?.Fuel_Level !== undefined ? 'Fuel Reserve' : t?.Battery_Level !== undefined ? 'Battery' : 'Health'}</span>
                    </div>
                    <div className="text-sm font-bold text-emerald-300">
                      {t?.Fuel_Level !== undefined ? `${t.Fuel_Level}%` : t?.Battery_Level !== undefined ? `${t.Battery_Level}%` : `${asset.health || 96}%`}
                    </div>
                  </div>

                  {/* Crew / Wind */}
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      {t?.Occupancy !== undefined ? <Users className="w-3 h-3 text-indigo-400" /> : <Wind className="w-3 h-3 text-indigo-400" />}
                      <span>{t?.Occupancy !== undefined ? 'Crew Count' : 'Wind Speed'}</span>
                    </div>
                    <div className="text-sm font-bold text-indigo-300">
                      {t?.Occupancy !== undefined ? `${t.Occupancy} pers` : t?.Wind_Speed !== undefined ? `${t.Wind_Speed} km/h` : 'Optimal'}
                    </div>
                  </div>
                </div>

                {/* Footer Drawer Hint */}
                <div className="flex items-center justify-between text-[10px] text-cyan-400/90 bg-cyan-950/40 px-2.5 py-1.5 rounded-lg border border-cyan-500/20">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Live Readings Active</span>
                  </span>
                  <span className="text-slate-400 font-sans">Click map to close</span>
                </div>
              </div>
            </div>
          ) : (
            /* COMPACT FLOATING PILL (WHEN HOVERED OR LABELS TOGGLED ON) */
            <div
              id={`tag-3d-${assetId}`}
              data-testid={`3d-tag-${assetId}`}
              onClick={handleClick}
              className={`pointer-events-auto cursor-pointer select-none transition-all duration-200 hover:scale-105 ${
                isHoveredGlobally ? 'scale-105 -translate-y-1' : 'scale-95 opacity-90'
              }`}
            >
              <div
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border backdrop-blur-md shadow-2xl font-mono text-xs ${
                  status === 'critical'
                    ? 'bg-rose-950/90 border-rose-500 text-rose-100 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
                    : status === 'warning'
                    ? 'bg-amber-950/90 border-amber-500 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-slate-900/85 border-slate-700 text-slate-200'
                }`}
              >
                <span className="flex items-center">
                  {status === 'critical' ? (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                  ) : status === 'warning' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: statusColor.hex }}
                    />
                  )}
                </span>
                <span className="font-bold tracking-wide whitespace-nowrap text-[11px] font-sans">
                  {telemetryData?.name || asset?.name || assetId}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    status === 'critical'
                      ? 'bg-rose-600/30 text-rose-300'
                      : status === 'warning'
                      ? 'bg-amber-600/30 text-amber-300'
                      : 'bg-slate-800 text-cyan-300'
                  }`}
                >
                  {primaryMetric}
                </span>
              </div>
            </div>
          )}
        </Html>
      )}
    </group>
  );
}
