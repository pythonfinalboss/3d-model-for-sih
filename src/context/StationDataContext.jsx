import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_ASSETS,
  INITIAL_WEATHER_DATA,
  INITIAL_ALERTS,
  STATIONS_METADATA,
  ENERGY_FLOW_DATA
} from '../data/mockStationData';
import { calculateStationMetrics } from '../utils/stationHealth';
import { sounds } from '../utils/audioUtils';

const StationDataContext = createContext(null);

export function StationDataProvider({ children }) {
  const [selectedStation, setSelectedStation] = useState('maitri'); // 'maitri' | 'bharati' | 'combined'
  const [activeTab, setActiveTab] = useState('3d'); // 'overview' | '3d' | 'energy' | 'environment' | 'fleet' | 'alerts' | 'analytics'
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [hoveredAssetId, setHoveredAssetId] = useState(null);
  
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [weather, setWeather] = useState(INITIAL_WEATHER_DATA);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [energyData, setEnergyData] = useState(ENERGY_FLOW_DATA);

  const [simulationRunning, setSimulationRunning] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x, 2x, 5x
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [syncSecondsAgo, setSyncSecondsAgo] = useState(0);
  const [cameraPreset, setCameraPreset] = useState('default'); // 'default', 'topDown', 'orbit', 'walkthrough'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLabels3D, setShowLabels3D] = useState(true);
  const [weatherPreset, setWeatherPreset] = useState('normal'); // 'normal', 'blizzard', 'aurora', 'storm'

  // Handle sound settings toggle
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      sounds.enabled = next;
      if (next) sounds.playClick();
      return next;
    });
  }, []);

  // Selected Asset object lookup
  const selectedAsset = assets.find(a => a.id === selectedAssetId) || null;
  const hoveredAsset = assets.find(a => a.id === hoveredAssetId) || null;

  // Station specific metrics
  const maitriMetrics = calculateStationMetrics('maitri', assets, alerts);
  const bharatiMetrics = calculateStationMetrics('bharati', assets, alerts);
  const currentStationMetrics = calculateStationMetrics(selectedStation, assets, alerts);

  // Sync Timer ticker (counts seconds since last telemetry tick)
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncSecondsAgo(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Main Live Telemetry Simulation Loop
  useEffect(() => {
    if (!simulationRunning) return;

    const intervalMs = Math.max(800, 2000 / simulationSpeed);
    const interval = setInterval(() => {
      setLastSyncTime(new Date());
      setSyncSecondsAgo(0);

      // 1. Slightly fluctuate weather values
      setWeather(prev => {
        const next = { ...prev };
        ['maitri', 'bharati'].forEach(st => {
          const w = next[st];
          const tempNoise = (Math.random() - 0.5) * 0.2;
          const windNoise = (Math.random() - 0.5) * 1.5;
          const pressureNoise = (Math.random() - 0.5) * 0.1;
          const solarNoise = (Math.random() - 0.5) * 3;

          next[st] = {
            ...w,
            outdoorTemp: Number((w.outdoorTemp + tempNoise).toFixed(1)),
            windSpeed: Number(Math.max(5, w.windSpeed + windNoise).toFixed(1)),
            pressure: Number((w.pressure + pressureNoise).toFixed(1)),
            solarRadiation: Number(Math.max(0, w.solarRadiation + solarNoise).toFixed(0)),
          };
        });
        return next;
      });

      // 2. Fluctuate asset load, power, and history
      setAssets(prevAssets => {
        return prevAssets.map(asset => {
          // Add small jitter
          const loadJitter = (Math.random() - 0.49) * 1.2;
          const newLoad = Math.max(0, Math.min(100, Math.round((asset.load + loadJitter) * 10) / 10));
          
          let newTemp = asset.temperature;
          if (asset.type === 'generator') {
            newTemp = Number((asset.temperature + (Math.random() - 0.48) * 0.3).toFixed(1));
          } else if (asset.type === 'building' || asset.type === 'laboratory') {
            newTemp = Number((asset.temperature + (Math.random() - 0.5) * 0.05).toFixed(1));
          }

          let newPower = asset.powerOutput || asset.powerDraw;
          if (newPower) {
            newPower = Math.round(newPower + (Math.random() - 0.5) * 4);
          }

          // Append to history, keeping max 15 points
          const newHistoryPoint = {
            time: 'Now',
            load: newLoad,
            temperature: newTemp,
            power: newPower,
          };
          const updatedHistory = [...asset.history.slice(1), newHistoryPoint];

          // Dynamic rule checks:
          // If generator temp > 94 => critical, if > 88 => warning
          let status = asset.status;
          let health = asset.health;

          if (asset.id === 'maitri-gen-01') {
            if (newTemp >= 95) {
              status = 'critical';
              health = Math.min(health, 48);
            } else if (newTemp >= 88) {
              status = 'warning';
              health = Math.min(health, 68);
            } else {
              status = 'healthy';
              health = 94;
            }
          } else if (asset.id === 'bharati-fuel') {
            if (newLoad < 20) {
              status = 'critical';
              health = 42;
            } else if (newLoad < 30) {
              status = 'warning';
              health = 88;
            } else {
              status = 'healthy';
              health = 96;
            }
          }

          return {
            ...asset,
            load: newLoad,
            temperature: newTemp,
            status,
            health,
            powerOutput: asset.powerOutput ? newPower : undefined,
            powerDraw: asset.powerDraw ? newPower : undefined,
            history: updatedHistory,
            lastUpdated: 'Just now',
          };
        });
      });

    }, intervalMs);

    return () => clearInterval(interval);
  }, [simulationRunning, simulationSpeed]);

  // Asset selection handler with audio & tab redirection if on another page
  const selectAsset = useCallback((assetId) => {
    setSelectedAssetId(assetId);
    if (assetId) {
      sounds.playSelect();
      const targetAsset = assets.find(a => a.id === assetId);
      if (targetAsset && targetAsset.stationId !== selectedStation && selectedStation !== 'combined') {
        setSelectedStation(targetAsset.stationId);
      }
    }
  }, [assets, selectedStation]);

  // Station switcher handler with smooth camera preset trigger
  const changeStation = useCallback((stationId) => {
    setSelectedStation(stationId);
    sounds.playCameraWhoosh();
    setCameraPreset('default');
  }, []);

  // Preset Scenario Injections for testing Digital Twin Reactivity
  const injectScenario = useCallback((scenarioType) => {
    sounds.playClick();
    if (scenarioType === 'normal') {
      setWeatherPreset('normal');
      setAssets(prev => prev.map(a => {
        if (a.id === 'maitri-gen-01') {
          return { ...a, status: 'healthy', temperature: 84.0, load: 72, health: 94 };
        }
        if (a.id === 'bharati-fuel') {
          return { ...a, status: 'healthy', load: 78, health: 96 };
        }
        return { ...a, status: 'healthy', health: Math.max(a.health, 92) };
      }));
      setAlerts([
        {
          id: `alert-norm-${Date.now()}`,
          stationId: 'maitri',
          title: 'NORMAL OPERATIONS RESTORED',
          message: 'All station microgrids, generators, and atmospheric sensors operating at baseline.',
          severity: 'healthy',
          timestamp: 'Just now',
          active: false,
        }
      ]);
    } else if (scenarioType === 'gen_overheat') {
      // Trigger critical overheat on Maitri Generator 01
      sounds.playAlertCritical();
      setAssets(prev => prev.map(a => {
        if (a.id === 'maitri-gen-01') {
          return { ...a, status: 'critical', temperature: 98.4, load: 96, health: 38 };
        }
        return a;
      }));
      setAlerts(prev => [
        {
          id: `alert-gen-${Date.now()}`,
          assetId: 'maitri-gen-01',
          stationId: 'maitri',
          title: 'CRITICAL: GENERATOR 01 THERMAL RUNAWAY',
          message: 'Cylinder head temperature reached 98.4°C! Automatic load shedding initiated.',
          severity: 'critical',
          timestamp: 'Just now',
          active: true,
        },
        ...prev,
      ]);
      setSelectedStation('maitri');
      setSelectedAssetId('maitri-gen-01');
    } else if (scenarioType === 'blizzard') {
      // Trigger polar blizzard event
      sounds.playAlertWarning();
      setWeatherPreset('blizzard');
      setWeather(prev => ({
        maitri: { ...prev.maitri, windSpeed: 104.5, windGust: 138, visibility: 0.8, outdoorTemp: -48.2, snowAccumulationRate: 8.5 },
        bharati: { ...prev.bharati, windSpeed: 96.0, windGust: 122, visibility: 1.4, outdoorTemp: -42.0, snowAccumulationRate: 6.2 },
      }));
      setAlerts(prev => [
        {
          id: `alert-bliz-${Date.now()}`,
          stationId: 'maitri',
          title: 'ANTARCTIC BLIZZARD CODE RED',
          message: 'Category 3 Polar Storm detected. Wind gusts exceeding 130 km/h. Outdoor movement prohibited.',
          severity: 'critical',
          timestamp: 'Just now',
          active: true,
        },
        ...prev,
      ]);
    } else if (scenarioType === 'fuel_critical') {
      // Bharati fuel low warning
      sounds.playAlertWarning();
      setAssets(prev => prev.map(a => {
        if (a.id === 'bharati-fuel') {
          return { ...a, status: 'critical', load: 14, health: 32 };
        }
        return a;
      }));
      setAlerts(prev => [
        {
          id: `alert-fuel-${Date.now()}`,
          assetId: 'bharati-fuel',
          stationId: 'bharati',
          title: 'CRITICAL: BHARATI FUEL RESERVES CRITICAL',
          message: 'Main fuel depot storage dropped to 14% (< 20% critical threshold). Priority fuel ration activated.',
          severity: 'critical',
          timestamp: 'Just now',
          active: true,
        },
        ...prev,
      ]);
      setSelectedStation('bharati');
      setSelectedAssetId('bharati-fuel');
    } else if (scenarioType === 'aurora') {
      setWeatherPreset('aurora');
      sounds.playClick();
      setWeather(prev => ({
        maitri: { ...prev.maitri, auroraActivity: 'Severe Geomagnetic Storm (Kp 7.8)', solarRadiation: 24 },
        bharati: { ...prev.bharati, auroraActivity: 'High Aurora Australis Display (Kp 8.1)', solarRadiation: 32 },
      }));
    }
  }, []);

  const value = {
    selectedStation,
    setSelectedStation: changeStation,
    activeTab,
    setActiveTab,
    selectedAssetId,
    setSelectedAssetId: selectAsset,
    hoveredAssetId,
    setHoveredAssetId,
    selectedAsset,
    hoveredAsset,
    assets,
    setAssets,
    weather,
    alerts,
    setAlerts,
    energyData,
    maitriMetrics,
    bharatiMetrics,
    currentStationMetrics,
    simulationRunning,
    setSimulationRunning,
    simulationSpeed,
    setSimulationSpeed,
    lastSyncTime,
    syncSecondsAgo,
    cameraPreset,
    setCameraPreset,
    soundEnabled,
    toggleSound,
    showLabels3D,
    setShowLabels3D,
    weatherPreset,
    injectScenario,
    stationMeta: STATIONS_METADATA[selectedStation],
  };

  return (
    <StationDataContext.Provider value={value}>
      {children}
    </StationDataContext.Provider>
  );
}

export function useStationData() {
  const context = useContext(StationDataContext);
  if (!context) {
    throw new Error('useStationData must be used within a StationDataProvider');
  }
  return context;
}
