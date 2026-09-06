import { useState, useEffect, useCallback, useRef } from 'react';
import { buildInitialBuildingsTelemetry } from '../data/mockTelemetry';
import { evaluateBuildingStatus } from '../utils/statusEngine';
import { sounds } from '../utils/audioUtils';

export function useTelemetry(simulationRunning = true, simulationSpeed = 1) {
  const [buildings, setBuildings] = useState(() => buildInitialBuildingsTelemetry());
  const [alerts, setAlerts] = useState([]);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [syncSecondsAgo, setSyncSecondsAgo] = useState(0);
  const alertIdCounterRef = useRef(100);

  // Sync ticker: counts seconds elapsed since last telemetry packet
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Main Live Telemetry Update Loop (runs every 2.5 - 3 seconds)
  useEffect(() => {
    if (!simulationRunning) return;

    const intervalMs = Math.max(1000, 2500 / simulationSpeed);
    const interval = setInterval(() => {
      setLastSyncTime(new Date());
      setSyncSecondsAgo(0);

      setBuildings((prevBuildings) => {
        const newAlertsList = [];

        const updatedBuildings = prevBuildings.map((building) => {
          const currentTelemetry = { ...building.telemetry };

          // Apply slight realistic drifts based on building type
          Object.keys(currentTelemetry).forEach((key) => {
            let val = currentTelemetry[key];
            if (typeof val === 'number') {
              let drift = 0;
              if (key === 'Temperature') {
                drift = (Math.random() - 0.49) * 0.3;
                val = Number((val + drift).toFixed(1));
              } else if (key === 'Generator_Load') {
                drift = (Math.random() - 0.48) * 1.2;
                val = Math.max(20, Math.min(98, Number((val + drift).toFixed(1))));
              } else if (key === 'Fuel_Level') {
                // Fuel slowly decreases with minor random noise
                drift = (Math.random() - 0.52) * 0.15;
                val = Math.max(5, Math.min(100, Number((val + drift).toFixed(1))));
              } else if (key === 'Battery_Level') {
                drift = (Math.random() - 0.49) * 0.4;
                val = Math.max(10, Math.min(100, Number((val + drift).toFixed(1))));
              } else if (key === 'Wind_Speed') {
                drift = (Math.random() - 0.49) * 1.5;
                val = Math.max(5, Math.min(120, Number((val + drift).toFixed(1))));
              } else if (key === 'Solar_Radiation') {
                drift = (Math.random() - 0.49) * 4;
                val = Math.max(0, Math.min(500, Math.round(val + drift)));
              } else if (key === 'Energy_Consumption') {
                drift = (Math.random() - 0.49) * 2.5;
                val = Math.max(10, Math.round(val + drift));
              }
              currentTelemetry[key] = val;
            }
          });

          // Re-evaluate building status using Status Engine
          const { status, reasons } = evaluateBuildingStatus(building.type, currentTelemetry);

          // If status transitioned to warning or critical, create alert entries
          if (status === 'warning' || status === 'critical') {
            reasons.forEach((reason) => {
              newAlertsList.push({
                id: `alert-${building.id}-${Date.now().toString(36)}`,
                buildingId: building.id,
                buildingName: building.name,
                stationId: building.stationId,
                stationName: building.stationName,
                severity: status,
                message: reason,
                value: currentTelemetry.Generator_Load
                  ? `${currentTelemetry.Generator_Load}% Load`
                  : currentTelemetry.Fuel_Level
                  ? `${currentTelemetry.Fuel_Level}% Fuel`
                  : `${currentTelemetry.Temperature}°C`,
                time: 'Just now',
                active: true,
              });
            });
          }

          // Update 24H history sparkline (append current point, keep last 24 points)
          const newHistoryPoint = {
            time: 'Now',
            ...currentTelemetry,
          };
          const updatedHistory = [...(building.history || []).slice(1), newHistoryPoint];

          return {
            ...building,
            telemetry: currentTelemetry,
            status,
            activeAlarms: reasons,
            history: updatedHistory,
            lastUpdated: new Date().toISOString(),
          };
        });

        // Set accumulated alerts (latest first)
        setAlerts((prevAlerts) => {
          const merged = [...newAlertsList];
          // Keep active alerts that might still apply
          prevAlerts.forEach((pa) => {
            if (pa.active && !merged.some((m) => m.buildingId === pa.buildingId)) {
              merged.push(pa);
            }
          });
          return merged.slice(0, 15);
        });

        return updatedBuildings;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [simulationRunning, simulationSpeed]);

  // Fault scenario injector
  const injectScenario = useCallback((scenarioType) => {
    setBuildings((prev) => {
      return prev.map((b) => {
        const nextTelemetry = { ...b.telemetry };

        if (
          (scenarioType === 'generator-overheat' || scenarioType === 'gen_overheat') &&
          (b.id === 'maitri_generator' || b.id === 'bharati_cogen')
        ) {
          nextTelemetry.Generator_Load = 94.0;
          nextTelemetry.Temperature = 93.5;
          try { sounds.playAlarm(); } catch (e) {}
        } else if (
          (scenarioType === 'fuel-low' || scenarioType === 'fuel_critical') &&
          (b.id === 'maitri_fuel' || b.id === 'bharati_fuel')
        ) {
          nextTelemetry.Fuel_Level = 17.5;
          try { sounds.playAlarm(); } catch (e) {}
        } else if (
          (scenarioType === 'lab-temp') &&
          (b.id === 'maitri_lab' || b.id === 'bharati_lab')
        ) {
          nextTelemetry.Temperature = 31.0;
          try { sounds.playAlarm(); } catch (e) {}
        } else if (scenarioType === 'blizzard') {
          if (nextTelemetry.Wind_Speed !== undefined) nextTelemetry.Wind_Speed = 88.0;
          if (nextTelemetry.Temperature !== undefined) nextTelemetry.Temperature -= 12;
        } else if (scenarioType === 'nominal' || scenarioType === 'normal') {
          // Reset all values to safe nominal
          if (b.type === 'generator') {
            nextTelemetry.Generator_Load = 68.0;
            nextTelemetry.Temperature = 74.0;
            nextTelemetry.Fuel_Level = 75.0;
          } else if (b.type === 'fuel') {
            nextTelemetry.Fuel_Level = 82.0;
          } else if (b.type === 'laboratory') {
            nextTelemetry.Temperature = 21.5;
          }
        }

        const { status, reasons } = evaluateBuildingStatus(b.type, nextTelemetry);
        return {
          ...b,
          telemetry: nextTelemetry,
          status,
          activeAlarms: reasons,
        };
      });
    });
  }, []);

  return {
    buildings,
    alerts,
    lastSyncTime,
    syncSecondsAgo,
    injectScenario,
  };
}
