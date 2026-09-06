import React from 'react';

export default function Road({ infrastructure, activeLayers }) {
  const {
    roads = [],
    pipelines = [],
    powerLines = [],
    contours = [],
    waterBodies = [],
    snowDrifts = [],
  } = infrastructure || {};

  return (
    <g className="station-infrastructure select-none pointer-events-none">
      {/* 0. Snow Drifts & Glacial Patches */}
      {snowDrifts.map((sd, i) => (
        <path
          key={`snow-${i}`}
          d={sd.d}
          fill={sd.fill || 'rgba(241, 245, 249, 0.45)'}
          stroke="rgba(203, 213, 225, 0.6)"
          strokeWidth={1}
          style={{ filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.15))' }}
        />
      ))}

      {/* 1. Lake Priyadarshini & Meltwater Ponds (Layer toggle: water) */}
      {activeLayers.water &&
        waterBodies.map((wb, i) => (
          <g key={`water-body-${i}`}>
            <path
              d={wb.d}
              fill={wb.fill || 'rgba(2, 132, 199, 0.35)'}
              stroke={wb.stroke || '#0284C7'}
              strokeWidth={2}
              style={{ filter: 'drop-shadow(0 0 12px rgba(2, 132, 199, 0.4))' }}
            />
            {wb.label && wb.labelPos && (
              <text
                x={wb.labelPos[0]}
                y={wb.labelPos[1]}
                fill="#38BDF8"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="1.5px"
                opacity={0.8}
              >
                {wb.label}
              </text>
            )}
          </g>
        ))}

      {/* 2. Terrain Moraine Contours */}
      {contours.map((d, i) => (
        <path
          key={`contour-${i}`}
          d={d}
          fill="none"
          stroke="rgba(71, 85, 105, 0.32)"
          strokeWidth={1}
          strokeDasharray="6 4"
        />
      ))}

      {/* 3. Access Roads & Snowcat Tracks (Layer toggle: roads) */}
      {activeLayers.roads && (
        <g id="roads-layer">
          {roads.map((d, i) => (
            <g key={`road-${i}`}>
              {/* Road bed casing */}
              <path
                d={d}
                fill="none"
                stroke="rgba(30, 41, 59, 0.75)"
                strokeWidth={18}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Inner packed gravel / moraine surface */}
              <path
                d={d}
                fill="none"
                stroke="rgba(100, 116, 139, 0.35)"
                strokeWidth={14}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Track centerline */}
              <path
                d={d}
                fill="none"
                stroke="rgba(148, 163, 184, 0.35)"
                strokeWidth={1.5}
                strokeDasharray="6 8"
              />
            </g>
          ))}
        </g>
      )}

      {/* 4. Heated Water Pipeline (Layer toggle: water) */}
      {activeLayers.water && (
        <g id="water-pipeline-layer">
          {pipelines
            .filter((p) => p.type === 'water' || p.type === 'heat')
            .map((p, i) => (
              <g key={`pipe-${i}`}>
                {/* Glow casing */}
                <path
                  d={p.d}
                  fill="none"
                  stroke={p.stroke || '#06B6D4'}
                  strokeWidth={(p.width || 3) + 3}
                  strokeOpacity={0.25}
                  strokeLinecap="round"
                />
                {/* Main pipe body */}
                <path
                  d={p.d}
                  fill="none"
                  stroke={p.stroke || '#06B6D4'}
                  strokeWidth={p.width || 3}
                  strokeDasharray={p.dashed ? '6 4' : 'none'}
                  strokeLinecap="round"
                />
              </g>
            ))}
        </g>
      )}

      {/* 5. Fuel Pipeline (Layer toggle: fuel) */}
      {activeLayers.fuel && (
        <g id="fuel-pipeline-layer">
          {pipelines
            .filter((p) => p.type === 'fuel')
            .map((p, i) => (
              <g key={`fuel-pipe-${i}`}>
                <path
                  d={p.d}
                  fill="none"
                  stroke={p.stroke || '#F59E0B'}
                  strokeWidth={(p.width || 2.5) + 3}
                  strokeOpacity={0.25}
                  strokeLinecap="round"
                />
                <path
                  d={p.d}
                  fill="none"
                  stroke={p.stroke || '#F59E0B'}
                  strokeWidth={p.width || 2.5}
                  strokeDasharray="5 3"
                  strokeLinecap="round"
                />
              </g>
            ))}
        </g>
      )}

      {/* 6. 415V Power Grid Lines (Layer toggle: power) */}
      {activeLayers.power && (
        <g id="power-grid-layer">
          {powerLines.map((d, i) => (
            <path
              key={`power-${i}`}
              d={d}
              fill="none"
              stroke="#FACC15"
              strokeWidth={1.2}
              strokeDasharray="3 3"
              strokeOpacity={0.7}
            />
          ))}
        </g>
      )}
    </g>
  );
}
