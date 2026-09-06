import React from 'react';
import InteractiveAsset3D from './InteractiveAsset3D';
import WindTurbine3D from './WindTurbine3D';
import SatelliteRadome3D from './SatelliteRadome3D';
import Generator3D from './Generator3D';
import { useStationData } from '../../context/StationDataContext';
import { getStatusColor } from '../../utils/stationHealth';

export default function BharatiStation3D({ assets }) {
  const { telemetryBuildings = [] } = useStationData();
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
    const assetMatch = assets.find((a) => a.id === id || a.id === normHyphen || a.id === normUnderscore);
    return {
      ...(assetMatch || {}),
      ...(telemetryMatch || {}),
      id: telemetryMatch?.id || id,
      name: telemetryMatch?.name || assetMatch?.name || id,
      status: telemetryMatch?.status || assetMatch?.status || 'healthy',
      telemetry: telemetryMatch?.telemetry || assetMatch?.metrics || {},
    };
  };

  const bharatiMain = getAsset('bharati-main');
  const bharatiOcean = getAsset('bharati-lab-ocean');
  const bharatiGlacio = getAsset('bharati-lab-glacio');
  const bharatiCogen1 = getAsset('bharati-cogen-01');
  const bharatiCogen2 = getAsset('bharati-cogen-02');
  const bharatiFuel = getAsset('bharati-fuel');
  const bharatiSatcom = getAsset('bharati-satcom-isro');
  const bharatiWeather = getAsset('bharati-weather');
  const bharatiHelipad = getAsset('bharati-helipad');
  const bharatiClean = getAsset('bharati-clean-energy');
  const bharatiVehicles = getAsset('bharati-vehicles');
  const bharatiEmergency = getAsset('bharati-emergency');

  return (
    <group position={[0, 0, 0]}>
      {/* 1. BHARATI AERODYNAMIC MONOLITH MAIN COMPLEX */}
      <InteractiveAsset3D asset={bharatiMain} position={bharatiMain.position} badgeOffset={[0, 6.4, 0]}>
        {/* Hydraulic Heavy Duty Elevating Stilts */}
        {[-4.2, -1.4, 1.4, 4.2].map((x, i) =>
          [-2.8, 0, 2.8].map((z, j) => (
            <mesh key={`bh-stilt-${i}-${j}`} position={[x, 0.9, z]}>
              <cylinderGeometry args={[0.22, 0.28, 1.8, 12]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
            </mesh>
          ))
        )}

        {/* Aerodynamic Chamfered Monolith Hull (Titanium / Aluminum Clad) */}
        <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[11.2, 2.2, 7.2]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>

        {/* Aerodynamic Sloped Wind-Deflecting Nose / Wedge */}
        <mesh position={[0, 2.8, -4.0]} rotation={[-0.45, 0, 0]} castShadow>
          <boxGeometry args={[11.2, 1.8, 1.6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Wrap-around Continuous Panoramic Observation Window Deck */}
        <mesh position={[0, 3.1, 0]}>
          <boxGeometry args={[11.3, 0.6, 7.3]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0284c7"
            emissiveIntensity={0.5}
            transparent
            opacity={0.85}
            roughness={0.1}
          />
        </mesh>

        {/* High-Tech Cyan / Orange Facade Graphics Strip */}
        <mesh position={[0, 3.8, 3.62]}>
          <boxGeometry args={[10.6, 0.12, 0.02]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.9} />
        </mesh>
        <mesh position={[0, 3.6, 3.62]}>
          <boxGeometry args={[10.6, 0.12, 0.02]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.8} />
        </mesh>

        {/* Rooftop Meteorological / Instrument Deck */}
        <mesh position={[0, 4.05, 0]}>
          <boxGeometry args={[9.2, 0.2, 5.8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>

        {/* Dual Rooftop Science Domes */}
        <mesh position={[-3.2, 4.5, 1.4]}>
          <sphereGeometry args={[0.65, 16, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.1} />
        </mesh>
        <mesh position={[3.2, 4.5, 1.4]}>
          <sphereGeometry args={[0.65, 16, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.1} />
        </mesh>

        {/* Main Station Active Status Beacon */}
        <mesh position={[0, 4.8, -2.5]}>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshStandardMaterial
            color={getStatusColor(bharatiMain.status).hex}
            emissive={getStatusColor(bharatiMain.status).hex}
            emissiveIntensity={2.2}
          />
        </mesh>
      </InteractiveAsset3D>

      {/* 2. OCEANOGRAPHY & MARINE BIOLOGY LAB */}
      <InteractiveAsset3D asset={bharatiOcean} position={bharatiOcean.position} badgeOffset={[0, 4.4, 0]}>
        {[-1.8, 1.8].map((x, i) =>
          [-1.2, 1.2].map((z, j) => (
            <mesh key={`ocean-stilt-${i}-${j}`} position={[x, 0.6, z]}>
              <cylinderGeometry args={[0.1, 0.1, 1.2, 8]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
          ))
        )}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[4.6, 1.5, 3.2]} />
          <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.65, 0]}>
          <boxGeometry args={[3.8, 0.2, 2.4]} />
          <meshStandardMaterial color="#0369a1" />
        </mesh>
      </InteractiveAsset3D>

      {/* 3. GLACIOLOGY ICE-CORE VAULT */}
      <InteractiveAsset3D asset={bharatiGlacio} position={bharatiGlacio.position} badgeOffset={[0, 4.4, 0]}>
        {[-1.8, 1.8].map((x, i) =>
          [-1.2, 1.2].map((z, j) => (
            <mesh key={`glacio-stilt-${i}-${j}`} position={[x, 0.6, z]}>
              <cylinderGeometry args={[0.1, 0.1, 1.2, 8]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
          ))
        )}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[4.6, 1.5, 3.2]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.4} roughness={0.2} />
        </mesh>
        {/* Cryogenic cooling chiller units on roof */}
        {[-1.0, 1.0].map((cx, idx) => (
          <mesh key={idx} position={[cx, 2.8, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.5, 12]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
        ))}
      </InteractiveAsset3D>

      {/* 4. SCANIA COGENERATION CHP UNIT 1 */}
      <InteractiveAsset3D asset={bharatiCogen1} position={bharatiCogen1.position} badgeOffset={[0, 4.2, 0]}>
        <Generator3D asset={bharatiCogen1} isCogen={true} />
      </InteractiveAsset3D>

      {/* 5. SCANIA COGENERATION CHP UNIT 2 */}
      <InteractiveAsset3D asset={bharatiCogen2} position={bharatiCogen2.position} badgeOffset={[0, 4.2, 0]}>
        <Generator3D asset={bharatiCogen2} isCogen={true} />
      </InteractiveAsset3D>

      {/* 6. DOUBLE-WALLED FUEL DEPOT COMPLEX */}
      <InteractiveAsset3D asset={bharatiFuel} position={bharatiFuel.position} badgeOffset={[0, 4.2, 0]}>
        {/* 3 Containerized Double-Walled Fuel Modules */}
        {[-1.4, 0, 1.4].map((x, idx) => (
          <group key={idx} position={[x, 1.0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.2, 1.6, 3.6]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Real-time Level Bar on side */}
            <mesh position={[0, 0, 1.82]}>
              <boxGeometry args={[0.8, 1.2, 0.02]} />
              <meshStandardMaterial
                color={getStatusColor(bharatiFuel.status).hex}
                emissive={getStatusColor(bharatiFuel.status).hex}
                emissiveIntensity={1.2}
              />
            </mesh>
          </group>
        ))}
      </InteractiveAsset3D>

      {/* 7. ISRO DEEP SPACE GROUND STATION & SATELLITE RADOME */}
      <InteractiveAsset3D asset={bharatiSatcom} position={bharatiSatcom.position} badgeOffset={[0, 5.8, 0]}>
        <SatelliteRadome3D asset={bharatiSatcom} radius={2.2} />
      </InteractiveAsset3D>

      {/* 8. SYNOPTIC MET TOWER */}
      <InteractiveAsset3D asset={bharatiWeather} position={bharatiWeather.position} badgeOffset={[0, 5.4, 0]}>
        <mesh position={[0, 2.5, 0]}>
          <cylinderGeometry args={[0.08, 0.16, 5.0, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh position={[0, 4.8, 0]}>
          <boxGeometry args={[1.6, 0.08, 0.08]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        <mesh position={[0.7, 5.1, 0]}>
          <sphereGeometry args={[0.16, 8, 8]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.2} />
        </mesh>
      </InteractiveAsset3D>

      {/* 9. HEAVY HELIPAD & APPROACH LIGHTING */}
      <InteractiveAsset3D asset={bharatiHelipad} position={bharatiHelipad.position} badgeOffset={[0, 3.6, 0]}>
        {/* Elevated Bedrock Helipad Platform */}
        <mesh position={[0, 0.5, 0]} receiveShadow>
          <cylinderGeometry args={[4.6, 4.8, 0.6, 32]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.3} />
        </mesh>
        {/* White Perimeter Ring */}
        <mesh position={[0, 0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.8, 4.0, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Large Bold "H" Landing Marking */}
        <group position={[0, 0.83, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh position={[-0.9, 0, 0]}>
            <planeGeometry args={[0.4, 2.6]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[0.9, 0, 0]}>
            <planeGeometry args={[0.4, 2.6]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[1.5, 0.4]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
        </group>
        {/* PAPI Green/Cyan Perimeter Inset Lights */}
        {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4].map((rad, idx) => (
          <mesh
            key={idx}
            position={[Math.cos(rad) * 4.4, 0.85, Math.sin(rad) * 4.4]}
          >
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2.0} />
          </mesh>
        ))}
      </InteractiveAsset3D>

      {/* 10. CLEAN ENERGY MICRO-WIND UNIT */}
      <InteractiveAsset3D asset={bharatiClean} position={bharatiClean.position} badgeOffset={[0, 8.8, 0]}>
        <WindTurbine3D asset={bharatiClean} height={7.5} bladeRadius={2.8} />
      </InteractiveAsset3D>

      {/* 11. HÄGGLUNDS ALL-TERRAIN ROVER FLEET BAY */}
      <InteractiveAsset3D asset={bharatiVehicles} position={bharatiVehicles.position} badgeOffset={[0, 4.0, 0]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[4.4, 1.8, 3.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} />
        </mesh>
        {/* Parked Hägglunds BV206 Dual-Car Vehicle */}
        <group position={[2.8, 0.5, 1.8]}>
          {/* Front Unit */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.3, 0.6, 1.6]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* Rear Unit */}
          <mesh position={[0, 0.3, 1.9]}>
            <boxGeometry args={[1.3, 0.6, 1.6]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
        </group>
      </InteractiveAsset3D>

      {/* 12. EMERGENCY SAFETY POD */}
      <InteractiveAsset3D asset={bharatiEmergency} position={bharatiEmergency.position} badgeOffset={[0, 3.6, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[2.8, 1.4, 2.0]} />
          <meshStandardMaterial color="#e11d48" roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.75, 0]}>
          <sphereGeometry args={[0.14, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.0} />
        </mesh>
      </InteractiveAsset3D>
    </group>
  );
}
