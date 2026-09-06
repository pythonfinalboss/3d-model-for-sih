import React from 'react';
import { STATUS_THEMES } from '../../utils/statusEngine';

export default function SensorMarker({ sensor, telemetryData, onClick }) {
  const { id, type, x, y, assetId } = sensor;
  const status = telemetryData?.status || 'healthy';
  const theme = STATUS_THEMES[status] || STATUS_THEMES.healthy;

  // Sensor icon letters & colors
  const sensorConfigs = {
    Temperature: { symbol: 'T', stroke: '#38BDF8', label: 'Temp Sensor' },
    Wind: { symbol: 'W', stroke: '#818CF8', label: 'Wind Anemometer' },
    Power: { symbol: 'P', stroke: '#FACC15', label: 'Power Transducer' },
    Fuel: { symbol: 'F', stroke: '#FB923C', label: 'Fuel Level Probe' },
  };

  const cfg = sensorConfigs[type] || { symbol: 'S', stroke: '#94A3B8', label: 'Sensor' };

  return (
    <g
      id={`sensor-${id}`}
      transform={`translate(${x}, ${y})`}
      className="cursor-pointer group"
      onClick={() => onClick && onClick(assetId)}
    >
      {/* Pulsing ring on warning/critical */}
      {(status === 'critical' || status === 'warning') && (
        <circle
          cx={0}
          cy={0}
          r={16}
          fill="none"
          stroke={theme.stroke}
          strokeWidth={1.5}
          className={status === 'critical' ? 'animate-ping' : 'animate-pulse'}
          opacity={0.5}
        />
      )}

      {/* Sensor Outer Hex/Circle */}
      <circle
        cx={0}
        cy={0}
        r={10}
        fill="#0B132B"
        stroke={theme.stroke}
        strokeWidth={1.8}
        className="transition-all duration-200 group-hover:scale-125"
      />

      {/* Symbol */}
      <text
        x={0}
        y={3.5}
        textAnchor="middle"
        fill={cfg.stroke}
        fontSize="8"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {cfg.symbol}
      </text>

      {/* Hover Tooltip Tag */}
      <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
        <rect
          x={-40}
          y={-28}
          width={80}
          height={18}
          rx={4}
          fill="rgba(10, 15, 26, 0.95)"
          stroke={theme.stroke}
          strokeWidth={1}
        />
        <text
          x={0}
          y={-16}
          textAnchor="middle"
          fill="#F1F5F9"
          fontSize="7.5"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {cfg.label}
        </text>
      </g>
    </g>
  );
}
