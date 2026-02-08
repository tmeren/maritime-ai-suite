import { useState, useMemo } from 'react'
import {
  FileSearch,
  FileText,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Presentation,
  Check,
  Database,
  Layers,
} from 'lucide-react'
import {
  reportCatalog,
  getReportsByDomain,
  domainMeta,
  type ReportTemplate,
  type FinancialStatement,
  type Domain,
} from '../data/reportCatalog'

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

const fsBadge: Record<FinancialStatement, { label: string; fullLabel: string; bg: string; color: string }> = {
  IS: { label: 'IS', fullLabel: 'Income Statement', bg: 'bg-fs-income', color: 'text-fs-income' },
  BS: { label: 'BS', fullLabel: 'Balance Sheet', bg: 'bg-fs-balance', color: 'text-fs-balance' },
  CF: { label: 'CF', fullLabel: 'Cash Flow Statement', bg: 'bg-fs-cashflow', color: 'text-fs-cashflow' },
}

const domainColors: Record<Domain, string> = {
  financial: 'bg-fs-income',
  operational: 'bg-success',
  market: 'bg-warning',
  strategic: 'bg-ad-red',
}

function getFieldsByStatement(stmt: FinancialStatement) {
  const results: { template: string; domain: Domain; field: string; sampleValue: string; type: string }[] = []
  reportCatalog.forEach(t => {
    t.fields.forEach(f => {
      if (f.financialStatement === stmt) {
        results.push({
          template: t.name,
          domain: t.domain,
          field: f.name,
          sampleValue: f.sampleValue + (f.unit ? ` ${f.unit}` : ''),
          type: f.type,
        })
      }
    })
  })
  return results
}

// ─────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────

export default function Analyse() {
  const [selectedDomain, setSelectedDomain] = useState<Domain | 'all'>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [drillStatement, setDrillStatement] = useState<FinancialStatement | null>(null)
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set())

  const templates = selectedDomain === 'all' ? reportCatalog : getReportsByDomain(selectedDomain)
  const domains: Domain[] = ['financial', 'operational', 'market', 'strategic']

  const drillData = useMemo(() => {
    if (!drillStatement) return []
    return getFieldsByStatement(drillStatement)
  }, [drillStatement])

  const toggleField = (fieldKey: string) => {
    setFilledFields(prev => {
      const next = new Set(prev)
      if (next.has(fieldKey)) next.delete(fieldKey)
      else next.add(fieldKey)
      return next
    })
  }

  const totalFields = selectedTemplate ? selectedTemplate.fields.length : 0
  const filledCount = selectedTemplate ? selectedTemplate.fields.filter((_, i) => filledFields.has(`${selectedTemplate.id}-${i}`)).length : 0

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-ad-red/10 flex items-center justify-center">
            <FileSearch size={22} className="text-ad-red" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary font-serif">Analysis Center</h1>
            <p className="text-xs text-text-muted">Analytical Report Generation Workspace — 25 Templates, 200 Fields</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          Create professional-grade reports from {reportCatalog.length} templates across 4 analytical domains. Each field maps to IS/BS/CF for audit-grade traceability. Click any statement badge for cross-template drill-through.
        </p>
      </div>

      {/* Workspace Layout */}
      <div className="flex gap-4" style={{ height: 'calc(100vh - 280px)', minHeight: 520 }}>
        {/* Left Panel — Template Picker */}
        <div className="w-72 bg-ad-white rounded-xl border border-border flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Report Templates</h2>
            {/* Domain filter pills */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => { setSelectedDomain('all'); setSelectedTemplate(null); setDrillStatement(null) }}
                className={`text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                  selectedDomain === 'all' ? 'bg-ad-red text-white' : 'bg-surface-secondary text-text-secondary hover:bg-surface'
                }`}
              >
                All ({reportCatalog.length})
              </button>
              {domains.map(d => (
                <button
                  key={d}
                  onClick={() => { setSelectedDomain(d); setSelectedTemplate(null); setDrillStatement(null) }}
                  className={`text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                    selectedDomain === d ? 'bg-ad-red text-white' : 'bg-surface-secondary text-text-secondary hover:bg-surface'
                  }`}
                >
                  {domainMeta[d].label.replace(' Analytics', '')} ({getReportsByDomain(d).length})
                </button>
              ))}
            </div>
          </div>

          {/* Template List */}
          <div className="flex-1 overflow-y-auto py-1">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => { setSelectedTemplate(t); setDrillStatement(null); setFilledFields(new Set()) }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-border-light ${
                  selectedTemplate?.id === t.id
                    ? 'bg-surface-secondary'
                    : 'hover:bg-surface-secondary/50'
                }`}
              >
                <div className={`w-1.5 h-8 rounded-full ${domainColors[t.domain]}`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-xs truncate ${selectedTemplate?.id === t.id ? 'font-semibold text-text-primary' : 'font-medium text-text-primary'}`}>
                    {t.name}
                  </p>
                  <p className="text-[10px] text-text-muted truncate">{t.analyticalSection} · {t.fields.length} fields</p>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white shrink-0 ${fsBadge[t.primaryStatement].bg}`}>
                  {fsBadge[t.primaryStatement].label}
                </span>
                <ChevronRight size={14} className="text-text-muted shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Center — Report Canvas */}
        <div className="flex-1 bg-ad-white rounded-xl border border-border flex flex-col overflow-hidden min-w-0">
          {selectedTemplate ? (
            <>
              {/* Template Header */}
              <div className="p-5 border-b border-border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-base font-bold text-text-primary">{selectedTemplate.name}</h2>
                    <p className="text-[11px] text-text-muted">{selectedTemplate.analyticalSection} — {selectedTemplate.analyticalReference.split(':')[0]}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${fsBadge[selectedTemplate.primaryStatement].bg}`}>
                    {fsBadge[selectedTemplate.primaryStatement].label}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{selectedTemplate.description}</p>

                {/* Progress bar */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 bg-surface-secondary rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-success h-2 rounded-full transition-all duration-300"
                      style={{ width: `${totalFields > 0 ? (filledCount / totalFields) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-text-muted shrink-0">{filledCount}/{totalFields} fields</span>
                </div>
              </div>

              {/* Fields Table */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-surface-secondary">
                    <tr>
                      <th className="w-8 py-2.5 px-3" />
                      <th className="text-left py-2.5 px-3 font-semibold text-text-muted uppercase tracking-wider text-[10px]">Field</th>
                      <th className="text-left py-2.5 px-3 font-semibold text-text-muted uppercase tracking-wider text-[10px]">Value</th>
                      <th className="text-center py-2.5 px-3 font-semibold text-text-muted uppercase tracking-wider text-[10px]">Type</th>
                      <th className="text-center py-2.5 px-3 font-semibold text-text-muted uppercase tracking-wider text-[10px]">Statement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTemplate.fields.map((field, i) => {
                      const fieldKey = `${selectedTemplate.id}-${i}`
                      const isFilled = filledFields.has(fieldKey)
                      const fb = fsBadge[field.financialStatement]
                      return (
                        <tr key={i} className="border-b border-border-light hover:bg-surface-secondary/50">
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => toggleField(fieldKey)}
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                isFilled ? 'bg-success border-success' : 'border-border hover:border-ad-red'
                              }`}
                            >
                              {isFilled && <Check size={10} className="text-white" />}
                            </button>
                          </td>
                          <td className="py-2.5 px-3 text-text-primary font-medium">{field.name}</td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              defaultValue={field.sampleValue + (field.unit ? ` ${field.unit}` : '')}
                              className="w-full bg-transparent text-text-primary font-mono text-xs border-b border-transparent hover:border-border focus:border-ad-red focus:outline-none py-0.5 transition-colors"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center text-text-muted capitalize">{field.type}</td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => setDrillStatement(field.financialStatement)}
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${fb.bg} hover:opacity-80 transition-opacity cursor-pointer`}
                              title={`Drill through: ${fb.fullLabel}`}
                            >
                              {fb.label}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action Bar */}
              <div className="p-4 border-t border-border flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-ad-red text-white text-xs font-semibold rounded-lg hover:bg-ad-red-dark transition-colors">
                  <FileText size={14} />
                  Generate Report
                </button>
                <div className="flex items-center gap-1 ml-2">
                  <button className="flex items-center gap-1.5 px-3 py-2.5 border border-border text-xs font-medium text-text-secondary rounded-lg hover:bg-surface-secondary transition-colors" title="Export as PDF">
                    <Download size={13} />
                    PDF
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2.5 border border-border text-xs font-medium text-text-secondary rounded-lg hover:bg-surface-secondary transition-colors" title="Export as Excel">
                    <FileSpreadsheet size={13} />
                    Excel
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2.5 border border-border text-xs font-medium text-text-secondary rounded-lg hover:bg-surface-secondary transition-colors" title="Export as PowerPoint">
                    <Presentation size={13} />
                    PPTX
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-surface-secondary flex items-center justify-center mx-auto mb-4">
                  <FileSearch size={28} className="text-text-muted" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">Select a Report Template</h3>
                <p className="text-xs text-text-muted max-w-xs">Choose a template from the left panel to start building your analytical report.</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel — Data Sources / Drill-Through */}
        <div className="w-64 bg-ad-white rounded-xl border border-border flex flex-col shrink-0 overflow-hidden">
          {drillStatement ? (
            <>
              {/* Drill-Through Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${fsBadge[drillStatement].bg}`}>
                    {fsBadge[drillStatement].label}
                  </span>
                  <h2 className="text-sm font-semibold text-text-primary">{fsBadge[drillStatement].fullLabel}</h2>
                </div>
                <p className="text-[11px] text-text-muted">{drillData.length} fields across all templates</p>
                <button
                  onClick={() => setDrillStatement(null)}
                  className="text-[10px] text-ad-red font-medium mt-1 hover:underline"
                >
                  ← Back to data sources
                </button>
              </div>

              {/* Drill-Through List */}
              <div className="flex-1 overflow-y-auto">
                {drillData.map((item, i) => (
                  <div key={i} className="px-4 py-2.5 border-b border-border-light hover:bg-surface-secondary/50">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${domainColors[item.domain]}`} />
                      <span className="text-[10px] text-text-muted">{item.template}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-primary font-medium">{item.field}</span>
                      <span className="text-[10px] text-text-muted font-mono">{item.sampleValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Data Sources */}
              <div className="p-4 border-b border-border">
                <h2 className="text-sm font-semibold text-text-primary mb-1">Data Sources</h2>
                <p className="text-[11px] text-text-muted">Click any IS/BS/CF badge for drill-through</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Statement Summary */}
                {(['IS', 'BS', 'CF'] as FinancialStatement[]).map(stmt => {
                  const count = getFieldsByStatement(stmt).length
                  const fb = fsBadge[stmt]
                  return (
                    <button
                      key={stmt}
                      onClick={() => setDrillStatement(stmt)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:shadow-card-hover transition-all text-left"
                    >
                      <div className={`w-8 h-8 rounded-lg ${fb.bg}/10 flex items-center justify-center`}>
                        <span className={`text-xs font-bold ${fb.color}`}>{fb.label}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-primary">{fb.fullLabel}</p>
                        <p className="text-[10px] text-text-muted">{count} fields mapped</p>
                      </div>
                    </button>
                  )
                })}

                {/* Cross-Reference */}
                <div className="mt-4 pt-4 border-t border-border">
                  <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-3">Cross-References</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Database size={13} className="text-text-muted shrink-0" />
                      <span>{reportCatalog.length} report templates</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Layers size={13} className="text-text-muted shrink-0" />
                      <span>{reportCatalog.reduce((sum, t) => sum + t.fields.length, 0)} total fields</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <FileText size={13} className="text-text-muted shrink-0" />
                      <span>4 analytical domains</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
