import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraController from './CameraController';
import Terrain from './Terrain';
import SnowParticles from './SnowParticles';
import MaitriStation3D from './MaitriStation3D';
import BharatiStation3D from './BharatiStation3D';
import CombinedView3D from './CombinedView3D';
import { useStationData } from '../../context/StationDataContext';

// Atmospheric Aurora Australis (Southern Lights) Sky Ribbon
function AuroraAustralis() {
  const { weatherPreset } = useStationData();
  const isHighAurora = weatherPreset === 'aurora';

  return (
    <group position={[0, 42, -30]} rotation={[0.2, 0.4, 0]}>
      {/* Upper Greenish-Emerald Aurora Wave */}
      <mesh>
        <planeGeometry args={[140, 28, 32, 8]} />
        <meshBasicMaterial
          color={isHighAurora ? '#10b981' : '#059669'}
          transparent
          opacity={isHighAurora ? 0.35 : 0.18}
          side={2}
          depthWrite={false}
        />
      </mesh>
      {/* Cyan-Purple Upper Ionospheric Ionization glow */}
      <mesh position={[0, 8, -6]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[130, 22, 32, 8]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={isHighAurora ? 0.28 : 0.12}
          side={2}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function SceneContainer() {
  const { selectedStation, assets, setSelectedAssetId } = useStationData();

  // Clear asset selection if clicked on empty canvas ground
  const handlePointerMissed = () => {
    setSelectedAssetId(null);
  };

  return (
    <div className="w-full h-full relative bg-[#070b12]">
      <Canvas
        shadows
        camera={{ position: [24, 18, 26], fov: 45, near: 0.1, far: 500 }}
        onPointerMissed={handlePointerMissed}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Dark Polar Atmosphere Color & Fog */}
        <color attach="background" args={['#070e1b']} />
        <fog attach="fog" args={['#070e1b', 40, 220]} />

        {/* Polar Ambient Light */}
        <ambientLight intensity={0.55} color="#93c5fd" />

        {/* Low-Angle Polar Sun / Moonlight */}
        <directionalLight
          position={[45, 30, 25]}
          intensity={1.4}
          color="#e0f2fe"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={150}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
          shadow-bias={-0.0005}
        />

        {/* Secondary Blue Rim Light */}
        <directionalLight position={[-30, 20, -30]} intensity={0.4} color="#38bdf8" />

        {/* Aurora Australis Sky Ribbons */}
        <AuroraAustralis />

        <Suspense fallback={null}>
          {/* Smooth Camera Lerp & Orbit Controller */}
          <CameraController />

          {/* Atmospheric Snow Drift Particles */}
          <SnowParticles />

          {/* Dynamic Station Rendering */}
          {selectedStation === 'maitri' && (
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

          {selectedStation === 'combined' && (
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
