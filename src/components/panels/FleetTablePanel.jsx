import React, { useState } from 'react';
import { useStationData } from '../../context/StationDataContext';
import { getStatusColor } from '../../utils/stationHealth';
import {
  Search,
  Crosshair,
  Filter,
  Activity,
  Server,
  Zap,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';

export default function FleetTablePanel() {
  const { assets, setSelectedAssetId, setSelectedStation, setActiveTab } = useStationData();
  const [searchQuery, setSearchQuery] = useState('');
  const [stationFilter, setStationFilter] = useState('all'); // 'all' | 'maitri' | 'bharati'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'healthy' | 'warning' | 'critical'

  const filteredAssets = assets.filter((asset) => {
    // Search query
    const matchQuery =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.type.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchQuery) return false;

    // Station filter
    if (stationFilter !== 'all' && asset.stationId !== stationFilter) return false;

    // Status filter
    if (statusFilter !== 'all' && asset.status !== statusFilter) return false;

    return true;
  });

  const handleFocusAsset = (asset) => {
    setSelectedStation(asset.stationId);
    setSelectedAssetId(asset.id);
    setActiveTab('3d');
  };

  return (
    <div className="w-full h-full p-6 space-y-6 select-none overflow-y-auto bg-[#070b12]/95 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
            <span>Station Infrastructure & Equipment Fleet</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              {filteredAssets.length} ASSETS ONLINE
            </span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Complete inventory matrix of buildings, power gensets, laboratories, radomes, and life-support nodes.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assets, IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48 lg:w-64"
            />
          </div>

          {/* Station Filter */}
          <select
            value={stationFilter}
            onChange={(e) => setStationFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Stations</option>
            <option value="maitri">Maitri Station</option>
            <option value="bharati">Bharati Station</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Asset Table */}
      <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Asset Name & ID</th>
                <th className="py-3.5 px-4 font-semibold">Station</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Health</th>
                <th className="py-3.5 px-4 font-semibold">Operating Load</th>
                <th className="py-3.5 px-4 font-semibold">Core Temp</th>
                <th className="py-3.5 px-4 font-semibold">Telemetry Rating</th>
                <th className="py-3.5 px-4 font-semibold text-right">3D Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAssets.map((asset) => {
                const statusColor = getStatusColor(asset.status);
                const isWarning = asset.status === 'warning';
                const isCritical = asset.status === 'critical';

                return (
                  <tr
                    key={asset.id}
                    onClick={() => handleFocusAsset(asset)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    {/* Name & ID */}
                    <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                      <div>{asset.name}</div>
                      <div className="text-[10px] font-mono text-slate-400 font-normal">
                        {asset.id}
                      </div>
                    </td>

                    {/* Station */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          asset.stationId === 'maitri'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-cyan-500/20 text-cyan-300'
                        }`}
                      >
                        {asset.stationId}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{asset.category}</td>

                    {/* Status Pill */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${statusColor.tailwindBg} ${statusColor.tailwindBorder} ${statusColor.tailwindText}`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: statusColor.hex }}
                        />
                        {statusColor.label}
                      </span>
                    </td>

                    {/* Health % */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            asset.health < 60
                              ? 'text-rose-400'
                              : asset.health < 80
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {asset.health}%
                        </span>
                      </div>
                    </td>

                    {/* Operating Load */}
                    <td className="py-3 px-4 text-cyan-300 font-bold">{asset.load}%</td>

                    {/* Core Temp */}
                    <td className="py-3 px-4">
                      <span
                        className={`${
                          asset.temperature > 85 ? 'text-rose-400 font-bold' : 'text-slate-300'
                        }`}
                      >
                        {asset.temperature}°C
                      </span>
                    </td>

                    {/* Telemetry Output / Metric */}
                    <td className="py-3 px-4 text-slate-300">
                      {asset.powerOutput
                        ? `${asset.powerOutput} kW Gen`
                        : asset.powerDraw
                        ? `${asset.powerDraw} kW Draw`
                        : asset.metrics?.fuelLevel
                        ? asset.metrics.fuelLevel
                        : `${asset.health}% Optimal`}
                    </td>

                    {/* 3D Jump Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFocusAsset(asset);
                        }}
                        className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 transition-transform group-hover:scale-110 inline-flex items-center gap-1 text-[10px]"
                        title="Locate and zoom in 3D"
                      >
                        <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Locate</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
