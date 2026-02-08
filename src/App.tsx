import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { Home } from './pages/Home'
import { lazy, Suspense } from 'react'

const FinancialAnalytics = lazy(() => import('./pages/FinancialAnalytics'))
const OperationalAnalytics = lazy(() => import('./pages/OperationalAnalytics'))
const MarketAnalytics = lazy(() => import('./pages/MarketAnalytics'))
const StrategicAnalytics = lazy(() => import('./pages/StrategicAnalytics'))
const RiskManagement = lazy(() => import('./pages/RiskManagement'))
const Connect = lazy(() => import('./pages/Connect'))
const Analyse = lazy(() => import('./pages/Analyse'))
const LearningHub = lazy(() => import('./pages/LearningHub'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Glossary = lazy(() => import('./pages/Glossary'))
const Trainings = lazy(() => import('./pages/Trainings'))

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

/* Module KPI Pages (S1) */
const TradeFlowModule = lazy(() => import('./pages/modules/TradeFlowModule'))
const VinChainModule = lazy(() => import('./pages/modules/VinChainModule'))
const SlotBidModule = lazy(() => import('./pages/modules/SlotBidModule'))
const BatteryHealthModule = lazy(() => import('./pages/modules/BatteryHealthModule'))
const StevedoreModule = lazy(() => import('./pages/modules/StevedoreModule'))
const PortFotaModule = lazy(() => import('./pages/modules/PortFotaModule'))
const SkyLinkModule = lazy(() => import('./pages/modules/SkyLinkModule'))
const LithiumSentinelModule = lazy(() => import('./pages/modules/LithiumSentinelModule'))
const CruiseTurnaroundModule = lazy(() => import('./pages/modules/CruiseTurnaroundModule'))
const DigitalTwinModule = lazy(() => import('./pages/modules/DigitalTwinModule'))

/* Financial Model + Synergy Map (S2-S3) */
const FinancialModel = lazy(() => import('./pages/FinancialModel'))
const SynergyMap = lazy(() => import('./pages/SynergyMap'))

/* Utility Modules (S4) */
const Projects = lazy(() => import('./pages/Projects'))
const Vault = lazy(() => import('./pages/Vault'))
const Inbox = lazy(() => import('./pages/Inbox'))

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

          {/* Analytical Framework Tabs */}
          <Route path="financial" element={<Suspense fallback={<LoadingFallback />}><FinancialAnalytics /></Suspense>} />
          <Route path="operations" element={<Suspense fallback={<LoadingFallback />}><OperationalAnalytics /></Suspense>} />
          <Route path="market" element={<Suspense fallback={<LoadingFallback />}><MarketAnalytics /></Suspense>} />
          <Route path="strategic" element={<Suspense fallback={<LoadingFallback />}><StrategicAnalytics /></Suspense>} />
          <Route path="risk" element={<Suspense fallback={<LoadingFallback />}><RiskManagement /></Suspense>} />
          <Route path="connect" element={<Suspense fallback={<LoadingFallback />}><Connect /></Suspense>} />
          <Route path="analyse" element={<Suspense fallback={<LoadingFallback />}><Analyse /></Suspense>} />
          <Route path="learning" element={<Suspense fallback={<LoadingFallback />}><LearningHub /></Suspense>} />
          <Route path="faq" element={<Suspense fallback={<LoadingFallback />}><FAQ /></Suspense>} />
          <Route path="glossary" element={<Suspense fallback={<LoadingFallback />}><Glossary /></Suspense>} />
          <Route path="trainings" element={<Suspense fallback={<LoadingFallback />}><Trainings /></Suspense>} />

          {/* Port AI Solutions (Interactive Demos) */}
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

          {/* Module KPI Pages */}
          <Route path="modules/trade-flow-oracle" element={<Suspense fallback={<LoadingFallback />}><TradeFlowModule /></Suspense>} />
          <Route path="modules/vin-chain" element={<Suspense fallback={<LoadingFallback />}><VinChainModule /></Suspense>} />
          <Route path="modules/slot-bid" element={<Suspense fallback={<LoadingFallback />}><SlotBidModule /></Suspense>} />
          <Route path="modules/battery-health" element={<Suspense fallback={<LoadingFallback />}><BatteryHealthModule /></Suspense>} />
          <Route path="modules/stevedore-ai" element={<Suspense fallback={<LoadingFallback />}><StevedoreModule /></Suspense>} />
          <Route path="modules/port-fota" element={<Suspense fallback={<LoadingFallback />}><PortFotaModule /></Suspense>} />
          <Route path="modules/sky-link" element={<Suspense fallback={<LoadingFallback />}><SkyLinkModule /></Suspense>} />
          <Route path="modules/lithium-sentinel" element={<Suspense fallback={<LoadingFallback />}><LithiumSentinelModule /></Suspense>} />
          <Route path="modules/cruise-turnaround" element={<Suspense fallback={<LoadingFallback />}><CruiseTurnaroundModule /></Suspense>} />
          <Route path="modules/digital-twin" element={<Suspense fallback={<LoadingFallback />}><DigitalTwinModule /></Suspense>} />

          {/* Financial Model + Synergy Map */}
          <Route path="financial-model" element={<Suspense fallback={<LoadingFallback />}><FinancialModel /></Suspense>} />
          <Route path="synergy-map" element={<Suspense fallback={<LoadingFallback />}><SynergyMap /></Suspense>} />

          {/* Utility Modules */}
          <Route path="projects" element={<Suspense fallback={<LoadingFallback />}><Projects /></Suspense>} />
          <Route path="vault" element={<Suspense fallback={<LoadingFallback />}><Vault /></Suspense>} />
          <Route path="inbox" element={<Suspense fallback={<LoadingFallback />}><Inbox /></Suspense>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
