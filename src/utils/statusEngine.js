import { THRESHOLD_CONFIG } from '../data/thresholdConfig';

export const STATUS_THEMES = {
  healthy: {
    key: 'healthy',
    label: 'HEALTHY',
    stroke: '#10B981', // Emerald 500
    fill: 'rgba(16, 185, 129, 0.14)',
    glow: 'rgba(16, 185, 129, 0.45)',
    textColor: '#34D399',
    badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dotBg: 'bg-emerald-400',
    pulseClass: '',
  },
  warning: {
    key: 'warning',
    label: 'WARNING',
    stroke: '#F59E0B', // Amber 500
    fill: 'rgba(245, 158, 11, 0.20)',
    glow: 'rgba(245, 158, 11, 0.55)',
    textColor: '#FBBF24',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    dotBg: 'bg-amber-400',
    pulseClass: 'animate-pulse',
  },
  critical: {
    key: 'critical',
    label: 'CRITICAL',
    stroke: '#EF4444', // Red 500
    fill: 'rgba(239, 68, 68, 0.25)',
    glow: 'rgba(239, 68, 68, 0.70)',
    textColor: '#F87171',
    badgeBg: 'bg-red-500/20 text-red-400 border-red-500/40',
    dotBg: 'bg-red-500',
    pulseClass: 'animate-ping',
  },
  offline: {
    key: 'offline',
    label: 'OFFLINE',
    stroke: '#6B7280', // Slate 500
    fill: 'rgba(107, 114, 128, 0.12)',
    glow: 'rgba(107, 114, 128, 0.25)',
    textColor: '#9CA3AF',
    badgeBg: 'bg-slate-500/20 text-slate-400 border-slate-600/30',
    dotBg: 'bg-slate-500',
    pulseClass: '',
  },
};

/**
 * Evaluate telemetry against thresholds to determine status and generate alarms
 * @param {string} buildingType
 * @param {object} telemetry
 * @returns {{ status: 'healthy' | 'warning' | 'critical' | 'offline', reasons: string[] }}
 */
export function evaluateBuildingStatus(buildingType, telemetry) {
  if (!telemetry) return { status: 'healthy', reasons: [] };

  const config = THRESHOLD_CONFIG[buildingType] || THRESHOLD_CONFIG.default;
  const reasons = [];
  let worstSeverity = 'healthy'; // 'healthy' < 'warning' < 'critical'

  const elevate = (severity, message) => {
    reasons.push(message);
    if (severity === 'critical') {
      worstSeverity = 'critical';
    } else if (severity === 'warning' && worstSeverity !== 'critical') {
      worstSeverity = 'warning';
    }
  };

  // Evaluate Generator_Load
  if (config.Generator_Load && telemetry.Generator_Load !== undefined) {
    const val = telemetry.Generator_Load;
    if (val >= config.Generator_Load.critical) {
      elevate('critical', `Critical generator load (${val}%)`);
    } else if (val >= config.Generator_Load.warning) {
      elevate('warning', `High generator load (${val}%)`);
    }
  }

  // Evaluate Fuel_Level
  if (config.Fuel_Level && telemetry.Fuel_Level !== undefined) {
    const val = telemetry.Fuel_Level;
    if (val <= config.Fuel_Level.criticalLow) {
      elevate('critical', `Critically low fuel level (${val}%)`);
    } else if (val <= config.Fuel_Level.warningLow) {
      elevate('warning', `Low fuel reserve (${val}%)`);
    }
  }

  // Evaluate Battery_Level
  if (config.Battery_Level && telemetry.Battery_Level !== undefined) {
    const val = telemetry.Battery_Level;
    if (val <= config.Battery_Level.criticalLow) {
      elevate('critical', `Critical battery depletion (${val}%)`);
    } else if (val <= config.Battery_Level.warningLow) {
      elevate('warning', `Low battery storage (${val}%)`);
    }
  }

  // Evaluate Temperature
  if (config.Temperature && telemetry.Temperature !== undefined) {
    const val = telemetry.Temperature;
    if (config.Temperature.critical && val >= config.Temperature.critical) {
      elevate('critical', `Critical overheating (${val}°C)`);
    } else if (config.Temperature.warning && val >= config.Temperature.warning) {
      elevate('warning', `Elevated temperature (${val}°C)`);
    }

    if (config.Temperature.criticalLow !== undefined && val <= config.Temperature.criticalLow) {
      elevate('critical', `Freezing hazard temperature (${val}°C)`);
    } else if (config.Temperature.warningLow !== undefined && val <= config.Temperature.warningLow) {
      elevate('warning', `Sub-optimal low temperature (${val}°C)`);
    }
    if (config.Temperature.criticalHigh !== undefined && val >= config.Temperature.criticalHigh) {
      elevate('critical', `Severe thermal spike (${val}°C)`);
    } else if (config.Temperature.warningHigh !== undefined && val >= config.Temperature.warningHigh) {
      elevate('warning', `Temperature abnormal (${val}°C)`);
    }
  }

  // Evaluate Wind_Speed
  if (config.Wind_Speed && telemetry.Wind_Speed !== undefined) {
    const val = telemetry.Wind_Speed;
    if (val >= config.Wind_Speed.critical) {
      elevate('critical', `Katabatic gale force winds (${val} km/h)`);
    } else if (val >= config.Wind_Speed.warning) {
      elevate('warning', `High gust advisory (${val} km/h)`);
    }
  }

  // Evaluate Energy_Consumption
  if (config.Energy_Consumption && telemetry.Energy_Consumption !== undefined) {
    const val = telemetry.Energy_Consumption;
    if (config.Energy_Consumption.critical && val >= config.Energy_Consumption.critical) {
      elevate('critical', `Peak surge draw (${val} kW)`);
    } else if (config.Energy_Consumption.warning && val >= config.Energy_Consumption.warning) {
      elevate('warning', `Elevated power draw (${val} kW)`);
    }
  }

  return {
    status: worstSeverity,
    reasons,
  };
}

export function getStatusTheme(status) {
  return STATUS_THEMES[status] || STATUS_THEMES.healthy;
}
