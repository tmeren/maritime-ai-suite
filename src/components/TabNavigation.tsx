import { useNavigate, useLocation } from 'react-router-dom'
import { DollarSign, Settings, BarChart3, Target } from 'lucide-react'
import type { Domain } from '../data/reportCatalog'

const tabs: { domain: Domain; label: string; path: string; icon: typeof DollarSign }[] = [
  { domain: 'financial', label: 'Financial', path: '/financial', icon: DollarSign },
  { domain: 'operational', label: 'Operational', path: '/operations', icon: Settings },
  { domain: 'market', label: 'Market', path: '/market', icon: BarChart3 },
  { domain: 'strategic', label: 'Strategic', path: '/strategic', icon: Target },
]

interface TabNavigationProps {
  activeDomain: Domain
}

export function TabNavigation({ activeDomain }: TabNavigationProps) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="flex items-center gap-1 bg-surface-secondary rounded-xl p-1 mb-6">
      {tabs.map(tab => {
        const isActive = tab.domain === activeDomain || location.pathname === tab.path
        const Icon = tab.icon
        return (
          <button
            key={tab.domain}
            onClick={() => navigate(tab.path)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center ${
              isActive
                ? 'bg-ad-white text-text-primary shadow-card'
                : 'text-text-secondary hover:text-text-primary hover:bg-ad-white/50'
            }`}
          >
            <Icon size={16} className={isActive ? 'text-ad-red' : ''} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
