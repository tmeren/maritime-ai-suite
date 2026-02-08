import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { Home } from './pages/Home'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { lazy, Suspense } from 'react'

const CarbonWise = lazy(() => import('./pages/solutions/CarbonWise'))
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
          <Route path="financial" element={<PlaceholderPage title="Financial Overview" description="DD-grade financial analytics with 3-statement model integration." />} />
          <Route path="operations" element={<PlaceholderPage title="Operations" description="Fleet, port, and intermodal operational intelligence." />} />
          <Route path="market" element={<PlaceholderPage title="Market Intelligence" description="Trade corridor analysis, competitive positioning, and growth drivers." />} />
          <Route path="strategic" element={<PlaceholderPage title="Strategic" description="Value creation, CAPEX planning, and capability maturity assessment." />} />
          <Route path="risk" element={<PlaceholderPage title="Risk Management" description="DD-standard risk framework with heat maps and mitigation tracking." />} />
          <Route path="connect" element={<PlaceholderPage title="Connect" description="Domain-organized collaboration channels." />} />
          <Route path="analyse" element={<PlaceholderPage title="Analyse" description="Report generation workspace with 24 DD-grade templates." />} />
          <Route path="learning" element={<PlaceholderPage title="Learning Hub" description="Solution and capability learning paths." />} />
          <Route path="faq" element={<PlaceholderPage title="FAQ" description="KPI definitions, methodology explanations, and platform guidance." />} />
          <Route path="glossary" element={<PlaceholderPage title="Glossary" description="DD field definitions with IS/BS/CF mappings." />} />
          <Route path="trainings" element={<PlaceholderPage title="Trainings" description="Framework comprehension quizzes and achievement tracking." />} />

          {/* Port AI Solutions */}
          <Route path="solutions/carbon-wise" element={<Suspense fallback={<LoadingFallback />}><CarbonWise /></Suspense>} />
          <Route path="solutions/load-master" element={<PlaceholderPage title="LoadMaster AI" description="AI-powered RoRo vessel loading planner with IMO-compliant stability calculations. Integration from standalone app pending." comingSoon />} />
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
