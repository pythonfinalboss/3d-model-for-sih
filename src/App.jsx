import React, { useState } from 'react';
import { StationDataProvider, useStationData } from './context/StationDataContext';
import TopHeader from './components/layout/TopHeader';
import LeftSidebar from './components/layout/LeftSidebar';
import SceneContainer from './components/3d/SceneContainer';
import AssetDetailPanel from './components/panels/AssetDetailPanel';
import AlertsPanel from './components/panels/AlertsPanel';
import EnvironmentPanel from './components/panels/EnvironmentPanel';
import EnergyPanel from './components/panels/EnergyPanel';
import FleetTablePanel from './components/panels/FleetTablePanel';
import OverviewSummary from './components/panels/OverviewSummary';
import AnalyticsPanel from './components/panels/AnalyticsPanel';
import SimulatorModal from './components/panels/SimulatorModal';
import {
  Compass,
  MapPin,
  Layers,
  Camera,
  RotateCcw,
  Sparkles,
  Maximize2,
  Minimize2,
  Crosshair,
  Radio,
  Eye,
} from 'lucide-react';

function MainAppContent() {
  const {
    activeTab,
    selectedStation,
    stationMeta,
    selectedAsset,
    cameraPreset,
    setCameraPreset,
    showLabels3D,
    setShowLabels3D,
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
    <div className="w-screen h-screen bg-[#070b12] text-slate-100 flex flex-col overflow-hidden select-none font-sans hud-grid-bg">
      {/* Top Antarctic Mission Control Header */}
      <TopHeader onOpenSimulator={() => setIsSimulatorOpen(true)} />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Navigation Sidebar */}
        <LeftSidebar onOpenSimulator={() => setIsSimulatorOpen(true)} />

        {/* Center Main Viewport Area */}
        <main className="flex-1 h-full relative overflow-hidden bg-black">
          {activeTab === '3d' && (
            <div className="w-full h-full relative">
              {/* 3D Scene Viewport */}
              <SceneContainer />

              {/* Asset Detail Telemetry HUD Drawer (when asset clicked) */}
              <AssetDetailPanel />

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
                    Location: <span className="text-slate-200">{stationMeta?.location || 'Queen Maud Land & Princess Elizabeth Land'}</span>
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
                  title="Top-Down Satellite CAD View"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Top-Down CAD</span>
                </button>

                <button
                  onClick={() => setCameraPreset('orbit')}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all ${
                    cameraPreset === 'orbit'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title="Auto Drone Flyaround"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Drone Flyby</span>
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
          )}

          {/* Other Panels */}
          {activeTab === 'overview' && <OverviewSummary />}
          {activeTab === 'energy' && <EnergyPanel />}
          {activeTab === 'environment' && <EnvironmentPanel />}
          {activeTab === 'fleet' && <FleetTablePanel />}
          {activeTab === 'alerts' && <AlertsPanel />}
          {activeTab === 'analytics' && <AnalyticsPanel />}
        </main>
      </div>

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
