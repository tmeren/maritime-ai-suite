import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Anchor,
  Leaf,
  Ship,
  Battery,
  Link2,
  TrendingUp,
  Gavel,
  BatteryCharging,
  Cpu,
  Radio,
  Plane,
  Layers,
  Network,
  FolderKanban,
  Shield,
  Bell,
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const mainNavItems: NavItem[] = [
  { label: 'Home', path: '/', icon: <LayoutDashboard size={20} /> },
  { label: 'Financial Overview', path: '/financial', icon: <DollarSign size={20} /> },
  { label: 'Operations', path: '/operations', icon: <Settings size={20} /> },
  { label: 'Market Intelligence', path: '/market', icon: <BarChart3 size={20} /> },
  { label: 'Strategic', path: '/strategic', icon: <Target size={20} /> },
  { label: 'Risk Management', path: '/risk', icon: <ShieldAlert size={20} /> },
  { label: 'Connect', path: '/connect', icon: <MessageSquare size={20} /> },
  { label: 'Analyse', path: '/analyse', icon: <FileSearch size={20} /> },
  { label: 'Learning Hub', path: '/learning', icon: <GraduationCap size={20} /> },
  { label: 'FAQ', path: '/faq', icon: <HelpCircle size={20} /> },
  { label: 'Glossary', path: '/glossary', icon: <BookOpen size={20} /> },
  { label: 'Trainings', path: '/trainings', icon: <Trophy size={20} /> },
]

const solutionItems: NavItem[] = [
  { label: 'CarbonWise', path: '/solutions/carbon-wise', icon: <Leaf size={18} /> },
  { label: 'LoadMaster', path: '/solutions/load-master', icon: <Ship size={18} /> },
  { label: 'LithiumSentinel', path: '/solutions/lithium-sentinel', icon: <Battery size={18} /> },
  { label: 'VinChain', path: '/solutions/vin-chain', icon: <Link2 size={18} /> },
  { label: 'TradeFlow Oracle', path: '/solutions/trade-flow-oracle', icon: <TrendingUp size={18} /> },
  { label: 'SlotBid', path: '/solutions/slot-bid', icon: <Gavel size={18} /> },
  { label: 'BatteryHealth', path: '/solutions/battery-health', icon: <BatteryCharging size={18} /> },
  { label: 'StevedoreAI', path: '/solutions/stevedore-ai', icon: <Cpu size={18} /> },
  { label: 'PortFOTA', path: '/solutions/port-fota', icon: <Radio size={18} /> },
  { label: 'SkyLink', path: '/solutions/sky-link', icon: <Plane size={18} /> },
]

const integrationItems: NavItem[] = [
  { label: 'Financial Model', path: '/financial-model', icon: <Layers size={18} /> },
  { label: 'Synergy Map', path: '/synergy-map', icon: <Network size={18} /> },
]

const utilityItems: NavItem[] = [
  { label: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
  { label: 'Vault', path: '/vault', icon: <Shield size={20} /> },
  { label: 'Inbox', path: '/inbox', icon: <Bell size={20} /> },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [solutionsOpen, setSolutionsOpen] = useState(true)
  const location = useLocation()
  const isSolutionActive = location.pathname.startsWith('/solutions') || location.pathname.startsWith('/modules')

  return (
    <aside
      className="fixed top-0 left-0 h-full bg-sidebar-bg border-r border-sidebar-border flex flex-col transition-all duration-300 z-40"
      style={{ width: collapsed ? 72 : 260 }}
    >
      {/* Brand */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-ad-red flex items-center justify-center shrink-0">
            <Anchor size={18} className="text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-semibold text-sidebar-text-active truncate">Maritime AI Suite</div>
              <div className="text-[10px] text-sidebar-text tracking-wide uppercase">AD Ports Group</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {/* Main Nav */}
        <div className="space-y-0.5">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-sidebar-active text-sidebar-text-active font-medium border-l-[3px] border-ad-red'
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active border-l-[3px] border-transparent'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <div className="my-3 mx-3 border-t border-sidebar-border" />

        {/* Port AI Solutions - Collapsible */}
        <div>
          <button
            onClick={() => {
              if (collapsed) {
                onToggle()
                setSolutionsOpen(true)
              } else {
                setSolutionsOpen(!solutionsOpen)
              }
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isSolutionActive
                ? 'text-ad-red font-medium'
                : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active'
            }`}
          >
            <Anchor size={20} className="shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left truncate">Port AI Solutions</span>
                <span className="shrink-0">
                  {solutionsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </span>
              </>
            )}
          </button>

          {!collapsed && solutionsOpen && (
            <div className="mt-1 ml-4 pl-3 border-l border-sidebar-border space-y-0.5">
              {solutionItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors ${
                      isActive
                        ? 'bg-sidebar-active text-sidebar-text-active font-medium border-l-[3px] border-ad-red'
                        : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active border-l-[3px] border-transparent'
                    }`
                  }
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="my-3 mx-3 border-t border-sidebar-border" />

        {/* Integration Views */}
        {!collapsed && (
          <div className="mb-1 px-3">
            <span className="text-[10px] font-semibold text-sidebar-text uppercase tracking-wider">Integration</span>
          </div>
        )}
        <div className="space-y-0.5">
          {integrationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-sidebar-active text-sidebar-text-active font-medium border-l-[3px] border-ad-red'
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active border-l-[3px] border-transparent'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <div className="my-3 mx-3 border-t border-sidebar-border" />

        {/* Utility Modules */}
        {!collapsed && (
          <div className="mb-1 px-3">
            <span className="text-[10px] font-semibold text-sidebar-text uppercase tracking-wider">Workspace</span>
          </div>
        )}
        <div className="space-y-0.5">
          {utilityItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-sidebar-active text-sidebar-text-active font-medium border-l-[3px] border-ad-red'
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active border-l-[3px] border-transparent'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="shrink-0 p-2 border-t border-sidebar-border">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active text-sm transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
