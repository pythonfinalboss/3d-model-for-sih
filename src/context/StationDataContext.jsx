import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  INITIAL_ASSETS,
  INITIAL_WEATHER_DATA,
  INITIAL_ALERTS,
  STATIONS_METADATA,
  ENERGY_FLOW_DATA
} from '../data/mockStationData';
import { MAITRI_LAYOUT } from '../data/maitriLayout';
import { BHARATI_LAYOUT } from '../data/bharatiLayout';
import { useTelemetry } from '../hooks/useTelemetry';
import { calculateStationMetrics } from '../utils/stationHealth';
import { sounds } from '../utils/audioUtils';

const StationDataContext = createContext(null);

export function StationDataProvider({ children }) {
  // Navigation & View State
  const [selectedStation, setSelectedStation] = useState('maitri'); // 'maitri' | 'bharati' | 'overview'
  const [viewMode, setViewMode] = useState('2d'); // '2d' | '3d'
  const [activeTab, setActiveTab] = useState('2d'); // '2d' | '3d' | 'overview' | 'energy' | 'environment' | 'fleet' | 'alerts' | 'analytics'

  // Selected 2D building and 3D asset IDs
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [hoveredAssetId, setHoveredAssetId] = useState(null);

  // Active Map Layers
  const [activeLayers, setActiveLayers] = useState({
    buildings: true,
    roads: true,
    equipment: true,
    fuel: true,
    power: true,
    water: true,
    sensors: true,
    alerts: true,
  });

  const toggleLayer = useCallback((layerKey) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  }, []);

  // 3D and Environment Controls
  const [simulationRunning, setSimulationRunning] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x, 2x, 5x
  const [cameraPreset, setCameraPreset] = useState('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLabels3D, setShowLabels3D] = useState(true);
  const [weatherPreset, setWeatherPreset] = useState('normal');
  const [interiorCutaway, setInteriorCutaway] = useState(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);

  // Weather & Energy Data
  const [weather, setWeather] = useState(INITIAL_WEATHER_DATA);
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [energyData, setEnergyData] = useState(ENERGY_FLOW_DATA);

  // Real-time Telemetry Hook (2D & Core Telemetry Engine)
  const {
    buildings: telemetryBuildings,
    alerts: liveAlerts,
    lastSyncTime,
    syncSecondsAgo,
    injectScenario,
  } = useTelemetry(simulationRunning, simulationSpeed);

  // Synchronize active tab with viewMode
  const handleToggleViewMode = useCallback((mode) => {
    setViewMode(mode);
    setActiveTab(mode);
  }, []);

  // Handle building selection on 2D map & 3D spatial twin
  const selectBuilding = useCallback((buildingId) => {
    if (!buildingId) {
      setSelectedBuildingId(null);
      setSelectedAssetId(null);
      return;
    }
    setSelectedBuildingId(buildingId);
    setSelectedAssetId(buildingId);
    if (sounds.enabled) sounds.playClick();
  }, []);

  const closeBuildingPanel = useCallback(() => {
    setSelectedBuildingId(null);
    setSelectedAssetId(null);
  }, []);

  // Selected building object lookup from live telemetry data
  const selectedBuilding = useMemo(() => {
    const targetId = selectedBuildingId || selectedAssetId;
    if (!targetId) return null;
    const norm2d = targetId.replace(/-/g, '_');
    const norm3d = targetId.replace(/_/g, '-');
    return (
      telemetryBuildings.find(
        (b) =>
          b.id === targetId ||
          b.id === norm2d ||
          b.id === norm3d ||
          b.id.includes(norm2d) ||
          b.id.includes(norm3d) ||
          norm2d.includes(b.id) ||
          norm3d.includes(b.id)
      ) || null
    );
  }, [selectedBuildingId, selectedAssetId, telemetryBuildings]);

  // Selected 3D asset lookup (normalized matching & telemetryBuildings fallback)
  const selectedAsset = useMemo(() => {
    const targetId = selectedAssetId || selectedBuildingId;
    if (!targetId) return null;
    const normHyphen = targetId.replace(/_/g, '-');
    const normUnderscore = targetId.replace(/-/g, '_');
    const directMatch = assets.find(
      (a) =>
        a.id === targetId ||
        a.id === normHyphen ||
        a.id === normUnderscore ||
        a.id.includes(normHyphen) ||
        a.id.includes(normUnderscore) ||
        normHyphen.includes(a.id) ||
        normUnderscore.includes(a.id)
    );
    if (directMatch) return directMatch;

    // Fallback synthesize from selectedBuilding so 3D camera zoom and panels always have full position & telemetry
    if (selectedBuilding && selectedBuilding.center) {
      const SCALE = 0.055;
      const posX = (selectedBuilding.center[0] - 700) * SCALE;
      const posZ = (selectedBuilding.center[1] - 480) * SCALE;
      return {
        id: selectedBuilding.id,
        stationId: selectedBuilding.stationId,
        name: selectedBuilding.name,
        type: selectedBuilding.type,
        status: selectedBuilding.status,
        position: [posX, 0, posZ],
        health: selectedBuilding.status === 'healthy' ? 98 : selectedBuilding.status === 'warning' ? 70 : 40,
        temperature: selectedBuilding.telemetry?.Temperature || 21.0,
        load: selectedBuilding.telemetry?.Generator_Load || 65,
        powerDraw: selectedBuilding.telemetry?.Energy_Consumption || 100,
        metrics: selectedBuilding.telemetry || {},
        history: selectedBuilding.history || [],
        description: selectedBuilding.description,
      };
    }
    return null;
  }, [selectedAssetId, selectedBuildingId, assets, selectedBuilding]);

  // Handle sound settings toggle
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      sounds.enabled = next;
      if (next) sounds.playClick();
      return next;
    });
  }, []);

  // Compute station dynamic health metrics
  const maitriBuildings = useMemo(() => telemetryBuildings.filter((b) => b.stationId === 'maitri'), [telemetryBuildings]);
  const bharatiBuildings = useMemo(() => telemetryBuildings.filter((b) => b.stationId === 'bharati'), [telemetryBuildings]);

  // Dynamic Station Health Calculator from 2D Building Statuses
  const calculateStationHealthFromBuildings = useCallback((bList) => {
    if (!bList || bList.length === 0) return 90;
    let total = 0;
    let criticals = 0;
    let warnings = 0;

    bList.forEach((b) => {
      if (b.status === 'healthy') total += 100;
      else if (b.status === 'warning') {
        total += 65;
        warnings++;
      } else if (b.status === 'critical') {
        total += 25;
        criticals++;
      } else {
        total += 40;
      }
    });

    const base = Math.round(total / bList.length);
    const penalty = (criticals * 10) + (warnings * 3);
    return Math.max(15, Math.min(100, base - penalty));
  }, []);

  const maitriHealth = useMemo(() => calculateStationHealthFromBuildings(maitriBuildings), [maitriBuildings, calculateStationHealthFromBuildings]);
  const bharatiHealth = useMemo(() => calculateStationHealthFromBuildings(bharatiBuildings), [bharatiBuildings, calculateStationHealthFromBuildings]);

  const maitriMetrics = useMemo(() => ({
    ...calculateStationMetrics('maitri', assets, liveAlerts),
    healthScore: maitriHealth,
  }), [assets, liveAlerts, maitriHealth]);

  const bharatiMetrics = useMemo(() => ({
    ...calculateStationMetrics('bharati', assets, liveAlerts),
    healthScore: bharatiHealth,
  }), [assets, liveAlerts, bharatiHealth]);

  const currentStationMetrics = selectedStation === 'bharati' ? bharatiMetrics : maitriMetrics;

  // Station metadata lookup
  const stationMeta = STATIONS_METADATA[selectedStation] || STATIONS_METADATA.maitri;

  // Active 2D Layout definition
  const currentLayout = selectedStation === 'bharati' ? BHARATI_LAYOUT : MAITRI_LAYOUT;

  // Jump to building from Alert click
  const handleSelectAlert = useCallback((buildingId, stationId) => {
    if (stationId && stationId !== selectedStation) {
      setSelectedStation(stationId);
    }
    selectBuilding(buildingId);
    setViewMode('2d');
    setActiveTab('2d');
  }, [selectedStation, selectBuilding]);

  return (
    <StationDataContext.Provider
      value={{
        selectedStation,
        setSelectedStation,
        viewMode,
        setViewMode: handleToggleViewMode,
        activeTab,
        setActiveTab,
        stationMeta,

        // 2D Map State
        currentLayout,
        telemetryBuildings,
        selectedBuildingId,
        selectedBuilding,
        selectBuilding,
        closeBuildingPanel,
        activeLayers,
        toggleLayer,

        // 3D & Telemetry State
        assets,
        setAssets,
        selectedAssetId,
        setSelectedAssetId,
        selectedAsset,
        hoveredAssetId,
        setHoveredAssetId,

        // Weather & Metrics
        weather,
        setWeather,
        alerts: liveAlerts,
        energyData,
        maitriMetrics,
        bharatiMetrics,
        currentStationMetrics,
        maitriHealth,
        bharatiHealth,

        // Controls
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
        setWeatherPreset,
        interiorCutaway,
        setInteriorCutaway,
        isBlueprintOpen,
        setIsBlueprintOpen,
        injectScenario,
        handleSelectAlert,
      }}
    >
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
