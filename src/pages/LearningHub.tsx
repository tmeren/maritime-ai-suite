import { useState, useMemo } from 'react'
import {
  GraduationCap,
  BookOpen,
  Clock,
  Award,
  ChevronRight,
  CheckCircle2,
  Leaf,
  Ship,
  Battery,
  Link2,
  TrendingUp,
  Gavel,
  BatteryCharging,
  Cpu,
  Radio,
  Plane,
  DollarSign,
  BarChart3,
  Target,
  Briefcase,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type PathCategory = 'solution' | 'capability'
type CapabilityDomain = 'financial' | 'operational' | 'market' | 'strategic'

interface LearningModule {
  title: string
  duration: number // minutes
  progress: number // 0-100
}

interface LearningPath {
  id: string
  name: string
  subtitle: string
  category: PathCategory
  domain: CapabilityDomain
  icon: React.ReactNode
  modules: LearningModule[]
  description: string
}

// ─────────────────────────────────────────────────────────
// Seeded random for deterministic mock progress
// ─────────────────────────────────────────────────────────

function seededProgress(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return Math.round((x - Math.floor(x)) * 100)
}

// ─────────────────────────────────────────────────────────
// Mock Data — Learning Paths
// ─────────────────────────────────────────────────────────

const learningPaths: LearningPath[] = [
  // ── A. Solution Learning Paths (10) ──
  {
    id: 'sol-carbonwise',
    name: 'CarbonWise Navigator',
    subtitle: 'Carbon emissions tracking & compliance',
    category: 'solution',
    domain: 'operational',
    icon: <Leaf size={20} />,
    description: 'Master CarbonWise Navigator for real-time carbon emissions monitoring, IMO CII compliance tracking, and route optimization for fuel efficiency across the fleet.',
    modules: [
      { title: 'Overview & Use Case', duration: 15, progress: 100 },
      { title: 'Key Features & Capabilities', duration: 20, progress: 100 },
      { title: 'Analytical Framework & KPIs', duration: 25, progress: 100 },
      { title: 'Integration & Reporting', duration: 20, progress: 100 },
    ],
  },
  {
    id: 'sol-loadmaster',
    name: 'LoadMaster AI',
    subtitle: 'Container load optimization',
    category: 'solution',
    domain: 'operational',
    icon: <Ship size={20} />,
    description: 'Learn how LoadMaster AI optimizes container stowage planning, weight distribution, and vessel stability calculations to maximize throughput and safety.',
    modules: [
      { title: 'Overview & Use Case', duration: 15, progress: 100 },
      { title: 'Key Features & Capabilities', duration: 20, progress: 100 },
      { title: 'Analytical Framework & KPIs', duration: 25, progress: 100 },
      { title: 'Integration & Reporting', duration: 20, progress: 100 },
    ],
  },
  {
    id: 'sol-lithium',
    name: 'Lithium-Sentinel AI',
    subtitle: 'Battery safety monitoring',
    category: 'solution',
    domain: 'operational',
    icon: <Battery size={20} />,
    description: 'Understand Lithium-Sentinel AI for real-time State-of-Charge monitoring, thermal runaway detection, and IMDG Class 9 compliance for EV battery cargo.',
    modules: [
      { title: 'Overview & Use Case', duration: 15, progress: seededProgress(31) },
      { title: 'Key Features & Capabilities', duration: 20, progress: seededProgress(32) },
      { title: 'Analytical Framework & KPIs', duration: 25, progress: seededProgress(33) },
      { title: 'Integration & Reporting', duration: 20, progress: seededProgress(34) },
    ],
  },
  {
    id: 'sol-vinchain',
    name: 'VIN-Chain Traceability',
    subtitle: 'Vehicle logistics tracking',
    category: 'solution',
    domain: 'market',
    icon: <Link2 size={20} />,
    description: 'Explore VIN-Chain Traceability for end-to-end vehicle logistics tracking, blockchain-based provenance verification, and customs documentation automation.',
    modules: [
      { title: 'Overview & Use Case', duration: 15, progress: seededProgress(41) },
      { title: 'Key Features & Capabilities', duration: 20, progress: seededProgress(42) },
      { title: 'Analytical Framework & KPIs', duration: 25, progress: seededProgress(43) },
      { title: 'Integration & Reporting', duration: 20, progress: seededProgress(44) },
    ],
  },
  {
    id: 'sol-tradeflow',
    name: 'Trade-Flow Oracle',
    subtitle: 'Trade corridor analytics',
    category: 'solution',
    domain: 'market',
    icon: <TrendingUp size={20} />,
    description: 'Master Trade-Flow Oracle for predictive trade corridor analysis, demand forecasting, and competitive route intelligence across Asia-GCC-Europe corridors.',
    modules: [
      { title: 'Overview & Use Case', duration: 15, progress: seededProgress(51) },
      { title: 'Key Features & Capabilities', duration: 20, progress: seededProgress(52) },
      { title: 'Analytical Framework & KPIs', duration: 25, progress: seededProgress(53) },
      { title: 'Integration & Reporting', duration: 20, progress: seededProgress(54) },
    ],
  },
  {
    id: 'sol-slotbid',
    name: 'Slot-Bid AI',
    subtitle: 'Berth slot allocation',
    category: 'solution',
    domain: 'financial',
    icon: <Gavel size={20} />,
    description: 'Learn how Slot-Bid AI uses dynamic pricing and auction mechanics to optimize berth slot allocation, maximizing port revenue and vessel turnaround efficiency.',
    modules: [
      { title: 'Overview & Use Case', duration: 15, progress: seededProgress(61) },
      { title: 'Key Features & Capabilities', duration: 20, progress: seededProgress(62) },
      { title: 'Analytical Framework & KPIs', duration: 25, progress: seededProgress(63) },
      { title: 'Integration & Reporting', duration: 20, progress: seededProgress(64) },
    ],
  },
  {
    id: 'sol-batteryhealth',
    name: 'Battery-Logistics Health Guard',
    subtitle: 'Battery health monitoring',
    category: 'solution',
    domain: 'operational',
    icon: <BatteryCharging size={20} />,
    description: 'Understand Battery-Logistics Health Guard for continuous battery degradation monitoring, predictive maintenance scheduling, and safety compliance across logistics chains.',
    modules: [
      { title: 'Overview & Use Case', duration: 15, progress: seededProgress(71) },
      { title: 'Key Features & Capabilities', duration: 20, progress: seededProgress(72) },
      { title: 'Analytical Framework & KPIs', duration: 25, progress: seededProgress(73) },
      { title: 'Integration & Reporting', duration: 20, progress: seededProgress(74) },
    ],
  },
  {
    id: 'sol-stevedore',
    name: 'Stevedore-AI Orchestrator',
    subtitle: 'Terminal workforce optimization',
    category: 'solution',
    domain: 'operational',
    icon: <Cpu size={20} />,
    description: 'Master Stevedore-AI Orchestrator for AI-driven workforce scheduling, equipment allocation, and real-time terminal operations management.',
    modules: [
      { title: 'Overview & Use Case', duration: 15, progress: seededProgress(81) },
      { title: 'Key Features & Capabilities', duration: 20, progress: seededProgress(82) },
      { title: 'Analytical Framework & KPIs', duration: 25, progress: seededProgress(83) },
      { title: 'Integration & Reporting', duration: 20, progress: seededProgress(84) },
    ],
  },
  {
    id: 'sol-portfota',
    name: 'Port-FOTA Hub',
    subtitle: 'Fleet OTA updates',
    category: 'solution',
    domain: 'strategic',
    icon: <Radio size={20} />,
    description: 'Explore Port-FOTA Hub for fleet-wide over-the-air firmware updates, device management, and IoT sensor network orchestration across port infrastructure.',
    modules: [
      { title: 'Overview & Use Case', duration: 15, progress: 100 },
      { title: 'Key Features & Capabilities', duration: 20, progress: 100 },
      { title: 'Analytical Framework & KPIs', duration: 25, progress: 100 },
      { title: 'Integration & Reporting', duration: 20, progress: 100 },
    ],
  },
  {
    id: 'sol-skylink',
    name: 'Sky-Link Logistics',
    subtitle: 'Drone delivery coordination',
    category: 'solution',
    domain: 'strategic',
    icon: <Plane size={20} />,
    description: 'Learn Sky-Link Logistics for autonomous drone delivery coordination, airspace management, and last-mile logistics optimization for port-to-warehouse operations.',
    modules: [
      { title: 'Overview & Use Case', duration: 15, progress: seededProgress(101) },
      { title: 'Key Features & Capabilities', duration: 20, progress: seededProgress(102) },
      { title: 'Analytical Framework & KPIs', duration: 25, progress: seededProgress(103) },
      { title: 'Integration & Reporting', duration: 20, progress: seededProgress(104) },
    ],
  },

  // ── B. Capability Framework Paths (4) ──
  {
    id: 'cap-financial',
    name: 'Financial Statement Analysis',
    subtitle: 'IS/BS/CF fundamentals for port operations',
    category: 'capability',
    domain: 'financial',
    icon: <DollarSign size={20} />,
    description: 'Build foundational competency in Income Statement, Balance Sheet, and Cash Flow analysis specifically applied to maritime port operations and logistics enterprises.',
    modules: [
      { title: 'Core Concepts', duration: 30, progress: seededProgress(201) },
      { title: 'Applied Analysis', duration: 25, progress: seededProgress(202) },
      { title: 'Certification Assessment', duration: 20, progress: seededProgress(203) },
    ],
  },
  {
    id: 'cap-operational',
    name: 'Operational KPI Mastery',
    subtitle: 'Throughput, utilization, berth metrics',
    category: 'capability',
    domain: 'operational',
    icon: <BarChart3 size={20} />,
    description: 'Master operational KPIs including TEU throughput, berth utilization, vessel turnaround time, crane productivity, and yard density metrics for port performance management.',
    modules: [
      { title: 'Core Concepts', duration: 30, progress: seededProgress(211) },
      { title: 'Applied Analysis', duration: 25, progress: seededProgress(212) },
      { title: 'Certification Assessment', duration: 20, progress: seededProgress(213) },
    ],
  },
  {
    id: 'cap-market',
    name: 'Market Intelligence Fundamentals',
    subtitle: 'Trade corridors, competitive positioning',
    category: 'capability',
    domain: 'market',
    icon: <Target size={20} />,
    description: 'Develop market intelligence capabilities including trade corridor analysis, competitive benchmarking, pricing power assessment, and demand forecasting methodologies.',
    modules: [
      { title: 'Core Concepts', duration: 30, progress: seededProgress(221) },
      { title: 'Applied Analysis', duration: 25, progress: seededProgress(222) },
      { title: 'Certification Assessment', duration: 20, progress: seededProgress(223) },
    ],
  },
  {
    id: 'cap-strategic',
    name: 'Strategic Planning & Value Creation',
    subtitle: 'CAPEX, M&A, ESG frameworks',
    category: 'capability',
    domain: 'strategic',
    icon: <Briefcase size={20} />,
    description: 'Learn strategic planning frameworks including capital allocation, M&A synergy assessment, ESG integration, and value creation roadmap development for maritime enterprises.',
    modules: [
      { title: 'Core Concepts', duration: 30, progress: seededProgress(231) },
      { title: 'Applied Analysis', duration: 25, progress: seededProgress(232) },
      { title: 'Certification Assessment', duration: 20, progress: seededProgress(233) },
    ],
  },
]

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

const domainConfig: Record<CapabilityDomain, { label: string; color: string; bg: string; bgLight: string }> = {
  financial: { label: 'Financial', color: 'text-fs-income', bg: 'bg-fs-income', bgLight: 'bg-fs-income/10' },
  operational: { label: 'Operational', color: 'text-info', bg: 'bg-info', bgLight: 'bg-info/10' },
  market: { label: 'Market', color: 'text-success', bg: 'bg-success', bgLight: 'bg-success/10' },
  strategic: { label: 'Strategic', color: 'text-ad-red', bg: 'bg-ad-red', bgLight: 'bg-ad-red/10' },
}

function getPathProgress(path: LearningPath): number {
  if (path.modules.length === 0) return 0
  const total = path.modules.reduce((sum, m) => sum + m.progress, 0)
  return Math.round(total / path.modules.length)
}

function getTotalDuration(path: LearningPath): number {
  return path.modules.reduce((sum, m) => sum + m.duration, 0)
}

function isPathComplete(path: LearningPath): boolean {
  return path.modules.every(m => m.progress === 100)
}

// ─────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────

function PathCard({
  path,
  isSelected,
  onClick,
}: {
  path: LearningPath
  isSelected: boolean
  onClick: () => void
}) {
  const progress = getPathProgress(path)
  const complete = isPathComplete(path)
  const domain = domainConfig[path.domain]
  const totalMin = getTotalDuration(path)

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
        isSelected
          ? 'bg-ad-white border-ad-red/30 shadow-card-hover'
          : 'bg-ad-white border-border hover:shadow-card-hover hover:border-border'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg ${domain.bgLight} flex items-center justify-center shrink-0 ${domain.color}`}>
          {path.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-text-primary truncate">{path.name}</h3>
            {complete && (
              <Award size={14} className="text-warning shrink-0" />
            )}
          </div>
          <p className="text-[11px] text-text-muted truncate">{path.subtitle}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${domain.bg}`}>
              {domain.label}
            </span>
            <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
              path.category === 'solution'
                ? 'bg-surface-secondary text-text-secondary'
                : 'bg-warning/10 text-warning'
            }`}>
              {path.category === 'solution' ? 'Solution' : 'Capability'}
            </span>
            <div className="flex items-center gap-1 ml-auto">
              <Clock size={10} className="text-text-muted" />
              <span className="text-[10px] text-text-muted">{totalMin} min</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-2.5 flex items-center gap-2">
            <div className="flex-1 bg-surface-secondary rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  complete ? 'bg-success' : progress > 0 ? 'bg-ad-red' : 'bg-surface-secondary'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] font-medium text-text-muted shrink-0">{progress}%</span>
          </div>
        </div>
        <ChevronRight size={16} className={`shrink-0 mt-1 transition-colors ${isSelected ? 'text-ad-red' : 'text-text-muted'}`} />
      </div>
    </button>
  )
}

function PathDetail({ path }: { path: LearningPath }) {
  const progress = getPathProgress(path)
  const complete = isPathComplete(path)
  const domain = domainConfig[path.domain]
  const totalMin = getTotalDuration(path)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-14 h-14 rounded-xl ${domain.bgLight} flex items-center justify-center shrink-0 ${domain.color}`}>
            {path.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-text-primary">{path.name}</h2>
              {complete && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-bold">
                  <Award size={12} />
                  Certificate Earned
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted">{path.subtitle}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${domain.bg}`}>
                {domain.label}
              </span>
              <div className="flex items-center gap-1">
                <Clock size={11} className="text-text-muted" />
                <span className="text-[11px] text-text-muted">{totalMin} min total</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen size={11} className="text-text-muted" />
                <span className="text-[11px] text-text-muted">{path.modules.length} modules</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed mb-4">{path.description}</p>

        {/* Overall progress */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-surface-secondary rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                complete ? 'bg-success' : 'bg-ad-red'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-text-primary shrink-0">{progress}%</span>
        </div>
      </div>

      {/* Module List */}
      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Modules</h3>
        <div className="space-y-3">
          {path.modules.map((mod, i) => {
            const modComplete = mod.progress === 100
            return (
              <div
                key={i}
                className="bg-surface-secondary/50 rounded-xl p-4 border border-border-light hover:border-border transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold ${
                    modComplete
                      ? 'bg-success/10 text-success'
                      : mod.progress > 0
                        ? 'bg-ad-red/10 text-ad-red'
                        : 'bg-surface-secondary text-text-muted'
                  }`}>
                    {modComplete ? <CheckCircle2 size={18} /> : i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-text-primary">
                        Module {i + 1}: {mod.title}
                      </h4>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <Clock size={11} className="text-text-muted" />
                        <span className="text-[11px] text-text-muted">{mod.duration} min</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-surface-secondary rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            modComplete ? 'bg-success' : mod.progress > 0 ? 'bg-ad-red' : 'bg-surface-secondary'
                          }`}
                          style={{ width: `${mod.progress}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-medium shrink-0 ${
                        modComplete ? 'text-success' : 'text-text-muted'
                      }`}>
                        {mod.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Certificate banner for completed paths */}
      {complete && (
        <div className="p-4 border-t border-border bg-warning/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
              <Award size={20} className="text-warning" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary">Professional Certificate</h4>
              <p className="text-[11px] text-text-muted">You have completed all modules in this learning path.</p>
            </div>
            <button className="ml-auto px-3 py-1.5 bg-warning text-white text-xs font-semibold rounded-lg hover:bg-warning/90 transition-colors shrink-0">
              View Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────

export default function LearningHub() {
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<PathCategory | 'all'>('all')
  const [filterDomain, setFilterDomain] = useState<CapabilityDomain | 'all'>('all')

  const filteredPaths = useMemo(() => {
    return learningPaths.filter(p => {
      if (filterCategory !== 'all' && p.category !== filterCategory) return false
      if (filterDomain !== 'all' && p.domain !== filterDomain) return false
      return true
    })
  }, [filterCategory, filterDomain])

  const selectedPath = learningPaths.find(p => p.id === selectedPathId) || null

  const totalPaths = learningPaths.length
  const completedPaths = learningPaths.filter(isPathComplete).length
  const overallProgress = Math.round(
    learningPaths.reduce((sum, p) => sum + getPathProgress(p), 0) / totalPaths
  )
  const totalHours = Math.round(learningPaths.reduce((sum, p) => sum + getTotalDuration(p), 0) / 60)

  const domains: CapabilityDomain[] = ['financial', 'operational', 'market', 'strategic']

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-ad-red/10 flex items-center justify-center">
            <GraduationCap size={22} className="text-ad-red" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary font-serif">Learning Hub</h1>
            <p className="text-xs text-text-muted">Solution & Capability Learning Paths — Professional Development Platform</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          Structured learning programs across {totalPaths} paths covering all 10 Port AI Solutions and 4 capability framework domains.
          Complete modules to earn professional certificates and build domain expertise.
        </p>

        {/* Summary Stats */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-ad-red" />
            <span className="text-xs text-text-secondary">{totalPaths} Paths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-success" />
            <span className="text-xs text-text-secondary">{completedPaths} Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-warning" />
            <span className="text-xs text-text-secondary">{completedPaths} Certificates</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-text-muted" />
            <span className="text-xs text-text-secondary">{totalHours}h content</span>
          </div>
          <span className="text-xs text-text-muted ml-2">{overallProgress}% overall progress</span>
        </div>
      </div>

      {/* Workspace Layout */}
      <div className="flex gap-4" style={{ height: 'calc(100vh - 300px)', minHeight: 520 }}>
        {/* Left Panel — Path List */}
        <div className="w-[380px] bg-ad-white rounded-xl border border-border flex flex-col shrink-0 overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Learning Paths</h2>

            {/* Category filter */}
            <div className="flex gap-1 mb-2">
              {(['all', 'solution', 'capability'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => { setFilterCategory(cat); setSelectedPathId(null) }}
                  className={`text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                    filterCategory === cat
                      ? 'bg-ad-red text-white'
                      : 'bg-surface-secondary text-text-secondary hover:bg-surface'
                  }`}
                >
                  {cat === 'all' ? `All (${learningPaths.length})` :
                   cat === 'solution' ? `Solutions (${learningPaths.filter(p => p.category === 'solution').length})` :
                   `Capability (${learningPaths.filter(p => p.category === 'capability').length})`}
                </button>
              ))}
            </div>

            {/* Domain filter */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => { setFilterDomain('all'); setSelectedPathId(null) }}
                className={`text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                  filterDomain === 'all'
                    ? 'bg-surface text-text-primary border border-border'
                    : 'bg-surface-secondary text-text-secondary hover:bg-surface'
                }`}
              >
                All domains
              </button>
              {domains.map(d => {
                const cfg = domainConfig[d]
                return (
                  <button
                    key={d}
                    onClick={() => { setFilterDomain(d); setSelectedPathId(null) }}
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 ${
                      filterDomain === d
                        ? 'bg-surface text-text-primary border border-border'
                        : 'bg-surface-secondary text-text-secondary hover:bg-surface'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.bg}`} />
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Path List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredPaths.length > 0 ? (
              filteredPaths.map(path => (
                <PathCard
                  key={path.id}
                  path={path}
                  isSelected={selectedPathId === path.id}
                  onClick={() => setSelectedPathId(path.id)}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-xs text-text-muted">
                No paths match the selected filters.
              </div>
            )}
          </div>
        </div>

        {/* Right Panel — Path Detail */}
        <div className="flex-1 bg-ad-white rounded-xl border border-border flex flex-col overflow-hidden min-w-0">
          {selectedPath ? (
            <PathDetail path={selectedPath} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-surface-secondary flex items-center justify-center mx-auto mb-4">
                  <GraduationCap size={28} className="text-text-muted" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">Select a Learning Path</h3>
                <p className="text-xs text-text-muted max-w-xs">
                  Choose a path from the left panel to view modules, track progress, and earn certificates.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
