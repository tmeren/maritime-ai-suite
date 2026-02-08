import { useState, useMemo } from 'react'
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Star,
  BookOpen,
  DollarSign,
  Anchor,
  Globe2,
  Lightbulb,
  Monitor,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type FaqCategory = 'financial' | 'operational' | 'market' | 'strategic' | 'platform'

interface FaqItem {
  id: string
  category: FaqCategory
  question: string
  answer: string
  relatedIds: string[]
  sourceReference: string
  isPopular?: boolean
}

// ─────────────────────────────────────────────────────────
// Category Config
// ─────────────────────────────────────────────────────────

const categoryConfig: Record<FaqCategory, {
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
    border: 'border-rose-500/30',
    icon: <DollarSign size={16} />,
  },
  operational: {
    label: 'Operational',
    color: 'text-info',
    bg: 'bg-info',
    bgLight: 'bg-info/10',
    border: 'border-info/30',
    icon: <Anchor size={16} />,
  },
  market: {
    label: 'Market',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500',
    bgLight: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: <Globe2 size={16} />,
  },
  strategic: {
    label: 'Strategic',
    color: 'text-violet-500',
    bg: 'bg-violet-500',
    bgLight: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    icon: <Lightbulb size={16} />,
  },
  platform: {
    label: 'Platform',
    color: 'text-text-secondary',
    bg: 'bg-ad-dark-light',
    bgLight: 'bg-ad-dark-light/10',
    border: 'border-ad-dark-light/30',
    icon: <Monitor size={16} />,
  },
}

const categories: FaqCategory[] = ['financial', 'operational', 'market', 'strategic', 'platform']

// ─────────────────────────────────────────────────────────
// FAQ Data
// ─────────────────────────────────────────────────────────

const faqItems: FaqItem[] = [
  // ── Financial (6) ──
  {
    id: 'fin-1',
    category: 'financial',
    question: 'What is EBITDA and how is it calculated for port operations?',
    answer: `EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) is the primary profitability metric used across the Maritime AI Suite. For AD Ports Group, EBITDA is calculated by taking total revenue and subtracting operating expenses excluding depreciation, amortization, interest, and taxes. This yields a clear picture of operating performance independent of capital structure and accounting decisions.

In port operations specifically, EBITDA captures the core economics of throughput-driven revenue minus direct operational costs (labor, fuel, maintenance) and overhead. AD Ports Group reports EBITDA by segment — Ports, Logistics, Maritime, and Digital — allowing analysts to compare margin profiles. As of the latest reporting period, Group EBITDA stands at approximately 6.1B AED with a margin of 43.0%.

The EBITDA Bridge report (Analytical Framework Section 7.2) decomposes year-over-year changes by driver: volume impact, price/mix impact, cost efficiencies, new business contribution, and one-off items. This bridge methodology is standard across all analytical framework outputs and enables granular attribution of value creation.`,
    relatedIds: ['fin-4', 'fin-6'],
    sourceReference: 'Analytical Framework \u00a77.2 \u2014 Historical Financials: EBITDA Walk',
    isPopular: true,
  },
  {
    id: 'fin-2',
    category: 'financial',
    question: 'How does the Revenue Waterfall report break down income sources?',
    answer: `The Revenue Waterfall report (Analytical Framework Section 7.1) provides a comprehensive top-line decomposition across multiple dimensions. The primary segmentation breaks revenue into four business clusters: Ports (8.1B AED), Logistics (3.4B AED), Maritime (1.8B AED), and Digital (0.9B AED), totaling approximately 14.2B AED.

Beyond segment-level splits, the waterfall further decomposes revenue by geography (UAE, MENA, International), customer tier (strategic accounts, mid-market, transactional), and contract type (long-term concessions, annual contracts, spot). The visualization shows organic growth (+12.3%) separated from inorganic growth (+4.7%) through M&A activity, providing clarity on underlying business momentum.

A key operational metric embedded in the Revenue Waterfall is Revenue per TEU (412 AED), which serves as a unit economics indicator connecting financial performance to operational throughput. This metric is cross-referenced with the Operational Analytics module for berth productivity and capacity utilization context.`,
    relatedIds: ['fin-1', 'fin-6'],
    sourceReference: 'Analytical Framework \u00a77.1 \u2014 Historical Financials: Revenue Decomposition',
  },
  {
    id: 'fin-3',
    category: 'financial',
    question: 'What working capital metrics are tracked and why do they matter?',
    answer: `Working capital metrics are tracked through the Cash Flow Projection report (Analytical Framework Section 7.6). The platform monitors the core cycle components: Days Sales Outstanding (DSO), Days Payable Outstanding (DPO), and Days Inventory Outstanding (DIO). For port operations, inventory is less significant than receivables and payables given the service-oriented nature of the business.

Working capital changes directly impact free cash flow generation. In the latest period, working capital consumed approximately 0.3B AED, driven primarily by increased trade receivables from new concession agreements and timing of government payments. The Cash Flow Bridge visualization shows this as a distinct waterfall step between Operating Cash Flow and Free Cash Flow.

Efficient working capital management is critical for AD Ports because capital-intensive port expansion programs require strong FCF conversion. The platform tracks FCF Conversion ratio (currently 29.5%) and FCF Yield (6.2%) as indicators of how effectively operating profits translate into distributable cash. Seasonal patterns in trade volumes create predictable working capital cycles that are modeled in the projection scenarios.`,
    relatedIds: ['fin-5', 'fin-4'],
    sourceReference: 'Analytical Framework \u00a77.6 \u2014 Historical Financials: FCF Analysis',
  },
  {
    id: 'fin-4',
    category: 'financial',
    question: 'How are leverage ratios calculated (Net Debt/EBITDA)?',
    answer: `Leverage ratios are the primary credit health indicators tracked in the Leverage Ratios report (Analytical Framework Section 7.5). Net Debt is calculated as Total Debt (18.7B AED) minus Cash and Equivalents (3.2B AED), yielding Net Debt of 15.5B AED. The Net Debt/EBITDA ratio divides this by trailing twelve-month EBITDA to produce the leverage multiple, currently at 2.5x.

The platform tracks additional leverage indicators: Interest Coverage Ratio (EBITDA / Interest Expense = 5.8x), Debt/Equity (0.9x), Weighted Average Cost of Debt (4.2%), and Average Debt Maturity (6.3 years). These metrics are monitored against covenant thresholds defined in AD Ports' credit facilities and bond indentures. Covenant compliance is displayed with traffic-light indicators.

Leverage trends are particularly important for AD Ports given the multi-billion AED CAPEX pipeline. The strategic planning module models leverage trajectory under base, upside, and downside scenarios, ensuring that expansion investments maintain the Group's investment-grade credit profile. The Balance Sheet statement type (BS) badge indicates these metrics primarily derive from the balance sheet.`,
    relatedIds: ['fin-1', 'fin-5'],
    sourceReference: 'Analytical Framework \u00a77.5 \u2014 Historical Financials: Capital Structure',
    isPopular: true,
  },
  {
    id: 'fin-5',
    category: 'financial',
    question: 'What is the Cash Flow Bridge and what does it reveal?',
    answer: `The Cash Flow Bridge is a waterfall visualization in the Cash Flow Projection report (Analytical Framework Section 7.6) that traces the path from Operating Cash Flow (5.4B AED) to Free Cash Flow (1.8B AED). Each step in the bridge represents a distinct cash flow category: Maintenance CAPEX (-1.2B AED), Growth CAPEX (-2.1B AED), and Working Capital Changes (-0.3B AED).

This bridge is analytically powerful because it separates maintenance capital (required to sustain current operations) from growth capital (discretionary investments for expansion). For AD Ports, the maintenance vs growth CAPEX split is crucial: maintenance CAPEX ensures existing port infrastructure remains operational, while growth CAPEX funds new terminal construction, digital transformation, and fleet expansion. Investors and analysts use this split to assess how much of the Group's cash generation is truly "free."

Beyond the operating-to-FCF bridge, the platform also tracks the full cash flow statement categories: Operating, Investing, and Financing activities. The Dividend Payout (1.1B AED) is shown as a financing outflow, and the resulting net cash position change completes the bridge from beginning to ending cash balance.`,
    relatedIds: ['fin-3', 'fin-4'],
    sourceReference: 'Analytical Framework \u00a77.6 \u2014 Historical Financials: FCF Analysis',
  },
  {
    id: 'fin-6',
    category: 'financial',
    question: 'How do profitability metrics differ across business segments?',
    answer: `The Profitability Analysis report (Analytical Framework Section 7.4) presents a multi-layer margin cascade: Gross Margin (59.9%), EBITDA Margin (43.0%), EBIT Margin (33.1%), and Net Margin (22.5%). These margins are tracked at both Group level and by business segment, revealing significant structural differences in the economics of each operation.

Ports operations typically generate the highest EBITDA margins (50-55%) due to the concession-based model with high operating leverage: once infrastructure is built, incremental throughput carries minimal variable cost. Maritime operations deliver moderate margins (35-40%) driven by vessel chartering economics. Logistics margins are thinner (20-28%) reflecting the asset-light, volume-driven nature of freight forwarding and warehousing. Digital services show emerging margins (40-48%) with high gross margins but significant R&D investment.

The segment-level margin spread (28-51% EBITDA) informs strategic capital allocation decisions. The platform cross-references profitability with the Capability Maturity assessment and the Value Creation Plan to identify segments where margin improvement initiatives would generate the highest returns. Peer benchmarking data provides additional context for margin comparisons against regional and global port operators.`,
    relatedIds: ['fin-1', 'fin-2'],
    sourceReference: 'Analytical Framework \u00a77.4 \u2014 Historical Financials: Margin Analysis',
  },

  // ── Operational (6) ──
  {
    id: 'ops-1',
    category: 'operational',
    question: 'What does TEU throughput measure and what is AD Ports\u2019 benchmark?',
    answer: `TEU (Twenty-foot Equivalent Unit) throughput measures the total volume of containerized cargo handled by port terminals. One TEU corresponds to a standard 20-foot shipping container. A 40-foot container counts as 2 TEU. This metric is the universal volume indicator for container port performance globally and serves as the basis for revenue per unit calculations across the platform.

AD Ports Group handles approximately 16.8M TEU annually across its port cluster network, with container throughput comprising 12.4M TEU and the remainder attributed to vehicle units and bulk cargo converted to TEU equivalents. The primary container terminals at Khalifa Port and KIZAD account for the majority of throughput, with additional volumes from international port investments across the MENA region.

The Port Throughput report (Analytical Framework Section 2.3) tracks TEU alongside related productivity metrics: Revenue per TEU (412 AED), Capacity Utilization (78.5%), and volume growth trends. AD Ports' TEU throughput positions it among the top 15 port groups globally and the largest in the GCC region, with a 34.8% regional market share. The Growth Driver Assessment projects a 5-year container CAGR of +6.8%.`,
    relatedIds: ['ops-2', 'ops-3'],
    sourceReference: 'Analytical Framework \u00a72.3 \u2014 Company Overview: Port Operations',
    isPopular: true,
  },
  {
    id: 'ops-2',
    category: 'operational',
    question: 'How is berth utilization calculated?',
    answer: `Berth utilization is calculated as the percentage of total available berth-hours that are occupied by vessels during a given period. The formula is: (Total Vessel Berth-Hours / Total Available Berth-Hours) x 100. Available berth-hours account for the number of berths, their operational hours (typically 24/7 for major terminals), and any scheduled maintenance downtime.

At AD Ports, overall capacity utilization stands at 78.5%, which represents a balanced position between operational efficiency and growth headroom. Utilization above 85% typically indicates congestion risk, leading to longer vessel waiting times and potential schedule delays. Below 60% signals underutilization and potential revenue leakage. The platform monitors berth utilization at the terminal level, as different cargo types have distinct berth occupancy patterns.

The Vessel Utilization report (Analytical Framework Section 2.2) provides granular breakdowns: Container berth utilization tends to be highest (driven by liner schedule commitments), followed by bulk terminals (which have more variable demand). The Capacity Planning report (Section 5.2) uses berth utilization trends to model when expansion investments are triggered, with the current headroom estimated at 3.4 years before new berth capacity is required at Khalifa Port.`,
    relatedIds: ['ops-1', 'ops-4'],
    sourceReference: 'Analytical Framework \u00a72.2 \u2014 Company Overview: Operational Efficiency',
  },
  {
    id: 'ops-3',
    category: 'operational',
    question: 'What metrics define terminal productivity (moves per hour)?',
    answer: `Terminal productivity is measured primarily by Berth Productivity, expressed as container moves per hour per crane (moves/hr). AD Ports' current benchmark is 32 moves per hour, which places it in the upper quartile of global port operators. This metric captures the speed at which Ship-to-Shore (STS) cranes load and unload containers from vessels.

The moves per hour calculation includes: gross crane productivity (total moves / total crane-hours including idle time during vessel operations) and net crane productivity (total moves / active crane-hours only). The platform tracks both variants, as the spread between gross and net reveals operational inefficiencies such as crane waiting time, hatch cover handling, and restow moves. Supporting metrics include Gang Productivity (moves per gang-hour) and Berth Throughput (total moves per meter of quay per year).

The Port Throughput report contextualizes terminal productivity within the broader operating model: higher moves per hour directly reduce vessel turnaround time, which improves berth utilization and customer satisfaction. The StevedoreAI solution integrates real-time productivity monitoring with workforce allocation optimization, aiming to push productivity toward the 35+ moves/hr benchmark achieved by world-class terminals like those in Singapore and Shanghai.`,
    relatedIds: ['ops-1', 'ops-5'],
    sourceReference: 'Analytical Framework \u00a72.3 \u2014 Company Overview: Port Operations',
  },
  {
    id: 'ops-4',
    category: 'operational',
    question: 'How does vessel turnaround time impact operational efficiency?',
    answer: `Vessel turnaround time measures the total duration from a vessel's arrival at the port (pilot boarding) to its departure (last line cast off). AD Ports' average turnaround time is 18.4 hours for container vessels. This metric is a critical driver of both operational efficiency and commercial competitiveness, as shorter turnaround times allow shipping lines to maintain tighter schedules and reduce fuel consumption during port calls.

The components of turnaround time include: pilot and tug services (approach/departure), berth allocation and mooring, cargo operations (loading/unloading), vessel inspections and documentation, and any ancillary services (bunkering, provisioning). Each component is tracked separately in the operational dashboard, enabling root-cause analysis when turnaround times exceed targets. Weather delays, equipment breakdowns, and documentation bottlenecks are the most common causes of extended turnaround.

Reducing turnaround time has a cascading positive impact: it increases effective berth capacity without physical expansion, improves revenue per berth-day, and strengthens AD Ports' competitive positioning against regional alternatives. The Risk Management module flags vessel schedule delays as a high-severity risk (R-002, 95M AED estimated impact), with StevedoreAI-driven berth allocation optimization cited as a key mitigation strategy.`,
    relatedIds: ['ops-2', 'ops-5'],
    sourceReference: 'Analytical Framework \u00a72.2 \u2014 Company Overview: Operational Efficiency',
  },
  {
    id: 'ops-5',
    category: 'operational',
    question: 'What is the crane productivity index?',
    answer: `The crane productivity index is a composite metric that evaluates Ship-to-Shore (STS) crane performance across multiple dimensions: moves per hour (primary), crane availability (uptime percentage), utilization rate (active hours / available hours), and reliability (mean time between failures). This index provides a holistic view of crane fleet effectiveness rather than relying on a single speed metric.

For AD Ports' container terminals, the index weights are approximately: moves per hour (40%), availability (25%), utilization (20%), and reliability (15%). The weighted composite score is benchmarked against industry standards and peer operators. Current performance sits at 32 moves/hr with >95% availability and 78% utilization. Maintenance-driven downtime is the primary constraint on availability, tracked via predictive maintenance schedules.

The crane productivity index connects directly to financial performance through the cost-per-move calculation. Higher crane productivity reduces the cost per container move, which flows through to EBITDA margins in the Ports segment. The platform models the ROI of crane fleet investment (new cranes, automation retrofits) against productivity improvement targets, feeding into the CAPEX Planning report (Analytical Framework Section 8.1) for capital allocation decisions.`,
    relatedIds: ['ops-3', 'ops-6'],
    sourceReference: 'Analytical Framework \u00a72.3 \u2014 Company Overview: Port Operations',
  },
  {
    id: 'ops-6',
    category: 'operational',
    question: 'How are workforce efficiency ratios computed for terminal operations?',
    answer: `Workforce efficiency ratios are computed in the Workforce Metrics report (Analytical Framework Section 5.1) using several interconnected measures. The primary ratio is Revenue per Employee, currently at 333K AED, calculated by dividing total Group revenue by total headcount (42,600). More granular variants include Revenue per Operations Staff and EBITDA per Employee, which adjust for segment-specific workforce composition.

For terminal operations specifically, the key ratio is Labor Cost per TEU (173 AED), which divides total terminal labor costs by container throughput volume. This metric captures both the headcount intensity and average labor cost of handling each unit of cargo. Supporting metrics include: Moves per Man-Hour (gang productivity), Overtime Ratio (overtime hours / regular hours), and Training Hours per Employee (84 hours/year), which serves as a leading indicator for future productivity improvements.

The platform tracks these ratios over time to identify productivity trends and compare across terminals. Attrition Rate (8.4%) and workforce composition (Operations: 28,400; Management: 8,200; Technical: 6,000) provide context for labor cost forecasting. The StevedoreAI solution targets workforce optimization by dynamically allocating labor based on vessel schedules and cargo profiles, aiming to improve the labor cost per TEU ratio while maintaining service quality standards.`,
    relatedIds: ['ops-3', 'ops-5'],
    sourceReference: 'Analytical Framework \u00a75.1 \u2014 Customers: Human Capital',
  },

  // ── Market (5) ──
  {
    id: 'mkt-1',
    category: 'market',
    question: 'What trade corridors are tracked in the market intelligence module?',
    answer: `The Trade Corridor Analysis report (Analytical Framework Section 3.1) tracks four primary trade corridors: Asia-GCC (22.1M TEU, 46% of total volume), Europe-GCC (12.8M TEU, 27%), Africa-GCC (8.4M TEU, 17%), and Americas-GCC (4.9M TEU, 10%). These corridors represent the major shipping routes that flow through AD Ports' terminal network, with total trade volume of 48.2M TEU and trade value of 892B AED.

Each corridor is analyzed across multiple dimensions: volume trends (5-year CAGR of +5.2%), commodity mix (containerized vs bulk vs vehicles), seasonal patterns, and shipping line market share. The Asia-GCC corridor is the dominant route, driven by China-UAE trade flows, Indian subcontinent transshipment, and the growing Southeast Asian manufacturing base. The Africa-GCC corridor shows the highest growth trajectory at +12% year-over-year, reflecting AD Ports' strategic expansion into East African and North African markets.

The Trade-Flow Oracle AI solution enhances corridor intelligence with predictive analytics: demand forecasting, route optimization recommendations, and early warning signals for disruptions (such as the Red Sea/Suez Canal situation tracked in Risk R-004). The corridor data feeds directly into capacity planning models and revenue forecasting scenarios used by the Strategic Analytics module.`,
    relatedIds: ['mkt-2', 'mkt-4'],
    sourceReference: 'Analytical Framework \u00a73.1 \u2014 Trade: Route Economics',
  },
  {
    id: 'mkt-2',
    category: 'market',
    question: 'How is market share calculated across port clusters?',
    answer: `Market share is calculated in the Competitive Positioning report (Analytical Framework Section 6.1) using two complementary methodologies. The primary measure is throughput-based market share: AD Ports' TEU volumes divided by total regional port throughput, yielding a 34.8% share of the GCC container market. The secondary measure is revenue-based market share, which accounts for pricing differences and service mix.

The calculation scope varies by competitive lens: at the GCC level, AD Ports competes with DP World (Jebel Ali), Saudi Ports Authority, and Kuwait/Bahrain/Oman port clusters. At the broader MENA level, additional competitors include Tanger Med (Morocco), Port Said (Egypt), and Aden (Yemen). The platform tracks market share evolution over time, showing AD Ports gaining +2.1 percentage points year-over-year at the regional level.

Market share data is sourced from a combination of publicly reported port throughput statistics, shipping line alliance schedules, and AIS (Automatic Identification System) vessel tracking data. The platform normalizes volumes across different reporting standards (some ports report TEU, others report containers or tonnage) to ensure like-for-like comparison. The Competitive Positioning radar chart provides a visual multi-dimensional comparison across throughput, service quality, pricing, and connectivity.`,
    relatedIds: ['mkt-1', 'mkt-3'],
    sourceReference: 'Analytical Framework \u00a76.1 \u2014 Competitive Advantage: Market Position',
    isPopular: true,
  },
  {
    id: 'mkt-3',
    category: 'market',
    question: 'What competitive positioning metrics are used?',
    answer: `The Competitive Positioning report uses a multi-dimensional framework with eight key metrics: Global Port Ranking (#11), Regional Ranking (#1 GCC), Market Share (34.8%), Market Share Change (+2.1pp), Service Quality Score (4.6/5.0), Dwell Time vs Peers (-18% better), Price Premium (+8.4%), and Customer Retention (96.2%). These metrics span volume, quality, pricing, and loyalty dimensions.

The framework is presented as a radar chart comparing AD Ports against the top 5 regional competitors across these dimensions. Service Quality Score aggregates vessel turnaround time, documentation processing speed, cargo damage rates, and customer satisfaction surveys. Dwell Time (the period cargo remains in the terminal) is a critical competitiveness indicator, with AD Ports achieving 18% lower dwell times than the regional average through digital customs integration and automated gate systems.

Price Premium (+8.4%) indicates that AD Ports commands higher tariffs than regional peers while maintaining the highest customer retention rate (96.2%). This combination suggests strong pricing power underpinned by service differentiation. The platform monitors these metrics quarterly and flags any deterioration through the Risk Management module, ensuring competitive advantages are sustained and strategic investments are directed toward maintaining differentiation.`,
    relatedIds: ['mkt-2', 'mkt-5'],
    sourceReference: 'Analytical Framework \u00a76.1 \u2014 Competitive Advantage: Market Position',
  },
  {
    id: 'mkt-4',
    category: 'market',
    question: 'How are trade volume forecasts generated?',
    answer: `Trade volume forecasts are generated through the Growth Driver Assessment report (Analytical Framework Section 4.1) using a multi-factor econometric model. The model correlates container throughput with macroeconomic indicators: UAE GDP growth (+4.2%), the Trade Multiplier (1.6x GDP, meaning trade volume grows 1.6x faster than GDP), Manufacturing PMI (54.2), FDI inflows (82B AED), and population growth (+1.8%).

The forecasting methodology employs three scenario layers: Bottom-up (aggregating shipping line schedule commitments, concession agreement volumes, and committed cargo contracts), Top-down (applying trade multipliers to GDP and trade flow projections), and Corridor-specific (modeling individual route dynamics including competitive routing alternatives, fuel cost impacts, and geopolitical factors). The final forecast blends these approaches with probability weightings.

The platform generates 5-year demand projections at the corridor level and terminal level, with a current Container CAGR forecast of +6.8%. These forecasts directly feed into the Capacity Planning module (Section 5.2) to determine expansion timing and investment sizing. The Projection Scenarios report (Section 8.3) presents Base, Upside, and Downside cases with revenue and EBITDA implications, allowing decision-makers to stress-test growth assumptions. The Trade-Flow Oracle AI solution adds real-time signal processing to update forecasts dynamically.`,
    relatedIds: ['mkt-1', 'mkt-5'],
    sourceReference: 'Analytical Framework \u00a74.1 \u2014 Market Growth: Leading Indicators',
  },
  {
    id: 'mkt-5',
    category: 'market',
    question: 'What is corridor pricing analysis and how does it inform strategy?',
    answer: `Corridor pricing analysis, detailed in the Pricing Analysis report (Analytical Framework Section 6.2), examines tariff structures and rate dynamics across each trade corridor. The analysis tracks Average Revenue per TEU (412 AED), distinguishing between Contract Rates (388 AED/TEU for long-term agreements) and Spot Rates (465 AED/TEU for ad-hoc bookings), with the current mix at 72% contract / 28% spot.

The pricing methodology assesses price elasticity (-0.32, indicating relatively inelastic demand), year-over-year rate changes (+4.8%), and the premium AD Ports commands versus regional competitors (+8.4%). Corridor-level pricing reveals significant variations: the Asia-GCC corridor carries higher spot premiums due to capacity constraints, while the Europe-GCC corridor has more stable contract rates driven by established liner alliances.

Strategic implications flow from pricing analysis to multiple decision points: (1) Capacity expansion timing, as high spot-rate premiums signal demand exceeding supply; (2) Customer mix optimization, balancing the revenue stability of contracts against the upside of spot exposure; (3) Service differentiation investments, as premium pricing must be justified by superior service quality; and (4) Competitive response, monitoring whether pricing gaps trigger market share shifts. The annual tariff review cycle incorporates corridor pricing intelligence to set rate adjustments.`,
    relatedIds: ['mkt-3', 'mkt-4'],
    sourceReference: 'Analytical Framework \u00a76.2 \u2014 Competitive Advantage: Pricing Power',
  },

  // ── Strategic (5) ──
  {
    id: 'str-1',
    category: 'strategic',
    question: 'How does the Value Creation Plan connect to financial statements?',
    answer: `The Value Creation Plan is presented through the EBITDA Bridge (Value Creation) report (Analytical Framework Section 8.1), which provides a strategic bridge from Current EBITDA (6.1B AED) to Target EBITDA 2028 (9.8B AED). Each value lever in the bridge maps directly to financial statement line items: Organic Growth (+1.8B AED) flows through IS Revenue and COGS lines; M&A Synergies (+0.9B AED) appear in IS as both revenue additions and cost savings; Cost Optimization (+0.6B AED) impacts IS OpEx lines; and Portfolio Actions (+0.4B AED) affect all three statements (IS revenue, BS asset values, CF disposal proceeds).

The plan's financial statement linkage enables audit-grade traceability from strategic initiatives to reported numbers. Every value lever has defined KPIs that are tracked in the BiPM Dashboard (Business-Integrated Performance Management) and cascaded from board-level to operational teams. The Implied CAGR of +12.6% represents the overall growth trajectory that the plan targets.

This connection is critical for credibility: each strategic initiative must demonstrate quantifiable financial impact across the Income Statement, Balance Sheet, and Cash Flow Statement. The Risk Management module cross-references value creation assumptions with risk factors, ensuring that the plan accounts for downside scenarios. The Projection Scenarios report stress-tests the value creation plan under Base (60% probability), Upside, and Downside conditions.`,
    relatedIds: ['str-2', 'str-4'],
    sourceReference: 'Analytical Framework \u00a78.1 \u2014 Management Plan: Value Creation Roadmap',
  },
  {
    id: 'str-2',
    category: 'strategic',
    question: 'What CAPEX categories are tracked in the investment pipeline?',
    answer: `The CAPEX Planning report (Analytical Framework Section 8.1) and CAPEX Timeline report (Section 8.2) track three primary categories: Maintenance CAPEX (1.2B AED) for sustaining existing infrastructure and equipment; Expansion CAPEX (1.5B AED) for new terminal construction, berth extensions, and yard capacity additions; and Digital CAPEX (0.6B AED) for technology investments including the AI solution portfolio, automation, and ERP systems.

The total CAPEX budget stands at 3.3B AED annually, representing a CAPEX-to-Revenue ratio of 23.2%. The multi-year investment program has a total value of 18.4B AED, split evenly between committed projects (2024-2026: 9.2B AED) and planned future investments (2027-2030: 9.2B AED). Each project is tracked with individual metrics: Weighted Average IRR (14.8%), Average Payback Period (4.2 years), and completion status.

The CAPEX Timeline provides project-level visibility: 14 active projects are monitored with traffic-light indicators for budget compliance (11 on budget, 2 over budget, 1 delayed) and average completion rate of 62.4%. The Committed Pipeline (7.8B AED on the Balance Sheet) represents contracted but not yet spent capital, providing forward visibility into cash outflows. Capital allocation decisions are informed by the Value Creation Plan, with IRR hurdle rates and strategic fit scores determining project prioritization.`,
    relatedIds: ['str-1', 'str-5'],
    sourceReference: 'Analytical Framework \u00a78.1-8.2 \u2014 Management Plan: Capital Allocation',
  },
  {
    id: 'str-3',
    category: 'strategic',
    question: 'How are ESG metrics measured and reported?',
    answer: `ESG metrics are integrated across the platform rather than siloed in a separate module. Environmental indicators are tracked through the CarbonWise Navigator solution (carbon emissions, CII compliance, fuel efficiency) and feed into the Risk Management module under regulatory risks (R-003: IMO 2030 Decarbonization Compliance, 2.4B AED CAPEX impact). The platform monitors Scope 1 and Scope 2 emissions at the terminal level with targets aligned to the Paris Agreement pathway.

Social metrics are captured in the Workforce Metrics report (Section 5.1): total headcount (42,600), training hours per employee (84 hours/year), attrition rate (8.4%), and safety incident rates. The platform also tracks community investment, Emiratization ratios (for UAE-based operations), and supply chain labor standards. These metrics feed into the Capability Maturity assessment under the People & Culture dimension (currently 3.6/5.0).

Governance metrics are embedded in the BiPM Dashboard and KPI Priority Matrix, tracking board composition, audit committee effectiveness, related-party transaction disclosure, and compliance program maturity. The ESG / Sustainability category comprises 38 of the 186 total tracked KPIs. The Strategic Analytics module aggregates ESG performance into the overall Capability Maturity score (3.95/5.0) with a 2028 target of 4.5/5.0, ensuring ESG considerations are weighted alongside financial and operational performance.`,
    relatedIds: ['str-4', 'str-5'],
    sourceReference: 'CFO Framework \u2014 ESG Integration & Capability Assessment',
  },
  {
    id: 'str-4',
    category: 'strategic',
    question: 'What is the capability maturity assessment framework?',
    answer: `The Capability Maturity report (CFO Framework) assesses organizational readiness across six dimensions, each scored on a 1-5 scale: Digital Maturity (3.8/5.0), Commercial Excellence (4.1/5.0), Operational Efficiency (4.3/5.0), Financial Discipline (4.5/5.0), People & Culture (3.6/5.0), and Innovation Index (3.4/5.0). The Overall Maturity score is 3.95/5.0 with a 2028 target of 4.5/5.0.

Each dimension is assessed through a structured methodology: quantitative metrics (KPI achievement rates, benchmark comparisons), qualitative assessments (process maturity interviews, capability gap analysis), and evidence-based validation (system audits, documentation reviews). The scoring follows a defined maturity model: Level 1 (Ad-hoc), Level 2 (Developing), Level 3 (Defined), Level 4 (Managed), Level 5 (Optimized). Current scores suggest AD Ports has well-managed financial and operational capabilities but room for improvement in digital and innovation dimensions.

The assessment directly informs strategic investment priorities: dimensions scoring below 4.0 receive targeted capability-building programs. The gap between current scores and 2028 targets drives CAPEX allocation (particularly Digital CAPEX at 0.6B AED) and organizational development initiatives. The Learning Hub's Capability Framework paths are structured around these six dimensions, ensuring that knowledge development aligns with strategic capability requirements.`,
    relatedIds: ['str-1', 'str-3'],
    sourceReference: 'CFO Framework \u2014 Capability Assessment',
  },
  {
    id: 'str-5',
    category: 'strategic',
    question: 'How do M&A screening criteria work?',
    answer: `M&A screening criteria are embedded within the Strategic Analytics module, connecting the Value Creation Plan's M&A Synergies lever (+0.9B AED target) to a structured evaluation framework. The screening process uses five primary filters: Strategic Fit (alignment with AD Ports' corridor strategy and service portfolio), Financial Attractiveness (target valuation, EBITDA multiples, synergy potential), Operational Compatibility (terminal specifications, equipment standards, IT system integration), Geographic Positioning (fills white spaces in the port network), and Risk Profile (political, regulatory, and execution risks).

Each potential acquisition is scored against these criteria using a weighted matrix. Financial thresholds include: minimum target EBITDA of 200M AED, maximum entry multiple of 10x EV/EBITDA, minimum synergy IRR of 15%, and maximum integration timeline of 24 months. The platform tracks the M&A pipeline from initial screening through detailed assessment to closing, with progress dashboards and risk flags at each stage.

Post-acquisition integration is monitored through the Value Creation Plan: acquired entities must deliver committed synergies within the stated timeline, tracked through dedicated integration KPIs in the BiPM Dashboard. Historical M&A performance (actual vs projected synergies) informs future screening calibration, creating a feedback loop that improves deal selection over time. The Projection Scenarios incorporate M&A contributions under the different scenario cases.`,
    relatedIds: ['str-1', 'str-2'],
    sourceReference: 'Analytical Framework \u00a78.1 \u2014 Management Plan: Value Creation Roadmap',
  },

  // ── Platform (5) ──
  {
    id: 'plat-1',
    category: 'platform',
    question: 'How do the 10 port AI solutions integrate with the analytics platform?',
    answer: `The Maritime AI Suite integrates 10 specialized port AI solutions, each addressing a distinct operational challenge: CarbonWise Navigator (emissions), LoadMaster AI (cargo optimization), Lithium-Sentinel AI (battery safety), VIN-Chain Traceability (vehicle logistics), Trade-Flow Oracle (market intelligence), Slot-Bid AI (berth allocation), Battery-Logistics Health Guard (battery monitoring), Stevedore-AI Orchestrator (workforce optimization), Port-FOTA Hub (IoT firmware updates), and Sky-Link Logistics (drone coordination).

Each solution generates domain-specific data that feeds into the four analytical pillars: Financial Analytics (revenue and cost impacts), Operational Analytics (throughput and productivity metrics), Market Analytics (demand signals and competitive intelligence), and Strategic Analytics (capability maturity and value creation tracking). For example, Slot-Bid AI's dynamic pricing outputs flow into the Revenue Waterfall and Pricing Analysis reports, while StevedoreAI's workforce optimization metrics appear in the Workforce Metrics and terminal productivity dashboards.

The integration architecture uses a common data layer that normalizes outputs from all 10 solutions into standardized KPI formats. Each solution has a dedicated page in the platform accessible from the sidebar navigation under "Port AI Solutions," with detailed dashboards, configuration panels, and performance monitoring. The Learning Hub provides structured training paths for each solution, ensuring user adoption and competency development across the organization.`,
    relatedIds: ['plat-2', 'plat-5'],
    sourceReference: 'Platform Architecture \u2014 Solution Integration Guide',
  },
  {
    id: 'plat-2',
    category: 'platform',
    question: 'What does the Connect module enable for cross-team collaboration?',
    answer: `The Connect module serves as the platform's collaboration and communication hub, enabling cross-functional teamwork across the organization. It provides four core capabilities: Team Activity Feed (real-time updates on report generation, KPI threshold alerts, and analytical framework milestone completions), Direct Messaging (secure 1:1 and group conversations with context linking to specific reports or KPIs), Shared Workspaces (collaborative analysis environments where teams can jointly review dashboards and annotate findings), and Comment Threads (inline discussion attached to specific data points, charts, or reports).

The Connect module bridges the gap between analytical insight and organizational action. When a Financial Analyst identifies an EBITDA variance in the Financial Analytics module, they can instantly share the finding with the Operations team via Connect, linking directly to the relevant EBITDA Bridge visualization. This eliminates the friction of exporting data, creating presentations, and scheduling meetings for routine analytical collaboration.

Integration with the other platform modules is bidirectional: users can share content from any analytical module into Connect conversations, and Connect activity (comments, decisions, action items) is logged for audit trail purposes. The module supports role-based access control, ensuring that sensitive financial data is shared only with authorized team members. Activity metrics from Connect feed into the Capability Maturity assessment under the collaboration readiness dimension.`,
    relatedIds: ['plat-1', 'plat-4'],
    sourceReference: 'Platform Architecture \u2014 Connect Module Guide',
  },
  {
    id: 'plat-3',
    category: 'platform',
    question: 'How does the Risk Management module link risks to financial statements?',
    answer: `The Risk Management module implements a distinctive financial-statement-linked risk framework where every identified risk is explicitly mapped to the financial statement it would impact: Income Statement (IS), Balance Sheet (BS), or Cash Flow Statement (CF). This linkage is shown through color-coded badges on each risk card and enables financial quantification of risk exposure.

For example, Risk R-001 (Bunker Fuel Price Volatility) is tagged as IS because its primary impact flows through the Cost of Goods Sold line on the Income Statement, with an estimated impact of plus or minus 180M AED. Risk R-003 (IMO 2030 Decarbonization) is tagged as CF because the 2.4B AED impact primarily manifests as growth CAPEX requirements on the Cash Flow Statement. Risk R-005 (Cybersecurity) maps to BS through its impact on Intangible Assets and IT Infrastructure book values.

This IS/BS/CF linkage transforms risk management from a qualitative exercise into a financially quantified discipline. The module includes a Risk Heat Map (Likelihood x Impact matrix), domain summary cards (Operational, Financial, Regulatory, Market), mitigation status tracking (Mitigated, In-Progress, Unmitigated), and trend indicators (Improving, Stable, Worsening). Each risk has an assigned owner, timeline, and detailed mitigation plan. The aggregated financial impact across all risks provides a total risk-adjusted value that informs the Projection Scenarios report's downside case.`,
    relatedIds: ['plat-1', 'plat-4'],
    sourceReference: 'Analytical Framework \u00a79 \u2014 Risk Assessment',
  },
  {
    id: 'plat-4',
    category: 'platform',
    question: 'What reporting templates are available in the Analyse workspace?',
    answer: `The Analyse workspace provides access to the full report catalog organized by domain: 7 Financial reports (Revenue Waterfall, EBITDA Bridge, Cost Structure, Profitability Analysis, Leverage Ratios, Cash Flow Projection, CAPEX Planning), 6 Operational reports (Fleet Profile, Vessel Utilization, Port Throughput, Intermodal Network, Workforce Metrics, Capacity Planning), 6 Market reports (Trade Corridor, Modal Share, Competitive Positioning, Pricing Analysis, Growth Drivers, Sector Breakdown), and 6 Strategic reports (Value Creation, CAPEX Timeline, Projection Scenarios, Capability Maturity, BiPM Dashboard, KPI Priority Matrix).

Each report template includes: a defined set of KPI fields with data types and sample values, financial statement mapping (IS/BS/CF) for every field, source reference to the relevant Analytical Framework section, and tags for cross-referencing. Users can select templates, customize field visibility, apply domain and statement type filters, and preview field-level details before generating reports.

The Analyse workspace also tracks report usage metrics: generation frequency, most-used templates, and user adoption by team. Export capabilities include PDF generation with the AD Ports visual identity and data export for further analysis. Template versioning ensures that report definitions evolve with the analytical framework while maintaining historical comparability. The workspace design follows the platform's consistent dark theme with domain-specific color accents.`,
    relatedIds: ['plat-1', 'plat-3'],
    sourceReference: 'Platform Architecture \u2014 Analyse Workspace Guide',
  },
  {
    id: 'plat-5',
    category: 'platform',
    question: 'How are learning paths structured in the Learning Hub?',
    answer: `The Learning Hub organizes content into two path categories: Solution Learning Paths (10 paths, one per port AI solution) and Capability Framework Paths (4 paths aligned to the analytical domains: Financial, Operational, Market, Strategic). Each path contains 3-4 structured modules with defined durations, progress tracking, and certification upon completion.

Solution Learning Paths follow a standard four-module structure: Module 1 (Overview and Use Case, 15 min) introduces the solution's purpose and business context; Module 2 (Key Features and Capabilities, 20 min) covers functional capabilities and user workflows; Module 3 (Analytical Framework and KPIs, 25 min) connects the solution to relevant analytical metrics and reporting; Module 4 (Integration and Reporting, 20 min) explains how the solution's outputs integrate with the broader analytics platform.

Capability Framework Paths use a three-module structure: Module 1 (Core Concepts, 30 min) teaches fundamental domain knowledge; Module 2 (Applied Analysis, 25 min) provides hands-on exercises with real AD Ports data; Module 3 (Certification Assessment, 20 min) tests competency through scenario-based questions. Progress is tracked at the module level with visual indicators, and Professional Certificates are awarded upon 100% completion of all modules in a path. The total content library spans approximately 14 hours across all paths, with domain-specific color coding matching the platform's visual taxonomy.`,
    relatedIds: ['plat-1', 'plat-2'],
    sourceReference: 'Platform Architecture \u2014 Learning Hub Guide',
  },
]

// ─────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────

function FaqAccordionItem({
  item,
  isExpanded,
  onToggle,
  allItems,
}: {
  item: FaqItem
  isExpanded: boolean
  onToggle: () => void
  allItems: FaqItem[]
}) {
  const cfg = categoryConfig[item.category]

  return (
    <div className={`bg-ad-white rounded-xl border transition-all duration-200 overflow-hidden ${
      isExpanded ? `${cfg.border} shadow-card-hover` : 'border-border hover:shadow-card-hover'
    }`}>
      {/* Question header */}
      <button
        onClick={onToggle}
        className="w-full text-left p-5 flex items-start gap-3"
      >
        <div className={`w-8 h-8 rounded-lg ${cfg.bgLight} flex items-center justify-center shrink-0 mt-0.5 ${cfg.color}`}>
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {item.isPopular && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-warning/10 text-warning text-[9px] font-bold shrink-0">
                <Star size={9} />
                Popular
              </span>
            )}
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${cfg.bg} shrink-0`}>
              {cfg.label}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-text-primary leading-snug pr-4">{item.question}</h3>
        </div>
        <div className="shrink-0 mt-1">
          {isExpanded
            ? <ChevronUp size={18} className={cfg.color} />
            : <ChevronDown size={18} className="text-text-muted" />
          }
        </div>
      </button>

      {/* Answer body — CSS transition via max-height */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isExpanded ? '1200px' : '0px',
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div className="px-5 pb-5 pt-0">
          <div className="ml-11">
            {/* Answer text */}
            <div className="text-xs text-text-secondary leading-relaxed whitespace-pre-line mb-4">
              {item.answer}
            </div>

            {/* Source reference */}
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={12} className="text-text-muted shrink-0" />
              <span className="text-[11px] text-text-muted italic">{item.sourceReference}</span>
            </div>

            {/* Related topics */}
            <div className="mb-4">
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-1.5">Related Topics</p>
              <div className="flex flex-wrap gap-1.5">
                {item.relatedIds.map(relId => {
                  const related = allItems.find(f => f.id === relId)
                  if (!related) return null
                  return (
                    <span
                      key={relId}
                      className="text-[10px] px-2 py-1 rounded-full bg-surface-secondary text-text-secondary hover:bg-surface hover:text-text-primary transition-colors cursor-pointer"
                    >
                      {related.question.length > 60
                        ? related.question.slice(0, 57) + '...'
                        : related.question}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Helpful buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-border-light">
              <span className="text-[11px] text-text-muted">Was this helpful?</span>
              <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-secondary text-text-secondary hover:bg-success/10 hover:text-success transition-colors text-[11px]">
                <ThumbsUp size={12} />
                Yes
              </button>
              <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-secondary text-text-secondary hover:bg-critical/10 hover:text-critical transition-colors text-[11px]">
                <ThumbsDown size={12} />
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────

export default function FAQ() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<FaqCategory | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Filter items
  const filteredItems = useMemo(() => {
    return faqItems.filter(item => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) return false
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [search, activeCategory])

  // Group by category for display
  const groupedItems = useMemo(() => {
    const groups: Record<FaqCategory, FaqItem[]> = {
      financial: [],
      operational: [],
      market: [],
      strategic: [],
      platform: [],
    }
    filteredItems.forEach(item => {
      groups[item.category].push(item)
    })
    return groups
  }, [filteredItems])

  // Category counts (from full data, not filtered)
  const categoryCounts = useMemo(() => {
    const counts: Record<FaqCategory, number> = {
      financial: 0,
      operational: 0,
      market: 0,
      strategic: 0,
      platform: 0,
    }
    faqItems.forEach(item => {
      counts[item.category]++
    })
    return counts
  }, [])

  const handleToggle = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-ad-red/10 flex items-center justify-center">
            <HelpCircle size={22} className="text-ad-red" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary font-serif">FAQ Knowledge Base</h1>
            <p className="text-xs text-text-muted">KPI Definitions, Methodology Explanations & Platform Guidance</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          Comprehensive answers to {faqItems.length} frequently asked questions across Financial, Operational,
          Market, Strategic, and Platform domains. Each answer includes specific AD Ports context, source references,
          and related topic links.
        </p>

        {/* Summary Stats */}
        <div className="flex items-center gap-4 mt-4">
          {categories.map(cat => {
            const cfg = categoryConfig[cat]
            return (
              <div key={cat} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${cfg.bg}`} />
                <span className="text-xs text-text-secondary">{categoryCounts[cat]} {cfg.label}</span>
              </div>
            )
          })}
          <span className="text-xs text-text-muted ml-2">{faqItems.length} total</span>
        </div>
      </div>

      {/* Workspace Layout */}
      <div className="flex gap-4" style={{ minHeight: 'calc(100vh - 300px)' }}>
        {/* Left Sidebar — 240px */}
        <div className="w-[240px] shrink-0">
          <div className="bg-ad-white rounded-xl border border-border p-4 sticky top-4">
            {/* Search */}
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-surface-secondary rounded-lg border border-border-light
                  focus:outline-none focus:border-ad-red/30 focus:ring-1 focus:ring-ad-red/20 transition-all
                  text-text-primary placeholder:text-text-muted"
              />
            </div>

            {search.trim() && (
              <div className="mb-3 px-1">
                <span className="text-[11px] text-text-muted">
                  {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} found
                </span>
              </div>
            )}

            {/* Category filters */}
            <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">
              Categories
            </h3>
            <div className="space-y-1">
              {/* All */}
              <button
                onClick={() => { setActiveCategory('all'); setExpandedId(null) }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-ad-red/10 text-ad-red'
                    : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                }`}
              >
                <span>All Questions</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeCategory === 'all' ? 'bg-ad-red/20 text-ad-red' : 'bg-surface-secondary text-text-muted'
                }`}>
                  {faqItems.length}
                </span>
              </button>

              {/* Per category */}
              {categories.map(cat => {
                const cfg = categoryConfig[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setExpandedId(null) }}
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
          </div>
        </div>

        {/* Main Area — FAQ Items */}
        <div className="flex-1 min-w-0">
          {filteredItems.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-surface-secondary flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-text-muted" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">No results found</h3>
                <p className="text-xs text-text-muted max-w-xs">
                  Try adjusting your search terms or selecting a different category.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {(activeCategory === 'all' ? categories : [activeCategory]).map(cat => {
                const items = groupedItems[cat]
                if (items.length === 0) return null
                const cfg = categoryConfig[cat]

                return (
                  <div key={cat}>
                    {/* Category header */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-6 h-6 rounded-md ${cfg.bgLight} flex items-center justify-center ${cfg.color}`}>
                        {cfg.icon}
                      </div>
                      <h2 className="text-sm font-semibold text-text-primary">{cfg.label}</h2>
                      <span className="text-[10px] text-text-muted">{items.length} question{items.length !== 1 ? 's' : ''}</span>
                      <div className={`flex-1 h-px ${cfg.bgLight} ml-2`} />
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      {items.map(item => (
                        <FaqAccordionItem
                          key={item.id}
                          item={item}
                          isExpanded={expandedId === item.id}
                          onToggle={() => handleToggle(item.id)}
                          allItems={faqItems}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
