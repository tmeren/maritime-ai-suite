import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Clock,
  ExternalLink,
  Filter,
  Check,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Types & Data
// ─────────────────────────────────────────────────────────────

type NotificationType = 'alert' | 'status' | 'threshold' | 'action'
type Priority = 'high' | 'medium' | 'low'

interface Notification {
  id: string
  type: NotificationType
  priority: Priority
  title: string
  description: string
  module: string
  modulePath: string
  timestamp: string
  read: boolean
  actionLabel?: string
  actionPath?: string
}

const typeConfig: Record<NotificationType, { icon: React.ReactNode; color: string }> = {
  alert:     { icon: <AlertTriangle size={16} />, color: 'text-critical bg-critical-light' },
  status:    { icon: <CheckCircle size={16} />,   color: 'text-success bg-success-light' },
  threshold: { icon: <TrendingUp size={16} />,    color: 'text-warning bg-warning-light' },
  action:    { icon: <Info size={16} />,           color: 'text-info bg-info-light' },
}

const priorityBadge: Record<Priority, string> = {
  high:   'bg-red-100 text-red-700 border-red-300',
  medium: 'bg-amber-100 text-amber-700 border-amber-300',
  low:    'bg-gray-100 text-gray-600 border-gray-300',
}

const initialNotifications: Notification[] = [
  { id: 'n1', type: 'alert', priority: 'high', title: 'Thermal Anomaly Detected — Zone C-4', description: 'Lithium-Sentinel detected a 2.3°C temperature spike in battery storage zone C-4. Automated cooling protocol activated. No action required unless temperature exceeds 45°C threshold.', module: 'Lithium-Sentinel', modulePath: '/modules/lithium-sentinel', timestamp: '5 min ago', read: false, actionLabel: 'View Sensor Data', actionPath: '/solutions/lithium-sentinel' },
  { id: 'n2', type: 'threshold', priority: 'high', title: 'Berth Utilization Exceeded 95%', description: 'Slot-Bid AI reports berth utilization at 96.2% for the next 4-hour window. Dynamic pricing has increased by 1.42x base rate. Consider activating overflow berths B-03 and B-04.', module: 'Slot-Bid AI', modulePath: '/modules/slot-bid', timestamp: '12 min ago', read: false, actionLabel: 'View Auction', actionPath: '/solutions/slot-bid' },
  { id: 'n3', type: 'status', priority: 'medium', title: 'VIN-Chain Batch Processing Complete', description: 'Successfully processed 1,240 vehicle provenance records from RoRo vessel MSC Elena. 98.7% first-pass match rate. 16 records flagged for manual VIN verification.', module: 'VIN-Chain', modulePath: '/modules/vin-chain', timestamp: '28 min ago', read: false, actionLabel: 'Review Flagged', actionPath: '/solutions/vin-chain' },
  { id: 'n4', type: 'action', priority: 'medium', title: 'Firmware Update Available — 84 Drones', description: 'Port-FOTA has staged firmware v3.2.1 for the Sky-Link drone fleet. Update includes improved GPS accuracy (+12%) and battery management optimization. Scheduled deployment: tonight 02:00 UTC.', module: 'Port-FOTA', modulePath: '/modules/port-fota', timestamp: '1 hr ago', read: false, actionLabel: 'Approve Update', actionPath: '/solutions/port-fota' },
  { id: 'n5', type: 'threshold', priority: 'medium', title: 'Revenue Target 92% Achieved — Q1', description: 'Financial Model shows Q1 revenue tracking at AED 605M against AED 660M target (92%). Cruise segment exceeding forecast (+18%) while cargo handling slightly behind (-3%).', module: 'Financial Model', modulePath: '/financial-model', timestamp: '2 hr ago', read: true, actionLabel: 'View Model', actionPath: '/financial-model?statement=IS&line=revenue' },
  { id: 'n6', type: 'status', priority: 'low', title: 'Digital-Twin Sync Cycle Complete', description: 'Hourly synchronization between physical port operations and digital twin completed successfully. Deviation: 0.8% (within 3% acceptable threshold). Next sync: 15:00 UTC.', module: 'Digital-Twin Port', modulePath: '/modules/digital-twin', timestamp: '2 hr ago', read: true },
  { id: 'n7', type: 'alert', priority: 'high', title: 'Trade Route Disruption — Red Sea', description: 'Trade-Flow Oracle detected vessel diversions on Shanghai-Rotterdam corridor via Cape of Good Hope. Estimated cost impact: +$400/TEU. 3 vessels affected. Auto-rerouting recommendations generated.', module: 'Trade-Flow Oracle', modulePath: '/modules/trade-flow-oracle', timestamp: '3 hr ago', read: true, actionLabel: 'View Routes', actionPath: '/solutions/trade-flow-oracle' },
  { id: 'n8', type: 'status', priority: 'low', title: 'Crane Maintenance Complete — STS-07', description: 'Stevedore-AI reports STS crane 07 back online after scheduled maintenance. Calibration test passed. Estimated throughput: 38.4 moves/hour (standard).', module: 'Stevedore-AI', modulePath: '/modules/stevedore-ai', timestamp: '4 hr ago', read: true },
  { id: 'n9', type: 'action', priority: 'medium', title: 'Cruise Schedule Optimization Available', description: 'Cruise-Turnaround AI generated a new turnaround sequence for tomorrow\'s 3-vessel day. Projected 18% improvement in passenger throughput vs current schedule.', module: 'Cruise-Turnaround', modulePath: '/modules/cruise-turnaround', timestamp: '5 hr ago', read: true, actionLabel: 'Review Schedule', actionPath: '/solutions/cruise-turnaround' },
  { id: 'n10', type: 'threshold', priority: 'low', title: 'Battery SOC Below 30% — Drone D-42', description: 'Sky-Link drone D-42 reported SOC at 28%. Battery-Health monitoring confirms normal discharge pattern. Drone returning to charging station automatically.', module: 'Sky-Link', modulePath: '/modules/sky-link', timestamp: '6 hr ago', read: true },
]

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function Inbox() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all')

  const filtered = filterType === 'all' ? notifications : notifications.filter(n => n.type === filterType)
  const unreadCount = notifications.filter(n => !n.read).length

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm relative">
              <Bell className="w-6 h-6 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-ad-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary font-serif">Inbox</h1>
              <p className="text-sm text-text-secondary">{unreadCount} unread notifications</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary border border-border rounded-lg px-3 py-1.5 transition-colors"
            >
              <Check size={12} /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <Filter size={14} className="text-text-muted" />
        {(['all', 'alert', 'threshold', 'status', 'action'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
              filterType === type ? 'bg-text-primary text-white border-text-primary' : 'border-border text-text-muted hover:border-text-muted'
            }`}
          >
            {type === 'all' ? `All (${notifications.length})` : `${type} (${notifications.filter(n => n.type === type).length})`}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.map((notification) => {
          const tc = typeConfig[notification.type]
          return (
            <div
              key={notification.id}
              onClick={() => markRead(notification.id)}
              className={`bg-ad-white rounded-xl border p-4 transition-all cursor-pointer ${
                notification.read ? 'border-border' : 'border-l-[3px] border-l-ad-red border-border shadow-sm'
              } hover:shadow-[var(--shadow-card-hover)]`}
            >
              <div className="flex gap-3">
                <div className={`w-9 h-9 rounded-lg ${tc.color} flex items-center justify-center shrink-0`}>
                  {tc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`text-sm ${notification.read ? 'text-text-secondary' : 'font-semibold text-text-primary'}`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${priorityBadge[notification.priority]}`}>
                        {notification.priority}
                      </span>
                      <span className="text-[11px] text-text-muted flex items-center gap-1">
                        <Clock size={10} /> {notification.timestamp}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed mb-2">{notification.description}</p>
                  <div className="flex items-center justify-between">
                    <Link
                      to={notification.modulePath}
                      className="text-[11px] text-ad-red hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {notification.module}
                    </Link>
                    {notification.actionLabel && notification.actionPath && (
                      <Link
                        to={notification.actionPath}
                        className="flex items-center gap-1 text-[11px] text-text-muted hover:text-text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {notification.actionLabel} <ExternalLink size={10} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <Bell size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No notifications in this category.</p>
        </div>
      )}
    </div>
  )
}
