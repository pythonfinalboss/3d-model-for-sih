import React, { useState } from 'react';
import { useStationData } from '../../context/StationDataContext';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Bell,
  Radio,
  Crosshair,
  Filter,
  Volume2,
} from 'lucide-react';
import { getStatusColor } from '../../utils/stationHealth';

export default function AlertsPanel() {
  const { alerts, setSelectedAssetId, setSelectedStation, setActiveTab, selectedStation } =
    useStationData();
  const [filterSeverity, setFilterSeverity] = useState('all'); // 'all' | 'critical' | 'warning'

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    return true;
  });

  const handleAlertClick = (alert) => {
    if (alert.assetId) {
      if (alert.stationId) {
        setSelectedStation(alert.stationId);
      }
      setSelectedAssetId(alert.assetId);
      setActiveTab('3d');
    }
  };

  return (
    <div className="w-full h-full p-6 space-y-6 select-none overflow-y-auto bg-[#070b12]/95 backdrop-blur-xl">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-display font-bold text-slate-100">
              Live Mission Alerts & Diagnostics Feed
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
              {alerts.filter((a) => a.active).length} ACTIVE
            </span>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time anomaly detection stream across Maitri & Bharati sensor telemetries. Click any alert to auto-focus in 3D.
          </p>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              filterSeverity === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilterSeverity('critical')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              filterSeverity === 'critical'
                ? 'bg-rose-500/20 text-rose-300 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setFilterSeverity('warning')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              filterSeverity === 'warning'
                ? 'bg-amber-500/20 text-amber-300 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Warnings
          </button>
        </div>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-mono text-sm">
            No alerts matching current filter. All station subsystems nominal.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';
            const statusColor = getStatusColor(alert.severity);

            return (
              <div
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                className={`group p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-md relative overflow-hidden ${
                  isCritical
                    ? 'bg-rose-950/40 border-rose-500/40 hover:border-rose-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                    : isWarning
                    ? 'bg-amber-950/30 border-amber-500/30 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Left Colored Accent Bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: statusColor.hex }}
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {/* Severity Icon */}
                    <div
                      className={`p-2 rounded-xl border mt-0.5 ${
                        isCritical
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-bounce'
                          : isWarning
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                          : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                      }`}
                    >
                      {isCritical ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                    </div>

                    {/* Alert Message Details */}
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`font-mono text-xs font-bold uppercase tracking-wider ${
                            isCritical
                              ? 'text-rose-400'
                              : isWarning
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {alert.title}
                        </span>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-semibold">
                          {alert.stationId} Station
                        </span>

                        {alert.active && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 font-bold">
                            LIVE
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-200 mt-1 leading-relaxed">
                        {alert.message}
                      </p>

                      <div className="flex items-center gap-4 mt-2 font-mono text-xs text-slate-400">
                        <span>Timestamp: {alert.timestamp}</span>
                        {alert.assetId && (
                          <span className="text-cyan-400 font-semibold">
                            Target Asset: {alert.assetId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3D Focus Jump Action Button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAlertClick(alert);
                      }}
                      className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)] group-hover:scale-105"
                    >
                      <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Focus 3D View</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
