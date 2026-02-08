import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'bot'
  text: string
}

const contextGreetings: Record<string, string> = {
  '/': 'Welcome to Maritime AI Suite. I can help you navigate executive KPIs, financial reports, and port AI solutions.',
  '/financial': 'I can help you with financial statement analysis, IS/BS/CF drill-through, and revenue metrics.',
  '/operations': 'I can assist with operational KPIs, throughput analysis, and efficiency metrics.',
  '/market': 'I can help with market intelligence, trade corridor analysis, and competitive positioning.',
  '/strategic': 'I can assist with strategic planning, value creation roadmaps, and CAPEX analysis.',
  '/risk': 'I can help with risk assessments, heat map analysis, and mitigation tracking.',
  '/connect': 'I can help you navigate collaboration channels and domain-organized discussions.',
  '/analyse': 'I can assist with report generation, DD-grade templates, and analytical workflows.',
  '/learning': 'I can guide you through learning paths and capability development programs.',
  '/faq': 'I can help answer questions about KPI definitions, methodologies, and platform guidance.',
  '/glossary': 'I can help you look up DD field definitions and IS/BS/CF mappings.',
  '/trainings': 'I can guide you through training programs and achievement tracking.',
}

const solutionNames: Record<string, string> = {
  'carbon-wise': 'CarbonWise',
  'load-master': 'LoadMaster AI',
  'lithium-sentinel': 'LithiumSentinel',
  'vin-chain': 'VinChain Traceability',
  'trade-flow-oracle': 'TradeFlow Oracle',
  'slot-bid': 'SlotBid AI',
  'battery-health': 'Battery-Logistics Health Guard',
  'stevedore-ai': 'StevedoreAI Orchestrator',
  'port-fota': 'Port-FOTA Hub',
  'sky-link': 'SkyLink Logistics',
}

const contextSuggestions: Record<string, string[]> = {
  '/': [
    'Show me the top financial KPIs for this quarter.',
    'Which port AI solutions are available?',
    'How do I navigate between DD report domains?',
  ],
  '/financial': [
    'Explain the difference between IS, BS, and CF metrics.',
    'What revenue growth drivers are tracked?',
    'How do I drill through from revenue to cash flow?',
  ],
  '/operations': [
    'What are the key operational throughput metrics?',
    'How is vessel turnaround time calculated?',
    'Show me efficiency benchmarks.',
  ],
  '/risk': [
    'How do I read the risk heat map?',
    'What are the top 5 risks by severity?',
    'How are risk mitigation plans tracked?',
  ],
}

function getGreeting(pathname: string): string {
  if (contextGreetings[pathname]) return contextGreetings[pathname]
  const solutionMatch = pathname.match(/^\/solutions\/(.+)$/)
  if (solutionMatch) {
    const name = solutionNames[solutionMatch[1]] || solutionMatch[1]
    return `I can explain how ${name} works and help you understand its key metrics and capabilities.`
  }
  return 'How can I help you today?'
}

function getSuggestions(pathname: string): string[] {
  if (contextSuggestions[pathname]) return contextSuggestions[pathname]
  if (pathname.startsWith('/solutions/')) {
    return [
      'What are the key metrics for this solution?',
      'How does this integrate with the DD framework?',
      'Show me the data flow architecture.',
    ]
  }
  return [
    'Tell me about the available modules.',
    'How do I generate a DD report?',
    'What AI solutions are integrated?',
  ]
}

function getMockResponse(userMessage: string, pathname: string): string {
  const lower = userMessage.toLowerCase()
  if (lower.includes('kpi') || lower.includes('metric'))
    return 'The Maritime AI Suite tracks 24 executive KPIs across 4 domains: Financial (IS/BS/CF), Operational, Market, and Strategic. Each metric maps to a specific financial statement for DD-grade traceability.'
  if (lower.includes('solution') || lower.includes('ai'))
    return 'There are 10 Port AI Solutions available: CarbonWise, LoadMaster, LithiumSentinel, VinChain, TradeFlow Oracle, SlotBid, BatteryHealth, StevedoreAI, PortFOTA, and SkyLink. Each addresses a specific operational domain.'
  if (lower.includes('report') || lower.includes('dd'))
    return 'The Analyse module provides 24 DD-grade report templates. Reports pull from real-time KPI data and can be exported in PDF format with IS/BS/CF audit trails.'
  if (lower.includes('financial') || lower.includes('revenue'))
    return 'Financial metrics are organized by statement type: Income Statement (blue), Balance Sheet (green), and Cash Flow (amber). Each KPI card shows the statement badge for instant traceability.'
  if (pathname.startsWith('/solutions/'))
    return 'This solution provides real-time analytics and AI-powered insights for its specific domain. Use the interactive controls to explore different scenarios and view detailed metric breakdowns.'
  return 'I can help you explore the Maritime AI Suite platform. Try asking about specific KPIs, AI solutions, report templates, or navigation guidance.'
}

interface ChatPanelProps {
  isOpen: boolean
  onToggle: () => void
}

export function ChatPanel({ isOpen, onToggle }: ChatPanelProps) {
  const location = useLocation()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [lastPath, setLastPath] = useState(location.pathname)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (location.pathname !== lastPath) {
      setLastPath(location.pathname)
      const greeting = getGreeting(location.pathname)
      setMessages([{ id: `greeting-${Date.now()}`, role: 'bot', text: greeting }])
    }
  }, [location.pathname, lastPath])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = getGreeting(location.pathname)
      setMessages([{ id: `greeting-${Date.now()}`, role: 'bot', text: greeting }])
    }
  }, [isOpen, messages.length, location.pathname])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: Message = { id: `user-${Date.now()}`, role: 'user', text: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTimeout(() => {
      const response = getMockResponse(userMsg.text, location.pathname)
      setMessages(prev => [...prev, { id: `bot-${Date.now()}`, role: 'bot', text: response }])
    }, 600)
  }

  const suggestions = getSuggestions(location.pathname)

  return (
    <>
      {/* Toggle button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-ad-red text-white shadow-lg hover:bg-ad-red-dark transition-all duration-300 flex items-center justify-center hover:scale-110"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[380px] bg-sidebar-bg z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ad-red flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-sidebar-text-active">AI Assistant</div>
              <div className="text-[10px] text-sidebar-text">Maritime AI Suite</div>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-sidebar-hover text-sidebar-text hover:text-sidebar-text-active transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'bot' ? 'bg-ad-red/20' : 'bg-sidebar-active'
              }`}>
                {msg.role === 'bot' ? (
                  <Bot size={14} className="text-ad-red" />
                ) : (
                  <User size={14} className="text-sidebar-text-active" />
                )}
              </div>
              <div className={`max-w-[280px] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed ${
                msg.role === 'bot'
                  ? 'bg-sidebar-hover text-sidebar-text-active rounded-tl-sm'
                  : 'bg-ad-red text-white rounded-tr-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 space-y-1.5">
            <div className="text-[10px] text-sidebar-text uppercase tracking-wider font-medium">Suggestions</div>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(s)
                  setTimeout(() => {
                    const userMsg: Message = { id: `user-${Date.now()}`, role: 'user', text: s }
                    setMessages(prev => [...prev, userMsg])
                    setInput('')
                    setTimeout(() => {
                      const response = getMockResponse(s, location.pathname)
                      setMessages(prev => [...prev, { id: `bot-${Date.now()}`, role: 'bot', text: response }])
                    }, 600)
                  }, 50)
                }}
                className="w-full text-left px-3 py-2 rounded-lg bg-sidebar-hover/50 text-[12px] text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-sidebar-border shrink-0">
          <div className="flex items-center gap-2 bg-sidebar-hover rounded-xl px-3 py-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 bg-transparent text-sm text-sidebar-text-active placeholder:text-sidebar-text/50 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-lg bg-ad-red text-white flex items-center justify-center hover:bg-ad-red-dark transition-colors disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
