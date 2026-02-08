import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Ship, Gauge, Wallet, FileSearch, Anchor, Waves, Scale, Clock, AlertTriangle, CheckCircle, Database, Brain, Zap, Calculator, Fuel, TrendingDown, TrendingUp, Truck, Container, Users, Weight, Ruler, Plus, Minus, Calendar, Euro, Layers, FileText, Eye, Loader2, Upload, RotateCcw, DollarSign, Leaf, Timer, ShieldCheck, BarChart3, PieChart, Lock, LogIn, X, Play, Pause, RotateCw, MapPin, Target, Share2 } from 'lucide-react';

// Access Code Protection Component
function AccessCodeModal({ isOpen, onClose, onSuccess, onRequestAccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void; onRequestAccess: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate verification delay
    setTimeout(() => {
      // Valid access codes - hashed in production, plain for demo
      const validAccessCodes = [
        'RI62-CC7P-LB3J', // Demo reviewer access
        'DEMO2024',       // Demo access code for testing
      ];

      // Check access code (also check localStorage for dynamically added codes)
      const storedCodes = JSON.parse(localStorage.getItem('carbonwise_access_codes') || '[]');
      const allValidCodes = [...validAccessCodes, ...storedCodes];

      if (allValidCodes.includes(code.toUpperCase())) {
        localStorage.setItem('carbonwise_authenticated', 'true');
        onSuccess();
      } else {
        setError('Invalid access code. Please check your email for the correct code.');
      }
      setIsLoading(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-apollo-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-apollo-green" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-apollo-dark mb-2">
            Access Interactive Demo
          </h3>
          <p className="text-gray-600 text-sm">
            Enter your access code to unlock the interactive demo features.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="XXXX-XXXX-XXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-apollo-green focus:border-transparent"
              maxLength={14}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!code || isLoading}
            className="w-full bg-apollo-green text-white py-3 rounded-xl font-medium hover:bg-apollo-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Unlock Demo
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Don't have an access code?{' '}
          <button
            type="button"
            onClick={onRequestAccess}
            className="text-apollo-green hover:underline"
          >
            Request access
          </button>
        </p>
      </div>
    </div>
  );
}

// Benefits Showcase Component for Physics Engine
function PhysicsEngineBenefits() {
  return (
    <div className="bg-apollo-beige rounded-xl p-6 border border-gray-200">
      <h4 className="font-semibold text-apollo-dark flex items-center gap-2 mb-6">
        <Gauge className="w-5 h-5 text-apollo-green" />
        Why Speed Optimization Matters
      </h4>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-apollo-green/10 rounded-full flex items-center justify-center mb-3">
            <TrendingDown className="w-6 h-6 text-apollo-green" />
          </div>
          <div className="text-lg md:text-2xl font-bold text-apollo-dark mb-1">~27%</div>
          <div className="text-xs text-gray-500 text-center">Fuel Reduction</div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-apollo-green/10 rounded-full flex items-center justify-center mb-3">
            <Leaf className="w-6 h-6 text-apollo-green" />
          </div>
          <div className="text-lg md:text-2xl font-bold text-apollo-dark mb-1">~27%</div>
          <div className="text-xs text-gray-500 text-center">CO₂ Reduction</div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-apollo-green/10 rounded-full flex items-center justify-center mb-3">
            <Timer className="w-6 h-6 text-apollo-green" />
          </div>
          <div className="text-lg md:text-2xl font-bold text-apollo-dark mb-1">100%</div>
          <div className="text-xs text-gray-500 text-center">On-Time Arrival</div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-apollo-light rounded-lg p-4">
        <h5 className="font-medium text-apollo-dark mb-2 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-apollo-green" />
          The Cubic Law Advantage
        </h5>
        <p className="text-sm text-gray-600">
          Fuel consumption increases with the <span className="font-semibold">cube of speed</span>.
          Small speed reductions yield disproportionately large fuel savings.
        </p>
      </div>
    </div>
  );
}

// Benefits Showcase Component for Allocation Engine
function AllocationEngineBenefits() {
  return (
    <div className="bg-apollo-beige rounded-xl p-6 border border-gray-200">
      <h4 className="font-semibold text-apollo-dark flex items-center gap-2 mb-6">
        <Scale className="w-5 h-5 text-apollo-green" />
        Why Fair Allocation Matters
      </h4>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-apollo-green/10 rounded-full flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-apollo-green" />
          </div>
          <div className="text-lg md:text-2xl font-bold text-apollo-dark mb-1">100%</div>
          <div className="text-xs text-gray-500 text-center">Compliant</div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-apollo-green/10 rounded-full flex items-center justify-center mb-3">
            <PieChart className="w-6 h-6 text-apollo-green" />
          </div>
          <div className="text-lg md:text-2xl font-bold text-apollo-dark mb-1">Fair</div>
          <div className="text-xs text-gray-500 text-center">Cost Distribution</div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-apollo-green/10 rounded-full flex items-center justify-center mb-3">
            <Users className="w-6 h-6 text-apollo-green" />
          </div>
          <div className="text-lg md:text-2xl font-bold text-apollo-dark mb-1">0</div>
          <div className="text-xs text-gray-500 text-center">Customer Disputes</div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-apollo-light rounded-lg p-4">
        <h5 className="font-medium text-apollo-dark mb-2 flex items-center gap-2">
          <Scale className="w-4 h-4 text-apollo-green" />
          Defensible Allocation
        </h5>
        <p className="text-sm text-gray-600">
          Transparent, auditable cost distribution that eliminates
          disputes and ensures every cargo pays its fair share.
        </p>
      </div>
    </div>
  );
}

// Benefits Showcase Component for EUA Wallet
function EUAWalletBenefits() {
  return (
    <div className="bg-apollo-beige rounded-xl p-6 border border-gray-200">
      <h4 className="font-semibold text-apollo-dark flex items-center gap-2 mb-6">
        <Wallet className="w-5 h-5 text-apollo-green" />
        Why Token Management Matters
      </h4>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-apollo-green/10 rounded-full flex items-center justify-center mb-3">
            <Database className="w-6 h-6 text-apollo-green" />
          </div>
          <div className="text-lg md:text-2xl font-bold text-apollo-dark mb-1">Audit</div>
          <div className="text-xs text-gray-500 text-center">Ready Accounting</div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-apollo-green/10 rounded-full flex items-center justify-center mb-3">
            <TrendingDown className="w-6 h-6 text-apollo-green" />
          </div>
          <div className="text-lg md:text-2xl font-bold text-apollo-dark mb-1">~15%</div>
          <div className="text-xs text-gray-500 text-center">vs. Spot Buying</div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-apollo-green/10 rounded-full flex items-center justify-center mb-3">
            <BarChart3 className="w-6 h-6 text-apollo-green" />
          </div>
          <div className="text-lg md:text-2xl font-bold text-apollo-dark mb-1">Live</div>
          <div className="text-xs text-gray-500 text-center">Portfolio Valuation</div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-apollo-light rounded-lg p-4">
        <h5 className="font-medium text-apollo-dark mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-apollo-green" />
          Strategic Cost Management
        </h5>
        <p className="text-sm text-gray-600">
          Reduce effective carbon costs through optimized token management
          and real-time portfolio visibility.
        </p>
      </div>
    </div>
  );
}

// Benefits Showcase Component for AI Audit
function AIAuditBenefits() {
  return (
    <div className="bg-apollo-beige rounded-xl p-6 border border-gray-200">
      <h4 className="font-semibold text-apollo-dark flex items-center gap-2 mb-6">
        <Brain className="w-5 h-5 text-apollo-green" />
        Why AI Auditing Matters
      </h4>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-apollo-green/10 rounded-full flex items-center justify-center mb-3">
            <Timer className="w-6 h-6 text-apollo-green" />
          </div>
          <div className="text-lg md:text-2xl font-bold text-apollo-dark mb-1">95%</div>
          <div className="text-xs text-gray-500 text-center">Time Saved</div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-apollo-green/10 rounded-full flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6 text-apollo-green" />
          </div>
          <div className="text-lg md:text-2xl font-bold text-apollo-dark mb-1">12%</div>
          <div className="text-xs text-gray-500 text-center">Overbilling Found</div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-apollo-green/10 rounded-full flex items-center justify-center mb-3">
            <DollarSign className="w-6 h-6 text-apollo-green" />
          </div>
          <div className="text-lg md:text-2xl font-bold text-apollo-dark mb-1">~8%</div>
          <div className="text-xs text-gray-500 text-center">Cost Recovery</div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-apollo-light rounded-lg p-4">
        <h5 className="font-medium text-apollo-dark mb-2 flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-apollo-green" />
          Intelligent Verification
        </h5>
        <p className="text-sm text-gray-600">
          Automated invoice reconciliation catches discrepancies that
          manual reviews miss, recovering substantial overbillings.
        </p>
      </div>
    </div>
  );
}

// Voyage Journey Teaser Component
function VoyageJourneyTeaser({ onRequestDemo }: { onRequestDemo: () => void }) {
  return (
    <div className="bg-apollo-beige rounded-2xl p-8 border border-gray-200">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-apollo-green/10 border border-apollo-green/20 mb-4">
          <Ship className="w-5 h-5 text-apollo-green" />
          <span className="text-sm font-medium text-apollo-green">Interactive Demo</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-apollo-dark mb-3">
          Rotterdam → Dublin
        </h3>
        <p className="text-gray-600 max-w-xl mx-auto">
          Watch how Carbon-Wise creates measurable value for a single Ro-Ro voyage carrying 45 cargo units
        </p>
      </div>

      {/* Step Teasers */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {/* Step 1: Physics Engine */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-apollo-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Gauge className="w-5 h-5 text-apollo-green" />
            </div>
            <div>
              <div className="text-xs font-mono text-apollo-green mb-1">Step 1</div>
              <h4 className="font-semibold text-apollo-dark mb-1">Voyage Optimization</h4>
              <p className="text-sm text-gray-500">Significant fuel savings through intelligent speed planning</p>
            </div>
          </div>
        </div>

        {/* Step 2: Carbon Allocation */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-apollo-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Scale className="w-5 h-5 text-apollo-green" />
            </div>
            <div>
              <div className="text-xs font-mono text-apollo-green mb-1">Step 2</div>
              <h4 className="font-semibold text-apollo-dark mb-1">Fair Cost Distribution</h4>
              <p className="text-sm text-gray-500">Defensible allocation across all cargo types</p>
            </div>
          </div>
        </div>

        {/* Step 3: EUA Wallet */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-apollo-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5 text-apollo-green" />
            </div>
            <div>
              <div className="text-xs font-mono text-apollo-green mb-1">Step 3</div>
              <h4 className="font-semibold text-apollo-dark mb-1">Token Optimization</h4>
              <p className="text-sm text-gray-500">Strategic consumption reduces effective carbon costs</p>
            </div>
          </div>
        </div>

        {/* Step 4: AI Audit */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-apollo-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-apollo-green" />
            </div>
            <div>
              <div className="text-xs font-mono text-apollo-green mb-1">Step 4</div>
              <h4 className="font-semibold text-apollo-dark mb-1">Invoice Recovery</h4>
              <p className="text-sm text-gray-500">Automated detection of billing discrepancies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Teaser - Infographic */}
      <div className="bg-apollo-light rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-apollo-green" />
          <span className="font-semibold text-apollo-dark">Voyage Specifications</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-xl">
            <div className="w-10 h-10 bg-apollo-green/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Layers className="w-5 h-5 text-apollo-green" />
            </div>
            <div className="text-2xl font-bold text-apollo-dark">4</div>
            <div className="text-xs text-gray-500">Modules</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl">
            <div className="w-10 h-10 bg-apollo-green/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Truck className="w-5 h-5 text-apollo-green" />
            </div>
            <div className="text-2xl font-bold text-apollo-dark">45</div>
            <div className="text-xs text-gray-500">Cargo Units</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl">
            <div className="w-10 h-10 bg-apollo-green/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Anchor className="w-5 h-5 text-apollo-green" />
            </div>
            <div className="text-2xl font-bold text-apollo-dark">580</div>
            <div className="text-xs text-gray-500">Nautical Miles</div>
          </div>
        </div>
      </div>

      {/* Demo Button */}
      <button
        onClick={onRequestDemo}
        className="w-full flex items-center justify-center gap-2 bg-apollo-green text-white py-4 rounded-xl font-medium hover:bg-apollo-green/90 transition-colors"
      >
        <Lock className="w-4 h-4" />
        Login to Watch the Journey
      </button>
    </div>
  );
}

// Well-to-Wake Emission Factors (tCO2 per tFuel) - from IMO/EU ETS methodology
const EMISSION_FACTORS = {
  HFO: 3.714,    // Heavy Fuel Oil
  MGO: 3.886,    // Marine Gas Oil
  VLSFO: 3.791,  // Very Low Sulphur Fuel Oil (most common post-2020)
  LNG: 2.750,    // Liquefied Natural Gas
} as const;

type FuelType = keyof typeof EMISSION_FACTORS;

// EU ETS Phase-in Schedule
const EU_ETS_PHASE_IN: Record<number, number> = {
  2024: 0.40,  // 40% of emissions covered
  2025: 0.70,  // 70% of emissions covered
  2026: 1.00,  // 100% full coverage
};

// Physics Engine Demo Component
function PhysicsEngineDemo() {
  const [speed, setSpeed] = useState(18); // knots
  const [fuelType, setFuelType] = useState<FuelType>('VLSFO'); // Default to most common fuel
  const baseSpeed = 22; // Maximum design speed in knots
  const baseFuelConsumption = 100; // tons per day at base speed

  // Current year for EU ETS phase-in
  const currentYear = new Date().getFullYear();
  const phaseInRate = EU_ETS_PHASE_IN[currentYear] || 1.0;

  // Calculate fuel consumption using cubic law: Fuel ∝ Speed³
  const fuelConsumption = useMemo(() => {
    return baseFuelConsumption * Math.pow(speed / baseSpeed, 3);
  }, [speed]);

  // Calculate savings compared to max speed
  const fuelSavings = useMemo(() => {
    return ((baseFuelConsumption - fuelConsumption) / baseFuelConsumption) * 100;
  }, [fuelConsumption]);

  // Calculate CO2 emissions using fuel-specific Well-to-Wake factors
  const co2Emissions = useMemo(() => {
    return fuelConsumption * EMISSION_FACTORS[fuelType];
  }, [fuelConsumption, fuelType]);

  // Calculate EUA requirement with phase-in
  const euaRequired = useMemo(() => {
    return co2Emissions * phaseInRate;
  }, [co2Emissions, phaseInRate]);

  // Generate curve data points for visualization
  const curvePoints = useMemo(() => {
    const points = [];
    for (let s = 10; s <= 22; s += 0.5) {
      const fuel = baseFuelConsumption * Math.pow(s / baseSpeed, 3);
      points.push({ speed: s, fuel });
    }
    return points;
  }, []);

  // Calculate position on the curve for current speed
  const currentPointX = ((speed - 10) / 12) * 100;
  const currentPointY = 100 - (fuelConsumption / baseFuelConsumption) * 100;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-apollo-dark flex items-center gap-2">
          <Gauge className="w-5 h-5 text-apollo-green" />
          Speed vs. Fuel Visualizer
        </h4>
        <span className="text-xs font-mono text-apollo-green bg-apollo-light px-2 py-1 rounded">
          P = k × v³
        </span>
      </div>

      {/* Visualization Area */}
      <div className="relative h-48 mb-6 bg-gradient-to-b from-apollo-light to-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0">
          {[25, 50, 75].map((y) => (
            <div
              key={y}
              className="absolute w-full border-t border-gray-200"
              style={{ top: `${y}%` }}
            />
          ))}
          {[25, 50, 75].map((x) => (
            <div
              key={x}
              className="absolute h-full border-l border-gray-200"
              style={{ left: `${x}%` }}
            />
          ))}
        </div>

        {/* Cubic curve visualization */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Area under curve */}
          <path
            d={`M 0 100 ${curvePoints.map((p) => {
              const x = ((p.speed - 10) / 12) * 100;
              const y = 100 - (p.fuel / baseFuelConsumption) * 100;
              return `L ${x} ${y}`;
            }).join(' ')} L 100 0 L 100 100 Z`}
            fill="url(#apolloGradient)"
            opacity="0.3"
          />
          {/* Curve line */}
          <path
            d={`M ${curvePoints.map((p, i) => {
              const x = ((p.speed - 10) / 12) * 100;
              const y = 100 - (p.fuel / baseFuelConsumption) * 100;
              return `${i === 0 ? '' : 'L '}${x} ${y}`;
            }).join(' ')}`}
            fill="none"
            stroke="#003366"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {/* Current point */}
          <circle
            cx={currentPointX}
            cy={currentPointY}
            r="4"
            fill="#003366"
            stroke="white"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="apolloGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#003366" />
              <stop offset="100%" stopColor="#f5f5f5" />
            </linearGradient>
          </defs>
        </svg>

        {/* Axis labels */}
        <div className="absolute bottom-1 left-2 text-xs text-gray-500 font-mono">10 kn</div>
        <div className="absolute bottom-1 right-2 text-xs text-gray-500 font-mono">22 kn</div>
        <div className="absolute top-1 left-2 text-xs text-gray-500 font-mono">100%</div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-apollo-dark font-medium">Speed (knots)</div>

        {/* Current value indicator */}
        <div
          className="absolute transition-all duration-200"
          style={{ left: `${currentPointX}%`, top: `${currentPointY}%`, transform: 'translate(-50%, -150%)' }}
        >
          <div className="bg-apollo-green text-white text-xs font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
            {fuelConsumption.toFixed(1)} t/day
          </div>
        </div>
      </div>

      {/* Controls Row: Speed + Fuel Type */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Speed Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Vessel Speed</label>
            <span className="text-lg font-bold text-apollo-green">{speed} kn</span>
          </div>
          <input
            type="range"
            min="10"
            max="22"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full h-2 bg-apollo-light rounded-lg appearance-none cursor-pointer accent-apollo-green"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Slow Steaming</span>
            <span>Full Speed</span>
          </div>
        </div>

        {/* Fuel Type Selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Fuel Type</label>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value as FuelType)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-apollo-green bg-white"
          >
            <option value="VLSFO">VLSFO (3.791)</option>
            <option value="HFO">HFO (3.714)</option>
            <option value="MGO">MGO (3.886)</option>
            <option value="LNG">LNG (2.750)</option>
          </select>
          <div className="text-xs text-gray-400 mt-1 text-center">
            WTW tCO₂/tFuel
          </div>
        </div>
      </div>

      {/* EU ETS Phase-in Banner */}
      <div className="mb-4 p-2 bg-apollo-light border border-gray-200 rounded-lg flex items-center justify-between">
        <span className="text-xs font-medium text-apollo-dark">
          EU ETS {currentYear} Coverage: <span className="font-bold">{(phaseInRate * 100).toFixed(0)}%</span>
        </span>
        <span className="text-xs text-apollo-green">
          EUA Required: <span className="font-bold">{euaRequired.toFixed(1)} t/day</span>
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-apollo-light rounded-lg p-3 text-center">
          <Fuel className="w-5 h-5 text-apollo-green mx-auto mb-1" />
          <div className="text-lg font-bold text-apollo-dark">{fuelConsumption.toFixed(1)}</div>
          <div className="text-xs text-gray-500">tons/day</div>
        </div>
        <div className="bg-apollo-light rounded-lg p-3 text-center">
          <TrendingDown className="w-5 h-5 text-apollo-green-light mx-auto mb-1" />
          <div className="text-lg font-bold text-apollo-green-light">{fuelSavings.toFixed(0)}%</div>
          <div className="text-xs text-gray-500">fuel saved</div>
        </div>
        <div className="bg-apollo-light rounded-lg p-3 text-center">
          <Waves className="w-5 h-5 text-apollo-green mx-auto mb-1" />
          <div className="text-lg font-bold text-apollo-dark">{co2Emissions.toFixed(0)}</div>
          <div className="text-xs text-gray-500">t CO₂/day</div>
        </div>
        <div className="bg-apollo-light rounded-lg p-3 text-center">
          <Euro className="w-5 h-5 text-apollo-green mx-auto mb-1" />
          <div className="text-lg font-bold text-apollo-green">{euaRequired.toFixed(1)}</div>
          <div className="text-xs text-gray-500">EUA/day</div>
        </div>
      </div>

      {/* Insight callout */}
      <div className="mt-4 p-3 bg-apollo-beige border border-gray-200 rounded-lg">
        <p className="text-sm text-apollo-dark">
          <span className="font-semibold">The Cubic Law:</span> Reducing speed from 22 to {speed} knots
          {fuelSavings > 0 ? (
            <> saves <span className="font-bold text-apollo-green-light">{fuelSavings.toFixed(0)}%</span> fuel. With {fuelType} ({EMISSION_FACTORS[fuelType]} tCO₂/tFuel) at {(phaseInRate * 100).toFixed(0)}% EU ETS coverage, you need {euaRequired.toFixed(1)} EUA/day.</>
          ) : (
            <> - you're at maximum speed.</>
          )}
        </p>
      </div>
    </div>
  );
}

// Carbon Allocation Engine Demo Component
function AllocationEngineDemo() {
  // Cargo items with weight (tons) and volume (lane meters)
  const [cargoItems, setCargoItems] = useState([
    { id: 1, name: 'Heavy Truck', icon: 'truck', weight: 25, volume: 17 },
    { id: 2, name: 'Empty Trailer', icon: 'container', weight: 8, volume: 17 },
    { id: 3, name: 'Passenger Car', icon: 'car', weight: 1.5, volume: 5 },
  ]);

  // Total voyage carbon cost
  const totalCarbonCost = 15000; // EUR

  // Calculate totals
  const totals = useMemo(() => {
    const totalWeight = cargoItems.reduce((sum, item) => sum + item.weight, 0);
    const totalVolume = cargoItems.reduce((sum, item) => sum + item.volume, 0);
    return { totalWeight, totalVolume };
  }, [cargoItems]);

  // Calculate allocation for each cargo item
  const allocations = useMemo(() => {
    return cargoItems.map(item => {
      // Weight-based share (50%)
      const weightShare = totals.totalWeight > 0
        ? (item.weight / totals.totalWeight) * 0.5
        : 0;

      // Volume-based share (50%)
      const volumeShare = totals.totalVolume > 0
        ? (item.volume / totals.totalVolume) * 0.5
        : 0;

      // Total hybrid share
      const hybridShare = weightShare + volumeShare;

      // Cost allocation
      const allocatedCost = hybridShare * totalCarbonCost;

      // Compare with pure weight-only allocation
      const pureWeightShare = totals.totalWeight > 0
        ? item.weight / totals.totalWeight
        : 0;
      const pureWeightCost = pureWeightShare * totalCarbonCost;

      return {
        ...item,
        weightShare: weightShare * 100,
        volumeShare: volumeShare * 100,
        hybridShare: hybridShare * 100,
        allocatedCost,
        pureWeightCost,
        difference: allocatedCost - pureWeightCost,
      };
    });
  }, [cargoItems, totals, totalCarbonCost]);

  const updateCargoWeight = (id: number, weight: number) => {
    setCargoItems(items =>
      items.map(item => item.id === id ? { ...item, weight: Math.max(0, weight) } : item)
    );
  };

  const updateCargoVolume = (id: number, volume: number) => {
    setCargoItems(items =>
      items.map(item => item.id === id ? { ...item, volume: Math.max(0, volume) } : item)
    );
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'truck': return <Truck className="w-5 h-5" />;
      case 'container': return <Container className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-apollo-dark flex items-center gap-2">
          <Scale className="w-5 h-5 text-apollo-green" />
          Allocation Calculator
        </h4>
        <span className="text-xs font-mono text-apollo-green bg-apollo-light px-2 py-1 rounded">
          50% Weight + 50% Volume
        </span>
      </div>

      {/* Cargo Inputs */}
      <div className="space-y-4 mb-6">
        {cargoItems.map((item) => (
          <div key={item.id} className="bg-apollo-light/50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-apollo-green/10 rounded-lg flex items-center justify-center text-apollo-green">
                {getIcon(item.icon)}
              </div>
              <span className="font-medium text-apollo-dark">{item.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Weight className="w-3 h-3" /> Weight (tons)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={item.weight}
                  onChange={(e) => updateCargoWeight(item.id, parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-apollo-green"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Ruler className="w-3 h-3" /> Volume (lane m)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={item.volume}
                  onChange={(e) => updateCargoVolume(item.id, parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-apollo-green"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Allocation Results */}
      <div className="bg-apollo-light rounded-lg p-4 mb-4">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
          Carbon Cost Allocation (Total: €{totalCarbonCost.toLocaleString()})
        </div>
        <div className="space-y-3">
          {allocations.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-apollo-green/10 rounded flex items-center justify-center text-apollo-green flex-shrink-0">
                {getIcon(item.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-apollo-dark truncate">{item.name}</span>
                  <span className="text-sm font-bold text-apollo-green">€{item.allocatedCost.toFixed(0)}</span>
                </div>
                {/* Stacked bar showing weight vs volume contribution */}
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
                  <div
                    className="bg-apollo-green h-full transition-all duration-300"
                    style={{ width: `${item.weightShare}%` }}
                    title={`Weight: ${item.weightShare.toFixed(1)}%`}
                  />
                  <div
                    className="bg-apollo-green-light h-full transition-all duration-300"
                    style={{ width: `${item.volumeShare}%` }}
                    title={`Volume: ${item.volumeShare.toFixed(1)}%`}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Weight: {item.weightShare.toFixed(1)}%</span>
                  <span>Volume: {item.volumeShare.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs mb-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-apollo-green rounded" />
          <span className="text-gray-500">Weight Share</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-apollo-green-light rounded" />
          <span className="text-gray-500">Volume Share</span>
        </div>
      </div>

      {/* Insight: The Ro-Ro Paradox */}
      <div className="p-3 bg-apollo-beige border border-gray-200 rounded-lg">
        <p className="text-sm text-apollo-dark">
          <span className="font-semibold">The Ro-Ro Paradox:</span> An empty trailer uses the same deck space as a heavy truck but weighs much less.
          Pure weight-based allocation would charge the empty trailer only €{allocations.find(a => a.name === 'Empty Trailer')?.pureWeightCost.toFixed(0) || '0'},
          but hybrid allocation fairly charges €{allocations.find(a => a.name === 'Empty Trailer')?.allocatedCost.toFixed(0) || '0'} for the space it occupies.
        </p>
      </div>

      {/* ISO 14083 Footnote */}
      <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-500">
          <span className="font-medium">Note:</span> Volume measured in lane meters (Ro-Ro industry standard).
          ISO 14083 permits either lane meters or CBM (cubic meters) for volume-based allocation.
        </p>
      </div>
    </div>
  );
}

// EUA Wallet Demo Component - FIFO Token Inventory
interface TokenLot {
  id: number;
  date: string;
  quantity: number;
  originalQuantity: number;
  pricePerUnit: number;
  consumed: number;
}

function EUAWalletDemo() {
  const currentMarketPrice = 73.50; // EUR per EUA

  const [tokenLots, setTokenLots] = useState<TokenLot[]>([
    { id: 1, date: '2024-01', quantity: 500, originalQuantity: 500, pricePerUnit: 65.20, consumed: 0 },
    { id: 2, date: '2024-03', quantity: 750, originalQuantity: 750, pricePerUnit: 68.40, consumed: 0 },
    { id: 3, date: '2024-06', quantity: 400, originalQuantity: 400, pricePerUnit: 71.80, consumed: 0 },
    { id: 4, date: '2024-09', quantity: 600, originalQuantity: 600, pricePerUnit: 72.50, consumed: 0 },
  ]);

  const [consumeAmount, setConsumeAmount] = useState(200);

  // Calculate portfolio metrics
  const metrics = useMemo(() => {
    const totalTokens = tokenLots.reduce((sum, lot) => sum + lot.quantity, 0);
    const totalCostBasis = tokenLots.reduce((sum, lot) => sum + (lot.quantity * lot.pricePerUnit), 0);
    const avgCostBasis = totalTokens > 0 ? totalCostBasis / totalTokens : 0;
    const marketValue = totalTokens * currentMarketPrice;
    const unrealizedGain = marketValue - totalCostBasis;
    const totalConsumed = tokenLots.reduce((sum, lot) => sum + lot.consumed, 0);

    return { totalTokens, totalCostBasis, avgCostBasis, marketValue, unrealizedGain, totalConsumed };
  }, [tokenLots, currentMarketPrice]);

  // Simulate FIFO consumption
  const handleConsume = () => {
    let remaining = consumeAmount;
    const newLots = tokenLots.map(lot => {
      if (remaining <= 0 || lot.quantity <= 0) return lot;

      const toConsume = Math.min(remaining, lot.quantity);
      remaining -= toConsume;

      return {
        ...lot,
        quantity: lot.quantity - toConsume,
        consumed: lot.consumed + toConsume,
      };
    });

    setTokenLots(newLots);
  };

  // Reset to initial state
  const handleReset = () => {
    setTokenLots([
      { id: 1, date: '2024-01', quantity: 500, originalQuantity: 500, pricePerUnit: 65.20, consumed: 0 },
      { id: 2, date: '2024-03', quantity: 750, originalQuantity: 750, pricePerUnit: 68.40, consumed: 0 },
      { id: 3, date: '2024-06', quantity: 400, originalQuantity: 400, pricePerUnit: 71.80, consumed: 0 },
      { id: 4, date: '2024-09', quantity: 600, originalQuantity: 600, pricePerUnit: 72.50, consumed: 0 },
    ]);
  };

  // Calculate FIFO cost for a hypothetical consumption
  const fifoConsumptionCost = useMemo(() => {
    let remaining = consumeAmount;
    let totalCost = 0;

    for (const lot of tokenLots) {
      if (remaining <= 0 || lot.quantity <= 0) continue;
      const toConsume = Math.min(remaining, lot.quantity);
      totalCost += toConsume * lot.pricePerUnit;
      remaining -= toConsume;
    }

    return totalCost;
  }, [consumeAmount, tokenLots]);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-apollo-dark flex items-center gap-2">
          <Wallet className="w-5 h-5 text-apollo-green" />
          EUA Token Wallet
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Market:</span>
          <span className="text-sm font-bold text-apollo-green">€{currentMarketPrice.toFixed(2)}/EUA</span>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-apollo-light rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-apollo-green mb-1">
            <Layers className="w-3 h-3" />
            Total Balance
          </div>
          <div className="text-xl font-bold text-apollo-dark">{metrics.totalTokens.toLocaleString()}</div>
          <div className="text-xs text-gray-500">EUA tokens</div>
        </div>
        <div className="bg-apollo-light rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-apollo-green mb-1">
            <Euro className="w-3 h-3" />
            Market Value
          </div>
          <div className="text-xl font-bold text-apollo-dark">€{metrics.marketValue.toLocaleString()}</div>
          <div className={`text-xs ${metrics.unrealizedGain >= 0 ? 'text-apollo-green-light' : 'text-red-600'}`}>
            {metrics.unrealizedGain >= 0 ? '+' : ''}€{metrics.unrealizedGain.toLocaleString()} unrealized
          </div>
        </div>
      </div>

      {/* FIFO Inventory Visualization */}
      <div className="mb-6">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Database className="w-3 h-3" />
          FIFO Token Lots (First In → First Out)
        </div>
        <div className="space-y-2">
          {tokenLots.map((lot, index) => {
            const percentRemaining = lot.originalQuantity > 0 ? (lot.quantity / lot.originalQuantity) * 100 : 0;
            const isFullyConsumed = lot.quantity === 0;
            const isPartiallyConsumed = lot.consumed > 0 && lot.quantity > 0;

            return (
              <div
                key={lot.id}
                className={`relative rounded-lg p-3 border transition-all ${
                  isFullyConsumed
                    ? 'bg-gray-100 border-gray-200 opacity-50'
                    : isPartiallyConsumed
                    ? 'bg-apollo-beige border-apollo-green/30'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400">#{index + 1}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {lot.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${isFullyConsumed ? 'text-gray-400' : 'text-apollo-dark'}`}>
                      {lot.quantity.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">/ {lot.originalQuantity.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress bar showing consumption */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isFullyConsumed ? 'bg-gray-400' : 'bg-apollo-green'
                    }`}
                    style={{ width: `${percentRemaining}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Cost basis: <span className="font-medium">€{lot.pricePerUnit.toFixed(2)}</span>
                  </span>
                  {lot.consumed > 0 && (
                    <span className="text-apollo-green font-medium">
                      {lot.consumed} consumed
                    </span>
                  )}
                </div>

                {/* FIFO indicator arrow */}
                {index === 0 && lot.quantity > 0 && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-apollo-green rounded-full flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Consumption Simulator */}
      <div className="bg-apollo-light rounded-lg p-4 mb-4">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
          Simulate Token Consumption
        </div>
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => setConsumeAmount(Math.max(50, consumeAmount - 50))}
            className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex-1 text-center">
            <span className="text-2xl font-bold text-apollo-dark">{consumeAmount}</span>
            <span className="text-sm text-gray-500 ml-1">EUA</span>
          </div>
          <button
            onClick={() => setConsumeAmount(Math.min(metrics.totalTokens, consumeAmount + 50))}
            className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="text-center text-sm text-gray-600 mb-3">
          FIFO Cost: <span className="font-bold text-apollo-green">€{fifoConsumptionCost.toLocaleString()}</span>
          <span className="text-xs text-gray-400 ml-1">
            (avg €{consumeAmount > 0 ? (fifoConsumptionCost / consumeAmount).toFixed(2) : '0.00'}/EUA)
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleConsume}
            disabled={consumeAmount > metrics.totalTokens || metrics.totalTokens === 0}
            className="flex-1 bg-apollo-green text-white py-2 rounded-lg font-medium hover:bg-apollo-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Consume Tokens
          </button>
          <button
            onClick={handleReset}
            className="px-4 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Insight */}
      <div className="p-3 bg-apollo-beige border border-gray-200 rounded-lg">
        <p className="text-sm text-apollo-dark">
          <span className="font-semibold">FIFO Accounting:</span> The oldest tokens (lowest cost basis of €{tokenLots[0]?.pricePerUnit.toFixed(2) || '0'})
          are consumed first. This ensures regulatory compliance and provides accurate cost tracking for your carbon expense reporting.
        </p>
      </div>

      {/* Production Precision Disclaimer */}
      <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-500">
          <span className="font-medium">Note:</span> Production system uses Decimal.js for arbitrary-precision financial calculations
          to eliminate floating-point errors. This demo uses JavaScript numbers for simplicity.
        </p>
      </div>
    </div>
  );
}

// AI Audit Agent Demo Component
interface InvoiceField {
  label: string;
  invoiceValue: string;
  systemValue: string;
  invoiceNumeric: number;  // Numeric value for calculation
  systemNumeric: number;   // Numeric value for calculation
}

// Calculate signed discrepancy: positive = overcharge, negative = undercharge
function calculateDiscrepancy(invoice: number, system: number): number {
  if (system === 0) return 0;
  return ((invoice - system) / system) * 100;
}

// Get status based on signed discrepancy (only flag positive = overcharges)
function getDiscrepancyStatus(discrepancy: number): 'green' | 'amber' | 'red' {
  // Negative discrepancy = undercharge = always OK
  if (discrepancy <= 0) return 'green';
  // Positive discrepancy thresholds from audit rules
  if (discrepancy < 2) return 'green';    // <2% OK
  if (discrepancy < 5) return 'amber';    // 2-5% Review
  return 'red';                           // >5% Flag
}

interface AuditStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'complete';
}

function AIAuditAgentDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);

  // Invoice data with numeric values for signed discrepancy calculation
  const invoiceFieldsRaw: InvoiceField[] = [
    { label: 'Fuel Consumed', invoiceValue: '245.8 MT', systemValue: '243.2 MT', invoiceNumeric: 245.8, systemNumeric: 243.2 },
    { label: 'Voyage Distance', invoiceValue: '1,847 nm', systemValue: '1,852 nm', invoiceNumeric: 1847, systemNumeric: 1852 },
    { label: 'Port Charges', invoiceValue: '€12,450', systemValue: '€11,200', invoiceNumeric: 12450, systemNumeric: 11200 },
    { label: 'Carbon Surcharge', invoiceValue: '€8,920', systemValue: '€8,756', invoiceNumeric: 8920, systemNumeric: 8756 },
    { label: 'Bunker Price', invoiceValue: '€542/MT', systemValue: '€538/MT', invoiceNumeric: 542, systemNumeric: 538 },
    { label: 'Agency Fees', invoiceValue: '€3,200', systemValue: '€2,850', invoiceNumeric: 3200, systemNumeric: 2850 },
  ];

  // Calculate discrepancies with proper signed values
  const invoiceFields = invoiceFieldsRaw.map(field => {
    const discrepancy = calculateDiscrepancy(field.invoiceNumeric, field.systemNumeric);
    return {
      ...field,
      discrepancy,
      status: getDiscrepancyStatus(discrepancy),
    };
  });

  const [steps, setSteps] = useState<AuditStep[]>([
    { id: 1, title: 'Document Upload', description: 'PDF invoice received', status: 'pending' },
    { id: 2, title: 'Text Extraction', description: 'Parsing invoice data...', status: 'pending' },
    { id: 3, title: 'AI Analysis', description: 'Matching fields to system...', status: 'pending' },
    { id: 4, title: 'Discrepancy Check', description: 'Calculating variances...', status: 'pending' },
    { id: 5, title: 'Report Generated', description: 'Audit complete', status: 'pending' },
  ]);

  const runAudit = () => {
    setIsRunning(true);
    setAuditComplete(false);
    setCurrentStep(0);
    setSteps(steps.map(s => ({ ...s, status: 'pending' })));
  };

  const resetAudit = () => {
    setIsRunning(false);
    setAuditComplete(false);
    setCurrentStep(0);
    setSteps(steps.map(s => ({ ...s, status: 'pending' })));
  };

  useEffect(() => {
    if (!isRunning) return;

    if (currentStep < steps.length) {
      // Mark current step as processing
      setSteps(prev => prev.map((s, i) =>
        i === currentStep ? { ...s, status: 'processing' } : s
      ));

      // After delay, mark as complete and move to next
      const timer = setTimeout(() => {
        setSteps(prev => prev.map((s, i) =>
          i === currentStep ? { ...s, status: 'complete' } : s
        ));
        setCurrentStep(prev => prev + 1);
      }, 800);

      return () => clearTimeout(timer);
    } else {
      setIsRunning(false);
      setAuditComplete(true);
    }
  }, [currentStep, isRunning, steps.length]);

  const getStatusColor = (status: 'green' | 'amber' | 'red') => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'amber': return 'bg-amber-500';
      case 'red': return 'bg-red-500';
    }
  };

  const getStatusBg = (status: 'green' | 'amber' | 'red') => {
    switch (status) {
      case 'green': return 'bg-green-50 border-green-200';
      case 'amber': return 'bg-amber-50 border-amber-200';
      case 'red': return 'bg-red-50 border-red-200';
    }
  };

  const summaryStats = {
    total: invoiceFields.length,
    green: invoiceFields.filter(f => f.status === 'green').length,
    amber: invoiceFields.filter(f => f.status === 'amber').length,
    red: invoiceFields.filter(f => f.status === 'red').length,
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-apollo-dark flex items-center gap-2">
          <Brain className="w-5 h-5 text-apollo-green" />
          AI Invoice Auditor
        </h4>
        <span className="text-xs font-mono text-apollo-green bg-apollo-light px-2 py-1 rounded">
          Hybrid AI + Rules
        </span>
      </div>

      {/* Invoice Preview */}
      <div className="bg-apollo-light rounded-lg p-4 mb-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-apollo-green/10 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-apollo-green" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-apollo-dark">Owner Invoice #INV-2024-0847</div>
            <div className="text-xs text-gray-500">Vessel: MV Baltic Carrier | Voyage: Rotterdam → Helsinki</div>
          </div>
          {!isRunning && !auditComplete && (
            <button
              onClick={runAudit}
              className="flex items-center gap-2 bg-apollo-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-apollo-green/90 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Run Audit
            </button>
          )}
          {auditComplete && (
            <button
              onClick={resetAudit}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>

        {/* Processing Steps */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                step.status === 'complete'
                  ? 'bg-apollo-green-light/20 text-apollo-dark'
                  : step.status === 'processing'
                  ? 'bg-apollo-green/10 text-apollo-green'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {step.status === 'processing' && (
                <Loader2 className="w-3 h-3 animate-spin" />
              )}
              {step.status === 'complete' && (
                <CheckCircle className="w-3 h-3" />
              )}
              {step.status === 'pending' && (
                <span className="w-3 h-3 rounded-full bg-gray-300 text-[8px] flex items-center justify-center">
                  {index + 1}
                </span>
              )}
              {step.title}
            </div>
          ))}
        </div>
      </div>

      {/* Audit Results */}
      {auditComplete && (
        <div className="space-y-4 animate-in fade-in duration-500">
          {/* Summary Bar */}
          <div className="flex items-center gap-4 p-3 bg-slate-100 rounded-lg">
            <div className="text-sm font-medium text-gray-700">Audit Summary:</div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">{summaryStats.green} OK</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-amber-500 rounded-full" />
              <span className="text-sm text-gray-600">{summaryStats.amber} Review</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm text-gray-600">{summaryStats.red} Flag</span>
            </div>
          </div>

          {/* Field Comparison */}
          <div className="space-y-2">
            {invoiceFields.map((field, index) => (
              <div
                key={index}
                className={`rounded-lg p-3 border ${getStatusBg(field.status)} transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(field.status)}`} />
                    <span className="font-medium text-apollo-dark text-sm">{field.label}</span>
                    {/* Show overcharge/undercharge label for significant discrepancies */}
                    {Math.abs(field.discrepancy) >= 2 && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        field.discrepancy > 0
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {field.discrepancy > 0 ? 'overcharge' : 'undercharge'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Invoice</div>
                      <div className="font-mono">{field.invoiceValue}</div>
                    </div>
                    <div className="text-gray-300">→</div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">System</div>
                      <div className="font-mono">{field.systemValue}</div>
                    </div>
                    <div className={`text-right min-w-[70px] font-bold ${
                      field.discrepancy > 5 ? 'text-red-600' :
                      field.discrepancy > 2 ? 'text-amber-600' :
                      field.discrepancy < 0 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {field.discrepancy > 0 ? '+' : ''}{field.discrepancy.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Required */}
          {summaryStats.red > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <span className="font-semibold">Action Required:</span> {summaryStats.red} line items exceed the 5% threshold.
                Review Port Charges and Agency Fees before approving payment.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Initial State - No audit run yet */}
      {!isRunning && !auditComplete && (
        <div className="text-center py-8 text-gray-500">
          <Upload className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Click "Run Audit" to analyze the invoice</p>
          <p className="text-xs mt-1 opacity-75">AI extracts data and compares against system records</p>
        </div>
      )}

      {/* Processing State */}
      {isRunning && (
        <div className="text-center py-8">
          <Loader2 className="w-12 h-12 mx-auto mb-3 text-apollo-green animate-spin" />
          <p className="text-sm text-gray-600">Processing invoice...</p>
          <p className="text-xs text-gray-400 mt-1">{steps[currentStep]?.description}</p>
        </div>
      )}

      {/* Traffic Light Legend */}
      <div className="mt-6 p-3 bg-apollo-beige border border-gray-200 rounded-lg">
        <p className="text-sm text-apollo-dark">
          <span className="font-semibold">Signed Discrepancy System:</span>{' '}
          <span className="text-apollo-green">Negative = undercharge (OK)</span>,{' '}
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full" /> +0-2%</span> auto-approve,{' '}
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full" /> +2-5%</span> review,{' '}
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full" /> &gt;+5%</span> investigate overcharge.
        </p>
      </div>
    </div>
  );
}

// Interactive Voyage Journey Component - Shows value chain with real mathematics
function VoyageJourney() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMath, setShowMath] = useState(false);

  // Voyage Constants
  const VOYAGE = {
    id: 'V2025-047',
    route: 'Rotterdam → Dublin',
    distance: 580, // nautical miles
    scheduledWindow: 32, // hours
    maxSpeed: 22, // knots
    baseFuelAtMaxSpeed: 100, // MT/day
    bunkerPrice: 541, // EUR/MT
    euaPrice: 73.50, // EUR/token
    phaseIn: 0.70, // 70% for 2025
    emissionFactor: 3.791, // VLSFO WTW
  };

  // Step 1 calculations - Physics Engine
  const step1 = useMemo(() => {
    const fullSpeedDuration = VOYAGE.distance / VOYAGE.maxSpeed; // 26.4 hrs
    const fullSpeedFuel = (fullSpeedDuration / 24) * VOYAGE.baseFuelAtMaxSpeed; // 110 MT

    const optimizedSpeed = VOYAGE.distance / VOYAGE.scheduledWindow; // 18.125 kn
    const speedRatio = optimizedSpeed / VOYAGE.maxSpeed; // 0.823
    const fuelMultiplier = Math.pow(speedRatio, 3); // 0.558
    const optimizedFuel = fullSpeedFuel * fuelMultiplier; // 61.2 MT

    const fuelSaved = fullSpeedFuel - optimizedFuel;
    const fuelCostSaved = fuelSaved * VOYAGE.bunkerPrice;
    const co2Avoided = fuelSaved * VOYAGE.emissionFactor;
    const euaCostAvoided = co2Avoided * VOYAGE.euaPrice * VOYAGE.phaseIn;

    return {
      fullSpeedDuration: fullSpeedDuration.toFixed(1),
      fullSpeedFuel: fullSpeedFuel.toFixed(1),
      optimizedSpeed: optimizedSpeed.toFixed(1),
      optimizedFuel: optimizedFuel.toFixed(1),
      speedRatio: speedRatio.toFixed(3),
      fuelMultiplier: fuelMultiplier.toFixed(3),
      fuelSaved: fuelSaved.toFixed(1),
      fuelCostSaved: Math.round(fuelCostSaved),
      co2Avoided: Math.round(co2Avoided),
      euaCostAvoided: Math.round(euaCostAvoided),
      totalBenefit: Math.round(fuelCostSaved + euaCostAvoided),
    };
  }, []);

  // Step 2 calculations - Carbon Allocation
  const step2 = useMemo(() => {
    const totalCO2 = parseFloat(step1.optimizedFuel) * VOYAGE.emissionFactor; // 232 tCO2
    const euScope = 0.5; // EU ↔ Non-EU voyage
    const billableEmissions = totalCO2 * euScope; // 116 tCO2
    const euaCost = billableEmissions * VOYAGE.euaPrice; // €8,526

    // Cargo breakdown
    const cargo = [
      { name: '15 Heavy Trucks', weight: 375, volume: 255, count: 15 },
      { name: '20 Empty Trailers', weight: 160, volume: 340, count: 20 },
      { name: '10 Passenger Cars', weight: 15, volume: 50, count: 10 },
    ];
    const totalWeight = cargo.reduce((sum, c) => sum + c.weight, 0);
    const totalVolume = cargo.reduce((sum, c) => sum + c.volume, 0);

    const allocations = cargo.map(c => {
      const weightShare = (c.weight / totalWeight) * 0.5;
      const volumeShare = (c.volume / totalVolume) * 0.5;
      const hybridShare = weightShare + volumeShare;
      const hybridCost = hybridShare * euaCost;
      const weightOnlyCost = (c.weight / totalWeight) * euaCost;
      return {
        ...c,
        weightShare: (weightShare * 100).toFixed(1),
        volumeShare: (volumeShare * 100).toFixed(1),
        hybridShare: (hybridShare * 100).toFixed(1),
        hybridCost: Math.round(hybridCost),
        weightOnlyCost: Math.round(weightOnlyCost),
        difference: Math.round(hybridCost - weightOnlyCost),
      };
    });

    const revenueProtected = Math.abs(allocations[1].difference); // Empty trailers pay more

    return {
      totalCO2: Math.round(totalCO2),
      billableEmissions: Math.round(billableEmissions),
      euaCost: Math.round(euaCost),
      cargo,
      allocations,
      totalWeight,
      totalVolume,
      revenueProtected,
      totalBenefit: revenueProtected + 500, // + dispute avoidance estimate
    };
  }, [step1]);

  // Step 3 calculations - EUA Wallet FIFO
  const step3 = useMemo(() => {
    const tokensNeeded = step2.billableEmissions;
    const portfolio = [
      { lot: 1, date: 'Jan 2024', tokens: 80, cost: 65.20 },
      { lot: 2, date: 'Mar 2024', tokens: 120, cost: 68.40 },
      { lot: 3, date: 'Jun 2024', tokens: 75, cost: 71.80 },
    ];

    // FIFO consumption
    let remaining = tokensNeeded;
    let totalCostBasis = 0;
    const consumption: { lot: number; tokens: number; cost: number; subtotal: number }[] = [];

    for (const p of portfolio) {
      if (remaining <= 0) break;
      const take = Math.min(remaining, p.tokens);
      const subtotal = take * p.cost;
      consumption.push({ lot: p.lot, tokens: take, cost: p.cost, subtotal });
      totalCostBasis += subtotal;
      remaining -= take;
    }

    const marketValue = tokensNeeded * VOYAGE.euaPrice;
    const inventoryGain = marketValue - totalCostBasis;
    const avgCost = totalCostBasis / tokensNeeded;

    return {
      tokensNeeded,
      portfolio,
      consumption,
      totalCostBasis: Math.round(totalCostBasis),
      marketValue: Math.round(marketValue),
      inventoryGain: Math.round(inventoryGain),
      avgCost: avgCost.toFixed(2),
      totalBenefit: Math.round(inventoryGain),
    };
  }, [step2]);

  // Step 4 calculations - AI Audit
  const step4 = useMemo(() => {
    const systemFuel = parseFloat(step1.optimizedFuel);
    const invoiceFuel = 64.8; // Claimed by owner
    const fuelDiscrepancy = ((invoiceFuel - systemFuel) / systemFuel) * 100;

    const systemPort = 3800;
    const invoicePort = 4200;
    const portDiscrepancy = ((invoicePort - systemPort) / systemPort) * 100;

    const fuelOvercharge = (invoiceFuel - systemFuel) * VOYAGE.bunkerPrice;
    const portOvercharge = invoicePort - systemPort;
    const totalOvercharge = fuelOvercharge + portOvercharge;

    return {
      items: [
        { field: 'Fuel Consumed', invoice: '64.8 MT', system: `${systemFuel.toFixed(1)} MT`, discrepancy: fuelDiscrepancy.toFixed(1), status: 'red' },
        { field: 'Bunker Price', invoice: '€541/MT', system: '€538/MT', discrepancy: '0.6', status: 'green' },
        { field: 'Port Charges', invoice: '€4,200', system: '€3,800', discrepancy: portDiscrepancy.toFixed(1), status: 'red' },
      ],
      fuelOvercharge: Math.round(fuelOvercharge),
      portOvercharge,
      totalOvercharge: Math.round(totalOvercharge),
      totalBenefit: Math.round(totalOvercharge),
    };
  }, [step1]);

  // Total benefits
  const totalBenefits = useMemo(() => {
    return {
      voyage: step1.totalBenefit + step2.totalBenefit + step3.totalBenefit + step4.totalBenefit,
      annual: (step1.totalBenefit + step2.totalBenefit + step3.totalBenefit + step4.totalBenefit) * 500, // 500 voyages
      hours: 6, // 4 + 2 hours saved
    };
  }, [step1, step2, step3, step4]);

  // Auto-advance steps when playing
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= 4) {
          setIsPlaying(false);
          return 4;
        }
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const steps = [
    { id: 0, title: 'Voyage Setup', icon: Ship, benefit: 0 },
    { id: 1, title: 'Physics Engine', icon: Gauge, benefit: step1.totalBenefit },
    { id: 2, title: 'Carbon Allocation', icon: Scale, benefit: step2.totalBenefit },
    { id: 3, title: 'EUA Wallet', icon: Wallet, benefit: step3.totalBenefit },
    { id: 4, title: 'AI Audit', icon: Brain, benefit: step4.totalBenefit },
  ];

  const runningTotal = useMemo(() => {
    return steps.slice(0, currentStep + 1).reduce((sum, s) => sum + s.benefit, 0);
  }, [currentStep, steps]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-apollo-dark p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-apollo-green-light text-sm font-mono mb-1">
              <Ship className="w-4 h-4" />
              Voyage {VOYAGE.id}
            </div>
            <h3 className="text-xl font-serif font-bold text-white">
              Interactive Value Chain Journey
            </h3>
          </div>
          <div className="flex items-center gap-3">
            {/* Running Total */}
            <div className="bg-apollo-green-light/20 rounded-lg px-4 py-2 text-right">
              <div className="text-xs text-apollo-green-light">Value Created</div>
              <div className="text-xl font-bold text-white">€{runningTotal.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="flex items-center gap-4 text-slate-400 text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {VOYAGE.route}
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            {VOYAGE.distance} nm
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {VOYAGE.scheduledWindow} hrs window
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-apollo-light px-6 py-4">
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 flex items-center">
              <button
                onClick={() => { setCurrentStep(index); setIsPlaying(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all w-full ${
                  index === currentStep
                    ? 'bg-apollo-green text-white'
                    : index < currentStep
                    ? 'bg-apollo-green-light/20 text-apollo-green'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <step.icon className="w-4 h-4" />
                <span className="text-xs font-medium hidden md:inline">{step.title}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`w-4 h-0.5 mx-1 ${index < currentStep ? 'bg-apollo-green' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 bg-apollo-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-apollo-green/90 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play Journey'}
            </button>
            <button
              onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
              className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <RotateCw className="w-4 h-4" />
              Reset
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showMath}
              onChange={(e) => setShowMath(e.target.checked)}
              className="rounded border-gray-300 text-apollo-green focus:ring-apollo-green"
            />
            Show calculations
          </label>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6">
        {/* Step 0: Voyage Setup */}
        {currentStep === 0 && (
          <div className="animate-in fade-in duration-500">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-apollo-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ship className="w-8 h-8 text-apollo-green" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-apollo-dark mb-3">
                Follow Voyage {VOYAGE.id}
              </h4>
              <p className="text-gray-600 mb-6">
                Watch how Carbon-Wise creates <span className="font-semibold">€{totalBenefits.voyage.toLocaleString()}</span> in value
                for a single Ro-Ro voyage carrying 45 cargo units from Rotterdam to Dublin.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-apollo-light rounded-xl p-4">
                  <div className="text-2xl font-bold text-apollo-dark">45</div>
                  <div className="text-xs text-gray-500">Cargo Units</div>
                </div>
                <div className="bg-apollo-light rounded-xl p-4">
                  <div className="text-2xl font-bold text-apollo-dark">580</div>
                  <div className="text-xs text-gray-500">Nautical Miles</div>
                </div>
                <div className="bg-apollo-light rounded-xl p-4">
                  <div className="text-2xl font-bold text-apollo-dark">4</div>
                  <div className="text-xs text-gray-500">Value Modules</div>
                </div>
              </div>
              <button
                onClick={() => { setCurrentStep(1); setIsPlaying(true); }}
                className="mt-6 inline-flex items-center gap-2 bg-apollo-green text-white px-6 py-3 rounded-xl font-medium hover:bg-apollo-green/90 transition-colors"
              >
                <Play className="w-5 h-5" />
                Start Journey
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Physics Engine */}
        {currentStep === 1 && (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-apollo-green/10 rounded-xl flex items-center justify-center">
                <Gauge className="w-6 h-6 text-apollo-green" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-apollo-dark">Step 1: Physics Engine</h4>
                <p className="text-sm text-gray-500">Speed vs. Fuel Optimization</p>
              </div>
              <div className="ml-auto bg-apollo-green-light/20 rounded-lg px-4 py-2">
                <div className="text-xs text-apollo-green">Benefit</div>
                <div className="text-xl font-bold text-apollo-green">€{step1.totalBenefit.toLocaleString()}</div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="text-sm font-medium text-red-700 mb-2">❌ Full Speed</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Speed:</span><span className="font-mono">{VOYAGE.maxSpeed} kn</span></div>
                  <div className="flex justify-between"><span>Duration:</span><span className="font-mono">{step1.fullSpeedDuration} hrs</span></div>
                  <div className="flex justify-between"><span>Fuel:</span><span className="font-mono font-bold text-red-600">{step1.fullSpeedFuel} MT</span></div>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="text-sm font-medium text-green-700 mb-2">✓ Optimized (JIT)</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Speed:</span><span className="font-mono">{step1.optimizedSpeed} kn</span></div>
                  <div className="flex justify-between"><span>Duration:</span><span className="font-mono">{VOYAGE.scheduledWindow} hrs</span></div>
                  <div className="flex justify-between"><span>Fuel:</span><span className="font-mono font-bold text-green-600">{step1.optimizedFuel} MT</span></div>
                </div>
              </div>
            </div>

            {/* Math Details */}
            {showMath && (
              <div className="bg-slate-50 rounded-xl p-4 mb-6 font-mono text-sm">
                <div className="text-gray-500 mb-2">// Cubic Law Calculation</div>
                <div>Speed Ratio = {step1.optimizedSpeed} / {VOYAGE.maxSpeed} = <span className="text-apollo-green font-bold">{step1.speedRatio}</span></div>
                <div>Fuel Multiplier = {step1.speedRatio}³ = <span className="text-apollo-green font-bold">{step1.fuelMultiplier}</span></div>
                <div>Optimized Fuel = {step1.fullSpeedFuel} × {step1.fuelMultiplier} = <span className="text-apollo-green font-bold">{step1.optimizedFuel} MT</span></div>
              </div>
            )}

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-apollo-light rounded-lg p-3 text-center">
                <Fuel className="w-5 h-5 text-apollo-green mx-auto mb-1" />
                <div className="text-lg font-bold text-apollo-dark">{step1.fuelSaved} MT</div>
                <div className="text-xs text-gray-500">Fuel Saved</div>
              </div>
              <div className="bg-apollo-light rounded-lg p-3 text-center">
                <Euro className="w-5 h-5 text-apollo-green mx-auto mb-1" />
                <div className="text-lg font-bold text-apollo-dark">€{step1.fuelCostSaved.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Fuel Cost Saved</div>
              </div>
              <div className="bg-apollo-light rounded-lg p-3 text-center">
                <Leaf className="w-5 h-5 text-apollo-green mx-auto mb-1" />
                <div className="text-lg font-bold text-apollo-dark">{step1.co2Avoided} t</div>
                <div className="text-xs text-gray-500">CO₂ Avoided</div>
              </div>
              <div className="bg-apollo-light rounded-lg p-3 text-center">
                <Wallet className="w-5 h-5 text-apollo-green mx-auto mb-1" />
                <div className="text-lg font-bold text-apollo-dark">€{step1.euaCostAvoided.toLocaleString()}</div>
                <div className="text-xs text-gray-500">EUA Cost Avoided</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Carbon Allocation */}
        {currentStep === 2 && (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-apollo-green/10 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-apollo-green" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-apollo-dark">Step 2: Carbon Allocation</h4>
                <p className="text-sm text-gray-500">Fair Cost Distribution (ISO 14083)</p>
              </div>
              <div className="ml-auto bg-apollo-green-light/20 rounded-lg px-4 py-2">
                <div className="text-xs text-apollo-green">Benefit</div>
                <div className="text-xl font-bold text-apollo-green">€{step2.totalBenefit.toLocaleString()}</div>
              </div>
            </div>

            {/* Voyage Carbon Summary */}
            <div className="bg-apollo-light rounded-xl p-4 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-500">Total CO₂</div>
                  <div className="text-xl font-bold text-apollo-dark">{step2.totalCO2} t</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">EU Scope (50%)</div>
                  <div className="text-xl font-bold text-apollo-dark">{step2.billableEmissions} t</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">EUA Cost</div>
                  <div className="text-xl font-bold text-apollo-green">€{step2.euaCost.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Allocation Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-500">Cargo</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">Weight</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">Volume</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">Hybrid Cost</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">vs. Weight-Only</th>
                  </tr>
                </thead>
                <tbody>
                  {step2.allocations.map((a, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3 px-3 font-medium">{a.name}</td>
                      <td className="py-3 px-3 text-right text-gray-600">{a.weightShare}%</td>
                      <td className="py-3 px-3 text-right text-gray-600">{a.volumeShare}%</td>
                      <td className="py-3 px-3 text-right font-bold text-apollo-green">€{a.hybridCost.toLocaleString()}</td>
                      <td className={`py-3 px-3 text-right font-medium ${a.difference > 0 ? 'text-green-600' : a.difference < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                        {a.difference > 0 ? '+' : ''}{a.difference === 0 ? '—' : `€${a.difference.toLocaleString()}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* The Ro-Ro Paradox */}
            <div className="bg-apollo-beige rounded-xl p-4">
              <p className="text-sm text-apollo-dark">
                <span className="font-semibold">The Ro-Ro Paradox Solved:</span> Empty trailers use the same deck space as heavy trucks.
                Hybrid allocation ensures they pay €{step2.allocations[1].hybridCost.toLocaleString()} (fair share) instead of
                €{step2.allocations[1].weightOnlyCost.toLocaleString()} (weight-only). Revenue protected: <span className="font-bold text-apollo-green">€{step2.revenueProtected.toLocaleString()}</span>
              </p>
            </div>
          </div>
        )}

        {/* Step 3: EUA Wallet */}
        {currentStep === 3 && (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-apollo-green/10 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-apollo-green" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-apollo-dark">Step 3: EUA Wallet</h4>
                <p className="text-sm text-gray-500">FIFO Token Consumption</p>
              </div>
              <div className="ml-auto bg-apollo-green-light/20 rounded-lg px-4 py-2">
                <div className="text-xs text-apollo-green">Benefit</div>
                <div className="text-xl font-bold text-apollo-green">€{step3.totalBenefit.toLocaleString()}</div>
              </div>
            </div>

            {/* Portfolio Before */}
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-3">Token Portfolio (before consumption)</div>
              <div className="space-y-2">
                {step3.portfolio.map((lot, i) => (
                  <div key={i} className="flex items-center gap-3 bg-apollo-light rounded-lg p-3">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-sm font-bold text-apollo-green">
                      #{lot.lot}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{lot.date}</div>
                      <div className="text-xs text-gray-500">{lot.tokens} tokens @ €{lot.cost.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-apollo-dark">€{(lot.tokens * lot.cost).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FIFO Consumption */}
            <div className="bg-apollo-beige rounded-xl p-4 mb-6">
              <div className="text-sm font-medium text-apollo-dark mb-3">FIFO Consumption for {step3.tokensNeeded} tokens:</div>
              <div className="space-y-2">
                {step3.consumption.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>Lot #{c.lot}: {c.tokens} tokens @ €{c.cost.toFixed(2)}</span>
                    <span className="font-mono font-bold">€{c.subtotal.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-apollo-green/20 pt-2 flex items-center justify-between font-bold">
                  <span>Total Cost Basis</span>
                  <span className="text-apollo-green">€{step3.totalCostBasis.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Savings Comparison */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-apollo-light rounded-lg p-3 text-center">
                <div className="text-sm text-gray-500">FIFO Cost</div>
                <div className="text-lg font-bold text-apollo-dark">€{step3.totalCostBasis.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Avg €{step3.avgCost}/token</div>
              </div>
              <div className="bg-apollo-light rounded-lg p-3 text-center">
                <div className="text-sm text-gray-500">Spot Market</div>
                <div className="text-lg font-bold text-gray-400">€{step3.marketValue.toLocaleString()}</div>
                <div className="text-xs text-gray-400">@ €{VOYAGE.euaPrice}/token</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                <div className="text-sm text-green-600">Gain Realized</div>
                <div className="text-lg font-bold text-green-600">€{step3.inventoryGain.toLocaleString()}</div>
                <div className="text-xs text-green-500">Bought low, used before rise</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: AI Audit */}
        {currentStep === 4 && (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-apollo-green/10 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-apollo-green" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-apollo-dark">Step 4: AI Audit Agent</h4>
                <p className="text-sm text-gray-500">Invoice Reconciliation</p>
              </div>
              <div className="ml-auto bg-apollo-green-light/20 rounded-lg px-4 py-2">
                <div className="text-xs text-apollo-green">Benefit</div>
                <div className="text-xl font-bold text-apollo-green">€{step4.totalBenefit.toLocaleString()}</div>
              </div>
            </div>

            {/* Invoice Comparison */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-500">Field</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">Invoice Claim</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">System Record</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">Discrepancy</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {step4.items.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3 px-3 font-medium">{item.field}</td>
                      <td className="py-3 px-3 text-right font-mono">{item.invoice}</td>
                      <td className="py-3 px-3 text-right font-mono">{item.system}</td>
                      <td className={`py-3 px-3 text-right font-bold ${parseFloat(item.discrepancy) > 5 ? 'text-red-600' : parseFloat(item.discrepancy) > 2 ? 'text-amber-600' : 'text-green-600'}`}>
                        +{item.discrepancy}%
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block w-3 h-3 rounded-full ${item.status === 'red' ? 'bg-red-500' : item.status === 'amber' ? 'bg-amber-500' : 'bg-green-500'}`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Overcharge Details */}
            <div className="bg-red-50 rounded-xl p-4 border border-red-200 mb-6">
              <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
                <AlertTriangle className="w-5 h-5" />
                Overcharges Detected
              </div>
              <div className="space-y-1 text-sm text-red-800">
                <div className="flex justify-between">
                  <span>Fuel overcharge (3.6 MT × €541)</span>
                  <span className="font-mono font-bold">€{step4.fuelOvercharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Port charges discrepancy</span>
                  <span className="font-mono font-bold">€{step4.portOvercharge}</span>
                </div>
                <div className="border-t border-red-200 pt-1 flex justify-between font-bold">
                  <span>Total Prevented Overpayment</span>
                  <span>€{step4.totalOvercharge.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Final Summary */}
            <div className="bg-apollo-dark rounded-xl p-6 text-white">
              <h5 className="font-serif text-lg font-bold mb-4">Voyage {VOYAGE.id} Value Summary</h5>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><Gauge className="w-4 h-4 text-apollo-green-light" /> Physics Engine</span>
                  <span className="font-mono font-bold">€{step1.totalBenefit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><Scale className="w-4 h-4 text-apollo-green-light" /> Carbon Allocation</span>
                  <span className="font-mono font-bold">€{step2.totalBenefit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><Wallet className="w-4 h-4 text-apollo-green-light" /> EUA Wallet</span>
                  <span className="font-mono font-bold">€{step3.totalBenefit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><Brain className="w-4 h-4 text-apollo-green-light" /> AI Audit</span>
                  <span className="font-mono font-bold">€{step4.totalBenefit.toLocaleString()}</span>
                </div>
              </div>
              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between items-center text-xl">
                  <span className="font-bold">Single Voyage Total</span>
                  <span className="font-mono font-bold text-apollo-green-light">€{totalBenefits.voyage.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-slate-400">
                  <span>Time Saved</span>
                  <span className="font-mono">{totalBenefits.hours} hours</span>
                </div>
              </div>
            </div>

            {/* Fleet Extrapolation */}
            <div className="mt-6 bg-apollo-light rounded-xl p-6">
              <h5 className="font-serif text-lg font-bold text-apollo-dark mb-4">Scale to Your Fleet</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2 px-3 font-medium text-gray-600">Fleet Size</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-600">Annual Voyages</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-600">Projected Benefit</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-600">Hours Saved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { vessels: 3, voyages: 216 },
                      { vessels: 5, voyages: 360 },
                      { vessels: 10, voyages: 720 },
                    ].map((row) => (
                      <tr key={row.vessels} className="border-b border-gray-200">
                        <td className="py-3 px-3 font-medium">{row.vessels} vessels</td>
                        <td className="py-3 px-3 text-right text-gray-600">{row.voyages}</td>
                        <td className="py-3 px-3 text-right font-bold text-apollo-green">
                          €{((totalBenefits.voyage * row.voyages * 0.8) / 1000000).toFixed(1)}M - €{((totalBenefits.voyage * row.voyages * 1.2) / 1000000).toFixed(1)}M
                        </td>
                        <td className="py-3 px-3 text-right text-gray-600">
                          {(totalBenefits.hours * row.voyages).toLocaleString()} hrs
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Based on 72 voyages per vessel per year. Range shows ±20% variance for market conditions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimers */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <details className="group">
          <summary className="cursor-pointer text-xs font-medium text-gray-600 hover:text-gray-800 flex items-center gap-1">
            <span className="group-open:rotate-90 transition-transform">▶</span>
            Important Disclaimers & Methodology
          </summary>
          <div className="mt-3 space-y-3 text-xs text-gray-500">
            <div>
              <p className="font-medium text-gray-600 mb-1">Important Notice</p>
              <p>
                Projected benefits are illustrative and based on the demonstrated scenario (Rotterdam-Dublin, 580nm, 45 cargo units, Q4 2024 market conditions). Actual results vary based on voyage distance and duration, cargo mix and utilization, fuel and EUA market prices, vessel specifications, and existing operational practices.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-600 mb-1">Calculation Methodology</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Fuel savings based on Admiralty Cubic Law (P ∝ V³)</li>
                <li>Emission factors: IMO Well-to-Wake (WTW) for VLSFO (3.791 tCO₂/tFuel)</li>
                <li>EU ETS phase-in: 70% for 2025, per EU Regulation 2023/957</li>
                <li>Carbon allocation: ISO 14083:2023 hybrid method</li>
                <li>Audit thresholds: Industry-standard tolerance bands</li>
              </ul>
            </div>
            <p className="italic">
              This demonstration does not constitute a guarantee of financial performance. Carbon-Wise is a decision-support tool; actual savings depend on operational decisions and market conditions.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}

export default function CarbonWise() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('carbonwise_authenticated') === 'true';
  });
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const handleRequestDemo = (moduleId: string) => {
    if (isAuthenticated) {
      setActiveModule(moduleId);
      // Scroll to the module
      document.getElementById(`${moduleId}-demo`)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Show access code modal
      setActiveModule(moduleId);
      setShowAccessModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAccessModal(false);
    // Scroll to the requested module demo
    if (activeModule) {
      setTimeout(() => {
        document.getElementById(`${activeModule}-demo`)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Carbon-Wise - Maritime Carbon Compliance Platform',
      text: 'AI-powered voyage optimization, carbon allocation, and EUA management for Ro-Ro operators navigating EU ETS regulations.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="pt-20">
      {/* Access Code Modal */}
      <AccessCodeModal
        isOpen={showAccessModal}
        onClose={() => setShowAccessModal(false)}
        onSuccess={handleAuthSuccess}
        onRequestAccess={() => {
          setShowAccessModal(false);
          navigate('/');
        }}
      />
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/image39.jpeg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-apollo-dark/80 via-apollo-dark/30 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button & Share */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Apollonique X
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-slate-800 hover:text-slate-900 transition-colors text-sm bg-white hover:bg-slate-100 px-3 py-1.5 rounded-lg font-medium"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-apollo-green-light/20 border border-apollo-green-light/30 mb-6">
                <Anchor className="w-4 h-4 text-apollo-green-light" />
                <span className="text-sm font-medium text-apollo-green-light font-mono">Maritime Carbon Compliance</span>
              </div>

              <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">
                Carbon-Wise
              </h1>

              <p className="text-2xl text-slate-300 font-light mb-6">
                Maritime Carbon Compliance & Financial Intelligence Platform
              </p>

              <p className="text-lg text-slate-400 leading-relaxed">
                Built for Ro-Ro logistics operators navigating EU ETS regulations. A comprehensive
                system for carbon tracking, cost allocation, and owner invoice auditing.
              </p>
            </div>

            <div className="relative">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4">
                    <Ship className="w-10 h-10 text-apollo-green-light mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">Ro-Ro</div>
                    <div className="text-sm text-slate-400">Fleet Focus</div>
                  </div>
                  <div className="text-center p-4">
                    <Gauge className="w-10 h-10 text-apollo-green-light mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">EU ETS</div>
                    <div className="text-sm text-slate-400">Compliant</div>
                  </div>
                  <div className="text-center p-4">
                    <Wallet className="w-10 h-10 text-apollo-green-light mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">FIFO</div>
                    <div className="text-sm text-slate-400">Token Tracking</div>
                  </div>
                  <div className="text-center p-4">
                    <Brain className="w-10 h-10 text-apollo-green-light mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">AI</div>
                    <div className="text-sm text-slate-400">Audit Agent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Value Chain Journey */}
      <section id="journey-demo" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-apollo-dark mb-4">
              Follow a Single Voyage
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how Carbon-Wise creates value at every step of the journey
            </p>
          </div>
          {isAuthenticated ? (
            <VoyageJourney />
          ) : (
            <VoyageJourneyTeaser onRequestDemo={() => handleRequestDemo('journey')} />
          )}
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-apollo-dark mb-6">
              The Challenge
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              The EU Emissions Trading System (EU ETS) now covers maritime shipping, creating
              new compliance obligations for vessel operators.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-apollo-green/10 rounded-xl flex items-center justify-center mb-6">
                <AlertTriangle className="w-6 h-6 text-apollo-green" />
              </div>
              <h3 className="font-serif text-xl font-bold text-apollo-dark mb-3">
                Carbon Tracking Complexity
              </h3>
              <p className="text-gray-600">
                Operators must track carbon emissions per voyage, accounting for fuel consumption,
                speed variations, and route specifics.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-apollo-green/10 rounded-xl flex items-center justify-center mb-6">
                <Scale className="w-6 h-6 text-apollo-green" />
              </div>
              <h3 className="font-serif text-xl font-bold text-apollo-dark mb-3">
                Fair Cost Allocation
              </h3>
              <p className="text-gray-600">
                Allocating carbon costs fairly across cargo is complex - especially for Ro-Ro
                vessels carrying mixed weight/volume cargo.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-apollo-green/10 rounded-xl flex items-center justify-center mb-6">
                <FileSearch className="w-6 h-6 text-apollo-green" />
              </div>
              <h3 className="font-serif text-xl font-bold text-apollo-dark mb-3">
                Invoice Auditing Burden
              </h3>
              <p className="text-gray-600">
                Manual processes for auditing owner invoices are error-prone and time-consuming,
                leading to disputes and overpayments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Modules */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-apollo-dark mb-4">
              The Solution
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Four integrated modules that work together to solve the complete carbon compliance puzzle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Module 1: Physics Engine */}
            <div className="group flex flex-col bg-gradient-to-br from-apollo-light to-white rounded-2xl p-8 border border-gray-200 hover:border-apollo-green/30 transition-all">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-apollo-green/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-apollo-green/20 transition-colors">
                  <Gauge className="w-8 h-8 text-apollo-green" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-mono text-apollo-green mb-2">Module 01</div>
                  <h3 className="font-serif text-2xl font-bold text-apollo-dark mb-3">
                    Physics Engine
                  </h3>
                  <p className="text-lg text-apollo-green font-medium mb-4">
                    Speed vs. Fuel Optimization
                  </p>
                  <div className="space-y-4 text-gray-600">
                    <div className="flex items-start gap-3">
                      <Calculator className="w-5 h-5 text-apollo-green flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-apollo-dark">Up to ~27% Fuel Reduction</span>
                        <p className="text-sm">A 10% speed reduction yields ~27% fuel savings due to the cubic law relationship</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-apollo-green flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-apollo-dark">Schedule Compliance</span>
                        <p className="text-sm">Meet arrival windows precisely while minimizing fuel costs and eliminating costly port waiting time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits or Interactive Demo */}
              <div id="physics-demo" className="mt-auto pt-8">
                {isAuthenticated ? (
                  <PhysicsEngineDemo />
                ) : (
                  <PhysicsEngineBenefits />
                )}
              </div>
            </div>

            {/* Module 2: Carbon Allocation Engine */}
            <div className="group flex flex-col bg-gradient-to-br from-apollo-light to-white rounded-2xl p-8 border border-gray-200 hover:border-apollo-green/30 transition-all">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-apollo-green/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-apollo-green/20 transition-colors">
                  <Scale className="w-8 h-8 text-apollo-green" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-mono text-apollo-green mb-2">Module 02</div>
                  <h3 className="font-serif text-2xl font-bold text-apollo-dark mb-3">
                    Carbon Allocation Engine
                  </h3>
                  <p className="text-lg text-apollo-green font-medium mb-4">
                    Fair Cost Distribution
                  </p>
                  <div className="space-y-4 text-gray-600">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-apollo-green flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-apollo-dark">Regulatory Compliance</span>
                        <p className="text-sm">Allocation methodology aligned with international carbon accounting standards</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Ship className="w-5 h-5 text-apollo-green flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-apollo-dark">Zero Disputes</span>
                        <p className="text-sm">Defensible cost distribution across all cargo types eliminates billing conflicts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits or Interactive Demo */}
              <div id="allocation-demo" className="mt-auto pt-8">
                {isAuthenticated ? (
                  <AllocationEngineDemo />
                ) : (
                  <AllocationEngineBenefits />
                )}
              </div>
            </div>

            {/* Module 3: EUA Wallet */}
            <div className="group flex flex-col bg-gradient-to-br from-apollo-light to-white rounded-2xl p-8 border border-gray-200 hover:border-apollo-green/30 transition-all">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-apollo-green/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-apollo-green/20 transition-colors">
                  <Wallet className="w-8 h-8 text-apollo-green" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-mono text-apollo-green mb-2">Module 03</div>
                  <h3 className="font-serif text-2xl font-bold text-apollo-dark mb-3">
                    EUA Wallet
                  </h3>
                  <p className="text-lg text-apollo-green font-medium mb-4">
                    Token Inventory Management
                  </p>
                  <div className="space-y-4 text-gray-600">
                    <div className="flex items-start gap-3">
                      <Database className="w-5 h-5 text-apollo-green flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-apollo-dark">Cost Basis Optimization</span>
                        <p className="text-sm">Strategic token consumption reduces effective carbon costs significantly</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-apollo-green flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-apollo-dark">Live Portfolio View</span>
                        <p className="text-sm">Real-time visibility into holdings, valuations, and compliance position</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits or Interactive Demo */}
              <div id="wallet-demo" className="mt-auto pt-8">
                {isAuthenticated ? (
                  <EUAWalletDemo />
                ) : (
                  <EUAWalletBenefits />
                )}
              </div>
            </div>

            {/* Module 4: AI Audit Agent */}
            <div className="group flex flex-col bg-gradient-to-br from-apollo-light to-white rounded-2xl p-8 border border-gray-200 hover:border-apollo-green/30 transition-all">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-apollo-green/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-apollo-green/20 transition-colors">
                  <Brain className="w-8 h-8 text-apollo-green" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-mono text-apollo-green mb-2">Module 04</div>
                  <h3 className="font-serif text-2xl font-bold text-apollo-dark mb-3">
                    AI Audit Agent
                  </h3>
                  <p className="text-lg text-apollo-green font-medium mb-4">
                    Intelligent Invoice Reconciliation
                  </p>
                  <div className="space-y-4 text-gray-600">
                    <div className="flex items-start gap-3">
                      <FileSearch className="w-5 h-5 text-apollo-green flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-apollo-dark">95% Time Saved</span>
                        <p className="text-sm">Automated reconciliation replaces hours of manual invoice checking</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-apollo-green flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-apollo-dark">Recovery Identification</span>
                        <p className="text-sm">Detects billing discrepancies and overcharges for dispute resolution</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits or Interactive Demo */}
              <div id="audit-demo" className="mt-auto pt-8">
                {isAuthenticated ? (
                  <AIAuditAgentDemo />
                ) : (
                  <AIAuditBenefits />
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sky-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
            Interested in a Similar Solution for Your Industry?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Carbon-Wise demonstrates our approach to building AI-powered enterprise systems.
            Let's discuss how we can solve your industry's complex challenges.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-white text-sky-700 px-8 py-4 rounded-xl font-medium hover:bg-sky-50 transition-colors shadow-lg"
          >
            Request a Demo
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
