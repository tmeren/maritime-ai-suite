import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { Home } from './pages/Home'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { lazy, Suspense } from 'react'
import {
  DollarSign,
  Settings,
  BarChart3,
  Target,
  ShieldAlert,
  MessageSquare,
  FileSearch,
  GraduationCap,
  HelpCircle,
  BookOpen,
  Trophy,
} from 'lucide-react'

const CarbonWise = lazy(() => import('./pages/solutions/CarbonWisePage'))
const LoadMaster = lazy(() => import('./pages/solutions/LoadMasterPage'))
const LithiumSentinel = lazy(() => import('./pages/solutions/LithiumSentinel'))
const VinChain = lazy(() => import('./pages/solutions/VinChain'))
const TradeFlowOracle = lazy(() => import('./pages/solutions/TradeFlowOracle'))
const SlotBid = lazy(() => import('./pages/solutions/SlotBid'))
const BatteryHealth = lazy(() => import('./pages/solutions/BatteryHealth'))
const StevedoreAI = lazy(() => import('./pages/solutions/StevedoreAI'))
const PortFota = lazy(() => import('./pages/solutions/PortFota'))
const SkyLink = lazy(() => import('./pages/solutions/SkyLink'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-3 text-text-secondary">
        <div className="w-5 h-5 border-2 border-ad-red border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading module...</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />

          {/* Module Placeholder Pages with rich content */}
          <Route path="financial" element={
            <PlaceholderPage
              title="Financial Overview"
              description="DD-grade financial analytics with 3-statement model integration. Track revenue, EBITDA, working capital, and cash flow metrics with full IS/BS/CF audit trails."
              icon={DollarSign}
              features={[
                { title: 'Income Statement Analytics', description: 'Revenue growth, EBITDA margins, cost structure analysis with YoY comparisons and trend identification.' },
                { title: 'Balance Sheet Deep-Dive', description: 'Asset utilization, debt structure, working capital optimization with covenant tracking.' },
                { title: 'Cash Flow Waterfall', description: 'Operating, investing, and financing cash flow visualization with free cash flow bridge analysis.' },
                { title: '3-Statement Model', description: 'Integrated financial model connecting IS, BS, and CF with scenario analysis capabilities.' },
              ]}
            />
          } />
          <Route path="operations" element={
            <PlaceholderPage
              title="Operations Analytics"
              description="Fleet, port, and intermodal operational intelligence. Real-time throughput monitoring, vessel turnaround analysis, and efficiency benchmarking."
              icon={Settings}
              features={[
                { title: 'Throughput Dashboard', description: 'Real-time TEU/vehicle throughput with historical trends and capacity utilization metrics.' },
                { title: 'Vessel Turnaround', description: 'Port call analytics, berth utilization, crane productivity, and dwell time optimization.' },
                { title: 'Fleet Performance', description: 'Vessel efficiency scores, fuel consumption tracking, and route optimization insights.' },
                { title: 'Intermodal Analytics', description: 'Truck gate movements, rail connectivity, and last-mile delivery performance metrics.' },
              ]}
            />
          } />
          <Route path="market" element={
            <PlaceholderPage
              title="Market Intelligence"
              description="Trade corridor analysis, competitive positioning, and growth drivers. Monitor global shipping trends and identify strategic opportunities."
              icon={BarChart3}
              features={[
                { title: 'Trade Corridor Analysis', description: 'Volume and value flows across major trade routes with seasonal pattern detection.' },
                { title: 'Competitive Benchmarking', description: 'Port rankings, market share evolution, and peer group performance comparison.' },
                { title: 'Growth Driver Index', description: 'Leading indicators for trade volume, GDP correlation, and demand forecasting models.' },
                { title: 'Commodity Tracking', description: 'Price indices, trade balance analysis, and commodity-specific flow visualization.' },
              ]}
            />
          } />
          <Route path="strategic" element={
            <PlaceholderPage
              title="Strategic Planning"
              description="Value creation, CAPEX planning, and capability maturity assessment. Long-term portfolio strategy with scenario modeling."
              icon={Target}
              features={[
                { title: 'Value Creation Roadmap', description: 'Strategic initiative tracking with NPV analysis, milestone monitoring, and value bridge visualization.' },
                { title: 'CAPEX Planning', description: 'Capital expenditure forecasting, project pipeline management, and ROI tracking.' },
                { title: 'Capability Maturity', description: 'Organizational capability assessment across digital, operational, and commercial dimensions.' },
                { title: 'Scenario Modeling', description: 'Monte Carlo simulation for strategic scenarios with sensitivity analysis and risk-adjusted returns.' },
              ]}
            />
          } />
          <Route path="risk" element={
            <PlaceholderPage
              title="Risk Management"
              description="DD-standard risk framework with heat maps and mitigation tracking. Comprehensive risk registry across operational, financial, and strategic dimensions."
              icon={ShieldAlert}
              features={[
                { title: 'Risk Heat Map', description: 'Interactive probability-impact matrix with drill-through to individual risk items and trend analysis.' },
                { title: 'Mitigation Tracker', description: 'Action plan monitoring, owner accountability, and progress tracking against risk reduction targets.' },
                { title: 'Compliance Dashboard', description: 'Regulatory compliance status across IMO, EU ETS, environmental, and safety frameworks.' },
                { title: 'Early Warning System', description: 'Leading risk indicators with automated alerts and escalation workflows.' },
              ]}
            />
          } />
          <Route path="connect" element={
            <PlaceholderPage
              title="Connect Hub"
              description="Domain-organized collaboration channels for cross-functional communication and knowledge sharing."
              icon={MessageSquare}
              features={[
                { title: 'Domain Channels', description: 'Organized discussion threads per business domain: Operations, Finance, Strategy, and Technology.' },
                { title: 'Expert Directory', description: 'Find and connect with subject matter experts across the organization.' },
                { title: 'Announcement Board', description: 'Platform-wide updates, policy changes, and strategic communications.' },
                { title: 'Document Sharing', description: 'Secure file sharing with version control and access management.' },
              ]}
            />
          } />
          <Route path="analyse" element={
            <PlaceholderPage
              title="Analysis Center"
              description="Report generation workspace with 24 DD-grade templates. Create, customize, and export professional analytical reports."
              icon={FileSearch}
              features={[
                { title: 'Report Templates', description: '24 pre-built DD-grade templates covering financial, operational, market, and strategic analysis.' },
                { title: 'Custom Builder', description: 'Drag-and-drop report builder with KPI widgets, charts, and narrative sections.' },
                { title: 'Export Engine', description: 'PDF, Excel, and PowerPoint export with branded formatting and appendix generation.' },
                { title: 'Schedule & Distribute', description: 'Automated report scheduling with email distribution and stakeholder access management.' },
              ]}
            />
          } />
          <Route path="learning" element={
            <PlaceholderPage
              title="Learning Center"
              description="Solution and capability learning paths. Structured programs for platform mastery and domain expertise development."
              icon={GraduationCap}
              features={[
                { title: 'Learning Paths', description: 'Curated courses from beginner to advanced across all 10 Port AI Solutions.' },
                { title: 'Video Tutorials', description: 'Step-by-step video guides for platform features and analytical workflows.' },
                { title: 'Knowledge Base', description: 'Searchable documentation with real-world examples and best practices.' },
                { title: 'Certification Tracks', description: 'Professional certification programs with assessments and digital credentials.' },
              ]}
            />
          } />
          <Route path="faq" element={
            <PlaceholderPage
              title="FAQ"
              description="KPI definitions, methodology explanations, and platform guidance. Everything you need to understand the Maritime AI Suite."
              icon={HelpCircle}
              features={[
                { title: 'KPI Dictionary', description: 'Complete definitions for all 24 executive KPIs with calculation methodologies and data sources.' },
                { title: 'Platform Guide', description: 'Step-by-step instructions for common tasks, navigation, and feature usage.' },
                { title: 'Methodology Notes', description: 'Detailed explanations of analytical approaches, assumptions, and limitation disclosures.' },
                { title: 'Troubleshooting', description: 'Common issues, error resolution guides, and support contact information.' },
              ]}
            />
          } />
          <Route path="glossary" element={
            <PlaceholderPage
              title="Glossary"
              description="DD field definitions with IS/BS/CF mappings. Comprehensive terminology reference for due diligence and financial analysis."
              icon={BookOpen}
              features={[
                { title: 'Financial Terms', description: 'GAAP/IFRS terminology with practical definitions and IS/BS/CF statement mapping.' },
                { title: 'Maritime Terms', description: 'Industry-specific terminology covering vessel operations, port logistics, and trade.' },
                { title: 'DD Framework', description: 'Due diligence specific terms, workstream definitions, and quality standards.' },
                { title: 'Acronym Index', description: 'Alphabetical index of all abbreviations used across the platform.' },
              ]}
            />
          } />
          <Route path="trainings" element={
            <PlaceholderPage
              title="Training Programs"
              description="Framework comprehension quizzes and achievement tracking. Test your knowledge and earn certifications."
              icon={Trophy}
              features={[
                { title: 'Assessment Center', description: 'Interactive quizzes testing knowledge of KPIs, methodologies, and platform capabilities.' },
                { title: 'Progress Tracking', description: 'Personal dashboard showing completion rates, scores, and learning streaks.' },
                { title: 'Team Leaderboard', description: 'Organization-wide rankings and team performance comparison.' },
                { title: 'Achievement Badges', description: 'Digital credentials for completing modules, passing assessments, and reaching milestones.' },
              ]}
            />
          } />

          {/* Port AI Solutions */}
          <Route path="solutions/carbon-wise" element={<Suspense fallback={<LoadingFallback />}><CarbonWise /></Suspense>} />
          <Route path="solutions/load-master" element={<Suspense fallback={<LoadingFallback />}><LoadMaster /></Suspense>} />
          <Route path="solutions/lithium-sentinel" element={<Suspense fallback={<LoadingFallback />}><LithiumSentinel /></Suspense>} />
          <Route path="solutions/vin-chain" element={<Suspense fallback={<LoadingFallback />}><VinChain /></Suspense>} />
          <Route path="solutions/trade-flow-oracle" element={<Suspense fallback={<LoadingFallback />}><TradeFlowOracle /></Suspense>} />
          <Route path="solutions/slot-bid" element={<Suspense fallback={<LoadingFallback />}><SlotBid /></Suspense>} />
          <Route path="solutions/battery-health" element={<Suspense fallback={<LoadingFallback />}><BatteryHealth /></Suspense>} />
          <Route path="solutions/stevedore-ai" element={<Suspense fallback={<LoadingFallback />}><StevedoreAI /></Suspense>} />
          <Route path="solutions/port-fota" element={<Suspense fallback={<LoadingFallback />}><PortFota /></Suspense>} />
          <Route path="solutions/sky-link" element={<Suspense fallback={<LoadingFallback />}><SkyLink /></Suspense>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
