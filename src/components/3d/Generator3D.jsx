import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { getStatusColor } from '../../utils/stationHealth';

export default function Generator3D({ asset, isCogen = false }) {
  const containerRef = useRef();
  const exhaustLightRef = useRef();
  const statusColor = getStatusColor(asset?.status || 'healthy');

  const isRunning = asset?.status !== 'offline';
  const isHighLoad = (asset?.load || 50) > 75 || asset?.status === 'warning' || asset?.status === 'critical';

  useFrame(({ clock }) => {
    if (containerRef.current && isRunning) {
      const t = clock.getElapsedTime() * 45;
      // Subtle physical micro-vibration of engine block
      const vib = (isHighLoad ? 0.03 : 0.01) * ((asset?.load || 50) / 100);
      containerRef.current.position.y = 0.8 + Math.sin(t) * vib;
      containerRef.current.position.x = Math.cos(t * 1.3) * (vib * 0.5);
    }

    if (exhaustLightRef.current && isRunning) {
      // Heat shimmer light pulse
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 8) * 0.3;
      exhaustLightRef.current.intensity = ((asset?.temperature || 20) > 85 ? 2.5 : 1.2) * pulse;
    }
  });

  return (
    <group>
      {/* Heavy Steel Foundation Stilts */}
      {[-1.5, 1.5].map((x, i) =>
        [-0.9, 0.9].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.4, z]}>
            <boxGeometry args={[0.2, 0.8, 0.2]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
        ))
      )}

      {/* Main Generator Enclosure (Vibrates when active) */}
      <group ref={containerRef} position={[0, 0.8, 0]}>
        {/* ISO Acoustic Enclosure Container */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 1.5, 2.0]} />
          <meshStandardMaterial
            color={isCogen ? '#1e3a8a' : '#334155'}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>

        {/* Dynamic Status LED Light Strip */}
        <mesh position={[0, 1.45, 1.01]}>
          <boxGeometry args={[3.2, 0.1, 0.02]} />
          <meshStandardMaterial
            color={statusColor.hex}
            emissive={statusColor.hex}
            emissiveIntensity={asset.status === 'healthy' ? 0.5 : 2.0}
          />
        </mesh>

        {/* Radiator Cooling Louvers */}
        <mesh position={[1.71, 0.75, 0]}>
          <boxGeometry args={[0.02, 1.1, 1.4]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* High Vertical Exhaust Stack */}
        <mesh position={[-1.1, 2.0, -0.6]}>
          <cylinderGeometry args={[0.15, 0.15, 1.6, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Rain Cap on Exhaust */}
        <mesh position={[-1.1, 2.85, -0.6]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.05, 0.1, 12]} />
          <meshStandardMaterial color="#475569" />
        </mesh>

        {/* Exhaust Heat Shimmer Glow */}
        {isRunning && (
          <pointLight
            ref={exhaustLightRef}
            color={asset.temperature > 85 ? '#f97316' : '#38bdf8'}
            intensity={1.5}
            distance={4}
            position={[-1.1, 3.0, -0.6]}
          />
        )}

        {/* Cogeneration Thermal Heat Exchanger Module (if CHP) */}
        {isCogen && (
          <group position={[0, 0.8, -1.2]}>
            <mesh>
              <cylinderGeometry args={[0.4, 0.4, 2.4, 12]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#0284c7" metalness={0.8} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}
