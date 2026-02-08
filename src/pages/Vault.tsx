import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Shield,
  Search,
  FileText,
  FileSpreadsheet,
  FileCheck,
  FileLock,
  Download,
  Clock,
  User,
  FolderOpen,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Types & Data
// ─────────────────────────────────────────────────────────────

type DocCategory = 'contracts' | 'compliance' | 'technical' | 'financial'

interface VaultDoc {
  id: string
  title: string
  category: DocCategory
  type: string
  size: string
  lastModified: string
  author: string
  classification: 'public' | 'internal' | 'confidential' | 'restricted'
}

const categoryConfig: Record<DocCategory, { label: string; icon: React.ReactNode; color: string }> = {
  contracts:  { label: 'Contracts',  icon: <FileCheck size={16} />,       color: 'bg-blue-100 text-blue-700' },
  compliance: { label: 'Compliance', icon: <FileLock size={16} />,        color: 'bg-red-100 text-red-700' },
  technical:  { label: 'Technical',  icon: <FileText size={16} />,        color: 'bg-emerald-100 text-emerald-700' },
  financial:  { label: 'Financial',  icon: <FileSpreadsheet size={16} />, color: 'bg-amber-100 text-amber-700' },
}

const classColors: Record<string, string> = {
  public: 'bg-emerald-100 text-emerald-700',
  internal: 'bg-blue-100 text-blue-700',
  confidential: 'bg-amber-100 text-amber-700',
  restricted: 'bg-red-100 text-red-700',
}

const documents: VaultDoc[] = [
  { id: 'd1', title: 'MSA — Trade-Flow Oracle Platform', category: 'contracts', type: 'PDF', size: '2.4 MB', lastModified: '2026-01-28', author: 'Legal Dept', classification: 'confidential' },
  { id: 'd2', title: 'VIN-Chain Blockchain SLA', category: 'contracts', type: 'PDF', size: '1.8 MB', lastModified: '2026-01-15', author: 'Legal Dept', classification: 'confidential' },
  { id: 'd3', title: 'IMDG Code Compliance Certificate', category: 'compliance', type: 'PDF', size: '850 KB', lastModified: '2026-02-01', author: 'Safety Dept', classification: 'public' },
  { id: 'd4', title: 'Lithium Battery Transport Regulations v4', category: 'compliance', type: 'PDF', size: '3.2 MB', lastModified: '2025-12-18', author: 'Safety Dept', classification: 'internal' },
  { id: 'd5', title: 'UAV Operations GCAA Permit', category: 'compliance', type: 'PDF', size: '1.1 MB', lastModified: '2026-01-22', author: 'Aviation Dept', classification: 'restricted' },
  { id: 'd6', title: 'Digital-Twin Architecture Spec v3', category: 'technical', type: 'DOCX', size: '4.6 MB', lastModified: '2026-02-05', author: 'Engineering', classification: 'internal' },
  { id: 'd7', title: 'Slot-Bid AI Algorithm Whitepaper', category: 'technical', type: 'PDF', size: '2.1 MB', lastModified: '2025-11-30', author: 'Data Science', classification: 'internal' },
  { id: 'd8', title: 'Port-FOTA OTA Protocol Specification', category: 'technical', type: 'PDF', size: '1.5 MB', lastModified: '2026-01-10', author: 'IoT Team', classification: 'internal' },
  { id: 'd9', title: 'Q4 2025 Financial Statements', category: 'financial', type: 'XLSX', size: '5.8 MB', lastModified: '2026-01-31', author: 'Finance Dept', classification: 'confidential' },
  { id: 'd10', title: 'CAPEX Plan 2026 — AI Portfolio', category: 'financial', type: 'XLSX', size: '3.4 MB', lastModified: '2026-02-03', author: 'Finance Dept', classification: 'restricted' },
  { id: 'd11', title: 'Drone Fleet Insurance Policy', category: 'financial', type: 'PDF', size: '1.9 MB', lastModified: '2025-12-20', author: 'Risk Dept', classification: 'confidential' },
  { id: 'd12', title: 'Stevedore-AI Safety Audit Report', category: 'compliance', type: 'PDF', size: '2.7 MB', lastModified: '2026-01-25', author: 'Safety Dept', classification: 'internal' },
]

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function Vault() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<DocCategory | 'all'>('all')

  const filtered = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-sm">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary font-serif">Vault</h1>
            <p className="text-sm text-text-secondary">Secure Document Repository — {documents.length} documents</p>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg text-sm bg-ad-white focus:outline-none focus:ring-2 focus:ring-ad-red/20 focus:border-ad-red"
          />
        </div>
        <button
          onClick={() => setActiveCategory('all')}
          className={`text-xs px-3 py-2 rounded-lg border transition-colors ${
            activeCategory === 'all' ? 'bg-text-primary text-white border-text-primary' : 'border-border text-text-muted hover:border-text-muted'
          }`}
        >
          All
        </button>
        {(Object.keys(categoryConfig) as DocCategory[]).map((cat) => {
          const cfg = categoryConfig[cat]
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-colors ${
                activeCategory === cat ? cfg.color + ' border-current' : 'border-border text-text-muted hover:border-text-muted'
              }`}
            >
              {cfg.icon} {cfg.label}
            </button>
          )
        })}
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doc) => {
          const cat = categoryConfig[doc.category]
          return (
            <div key={doc.id} className="bg-ad-white rounded-xl border border-border p-4 hover:shadow-[var(--shadow-card-hover)] transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center shrink-0`}>
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-text-primary truncate">{doc.title}</h4>
                    <span className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded ${classColors[doc.classification]}`}>
                      {doc.classification}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><FolderOpen size={10} /> {cat.label}</span>
                    <span>{doc.type} · {doc.size}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {doc.lastModified}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="flex items-center gap-1 text-xs text-text-muted"><User size={10} /> {doc.author}</span>
                    <button className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors">
                      <Download size={12} /> Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <FolderOpen size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No documents match your search.</p>
        </div>
      )}
    </div>
  )
}
