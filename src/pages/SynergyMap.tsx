import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Network, X } from 'lucide-react'
import { modules, synergies, type Synergy, type SynergyType } from '../data/moduleKpis'
import type { FinancialStatement } from '../components/StatCard'

// ─────────────────────────────────────────────────────────────
// Node positions (circular layout)
// ─────────────────────────────────────────────────────────────

const nodePositions: Record<string, { x: number; y: number }> = {
  'trade-flow':        { x: 400, y: 60 },
  'vin-chain':         { x: 620, y: 120 },
  'slot-bid':          { x: 700, y: 280 },
  'battery-health':    { x: 620, y: 440 },
  'stevedore-ai':      { x: 400, y: 500 },
  'port-fota':         { x: 180, y: 440 },
  'sky-link':          { x: 100, y: 280 },
  'lithium-sentinel':  { x: 180, y: 120 },
  'cruise-turnaround': { x: 310, y: 180 },
  'digital-twin':      { x: 490, y: 380 },
}

const synergyTypeConfig: Record<SynergyType, { color: string; label: string; stroke: string }> = {
  data:        { color: 'bg-blue-100 text-blue-700 border-blue-300', label: 'Data Sharing', stroke: '#3b82f6' },
  operational: { color: 'bg-emerald-100 text-emerald-700 border-emerald-300', label: 'Operational', stroke: '#10b981' },
  financial:   { color: 'bg-amber-100 text-amber-700 border-amber-300', label: 'Financial', stroke: '#f59e0b' },
}

const fsBadge: Record<FinancialStatement, string> = {
  IS: 'bg-fs-income text-white',
  BS: 'bg-fs-balance text-white',
  CF: 'bg-fs-cashflow text-white',
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function SynergyMap() {
  const [selectedSynergy, setSelectedSynergy] = useState<Synergy | null>(null)
  const [hoveredModule, setHoveredModule] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<SynergyType | 'all'>('all')

  const filteredSynergies = activeFilter === 'all' ? synergies : synergies.filter(s => s.type === activeFilter)

  const totalValue = synergies.reduce((sum, s) => {
    const num = parseFloat(s.annualValue.replace(/[^0-9.]/g, ''))
    return sum + num
  }, 0)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/"
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary font-serif">Synergy Map</h1>
              <p className="text-sm text-text-secondary">
                {synergies.length} cross-module connections — AED {totalValue.toFixed(1)}M combined annual value
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-text-muted font-medium">Filter:</span>
        <button
          onClick={() => setActiveFilter('all')}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            activeFilter === 'all' ? 'bg-text-primary text-white border-text-primary' : 'border-border text-text-muted hover:border-text-muted'
          }`}
        >
          All ({synergies.length})
        </button>
        {(Object.keys(synergyTypeConfig) as SynergyType[]).map((type) => {
          const cfg = synergyTypeConfig[type]
          const count = synergies.filter(s => s.type === type).length
          return (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeFilter === type ? cfg.color + ' border-current' : 'border-border text-text-muted hover:border-text-muted'
              }`}
            >
              {cfg.label} ({count})
            </button>
          )
        })}
      </div>

      {/* SVG Network Diagram */}
      <div className="bg-ad-white rounded-xl border border-border overflow-hidden">
        <svg viewBox="0 0 800 560" className="w-full h-auto">
          {/* Background */}
          <rect width="800" height="560" fill="#f8f9fb" />

          {/* Connection lines */}
          {filteredSynergies.map((synergy) => {
            const fromPos = nodePositions[synergy.from]
            const toPos = nodePositions[synergy.to]
            if (!fromPos || !toPos) return null

            const cfg = synergyTypeConfig[synergy.type]
            const isSelected = selectedSynergy?.id === synergy.id
            const isRelated = hoveredModule === synergy.from || hoveredModule === synergy.to

            // curved path via midpoint offset
            const midX = (fromPos.x + toPos.x) / 2
            const midY = (fromPos.y + toPos.y) / 2
            const dx = toPos.x - fromPos.x
            const dy = toPos.y - fromPos.y
            const offsetX = -dy * 0.15
            const offsetY = dx * 0.15
            const ctrlX = midX + offsetX
            const ctrlY = midY + offsetY
            const pathD = `M${fromPos.x},${fromPos.y} Q${ctrlX},${ctrlY} ${toPos.x},${toPos.y}`

            return (
              <g key={synergy.id} onClick={() => setSelectedSynergy(isSelected ? null : synergy)} className="cursor-pointer">
                <path
                  d={pathD}
                  fill="none"
                  stroke={cfg.stroke}
                  strokeWidth={isSelected ? 3 : isRelated ? 2.5 : 1.5}
                  strokeDasharray={isSelected ? 'none' : '6,4'}
                  opacity={isSelected ? 1 : isRelated ? 0.9 : 0.4}
                >
                  {!isSelected && (
                    <animate attributeName="stroke-dashoffset" values="0;-20" dur="3s" repeatCount="indefinite" />
                  )}
                </path>
                {/* flow dot */}
                <circle r={isSelected ? 4 : 2.5} fill={cfg.stroke} opacity={isSelected ? 1 : 0.7}>
                  <animateMotion dur="4s" repeatCount="indefinite" path={pathD} />
                </circle>
              </g>
            )
          })}

          {/* Module nodes */}
          {modules.map((mod) => {
            const pos = nodePositions[mod.id]
            if (!pos) return null

            const isHovered = hoveredModule === mod.id
            const isInSelected = selectedSynergy && (selectedSynergy.from === mod.id || selectedSynergy.to === mod.id)
            const connectionCount = synergies.filter(s => s.from === mod.id || s.to === mod.id).length

            return (
              <g
                key={mod.id}
                onMouseEnter={() => setHoveredModule(mod.id)}
                onMouseLeave={() => setHoveredModule(null)}
                className="cursor-pointer"
              >
                <Link to={`/modules/${mod.slug}`}>
                  {/* Glow ring */}
                  {(isHovered || isInSelected) && (
                    <circle cx={pos.x} cy={pos.y} r="32" fill="none" stroke="#bd2426" strokeWidth="2" opacity="0.3">
                      <animate attributeName="r" values="32;36;32" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Node circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="26"
                    fill={isHovered || isInSelected ? '#1e2228' : '#32373c'}
                    stroke={isHovered || isInSelected ? '#bd2426' : '#4a5058'}
                    strokeWidth="2"
                  />
                  {/* Connection count badge */}
                  <circle cx={pos.x + 18} cy={pos.y - 18} r="8" fill="#bd2426" />
                  <text x={pos.x + 18} y={pos.y - 14} textAnchor="middle" fontSize="8" fontWeight="700" fill="white">
                    {connectionCount}
                  </text>
                  {/* Module label */}
                  <text
                    x={pos.x}
                    y={pos.y + 42}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill={isHovered || isInSelected ? '#1a1d21' : '#5e656c'}
                  >
                    {mod.name.split(/[-\s]/).slice(0, 2).join(' ')}
                  </text>
                  {/* Icon character */}
                  <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize="14" fill="white">
                    {mod.name.charAt(0)}
                  </text>
                </Link>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Selected Synergy Detail */}
      {selectedSynergy && (
        <div className="mt-4 bg-ad-white rounded-xl border-2 border-text-primary p-5 shadow-lg relative">
          <button
            onClick={() => setSelectedSynergy(null)}
            className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${synergyTypeConfig[selectedSynergy.type].color}`}>
              {synergyTypeConfig[selectedSynergy.type].label}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${fsBadge[selectedSynergy.financialImpact.statement]}`}>
              {selectedSynergy.financialImpact.statement}
            </span>
          </div>
          <h3 className="text-base font-semibold text-text-primary mb-1">
            {modules.find(m => m.id === selectedSynergy.from)?.name} ↔ {modules.find(m => m.id === selectedSynergy.to)?.name}
          </h3>
          <p className="text-sm font-medium text-text-secondary mb-2">{selectedSynergy.label}</p>
          <p className="text-sm text-text-muted leading-relaxed mb-3">{selectedSynergy.description}</p>
          <div className="flex items-center gap-4">
            <div className="text-xs text-text-muted">
              Financial Impact: <span className="font-medium text-text-secondary">{selectedSynergy.financialImpact.effect}</span>
            </div>
            <div className="text-xs text-success font-bold">{selectedSynergy.annualValue}/yr</div>
            <Link
              to={`/financial-model?statement=${selectedSynergy.financialImpact.statement}`}
              className="ml-auto flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              View in Financial Model <ExternalLink size={10} />
            </Link>
          </div>
        </div>
      )}

      {/* Synergy List Table */}
      <div className="mt-6 bg-ad-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-surface-secondary/50">
          <h3 className="text-sm font-semibold text-text-primary">All Synergy Connections ({filteredSynergies.length})</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-surface-secondary border-b border-border">
            <tr>
              <th className="text-left px-5 py-2.5 font-medium text-text-secondary">Connection</th>
              <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Type</th>
              <th className="text-left px-4 py-2.5 font-medium text-text-secondary">Impact</th>
              <th className="text-right px-5 py-2.5 font-medium text-text-secondary">Annual Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {filteredSynergies.map((synergy) => (
              <tr
                key={synergy.id}
                onClick={() => setSelectedSynergy(synergy)}
                className={`cursor-pointer transition-colors ${
                  selectedSynergy?.id === synergy.id ? 'bg-surface-secondary' : 'hover:bg-surface-secondary/30'
                }`}
              >
                <td className="px-5 py-3">
                  <div className="font-medium text-text-primary text-xs">
                    {modules.find(m => m.id === synergy.from)?.name} ↔ {modules.find(m => m.id === synergy.to)?.name}
                  </div>
                  <div className="text-[11px] text-text-muted">{synergy.label}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${synergyTypeConfig[synergy.type].color}`}>
                    {synergyTypeConfig[synergy.type].label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${fsBadge[synergy.financialImpact.statement]}`}>
                      {synergy.financialImpact.statement}
                    </span>
                    <span className="text-xs text-text-muted">{synergy.financialImpact.effect}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="text-xs font-bold text-success">{synergy.annualValue}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cross-links */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <Link
          to="/financial-model"
          className="text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
        >
          3-Statement Financial Model <ExternalLink size={10} />
        </Link>
        <span className="text-border">|</span>
        <Link
          to="/"
          className="text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
        >
          Executive Dashboard <ExternalLink size={10} />
        </Link>
      </div>
    </div>
  )
}
