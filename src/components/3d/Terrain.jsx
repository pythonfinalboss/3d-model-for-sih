import React, { useMemo } from 'react';
import * as THREE from 'three';

export default function Terrain({ stationId }) {
  // Generate low-poly stylized snow terrain with subtle topography
  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(120, 120, 48, 48);
    const pos = geo.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      
      // Calculate distance from center station pad
      const dist = Math.sqrt(x * x + y * y);
      
      // Keep center station area relatively flat for buildings
      let elevation = 0;
      if (dist > 18) {
        elevation = Math.sin(x * 0.08) * Math.cos(y * 0.08) * 3.5 + 
                    Math.sin(x * 0.15 + y * 0.12) * 1.5;
        // Raise perimeter snow hills
        if (dist > 35) {
          elevation += Math.pow((dist - 35) * 0.18, 1.4);
        }
      } else {
        // Slight natural undulation under station
        elevation = Math.sin(x * 0.2) * Math.cos(y * 0.2) * 0.3;
      }

      // Maitri: Lake Priyadarshini depression in positive quadrant
      if (stationId === 'maitri' && x > 8 && x < 28 && y > 6 && y < 26) {
        const lakeDist = Math.sqrt(Math.pow(x - 18, 2) + Math.pow(y - 16, 2));
        if (lakeDist < 9) {
          elevation = -1.2 + Math.cos((lakeDist / 9) * Math.PI) * 0.5;
        }
      }

      // Bharati: Coastal sea ice drop-off on negative Z side
      if (stationId === 'bharati' && y < -20) {
        elevation = -2.5 + Math.sin(x * 0.1) * 0.4;
      }

      pos.setZ(i, elevation);
    }

    geo.computeVertexNormals();
    return geo;
  }, [stationId]);

  return (
    <group>
      {/* Main Stylized Antarctic Snow Surface */}
      <mesh
        geometry={terrainGeo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#dbeafe" // Ice-blue white
          roughness={0.85}
          metalness={0.1}
          flatShading={true}
        />
      </mesh>

      {/* Subtle Glowing Polar Grid lines & Compass Rings */}
      <gridHelper
        args={[100, 50, '#38bdf8', '#1e293b']}
        position={[0, 0.02, 0]}
      />

      {/* Polar Coordinate Marker Rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[18, 18.2, 64]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[32, 32.2, 64]} />
        <meshBasicMaterial color="#0369a1" transparent opacity={0.25} />
      </mesh>

      {/* MAITRI SPECIFIC: Lake Priyadarshini Frozen Water Mesh */}
      {stationId === 'maitri' && (
        <group position={[18, -0.6, 16]}>
          {/* Deep blue frozen glacial ice */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[8.5, 32]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.1}
              metalness={0.8}
              transparent
              opacity={0.88}
            />
          </mesh>
          {/* Ice cracks and water intake glow */}
          <pointLight color="#38bdf8" intensity={1.5} distance={12} position={[0, 1, 0]} />
        </group>
      )}

      {/* BHARATI SPECIFIC: Coastal Prydz Bay Ocean & Pack Ice Chunks */}
      {stationId === 'bharati' && (
        <group position={[0, -2.4, -34]}>
          {/* Antarctic Ocean */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[110, 30]} />
            <meshStandardMaterial
              color="#032b4b"
              roughness={0.2}
              metalness={0.6}
              transparent
              opacity={0.92}
            />
          </mesh>
          {/* Floating pack ice blocks */}
          {[-25, -12, 0, 14, 28].map((px, idx) => (
            <mesh
              key={idx}
              position={[px + Math.sin(idx) * 3, 0.2, Math.cos(idx) * 4]}
              rotation={[0, idx * 0.7, 0]}
            >
              <boxGeometry args={[4 + idx * 0.5, 0.6, 3 + (idx % 3)]} />
              <meshStandardMaterial color="#e0f2fe" roughness={0.7} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
