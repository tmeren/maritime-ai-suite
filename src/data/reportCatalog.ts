/**
 * Analytical Report Catalog — Maritime AI Suite
 *
 * Every report template traces to an analytical framework section and maps to
 * a financial statement type (IS / BS / CF) for audit-grade traceability.
 *
 * Domains: Financial, Operational, Market, Strategic
 * Source: Analytical Framework Structure + CFO Framework
 */

export type FinancialStatement = 'IS' | 'BS' | 'CF'
export type Domain = 'financial' | 'operational' | 'market' | 'strategic'

export interface ReportField {
  name: string
  type: 'currency' | 'percentage' | 'number' | 'ratio' | 'text' | 'date'
  sampleValue: string
  unit?: string
  financialStatement: FinancialStatement
}

export interface ReportTemplate {
  id: string
  name: string
  domain: Domain
  analyticalSection: string
  analyticalReference: string
  description: string
  primaryStatement: FinancialStatement
  fields: ReportField[]
  tags: string[]
}

// ─────────────────────────────────────────────────────────
// FINANCIAL DOMAIN — Analytical Framework Section 7 + Section 8
// ─────────────────────────────────────────────────────────

export const financialReports: ReportTemplate[] = [
  {
    id: 'fin-revenue-waterfall',
    name: 'Revenue Waterfall',
    domain: 'financial',
    analyticalSection: 'Section 7.1',
    analyticalReference: 'Analytical Framework —Historical Financials: Revenue Decomposition',
    description: 'Top-line revenue breakdown by business segment, geography, and customer tier. Tracks organic vs inorganic growth with waterfall visualization.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Total Revenue', type: 'currency', sampleValue: '14.2B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Ports Revenue', type: 'currency', sampleValue: '8.1B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Logistics Revenue', type: 'currency', sampleValue: '3.4B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Maritime Revenue', type: 'currency', sampleValue: '1.8B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Digital Revenue', type: 'currency', sampleValue: '0.9B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Organic Growth', type: 'percentage', sampleValue: '+12.3%', financialStatement: 'IS' },
      { name: 'Inorganic Growth', type: 'percentage', sampleValue: '+4.7%', financialStatement: 'IS' },
      { name: 'Revenue per TEU', type: 'currency', sampleValue: '412', unit: 'AED', financialStatement: 'IS' },
    ],
    tags: ['revenue', 'waterfall', 'segments', 'growth'],
  },
  {
    id: 'fin-ebitda-bridge',
    name: 'EBITDA Bridge',
    domain: 'financial',
    analyticalSection: 'Section 7.2',
    analyticalReference: 'Analytical Framework —Historical Financials: EBITDA Walk',
    description: 'EBITDA bridge from prior year to current year, decomposing drivers: volume, pricing, mix, cost efficiencies, and one-off items.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Prior Year EBITDA', type: 'currency', sampleValue: '4.8B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Volume Impact', type: 'currency', sampleValue: '+620M', unit: 'AED', financialStatement: 'IS' },
      { name: 'Price / Mix Impact', type: 'currency', sampleValue: '+340M', unit: 'AED', financialStatement: 'IS' },
      { name: 'Cost Efficiencies', type: 'currency', sampleValue: '+180M', unit: 'AED', financialStatement: 'IS' },
      { name: 'New Business', type: 'currency', sampleValue: '+290M', unit: 'AED', financialStatement: 'IS' },
      { name: 'One-off Items', type: 'currency', sampleValue: '-95M', unit: 'AED', financialStatement: 'IS' },
      { name: 'Current Year EBITDA', type: 'currency', sampleValue: '6.1B', unit: 'AED', financialStatement: 'IS' },
      { name: 'EBITDA Margin', type: 'percentage', sampleValue: '43.0%', financialStatement: 'IS' },
    ],
    tags: ['ebitda', 'bridge', 'profitability', 'margin'],
  },
  {
    id: 'fin-cost-structure',
    name: 'Cost Structure Breakdown',
    domain: 'financial',
    analyticalSection: 'Section 7.3',
    analyticalReference: 'Analytical Framework —Historical Financials: OpEx Analysis',
    description: 'Operating cost decomposition by category: labor, fuel/energy, maintenance, depreciation, and SG&A with trend analysis.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Total OpEx', type: 'currency', sampleValue: '8.1B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Labor Costs', type: 'currency', sampleValue: '2.9B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Fuel & Energy', type: 'currency', sampleValue: '1.6B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Maintenance & Repairs', type: 'currency', sampleValue: '1.1B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Depreciation', type: 'currency', sampleValue: '1.4B', unit: 'AED', financialStatement: 'IS' },
      { name: 'SG&A', type: 'currency', sampleValue: '0.7B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Other Operating', type: 'currency', sampleValue: '0.4B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Cost-to-Revenue Ratio', type: 'percentage', sampleValue: '57.0%', financialStatement: 'IS' },
    ],
    tags: ['cost', 'opex', 'structure', 'efficiency'],
  },
  {
    id: 'fin-profitability',
    name: 'Profitability Analysis',
    domain: 'financial',
    analyticalSection: 'Section 7.4',
    analyticalReference: 'Analytical Framework —Historical Financials: Margin Analysis',
    description: 'Multi-layer profitability analysis: gross margin, EBITDA margin, EBIT margin, and net margin with peer benchmarking.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Gross Profit', type: 'currency', sampleValue: '8.5B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Gross Margin', type: 'percentage', sampleValue: '59.9%', financialStatement: 'IS' },
      { name: 'EBITDA', type: 'currency', sampleValue: '6.1B', unit: 'AED', financialStatement: 'IS' },
      { name: 'EBITDA Margin', type: 'percentage', sampleValue: '43.0%', financialStatement: 'IS' },
      { name: 'EBIT', type: 'currency', sampleValue: '4.7B', unit: 'AED', financialStatement: 'IS' },
      { name: 'EBIT Margin', type: 'percentage', sampleValue: '33.1%', financialStatement: 'IS' },
      { name: 'Net Income', type: 'currency', sampleValue: '3.2B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Net Margin', type: 'percentage', sampleValue: '22.5%', financialStatement: 'IS' },
    ],
    tags: ['profitability', 'margins', 'benchmarking'],
  },
  {
    id: 'fin-leverage-ratios',
    name: 'Leverage Ratios',
    domain: 'financial',
    analyticalSection: 'Section 7.5',
    analyticalReference: 'Analytical Framework —Historical Financials: Capital Structure',
    description: 'Debt structure analysis: Net Debt/EBITDA, interest coverage, debt maturity profile, and covenant compliance tracking.',
    primaryStatement: 'BS',
    fields: [
      { name: 'Total Debt', type: 'currency', sampleValue: '18.7B', unit: 'AED', financialStatement: 'BS' },
      { name: 'Cash & Equivalents', type: 'currency', sampleValue: '3.2B', unit: 'AED', financialStatement: 'BS' },
      { name: 'Net Debt', type: 'currency', sampleValue: '15.5B', unit: 'AED', financialStatement: 'BS' },
      { name: 'Net Debt / EBITDA', type: 'ratio', sampleValue: '2.5x', financialStatement: 'BS' },
      { name: 'Interest Coverage', type: 'ratio', sampleValue: '5.8x', financialStatement: 'IS' },
      { name: 'Debt / Equity', type: 'ratio', sampleValue: '0.9x', financialStatement: 'BS' },
      { name: 'Weighted Avg Cost of Debt', type: 'percentage', sampleValue: '4.2%', financialStatement: 'IS' },
      { name: 'Avg Debt Maturity', type: 'text', sampleValue: '6.3 years', financialStatement: 'BS' },
    ],
    tags: ['leverage', 'debt', 'capital-structure', 'covenants'],
  },
  {
    id: 'fin-cashflow-projection',
    name: 'Cash Flow Projection',
    domain: 'financial',
    analyticalSection: 'Section 7.6',
    analyticalReference: 'Analytical Framework —Historical Financials: FCF Analysis',
    description: 'Free cash flow build-up: operating cash flow, CAPEX, working capital changes, and FCF yield with conversion analysis.',
    primaryStatement: 'CF',
    fields: [
      { name: 'Operating Cash Flow', type: 'currency', sampleValue: '5.4B', unit: 'AED', financialStatement: 'CF' },
      { name: 'Maintenance CAPEX', type: 'currency', sampleValue: '-1.2B', unit: 'AED', financialStatement: 'CF' },
      { name: 'Growth CAPEX', type: 'currency', sampleValue: '-2.1B', unit: 'AED', financialStatement: 'CF' },
      { name: 'Working Capital Change', type: 'currency', sampleValue: '-0.3B', unit: 'AED', financialStatement: 'CF' },
      { name: 'Free Cash Flow', type: 'currency', sampleValue: '1.8B', unit: 'AED', financialStatement: 'CF' },
      { name: 'FCF Yield', type: 'percentage', sampleValue: '6.2%', financialStatement: 'CF' },
      { name: 'FCF Conversion', type: 'percentage', sampleValue: '29.5%', financialStatement: 'CF' },
      { name: 'Dividend Payout', type: 'currency', sampleValue: '1.1B', unit: 'AED', financialStatement: 'CF' },
    ],
    tags: ['cashflow', 'fcf', 'capex', 'dividends'],
  },
  {
    id: 'fin-capex-planning',
    name: 'CAPEX Planning',
    domain: 'financial',
    analyticalSection: 'Section 8.1',
    analyticalReference: 'Analytical Framework —Management Plan: Capital Allocation',
    description: 'Capital expenditure planning across maintenance, expansion, and digital transformation with IRR and payback period tracking.',
    primaryStatement: 'CF',
    fields: [
      { name: 'Total CAPEX Budget', type: 'currency', sampleValue: '3.3B', unit: 'AED', financialStatement: 'CF' },
      { name: 'Maintenance CAPEX', type: 'currency', sampleValue: '1.2B', unit: 'AED', financialStatement: 'CF' },
      { name: 'Expansion CAPEX', type: 'currency', sampleValue: '1.5B', unit: 'AED', financialStatement: 'CF' },
      { name: 'Digital CAPEX', type: 'currency', sampleValue: '0.6B', unit: 'AED', financialStatement: 'CF' },
      { name: 'CAPEX / Revenue', type: 'percentage', sampleValue: '23.2%', financialStatement: 'CF' },
      { name: 'Weighted Avg IRR', type: 'percentage', sampleValue: '14.8%', financialStatement: 'CF' },
      { name: 'Avg Payback Period', type: 'text', sampleValue: '4.2 years', financialStatement: 'CF' },
      { name: 'Committed Pipeline', type: 'currency', sampleValue: '7.8B', unit: 'AED', financialStatement: 'BS' },
    ],
    tags: ['capex', 'investment', 'irr', 'payback'],
  },
]

// ─────────────────────────────────────────────────────────
// OPERATIONAL DOMAIN — Analytical Framework Section 2 + Section 5
// ─────────────────────────────────────────────────────────

export const operationalReports: ReportTemplate[] = [
  {
    id: 'ops-fleet-profile',
    name: 'Fleet Profile',
    domain: 'operational',
    analyticalSection: 'Section 2.1',
    analyticalReference: 'Analytical Framework —Company Overview: Asset Base',
    description: 'Complete fleet inventory: vessel types, capacities, age profiles, ownership structure (owned vs chartered), and deployment status.',
    primaryStatement: 'BS',
    fields: [
      { name: 'Total Vessels', type: 'number', sampleValue: '142', financialStatement: 'BS' },
      { name: 'Owned Vessels', type: 'number', sampleValue: '89', financialStatement: 'BS' },
      { name: 'Chartered Vessels', type: 'number', sampleValue: '53', financialStatement: 'IS' },
      { name: 'Total Capacity', type: 'text', sampleValue: '2.4M DWT', financialStatement: 'BS' },
      { name: 'Average Fleet Age', type: 'text', sampleValue: '8.2 years', financialStatement: 'BS' },
      { name: 'Fleet Book Value', type: 'currency', sampleValue: '12.4B', unit: 'AED', financialStatement: 'BS' },
      { name: 'Charter Cost (Annual)', type: 'currency', sampleValue: '1.9B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Fleet Utilization', type: 'percentage', sampleValue: '87.3%', financialStatement: 'IS' },
    ],
    tags: ['fleet', 'vessels', 'assets', 'capacity'],
  },
  {
    id: 'ops-vessel-utilization',
    name: 'Vessel Utilization',
    domain: 'operational',
    analyticalSection: 'Section 2.2',
    analyticalReference: 'Analytical Framework —Company Overview: Operational Efficiency',
    description: 'Vessel deployment efficiency: utilization rates by vessel type, idle time analysis, repositioning costs, and seasonal patterns.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Overall Utilization', type: 'percentage', sampleValue: '87.3%', financialStatement: 'IS' },
      { name: 'Container Utilization', type: 'percentage', sampleValue: '91.2%', financialStatement: 'IS' },
      { name: 'Bulk Utilization', type: 'percentage', sampleValue: '84.6%', financialStatement: 'IS' },
      { name: 'Tanker Utilization', type: 'percentage', sampleValue: '79.8%', financialStatement: 'IS' },
      { name: 'Idle Days (Total)', type: 'number', sampleValue: '1,847', financialStatement: 'IS' },
      { name: 'Repositioning Cost', type: 'currency', sampleValue: '142M', unit: 'AED', financialStatement: 'IS' },
      { name: 'Revenue per Vessel Day', type: 'currency', sampleValue: '78K', unit: 'AED', financialStatement: 'IS' },
      { name: 'Breakeven Utilization', type: 'percentage', sampleValue: '62.0%', financialStatement: 'IS' },
    ],
    tags: ['utilization', 'efficiency', 'deployment', 'idle'],
  },
  {
    id: 'ops-port-throughput',
    name: 'Port Throughput',
    domain: 'operational',
    analyticalSection: 'Section 2.3',
    analyticalReference: 'Analytical Framework —Company Overview: Port Operations',
    description: 'Port throughput volumes by terminal: TEU, vehicles, bulk tonnage with berth productivity and turnaround metrics.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Total TEU', type: 'text', sampleValue: '16.8M TEU', financialStatement: 'IS' },
      { name: 'Container Throughput', type: 'text', sampleValue: '12.4M TEU', financialStatement: 'IS' },
      { name: 'Vehicle Throughput', type: 'text', sampleValue: '4.2M units', financialStatement: 'IS' },
      { name: 'Bulk Tonnage', type: 'text', sampleValue: '28.6M MT', financialStatement: 'IS' },
      { name: 'Berth Productivity', type: 'text', sampleValue: '32 moves/hr', financialStatement: 'IS' },
      { name: 'Avg Turnaround Time', type: 'text', sampleValue: '18.4 hours', financialStatement: 'IS' },
      { name: 'Capacity Utilization', type: 'percentage', sampleValue: '78.5%', financialStatement: 'BS' },
      { name: 'Revenue per TEU', type: 'currency', sampleValue: '412', unit: 'AED', financialStatement: 'IS' },
    ],
    tags: ['throughput', 'teu', 'port', 'terminal'],
  },
  {
    id: 'ops-intermodal-network',
    name: 'Intermodal Network',
    domain: 'operational',
    analyticalSection: 'Section 2.4',
    analyticalReference: 'Analytical Framework —Company Overview: Logistics Network',
    description: 'Intermodal connectivity analysis: truck gate movements, rail connections, ICD operations, and last-mile delivery performance.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Truck Gate Movements', type: 'text', sampleValue: '2.8M moves', financialStatement: 'IS' },
      { name: 'Rail Connections', type: 'number', sampleValue: '12', financialStatement: 'BS' },
      { name: 'Rail Volume', type: 'text', sampleValue: '1.2M TEU', financialStatement: 'IS' },
      { name: 'ICD Throughput', type: 'text', sampleValue: '890K TEU', financialStatement: 'IS' },
      { name: 'Avg Truck Turnaround', type: 'text', sampleValue: '42 min', financialStatement: 'IS' },
      { name: 'Last-Mile On-Time', type: 'percentage', sampleValue: '94.2%', financialStatement: 'IS' },
      { name: 'Intermodal Revenue', type: 'currency', sampleValue: '2.1B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Network Coverage', type: 'text', sampleValue: '38 countries', financialStatement: 'BS' },
    ],
    tags: ['intermodal', 'rail', 'trucking', 'logistics'],
  },
  {
    id: 'ops-workforce-metrics',
    name: 'Workforce Metrics',
    domain: 'operational',
    analyticalSection: 'Section 5.1',
    analyticalReference: 'Analytical Framework —Customers: Human Capital',
    description: 'Workforce analytics: headcount by function, productivity ratios, training hours, attrition rates, and labor cost per TEU.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Total Headcount', type: 'number', sampleValue: '42,600', financialStatement: 'IS' },
      { name: 'Operations Staff', type: 'number', sampleValue: '28,400', financialStatement: 'IS' },
      { name: 'Management & Admin', type: 'number', sampleValue: '8,200', financialStatement: 'IS' },
      { name: 'Technical & Engineering', type: 'number', sampleValue: '6,000', financialStatement: 'IS' },
      { name: 'Revenue per Employee', type: 'currency', sampleValue: '333K', unit: 'AED', financialStatement: 'IS' },
      { name: 'Training Hours / Year', type: 'number', sampleValue: '84', financialStatement: 'IS' },
      { name: 'Attrition Rate', type: 'percentage', sampleValue: '8.4%', financialStatement: 'IS' },
      { name: 'Labor Cost per TEU', type: 'currency', sampleValue: '173', unit: 'AED', financialStatement: 'IS' },
    ],
    tags: ['workforce', 'headcount', 'productivity', 'hr'],
  },
  {
    id: 'ops-capacity-planning',
    name: 'Capacity Planning',
    domain: 'operational',
    analyticalSection: 'Section 5.2',
    analyticalReference: 'Analytical Framework —Customers: Growth Capacity',
    description: 'Capacity expansion planning: current vs planned capacity, expansion timelines, investment requirements, and demand forecasts.',
    primaryStatement: 'BS',
    fields: [
      { name: 'Current Capacity', type: 'text', sampleValue: '21.4M TEU', financialStatement: 'BS' },
      { name: 'Current Utilization', type: 'percentage', sampleValue: '78.5%', financialStatement: 'IS' },
      { name: 'Planned Expansion', type: 'text', sampleValue: '+6.2M TEU', financialStatement: 'BS' },
      { name: 'Target Capacity (2028)', type: 'text', sampleValue: '27.6M TEU', financialStatement: 'BS' },
      { name: 'Expansion CAPEX', type: 'currency', sampleValue: '4.8B', unit: 'AED', financialStatement: 'CF' },
      { name: 'Demand CAGR (5Y)', type: 'percentage', sampleValue: '+6.8%', financialStatement: 'IS' },
      { name: 'Headroom (Years)', type: 'text', sampleValue: '3.4 years', financialStatement: 'BS' },
      { name: 'Greenfield Projects', type: 'number', sampleValue: '4', financialStatement: 'BS' },
    ],
    tags: ['capacity', 'expansion', 'demand', 'planning'],
  },
]

// ─────────────────────────────────────────────────────────
// MARKET DOMAIN — Analytical Framework Section 3 + Section 4 + Section 6
// ─────────────────────────────────────────────────────────

export const marketReports: ReportTemplate[] = [
  {
    id: 'mkt-trade-corridor',
    name: 'Trade Corridor Analysis',
    domain: 'market',
    analyticalSection: 'Section 3.1',
    analyticalReference: 'Analytical Framework —Trade: Route Economics',
    description: 'Trade corridor volume and value analysis by route: Asia-GCC, Europe-GCC, Africa-GCC with growth trends and modal share.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Total Trade Volume', type: 'text', sampleValue: '48.2M TEU', financialStatement: 'IS' },
      { name: 'Asia-GCC Volume', type: 'text', sampleValue: '22.1M TEU', financialStatement: 'IS' },
      { name: 'Europe-GCC Volume', type: 'text', sampleValue: '12.8M TEU', financialStatement: 'IS' },
      { name: 'Africa-GCC Volume', type: 'text', sampleValue: '8.4M TEU', financialStatement: 'IS' },
      { name: 'Americas-GCC Volume', type: 'text', sampleValue: '4.9M TEU', financialStatement: 'IS' },
      { name: 'Trade Value', type: 'currency', sampleValue: '892B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Volume CAGR (5Y)', type: 'percentage', sampleValue: '+5.2%', financialStatement: 'IS' },
      { name: 'AD Ports Market Share', type: 'percentage', sampleValue: '34.8%', financialStatement: 'IS' },
    ],
    tags: ['trade', 'corridors', 'routes', 'volume'],
  },
  {
    id: 'mkt-modal-share',
    name: 'Modal Share Comparison',
    domain: 'market',
    analyticalSection: 'Section 3.2',
    analyticalReference: 'Analytical Framework —Trade: Modal Split',
    description: 'Transportation modal share analysis: maritime vs air vs land with cost-per-unit comparison and trend evolution.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Maritime Share', type: 'percentage', sampleValue: '72.4%', financialStatement: 'IS' },
      { name: 'Air Cargo Share', type: 'percentage', sampleValue: '14.2%', financialStatement: 'IS' },
      { name: 'Road/Rail Share', type: 'percentage', sampleValue: '13.4%', financialStatement: 'IS' },
      { name: 'Maritime Cost / TEU', type: 'currency', sampleValue: '1,240', unit: 'AED', financialStatement: 'IS' },
      { name: 'Air Cost / kg', type: 'currency', sampleValue: '8.60', unit: 'AED', financialStatement: 'IS' },
      { name: 'Road Cost / TEU-km', type: 'currency', sampleValue: '2.40', unit: 'AED', financialStatement: 'IS' },
      { name: 'Maritime Share Trend', type: 'percentage', sampleValue: '+1.2pp', financialStatement: 'IS' },
      { name: 'Avg Transit Days', type: 'text', sampleValue: '14.2 days', financialStatement: 'IS' },
    ],
    tags: ['modal', 'share', 'maritime', 'air', 'land'],
  },
  {
    id: 'mkt-competitive-positioning',
    name: 'Competitive Positioning',
    domain: 'market',
    analyticalSection: 'Section 6.1',
    analyticalReference: 'Analytical Framework —Competitive Advantage: Market Position',
    description: 'Competitive radar analysis: port rankings, throughput comparison, service quality benchmarks, and market share evolution.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Global Port Ranking', type: 'text', sampleValue: '#11', financialStatement: 'IS' },
      { name: 'Regional Ranking', type: 'text', sampleValue: '#1 (GCC)', financialStatement: 'IS' },
      { name: 'Market Share (Region)', type: 'percentage', sampleValue: '34.8%', financialStatement: 'IS' },
      { name: 'Market Share Change', type: 'percentage', sampleValue: '+2.1pp', financialStatement: 'IS' },
      { name: 'Service Quality Score', type: 'text', sampleValue: '4.6/5.0', financialStatement: 'IS' },
      { name: 'Dwell Time vs Peers', type: 'text', sampleValue: '-18% better', financialStatement: 'IS' },
      { name: 'Price Premium', type: 'percentage', sampleValue: '+8.4%', financialStatement: 'IS' },
      { name: 'Customer Retention', type: 'percentage', sampleValue: '96.2%', financialStatement: 'IS' },
    ],
    tags: ['competitive', 'ranking', 'market-share', 'benchmarking'],
  },
  {
    id: 'mkt-pricing-analysis',
    name: 'Pricing Analysis',
    domain: 'market',
    analyticalSection: 'Section 6.2',
    analyticalReference: 'Analytical Framework —Competitive Advantage: Pricing Power',
    description: 'Pricing power assessment: tariff structures, rate evolution, contract vs spot mix, and price elasticity indicators.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Avg Revenue / TEU', type: 'currency', sampleValue: '412', unit: 'AED', financialStatement: 'IS' },
      { name: 'Contract Rate', type: 'currency', sampleValue: '388', unit: 'AED/TEU', financialStatement: 'IS' },
      { name: 'Spot Rate', type: 'currency', sampleValue: '465', unit: 'AED/TEU', financialStatement: 'IS' },
      { name: 'Contract / Spot Mix', type: 'text', sampleValue: '72% / 28%', financialStatement: 'IS' },
      { name: 'YoY Rate Change', type: 'percentage', sampleValue: '+4.8%', financialStatement: 'IS' },
      { name: 'Price Elasticity', type: 'ratio', sampleValue: '-0.32', financialStatement: 'IS' },
      { name: 'Premium vs Peers', type: 'percentage', sampleValue: '+8.4%', financialStatement: 'IS' },
      { name: 'Tariff Review Cycle', type: 'text', sampleValue: 'Annual', financialStatement: 'IS' },
    ],
    tags: ['pricing', 'tariff', 'rates', 'elasticity'],
  },
  {
    id: 'mkt-growth-drivers',
    name: 'Growth Driver Assessment',
    domain: 'market',
    analyticalSection: 'Section 4.1',
    analyticalReference: 'Analytical Framework —Market Growth: Leading Indicators',
    description: 'Growth driver index: GDP correlation, trade multiplier, sector-specific demand drivers, and leading indicator dashboard.',
    primaryStatement: 'IS',
    fields: [
      { name: 'UAE GDP Growth', type: 'percentage', sampleValue: '+4.2%', financialStatement: 'IS' },
      { name: 'Trade Multiplier', type: 'ratio', sampleValue: '1.6x GDP', financialStatement: 'IS' },
      { name: 'Container CAGR (5Y)', type: 'percentage', sampleValue: '+6.8%', financialStatement: 'IS' },
      { name: 'E-Commerce Growth', type: 'percentage', sampleValue: '+18.4%', financialStatement: 'IS' },
      { name: 'Manufacturing PMI', type: 'number', sampleValue: '54.2', financialStatement: 'IS' },
      { name: 'FDI Inflows', type: 'currency', sampleValue: '82B', unit: 'AED', financialStatement: 'CF' },
      { name: 'Population Growth', type: 'percentage', sampleValue: '+1.8%', financialStatement: 'IS' },
      { name: 'Urbanization Rate', type: 'percentage', sampleValue: '87.5%', financialStatement: 'IS' },
    ],
    tags: ['growth', 'drivers', 'gdp', 'demand'],
  },
  {
    id: 'mkt-sector-breakdown',
    name: 'Sector Breakdown',
    domain: 'market',
    analyticalSection: 'Section 4.2',
    analyticalReference: 'Analytical Framework —Market Growth: Sector Analysis',
    description: 'Sector-level market analysis: containerized, bulk, vehicles, energy, and specialized cargo with growth trajectories.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Containerized Cargo', type: 'percentage', sampleValue: '52.4%', financialStatement: 'IS' },
      { name: 'Dry Bulk', type: 'percentage', sampleValue: '18.7%', financialStatement: 'IS' },
      { name: 'Vehicles (Ro-Ro)', type: 'percentage', sampleValue: '12.3%', financialStatement: 'IS' },
      { name: 'Liquid Bulk / Energy', type: 'percentage', sampleValue: '9.8%', financialStatement: 'IS' },
      { name: 'Specialized Cargo', type: 'percentage', sampleValue: '6.8%', financialStatement: 'IS' },
      { name: 'Fastest Growing', type: 'text', sampleValue: 'E-commerce (+18%)', financialStatement: 'IS' },
      { name: 'Sector Revenue Mix', type: 'text', sampleValue: 'See breakdown', financialStatement: 'IS' },
      { name: 'Sector Margin Spread', type: 'text', sampleValue: '28-51%', financialStatement: 'IS' },
    ],
    tags: ['sector', 'cargo', 'breakdown', 'mix'],
  },
]

// ─────────────────────────────────────────────────────────
// STRATEGIC DOMAIN — Analytical Framework Section 8 + CFO Framework
// ─────────────────────────────────────────────────────────

export const strategicReports: ReportTemplate[] = [
  {
    id: 'str-value-creation',
    name: 'EBITDA Bridge (Value Creation)',
    domain: 'strategic',
    analyticalSection: 'Section 8.1',
    analyticalReference: 'Analytical Framework —Management Plan: Value Creation Roadmap',
    description: 'Strategic EBITDA bridge: current → target EBITDA decomposed by value levers — organic growth, M&A, cost optimization, and portfolio actions.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Current EBITDA', type: 'currency', sampleValue: '6.1B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Organic Growth', type: 'currency', sampleValue: '+1.8B', unit: 'AED', financialStatement: 'IS' },
      { name: 'M&A Synergies', type: 'currency', sampleValue: '+0.9B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Cost Optimization', type: 'currency', sampleValue: '+0.6B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Portfolio Actions', type: 'currency', sampleValue: '+0.4B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Target EBITDA (2028)', type: 'currency', sampleValue: '9.8B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Implied CAGR', type: 'percentage', sampleValue: '+12.6%', financialStatement: 'IS' },
      { name: 'Confidence Level', type: 'text', sampleValue: 'Management Case', financialStatement: 'IS' },
    ],
    tags: ['value-creation', 'ebitda-bridge', 'strategy', 'levers'],
  },
  {
    id: 'str-capex-timeline',
    name: 'CAPEX Timeline',
    domain: 'strategic',
    analyticalSection: 'Section 8.2',
    analyticalReference: 'Analytical Framework —Management Plan: Investment Program',
    description: 'Multi-year CAPEX timeline with project-level detail: milestones, completion status, budget vs actual, and risk flags.',
    primaryStatement: 'CF',
    fields: [
      { name: 'Total Program Value', type: 'currency', sampleValue: '18.4B', unit: 'AED', financialStatement: 'CF' },
      { name: 'Committed (2024-2026)', type: 'currency', sampleValue: '9.2B', unit: 'AED', financialStatement: 'CF' },
      { name: 'Planned (2027-2030)', type: 'currency', sampleValue: '9.2B', unit: 'AED', financialStatement: 'CF' },
      { name: 'Active Projects', type: 'number', sampleValue: '14', financialStatement: 'CF' },
      { name: 'On Budget', type: 'number', sampleValue: '11', financialStatement: 'CF' },
      { name: 'Over Budget', type: 'number', sampleValue: '2', financialStatement: 'CF' },
      { name: 'Delayed', type: 'number', sampleValue: '1', financialStatement: 'CF' },
      { name: 'Avg Completion Rate', type: 'percentage', sampleValue: '62.4%', financialStatement: 'CF' },
    ],
    tags: ['capex', 'timeline', 'projects', 'investment'],
  },
  {
    id: 'str-projection-scenarios',
    name: 'Projection Scenarios',
    domain: 'strategic',
    analyticalSection: 'Section 8.3',
    analyticalReference: 'Analytical Framework —Management Plan: Financial Projections',
    description: 'Three-scenario financial projections (Base, Upside, Downside) with key assumptions and sensitivity analysis.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Base Case Revenue (2028)', type: 'currency', sampleValue: '22.8B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Base Case EBITDA (2028)', type: 'currency', sampleValue: '9.8B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Upside Revenue (2028)', type: 'currency', sampleValue: '26.4B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Upside EBITDA (2028)', type: 'currency', sampleValue: '12.1B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Downside Revenue (2028)', type: 'currency', sampleValue: '18.6B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Downside EBITDA (2028)', type: 'currency', sampleValue: '7.2B', unit: 'AED', financialStatement: 'IS' },
      { name: 'Key Sensitivity', type: 'text', sampleValue: 'Volume ±10%', financialStatement: 'IS' },
      { name: 'Probability (Base)', type: 'percentage', sampleValue: '60%', financialStatement: 'IS' },
    ],
    tags: ['scenarios', 'projections', 'sensitivity', 'forecast'],
  },
  {
    id: 'str-capability-maturity',
    name: 'Capability Maturity',
    domain: 'strategic',
    analyticalSection: 'CFO Framework',
    analyticalReference: 'CFO Framework — Capability Assessment',
    description: 'Capability maturity assessment across 6 dimensions: Digital, Commercial, Operational, Financial, People, and Innovation.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Digital Maturity', type: 'text', sampleValue: '3.8 / 5.0', financialStatement: 'IS' },
      { name: 'Commercial Excellence', type: 'text', sampleValue: '4.1 / 5.0', financialStatement: 'IS' },
      { name: 'Operational Efficiency', type: 'text', sampleValue: '4.3 / 5.0', financialStatement: 'IS' },
      { name: 'Financial Discipline', type: 'text', sampleValue: '4.5 / 5.0', financialStatement: 'IS' },
      { name: 'People & Culture', type: 'text', sampleValue: '3.6 / 5.0', financialStatement: 'IS' },
      { name: 'Innovation Index', type: 'text', sampleValue: '3.4 / 5.0', financialStatement: 'IS' },
      { name: 'Overall Maturity', type: 'text', sampleValue: '3.95 / 5.0', financialStatement: 'IS' },
      { name: 'Target (2028)', type: 'text', sampleValue: '4.5 / 5.0', financialStatement: 'IS' },
    ],
    tags: ['capability', 'maturity', 'assessment', 'framework'],
  },
  {
    id: 'str-bipm-dashboard',
    name: 'BiPM Dashboard',
    domain: 'strategic',
    analyticalSection: 'CFO Framework',
    analyticalReference: 'CFO Framework — Business-Integrated Performance Management',
    description: 'Business-Integrated Performance Management: strategic KPI cascading from board-level to operational teams with traffic-light status.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Board KPIs (Green)', type: 'number', sampleValue: '14', financialStatement: 'IS' },
      { name: 'Board KPIs (Amber)', type: 'number', sampleValue: '4', financialStatement: 'IS' },
      { name: 'Board KPIs (Red)', type: 'number', sampleValue: '2', financialStatement: 'IS' },
      { name: 'Total Cascaded KPIs', type: 'number', sampleValue: '186', financialStatement: 'IS' },
      { name: 'On-Track %', type: 'percentage', sampleValue: '78.4%', financialStatement: 'IS' },
      { name: 'Requires Attention', type: 'percentage', sampleValue: '14.2%', financialStatement: 'IS' },
      { name: 'Off-Track', type: 'percentage', sampleValue: '7.4%', financialStatement: 'IS' },
      { name: 'Review Frequency', type: 'text', sampleValue: 'Monthly', financialStatement: 'IS' },
    ],
    tags: ['bipm', 'kpi', 'performance', 'cascading'],
  },
  {
    id: 'str-kpi-priority',
    name: 'KPI Priority Matrix',
    domain: 'strategic',
    analyticalSection: 'CFO Framework',
    analyticalReference: 'CFO Framework — KPI Prioritization',
    description: 'Strategic KPI prioritization matrix: impact vs measurability with ownership assignment and reporting cadence.',
    primaryStatement: 'IS',
    fields: [
      { name: 'Total KPIs Tracked', type: 'number', sampleValue: '186', financialStatement: 'IS' },
      { name: 'Tier 1 (Board)', type: 'number', sampleValue: '20', financialStatement: 'IS' },
      { name: 'Tier 2 (Executive)', type: 'number', sampleValue: '48', financialStatement: 'IS' },
      { name: 'Tier 3 (Operational)', type: 'number', sampleValue: '118', financialStatement: 'IS' },
      { name: 'Financial KPIs', type: 'number', sampleValue: '42', financialStatement: 'IS' },
      { name: 'Operational KPIs', type: 'number', sampleValue: '68', financialStatement: 'IS' },
      { name: 'Strategic KPIs', type: 'number', sampleValue: '38', financialStatement: 'IS' },
      { name: 'ESG / Sustainability', type: 'number', sampleValue: '38', financialStatement: 'IS' },
    ],
    tags: ['kpi', 'matrix', 'priority', 'governance'],
  },
]

// ─────────────────────────────────────────────────────────
// FULL CATALOG
// ─────────────────────────────────────────────────────────

export const reportCatalog: ReportTemplate[] = [
  ...financialReports,
  ...operationalReports,
  ...marketReports,
  ...strategicReports,
]

export function getReportsByDomain(domain: Domain): ReportTemplate[] {
  return reportCatalog.filter(r => r.domain === domain)
}

export const domainMeta: Record<Domain, { label: string; description: string; analyticalSections: string; color: string }> = {
  financial: {
    label: 'Financial Analytics',
    description: 'Professional-grade financial analysis derived from Analytical Framework Section 7 (Historical Financials) + Section 8 (Management Plan)',
    analyticalSections: 'Section §7 + §8',
    color: 'text-fs-income',
  },
  operational: {
    label: 'Operational Analytics',
    description: 'Operational intelligence derived from Analytical Framework Section 2 (Company) + Section 5 (Customers)',
    analyticalSections: 'Section §2 + §5',
    color: 'text-success',
  },
  market: {
    label: 'Market Analytics',
    description: 'Market intelligence derived from Analytical Framework Section 3 (Trade) + Section 4 (Growth) + Section 6 (Competitive)',
    analyticalSections: 'Section §3 + §4 + §6',
    color: 'text-warning',
  },
  strategic: {
    label: 'Strategic Analytics',
    description: 'Strategic planning derived from Analytical Framework Section 8 (Management Plan) + CFO Framework',
    analyticalSections: 'Section §8 + CFO Framework',
    color: 'text-ad-red',
  },
}
