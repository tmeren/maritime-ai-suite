import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, Gavel, BarChart3, TrendingUp, Clock, DollarSign, AlertTriangle, Anchor, Users, Zap, Target, CheckCircle, XCircle, Timer, ArrowUpRight, ChevronRight, Sparkles, Activity } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type TabId = 'live-auction' | 'place-bid' | 'analytics';
type VesselClass = 'Feeder' | 'Panamax' | 'Post-Panamax' | 'ULCV';
type BidStatus = 'Won' | 'Outbid' | 'Pending';
type Urgency = 'normal' | 'closing-soon' | 'critical';

interface BerthSlot {
  id: string;
  berth: string;
  timeWindow: string;
  vesselClass: VesselClass;
  basePrice: number;
  currentBid: number;
  bidders: number;
  remainingSec: number;
  demandMultiplier: number;
}

interface BidHistoryEntry {
  id: string;
  slot: string;
  amount: number;
  timestamp: string;
  status: BidStatus;
  competitor?: string;
}

// ─────────────────────────────────────────────────────────────
// Demo Data — 8 Berth Slots
// ─────────────────────────────────────────────────────────────

const initialSlots: BerthSlot[] = [
  { id: 'bs-1', berth: 'A-01', timeWindow: '06:00–10:00', vesselClass: 'ULCV', basePrice: 48000, currentBid: 52400, bidders: 7, remainingSec: 1820, demandMultiplier: 1.35 },
  { id: 'bs-2', berth: 'A-02', timeWindow: '08:00–12:00', vesselClass: 'Post-Panamax', basePrice: 32000, currentBid: 34800, bidders: 5, remainingSec: 3540, demandMultiplier: 1.15 },
  { id: 'bs-3', berth: 'B-01', timeWindow: '10:00–14:00', vesselClass: 'Panamax', basePrice: 22000, currentBid: 23100, bidders: 3, remainingSec: 5400, demandMultiplier: 1.05 },
  { id: 'bs-4', berth: 'B-02', timeWindow: '12:00–16:00', vesselClass: 'Feeder', basePrice: 12000, currentBid: 12600, bidders: 2, remainingSec: 7200, demandMultiplier: 0.95 },
  { id: 'bs-5', berth: 'C-01', timeWindow: '14:00–18:00', vesselClass: 'Post-Panamax', basePrice: 35000, currentBid: 38500, bidders: 6, remainingSec: 900, demandMultiplier: 1.42 },
  { id: 'bs-6', berth: 'C-02', timeWindow: '16:00–20:00', vesselClass: 'ULCV', basePrice: 50000, currentBid: 56200, bidders: 8, remainingSec: 420, demandMultiplier: 1.55 },
  { id: 'bs-7', berth: 'D-01', timeWindow: '18:00–22:00', vesselClass: 'Panamax', basePrice: 24000, currentBid: 24000, bidders: 1, remainingSec: 10800, demandMultiplier: 0.88 },
  { id: 'bs-8', berth: 'D-02', timeWindow: '20:00–00:00', vesselClass: 'Feeder', basePrice: 14000, currentBid: 14700, bidders: 4, remainingSec: 8100, demandMultiplier: 1.10 },
];

const bidHistory: BidHistoryEntry[] = [
  { id: 'bh-1', slot: 'A-01 (06:00–10:00)', amount: 51200, timestamp: '2 min ago', status: 'Outbid', competitor: 'MaerskLine_EU' },
  { id: 'bh-2', slot: 'B-01 (10:00–14:00)', amount: 22800, timestamp: '8 min ago', status: 'Won' },
  { id: 'bh-3', slot: 'C-02 (16:00–20:00)', amount: 54000, timestamp: '15 min ago', status: 'Outbid', competitor: 'COSCO_Asia' },
  { id: 'bh-4', slot: 'D-01 (18:00–22:00)', amount: 24000, timestamp: '22 min ago', status: 'Pending' },
  { id: 'bh-5', slot: 'A-02 (08:00–12:00)', amount: 33500, timestamp: '31 min ago', status: 'Won' },
  { id: 'bh-6', slot: 'C-01 (14:00–18:00)', amount: 37200, timestamp: '45 min ago', status: 'Outbid', competitor: 'MSC_Global' },
  { id: 'bh-7', slot: 'B-02 (12:00–16:00)', amount: 12400, timestamp: '1h ago', status: 'Won' },
];

// ─────────────────────────────────────────────────────────────
// Supply/Demand Data (24h)
// ─────────────────────────────────────────────────────────────

const supplyDemandData = [
  { hour: 0, supply: 8, demand: 2 }, { hour: 2, supply: 8, demand: 3 },
  { hour: 4, supply: 7, demand: 5 }, { hour: 6, supply: 6, demand: 8 },
  { hour: 8, supply: 5, demand: 9 }, { hour: 10, supply: 5, demand: 7 },
  { hour: 12, supply: 6, demand: 6 }, { hour: 14, supply: 5, demand: 8 },
  { hour: 16, supply: 4, demand: 9 }, { hour: 18, supply: 5, demand: 7 },
  { hour: 20, supply: 7, demand: 4 }, { hour: 22, supply: 8, demand: 3 },
];

// ─────────────────────────────────────────────────────────────
// Analytics Data
// ─────────────────────────────────────────────────────────────

const bidSuccessByHour = [
  { hour: '00–04', rate: 82 }, { hour: '04–08', rate: 45 },
  { hour: '08–12', rate: 38 }, { hour: '12–16', rate: 55 },
  { hour: '16–20', rate: 32 }, { hour: '20–24', rate: 71 },
];

const heatmapData: number[][] = [
  [1, 1, 2, 3, 4, 5, 5, 4, 4, 5, 3, 2, 2, 3, 4, 5, 5, 4, 3, 2, 1, 1, 1, 1],
  [1, 1, 2, 3, 5, 5, 4, 4, 5, 5, 4, 3, 2, 4, 5, 5, 5, 4, 3, 2, 1, 1, 1, 1],
  [1, 2, 2, 4, 5, 5, 5, 5, 5, 4, 3, 3, 3, 4, 5, 5, 5, 5, 3, 2, 2, 1, 1, 1],
  [1, 1, 3, 4, 5, 5, 5, 4, 4, 5, 4, 3, 3, 4, 5, 5, 5, 4, 4, 3, 2, 1, 1, 1],
  [1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 4, 4, 3, 5, 5, 5, 5, 5, 4, 3, 2, 1, 1, 1],
  [1, 1, 2, 3, 4, 4, 4, 3, 3, 4, 3, 2, 2, 3, 4, 4, 4, 3, 3, 2, 1, 1, 1, 1],
  [1, 1, 1, 2, 3, 3, 3, 2, 2, 3, 2, 2, 1, 2, 3, 3, 3, 2, 2, 1, 1, 1, 1, 1],
];
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─────────────────────────────────────────────────────────────
// Utility Helpers
// ─────────────────────────────────────────────────────────────

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getUrgency(sec: number): Urgency {
  if (sec <= 600) return 'critical';
  if (sec <= 1800) return 'closing-soon';
  return 'normal';
}

const urgencyColors: Record<Urgency, string> = {
  normal: 'bg-white',
  'closing-soon': 'bg-amber-50 border-amber-300',
  critical: 'bg-red-50 border-red-300',
};

const vesselClassColors: Record<VesselClass, string> = {
  Feeder: 'bg-emerald-100 text-emerald-800',
  Panamax: 'bg-blue-100 text-blue-800',
  'Post-Panamax': 'bg-violet-100 text-violet-800',
  ULCV: 'bg-indigo-100 text-indigo-800',
};

const statusColors: Record<BidStatus, { bg: string; text: string; icon: ReactNode }> = {
  Won: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  Outbid: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle className="w-3.5 h-3.5" /> },
  Pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <Timer className="w-3.5 h-3.5" /> },
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
// Tab 1: Live Auction
// ─────────────────────────────────────────────────────────────

function LiveAuctionTab() {
  const [slots, setSlots] = useState<BerthSlot[]>(initialSlots);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlots((prev) =>
        prev.map((slot) => {
          const newRemaining = Math.max(0, slot.remainingSec - 1);
          const priceJitter = (Math.random() - 0.4) * slot.basePrice * 0.005 * slot.demandMultiplier;
          const newBid = Math.max(slot.basePrice, Math.round(slot.currentBid + priceJitter));
          const bidderChange = Math.random() > 0.95 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          return {
            ...slot,
            remainingSec: newRemaining,
            currentBid: newBid,
            bidders: Math.max(1, slot.bidders + bidderChange),
          };
        }),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const chartW = 600;
  const chartH = 180;
  const padL = 40;
  const padB = 30;
  const plotW = chartW - padL - 10;
  const plotH = chartH - padB - 10;
  const maxVal = 10;

  function toX(i: number) { return padL + (i / (supplyDemandData.length - 1)) * plotW; }
  function toY(v: number) { return 10 + plotH - (v / maxVal) * plotH; }

  const supplyPath = supplyDemandData.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d.supply)}`).join(' ');
  const demandPath = supplyDemandData.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d.demand)}`).join(' ');

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Active Slots" value={slots.filter((s) => s.remainingSec > 0).length} sublabel="open for bidding" icon={<Anchor className="w-3.5 h-3.5" />} />
        <StatCard label="Total Bidders" value={slots.reduce((s, sl) => s + sl.bidders, 0)} sublabel="across all slots" icon={<Users className="w-3.5 h-3.5" />} />
        <StatCard label="Highest Bid" value={`$${Math.max(...slots.map((s) => s.currentBid)).toLocaleString()}`} sublabel="current session" icon={<TrendingUp className="w-3.5 h-3.5" />} />
        <StatCard label="Avg Premium" value={`${Math.round((slots.reduce((s, sl) => s + (sl.currentBid - sl.basePrice) / sl.basePrice, 0) / slots.length) * 100)}%`} sublabel="over base price" icon={<DollarSign className="w-3.5 h-3.5" />} />
      </div>

      {/* Auction Board */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Gavel className="w-4 h-4 text-gray-500" /> Live Berth Auction Board
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Berth</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Time Window</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Vessel Class</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Base Price</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Current Bid</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Bidders</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Time Left</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {slots.map((slot) => {
                const urgency = getUrgency(slot.remainingSec);
                const premium = Math.round(((slot.currentBid - slot.basePrice) / slot.basePrice) * 100);
                return (
                  <tr key={slot.id} className={`${urgencyColors[urgency]} transition-colors`}>
                    <td className="px-4 py-3 font-bold text-gray-900">{slot.berth}</td>
                    <td className="px-4 py-3">{slot.timeWindow}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${vesselClassColors[slot.vesselClass]}`}>
                        {slot.vesselClass}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">${slot.basePrice.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-900">${slot.currentBid.toLocaleString()}</span>
                      {premium > 0 && (
                        <span className="ml-1.5 text-xs text-red-500 font-medium flex items-center gap-0.5 inline-flex">
                          <ArrowUpRight className="w-3 h-3" />+{premium}%
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-gray-400" /> {slot.bidders}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {slot.remainingSec <= 0 ? (
                        <span className="text-gray-400 font-medium">CLOSED</span>
                      ) : (
                        <span className={`font-mono font-bold ${urgency === 'critical' ? 'text-red-600 animate-pulse' : urgency === 'closing-soon' ? 'text-amber-600' : 'text-gray-900'}`}>
                          {formatTime(slot.remainingSec)}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supply/Demand Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-500" /> Slot Supply vs Demand (24h)
          </h3>
        </div>
        <div className="p-4">
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto">
            {/* Grid lines */}
            {[0, 2, 4, 6, 8, 10].map((v) => (
              <g key={v}>
                <line x1={padL} y1={toY(v)} x2={chartW - 10} y2={toY(v)} stroke="#e5e7eb" strokeWidth="1" />
                <text x={padL - 6} y={toY(v) + 4} textAnchor="end" className="text-[10px]" fill="#9ca3af">{v}</text>
              </g>
            ))}
            {supplyDemandData.map((d, i) => (
              <text key={i} x={toX(i)} y={chartH - 6} textAnchor="middle" className="text-[10px]" fill="#9ca3af">{`${d.hour}h`}</text>
            ))}
            {/* Supply line */}
            <path d={supplyPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {supplyDemandData.map((d, i) => (
              <circle key={`s-${i}`} cx={toX(i)} cy={toY(d.supply)} r="3" fill="#3b82f6" />
            ))}
            {/* Demand line */}
            <path d={demandPath} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6,3" />
            {supplyDemandData.map((d, i) => (
              <circle key={`d-${i}`} cx={toX(i)} cy={toY(d.demand)} r="3" fill="#ef4444" />
            ))}
            {/* Legend */}
            <circle cx={chartW - 150} cy={16} r="4" fill="#3b82f6" />
            <text x={chartW - 142} y={20} className="text-[11px]" fill="#4b5563">Supply</text>
            <circle cx={chartW - 90} cy={16} r="4" fill="#ef4444" />
            <text x={chartW - 82} y={20} className="text-[11px]" fill="#4b5563">Demand</text>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab 2: Place Bid
// ─────────────────────────────────────────────────────────────

function PlaceBidTab() {
  const [selectedSlotId, setSelectedSlotId] = useState<string>(initialSlots[0].id);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [bidSubmitted, setBidSubmitted] = useState(false);
  const bidInputRef = useRef<HTMLInputElement>(null);

  const selectedSlot = initialSlots.find((s) => s.id === selectedSlotId)!;
  const recommendedBid = Math.round(selectedSlot.basePrice * selectedSlot.demandMultiplier * 1.08);
  const bidNum = parseInt(bidAmount) || 0;

  const confidence: 'LOW' | 'MEDIUM' | 'HIGH' =
    bidNum >= recommendedBid * 1.05 ? 'HIGH' : bidNum >= recommendedBid * 0.92 ? 'MEDIUM' : 'LOW';

  const confidenceConfig = {
    LOW: { color: 'text-red-600', bg: 'bg-red-100', bar: 'bg-red-500', width: 'w-1/4', label: 'Low Win Probability', pct: 23 },
    MEDIUM: { color: 'text-amber-600', bg: 'bg-amber-100', bar: 'bg-amber-500', width: 'w-2/3', label: 'Moderate Win Probability', pct: 58 },
    HIGH: { color: 'text-emerald-600', bg: 'bg-emerald-100', bar: 'bg-emerald-500', width: 'w-11/12', label: 'High Win Probability', pct: 87 },
  };

  const conf = confidenceConfig[confidence];

  function handleSubmit() {
    if (bidNum <= 0) return;
    setBidSubmitted(true);
    setTimeout(() => setBidSubmitted(false), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bid Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b bg-gray-50">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Gavel className="w-4 h-4 text-gray-500" /> Place Your Bid
            </h3>
          </div>
          <div className="p-5 space-y-4">
            {/* Slot Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Select Berth Slot</label>
              <select
                value={selectedSlotId}
                onChange={(e) => { setSelectedSlotId(e.target.value); setBidAmount(''); setBidSubmitted(false); }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {initialSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.berth} — {slot.timeWindow} ({slot.vesselClass}) — ${slot.currentBid.toLocaleString()} current
                  </option>
                ))}
              </select>
            </div>

            {/* Slot Info */}
            <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-3 text-xs space-y-1">
              <div className="flex justify-between"><span className="text-gray-600">Base Price:</span><span className="font-bold">${selectedSlot.basePrice.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Current Bid:</span><span className="font-bold text-indigo-700">${selectedSlot.currentBid.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Demand Multiplier:</span><span className="font-bold">{selectedSlot.demandMultiplier.toFixed(2)}x</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Active Bidders:</span><span className="font-bold">{selectedSlot.bidders}</span></div>
            </div>

            {/* AI Recommended Bid */}
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-xs font-semibold text-gray-700">AI Recommended Bid</span>
              </div>
              <p className="text-lg font-bold text-indigo-700">${recommendedBid.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">Based on historical avg + {((selectedSlot.demandMultiplier - 1) * 100).toFixed(0)}% demand premium + 8% win buffer</p>
            </div>

            {/* Bid Input */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Your Bid Amount ($)</label>
              <input
                ref={bidInputRef}
                type="number"
                value={bidAmount}
                onChange={(e) => { setBidAmount(e.target.value); setBidSubmitted(false); }}
                placeholder={`e.g. ${recommendedBid}`}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Confidence Meter */}
            {bidNum > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">Bid Confidence</span>
                  <span className={`text-xs font-bold ${conf.color}`}>{confidence} — {conf.pct}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${conf.bar} ${conf.width}`} />
                </div>
                <p className={`text-xs mt-1 ${conf.color}`}>{conf.label}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={bidNum <= 0 || bidSubmitted}
              className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                bidSubmitted
                  ? 'bg-emerald-500 text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              {bidSubmitted ? (
                <span className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Bid Submitted Successfully</span>
              ) : (
                <span className="flex items-center justify-center gap-2"><Gavel className="w-4 h-4" /> Submit Bid</span>
              )}
            </button>

            {/* AI Insight */}
            {bidNum > 0 && !bidSubmitted && (
              <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-xs font-semibold text-indigo-700">AI Insight</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Based on current demand patterns, bidding <strong>${bidNum.toLocaleString()}</strong> gives you{' '}
                  <strong className={conf.color}>{conf.pct}% win probability</strong>.
                  {confidence === 'LOW' && ' Consider increasing your bid closer to the recommended price for better chances.'}
                  {confidence === 'MEDIUM' && ' You are competitive. A small increase could push you into the high-confidence range.'}
                  {confidence === 'HIGH' && ' Strong bid! You are well-positioned to win this slot.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bid History */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b bg-gray-50">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" /> Recent Bid History
            </h3>
          </div>
          <div className="divide-y">
            {bidHistory.map((entry) => {
              const st = statusColors[entry.status];
              return (
                <div key={entry.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{entry.slot}</p>
                    <p className="text-xs text-gray-500">{entry.timestamp}{entry.competitor && ` · outbid by ${entry.competitor}`}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900">${entry.amount.toLocaleString()}</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${st.bg} ${st.text}`}>
                      {st.icon} {entry.status}
                    </span>
                  </div>
                </div>
              );
            })}
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
  const barChartW = 500;
  const barChartH = 200;
  const barPadL = 60;
  const barPadB = 40;
  const barPlotW = barChartW - barPadL - 20;
  const barPlotH = barChartH - barPadB - 20;
  const barWidth = barPlotW / bidSuccessByHour.length * 0.6;
  const barGap = barPlotW / bidSuccessByHour.length;

  const heatCellW = 24;
  const heatCellH = 22;
  const heatPadL = 36;
  const heatColors = ['#f0fdf4', '#bbf7d0', '#86efac', '#4ade80', '#16a34a'];

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Avg Bid" value="$31,240" sublabel="last 30 days" icon={<DollarSign className="w-3.5 h-3.5" />} />
        <StatCard label="Win Rate" value="62%" sublabel="42 of 68 bids" icon={<Target className="w-3.5 h-3.5" />} />
        <StatCard label="Total Savings" value="$184K" sublabel="vs fixed pricing" icon={<TrendingUp className="w-3.5 h-3.5" />} />
        <StatCard label="Active Auctions" value="8" sublabel="current session" icon={<Gavel className="w-3.5 h-3.5" />} />
      </div>

      {/* Bid Success by Time of Day */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-500" /> Bid Success Rate by Time of Day
          </h3>
        </div>
        <div className="p-4">
          <svg viewBox={`0 0 ${barChartW} ${barChartH}`} className="w-full h-auto">
            {/* Y-axis grid */}
            {[0, 25, 50, 75, 100].map((v) => {
              const y = 20 + barPlotH - (v / 100) * barPlotH;
              return (
                <g key={v}>
                  <line x1={barPadL} y1={y} x2={barChartW - 20} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                  <text x={barPadL - 8} y={y + 4} textAnchor="end" className="text-[10px]" fill="#9ca3af">{v}%</text>
                </g>
              );
            })}
            {/* Bars */}
            {bidSuccessByHour.map((d, i) => {
              const x = barPadL + i * barGap + (barGap - barWidth) / 2;
              const h = (d.rate / 100) * barPlotH;
              const y = 20 + barPlotH - h;
              const color = d.rate >= 60 ? '#4f46e5' : d.rate >= 40 ? '#818cf8' : '#c7d2fe';
              return (
                <g key={i}>
                  <rect x={x} y={y} width={barWidth} height={h} rx="3" fill={color} />
                  <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="text-[10px]" fill="#4b5563" fontWeight="600">{d.rate}%</text>
                  <text x={x + barWidth / 2} y={barChartH - 10} textAnchor="middle" className="text-[10px]" fill="#9ca3af">{d.hour}</text>
                </g>
              );
            })}
          </svg>
          <p className="text-xs text-gray-500 text-center mt-2">Best win rates during off-peak hours (00:00–04:00, 20:00–24:00) when competition is lowest</p>
        </div>
      </div>

      {/* Slot Utilization Heatmap */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-500" /> Slot Utilization Heatmap (7-Day)
          </h3>
        </div>
        <div className="p-4 overflow-x-auto">
          <svg viewBox={`0 0 ${heatPadL + 24 * heatCellW + 10} ${7 * heatCellH + 40}`} className="w-full h-auto">
            {/* Hour labels */}
            {Array.from({ length: 24 }, (_, i) => (
              <text key={i} x={heatPadL + i * heatCellW + heatCellW / 2} y={12} textAnchor="middle" className="text-[9px]" fill="#9ca3af">
                {i.toString().padStart(2, '0')}
              </text>
            ))}
            {/* Day rows */}
            {heatmapData.map((row, di) => (
              <g key={di}>
                <text x={heatPadL - 6} y={22 + di * heatCellH + heatCellH / 2 + 3} textAnchor="end" className="text-[10px]" fill="#6b7280">{dayLabels[di]}</text>
                {row.map((val, hi) => (
                  <rect
                    key={hi}
                    x={heatPadL + hi * heatCellW}
                    y={18 + di * heatCellH}
                    width={heatCellW - 2}
                    height={heatCellH - 2}
                    rx="3"
                    fill={heatColors[val - 1]}
                  />
                ))}
              </g>
            ))}
            {/* Legend */}
            <text x={heatPadL} y={24 + 7 * heatCellH + 12} className="text-[10px]" fill="#6b7280">Low</text>
            {heatColors.map((c, i) => (
              <rect key={i} x={heatPadL + 30 + i * 20} y={24 + 7 * heatCellH + 2} width={16} height={12} rx="2" fill={c} />
            ))}
            <text x={heatPadL + 30 + 5 * 20 + 4} y={24 + 7 * heatCellH + 12} className="text-[10px]" fill="#6b7280">High</text>
          </svg>
          <p className="text-xs text-gray-500 text-center mt-2">Peak utilization during morning (06:00–10:00) and afternoon (14:00–18:00) windows on weekdays</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" /> AI-Generated Auction Insights
          </h3>
          <span className="text-xs text-gray-400">Powered by Slot-Bid AI Engine</span>
        </div>
        <div className="space-y-3">
          {[
            { icon: <TrendingUp className="w-4 h-4 text-emerald-500" />, title: 'Optimal Bidding Window', insight: 'Historical data shows 82% win rate during 00:00–04:00 at an average 12% discount vs peak hours. Schedule non-urgent berth requests for overnight windows to maximize savings.' },
            { icon: <AlertTriangle className="w-4 h-4 text-amber-500" />, title: 'Price Surge Alert', insight: 'ULCV berths (A-01, C-02) are showing 35-55% demand premiums — 2x the terminal average. Consider splitting cargo across two Post-Panamax slots for potential 18% cost reduction.' },
            { icon: <Target className="w-4 h-4 text-indigo-500" />, title: 'Competitor Pattern', insight: 'MaerskLine_EU consistently bids within the final 5 minutes. Counter-strategy: place bids 8-10 minutes before close at 105% of AI-recommended price to lock in position before sniping window.' },
            { icon: <DollarSign className="w-4 h-4 text-blue-500" />, title: 'Savings Opportunity', insight: 'Feeder slots (B-02, D-02) are consistently under-bid with demand multipliers below 1.1x. For short-haul cargo, these represent the best value at near-base-price rates.' },
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
        <h4 className="font-semibold text-sm mb-3">Auction Engine Pipeline</h4>
        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <span className="rounded bg-indigo-100 text-indigo-700 px-2.5 py-1 font-medium">Demand Sensing</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-blue-100 text-blue-700 px-2.5 py-1 font-medium">Price Optimization</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-violet-100 text-violet-700 px-2.5 py-1 font-medium">Bid Scoring</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-emerald-100 text-emerald-700 px-2.5 py-1 font-medium">Win Probability</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-gray-800 text-white px-2.5 py-1 font-medium">Insight Generation</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function SlotBid() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('live-auction');

  const tabs: { id: TabId; label: string; icon: ReactNode }[] = [
    { id: 'live-auction', label: 'Live Auction', icon: <Gavel className="w-4 h-4" /> },
    { id: 'place-bid', label: 'Place Bid', icon: <DollarSign className="w-4 h-4" /> },
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm">
                <Gavel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Slot-Bid AI</h1>
                <p className="text-xs text-gray-500">Dynamic Berth Slot Auction & AI Bid Optimization</p>
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
        {activeTab === 'live-auction' && <LiveAuctionTab />}
        {activeTab === 'place-bid' && <PlaceBidTab />}
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
            {['Dynamic Pricing', 'Berth Slot Auction', 'AI Bid Optimization', 'Supply/Demand Analysis', 'Maritime Logistics'].map(
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
