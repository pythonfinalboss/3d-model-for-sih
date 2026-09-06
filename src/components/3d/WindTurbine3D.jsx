import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStationData } from '../../context/StationDataContext';
import { getStatusColor } from '../../utils/stationHealth';

export default function WindTurbine3D({ asset, height = 7, bladeRadius = 2.8 }) {
  const rotorRef = useRef();
  const { weather, selectedStation } = useStationData();
  const statusColor = getStatusColor(asset?.status || 'healthy');

  const st = asset?.stationId || (selectedStation === 'combined' ? 'maitri' : selectedStation);
  const windSpeed = weather?.[st]?.windSpeed || 40;

  useFrame((_, delta) => {
    if (rotorRef.current && asset?.status !== 'offline') {
      // Rotation speed in radians/sec based on wind speed
      const rotSpeed = (windSpeed / 12) * 1.5;
      rotorRef.current.rotation.z += rotSpeed * delta;
    }
  });

  return (
    <group>
      {/* Base Foundation Pad on Stilts */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.8, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>

      {/* Tapered Steel Tubular Tower Mast */}
      <mesh position={[0, height / 2 + 0.4, 0]}>
        <cylinderGeometry args={[0.22, 0.45, height, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Dynamic Status Beacon Ring on Mast */}
      <mesh position={[0, height * 0.7, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
        <meshStandardMaterial
          color={statusColor.hex}
          emissive={statusColor.hex}
          emissiveIntensity={asset.status === 'healthy' ? 0.3 : 1.2}
        />
      </mesh>

      {/* Nacelle Housing on Top */}
      <group position={[0, height + 0.4, 0]}>
        <mesh position={[0, 0, -0.4]}>
          <boxGeometry args={[0.7, 0.7, 1.6]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.4} />
        </mesh>

        {/* Top Warning Beacon LED */}
        <mesh position={[0, 0.45, -0.4]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={1.8}
          />
        </mesh>

        {/* Spinning Rotor Hub and 3 Blades */}
        <group ref={rotorRef} position={[0, 0, 0.5]}>
          {/* Nose Cone */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.32, 0.7, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>

          {/* 3 Blades spaced at 120 degrees */}
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
            <group key={idx} rotation={[0, 0, angle]}>
              <mesh position={[0, bladeRadius / 2, 0]}>
                <boxGeometry args={[0.16, bladeRadius, 0.04]} />
                <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
              </mesh>
              {/* High-visibility red tip on blades for Arctic safety */}
              <mesh position={[0, bladeRadius - 0.25, 0]}>
                <boxGeometry args={[0.18, 0.5, 0.05]} />
                <meshStandardMaterial color="#ef4444" roughness={0.4} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}
