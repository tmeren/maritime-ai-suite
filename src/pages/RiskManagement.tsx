import { useState } from 'react'
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import type { FinancialStatement } from '../data/reportCatalog'

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type RiskDomain = 'operational' | 'financial' | 'regulatory' | 'market'
type Severity = 'critical' | 'high' | 'medium' | 'low'
type MitigationStatus = 'mitigated' | 'in-progress' | 'unmitigated'

interface RiskItem {
  id: string
  title: string
  domain: RiskDomain
  severity: Severity
  likelihood: 1 | 2 | 3 | 4 | 5
  impact: 1 | 2 | 3 | 4 | 5
  mitigationStatus: MitigationStatus
  financialStatement: FinancialStatement
  financialImpactLine: string
  estimatedImpact: string
  description: string
  mitigationPlan: string
  owner: string
  timeline: string
  trend: 'improving' | 'stable' | 'worsening'
}

// ─────────────────────────────────────────────────────────
// Mock Data — AD Ports Maritime Context
// ─────────────────────────────────────────────────────────

const risks: RiskItem[] = [
  {
    id: 'R-001',
    title: 'Bunker Fuel Price Volatility',
    domain: 'financial',
    severity: 'critical',
    likelihood: 5,
    impact: 4,
    mitigationStatus: 'in-progress',
    financialStatement: 'IS',
    financialImpactLine: 'Cost of Goods Sold — Fuel & Energy',
    estimatedImpact: '±180M AED',
    description: 'Global bunker fuel prices remain volatile due to OPEC+ supply decisions and Red Sea disruptions. Direct impact on vessel operating costs and logistics margins.',
    mitigationPlan: 'Implement fuel hedging program covering 60% of annual consumption. Negotiate fixed-price bunkering contracts at Khalifa Port. Deploy CarbonWise AI for route optimization.',
    owner: 'CFO — Maritime Division',
    timeline: 'Q2 2026',
    trend: 'worsening',
  },
  {
    id: 'R-002',
    title: 'Vessel Schedule Delays',
    domain: 'operational',
    severity: 'high',
    likelihood: 4,
    impact: 3,
    mitigationStatus: 'in-progress',
    financialStatement: 'IS',
    financialImpactLine: 'Revenue — Port Services',
    estimatedImpact: '95M AED',
    description: 'Congestion at key transshipment hubs and weather events causing cascading schedule delays. Affects berth utilization and demurrage revenue.',
    mitigationPlan: 'Deploy StevedoreAI for real-time berth allocation optimization. Implement predictive ETA system using AIS data. Increase berth flexibility at KIZAD.',
    owner: 'COO — Port Operations',
    timeline: 'Q3 2026',
    trend: 'stable',
  },
  {
    id: 'R-003',
    title: 'IMO 2030 Decarbonization Compliance',
    domain: 'regulatory',
    severity: 'critical',
    likelihood: 5,
    impact: 5,
    mitigationStatus: 'in-progress',
    financialStatement: 'CF',
    financialImpactLine: 'Growth CAPEX — Green Transition',
    estimatedImpact: '2.4B AED',
    description: 'IMO CII and EEXI regulations require fleet-wide emissions reduction by 2030. Non-compliance risks vessel trading restrictions and carbon levy exposure.',
    mitigationPlan: 'Phase 1: Fleet retrofit program (scrubbers + LNG dual-fuel). Phase 2: Green corridor partnerships (Abu Dhabi–Singapore). Phase 3: Methanol-ready newbuilds in 2028 order book.',
    owner: 'CSO — Sustainability',
    timeline: 'Q4 2029',
    trend: 'stable',
  },
  {
    id: 'R-004',
    title: 'Red Sea / Suez Canal Disruption',
    domain: 'market',
    severity: 'high',
    likelihood: 4,
    impact: 4,
    mitigationStatus: 'in-progress',
    financialStatement: 'IS',
    financialImpactLine: 'Revenue — Trade Corridor Volume',
    estimatedImpact: '320M AED',
    description: 'Ongoing Houthi attacks forcing major shipping lines to reroute via Cape of Good Hope. +10-14 day transit time impact on Asia-Europe corridor. AD Ports positioned as alternative hub.',
    mitigationPlan: 'Accelerate Khalifa Port capacity expansion to capture rerouting demand. Launch Trade-Flow Oracle predictive routing. Negotiate spot rate premiums for Fujairah bunkering.',
    owner: 'CEO — Group Strategy',
    timeline: 'Ongoing',
    trend: 'improving',
  },
  {
    id: 'R-005',
    title: 'Cybersecurity — OT/IT Convergence',
    domain: 'operational',
    severity: 'high',
    likelihood: 3,
    impact: 5,
    mitigationStatus: 'in-progress',
    financialStatement: 'BS',
    financialImpactLine: 'Intangible Assets — IT Infrastructure',
    estimatedImpact: '150M AED',
    description: 'Port OT systems (cranes, RTGs, gate systems) increasingly connected to IT networks. Ransomware attack on a single terminal could halt operations for 48-72 hours.',
    mitigationPlan: 'Zero-trust architecture deployment across all terminals. OT-specific SOC with 24/7 monitoring. Annual red team exercises. Cyber insurance coverage at 500M AED.',
    owner: 'CISO',
    timeline: 'Q1 2027',
    trend: 'improving',
  },
  {
    id: 'R-006',
    title: 'UAE Corporate Tax Implementation',
    domain: 'regulatory',
    severity: 'medium',
    likelihood: 5,
    impact: 3,
    mitigationStatus: 'mitigated',
    financialStatement: 'IS',
    financialImpactLine: 'Tax Expense — Corporate Tax',
    estimatedImpact: '410M AED',
    description: 'UAE 9% corporate tax effective June 2023. Free zone entities must meet substance requirements. Transfer pricing documentation required for all intercompany transactions.',
    mitigationPlan: 'Tax function restructured. Transfer pricing documentation complete for all 42 intercompany agreements. QFZP status confirmed for Khalifa Port FZ entities. ERP tax module deployed.',
    owner: 'Group Tax Director',
    timeline: 'Complete',
    trend: 'stable',
  },
  {
    id: 'R-007',
    title: 'Currency Exposure — Non-AED Revenue',
    domain: 'financial',
    severity: 'medium',
    likelihood: 4,
    impact: 3,
    mitigationStatus: 'mitigated',
    financialStatement: 'IS',
    financialImpactLine: 'Foreign Exchange Gains/Losses',
    estimatedImpact: '65M AED',
    description: '28% of revenue denominated in non-AED currencies (EUR, GBP, KES, PKR). AED-USD peg provides stability for USD-denominated trade but emerging market currencies pose risk.',
    mitigationPlan: 'Natural hedging via matched currency expenses. Forward contracts covering 80% of EUR/GBP exposure. Monthly mark-to-market reporting. PKR exposure limited to <2% of group revenue.',
    owner: 'Group Treasurer',
    timeline: 'Complete',
    trend: 'stable',
  },
  {
    id: 'R-008',
    title: 'Port Infrastructure — Climate Resilience',
    domain: 'operational',
    severity: 'medium',
    likelihood: 3,
    impact: 4,
    mitigationStatus: 'in-progress',
    financialStatement: 'BS',
    financialImpactLine: 'Fixed Assets — Port Infrastructure',
    estimatedImpact: '800M AED',
    description: 'Rising sea levels and extreme heat events threaten coastal port infrastructure. KIZAD and Khalifa Port require climate adaptation investments for 2050+ resilience.',
    mitigationPlan: 'Phase 1: Climate vulnerability assessment for all 10 port clusters. Phase 2: Flood defense upgrades at Khalifa Port (raised quay walls). Phase 3: Heat-resilient pavement and worker welfare.',
    owner: 'VP — Infrastructure',
    timeline: 'Q2 2028',
    trend: 'stable',
  },
  {
    id: 'R-009',
    title: 'Trade Route Concentration Risk',
    domain: 'market',
    severity: 'medium',
    likelihood: 3,
    impact: 3,
    mitigationStatus: 'in-progress',
    financialStatement: 'IS',
    financialImpactLine: 'Revenue — Geographic Segments',
    estimatedImpact: '220M AED',
    description: '46% of container throughput from Asia-GCC corridor. Geopolitical shifts (China+1 manufacturing) and new trade agreements could alter corridor volumes.',
    mitigationPlan: 'Diversify to Africa-GCC (+12% YoY growth). Expand India-GCC corridor via Mundra JV. Develop South America-GCC with new feeder services.',
    owner: 'Chief Commercial Officer',
    timeline: 'Q4 2027',
    trend: 'improving',
  },
  {
    id: 'R-010',
    title: 'EV Battery Transport Regulations',
    domain: 'regulatory',
    severity: 'low',
    likelihood: 3,
    impact: 2,
    mitigationStatus: 'mitigated',
    financialStatement: 'IS',
    financialImpactLine: 'Revenue — Vehicle Logistics',
    estimatedImpact: '35M AED',
    description: 'IMDG Code amendments for lithium battery transport (Class 9 dangerous goods). New stowage and segregation requirements for Ro-Ro vessel EV cargo.',
    mitigationPlan: 'LithiumSentinel AI deployed for real-time SoC monitoring. DG-certified stacking zones at all Ro-Ro terminals. Crew training program complete (1,200 staff certified).',
    owner: 'VP — Vehicle Logistics',
    timeline: 'Complete',
    trend: 'stable',
  },
]

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

const domainConfig: Record<RiskDomain, { label: string; color: string; bg: string }> = {
  operational: { label: 'Operational', color: 'text-info', bg: 'bg-info' },
  financial: { label: 'Financial', color: 'text-fs-income', bg: 'bg-fs-income' },
  regulatory: { label: 'Regulatory', color: 'text-warning', bg: 'bg-warning' },
  market: { label: 'Market', color: 'text-success', bg: 'bg-success' },
}

const severityConfig: Record<Severity, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: 'text-critical', bg: 'bg-critical' },
  high: { label: 'High', color: 'text-warning', bg: 'bg-warning' },
  medium: { label: 'Medium', color: 'text-info', bg: 'bg-info' },
  low: { label: 'Low', color: 'text-success', bg: 'bg-success' },
}

const mitigationConfig: Record<MitigationStatus, { label: string; icon: typeof CheckCircle2; color: string }> = {
  mitigated: { label: 'Mitigated', icon: CheckCircle2, color: 'text-success' },
  'in-progress': { label: 'In Progress', icon: Clock, color: 'text-warning' },
  unmitigated: { label: 'Unmitigated', icon: AlertTriangle, color: 'text-critical' },
}

const fsBadge: Record<FinancialStatement, { label: string; bg: string }> = {
  IS: { label: 'IS', bg: 'bg-fs-income' },
  BS: { label: 'BS', bg: 'bg-fs-balance' },
  CF: { label: 'CF', bg: 'bg-fs-cashflow' },
}

const heatMapLabels = {
  likelihood: ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'],
  impact: ['Negligible', 'Minor', 'Moderate', 'Major', 'Catastrophic'],
}

function getCellColor(l: number, i: number): string {
  const score = l * i
  if (score >= 16) return 'bg-critical/80 text-white'
  if (score >= 10) return 'bg-warning/80 text-white'
  if (score >= 5) return 'bg-warning/30 text-text-primary'
  return 'bg-success/20 text-text-primary'
}

// ─────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────

function DomainSummaryCard({ domain }: { domain: RiskDomain }) {
  const cfg = domainConfig[domain]
  const domainRisks = risks.filter(r => r.domain === domain)
  const critical = domainRisks.filter(r => r.severity === 'critical' || r.severity === 'high').length
  const mitigated = domainRisks.filter(r => r.mitigationStatus === 'mitigated').length
  const pct = domainRisks.length > 0 ? Math.round((mitigated / domainRisks.length) * 100) : 0

  return (
    <div className="bg-ad-white rounded-xl border border-border p-5 hover:shadow-card-hover transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-3 h-3 rounded-full ${cfg.bg}`} />
        <h3 className="text-sm font-semibold text-text-primary">{cfg.label}</h3>
        <span className="ml-auto text-xs text-text-muted">{domainRisks.length} risks</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[11px] text-text-muted mb-0.5">Total</p>
          <p className="text-lg font-bold text-text-primary">{domainRisks.length}</p>
        </div>
        <div>
          <p className="text-[11px] text-text-muted mb-0.5">Critical/High</p>
          <p className="text-lg font-bold text-critical">{critical}</p>
        </div>
        <div>
          <p className="text-[11px] text-text-muted mb-0.5">Mitigated</p>
          <p className="text-lg font-bold text-success">{pct}%</p>
        </div>
      </div>
    </div>
  )
}

function HeatMap() {
  // Build matrix of risk counts per cell
  const matrix: Record<string, RiskItem[]> = {}
  risks.forEach(r => {
    const key = `${r.likelihood}-${r.impact}`
    if (!matrix[key]) matrix[key] = []
    matrix[key].push(r)
  })

  return (
    <div className="bg-ad-white rounded-xl border border-border p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Risk Heat Map — Likelihood × Impact</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="w-24 py-2 px-2 text-left text-[10px] text-text-muted uppercase tracking-wider" />
              {heatMapLabels.impact.map((label, i) => (
                <th key={i} className="py-2 px-1 text-center text-[10px] text-text-muted uppercase tracking-wider font-medium">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...heatMapLabels.likelihood].reverse().map((lLabel, rowIdx) => {
              const likelihood = 5 - rowIdx
              return (
                <tr key={likelihood}>
                  <td className="py-1 px-2 text-[10px] text-text-muted uppercase tracking-wider font-medium whitespace-nowrap">
                    {lLabel}
                  </td>
                  {[1, 2, 3, 4, 5].map(impact => {
                    const key = `${likelihood}-${impact}`
                    const cellRisks = matrix[key] || []
                    return (
                      <td key={impact} className="p-1">
                        <div
                          className={`h-12 rounded-lg flex items-center justify-center font-bold text-sm ${getCellColor(likelihood, impact)}`}
                          title={cellRisks.map(r => r.title).join(', ') || 'No risks'}
                        >
                          {cellRisks.length > 0 ? cellRisks.length : ''}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="flex items-center gap-3 mt-3 justify-end">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-success/20" /><span className="text-[10px] text-text-muted">Low</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-warning/30" /><span className="text-[10px] text-text-muted">Medium</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-warning/80" /><span className="text-[10px] text-text-muted">High</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-critical/80" /><span className="text-[10px] text-text-muted">Critical</span></div>
        </div>
      </div>
    </div>
  )
}

function RiskCard({ risk }: { risk: RiskItem }) {
  const [expanded, setExpanded] = useState(false)
  const sev = severityConfig[risk.severity]
  const mit = mitigationConfig[risk.mitigationStatus]
  const MitIcon = mit.icon
  const fs = fsBadge[risk.financialStatement]
  const dom = domainConfig[risk.domain]

  return (
    <div className="bg-ad-white rounded-xl border border-border hover:shadow-card-hover transition-all duration-200 overflow-hidden">
      <div className="p-5">
        {/* Top row: ID + Domain + Severity */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-mono text-text-muted">{risk.id}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${dom.bg}`}>{dom.label}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${sev.bg}`}>{sev.label}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${fs.bg}`}>{fs.label}</span>
          <div className="ml-auto flex items-center gap-1">
            {risk.trend === 'improving' && <TrendingDown size={14} className="text-success" />}
            {risk.trend === 'worsening' && <TrendingUp size={14} className="text-critical" />}
            <span className="text-[10px] text-text-muted capitalize">{risk.trend}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-text-primary mb-1.5">{risk.title}</h3>
        <p className="text-xs text-text-secondary leading-relaxed mb-3">{risk.description}</p>

        {/* Metrics row */}
        <div className="flex items-center gap-4 mb-3">
          <div className="text-xs">
            <span className="text-text-muted">Likelihood: </span>
            <span className="font-semibold text-text-primary">{risk.likelihood}/5</span>
          </div>
          <div className="text-xs">
            <span className="text-text-muted">Impact: </span>
            <span className="font-semibold text-text-primary">{risk.impact}/5</span>
          </div>
          <div className="text-xs">
            <span className="text-text-muted">Score: </span>
            <span className="font-bold text-text-primary">{risk.likelihood * risk.impact}</span>
          </div>
        </div>

        {/* Financial impact + Mitigation status */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`flex items-center gap-1.5 ${mit.color}`}>
            <MitIcon size={14} />
            <span className="text-xs font-medium">{mit.label}</span>
          </div>
          <span className="text-xs text-text-muted">|</span>
          <span className="text-xs text-text-secondary">{risk.financialImpactLine}</span>
          <span className="ml-auto text-xs font-semibold text-text-primary">{risk.estimatedImpact}</span>
        </div>

        {/* Expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          {expanded ? 'Hide details' : 'Mitigation details'}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border bg-surface/50 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Owner</p>
              <p className="text-xs text-text-primary font-medium">{risk.owner}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Timeline</p>
              <p className="text-xs text-text-primary font-medium">{risk.timeline}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Est. Impact</p>
              <p className="text-xs text-text-primary font-medium">{risk.estimatedImpact}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5">Mitigation Plan</p>
            <p className="text-xs text-text-secondary leading-relaxed">{risk.mitigationPlan}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────

export default function RiskManagement() {
  const [filterDomain, setFilterDomain] = useState<RiskDomain | 'all'>('all')
  const filteredRisks = filterDomain === 'all' ? risks : risks.filter(r => r.domain === filterDomain)
  const domains: RiskDomain[] = ['operational', 'financial', 'regulatory', 'market']

  const totalCritical = risks.filter(r => r.severity === 'critical').length
  const totalHigh = risks.filter(r => r.severity === 'high').length
  const mitigatedPct = Math.round((risks.filter(r => r.mitigationStatus === 'mitigated').length / risks.length) * 100)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-critical/10 flex items-center justify-center">
            <ShieldAlert size={22} className="text-critical" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary font-serif">Risk Management</h1>
            <p className="text-xs text-text-muted">Professional-Standard Risk Framework — Analytical Framework §9 Risk Assessment</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          Comprehensive risk registry across operational, financial, regulatory, and market dimensions. Each risk links to financial statement impact (IS/BS/CF) for audit-grade traceability.
        </p>

        {/* Summary stats */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-critical" />
            <span className="text-xs text-text-secondary">{totalCritical} Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-warning" />
            <span className="text-xs text-text-secondary">{totalHigh} High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-success" />
            <span className="text-xs text-text-secondary">{mitigatedPct}% Mitigated</span>
          </div>
          <span className="text-xs text-text-muted ml-2">{risks.length} risks total</span>
        </div>
      </div>

      {/* Domain Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {domains.map(d => <DomainSummaryCard key={d} domain={d} />)}
      </div>

      {/* Heat Map */}
      <div className="mb-6">
        <HeatMap />
      </div>

      {/* Domain Filter */}
      <div className="flex items-center gap-1 bg-surface-secondary rounded-xl p-1 mb-6">
        <button
          onClick={() => setFilterDomain('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            filterDomain === 'all'
              ? 'bg-ad-white text-text-primary shadow-card'
              : 'text-text-secondary hover:text-text-primary hover:bg-ad-white/50'
          }`}
        >
          All Risks
        </button>
        {domains.map(d => {
          const cfg = domainConfig[d]
          return (
            <button
              key={d}
              onClick={() => setFilterDomain(d)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                filterDomain === d
                  ? 'bg-ad-white text-text-primary shadow-card'
                  : 'text-text-secondary hover:text-text-primary hover:bg-ad-white/50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${cfg.bg}`} />
              <span className="hidden sm:inline">{cfg.label}</span>
            </button>
          )
        })}
      </div>

      {/* Risk Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRisks.map(risk => (
          <RiskCard key={risk.id} risk={risk} />
        ))}
      </div>
    </div>
  )
}
