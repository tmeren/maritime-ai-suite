import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Lightbulb, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { ModuleConfig } from '../../data/moduleKpis'
import type { FinancialStatement } from '../../components/StatCard'

const fsBadgeConfig: Record<FinancialStatement, { label: string; className: string }> = {
  IS: { label: 'IS', className: 'bg-fs-income text-white' },
  BS: { label: 'BS', className: 'bg-fs-balance text-white' },
  CF: { label: 'CF', className: 'bg-fs-cashflow text-white' },
}

const trendConfig = {
  up: { icon: TrendingUp, color: 'text-success' },
  down: { icon: TrendingDown, color: 'text-critical' },
  flat: { icon: Minus, color: 'text-text-muted' },
}

interface ModulePageProps {
  module: ModuleConfig
  icon: React.ReactNode
}

export default function ModulePage({ module, icon }: ModulePageProps) {
  const navigate = useNavigate()

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.gradient} flex items-center justify-center shadow-sm`}>
              {icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary font-serif">{module.name}</h1>
              <p className="text-sm text-text-secondary">{module.tagline}</p>
            </div>
          </div>
          <Link
            to={`/solutions/${module.slug}`}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-secondary transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Live Demo
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {module.kpis.map((kpi) => {
          const badge = fsBadgeConfig[kpi.financialStatement]
          const trendInfo = trendConfig[kpi.trend]
          const TrendIcon = trendInfo.icon
          const drillUrl = kpi.financialLineKey
            ? `/financial-model?statement=${kpi.financialStatement}&line=${kpi.financialLineKey}`
            : '/financial-model'

          return (
            <div key={kpi.title} className="bg-ad-white rounded-xl border border-border p-5 hover:shadow-[var(--shadow-card-hover)] transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-sm font-medium text-text-secondary">{kpi.title}</h4>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.className}`}>
                  {badge.label}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-text-primary tracking-tight">{kpi.value}</span>
                {kpi.unit && <span className="text-sm text-text-muted font-medium">{kpi.unit}</span>}
              </div>
              {kpi.subtitle && <p className="text-[11px] text-text-muted mb-2">{kpi.subtitle}</p>}
              <div className="flex items-center justify-between mt-3">
                <div className={`flex items-center gap-1 text-xs ${trendInfo.color}`}>
                  <TrendIcon size={14} />
                  <span className="font-medium">{kpi.trendValue}</span>
                </div>
                <Link
                  to={drillUrl}
                  className="flex items-center gap-1 text-[11px] text-text-muted hover:text-text-primary transition-colors"
                >
                  View in Financial Model <ExternalLink size={10} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Module Insights */}
      <div className="bg-ad-white rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary flex items-center gap-2 mb-4">
          <Lightbulb size={18} className="text-warning" /> AI-Generated Insights
        </h3>
        <div className="space-y-3">
          {module.insights.map((insight, idx) => (
            <div key={idx} className="flex gap-3 p-3 rounded-lg bg-surface-secondary/50">
              <span className="shrink-0 w-6 h-6 rounded-full bg-warning/10 text-warning flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </span>
              <p className="text-sm text-text-secondary leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
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
          to="/synergy-map"
          className="text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
        >
          Synergy Map <ExternalLink size={10} />
        </Link>
      </div>
    </div>
  )
}
