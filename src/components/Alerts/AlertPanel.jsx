import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, ChevronRight, Bell, Zap, Flame, Thermometer } from 'lucide-react';
import { STATUS_THEMES } from '../../utils/statusEngine';

export default function AlertPanel({
  alerts = [],
  onSelectAlert,
  onClearAlert,
}) {
  const activeAlerts = alerts.filter((a) => a.active);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'generator':
      case 'battery':
      case 'power':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'fuel':
        return <Flame className="w-4 h-4 text-amber-400" />;
      default:
        return <Thermometer className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="w-full h-full p-4 flex flex-col font-mono text-slate-100 select-none overflow-hidden bg-[#070b14]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wider uppercase font-sans">
              Active Station Alerts & Alarms
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Live automated threshold diagnostics ({activeAlerts.length} Active)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
            {activeAlerts.length} CRITICAL / WARNING
          </span>
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
        {activeAlerts.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
            <h4 className="text-sm font-bold text-white uppercase font-sans">
              All Station Systems Nominal
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              No active warnings or critical alarms detected across Maitri or Bharati infrastructure.
            </p>
          </div>
        ) : (
          activeAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            return (
              <div
                key={alert.id}
                onClick={() => onSelectAlert(alert.buildingId, alert.stationId)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-lg flex items-start justify-between gap-3 group ${
                  isCritical
                    ? 'bg-red-950/20 border-red-500/40 hover:border-red-400 hover:bg-red-950/40'
                    : 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400 hover:bg-amber-950/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl border mt-0.5 ${
                      isCritical
                        ? 'bg-red-500/20 border-red-500/40 text-red-400'
                        : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase font-sans">
                        {alert.buildingName || alert.buildingId}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono">
                        [{alert.stationId?.toUpperCase()}]
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          isCritical
                            ? 'bg-red-500/25 text-red-300'
                            : 'bg-amber-500/25 text-amber-300'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>

                    <div className="text-xs text-slate-200 font-mono mt-1">
                      {alert.message}
                    </div>

                    {alert.value !== undefined && (
                      <div className="mt-1 text-sm font-bold text-cyan-300">
                        Trigger: {alert.value}
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-2">
                      <span>{alert.time || 'Live event'}</span>
                      <span>•</span>
                      <span className="text-cyan-400 group-hover:underline">
                        Click to locate on 2D map & view telemetry →
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAlert(alert.buildingId, alert.stationId);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 hover:text-black text-cyan-300 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
