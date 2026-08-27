// Calculates dynamic health scores, sensor online ratio, power balances, and alert metrics
export function calculateStationMetrics(stationId, assets, alerts) {
  const stationAssets = stationId === 'combined'
    ? assets
    : assets.filter(a => a.stationId === stationId);

  if (!stationAssets.length) {
    return {
      healthScore: 100,
      totalSensors: 0,
      onlineSensors: 0,
      sensorRatio: '0/0',
      activeAlertsCount: 0,
      totalPowerOutput: 0,
      totalPowerDraw: 0,
      healthyCount: 0,
      warningCount: 0,
      criticalCount: 0,
      offlineCount: 0,
    };
  }

  // Weightings for health score:
  // Critical assets deduct heavily, warning assets deduct moderately
  let totalHealthSum = 0;
  let healthyCount = 0;
  let warningCount = 0;
  let criticalCount = 0;
  let offlineCount = 0;

  let totalPowerOutput = 0;
  let totalPowerDraw = 0;

  stationAssets.forEach(asset => {
    totalHealthSum += (asset.health || 80);
    if (asset.status === 'healthy') healthyCount++;
    else if (asset.status === 'warning') warningCount++;
    else if (asset.status === 'critical') criticalCount++;
    else if (asset.status === 'offline') offlineCount++;

    if (asset.powerOutput) totalPowerOutput += asset.powerOutput;
    if (asset.powerDraw) totalPowerDraw += asset.powerDraw;
  });

  // Calculate weighted health index
  let baseScore = Math.round(totalHealthSum / stationAssets.length);
  // Penalty for active critical/warning states
  const penalty = (criticalCount * 12) + (warningCount * 4);
  const healthScore = Math.max(10, Math.min(100, baseScore - penalty));

  // Sensors calculation: each asset has ~12-16 telemetry channels
  const totalSensors = stationAssets.length * 14;
  const offlineSensors = offlineCount * 14 + criticalCount * 3 + warningCount * 1;
  const onlineSensors = Math.max(0, totalSensors - offlineSensors);

  const activeAlerts = alerts.filter(al => 
    al.active && (stationId === 'combined' || al.stationId === stationId)
  );

  return {
    healthScore,
    totalSensors,
    onlineSensors,
    sensorRatio: `${onlineSensors}/${totalSensors}`,
    sensorPercentage: Math.round((onlineSensors / totalSensors) * 100),
    activeAlertsCount: activeAlerts.length,
    activeAlerts,
    totalPowerOutput,
    totalPowerDraw,
    healthyCount,
    warningCount,
    criticalCount,
    offlineCount,
  };
}

export function getStatusColor(status) {
  switch (status) {
    case 'healthy':
      return {
        hex: '#10B981',
        tailwindText: 'text-emerald-400',
        tailwindBg: 'bg-emerald-500/20',
        tailwindBorder: 'border-emerald-500/40',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]',
        label: 'HEALTHY',
      };
    case 'warning':
      return {
        hex: '#F59E0B',
        tailwindText: 'text-amber-400',
        tailwindBg: 'bg-amber-500/20',
        tailwindBorder: 'border-amber-500/40',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]',
        label: 'WARNING',
      };
    case 'critical':
      return {
        hex: '#EF4444',
        tailwindText: 'text-rose-400',
        tailwindBg: 'bg-rose-500/20',
        tailwindBorder: 'border-rose-500/40',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.7)]',
        label: 'CRITICAL',
      };
    case 'offline':
    default:
      return {
        hex: '#6B7280',
        tailwindText: 'text-slate-400',
        tailwindBg: 'bg-slate-500/20',
        tailwindBorder: 'border-slate-500/40',
        glow: 'shadow-none',
        label: 'OFFLINE',
      };
  }
}
