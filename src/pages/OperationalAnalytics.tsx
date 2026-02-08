import { TabNavigation } from '../components/TabNavigation'
import { ReportCard } from '../components/ReportCard'
import { getReportsByDomain, domainMeta } from '../data/reportCatalog'
import { Settings } from 'lucide-react'

const reports = getReportsByDomain('operational')
const meta = domainMeta.operational

export default function OperationalAnalytics() {
  const statementCounts = {
    IS: reports.filter(r => r.primaryStatement === 'IS').length,
    BS: reports.filter(r => r.primaryStatement === 'BS').length,
    CF: reports.filter(r => r.primaryStatement === 'CF').length,
  }

  return (
    <div className="max-w-6xl mx-auto">
      <TabNavigation activeDomain="operational" />

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
            <Settings size={22} className="text-success" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary font-serif">{meta.label}</h1>
            <p className="text-xs text-text-muted">{meta.ddSections}</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">{meta.description}</p>

        {/* Statement Summary */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-fs-income" />
            <span className="text-xs text-text-secondary">{statementCounts.IS} Income Statement</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-fs-balance" />
            <span className="text-xs text-text-secondary">{statementCounts.BS} Balance Sheet</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-fs-cashflow" />
            <span className="text-xs text-text-secondary">{statementCounts.CF} Cash Flow</span>
          </div>
          <span className="text-xs text-text-muted ml-2">{reports.length} report templates total</span>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {reports.map(report => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  )
}
