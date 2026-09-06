import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Terrain({ stationId }) {
  const lakeRingRef = useRef();

  // Generate low-poly stylized snow terrain with rich topographic elevation gradients
  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(150, 150, 64, 64);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    // Color definitions for terrain gradient
    const colLakeBed = new THREE.Color('#0369a1');      // Deep glacial water cyan
    const colLakeShore = new THREE.Color('#38bdf8');    // Frosted shoreline ice
    const colStationPad = new THREE.Color('#1e293b');   // Hardpack dark gravel/moraine pad
    const colStationEdge = new THREE.Color('#334155');  // Pad rim
    const colSnowLow = new THREE.Color('#93c5fd');      // Blue ice drift
    const colSnowMid = new THREE.Color('#e0f2fe');      // Crisp sunlit snow
    const colSnowPeak = new THREE.Color('#ffffff');     // Glacial ridge peak highlight

    const tempCol = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i); // In 3D plane geometry before rotation, Y is the Z axis

      let elevation = 0;
      let colorType = 'snow';

      if (stationId === 'maitri') {
        // Maitri Station pad: from x = -32 to +32, y = -14 to +25
        const inStationPad = Math.abs(x) < 30 && y > -13 && y < 24;

        if (inStationPad) {
          elevation = 0;
          colorType = 'pad';
        } else if (y <= -13) {
          // Northern depression for Lake Priyadarshini basin
          const lakeDepth = Math.min(2.2, Math.abs(y + 13) * 0.22);
          elevation = -lakeDepth;
          colorType = 'lake';
        } else {
          // Perimeter glacial moraine hills and snow drifts
          const dist = Math.sqrt(x * x + y * y);
          if (dist > 30) {
            elevation = Math.sin(x * 0.08) * Math.cos(y * 0.08) * 3.5 +
                        Math.sin(x * 0.16 + y * 0.12) * 1.6;
            if (dist > 45) {
              elevation += Math.pow((dist - 45) * 0.18, 1.45);
            }
          }
          colorType = 'snow';
        }
      } else if (stationId === 'bharati') {
        // Bharati: Coastal sea ice drop-off on negative Y side (Prydz Bay)
        if (y < -18) {
          elevation = -2.6 + Math.sin(x * 0.1) * 0.4;
          colorType = 'ocean';
        } else {
          const dist = Math.sqrt(x * x + y * y);
          if (dist > 22) {
            elevation = Math.sin(x * 0.08) * Math.cos(y * 0.08) * 2.8;
          }
          colorType = 'snow';
        }
      } else {
        const dist = Math.sqrt(x * x + y * y);
        if (dist > 20) {
          elevation = Math.sin(x * 0.08) * Math.cos(y * 0.08) * 2.2;
        }
        colorType = 'snow';
      }

      pos.setZ(i, elevation);

      // Compute smooth multi-tonal gradient color based on elevation & feature type
      if (colorType === 'pad') {
        const distFromCenter = Math.hypot(x, y - 5) / 30;
        tempCol.copy(colStationPad).lerp(colStationEdge, Math.min(1, distFromCenter));
      } else if (colorType === 'lake' || colorType === 'ocean') {
        const depthT = Math.min(1, Math.abs(elevation) / 2.0);
        tempCol.copy(colLakeShore).lerp(colLakeBed, depthT);
      } else {
        // Snow elevation gradient: Low icy blue -> mid frost -> high radiant white
        if (elevation <= 0.8) {
          tempCol.copy(colSnowLow).lerp(colSnowMid, Math.max(0, elevation / 0.8));
        } else {
          const highT = Math.min(1, (elevation - 0.8) / 4.0);
          tempCol.copy(colSnowMid).lerp(colSnowPeak, highT);
        }
      }

      colors[i * 3] = tempCol.r;
      colors[i * 3 + 1] = tempCol.g;
      colors[i * 3 + 2] = tempCol.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, [stationId]);

  // Subtle animated wave ripple for Lake Priyadarshini
  useFrame(({ clock }) => {
    if (lakeRingRef.current) {
      const t = clock.getElapsedTime();
      lakeRingRef.current.material.opacity = 0.4 + Math.sin(t * 1.5) * 0.15;
    }
  });

  return (
    <group>
      {/* 1. Main Gradient-Shaded Antarctic Snow & Moraine Surface */}
      <mesh
        geometry={terrainGeo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          vertexColors={true}
          roughness={0.75}
          metalness={0.12}
          flatShading={true}
        />
      </mesh>

      {/* 2. Technical Cyber-Cad Polar Grid Overlay */}
      <gridHelper
        args={[130, 65, '#06b6d4', '#1e293b']}
        position={[0, 0.02, 0]}
      />

      {/* 3. Concentric Station Distance Radar Circles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[18, 18.2, 64]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[32, 32.25, 64]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[48, 48.3, 64]} />
        <meshBasicMaterial color="#0369a1" transparent opacity={0.2} />
      </mesh>

      {/* 4. MAITRI SPECIFIC: Lake Priyadarshini Glacial Lake with Deep Cyan Gradient & Caustics */}
      {stationId === 'maitri' && (
        <group position={[0, -0.28, -22]}>
          {/* Deep Glacial Lake Bed */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 24]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0369a1"
              emissiveIntensity={0.35}
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.88}
            />
          </mesh>

          {/* Shoreline Ice Shelf Gradient Ribbon */}
          <mesh
            ref={lakeRingRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.04, 0]}
          >
            <ringGeometry args={[20, 24, 32]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.45}
            />
          </mesh>

          {/* Cyan Subsurface Glacial Glow */}
          <pointLight color="#06b6d4" intensity={2.2} distance={25} position={[0, 1.8, 0]} />
        </group>
      )}

      {/* 5. BHARATI SPECIFIC: Coastal Prydz Bay Ocean & Floating Pack Ice Chunks */}
      {stationId === 'bharati' && (
        <group position={[0, -2.4, -34]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[120, 32]} />
            <meshStandardMaterial
              color="#022c4d"
              emissive="#0369a1"
              emissiveIntensity={0.3}
              roughness={0.15}
              metalness={0.7}
              transparent
              opacity={0.94}
            />
          </mesh>
          {[-30, -15, 0, 16, 32].map((px, idx) => (
            <mesh
              key={idx}
              position={[px + Math.sin(idx) * 3, 0.25, Math.cos(idx) * 4]}
              rotation={[0, idx * 0.7, 0]}
            >
              <boxGeometry args={[4.5 + idx * 0.5, 0.6, 3.5 + (idx % 3)]} />
              <meshStandardMaterial color="#e0f2fe" roughness={0.6} />
            </mesh>
          ))}
          <pointLight color="#38bdf8" intensity={1.8} distance={30} position={[0, 2, 0]} />
        </group>
      )}
    </group>
  );
}
