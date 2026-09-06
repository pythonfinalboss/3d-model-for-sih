import { MAITRI_LAYOUT } from './maitriLayout';
import { BHARATI_LAYOUT } from './bharatiLayout';
import { evaluateBuildingStatus } from '../utils/statusEngine';

/**
 * Metric display names, units, and formatting
 */
export const METRIC_METADATA = {
  Temperature: {
    label: 'Temperature',
    unit: '°C',
    format: (v) => `${Number(v).toFixed(1)}°C`,
    description: 'Ambient / internal core temperature',
    historyKey: 'Temperature',
  },
  Wind_Speed: {
    label: 'Wind Speed',
    unit: 'km/h',
    format: (v) => `${Number(v).toFixed(1)} km/h`,
    description: 'Surface katabatic wind velocity',
    historyKey: 'Wind_Speed',
  },
  Solar_Radiation: {
    label: 'Solar Radiation',
    unit: 'W/m²',
    format: (v) => `${Math.round(v)} W/m²`,
    description: 'Incoming solar flux irradiance',
    historyKey: 'Solar_Radiation',
  },
  Occupancy: {
    label: 'Occupancy',
    unit: 'pers',
    format: (v) => `${Math.round(v)} personnel`,
    description: 'Current verified personnel count',
    historyKey: 'Occupancy',
  },
  Battery_Level: {
    label: 'Battery Level',
    unit: '%',
    format: (v) => `${Math.round(v)}%`,
    description: 'Secondary buffer energy charge',
    historyKey: 'Battery_Level',
  },
  Generator_Load: {
    label: 'Generator Load',
    unit: '%',
    format: (v) => `${Number(v).toFixed(1)}%`,
    description: 'Active alternator output percentage',
    historyKey: 'Generator_Load',
  },
  Fuel_Level: {
    label: 'Fuel Level',
    unit: '%',
    format: (v) => `${Number(v).toFixed(1)}%`,
    description: 'Available liquid reserve capacity',
    historyKey: 'Fuel_Level',
  },
  Energy_Consumption: {
    label: 'Energy Consumption',
    unit: 'kW',
    format: (v) => `${Math.round(v)} kW`,
    description: 'Real-time electrical bus draw',
    historyKey: 'Energy_Consumption',
  },
};

/**
 * BUILDING-SPECIFIC TELEMETRY MAPPINGS
 * Only displays variables relevant to each building type per specification.
 */
export const BUILDING_RELEVANT_METRICS = {
  generator: ['Temperature', 'Generator_Load', 'Fuel_Level', 'Energy_Consumption', 'Battery_Level'],
  laboratory: ['Temperature', 'Occupancy', 'Energy_Consumption', 'Solar_Radiation'],
  fuel: ['Temperature', 'Fuel_Level'],
  residential: ['Temperature', 'Occupancy', 'Energy_Consumption'],
  satellite: ['Temperature', 'Wind_Speed', 'Solar_Radiation'],
  weather: ['Temperature', 'Wind_Speed', 'Solar_Radiation'],
  battery: ['Battery_Level', 'Generator_Load', 'Energy_Consumption', 'Fuel_Level'],
  workshop: ['Temperature', 'Occupancy', 'Energy_Consumption'],
  water: ['Temperature', 'Fuel_Level', 'Energy_Consumption'],
  storage: ['Temperature', 'Energy_Consumption'],
  helipad: ['Temperature', 'Wind_Speed', 'Solar_Radiation'],
  building: ['Temperature', 'Occupancy', 'Energy_Consumption', 'Solar_Radiation'],
};

// Generate 24-point realistic historical telemetry array
function generateHistoricalData(baseTelemetry, type) {
  const points = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const timeLabel = `${i === 0 ? 'Now' : `${i}h ago`}`;
    const point = {
      time: timeLabel,
      hour: i,
    };

    Object.keys(baseTelemetry).forEach((key) => {
      const baseVal = baseTelemetry[key];
      // Controlled jitter based on hour
      const wave = Math.sin((i / 24) * Math.PI * 2) * (baseVal * 0.08);
      const randomNoise = (Math.random() - 0.5) * (baseVal * 0.05);
      const val = Number((baseVal + wave + randomNoise).toFixed(1));
      point[key] = Math.max(0, val);
    });

    points.push(point);
  }

  return points;
}

/**
 * Builds the initial normalized state for all 2D buildings across both stations
 */
export function buildInitialBuildingsTelemetry() {
  const allBuildings = [];

  // 1. Maitri Buildings
  MAITRI_LAYOUT.buildings.forEach((b) => {
    const telemetry = { ...b.defaultTelemetry };
    const { status, reasons } = evaluateBuildingStatus(b.type, telemetry);
    allBuildings.push({
      id: b.id,
      stationId: 'maitri',
      stationName: 'Maitri Research Station',
      name: b.name,
      shortLabel: b.shortLabel,
      type: b.type,
      category: b.category,
      blueprintRef: b.blueprintRef,
      description: b.description,
      area: b.area,
      center: b.center,
      telemetry,
      status,
      activeAlarms: reasons,
      history: generateHistoricalData(telemetry, b.type),
      lastUpdated: new Date().toISOString(),
    });
  });

  // 2. Bharati Buildings
  BHARATI_LAYOUT.buildings.forEach((b) => {
    const telemetry = { ...b.defaultTelemetry };
    const { status, reasons } = evaluateBuildingStatus(b.type, telemetry);
    allBuildings.push({
      id: b.id,
      stationId: 'bharati',
      stationName: 'Bharati Research Station',
      name: b.name,
      shortLabel: b.shortLabel,
      type: b.type,
      category: b.category,
      blueprintRef: b.blueprintRef,
      description: b.description,
      area: b.area,
      center: b.center,
      telemetry,
      status,
      activeAlarms: reasons,
      history: generateHistoricalData(telemetry, b.type),
      lastUpdated: new Date().toISOString(),
    });
  });

  return allBuildings;
}
