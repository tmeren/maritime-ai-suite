import { useNavigate } from 'react-router-dom'
import {
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
  Anchor,
  ArrowRight,
} from 'lucide-react'
import type { ReactNode } from 'react'

interface Solution {
  label: string
  path: string
  icon: ReactNode
  gradient: string
  bullets: [string, string, string]
}

const solutions: Solution[] = [
  {
    label: 'CarbonWise',
    path: '/solutions/carbon-wise',
    icon: <Leaf size={28} />,
    gradient: 'from-emerald-500 to-green-600',
    bullets: [
      'IMO CII rating simulation and voyage-level carbon accounting',
      'EU ETS allowance tracking with cost-per-tonne forecasting',
      'Decarbonisation pathway modelling across fleet and routes',
    ],
  },
  {
    label: 'LoadMaster',
    path: '/solutions/load-master',
    icon: <Ship size={28} />,
    gradient: 'from-blue-500 to-indigo-600',
    bullets: [
      'AI-optimised container stowage plans for max vessel utilisation',
      'Real-time weight distribution and stability compliance checks',
      'Port-sequence aware load planning reducing re-handling by 35%',
    ],
  },
  {
    label: 'LithiumSentinel',
    path: '/solutions/lithium-sentinel',
    icon: <Battery size={28} />,
    gradient: 'from-red-500 to-amber-500',
    bullets: [
      'Thermal runaway risk scoring for EV battery shipments in port',
      'IoT sensor fusion: temperature, gas, voltage anomaly detection',
      'Automated emergency protocols and fire suppression zone mapping',
    ],
  },
  {
    label: 'VinChain',
    path: '/solutions/vin-chain',
    icon: <Link2 size={28} />,
    gradient: 'from-violet-500 to-purple-600',
    bullets: [
      'End-to-end vehicle traceability from factory gate to dealer lot',
      'Digital passport with CO\u2082 footprint per vehicle journey leg',
      'QR-based customs pre-clearance cutting dwell time by 40%',
    ],
  },
  {
    label: 'TradeFlow Oracle',
    path: '/solutions/trade-flow-oracle',
    icon: <TrendingUp size={28} />,
    gradient: 'from-blue-500 to-cyan-500',
    bullets: [
      'Global trade lane demand forecasting with 92% accuracy',
      'Commodity price correlation and route profitability analysis',
      'Sanctions and compliance screening integrated into booking flow',
    ],
  },
  {
    label: 'SlotBid',
    path: '/solutions/slot-bid',
    icon: <Gavel size={28} />,
    gradient: 'from-amber-500 to-orange-600',
    bullets: [
      'Dynamic berth auction system maximising port revenue per metre',
      'Priority bidding for time-sensitive cargo with SLA guarantees',
      'Demand-supply matching reducing vessel wait time by 28%',
    ],
  },
  {
    label: 'BatteryHealth',
    path: '/solutions/battery-health',
    icon: <BatteryCharging size={28} />,
    gradient: 'from-emerald-500 to-green-600',
    bullets: [
      'State-of-health estimation for EV batteries during transport',
      'Predictive degradation modelling across temperature and shock events',
      'Insurance-grade risk reports for battery cargo underwriting',
    ],
  },
  {
    label: 'StevedoreAI',
    path: '/solutions/stevedore-ai',
    icon: <Cpu size={28} />,
    gradient: 'from-slate-600 to-gray-800',
    bullets: [
      'Crane-to-truck orchestration with real-time gang optimisation',
      'Fatigue and safety monitoring via computer vision on quayside',
      'Shift planning AI reducing overtime costs by 22%',
    ],
  },
  {
    label: 'PortFOTA',
    path: '/solutions/port-fota',
    icon: <Radio size={28} />,
    gradient: 'from-sky-500 to-blue-600',
    bullets: [
      'Fleet-wide OTA firmware updates for port equipment and vehicles',
      'Staged rollout with automatic rollback on anomaly detection',
      'Compliance dashboard for firmware version across 3,000+ assets',
    ],
  },
  {
    label: 'SkyLink',
    path: '/solutions/sky-link',
    icon: <Plane size={28} />,
    gradient: 'from-cyan-500 to-teal-600',
    bullets: [
      'Autonomous drone delivery for last-mile port logistics',
      'Real-time airspace deconfliction with manned traffic integration',
      'Battery-swap stations enabling 24/7 drone operations',
    ],
  },
]

export default function Solutions() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-ad-red flex items-center justify-center">
            <Anchor size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Port AI Solutions</h1>
            <p className="text-sm text-text-secondary">10 AI-powered modules transforming AD Ports Group maritime operations</p>
          </div>
        </div>
      </div>

      {/* Solution Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {solutions.map((s) => (
          <button
            key={s.path}
            onClick={() => navigate(s.path)}
            className="group text-left bg-card border border-card-border rounded-xl p-5 hover:shadow-lg hover:border-ad-red/30 transition-all duration-200"
          >
            {/* Icon + Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm`}>
                <span className="text-white">{s.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-text-primary group-hover:text-ad-red transition-colors">
                  {s.label}
                </h3>
              </div>
              <ArrowRight size={16} className="text-text-tertiary group-hover:text-ad-red group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>

            {/* Bullets */}
            <ul className="space-y-2">
              {s.bullets.map((b, i) => (
                <li key={i} className="flex gap-2 text-[13px] text-text-secondary leading-snug">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ad-red/40 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  )
}
