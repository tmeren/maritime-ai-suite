import type { FinancialStatement } from '../components/StatCard'

// ─────────────────────────────────────────────────────────────
// Shared types for Module KPI pages & Financial Model
// ─────────────────────────────────────────────────────────────

export interface ModuleKpi {
  title: string
  value: string
  unit?: string
  trend: 'up' | 'down' | 'flat'
  trendValue: string
  financialStatement: FinancialStatement
  subtitle?: string
  financialLineKey?: string // deep-link into /financial-model
}

export interface ModuleConfig {
  id: string
  slug: string
  name: string
  tagline: string
  gradient: string
  kpis: ModuleKpi[]
  insights: string[]
}

// ─────────────────────────────────────────────────────────────
// 10 AD Ports AI Solution Module Definitions
// ─────────────────────────────────────────────────────────────

export const modules: ModuleConfig[] = [
  {
    id: 'trade-flow',
    slug: 'trade-flow-oracle',
    name: 'Trade-Flow Oracle',
    tagline: 'AI-Powered Global Trade Route Intelligence',
    gradient: 'from-blue-500 to-cyan-500',
    kpis: [
      { title: 'Trade Routes Optimized', value: '847', trend: 'up', trendValue: '+12.3% YoY', financialStatement: 'IS', subtitle: 'Active corridor optimizations', financialLineKey: 'revenue' },
      { title: 'Freight Cost Savings', value: 'AED 18.4M', trend: 'up', trendValue: '+22.1% YoY', financialStatement: 'IS', subtitle: 'Route optimization yield', financialLineKey: 'cogs' },
      { title: 'Customs Clearance Time', value: '2.1h', trend: 'down', trendValue: '-41% vs baseline', financialStatement: 'CF', subtitle: 'Avg clearance processing', financialLineKey: 'operating-cf' },
      { title: 'Trade Data Assets', value: 'AED 42M', trend: 'up', trendValue: '+15% valuation', financialStatement: 'BS', subtitle: 'Intangible data platform value', financialLineKey: 'intangible-assets' },
    ],
    insights: [
      'Red Sea diversions increased Suez-dependent route costs by 18% — AI rerouting saved AED 4.2M in Q4.',
      'Customs data sharing with VIN-Chain reduced dual-filing by 65%, cutting clearance from 3.6h to 2.1h.',
      'Demand-supply matching with Slot-Bid improved berth utilization by 8.4pp on high-traffic corridors.',
    ],
  },
  {
    id: 'vin-chain',
    slug: 'vin-chain',
    name: 'VIN-Chain Traceability',
    tagline: 'End-to-End Vehicle Logistics Provenance',
    gradient: 'from-indigo-500 to-purple-500',
    kpis: [
      { title: 'Vehicles Tracked', value: '124,800', trend: 'up', trendValue: '+18.6% YoY', financialStatement: 'IS', subtitle: 'Units through VIN-Chain', financialLineKey: 'revenue' },
      { title: 'Damage Claim Reduction', value: '34%', trend: 'down', trendValue: '-AED 6.2M claims', financialStatement: 'IS', subtitle: 'Insurance savings from provenance', financialLineKey: 'opex' },
      { title: 'RoRo Asset Utilization', value: '89%', trend: 'up', trendValue: '+5.2pp YoY', financialStatement: 'BS', subtitle: 'Fleet capacity efficiency', financialLineKey: 'ppe' },
      { title: 'Working Capital Impact', value: 'AED 31M', trend: 'up', trendValue: 'Released via faster clearance', financialStatement: 'CF', subtitle: 'Receivables acceleration', financialLineKey: 'operating-cf' },
    ],
    insights: [
      'Blockchain-anchored provenance records cut dispute resolution from 14 days to 48 hours.',
      'Customs data sharing synergy with Trade-Flow Oracle eliminates redundant documentation for 78% of VIN shipments.',
      'Stevedore-AI vehicle handling optimization reduced yard dwell time by 22%, freeing AED 31M in working capital.',
    ],
  },
  {
    id: 'slot-bid',
    slug: 'slot-bid',
    name: 'Slot-Bid AI',
    tagline: 'Dynamic Berth Allocation & Auction Engine',
    gradient: 'from-amber-500 to-orange-500',
    kpis: [
      { title: 'Auction Revenue Premium', value: 'AED 28.6M', trend: 'up', trendValue: '+31% vs fixed pricing', financialStatement: 'IS', subtitle: 'Dynamic pricing uplift', financialLineKey: 'revenue' },
      { title: 'Berth Utilization', value: '94.2%', trend: 'up', trendValue: '+8.4pp YoY', financialStatement: 'IS', subtitle: 'Time-weighted occupancy', financialLineKey: 'revenue' },
      { title: 'Avg Bid-to-Base Ratio', value: '1.32x', trend: 'up', trendValue: '+0.18x YoY', financialStatement: 'IS', subtitle: 'Market-driven premium', financialLineKey: 'revenue' },
      { title: 'Port Infrastructure Value', value: 'AED 1.2B', trend: 'up', trendValue: '+8% revaluation', financialStatement: 'BS', subtitle: 'Berth & quay assets', financialLineKey: 'ppe' },
    ],
    insights: [
      'Priority berth allocation synergy with Cruise-Turnaround AI increased cruise slot revenue by 24%.',
      'Demand-supply matching with Trade-Flow Oracle improved forecasting accuracy to 91%.',
      'Peak-hour dynamic pricing captured AED 12.3M additional revenue without capacity expansion.',
    ],
  },
  {
    id: 'battery-health',
    slug: 'battery-health',
    name: 'Battery-Logistics Health Guard',
    tagline: 'EV Battery Transport Safety & Compliance',
    gradient: 'from-green-500 to-emerald-500',
    kpis: [
      { title: 'Batteries Monitored', value: '18,400', trend: 'up', trendValue: '+42% YoY', financialStatement: 'IS', subtitle: 'Active thermal monitoring units', financialLineKey: 'revenue' },
      { title: 'Incident Prevention', value: '99.97%', trend: 'up', trendValue: '0 thermal events YTD', financialStatement: 'IS', subtitle: 'Safety compliance rate', financialLineKey: 'opex' },
      { title: 'Insurance Premium Savings', value: 'AED 4.8M', trend: 'up', trendValue: '-28% premium reduction', financialStatement: 'IS', subtitle: 'Risk-adjusted coverage', financialLineKey: 'opex' },
      { title: 'Compliance Infrastructure', value: 'AED 22M', trend: 'flat', trendValue: 'CAPEX deployed', financialStatement: 'CF', subtitle: 'Thermal sensors + monitoring', financialLineKey: 'investing-cf' },
    ],
    insights: [
      'Safety data pipeline synergy with Lithium-Sentinel prevents cascading thermal events across storage zones.',
      'Drone-based battery monitoring via Sky-Link reduces manual inspection costs by AED 1.2M annually.',
      'IMDG Class 9 compliance automation reduced documentation time by 68%.',
    ],
  },
  {
    id: 'stevedore-ai',
    slug: 'stevedore-ai',
    name: 'Stevedore-AI Orchestrator',
    tagline: 'AI-Driven Cargo Handling & Yard Operations',
    gradient: 'from-slate-600 to-slate-800',
    kpis: [
      { title: 'Crane Moves/Hour', value: '38.4', trend: 'up', trendValue: '+14% vs manual', financialStatement: 'IS', subtitle: 'Gross crane rate', financialLineKey: 'revenue' },
      { title: 'Yard Dwell Reduction', value: '22%', trend: 'down', trendValue: '-1.8 days avg', financialStatement: 'CF', subtitle: 'Container yard efficiency', financialLineKey: 'operating-cf' },
      { title: 'Labor Cost Optimization', value: 'AED 8.6M', trend: 'up', trendValue: 'Annual savings', financialStatement: 'IS', subtitle: 'Shift planning AI', financialLineKey: 'opex' },
      { title: 'Equipment Asset Value', value: 'AED 340M', trend: 'flat', trendValue: '12 STS + 28 RTG', financialStatement: 'BS', subtitle: 'Crane & yard machinery', financialLineKey: 'ppe' },
    ],
    insights: [
      'Berth-to-crane coordination with Slot-Bid reduced vessel waiting time by 34 minutes per call.',
      'Vehicle handling optimization synergy with VIN-Chain cut RoRo yard dwell from 8.2 to 6.4 days.',
      'Last-mile cargo handoff to Sky-Link drones handles 12% of urgent spare-part deliveries.',
    ],
  },
  {
    id: 'port-fota',
    slug: 'port-fota',
    name: 'Port-FOTA Hub',
    tagline: 'Fleet Over-The-Air Update Management',
    gradient: 'from-violet-500 to-purple-600',
    kpis: [
      { title: 'Devices Under OTA', value: '2,840', trend: 'up', trendValue: '+38% YoY', financialStatement: 'IS', subtitle: 'Connected port equipment', financialLineKey: 'revenue' },
      { title: 'Downtime Reduction', value: '62%', trend: 'down', trendValue: '-4,200 hrs/yr', financialStatement: 'IS', subtitle: 'Predictive maintenance updates', financialLineKey: 'opex' },
      { title: 'Firmware Compliance', value: '99.4%', trend: 'up', trendValue: '+2.1pp YoY', financialStatement: 'IS', subtitle: 'Fleet-wide version currency', financialLineKey: 'opex' },
      { title: 'IoT Platform Investment', value: 'AED 16M', trend: 'flat', trendValue: '3-year CAPEX', financialStatement: 'CF', subtitle: 'Edge compute + connectivity', financialLineKey: 'investing-cf' },
    ],
    insights: [
      'Drone fleet OTA synergy with Sky-Link ensures 100% firmware parity across 84 autonomous drones.',
      'Safety firmware updates synergy with Lithium-Sentinel pushes critical thermal patches within 4 hours.',
      'Predictive update scheduling reduced planned downtime windows by 62%, saving AED 3.1M in lost throughput.',
    ],
  },
  {
    id: 'sky-link',
    slug: 'sky-link',
    name: 'Sky-Link Logistics',
    tagline: 'Autonomous Drone Delivery Network',
    gradient: 'from-sky-400 to-blue-600',
    kpis: [
      { title: 'Drone Deliveries', value: '14,200', trend: 'up', trendValue: '+156% YoY', financialStatement: 'IS', subtitle: 'Autonomous missions completed', financialLineKey: 'revenue' },
      { title: 'Last-Mile Cost Savings', value: 'AED 5.2M', trend: 'up', trendValue: 'vs ground transport', financialStatement: 'IS', subtitle: '74% cheaper per delivery', financialLineKey: 'cogs' },
      { title: 'Fleet Availability', value: '96.8%', trend: 'up', trendValue: '+3.2pp YoY', financialStatement: 'IS', subtitle: '84 drones operational', financialLineKey: 'opex' },
      { title: 'Drone Fleet Assets', value: 'AED 28M', trend: 'up', trendValue: '+12 new units', financialStatement: 'BS', subtitle: 'UAV fleet + charging infra', financialLineKey: 'ppe' },
    ],
    insights: [
      'Last-mile cargo handoff synergy with Stevedore-AI handles urgent spare-part deliveries in <45 minutes.',
      'Battery drone monitoring synergy with Battery-Health ensures SOC compliance for lithium drone batteries.',
      'Port-FOTA drone fleet OTA keeps all 84 units on latest firmware with zero manual intervention.',
    ],
  },
  {
    id: 'lithium-sentinel',
    slug: 'lithium-sentinel',
    name: 'Lithium-Sentinel AI',
    tagline: 'Lithium Cargo Safety & Thermal Monitoring',
    gradient: 'from-red-500 to-rose-600',
    kpis: [
      { title: 'Thermal Events Prevented', value: '847', trend: 'up', trendValue: 'Predicted & mitigated', financialStatement: 'IS', subtitle: 'AI anomaly detection', financialLineKey: 'opex' },
      { title: 'Monitoring Coverage', value: '100%', trend: 'flat', trendValue: 'All lithium zones', financialStatement: 'IS', subtitle: 'Real-time thermal imaging', financialLineKey: 'opex' },
      { title: 'Regulatory Compliance', value: 'A+', trend: 'up', trendValue: 'IMDG Class 9 rated', financialStatement: 'IS', subtitle: 'Zero violations in 18 months', financialLineKey: 'opex' },
      { title: 'Safety Infrastructure', value: 'AED 35M', trend: 'flat', trendValue: 'Deployed', financialStatement: 'BS', subtitle: 'Thermal sensors + suppression', financialLineKey: 'ppe' },
    ],
    insights: [
      'Safety data pipeline synergy with Battery-Health provides cascading risk assessment across all EV cargo.',
      'Safety firmware updates via Port-FOTA push critical thermal threshold patches within 4-hour SLA.',
      'Digital-Twin simulation synergy models thermal propagation scenarios across entire port layout.',
    ],
  },
  {
    id: 'cruise-turnaround',
    slug: 'cruise-turnaround',
    name: 'Cruise-Turnaround AI',
    tagline: 'Intelligent Cruise Operations & Passenger Flow',
    gradient: 'from-teal-500 to-cyan-600',
    kpis: [
      { title: 'Turnaround Time', value: '6.2h', trend: 'down', trendValue: '-28% vs industry avg', financialStatement: 'IS', subtitle: 'Embark-to-depart cycle', financialLineKey: 'revenue' },
      { title: 'Passenger Throughput', value: '4,200/h', trend: 'up', trendValue: '+18% capacity', financialStatement: 'IS', subtitle: 'Peak processing rate', financialLineKey: 'revenue' },
      { title: 'Ancillary Revenue', value: 'AED 12.4M', trend: 'up', trendValue: '+24% YoY', financialStatement: 'IS', subtitle: 'Shore excursions + F&B + retail', financialLineKey: 'revenue' },
      { title: 'Terminal Asset Value', value: 'AED 180M', trend: 'up', trendValue: '+5% revaluation', financialStatement: 'BS', subtitle: 'Cruise terminal infrastructure', financialLineKey: 'ppe' },
    ],
    insights: [
      'Priority berth allocation synergy with Slot-Bid ensures cruise vessels get preferred morning slots.',
      'Digital-Twin simulation-driven scheduling optimizes turnaround sequences for multi-vessel days.',
      'Passenger flow AI reduced embarkation queues by 41%, increasing satisfaction scores to 4.6/5.0.',
    ],
  },
  {
    id: 'digital-twin',
    slug: 'digital-twin',
    name: 'Digital-Twin Port',
    tagline: 'Real-Time Port Simulation & Optimization',
    gradient: 'from-emerald-500 to-teal-600',
    kpis: [
      { title: 'Simulation Accuracy', value: '97.2%', trend: 'up', trendValue: '+2.1pp YoY', financialStatement: 'IS', subtitle: 'Predicted vs actual throughput', financialLineKey: 'revenue' },
      { title: 'Scenario Runs/Month', value: '12,400', trend: 'up', trendValue: '+84% utilization', financialStatement: 'IS', subtitle: 'What-if analyses completed', financialLineKey: 'opex' },
      { title: 'Optimization Savings', value: 'AED 22.8M', trend: 'up', trendValue: 'Annual yield', financialStatement: 'IS', subtitle: 'Layout + flow + resource', financialLineKey: 'opex' },
      { title: 'Digital Platform Value', value: 'AED 68M', trend: 'up', trendValue: '+22% revaluation', financialStatement: 'BS', subtitle: 'Twin engine + data lake', financialLineKey: 'intangible-assets' },
    ],
    insights: [
      'Simulation backbone serves all 9 other modules as the shared spatial-temporal intelligence layer.',
      'Trade simulation modeling synergy with Trade-Flow Oracle forecasts congestion 72 hours ahead.',
      'Simulation-driven scheduling synergy with Cruise-Turnaround optimizes multi-vessel turnaround days.',
    ],
  },
]

// ─────────────────────────────────────────────────────────────
// 3-Statement Financial Model Data
// ─────────────────────────────────────────────────────────────

export interface FinancialLineItem {
  key: string
  label: string
  value: string
  trend: 'up' | 'down' | 'flat'
  trendValue: string
  sparkline: number[]
  contributingModules: string[] // module IDs
  isHeader?: boolean
  indent?: number
}

export const incomeStatement: FinancialLineItem[] = [
  { key: 'revenue', label: 'Revenue', value: 'AED 2,420M', trend: 'up', trendValue: '+8.2% YoY', sparkline: [1800, 1920, 2050, 2180, 2300, 2420], contributingModules: ['trade-flow', 'vin-chain', 'slot-bid', 'battery-health', 'stevedore-ai', 'port-fota', 'sky-link', 'cruise-turnaround', 'digital-twin'], isHeader: true },
  { key: 'cargo-revenue', label: 'Cargo Handling Revenue', value: 'AED 1,480M', trend: 'up', trendValue: '+6.8%', sparkline: [1150, 1220, 1300, 1360, 1420, 1480], contributingModules: ['trade-flow', 'stevedore-ai', 'slot-bid'], indent: 1 },
  { key: 'vehicle-revenue', label: 'Vehicle Logistics Revenue', value: 'AED 380M', trend: 'up', trendValue: '+14.2%', sparkline: [240, 270, 300, 330, 355, 380], contributingModules: ['vin-chain'], indent: 1 },
  { key: 'cruise-revenue', label: 'Cruise & Passenger Revenue', value: 'AED 220M', trend: 'up', trendValue: '+18.6%', sparkline: [120, 140, 160, 180, 200, 220], contributingModules: ['cruise-turnaround'], indent: 1 },
  { key: 'digital-revenue', label: 'Digital Services Revenue', value: 'AED 180M', trend: 'up', trendValue: '+32.4%', sparkline: [80, 100, 120, 140, 160, 180], contributingModules: ['digital-twin', 'port-fota', 'sky-link'], indent: 1 },
  { key: 'safety-revenue', label: 'Safety & Compliance Revenue', value: 'AED 160M', trend: 'up', trendValue: '+24.8%', sparkline: [85, 100, 115, 130, 145, 160], contributingModules: ['battery-health', 'lithium-sentinel'], indent: 1 },
  { key: 'cogs', label: 'Cost of Goods Sold', value: '(AED 1,020M)', trend: 'down', trendValue: '-1.2pp margin', sparkline: [820, 860, 900, 940, 980, 1020], contributingModules: ['trade-flow', 'sky-link', 'stevedore-ai'], isHeader: true },
  { key: 'gross-profit', label: 'Gross Profit', value: 'AED 1,400M', trend: 'up', trendValue: '+10.4%', sparkline: [980, 1060, 1150, 1240, 1320, 1400], contributingModules: [], isHeader: true },
  { key: 'opex', label: 'Operating Expenses', value: '(AED 510M)', trend: 'down', trendValue: '-3.2%', sparkline: [540, 530, 525, 520, 515, 510], contributingModules: ['stevedore-ai', 'digital-twin', 'lithium-sentinel', 'battery-health', 'port-fota'], isHeader: true },
  { key: 'ebitda', label: 'EBITDA', value: 'AED 890M', trend: 'up', trendValue: '+12.4%', sparkline: [620, 690, 750, 800, 850, 890], contributingModules: [], isHeader: true },
  { key: 'net-income', label: 'Net Income', value: 'AED 580M', trend: 'up', trendValue: '+14.8%', sparkline: [380, 420, 470, 510, 550, 580], contributingModules: [], isHeader: true },
]

export const balanceSheet: FinancialLineItem[] = [
  { key: 'total-assets', label: 'Total Assets', value: 'AED 4,820M', trend: 'up', trendValue: '+6.4% YoY', sparkline: [4100, 4250, 4400, 4550, 4700, 4820], contributingModules: [], isHeader: true },
  { key: 'ppe', label: 'Property, Plant & Equipment', value: 'AED 2,180M', trend: 'up', trendValue: '+4.8%', sparkline: [1900, 1960, 2020, 2080, 2140, 2180], contributingModules: ['slot-bid', 'stevedore-ai', 'sky-link', 'lithium-sentinel', 'cruise-turnaround'], indent: 1 },
  { key: 'intangible-assets', label: 'Intangible Assets (Digital)', value: 'AED 420M', trend: 'up', trendValue: '+18.2%', sparkline: [280, 310, 340, 370, 400, 420], contributingModules: ['trade-flow', 'digital-twin'], indent: 1 },
  { key: 'current-assets', label: 'Current Assets', value: 'AED 1,240M', trend: 'up', trendValue: '+5.1%', sparkline: [1050, 1090, 1130, 1170, 1210, 1240], contributingModules: ['vin-chain'], indent: 1 },
  { key: 'other-assets', label: 'Other Non-Current Assets', value: 'AED 980M', trend: 'flat', trendValue: '+1.2%', sparkline: [950, 955, 960, 965, 970, 980], contributingModules: [], indent: 1 },
  { key: 'total-liabilities', label: 'Total Liabilities', value: 'AED 2,640M', trend: 'down', trendValue: '-2.1%', sparkline: [2780, 2750, 2720, 2690, 2660, 2640], contributingModules: [], isHeader: true },
  { key: 'total-equity', label: 'Total Equity', value: 'AED 2,180M', trend: 'up', trendValue: '+12.8%', sparkline: [1720, 1800, 1880, 1960, 2060, 2180], contributingModules: [], isHeader: true },
]

export const cashFlowStatement: FinancialLineItem[] = [
  { key: 'operating-cf', label: 'Operating Cash Flow', value: 'AED 780M', trend: 'up', trendValue: '+15.7% YoY', sparkline: [520, 580, 640, 690, 740, 780], contributingModules: ['trade-flow', 'vin-chain', 'stevedore-ai'], isHeader: true },
  { key: 'working-capital', label: 'Working Capital Changes', value: 'AED 45M', trend: 'up', trendValue: '+AED 31M from VIN-Chain', sparkline: [-20, -10, 5, 15, 30, 45], contributingModules: ['vin-chain'], indent: 1 },
  { key: 'depreciation', label: 'Depreciation & Amortization', value: 'AED 310M', trend: 'flat', trendValue: '+2.4%', sparkline: [280, 285, 290, 295, 300, 310], contributingModules: [], indent: 1 },
  { key: 'investing-cf', label: 'Investing Cash Flow', value: '(AED 420M)', trend: 'flat', trendValue: 'Planned CAPEX', sparkline: [-380, -400, -410, -415, -418, -420], contributingModules: ['battery-health', 'port-fota'], isHeader: true },
  { key: 'capex', label: 'Capital Expenditures', value: '(AED 380M)', trend: 'flat', trendValue: 'On plan', sparkline: [-340, -350, -360, -370, -375, -380], contributingModules: ['battery-health', 'port-fota', 'sky-link'], indent: 1 },
  { key: 'financing-cf', label: 'Financing Cash Flow', value: '(AED 180M)', trend: 'down', trendValue: 'Debt reduction', sparkline: [-240, -220, -210, -200, -190, -180], contributingModules: [], isHeader: true },
  { key: 'net-cf', label: 'Net Cash Flow', value: 'AED 180M', trend: 'up', trendValue: '+28% YoY', sparkline: [80, 100, 120, 140, 160, 180], contributingModules: [], isHeader: true },
  { key: 'fcf', label: 'Free Cash Flow', value: 'AED 400M', trend: 'up', trendValue: '+22% YoY', sparkline: [240, 280, 310, 340, 370, 400], contributingModules: [], isHeader: true },
]

// ─────────────────────────────────────────────────────────────
// Synergy Map Data — 13 Cross-Module Connections
// ─────────────────────────────────────────────────────────────

export type SynergyType = 'data' | 'operational' | 'financial'

export interface Synergy {
  id: string
  from: string // module ID
  to: string
  label: string
  description: string
  type: SynergyType
  financialImpact: { statement: FinancialStatement; effect: string }
  annualValue: string
}

export const synergies: Synergy[] = [
  { id: 's1', from: 'trade-flow', to: 'vin-chain', label: 'Customs Data Sharing', description: 'Shared customs declarations eliminate dual-filing for vehicle shipments, reducing clearance from 3.6h to 2.1h.', type: 'data', financialImpact: { statement: 'CF', effect: 'Faster receivables' }, annualValue: 'AED 4.2M' },
  { id: 's2', from: 'slot-bid', to: 'stevedore-ai', label: 'Berth-to-Crane Coordination', description: 'Auction winners trigger automatic crane scheduling, reducing vessel waiting time by 34 minutes per call.', type: 'operational', financialImpact: { statement: 'IS', effect: 'Higher throughput revenue' }, annualValue: 'AED 8.4M' },
  { id: 's3', from: 'battery-health', to: 'lithium-sentinel', label: 'Safety Data Pipeline', description: 'Real-time thermal data from Battery-Health feeds Lithium-Sentinel cascading risk models for zone-level safety.', type: 'data', financialImpact: { statement: 'IS', effect: 'Reduced insurance claims' }, annualValue: 'AED 3.6M' },
  { id: 's4', from: 'sky-link', to: 'port-fota', label: 'Drone Fleet OTA', description: 'Port-FOTA manages firmware updates across 84 autonomous drones, ensuring 100% version parity.', type: 'operational', financialImpact: { statement: 'IS', effect: 'Lower maintenance costs' }, annualValue: 'AED 1.8M' },
  { id: 's5', from: 'digital-twin', to: 'trade-flow', label: 'Trade Simulation Modeling', description: 'Digital-Twin spatial models combined with Trade-Flow demand data forecast congestion 72 hours ahead.', type: 'data', financialImpact: { statement: 'IS', effect: 'Congestion avoidance revenue' }, annualValue: 'AED 6.2M' },
  { id: 's6', from: 'cruise-turnaround', to: 'slot-bid', label: 'Priority Berth Allocation', description: 'Cruise vessels get guaranteed morning berth slots via priority auction tier, increasing cruise revenue by 24%.', type: 'financial', financialImpact: { statement: 'IS', effect: 'Ancillary revenue uplift' }, annualValue: 'AED 5.8M' },
  { id: 's7', from: 'trade-flow', to: 'slot-bid', label: 'Demand-Supply Matching', description: 'Trade-Flow demand forecasts feed Slot-Bid pricing engine, improving auction efficiency by 18%.', type: 'data', financialImpact: { statement: 'IS', effect: 'Better price discovery' }, annualValue: 'AED 4.8M' },
  { id: 's8', from: 'vin-chain', to: 'stevedore-ai', label: 'Vehicle Handling Optimization', description: 'VIN-Chain vehicle metadata enables Stevedore-AI to optimize RoRo yard layouts and handling sequences.', type: 'operational', financialImpact: { statement: 'CF', effect: 'Working capital release' }, annualValue: 'AED 3.2M' },
  { id: 's9', from: 'battery-health', to: 'sky-link', label: 'Battery Drone Monitoring', description: 'Battery-Health SOC monitoring ensures Sky-Link drone batteries maintain safe charge levels during flight.', type: 'data', financialImpact: { statement: 'IS', effect: 'Fleet availability uplift' }, annualValue: 'AED 1.4M' },
  { id: 's10', from: 'lithium-sentinel', to: 'port-fota', label: 'Safety Firmware Updates', description: 'Critical thermal threshold changes are pushed to all monitoring sensors within 4-hour SLA via Port-FOTA.', type: 'operational', financialImpact: { statement: 'IS', effect: 'Zero safety incidents' }, annualValue: 'AED 2.1M' },
  { id: 's11', from: 'digital-twin', to: 'cruise-turnaround', label: 'Simulation-Driven Scheduling', description: 'Digital-Twin simulates multi-vessel turnaround scenarios to optimize passenger flow and resource allocation.', type: 'data', financialImpact: { statement: 'IS', effect: 'Turnaround time reduction' }, annualValue: 'AED 3.8M' },
  { id: 's12', from: 'stevedore-ai', to: 'sky-link', label: 'Last-Mile Cargo Handoff', description: 'Stevedore-AI triggers Sky-Link drone dispatch for urgent spare-part and document deliveries from quay to warehouse.', type: 'operational', financialImpact: { statement: 'IS', effect: 'Premium delivery revenue' }, annualValue: 'AED 2.4M' },
  { id: 's13', from: 'digital-twin', to: 'stevedore-ai', label: 'Simulation Backbone', description: 'Digital-Twin provides the shared spatial-temporal intelligence layer for all yard operation optimizations.', type: 'data', financialImpact: { statement: 'IS', effect: 'Optimization yield' }, annualValue: 'AED 5.6M' },
]
