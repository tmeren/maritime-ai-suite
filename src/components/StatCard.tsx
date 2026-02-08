import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export type FinancialStatement = 'IS' | 'BS' | 'CF'

export interface StatCardProps {
  title: string
  value: string
  unit?: string
  trend?: 'up' | 'down' | 'flat'
  trendValue?: string
  financialStatement: FinancialStatement
  subtitle?: string
}

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

export function StatCard({ title, value, unit, trend = 'flat', trendValue, financialStatement, subtitle }: StatCardProps) {
  const badge = fsBadgeConfig[financialStatement]
  const trendInfo = trendConfig[trend]
  const TrendIcon = trendInfo.icon

  return (
    <div className="bg-ad-white rounded-xl border border-border p-4 hover:shadow-[var(--shadow-card-hover)] transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-[13px] font-medium text-text-secondary leading-tight">{title}</h4>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.className}`}>
          {badge.label}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-2xl font-bold text-text-primary tracking-tight">{value}</span>
        {unit && <span className="text-sm text-text-muted font-medium">{unit}</span>}
      </div>
      {subtitle && <p className="text-[11px] text-text-muted mb-2">{subtitle}</p>}
      {trendValue && (
        <div className={`flex items-center gap-1 text-xs ${trendInfo.color}`}>
          <TrendIcon size={14} />
          <span className="font-medium">{trendValue}</span>
        </div>
      )}
    </div>
  )
}
