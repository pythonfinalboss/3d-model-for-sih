import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { getStatusColor } from '../../utils/stationHealth';

export default function SatelliteRadome3D({ asset, radius = 1.8 }) {
  const dishGroupRef = useRef();
  const statusColor = getStatusColor(asset.status);

  useFrame(({ clock }) => {
    if (dishGroupRef.current && asset.status !== 'offline') {
      const t = clock.getElapsedTime();
      // Slow tracking sweep in azimuth and slight elevation nod
      dishGroupRef.current.rotation.y = Math.sin(t * 0.25) * 0.8 + 0.4;
      dishGroupRef.current.rotation.x = Math.sin(t * 0.15) * 0.15 - 0.35;
    }
  });

  return (
    <group>
      {/* Supporting Stilt Legs */}
      {[-0.8, 0.8].map((x, i) =>
        [-0.8, 0.8].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.6, z]}>
            <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        ))
      )}

      {/* Raised Platform Base */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[radius * 1.05, radius * 1.1, 0.3, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Internal Tracking Dish Assembly (Visible through translucent shell) */}
      <group ref={dishGroupRef} position={[0, 1.4 + radius * 0.5, 0]}>
        {/* Central Feed Horn Mast */}
        <mesh position={[0, 0, 0.6]}>
          <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.6} />
        </mesh>
        {/* Parabolic Dish Dish */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[radius * 0.7, 0.1, 0.2, 24]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Sub-reflector Feed */}
        <mesh position={[0, 0, 1.0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.0} />
        </mesh>
      </group>

      {/* Translucent Geodesic / Fiber Composite Radome Shell */}
      <mesh position={[0, 1.35 + radius * 0.8, 0]}>
        <sphereGeometry args={[radius, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
        <meshStandardMaterial
          color="#e0f2fe"
          roughness={0.2}
          metalness={0.1}
          transparent={true}
          opacity={0.65}
        />
      </mesh>

      {/* Status LED Accent Ring around base */}
      <mesh position={[0, 1.36, 0]}>
        <ringGeometry args={[radius * 0.95, radius * 1.05, 32]} />
        <meshBasicMaterial color={statusColor.hex} />
      </mesh>
    </group>
  );
}
