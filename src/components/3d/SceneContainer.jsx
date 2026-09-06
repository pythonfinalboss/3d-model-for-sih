import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CameraController from './CameraController';
import Terrain from './Terrain';
import SnowParticles from './SnowParticles';
import MaitriStation3D from './MaitriStation3D';
import BharatiStation3D from './BharatiStation3D';
import CombinedView3D from './CombinedView3D';
import { useStationData } from '../../context/StationDataContext';

// Procedural Antarctic Celestial Sky Dome with Multi-Stop Polar Gradient
function PolarAtmosphereDome() {
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Vertical atmospheric gradient from Zenith down to Horizon
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0.0, '#020617');   // Cosmic deep polar space
    grad.addColorStop(0.25, '#07162c');  // Ionospheric deep navy
    grad.addColorStop(0.50, '#0a2540');  // Twilight polar blue
    grad.addColorStop(0.70, '#0d4a5d');  // Aurora auroral glow tint
    grad.addColorStop(0.85, '#064e3b');  // Low katabatic emerald mist
    grad.addColorStop(1.0, '#030d1d');   // Ground horizon dark ice

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 512);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <mesh position={[0, -5, 0]}>
      <sphereGeometry args={[180, 32, 24]} />
      <meshBasicMaterial
        map={gradientTexture}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}

// Multi-Tiered Aurora Australis (Southern Lights) with Fluid Color Gradient Waves
function AuroraAustralis() {
  const { weatherPreset } = useStationData();
  const isHighAurora = weatherPreset === 'aurora';
  const wave1Ref = useRef();
  const wave2Ref = useRef();
  const wave3Ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (wave1Ref.current) {
      wave1Ref.current.position.y = 38 + Math.sin(t * 0.35) * 2.5;
      wave1Ref.current.rotation.z = Math.sin(t * 0.2) * 0.05;
    }
    if (wave2Ref.current) {
      wave2Ref.current.position.y = 44 + Math.cos(t * 0.28) * 3;
      wave2Ref.current.rotation.z = -Math.cos(t * 0.18) * 0.04;
    }
    if (wave3Ref.current) {
      wave3Ref.current.position.y = 50 + Math.sin(t * 0.4) * 2;
    }
  });

  return (
    <group position={[0, 0, -40]} rotation={[0.15, 0.35, 0]}>
      {/* Tier 1: Emerald to Radiant Green Lower Ionization Curtain */}
      <mesh ref={wave1Ref} position={[0, 38, 0]}>
        <planeGeometry args={[150, 32, 32, 8]} />
        <meshBasicMaterial
          color={isHighAurora ? '#10b981' : '#059669'}
          transparent
          opacity={isHighAurora ? 0.5 : 0.25}
          side={THREE.DoubleSide}
          depthWrite={false}
          fog={false}
        />
      </mesh>

      {/* Tier 2: Electric Cyan-to-Azure Mid Ribbon */}
      <mesh ref={wave2Ref} position={[0, 44, -10]} rotation={[-0.08, 0, 0]}>
        <planeGeometry args={[140, 24, 32, 8]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={isHighAurora ? 0.42 : 0.2}
          side={THREE.DoubleSide}
          depthWrite={false}
          fog={false}
        />
      </mesh>

      {/* Tier 3: Violet-Magenta High-Altitude Nitrogen Glow */}
      <mesh ref={wave3Ref} position={[0, 50, -20]} rotation={[0.06, 0, 0]}>
        <planeGeometry args={[130, 20, 32, 8]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={isHighAurora ? 0.35 : 0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
          fog={false}
        />
      </mesh>
    </group>
  );
}

export default function SceneContainer() {
  const { selectedStation, assets } = useStationData();

  return (
    <div className="w-full h-full relative bg-[#040814]">
      <Canvas
        shadows
        camera={{ position: [24, 18, 26], fov: 45, near: 0.1, far: 600 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Sky Background Clear Color */}
        <color attach="background" args={['#050d1a']} />

        {/* Sky Dome with Procedural Polar Gradient */}
        <PolarAtmosphereDome />

        {/* Polar Atmospheric Depth Fog */}
        <fog attach="fog" args={['#07152b', 50, 260]} />

        {/* 1. Hemisphere Gradient Light: Cyan Sky Glow down to Deep Midnight Ground */}
        <hemisphereLight
          skyColor="#38bdf8"
          groundColor="#0a192f"
          intensity={0.65}
        />

        {/* 2. Low-Angle Warm Polar Sun Directional Light */}
        <directionalLight
          position={[45, 28, 25]}
          intensity={1.35}
          color="#fed7aa"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={160}
          shadow-camera-left={-45}
          shadow-camera-right={45}
          shadow-camera-top={45}
          shadow-camera-bottom={-45}
          shadow-bias={-0.0004}
        />

        {/* 3. Cool Cyan-Blue Ice Rim Backlight */}
        <directionalLight
          position={[-35, 22, -35]}
          intensity={0.55}
          color="#06b6d4"
        />

        {/* 4. Overhead Soft Auroral Green Fill */}
        <directionalLight
          position={[0, 45, 0]}
          intensity={0.2}
          color="#10b981"
        />

        {/* Flowing Aurora Australis Sky Ribbons */}
        <AuroraAustralis />

        <Suspense fallback={null}>
          {/* Smooth Camera Lerp & Orbit Controller */}
          <CameraController />

          {/* Atmospheric Snow Drift Particles */}
          <SnowParticles />

          {/* Dynamic Station Rendering */}
          {(selectedStation === 'maitri' || !selectedStation) && (
            <>
              <Terrain stationId="maitri" />
              <MaitriStation3D assets={assets} />
            </>
          )}

          {selectedStation === 'bharati' && (
            <>
              <Terrain stationId="bharati" />
              <BharatiStation3D assets={assets} />
            </>
          )}

          {(selectedStation === 'combined' || selectedStation === 'overview') && (
            <>
              <Terrain stationId="combined" />
              <CombinedView3D assets={assets} />
            </>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
