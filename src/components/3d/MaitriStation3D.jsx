import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import InteractiveAsset3D from './InteractiveAsset3D';
import WindTurbine3D from './WindTurbine3D';
import { useStationData } from '../../context/StationDataContext';
import { getStatusColor } from '../../utils/stationHealth';
import { MAITRI_LAYOUT } from '../../data/maitriLayout';

// Coordinate converter: 2D (1400 x 950, center [700, 480]) to 3D Three.js
const SCALE = 0.055;
const to3DX = (x) => (x - 700) * SCALE;
const to3DZ = (y) => (y - 480) * SCALE;

export default function MaitriStation3D({ assets = [] }) {
  const { interiorCutaway, selectedBuildingId, selectBuilding, telemetryBuildings = [] } = useStationData();
  const dishGimbalRef = useRef();
  const pulseRingRef = useRef();

  // Helper to find telemetry / asset data safely by id
  const getAsset = (id) => {
    const normHyphen = id.replace(/_/g, '-');
    const normUnderscore = id.replace(/-/g, '_');
    const telemetryMatch = telemetryBuildings.find(
      (b) =>
        b.id === id ||
        b.id === normUnderscore ||
        b.id === normHyphen ||
        b.id.includes(normUnderscore) ||
        normUnderscore.includes(b.id)
    );
    const assetMatch = assets.find(
      (a) =>
        a.id === id ||
        a.id === normHyphen ||
        a.id === normUnderscore ||
        a.id.includes(normHyphen) ||
        normHyphen.includes(a.id)
    );
    return {
      ...(assetMatch || {}),
      ...(telemetryMatch || {}),
      id: telemetryMatch?.id || id,
      name: telemetryMatch?.name || assetMatch?.name || id,
      status: telemetryMatch?.status || assetMatch?.status || 'healthy',
      telemetry: telemetryMatch?.telemetry || assetMatch?.metrics || {},
    };
  };

  // Satellite and pulse animations
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (dishGimbalRef.current) {
      dishGimbalRef.current.rotation.y = Math.sin(t * 0.15) * 0.35 + 0.4;
      dishGimbalRef.current.rotation.x = Math.cos(t * 0.1) * 0.08 - 0.55;
    }
    if (pulseRingRef.current) {
      const s = 1 + (t % 2) * 1.8;
      pulseRingRef.current.scale.set(s, s, s);
      pulseRingRef.current.material.opacity = Math.max(0, 1 - (t % 2) / 2);
    }
  });

  // Assets lookup
  const maitriMain = getAsset('maitri_main_station');
  const maitriLounge = getAsset('maitri_observation_lounge');
  const maitriYSpoke = getAsset('maitri_spoke_module');
  const maitriGen = getAsset('maitri_generator');
  const maitriSat = getAsset('maitri_satellite');
  const maitriWater = getAsset('maitri_water');
  const maitriCentralCnt = getAsset('maitri_central_containers');
  const maitriWorkshop = getAsset('maitri_workshop');
  const maitriVehicles = getAsset('maitri_vehicles');
  const maitriResidential = getAsset('maitri_residential');
  const maitriFuel = getAsset('maitri_fuel');
  const maitriSummer = getAsset('maitri_summer_camp');
  const maitriHelipad = getAsset('maitri_helipad');
  const maitriStorage = getAsset('maitri_storage');
  const maitriWeather = getAsset('maitri_weather');

  // Convert 2D road paths into 3D line ribbons
  const roadRibbons = useMemo(() => {
    const roads = MAITRI_LAYOUT?.infrastructure?.roads || [];
    return roads.map((rStr) => {
      const points = [];
      const cmds = rStr.split(/(?=[ML])/);
      cmds.forEach((cmd) => {
        const parts = cmd.trim().substring(1).trim().split(',');
        if (parts.length === 2) {
          const px = parseFloat(parts[0]);
          const py = parseFloat(parts[1]);
          if (!isNaN(px) && !isNaN(py)) {
            points.push(new THREE.Vector3(to3DX(px), 0.04, to3DZ(py)));
          }
        }
      });
      return points;
    });
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================================= */}
      {/* 0. 3D ROAD NETWORK (EXACT 2D BLUEPRINT ALIGNMENT)                         */}
      {/* ========================================================================= */}
      <group>
        {roadRibbons.map((pts, rIdx) => {
          if (pts.length < 2) return null;
          // Build ribbon segments along path
          return (
            <group key={`road-ribbon-${rIdx}`}>
              {pts.map((p, i) => {
                if (i === pts.length - 1) return null;
                const nextP = pts[i + 1];
                const midX = (p.x + nextP.x) / 2;
                const midZ = (p.z + nextP.z) / 2;
                const dist = Math.hypot(nextP.x - p.x, nextP.z - p.z);
                const angle = Math.atan2(nextP.x - p.x, nextP.z - p.z);
                return (
                  <mesh
                    key={`seg-${i}`}
                    position={[midX, 0.03, midZ]}
                    rotation={[-Math.PI / 2, 0, -angle]}
                    receiveShadow
                  >
                    <planeGeometry args={[1.2, dist + 0.1]} />
                    <meshStandardMaterial
                      color="#1e293b"
                      roughness={0.9}
                      metalness={0.1}
                      polygonOffset
                      polygonOffsetFactor={-1}
                    />
                  </mesh>
                );
              })}
            </group>
          );
        })}
      </group>

      {/* ========================================================================= */}
      {/* 0.1 OVERGROUND HEATED PIPELINE SYSTEM (EXACT 2D BLUEPRINT)                */}
      {/* ========================================================================= */}
      <group>
        {/* Lake Priyadarshini water intake pier on trestles: [90, 195] to [420, 410] */}
        {[
          [ [90, 195], [240, 360] ],
          [ [240, 360], [380, 410] ],
          [ [380, 410], [420, 410] ],
          [ [420, 410], [490, 480] ],
          [ [490, 480], [580, 500] ],
          [ [580, 500], [650, 470] ],
          [ [650, 470], [720, 470] ],
        ].map(([p1, p2], idx) => {
          const x1 = to3DX(p1[0]);
          const z1 = to3DZ(p1[1]);
          const x2 = to3DX(p2[0]);
          const z2 = to3DZ(p2[1]);
          const midX = (x1 + x2) / 2;
          const midZ = (z1 + z2) / 2;
          const dist = Math.hypot(x2 - x1, z2 - z1);
          const angle = Math.atan2(x2 - x1, z2 - z1);
          return (
            <group key={`water-pipe-${idx}`}>
              {/* Pipe Body */}
              <mesh position={[midX, 0.45, midZ]} rotation={[0, angle, Math.PI / 2]}>
                <cylinderGeometry args={[0.07, 0.07, dist, 8]} />
                <meshStandardMaterial color="#06b6d4" emissive="#0284c7" emissiveIntensity={0.6} metalness={0.8} />
              </mesh>
              {/* Stanchion support cradle */}
              <mesh position={[x1, 0.22, z1]}>
                <cylinderGeometry args={[0.04, 0.04, 0.45, 6]} />
                <meshStandardMaterial color="#475569" />
              </mesh>
            </group>
          );
        })}

        {/* Fuel Pipeline: [280, 800] L [340, 740] L [440, 660] L [490, 570] */}
        {[
          [ [280, 800], [340, 740] ],
          [ [340, 740], [440, 660] ],
          [ [440, 660], [490, 570] ],
        ].map(([p1, p2], idx) => {
          const x1 = to3DX(p1[0]);
          const z1 = to3DZ(p1[1]);
          const x2 = to3DX(p2[0]);
          const z2 = to3DZ(p2[1]);
          const midX = (x1 + x2) / 2;
          const midZ = (z1 + z2) / 2;
          const dist = Math.hypot(x2 - x1, z2 - z1);
          const angle = Math.atan2(x2 - x1, z2 - z1);
          return (
            <mesh key={`fuel-pipe-${idx}`} position={[midX, 0.35, midZ]} rotation={[0, angle, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, dist, 8]} />
              <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.5} metalness={0.8} />
            </mesh>
          );
        })}
      </group>

      {/* ========================================================================= */}
      {/* 1. MAIN STATION COMPLEX (CENTRAL HUB) - U-SHAPED BLUEPRINT FOOTPRINT      */}
      {/* ========================================================================= */}
      <InteractiveAsset3D
        asset={maitriMain}
        position={[to3DX(750), 0, to3DZ(470)]}
        badgeOffset={[0, 4.8, 0]}
      >
        <group position={[-to3DX(750), 0, -to3DZ(470)]}>
          {/* North Wing: x: 650, y: 390, width: 220, height: 38 */}
          <group position={[to3DX(650 + 110), 0, to3DZ(390 + 19)]}>
            {/* Stilts */}
            {[-5.0, -2.5, 0, 2.5, 5.0].map((sx, i) => (
              <mesh key={`n-stilt-${i}`} position={[sx, 0.6, 0]}>
                <boxGeometry args={[0.25, 1.2, 0.25]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
              </mesh>
            ))}
            {/* Wing Body */}
            <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
              <boxGeometry args={[220 * SCALE, interiorCutaway ? 1.2 : 2.2, 38 * SCALE]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Corrugated Silver Cladding Ribs */}
            {[-4.5, -3.0, -1.5, 0, 1.5, 3.0, 4.5].map((rx, idx) => (
              <mesh key={`n-rib-${idx}`} position={[rx, 2.1, 0]}>
                <boxGeometry args={[0.1, 2.22, 38 * SCALE + 0.04]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.7} />
              </mesh>
            ))}
            {/* Roof Top Accent */}
            <mesh position={[0, interiorCutaway ? 2.8 : 3.3, 0]}>
              <boxGeometry args={[220 * SCALE + 0.2, 0.2, 38 * SCALE + 0.2]} />
              <meshStandardMaterial color="#ea580c" metalness={0.3} roughness={0.4} />
            </mesh>
            {/* Arctic Windows */}
            {[-4.0, -2.4, -0.8, 0.8, 2.4, 4.0].map((wx, idx) => (
              <mesh key={`n-win-${idx}`} position={[wx, 2.2, -(38 * SCALE) / 2 - 0.03]}>
                <boxGeometry args={[0.9, 0.6, 0.05]} />
                <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
              </mesh>
            ))}
          </group>

          {/* East Connecting Vertical Wing: x: 835, y: 428, width: 40, height: 95 */}
          <group position={[to3DX(835 + 20), 0, to3DZ(428 + 47.5)]}>
            {/* Stilts */}
            {[-1.8, 0, 1.8].map((sz, i) => (
              <mesh key={`e-stilt-${i}`} position={[0, 0.6, sz]}>
                <boxGeometry args={[0.25, 1.2, 0.25]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} />
              </mesh>
            ))}
            {/* Wing Body */}
            <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
              <boxGeometry args={[40 * SCALE, interiorCutaway ? 1.2 : 2.2, 95 * SCALE]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Roof */}
            <mesh position={[0, interiorCutaway ? 2.8 : 3.3, 0]}>
              <boxGeometry args={[40 * SCALE + 0.2, 0.2, 95 * SCALE + 0.2]} />
              <meshStandardMaterial color="#ea580c" metalness={0.3} roughness={0.4} />
            </mesh>
            {/* East Facade Windows */}
            {[-1.8, -0.6, 0.6, 1.8].map((wz, idx) => (
              <mesh key={`e-win-${idx}`} position={[(40 * SCALE) / 2 + 0.03, 2.2, wz]}>
                <boxGeometry args={[0.05, 0.6, 0.8]} />
                <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
              </mesh>
            ))}
            {/* Indian Tricolor Flag on Corner Mast */}
            <group position={[(40 * SCALE) / 2 + 0.4, 3.4, -(95 * SCALE) / 2]}>
              {/* Flag Pole */}
              <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.04, 0.05, 3.2, 8]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
              </mesh>
              {/* Indian Tricolor Banner */}
              <group position={[0.5, 2.6, 0]}>
                <mesh position={[0, 0.2, 0]}>
                  <boxGeometry args={[0.9, 0.2, 0.02]} />
                  <meshStandardMaterial color="#f97316" />
                </mesh>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.9, 0.2, 0.02]} />
                  <meshStandardMaterial color="#ffffff" />
                </mesh>
                <mesh position={[0, -0.2, 0]}>
                  <boxGeometry args={[0.9, 0.2, 0.02]} />
                  <meshStandardMaterial color="#16a34a" />
                </mesh>
              </group>
            </group>
          </group>

          {/* South Wing: x: 580, y: 520, width: 245, height: 40 */}
          <group position={[to3DX(580 + 122.5), 0, to3DZ(520 + 20)]}>
            {/* Stilts */}
            {[-5.4, -2.7, 0, 2.7, 5.4].map((sx, i) => (
              <mesh key={`s-stilt-${i}`} position={[sx, 0.6, 0]}>
                <boxGeometry args={[0.25, 1.2, 0.25]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} />
              </mesh>
            ))}
            {/* Wing Body */}
            <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
              <boxGeometry args={[245 * SCALE, interiorCutaway ? 1.2 : 2.2, 40 * SCALE]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Roof Top Accent */}
            <mesh position={[0, interiorCutaway ? 2.8 : 3.3, 0]}>
              <boxGeometry args={[245 * SCALE + 0.2, 0.2, 40 * SCALE + 0.2]} />
              <meshStandardMaterial color="#ea580c" metalness={0.3} roughness={0.4} />
            </mesh>
            {/* Windows along South Wall */}
            {[-5.0, -3.2, -1.4, 0.4, 2.2, 4.0, 5.8].map((wx, idx) => (
              <mesh key={`s-win-${idx}`} position={[wx, 2.2, (40 * SCALE) / 2 + 0.03]}>
                <boxGeometry args={[0.9, 0.6, 0.05]} />
                <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
              </mesh>
            ))}
          </group>

          {/* West Entry Vestibule: x: 650, y: 428, width: 32, height: 55 */}
          <group position={[to3DX(650 + 16), 0, to3DZ(428 + 27.5)]}>
            <mesh position={[0, 1.8, 0]}>
              <boxGeometry args={[32 * SCALE, 1.8, 55 * SCALE]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.5} />
            </mesh>
            {/* Entry Door Hatch */}
            <mesh position={[-(32 * SCALE) / 2 - 0.04, 1.4, 0]}>
              <boxGeometry args={[0.06, 1.4, 0.8]} />
              <meshStandardMaterial color="#eab308" />
            </mesh>
            {/* Access Steps */}
            {[0.2, 0.5, 0.8].map((sy, i) => (
              <mesh key={`step-${i}`} position={[-(32 * SCALE) / 2 - 0.3 - i * 0.25, sy, 0]}>
                <boxGeometry args={[0.3, 0.25, 1.0]} />
                <meshStandardMaterial color="#475569" />
              </mesh>
            ))}
          </group>
        </group>
      </InteractiveAsset3D>

      {/* ========================================================================= */}
      {/* 2. GLAZED OBSERVATION LOUNGE (SE FACETED SOLARIUM)                        */}
      {/* ========================================================================= */}
      <InteractiveAsset3D
        asset={maitriLounge}
        position={[to3DX(810), 0, to3DZ(540)]}
        badgeOffset={[0, 4.0, 0]}
      >
        <group>
          {/* Glazed Faceted Solarium Shell matching 2D coords '785,520 835,520 825,560 785,560' */}
          <mesh position={[0, 2.1, 0]} castShadow>
            <boxGeometry args={[50 * SCALE, 2.3, 40 * SCALE]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.4}
              transparent
              opacity={0.65}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
          {/* Solarium Metallic Roof Rim */}
          <mesh position={[0, 3.3, 0]}>
            <boxGeometry args={[50 * SCALE + 0.2, 0.2, 40 * SCALE + 0.2]} />
            <meshStandardMaterial color="#0284c7" metalness={0.8} />
          </mesh>
          {/* Internal Warm Solarium Glow */}
          <pointLight color="#bae6fd" intensity={1.5} distance={6} position={[0, 2.0, 0]} />
        </group>
      </InteractiveAsset3D>

      {/* ========================================================================= */}
      {/* 3. TRIANGULAR Y-SPOKE MODULE HUB (center: [610, 680])                      */}
      {/* ========================================================================= */}
      <InteractiveAsset3D
        asset={maitriYSpoke}
        position={[to3DX(610), 0, to3DZ(680)]}
        badgeOffset={[0, 4.2, 0]}
      >
        <group>
          {/* Central Stilt Columns */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 1.0, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          {/* Central Connecting Airlock Pod: circle cx: 610, cy: 680, r: 10 */}
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[10 * SCALE, 10 * SCALE, 1.8, 24]} />
            <meshStandardMaterial color="#ea580c" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, 2.8, 0]}>
            <sphereGeometry args={[10 * SCALE, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial color="#f97316" metalness={0.5} />
          </mesh>

          {/* 3 Container Wings Radiating at 120° (North, South-East, South-West) */}
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
            <group key={`y-arm-${idx}`} rotation={[0, angle, 0]}>
              {/* Arm Stilt */}
              <mesh position={[0, 0.5, -1.4]}>
                <boxGeometry args={[0.2, 1.0, 0.2]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
              {/* Radiating Arm Box */}
              <mesh position={[0, 1.8, -1.4]} castShadow>
                <boxGeometry args={[12 * SCALE, 1.6, 40 * SCALE]} />
                <meshStandardMaterial color="#ea580c" metalness={0.4} roughness={0.4} />
              </mesh>
              {/* Ribbing */}
              {[-0.8, -1.4, -2.0].map((rz, ri) => (
                <mesh key={`y-rib-${ri}`} position={[0, 1.8, rz]}>
                  <boxGeometry args={[12 * SCALE + 0.04, 1.62, 0.08]} />
                  <meshStandardMaterial color="#c2410c" />
                </mesh>
              ))}
              {/* End Window */}
              <mesh position={[0, 1.9, -(40 * SCALE) / 2 - 0.7]}>
                <boxGeometry args={[0.4, 0.4, 0.05]} />
                <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      </InteractiveAsset3D>

      {/* ========================================================================= */}
      {/* 4. INTERNAL GENERATOR ROOM & POWER STATION (center: [520, 580])           */}
      {/* ========================================================================= */}
      <InteractiveAsset3D
        asset={maitriGen}
        position={[to3DX(522.5), 0, to3DZ(577.5)]}
        badgeOffset={[0, 4.4, 0]}
      >
        <group>
          {/* Foundation Stilt Bed */}
          {[-1.8, 0, 1.8].map((sx, i) =>
            [-1.0, 1.0].map((sz, j) => (
              <mesh key={`gen-stilt-${i}-${j}`} position={[sx, 0.4, sz]}>
                <boxGeometry args={[0.2, 0.8, 0.2]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
            ))
          )}
          {/* Generator Shed: 85 x 55 */}
          <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
            <boxGeometry args={[85 * SCALE, 1.8, 55 * SCALE]} />
            <meshStandardMaterial color="#ea580c" metalness={0.4} roughness={0.4} />
          </mesh>
          {/* Ribs */}
          {[-1.4, 0, 1.4].map((rx, idx) => (
            <mesh key={`gen-rib-${idx}`} position={[rx, 1.7, 0]}>
              <boxGeometry args={[0.1, 1.82, 55 * SCALE + 0.04]} />
              <meshStandardMaterial color="#c2410c" />
            </mesh>
          ))}
          {/* Twin Diesel Exhaust Silencer Stacks */}
          {[-0.8, 0.8].map((sx, idx) => (
            <group key={`stack-${idx}`} position={[sx, 2.6, -0.6]}>
              <mesh position={[0, 0.8, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 1.6, 12]} />
                <meshStandardMaterial color="#475569" metalness={0.9} />
              </mesh>
              {/* Rain Cap */}
              <mesh position={[0, 1.65, 0]}>
                <coneGeometry args={[0.2, 0.15, 12]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
            </group>
          ))}
          {/* Status Warning Flasher */}
          <mesh position={[1.8, 2.7, 0.8]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial
              color={getStatusColor(maitriGen.status).hex}
              emissive={getStatusColor(maitriGen.status).hex}
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>
      </InteractiveAsset3D>

      {/* ========================================================================= */}
      {/* 5. CENTRAL LOGISTICS & TECHNICAL MODULES (center: [515, 645])              */}
      {/* ========================================================================= */}
      <InteractiveAsset3D
        asset={maitriCentralCnt}
        position={[to3DX(515), 0, to3DZ(647.5)]}
        badgeOffset={[0, 3.8, 0]}
      >
        <group>
          {/* Stilts */}
          {[-2.4, -0.8, 0.8, 2.4].map((sx, i) => (
            <mesh key={`cnt-stilt-${i}`} position={[sx, 0.35, 0]}>
              <boxGeometry args={[0.15, 0.7, 0.15]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          ))}
          {/* Container Row: 110 x 25 */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <boxGeometry args={[110 * SCALE, 1.4, 25 * SCALE]} />
            <meshStandardMaterial color="#ea580c" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Vertical Container Separators */}
          {[-1.8, -0.6, 0.6, 1.8].map((rx, idx) => (
            <mesh key={`cnt-sep-${idx}`} position={[rx, 1.4, 0]}>
              <boxGeometry args={[0.08, 1.42, 25 * SCALE + 0.04]} />
              <meshStandardMaterial color="#9a3412" />
            </mesh>
          ))}
        </group>
      </InteractiveAsset3D>

      {/* ========================================================================= */}
      {/* 6. SATELLITE GROUND STATION & RADOME (center: [480, 480])                 */}
      {/* ========================================================================= */}
      <InteractiveAsset3D
        asset={maitriSat}
        position={[to3DX(480), 0, to3DZ(480)]}
        badgeOffset={[0, 4.2, 0]}
      >
        <group>
          {/* Circular Concrete Pad: r: 22 */}
          <mesh position={[0, 0.15, 0]} receiveShadow>
            <cylinderGeometry args={[22 * SCALE, 22 * SCALE, 0.3, 32]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
          {/* White Geodesic Weather Radome Sphere: r: 15 */}
          <mesh position={[0, 15 * SCALE + 0.3, 0]} castShadow>
            <sphereGeometry args={[15 * SCALE, 32, 24]} />
            <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.3} />
          </mesh>
          {/* Radome Base Pedestal Ring */}
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[15 * SCALE + 0.05, 15 * SCALE + 0.05, 0.2, 24]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
        </group>
      </InteractiveAsset3D>

      {/* ========================================================================= */}
      {/* 7. WATER RESERVOIR PUMP HOUSE & TRESTLE INTAKE PIER (center: [380, 430])   */}
      {/* ========================================================================= */}
      <InteractiveAsset3D
        asset={maitriWater}
        position={[to3DX(377.5), 0, to3DZ(432.5)]}
        badgeOffset={[0, 3.8, 0]}
      >
        <group>
          {/* Shelter: 55 x 35 */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[55 * SCALE, 1.8, 35 * SCALE]} />
            <meshStandardMaterial color="#0284c7" metalness={0.4} roughness={0.4} />
          </mesh>
          {/* Roof */}
          <mesh position={[0, 2.2, 0]}>
            <boxGeometry args={[55 * SCALE + 0.2, 0.2, 35 * SCALE + 0.2]} />
            <meshStandardMaterial color="#0369a1" />
          </mesh>
          {/* Buffer Tanks on South Side */}
          {[-0.7, 0.7].map((tx, idx) => (
            <mesh key={`tk-${idx}`} position={[tx, 1.0, 35 * SCALE + 0.5]}>
              <cylinderGeometry args={[0.45, 0.45, 1.4, 16]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.7} roughness={0.2} />
            </mesh>
          ))}
        </group>
      </InteractiveAsset3D>

      {/* ========================================================================= */}
      {/* 8. BLUE BARREL-VAULT QUONSET WORKSHOP (center: [320, 310])                */}
      {/* ========================================================================= */}
      <InteractiveAsset3D
        asset={maitriWorkshop}
        position={[to3DX(320), 0, to3DZ(310)]}
        badgeOffset={[0, 4.5, 0]}
      >
        <group>
          {/* Blue Curved Barrel Vault Semi-Cylinder: 90 x 50, rx: 16 */}
          {/* Oriented along X axis, width = 90 * SCALE (4.95), depth = 50 * SCALE (2.75) */}
          <mesh position={[0, 1.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry
              args={[
                (50 * SCALE) / 2, // Radius = half of depth
                (50 * SCALE) / 2,
                90 * SCALE, // Extruded length along X
                24,
                1,
                false,
                0,
                Math.PI // Upper semi-circle arch
              ]}
            />
            <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.3} side={2} />
          </mesh>
          {/* Workshop Base Foundation Slab */}
          <mesh position={[0, 0.15, 0]} receiveShadow>
            <boxGeometry args={[90 * SCALE + 0.3, 0.3, 50 * SCALE + 0.3]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
          {/* Rib Arches */}
          {[-1.8, -0.9, 0, 0.9, 1.8].map((rx, idx) => (
            <mesh key={`arch-rib-${idx}`} position={[rx, 1.4, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry
                args={[
                  (50 * SCALE) / 2 + 0.03,
                  (50 * SCALE) / 2 + 0.03,
                  0.08,
                  24,
                  1,
                  false,
                  0,
                  Math.PI
                ]}
              />
              <meshStandardMaterial color="#1d4ed8" metalness={0.8} />
            </mesh>
          ))}
          {/* East Heavy Machinery Garage Roll-Up Door: '365,295 385,295 385,325 365,325' */}
          <mesh position={[(90 * SCALE) / 2 + 0.04, 0.9, 0]}>
            <boxGeometry args={[0.08, 1.5, 1.8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} />
          </mesh>
        </group>
      </InteractiveAsset3D>

      {/* ========================================================================= */}
      {/* 9. NW MODULAR RESIDENTIAL & OFFICE COMPACT BLOCKS (center: [430, 270])    */}
      {/* ========================================================================= */}
      <InteractiveAsset3D
        asset={maitriResidential}
        position={[to3DX(430), 0, to3DZ(270)]}
        badgeOffset={[0, 4.0, 0]}
      >
        <group position={[-to3DX(430), 0, -to3DZ(270)]}>
          {/* Row 1: x: 375, y: 240, width: 105, height: 24 */}
          <group position={[to3DX(375 + 52.5), 0, to3DZ(240 + 12)]}>
            {/* Stilts */}
            {[-2.2, -0.7, 0.7, 2.2].map((sx, i) => (
              <mesh key={`r1-stilt-${i}`} position={[sx, 0.4, 0]}>
                <boxGeometry args={[0.15, 0.8, 0.15]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
            ))}
            {/* Container Body */}
            <mesh position={[0, 1.5, 0]} castShadow>
              <boxGeometry args={[105 * SCALE, 1.5, 24 * SCALE]} />
              <meshStandardMaterial color="#ea580c" metalness={0.4} roughness={0.4} />
            </mesh>
            {/* Windows */}
            {[-1.8, -0.6, 0.6, 1.8].map((wx, idx) => (
              <mesh key={`r1-win-${idx}`} position={[wx, 1.6, (24 * SCALE) / 2 + 0.02]}>
                <boxGeometry args={[0.5, 0.4, 0.04]} />
                <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
              </mesh>
            ))}
          </group>

          {/* Row 2: x: 405, y: 275, width: 110, height: 24 */}
          <group position={[to3DX(405 + 55), 0, to3DZ(275 + 12)]}>
            {/* Stilts */}
            {[-2.2, -0.7, 0.7, 2.2].map((sx, i) => (
              <mesh key={`r2-stilt-${i}`} position={[sx, 0.4, 0]}>
                <boxGeometry args={[0.15, 0.8, 0.15]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
            ))}
            {/* Container Body */}
            <mesh position={[0, 1.5, 0]} castShadow>
              <boxGeometry args={[110 * SCALE, 1.5, 24 * SCALE]} />
              <meshStandardMaterial color="#ea580c" metalness={0.4} roughness={0.4} />
            </mesh>
            {/* Windows */}
            {[-1.8, -0.6, 0.6, 1.8].map((wx, idx) => (
              <mesh key={`r2-win-${idx}`} position={[wx, 1.6, -(24 * SCALE) / 2 - 0.02]}>
                <boxGeometry args={[0.5, 0.4, 0.04]} />
                <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
              </mesh>
            ))}
          </group>

          {/* Interconnecting Boardwalk Platform */}
          <mesh position={[to3DX(430), 0.75, to3DZ(260)]}>
            <boxGeometry args={[4.5, 0.1, 1.1]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
        </group>
      </InteractiveAsset3D>

      {/* ========================================================================= */}
      {/* 10. LIQUID FUEL STORAGE FARM (center: [230, 810])                          */}
      {/* ========================================================================= */}
      <InteractiveAsset3D
        asset={maitriFuel}
        position={[to3DX(230), 0, to3DZ(810)]}
        badgeOffset={[0, 4.5, 0]}
      >
        <group position={[-to3DX(230), 0, -to3DZ(810)]}>
          {/* Concrete Containment Bunding: 120,770 to 330,860 */}
          <mesh position={[to3DX(225), 0.15, to3DZ(815)]} receiveShadow>
            <boxGeometry args={[210 * SCALE, 0.3, 90 * SCALE]} />
            <meshStandardMaterial color="#334155" roughness={0.9} />
          </mesh>
          {/* Safety Yellow Curbing */}
          <mesh position={[to3DX(225), 0.35, to3DZ(815) + (90 * SCALE) / 2]}>
            <boxGeometry args={[210 * SCALE, 0.15, 0.15]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>

          {/* 8 White Horizontal Cylindrical Tanks in 2 Rows on Skids */}
          {[785, 820].map((ty, rowIdx) =>
            [140, 185, 230, 275].map((tx, colIdx) => (
              <group
                key={`skid-tank-${rowIdx}-${colIdx}`}
                position={[to3DX(tx + 19), 0.75, to3DZ(ty + 9)]}
              >
                {/* Horizontal White Tank Cylinder: width: 38, height: 18 */}
                <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                  <cylinderGeometry args={[0.5, 0.5, 38 * SCALE, 20]} />
                  <meshStandardMaterial color="#f8fafc" metalness={0.7} roughness={0.2} />
                </mesh>
                {/* Steel Skid Cradle */}
                {[-0.7, 0.7].map((cx, ci) => (
                  <mesh key={`cradle-${ci}`} position={[cx, -0.35, 0]}>
                    <boxGeometry args={[0.1, 0.4, 1.1]} />
                    <meshStandardMaterial color="#1e293b" />
                  </mesh>
                ))}
                {/* Level Gauge Strip */}
                <mesh position={[0, 0.52, 0]}>
                  <boxGeometry args={[1.4, 0.04, 0.05]} />
                  <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.8} />
                </mesh>
              </group>
            ))
          )}
        </group>
      </InteractiveAsset3D>

      {/* ========================================================================= */}
      {/* 11. TRACKED VEHICLE FLEET & CONVOY STAGING (center: [435, 815])           */}
      {/* ========================================================================= */}
      <InteractiveAsset3D
        asset={maitriVehicles}
        position={[to3DX(435), 0, to3DZ(815)]}
        badgeOffset={[0, 4.0, 0]}
      >
        <group position={[-to3DX(435), 0, -to3DZ(815)]}>
          {/* Staging Hardpack Pad: 345,765 to 525,865 */}
          <mesh position={[to3DX(435), 0.08, to3DZ(815)]} receiveShadow>
            <boxGeometry args={[180 * SCALE, 0.16, 100 * SCALE]} />
            <meshStandardMaterial color="#1e293b" roughness={0.95} />
          </mesh>

          {/* Staged PistenBully 300 Polar Snowcats & Convoys matching 2D vehicles */}
          {[
            { x: 375, y: 790, type: 'pb' },
            { x: 415, y: 790, type: 'pb' },
            { x: 455, y: 790, type: 'crane' },
            { x: 495, y: 790, type: 'tanker' },
            { x: 375, y: 840, type: 'pb' },
            { x: 415, y: 840, type: 'convoy' },
            { x: 455, y: 840, type: 'rover' },
            { x: 495, y: 840, type: 'sled' },
          ].map((v, idx) => (
            <group key={`veh-${idx}`} position={[to3DX(v.x), 0.25, to3DZ(v.y)]}>
              {/* Tracks */}
              {[-0.45, 0.45].map((tz, ti) => (
                <mesh key={`trk-${ti}`} position={[0, 0.15, tz]}>
                  <boxGeometry args={[1.4, 0.25, 0.2]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
              ))}
              {/* Vehicle Body */}
              <mesh position={[0, 0.4, 0]} castShadow>
                <boxGeometry args={[1.2, 0.45, 0.8]} />
                <meshStandardMaterial
                  color={v.type === 'pb' ? '#dc2626' : v.type === 'crane' ? '#eab308' : '#0284c7'}
                />
              </mesh>
              {/* Cab Glass */}
              <mesh position={[0.3, 0.6, 0]}>
                <boxGeometry args={[0.5, 0.35, 0.75]} />
                <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
              </mesh>
              {/* Front Blade */}
              {v.type === 'pb' && (
                <mesh position={[0.75, 0.15, 0]}>
                  <boxGeometry args={[0.08, 0.3, 1.1]} />
                  <meshStandardMaterial color="#eab308" />
                </mesh>
              )}
            </group>
          ))}
        </group>
      </InteractiveAsset3D>

      {/* ========================================================================= */}
      {/* 12. ALL-WEATHER HELIPAD (center: [880, 720], r: 34)                       */}
      {/* ========================================================================= */}
      <InteractiveAsset3D
        asset={maitriHelipad}
        position={[to3DX(880), 0, to3DZ(720)]}
        badgeOffset={[0, 4.2, 0]}
      >
        <group>
          {/* Foundation Steel Stilts around perimeter */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const sx = Math.cos(rad) * (34 * SCALE * 0.9);
            const sz = Math.sin(rad) * (34 * SCALE * 0.9);
            return (
              <mesh key={`heli-stilt-${i}`} position={[sx, 0.3, sz]}>
                <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
            );
          })}
          {/* Helipad Deck: r: 34 */}
          <mesh position={[0, 0.6, 0]} receiveShadow>
            <cylinderGeometry args={[34 * SCALE, 34 * SCALE, 0.15, 32]} />
            <meshStandardMaterial color="#111827" roughness={0.9} />
          </mesh>
          {/* Yellow Safety De-Icing Ring */}
          <mesh position={[0, 0.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[34 * SCALE * 0.88, 34 * SCALE * 0.98, 32]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
          {/* Inner Touchdown Circle */}
          <mesh position={[0, 0.682, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[34 * SCALE * 0.65, 34 * SCALE * 0.72, 32]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Bold White "H" */}
          {/* Left Vertical Bar */}
          <mesh position={[-0.45, 0.685, 0]}>
            <boxGeometry args={[0.18, 0.01, 1.1]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
          </mesh>
          {/* Right Vertical Bar */}
          <mesh position={[0.45, 0.685, 0]}>
            <boxGeometry args={[0.18, 0.01, 1.1]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
          </mesh>
          {/* Center Crossbar */}
          <mesh position={[0, 0.685, 0]}>
            <boxGeometry args={[0.9, 0.01, 0.18]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
          </mesh>
          {/* Perimeter Aviation Approach Lights */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => {
            const rad = (deg * Math.PI) / 180;
            const lx = Math.cos(rad) * (34 * SCALE * 0.96);
            const lz = Math.sin(rad) * (34 * SCALE * 0.96);
            return (
              <mesh key={`h-light-${idx}`} position={[lx, 0.72, lz]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial
                  color={idx % 2 === 0 ? '#22c55e' : '#ffffff'}
                  emissive={idx % 2 === 0 ? '#22c55e' : '#ffffff'}
                  emissiveIntensity={2.5}
                />
              </mesh>
            );
          })}
          {/* Windsock Mast */}
          <group position={[2.2, 0.6, -1.8]}>
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.03, 0.04, 2.4, 6]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
            </mesh>
            <mesh position={[0.3, 2.2, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.2, 0.6, 8]} />
              <meshStandardMaterial color="#ea580c" />
            </mesh>
          </group>
        </group>
      </InteractiveAsset3D>

      {/* ========================================================================= */}
      {/* 13. LONG-TERM STORAGE MODULES (center: [1020, 720])                        */}
      {/* ========================================================================= */}
      <InteractiveAsset3D
        asset={maitriStorage}
        position={[to3DX(1020), 0, to3DZ(720)]}
        badgeOffset={[0, 4.0, 0]}
      >
        <group position={[-to3DX(1020), 0, -to3DZ(720)]}>
          {/* Row 1: x: 950, y: 660, w: 30, h: 120 */}
          <mesh position={[to3DX(965), 1.1, to3DZ(720)]} castShadow>
            <boxGeometry args={[30 * SCALE, 1.8, 120 * SCALE]} />
            <meshStandardMaterial color="#ea580c" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Row 2: x: 1040, y: 660, w: 30, h: 120 */}
          <mesh position={[to3DX(1055), 1.1, to3DZ(720)]} castShadow>
            <boxGeometry args={[30 * SCALE, 1.8, 120 * SCALE]} />
            <meshStandardMaterial color="#2563eb" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      </InteractiveAsset3D>

      {/* ========================================================================= */}
      {/* 14. SUMMER EXPEDITION TRANSIT CAMP (along lake shore: [920, 250])          */}
      {/* ========================================================================= */}
      <InteractiveAsset3D
        asset={maitriSummer}
        position={[to3DX(920), 0, to3DZ(250)]}
        badgeOffset={[0, 3.5, 0]}
      >
        <group position={[-to3DX(920), 0, -to3DZ(250)]}>
          {/* 7 Modular blue cabins: x: 840, 865, 890, 915, 940, 965, 990, y: 240 */}
          {[840, 865, 890, 915, 940, 965, 990].map((cx, idx) => (
            <group key={`sum-cab-${idx}`} position={[to3DX(cx + 11), 0, to3DZ(249)]}>
              {/* Stilts */}
              {[-0.4, 0.4].map((sx, i) => (
                <mesh key={`st-${i}`} position={[sx, 0.3, 0]}>
                  <boxGeometry args={[0.08, 0.6, 0.08]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
              ))}
              {/* Cabin Box: 22 x 18 */}
              <mesh position={[0, 1.2, 0]} castShadow>
                <boxGeometry args={[22 * SCALE, 1.4, 18 * SCALE]} />
                <meshStandardMaterial color="#2563eb" metalness={0.5} roughness={0.4} />
              </mesh>
              {/* Window */}
              <mesh position={[0, 1.3, -(18 * SCALE) / 2 - 0.02]}>
                <boxGeometry args={[0.4, 0.35, 0.03]} />
                <meshStandardMaterial color="#bae6fd" emissive="#0284c7" emissiveIntensity={0.6} />
              </mesh>
            </group>
          ))}
        </group>
      </InteractiveAsset3D>

      {/* ========================================================================= */}
      {/* 15. AUTOMATIC WEATHER STATION (AWS-MAITRI) (center: [1160, 240])          */}
      {/* ========================================================================= */}
      <InteractiveAsset3D
        asset={maitriWeather}
        position={[to3DX(1160), 0, to3DZ(240)]}
        badgeOffset={[0, 5.0, 0]}
      >
        <group>
          {/* Lattice Mast */}
          <mesh position={[0, 2.2, 0]}>
            <cylinderGeometry args={[0.05, 0.12, 4.4, 6]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          {/* Crossarm */}
          <mesh position={[0, 4.2, 0]}>
            <boxGeometry args={[1.2, 0.05, 0.05]} />
            <meshStandardMaterial color="#cbd5e1" />
          </mesh>
          {/* Anemometer */}
          <mesh position={[-0.5, 4.5, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
          </mesh>
          {/* Solar Radiation Sensor */}
          <mesh position={[0.5, 4.4, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.08, 12]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
      </InteractiveAsset3D>

      {/* ========================================================================= */}
      {/* 16. LAKE PRIYADARSHINI WATER BODY (NORTH BASIN)                           */}
      {/* ========================================================================= */}
      <group position={[0, -0.05, to3DZ(120)]}>
        {/* Deep blue frozen glacial lake matching 2D basin north of y = 180 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 22]} />
          <meshStandardMaterial
            color="#0284c7"
            roughness={0.15}
            metalness={0.7}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Glacial ice glow */}
        <pointLight color="#38bdf8" intensity={1.2} distance={25} position={[0, 1, 0]} />
      </group>
    </group>
  );
}
