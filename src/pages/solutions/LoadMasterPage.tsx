import { useState, useMemo, useCallback } from 'react'
import Decimal from 'decimal.js'
import {
  Ship,
  Anchor,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Plus,
  Trash2,
  RotateCcw,
  Zap,
  Ruler,
  Layers,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Stability Engine (ported from Load-Master standalone)
// ---------------------------------------------------------------------------

interface VesselParams {
  name: string; length: Decimal; beam: Decimal; draft: Decimal; deadweight: Decimal; depth?: Decimal
}
interface DeckParams {
  id: string; deckNumber: number; name: string; length: Decimal; beam: Decimal; maxWeight: Decimal; heightAboveKeel: Decimal
}
interface PositionedCargo {
  id: string; description: string; weight: Decimal; length: Decimal; width: Decimal; height: Decimal
  positionX: Decimal; positionY: Decimal; deckId: string
}
interface DeckLoading {
  deckId: string; deckName: string; deckNumber: number; totalWeight: Decimal; maxWeight: Decimal; utilization: Decimal; overloaded: boolean
}
interface StabilityWarning {
  parameter: string; value: Decimal; threshold: Decimal; severity: 'WARNING' | 'CRITICAL'; message: string
}
type StabilityStatus = 'SAFE' | 'WARNING' | 'CRITICAL'
interface StabilityResult {
  lcg: Decimal; tcg: Decimal; vcg: Decimal; trim: Decimal; heel: Decimal
  totalWeight: Decimal; deadweightUtilization: Decimal; deckLoadings: DeckLoading[]
  warnings: StabilityWarning[]; status: StabilityStatus
}

const DEG_PER_RAD = new Decimal(180).div(Decimal.acos(-1))

function calculateLCG(items: PositionedCargo[]): Decimal {
  if (!items.length) return new Decimal(0)
  let mSum = new Decimal(0), wSum = new Decimal(0)
  for (const i of items) { mSum = mSum.plus(i.weight.times(i.positionX)); wSum = wSum.plus(i.weight) }
  return wSum.isZero() ? new Decimal(0) : mSum.div(wSum)
}
function calculateTCG(items: PositionedCargo[]): Decimal {
  if (!items.length) return new Decimal(0)
  let mSum = new Decimal(0), wSum = new Decimal(0)
  for (const i of items) { mSum = mSum.plus(i.weight.times(i.positionY)); wSum = wSum.plus(i.weight) }
  return wSum.isZero() ? new Decimal(0) : mSum.div(wSum)
}
function calculateVCG(items: PositionedCargo[], decks: DeckParams[]): Decimal {
  if (!items.length) return new Decimal(0)
  const dm = new Map(decks.map(d => [d.id, d]))
  let mSum = new Decimal(0), wSum = new Decimal(0)
  for (const i of items) {
    const d = dm.get(i.deckId); if (!d) continue
    mSum = mSum.plus(i.weight.times(d.heightAboveKeel.plus(i.height.div(2))))
    wSum = wSum.plus(i.weight)
  }
  return wSum.isZero() ? new Decimal(0) : mSum.div(wSum)
}
function calculateTrim(vessel: VesselParams, loadedWeight: Decimal, lcg: Decimal): Decimal {
  if (loadedWeight.isZero()) return new Decimal(0)
  const lever = lcg.minus(vessel.length.div(2))
  const mct = vessel.deadweight.times(vessel.length).div(10000)
  if (mct.isZero()) return new Decimal(0)
  return loadedWeight.times(lever).div(mct).div(100)
}
function calculateHeel(vessel: VesselParams, loadedWeight: Decimal, tcg: Decimal): Decimal {
  if (loadedWeight.isZero()) return new Decimal(0)
  const lever = tcg.minus(vessel.beam.div(2))
  const gm = vessel.beam.times(new Decimal('0.08'))
  if (gm.isZero()) return new Decimal(0)
  const tanH = loadedWeight.times(lever).div(vessel.deadweight.times(gm))
  return Decimal.atan(tanH).times(DEG_PER_RAD)
}

function assessStability(vessel: VesselParams, decks: DeckParams[], items: PositionedCargo[]): StabilityResult {
  let totalWeight = new Decimal(0)
  for (const i of items) totalWeight = totalWeight.plus(i.weight)
  const lcg = calculateLCG(items), tcg = calculateTCG(items), vcg = calculateVCG(items, decks)
  const trim = calculateTrim(vessel, totalWeight, lcg)
  const heel = calculateHeel(vessel, totalWeight, tcg)
  const deckLoadings: DeckLoading[] = decks.map(d => {
    let tw = new Decimal(0)
    for (const i of items) if (i.deckId === d.id) tw = tw.plus(i.weight)
    const util = d.maxWeight.isZero() ? new Decimal(0) : tw.div(d.maxWeight).times(100)
    return { deckId: d.id, deckName: d.name, deckNumber: d.deckNumber, totalWeight: tw, maxWeight: d.maxWeight, utilization: util, overloaded: tw.greaterThan(d.maxWeight) }
  })
  const dwUtil = vessel.deadweight.isZero() ? new Decimal(0) : totalWeight.div(vessel.deadweight).times(100)
  const warnings: StabilityWarning[] = []
  const at = trim.abs()
  if (at.greaterThan(2)) warnings.push({ parameter: 'trim', value: trim, threshold: new Decimal(2), severity: 'CRITICAL', message: `Trim ${trim.toFixed(2)}m exceeds 2.0m` })
  else if (at.greaterThan(1)) warnings.push({ parameter: 'trim', value: trim, threshold: new Decimal(1), severity: 'WARNING', message: `Trim ${trim.toFixed(2)}m exceeds 1.0m` })
  const ah = heel.abs()
  if (ah.greaterThan(5)) warnings.push({ parameter: 'heel', value: heel, threshold: new Decimal(5), severity: 'CRITICAL', message: `Heel ${heel.toFixed(2)}° exceeds 5.0°` })
  else if (ah.greaterThan(2)) warnings.push({ parameter: 'heel', value: heel, threshold: new Decimal(2), severity: 'WARNING', message: `Heel ${heel.toFixed(2)}° exceeds 2.0°` })
  for (const dl of deckLoadings) {
    if (dl.utilization.greaterThan(100)) warnings.push({ parameter: `deck_${dl.deckNumber}`, value: dl.utilization, threshold: new Decimal(100), severity: 'CRITICAL', message: `Deck ${dl.deckNumber} overloaded at ${dl.utilization.toFixed(1)}%` })
    else if (dl.utilization.greaterThan(85)) warnings.push({ parameter: `deck_${dl.deckNumber}`, value: dl.utilization, threshold: new Decimal(85), severity: 'WARNING', message: `Deck ${dl.deckNumber} at ${dl.utilization.toFixed(1)}%` })
  }
  if (dwUtil.greaterThan(100)) warnings.push({ parameter: 'dwt', value: dwUtil, threshold: new Decimal(100), severity: 'CRITICAL', message: `Overloaded at ${dwUtil.toFixed(1)}%` })
  else if (dwUtil.greaterThan(90)) warnings.push({ parameter: 'dwt', value: dwUtil, threshold: new Decimal(90), severity: 'WARNING', message: `DWT at ${dwUtil.toFixed(1)}%` })
  let status: StabilityStatus = 'SAFE'
  for (const w of warnings) { if (w.severity === 'CRITICAL') { status = 'CRITICAL'; break } if (w.severity === 'WARNING') status = 'WARNING' }
  return { lcg, tcg, vcg, trim, heel, totalWeight, deadweightUtilization: dwUtil, deckLoadings, warnings, status }
}

// ---------------------------------------------------------------------------
// Seed Data
// ---------------------------------------------------------------------------

type CargoType = 'CAR' | 'TRUCK' | 'TRAILER' | 'BREAKBULK'

interface VesselData { id: string; name: string; imo: string; type: string; length: number; beam: number; draft: number; deadweight: number; deckCount: number }
interface DeckData { id: string; vesselId: string; deckNumber: number; name: string; length: number; beam: number; maxWeight: number; heightAboveKeel: number; heightClearance: number; hoistable: boolean }
interface CargoItemData { id: string; type: CargoType; description: string; length: number; width: number; height: number; weight: number; hazmat: string | null }

const vessels: VesselData[] = [
  { id: 'v-almirfa', name: 'MV Al Mirfa', imo: '9876543', type: 'PCTC', length: 199.9, beam: 32.26, draft: 9.2, deadweight: 12500, deckCount: 5 },
  { id: 'v-saadiyat', name: 'MV Saadiyat', imo: '9812345', type: 'RoRo', length: 180, beam: 30.5, draft: 8.5, deadweight: 10200, deckCount: 4 },
  { id: 'v-yas', name: 'MV Yas Island', imo: '9834567', type: 'ConRo', length: 210, beam: 32.2, draft: 9.8, deadweight: 14800, deckCount: 3 },
]

const allDecks: DeckData[] = [
  { id: 'da1', vesselId: 'v-almirfa', deckNumber: 1, name: 'Tank Top', length: 180, beam: 30, maxWeight: 4500, heightAboveKeel: 2, heightClearance: 5.1, hoistable: false },
  { id: 'da2', vesselId: 'v-almirfa', deckNumber: 2, name: 'Main Car Deck', length: 185, beam: 31, maxWeight: 3200, heightAboveKeel: 7.1, heightClearance: 2.1, hoistable: false },
  { id: 'da3', vesselId: 'v-almirfa', deckNumber: 3, name: 'Upper Deck 1', length: 170, beam: 30, maxWeight: 2800, heightAboveKeel: 9.2, heightClearance: 2, hoistable: true },
  { id: 'da4', vesselId: 'v-almirfa', deckNumber: 4, name: 'Upper Deck 2', length: 160, beam: 28, maxWeight: 2400, heightAboveKeel: 11.2, heightClearance: 1.9, hoistable: true },
  { id: 'da5', vesselId: 'v-almirfa', deckNumber: 5, name: 'Weather Deck', length: 140, beam: 26, maxWeight: 2000, heightAboveKeel: 13.1, heightClearance: 0, hoistable: false },
  { id: 'ds1', vesselId: 'v-saadiyat', deckNumber: 1, name: 'Main Deck', length: 165, beam: 28, maxWeight: 4000, heightAboveKeel: 2, heightClearance: 5.5, hoistable: false },
  { id: 'ds2', vesselId: 'v-saadiyat', deckNumber: 2, name: 'Tween Deck', length: 160, beam: 27.5, maxWeight: 3000, heightAboveKeel: 7.5, heightClearance: 3.2, hoistable: false },
  { id: 'ds3', vesselId: 'v-saadiyat', deckNumber: 3, name: 'Upper Deck', length: 150, beam: 26, maxWeight: 2500, heightAboveKeel: 10.7, heightClearance: 2.1, hoistable: true },
  { id: 'ds4', vesselId: 'v-saadiyat', deckNumber: 4, name: 'Weather Deck', length: 130, beam: 24, maxWeight: 1800, heightAboveKeel: 12.8, heightClearance: 0, hoistable: false },
  { id: 'dy1', vesselId: 'v-yas', deckNumber: 1, name: 'Main Vehicle Deck', length: 195, beam: 31, maxWeight: 5500, heightAboveKeel: 2, heightClearance: 6.2, hoistable: false },
  { id: 'dy2', vesselId: 'v-yas', deckNumber: 2, name: 'Upper Vehicle Deck', length: 180, beam: 30, maxWeight: 4200, heightAboveKeel: 8.2, heightClearance: 4.5, hoistable: true },
  { id: 'dy3', vesselId: 'v-yas', deckNumber: 3, name: 'Weather Deck', length: 160, beam: 28, maxWeight: 3000, heightAboveKeel: 12.7, heightClearance: 0, hoistable: false },
]

const cargoInventory: CargoItemData[] = [
  { id: 'c1', type: 'CAR', description: 'Toyota Land Cruiser 300', length: 4.95, width: 1.98, height: 1.92, weight: 2.58, hazmat: null },
  { id: 'c2', type: 'CAR', description: 'Nissan Patrol Y62', length: 5.17, width: 2.0, height: 1.94, weight: 2.72, hazmat: null },
  { id: 'c3', type: 'CAR', description: 'Mercedes GLE 450', length: 4.93, width: 2.01, height: 1.82, weight: 2.31, hazmat: null },
  { id: 'c4', type: 'CAR', description: 'BMW X5 xDrive40i', length: 4.92, width: 2.0, height: 1.75, weight: 2.19, hazmat: null },
  { id: 'c5', type: 'TRUCK', description: 'Volvo FH16 750', length: 6.5, width: 2.55, height: 3.95, weight: 8.5, hazmat: null },
  { id: 'c6', type: 'TRUCK', description: 'Mercedes Actros 2653', length: 6.8, width: 2.55, height: 3.85, weight: 9.2, hazmat: null },
  { id: 'c7', type: 'TRUCK', description: 'MAN TGX 18.510', length: 9.0, width: 2.55, height: 3.8, weight: 12.5, hazmat: null },
  { id: 'c8', type: 'TRAILER', description: '40ft Flatbed Semi', length: 12.19, width: 2.55, height: 1.55, weight: 6.8, hazmat: null },
  { id: 'c9', type: 'TRAILER', description: '40ft Reefer Trailer', length: 13.6, width: 2.6, height: 4.0, weight: 14.5, hazmat: null },
  { id: 'c10', type: 'BREAKBULK', description: 'CAT 336 Excavator', length: 10.7, width: 3.2, height: 3.45, weight: 37.5, hazmat: null },
  { id: 'c11', type: 'BREAKBULK', description: 'Steel Coil Bundle', length: 2.5, width: 2.5, height: 1.8, weight: 28.0, hazmat: null },
  { id: 'c12', type: 'BREAKBULK', description: 'Generator Set', length: 6.0, width: 2.8, height: 3.0, weight: 45.0, hazmat: null },
]

function toVP(v: VesselData): VesselParams {
  return { name: v.name, length: new Decimal(v.length), beam: new Decimal(v.beam), draft: new Decimal(v.draft), deadweight: new Decimal(v.deadweight) }
}
function toDP(d: DeckData): DeckParams {
  return { id: d.id, deckNumber: d.deckNumber, name: d.name, length: new Decimal(d.length), beam: new Decimal(d.beam), maxWeight: new Decimal(d.maxWeight), heightAboveKeel: new Decimal(d.heightAboveKeel) }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusIcon({ status }: { status: StabilityStatus }) {
  if (status === 'SAFE') return <CheckCircle2 size={18} className="text-success" />
  if (status === 'WARNING') return <AlertTriangle size={18} className="text-warning" />
  return <XCircle size={18} className="text-critical" />
}

function GaugeBar({ label, value, max, unit, warn = 85, crit = 100 }: { label: string; value: number; max: number; unit: string; warn?: number; crit?: number }) {
  const pct = max === 0 ? 0 : (value / max) * 100
  const color = pct >= crit ? 'bg-critical' : pct >= warn ? 'bg-warning' : 'bg-success'
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text-secondary">{label}</span>
        <span className="font-medium text-text-primary">{value.toFixed(1)} / {max.toFixed(0)} {unit}</span>
      </div>
      <div className="h-2 bg-surface-secondary rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <div className="text-right text-[10px] text-text-muted mt-0.5">{pct.toFixed(1)}%</div>
    </div>
  )
}

function DeckVisualizerSVG({ deck, items }: { deck: DeckData; items: PlacedItem[] }) {
  const svgW = 600, svgH = 120
  const scaleX = svgW / deck.length
  const scaleY = svgH / deck.beam

  return (
    <div className="bg-surface rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-text-primary">Deck {deck.deckNumber}: {deck.name}</span>
        <span className="text-[10px] text-text-muted">{deck.heightAboveKeel}m above keel</span>
      </div>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full border border-border-light rounded bg-ad-white">
        {/* Deck outline */}
        <rect x={0} y={0} width={svgW} height={svgH} fill="none" stroke="#e2e5ea" strokeWidth={1} />
        {/* Centreline */}
        <line x1={0} y1={svgH / 2} x2={svgW} y2={svgH / 2} stroke="#e2e5ea" strokeWidth={1} strokeDasharray="4 4" />
        {/* Midship marker */}
        <line x1={svgW / 2} y1={0} x2={svgW / 2} y2={svgH} stroke="#e2e5ea" strokeWidth={1} strokeDasharray="4 4" />
        {/* Grid */}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`gx${i}`} x1={(svgW / 10) * (i + 1)} y1={0} x2={(svgW / 10) * (i + 1)} y2={svgH} stroke="#f0f2f5" strokeWidth={0.5} />
        ))}
        {/* Cargo items */}
        {items.filter(it => it.deckId === deck.id).map((it) => {
          const cx = it.posX * scaleX
          const cy = it.posY * scaleY
          const w = it.cargo.length * scaleX
          const h = it.cargo.width * scaleY
          const x = cx - w / 2
          const y = cy - h / 2
          const typeColor = it.cargo.type === 'CAR' ? '#3b82f6' : it.cargo.type === 'TRUCK' ? '#f59e0b' : it.cargo.type === 'TRAILER' ? '#10b981' : '#bd2426'
          return (
            <g key={it.cargo.id}>
              <rect x={x} y={y} width={w} height={h} fill={typeColor} fillOpacity={0.3} stroke={typeColor} strokeWidth={1} rx={2} />
              <text x={cx} y={cy + 3} textAnchor="middle" fontSize={8} fill={typeColor} fontWeight={600}>
                {it.cargo.description.split(' ')[0]}
              </text>
            </g>
          )
        })}
        {/* Labels */}
        <text x={4} y={12} fontSize={8} fill="#8b929a">Bow</text>
        <text x={svgW - 28} y={12} fontSize={8} fill="#8b929a">Stern</text>
        <text x={4} y={svgH / 2 - 4} fontSize={7} fill="#8b929a">Port</text>
        <text x={4} y={svgH / 2 + 12} fontSize={7} fill="#8b929a">Stbd</text>
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Types for placed items
// ---------------------------------------------------------------------------

interface PlacedItem {
  cargo: CargoItemData
  deckId: string
  posX: number
  posY: number
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function LoadMasterPage() {
  const [selectedVesselId, setSelectedVesselId] = useState(vessels[0].id)
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([])
  const [cargoFilter, setCargoFilter] = useState<CargoType | 'ALL'>('ALL')
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)
  const [showDecks, setShowDecks] = useState(true)

  const vessel = vessels.find(v => v.id === selectedVesselId)!
  const vesselDecks = allDecks.filter(d => d.vesselId === selectedVesselId).sort((a, b) => a.deckNumber - b.deckNumber)
  const vp = useMemo(() => toVP(vessel), [vessel])
  const dps = useMemo(() => vesselDecks.map(toDP), [vesselDecks])

  const activeDeckId = selectedDeckId ?? vesselDecks[0]?.id ?? null

  // Convert placed items to PositionedCargo for stability engine
  const positioned: PositionedCargo[] = useMemo(() =>
    placedItems.map(p => ({
      id: p.cargo.id,
      description: p.cargo.description,
      weight: new Decimal(p.cargo.weight),
      length: new Decimal(p.cargo.length),
      width: new Decimal(p.cargo.width),
      height: new Decimal(p.cargo.height),
      positionX: new Decimal(p.posX),
      positionY: new Decimal(p.posY),
      deckId: p.deckId,
    }))
  , [placedItems])

  const stability = useMemo(() => assessStability(vp, dps, positioned), [vp, dps, positioned])

  const availableCargo = cargoInventory.filter(c => {
    const notPlaced = !placedItems.some(p => p.cargo.id === c.id)
    const matchesFilter = cargoFilter === 'ALL' || c.type === cargoFilter
    return notPlaced && matchesFilter
  })

  const addCargo = useCallback((cargo: CargoItemData) => {
    if (!activeDeckId) return
    const deck = vesselDecks.find(d => d.id === activeDeckId)
    if (!deck) return
    // Place at centre of deck
    const posX = deck.length / 2
    const posY = deck.beam / 2
    setPlacedItems(prev => [...prev, { cargo, deckId: activeDeckId, posX, posY }])
  }, [activeDeckId, vesselDecks])

  const removeCargo = useCallback((cargoId: string) => {
    setPlacedItems(prev => prev.filter(p => p.cargo.id !== cargoId))
  }, [])

  const autoLoad = useCallback(() => {
    const sortedCargo = [...cargoInventory].sort((a, b) => b.weight - a.weight)
    const sortedDecks = [...vesselDecks].sort((a, b) => a.deckNumber - b.deckNumber)
    const capacity = new Map(sortedDecks.map(d => [d.id, d.maxWeight]))
    const counts = new Map(sortedDecks.map(d => [d.id, 0]))
    const newPlacements: PlacedItem[] = []

    for (const cargo of sortedCargo) {
      for (const deck of sortedDecks) {
        const rem = capacity.get(deck.id)!
        if (rem < cargo.weight) continue
        if (cargo.length > deck.length || cargo.width > deck.beam) continue
        const count = counts.get(deck.id)!
        const midX = deck.length / 2
        const midY = deck.beam / 2
        const offset = (Math.floor(count / 2) + 1) * cargo.length
        let posX = count % 2 === 0 ? midX + offset / 2 : midX - offset / 2
        posX = Math.max(cargo.length / 2, Math.min(posX, deck.length - cargo.length / 2))
        let posY = count % 2 === 0 ? midY + cargo.width / 2 + 0.5 : midY - cargo.width / 2 - 0.5
        posY = Math.max(cargo.width / 2, Math.min(posY, deck.beam - cargo.width / 2))
        newPlacements.push({ cargo, deckId: deck.id, posX, posY })
        capacity.set(deck.id, rem - cargo.weight)
        counts.set(deck.id, count + 1)
        break
      }
    }
    setPlacedItems(newPlacements)
  }, [vesselDecks])

  const clearAll = useCallback(() => setPlacedItems([]), [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
            <Ship size={22} className="text-info" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary font-serif">LoadMaster</h1>
            <p className="text-xs text-text-secondary">RoRo Vessel Stability & Load Planning Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-3 py-1.5 rounded-full border ${
            stability.status === 'SAFE' ? 'text-success bg-success/5 border-success/20' :
            stability.status === 'WARNING' ? 'text-warning bg-warning/5 border-warning/20' :
            'text-critical bg-critical/5 border-critical/20'
          }`}>
            <StatusIcon status={stability.status} />
            {stability.status}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-info bg-info/5 px-3 py-1.5 rounded-full border border-info/20">
            <Anchor size={12} /> IMO A.749(18)
          </span>
        </div>
      </div>

      {/* Vessel Selector */}
      <div className="bg-ad-white border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Ship size={16} className="text-ad-red" />
          Select Vessel
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {vessels.map(v => (
            <button
              key={v.id}
              onClick={() => { setSelectedVesselId(v.id); setPlacedItems([]); setSelectedDeckId(null) }}
              className={`text-left p-4 rounded-lg border transition-colors ${
                selectedVesselId === v.id ? 'border-ad-red bg-ad-red/5' : 'border-border hover:border-ad-red/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-text-primary">{v.name}</span>
                <span className="text-[10px] bg-surface-secondary text-text-muted px-2 py-0.5 rounded">{v.type}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-text-secondary">
                <div>IMO: {v.imo}</div>
                <div>LOA: {v.length}m</div>
                <div>Beam: {v.beam}m</div>
                <div>DWT: {v.deadweight.toLocaleString()}t</div>
                <div>Draft: {v.draft}m</div>
                <div>Decks: {v.deckCount}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Cargo + Decks + Stability */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cargo Inventory */}
        <div className="lg:col-span-3">
          <div className="bg-ad-white border border-border rounded-xl p-4 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Layers size={16} className="text-ad-red" />
                Cargo Inventory
              </h3>
              <span className="text-[10px] bg-surface-secondary text-text-muted px-2 py-0.5 rounded">{availableCargo.length} items</span>
            </div>

            {/* Filter */}
            <div className="flex gap-1 mb-3 flex-wrap">
              {(['ALL', 'CAR', 'TRUCK', 'TRAILER', 'BREAKBULK'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setCargoFilter(f)}
                  className={`text-[10px] font-medium px-2 py-1 rounded transition-colors ${
                    cargoFilter === f ? 'bg-ad-red text-white' : 'bg-surface-secondary text-text-secondary hover:bg-border'
                  }`}
                >
                  {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Target Deck */}
            <div className="mb-3">
              <div className="text-[10px] text-text-muted mb-1">Target Deck</div>
              <select
                value={activeDeckId ?? ''}
                onChange={e => setSelectedDeckId(e.target.value)}
                className="w-full text-xs border border-border rounded-lg px-2 py-1.5 bg-ad-white text-text-primary"
              >
                {vesselDecks.map(d => (
                  <option key={d.id} value={d.id}>Deck {d.deckNumber}: {d.name}</option>
                ))}
              </select>
            </div>

            {/* Cargo List */}
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
              {availableCargo.map(c => {
                const typeColor = c.type === 'CAR' ? 'bg-info/10 text-info' : c.type === 'TRUCK' ? 'bg-warning/10 text-warning' : c.type === 'TRAILER' ? 'bg-success/10 text-success' : 'bg-ad-red/10 text-ad-red'
                return (
                  <button
                    key={c.id}
                    onClick={() => addCargo(c)}
                    className="w-full text-left p-2.5 bg-surface rounded-lg hover:bg-surface-secondary transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-text-primary">{c.description}</span>
                      <Plus size={14} className="text-text-muted group-hover:text-ad-red transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-text-muted">
                      <span className={`px-1.5 py-0.5 rounded ${typeColor} text-[9px] font-medium`}>{c.type}</span>
                      <span>{c.weight}t</span>
                      <span>{c.length}×{c.width}m</span>
                    </div>
                  </button>
                )
              })}
              {availableCargo.length === 0 && (
                <div className="text-center py-6 text-xs text-text-muted">All cargo placed</div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-border-light">
              <button
                onClick={autoLoad}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium bg-ad-red text-white py-2 rounded-lg hover:bg-ad-red-dark transition-colors"
              >
                <Zap size={12} /> Auto-Load
              </button>
              <button
                onClick={clearAll}
                className="flex items-center justify-center gap-1.5 text-xs font-medium bg-surface-secondary text-text-secondary py-2 px-3 rounded-lg hover:bg-border transition-colors"
              >
                <RotateCcw size={12} /> Clear
              </button>
            </div>
          </div>
        </div>

        {/* Center: Deck Visualization */}
        <div className="lg:col-span-5">
          <div className="bg-ad-white border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Ruler size={16} className="text-ad-red" />
                Deck Layout
              </h3>
              <button onClick={() => setShowDecks(!showDecks)} className="text-text-muted hover:text-text-primary">
                {showDecks ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {showDecks && (
              <div className="space-y-4">
                {vesselDecks.map(deck => (
                  <DeckVisualizerSVG key={deck.id} deck={deck} items={placedItems} />
                ))}
              </div>
            )}

            {/* Placed cargo list */}
            {placedItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border-light">
                <h4 className="text-xs font-medium text-text-secondary mb-2">Placed Cargo ({placedItems.length})</h4>
                <div className="space-y-1 max-h-[200px] overflow-y-auto">
                  {placedItems.map(p => {
                    const deck = vesselDecks.find(d => d.id === p.deckId)
                    return (
                      <div key={p.cargo.id} className="flex items-center justify-between bg-surface rounded-lg px-3 py-2">
                        <div>
                          <div className="text-xs font-medium text-text-primary">{p.cargo.description}</div>
                          <div className="text-[10px] text-text-muted">
                            Deck {deck?.deckNumber}: {deck?.name} | {p.cargo.weight}t
                          </div>
                        </div>
                        <button
                          onClick={() => removeCargo(p.cargo.id)}
                          className="text-text-muted hover:text-critical transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Stability Dashboard */}
        <div className="lg:col-span-4">
          <div className="bg-ad-white border border-border rounded-xl p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <BarChart3 size={16} className="text-ad-red" />
                Stability Dashboard
              </h3>
              <StatusIcon status={stability.status} />
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-surface rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-text-primary font-serif">{stability.trim.toFixed(2)}</div>
                <div className="text-[10px] text-text-muted">Trim (m)</div>
                <div className={`text-[10px] font-medium ${stability.trim.abs().greaterThan(1) ? 'text-warning' : 'text-success'}`}>
                  {stability.trim.greaterThan(0) ? 'By Stern' : stability.trim.lessThan(0) ? 'By Bow' : 'Even Keel'}
                </div>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-text-primary font-serif">{stability.heel.toFixed(2)}°</div>
                <div className="text-[10px] text-text-muted">Heel</div>
                <div className={`text-[10px] font-medium ${stability.heel.abs().greaterThan(2) ? 'text-warning' : 'text-success'}`}>
                  {stability.heel.greaterThan(0) ? 'Starboard' : stability.heel.lessThan(0) ? 'Port' : 'Upright'}
                </div>
              </div>
            </div>

            {/* COG Display */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-surface rounded-lg p-2 text-center">
                <div className="text-xs font-bold text-text-primary">{stability.lcg.toFixed(1)}m</div>
                <div className="text-[9px] text-text-muted">LCG (from bow)</div>
              </div>
              <div className="bg-surface rounded-lg p-2 text-center">
                <div className="text-xs font-bold text-text-primary">{stability.tcg.toFixed(1)}m</div>
                <div className="text-[9px] text-text-muted">TCG (from port)</div>
              </div>
              <div className="bg-surface rounded-lg p-2 text-center">
                <div className="text-xs font-bold text-text-primary">{stability.vcg.toFixed(1)}m</div>
                <div className="text-[9px] text-text-muted">VCG (above keel)</div>
              </div>
            </div>

            {/* Weight Gauges */}
            <div className="space-y-3 mb-4">
              <GaugeBar
                label="Deadweight"
                value={stability.totalWeight.toNumber()}
                max={vessel.deadweight}
                unit="t"
                warn={90}
                crit={100}
              />
              {stability.deckLoadings.map(dl => (
                <GaugeBar
                  key={dl.deckId}
                  label={`Deck ${dl.deckNumber}: ${dl.deckName}`}
                  value={dl.totalWeight.toNumber()}
                  max={dl.maxWeight.toNumber()}
                  unit="t"
                />
              ))}
            </div>

            {/* Warnings */}
            {stability.warnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-text-secondary">Warnings</h4>
                {stability.warnings.map((w, i) => (
                  <div key={i} className={`flex items-start gap-2 p-2 rounded-lg text-xs ${
                    w.severity === 'CRITICAL' ? 'bg-critical/5 text-critical' : 'bg-warning/5 text-warning'
                  }`}>
                    {w.severity === 'CRITICAL' ? <XCircle size={14} className="shrink-0 mt-0.5" /> : <AlertTriangle size={14} className="shrink-0 mt-0.5" />}
                    <span>{w.message}</span>
                  </div>
                ))}
              </div>
            )}

            {stability.warnings.length === 0 && placedItems.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-success/5 rounded-lg">
                <CheckCircle2 size={16} className="text-success" />
                <span className="text-xs text-success font-medium">All stability checks passed</span>
              </div>
            )}

            {placedItems.length === 0 && (
              <div className="flex items-center gap-2 p-3 bg-surface rounded-lg">
                <Info size={16} className="text-text-muted" />
                <span className="text-xs text-text-muted">Add cargo to see stability analysis</span>
              </div>
            )}

            {/* Load Summary */}
            <div className="mt-4 pt-4 border-t border-border-light">
              <h4 className="text-xs font-medium text-text-secondary mb-2">Load Summary</h4>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                <div className="text-text-muted">Total Weight</div>
                <div className="font-medium text-text-primary text-right">{stability.totalWeight.toFixed(1)} t</div>
                <div className="text-text-muted">DWT Utilization</div>
                <div className="font-medium text-text-primary text-right">{stability.deadweightUtilization.toFixed(1)}%</div>
                <div className="text-text-muted">Items Loaded</div>
                <div className="font-medium text-text-primary text-right">{placedItems.length} / {cargoInventory.length}</div>
                <div className="text-text-muted">Remaining Capacity</div>
                <div className="font-medium text-text-primary text-right">{(vessel.deadweight - stability.totalWeight.toNumber()).toFixed(0)} t</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-ad-white border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Info size={16} className="text-info" />
          About LoadMaster Stability Engine
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-text-secondary">
          <div>
            <h4 className="font-medium text-text-primary mb-1">IMO Compliance</h4>
            <p className="leading-relaxed">
              Calculations follow IMO Resolution A.749(18) Intact Stability Code. Trim, heel, and VCG thresholds
              are based on operational limits for RoRo/PCTC vessels.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-1">Centre of Gravity</h4>
            <p className="leading-relaxed">
              LCG/TCG/VCG computed as weighted averages. The optimizer places heavy cargo low and alternates
              port/starboard to minimise heel and keep VCG within safe limits.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-text-primary mb-1">Greedy Optimizer</h4>
            <p className="leading-relaxed">
              Auto-load uses a greedy algorithm: heaviest cargo first, lowest decks first, alternating
              fore/aft and port/starboard for optimal weight distribution.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
