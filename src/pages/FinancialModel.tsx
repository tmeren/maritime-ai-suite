import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Wallet,
  ArrowLeft,
  ExternalLink,
  Layers,
} from 'lucide-react'
import {
  incomeStatement,
  balanceSheet,
  cashFlowStatement,
  modules,
  type FinancialLineItem,
} from '../data/moduleKpis'
import type { FinancialStatement } from '../components/StatCard'

// ─────────────────────────────────────────────────────────────
// Tab Config
// ─────────────────────────────────────────────────────────────

type StatementTab = 'IS' | 'BS' | 'CF'

const tabConfig: { id: StatementTab; label: string; icon: React.ReactNode; color: string; data: FinancialLineItem[] }[] = [
  { id: 'IS', label: 'Income Statement', icon: <DollarSign size={16} />, color: 'border-fs-income text-fs-income', data: incomeStatement },
  { id: 'BS', label: 'Balance Sheet', icon: <Wallet size={16} />, color: 'border-fs-balance text-fs-balance', data: balanceSheet },
  { id: 'CF', label: 'Cash Flow', icon: <BarChart3 size={16} />, color: 'border-fs-cashflow text-fs-cashflow', data: cashFlowStatement },
]

const fsBadgeClass: Record<FinancialStatement, string> = {
  IS: 'bg-fs-income',
  BS: 'bg-fs-balance',
  CF: 'bg-fs-cashflow',
}

const trendConfig = {
  up: { icon: TrendingUp, color: 'text-success' },
  down: { icon: TrendingDown, color: 'text-critical' },
  flat: { icon: Minus, color: 'text-text-muted' },
}

// ─────────────────────────────────────────────────────────────
// Sparkline SVG
// ─────────────────────────────────────────────────────────────

function Sparkline({ data, color = '#3b82f6' }: { data: number[]; color?: string }) {
  const absValues = data.map(Math.abs)
  const max = Math.max(...absValues)
  const min = Math.min(...absValues)
  const range = max - min || 1
  const w = 80
  const h = 24
  const points = absValues
    .map((v, i) => `${(i / (absValues.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ')

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
      <circle cx={(absValues.length - 1) / (absValues.length - 1) * w} cy={h - ((absValues[absValues.length - 1] - min) / range) * h} r="2" fill={color} />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function FinancialModel() {
  const [searchParams] = useSearchParams()
  const paramTab = searchParams.get('statement') as StatementTab | null
  const paramLine = searchParams.get('line')

  const [activeTab, setActiveTab] = useState<StatementTab>(paramTab && ['IS', 'BS', 'CF'].includes(paramTab) ? paramTab : 'IS')
  const [highlightedLine, setHighlightedLine] = useState<string | null>(paramLine)

  useEffect(() => {
    if (paramTab && ['IS', 'BS', 'CF'].includes(paramTab)) setActiveTab(paramTab)
    if (paramLine) setHighlightedLine(paramLine)
  }, [paramTab, paramLine])

  useEffect(() => {
    if (highlightedLine) {
      const el = document.getElementById(`line-${highlightedLine}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const timer = setTimeout(() => setHighlightedLine(null), 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [highlightedLine, activeTab])

  const currentTab = tabConfig.find(t => t.id === activeTab)!

  // Summary metrics
  const summaryCards = [
    { label: 'Revenue', value: 'AED 2.4B', trend: '+8.2%', badge: 'IS' as FinancialStatement },
    { label: 'EBITDA', value: 'AED 890M', trend: '+12.4%', badge: 'IS' as FinancialStatement },
    { label: 'Total Assets', value: 'AED 4.8B', trend: '+6.4%', badge: 'BS' as FinancialStatement },
    { label: 'Free Cash Flow', value: 'AED 400M', trend: '+22%', badge: 'CF' as FinancialStatement },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary font-serif">3-Statement Financial Model</h1>
            <p className="text-sm text-text-secondary">Central BI Backbone — AD Ports AI Portfolio Impact</p>
          </div>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => (
          <button
            key={card.label}
            onClick={() => setActiveTab(card.badge)}
            className={`bg-ad-white rounded-xl border p-4 text-left transition-all ${
              activeTab === card.badge ? 'border-text-primary shadow-sm' : 'border-border hover:border-text-muted'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-muted">{card.label}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${fsBadgeClass[card.badge]}`}>
                {card.badge}
              </span>
            </div>
            <div className="text-lg font-bold text-text-primary">{card.value}</div>
            <div className="text-xs text-success font-medium">{card.trend} YoY</div>
          </button>
        ))}
      </div>

      {/* Tab Bar */}
      <div className="bg-ad-white rounded-t-xl border border-b-0 border-border">
        <div className="flex">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id ? tab.color : 'border-transparent text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Statement Table */}
      <div className="bg-ad-white rounded-b-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-secondary border-b border-border">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-text-secondary w-[35%]">Line Item</th>
              <th className="text-right px-4 py-3 font-medium text-text-secondary w-[15%]">Value</th>
              <th className="text-center px-4 py-3 font-medium text-text-secondary w-[12%]">Trend</th>
              <th className="text-center px-4 py-3 font-medium text-text-secondary w-[12%]">Sparkline</th>
              <th className="text-left px-4 py-3 font-medium text-text-secondary w-[26%]">Contributing Modules</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {currentTab.data.map((item) => {
              const trendInfo = trendConfig[item.trend]
              const TrendIcon = trendInfo.icon
              const isHighlighted = highlightedLine === item.key
              const sparkColor = activeTab === 'IS' ? '#3b82f6' : activeTab === 'BS' ? '#10b981' : '#f59e0b'

              return (
                <tr
                  key={item.key}
                  id={`line-${item.key}`}
                  className={`transition-colors ${
                    isHighlighted
                      ? 'bg-warning-light/50 animate-pulse'
                      : item.isHeader
                        ? 'bg-surface-secondary/30'
                        : 'hover:bg-surface-secondary/20'
                  }`}
                >
                  <td className={`px-5 py-3 ${item.isHeader ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
                    <span style={{ paddingLeft: (item.indent || 0) * 20 }}>
                      {item.label}
                    </span>
                  </td>
                  <td className={`text-right px-4 py-3 font-mono ${item.isHeader ? 'font-bold text-text-primary' : 'text-text-secondary'}`}>
                    {item.value}
                  </td>
                  <td className="text-center px-4 py-3">
                    <div className={`inline-flex items-center gap-1 text-xs ${trendInfo.color}`}>
                      <TrendIcon size={12} />
                      <span className="font-medium">{item.trendValue}</span>
                    </div>
                  </td>
                  <td className="text-center px-4 py-3">
                    <div className="flex justify-center">
                      <Sparkline data={item.sparkline} color={sparkColor} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {item.contributingModules.map((modId) => {
                        const mod = modules.find(m => m.id === modId)
                        if (!mod) return null
                        return (
                          <Link
                            key={modId}
                            to={`/modules/${mod.slug}`}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-surface-secondary text-text-muted hover:bg-border hover:text-text-primary transition-colors"
                          >
                            {mod.name.split(' ')[0]}
                          </Link>
                        )
                      })}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Portfolio Impact Summary */}
      <div className="mt-6 bg-ad-white rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">AI Portfolio Impact Summary</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-fs-income text-white">IS</span>
              <span className="text-sm font-medium text-text-primary">Income Statement</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              10 AI modules contribute AED 2.4B in revenue across cargo handling, vehicle logistics, cruise operations, and digital services. EBITDA margin improved 2.1pp through operational AI.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-fs-balance text-white">BS</span>
              <span className="text-sm font-medium text-text-primary">Balance Sheet</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Port infrastructure (AED 2.2B PPE) and digital platform assets (AED 420M intangibles) form the asset base. AI-driven efficiency has increased ROCE to 11.4%.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-fs-cashflow text-white">CF</span>
              <span className="text-sm font-medium text-text-primary">Cash Flow</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Operating CF of AED 780M (+15.7%) driven by working capital improvements from VIN-Chain and throughput gains. FCF of AED 400M after AED 380M CAPEX program.
            </p>
          </div>
        </div>
      </div>

      {/* Cross-links */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <Link
          to="/synergy-map"
          className="text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
        >
          Synergy Map <ExternalLink size={10} />
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
