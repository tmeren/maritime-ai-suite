import { useState, useMemo, useCallback } from 'react'
import {
  Trophy,
  Zap,
  Flame,
  Star,
  Target,
  Award,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Crown,
  Users,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type QuizDomain = 'financial' | 'operational' | 'market' | 'platform' | 'strategic'

interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
}

interface QuizModule {
  id: string
  title: string
  domain: QuizDomain
  emoji: string
  questions: QuizQuestion[]
}

interface QuizResult {
  score: number
  total: number
  answers: (number | null)[]
}

interface Badge {
  id: string
  emoji: string
  name: string
  description: string
  earned: boolean
}

interface LeaderboardEntry {
  rank: number
  name: string
  xp: number
  level: string
  badges: number
  isCurrentUser: boolean
}

type ViewMode = 'quiz' | 'leaderboard'

// ─────────────────────────────────────────────────────────
// Domain Config
// ─────────────────────────────────────────────────────────

const domainConfig: Record<QuizDomain, { label: string; color: string; bg: string; bgLight: string }> = {
  financial: { label: 'Financial', color: 'text-fs-income', bg: 'bg-fs-income', bgLight: 'bg-fs-income/10' },
  operational: { label: 'Operational', color: 'text-info', bg: 'bg-info', bgLight: 'bg-info/10' },
  market: { label: 'Market', color: 'text-success', bg: 'bg-success', bgLight: 'bg-success/10' },
  platform: { label: 'Platform', color: 'text-warning', bg: 'bg-warning', bgLight: 'bg-warning/10' },
  strategic: { label: 'Strategic', color: 'text-ad-red', bg: 'bg-ad-red', bgLight: 'bg-ad-red/10' },
}

// ─────────────────────────────────────────────────────────
// Quiz Data — 8 Modules × 5 Questions
// ─────────────────────────────────────────────────────────

const quizModules: QuizModule[] = [
  {
    id: 'fin-fundamentals',
    title: 'Financial Statement Fundamentals',
    domain: 'financial',
    emoji: '📊',
    questions: [
      {
        question: 'Which financial statement shows EBITDA?',
        options: ['Balance Sheet', 'Income Statement', 'Cash Flow Statement', 'None of the above'],
        correctIndex: 1,
      },
      {
        question: 'Working Capital appears on which statement?',
        options: ['Income Statement', 'Balance Sheet', 'Cash Flow Statement', 'All three'],
        correctIndex: 1,
      },
      {
        question: 'CAPEX is reported on which statement?',
        options: ['Income Statement', 'Balance Sheet', 'Cash Flow Statement', 'Income Statement and Cash Flow'],
        correctIndex: 2,
      },
      {
        question: 'Revenue recognition for port services follows which principle?',
        options: ['Cash basis', 'Accrual basis', 'Modified cash basis', 'Hybrid basis'],
        correctIndex: 1,
      },
      {
        question: 'Net Debt/EBITDA is a measure of?',
        options: ['Profitability', 'Liquidity', 'Leverage', 'Efficiency'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'port-ops',
    title: 'Port Operations Mastery',
    domain: 'operational',
    emoji: '🏗️',
    questions: [
      {
        question: 'What does TEU stand for?',
        options: ['Total Export Units', 'Twenty-foot Equivalent Unit', 'Terminal Equipment Usage', 'Trade Exchange Unit'],
        correctIndex: 1,
      },
      {
        question: 'Target berth utilization for efficient port operations is?',
        options: ['90–95%', '50–60%', '65–75%', '80–85%'],
        correctIndex: 2,
      },
      {
        question: 'Crane productivity benchmark is?',
        options: ['10–15 moves/hr', '25–30 moves/hr', '40–50 moves/hr', '5–8 moves/hr'],
        correctIndex: 1,
      },
      {
        question: 'Ideal vessel turnaround time at a well-managed terminal?',
        options: ['<48 hours', '<24 hours', '<12 hours', '<72 hours'],
        correctIndex: 1,
      },
      {
        question: 'Optimal yard utilization rate for balanced throughput?',
        options: ['95%+', '70–80%', '50–60%', '40–50%'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'trade-corridors',
    title: 'Trade Corridor Intelligence',
    domain: 'market',
    emoji: '🌐',
    questions: [
      {
        question: 'Which trade corridor carries the highest container volume between Asia and the Middle East?',
        options: ['Asia–Europe via Suez', 'Asia–GCC direct', 'Transpacific route', 'Intra-Asia feeder'],
        correctIndex: 1,
      },
      {
        question: 'What is the primary impact of Red Sea disruptions on GCC port operators?',
        options: ['Reduced fuel costs', 'Increased transshipment demand', 'Lower insurance premiums', 'Decreased vessel calls'],
        correctIndex: 1,
      },
      {
        question: 'The "China+1" manufacturing diversification strategy primarily benefits which corridor?',
        options: ['China–Europe', 'Southeast Asia–GCC', 'Transpacific', 'Intra-Europe'],
        correctIndex: 1,
      },
      {
        question: 'Which metric best measures trade corridor competitiveness?',
        options: ['GDP per capita', 'Transit time plus total logistics cost', 'Currency exchange rate', 'Population density'],
        correctIndex: 1,
      },
      {
        question: 'Khalifa Port\'s strategic advantage in global trade stems primarily from?',
        options: ['Low labor costs', 'Geographic position on Asia–Europe routes', 'Largest crane fleet globally', 'Deepest natural harbor'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'risk-methodology',
    title: 'Risk Assessment Methodology',
    domain: 'financial',
    emoji: '🛡️',
    questions: [
      {
        question: 'In a 5×5 risk matrix, what two dimensions are assessed?',
        options: ['Cost and Schedule', 'Likelihood and Impact', 'Frequency and Duration', 'Scope and Quality'],
        correctIndex: 1,
      },
      {
        question: 'A risk with Likelihood=5, Impact=4 produces a score of?',
        options: ['9', '15', '20', '25'],
        correctIndex: 2,
      },
      {
        question: 'Which risk domain covers IMO regulatory compliance?',
        options: ['Operational', 'Financial', 'Regulatory', 'Market'],
        correctIndex: 2,
      },
      {
        question: 'Risk mitigation status "In Progress" means?',
        options: ['Risk is fully eliminated', 'Controls are being implemented', 'No action has been taken', 'Risk was accepted without mitigation'],
        correctIndex: 1,
      },
      {
        question: 'Linking each risk to a financial statement line item (IS/BS/CF) enables?',
        options: ['Faster incident response', 'Audit-grade financial traceability', 'Employee performance reviews', 'Marketing campaign alignment'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'maritime-terms',
    title: 'Maritime Terminology Challenge',
    domain: 'operational',
    emoji: '🚢',
    questions: [
      {
        question: 'What is "demurrage" in maritime shipping?',
        options: [
          'A fee for using port cranes',
          'A charge for exceeding allowed vessel loading/unloading time',
          'An insurance premium for cargo damage',
          'A penalty for late document filing',
        ],
        correctIndex: 1,
      },
      {
        question: '"Cabotage" laws restrict?',
        options: [
          'International cargo insurance rates',
          'Domestic shipping to national-flag vessels',
          'Port construction in free trade zones',
          'Foreign exchange transactions at ports',
        ],
        correctIndex: 1,
      },
      {
        question: 'A "transshipment" operation involves?',
        options: [
          'Direct cargo delivery to the final destination',
          'Transferring cargo between vessels at an intermediate port',
          'Loading containers onto rail from a warehouse',
          'Inspecting cargo at customs checkpoints',
        ],
        correctIndex: 1,
      },
      {
        question: 'What does "draft" refer to in vessel operations?',
        options: [
          'The preliminary cargo manifest',
          'The depth of water a vessel draws when loaded',
          'A contract for port services',
          'The wind speed threshold for safe berthing',
        ],
        correctIndex: 1,
      },
      {
        question: '"Bill of Lading" serves as?',
        options: [
          'A vessel inspection certificate',
          'A receipt for goods and a contract of carriage',
          'An insurance claim form',
          'A port authority operating license',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'solution-capability',
    title: 'Solution Capability Quiz',
    domain: 'platform',
    emoji: '🤖',
    questions: [
      {
        question: 'CarbonWise Navigator primarily helps port operators with?',
        options: ['Crew scheduling', 'Carbon emissions tracking and IMO CII compliance', 'Berth slot auctioning', 'Vehicle identification'],
        correctIndex: 1,
      },
      {
        question: 'Which solution uses blockchain for vehicle logistics provenance?',
        options: ['LoadMaster AI', 'Stevedore-AI Orchestrator', 'VIN-Chain Traceability', 'Trade-Flow Oracle'],
        correctIndex: 2,
      },
      {
        question: 'Lithium-Sentinel AI monitors which specific cargo hazard?',
        options: ['Fuel spill risk', 'Crane overload', 'EV battery thermal runaway (Class 9 DG)', 'Container weight fraud'],
        correctIndex: 2,
      },
      {
        question: 'Slot-Bid AI optimizes port revenue through?',
        options: ['Workforce scheduling', 'Dynamic berth slot pricing and auction mechanics', 'Drone delivery routes', 'Carbon credit trading'],
        correctIndex: 1,
      },
      {
        question: 'Sky-Link Logistics coordinates which type of last-mile delivery?',
        options: ['Autonomous trucks', 'Rail freight', 'Drone delivery from port to warehouse', 'Barge feeder services'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'fs-linkage',
    title: 'Financial Statement Linkage',
    domain: 'financial',
    emoji: '🔗',
    questions: [
      {
        question: 'Revenue from port concession fees appears on which financial statement?',
        options: ['Balance Sheet only', 'Income Statement', 'Cash Flow Statement only', 'Statement of Changes in Equity'],
        correctIndex: 1,
      },
      {
        question: 'A new STS crane purchase ($45M) impacts the financial statements as?',
        options: [
          'IS expense in current period',
          'BS asset increase + CF investing outflow',
          'IS revenue increase',
          'CF financing inflow only',
        ],
        correctIndex: 1,
      },
      {
        question: 'Depreciation of port infrastructure affects which two statements?',
        options: [
          'IS (expense) and BS (asset reduction)',
          'CF (investing) and IS (revenue)',
          'BS (liability) and CF (financing)',
          'IS (revenue) and CF (operating)',
        ],
        correctIndex: 0,
      },
      {
        question: 'Trade receivables from shipping line customers appear on?',
        options: ['Income Statement as revenue', 'Balance Sheet as current assets', 'Cash Flow Statement as investing', 'All three statements equally'],
        correctIndex: 1,
      },
      {
        question: 'When a port operator issues a bond to finance expansion, this appears in?',
        options: [
          'IS as interest expense only',
          'CF financing activities (inflow) and BS long-term liabilities',
          'BS goodwill and CF operating',
          'IS revenue and BS retained earnings',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'strategic-planning',
    title: 'Strategic Planning Essentials',
    domain: 'strategic',
    emoji: '📈',
    questions: [
      {
        question: 'In a port CAPEX plan, which investment typically has the longest payback period?',
        options: ['Software licenses', 'Deep-water channel dredging', 'Office furniture', 'Staff training programs'],
        correctIndex: 1,
      },
      {
        question: 'ESG integration in maritime strategy primarily drives?',
        options: [
          'Short-term cost reduction only',
          'Long-term enterprise value and stakeholder trust',
          'Immediate revenue growth',
          'Reduced headcount requirements',
        ],
        correctIndex: 1,
      },
      {
        question: 'Value creation in port acquisitions is typically measured by?',
        options: [
          'Number of employees acquired',
          'EBITDA multiple relative to acquisition premium and synergy capture',
          'Total cargo volume only',
          'Distance from nearest airport',
        ],
        correctIndex: 1,
      },
      {
        question: 'A port\'s "concession model" revenue structure means?',
        options: [
          'Revenue from selling port equipment',
          'Long-term operating rights generating recurring fees from vessel calls and cargo handling',
          'One-time land sales only',
          'Government subsidies for operations',
        ],
        correctIndex: 1,
      },
      {
        question: 'Digital twin technology in port strategic planning enables?',
        options: [
          'Instant port construction',
          'Simulation of capacity scenarios and investment impact before committing capital',
          'Automated regulatory compliance filing',
          'Direct-to-consumer shipping',
        ],
        correctIndex: 1,
      },
    ],
  },
]

// ─────────────────────────────────────────────────────────
// Mock State — Pre-completed quizzes
// ─────────────────────────────────────────────────────────

const initialResults: Record<string, QuizResult> = {
  'fin-fundamentals': { score: 5, total: 5, answers: [1, 1, 2, 1, 2] },
  'port-ops': { score: 4, total: 5, answers: [1, 2, 1, 1, 0] },
  'maritime-terms': { score: 3, total: 5, answers: [1, 1, 1, 0, 0] },
}

// ─────────────────────────────────────────────────────────
// XP & Leveling System
// ─────────────────────────────────────────────────────────

function calculateXP(results: Record<string, QuizResult>): number {
  let xp = 0
  for (const r of Object.values(results)) {
    xp += r.score * 100         // 100 XP per correct answer
    xp += 200                   // 200 XP quiz completion bonus
    if (r.score === r.total) xp += 500  // 500 XP perfect score bonus
  }
  return xp
}

interface LevelInfo {
  level: number
  title: string
  minXP: number
  maxXP: number
}

const levels: LevelInfo[] = [
  { level: 1, title: 'Cadet', minXP: 0, maxXP: 999 },
  { level: 2, title: 'Officer', minXP: 1000, maxXP: 2499 },
  { level: 3, title: 'Navigator', minXP: 2500, maxXP: 4999 },
  { level: 4, title: 'Captain', minXP: 5000, maxXP: 7499 },
  { level: 5, title: 'Admiral', minXP: 7500, maxXP: 9999 },
]

function getLevel(xp: number): LevelInfo {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXP) return levels[i]
  }
  return levels[0]
}

// ─────────────────────────────────────────────────────────
// Badges
// ─────────────────────────────────────────────────────────

function computeBadges(results: Record<string, QuizResult>): Badge[] {
  const completedIds = Object.keys(results)
  const hasPerfect = Object.values(results).some(r => r.score === r.total)
  const financialQuizIds = ['fin-fundamentals', 'risk-methodology', 'fs-linkage']
  const allFinancialDone = financialQuizIds.every(id => completedIds.includes(id))
  const allDone = quizModules.every(m => completedIds.includes(m.id))

  return [
    {
      id: 'first-quiz',
      emoji: '🎯',
      name: 'First Quiz Completed',
      description: 'Complete your first training quiz',
      earned: completedIds.length >= 1,
    },
    {
      id: 'perfect-score',
      emoji: '⭐',
      name: 'Perfect Score',
      description: 'Score 5/5 on any quiz',
      earned: hasPerfect,
    },
    {
      id: 'financial-expert',
      emoji: '💰',
      name: 'Financial Expert',
      description: 'Complete all financial domain quizzes',
      earned: allFinancialDone,
    },
    {
      id: 'operations-pro',
      emoji: '⚓',
      name: 'Operations Pro',
      description: 'Complete the Port Operations quiz',
      earned: completedIds.includes('port-ops'),
    },
    {
      id: 'market-analyst',
      emoji: '🌍',
      name: 'Market Analyst',
      description: 'Complete the Trade Corridor quiz',
      earned: completedIds.includes('trade-corridors'),
    },
    {
      id: 'risk-manager',
      emoji: '🛡️',
      name: 'Risk Manager',
      description: 'Complete the Risk Assessment quiz',
      earned: completedIds.includes('risk-methodology'),
    },
    {
      id: 'maritime-scholar',
      emoji: '🚢',
      name: 'Maritime Scholar',
      description: 'Complete the Maritime Terminology quiz',
      earned: completedIds.includes('maritime-terms'),
    },
    {
      id: 'platform-master',
      emoji: '🏆',
      name: 'Platform Master',
      description: 'Complete all 8 training quizzes',
      earned: allDone,
    },
  ]
}

// ─────────────────────────────────────────────────────────
// Leaderboard Data
// ─────────────────────────────────────────────────────────

function buildLeaderboard(currentXP: number, currentBadgeCount: number): LeaderboardEntry[] {
  const currentLevel = getLevel(currentXP)
  const entries: LeaderboardEntry[] = [
    { rank: 1, name: 'Ahmed Al-Mansouri', xp: 7800, level: 'Admiral', badges: 8, isCurrentUser: false },
    { rank: 2, name: 'Sarah Al-Hashimi', xp: 6200, level: 'Captain', badges: 7, isCurrentUser: false },
    { rank: 3, name: 'You', xp: currentXP, level: currentLevel.title, badges: currentBadgeCount, isCurrentUser: true },
    { rank: 4, name: 'Khalid Al-Maktoum', xp: 3800, level: 'Navigator', badges: 5, isCurrentUser: false },
    { rank: 5, name: 'Fatima Al-Nuaimi', xp: 3200, level: 'Navigator', badges: 4, isCurrentUser: false },
    { rank: 6, name: 'Omar Al-Dhaheri', xp: 2800, level: 'Navigator', badges: 4, isCurrentUser: false },
    { rank: 7, name: 'Layla Al-Suwaidi', xp: 2100, level: 'Officer', badges: 3, isCurrentUser: false },
    { rank: 8, name: 'Hassan Al-Balushi', xp: 1600, level: 'Officer', badges: 2, isCurrentUser: false },
    { rank: 9, name: 'Noura Al-Ketbi', xp: 900, level: 'Cadet', badges: 1, isCurrentUser: false },
    { rank: 10, name: 'Yusuf Al-Shamsi', xp: 400, level: 'Cadet', badges: 1, isCurrentUser: false },
  ]
  return entries
}

const rankMedals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────

function XPBar({ xp }: { xp: number }) {
  const lvl = getLevel(xp)
  const nextLvl = levels.find(l => l.level === lvl.level + 1)
  const progressInLevel = xp - lvl.minXP
  const levelRange = (nextLvl ? nextLvl.minXP : 10000) - lvl.minXP
  const pct = Math.min(100, Math.round((progressInLevel / levelRange) * 100))

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-text-muted">
          Level {lvl.level}: {lvl.title}
        </span>
        {nextLvl && (
          <span className="text-[10px] text-text-muted">
            {nextLvl.minXP - xp} XP to {nextLvl.title}
          </span>
        )}
      </div>
      <div className="h-2.5 bg-surface-secondary rounded-full overflow-hidden">
        <div
          className="h-2.5 rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #C8102E 0%, #FF6B35 50%, #FFD700 100%)',
          }}
        />
      </div>
    </div>
  )
}

function StatsBar({
  xp,
  streak,
  badgesEarned,
  totalBadges,
}: {
  xp: number
  streak: number
  badgesEarned: number
  totalBadges: number
}) {
  const lvl = getLevel(xp)
  return (
    <div className="bg-ad-white rounded-xl border border-border p-4 mb-4">
      <div className="flex items-center gap-6">
        {/* XP */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
            <Zap size={18} className="text-warning" />
          </div>
          <div>
            <p className="text-lg font-bold text-text-primary leading-none">{xp.toLocaleString()}</p>
            <p className="text-[10px] text-text-muted">XP</p>
          </div>
        </div>

        {/* Level bar */}
        <XPBar xp={xp} />

        {/* Level badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-ad-red/10 flex items-center justify-center">
            <Crown size={18} className="text-ad-red" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary leading-none">Lv.{lvl.level}</p>
            <p className="text-[10px] text-text-muted">{lvl.title}</p>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-fs-income/10 flex items-center justify-center">
            <Flame size={18} className="text-fs-income" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary leading-none">{streak}</p>
            <p className="text-[10px] text-text-muted">Day streak</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
            <Award size={18} className="text-success" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary leading-none">{badgesEarned}/{totalBadges}</p>
            <p className="text-[10px] text-text-muted">Badges</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuizListItem({
  quiz,
  result,
  isSelected,
  onClick,
}: {
  quiz: QuizModule
  result?: QuizResult
  isSelected: boolean
  onClick: () => void
}) {
  const domain = domainConfig[quiz.domain]
  const completed = !!result

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 ${
        isSelected
          ? 'bg-ad-white border-ad-red/30 shadow-card-hover'
          : 'bg-ad-white border-border hover:shadow-card-hover hover:border-border'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${domain.bgLight} flex items-center justify-center shrink-0 text-lg`}>
          {quiz.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-xs font-semibold text-text-primary truncate">{quiz.title}</h3>
            {completed && (
              <CheckCircle2 size={14} className={result.score === result.total ? 'text-warning shrink-0' : 'text-success shrink-0'} />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${domain.bg}`}>
              {domain.label}
            </span>
            <span className="text-[10px] text-text-muted">{quiz.questions.length} questions</span>
            {completed && (
              <span className="text-[10px] font-semibold text-text-secondary ml-auto">
                {result.score}/{result.total}
              </span>
            )}
          </div>
        </div>
        <ChevronRight size={14} className={`shrink-0 transition-colors ${isSelected ? 'text-ad-red' : 'text-text-muted'}`} />
      </div>
    </button>
  )
}

function QuizRunner({
  quiz,
  onComplete,
}: {
  quiz: QuizModule
  onComplete: (result: QuizResult) => void
}) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)

  const q = quiz.questions[currentQ]

  const handleAnswer = useCallback((idx: number) => {
    if (showFeedback) return
    setSelectedAnswer(idx)
    setShowFeedback(true)
    const isCorrect = idx === q.correctIndex
    if (isCorrect) setScore(s => s + 1)
    setAnswers(prev => [...prev, idx])
  }, [showFeedback, q.correctIndex])

  const handleNext = useCallback(() => {
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(c => c + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setFinished(true)
    }
  }, [currentQ, quiz.questions.length])

  if (finished) {
    const xpCorrect = score * 100
    const xpBonus = 200
    const xpPerfect = score === quiz.questions.length ? 500 : 0
    const totalXP = xpCorrect + xpBonus + xpPerfect

    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-6">
            <Trophy size={36} className="text-warning" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Quiz Complete!</h2>
          <p className="text-sm text-text-secondary mb-6">{quiz.title}</p>

          <div className="bg-surface-secondary/50 rounded-xl p-6 mb-6">
            <div className="text-4xl font-bold text-text-primary mb-1">
              {score}/{quiz.questions.length}
            </div>
            <p className="text-xs text-text-muted mb-4">
              {score === quiz.questions.length ? 'Perfect score!' : score >= 4 ? 'Excellent work!' : score >= 3 ? 'Good effort!' : 'Keep practicing!'}
            </p>

            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Correct answers</span>
                <span className="font-semibold text-success">+{xpCorrect} XP</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Completion bonus</span>
                <span className="font-semibold text-info">+{xpBonus} XP</span>
              </div>
              {xpPerfect > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">Perfect score bonus</span>
                  <span className="font-semibold text-warning">+{xpPerfect} XP</span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-text-primary">Total earned</span>
                <span className="font-bold text-ad-red">+{totalXP} XP</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onComplete({ score, total: quiz.questions.length, answers })}
            className="px-6 py-2.5 bg-ad-red text-white text-sm font-semibold rounded-lg hover:bg-ad-red/90 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Quiz header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{quiz.emoji}</span>
          <div>
            <h2 className="text-sm font-bold text-text-primary">{quiz.title}</h2>
            <p className="text-[11px] text-text-muted">Question {currentQ + 1} of {quiz.questions.length}</p>
          </div>
        </div>
        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {quiz.questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < currentQ
                  ? answers[i] === quiz.questions[i].correctIndex
                    ? 'bg-success'
                    : 'bg-critical'
                  : i === currentQ
                    ? 'bg-ad-red'
                    : 'bg-surface-secondary'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h3 className="text-base font-semibold text-text-primary mb-6 leading-relaxed">
          {q.question}
        </h3>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let btnClass = 'bg-surface-secondary/50 border-border hover:border-ad-red/30 hover:bg-surface'
            if (showFeedback) {
              if (i === q.correctIndex) {
                btnClass = 'bg-success/10 border-success/50 ring-2 ring-success/20'
              } else if (i === selectedAnswer && i !== q.correctIndex) {
                btnClass = 'bg-critical/10 border-critical/50 ring-2 ring-critical/20'
              } else {
                btnClass = 'bg-surface-secondary/30 border-border opacity-50'
              }
            } else if (selectedAnswer === i) {
              btnClass = 'bg-ad-red/5 border-ad-red/30'
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${btnClass}`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold ${
                  showFeedback && i === q.correctIndex
                    ? 'bg-success text-white'
                    : showFeedback && i === selectedAnswer && i !== q.correctIndex
                      ? 'bg-critical text-white'
                      : 'bg-surface-secondary text-text-secondary'
                }`}>
                  {showFeedback && i === q.correctIndex ? (
                    <CheckCircle2 size={16} />
                  ) : showFeedback && i === selectedAnswer && i !== q.correctIndex ? (
                    <XCircle size={16} />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span className={`text-sm ${
                  showFeedback && i === q.correctIndex
                    ? 'text-success font-semibold'
                    : showFeedback && i === selectedAnswer && i !== q.correctIndex
                      ? 'text-critical font-semibold'
                      : 'text-text-primary'
                }`}>
                  {opt}
                </span>
              </button>
            )
          })}
        </div>

        {showFeedback && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleNext}
              className="px-5 py-2 bg-ad-red text-white text-sm font-semibold rounded-lg hover:bg-ad-red/90 transition-colors flex items-center gap-2"
            >
              {currentQ < quiz.questions.length - 1 ? 'Next Question' : 'See Results'}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function QuizSummary({
  quiz,
  result,
  onRetake,
}: {
  quiz: QuizModule
  result: QuizResult
  onRetake: () => void
}) {
  const domain = domainConfig[quiz.domain]
  const isPerfect = result.score === result.total

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-14 h-14 rounded-xl ${domain.bgLight} flex items-center justify-center shrink-0 text-2xl`}>
            {quiz.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-text-primary">{quiz.title}</h2>
              {isPerfect && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-bold">
                  <Star size={12} />
                  Perfect
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${domain.bg}`}>
                {domain.label}
              </span>
              <span className="text-[11px] text-text-muted">{quiz.questions.length} questions</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-text-primary">{result.score}/{result.total}</p>
            <p className="text-[10px] text-text-muted">Score</p>
          </div>
          <div className="flex-1 bg-surface-secondary rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${isPerfect ? 'bg-warning' : 'bg-success'}`}
              style={{ width: `${(result.score / result.total) * 100}%` }}
            />
          </div>
          <button
            onClick={onRetake}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-secondary text-text-secondary text-xs font-medium rounded-lg hover:bg-surface hover:text-text-primary transition-colors shrink-0"
          >
            <RotateCcw size={12} />
            Retake
          </button>
        </div>
      </div>

      {/* Question review */}
      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Answer Review</h3>
        <div className="space-y-3">
          {quiz.questions.map((question, i) => {
            const userAnswer = result.answers[i]
            const isCorrect = userAnswer === question.correctIndex
            return (
              <div
                key={i}
                className={`rounded-xl p-4 border ${
                  isCorrect
                    ? 'bg-success/5 border-success/20'
                    : 'bg-critical/5 border-critical/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isCorrect ? 'bg-success/10 text-success' : 'bg-critical/10 text-critical'
                  }`}>
                    {isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-text-primary mb-1">Q{i + 1}: {question.question}</p>
                    {!isCorrect && userAnswer !== null && (
                      <p className="text-[11px] text-critical mb-0.5">
                        Your answer: {question.options[userAnswer]}
                      </p>
                    )}
                    <p className="text-[11px] text-success">
                      Correct: {question.options[question.correctIndex]}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function LeaderboardView({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Users size={18} className="text-warning" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary">Team Leaderboard</h2>
            <p className="text-[11px] text-text-muted">Top performers across all training modules</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-[10px] text-text-muted font-medium uppercase tracking-wider text-left py-3 px-5 w-16">Rank</th>
              <th className="text-[10px] text-text-muted font-medium uppercase tracking-wider text-left py-3 px-3">Name</th>
              <th className="text-[10px] text-text-muted font-medium uppercase tracking-wider text-right py-3 px-3">XP</th>
              <th className="text-[10px] text-text-muted font-medium uppercase tracking-wider text-center py-3 px-3">Level</th>
              <th className="text-[10px] text-text-muted font-medium uppercase tracking-wider text-center py-3 px-5">Badges</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr
                key={entry.rank}
                className={`border-b border-border/50 transition-colors ${
                  entry.isCurrentUser
                    ? 'bg-ad-red/5'
                    : 'hover:bg-surface-secondary/30'
                }`}
              >
                <td className="py-3 px-5">
                  <span className="text-sm">
                    {rankMedals[entry.rank] || (
                      <span className="text-xs text-text-muted font-mono">{entry.rank}</span>
                    )}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={`text-sm ${entry.isCurrentUser ? 'font-bold text-ad-red' : 'font-medium text-text-primary'}`}>
                    {entry.name}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="text-sm font-semibold text-text-primary">{entry.xp.toLocaleString()}</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-surface-secondary text-text-secondary">
                    {entry.level}
                  </span>
                </td>
                <td className="py-3 px-5 text-center">
                  <span className="text-xs font-medium text-text-secondary">{entry.badges}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BadgeGrid({ badges }: { badges: Badge[] }) {
  return (
    <div className="p-5 border-b border-border">
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Achievements</h3>
      <div className="flex flex-wrap gap-2">
        {badges.map(badge => (
          <div
            key={badge.id}
            title={`${badge.name}: ${badge.description}`}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
              badge.earned
                ? 'bg-warning/10 ring-2 ring-warning/30'
                : 'bg-surface-secondary opacity-30 grayscale'
            }`}
          >
            {badge.emoji}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────

export default function Trainings() {
  const [results, setResults] = useState<Record<string, QuizResult>>(initialResults)
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null)
  const [filterDomain, setFilterDomain] = useState<QuizDomain | 'all'>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('quiz')

  const xp = useMemo(() => calculateXP(results), [results])
  const badges = useMemo(() => computeBadges(results), [results])
  const badgesEarned = badges.filter(b => b.earned).length
  const leaderboard = useMemo(() => buildLeaderboard(xp, badgesEarned), [xp, badgesEarned])

  const filteredQuizzes = useMemo(() => {
    if (filterDomain === 'all') return quizModules
    return quizModules.filter(q => q.domain === filterDomain)
  }, [filterDomain])

  const handleQuizComplete = useCallback((quizId: string, result: QuizResult) => {
    setResults(prev => ({ ...prev, [quizId]: result }))
    setActiveQuizId(null)
  }, [])

  const handleRetake = useCallback((quizId: string) => {
    // Remove old result and start fresh
    setResults(prev => {
      const next = { ...prev }
      delete next[quizId]
      return next
    })
    setActiveQuizId(quizId)
  }, [])

  const selectedQuiz = quizModules.find(q => q.id === selectedQuizId) || null
  const activeQuiz = quizModules.find(q => q.id === activeQuizId) || null

  const domains: QuizDomain[] = ['financial', 'operational', 'market', 'platform', 'strategic']

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
            <Trophy size={22} className="text-warning" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary font-serif">Training Programs</h1>
            <p className="text-xs text-text-muted">Gamified Quizzes — Test Your Maritime & Financial Expertise</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          Complete {quizModules.length} training quizzes across {domains.length} domains to earn XP, level up, and unlock achievement badges.
          Track your progress on the team leaderboard.
        </p>
      </div>

      {/* Stats Bar */}
      <StatsBar xp={xp} streak={7} badgesEarned={badgesEarned} totalBadges={badges.length} />

      {/* Workspace Layout */}
      <div className="flex gap-4" style={{ height: 'calc(100vh - 340px)', minHeight: 520 }}>
        {/* Left Panel — Quiz List (300px) */}
        <div className="w-[300px] bg-ad-white rounded-xl border border-border flex flex-col shrink-0 overflow-hidden">
          {/* Filters */}
          <div className="p-3.5 border-b border-border">
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-xs font-semibold text-text-primary">Training Modules</h2>
              <span className="text-[10px] text-text-muted">{Object.keys(results).length}/{quizModules.length} done</span>
            </div>

            {/* Domain filter */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => { setFilterDomain('all'); setSelectedQuizId(null) }}
                className={`text-[10px] font-medium px-2 py-1 rounded-full transition-colors ${
                  filterDomain === 'all'
                    ? 'bg-ad-red text-white'
                    : 'bg-surface-secondary text-text-secondary hover:bg-surface'
                }`}
              >
                All ({quizModules.length})
              </button>
              {domains.map(d => {
                const cfg = domainConfig[d]
                const count = quizModules.filter(q => q.domain === d).length
                return (
                  <button
                    key={d}
                    onClick={() => { setFilterDomain(d); setSelectedQuizId(null) }}
                    className={`text-[10px] font-medium px-2 py-1 rounded-full transition-colors flex items-center gap-1 ${
                      filterDomain === d
                        ? 'bg-ad-red text-white'
                        : 'bg-surface-secondary text-text-secondary hover:bg-surface'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${filterDomain === d ? 'bg-white' : cfg.bg}`} />
                    {cfg.label} ({count})
                  </button>
                )
              })}
            </div>
          </div>

          {/* Badges */}
          <BadgeGrid badges={badges} />

          {/* Quiz list */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
            {filteredQuizzes.map(quiz => (
              <QuizListItem
                key={quiz.id}
                quiz={quiz}
                result={results[quiz.id]}
                isSelected={selectedQuizId === quiz.id}
                onClick={() => {
                  setSelectedQuizId(quiz.id)
                  setActiveQuizId(null)
                  setViewMode('quiz')
                }}
              />
            ))}
          </div>

          {/* Leaderboard toggle */}
          <div className="p-3 border-t border-border">
            <button
              onClick={() => {
                setViewMode(viewMode === 'leaderboard' ? 'quiz' : 'leaderboard')
                if (viewMode !== 'leaderboard') {
                  setSelectedQuizId(null)
                  setActiveQuizId(null)
                }
              }}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'leaderboard'
                  ? 'bg-ad-red text-white'
                  : 'bg-surface-secondary text-text-secondary hover:bg-surface hover:text-text-primary'
              }`}
            >
              <Users size={14} />
              {viewMode === 'leaderboard' ? 'Back to Quizzes' : 'View Leaderboard'}
            </button>
          </div>
        </div>

        {/* Right Panel — Active Content */}
        <div className="flex-1 bg-ad-white rounded-xl border border-border flex flex-col overflow-hidden min-w-0">
          {viewMode === 'leaderboard' ? (
            <LeaderboardView entries={leaderboard} />
          ) : activeQuiz ? (
            <QuizRunner
              key={activeQuiz.id}
              quiz={activeQuiz}
              onComplete={(result) => handleQuizComplete(activeQuiz.id, result)}
            />
          ) : selectedQuiz && results[selectedQuiz.id] ? (
            <QuizSummary
              quiz={selectedQuiz}
              result={results[selectedQuiz.id]}
              onRetake={() => handleRetake(selectedQuiz.id)}
            />
          ) : selectedQuiz ? (
            // Start quiz prompt
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="text-5xl mb-4">{selectedQuiz.emoji}</div>
                <h2 className="text-lg font-bold text-text-primary mb-2">{selectedQuiz.title}</h2>
                <p className="text-xs text-text-muted mb-1">
                  <span className={`font-bold px-1.5 py-0.5 rounded text-white ${domainConfig[selectedQuiz.domain].bg}`}>
                    {domainConfig[selectedQuiz.domain].label}
                  </span>
                  <span className="ml-2">{selectedQuiz.questions.length} questions</span>
                </p>
                <p className="text-xs text-text-secondary mt-3 mb-6 leading-relaxed">
                  Earn up to {selectedQuiz.questions.length * 100 + 200 + 500} XP with a perfect score.
                  Each correct answer is worth 100 XP plus bonus rewards.
                </p>
                <button
                  onClick={() => setActiveQuizId(selectedQuiz.id)}
                  className="px-6 py-2.5 bg-ad-red text-white text-sm font-semibold rounded-lg hover:bg-ad-red/90 transition-colors inline-flex items-center gap-2"
                >
                  <Target size={16} />
                  Start Quiz
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-surface-secondary flex items-center justify-center mx-auto mb-4">
                  <Trophy size={28} className="text-text-muted" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-1">Select a Training Module</h3>
                <p className="text-xs text-text-muted max-w-xs">
                  Choose a quiz from the left panel to test your knowledge and earn XP rewards.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
