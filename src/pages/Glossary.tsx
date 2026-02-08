import { useState, useMemo, useRef, useCallback } from 'react'
import {
  BookOpen,
  Search,
  DollarSign,
  Anchor,
  Ship,
  Monitor,
  ArrowUp,
  Link2,
  Calculator,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type GlossaryCategory = 'financial' | 'operational' | 'maritime' | 'technical'
type FinancialStatement = 'IS' | 'BS' | 'CF'

interface GlossaryTerm {
  id: string
  term: string
  category: GlossaryCategory
  definition: string
  formula?: string
  adPortsContext: string
  financialStatements: FinancialStatement[]
  relatedTermIds: string[]
  sourceReference: string
}

// ─────────────────────────────────────────────────────────
// Category Config
// ─────────────────────────────────────────────────────────

const categoryConfig: Record<GlossaryCategory, {
  label: string
  color: string
  bg: string
  bgLight: string
  border: string
  icon: React.ReactNode
}> = {
  financial: {
    label: 'Financial',
    color: 'text-rose-500',
    bg: 'bg-rose-500',
    bgLight: 'bg-rose-500/10',
    border: 'border-rose-500',
    icon: <DollarSign size={14} />,
  },
  operational: {
    label: 'Operational',
    color: 'text-info',
    bg: 'bg-info',
    bgLight: 'bg-info/10',
    border: 'border-info',
    icon: <Anchor size={14} />,
  },
  maritime: {
    label: 'Maritime',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500',
    bgLight: 'bg-emerald-500/10',
    border: 'border-emerald-500',
    icon: <Ship size={14} />,
  },
  technical: {
    label: 'Technical / Platform',
    color: 'text-violet-500',
    bg: 'bg-violet-500',
    bgLight: 'bg-violet-500/10',
    border: 'border-violet-500',
    icon: <Monitor size={14} />,
  },
}

const statementConfig: Record<FinancialStatement, { label: string; bg: string }> = {
  IS: { label: 'IS', bg: 'bg-fs-income' },
  BS: { label: 'BS', bg: 'bg-fs-balance' },
  CF: { label: 'CF', bg: 'bg-fs-cashflow' },
}

const categories: GlossaryCategory[] = ['financial', 'operational', 'maritime', 'technical']

// ─────────────────────────────────────────────────────────
// Glossary Data — 40 Terms (10 per category)
// ─────────────────────────────────────────────────────────

const glossaryTerms: GlossaryTerm[] = [
  // ── Financial Terms (10) ──
  {
    id: 'fin-ebitda',
    term: 'EBITDA',
    category: 'financial',
    definition: 'Earnings Before Interest, Taxes, Depreciation & Amortization. The primary profitability metric used across the Maritime AI Suite for port operations, measuring operating performance independent of capital structure and accounting decisions.',
    formula: 'Revenue - COGS - OpEx + D&A',
    adPortsContext: 'AD Ports Group EBITDA: 6.1B AED with a margin of 43.0%. Tracked by segment (Ports, Logistics, Maritime, Digital) via the EBITDA Bridge report.',
    financialStatements: ['IS'],
    relatedTermIds: ['fin-gross-margin', 'fin-fcf', 'fin-revenue-waterfall'],
    sourceReference: 'Analytical Framework §7.2 — Historical Financials: EBITDA Walk',
  },
  {
    id: 'fin-revenue-waterfall',
    term: 'Revenue Waterfall',
    category: 'financial',
    definition: 'Decomposition of total revenue by business segment, geography, and service type. Separates organic growth from inorganic (M&A) growth for transparent attribution of top-line performance.',
    adPortsContext: 'Total Revenue: 14.2B AED across Ports (8.1B), Logistics (3.4B), Maritime (1.8B), and Digital (0.9B). Organic growth +12.3%, Inorganic +4.7%.',
    financialStatements: ['IS'],
    relatedTermIds: ['fin-ebitda', 'fin-gross-margin'],
    sourceReference: 'Analytical Framework §7.1 — Historical Financials: Revenue Decomposition',
  },
  {
    id: 'fin-working-capital',
    term: 'Working Capital',
    category: 'financial',
    definition: 'Current Assets minus Current Liabilities. Measures the short-term liquidity position and operational funding needs of the business.',
    formula: 'Current Assets - Current Liabilities',
    adPortsContext: 'Working capital consumed ~0.3B AED in the latest period, driven by increased trade receivables from new concession agreements. Key ratio: Working Capital / Revenue.',
    financialStatements: ['BS'],
    relatedTermIds: ['fin-fcf', 'fin-net-debt'],
    sourceReference: 'Analytical Framework §7.6 — Historical Financials: FCF Analysis',
  },
  {
    id: 'fin-net-debt',
    term: 'Net Debt',
    category: 'financial',
    definition: 'Total borrowings minus cash and cash equivalents. The core measure of a company\'s leverage position, used as the numerator in the Net Debt/EBITDA ratio.',
    formula: 'Total Debt - Cash & Equivalents',
    adPortsContext: 'Total Debt: 18.7B AED minus Cash: 3.2B AED = Net Debt: 15.5B AED. Net Debt/EBITDA: 2.5x. Used for covenant compliance monitoring.',
    financialStatements: ['BS'],
    relatedTermIds: ['fin-ebitda', 'fin-dscr'],
    sourceReference: 'Analytical Framework §7.5 — Historical Financials: Capital Structure',
  },
  {
    id: 'fin-fcf',
    term: 'Free Cash Flow',
    category: 'financial',
    definition: 'Operating cash flow minus capital expenditures. Represents the cash available for debt repayment, dividends, and strategic investments after maintaining and expanding the asset base.',
    formula: 'Operating Cash Flow - CAPEX',
    adPortsContext: 'OCF: 5.4B AED minus total CAPEX: 3.3B AED = FCF: 1.8B AED. FCF Yield: 6.2%, FCF Conversion: 29.5%. Critical metric for funding the multi-billion AED expansion pipeline.',
    financialStatements: ['CF'],
    relatedTermIds: ['fin-capex', 'fin-working-capital'],
    sourceReference: 'Analytical Framework §7.6 — Historical Financials: FCF Analysis',
  },
  {
    id: 'fin-gross-margin',
    term: 'Gross Margin',
    category: 'financial',
    definition: 'Revenue minus Cost of Goods Sold, divided by Revenue. Indicates the percentage of revenue retained after covering direct costs of delivering port services.',
    formula: '(Revenue - COGS) / Revenue',
    adPortsContext: 'Group Gross Margin: 59.9%. Ports segment: 50-55% EBITDA margin. Margin cascade: Gross (59.9%) → EBITDA (43.0%) → EBIT (33.1%) → Net (22.5%).',
    financialStatements: ['IS'],
    relatedTermIds: ['fin-ebitda', 'fin-revenue-waterfall'],
    sourceReference: 'Analytical Framework §7.4 — Historical Financials: Margin Analysis',
  },
  {
    id: 'fin-capex',
    term: 'CAPEX',
    category: 'financial',
    definition: 'Capital Expenditure on property, equipment, and terminal infrastructure. Divided into Maintenance CAPEX (sustaining existing operations) and Growth CAPEX (expansion investments).',
    adPortsContext: 'Total CAPEX: 3.3B AED (Maintenance: 1.2B, Expansion: 1.5B, Digital: 0.6B). CAPEX/Revenue: 23.2%. Multi-year pipeline: 18.4B AED. Weighted Avg IRR: 14.8%.',
    financialStatements: ['CF'],
    relatedTermIds: ['fin-fcf', 'fin-roic'],
    sourceReference: 'Analytical Framework §8.1 — Management Plan: Capital Allocation',
  },
  {
    id: 'fin-dscr',
    term: 'Debt Service Coverage Ratio',
    category: 'financial',
    definition: 'EBITDA divided by total debt service (interest plus principal repayments). Measures the ability to meet debt obligations from operating earnings.',
    formula: 'EBITDA / (Interest + Principal)',
    adPortsContext: 'Interest Coverage: 5.8x (EBITDA / Interest Expense). Monitored against covenant thresholds in credit facilities and bond indentures with traffic-light compliance indicators.',
    financialStatements: ['IS', 'CF'],
    relatedTermIds: ['fin-ebitda', 'fin-net-debt'],
    sourceReference: 'Analytical Framework §7.5 — Historical Financials: Capital Structure',
  },
  {
    id: 'fin-roic',
    term: 'Return on Invested Capital (ROIC)',
    category: 'financial',
    definition: 'Net Operating Profit After Tax divided by Invested Capital. Measures how effectively the company generates returns on the capital deployed in its operations.',
    formula: 'NOPAT / Invested Capital',
    adPortsContext: 'ROIC informs strategic capital allocation decisions across the four business segments. Used alongside IRR hurdle rates (14.8% weighted average) for CAPEX project prioritization.',
    financialStatements: ['IS', 'BS'],
    relatedTermIds: ['fin-ebitda', 'fin-capex'],
    sourceReference: 'Analytical Framework §7.4 — Historical Financials: Returns Analysis',
  },
  {
    id: 'fin-deferred-revenue',
    term: 'Deferred Revenue',
    category: 'financial',
    definition: 'Advance payments received for port services not yet delivered. Recognized as a liability on the balance sheet until the underlying service obligation is fulfilled.',
    adPortsContext: 'Arises from long-term port concession agreements and advance berthing slot reservations. Flows from BS (liability) to IS (revenue) as services are rendered over the concession period.',
    financialStatements: ['BS'],
    relatedTermIds: ['fin-revenue-waterfall', 'fin-working-capital'],
    sourceReference: 'Analytical Framework §7.1 — Historical Financials: Revenue Recognition',
  },

  // ── Operational Terms (10) ──
  {
    id: 'ops-teu',
    term: 'TEU',
    category: 'operational',
    definition: 'Twenty-foot Equivalent Unit. The universal standard unit for measuring containerized cargo volume. One standard 20-foot shipping container equals 1 TEU; a 40-foot container counts as 2 TEU.',
    adPortsContext: 'AD Ports handles ~16.8M TEU annually. Container throughput: 12.4M TEU. Revenue per TEU: 412 AED. Benchmark positions AD Ports among the top 15 global port groups.',
    financialStatements: ['IS'],
    relatedTermIds: ['ops-berth-utilization', 'ops-crane-productivity'],
    sourceReference: 'Analytical Framework §2.3 — Company Overview: Port Operations',
  },
  {
    id: 'ops-berth-utilization',
    term: 'Berth Utilization',
    category: 'operational',
    definition: 'Percentage of total available berth-hours that are occupied by vessels during a given period. A key indicator of terminal capacity usage and congestion risk.',
    formula: '(Vessel Berth-Hours / Available Berth-Hours) × 100',
    adPortsContext: 'Current capacity utilization: 78.5%. Target range: 65-75% for optimal balance. Above 85% signals congestion risk. Estimated 3.4 years of headroom before new berth capacity required at Khalifa Port.',
    financialStatements: ['IS'],
    relatedTermIds: ['ops-teu', 'ops-vessel-turnaround'],
    sourceReference: 'Analytical Framework §2.2 — Company Overview: Operational Efficiency',
  },
  {
    id: 'ops-crane-productivity',
    term: 'Crane Productivity',
    category: 'operational',
    definition: 'Container moves per crane per hour. The primary measure of Ship-to-Shore (STS) crane loading and unloading speed, tracking both gross (including idle time) and net (active time only) variants.',
    formula: 'Total Container Moves / Total Crane-Hours',
    adPortsContext: 'AD Ports benchmark: 32 moves/hr (upper quartile globally). Target: 35+ moves/hr (world-class). Crane availability >95%, utilization 78%. Directly reduces cost per container move.',
    financialStatements: ['IS'],
    relatedTermIds: ['ops-teu', 'ops-vessel-turnaround'],
    sourceReference: 'Analytical Framework §2.3 — Company Overview: Port Operations',
  },
  {
    id: 'ops-vessel-turnaround',
    term: 'Vessel Turnaround Time',
    category: 'operational',
    definition: 'Total hours from vessel arrival (pilot boarding) to departure (last line cast off). Encompasses pilotage, berthing, cargo operations, inspections, and ancillary services.',
    adPortsContext: 'AD Ports average: 18.4 hours for container vessels. Target: <24 hours. Reducing turnaround increases effective berth capacity without physical expansion and strengthens competitive positioning.',
    financialStatements: ['IS'],
    relatedTermIds: ['ops-berth-utilization', 'ops-crane-productivity'],
    sourceReference: 'Analytical Framework §2.2 — Company Overview: Operational Efficiency',
  },
  {
    id: 'ops-dwell-time',
    term: 'Dwell Time',
    category: 'operational',
    definition: 'Average time a container remains in the terminal yard between vessel discharge and gate-out (or vice versa). A critical measure of terminal throughput efficiency and competitiveness.',
    adPortsContext: 'AD Ports achieves 18% lower dwell times than the regional average through digital customs integration and automated gate systems. Target: <5 days. Directly impacts yard utilization.',
    financialStatements: ['IS'],
    relatedTermIds: ['ops-yard-utilization', 'ops-truck-turnaround'],
    sourceReference: 'Analytical Framework §6.1 — Competitive Advantage: Market Position',
  },
  {
    id: 'ops-terminal-throughput',
    term: 'Terminal Throughput',
    category: 'operational',
    definition: 'Total cargo volume handled per terminal per year, measured in TEU for containers, metric tonnes for bulk, and units for vehicles. The primary volume indicator for individual terminal performance.',
    adPortsContext: 'Total TEU: 16.8M across the port cluster. Container throughput: 12.4M TEU. Vehicle throughput: 4.2M units. Bulk tonnage: 28.6M MT. Khalifa Port and KIZAD handle the majority.',
    financialStatements: ['IS'],
    relatedTermIds: ['ops-teu', 'ops-quay-meter-productivity'],
    sourceReference: 'Analytical Framework §2.3 — Company Overview: Port Operations',
  },
  {
    id: 'ops-quay-meter-productivity',
    term: 'Quay Meter Productivity',
    category: 'operational',
    definition: 'TEU handled per meter of quay wall per year. Measures how efficiently the terminal\'s berth infrastructure is utilized relative to its physical length.',
    formula: 'Annual TEU / Total Quay Length (meters)',
    adPortsContext: 'Used in the Capacity Planning report (§5.2) to benchmark terminal efficiency and determine when berth extension investments are justified. Higher values indicate more intensive berth usage.',
    financialStatements: ['IS', 'BS'],
    relatedTermIds: ['ops-berth-utilization', 'ops-terminal-throughput'],
    sourceReference: 'Analytical Framework §5.2 — Customers: Growth Capacity',
  },
  {
    id: 'ops-truck-turnaround',
    term: 'Truck Turnaround Time',
    category: 'operational',
    definition: 'Elapsed time from truck gate-in to gate-out for road transport within the terminal. Measures the efficiency of the land-side interface including documentation, queuing, loading/unloading, and exit processing.',
    adPortsContext: 'AD Ports average: 42 minutes. Target: <45 minutes. Optimized through automated gate systems and digital documentation. 2.8M truck gate movements annually across the network.',
    financialStatements: ['IS'],
    relatedTermIds: ['ops-dwell-time', 'ops-yard-utilization'],
    sourceReference: 'Analytical Framework §2.4 — Company Overview: Logistics Network',
  },
  {
    id: 'ops-yard-utilization',
    term: 'Yard Utilization',
    category: 'operational',
    definition: 'Percentage of terminal yard storage capacity currently in use. Measures the balance between storage demand and available ground slots or stacking positions.',
    adPortsContext: 'Optimal range: 70-80%. Below 60% indicates excess capacity; above 85% causes congestion, increased dwell times, and rehandling. Connected to dwell time metrics in the operational dashboard.',
    financialStatements: ['IS'],
    relatedTermIds: ['ops-dwell-time', 'ops-terminal-throughput'],
    sourceReference: 'Analytical Framework §2.3 — Company Overview: Port Operations',
  },
  {
    id: 'ops-sts-ratio',
    term: 'Ship-to-Shore Ratio',
    category: 'operational',
    definition: 'Ratio of Ship-to-Shore (STS) cranes to yard cranes (RTG/RMG). Determines the balance between quayside and yard-side handling capacity and identifies potential bottlenecks.',
    adPortsContext: 'Optimal ratio depends on vessel size and call patterns. Tracked in the crane productivity index alongside moves per hour, availability (>95%), and utilization (78%) for fleet investment planning.',
    financialStatements: ['BS'],
    relatedTermIds: ['ops-crane-productivity', 'ops-berth-utilization'],
    sourceReference: 'Analytical Framework §2.3 — Company Overview: Port Operations',
  },

  // ── Maritime Terms (10) ──
  {
    id: 'mar-bill-of-lading',
    term: 'Bill of Lading',
    category: 'maritime',
    definition: 'Legal document issued by a carrier to a shipper detailing the type, quantity, and destination of cargo. Serves simultaneously as a receipt, contract of carriage, and document of title.',
    adPortsContext: 'Digital Bill of Lading processing is integrated into the platform\'s documentation workflow. Faster BoL processing contributes to reduced vessel turnaround times at AD Ports terminals.',
    financialStatements: [],
    relatedTermIds: ['mar-demurrage', 'mar-transshipment'],
    sourceReference: 'Maritime Operations — Trade Documentation Standards',
  },
  {
    id: 'mar-demurrage',
    term: 'Demurrage',
    category: 'maritime',
    definition: 'Charges levied when cargo or containers exceed the allowed free time for loading, unloading, or storage at the terminal. Acts as a financial incentive for efficient cargo clearance.',
    adPortsContext: 'Demurrage revenue appears on the Income Statement. Efficient dwell time management (18% better than regional peers) reduces demurrage disputes and strengthens customer satisfaction scores (4.6/5.0).',
    financialStatements: ['IS'],
    relatedTermIds: ['mar-bill-of-lading', 'ops-dwell-time'],
    sourceReference: 'Analytical Framework §6.2 — Competitive Advantage: Pricing Power',
  },
  {
    id: 'mar-bunker-fuel',
    term: 'Bunker Fuel',
    category: 'maritime',
    definition: 'Marine fuel oil used for vessel propulsion. A major cost driver in maritime operations, subject to global commodity price volatility and evolving environmental regulations (IMO 2020/2030).',
    adPortsContext: 'Risk R-001: Bunker Fuel Price Volatility, estimated IS impact: ±180M AED. CarbonWise Navigator tracks fuel efficiency and carbon intensity (CII compliance). Bunkering is an ancillary revenue stream.',
    financialStatements: ['IS'],
    relatedTermIds: ['mar-dwt', 'mar-draft'],
    sourceReference: 'Analytical Framework §9 — Risk Assessment: R-001',
  },
  {
    id: 'mar-draft',
    term: 'Draft',
    category: 'maritime',
    definition: 'The depth of water a vessel requires to float freely. Determines which ports and berths a vessel can access based on the channel and alongside depth available.',
    adPortsContext: 'Khalifa Port offers deep-water berths accommodating vessels with up to 16.5m draft, enabling Ultra Large Container Vessel (ULCV) calls. Draft restrictions affect berth allocation via the Slot-Bid AI module.',
    financialStatements: [],
    relatedTermIds: ['mar-dwt', 'ops-berth-utilization'],
    sourceReference: 'Analytical Framework §2.3 — Company Overview: Port Infrastructure',
  },
  {
    id: 'mar-dwt',
    term: 'Deadweight Tonnage (DWT)',
    category: 'maritime',
    definition: 'The maximum weight a vessel can safely carry, including cargo, fuel, freshwater, ballast water, provisions, and crew. The primary measure of vessel cargo-carrying capacity.',
    adPortsContext: 'AD Ports fleet total capacity: 2.4M DWT across 142 vessels (89 owned, 53 chartered). Fleet Book Value: 12.4B AED on the Balance Sheet. Average fleet age: 8.2 years.',
    financialStatements: ['BS'],
    relatedTermIds: ['mar-draft', 'mar-bunker-fuel'],
    sourceReference: 'Analytical Framework §2.1 — Company Overview: Asset Base',
  },
  {
    id: 'mar-ftz',
    term: 'Free Trade Zone',
    category: 'maritime',
    definition: 'A designated geographic area with special customs regulations, including duty exemptions, simplified procedures, and reduced tariffs. Designed to attract foreign investment and promote trade.',
    adPortsContext: 'AD Ports operates KIZAD (Khalifa Industrial Zone Abu Dhabi), one of the largest integrated trade and logistics free zones in the MENA region. FTZ revenue is a distinct revenue stream within the Ports segment.',
    financialStatements: ['IS'],
    relatedTermIds: ['mar-cabotage', 'mar-transshipment'],
    sourceReference: 'Analytical Framework §2.3 — Company Overview: Port Operations',
  },
  {
    id: 'mar-cabotage',
    term: 'Cabotage',
    category: 'maritime',
    definition: 'Coastal shipping between domestic ports within a single country. Typically regulated by national maritime law, which may restrict foreign-flagged vessels from operating on domestic routes.',
    adPortsContext: 'Cabotage regulations affect feeder service routing and competitive dynamics in the GCC region. AD Ports\' domestic network connects Abu Dhabi ports to other UAE coastal facilities under applicable maritime law.',
    financialStatements: [],
    relatedTermIds: ['mar-feeder-service', 'mar-transshipment'],
    sourceReference: 'Maritime Operations — Regulatory Framework',
  },
  {
    id: 'mar-roro',
    term: 'Ro-Ro',
    category: 'maritime',
    definition: 'Roll-on/Roll-off vessel type designed for wheeled cargo that is driven on and off the ship via built-in ramps. Used for vehicles, heavy machinery, and other wheeled or tracked equipment.',
    adPortsContext: 'Vehicle throughput: 4.2M units annually. Ro-Ro represents 12.3% of sector cargo mix. VIN-Chain Traceability solution tracks individual vehicle logistics from vessel discharge through yard to final delivery.',
    financialStatements: ['IS'],
    relatedTermIds: ['mar-bill-of-lading', 'mar-transshipment'],
    sourceReference: 'Analytical Framework §4.2 — Market Growth: Sector Analysis',
  },
  {
    id: 'mar-transshipment',
    term: 'Transshipment',
    category: 'maritime',
    definition: 'The transfer of containerized or bulk cargo from one vessel to another at an intermediate port, without the cargo entering the local customs territory. A key revenue driver for hub ports.',
    adPortsContext: 'Transshipment volumes contribute significantly to AD Ports\' 34.8% GCC market share. The Trade-Flow Oracle AI module analyzes transshipment routing patterns and predicts corridor-level demand shifts.',
    financialStatements: ['IS'],
    relatedTermIds: ['mar-feeder-service', 'ops-teu'],
    sourceReference: 'Analytical Framework §3.1 — Trade: Route Economics',
  },
  {
    id: 'mar-feeder-service',
    term: 'Feeder Service',
    category: 'maritime',
    definition: 'Smaller vessel routes that connect regional secondary ports to a main hub port, enabling cargo consolidation for long-haul ocean shipping on larger vessels.',
    adPortsContext: 'Feeder services connect AD Ports\' hub at Khalifa Port to regional ports across the GCC, Indian subcontinent, and East Africa. Feeder volume analysis is part of the Trade Corridor report (§3.1).',
    financialStatements: ['IS'],
    relatedTermIds: ['mar-transshipment', 'mar-cabotage'],
    sourceReference: 'Analytical Framework §3.1 — Trade: Route Economics',
  },

  // ── Technical / Platform Terms (10) ──
  {
    id: 'tech-analytical-framework',
    term: 'Analytical Framework',
    category: 'technical',
    definition: 'Structured methodology for financial and operational analysis across port operations. Organizes analytical outputs into sections covering company overview, trade, growth, customers, competitive advantage, historical financials, management plan, and risk.',
    adPortsContext: 'The Maritime AI Suite is built around the Analytical Framework structure: 9 sections, 25+ report templates, 186 KPIs. All reports trace to a specific Analytical Framework section for audit-grade provenance.',
    financialStatements: [],
    relatedTermIds: ['tech-fs-mapping', 'tech-report-template'],
    sourceReference: 'Platform Architecture — Analytical Framework Overview',
  },
  {
    id: 'tech-fs-mapping',
    term: 'Financial Statement Mapping',
    category: 'technical',
    definition: 'IS/BS/CF linkage system showing which KPIs and report fields appear on which financial statement. Enables audit-grade traceability from analytical insights to standard financial reporting.',
    adPortsContext: 'Every report field and risk item in the platform carries an IS, BS, or CF badge. IS (Income Statement) = blue, BS (Balance Sheet) = green, CF (Cash Flow) = amber. Enables instant financial statement context.',
    financialStatements: ['IS', 'BS', 'CF'],
    relatedTermIds: ['tech-analytical-framework', 'tech-report-template'],
    sourceReference: 'Platform Architecture — Financial Statement Integration',
  },
  {
    id: 'tech-heat-map',
    term: 'Heat Map',
    category: 'technical',
    definition: 'A 5x5 risk visualization matrix plotting Likelihood (1-5) against Impact (1-5). Color-coded from green (low) through amber (medium) to red (critical) for intuitive risk assessment.',
    adPortsContext: 'Used in the Risk Management module to visualize the full risk register. 12 risks plotted across 4 domains (Operational, Financial, Regulatory, Market). Enables quick identification of critical risk clusters.',
    financialStatements: [],
    relatedTermIds: ['tech-cross-module-ref', 'tech-kpi-dashboard'],
    sourceReference: 'Analytical Framework §9 — Risk Assessment: Heat Map Methodology',
  },
  {
    id: 'tech-report-template',
    term: 'Report Template',
    category: 'technical',
    definition: 'Pre-configured analytical report with defined data fields, formulas, financial statement mappings, and source references. Users select templates in the Analyse workspace to generate standardized outputs.',
    adPortsContext: '25 report templates across 4 domains: Financial (7), Operational (6), Market (6), Strategic (6). Each template includes 8 fields with types (currency, percentage, ratio, text) and sample AD Ports values.',
    financialStatements: [],
    relatedTermIds: ['tech-analytical-framework', 'tech-fs-mapping'],
    sourceReference: 'Platform Architecture — Analyse Workspace Guide',
  },
  {
    id: 'tech-cross-module-ref',
    term: 'Cross-Module Reference',
    category: 'technical',
    definition: 'Linked data connection between platform modules that enables navigation from one analytical context to related data in another module. Ensures integrated analysis across financial, operational, and strategic domains.',
    adPortsContext: 'Example: A risk item in Risk Management links to its financial impact line in Financial Analytics, and the CAPEX implications in Strategic Analytics. Enables end-to-end analytical traceability.',
    financialStatements: [],
    relatedTermIds: ['tech-analytical-framework', 'tech-data-drill-through'],
    sourceReference: 'Platform Architecture — Module Integration Guide',
  },
  {
    id: 'tech-domain-channel',
    term: 'Domain Channel',
    category: 'technical',
    definition: 'Collaboration space in the Connect module organized by analytical domain (Financial, Operational, Market, Strategic). Enables topic-specific discussions with context linking to relevant reports and KPIs.',
    adPortsContext: 'Each domain channel supports shared workspaces, comment threads on data points, and activity feeds. Activity metrics feed into the Capability Maturity assessment under collaboration readiness.',
    financialStatements: [],
    relatedTermIds: ['tech-analytical-framework', 'tech-learning-path'],
    sourceReference: 'Platform Architecture — Connect Module Guide',
  },
  {
    id: 'tech-learning-path',
    term: 'Learning Path',
    category: 'technical',
    definition: 'Structured sequence of training modules covering a specific solution or capability area. Includes overview, features, KPI connections, and integration content with progress tracking and certification.',
    adPortsContext: '14 learning paths: 10 Solution Paths (one per port AI solution) + 4 Capability Framework Paths (Financial, Operational, Market, Strategic). ~14 hours total. Professional Certificates upon completion.',
    financialStatements: [],
    relatedTermIds: ['tech-capability-maturity', 'tech-domain-channel'],
    sourceReference: 'Platform Architecture — Learning Hub Guide',
  },
  {
    id: 'tech-kpi-dashboard',
    term: 'KPI Dashboard',
    category: 'technical',
    definition: 'Visual summary of Key Performance Indicators with real-time values, trend indicators (improving/stable/worsening), and traffic-light status (green/amber/red) against defined targets.',
    adPortsContext: '186 total KPIs cascaded across 3 tiers: Board (20), Executive (48), Operational (118). The BiPM Dashboard shows 78.4% on-track, 14.2% requiring attention, 7.4% off-track. Monthly review cycle.',
    financialStatements: ['IS'],
    relatedTermIds: ['tech-analytical-framework', 'tech-capability-maturity'],
    sourceReference: 'CFO Framework — Business-Integrated Performance Management',
  },
  {
    id: 'tech-capability-maturity',
    term: 'Capability Maturity',
    category: 'technical',
    definition: 'Assessment framework measuring organizational readiness across six dimensions: Digital, Commercial, Operational, Financial, People & Culture, and Innovation. Scored on a 1-5 scale from Ad-hoc to Optimized.',
    adPortsContext: 'Current Overall Maturity: 3.95/5.0. Target (2028): 4.5/5.0. Strongest: Financial Discipline (4.5). Weakest: Innovation Index (3.4). Gap analysis drives strategic CAPEX and capability investment.',
    financialStatements: [],
    relatedTermIds: ['tech-kpi-dashboard', 'tech-learning-path'],
    sourceReference: 'CFO Framework — Capability Assessment',
  },
  {
    id: 'tech-data-drill-through',
    term: 'Data Drill-Through',
    category: 'technical',
    definition: 'Navigation capability from a summary metric or chart to the underlying detailed data source. Enables analysts to move from high-level KPI values down to transaction-level or field-level detail.',
    adPortsContext: 'Example: Clicking the EBITDA Margin KPI (43.0%) drills through to the EBITDA Bridge report, then to segment-level margins, and finally to individual cost line items. Supports audit-grade evidence chains.',
    financialStatements: [],
    relatedTermIds: ['tech-cross-module-ref', 'tech-report-template'],
    sourceReference: 'Platform Architecture — Data Navigation Patterns',
  },
]

// ─────────────────────────────────────────────────────────
// Alphabet helpers
// ─────────────────────────────────────────────────────────

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function getFirstLetter(term: string): string {
  return term.charAt(0).toUpperCase()
}

// ─────────────────────────────────────────────────────────
// Glossary Card Component
// ─────────────────────────────────────────────────────────

function GlossaryCard({
  item,
  allItems,
  onNavigate,
}: {
  item: GlossaryTerm
  allItems: GlossaryTerm[]
  onNavigate: (id: string) => void
}) {
  const cfg = categoryConfig[item.category]

  return (
    <div
      id={`term-${item.id}`}
      className={`bg-ad-white rounded-xl border border-border hover:shadow-card-hover transition-all duration-200 overflow-hidden border-l-4`}
      style={{ borderLeftColor: `var(--tw-${cfg.border.replace('border-', '')}, currentColor)` }}
    >
      {/* Use a colored left-border via a wrapper approach */}
      <div className={`relative`}>
        {/* Colored left strip */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.bg} -ml-[4px] rounded-l`} />

        <div className="p-5">
          {/* Term header row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-text-primary font-serif leading-snug">
                {item.term}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Category badge */}
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded text-white ${cfg.bg}`}>
                {cfg.label}
              </span>
              {/* Financial statement badges */}
              {item.financialStatements.map(fs => (
                <span
                  key={fs}
                  className={`text-[9px] font-bold px-2 py-0.5 rounded text-white ${statementConfig[fs].bg}`}
                >
                  {statementConfig[fs].label}
                </span>
              ))}
            </div>
          </div>

          {/* Definition */}
          <p className="text-xs text-text-secondary leading-relaxed mb-3">
            {item.definition}
          </p>

          {/* Formula (if applicable) */}
          {item.formula && (
            <div className="flex items-start gap-2 mb-3 p-2.5 rounded-lg bg-surface-secondary border border-border-light">
              <Calculator size={13} className="text-text-muted shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Formula</span>
                <p className="text-xs font-mono text-text-primary mt-0.5">{item.formula}</p>
              </div>
            </div>
          )}

          {/* AD Ports Context */}
          <div className="flex items-start gap-2 mb-3">
            <Anchor size={12} className="text-text-muted shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">AD Ports Context</span>
              <p className="text-[11px] text-text-secondary leading-relaxed mt-0.5">{item.adPortsContext}</p>
            </div>
          </div>

          {/* Source Reference */}
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={12} className="text-text-muted shrink-0" />
            <span className="text-[11px] text-text-muted italic">{item.sourceReference}</span>
          </div>

          {/* Related Terms */}
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-1.5 flex items-center gap-1">
              <Link2 size={10} />
              Related Terms
            </p>
            <div className="flex flex-wrap gap-1.5">
              {item.relatedTermIds.map(relId => {
                const related = allItems.find(t => t.id === relId)
                if (!related) return null
                return (
                  <button
                    key={relId}
                    onClick={() => onNavigate(relId)}
                    className="text-[10px] px-2 py-1 rounded-full bg-surface-secondary text-text-secondary hover:bg-surface hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {related.term}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Main Glossary Page
// ─────────────────────────────────────────────────────────

export default function Glossary() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | 'all'>('all')
  const [activeStatement, setActiveStatement] = useState<FinancialStatement | 'all'>('all')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  // Filter items
  const filteredItems = useMemo(() => {
    return glossaryTerms.filter(item => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false
      if (activeStatement !== 'all' && !item.financialStatements.includes(activeStatement)) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          item.term.toLowerCase().includes(q) ||
          item.definition.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [search, activeCategory, activeStatement])

  // Group by first letter
  const groupedByLetter = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {}
    const sorted = [...filteredItems].sort((a, b) => a.term.localeCompare(b.term))
    sorted.forEach(item => {
      const letter = getFirstLetter(item.term)
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(item)
    })
    return groups
  }, [filteredItems])

  // Letters that have terms
  const activeLetters = useMemo(() => {
    return new Set(Object.keys(groupedByLetter))
  }, [groupedByLetter])

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<GlossaryCategory, number> = {
      financial: 0,
      operational: 0,
      maritime: 0,
      technical: 0,
    }
    glossaryTerms.forEach(item => counts[item.category]++)
    return counts
  }, [])

  // Scroll to letter section
  const scrollToLetter = useCallback((letter: string) => {
    setActiveLetter(letter)
    const el = document.getElementById(`letter-${letter}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // Navigate to a related term
  const navigateToTerm = useCallback((id: string) => {
    const term = glossaryTerms.find(t => t.id === id)
    if (!term) return
    // Clear filters so the term is visible
    setActiveCategory('all')
    setActiveStatement('all')
    setSearch('')
    // Delay scroll slightly to allow re-render
    setTimeout(() => {
      const el = document.getElementById(`term-${id}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Flash highlight
        el.classList.add('ring-2', 'ring-ad-red/40')
        setTimeout(() => el.classList.remove('ring-2', 'ring-ad-red/40'), 2000)
      }
    }, 100)
  }, [])

  // Scroll to top
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-ad-red/10 flex items-center justify-center">
            <BookOpen size={22} className="text-ad-red" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary font-serif">Glossary</h1>
            <p className="text-xs text-text-muted">Analytical Field Definitions with IS / BS / CF Mappings</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          Comprehensive dictionary of {glossaryTerms.length} terms across Financial, Operational, Maritime,
          and Technical domains. Each entry includes definitions, formulas, AD Ports context,
          financial statement mappings, and related term links.
        </p>

        {/* Summary Stats */}
        <div className="flex items-center gap-4 mt-3">
          {categories.map(cat => {
            const cfg = categoryConfig[cat]
            return (
              <div key={cat} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${cfg.bg}`} />
                <span className="text-xs text-text-secondary">{categoryCounts[cat]} {cfg.label}</span>
              </div>
            )
          })}
          <span className="text-xs text-text-muted ml-2">{glossaryTerms.length} total</span>
        </div>
      </div>

      {/* Top Bar: Search + Alphabet Navigation */}
      <div className="bg-ad-white rounded-xl border border-border p-3 mb-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-2.5">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search terms or definitions..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface-secondary rounded-lg border border-border-light
                focus:outline-none focus:border-ad-red/30 focus:ring-1 focus:ring-ad-red/20 transition-all
                text-text-primary placeholder:text-text-muted"
            />
          </div>
          {search.trim() && (
            <span className="text-[11px] text-text-muted shrink-0">
              {filteredItems.length} match{filteredItems.length !== 1 ? 'es' : ''}
            </span>
          )}
        </div>

        {/* Alphabet bar */}
        <div className="flex items-center gap-0.5 flex-wrap">
          {ALPHABET.map(letter => {
            const hasTerms = activeLetters.has(letter)
            const isActive = activeLetter === letter
            return (
              <button
                key={letter}
                onClick={() => hasTerms && scrollToLetter(letter)}
                disabled={!hasTerms}
                className={`w-7 h-7 rounded text-[11px] font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-ad-red text-white'
                    : hasTerms
                      ? 'bg-surface-secondary text-text-primary hover:bg-ad-red/10 hover:text-ad-red cursor-pointer'
                      : 'bg-transparent text-text-muted/30 cursor-default'
                }`}
              >
                {letter}
              </button>
            )
          })}
        </div>
      </div>

      {/* Workspace Layout */}
      <div className="flex gap-4" style={{ minHeight: 'calc(100vh - 380px)' }}>
        {/* Left Sidebar — 200px */}
        <div className="w-[200px] shrink-0">
          <div className="bg-ad-white rounded-xl border border-border p-4 sticky top-[120px]">
            {/* Category filters */}
            <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">
              Category
            </h3>
            <div className="space-y-1 mb-4">
              <button
                onClick={() => { setActiveCategory('all'); setActiveLetter(null) }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-ad-red/10 text-ad-red'
                    : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                }`}
              >
                <span>All Terms</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeCategory === 'all' ? 'bg-ad-red/20 text-ad-red' : 'bg-surface-secondary text-text-muted'
                }`}>
                  {glossaryTerms.length}
                </span>
              </button>

              {categories.map(cat => {
                const cfg = categoryConfig[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setActiveLetter(null) }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      activeCategory === cat
                        ? `${cfg.bgLight} ${cfg.color}`
                        : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cfg.bg}`} />
                      <span>{cfg.label}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      activeCategory === cat ? `${cfg.bgLight} ${cfg.color}` : 'bg-surface-secondary text-text-muted'
                    }`}>
                      {categoryCounts[cat]}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Financial Statement Filter */}
            <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">
              Financial Statement
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => { setActiveStatement('all'); setActiveLetter(null) }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeStatement === 'all'
                    ? 'bg-ad-red/10 text-ad-red'
                    : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                }`}
              >
                <span>All</span>
              </button>
              {(['IS', 'BS', 'CF'] as FinancialStatement[]).map(fs => {
                const fsCfg = statementConfig[fs]
                const fullLabels: Record<FinancialStatement, string> = {
                  IS: 'Income Statement',
                  BS: 'Balance Sheet',
                  CF: 'Cash Flow',
                }
                return (
                  <button
                    key={fs}
                    onClick={() => { setActiveStatement(fs); setActiveLetter(null) }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      activeStatement === fs
                        ? 'bg-surface-secondary text-text-primary'
                        : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${fsCfg.bg}`}>
                        {fsCfg.label}
                      </span>
                      <span>{fullLabels[fs]}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Area */}
        <div ref={mainRef} className="flex-1 min-w-0">
          {filteredItems.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-surface-secondary flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-text-muted" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">No terms found</h3>
                <p className="text-xs text-text-muted max-w-xs">
                  Try adjusting your search terms, category, or financial statement filter.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {ALPHABET.filter(letter => groupedByLetter[letter]).map(letter => (
                <div key={letter} id={`letter-${letter}`}>
                  {/* Letter Header */}
                  <div className="flex items-center gap-3 mb-3 scroll-mt-[140px]">
                    <div className="w-9 h-9 rounded-lg bg-ad-red/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-ad-red">{letter}</span>
                    </div>
                    <span className="text-[10px] text-text-muted font-medium">
                      {groupedByLetter[letter].length} term{groupedByLetter[letter].length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex-1 h-px bg-border-light ml-1" />
                  </div>

                  {/* Term Cards */}
                  <div className="space-y-3">
                    {groupedByLetter[letter].map(item => (
                      <GlossaryCard
                        key={item.id}
                        item={item}
                        allItems={glossaryTerms}
                        onNavigate={navigateToTerm}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back to top button */}
          <div className="flex justify-center mt-8 mb-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-secondary text-text-secondary hover:bg-ad-red/10 hover:text-ad-red transition-colors text-xs font-medium"
            >
              <ArrowUp size={14} />
              Back to top
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
