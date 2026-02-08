import { useLocation } from 'react-router-dom'
import { Search, Bell, ChevronRight } from 'lucide-react'

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/financial': 'Financial Overview',
  '/operations': 'Operations',
  '/market': 'Market Intelligence',
  '/strategic': 'Strategic',
  '/risk': 'Risk Management',
  '/connect': 'Connect',
  '/analyse': 'Analyse',
  '/learning': 'Learning Hub',
  '/faq': 'FAQ',
  '/glossary': 'Glossary',
  '/trainings': 'Trainings',
  '/solutions/carbon-wise': 'CarbonWise',
  '/solutions/load-master': 'LoadMaster',
  '/solutions/lithium-sentinel': 'LithiumSentinel',
  '/solutions/vin-chain': 'VinChain',
  '/solutions/trade-flow-oracle': 'TradeFlow Oracle',
  '/solutions/slot-bid': 'SlotBid',
  '/solutions/battery-health': 'BatteryHealth',
  '/solutions/stevedore-ai': 'StevedoreAI',
  '/solutions/port-fota': 'PortFOTA',
  '/solutions/sky-link': 'SkyLink',
}

export function Header() {
  const location = useLocation()
  const currentLabel = routeLabels[location.pathname] || 'Page'
  const isSolution = location.pathname.startsWith('/solutions')

  return (
    <header className="h-16 bg-ad-white border-b border-border flex items-center justify-between px-6 shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-text-muted">Maritime AI Suite</span>
        <ChevronRight size={14} className="text-text-muted" />
        {isSolution && (
          <>
            <span className="text-text-muted">Port AI Solutions</span>
            <ChevronRight size={14} className="text-text-muted" />
          </>
        )}
        <span className="text-text-primary font-medium">{currentLabel}</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="w-56 h-9 pl-9 pr-3 rounded-lg bg-surface-secondary border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-ad-red/20 focus:border-ad-red transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg hover:bg-surface-secondary flex items-center justify-center transition-colors">
          <Bell size={18} className="text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-ad-red" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-ad-dark flex items-center justify-center">
            <span className="text-xs font-semibold text-white">AP</span>
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-text-primary leading-tight">Admin</div>
            <div className="text-[11px] text-text-muted leading-tight">AD Ports Group</div>
          </div>
        </div>
      </div>
    </header>
  )
}
