import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import MaitriStation3D from './MaitriStation3D';
import BharatiStation3D from './BharatiStation3D';
import { useStationData } from '../../context/StationDataContext';
import { Radio, ArrowRightLeft } from 'lucide-react';

export default function CombinedView3D({ assets }) {
  const beamRef = useRef();
  const { setSelectedStation, maitriMetrics, bharatiMetrics } = useStationData();

  useFrame(({ clock }) => {
    if (beamRef.current) {
      // Pulse the inter-station telemetry link beam
      const pulse = 0.5 + Math.sin(clock.getElapsedTime() * 4) * 0.35;
      beamRef.current.material.opacity = pulse;
    }
  });

  return (
    <group>
      {/* MAITRI STATION COMPLEX (West Node) */}
      <group position={[-35, 0, -5]}>
        <MaitriStation3D assets={assets} />
        {/* Floating Station Region Label */}
        <Html position={[0, 9, 0]} center distanceFactor={28}>
          <button
            onClick={() => setSelectedStation('maitri')}
            className="pointer-events-auto px-4 py-2 rounded-xl bg-amber-950/90 border border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.4)] backdrop-blur-md text-amber-200 text-sm font-display font-bold flex items-center gap-2.5 hover:scale-105 transition-transform"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            MAITRI STATION (Schirmacher Oasis)
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
              Health {maitriMetrics?.healthScore ?? 87}%
            </span>
          </button>
        </Html>
      </group>

      {/* BHARATI STATION COMPLEX (East Node) */}
      <group position={[35, 0, 5]}>
        <BharatiStation3D assets={assets} />
        {/* Floating Station Region Label */}
        <Html position={[0, 10, 0]} center distanceFactor={28}>
          <button
            onClick={() => setSelectedStation('bharati')}
            className="pointer-events-auto px-4 py-2 rounded-xl bg-cyan-950/90 border border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.4)] backdrop-blur-md text-cyan-200 text-sm font-display font-bold flex items-center gap-2.5 hover:scale-105 transition-transform"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            BHARATI STATION (Larsemann Hills)
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
              Health {bharatiMetrics?.healthScore ?? 94}%
            </span>
          </button>
        </Html>
      </group>

      {/* Animated Inter-Station Microwave / Satellite Telemetry Link Curve */}
      <mesh ref={beamRef} position={[0, 12, 0]}>
        <tubeGeometry
          args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(-35, 2, -5),
              new THREE.Vector3(-15, 14, 0),
              new THREE.Vector3(0, 18, 0),
              new THREE.Vector3(15, 14, 2),
              new THREE.Vector3(35, 2, 5),
            ]),
            64,
            0.15,
            8,
            false,
          ]}
        />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
      </mesh>

      {/* Center Baseline Tag */}
      <Html position={[0, 19, 0]} center distanceFactor={35}>
        <div className="pointer-events-none px-3 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2 shadow-xl backdrop-blur-md">
          <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>INTER-STATION BASELINE: ~3,000 KM</span>
          <span className="text-emerald-400 font-bold">• 100% LINKED</span>
        </div>
      </Html>
    </group>
  );
}
