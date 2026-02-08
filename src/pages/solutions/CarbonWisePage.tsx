import { useState, useMemo } from 'react'
import {
  Leaf,
  Ship,
  Fuel,
  Gauge,
  TrendingDown,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Info,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Anchor,
  FileText,
  Zap,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// EU ETS Engine (ported from Carbon-Wise standalone)
// ---------------------------------------------------------------------------

const EMISSION_FACTORS = { HFO: 3.714, MGO: 3.886, VLSFO: 3.791, LNG: 2.75 } as const
type FuelType = keyof typeof EMISSION_FACTORS

function determineRegulationScope(fromEu: boolean, toEu: boolean): number {
  if (fromEu && toEu) return 1.0
  if (!fromEu && !toEu) return 0.0
  return 0.5
}

function calculateFuelAtSpeed(baseSpeed: number, newSpeed: number, baseFuel: number): number {
  return baseFuel * Math.pow(newSpeed / baseSpeed, 3)
}

function calculateEmissions(fuelMt: number, factor: number): number {
  return fuelMt * factor * 1000 // kg CO2e
}

function calculateHybridAllocation(
  totalEmissions: number,
  totalCbm: number,
  totalWeight: number,
  itemCbm: number,
  itemWeight: number
) {
  const wf = (itemWeight / totalWeight) * 0.5
  const vf = (itemCbm / totalCbm) * 0.5
  const score = wf + vf
  return { weightFactor: wf, volumeFactor: vf, allocationScore: score, allocatedCo2Kg: totalEmissions * score }
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

interface Voyage {
  id: string
  vessel: string
  fromPort: string
  toPort: string
  fromPortIsEu: boolean
  toPortIsEu: boolean
  distanceNm: number
  baseSpeed: number
  fuelType: FuelType
  baseFuelMt: number
  departureDate: string
  arrivalDate: string
  status: 'completed' | 'in-transit' | 'scheduled'
  cargoItems: CargoItem[]
}

interface CargoItem {
  description: string
  weightMt: number
  cbm: number
}

const mockVoyages: Voyage[] = [
  {
    id: 'VY-2026-001',
    vessel: 'MV Al Mirfa',
    fromPort: 'Khalifa Port, Abu Dhabi',
    toPort: 'Rotterdam, Netherlands',
    fromPortIsEu: false,
    toPortIsEu: true,
    distanceNm: 6200,
    baseSpeed: 14.5,
    fuelType: 'VLSFO',
    baseFuelMt: 980,
    departureDate: '2026-01-15',
    arrivalDate: '2026-02-02',
    status: 'completed',
    cargoItems: [
      { description: 'Container Lot A (Mixed)', weightMt: 4200, cbm: 12600 },
      { description: 'RoRo Vehicles (120 units)', weightMt: 280, cbm: 1920 },
      { description: 'Project Cargo (Generator Sets)', weightMt: 320, cbm: 480 },
    ],
  },
  {
    id: 'VY-2026-002',
    vessel: 'MV Saadiyat',
    fromPort: 'Jebel Ali, Dubai',
    toPort: 'Hamburg, Germany',
    fromPortIsEu: false,
    toPortIsEu: true,
    distanceNm: 6450,
    baseSpeed: 13.8,
    fuelType: 'VLSFO',
    baseFuelMt: 1040,
    departureDate: '2026-01-22',
    arrivalDate: '2026-02-10',
    status: 'in-transit',
    cargoItems: [
      { description: 'Steel Coils', weightMt: 3800, cbm: 1900 },
      { description: 'Aluminium Ingots', weightMt: 2100, cbm: 1050 },
      { description: 'Industrial Equipment', weightMt: 580, cbm: 870 },
    ],
  },
  {
    id: 'VY-2026-003',
    vessel: 'MV Yas Island',
    fromPort: 'Piraeus, Greece',
    toPort: 'Valencia, Spain',
    fromPortIsEu: true,
    toPortIsEu: true,
    distanceNm: 1580,
    baseSpeed: 12.0,
    fuelType: 'MGO',
    baseFuelMt: 210,
    departureDate: '2026-02-05',
    arrivalDate: '2026-02-10',
    status: 'scheduled',
    cargoItems: [
      { description: 'Container Lot B', weightMt: 2400, cbm: 7200 },
      { description: 'Reefer Containers (40)', weightMt: 800, cbm: 2400 },
    ],
  },
  {
    id: 'VY-2026-004',
    vessel: 'MV Al Mirfa',
    fromPort: 'Rotterdam, Netherlands',
    toPort: 'Khalifa Port, Abu Dhabi',
    fromPortIsEu: true,
    toPortIsEu: false,
    distanceNm: 6200,
    baseSpeed: 14.5,
    fuelType: 'VLSFO',
    baseFuelMt: 960,
    departureDate: '2026-02-12',
    arrivalDate: '2026-03-01',
    status: 'scheduled',
    cargoItems: [
      { description: 'Automotive Parts', weightMt: 1800, cbm: 5400 },
      { description: 'Machinery', weightMt: 1200, cbm: 1800 },
    ],
  },
]

// EUA wallet mock
const mockEuaWallet = {
  totalTokens: 45000,
  allocatedTokens: 18200,
  availableTokens: 26800,
  avgCostPerToken: 68.5,
  batches: [
    { id: 1, date: '2025-09-15', quantity: 15000, unitCost: 62.3, remaining: 6800 },
    { id: 2, date: '2025-11-20', quantity: 20000, unitCost: 71.2, remaining: 20000 },
    { id: 3, date: '2026-01-08', quantity: 10000, unitCost: 74.8, remaining: 10000 },
  ],
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function KpiCard({ label, value, unit, trend, icon: Icon, color = 'text-ad-red' }: {
  label: string
  value: string
  unit?: string
  trend?: { value: string, positive: boolean }
  icon: typeof Leaf
  color?: string
}) {
  return (
    <div className="bg-ad-white border border-border rounded-xl p-5 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-surface-secondary flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend.positive ? 'text-success' : 'text-critical'}`}>
            {trend.positive ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
            {trend.value}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-text-primary font-serif">{value}</div>
      <div className="flex items-baseline gap-1">
        {unit && <span className="text-xs text-text-muted">{unit}</span>}
        <span className="text-xs text-text-secondary">{label}</span>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Voyage['status'] }) {
  const config = {
    completed: { bg: 'bg-success/10', text: 'text-success', label: 'Completed' },
    'in-transit': { bg: 'bg-info/10', text: 'text-info', label: 'In Transit' },
    scheduled: { bg: 'bg-warning/10', text: 'text-warning', label: 'Scheduled' },
  }[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

function SpeedSimulator({ voyage }: { voyage: Voyage }) {
  const [speed, setSpeed] = useState(voyage.baseSpeed)
  const fuel = calculateFuelAtSpeed(voyage.baseSpeed, speed, voyage.baseFuelMt)
  const emissions = calculateEmissions(fuel, EMISSION_FACTORS[voyage.fuelType])
  const baseEmissions = calculateEmissions(voyage.baseFuelMt, EMISSION_FACTORS[voyage.fuelType])
  const scope = determineRegulationScope(voyage.fromPortIsEu, voyage.toPortIsEu)
  const euEtsEmissions = emissions * scope / 1000 // tCO2
  const baseEuEts = baseEmissions * scope / 1000
  const saving = baseEuEts - euEtsEmissions
  const durationHours = voyage.distanceNm / speed
  const baseDuration = voyage.distanceNm / voyage.baseSpeed
  const timeDelta = durationHours - baseDuration

  const minSpeed = Math.max(voyage.baseSpeed * 0.6, 6)
  const maxSpeed = Math.min(voyage.baseSpeed * 1.15, 22)

  return (
    <div className="bg-ad-white border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Gauge size={16} className="text-ad-red" />
        Speed vs. Emissions Simulator
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-text-secondary mb-1">
            <span>Speed: {speed.toFixed(1)} kn</span>
            <span>Base: {voyage.baseSpeed} kn</span>
          </div>
          <input
            type="range"
            min={minSpeed}
            max={maxSpeed}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full h-2 bg-surface-secondary rounded-lg appearance-none cursor-pointer accent-ad-red"
          />
          <div className="flex justify-between text-[10px] text-text-muted mt-1">
            <span>{minSpeed.toFixed(1)} kn</span>
            <span>{maxSpeed.toFixed(1)} kn</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface rounded-lg p-3">
            <div className="text-[10px] text-text-muted uppercase tracking-wide mb-1">Fuel Consumption</div>
            <div className="text-lg font-bold text-text-primary">{fuel.toFixed(0)} <span className="text-xs font-normal">MT</span></div>
            <div className={`text-[10px] font-medium ${fuel < voyage.baseFuelMt ? 'text-success' : 'text-critical'}`}>
              {fuel < voyage.baseFuelMt ? '↓' : '↑'} {Math.abs(((fuel - voyage.baseFuelMt) / voyage.baseFuelMt) * 100).toFixed(1)}% vs base
            </div>
          </div>
          <div className="bg-surface rounded-lg p-3">
            <div className="text-[10px] text-text-muted uppercase tracking-wide mb-1">EU ETS Exposure</div>
            <div className="text-lg font-bold text-text-primary">{euEtsEmissions.toFixed(0)} <span className="text-xs font-normal">tCO2</span></div>
            <div className={`text-[10px] font-medium ${saving > 0 ? 'text-success' : 'text-critical'}`}>
              {saving > 0 ? '↓' : '↑'} {Math.abs(saving).toFixed(0)} tCO2 vs base
            </div>
          </div>
          <div className="bg-surface rounded-lg p-3">
            <div className="text-[10px] text-text-muted uppercase tracking-wide mb-1">EUA Cost Impact</div>
            <div className="text-lg font-bold text-text-primary">€{(saving * mockEuaWallet.avgCostPerToken).toFixed(0)}</div>
            <div className={`text-[10px] font-medium ${saving > 0 ? 'text-success' : 'text-critical'}`}>
              {saving > 0 ? 'Savings' : 'Extra cost'} at €{mockEuaWallet.avgCostPerToken}/tCO2
            </div>
          </div>
          <div className="bg-surface rounded-lg p-3">
            <div className="text-[10px] text-text-muted uppercase tracking-wide mb-1">Time Impact</div>
            <div className="text-lg font-bold text-text-primary">{timeDelta > 0 ? '+' : ''}{timeDelta.toFixed(1)} <span className="text-xs font-normal">hrs</span></div>
            <div className="text-[10px] text-text-muted">
              {(durationHours / 24).toFixed(1)} days total voyage
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSpeed(voyage.baseSpeed * 0.9)}
            className="flex-1 text-xs font-medium bg-success/10 text-success py-2 rounded-lg hover:bg-success/20 transition-colors"
          >
            JIT (-10%) → {(voyage.baseSpeed * 0.9).toFixed(1)} kn
          </button>
          <button
            onClick={() => setSpeed(voyage.baseSpeed * 0.8)}
            className="flex-1 text-xs font-medium bg-ad-red/10 text-ad-red py-2 rounded-lg hover:bg-ad-red/20 transition-colors"
          >
            Max Save (-20%) → {(voyage.baseSpeed * 0.8).toFixed(1)} kn
          </button>
          <button
            onClick={() => setSpeed(voyage.baseSpeed)}
            className="flex-1 text-xs font-medium bg-surface-secondary text-text-secondary py-2 rounded-lg hover:bg-border transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

function AllocationBreakdown({ voyage }: { voyage: Voyage }) {
  const scope = determineRegulationScope(voyage.fromPortIsEu, voyage.toPortIsEu)
  const totalEmissions = calculateEmissions(voyage.baseFuelMt, EMISSION_FACTORS[voyage.fuelType])
  const euEtsEmissions = totalEmissions * scope
  const totalWeight = voyage.cargoItems.reduce((s, c) => s + c.weightMt, 0)
  const totalCbm = voyage.cargoItems.reduce((s, c) => s + c.cbm, 0)

  const allocations = voyage.cargoItems.map((item) => {
    const result = calculateHybridAllocation(euEtsEmissions, totalCbm, totalWeight, item.cbm, item.weightMt)
    return { ...item, ...result }
  })

  return (
    <div className="bg-ad-white border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-1 flex items-center gap-2">
        <BarChart3 size={16} className="text-ad-red" />
        Carbon Allocation (50/50 Hybrid Method)
      </h3>
      <p className="text-xs text-text-muted mb-4">
        Scope: {(scope * 100).toFixed(0)}% | Total Leg: {(euEtsEmissions / 1000).toFixed(1)} tCO2e
      </p>
      <div className="space-y-3">
        {allocations.map((a, i) => (
          <div key={i} className="bg-surface rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-text-primary">{a.description}</span>
              <span className="text-xs font-bold text-ad-red">{(a.allocatedCo2Kg / 1000).toFixed(1)} tCO2</span>
            </div>
            <div className="h-2 bg-surface-secondary rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-ad-red rounded-full transition-all"
                style={{ width: `${a.allocationScore * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>Weight: {a.weightMt.toLocaleString()} MT ({(a.weightFactor * 200).toFixed(1)}%)</span>
              <span>Volume: {a.cbm.toLocaleString()} CBM ({(a.volumeFactor * 200).toFixed(1)}%)</span>
              <span>Score: {(a.allocationScore * 100).toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EuaWalletPanel() {
  const usedPct = (mockEuaWallet.allocatedTokens / mockEuaWallet.totalTokens) * 100
  return (
    <div className="bg-ad-white border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
        <DollarSign size={16} className="text-ad-red" />
        EUA Token Wallet
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-text-secondary">Utilization</span>
            <span className="font-medium text-text-primary">{usedPct.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-surface-secondary rounded-full overflow-hidden">
            <div className="h-full bg-ad-red rounded-full" style={{ width: `${usedPct}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-text-primary">{(mockEuaWallet.totalTokens / 1000).toFixed(0)}k</div>
            <div className="text-[10px] text-text-muted">Total Tokens</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-ad-red">{(mockEuaWallet.allocatedTokens / 1000).toFixed(1)}k</div>
            <div className="text-[10px] text-text-muted">Allocated</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">{(mockEuaWallet.availableTokens / 1000).toFixed(1)}k</div>
            <div className="text-[10px] text-text-muted">Available</div>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-medium text-text-secondary mb-2">FIFO Inventory Batches</h4>
          <div className="space-y-2">
            {mockEuaWallet.batches.map((b) => (
              <div key={b.id} className="flex items-center justify-between bg-surface rounded-lg px-3 py-2">
                <div>
                  <div className="text-xs font-medium text-text-primary">Batch #{b.id}</div>
                  <div className="text-[10px] text-text-muted">{b.date} | €{b.unitCost}/t</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-text-primary">{b.remaining.toLocaleString()}</div>
                  <div className="text-[10px] text-text-muted">of {b.quantity.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface rounded-lg p-3 flex items-center gap-2">
          <Info size={14} className="text-info shrink-0" />
          <span className="text-[10px] text-text-secondary">
            Weighted avg cost: <strong>€{mockEuaWallet.avgCostPerToken}/tCO2</strong> | Total portfolio value: <strong>€{((mockEuaWallet.availableTokens * mockEuaWallet.avgCostPerToken) / 1000000).toFixed(2)}M</strong>
          </span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

type Tab = 'dashboard' | 'simulator' | 'wallet' | 'audit'

export default function CarbonWisePage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [selectedVoyage, setSelectedVoyage] = useState<Voyage>(mockVoyages[0])

  // Fleet-wide KPI calculations
  const fleetStats = useMemo(() => {
    let totalFuel = 0
    let totalEmissions = 0
    let totalEuEts = 0
    for (const v of mockVoyages) {
      totalFuel += v.baseFuelMt
      const em = calculateEmissions(v.baseFuelMt, EMISSION_FACTORS[v.fuelType])
      totalEmissions += em
      totalEuEts += em * determineRegulationScope(v.fromPortIsEu, v.toPortIsEu)
    }
    return {
      totalFuel,
      totalEmissions: totalEmissions / 1000, // tCO2
      totalEuEts: totalEuEts / 1000,
      voyageCount: mockVoyages.length,
      euaCost: (totalEuEts / 1000) * mockEuaWallet.avgCostPerToken,
    }
  }, [])

  const tabs: { id: Tab; label: string; icon: typeof Leaf }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'simulator', label: 'Speed Simulator', icon: Gauge },
    { id: 'wallet', label: 'EUA Wallet', icon: DollarSign },
    { id: 'audit', label: 'Audit Trail', icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Leaf size={22} className="text-success" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary font-serif">CarbonWise</h1>
              <p className="text-xs text-text-secondary">EU ETS Carbon Allocation & Speed Optimisation Engine</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-success bg-success/5 px-3 py-1.5 rounded-full border border-success/20">
            <CheckCircle2 size={12} /> EU ETS 2024 Compliant
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-info bg-info/5 px-3 py-1.5 rounded-full border border-info/20">
            <Zap size={12} /> FIFO Accounting
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-surface-secondary rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
              activeTab === tab.id
                ? 'bg-ad-white text-text-primary shadow-card'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <tab.icon size={16} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Fleet Emissions"
          value={fleetStats.totalEmissions.toFixed(0)}
          unit="tCO2e"
          icon={Leaf}
          color="text-success"
          trend={{ value: '-8.3% YoY', positive: true }}
        />
        <KpiCard
          label="EU ETS Exposure"
          value={fleetStats.totalEuEts.toFixed(0)}
          unit="tCO2"
          icon={AlertTriangle}
          color="text-warning"
          trend={{ value: '-12.1% QoQ', positive: true }}
        />
        <KpiCard
          label="EUA Cost Exposure"
          value={`€${(fleetStats.euaCost / 1000).toFixed(0)}k`}
          icon={DollarSign}
          color="text-ad-red"
        />
        <KpiCard
          label="Fleet Fuel Consumption"
          value={fleetStats.totalFuel.toLocaleString()}
          unit="MT"
          icon={Fuel}
          color="text-info"
          trend={{ value: '-5.7% YoY', positive: true }}
        />
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Voyage Table */}
          <div className="bg-ad-white border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Ship size={16} className="text-ad-red" />
                Voyage Register
              </h2>
              <span className="text-xs text-text-muted">{mockVoyages.length} voyages</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface text-text-secondary text-xs uppercase tracking-wide">
                    <th className="text-left px-5 py-3 font-medium">Voyage</th>
                    <th className="text-left px-5 py-3 font-medium">Route</th>
                    <th className="text-left px-5 py-3 font-medium">Scope</th>
                    <th className="text-left px-5 py-3 font-medium">Fuel</th>
                    <th className="text-left px-5 py-3 font-medium">EU ETS</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-left px-5 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {mockVoyages.map((v) => {
                    const scope = determineRegulationScope(v.fromPortIsEu, v.toPortIsEu)
                    const ets = calculateEmissions(v.baseFuelMt, EMISSION_FACTORS[v.fuelType]) * scope / 1000
                    return (
                      <tr
                        key={v.id}
                        className={`hover:bg-surface/50 cursor-pointer transition-colors ${selectedVoyage.id === v.id ? 'bg-ad-red/5' : ''}`}
                        onClick={() => setSelectedVoyage(v)}
                      >
                        <td className="px-5 py-3">
                          <div className="font-medium text-text-primary">{v.id}</div>
                          <div className="text-xs text-text-muted">{v.vessel}</div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="text-xs text-text-primary">{v.fromPort.split(',')[0]}</div>
                          <div className="text-[10px] text-text-muted flex items-center gap-1">
                            <ArrowRight size={10} /> {v.toPort.split(',')[0]}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            scope === 1 ? 'bg-critical/10 text-critical' : scope === 0.5 ? 'bg-warning/10 text-warning' : 'bg-surface-secondary text-text-muted'
                          }`}>
                            {(scope * 100)}%
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-text-primary">{v.baseFuelMt} MT {v.fuelType}</td>
                        <td className="px-5 py-3 text-xs font-medium text-ad-red">{ets.toFixed(0)} tCO2</td>
                        <td className="px-5 py-3"><StatusBadge status={v.status} /></td>
                        <td className="px-5 py-3">
                          <button className="text-ad-red hover:text-ad-red-dark">
                            <ArrowRight size={14} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Voyage Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AllocationBreakdown voyage={selectedVoyage} />
            <SpeedSimulator voyage={selectedVoyage} />
          </div>
        </div>
      )}

      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="bg-ad-white border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Ship size={16} className="text-ad-red" />
              Select Voyage
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {mockVoyages.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVoyage(v)}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    selectedVoyage.id === v.id
                      ? 'border-ad-red bg-ad-red/5'
                      : 'border-border hover:border-ad-red/30'
                  }`}
                >
                  <div className="text-xs font-medium text-text-primary">{v.id}</div>
                  <div className="text-[10px] text-text-muted">{v.vessel}</div>
                  <div className="text-[10px] text-text-muted mt-1">
                    {v.fromPort.split(',')[0]} → {v.toPort.split(',')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpeedSimulator voyage={selectedVoyage} />
            <div className="space-y-4">
              <div className="bg-ad-white border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Anchor size={16} className="text-ad-red" />
                  Voyage Parameters
                </h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div>
                    <div className="text-text-muted">Distance</div>
                    <div className="font-medium text-text-primary">{selectedVoyage.distanceNm.toLocaleString()} NM</div>
                  </div>
                  <div>
                    <div className="text-text-muted">Base Speed</div>
                    <div className="font-medium text-text-primary">{selectedVoyage.baseSpeed} knots</div>
                  </div>
                  <div>
                    <div className="text-text-muted">Fuel Type</div>
                    <div className="font-medium text-text-primary">{selectedVoyage.fuelType}</div>
                  </div>
                  <div>
                    <div className="text-text-muted">WTW Factor</div>
                    <div className="font-medium text-text-primary">{EMISSION_FACTORS[selectedVoyage.fuelType]} tCO2/tFuel</div>
                  </div>
                  <div>
                    <div className="text-text-muted">Regulation Scope</div>
                    <div className="font-medium text-text-primary">
                      {(determineRegulationScope(selectedVoyage.fromPortIsEu, selectedVoyage.toPortIsEu) * 100)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-text-muted">Cargo Items</div>
                    <div className="font-medium text-text-primary">{selectedVoyage.cargoItems.length}</div>
                  </div>
                </div>
              </div>
              <div className="bg-ad-white border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Info size={16} className="text-info" />
                  Speed-Fuel Cubic Law (P ∝ V³)
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Propulsion power is proportional to the cube of vessel speed. A <strong>10% speed reduction</strong> yields
                  approximately <strong>27% fuel saving</strong>. CarbonWise uses this physics model to project fuel consumption,
                  CO2 emissions, and EU ETS cost impacts at any given speed, enabling JIT (Just-In-Time) arrival planning.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EuaWalletPanel />
          <div className="space-y-4">
            <div className="bg-ad-white border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-ad-red" />
                EUA Price Trend (Mock)
              </h3>
              <div className="space-y-2">
                {[
                  { month: 'Sep 2025', price: 62.3, change: null },
                  { month: 'Oct 2025', price: 65.1, change: '+4.5%' },
                  { month: 'Nov 2025', price: 71.2, change: '+9.4%' },
                  { month: 'Dec 2025', price: 69.8, change: '-2.0%' },
                  { month: 'Jan 2026', price: 74.8, change: '+7.2%' },
                  { month: 'Feb 2026', price: 72.1, change: '-3.6%' },
                ].map((d, i) => (
                  <div key={i} className="flex items-center justify-between bg-surface rounded-lg px-3 py-2">
                    <span className="text-xs text-text-secondary">{d.month}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-text-primary">€{d.price}</span>
                      {d.change && (
                        <span className={`text-[10px] font-medium ${d.change.startsWith('+') ? 'text-critical' : 'text-success'}`}>
                          {d.change}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-ad-white border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Info size={16} className="text-info" />
                FIFO Accounting Method
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                CarbonWise uses <strong>FIFO (First-In, First-Out)</strong> allocation for EUA tokens. When voyages consume
                allowances, the oldest (cheapest) batches are used first. This ensures CFO-auditable cost basis tracking and
                accurate P&L attribution per voyage.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-ad-white border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <FileText size={16} className="text-ad-red" />
              Invoice Audit Reconciliation
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-surface rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-text-primary font-serif">24</div>
                <div className="text-[10px] text-text-muted">Total Invoices</div>
              </div>
              <div className="bg-success/5 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-success font-serif">19</div>
                <div className="text-[10px] text-text-muted">Matched</div>
              </div>
              <div className="bg-warning/5 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-warning font-serif">3</div>
                <div className="text-[10px] text-text-muted">Variance</div>
              </div>
              <div className="bg-critical/5 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-critical font-serif">2</div>
                <div className="text-[10px] text-text-muted">Disputed</div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { id: 'INV-2026-001', voyage: 'VY-2026-001', amount: '€67,340', status: 'matched' as const },
                { id: 'INV-2026-002', voyage: 'VY-2026-001', amount: '€12,450', status: 'matched' as const },
                { id: 'INV-2026-003', voyage: 'VY-2026-002', amount: '€71,180', status: 'variance' as const },
                { id: 'INV-2026-004', voyage: 'VY-2026-002', amount: '€8,920', status: 'disputed' as const },
                { id: 'INV-2026-005', voyage: 'VY-2026-003', amount: '€15,660', status: 'matched' as const },
              ].map((inv) => (
                <div key={inv.id} className="flex items-center justify-between bg-surface rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FileText size={14} className="text-text-muted" />
                    <div>
                      <div className="text-xs font-medium text-text-primary">{inv.id}</div>
                      <div className="text-[10px] text-text-muted">{inv.voyage}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-text-primary">{inv.amount}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      inv.status === 'matched' ? 'bg-success/10 text-success' :
                      inv.status === 'variance' ? 'bg-warning/10 text-warning' :
                      'bg-critical/10 text-critical'
                    }`}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-ad-white border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-success" />
              Compliance Summary
            </h2>
            <div className="space-y-3">
              {[
                { check: 'MRV Reporting (EU Regulation 2015/757)', status: 'pass' },
                { check: 'EU ETS Phase-in (40% for 2024, 70% for 2025, 100% for 2026)', status: 'pass' },
                { check: 'FuelEU Maritime GHG Intensity Target', status: 'pass' },
                { check: 'IMO CII Rating Alignment', status: 'warning' },
                { check: 'FIFO Cost Basis Audit Trail', status: 'pass' },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border-light last:border-0">
                  <span className="text-xs text-text-primary">{c.check}</span>
                  {c.status === 'pass' ? (
                    <CheckCircle2 size={16} className="text-success" />
                  ) : (
                    <AlertTriangle size={16} className="text-warning" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
