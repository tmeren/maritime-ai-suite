import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Globe, MessageSquare, BarChart3, Ship, MapPin, TrendingUp, Clock, DollarSign, AlertTriangle, Send, Bot, Sparkles, ExternalLink, Anchor, Package, ChevronRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type TabId = 'trade-map' | 'ai-advisor' | 'route-analysis';
type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface TradeRoute {
  id: string;
  origin: { name: string; country: string; x: number; y: number };
  destination: { name: string; country: string; x: number; y: number };
  cargo: string;
  cargoType: 'container' | 'bulk' | 'tanker' | 'roro';
  transitDays: number;
  costPerTeu: number;
  distanceNm: number;
  riskLevel: RiskLevel;
  co2PerTeu: number;
  via?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─────────────────────────────────────────────────────────────
// Demo Data — 8 Global Trade Routes
// ─────────────────────────────────────────────────────────────

const tradeRoutes: TradeRoute[] = [
  {
    id: 'rt-1',
    origin: { name: 'Shanghai', country: 'China', x: 648, y: 168 },
    destination: { name: 'Rotterdam', country: 'Netherlands', x: 278, y: 112 },
    cargo: '20ft Container Mix',
    cargoType: 'container',
    transitDays: 28,
    costPerTeu: 2450,
    distanceNm: 10560,
    riskLevel: 'LOW',
    co2PerTeu: 0.82,
    via: 'Suez Canal',
  },
  {
    id: 'rt-2',
    origin: { name: 'Singapore', country: 'Singapore', x: 608, y: 228 },
    destination: { name: 'Hamburg', country: 'Germany', x: 288, y: 106 },
    cargo: 'Chemical Tanker',
    cargoType: 'tanker',
    transitDays: 24,
    costPerTeu: 3100,
    distanceNm: 8920,
    riskLevel: 'MEDIUM',
    co2PerTeu: 0.95,
    via: 'Suez Canal',
  },
  {
    id: 'rt-3',
    origin: { name: 'Busan', country: 'South Korea', x: 668, y: 152 },
    destination: { name: 'Long Beach', country: 'United States', x: 98, y: 158 },
    cargo: 'Electronics & Auto Parts',
    cargoType: 'container',
    transitDays: 14,
    costPerTeu: 1850,
    distanceNm: 5560,
    riskLevel: 'LOW',
    co2PerTeu: 0.58,
    via: 'Trans-Pacific',
  },
  {
    id: 'rt-4',
    origin: { name: 'Jebel Ali', country: 'UAE', x: 498, y: 188 },
    destination: { name: 'Rotterdam', country: 'Netherlands', x: 278, y: 112 },
    cargo: 'Crude Oil / LNG',
    cargoType: 'tanker',
    transitDays: 18,
    costPerTeu: 4200,
    distanceNm: 6340,
    riskLevel: 'HIGH',
    co2PerTeu: 1.15,
    via: 'Suez Canal',
  },
  {
    id: 'rt-5',
    origin: { name: 'Santos', country: 'Brazil', x: 215, y: 305 },
    destination: { name: 'Antwerp', country: 'Belgium', x: 274, y: 116 },
    cargo: 'Soy, Coffee, Iron Ore',
    cargoType: 'bulk',
    transitDays: 20,
    costPerTeu: 1600,
    distanceNm: 5780,
    riskLevel: 'LOW',
    co2PerTeu: 0.62,
  },
  {
    id: 'rt-6',
    origin: { name: 'Yokohama', country: 'Japan', x: 695, y: 152 },
    destination: { name: 'Vancouver', country: 'Canada', x: 105, y: 118 },
    cargo: 'Automotive RoRo',
    cargoType: 'roro',
    transitDays: 12,
    costPerTeu: 2800,
    distanceNm: 4280,
    riskLevel: 'LOW',
    co2PerTeu: 0.48,
    via: 'North Pacific',
  },
  {
    id: 'rt-7',
    origin: { name: 'Mumbai', country: 'India', x: 528, y: 198 },
    destination: { name: 'Felixstowe', country: 'United Kingdom', x: 268, y: 108 },
    cargo: 'Textiles & Garments',
    cargoType: 'container',
    transitDays: 22,
    costPerTeu: 2100,
    distanceNm: 6800,
    riskLevel: 'MEDIUM',
    co2PerTeu: 0.74,
    via: 'Suez Canal',
  },
  {
    id: 'rt-8',
    origin: { name: 'Shanghai', country: 'China', x: 648, y: 168 },
    destination: { name: 'Los Angeles', country: 'United States', x: 92, y: 162 },
    cargo: 'Mixed Consumer Goods',
    cargoType: 'container',
    transitDays: 16,
    costPerTeu: 2200,
    distanceNm: 6090,
    riskLevel: 'MEDIUM',
    co2PerTeu: 0.68,
    via: 'Trans-Pacific',
  },
];

// ─────────────────────────────────────────────────────────────
// Chat Q&A Pairs (Mock Gemini Responses)
// ─────────────────────────────────────────────────────────────

const chatResponses: Record<string, string> = {
  "What's the cheapest route from Shanghai to Europe?": "Based on current market rates, the **Shanghai → Rotterdam** route via Suez Canal offers the best value at **$2,450/TEU** with 28-day transit. This route benefits from high vessel frequency (4-5 weekly departures) and mature logistics infrastructure.\n\nAlternative via Cape of Good Hope adds ~$400/TEU but avoids Suez Canal transit fees and Red Sea risk premiums. Consider this if cargo is not time-sensitive.",
  "What are current tariff risks for US-China trade?": "Key tariff risks on the **Busan/Shanghai → US West Coast** corridor:\n\n• **Section 301 tariffs**: 25% on $250B of Chinese goods remain active\n• **De minimis threshold**: Under review — potential impact on e-commerce shipments <$800\n• **EV battery tariffs**: 100% tariff on Chinese EVs (effective 2025)\n• **Steel/Aluminum**: 25% Section 232 tariffs still in effect\n\n**Recommendation**: Route sensitive cargo through bonded warehouses in Vietnam or Malaysia for tariff mitigation. Transit adds 3-5 days but can save 15-25% in duties.",
  "Which route has the lowest carbon footprint?": "Ranking by CO₂ emissions per TEU:\n\n1. **Yokohama → Vancouver**: 0.48t CO₂/TEU (shortest trans-Pacific)\n2. **Busan → Long Beach**: 0.58t CO₂/TEU\n3. **Santos → Antwerp**: 0.62t CO₂/TEU\n4. **Shanghai → Los Angeles**: 0.68t CO₂/TEU\n\nThe Yokohama-Vancouver route benefits from shorter distance (4,280 nm) and newer vessel deployments with scrubber-fitted engines. For EU ETS compliance, all Suez Canal routes now incur carbon surcharges (~€85/TEU) under the 2024 Maritime ETS expansion.",
  "What's the transit time Shanghai to Rotterdam?": "**Shanghai → Rotterdam** transit times by service type:\n\n• **Express service**: 25 days (direct call, premium rate +$800/TEU)\n• **Standard service**: 28-30 days (1-2 transshipment stops)\n• **Economy service**: 32-35 days (multiple stops, lowest rate)\n\nCurrent average: **28 days** via Suez Canal. Note: Red Sea diversions via Cape of Good Hope add 10-14 days when active. Current Suez transit is operating normally with 12-hour canal passage.",
  "Are there compliance concerns for hazardous cargo?": "Key compliance requirements for hazardous materials in maritime trade:\n\n• **IMDG Code**: International Maritime Dangerous Goods Code mandatory for all signatory states\n• **EV batteries (UN3481)**: Class 9 dangerous goods — require SOC ≤30% for ocean transport, fireproof packaging, thermal management documentation\n• **Chemical tankers**: MARPOL Annex II compliance, cargo segregation per IBC Code\n• **Documentation**: DGD (Dangerous Goods Declaration), MSDS, emergency procedures, container packing certificate\n\n**Port-specific**: Rotterdam requires 24h pre-notification for IMDG cargo. Singapore PSA mandates electronic DG manifest submission via Portnet.",
};

const suggestedQuestions = [
  "What's the cheapest route from Shanghai to Europe?",
  "What are current tariff risks for US-China trade?",
  "Which route has the lowest carbon footprint?",
  "What's the transit time Shanghai to Rotterdam?",
  "Are there compliance concerns for hazardous cargo?",
];

// ─────────────────────────────────────────────────────────────
// Utility Components
// ─────────────────────────────────────────────────────────────

function RiskBadge({ level }: { level: RiskLevel }) {
  const colors: Record<RiskLevel, string> = {
    LOW: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    MEDIUM: 'bg-amber-100 text-amber-800 border-amber-300',
    HIGH: 'bg-red-100 text-red-800 border-red-300',
  };
  const dots: Record<RiskLevel, string> = {
    LOW: 'bg-emerald-500',
    MEDIUM: 'bg-amber-500',
    HIGH: 'bg-red-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[level]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[level]}`} />
      {level}
    </span>
  );
}

function CargoTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    container: 'bg-blue-100 text-blue-800',
    bulk: 'bg-amber-100 text-amber-800',
    tanker: 'bg-violet-100 text-violet-800',
    roro: 'bg-emerald-100 text-emerald-800',
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
      {type.toUpperCase()}
    </span>
  );
}

function StatCard({ label, value, sublabel, icon }: { label: string; value: string | number; sublabel?: string; icon?: JSX.Element }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-gray-400">{icon}</span>}
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab Content Components
// ─────────────────────────────────────────────────────────────

function TradeMapTab() {
  const [selectedRoute, setSelectedRoute] = useState<TradeRoute | null>(null);

  const cargoColors: Record<string, string> = {
    container: '#3b82f6',
    bulk: '#f59e0b',
    tanker: '#8b5cf6',
    roro: '#10b981',
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Active Routes" value={tradeRoutes.length} sublabel="global corridors" icon={<Globe className="w-3.5 h-3.5" />} />
        <StatCard label="Total Distance" value={`${(tradeRoutes.reduce((s, r) => s + r.distanceNm, 0) / 1000).toFixed(1)}k`} sublabel="nautical miles" icon={<Ship className="w-3.5 h-3.5" />} />
        <StatCard label="Avg Transit" value={`${Math.round(tradeRoutes.reduce((s, r) => s + r.transitDays, 0) / tradeRoutes.length)}d`} sublabel="days average" icon={<Clock className="w-3.5 h-3.5" />} />
        <StatCard label="Avg Cost" value={`$${Math.round(tradeRoutes.reduce((s, r) => s + r.costPerTeu, 0) / tradeRoutes.length)}`} sublabel="per TEU" icon={<DollarSign className="w-3.5 h-3.5" />} />
      </div>

      {/* SVG Trade Map */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" /> Global Trade Flow Map
          </h3>
        </div>
        <div className="p-4">
          <svg viewBox="0 0 800 400" className="w-full h-auto">
            {/* Ocean background */}
            <rect x="0" y="0" width="800" height="400" rx="8" fill="#f0f9ff" />

            {/* Simplified continents */}
            <path d="M50,80 L160,60 L180,100 L160,120 L140,180 L100,200 L70,170 L50,120 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M160,240 L210,230 L230,280 L220,340 L190,370 L160,340 L155,280 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M260,70 L310,60 L330,80 L310,120 L290,140 L260,130 L250,100 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M290,160 L340,150 L360,200 L350,280 L310,310 L280,280 L270,210 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M400,60 L550,50 L620,80 L680,120 L700,170 L650,200 L580,210 L520,190 L460,160 L420,120 L400,80 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M600,290 L670,280 L690,310 L660,340 L610,330 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />

            {/* Animated trade routes */}
            {tradeRoutes.map((route) => {
              const color = cargoColors[route.cargoType];
              const isSelected = selectedRoute?.id === route.id;
              const midX = (route.origin.x + route.destination.x) / 2;
              const midY = (route.origin.y + route.destination.y) / 2 - 40;
              const pathD = `M${route.origin.x},${route.origin.y} Q${midX},${midY} ${route.destination.x},${route.destination.y}`;

              return (
                <g key={route.id} onClick={() => setSelectedRoute(route)} className="cursor-pointer">
                  <path
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth={isSelected ? 3 : 1.5}
                    strokeDasharray="6,4"
                    opacity={isSelected ? 1 : 0.5}
                  >
                    <animate attributeName="stroke-dashoffset" values="0;-20" dur="2s" repeatCount="indefinite" />
                  </path>
                  <circle r={isSelected ? 4 : 3} fill={color}>
                    <animateMotion dur="4s" repeatCount="indefinite" path={pathD} />
                  </circle>
                </g>
              );
            })}

            {/* Port markers */}
            {(() => {
              const ports = new Map<string, { x: number; y: number; name: string }>();
              tradeRoutes.forEach((r) => {
                ports.set(r.origin.name, { ...r.origin, name: r.origin.name });
                ports.set(r.destination.name, { ...r.destination, name: r.destination.name });
              });
              return Array.from(ports.values()).map((port) => (
                <g key={port.name}>
                  <circle cx={port.x} cy={port.y} r="5" fill="#1e293b" stroke="white" strokeWidth="2" />
                  <text x={port.x} y={port.y - 10} textAnchor="middle" fontSize="8" fontWeight="600" fill="#334155">{port.name}</text>
                </g>
              ));
            })()}

            {/* Legend */}
            {[
              { label: 'Container', color: '#3b82f6', x: 30, y: 360 },
              { label: 'Bulk', color: '#f59e0b', x: 130, y: 360 },
              { label: 'Tanker', color: '#8b5cf6', x: 210, y: 360 },
              { label: 'RoRo', color: '#10b981', x: 290, y: 360 },
            ].map((item) => (
              <g key={item.label}>
                <rect x={item.x} y={item.y} width="12" height="3" fill={item.color} rx="1.5" />
                <text x={item.x + 16} y={item.y + 3} fontSize="8" fill="#64748b">{item.label}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Selected Route Details */}
      {selectedRoute && (
        <div className="bg-white rounded-xl border-2 border-gray-900 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Anchor className="w-4 h-4 text-gray-400" />
                <span className="font-bold text-gray-900">{selectedRoute.origin.name}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="font-bold text-gray-900">{selectedRoute.destination.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CargoTypeBadge type={selectedRoute.cargoType} />
              <RiskBadge level={selectedRoute.riskLevel} />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div><p className="text-xs text-gray-500">Cargo</p><p className="font-semibold">{selectedRoute.cargo}</p></div>
            <div><p className="text-xs text-gray-500">Transit</p><p className="font-semibold">{selectedRoute.transitDays} days</p></div>
            <div><p className="text-xs text-gray-500">Cost/TEU</p><p className="font-semibold">${selectedRoute.costPerTeu.toLocaleString()}</p></div>
            <div><p className="text-xs text-gray-500">Distance</p><p className="font-semibold">{selectedRoute.distanceNm.toLocaleString()} nm</p></div>
            <div><p className="text-xs text-gray-500">CO₂/TEU</p><p className="font-semibold">{selectedRoute.co2PerTeu}t</p></div>
          </div>
          {selectedRoute.via && (
            <p className="text-xs text-gray-500 mt-3">Route: via {selectedRoute.via}</p>
          )}
        </div>
      )}

      {/* Route Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tradeRoutes.map((route) => (
          <button
            key={route.id}
            onClick={() => setSelectedRoute(route)}
            className={`text-left rounded-xl border p-4 transition-colors ${
              selectedRoute?.id === route.id
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-sm">
                <span className="font-semibold">{route.origin.name}</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span className="font-semibold">{route.destination.name}</span>
              </div>
              <RiskBadge level={route.riskLevel} />
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <CargoTypeBadge type={route.cargoType} />
              <span>{route.transitDays}d</span>
              <span>${route.costPerTeu}/TEU</span>
              <span>{route.distanceNm.toLocaleString()} nm</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AiAdvisorTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm the Trade-Flow Oracle AI advisor, powered by Gemini 2.0 Flash. I can help you analyze trade routes, assess tariff risks, compare shipping costs, and evaluate compliance requirements.\n\nTry one of the suggested questions below, or type your own query." },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text?: string) => {
    const question = (text || input).trim();
    if (!question || isTyping) return;

    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');
    setIsTyping(true);

    const response =
      chatResponses[question] ||
      `I analyzed your query about "${question}". Based on current market data and trade intelligence:\n\nThis is a complex topic that involves multiple factors including route economics, regulatory frameworks, and market conditions. For a detailed analysis, I'd recommend exploring the Trade Map and Route Analysis tabs for real-time data visualization.\n\n*Note: This is a demo response. In production, Gemini 2.0 Flash would provide real-time trade intelligence.*`;

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="space-y-4">
      {/* Chat Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Bot className="w-4 h-4 text-gray-500" /> AI Trade Advisor
          </h3>
          <span className="flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-medium">
            <Sparkles className="w-3 h-3" /> Powered by Gemini 2.0 Flash
          </span>
        </div>

        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>
                    {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                      part.startsWith('**') && part.endsWith('**') ? (
                        <strong key={j}>{part.slice(2, -2)}</strong>
                      ) : (
                        part
                      ),
                    )}
                  </p>
                ))}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-gray-100 rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t px-4 py-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about trade routes, tariffs, compliance..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              onClick={() => handleSend()}
              disabled={isTyping || !input.trim()}
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-3">Suggested Questions</h4>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={isTyping}
              className="text-left rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center">
        Demo mode — responses are pre-scripted. Production version connects to Gemini 2.0 Flash for real-time trade intelligence.
      </p>
    </div>
  );
}

function RouteAnalysisTab() {
  return (
    <div className="space-y-6">
      {/* Comparison Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-500" /> Route Comparison Matrix
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Route</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Transit</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Cost/TEU</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Distance</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">CO₂/TEU</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tradeRoutes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {route.origin.name} → {route.destination.name}
                    </div>
                    <div className="text-xs text-gray-500">{route.cargo}</div>
                  </td>
                  <td className="px-4 py-3">
                    <CargoTypeBadge type={route.cargoType} />
                  </td>
                  <td className="px-4 py-3 font-semibold">{route.transitDays}d</td>
                  <td className="px-4 py-3 font-semibold">${route.costPerTeu.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600">{route.distanceNm.toLocaleString()} nm</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        route.co2PerTeu < 0.6
                          ? 'text-emerald-600 font-semibold'
                          : route.co2PerTeu > 1.0
                            ? 'text-red-600 font-semibold'
                            : ''
                      }
                    >
                      {route.co2PerTeu}t
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge level={route.riskLevel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" /> AI-Generated Insights
          </h3>
          <span className="text-xs text-gray-400">Powered by Gemini 2.0 Flash</span>
        </div>
        <div className="space-y-3">
          {[
            {
              icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
              title: 'Cost Optimization',
              insight:
                'The Busan → Long Beach route offers the best cost-efficiency at $1,850/TEU with only 14-day transit. Consider consolidating Asia-Americas shipments through Busan for 15-25% savings vs Shanghai origination.',
            },
            {
              icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
              title: 'Risk Alert',
              insight:
                'Jebel Ali → Rotterdam route carries HIGH risk due to Strait of Hormuz transit and current geopolitical tensions. Insurance premiums have increased 18% YoY. Alternative: Route via Salalah (Oman) for reduced risk corridor.',
            },
            {
              icon: <Package className="w-4 h-4 text-blue-500" />,
              title: 'Carbon Compliance',
              insight:
                'EU ETS maritime expansion (2024) impacts all EU-touching routes. Yokohama → Vancouver (0.48t CO₂/TEU) and Busan → Long Beach (0.58t CO₂/TEU) offer lowest carbon footprints. Consider carbon offset programs for Suez routes averaging 0.85t/TEU.',
            },
            {
              icon: <Globe className="w-4 h-4 text-violet-500" />,
              title: 'Market Trend',
              insight:
                'Trans-Pacific container rates have stabilized at $1,850-2,200/TEU after 2025 peak. Asia-Europe via Suez remains 15-30% more expensive. Santos-Antwerp agricultural route shows strongest volume growth (+12% YoY) driven by EU soy demand.',
            },
          ].map((item, idx) => (
            <div key={idx} className="rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <h4 className="font-semibold text-sm">{item.title}</h4>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{item.insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h4 className="font-semibold text-sm mb-3">Analysis Methodology</h4>
        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <span className="rounded bg-blue-100 text-blue-700 px-2.5 py-1 font-medium">Market Data Ingestion</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-violet-100 text-violet-700 px-2.5 py-1 font-medium">Gemini 2.0 Flash Analysis</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-emerald-100 text-emerald-700 px-2.5 py-1 font-medium">Risk Scoring</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-amber-100 text-amber-700 px-2.5 py-1 font-medium">Route Optimization</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-gray-800 text-white px-2.5 py-1 font-medium">Insight Generation</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function TradeFlowOracle() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('trade-map');

  const tabs: { id: TabId; label: string; icon: JSX.Element }[] = [
    { id: 'trade-map', label: 'Trade Map', icon: <Globe className="w-4 h-4" /> },
    { id: 'ai-advisor', label: 'AI Advisor', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'route-analysis', label: 'Route Analysis', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                <Ship className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Trade-Flow Oracle</h1>
                <p className="text-xs text-gray-500">AI-Powered Global Trade Route Intelligence</p>
              </div>
            </div>
            <a
              href="https://github.com/tmeren"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'trade-map' && <TradeMapTab />}
        {activeTab === 'ai-advisor' && <AiAdvisorTab />}
        {activeTab === 'route-analysis' && <RouteAnalysisTab />}
      </main>

      {/* Tech Stack Footer */}
      <div className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="font-medium text-gray-700">Tech Stack:</span>
            {['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'Lucide Icons', 'SVG Animations'].map((tech) => (
              <span key={tech} className="rounded-full bg-gray-100 px-2.5 py-0.5">
                {tech}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2">
            <span className="font-medium text-gray-700">Concepts:</span>
            {['Trade Route Optimization', 'AI Trade Advisor', 'Carbon Footprint Analysis', 'Tariff Risk Assessment', 'Maritime Logistics'].map(
              (concept) => (
                <span key={concept} className="rounded-full bg-gray-100 px-2.5 py-0.5">
                  {concept}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
