import React, { useState } from 'react';
import { StationDataProvider, useStationData } from './context/StationDataContext';
import DashboardHeader from './components/Dashboard/DashboardHeader';
import LeftSidebar from './components/layout/LeftSidebar';
import StationMap from './components/StationMap/StationMap';
import AntarcticOverview from './components/StationMap/AntarcticOverview';
import TelemetryPanel from './components/TelemetryPanel/TelemetryPanel';
import AlertPanel from './components/Alerts/AlertPanel';
import SceneContainer from './components/3d/SceneContainer';
import AssetDetailPanel from './components/panels/AssetDetailPanel';
import EnvironmentPanel from './components/panels/EnvironmentPanel';
import EnergyPanel from './components/panels/EnergyPanel';
import FleetTablePanel from './components/panels/FleetTablePanel';
import OverviewSummary from './components/panels/OverviewSummary';
import AnalyticsPanel from './components/panels/AnalyticsPanel';
import SimulatorModal from './components/panels/SimulatorModal';
import BlueprintModal from './components/panels/BlueprintModal';
import ErrorBoundary from './components/common/ErrorBoundary';
import {
  Camera,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Eye,
  FileText,
  MapPin,
} from 'lucide-react';

function MainAppContent() {
  const {
    activeTab,
    setActiveTab,
    selectedStation,
    setSelectedStation,
    viewMode,
    setViewMode,
    stationMeta,
    currentLayout,
    telemetryBuildings,
    selectedBuildingId,
    selectedBuilding,
    selectedAsset,
    selectBuilding,
    closeBuildingPanel,
    activeLayers,
    toggleLayer,
    weather,
    alerts,
    currentStationMetrics,
    maitriMetrics,
    bharatiMetrics,
    maitriHealth,
    bharatiHealth,
    syncSecondsAgo,
    soundEnabled,
    toggleSound,
    cameraPreset,
    setCameraPreset,
    showLabels3D,
    setShowLabels3D,
    interiorCutaway,
    setInteriorCutaway,
    setIsBlueprintOpen,
    handleSelectAlert,
  } = useStationData();

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#060a14] text-slate-100 flex flex-col overflow-hidden select-none font-sans hud-grid-bg">
      {/* Top Antarctic Mission Control Header */}
      <DashboardHeader
        selectedStation={selectedStation}
        onSelectStation={(st) => {
          setSelectedStation(st);
          if (st === 'overview') {
            setActiveTab('overview');
          } else if (activeTab === 'overview') {
            setActiveTab(viewMode || '2d');
          }
        }}
        viewMode={viewMode}
        onToggleViewMode={(mode) => {
          setViewMode(mode);
          setActiveTab(mode);
          if (mode === '3d' && selectedStation === 'overview') {
            setSelectedStation('maitri');
          }
        }}
        weather={weather}
        stationMetrics={currentStationMetrics}
        maitriHealth={maitriHealth}
        bharatiHealth={bharatiHealth}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Navigation Sidebar */}
        <LeftSidebar onOpenSimulator={() => setIsSimulatorOpen(true)} />

        {/* Center Main Viewport Area */}
        <main className="flex-1 h-full relative overflow-hidden bg-black flex">
          {/* ================= 1. 2D SITE PLAN VIEW ================= */}
          {(activeTab === '2d' && viewMode !== '3d') && (
            <div className="w-full h-full relative flex overflow-hidden">
              {selectedStation === 'overview' ? (
                <AntarcticOverview
                  onSelectStation={(st) => {
                    setSelectedStation(st);
                    setViewMode('2d');
                    setActiveTab('2d');
                  }}
                  maitriMetrics={maitriMetrics}
                  bharatiMetrics={bharatiMetrics}
                  weather={weather}
                />
              ) : (
                <>
                  {/* Interactive 2D SVG Canvas */}
                  <div className="flex-1 h-full relative overflow-hidden">
                    <StationMap
                      layout={currentLayout}
                      buildingsTelemetry={telemetryBuildings}
                      selectedBuildingId={selectedBuildingId}
                      onSelectBuilding={selectBuilding}
                      activeLayers={activeLayers}
                      onToggleLayer={toggleLayer}
                    />
                  </div>

                  {/* Right-Side 2D Telemetry Panel Drawer */}
                  {selectedBuilding && (
                    <TelemetryPanel
                      building={selectedBuilding}
                      secondsAgo={syncSecondsAgo}
                      onClose={closeBuildingPanel}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {/* ================= 2. 3D SPATIAL MODEL VIEW ================= */}
          {(activeTab === '3d' || viewMode === '3d') && activeTab !== 'alerts' && activeTab !== 'energy' && activeTab !== 'environment' && activeTab !== 'fleet' && activeTab !== 'analytics' && (
            <ErrorBoundary
              title="3D Spatial Engine"
              onSwitchTo2D={() => {
                setViewMode('2d');
                setActiveTab('2d');
              }}
            >
              <div className="w-full h-full relative overflow-hidden flex">
              {/* 3D Scene Viewport */}
              <div className="flex-1 h-full relative overflow-hidden">
                <SceneContainer />

                {/* Bottom Left Station Coordinate HUD Overlay */}
                <div className="absolute bottom-4 left-4 glass-panel border border-cyan-500/30 rounded-2xl p-3.5 shadow-2xl z-20 pointer-events-none max-w-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                      {stationMeta?.name || 'Antarctic Research Network'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{stationMeta?.coordinates || 'Antarctic Polar Ice Cap'}</span>
                    </div>
                    <div className="text-slate-400">
                      Location: <span className="text-slate-200">{stationMeta?.location || 'Queen Maud Land'}</span>
                    </div>
                    {stationMeta?.elevation && (
                      <div className="text-slate-400">
                        Elevation: <span className="text-slate-200">{stationMeta.elevation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Right 3D View Controls HUD Bar */}
                <div className="absolute bottom-4 right-4 glass-panel border border-slate-800 rounded-2xl p-2 shadow-2xl z-20 flex items-center gap-1.5 pointer-events-auto">
                  <button
                    onClick={() => setIsBlueprintOpen(true)}
                    className="px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/50 hover:border-cyan-300 font-bold hover:shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all"
                    title="Open Blueprint Reference Plan"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Blueprint Plan</span>
                  </button>

                  {selectedStation === 'maitri' && (
                    <button
                      onClick={() => setInteriorCutaway(!interiorCutaway)}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all border ${
                        interiorCutaway
                          ? 'bg-amber-500/30 text-amber-200 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)] font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700'
                      }`}
                      title="Remove roof and inspect interior rooms"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{interiorCutaway ? 'Cutaway Active' : 'Inspect Inside'}</span>
                    </button>
                  )}

                  <div className="w-px h-4 bg-slate-800 mx-1" />

                  <button
                    onClick={() => setCameraPreset('default')}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
                      cameraPreset === 'default'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    title="Default Perspective Orbit View"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Orbit</span>
                  </button>

                  <button
                    onClick={() => setCameraPreset('topDown')}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
                      cameraPreset === 'topDown'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    title="Top-Down CAD View"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Top-Down CAD</span>
                  </button>

                  <div className="w-px h-4 bg-slate-800 mx-1" />

                  <button
                    onClick={() => setShowLabels3D(!showLabels3D)}
                    className={`p-2 rounded-xl text-xs transition-all ${
                      showLabels3D
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    title="Toggle Floating 3D Tags"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-xs"
                    title="Toggle Fullscreen"
                  >
                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Right-Side Telemetry Panel Drawer (Identical to 2D view: pops out with live readings) */}
              {selectedBuilding ? (
                <TelemetryPanel
                  building={selectedBuilding}
                  secondsAgo={syncSecondsAgo}
                  onClose={closeBuildingPanel}
                />
              ) : selectedAsset ? (
                <AssetDetailPanel />
              ) : null}
            </div>
          </ErrorBoundary>
          )}

          {/* ================= 3. ACTIVE ALERTS PANEL ================= */}
          {activeTab === 'alerts' && (
            <AlertPanel
              alerts={alerts}
              onSelectAlert={handleSelectAlert}
            />
          )}

          {/* ================= 4. OTHER MONITORING TABS ================= */}
          {activeTab === 'overview' && viewMode !== '3d' && (
            <AntarcticOverview
              onSelectStation={(st) => {
                setSelectedStation(st);
                setViewMode('2d');
                setActiveTab('2d');
              }}
              maitriMetrics={maitriMetrics}
              bharatiMetrics={bharatiMetrics}
              weather={weather}
            />
          )}
          {activeTab === 'energy' && <EnergyPanel />}
          {activeTab === 'environment' && <EnvironmentPanel />}
          {activeTab === 'fleet' && <FleetTablePanel />}
          {activeTab === 'analytics' && <AnalyticsPanel />}
        </main>
      </div>

      {/* Interactive Blueprint Reference Plan Modal */}
      <BlueprintModal />

      {/* Real-Time Scenario Injector & Fault Testing Modal */}
      <SimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <StationDataProvider>
      <MainAppContent />
    </StationDataProvider>
  );
}
