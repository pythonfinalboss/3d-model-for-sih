import React from 'react';
import InteractiveAsset3D from './InteractiveAsset3D';
import WindTurbine3D from './WindTurbine3D';
import SatelliteRadome3D from './SatelliteRadome3D';
import Generator3D from './Generator3D';
import { getStatusColor } from '../../utils/stationHealth';

export default function MaitriStation3D({ assets }) {
  // Helper to find asset data
  const getAsset = (id) => assets.find((a) => a.id === id) || { id, status: 'healthy', name: id };

  const maitriMain = getAsset('maitri-main');
  const maitriLab = getAsset('maitri-lab');
  const maitriGen1 = getAsset('maitri-gen-01');
  const maitriGen2 = getAsset('maitri-gen-02');
  const maitriFuel1 = getAsset('maitri-fuel-01');
  const maitriFuel2 = getAsset('maitri-fuel-02');
  const maitriSatcom = getAsset('maitri-satcom');
  const maitriWeather = getAsset('maitri-weather');
  const maitriRenewable = getAsset('maitri-solar-wind');
  const maitriWaterPump = getAsset('maitri-water-pump');
  const maitriVehicles = getAsset('maitri-vehicles');
  const maitriEmergency = getAsset('maitri-emergency');

  return (
    <group position={[0, 0, 0]}>
      {/* 1. MAITRI MAIN HABITAT & RESEARCH BLOCK */}
      <InteractiveAsset3D asset={maitriMain} position={maitriMain.position} badgeOffset={[0, 5.2, 0]}>
        {/* Supporting Steel Stilt Legs */}
        {[-3.6, 0, 3.6].map((x, i) =>
          [-2.2, 0, 2.2].map((z, j) => (
            <mesh key={`stilt-${i}-${j}`} position={[x, 0.6, z]}>
              <boxGeometry args={[0.25, 1.2, 0.25]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
          ))
        )}

        {/* Lower Tier Modular Block (Insulated Antarctic Yellow-Orange) */}
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[8.4, 1.4, 5.4]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Upper Tier Living & Command Quarters */}
        <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.2, 1.4, 4.4]} />
          <meshStandardMaterial color="#ea580c" roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Indian Tricolor Stripe Accent Band */}
        <mesh position={[0, 3.9, 2.22]}>
          <boxGeometry args={[6.8, 0.15, 0.04]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
        <mesh position={[0, 3.75, 2.22]}>
          <boxGeometry args={[6.8, 0.15, 0.04]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 3.6, 2.22]}>
          <boxGeometry args={[6.8, 0.15, 0.04]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>

        {/* Windows Row */}
        {[-2.5, -1.2, 0, 1.2, 2.5].map((wx, idx) => (
          <mesh key={idx} position={[wx, 3.2, 2.22]}>
            <boxGeometry args={[0.7, 0.5, 0.05]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
          </mesh>
        ))}

        {/* Observation Cupola / Skylight Dome */}
        <mesh position={[0, 4.1, 0]}>
          <sphereGeometry args={[0.9, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#bae6fd" transparent opacity={0.7} roughness={0.1} />
        </mesh>

        {/* Dynamic Status LED Beacon on Roof */}
        <mesh position={[3.2, 4.1, -1.8]}>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[3.2, 4.6, -1.8]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial
            color={getStatusColor(maitriMain.status).hex}
            emissive={getStatusColor(maitriMain.status).hex}
            emissiveIntensity={1.8}
          />
        </mesh>
      </InteractiveAsset3D>

      {/* 2. ATMOSPHERIC & GEOMAGNETIC LABORATORY */}
      <InteractiveAsset3D asset={maitriLab} position={maitriLab.position} badgeOffset={[0, 4.2, 0]}>
        {/* Stilts */}
        {[-2.2, 2.2].map((x, i) =>
          [-1.4, 1.4].map((z, j) => (
            <mesh key={`lab-stilt-${i}-${j}`} position={[x, 0.5, z]}>
              <cylinderGeometry args={[0.12, 0.12, 1.0, 8]} />
              <meshStandardMaterial color="#334155" metalness={0.7} />
            </mesh>
          ))
        )}
        {/* Lab Container Building */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <boxGeometry args={[5.2, 1.4, 3.4]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Rooftop Scientific Sensor Masts & Mini Radome */}
        <mesh position={[-1.6, 2.6, 0.8]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        <mesh position={[1.4, 2.9, -0.6]}>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 8]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      </InteractiveAsset3D>

      {/* 3. PRIMARY DIESEL GENERATOR 01 */}
      <InteractiveAsset3D asset={maitriGen1} position={maitriGen1.position} badgeOffset={[0, 4.0, 0]}>
        <Generator3D asset={maitriGen1} />
      </InteractiveAsset3D>

      {/* 4. STANDBY DIESEL GENERATOR 02 */}
      <InteractiveAsset3D asset={maitriGen2} position={maitriGen2.position} badgeOffset={[0, 4.0, 0]}>
        <Generator3D asset={maitriGen2} />
      </InteractiveAsset3D>

      {/* 5. MAIN FUEL TANK FARM 01 */}
      <InteractiveAsset3D asset={maitriFuel1} position={maitriFuel1.position} badgeOffset={[0, 3.8, 0]}>
        {/* Concrete Bunding Basin */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[4.4, 0.4, 3.2]} />
          <meshStandardMaterial color="#475569" roughness={0.9} />
        </mesh>
        {/* 2 Horizontal Cylindrical Insulated Tanks */}
        {[-0.8, 0.8].map((z, idx) => (
          <group key={idx} position={[0, 1.2, z]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.7, 0.7, 3.6, 24]} />
              <meshStandardMaterial
                color="#64748b"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
            {/* Level Gauge Strip */}
            <mesh position={[0, 0.72, 0]}>
              <boxGeometry args={[3.2, 0.05, 0.1]} />
              <meshStandardMaterial
                color={getStatusColor(maitriFuel1.status).hex}
                emissive={getStatusColor(maitriFuel1.status).hex}
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>
        ))}
      </InteractiveAsset3D>

      {/* 6. SECONDARY FUEL TANK FARM 02 */}
      <InteractiveAsset3D asset={maitriFuel2} position={maitriFuel2.position} badgeOffset={[0, 3.8, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[3.6, 0.4, 2.6]} />
          <meshStandardMaterial color="#475569" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.75, 0.75, 3.0, 24]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>
      </InteractiveAsset3D>

      {/* 7. SATELLITE RADOME */}
      <InteractiveAsset3D asset={maitriSatcom} position={maitriSatcom.position} badgeOffset={[0, 4.8, 0]}>
        <SatelliteRadome3D asset={maitriSatcom} radius={1.7} />
      </InteractiveAsset3D>

      {/* 8. AUTOMATIC WEATHER STATION (AWS) */}
      <InteractiveAsset3D asset={maitriWeather} position={maitriWeather.position} badgeOffset={[0, 5.0, 0]}>
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[0.06, 0.12, 4.4, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Cross Arm */}
        <mesh position={[0, 4.2, 0]}>
          <boxGeometry args={[1.4, 0.06, 0.06]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        {/* Anemometer Cups */}
        <mesh position={[-0.6, 4.5, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
        </mesh>
        {/* Solar Radiation Sensor */}
        <mesh position={[0.6, 4.4, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 12]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      </InteractiveAsset3D>

      {/* 9. RENEWABLE WIND & SOLAR ARRAY */}
      <InteractiveAsset3D asset={maitriRenewable} position={maitriRenewable.position} badgeOffset={[0, 8.5, 0]}>
        <group position={[-2.5, 0, 0]}>
          <WindTurbine3D asset={maitriRenewable} height={7.2} bladeRadius={2.6} />
        </group>
        <group position={[2.5, 0, 0]}>
          <WindTurbine3D asset={maitriRenewable} height={7.2} bladeRadius={2.6} />
        </group>
        {/* Tilted Bifacial Solar Panels */}
        {[-1.2, 0, 1.2].map((sx, idx) => (
          <mesh key={idx} position={[sx, 0.8, -2.5]} rotation={[-0.6, 0, 0]}>
            <boxGeometry args={[0.9, 0.05, 1.5]} />
            <meshStandardMaterial color="#1e3a8a" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </InteractiveAsset3D>

      {/* 10. LAKE PRIYADARSHINI PUMP HOUSE & WATER PIPELINE */}
      <InteractiveAsset3D asset={maitriWaterPump} position={maitriWaterPump.position} badgeOffset={[0, 3.8, 0]}>
        {/* Pump House Shed */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[2.2, 1.5, 2.2]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        {/* Water Intake Conduit into Lake */}
        <mesh position={[1.8, 0.3, 1.5]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 3.8, 12]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f97316" metalness={0.7} roughness={0.3} />
        </mesh>
      </InteractiveAsset3D>

      {/* Elevated Heated Water Pipeline connecting Lake Pump House to Main Complex */}
      <group>
        <mesh position={[7, 0.5, 6]} rotation={[0, 0.72, 0]}>
          <boxGeometry args={[0.2, 0.2, 16]} />
          <meshStandardMaterial color="#f97316" metalness={0.8} />
        </mesh>
        {/* Pipeline stilt supports */}
        {[0, 4, 8, 12].map((step, idx) => (
          <mesh key={idx} position={[2 + step * 0.9, 0.25, 1.5 + step * 0.8]}>
            <cylinderGeometry args={[0.05, 0.05, 0.5, 6]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        ))}
      </group>

      {/* 11. VEHICLE / PISTENBULLY SNOWCAT DEPOT */}
      <InteractiveAsset3D asset={maitriVehicles} position={maitriVehicles.position} badgeOffset={[0, 4.0, 0]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[4.8, 1.8, 3.6]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Roll-up Garage Doors */}
        {[-1.2, 1.2].map((gx, idx) => (
          <mesh key={idx} position={[gx, 0.9, 1.82]}>
            <boxGeometry args={[1.8, 1.4, 0.05]} />
            <meshStandardMaterial color="#64748b" roughness={0.8} />
          </mesh>
        ))}
        {/* Stylized PistenBully Polar Snowcat parked outside */}
        <group position={[2.5, 0.5, 3.2]}>
          {/* Chassis */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.6, 0.6, 2.2]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          {/* Tracks */}
          {[-0.9, 0.9].map((tx, idx) => (
            <mesh key={idx} position={[tx, 0.15, 0]}>
              <boxGeometry args={[0.3, 0.3, 2.4]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          ))}
          {/* Front Snow Blade */}
          <mesh position={[0, 0.2, 1.4]}>
            <boxGeometry args={[2.0, 0.4, 0.1]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
        </group>
      </InteractiveAsset3D>

      {/* 12. EMERGENCY WINTERING RETREAT SHELTER */}
      <InteractiveAsset3D asset={maitriEmergency} position={maitriEmergency.position} badgeOffset={[0, 3.6, 0]}>
        {/* Isolated Safety Container on Stilts */}
        {[-1.2, 1.2].map((x, i) =>
          [-0.8, 0.8].map((z, j) => (
            <mesh key={`em-stilt-${i}-${j}`} position={[x, 0.4, z]}>
              <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
          ))
        )}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[3.2, 1.4, 2.2]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.95, 0]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.0} />
        </mesh>
      </InteractiveAsset3D>
    </group>
  );
}
