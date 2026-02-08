import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { Home } from './pages/Home'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { lazy, Suspense } from 'react'
import {
  ShieldAlert,
  MessageSquare,
  FileSearch,
  GraduationCap,
  HelpCircle,
  BookOpen,
  Trophy,
} from 'lucide-react'

const FinancialAnalytics = lazy(() => import('./pages/FinancialAnalytics'))
const OperationalAnalytics = lazy(() => import('./pages/OperationalAnalytics'))
const MarketAnalytics = lazy(() => import('./pages/MarketAnalytics'))
const StrategicAnalytics = lazy(() => import('./pages/StrategicAnalytics'))

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

          {/* DD-Grade Analytics Tabs */}
          <Route path="financial" element={<Suspense fallback={<LoadingFallback />}><FinancialAnalytics /></Suspense>} />
          <Route path="operations" element={<Suspense fallback={<LoadingFallback />}><OperationalAnalytics /></Suspense>} />
          <Route path="market" element={<Suspense fallback={<LoadingFallback />}><MarketAnalytics /></Suspense>} />
          <Route path="strategic" element={<Suspense fallback={<LoadingFallback />}><StrategicAnalytics /></Suspense>} />
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
