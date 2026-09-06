// Threshold configurations for the Antarctic Digital Twin status engine
export const THRESHOLD_CONFIG = {
  generator: {
    Generator_Load: { warning: 75, critical: 90, unit: '%' },
    Temperature: { warning: 80, critical: 92, unit: '°C' },
    Fuel_Level: { warningLow: 35, criticalLow: 20, unit: '%' },
    Battery_Level: { warningLow: 40, criticalLow: 25, unit: '%' },
  },
  fuel: {
    Fuel_Level: { warningLow: 35, criticalLow: 20, unit: '%' },
    Temperature: { warning: 10, critical: 20, unit: '°C' },
  },
  battery: {
    Battery_Level: { warningLow: 45, criticalLow: 25, unit: '%' },
    Generator_Load: { warning: 80, critical: 92, unit: '%' },
  },
  laboratory: {
    Temperature: { warningLow: 16, warningHigh: 26, criticalLow: 10, criticalHigh: 30, unit: '°C' },
    Energy_Consumption: { warning: 120, critical: 150, unit: 'kW' },
  },
  residential: {
    Temperature: { warningLow: 17, warningHigh: 25, criticalLow: 12, criticalHigh: 28, unit: '°C' },
    Energy_Consumption: { warning: 140, critical: 180, unit: 'kW' },
  },
  satellite: {
    Wind_Speed: { warning: 65, critical: 85, unit: 'km/h' },
    Temperature: { warningLow: -45, criticalLow: -55, unit: '°C' },
  },
  weather: {
    Wind_Speed: { warning: 70, critical: 95, unit: 'km/h' },
    Temperature: { warningLow: -45, criticalLow: -55, unit: '°C' },
  },
  workshop: {
    Temperature: { warningLow: 14, warningHigh: 27, criticalLow: 8, criticalHigh: 32, unit: '°C' },
    Energy_Consumption: { warning: 90, critical: 130, unit: 'kW' },
  },
  water: {
    Temperature: { warningLow: 2, criticalLow: 0.5, unit: '°C' }, // Freezing risk
    Fuel_Level: { warningLow: 30, criticalLow: 15, unit: '%' }, // Reservoir capacity
  },
  storage: {
    Temperature: { warningHigh: 15, criticalHigh: 25, unit: '°C' },
  },
  default: {
    Temperature: { warningLow: 10, warningHigh: 30, criticalLow: 0, criticalHigh: 40, unit: '°C' },
  }
};
