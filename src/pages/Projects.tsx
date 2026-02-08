import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  FolderKanban,
  Calendar,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Pause,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Types & Data
// ─────────────────────────────────────────────────────────────

type ProjectStatus = 'active' | 'at-risk' | 'on-hold' | 'completed'

interface Project {
  id: string
  name: string
  module: string
  modulePath: string
  status: ProjectStatus
  progress: number
  budget: string
  spent: string
  startDate: string
  targetDate: string
  lead: string
  team: number
  description: string
}

const statusConfig: Record<ProjectStatus, { label: string; icon: React.ReactNode; className: string }> = {
  active:    { label: 'Active',    icon: <Clock size={12} />,          className: 'bg-blue-100 text-blue-700 border-blue-300' },
  'at-risk': { label: 'At Risk',  icon: <AlertTriangle size={12} />,  className: 'bg-amber-100 text-amber-700 border-amber-300' },
  'on-hold': { label: 'On Hold',  icon: <Pause size={12} />,          className: 'bg-gray-100 text-gray-600 border-gray-300' },
  completed: { label: 'Completed',icon: <CheckCircle size={12} />,    className: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
}

const projects: Project[] = [
  { id: 'p1', name: 'Trade-Flow AI Engine v2.0', module: 'Trade-Flow Oracle', modulePath: '/modules/trade-flow-oracle', status: 'active', progress: 72, budget: 'AED 4.2M', spent: 'AED 3.0M', startDate: '2025-09-01', targetDate: '2026-06-30', lead: 'Ahmed Al-Rashid', team: 8, description: 'Upgrade predictive routing engine with real-time tariff intelligence and multi-modal optimization.' },
  { id: 'p2', name: 'VIN-Chain Blockchain Migration', module: 'VIN-Chain', modulePath: '/modules/vin-chain', status: 'active', progress: 58, budget: 'AED 2.8M', spent: 'AED 1.6M', startDate: '2025-11-15', targetDate: '2026-08-31', lead: 'Sarah Chen', team: 6, description: 'Migrate provenance records to Hyperledger Fabric for immutable vehicle lifecycle tracking.' },
  { id: 'p3', name: 'Dynamic Berth Pricing MVP', module: 'Slot-Bid AI', modulePath: '/modules/slot-bid', status: 'completed', progress: 100, budget: 'AED 1.5M', spent: 'AED 1.4M', startDate: '2025-06-01', targetDate: '2025-12-31', lead: 'Omar Khalid', team: 5, description: 'ML-driven dynamic pricing engine for berth allocation auctions with demand forecasting.' },
  { id: 'p4', name: 'Thermal Monitoring Network Expansion', module: 'Battery-Health', modulePath: '/modules/battery-health', status: 'at-risk', progress: 41, budget: 'AED 3.6M', spent: 'AED 2.1M', startDate: '2025-10-01', targetDate: '2026-05-31', lead: 'Li Wei', team: 7, description: 'Deploy 200 additional thermal sensors across zones B-D with edge computing infrastructure.' },
  { id: 'p5', name: 'Autonomous Crane Orchestration', module: 'Stevedore-AI', modulePath: '/modules/stevedore-ai', status: 'active', progress: 35, budget: 'AED 8.2M', spent: 'AED 2.9M', startDate: '2026-01-15', targetDate: '2026-12-31', lead: 'Raj Patel', team: 12, description: 'Full autonomous STS crane control with computer vision and predictive load balancing.' },
  { id: 'p6', name: 'Drone Delivery Phase 2', module: 'Sky-Link', modulePath: '/modules/sky-link', status: 'active', progress: 64, budget: 'AED 5.1M', spent: 'AED 3.3M', startDate: '2025-08-01', targetDate: '2026-04-30', lead: 'Maria Santos', team: 9, description: 'Expand drone fleet to 120 units with night operations capability and extended range.' },
  { id: 'p7', name: 'Digital-Twin Real-Time Sync', module: 'Digital-Twin Port', modulePath: '/modules/digital-twin', status: 'on-hold', progress: 22, budget: 'AED 6.4M', spent: 'AED 1.4M', startDate: '2025-12-01', targetDate: '2026-09-30', lead: 'James O\'Brien', team: 10, description: 'Sub-second synchronization between physical port operations and digital twin simulation engine.' },
  { id: 'p8', name: 'Cruise Terminal AI Concierge', module: 'Cruise-Turnaround', modulePath: '/modules/cruise-turnaround', status: 'active', progress: 88, budget: 'AED 1.8M', spent: 'AED 1.6M', startDate: '2025-07-01', targetDate: '2026-03-15', lead: 'Fatima Al-Sayegh', team: 4, description: 'AI-powered passenger flow optimization with personalized shore excursion recommendations.' },
]

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function Projects() {
  const activeCount = projects.filter(p => p.status === 'active').length
  const totalBudget = projects.reduce((s, p) => s + parseFloat(p.budget.replace(/[^0-9.]/g, '')), 0)
  const totalSpent = projects.reduce((s, p) => s + parseFloat(p.spent.replace(/[^0-9.]/g, '')), 0)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
            <FolderKanban className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary font-serif">Projects</h1>
            <p className="text-sm text-text-secondary">AD Ports AI Implementation Portfolio</p>
          </div>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-ad-white rounded-xl border border-border p-4">
          <div className="text-xs text-text-muted mb-1">Active Projects</div>
          <div className="text-lg font-bold text-text-primary">{activeCount}</div>
        </div>
        <div className="bg-ad-white rounded-xl border border-border p-4">
          <div className="text-xs text-text-muted mb-1">Total Budget</div>
          <div className="text-lg font-bold text-text-primary">AED {totalBudget.toFixed(1)}M</div>
        </div>
        <div className="bg-ad-white rounded-xl border border-border p-4">
          <div className="text-xs text-text-muted mb-1">Total Spent</div>
          <div className="text-lg font-bold text-text-primary">AED {totalSpent.toFixed(1)}M</div>
        </div>
        <div className="bg-ad-white rounded-xl border border-border p-4">
          <div className="text-xs text-text-muted mb-1">Budget Utilization</div>
          <div className="text-lg font-bold text-text-primary">{Math.round((totalSpent / totalBudget) * 100)}%</div>
        </div>
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {projects.map((project) => {
          const status = statusConfig[project.status]
          return (
            <div key={project.id} className="bg-ad-white rounded-xl border border-border p-5 hover:shadow-[var(--shadow-card-hover)] transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{project.name}</h3>
                  <Link to={project.modulePath} className="text-xs text-ad-red hover:underline">{project.module}</Link>
                </div>
                <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${status.className}`}>
                  {status.icon} {status.label}
                </span>
              </div>
              <p className="text-xs text-text-muted mb-4 leading-relaxed">{project.description}</p>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-text-muted">Progress</span>
                  <span className="font-medium text-text-primary">{project.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      project.status === 'at-risk' ? 'bg-warning' : project.status === 'completed' ? 'bg-success' : 'bg-ad-red'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Meta Row */}
              <div className="flex items-center gap-5 text-xs text-text-muted">
                <span className="flex items-center gap-1"><DollarSign size={12} /> {project.budget} budget</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {project.targetDate}</span>
                <span className="flex items-center gap-1"><Users size={12} /> {project.team} members</span>
                <span className="ml-auto text-text-secondary font-medium">{project.lead}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
