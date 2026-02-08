import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, BarChart3, Users, Clock, Anchor, Activity, ChevronRight, Sparkles, HardHat, Ship, CheckCircle, AlertTriangle, TrendingUp, Target, Zap, Timer, Truck, Container } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type TabId = 'live-ops' | 'gang-scheduling' | 'analytics';
type CraneStatus = 'Active' | 'Idle' | 'Maintenance';
type CargoType = 'RoRo' | 'Container' | 'Bulk' | 'Reefer';
type ShiftType = 'Day' | 'Night';
type GangStatus = 'Active' | 'Break' | 'Off';

interface CraneAssignment {
  id: string;
  craneId: string;
  berth: string;
  vessel: string;
  gang: string;
  cargoType: CargoType;
  progress: number;
  movesPerHour: number;
  eta: string;
  status: CraneStatus;
}

interface Gang {
  id: string;
  name: string;
  size: number;
  skills: CargoType[];
  shift: ShiftType;
  status: GangStatus;
  currentAssignment: string | null;
  movesPerHour: number;
  rating: number;
  members: { name: string; role: string; yearsExp: number }[];
}

interface Vessel {
  id: string;
  name: string;
  cargoType: CargoType;
  cargoUnits: number;
  berth: string;
  eta: string;
  priority: 'Normal' | 'High' | 'Urgent';
}

// ─────────────────────────────────────────────────────────────
// Demo Data — Khalifa Port, Abu Dhabi
// ─────────────────────────────────────────────────────────────

const craneAssignments: CraneAssignment[] = [
  { id: 'ca-1', craneId: 'QC-A01', berth: 'A', vessel: 'MV Safeen Prima', gang: 'Alpha', cargoType: 'Container', progress: 72, movesPerHour: 28, eta: '14:30', status: 'Active' },
  { id: 'ca-2', craneId: 'QC-A02', berth: 'A', vessel: 'MV Safeen Prima', gang: 'Bravo', cargoType: 'Container', progress: 65, movesPerHour: 26, eta: '15:00', status: 'Active' },
  { id: 'ca-3', craneId: 'QC-B01', berth: 'B', vessel: 'MV Dhow Spirit', gang: 'Charlie', cargoType: 'RoRo', progress: 41, movesPerHour: 18, eta: '17:45', status: 'Active' },
  { id: 'ca-4', craneId: 'QC-B02', berth: 'B', vessel: 'MV Pearl Carrier', gang: 'Delta', cargoType: 'Bulk', progress: 88, movesPerHour: 32, eta: '13:15', status: 'Active' },
  { id: 'ca-5', craneId: 'QC-C01', berth: 'C', vessel: '—', gang: '—', cargoType: 'Container', progress: 0, movesPerHour: 0, eta: '—', status: 'Idle' },
  { id: 'ca-6', craneId: 'QC-C02', berth: 'C', vessel: '—', gang: '—', cargoType: 'Reefer', progress: 0, movesPerHour: 0, eta: '—', status: 'Maintenance' },
];

const gangs: Gang[] = [
  { id: 'g-1', name: 'Alpha', size: 12, skills: ['Container', 'Reefer'], shift: 'Day', status: 'Active', currentAssignment: 'QC-A01 · MV Safeen Prima', movesPerHour: 28, rating: 4.8, members: [{ name: 'Ahmed Al-Rashid', role: 'Foreman', yearsExp: 14 }, { name: 'Omar Khalil', role: 'Signalman', yearsExp: 9 }, { name: 'Rajesh Kumar', role: 'Lashman', yearsExp: 7 }, { name: 'Faisal Mahmoud', role: 'Crane Operator', yearsExp: 11 }, { name: 'Hassan Ali', role: 'Hatchman', yearsExp: 6 }, { name: 'Deepak Singh', role: 'Lashman', yearsExp: 5 }] },
  { id: 'g-2', name: 'Bravo', size: 10, skills: ['Container', 'Bulk'], shift: 'Day', status: 'Active', currentAssignment: 'QC-A02 · MV Safeen Prima', movesPerHour: 26, rating: 4.5, members: [{ name: 'Youssef Hamed', role: 'Foreman', yearsExp: 12 }, { name: 'Vikram Patel', role: 'Signalman', yearsExp: 8 }, { name: 'Ali Nasser', role: 'Lashman', yearsExp: 6 }, { name: 'Tariq Zayed', role: 'Crane Operator', yearsExp: 10 }, { name: 'Ramesh Sharma', role: 'Hatchman', yearsExp: 4 }] },
  { id: 'g-3', name: 'Charlie', size: 11, skills: ['RoRo', 'Container'], shift: 'Day', status: 'Active', currentAssignment: 'QC-B01 · MV Dhow Spirit', movesPerHour: 18, rating: 4.6, members: [{ name: 'Khalid Al-Mansoori', role: 'Foreman', yearsExp: 15 }, { name: 'Sunil Mehta', role: 'Signalman', yearsExp: 7 }, { name: 'Waleed Ibrahim', role: 'Driver', yearsExp: 9 }, { name: 'Naveen Reddy', role: 'Driver', yearsExp: 6 }, { name: 'Saeed Bin Rashid', role: 'Lashman', yearsExp: 8 }] },
  { id: 'g-4', name: 'Delta', size: 9, skills: ['Bulk', 'Container'], shift: 'Day', status: 'Active', currentAssignment: 'QC-B02 · MV Pearl Carrier', movesPerHour: 32, rating: 4.9, members: [{ name: 'Majed Al-Falasi', role: 'Foreman', yearsExp: 18 }, { name: 'Arjun Nair', role: 'Signalman', yearsExp: 10 }, { name: 'Bilal Hussain', role: 'Crane Operator', yearsExp: 13 }, { name: 'Prashant Joshi', role: 'Hatchman', yearsExp: 7 }] },
  { id: 'g-5', name: 'Echo', size: 10, skills: ['Reefer', 'Container'], shift: 'Day', status: 'Break', currentAssignment: null, movesPerHour: 24, rating: 4.3, members: [{ name: 'Nabil Darwish', role: 'Foreman', yearsExp: 11 }, { name: 'Sanjay Gupta', role: 'Signalman', yearsExp: 6 }, { name: 'Hamad Al-Suwaidi', role: 'Crane Operator', yearsExp: 8 }, { name: 'Ravi Shankar', role: 'Lashman', yearsExp: 5 }] },
  { id: 'g-6', name: 'Foxtrot', size: 12, skills: ['RoRo', 'Bulk', 'Container'], shift: 'Night', status: 'Off', currentAssignment: null, movesPerHour: 27, rating: 4.7, members: [{ name: 'Sultan Al-Dhaheri', role: 'Foreman', yearsExp: 16 }, { name: 'Anil Prakash', role: 'Signalman', yearsExp: 9 }, { name: 'Mohammed Jaber', role: 'Driver', yearsExp: 12 }, { name: 'Vivek Mishra', role: 'Crane Operator', yearsExp: 7 }, { name: 'Fahad Al-Ketbi', role: 'Hatchman', yearsExp: 5 }] },
  { id: 'g-7', name: 'Golf', size: 8, skills: ['Container', 'Reefer'], shift: 'Night', status: 'Off', currentAssignment: null, movesPerHour: 22, rating: 4.1, members: [{ name: 'Rashid Al-Ameri', role: 'Foreman', yearsExp: 10 }, { name: 'Manoj Kumar', role: 'Signalman', yearsExp: 5 }, { name: 'Adel Farooq', role: 'Crane Operator', yearsExp: 8 }] },
  { id: 'g-8', name: 'Hotel', size: 11, skills: ['Bulk', 'RoRo'], shift: 'Night', status: 'Off', currentAssignment: null, movesPerHour: 29, rating: 4.4, members: [{ name: 'Jabr Al-Nuaimi', role: 'Foreman', yearsExp: 13 }, { name: 'Ashok Verma', role: 'Signalman', yearsExp: 7 }, { name: 'Zayed Bin Saif', role: 'Driver', yearsExp: 11 }, { name: 'Kiran Rao', role: 'Lashman', yearsExp: 6 }, { name: 'Obaid Al-Shamsi', role: 'Hatchman', yearsExp: 9 }] },
];

const vesselQueue: Vessel[] = [
  { id: 'v-1', name: 'MV Falcon Express', cargoType: 'Container', cargoUnits: 1240, berth: 'C', eta: '16:00', priority: 'High' },
  { id: 'v-2', name: 'MV Oasis Venture', cargoType: 'RoRo', cargoUnits: 380, berth: 'B', eta: '19:30', priority: 'Normal' },
  { id: 'v-3', name: 'MV Desert Wind', cargoType: 'Reefer', cargoUnits: 520, berth: 'C', eta: '22:00', priority: 'Urgent' },
];

// ─────────────────────────────────────────────────────────────
// Analytics Data
// ─────────────────────────────────────────────────────────────

const craneUtilization = [
  { hour: 0, pct: 17 }, { hour: 2, pct: 25 }, { hour: 4, pct: 33 },
  { hour: 6, pct: 67 }, { hour: 8, pct: 83 }, { hour: 10, pct: 92 },
  { hour: 12, pct: 75 }, { hour: 14, pct: 88 }, { hour: 16, pct: 83 },
  { hour: 18, pct: 67 }, { hour: 20, pct: 50 }, { hour: 22, pct: 25 },
];

const gangProductivity = [
  { name: 'Alpha', moves: 28 }, { name: 'Bravo', moves: 26 },
  { name: 'Charlie', moves: 18 }, { name: 'Delta', moves: 32 },
  { name: 'Echo', moves: 24 }, { name: 'Foxtrot', moves: 27 },
  { name: 'Golf', moves: 22 }, { name: 'Hotel', moves: 29 },
];

const turnaroundTrend = [
  { day: 'Mon', hours: 18.2 }, { day: 'Tue', hours: 16.5 },
  { day: 'Wed', hours: 17.8 }, { day: 'Thu', hours: 14.3 },
  { day: 'Fri', hours: 15.1 }, { day: 'Sat', hours: 13.8 },
  { day: 'Sun', hours: 12.6 },
];

// ─────────────────────────────────────────────────────────────
// Utility Helpers
// ─────────────────────────────────────────────────────────────

const craneStatusColors: Record<CraneStatus, { bg: string; text: string; dot: string }> = {
  Active: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Idle: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  Maintenance: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

const cargoColors: Record<CargoType, string> = {
  RoRo: 'bg-violet-100 text-violet-800',
  Container: 'bg-blue-100 text-blue-800',
  Bulk: 'bg-amber-100 text-amber-800',
  Reefer: 'bg-cyan-100 text-cyan-800',
};

const gangStatusColors: Record<GangStatus, { bg: string; text: string }> = {
  Active: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  Break: { bg: 'bg-amber-100', text: 'text-amber-700' },
  Off: { bg: 'bg-gray-100', text: 'text-gray-600' },
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
// Tab 1: Live Operations
// ─────────────────────────────────────────────────────────────

function LiveOpsTab() {
  const activeCranes = craneAssignments.filter((c) => c.status === 'Active').length;
  const totalWorkers = gangs.filter((g) => g.status === 'Active').reduce((s, g) => s + g.size, 0);
  const avgMoves = Math.round(craneAssignments.filter((c) => c.status === 'Active').reduce((s, c) => s + c.movesPerHour, 0) / activeCranes);

  // SVG Port Layout
  const portW = 600;
  const portH = 220;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Active Cranes" value={`${activeCranes}/6`} sublabel="across 3 berths" icon={<Container className="w-3.5 h-3.5" />} />
        <StatCard label="Vessels in Queue" value={vesselQueue.length} sublabel="awaiting berth" icon={<Ship className="w-3.5 h-3.5" />} />
        <StatCard label="Workers On-Shift" value={totalWorkers} sublabel="4 gangs active" icon={<Users className="w-3.5 h-3.5" />} />
        <StatCard label="Avg Moves/Hour" value={avgMoves} sublabel="per active crane" icon={<Activity className="w-3.5 h-3.5" />} />
      </div>

      {/* Port Layout SVG */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Anchor className="w-4 h-4 text-gray-500" /> Khalifa Port — Live Berth Overview
          </h3>
        </div>
        <div className="p-4">
          <svg viewBox={`0 0 ${portW} ${portH}`} className="w-full h-auto">
            {/* Water background */}
            <rect x="0" y="0" width={portW} height={portH} rx="8" fill="#eff6ff" />
            <text x={portW / 2} y={portH - 8} textAnchor="middle" className="text-[10px]" fill="#93c5fd" fontStyle="italic">Arabian Gulf</text>

            {/* Berth A */}
            <rect x="20" y="20" width="170" height="70" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
            <text x="30" y="36" className="text-[11px]" fill="#64748b" fontWeight="700">Berth A</text>
            {craneAssignments.filter((c) => c.berth === 'A').map((crane, i) => {
              const cx = 40 + i * 80;
              const sc = craneStatusColors[crane.status];
              return (
                <g key={crane.id}>
                  <rect x={cx} y="44" width="60" height="36" rx="4" fill={crane.status === 'Active' ? '#f0fdf4' : '#fefce8'} stroke={crane.status === 'Active' ? '#86efac' : '#fde68a'} strokeWidth="1" />
                  <circle cx={cx + 6} cy={52} r="3" className={sc.dot} fill={crane.status === 'Active' ? '#22c55e' : '#f59e0b'} />
                  <text x={cx + 12} y={55} className="text-[9px]" fill="#374151" fontWeight="600">{crane.craneId}</text>
                  <text x={cx + 4} y={67} className="text-[8px]" fill="#6b7280">{crane.gang !== '—' ? `Gang ${crane.gang}` : 'Unassigned'}</text>
                  {crane.progress > 0 && (
                    <>
                      <rect x={cx + 4} y={72} width="52" height="3" rx="1.5" fill="#e5e7eb" />
                      <rect x={cx + 4} y={72} width={52 * crane.progress / 100} height="3" rx="1.5" fill="#22c55e" />
                    </>
                  )}
                </g>
              );
            })}

            {/* Berth B */}
            <rect x="210" y="20" width="170" height="70" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
            <text x="220" y="36" className="text-[11px]" fill="#64748b" fontWeight="700">Berth B</text>
            {craneAssignments.filter((c) => c.berth === 'B').map((crane, i) => {
              const cx = 230 + i * 80;
              const sc = craneStatusColors[crane.status];
              return (
                <g key={crane.id}>
                  <rect x={cx} y="44" width="60" height="36" rx="4" fill={crane.status === 'Active' ? '#f0fdf4' : '#fefce8'} stroke={crane.status === 'Active' ? '#86efac' : '#fde68a'} strokeWidth="1" />
                  <circle cx={cx + 6} cy={52} r="3" fill={crane.status === 'Active' ? '#22c55e' : sc.dot === 'bg-amber-500' ? '#f59e0b' : '#ef4444'} />
                  <text x={cx + 12} y={55} className="text-[9px]" fill="#374151" fontWeight="600">{crane.craneId}</text>
                  <text x={cx + 4} y={67} className="text-[8px]" fill="#6b7280">{crane.gang !== '—' ? `Gang ${crane.gang}` : 'Unassigned'}</text>
                  {crane.progress > 0 && (
                    <>
                      <rect x={cx + 4} y={72} width="52" height="3" rx="1.5" fill="#e5e7eb" />
                      <rect x={cx + 4} y={72} width={52 * crane.progress / 100} height="3" rx="1.5" fill="#22c55e" />
                    </>
                  )}
                </g>
              );
            })}

            {/* Berth C */}
            <rect x="400" y="20" width="170" height="70" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
            <text x="410" y="36" className="text-[11px]" fill="#64748b" fontWeight="700">Berth C</text>
            {craneAssignments.filter((c) => c.berth === 'C').map((crane, i) => {
              const cx = 420 + i * 80;
              return (
                <g key={crane.id}>
                  <rect x={cx} y="44" width="60" height="36" rx="4" fill={crane.status === 'Idle' ? '#fffbeb' : '#fef2f2'} stroke={crane.status === 'Idle' ? '#fde68a' : '#fecaca'} strokeWidth="1" />
                  <circle cx={cx + 6} cy={52} r="3" fill={crane.status === 'Idle' ? '#f59e0b' : '#ef4444'} />
                  <text x={cx + 12} y={55} className="text-[9px]" fill="#374151" fontWeight="600">{crane.craneId}</text>
                  <text x={cx + 4} y={67} className="text-[8px]" fill="#6b7280">{crane.status}</text>
                </g>
              );
            })}

            {/* Vessel Queue Area */}
            <rect x="20" y="110" width={portW - 40} height="85" rx="6" fill="#fefce8" stroke="#fde68a" strokeWidth="1" strokeDasharray="4,3" />
            <text x="30" y="126" className="text-[11px]" fill="#92400e" fontWeight="700">Vessel Queue — Awaiting Assignment</text>
            {vesselQueue.map((v, i) => {
              const vx = 30 + i * 185;
              return (
                <g key={v.id}>
                  <rect x={vx} y="134" width="165" height="50" rx="4" fill="white" stroke="#e5e7eb" strokeWidth="1" />
                  <text x={vx + 8} y="150" className="text-[10px]" fill="#111827" fontWeight="600">{v.name}</text>
                  <text x={vx + 8} y="162" className="text-[9px]" fill="#6b7280">{v.cargoType} · {v.cargoUnits} units · Berth {v.berth}</text>
                  <text x={vx + 8} y="174" className="text-[9px]" fill="#92400e" fontWeight="500">ETA {v.eta} · {v.priority}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Crane Assignment Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Container className="w-4 h-4 text-gray-500" /> Crane Assignment Board
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Crane</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Vessel</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Gang</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Cargo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Progress</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Moves/Hr</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ETA</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {craneAssignments.map((crane) => {
                const sc = craneStatusColors[crane.status];
                return (
                  <tr key={crane.id} className={crane.status === 'Maintenance' ? 'bg-red-50/50' : crane.status === 'Idle' ? 'bg-amber-50/50' : ''}>
                    <td className="px-4 py-3 font-bold text-gray-900">{crane.craneId}</td>
                    <td className="px-4 py-3">{crane.vessel}</td>
                    <td className="px-4 py-3">{crane.gang !== '—' ? `Gang ${crane.gang}` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cargoColors[crane.cargoType]}`}>
                        {crane.cargoType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {crane.progress > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${crane.progress}%` }} />
                          </div>
                          <span className="text-xs font-medium text-gray-600">{crane.progress}%</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono">{crane.movesPerHour || '—'}</td>
                    <td className="px-4 py-3">{crane.eta}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {crane.status}
                      </span>
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
// Tab 2: Gang Scheduling
// ─────────────────────────────────────────────────────────────

function GangSchedulingTab() {
  const [selectedGangId, setSelectedGangId] = useState<string>(gangs[0].id);
  const [selectedVesselId, setSelectedVesselId] = useState<string>(vesselQueue[0].id);
  const selectedGang = gangs.find((g) => g.id === selectedGangId)!;
  const selectedVessel = vesselQueue.find((v) => v.id === selectedVesselId)!;

  // Compute skill match score
  const skillMatch = selectedGang.skills.includes(selectedVessel.cargoType);
  const shiftMatch = selectedGang.shift === 'Day' && parseInt(selectedVessel.eta) < 18;
  const availabilityMatch = selectedGang.status !== 'Active';
  const matchScore = (skillMatch ? 40 : 10) + (shiftMatch ? 25 : 5) + (availabilityMatch ? 25 : 0) + Math.round(selectedGang.rating * 2);

  // All gangs scored for this vessel
  const gangScores = gangs.map((g) => {
    const sm = g.skills.includes(selectedVessel.cargoType);
    const shm = g.shift === 'Day' && parseInt(selectedVessel.eta) < 18;
    const am = g.status !== 'Active';
    return { name: g.name, score: (sm ? 40 : 10) + (shm ? 25 : 5) + (am ? 25 : 0) + Math.round(g.rating * 2) };
  }).sort((a, b) => b.score - a.score);

  const barMax = 100;
  const barW = 400;
  const barH = 200;
  const barPadL = 70;


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gang Roster */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b bg-gray-50">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" /> Stevedore Gangs ({gangs.length})
            </h3>
          </div>
          <div className="divide-y max-h-[480px] overflow-y-auto">
            {gangs.map((gang) => {
              const gs = gangStatusColors[gang.status];
              return (
                <button
                  key={gang.id}
                  onClick={() => setSelectedGangId(gang.id)}
                  className={`w-full text-left px-5 py-3.5 hover:bg-amber-50/50 transition-colors ${selectedGangId === gang.id ? 'bg-amber-50 border-l-2 border-amber-500' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-gray-900">Gang {gang.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${gs.bg} ${gs.text}`}>{gang.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{gang.size} workers</span>
                    <span>·</span>
                    <span>{gang.shift} Shift</span>
                    <span>·</span>
                    <span>{gang.movesPerHour} moves/hr</span>
                    <span>·</span>
                    <span>{'★'.repeat(Math.round(gang.rating))} {gang.rating}</span>
                  </div>
                  <div className="flex gap-1.5 mt-1.5">
                    {gang.skills.map((skill) => (
                      <span key={skill} className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${cargoColors[skill]}`}>{skill}</span>
                    ))}
                  </div>
                  {gang.currentAssignment && (
                    <p className="text-xs text-amber-700 mt-1 font-medium">{gang.currentAssignment}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gang Detail + AI Recommendation */}
        <div className="space-y-6">
          {/* Selected Gang Detail */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b bg-gray-50">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <HardHat className="w-4 h-4 text-gray-500" /> Gang {selectedGang.name} — Members
              </h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-xs"><span className="text-gray-500">Size:</span> <span className="font-bold">{selectedGang.size} workers</span></div>
                <div className="text-xs"><span className="text-gray-500">Shift:</span> <span className="font-bold">{selectedGang.shift}</span></div>
                <div className="text-xs"><span className="text-gray-500">Avg Moves/Hr:</span> <span className="font-bold">{selectedGang.movesPerHour}</span></div>
                <div className="text-xs"><span className="text-gray-500">Rating:</span> <span className="font-bold">{'★'.repeat(Math.round(selectedGang.rating))} {selectedGang.rating}/5</span></div>
              </div>
              <div className="space-y-2">
                {selectedGang.members.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.role}</p>
                    </div>
                    <span className="text-xs text-gray-400">{m.yearsExp}y exp</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b bg-amber-50">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" /> AI Gang Recommendation
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Select Incoming Vessel</label>
                <select
                  value={selectedVesselId}
                  onChange={(e) => setSelectedVesselId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {vesselQueue.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} — {v.cargoType} · {v.cargoUnits} units · ETA {v.eta}</option>
                  ))}
                </select>
              </div>

              {/* Match Score */}
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700">Match Score: Gang {selectedGang.name} → {selectedVessel.name}</span>
                  <span className={`text-sm font-bold ${matchScore >= 70 ? 'text-emerald-600' : matchScore >= 45 ? 'text-amber-600' : 'text-red-600'}`}>{matchScore}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${matchScore >= 70 ? 'bg-emerald-500' : matchScore >= 45 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${matchScore}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    {skillMatch ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <AlertTriangle className="w-3 h-3 text-red-500" />}
                    <span className={skillMatch ? 'text-emerald-700' : 'text-red-700'}>Skill {skillMatch ? 'Match' : 'Mismatch'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {shiftMatch ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <AlertTriangle className="w-3 h-3 text-amber-500" />}
                    <span className={shiftMatch ? 'text-emerald-700' : 'text-amber-700'}>Shift {shiftMatch ? 'OK' : 'Overlap'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {availabilityMatch ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <AlertTriangle className="w-3 h-3 text-red-500" />}
                    <span className={availabilityMatch ? 'text-emerald-700' : 'text-red-700'}>{availabilityMatch ? 'Available' : 'Busy'}</span>
                  </div>
                </div>
              </div>

              {/* Ranking Chart */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">All Gangs Ranked for {selectedVessel.name}</p>
                <svg viewBox={`0 0 ${barW} ${barH}`} className="w-full h-auto">
                  {gangScores.map((gs, i) => {
                    const barHeight = 16;
                    const y = 6 + i * (barHeight + 6);
                    const w = ((barW - barPadL - 20) * gs.score) / barMax;
                    const isSelected = gs.name === selectedGang.name;
                    return (
                      <g key={gs.name}>
                        <text x={barPadL - 6} y={y + barHeight / 2 + 4} textAnchor="end" className="text-[10px]" fill={isSelected ? '#92400e' : '#6b7280'} fontWeight={isSelected ? '700' : '400'}>
                          {gs.name}
                        </text>
                        <rect x={barPadL} y={y} width={w} height={barHeight} rx="3" fill={isSelected ? '#f59e0b' : gs.score >= 70 ? '#86efac' : gs.score >= 45 ? '#fde68a' : '#fecaca'} />
                        <text x={barPadL + w + 6} y={y + barHeight / 2 + 4} className="text-[10px]" fill="#374151" fontWeight="600">{gs.score}%</text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* AI Recommendation Text */}
              <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-800">AI Recommendation</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  For <strong>{selectedVessel.name}</strong> ({selectedVessel.cargoType}, {selectedVessel.cargoUnits} units, ETA {selectedVessel.eta}),
                  the optimal assignment is <strong>Gang {gangScores[0].name}</strong> (score: {gangScores[0].score}%).
                  {gangScores[0].name !== selectedGang.name && (
                    <> Currently viewing Gang {selectedGang.name} (score: {matchScore}%) — consider switching to {gangScores[0].name} for {gangScores[0].score - matchScore}% improvement.</>
                  )}
                  {gangScores[0].name === selectedGang.name && (
                    <> This gang has the best combined skill match, availability, and productivity rating for this cargo type.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab 3: Analytics
// ─────────────────────────────────────────────────────────────

function AnalyticsTab() {
  // Crane Utilization Chart
  const utilW = 560;
  const utilH = 180;
  const utilPadL = 40;
  const utilPadB = 30;
  const utilPlotW = utilW - utilPadL - 10;
  const utilPlotH = utilH - utilPadB - 10;
  const utilBarW = utilPlotW / craneUtilization.length * 0.6;
  const utilBarGap = utilPlotW / craneUtilization.length;

  // Turnaround Trend Line Chart
  const trendW = 560;
  const trendH = 160;
  const trendPadL = 40;
  const trendPadB = 30;
  const trendPlotW = trendW - trendPadL - 10;
  const trendPlotH = trendH - trendPadB - 10;
  const trendMaxY = 20;
  function trendX(i: number) { return trendPadL + (i / (turnaroundTrend.length - 1)) * trendPlotW; }
  function trendY(v: number) { return 10 + trendPlotH - (v / trendMaxY) * trendPlotH; }
  const trendPath = turnaroundTrend.map((d, i) => `${i === 0 ? 'M' : 'L'}${trendX(i)},${trendY(d.hours)}`).join(' ');

  // Gang Productivity Chart
  const prodW = 560;
  const prodH = 180;
  const prodPadL = 70;
  const prodBarH = 14;
  const maxMoves = 35;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Avg Utilization" value="68%" sublabel="target: 75%" icon={<Container className="w-3.5 h-3.5" />} />
        <StatCard label="Overtime Saved" value="142h" sublabel="this month" icon={<Clock className="w-3.5 h-3.5" />} />
        <StatCard label="Idle Reduction" value="-34%" sublabel="vs last quarter" icon={<TrendingUp className="w-3.5 h-3.5" />} />
        <StatCard label="Avg Turnaround" value="15.5h" sublabel="7-day avg" icon={<Timer className="w-3.5 h-3.5" />} />
      </div>

      {/* Crane Utilization by Hour */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-500" /> Crane Utilization by Hour (24h)
          </h3>
        </div>
        <div className="p-4">
          <svg viewBox={`0 0 ${utilW} ${utilH}`} className="w-full h-auto">
            {[0, 25, 50, 75, 100].map((v) => {
              const y = 10 + utilPlotH - (v / 100) * utilPlotH;
              return (
                <g key={v}>
                  <line x1={utilPadL} y1={y} x2={utilW - 10} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                  <text x={utilPadL - 6} y={y + 4} textAnchor="end" className="text-[10px]" fill="#9ca3af">{v}%</text>
                </g>
              );
            })}
            {/* Target line */}
            <line x1={utilPadL} y1={10 + utilPlotH - (75 / 100) * utilPlotH} x2={utilW - 10} y2={10 + utilPlotH - (75 / 100) * utilPlotH} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,3" />
            <text x={utilW - 12} y={10 + utilPlotH - (75 / 100) * utilPlotH - 4} textAnchor="end" className="text-[9px]" fill="#f59e0b" fontWeight="600">Target 75%</text>
            {craneUtilization.map((d, i) => {
              const x = utilPadL + i * utilBarGap + (utilBarGap - utilBarW) / 2;
              const h = (d.pct / 100) * utilPlotH;
              const y = 10 + utilPlotH - h;
              const color = d.pct >= 75 ? '#22c55e' : d.pct >= 50 ? '#f59e0b' : '#ef4444';
              return (
                <g key={i}>
                  <rect x={x} y={y} width={utilBarW} height={h} rx="3" fill={color} />
                  <text x={x + utilBarW / 2} y={y - 5} textAnchor="middle" className="text-[9px]" fill="#374151" fontWeight="600">{d.pct}%</text>
                  <text x={x + utilBarW / 2} y={utilH - 6} textAnchor="middle" className="text-[9px]" fill="#9ca3af">{d.hour.toString().padStart(2, '0')}h</text>
                </g>
              );
            })}
          </svg>
          <p className="text-xs text-gray-500 text-center mt-2">Peak utilization 08:00–16:00. Night shift (22:00–06:00) under-utilized — opportunity for scheduling optimization.</p>
        </div>
      </div>

      {/* Gang Productivity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" /> Gang Productivity — Moves per Hour
          </h3>
        </div>
        <div className="p-4">
          <svg viewBox={`0 0 ${prodW} ${prodH}`} className="w-full h-auto">
            {gangProductivity.map((g, i) => {
              const y = 6 + i * (prodBarH + 6);
              const w = ((prodW - prodPadL - 40) * g.moves) / maxMoves;
              const color = g.moves >= 28 ? '#22c55e' : g.moves >= 22 ? '#f59e0b' : '#ef4444';
              return (
                <g key={g.name}>
                  <text x={prodPadL - 6} y={y + prodBarH / 2 + 4} textAnchor="end" className="text-[10px]" fill="#6b7280" fontWeight="500">{g.name}</text>
                  <rect x={prodPadL} y={y} width={w} height={prodBarH} rx="3" fill={color} />
                  <text x={prodPadL + w + 6} y={y + prodBarH / 2 + 4} className="text-[10px]" fill="#374151" fontWeight="600">{g.moves}</text>
                </g>
              );
            })}
          </svg>
          <p className="text-xs text-gray-500 text-center mt-2">Delta leads at 32 moves/hr (bulk specialist). Charlie at 18 (RoRo — inherently slower vehicle-by-vehicle ops).</p>
        </div>
      </div>

      {/* Turnaround Trend */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-500" /> Vessel Turnaround Time — 7-Day Trend
          </h3>
        </div>
        <div className="p-4">
          <svg viewBox={`0 0 ${trendW} ${trendH}`} className="w-full h-auto">
            {[0, 5, 10, 15, 20].map((v) => (
              <g key={v}>
                <line x1={trendPadL} y1={trendY(v)} x2={trendW - 10} y2={trendY(v)} stroke="#e5e7eb" strokeWidth="1" />
                <text x={trendPadL - 6} y={trendY(v) + 4} textAnchor="end" className="text-[10px]" fill="#9ca3af">{v}h</text>
              </g>
            ))}
            {turnaroundTrend.map((d, i) => (
              <text key={i} x={trendX(i)} y={trendH - 6} textAnchor="middle" className="text-[10px]" fill="#9ca3af">{d.day}</text>
            ))}
            {/* Area fill */}
            <path
              d={`${trendPath} L${trendX(turnaroundTrend.length - 1)},${trendY(0)} L${trendX(0)},${trendY(0)} Z`}
              fill="url(#trendGradient)" opacity="0.3"
            />
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Line */}
            <path d={trendPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {turnaroundTrend.map((d, i) => (
              <g key={`p-${i}`}>
                <circle cx={trendX(i)} cy={trendY(d.hours)} r="4" fill="white" stroke="#f59e0b" strokeWidth="2" />
                <text x={trendX(i)} y={trendY(d.hours) - 10} textAnchor="middle" className="text-[9px]" fill="#92400e" fontWeight="600">{d.hours}h</text>
              </g>
            ))}
          </svg>
          <p className="text-xs text-gray-500 text-center mt-2">Turnaround improving 31% over the week (18.2h → 12.6h) — AI-optimized gang allocation reducing idle gaps between crane swaps.</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> AI-Generated Workforce Insights
          </h3>
          <span className="text-xs text-gray-400">Powered by Stevedore-AI Engine</span>
        </div>
        <div className="space-y-3">
          {[
            { icon: <TrendingUp className="w-4 h-4 text-emerald-500" />, title: 'Night Shift Under-Utilization', insight: 'Crane utilization drops to 17-25% between 22:00-04:00 while 4 night-shift gangs (Foxtrot, Golf, Hotel + reserve) are available. Recommend scheduling 2 additional vessel arrivals in the overnight window — projected 23% throughput increase with zero overtime cost.' },
            { icon: <AlertTriangle className="w-4 h-4 text-amber-500" />, title: 'Skill Gap: Reefer Operations', insight: 'Only 2 of 8 gangs (Alpha, Echo) are certified for reefer cargo handling. With MV Desert Wind (reefer, 520 units) arriving at 22:00, cross-train Foxtrot\'s night shift in reefer protocols to avoid a 6-hour delay waiting for Alpha\'s next day shift.' },
            { icon: <Target className="w-4 h-4 text-amber-600" />, title: 'Gang Delta — Star Performer', insight: 'Delta consistently leads at 32 moves/hr (23% above average). Their foreman Majed Al-Falasi (18y exp) uses a pre-staging technique for bulk cargo. Recommend filming his method for training material — potential fleet-wide 8-12% productivity gain.' },
            { icon: <Truck className="w-4 h-4 text-blue-500" />, title: 'Turnaround Optimization', insight: 'The 31% turnaround improvement this week correlates with the new AI-matched gang assignment (vs. manual rotation). Largest gains on RoRo vessels where skill-matching matters most — Charlie\'s specialized RoRo team reduced MV Dhow Spirit dwell time by 4.2 hours vs. previous generic assignment.' },
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
        <h4 className="font-semibold text-sm mb-3">Stevedore-AI Orchestration Pipeline</h4>
        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <span className="rounded bg-amber-100 text-amber-700 px-2.5 py-1 font-medium">Vessel Intake</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-orange-100 text-orange-700 px-2.5 py-1 font-medium">Skill Matching</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-yellow-100 text-yellow-700 px-2.5 py-1 font-medium">Shift Optimization</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-emerald-100 text-emerald-700 px-2.5 py-1 font-medium">Gang Assignment</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-gray-800 text-white px-2.5 py-1 font-medium">Real-Time Monitoring</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function StevedoreAI() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('live-ops');

  const tabs: { id: TabId; label: string; icon: ReactNode }[] = [
    { id: 'live-ops', label: 'Live Operations', icon: <Container className="w-4 h-4" /> },
    { id: 'gang-scheduling', label: 'Gang Scheduling', icon: <Users className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
                <HardHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Stevedore-AI Orchestrator</h1>
                <p className="text-xs text-gray-500">AI-Powered Port Worker & Crane Gang Scheduling</p>
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
        {activeTab === 'live-ops' && <LiveOpsTab />}
        {activeTab === 'gang-scheduling' && <GangSchedulingTab />}
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
            {['AI Workforce Optimization', 'Crane-Gang Matching', 'Port Operations', 'Real-Time Scheduling', 'Maritime Logistics'].map(
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
