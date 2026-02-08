import { useState } from 'react'
import {
  DollarSign,
  Settings,
  BarChart3,
  Target,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Anchor,
  Activity,
} from 'lucide-react'
import { StatCard, type FinancialStatement } from '../components/StatCard'

interface KpiItem {
  title: string
  value: string
  unit?: string
  trend: 'up' | 'down' | 'flat'
  trendValue: string
  financialStatement: FinancialStatement
  subtitle?: string
}

interface Domain {
  id: string
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
  summary: string
  kpis: KpiItem[]
}

const domains: Domain[] = [
  {
    id: 'financial',
    label: 'Financial',
    icon: <DollarSign size={22} />,
    color: 'text-fs-income',
    bgColor: 'bg-info-light',
    summary: 'Revenue, profitability & capital structure',
    kpis: [
      { title: 'Revenue Waterfall', value: 'AED 2.4B', trend: 'up', trendValue: '+8.2% YoY', financialStatement: 'IS', subtitle: 'Segmented by route, customer, cargo type' },
      { title: 'EBITDA Bridge', value: 'AED 890M', trend: 'up', trendValue: '+12.4% YoY', financialStatement: 'IS', subtitle: 'Volume → Price → Cost → EBITDA walk' },
      { title: 'Cost Structure', value: '62%', unit: 'of Rev', trend: 'down', trendValue: '-1.8pp', financialStatement: 'IS', subtitle: 'Fuel 48% · Operations 32% · G&A 20%' },
      { title: 'Route-Level P&L', value: '14', unit: 'routes', trend: 'flat', trendValue: '12 profitable', financialStatement: 'IS', subtitle: 'Per-corridor contribution margin' },
      { title: 'Leverage & Returns', value: '2.1x', unit: 'D/EBITDA', trend: 'down', trendValue: '-0.3x YoY', financialStatement: 'BS', subtitle: 'ROCE 11.4% · ROE 15.2%' },
      { title: 'Cash Flow', value: 'AED 520M', trend: 'up', trendValue: '+15.7% YoY', financialStatement: 'CF', subtitle: 'Operating CF − CAPEX = Free Cash Flow' },
    ],
  },
  {
    id: 'operational',
    label: 'Operational',
    icon: <Settings size={22} />,
    color: 'text-success',
    bgColor: 'bg-success-light',
    summary: 'Fleet, ports & intermodal network',
    kpis: [
      { title: 'Fleet Profile', value: '18', unit: 'vessels', trend: 'up', trendValue: '+2 YoY', financialStatement: 'BS', subtitle: '5,240 lnm avg capacity · 6.8yr avg age' },
      { title: 'Vessel Utilization', value: '72%', trend: 'up', trendValue: '+4.2pp YoY', financialStatement: 'IS', subtitle: 'Revenue lnm / Available lnm' },
      { title: 'Port Throughput', value: '3.8M', unit: 'TEU', trend: 'up', trendValue: '+6.1% YoY', financialStatement: 'IS', subtitle: 'Container + RoRo + Breakbulk volumes' },
      { title: 'Intermodal Network', value: '52', unit: 'trains/wk', trend: 'up', trendValue: '+8 trains YoY', financialStatement: 'BS', subtitle: '5 rail connections · 12 inland depots' },
      { title: 'Workforce Metrics', value: '1,240', unit: 'FTE', trend: 'flat', trendValue: 'Rev/FTE: AED 1.9M', financialStatement: 'IS', subtitle: 'Sea 48% · Port 35% · Admin 17%' },
      { title: 'Capacity Planning', value: '85%', trend: 'up', trendValue: '+3pp YoY', financialStatement: 'BS', subtitle: 'Peak season headroom: 15%' },
    ],
  },
  {
    id: 'market',
    label: 'Market',
    icon: <BarChart3 size={22} />,
    color: 'text-warning',
    bgColor: 'bg-warning-light',
    summary: 'Trade corridors, competition & pricing',
    kpis: [
      { title: 'Trade Corridor Analysis', value: '22.4M', unit: 'tons', trend: 'up', trendValue: '+5.7% CAGR', financialStatement: 'IS', subtitle: '14 target countries · 1.8x GDP multiplier' },
      { title: 'Modal Share', value: '18%', unit: 'RoRo', trend: 'up', trendValue: '+2.1pp', financialStatement: 'IS', subtitle: 'vs Road 62% · Rail 15% · Conventional 5%' },
      { title: 'Competitive Positioning', value: '#1', trend: 'flat', trendValue: '58% market share', financialStatement: 'IS', subtitle: '3-player market · 6,500 lnm total capacity' },
      { title: 'Pricing Analysis', value: '+9%', unit: 'premium', trend: 'up', trendValue: 'vs competitor avg', financialStatement: 'IS', subtitle: 'Justified by frequency, reliability, port access' },
      { title: 'Growth Driver Assessment', value: '6.3%', unit: 'CAGR', trend: 'up', trendValue: 'Base case', financialStatement: 'IS', subtitle: 'Trade liberalization · E-commerce · Nearshoring' },
      { title: 'Sector Breakdown', value: '5', unit: 'sectors', trend: 'flat', trendValue: 'Textiles 28%', financialStatement: 'IS', subtitle: 'Automotive · Textiles · FMCG · Industrial · Agri' },
    ],
  },
  {
    id: 'strategic',
    label: 'Strategic',
    icon: <Target size={22} />,
    color: 'text-ad-red',
    bgColor: 'bg-critical-light',
    summary: 'Value creation, CAPEX & capabilities',
    kpis: [
      { title: 'Value Creation Bridge', value: 'AED 890M', unit: '→ 1.4B', trend: 'up', trendValue: '+57% plan', financialStatement: 'IS', subtitle: 'Volume + Price + Efficiency + New Routes' },
      { title: 'CAPEX Planning', value: 'AED 620M', trend: 'flat', trendValue: '3-year program', financialStatement: 'CF', subtitle: '3 vessel upgrades · 2 port expansions' },
      { title: 'Scenario Projection', value: '3', unit: 'scenarios', trend: 'flat', trendValue: 'Base · Bull · Bear', financialStatement: 'IS', subtitle: 'Monte Carlo simulation · 10,000 iterations' },
      { title: 'Capability Maturity', value: '3.2', unit: '/ 5.0', trend: 'up', trendValue: '+0.4 YoY', financialStatement: 'BS', subtitle: '8 capability areas · 24 sub-capabilities assessed' },
      { title: 'BiPM Dashboard', value: '78%', trend: 'up', trendValue: '+8pp YoY', financialStatement: 'BS', subtitle: 'Vision · Domain · Enablers maturity layers' },
      { title: 'KPI Priority Matrix', value: '24', unit: 'KPIs', trend: 'flat', trendValue: '6 critical path', financialStatement: 'IS', subtitle: 'Forecasting 86% · Standardization 73% priority' },
    ],
  },
]

export function Home() {
  const [expandedDomain, setExpandedDomain] = useState<string | null>('financial')

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-ad-red/10 flex items-center justify-center">
            <Anchor size={22} className="text-ad-red" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary font-serif">Executive Dashboard</h1>
            <p className="text-sm text-text-secondary">AD Ports Group — Maritime Intelligence Platform</p>
          </div>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-ad-white rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-info-light flex items-center justify-center">
            <DollarSign size={20} className="text-fs-income" />
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary">AED 2.4B</div>
            <div className="text-xs text-text-muted">Revenue</div>
          </div>
        </div>
        <div className="bg-ad-white rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success-light flex items-center justify-center">
            <Activity size={20} className="text-success" />
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary">72%</div>
            <div className="text-xs text-text-muted">Fleet Utilization</div>
          </div>
        </div>
        <div className="bg-ad-white rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning-light flex items-center justify-center">
            <TrendingUp size={20} className="text-warning" />
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary">58%</div>
            <div className="text-xs text-text-muted">Market Share</div>
          </div>
        </div>
        <div className="bg-ad-white rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-critical-light flex items-center justify-center">
            <Target size={20} className="text-ad-red" />
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary">3.2 / 5.0</div>
            <div className="text-xs text-text-muted">Capability Maturity</div>
          </div>
        </div>
      </div>

      {/* Domain Cards */}
      <div className="space-y-4">
        {domains.map((domain) => {
          const isExpanded = expandedDomain === domain.id
          return (
            <div key={domain.id} className="bg-ad-white rounded-xl border border-border overflow-hidden">
              {/* Domain Header */}
              <button
                onClick={() => setExpandedDomain(isExpanded ? null : domain.id)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-surface-secondary/50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg ${domain.bgColor} flex items-center justify-center`}>
                  <span className={domain.color}>{domain.icon}</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-base font-semibold text-text-primary">{domain.label}</h3>
                  <p className="text-sm text-text-secondary">{domain.summary}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-text-muted px-2 py-1 rounded-md bg-surface-secondary">
                    {domain.kpis.length} KPIs
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-text-muted" />
                  ) : (
                    <ChevronDown size={18} className="text-text-muted" />
                  )}
                </div>
              </button>

              {/* KPI Grid */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2">
                  <div className="grid grid-cols-3 gap-4">
                    {domain.kpis.map((kpi) => (
                      <StatCard key={kpi.title} {...kpi} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-text-muted">
          Reporting structure adopted from professional-grade analytical frameworks · All data sanitized for AD Ports Group context
        </p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-fs-income text-white">IS</span>
          <span className="text-[11px] text-text-muted">Income Statement</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-fs-balance text-white">BS</span>
          <span className="text-[11px] text-text-muted">Balance Sheet</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-fs-cashflow text-white">CF</span>
          <span className="text-[11px] text-text-muted">Cash Flow</span>
        </div>
      </div>
    </div>
  )
}
