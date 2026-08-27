import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useStationData } from '../../context/StationDataContext';
import { getStatusColor } from '../../utils/stationHealth';
import { AlertTriangle, AlertCircle, CheckCircle, Activity } from 'lucide-react';

export default function InteractiveAsset3D({
  asset,
  children,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  badgeOffset = [0, 4.5, 0],
}) {
  const {
    selectedAssetId,
    setSelectedAssetId,
    hoveredAssetId,
    setHoveredAssetId,
    showLabels3D,
  } = useStationData();

  const [isHovered, setIsHovered] = useState(false);
  const ringRef = useRef();

  const isSelected = selectedAssetId === asset.id;
  const isHoveredGlobally = hoveredAssetId === asset.id || isHovered;
  const statusColor = getStatusColor(asset.status);

  // Animate warning/critical ground pulse ring
  useFrame(({ clock }) => {
    if (ringRef.current && (asset.status === 'warning' || asset.status === 'critical' || isSelected)) {
      const t = clock.getElapsedTime() * (asset.status === 'critical' ? 4 : 2);
      const s = 1 + Math.sin(t) * 0.15;
      ringRef.current.scale.set(s, s, s);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedAssetId(asset.id);
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setIsHovered(true);
    setHoveredAssetId(asset.id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    setHoveredAssetId(null);
    document.body.style.cursor = 'default';
  };

  // Primary metric readout string
  const primaryMetric =
    asset.temperature !== undefined && asset.type === 'generator'
      ? `${asset.temperature}°C`
      : asset.type === 'fuel_tank'
      ? `${asset.load}% Lvl`
      : asset.powerOutput
      ? `${asset.powerOutput} kW`
      : asset.powerDraw
      ? `${asset.powerDraw} kW`
      : `${asset.health}% Hlt`;

  const showBadge = showLabels3D || isHoveredGlobally || isSelected || asset.status === 'critical' || asset.status === 'warning';

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Ground Projection Ring for Selection or Alert */}
      {(isSelected || asset.status === 'warning' || asset.status === 'critical') && (
        <mesh
          ref={ringRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.05, 0]}
        >
          <ringGeometry args={[3.2, 3.5, 32]} />
          <meshBasicMaterial
            color={statusColor.hex}
            transparent
            opacity={isSelected ? 0.9 : 0.6}
          />
        </mesh>
      )}

      {/* Selected Box Bounding Light */}
      {isSelected && (
        <pointLight
          color={statusColor.hex}
          intensity={3}
          distance={10}
          position={[0, 3, 0]}
        />
      )}

      {/* Actual 3D Mesh geometry / children */}
      {children}

      {/* Floating 3D HUD Tag / Tooltip */}
      {showBadge && (
        <Html
          position={badgeOffset}
          center
          distanceFactor={18}
          zIndexRange={[100, 0]}
        >
          <div
            className={`pointer-events-none select-none transition-all duration-200 ${
              isSelected
                ? 'scale-110 -translate-y-2'
                : isHoveredGlobally
                ? 'scale-105 -translate-y-1'
                : 'scale-95 opacity-85'
            }`}
          >
            <div
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border backdrop-blur-md shadow-2xl font-mono text-xs ${
                asset.status === 'critical'
                  ? 'bg-rose-950/90 border-rose-500 text-rose-100 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
                  : asset.status === 'warning'
                  ? 'bg-amber-950/90 border-amber-500 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : isSelected
                  ? 'bg-cyan-950/90 border-cyan-400 text-cyan-100 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900/85 border-slate-700 text-slate-200'
              }`}
            >
              {/* Status Indicator Dot / Icon */}
              <span className="flex items-center">
                {asset.status === 'critical' ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                ) : asset.status === 'warning' ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: statusColor.hex }}
                  />
                )}
              </span>

              {/* Asset Name */}
              <span className="font-semibold tracking-wide whitespace-nowrap text-[11px] font-sans">
                {asset.name}
              </span>

              {/* Metric Pill */}
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  asset.status === 'critical'
                    ? 'bg-rose-600/30 text-rose-300'
                    : asset.status === 'warning'
                    ? 'bg-amber-600/30 text-amber-300'
                    : 'bg-slate-800 text-cyan-300'
                }`}
              >
                {primaryMetric}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
