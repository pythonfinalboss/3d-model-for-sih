import React from 'react';

export default function Equipment({ layout, activeLayers }) {
  const { buildings = [] } = layout || {};

  if (!activeLayers.equipment) return null;

  return (
    <g id="equipment-layer" className="select-none pointer-events-none">
      {buildings.map((b) => {
        // Render Helipad markings
        if (b.type === 'helipad' && b.center) {
          const [cx, cy] = b.center;
          return (
            <g key={`helipad-${b.id}`}>
              {/* Outer boundary dashed circle */}
              <circle
                cx={cx}
                cy={cy}
                r={32}
                fill="rgba(30, 41, 59, 0.5)"
                stroke="#FACC15"
                strokeWidth={2}
                strokeDasharray="8 6"
              />
              {/* Inner landing circle */}
              <circle
                cx={cx}
                cy={cy}
                r={24}
                fill="none"
                stroke="#FACC15"
                strokeWidth={1.5}
              />
              {/* Bold 'H' Marking */}
              <text
                x={cx}
                y={cy + 8}
                textAnchor="middle"
                fill="#FACC15"
                fontSize="24"
                fontWeight="900"
                fontFamily="sans-serif"
                letterSpacing="0"
              >
                H
              </text>
            </g>
          );
        }

        // Render Staged Vehicles (PistenBully, Hägglunds rovers)
        if (b.vehicles && b.vehicles.length > 0) {
          return (
            <g key={`vehicles-${b.id}`}>
              {b.vehicles.map((v, vIdx) => (
                <g key={vIdx} transform={`translate(${v.x}, ${v.y})`}>
                  {/* Vehicle chassis */}
                  <rect
                    x={-14}
                    y={-9}
                    width={28}
                    height={18}
                    rx={3}
                    fill="rgba(15, 23, 42, 0.95)"
                    stroke="#38BDF8"
                    strokeWidth={1.2}
                  />
                  {/* Tracks */}
                  <rect
                    x={-14}
                    y={-12}
                    width={28}
                    height={3}
                    fill="#64748B"
                    rx={1}
                  />
                  <rect
                    x={-14}
                    y={9}
                    width={28}
                    height={3}
                    fill="#64748B"
                    rx={1}
                  />
                  {/* Windshield */}
                  <polygon
                    points="-8,-6 2,-6 0,6 -8,6"
                    fill="#0284C7"
                    opacity={0.8}
                  />
                  {/* Vehicle ID tag */}
                  <text
                    x={0}
                    y={2}
                    textAnchor="middle"
                    fill="#E0F2FE"
                    fontSize="6"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {v.label}
                  </text>
                </g>
              ))}
            </g>
          );
        }

        return null;
      })}
    </g>
  );
}
