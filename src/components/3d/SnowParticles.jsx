import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStationData } from '../../context/StationDataContext';

export default function SnowParticles() {
  const pointsRef = useRef();
  const { weather, selectedStation, weatherPreset } = useStationData();

  const currentStation = selectedStation === 'combined' ? 'maitri' : selectedStation;
  const windSpeed = weather[currentStation]?.windSpeed || 40;
  const isBlizzard = weatherPreset === 'blizzard' || windSpeed > 75;

  const count = isBlizzard ? 1800 : 750;

  // Generate particle coordinate arrays
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = Math.random() * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120;

      spd[i * 3] = 0.5 + Math.random() * 0.8; // X wind drift
      spd[i * 3 + 1] = 0.8 + Math.random() * 1.2; // Y fall speed
      spd[i * 3 + 2] = 0.3 + Math.random() * 0.5; // Z wind drift
    }
    return [pos, spd];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array;

    const speedMultiplier = isBlizzard ? 2.8 : Math.max(0.6, windSpeed / 40);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      // Fall down & blow with wind
      arr[idx] += speeds[idx] * speedMultiplier * delta * 12;
      arr[idx + 1] -= speeds[idx + 1] * (isBlizzard ? 3.5 : 2.0) * delta * 4;
      arr[idx + 2] += speeds[idx + 2] * speedMultiplier * delta * 8;

      // Reset when below ground or outside bounding volume
      if (arr[idx + 1] < 0) {
        arr[idx + 1] = 35 + Math.random() * 5;
        arr[idx] = (Math.random() - 0.5) * 120;
        arr[idx + 2] = (Math.random() - 0.5) * 120;
      }
      if (arr[idx] > 60) arr[idx] = -60;
      if (arr[idx + 2] > 60) arr[idx + 2] = -60;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isBlizzard ? 0.35 : 0.22}
        color="#f0f9ff"
        transparent
        opacity={isBlizzard ? 0.85 : 0.65}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
