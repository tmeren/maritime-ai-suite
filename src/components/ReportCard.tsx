import { FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { ReportTemplate, FinancialStatement } from '../data/reportCatalog'

const fsBadge: Record<FinancialStatement, { label: string; bg: string }> = {
  IS: { label: 'IS', bg: 'bg-fs-income' },
  BS: { label: 'BS', bg: 'bg-fs-balance' },
  CF: { label: 'CF', bg: 'bg-fs-cashflow' },
}

interface ReportCardProps {
  report: ReportTemplate
}

export function ReportCard({ report }: ReportCardProps) {
  const [expanded, setExpanded] = useState(false)
  const badge = fsBadge[report.primaryStatement]

  return (
    <div className="bg-ad-white rounded-xl border border-border hover:shadow-card-hover transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-secondary flex items-center justify-center shrink-0">
              <FileText size={18} className="text-ad-red" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary leading-tight">{report.name}</h3>
              <p className="text-[11px] text-text-muted mt-0.5">{report.analyticalSection} — {report.analyticalReference.split(':')[0]}</p>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white shrink-0 ${badge.bg}`}>
            {badge.label}
          </span>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed mb-4">{report.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {report.tags.map(tag => (
            <span key={tag} className="text-[10px] font-medium text-text-muted bg-surface-secondary px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-ad-red text-white text-xs font-semibold rounded-lg hover:bg-ad-red-dark transition-colors">
            <FileText size={14} />
            Generate Report
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-2.5 border border-border text-xs font-medium text-text-secondary rounded-lg hover:bg-surface-secondary transition-colors"
          >
            {report.fields.length} Fields
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expandable Fields Table */}
      {expanded && (
        <div className="border-t border-border bg-surface/50">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 px-4 font-semibold text-text-muted uppercase tracking-wider text-[10px]">Field</th>
                  <th className="text-right py-2.5 px-4 font-semibold text-text-muted uppercase tracking-wider text-[10px]">Sample Value</th>
                  <th className="text-center py-2.5 px-4 font-semibold text-text-muted uppercase tracking-wider text-[10px]">Type</th>
                  <th className="text-center py-2.5 px-4 font-semibold text-text-muted uppercase tracking-wider text-[10px]">Statement</th>
                </tr>
              </thead>
              <tbody>
                {report.fields.map((field, i) => {
                  const fb = fsBadge[field.financialStatement]
                  return (
                    <tr key={i} className="border-b border-border-light last:border-0 hover:bg-surface-secondary/50">
                      <td className="py-2 px-4 text-text-primary font-medium">{field.name}</td>
                      <td className="py-2 px-4 text-right text-text-primary font-mono">
                        {field.sampleValue}
                        {field.unit && <span className="text-text-muted ml-1">{field.unit}</span>}
                      </td>
                      <td className="py-2 px-4 text-center text-text-muted capitalize">{field.type}</td>
                      <td className="py-2 px-4 text-center">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${fb.bg}`}>
                          {fb.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
