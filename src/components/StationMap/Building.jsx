import React from 'react';
import { STATUS_THEMES } from '../../utils/statusEngine';

export default function Building({
  buildingDef,
  telemetryData,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onLeave,
}) {
  const {
    id,
    shortLabel,
    paths = [],
    tanks = [],
    skidTanks = [],
    center,
    type,
    colorStyle, // 'blue' | 'orange' | 'silver' | 'white'
    hasGlazedLounge,
    glazedLoungeCoords,
    hasTricolor,
    tricolorCoords,
    isYSpoke,
    ySpokeRays = [],
  } = buildingDef;

  const status = telemetryData?.status || 'healthy';
  const theme = STATUS_THEMES[status] || STATUS_THEMES.healthy;

  // Primary metric to display in building tag
  const getPrimaryMetric = () => {
    if (!telemetryData?.telemetry) return '';
    const t = telemetryData.telemetry;
    if (t.Generator_Load !== undefined) return `${t.Generator_Load}% LOAD`;
    if (t.Fuel_Level !== undefined && (type === 'fuel' || type === 'water')) return `${t.Fuel_Level}% LEVEL`;
    if (t.Battery_Level !== undefined && type === 'battery') return `${t.Battery_Level}% BATT`;
    if (t.Temperature !== undefined) return `${t.Temperature.toFixed(1)}°C`;
    if (t.Wind_Speed !== undefined) return `${t.Wind_Speed} km/h`;
    return '';
  };

  const primaryMetric = getPrimaryMetric();

  // Determine base fill based on real photograph color style
  const getFillColor = (isEnclosure, isStagingPad) => {
    if (isEnclosure) return 'rgba(15, 23, 42, 0.4)';
    if (isStagingPad) return 'rgba(30, 41, 59, 0.4)';
    if (isHovered) return 'rgba(51, 65, 85, 0.75)';

    if (colorStyle === 'blue') return 'rgba(37, 99, 235, 0.35)'; // Blue barrel workshop / blue summer huts
    if (colorStyle === 'orange') return 'rgba(234, 88, 12, 0.32)'; // Orange container modules
    if (colorStyle === 'silver') return 'rgba(148, 163, 184, 0.25)'; // Main station silver cladding
    return theme.fill;
  };

  return (
    <g
      id={id}
      className="cursor-pointer transition-all duration-200 group"
      onClick={() => onSelect(id)}
      onMouseEnter={(e) => onHover(buildingDef, telemetryData, e)}
      onMouseLeave={onLeave}
    >
      {/* Selection Glow Aura */}
      {isSelected && center && (
        <circle
          cx={center[0]}
          cy={center[1]}
          r={75}
          fill="none"
          stroke="#06B6D4"
          strokeWidth={2}
          strokeDasharray="4 4"
          className="animate-[spin_10s_linear_infinite]"
          opacity={0.8}
        />
      )}

      {/* Critical Alarm Pulsing Halo */}
      {status === 'critical' && center && (
        <circle
          cx={center[0]}
          cy={center[1]}
          r={65}
          fill="none"
          stroke="#EF4444"
          strokeWidth={2}
          className="animate-ping"
          opacity={0.35}
        />
      )}

      {/* Building SVG Shapes */}
      {paths.map((p, idx) => {
        const fill = getFillColor(p.isEnclosure, p.isStagingPad);
        const stroke = isSelected
          ? '#22D3EE'
          : isHovered
          ? '#38BDF8'
          : status === 'critical'
          ? '#EF4444'
          : status === 'warning'
          ? '#F59E0B'
          : colorStyle === 'blue'
          ? '#60A5FA'
          : colorStyle === 'orange'
          ? '#FB923C'
          : theme.stroke;

        const strokeWidth = isSelected ? 2.8 : isHovered ? 2.2 : 1.6;

        if (p.type === 'polygon') {
          return (
            <g key={idx}>
              <polygon
                points={p.points}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                style={{
                  filter: isSelected
                    ? 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.7))'
                    : isHovered
                    ? `drop-shadow(0 0 8px ${theme.glow})`
                    : status === 'critical'
                    ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))'
                    : 'none',
                }}
              />
              {p.roofDetails &&
                p.roofDetails.map((d, dIdx) => (
                  <path
                    key={dIdx}
                    d={d}
                    fill="none"
                    stroke={isSelected ? '#67E8F9' : 'rgba(148, 163, 184, 0.35)'}
                    strokeWidth={1}
                  />
                ))}
            </g>
          );
        }

        if (p.type === 'rect') {
          return (
            <g key={idx}>
              <rect
                x={p.x}
                y={p.y}
                width={p.width}
                height={p.height}
                rx={p.rx || 3}
                fill={p.customFill || fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                style={{
                  filter: isSelected
                    ? 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.7))'
                    : 'none',
                }}
              />
              {p.ribs &&
                p.ribs.map((rib, rIdx) => (
                  <line
                    key={rIdx}
                    x1={rib.x1}
                    y1={rib.y1}
                    x2={rib.x2}
                    y2={rib.y2}
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth={1}
                  />
                ))}
            </g>
          );
        }

        if (p.type === 'circle') {
          return (
            <circle
              key={idx}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={p.customFill || fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          );
        }

        if (p.type === 'ellipse') {
          return (
            <ellipse
              key={idx}
              cx={p.cx}
              cy={p.cy}
              rx={p.rx}
              ry={p.ry}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          );
        }

        if (p.type === 'path') {
          return (
            <path
              key={idx}
              d={p.d}
              fill={p.customFill || 'none'}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          );
        }

        return null;
      })}

      {/* Y-Spoke Module (Triangular 3-branch spoke hub seen in Image 3 & 6) */}
      {isYSpoke && ySpokeRays.length > 0 && (
        <g id="y-spoke-module">
          {ySpokeRays.map((ray, rIdx) => (
            <polygon
              key={rIdx}
              points={ray}
              fill="rgba(234, 88, 12, 0.65)"
              stroke={isSelected ? '#22D3EE' : '#FB923C'}
              strokeWidth={1.5}
            />
          ))}
          {center && (
            <circle
              cx={center[0]}
              cy={center[1]}
              r={7}
              fill="#EA580C"
              stroke="#FFF"
              strokeWidth={1.2}
            />
          )}
        </g>
      )}

      {/* Glazed Observation Cupola / Lounge (Southeast prow of Main Station) */}
      {hasGlazedLounge && glazedLoungeCoords && (
        <g id="glazed-cupola">
          <polygon
            points={glazedLoungeCoords}
            fill="rgba(45, 212, 191, 0.45)"
            stroke="#2DD4BF"
            strokeWidth={1.5}
          />
          {/* Glass window division mullions */}
          <line x1="770" y1="520" x2="770" y2="540" stroke="rgba(255,255,255,0.6)" strokeWidth={1} />
          <line x1="785" y1="520" x2="785" y2="540" stroke="rgba(255,255,255,0.6)" strokeWidth={1} />
          <line x1="800" y1="520" x2="800" y2="540" stroke="rgba(255,255,255,0.6)" strokeWidth={1} />
        </g>
      )}

      {/* Indian Tricolor Flag Emblem on Main Station facade */}
      {hasTricolor && tricolorCoords && (
        <g id="indian-tricolor" transform={`translate(${tricolorCoords[0]}, ${tricolorCoords[1]})`}>
          <rect x={0} y={0} width={24} height={4} fill="#FF9933" />
          <rect x={0} y={4} width={24} height={4} fill="#FFFFFF" />
          <rect x={0} y={8} width={24} height={4} fill="#138808" />
          <circle cx={12} cy={6} r={1.5} fill="#000080" />
        </g>
      )}

      {/* Skid-Mounted Horizontal Fuel Tanks (seen in Image 1 & 4) */}
      {skidTanks.map((st, sIdx) => (
        <g key={`skid-${sIdx}`}>
          {/* Cradle skid base */}
          <rect
            x={st.x - 2}
            y={st.y - 1}
            width={st.width + 4}
            height={st.height + 2}
            rx={1}
            fill="#334155"
            stroke="#475569"
            strokeWidth={1}
          />
          {/* White horizontal capsule cylinder */}
          <rect
            x={st.x}
            y={st.y}
            width={st.width}
            height={st.height}
            rx={st.height / 2}
            fill="rgba(241, 245, 249, 0.9)"
            stroke={isSelected ? '#22D3EE' : theme.stroke}
            strokeWidth={1.2}
          />
          {/* Tank end caps */}
          <ellipse
            cx={st.x + 3}
            cy={st.y + st.height / 2}
            rx={2}
            ry={st.height / 2 - 1}
            fill="#CBD5E1"
          />
          <ellipse
            cx={st.x + st.width - 3}
            cy={st.y + st.height / 2}
            rx={2}
            ry={st.height / 2 - 1}
            fill="#CBD5E1"
          />
        </g>
      ))}

      {/* Circular Tanks */}
      {tanks.map((tank, tIdx) => (
        <g key={tIdx}>
          <circle
            cx={tank.cx}
            cy={tank.cy}
            r={tank.r}
            fill="rgba(30, 41, 59, 0.85)"
            stroke={isSelected ? '#22D3EE' : theme.stroke}
            strokeWidth={1.5}
          />
          <circle
            cx={tank.cx}
            cy={tank.cy}
            r={tank.r * 0.65}
            fill={theme.fill}
            stroke="rgba(148, 163, 184, 0.25)"
            strokeWidth={1}
          />
          <circle cx={tank.cx} cy={tank.cy} r={2} fill={theme.stroke} />
        </g>
      ))}

      {/* Building Label & Status HUD Plate */}
      {center && (
        <g transform={`translate(${center[0]}, ${center[1]})`} pointerEvents="none">
          <rect
            x={-60}
            y={-12}
            width={120}
            height={24}
            rx={6}
            fill="rgba(10, 15, 26, 0.90)"
            stroke={isSelected ? '#22D3EE' : theme.stroke}
            strokeWidth={isSelected ? 1.5 : 1}
            opacity={0.95}
          />
          <circle
            cx={-48}
            cy={0}
            r={4}
            fill={theme.stroke}
            className={theme.pulseClass}
          />
          <text
            x={-38}
            y={3.5}
            fill="#E2E8F0"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="0.5px"
          >
            {shortLabel.length > 13 ? `${shortLabel.slice(0, 12)}…` : shortLabel}
          </text>
          {primaryMetric && (
            <text
              x={0}
              y={22}
              textAnchor="middle"
              fill={theme.textColor}
              fontSize="8.5"
              fontFamily="monospace"
              fontWeight="600"
              opacity={0.9}
            >
              {primaryMetric}
            </text>
          )}
        </g>
      )}
    </g>
  );
}
