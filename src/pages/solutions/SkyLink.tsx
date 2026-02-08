import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, BarChart3, Plane, AlertTriangle, CheckCircle, ExternalLink, Activity, Sparkles, Clock, Package, Battery, Navigation2, MapPin, Target, Wind, Eye, ChevronRight, Send } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type TabId = 'fleet-dashboard' | 'mission-control' | 'analytics';
type DroneStatus = 'In-Flight' | 'Idle' | 'Charging' | 'Maintenance';
type MissionStatus = 'Queued' | 'Dispatched' | 'In-Flight' | 'Delivered';
type MissionPriority = 'Critical' | 'High' | 'Standard';

interface Drone {
  id: string;
  name: string;
  model: string;
  status: DroneStatus;
  battery: number;
  payload: string;
  currentMission: string | null;
  totalFlights: number;
  position: { x: number; y: number };
  zone: string;
}

interface Mission {
  id: string;
  name: string;
  origin: string;
  destination: string;
  droneId: string | null;
  package: string;
  weightKg: number;
  priority: MissionPriority;
  status: MissionStatus;
  eta: string;
  distance: string;
}

// ─────────────────────────────────────────────────────────────
// Demo Data — Khalifa Port, Abu Dhabi
// ─────────────────────────────────────────────────────────────

const drones: Drone[] = [
  { id: 'KP-DR-01', name: 'Falcon Alpha', model: 'DJI FlyCart 30', status: 'In-Flight', battery: 72, payload: 'Spare Parts', currentMission: 'MSN-001', totalFlights: 342, position: { x: 180, y: 80 }, zone: 'Sea Corridor A' },
  { id: 'KP-DR-02', name: 'Falcon Bravo', model: 'DJI FlyCart 30', status: 'In-Flight', battery: 58, payload: 'Safety Docs', currentMission: 'MSN-002', totalFlights: 287, position: { x: 280, y: 120 }, zone: 'Shore Link B' },
  { id: 'KP-DR-03', name: 'Heron Charlie', model: 'Wingcopter 198', status: 'Idle', battery: 95, payload: 'None', currentMission: null, totalFlights: 156, position: { x: 60, y: 190 }, zone: 'Drone Hub' },
  { id: 'KP-DR-04', name: 'Heron Delta', model: 'Wingcopter 198', status: 'Charging', battery: 34, payload: 'None', currentMission: null, totalFlights: 203, position: { x: 90, y: 200 }, zone: 'Drone Hub' },
  { id: 'KP-DR-05', name: 'Oryx Echo', model: 'Ehang 216-S', status: 'In-Flight', battery: 81, payload: 'Medical Kit', currentMission: 'MSN-003', totalFlights: 94, position: { x: 350, y: 60 }, zone: 'Vessel Approach' },
  { id: 'KP-DR-06', name: 'Oryx Foxtrot', model: 'Ehang 216-S', status: 'Idle', battery: 88, payload: 'None', currentMission: null, totalFlights: 128, position: { x: 75, y: 210 }, zone: 'Drone Hub' },
  { id: 'KP-DR-07', name: 'Shaheen Golf', model: 'DJI FlyCart 30', status: 'Maintenance', battery: 0, payload: 'None', currentMission: null, totalFlights: 411, position: { x: 110, y: 220 }, zone: 'Maintenance Bay' },
  { id: 'KP-DR-08', name: 'Shaheen Hotel', model: 'Wingcopter 198', status: 'In-Flight', battery: 45, payload: 'Navigation Charts', currentMission: 'MSN-004', totalFlights: 189, position: { x: 220, y: 45 }, zone: 'Sea Corridor A' },
];

const missions: Mission[] = [
  { id: 'MSN-001', name: 'Engine Spare Parts to MV Safeen', origin: 'Warehouse B3', destination: 'MV Safeen Prima (Berth A)', droneId: 'KP-DR-01', package: 'Hydraulic Valve Assembly', weightKg: 8.2, priority: 'High', status: 'In-Flight', eta: '4 min', distance: '2.8 km' },
  { id: 'MSN-002', name: 'Safety Docs to Shore Office', origin: 'Port Control Tower', destination: 'ADPA Shore HQ', droneId: 'KP-DR-02', package: 'Inspection Reports x12', weightKg: 1.4, priority: 'Standard', status: 'In-Flight', eta: '7 min', distance: '4.1 km' },
  { id: 'MSN-003', name: 'Medical Kit to MV Pearl Carrier', origin: 'Medical Center', destination: 'MV Pearl Carrier (Anchorage)', droneId: 'KP-DR-05', package: 'Emergency First Aid Kit', weightKg: 3.8, priority: 'Critical', status: 'In-Flight', eta: '12 min', distance: '6.5 km' },
  { id: 'MSN-004', name: 'Nav Charts to Pilot Boat', origin: 'Harbor Master', destination: 'Pilot Boat PB-03', droneId: 'KP-DR-08', package: 'Updated Channel Charts', weightKg: 0.6, priority: 'Standard', status: 'In-Flight', eta: '3 min', distance: '1.9 km' },
  { id: 'MSN-005', name: 'Crew Provisions to MV Dhow Spirit', origin: 'Crew Welfare Center', destination: 'MV Dhow Spirit (Berth C)', droneId: null, package: 'Fresh Meals x8', weightKg: 12.0, priority: 'Standard', status: 'Queued', eta: '—', distance: '3.2 km' },
  { id: 'MSN-006', name: 'Oil Sample to Lab', origin: 'MV Dhow Spirit (Berth C)', destination: 'Port Lab Facility', droneId: null, package: 'Lubricant Oil Sample', weightKg: 0.8, priority: 'High', status: 'Queued', eta: '—', distance: '2.1 km' },
  { id: 'MSN-007', name: 'Customs Seal to Gate', origin: 'Customs Office', destination: 'Gate 4 Inspection', droneId: null, package: 'Digital Customs Seals', weightKg: 0.3, priority: 'Standard', status: 'Dispatched', eta: '15 min', distance: '1.4 km' },
];

// ─────────────────────────────────────────────────────────────
// Analytics Data
// ─────────────────────────────────────────────────────────────

const deliveryTrend = [
  { month: 'Mar', success: 87, total: 94 }, { month: 'Apr', success: 91, total: 98 },
  { month: 'May', success: 103, total: 108 }, { month: 'Jun', success: 112, total: 116 },
  { month: 'Jul', success: 98, total: 105 }, { month: 'Aug', success: 124, total: 128 },
  { month: 'Sep', success: 131, total: 135 }, { month: 'Oct', success: 119, total: 124 },
  { month: 'Nov', success: 138, total: 141 }, { month: 'Dec', success: 145, total: 149 },
  { month: 'Jan', success: 152, total: 156 }, { month: 'Feb', success: 48, total: 50 },
];

const fleetUtilization = [
  { model: 'DJI FlyCart 30', hours: 186, capacity: 240 },
  { model: 'Wingcopter 198', hours: 142, capacity: 240 },
  { model: 'Ehang 216-S', hours: 98, capacity: 240 },
];

const aiInsights = [
  { severity: 'high' as const, text: 'KP-DR-07 (Shaheen Golf) grounded for 48+ hours — motor bearing replacement overdue. 411 total flights exceeds 400-flight service interval. Prioritize maintenance completion.' },
  { severity: 'medium' as const, text: 'Wind advisory: 25 kt gusts forecast for 14:00-18:00 local. Recommend grounding Wingcopter 198 fleet (max crosswind 20 kt). DJI FlyCart 30 can operate up to 30 kt.' },
  { severity: 'low' as const, text: 'Route optimization: Sea Corridor A shows 12% shorter transit vs Corridor B for Berth A deliveries. Update default routing table to save 1.4 min per flight.' },
  { severity: 'medium' as const, text: 'Battery health: KP-DR-04 charge cycle count at 847/1000. Schedule battery replacement within 2 weeks to avoid unplanned grounding.' },
];

// ─────────────────────────────────────────────────────────────
// Utility Helpers
// ─────────────────────────────────────────────────────────────

const droneStatusConfig: Record<DroneStatus, { bg: string; text: string; dot: string }> = {
  'In-Flight': { bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500' },
  Idle: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Charging: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  Maintenance: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

const missionStatusConfig: Record<MissionStatus, { bg: string; text: string }> = {
  Queued: { bg: 'bg-gray-100', text: 'text-gray-700' },
  Dispatched: { bg: 'bg-blue-100', text: 'text-blue-700' },
  'In-Flight': { bg: 'bg-violet-100', text: 'text-violet-700' },
  Delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

const priorityConfig: Record<MissionPriority, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Standard: 'bg-gray-100 text-gray-600',
};

function StatCard({ label, value, sublabel, icon }: { label: string; value: string | number; sublabel?: string; icon?: JSX.Element }) {
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
// Tab 1: Drone Fleet Dashboard
// ─────────────────────────────────────────────────────────────

function FleetDashboardTab() {
  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);
  const inFlight = drones.filter((d) => d.status === 'In-Flight').length;
  const idle = drones.filter((d) => d.status === 'Idle').length;
  const charging = drones.filter((d) => d.status === 'Charging').length;

  const droneColor = (s: DroneStatus) => {
    if (s === 'In-Flight') return '#8b5cf6';
    if (s === 'Idle') return '#22c55e';
    if (s === 'Charging') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Fleet Size" value={drones.length} sublabel="Khalifa Port drone fleet" icon={<Plane className="w-4 h-4" />} />
        <StatCard label="In-Flight" value={inFlight} sublabel={`${idle} idle, ${charging} charging`} icon={<Navigation2 className="w-4 h-4" />} />
        <StatCard label="Active Missions" value={missions.filter((m) => m.status === 'In-Flight').length} sublabel={`${missions.filter((m) => m.status === 'Queued').length} queued`} icon={<Package className="w-4 h-4" />} />
        <StatCard label="Avg Battery" value={`${Math.round(drones.filter((d) => d.battery > 0).reduce((a, d) => a + d.battery, 0) / drones.filter((d) => d.battery > 0).length)}%`} sublabel="Operational fleet" icon={<Battery className="w-4 h-4" />} />
      </div>

      {/* SVG Aerial Route Map */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Aerial Route Map — Khalifa Port Drone Network</h3>
        <svg viewBox="0 0 440 270" className="w-full h-auto bg-slate-50 rounded-lg">
          {/* Sea area */}
          <rect x="0" y="0" width="440" height="100" fill="#dbeafe" rx="4" />
          <text x="350" y="18" textAnchor="middle" className="text-[7px]" fill="#3b82f6">Arabian Gulf</text>

          {/* Vessels at sea */}
          <rect x="300" y="30" width="60" height="20" fill="#93c5fd" stroke="#60a5fa" strokeWidth="1" rx="3" />
          <text x="330" y="43" textAnchor="middle" className="text-[5px] font-medium" fill="#1e40af">MV Safeen</text>
          <rect x="160" y="20" width="50" height="18" fill="#93c5fd" stroke="#60a5fa" strokeWidth="1" rx="3" />
          <text x="185" y="32" textAnchor="middle" className="text-[5px] font-medium" fill="#1e40af">MV Pearl</text>
          <rect x="370" y="55" width="50" height="18" fill="#93c5fd" stroke="#60a5fa" strokeWidth="1" rx="3" />
          <text x="395" y="67" textAnchor="middle" className="text-[5px] font-medium" fill="#1e40af">Pilot PB-03</text>

          {/* Quay line */}
          <line x1="0" y1="100" x2="440" y2="100" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="8" y="96" className="text-[6px]" fill="#64748b">Quayside</text>

          {/* Port zones */}
          <rect x="20" y="110" width="90" height="55" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" rx="4" />
          <text x="28" y="124" className="text-[7px] font-medium" fill="#475569">Berth A</text>
          <rect x="130" y="110" width="90" height="55" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" rx="4" />
          <text x="138" y="124" className="text-[7px] font-medium" fill="#475569">Berth C</text>

          {/* Drone Hub */}
          <rect x="30" y="180" width="110" height="60" fill="#faf5ff" stroke="#c084fc" strokeWidth="1.5" rx="6" />
          <text x="85" y="196" textAnchor="middle" className="text-[7px] font-semibold" fill="#7c3aed">Drone Hub</text>
          <text x="85" y="206" textAnchor="middle" className="text-[5px]" fill="#a78bfa">Launch + Charging Pads</text>

          {/* Shore facilities */}
          <rect x="240" y="130" width="80" height="40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" rx="4" />
          <text x="280" y="148" textAnchor="middle" className="text-[6px] font-medium" fill="#475569">Warehouse B3</text>
          <text x="280" y="158" textAnchor="middle" className="text-[5px]" fill="#94a3b8">Parts Storage</text>
          <rect x="340" y="130" width="80" height="40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" rx="4" />
          <text x="380" y="148" textAnchor="middle" className="text-[6px] font-medium" fill="#475569">Shore HQ</text>
          <text x="380" y="158" textAnchor="middle" className="text-[5px]" fill="#94a3b8">ADPA Office</text>
          <rect x="240" y="190" width="80" height="40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" rx="4" />
          <text x="280" y="208" textAnchor="middle" className="text-[6px] font-medium" fill="#475569">Medical Center</text>
          <rect x="340" y="190" width="80" height="40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" rx="4" />
          <text x="380" y="208" textAnchor="middle" className="text-[6px] font-medium" fill="#475569">Port Lab</text>

          {/* Maintenance Bay */}
          <rect x="160" y="190" width="60" height="35" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" rx="4" />
          <text x="190" y="206" textAnchor="middle" className="text-[6px] font-medium" fill="#dc2626">Maint. Bay</text>

          {/* No-fly zones */}
          <rect x="240" y="105" width="180" height="20" fill="none" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 2" rx="2" />
          <text x="330" y="115" textAnchor="middle" className="text-[5px]" fill="#ef4444">No-Fly Zone — Crane Ops</text>

          {/* Drone route paths (dashed) */}
          <path d="M85,195 Q130,130 180,80" fill="none" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
          <path d="M85,195 Q200,150 280,120" fill="none" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
          <path d="M85,195 Q200,100 350,60" fill="none" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />

          {/* Drone positions */}
          {drones.map((drone) => (
            <g key={drone.id} onClick={() => setSelectedDrone(selectedDrone?.id === drone.id ? null : drone)} className="cursor-pointer">
              <circle cx={drone.position.x} cy={drone.position.y} r="10" fill="white" stroke={droneColor(drone.status)} strokeWidth="2" opacity="0.9" />
              <circle cx={drone.position.x} cy={drone.position.y} r="4" fill={droneColor(drone.status)} />
              <text x={drone.position.x} y={drone.position.y + 18} textAnchor="middle" className="text-[5px] font-medium" fill="#334155">{drone.id.split('-').slice(-1)}</text>
            </g>
          ))}

          {/* Legend */}
          <g transform="translate(340, 230)">
            {(['In-Flight', 'Idle', 'Charging', 'Maintenance'] as DroneStatus[]).map((s, i) => (
              <g key={s} transform={`translate(${i < 2 ? 0 : 50}, ${(i % 2) * 14})`}>
                <circle cx="6" cy="6" r="3.5" fill={droneColor(s)} />
                <text x="14" y="9" className="text-[5px]" fill="#475569">{s}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Drone Detail (selected) + Drone List */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Selected Drone Detail */}
        <div className="md:col-span-1 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            {selectedDrone ? selectedDrone.name : 'Select a Drone'}
          </h3>
          {selectedDrone ? (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">ID</span><span className="font-mono text-gray-700">{selectedDrone.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Model</span><span className="text-gray-700">{selectedDrone.model}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${droneStatusConfig[selectedDrone.status].bg} ${droneStatusConfig[selectedDrone.status].text}`}>{selectedDrone.status}</span>
              </div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Battery</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-100 rounded-full h-2"><div className={`h-2 rounded-full ${selectedDrone.battery > 50 ? 'bg-emerald-500' : selectedDrone.battery > 20 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${selectedDrone.battery}%` }} /></div>
                  <span className="font-medium text-gray-700">{selectedDrone.battery}%</span>
                </div>
              </div>
              <div className="flex justify-between"><span className="text-gray-500">Payload</span><span className="text-gray-700">{selectedDrone.payload}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Zone</span><span className="text-gray-700">{selectedDrone.zone}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total Flights</span><span className="font-medium text-gray-700">{selectedDrone.totalFlights}</span></div>
              {selectedDrone.currentMission && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between"><span className="text-gray-500">Mission</span><span className="font-mono text-violet-600">{selectedDrone.currentMission}</span></div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400">Click a drone on the map or list to view details.</p>
          )}
        </div>

        {/* Drone Fleet Table */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Drone</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Model</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Battery</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Payload</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500">Flights</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {drones.map((drone) => {
                  const sc = droneStatusConfig[drone.status];
                  const isSelected = selectedDrone?.id === drone.id;
                  return (
                    <tr key={drone.id} onClick={() => setSelectedDrone(isSelected ? null : drone)} className={`cursor-pointer transition-colors ${isSelected ? 'bg-violet-50' : 'hover:bg-gray-50'}`}>
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-gray-900 text-xs">{drone.name}</div>
                        <div className="text-[10px] text-gray-400">{drone.id} · {drone.zone}</div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-600">{drone.model}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {drone.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${drone.battery > 50 ? 'bg-emerald-500' : drone.battery > 20 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${drone.battery}%` }} /></div>
                          <span className="text-xs text-gray-600">{drone.battery}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-600">{drone.payload}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-600 text-right">{drone.totalFlights}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab 2: Mission Control
// ─────────────────────────────────────────────────────────────

function MissionControlTab() {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const activeMissions = missions.filter((m) => m.status === 'In-Flight');
  const queuedMissions = missions.filter((m) => m.status === 'Queued' || m.status === 'Dispatched');

  const pipelineStages: MissionStatus[] = ['Queued', 'Dispatched', 'In-Flight', 'Delivered'];

  const stageColor = (stage: MissionStatus, current: MissionStatus) => {
    const order = pipelineStages.indexOf(stage);
    const currentOrder = pipelineStages.indexOf(current);
    if (order < currentOrder) return '#22c55e';
    if (order === currentOrder) return '#8b5cf6';
    return '#e2e8f0';
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Active Missions" value={activeMissions.length} sublabel="Currently in-flight" icon={<Send className="w-4 h-4" />} />
        <StatCard label="Queue Depth" value={queuedMissions.length} sublabel="Awaiting dispatch" icon={<Clock className="w-4 h-4" />} />
        <StatCard label="Total Payload" value={`${missions.filter((m) => m.status === 'In-Flight').reduce((a, m) => a + m.weightKg, 0).toFixed(1)} kg`} sublabel="In-flight weight" icon={<Package className="w-4 h-4" />} />
        <StatCard label="Avg ETA" value="6.5 min" sublabel="Active missions" icon={<Target className="w-4 h-4" />} />
      </div>

      {/* Mission Cards */}
      <div className="grid gap-4">
        {missions.map((msn) => {
          const ms = missionStatusConfig[msn.status];
          const isSelected = selectedMission?.id === msn.id;
          return (
            <button
              key={msn.id}
              onClick={() => setSelectedMission(isSelected ? null : msn)}
              className={`w-full text-left bg-white rounded-xl border p-4 shadow-sm transition-all ${
                isSelected ? 'border-violet-400 ring-1 ring-violet-200' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{msn.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${ms.bg} ${ms.text}`}>{msn.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {msn.origin} → {msn.destination} · {msn.distance}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityConfig[msn.priority]}`}>{msn.priority}</span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Package className="w-3 h-3" />{msn.package} ({msn.weightKg} kg)</span>
                {msn.droneId && <span className="flex items-center gap-1"><Plane className="w-3 h-3" />{msn.droneId}</span>}
                {msn.eta !== '—' && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />ETA: {msn.eta}</span>}
              </div>

              {/* Expanded: Mission Pipeline */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Mission Pipeline</h4>
                  <svg viewBox="0 0 440 55" className="w-full h-14 mb-2">
                    {pipelineStages.map((stage, i) => {
                      const sx = i * 110 + 10;
                      const fill = stageColor(stage, msn.status);
                      const textFill = fill === '#e2e8f0' ? '#94a3b8' : '#ffffff';
                      return (
                        <g key={stage}>
                          {i > 0 && <line x1={sx - 12} y1="22" x2={sx} y2="22" stroke="#cbd5e1" strokeWidth="2" />}
                          <rect x={sx} y="6" width={95} height="32" rx="6" fill={fill} />
                          <text x={sx + 47} y="26" textAnchor="middle" className="text-[8px] font-medium" fill={textFill}>{stage}</text>
                        </g>
                      );
                    })}
                  </svg>
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                    <div className="flex justify-between"><span className="text-gray-500">Package</span><span className="text-gray-700">{msn.package}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Weight</span><span className="text-gray-700">{msn.weightKg} kg</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Drone</span><span className="font-mono text-violet-600">{msn.droneId || 'Unassigned'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Distance</span><span className="text-gray-700">{msn.distance}</span></div>
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
// Tab 3: Analytics & Safety
// ─────────────────────────────────────────────────────────────

function AnalyticsTab() {
  const totalDeliveries = deliveryTrend.reduce((a, d) => a + d.total, 0);
  const successDeliveries = deliveryTrend.reduce((a, d) => a + d.success, 0);
  const successRate = Math.round((successDeliveries / totalDeliveries) * 100);
  const maxTotal = Math.max(...deliveryTrend.map((d) => d.total));
  const maxHours = Math.max(...fleetUtilization.map((d) => d.capacity));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Delivery Success Rate" value={`${successRate}%`} sublabel={`${successDeliveries}/${totalDeliveries} deliveries`} icon={<CheckCircle className="w-4 h-4" />} />
        <StatCard label="No-Fly Compliance" value="100%" sublabel="Zero violations YTD" icon={<Eye className="w-4 h-4" />} />
        <StatCard label="Avg Flight Time" value="8.2 min" sublabel="Per delivery mission" icon={<Activity className="w-4 h-4" />} />
        <StatCard label="Wind Groundings" value={3} sublabel="Last 30 days" icon={<Wind className="w-4 h-4" />} />
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Delivery Success Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Delivery Volume & Success (12-Month)</h3>
          <svg viewBox="0 0 300 150" className="w-full h-auto">
            {/* Grid lines */}
            {[0, 50, 100, 150].map((v) => {
              const y = 130 - (v / maxTotal) * 110;
              return (
                <g key={v}>
                  <line x1="30" y1={y} x2="290" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                  <text x="24" y={y + 3} textAnchor="end" className="text-[6px]" fill="#94a3b8">{v}</text>
                </g>
              );
            })}
            {/* Success bars */}
            {deliveryTrend.map((d, i) => {
              const x = 38 + i * 21;
              const barH = (d.success / maxTotal) * 110;
              const totalH = (d.total / maxTotal) * 110;
              return (
                <g key={d.month}>
                  <rect x={x - 4} y={130 - totalH} width={9} height={totalH} rx="1.5" fill="#e2e8f0" />
                  <rect x={x - 4} y={130 - barH} width={9} height={barH} rx="1.5" fill="#8b5cf6" />
                  <text x={x} y="143" textAnchor="middle" className="text-[6px]" fill="#94a3b8">{d.month}</text>
                </g>
              );
            })}
            {/* Legend */}
            <circle cx="200" cy="8" r="3" fill="#8b5cf6" />
            <text x="207" y="11" className="text-[6px]" fill="#475569">Success</text>
            <circle cx="245" cy="8" r="3" fill="#e2e8f0" />
            <text x="252" y="11" className="text-[6px]" fill="#475569">Total</text>
          </svg>
        </div>

        {/* Fleet Utilization */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Fleet Utilization (Monthly Hours)</h3>
          <svg viewBox="0 0 280 120" className="w-full h-auto">
            {fleetUtilization.map((d, i) => {
              const barW = (d.hours / maxHours) * 170;
              const capW = (d.capacity / maxHours) * 170;
              const y = i * 35 + 10;
              const pct = Math.round((d.hours / d.capacity) * 100);
              return (
                <g key={d.model}>
                  <text x="0" y={y + 12} className="text-[7px]" fill="#475569">{d.model}</text>
                  <rect x="90" y={y + 2} width={capW} height={16} rx="3" fill="#f1f5f9" />
                  <rect x="90" y={y + 2} width={barW} height={16} rx="3" fill={pct > 70 ? '#8b5cf6' : pct > 40 ? '#a78bfa' : '#c4b5fd'} />
                  <text x={90 + capW + 6} y={y + 14} className="text-[7px] font-medium" fill="#334155">{d.hours}h ({pct}%)</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <h3 className="text-sm font-semibold text-gray-900">AI Safety & Optimization Insights</h3>
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

const tabs: { id: TabId; label: string; icon: JSX.Element }[] = [
  { id: 'fleet-dashboard', label: 'Drone Fleet', icon: <Plane className="w-3.5 h-3.5" /> },
  { id: 'mission-control', label: 'Mission Control', icon: <MapPin className="w-3.5 h-3.5" /> },
  { id: 'analytics', label: 'Analytics & Safety', icon: <BarChart3 className="w-3.5 h-3.5" /> },
];

export default function SkyLink() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('fleet-dashboard');

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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-sm">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sky-Link Logistics</h1>
                <p className="text-xs text-gray-500">Autonomous Drone Ship-Shore Delivery Network — Khalifa Port</p>
              </div>
            </div>
            <a
              href="https://github.com/tmeren"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> GitHub
            </a>
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
        {activeTab === 'fleet-dashboard' && <FleetDashboardTab />}
        {activeTab === 'mission-control' && <MissionControlTab />}
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
            {['Drone Logistics', 'Ship-Shore Delivery', 'Autonomous Navigation', 'Fleet Management', 'No-Fly Zone Compliance'].map(
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
