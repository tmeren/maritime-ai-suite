import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Battery, BarChart3, Shield, TrendingDown, AlertTriangle, CheckCircle, Thermometer, Zap, Activity, ChevronRight, Sparkles, Truck, FileText, Home } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type TabId = 'battery-health' | 'transport-risk' | 'analytics';
type HealthStatus = 'Healthy' | 'Degraded' | 'Critical';
type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface BatteryPack {
  id: string;
  vin: string;
  model: string;
  soh: number;
  capacity: number;
  ratedCapacity: number;
  cycleCount: number;
  temperature: number;
  voltage: number;
  lastInspection: string;
  status: HealthStatus;
  degradation: number[]; // 12 months of SoH values
}

interface TransportRecord {
  id: string;
  vin: string;
  model: string;
  soh: number;
  riskLevel: RiskLevel;
  riskScore: number;
  tempRange: string;
  vibrationLimit: string;
  orientation: string;
  recommendation: string;
}

// ─────────────────────────────────────────────────────────────
// Demo Data — 8 Battery Packs
// ─────────────────────────────────────────────────────────────

const batteryPacks: BatteryPack[] = [
  { id: 'bp-1', vin: 'WBA53CJ09P...7241', model: 'BMW iX xDrive50', soh: 96, capacity: 105.2, ratedCapacity: 111.5, cycleCount: 142, temperature: 24, voltage: 398.2, lastInspection: '2026-01-28', status: 'Healthy', degradation: [100, 99.8, 99.5, 99.2, 98.8, 98.5, 98.1, 97.8, 97.4, 97.1, 96.7, 96.0] },
  { id: 'bp-2', vin: 'LNBSCU3H4P...8503', model: 'NIO ET7 100kWh', soh: 92, capacity: 92.0, ratedCapacity: 100.0, cycleCount: 310, temperature: 27, voltage: 384.5, lastInspection: '2026-01-15', status: 'Healthy', degradation: [100, 99.5, 99.0, 98.2, 97.5, 96.8, 96.0, 95.2, 94.5, 93.8, 93.0, 92.0] },
  { id: 'bp-3', vin: '5YJ3E1EA8N...1920', model: 'Tesla Model 3 LR', soh: 88, capacity: 70.4, ratedCapacity: 82.0, cycleCount: 485, temperature: 31, voltage: 356.8, lastInspection: '2026-02-01', status: 'Healthy', degradation: [100, 99.2, 98.5, 97.4, 96.2, 95.1, 93.8, 92.6, 91.4, 90.2, 89.1, 88.0] },
  { id: 'bp-4', vin: 'WP0AC2Y18N...6410', model: 'Porsche Taycan 4S', soh: 94, capacity: 79.9, ratedCapacity: 83.7, cycleCount: 198, temperature: 22, voltage: 612.4, lastInspection: '2026-01-20', status: 'Healthy', degradation: [100, 99.7, 99.3, 99.0, 98.6, 98.1, 97.6, 97.0, 96.4, 95.8, 95.2, 94.0] },
  { id: 'bp-5', vin: 'KMHK3841FN...3055', model: 'Hyundai Ioniq 6', soh: 74, capacity: 56.2, ratedCapacity: 77.4, cycleCount: 620, temperature: 35, voltage: 688.1, lastInspection: '2025-12-10', status: 'Degraded', degradation: [100, 98.8, 97.2, 95.5, 93.0, 90.5, 88.0, 85.5, 83.0, 80.0, 77.0, 74.0] },
  { id: 'bp-6', vin: 'JTDKN3DP5N...7822', model: 'Toyota bZ4X AWD', soh: 68, capacity: 47.6, ratedCapacity: 71.4, cycleCount: 780, temperature: 38, voltage: 342.6, lastInspection: '2025-11-28', status: 'Degraded', degradation: [100, 98.0, 95.5, 92.8, 90.0, 87.0, 84.0, 80.5, 77.0, 74.0, 71.0, 68.0] },
  { id: 'bp-7', vin: 'WBY73AW09P...9104', model: 'BMW i4 eDrive40', soh: 55, capacity: 44.0, ratedCapacity: 80.7, cycleCount: 1020, temperature: 42, voltage: 370.1, lastInspection: '2025-10-15', status: 'Critical', degradation: [100, 96.5, 92.0, 87.5, 83.0, 78.0, 73.5, 69.0, 65.0, 61.0, 58.0, 55.0] },
  { id: 'bp-8', vin: '1N4AZ1CV5N...2637', model: 'Nissan Ariya e-4ORCE', soh: 82, capacity: 53.3, ratedCapacity: 65.0, cycleCount: 390, temperature: 26, voltage: 352.8, lastInspection: '2026-01-05', status: 'Healthy', degradation: [100, 99.0, 98.0, 96.8, 95.5, 94.0, 92.5, 90.8, 89.0, 86.8, 84.5, 82.0] },
];

// ─────────────────────────────────────────────────────────────
// Transport Risk Records
// ─────────────────────────────────────────────────────────────

const transportRecords: TransportRecord[] = [
  { id: 'tr-1', vin: 'WBA53CJ09P...7241', model: 'BMW iX xDrive50', soh: 96, riskLevel: 'LOW', riskScore: 12, tempRange: '-20°C to 45°C', vibrationLimit: '2.0g peak', orientation: 'Any', recommendation: 'Standard transport. No special requirements.' },
  { id: 'tr-2', vin: 'LNBSCU3H4P...8503', model: 'NIO ET7 100kWh', soh: 92, riskLevel: 'LOW', riskScore: 18, tempRange: '-15°C to 40°C', vibrationLimit: '1.8g peak', orientation: 'Upright preferred', recommendation: 'Standard transport. Monitor SoC during extended storage.' },
  { id: 'tr-3', vin: '5YJ3E1EA8N...1920', model: 'Tesla Model 3 LR', soh: 88, riskLevel: 'MEDIUM', riskScore: 35, tempRange: '-10°C to 38°C', vibrationLimit: '1.5g peak', orientation: 'Upright required', recommendation: 'Reduce SoC to 30% for ocean transport. Avoid stacking over 2 high.' },
  { id: 'tr-4', vin: 'WP0AC2Y18N...6410', model: 'Porsche Taycan 4S', soh: 94, riskLevel: 'LOW', riskScore: 15, tempRange: '-20°C to 45°C', vibrationLimit: '2.0g peak', orientation: 'Any', recommendation: 'Standard transport. 800V architecture provides stable thermal profile.' },
  { id: 'tr-5', vin: 'KMHK3841FN...3055', model: 'Hyundai Ioniq 6', soh: 74, riskLevel: 'HIGH', riskScore: 62, tempRange: '-5°C to 35°C', vibrationLimit: '1.2g peak', orientation: 'Upright only', recommendation: 'Active thermal management required. Monitor cell voltage imbalance. SoC ≤20% mandatory.' },
  { id: 'tr-6', vin: 'JTDKN3DP5N...7822', model: 'Toyota bZ4X AWD', soh: 68, riskLevel: 'HIGH', riskScore: 71, tempRange: '-5°C to 32°C', vibrationLimit: '1.0g peak', orientation: 'Upright only', recommendation: 'High degradation — pre-transport inspection required. Thermal blanket for cold routes.' },
  { id: 'tr-7', vin: 'WBY73AW09P...9104', model: 'BMW i4 eDrive40', soh: 55, riskLevel: 'CRITICAL', riskScore: 89, tempRange: '0°C to 28°C', vibrationLimit: '0.8g peak', orientation: 'Upright only, isolated', recommendation: 'CRITICAL: Battery near end-of-life. Class 9 DG handling mandatory. Fire suppression blanket required. No ocean transport without OEM sign-off.' },
  { id: 'tr-8', vin: '1N4AZ1CV5N...2637', model: 'Nissan Ariya e-4ORCE', soh: 82, riskLevel: 'MEDIUM', riskScore: 38, tempRange: '-10°C to 38°C', vibrationLimit: '1.5g peak', orientation: 'Upright preferred', recommendation: 'Standard with monitoring. Check cell balance before multi-modal transport.' },
];

// ─────────────────────────────────────────────────────────────
// Analytics Data
// ─────────────────────────────────────────────────────────────

const fleetHealthDistribution = [
  { range: '90-100%', count: 3, color: '#22c55e' },
  { range: '80-89%', count: 2, color: '#84cc16' },
  { range: '70-79%', count: 1, color: '#eab308' },
  { range: '60-69%', count: 1, color: '#f97316' },
  { range: '<60%', count: 1, color: '#ef4444' },
];

const degradationHeatmap: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3],
  [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3],
  [1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4],
  [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3],
  [1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 5],
  [1, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5],
  [1, 2, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5],
  [1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5],
];
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const packLabels = ['iX', 'ET7', 'M3 LR', 'Taycan', 'Ioniq6', 'bZ4X', 'i4', 'Ariya'];

// ─────────────────────────────────────────────────────────────
// Utility Helpers
// ─────────────────────────────────────────────────────────────

function getSohColor(soh: number): string {
  if (soh >= 80) return 'text-emerald-600';
  if (soh >= 60) return 'text-amber-600';
  return 'text-red-600';
}

function getSohBg(soh: number): string {
  if (soh >= 80) return 'bg-emerald-500';
  if (soh >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

function getStatusConfig(status: HealthStatus): { bg: string; text: string } {
  const configs: Record<HealthStatus, { bg: string; text: string }> = {
    Healthy: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    Degraded: { bg: 'bg-amber-100', text: 'text-amber-700' },
    Critical: { bg: 'bg-red-100', text: 'text-red-700' },
  };
  return configs[status];
}

const riskColors: Record<RiskLevel, { bg: string; text: string; dot: string }> = {
  LOW: { bg: 'bg-emerald-100 border-emerald-300', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  MEDIUM: { bg: 'bg-amber-100 border-amber-300', text: 'text-amber-800', dot: 'bg-amber-500' },
  HIGH: { bg: 'bg-red-100 border-red-300', text: 'text-red-800', dot: 'bg-red-500' },
  CRITICAL: { bg: 'bg-red-200 border-red-500', text: 'text-red-900', dot: 'bg-red-700' },
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
// Tab 1: Battery Health
// ─────────────────────────────────────────────────────────────

function BatteryHealthTab() {
  const [selectedPack, setSelectedPack] = useState<BatteryPack | null>(null);

  const avgSoh = Math.round(batteryPacks.reduce((s, p) => s + p.soh, 0) / batteryPacks.length);
  const healthyCount = batteryPacks.filter((p) => p.status === 'Healthy').length;
  const criticalCount = batteryPacks.filter((p) => p.status === 'Critical').length;

  // SoH Gauge SVG params
  const gaugeR = 60;
  const gaugeCirc = 2 * Math.PI * gaugeR;
  const gaugePack = selectedPack || batteryPacks[0];
  const gaugeOffset = gaugeCirc - (gaugePack.soh / 100) * gaugeCirc;

  // Degradation chart params
  const chartW = 600;
  const chartH = 200;
  const padL = 45;
  const padB = 30;
  const plotW = chartW - padL - 15;
  const plotH = chartH - padB - 15;

  function toX(i: number) { return padL + (i / 11) * plotW; }
  function toY(v: number) { return 15 + plotH - ((v - 50) / 50) * plotH; }

  const degradationPath = gaugePack.degradation.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ');

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Fleet Avg SoH" value={`${avgSoh}%`} sublabel="across 8 packs" icon={<Battery className="w-3.5 h-3.5" />} />
        <StatCard label="Healthy" value={healthyCount} sublabel="SoH ≥ 80%" icon={<CheckCircle className="w-3.5 h-3.5" />} />
        <StatCard label="Critical" value={criticalCount} sublabel="SoH < 60%" icon={<AlertTriangle className="w-3.5 h-3.5" />} />
        <StatCard label="Avg Cycles" value={Math.round(batteryPacks.reduce((s, p) => s + p.cycleCount, 0) / batteryPacks.length)} sublabel="charge cycles" icon={<Zap className="w-3.5 h-3.5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SoH Gauge */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b bg-gray-50">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Battery className="w-4 h-4 text-gray-500" /> State of Health
            </h3>
          </div>
          <div className="p-5 flex flex-col items-center">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={gaugeR} fill="none" stroke="#e5e7eb" strokeWidth="12" />
              <circle
                cx="80" cy="80" r={gaugeR} fill="none"
                stroke={gaugePack.soh >= 80 ? '#22c55e' : gaugePack.soh >= 60 ? '#eab308' : '#ef4444'}
                strokeWidth="12" strokeLinecap="round"
                strokeDasharray={gaugeCirc} strokeDashoffset={gaugeOffset}
                transform="rotate(-90 80 80)"
                className="transition-all duration-700"
              />
              <text x="80" y="72" textAnchor="middle" fontSize="28" fontWeight="700" fill="#111827">{gaugePack.soh}%</text>
              <text x="80" y="92" textAnchor="middle" fontSize="10" fill="#9ca3af">SoH</text>
            </svg>
            <p className="text-sm font-semibold text-gray-900 mt-3">{gaugePack.model}</p>
            <p className="text-xs text-gray-500">{gaugePack.vin}</p>
            <div className="grid grid-cols-2 gap-3 mt-4 w-full text-xs">
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-gray-500">Capacity</p>
                <p className="font-bold">{gaugePack.capacity} / {gaugePack.ratedCapacity} kWh</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-gray-500">Cycles</p>
                <p className="font-bold">{gaugePack.cycleCount}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-gray-500">Temperature</p>
                <p className="font-bold">{gaugePack.temperature}°C</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-gray-500">Voltage</p>
                <p className="font-bold">{gaugePack.voltage} V</p>
              </div>
            </div>
          </div>
        </div>

        {/* Degradation Chart + Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Degradation Trend */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b bg-gray-50">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-gray-500" /> Degradation Trend (12 months)
              </h3>
            </div>
            <div className="p-4">
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto">
                {/* Grid lines */}
                {[50, 60, 70, 80, 90, 100].map((v) => (
                  <g key={v}>
                    <line x1={padL} y1={toY(v)} x2={chartW - 15} y2={toY(v)} stroke="#e5e7eb" strokeWidth="1" />
                    <text x={padL - 6} y={toY(v) + 4} textAnchor="end" className="text-[10px]" fill="#9ca3af">{v}%</text>
                  </g>
                ))}
                {/* Threshold zones */}
                <rect x={padL} y={toY(100)} width={plotW} height={toY(80) - toY(100)} fill="#dcfce7" opacity="0.3" />
                <rect x={padL} y={toY(80)} width={plotW} height={toY(60) - toY(80)} fill="#fef9c3" opacity="0.3" />
                <rect x={padL} y={toY(60)} width={plotW} height={toY(50) - toY(60)} fill="#fee2e2" opacity="0.3" />
                {/* Threshold labels */}
                <text x={chartW - 12} y={toY(80) + 4} textAnchor="end" className="text-[9px]" fill="#eab308">Warning</text>
                <text x={chartW - 12} y={toY(60) + 4} textAnchor="end" className="text-[9px]" fill="#ef4444">Critical</text>
                {/* Month labels */}
                {monthLabels.map((m, i) => (
                  <text key={i} x={toX(i)} y={chartH - 6} textAnchor="middle" className="text-[10px]" fill="#9ca3af">{m}</text>
                ))}
                {/* Degradation line */}
                <path d={degradationPath} fill="none" stroke={gaugePack.soh >= 80 ? '#22c55e' : gaugePack.soh >= 60 ? '#eab308' : '#ef4444'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {gaugePack.degradation.map((v, i) => (
                  <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill={gaugePack.soh >= 80 ? '#22c55e' : gaugePack.soh >= 60 ? '#eab308' : '#ef4444'} />
                ))}
              </svg>
            </div>
          </div>

          {/* Threshold Alerts */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b bg-gray-50">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gray-500" /> Threshold Alerts
              </h3>
            </div>
            <div className="divide-y">
              {batteryPacks.filter((p) => p.soh < 80).map((pack) => {
                const sc = getStatusConfig(pack.status);
                return (
                  <div key={pack.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{pack.model}</p>
                      <p className="text-xs text-gray-500">{pack.vin} · {pack.cycleCount} cycles · {pack.temperature}°C</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${getSohColor(pack.soh)}`}>{pack.soh}%</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}>{pack.status}</span>
                    </div>
                  </div>
                );
              })}
              {batteryPacks.filter((p) => p.soh < 80).length === 0 && (
                <div className="px-5 py-6 text-center text-sm text-gray-400">All packs above 80% threshold</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Battery Pack Grid */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-500" /> Fleet Battery Inventory
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Vehicle</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">VIN</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">SoH</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Capacity</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Cycles</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Temp</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {batteryPacks.map((pack) => {
                const sc = getStatusConfig(pack.status);
                const isSelected = selectedPack?.id === pack.id;
                return (
                  <tr
                    key={pack.id}
                    onClick={() => setSelectedPack(pack)}
                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-emerald-50 border-l-2 border-emerald-500' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{pack.model}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">{pack.vin}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-gray-200 overflow-hidden">
                          <div className={`h-full rounded-full ${getSohBg(pack.soh)}`} style={{ width: `${pack.soh}%` }} />
                        </div>
                        <span className={`font-bold text-sm ${getSohColor(pack.soh)}`}>{pack.soh}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{pack.capacity} / {pack.ratedCapacity} kWh</td>
                    <td className="px-4 py-3">{pack.cycleCount}</td>
                    <td className="px-4 py-3">
                      <span className={pack.temperature > 35 ? 'text-red-600 font-semibold' : ''}>{pack.temperature}°C</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}>{pack.status}</span>
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

// ─────────────────────────────────────────────────────────────
// Tab 2: Transport Risk
// ─────────────────────────────────────────────────────────────

function TransportRiskTab() {
  const riskDistribution = [
    { level: 'LOW' as RiskLevel, count: transportRecords.filter((r) => r.riskLevel === 'LOW').length },
    { level: 'MEDIUM' as RiskLevel, count: transportRecords.filter((r) => r.riskLevel === 'MEDIUM').length },
    { level: 'HIGH' as RiskLevel, count: transportRecords.filter((r) => r.riskLevel === 'HIGH').length },
    { level: 'CRITICAL' as RiskLevel, count: transportRecords.filter((r) => r.riskLevel === 'CRITICAL').length },
  ];

  const barChartW = 400;
  const barChartH = 160;
  const barPadL = 70;
  const barPlotW = barChartW - barPadL - 20;
  const barH = 28;
  const barGap = 6;
  const maxCount = Math.max(...riskDistribution.map((r) => r.count));
  const barFills: Record<RiskLevel, string> = { LOW: '#22c55e', MEDIUM: '#eab308', HIGH: '#ef4444', CRITICAL: '#991b1b' };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Low Risk" value={riskDistribution[0].count} sublabel="safe for standard transport" icon={<CheckCircle className="w-3.5 h-3.5" />} />
        <StatCard label="Medium Risk" value={riskDistribution[1].count} sublabel="monitoring recommended" icon={<Shield className="w-3.5 h-3.5" />} />
        <StatCard label="High Risk" value={riskDistribution[2].count} sublabel="special handling required" icon={<AlertTriangle className="w-3.5 h-3.5" />} />
        <StatCard label="Critical" value={riskDistribution[3].count} sublabel="OEM sign-off needed" icon={<Zap className="w-3.5 h-3.5" />} />
      </div>

      {/* Risk Distribution Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-500" /> Transport Risk Distribution
          </h3>
        </div>
        <div className="p-4">
          <svg viewBox={`0 0 ${barChartW} ${barChartH}`} className="w-full h-auto">
            {riskDistribution.map((d, i) => {
              const y = 10 + i * (barH + barGap);
              const w = maxCount > 0 ? (d.count / maxCount) * barPlotW : 0;
              return (
                <g key={d.level}>
                  <text x={barPadL - 8} y={y + barH / 2 + 4} textAnchor="end" className="text-[11px]" fill="#4b5563" fontWeight="600">{d.level}</text>
                  <rect x={barPadL} y={y} width={barPlotW} height={barH} rx="4" fill="#f3f4f6" />
                  <rect x={barPadL} y={y} width={w} height={barH} rx="4" fill={barFills[d.level]} />
                  <text x={barPadL + w + 8} y={y + barH / 2 + 4} className="text-[12px]" fill="#111827" fontWeight="700">{d.count}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Transport Risk Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-500" /> Per-VIN Transport Risk Assessment
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Vehicle</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">SoH</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Risk</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Score</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Temp Range</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Vibration</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Orientation</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transportRecords.map((rec) => {
                const rc = riskColors[rec.riskLevel];
                return (
                  <tr key={rec.id} className={rec.riskLevel === 'CRITICAL' ? 'bg-red-50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{rec.model}</p>
                      <p className="text-xs font-mono text-gray-400">{rec.vin}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${getSohColor(rec.soh)}`}>{rec.soh}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${rc.bg} ${rc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
                        {rec.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold">{rec.riskScore}/100</td>
                    <td className="px-4 py-3 text-xs">{rec.tempRange}</td>
                    <td className="px-4 py-3 text-xs">{rec.vibrationLimit}</td>
                    <td className="px-4 py-3 text-xs">{rec.orientation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" /> AI Transport Recommendations
          </h3>
          <span className="text-xs text-gray-400">Powered by Battery Passport AI</span>
        </div>
        <div className="space-y-3">
          {transportRecords.filter((r) => r.riskLevel === 'HIGH' || r.riskLevel === 'CRITICAL').map((rec) => (
            <div key={rec.id} className={`rounded-lg border p-4 ${rec.riskLevel === 'CRITICAL' ? 'border-red-300 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`w-4 h-4 ${rec.riskLevel === 'CRITICAL' ? 'text-red-600' : 'text-amber-600'}`} />
                <h4 className="font-semibold text-sm">{rec.model} — {rec.riskLevel}</h4>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{rec.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab 3: Analytics
// ─────────────────────────────────────────────────────────────

function AnalyticsTab() {
  // Fleet health bar chart params
  const barChartW = 500;
  const barChartH = 200;
  const barPadL = 60;
  const barPadB = 40;
  const barPlotW = barChartW - barPadL - 20;
  const barPlotH = barChartH - barPadB - 20;
  const barWidth = barPlotW / fleetHealthDistribution.length * 0.6;
  const barGap = barPlotW / fleetHealthDistribution.length;
  const maxCount = Math.max(...fleetHealthDistribution.map((d) => d.count));

  // Degradation heatmap params
  const heatCellW = 38;
  const heatCellH = 22;
  const heatPadL = 50;
  const heatColors = ['#dcfce7', '#bbf7d0', '#fef08a', '#fdba74', '#fca5a5'];

  // Compliance data
  const complianceItems = [
    { label: 'EU Battery Passport Regulation', status: 'Compliant', pct: 100 },
    { label: 'UN38.3 Transport Certification', status: 'Compliant', pct: 100 },
    { label: 'IMDG Class 9 DG Documentation', status: '7 of 8', pct: 87 },
    { label: 'OEM Warranty Validation', status: '5 of 8', pct: 62 },
    { label: 'Thermal Runaway Test Records', status: '6 of 8', pct: 75 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Fleet Size" value="8" sublabel="battery packs monitored" icon={<Battery className="w-3.5 h-3.5" />} />
        <StatCard label="Avg Degradation" value="3.2%/yr" sublabel="fleet-wide average" icon={<TrendingDown className="w-3.5 h-3.5" />} />
        <StatCard label="Compliance" value="85%" sublabel="passport coverage" icon={<FileText className="w-3.5 h-3.5" />} />
        <StatCard label="Transport Ready" value="5 / 8" sublabel="LOW/MEDIUM risk" icon={<Truck className="w-3.5 h-3.5" />} />
      </div>

      {/* Fleet Health Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-500" /> Fleet SoH Distribution
          </h3>
        </div>
        <div className="p-4">
          <svg viewBox={`0 0 ${barChartW} ${barChartH}`} className="w-full h-auto">
            {/* Y-axis grid */}
            {[0, 1, 2, 3].map((v) => {
              const y = 20 + barPlotH - (v / maxCount) * barPlotH;
              return (
                <g key={v}>
                  <line x1={barPadL} y1={y} x2={barChartW - 20} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                  <text x={barPadL - 8} y={y + 4} textAnchor="end" className="text-[10px]" fill="#9ca3af">{v}</text>
                </g>
              );
            })}
            {/* Bars */}
            {fleetHealthDistribution.map((d, i) => {
              const x = barPadL + i * barGap + (barGap - barWidth) / 2;
              const h = (d.count / maxCount) * barPlotH;
              const y = 20 + barPlotH - h;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={barWidth} height={h} rx="3" fill={d.color} />
                  <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="text-[10px]" fill="#4b5563" fontWeight="600">{d.count}</text>
                  <text x={x + barWidth / 2} y={barChartH - 10} textAnchor="middle" className="text-[10px]" fill="#9ca3af">{d.range}</text>
                </g>
              );
            })}
          </svg>
          <p className="text-xs text-gray-500 text-center mt-2">Distribution of battery packs across State-of-Health ranges</p>
        </div>
      </div>

      {/* Degradation Heatmap */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-gray-500" /> Degradation Heatmap (12-Month)
          </h3>
        </div>
        <div className="p-4 overflow-x-auto">
          <svg viewBox={`0 0 ${heatPadL + 12 * heatCellW + 10} ${8 * heatCellH + 40}`} className="w-full h-auto">
            {/* Month labels */}
            {monthLabels.map((m, i) => (
              <text key={i} x={heatPadL + i * heatCellW + heatCellW / 2} y={12} textAnchor="middle" className="text-[9px]" fill="#9ca3af">{m}</text>
            ))}
            {/* Pack rows */}
            {degradationHeatmap.map((row, pi) => (
              <g key={pi}>
                <text x={heatPadL - 6} y={22 + pi * heatCellH + heatCellH / 2 + 3} textAnchor="end" className="text-[10px]" fill="#6b7280">{packLabels[pi]}</text>
                {row.map((val, mi) => (
                  <rect
                    key={mi}
                    x={heatPadL + mi * heatCellW}
                    y={18 + pi * heatCellH}
                    width={heatCellW - 2}
                    height={heatCellH - 2}
                    rx="3"
                    fill={heatColors[val - 1]}
                  />
                ))}
              </g>
            ))}
            {/* Legend */}
            <text x={heatPadL} y={24 + 8 * heatCellH + 12} className="text-[10px]" fill="#6b7280">Minimal</text>
            {heatColors.map((c, i) => (
              <rect key={i} x={heatPadL + 45 + i * 20} y={24 + 8 * heatCellH + 2} width={16} height={12} rx="2" fill={c} />
            ))}
            <text x={heatPadL + 45 + 5 * 20 + 4} y={24 + 8 * heatCellH + 12} className="text-[10px]" fill="#6b7280">Severe</text>
          </svg>
          <p className="text-xs text-gray-500 text-center mt-2">Monthly degradation severity across fleet — darker cells indicate faster capacity loss</p>
        </div>
      </div>

      {/* Compliance Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-gray-500" /> Battery Passport Compliance Summary
        </h3>
        <div className="space-y-3">
          {complianceItems.map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <span className={`text-xs font-bold ${item.pct === 100 ? 'text-emerald-600' : item.pct >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                    {item.status}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.pct === 100 ? 'bg-emerald-500' : item.pct >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" /> AI-Generated Battery Insights
          </h3>
          <span className="text-xs text-gray-400">Powered by Battery Passport AI</span>
        </div>
        <div className="space-y-3">
          {[
            { icon: <TrendingDown className="w-4 h-4 text-red-500" />, title: 'Accelerated Degradation Alert', insight: 'BMW i4 eDrive40 (55% SoH) shows 3.75%/month degradation rate — 4x fleet average. Root cause analysis suggests prolonged DC fast charging above 150kW combined with high ambient temperatures (42°C). Recommend immediate cell-level diagnostic and warranty claim assessment.' },
            { icon: <Thermometer className="w-4 h-4 text-amber-500" />, title: 'Thermal Management Advisory', insight: 'Three packs (Ioniq 6, bZ4X, i4) show operating temperatures above 35°C. Correlation analysis indicates 2.1x faster degradation in packs consistently above 35°C. Consider pre-conditioning schedules and parking guidance for fleet operators.' },
            { icon: <Shield className="w-4 h-4 text-emerald-500" />, title: 'EU Battery Passport Ready', insight: 'Fleet is 100% compliant with EU Battery Regulation 2023/1542 passport requirements. Digital product passports available for all 8 packs. Carbon footprint declarations submitted. Next audit: Q2 2026.' },
            { icon: <Truck className="w-4 h-4 text-blue-500" />, title: 'Transport Optimization', insight: '5 of 8 packs qualify for standard transport (LOW/MEDIUM risk). Consolidate shipments to reduce per-unit logistics cost by ~18%. Route packs through temperature-controlled corridors for HIGH/CRITICAL units — estimated premium: +$340/unit.' },
          ].map((item, idx) => (
            <div key={idx} className="rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <h4 className="font-semibold text-sm">{item.title}</h4>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{item.insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h4 className="font-semibold text-sm mb-3">Battery Passport AI Pipeline</h4>
        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <span className="rounded bg-emerald-100 text-emerald-700 px-2.5 py-1 font-medium">Cell Telemetry</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-blue-100 text-blue-700 px-2.5 py-1 font-medium">SoH Estimation</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-violet-100 text-violet-700 px-2.5 py-1 font-medium">Degradation Modeling</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-amber-100 text-amber-700 px-2.5 py-1 font-medium">Risk Scoring</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-gray-800 text-white px-2.5 py-1 font-medium">Passport Generation</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function BatteryHealth() {
  const [activeTab, setActiveTab] = useState<TabId>('battery-health');

  const tabs: { id: TabId; label: string; icon: ReactNode }[] = [
    { id: 'battery-health', label: 'Battery Health', icon: <Battery className="w-4 h-4" /> },
    { id: 'transport-risk', label: 'Transport Risk', icon: <Truck className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-1.5 text-sm mb-3">
            <Link to="/" className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <Link to="/solutions" className="text-gray-400 hover:text-gray-700 transition-colors">Solutions</Link>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-gray-700 font-medium">Battery-Health Guard</span>
          </nav>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-sm">
                <Battery className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Battery-Logistics Health Guard</h1>
                <p className="text-xs text-gray-500">EV Battery Passport — Health Monitoring & Transport Risk Assessment</p>
              </div>
            </div>
            <Link
              to="/modules/battery-health"
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5" /> Module KPIs
            </Link>
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
        {activeTab === 'battery-health' && <BatteryHealthTab />}
        {activeTab === 'transport-risk' && <TransportRiskTab />}
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
            {['EV Battery Passport', 'State-of-Health Monitoring', 'Transport Risk Assessment', 'Degradation Modeling', 'Fleet Analytics'].map(
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
