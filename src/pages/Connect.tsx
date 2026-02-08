import { useState } from 'react'
import {
  MessageSquare,
  Hash,
  Send,
  Paperclip,
  AtSign,
  Bell,
  Search,
  Pin,
  Users,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

interface Channel {
  id: string
  name: string
  description: string
  unread: number
  pinned?: boolean
  memberCount: number
}

interface Message {
  id: string
  channelId: string
  user: string
  initials: string
  role: string
  timestamp: string
  text: string
  tags?: string[]
  reference?: { type: 'risk' | 'report' | 'analysis'; label: string }
}

// ─────────────────────────────────────────────────────────
// Mock Data — AD Ports Context
// ─────────────────────────────────────────────────────────

const channels: Channel[] = [
  { id: 'financial', name: 'financial-analysis', description: 'Revenue, EBITDA, and margin discussions', unread: 3, pinned: true, memberCount: 24 },
  { id: 'operational', name: 'operational-review', description: 'Port throughput, fleet utilization, and berth ops', unread: 1, pinned: true, memberCount: 38 },
  { id: 'market', name: 'market-intelligence', description: 'Trade corridor trends and competitive positioning', unread: 5, memberCount: 18 },
  { id: 'strategic', name: 'strategic-planning', description: 'Value creation, CAPEX pipeline, and M&A', unread: 0, memberCount: 12 },
  { id: 'risk', name: 'risk-alerts', description: 'Risk registry updates and incident notifications', unread: 2, pinned: true, memberCount: 31 },
  { id: 'general', name: 'general', description: 'Team-wide announcements and discussions', unread: 0, memberCount: 52 },
]

const messagesByChannel: Record<string, Message[]> = {
  financial: [
    {
      id: 'f1', channelId: 'financial', user: 'Sarah Al-Hashimi', initials: 'SA', role: 'CFO',
      timestamp: '10:42 AM', text: 'Q4 EBITDA margin came in at 44.2%, 120bps above consensus. The cost optimization program at KIZAD drove most of the outperformance. Full bridge analysis attached.',
      tags: ['ebitda', 'q4-results'],
      reference: { type: 'report', label: 'EBITDA Bridge Report' },
    },
    {
      id: 'f2', channelId: 'financial', user: 'James Chen', initials: 'JC', role: 'FP&A Director',
      timestamp: '10:58 AM', text: 'Confirmed — labor cost per TEU declined 8% YoY. The StevedoreAI deployment at Terminal 4 contributed ~60% of the savings. Updating the Cost Structure template with actuals.',
      tags: ['cost-optimization'],
      reference: { type: 'report', label: 'Cost Structure Breakdown' },
    },
    {
      id: 'f3', channelId: 'financial', user: 'Amina Khalil', initials: 'AK', role: 'Treasury Manager',
      timestamp: '11:15 AM', text: 'Fuel hedging program update: locked in 65% of H1 2026 bunker fuel at $540/MT. Current spot is $612/MT. Estimated savings of 42M AED vs unhedged.',
      tags: ['hedging', 'fuel'],
      reference: { type: 'risk', label: 'R-001: Bunker Fuel Volatility' },
    },
  ],
  operational: [
    {
      id: 'o1', channelId: 'operational', user: 'Mohammed Rashid', initials: 'MR', role: 'Port Director',
      timestamp: '09:15 AM', text: 'Khalifa Port throughput hit 1.42M TEU in January — new monthly record. Berth productivity averaging 34 moves/hr after StevedoreAI optimization. Turnaround time down to 16.8 hours.',
      tags: ['throughput', 'record'],
      reference: { type: 'report', label: 'Port Throughput Report' },
    },
    {
      id: 'o2', channelId: 'operational', user: 'Elena Popov', initials: 'EP', role: 'Fleet Manager',
      timestamp: '09:48 AM', text: 'Three vessels repositioning from Fujairah to Mombasa for the new East Africa feeder service. ETA 12 Feb. LoadMaster AI has cleared all stability calculations for the ballast voyage.',
      tags: ['fleet', 'repositioning'],
    },
  ],
  market: [
    {
      id: 'm1', channelId: 'market', user: 'David Park', initials: 'DP', role: 'Market Analyst',
      timestamp: '08:30 AM', text: 'Asia-GCC container volumes up 14% YoY in January, driven by Lunar New Year front-loading and Red Sea rerouting. Spot rates on FAR EAST-AG route at $1,840/TEU (+22% YoY).',
      tags: ['asia-gcc', 'volumes'],
      reference: { type: 'report', label: 'Trade Corridor Analysis' },
    },
    {
      id: 'm2', channelId: 'market', user: 'Fatima Al-Zaabi', initials: 'FA', role: 'Strategy Analyst',
      timestamp: '09:02 AM', text: 'Drewry released updated global port rankings. AD Ports moved to #11 globally (from #13). Jebel Ali still #9 but losing share to Khalifa in the GCC transshipment market.',
      tags: ['rankings', 'competitive'],
      reference: { type: 'report', label: 'Competitive Positioning' },
    },
    {
      id: 'm3', channelId: 'market', user: 'David Park', initials: 'DP', role: 'Market Analyst',
      timestamp: '09:18 AM', text: 'Interesting data point: India-GCC corridor growing at 2x the Asia-GCC rate. The Mundra JV is capturing significant share. Trade-Flow Oracle is now covering 12 Indian feeder ports.',
      tags: ['india', 'growth'],
    },
    {
      id: 'm4', channelId: 'market', user: 'Raj Gupta', initials: 'RG', role: 'Business Development',
      timestamp: '10:05 AM', text: 'MSC confirmed commitment to increase Khalifa Port calls to 3x/week from 2x. This alone adds ~180K TEU annually. Need to flag to operations for berth planning.',
      tags: ['msc', 'capacity'],
    },
    {
      id: 'm5', channelId: 'market', user: 'Fatima Al-Zaabi', initials: 'FA', role: 'Strategy Analyst',
      timestamp: '10:22 AM', text: 'CMA CGM exploring Fujairah as alternative bunkering hub due to Red Sea disruptions. If confirmed, this could be a 200M AED revenue opportunity for our bunkering JV.',
      tags: ['bunkering', 'opportunity'],
      reference: { type: 'risk', label: 'R-004: Red Sea Disruption' },
    },
  ],
  strategic: [
    {
      id: 's1', channelId: 'strategic', user: 'Ahmed Al-Mazrouei', initials: 'AA', role: 'Group CEO',
      timestamp: 'Yesterday', text: 'Board pre-read for February meeting has been uploaded to the document portal. Key agenda items: CAPEX approval for Phase 2 expansion, Africa strategy update, and ESG reporting framework.',
      tags: ['board', 'agenda'],
    },
    {
      id: 's2', channelId: 'strategic', user: 'Sarah Al-Hashimi', initials: 'SA', role: 'CFO',
      timestamp: 'Yesterday', text: 'CAPEX Committee has approved the 3.3B AED budget for 2026. Breakdown: 1.2B maintenance, 1.5B expansion (Khalifa Phase 2), 0.6B digital. Full timeline in the CAPEX Planning template.',
      tags: ['capex', 'approved'],
      reference: { type: 'report', label: 'CAPEX Planning Report' },
    },
  ],
  risk: [
    {
      id: 'r1', channelId: 'risk', user: 'System Alert', initials: '⚠️', role: 'Risk Engine',
      timestamp: '08:00 AM', text: 'ALERT: Bunker fuel index (VLSFO Singapore) breached $620/MT threshold. Current: $628/MT (+3.2% WoW). Hedging program covers 65% — unhedged exposure now at 63M AED for Q2.',
      tags: ['alert', 'fuel'],
      reference: { type: 'risk', label: 'R-001: Bunker Fuel Volatility' },
    },
    {
      id: 'r2', channelId: 'risk', user: 'Khalid Nasser', initials: 'KN', role: 'CISO',
      timestamp: '11:30 AM', text: 'Monthly cyber report: Zero incidents across all terminals. OT SOC detected 142 anomalies (all false positives). Red team exercise scheduled for March at Khalifa Port Terminal 2.',
      tags: ['cyber', 'report'],
      reference: { type: 'risk', label: 'R-005: Cybersecurity' },
    },
  ],
  general: [
    {
      id: 'g1', channelId: 'general', user: 'HR Team', initials: 'HR', role: 'Human Resources',
      timestamp: 'Yesterday', text: 'Welcome to the Maritime AI Suite Connect Hub! This platform integrates with all analytical modules. You can reference reports, risk items, and analysis from any channel using @mentions.',
      tags: ['welcome'],
    },
  ],
}

// ─────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────

export default function Connect() {
  const [activeChannel, setActiveChannel] = useState('financial')
  const [searchQuery, setSearchQuery] = useState('')

  const active = channels.find(c => c.id === activeChannel)!
  const messages = messagesByChannel[activeChannel] || []

  const filteredChannels = searchQuery
    ? channels.filter(c => c.name.includes(searchQuery.toLowerCase()))
    : channels

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
            <MessageSquare size={22} className="text-info" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary font-serif">Connect Hub</h1>
            <p className="text-xs text-text-muted">Domain-Organized Collaboration — Cross-Module Context Linking</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          Slack-style collaboration channels organized by analytical domain. Messages reference risk items, report templates, and analysis results for cross-module context.
        </p>
      </div>

      {/* Chat Layout */}
      <div className="bg-ad-white rounded-xl border border-border overflow-hidden" style={{ height: 'calc(100vh - 280px)', minHeight: 480 }}>
        <div className="flex h-full">
          {/* Channel List */}
          <div className="w-64 border-r border-border flex flex-col shrink-0">
            {/* Channel Search */}
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search channels..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-border rounded-lg bg-surface focus:outline-none focus:ring-1 focus:ring-ad-red/30 text-text-primary placeholder:text-text-muted"
                />
              </div>
            </div>

            {/* Pinned Channels */}
            <div className="flex-1 overflow-y-auto py-2">
              {filteredChannels.some(c => c.pinned) && (
                <div className="px-3 mb-1">
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
                    <Pin size={10} /> Pinned
                  </p>
                </div>
              )}
              {filteredChannels.filter(c => c.pinned).map(channel => (
                <ChannelItem key={channel.id} channel={channel} isActive={activeChannel === channel.id} onClick={() => setActiveChannel(channel.id)} />
              ))}

              {filteredChannels.some(c => !c.pinned) && (
                <div className="px-3 mt-3 mb-1">
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Channels</p>
                </div>
              )}
              {filteredChannels.filter(c => !c.pinned).map(channel => (
                <ChannelItem key={channel.id} channel={channel} isActive={activeChannel === channel.id} onClick={() => setActiveChannel(channel.id)} />
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Channel Header */}
            <div className="px-5 py-3 border-b border-border flex items-center gap-3">
              <Hash size={18} className="text-text-muted shrink-0" />
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-text-primary">{active.name}</h2>
                <p className="text-[11px] text-text-muted truncate">{active.description}</p>
              </div>
              <div className="ml-auto flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <Users size={14} />
                  <span>{active.memberCount}</span>
                </div>
                <button className="p-1.5 rounded-md hover:bg-surface-secondary transition-colors">
                  <Bell size={14} className="text-text-muted" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-text-muted text-sm">
                  No messages yet in #{active.name}
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="px-5 py-3 border-t border-border">
              <div className="flex items-center gap-2 bg-surface rounded-xl border border-border px-4 py-3">
                <button className="p-1 rounded hover:bg-surface-secondary transition-colors">
                  <Paperclip size={16} className="text-text-muted" />
                </button>
                <button className="p-1 rounded hover:bg-surface-secondary transition-colors">
                  <AtSign size={16} className="text-text-muted" />
                </button>
                <input
                  type="text"
                  placeholder={`Message #${active.name}...`}
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                  disabled
                />
                <button className="p-2 rounded-lg bg-ad-red text-white hover:bg-ad-red-dark transition-colors">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Sub-Components
// ─────────────────────────────────────────────────────────

function ChannelItem({ channel, isActive, onClick }: { channel: Channel; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
        isActive
          ? 'bg-surface-secondary text-text-primary'
          : 'text-text-secondary hover:bg-surface-secondary/50 hover:text-text-primary'
      }`}
    >
      <Hash size={14} className="text-text-muted shrink-0" />
      <span className={`text-xs truncate flex-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>{channel.name}</span>
      {channel.unread > 0 && (
        <span className="bg-ad-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shrink-0">
          {channel.unread}
        </span>
      )}
    </button>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isSystemAlert = message.initials === '⚠️'

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
        isSystemAlert ? 'bg-warning/20 text-warning' : 'bg-ad-red/10 text-ad-red'
      }`}>
        {message.initials}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-semibold text-text-primary">{message.user}</span>
          <span className="text-[10px] text-text-muted">{message.role}</span>
          <span className="text-[10px] text-text-muted ml-auto shrink-0">{message.timestamp}</span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">{message.text}</p>

        {/* Tags */}
        {message.tags && message.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.tags.map(tag => (
              <span key={tag} className="text-[10px] font-medium text-text-muted bg-surface-secondary px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Cross-module reference */}
        {message.reference && (
          <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-medium text-ad-red bg-ad-red/5 px-2.5 py-1 rounded-md cursor-pointer hover:bg-ad-red/10 transition-colors">
            {message.reference.type === 'risk' && '🛡️'}
            {message.reference.type === 'report' && '📊'}
            {message.reference.type === 'analysis' && '🔍'}
            <span>{message.reference.label}</span>
          </div>
        )}
      </div>
    </div>
  )
}
