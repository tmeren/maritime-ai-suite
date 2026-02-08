import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, BarChart3, Shield, Download, AlertTriangle, CheckCircle, Activity, Sparkles, Clock, Server, Layers, ChevronRight, Radio } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type TabId = 'fleet-status' | 'update-campaigns' | 'analytics';
type UpdateStatus = 'Up-to-date' | 'Update Available' | 'In Progress' | 'Failed';
type EquipmentType = 'STS Crane' | 'RTG Crane' | 'AGV' | 'Straddle Carrier' | 'Reach Stacker';
type CampaignStatus = 'Planning' | 'Rolling Out' | 'Completed' | 'Paused';
type RolloutStrategy = 'Canary' | 'Staged' | 'Immediate';

interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  model: string;
  currentFw: string;
  latestFw: string;
  status: UpdateStatus;
  lastUpdate: string;
  uptimeHours: number;
  zone: string;
}

interface Campaign {
  id: string;
  name: string;
  targetGroup: EquipmentType;
  fwFrom: string;
  fwTo: string;
  strategy: RolloutStrategy;
  status: CampaignStatus;
  progress: number;
  scheduledDate: string;
  deviceCount: number;
  stages: { name: string; pct: number; status: 'Complete' | 'Active' | 'Pending'; devices: number }[];
}

// ─────────────────────────────────────────────────────────────
// Demo Data — Khalifa Port, Abu Dhabi
// ─────────────────────────────────────────────────────────────

const equipment: Equipment[] = [
  { id: 'KP-STS-01', name: 'STS Crane Alpha', type: 'STS Crane', model: 'ZPMC STS-65', currentFw: 'v4.2.1', latestFw: 'v4.2.1', status: 'Up-to-date', lastUpdate: '2026-02-01', uptimeHours: 8420, zone: 'Berth A' },
  { id: 'KP-STS-02', name: 'STS Crane Bravo', type: 'STS Crane', model: 'ZPMC STS-65', currentFw: 'v4.1.8', latestFw: 'v4.2.1', status: 'Update Available', lastUpdate: '2026-01-10', uptimeHours: 7850, zone: 'Berth A' },
  { id: 'KP-STS-03', name: 'STS Crane Charlie', type: 'STS Crane', model: 'Liebherr STS-800', currentFw: 'v3.9.4', latestFw: 'v4.2.1', status: 'Update Available', lastUpdate: '2025-11-22', uptimeHours: 12300, zone: 'Berth B' },
  { id: 'KP-RTG-01', name: 'RTG Crane R1', type: 'RTG Crane', model: 'Kalmar RTG-16', currentFw: 'v5.0.3', latestFw: 'v5.0.3', status: 'Up-to-date', lastUpdate: '2026-01-28', uptimeHours: 6100, zone: 'Yard Block C' },
  { id: 'KP-RTG-02', name: 'RTG Crane R2', type: 'RTG Crane', model: 'Kalmar RTG-16', currentFw: 'v5.0.3', latestFw: 'v5.0.3', status: 'Up-to-date', lastUpdate: '2026-01-28', uptimeHours: 5980, zone: 'Yard Block C' },
  { id: 'KP-RTG-03', name: 'RTG Crane R3', type: 'RTG Crane', model: 'Kalmar RTG-16', currentFw: 'v4.8.7', latestFw: 'v5.0.3', status: 'In Progress', lastUpdate: '2026-02-08', uptimeHours: 9240, zone: 'Yard Block D' },
  { id: 'KP-AGV-01', name: 'AGV Unit A1', type: 'AGV', model: 'Konecranes AGV-40T', currentFw: 'v7.1.0', latestFw: 'v7.1.0', status: 'Up-to-date', lastUpdate: '2026-02-05', uptimeHours: 4200, zone: 'Quay Transfer' },
  { id: 'KP-AGV-02', name: 'AGV Unit A2', type: 'AGV', model: 'Konecranes AGV-40T', currentFw: 'v7.0.9', latestFw: 'v7.1.0', status: 'Failed', lastUpdate: '2026-02-06', uptimeHours: 4050, zone: 'Quay Transfer' },
  { id: 'KP-SC-01', name: 'Straddle Carrier S1', type: 'Straddle Carrier', model: 'Combilift SC-450', currentFw: 'v2.4.0', latestFw: 'v2.4.0', status: 'Up-to-date', lastUpdate: '2026-01-20', uptimeHours: 3800, zone: 'Container Stack E' },
  { id: 'KP-RS-01', name: 'Reach Stacker RS1', type: 'Reach Stacker', model: 'Hyster RS45-31CH', currentFw: 'v1.6.2', latestFw: 'v1.7.0', status: 'Update Available', lastUpdate: '2025-12-15', uptimeHours: 2100, zone: 'Gate Area' },
];

const campaigns: Campaign[] = [
  {
    id: 'cmp-1', name: 'STS Safety Patch v4.2.1', targetGroup: 'STS Crane', fwFrom: 'v4.1.x', fwTo: 'v4.2.1',
    strategy: 'Staged', status: 'Rolling Out', progress: 33, scheduledDate: '2026-02-01', deviceCount: 3,
    stages: [
      { name: 'Canary (1 unit)', pct: 10, status: 'Complete', devices: 1 },
      { name: 'Staged (2 units)', pct: 50, status: 'Active', devices: 2 },
      { name: 'Full Fleet (3 units)', pct: 100, status: 'Pending', devices: 3 },
    ],
  },
  {
    id: 'cmp-2', name: 'AGV Navigation Module v7.1', targetGroup: 'AGV', fwFrom: 'v7.0.x', fwTo: 'v7.1.0',
    strategy: 'Canary', status: 'Paused', progress: 50, scheduledDate: '2026-02-05', deviceCount: 2,
    stages: [
      { name: 'Canary (1 unit)', pct: 50, status: 'Complete', devices: 1 },
      { name: 'Full Fleet (2 units)', pct: 100, status: 'Pending', devices: 2 },
    ],
  },
  {
    id: 'cmp-3', name: 'RTG Anti-Sway Update v5.0.3', targetGroup: 'RTG Crane', fwFrom: 'v4.8.x', fwTo: 'v5.0.3',
    strategy: 'Staged', status: 'Rolling Out', progress: 67, scheduledDate: '2026-01-25', deviceCount: 3,
    stages: [
      { name: 'Canary (1 unit)', pct: 10, status: 'Complete', devices: 1 },
      { name: 'Staged (1 unit)', pct: 50, status: 'Complete', devices: 1 },
      { name: 'Full Fleet (3 units)', pct: 100, status: 'Active', devices: 3 },
    ],
  },
  {
    id: 'cmp-4', name: 'Reach Stacker Telemetry v1.7', targetGroup: 'Reach Stacker', fwFrom: 'v1.6.x', fwTo: 'v1.7.0',
    strategy: 'Immediate', status: 'Planning', progress: 0, scheduledDate: '2026-02-15', deviceCount: 1,
    stages: [
      { name: 'Immediate (1 unit)', pct: 100, status: 'Pending', devices: 1 },
    ],
  },
  {
    id: 'cmp-5', name: 'Fleet-Wide TLS 1.3 Cert Rotation', targetGroup: 'STS Crane', fwFrom: 'All', fwTo: 'Cert v3',
    strategy: 'Staged', status: 'Completed', progress: 100, scheduledDate: '2026-01-10', deviceCount: 10,
    stages: [
      { name: 'Canary (2 units)', pct: 20, status: 'Complete', devices: 2 },
      { name: 'Staged (5 units)', pct: 50, status: 'Complete', devices: 5 },
      { name: 'Full Fleet (10 units)', pct: 100, status: 'Complete', devices: 10 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// Analytics Data
// ─────────────────────────────────────────────────────────────

const fwDistribution = [
  { version: 'Latest', count: 5, color: '#0ea5e9' },
  { version: 'Latest -1', count: 3, color: '#38bdf8' },
  { version: 'Latest -2', count: 1, color: '#7dd3fc' },
  { version: 'Failed', count: 1, color: '#ef4444' },
];

const successRateTrend = [
  { month: 'Mar', rate: 82 }, { month: 'Apr', rate: 78 }, { month: 'May', rate: 85 },
  { month: 'Jun', rate: 91 }, { month: 'Jul', rate: 88 }, { month: 'Aug', rate: 94 },
  { month: 'Sep', rate: 90 }, { month: 'Oct', rate: 96 }, { month: 'Nov', rate: 93 },
  { month: 'Dec', rate: 95 }, { month: 'Jan', rate: 97 }, { month: 'Feb', rate: 92 },
];

const aiInsights = [
  { severity: 'high', text: '3 STS cranes running firmware 2+ versions behind — recommend immediate campaign for anti-collision safety patch.' },
  { severity: 'medium', text: 'AGV Unit A2 failed update due to network timeout during Stage 2. Retry with wired Ethernet fallback recommended.' },
  { severity: 'low', text: 'Fleet-wide TLS certificate rotation completed successfully. Next rotation due 2026-07-10.' },
  { severity: 'medium', text: 'Reach Stacker RS1 firmware v1.6.2 has known telemetry drift bug — schedule v1.7.0 update before next audit cycle (Mar 2026).' },
];

// ─────────────────────────────────────────────────────────────
// Utility Helpers
// ─────────────────────────────────────────────────────────────

const statusConfig: Record<UpdateStatus, { bg: string; text: string; dot: string }> = {
  'Up-to-date': { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Update Available': { bg: 'bg-sky-100', text: 'text-sky-700', dot: 'bg-sky-500' },
  'In Progress': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Failed': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

const campaignStatusConfig: Record<CampaignStatus, { bg: string; text: string }> = {
  Planning: { bg: 'bg-gray-100', text: 'text-gray-700' },
  'Rolling Out': { bg: 'bg-sky-100', text: 'text-sky-700' },
  Completed: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  Paused: { bg: 'bg-amber-100', text: 'text-amber-700' },
};

const strategyConfig: Record<RolloutStrategy, string> = {
  Canary: 'bg-violet-100 text-violet-700',
  Staged: 'bg-blue-100 text-blue-700',
  Immediate: 'bg-orange-100 text-orange-700',
};

function StatCard({ label, value, sublabel, icon }: { label: string; value: string | number; sublabel?: string; icon?: ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-gray-400">{icon}</span>}
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab 1: Fleet Status Dashboard
// ─────────────────────────────────────────────────────────────

function FleetStatusTab() {
  const upToDate = equipment.filter((e) => e.status === 'Up-to-date').length;
  const updatesAvail = equipment.filter((e) => e.status === 'Update Available').length;
  const failed = equipment.filter((e) => e.status === 'Failed').length;

  // Zone positions for SVG port layout
  const zonePositions: Record<string, { x: number; y: number; w: number; h: number }> = {
    'Berth A': { x: 20, y: 30, w: 160, h: 70 },
    'Berth B': { x: 200, y: 30, w: 160, h: 70 },
    'Yard Block C': { x: 20, y: 120, w: 120, h: 60 },
    'Yard Block D': { x: 160, y: 120, w: 120, h: 60 },
    'Quay Transfer': { x: 300, y: 120, w: 120, h: 60 },
    'Container Stack E': { x: 20, y: 200, w: 160, h: 50 },
    'Gate Area': { x: 300, y: 200, w: 120, h: 50 },
  };

  const dotColor = (s: UpdateStatus) => {
    if (s === 'Up-to-date') return '#22c55e';
    if (s === 'Update Available') return '#0ea5e9';
    if (s === 'In Progress') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Devices" value={equipment.length} sublabel="Khalifa Port fleet" icon={<Server className="w-4 h-4" />} />
        <StatCard label="Up-to-Date" value={`${Math.round((upToDate / equipment.length) * 100)}%`} sublabel={`${upToDate} of ${equipment.length} devices`} icon={<CheckCircle className="w-4 h-4" />} />
        <StatCard label="Updates Available" value={updatesAvail} sublabel="Awaiting rollout" icon={<Download className="w-4 h-4" />} />
        <StatCard label="Failed Updates" value={failed} sublabel={failed > 0 ? 'Action required' : 'All clear'} icon={<AlertTriangle className="w-4 h-4" />} />
      </div>

      {/* SVG Port Layout */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Port Equipment Map — Khalifa Port</h3>
        <svg viewBox="0 0 440 270" className="w-full h-auto bg-slate-50 rounded-lg">
          {/* Water area */}
          <rect x="0" y="0" width="440" height="25" fill="#e0f2fe" rx="4" />
          <text x="220" y="16" textAnchor="middle" className="text-[8px]" fill="#0284c7">Arabian Gulf — Quayside</text>

          {/* Zones */}
          {Object.entries(zonePositions).map(([zone, pos]) => (
            <g key={zone}>
              <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" rx="4" />
              <text x={pos.x + 6} y={pos.y + 14} className="text-[7px] font-medium" fill="#475569">{zone}</text>
              {/* Equipment dots in this zone */}
              {equipment
                .filter((e) => e.zone === zone)
                .map((eq, i) => {
                  const dx = pos.x + 16 + i * 36;
                  const dy = pos.y + 36;
                  return (
                    <g key={eq.id}>
                      <rect x={dx - 12} y={dy - 8} width={30} height={28} fill="white" stroke={dotColor(eq.status)} strokeWidth="1.5" rx="3" />
                      <circle cx={dx + 3} cy={dy - 2} r="3" fill={dotColor(eq.status)} />
                      <text x={dx + 3} y={dy + 10} textAnchor="middle" className="text-[5px]" fill="#334155">{eq.id.split('-').slice(-1)}</text>
                      <text x={dx + 3} y={dy + 16} textAnchor="middle" className="text-[4px]" fill="#94a3b8">{eq.type.split(' ')[0]}</text>
                    </g>
                  );
                })}
            </g>
          ))}

          {/* Legend */}
          <g transform="translate(300, 30)">
            {(['Up-to-date', 'Update Available', 'In Progress', 'Failed'] as UpdateStatus[]).map((s, i) => (
              <g key={s} transform={`translate(0, ${i * 14})`}>
                <circle cx="6" cy="6" r="3.5" fill={dotColor(s)} />
                <text x="14" y="9" className="text-[6px]" fill="#475569">{s}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Equipment</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Type</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Current FW</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Latest FW</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Last Update</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500">Uptime (h)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {equipment.map((eq) => {
                const sc = statusConfig[eq.status];
                return (
                  <tr key={eq.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-gray-900 text-xs">{eq.name}</div>
                      <div className="text-[10px] text-gray-400">{eq.id} · {eq.zone}</div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600">{eq.model}</td>
                    <td className="px-4 py-2.5 text-xs font-mono text-gray-700">{eq.currentFw}</td>
                    <td className="px-4 py-2.5 text-xs font-mono text-gray-700">{eq.latestFw}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {eq.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600">{eq.lastUpdate}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 text-right">{eq.uptimeHours.toLocaleString()}</td>
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

// ─────────────────────────────────────────────────────────────
// Tab 2: Update Campaigns
// ─────────────────────────────────────────────────────────────

function UpdateCampaignsTab() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  return (
    <div className="space-y-6">
      {/* Campaign Cards */}
      <div className="grid gap-4">
        {campaigns.map((cmp) => {
          const cs = campaignStatusConfig[cmp.status];
          const isSelected = selectedCampaign?.id === cmp.id;
          return (
            <button
              key={cmp.id}
              onClick={() => setSelectedCampaign(isSelected ? null : cmp)}
              className={`w-full text-left bg-white rounded-xl border p-4 shadow-sm transition-all ${
                isSelected ? 'border-sky-400 ring-1 ring-sky-200' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{cmp.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${cs.bg} ${cs.text}`}>{cmp.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {cmp.targetGroup} · {cmp.fwFrom} → {cmp.fwTo} · {cmp.deviceCount} device{cmp.deviceCount > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${strategyConfig[cmp.strategy]}`}>{cmp.strategy}</span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${cmp.status === 'Completed' ? 'bg-emerald-500' : cmp.status === 'Paused' ? 'bg-amber-400' : 'bg-sky-500'}`}
                    style={{ width: `${cmp.progress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 w-10 text-right">{cmp.progress}%</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Scheduled: {cmp.scheduledDate}</p>

              {/* Expanded: Rollout Stages */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Rollout Stages</h4>

                  {/* SVG Rollout Pipeline */}
                  <svg viewBox={`0 0 ${Math.max(cmp.stages.length * 140, 300)} 60`} className="w-full h-16 mb-3">
                    {cmp.stages.map((stage, i) => {
                      const sx = i * 140 + 10;
                      const fill = stage.status === 'Complete' ? '#22c55e' : stage.status === 'Active' ? '#0ea5e9' : '#e2e8f0';
                      const textFill = stage.status === 'Pending' ? '#94a3b8' : '#ffffff';
                      return (
                        <g key={i}>
                          {i > 0 && <line x1={sx - 20} y1="25" x2={sx} y2="25" stroke="#cbd5e1" strokeWidth="2" />}
                          <rect x={sx} y="8" width={110} height="35" rx="6" fill={fill} />
                          <text x={sx + 55} y="24" textAnchor="middle" className="text-[7px] font-medium" fill={textFill}>{stage.name}</text>
                          <text x={sx + 55} y="35" textAnchor="middle" className="text-[6px]" fill={textFill}>{stage.devices} device{stage.devices > 1 ? 's' : ''} · {stage.pct}%</text>
                        </g>
                      );
                    })}
                  </svg>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    {cmp.stages.map((stage, i) => {
                      const stageColor = stage.status === 'Complete' ? 'text-emerald-600' : stage.status === 'Active' ? 'text-sky-600' : 'text-gray-400';
                      return (
                        <div key={i} className="text-xs">
                          <span className={`font-medium ${stageColor}`}>{stage.status}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab 3: Analytics & Compliance
// ─────────────────────────────────────────────────────────────

function AnalyticsTab() {
  const upToDate = equipment.filter((e) => e.status === 'Up-to-date').length;
  const compliancePct = Math.round((upToDate / equipment.length) * 100);
  const maxRate = Math.max(...successRateTrend.map((d) => d.rate));
  const barMaxCount = Math.max(...fwDistribution.map((d) => d.count));

  return (
    <div className="space-y-6">
      {/* Compliance KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Fleet Compliance" value={`${compliancePct}%`} sublabel="On latest firmware" icon={<Shield className="w-4 h-4" />} />
        <StatCard label="Days Since Critical Patch" value={7} sublabel="TLS Cert Rotation — Feb 01" icon={<Clock className="w-4 h-4" />} />
        <StatCard label="Mean Time to Update" value="3.2 hrs" sublabel="Avg across 10 devices" icon={<Activity className="w-4 h-4" />} />
        <StatCard label="Campaigns Active" value={2} sublabel="STS Safety + RTG Anti-Sway" icon={<Layers className="w-4 h-4" />} />
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Firmware Version Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Firmware Version Distribution</h3>
          <svg viewBox="0 0 280 140" className="w-full h-auto">
            {fwDistribution.map((d, i) => {
              const barW = (d.count / barMaxCount) * 180;
              const y = i * 30 + 10;
              return (
                <g key={d.version}>
                  <text x="0" y={y + 14} className="text-[8px]" fill="#475569">{d.version}</text>
                  <rect x="72" y={y + 2} width={barW} height={18} rx="3" fill={d.color} />
                  <text x={72 + barW + 6} y={y + 14} className="text-[8px] font-medium" fill="#334155">{d.count}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Update Success Rate Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Update Success Rate (12-Month)</h3>
          <svg viewBox="0 0 300 150" className="w-full h-auto">
            {/* Grid lines */}
            {[70, 80, 90, 100].map((v) => {
              const y = 130 - ((v - 70) / (maxRate - 70 + 10)) * 110;
              return (
                <g key={v}>
                  <line x1="30" y1={y} x2="290" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                  <text x="24" y={y + 3} textAnchor="end" className="text-[6px]" fill="#94a3b8">{v}%</text>
                </g>
              );
            })}
            {/* Line + dots */}
            <polyline
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2"
              points={successRateTrend.map((d, i) => {
                const x = 40 + i * 22;
                const y = 130 - ((d.rate - 70) / (maxRate - 70 + 10)) * 110;
                return `${x},${y}`;
              }).join(' ')}
            />
            {successRateTrend.map((d, i) => {
              const x = 40 + i * 22;
              const y = 130 - ((d.rate - 70) / (maxRate - 70 + 10)) * 110;
              return (
                <g key={d.month}>
                  <circle cx={x} cy={y} r="3" fill="#0ea5e9" />
                  <text x={x} y={y - 6} textAnchor="middle" className="text-[5px] font-medium" fill="#0369a1">{d.rate}%</text>
                  <text x={x} y="145" textAnchor="middle" className="text-[6px]" fill="#94a3b8">{d.month}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-sky-500" />
          <h3 className="text-sm font-semibold text-gray-900">AI Insights</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {aiInsights.map((insight, i) => {
            const borderColor = insight.severity === 'high' ? 'border-l-red-500' : insight.severity === 'medium' ? 'border-l-amber-400' : 'border-l-emerald-400';
            const iconColor = insight.severity === 'high' ? 'text-red-500' : insight.severity === 'medium' ? 'text-amber-500' : 'text-emerald-500';
            return (
              <div key={i} className={`border border-gray-100 border-l-4 ${borderColor} rounded-lg p-3`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${iconColor}`} />
                  <p className="text-xs text-gray-700 leading-relaxed">{insight.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

const tabs: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: 'fleet-status', label: 'Fleet Status', icon: <Server className="w-3.5 h-3.5" /> },
  { id: 'update-campaigns', label: 'Update Campaigns', icon: <Download className="w-3.5 h-3.5" /> },
  { id: 'analytics', label: 'Analytics & Compliance', icon: <BarChart3 className="w-3.5 h-3.5" /> },
];

export default function PortFota() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('fleet-status');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 pt-20 pb-4">
        <div className="max-w-6xl mx-auto px-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center shadow-sm">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Port-FOTA Hub</h1>
                <p className="text-xs text-gray-500">In-Port OTA Firmware Update Center — Fleet Device Management</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'fleet-status' && <FleetStatusTab />}
        {activeTab === 'update-campaigns' && <UpdateCampaignsTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </main>

      {/* Tech Stack Footer */}
      <div className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="font-medium text-gray-700">Tech Stack:</span>
            {['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'Lucide Icons', 'SVG Charts'].map((tech) => (
              <span key={tech} className="rounded-full bg-gray-100 px-2.5 py-0.5">
                {tech}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2">
            <span className="font-medium text-gray-700">Concepts:</span>
            {['FOTA / OTA Updates', 'Fleet Device Management', 'Staged Rollout', 'Firmware Compliance', 'Port Equipment IoT'].map(
              (concept) => (
                <span key={concept} className="rounded-full bg-gray-100 px-2.5 py-0.5">
                  {concept}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
