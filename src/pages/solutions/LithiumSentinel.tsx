import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Zap, Shield, Thermometer, Battery, Ship, MapPin, Activity, FileText, ChevronRight, ExternalLink, Flame, Eye, BarChart3, Gauge } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type TabId = 'overview' | 'fleet' | 'risk-engine' | 'ai-parser';

interface BatteryData {
  id: string;
  manufacturer: string;
  model: string;
  chemistry: string;
  soh: number;
  soc: number;
  temp: number;
  cycles: number;
  riskScore: number;
  riskLevel: RiskLevel;
}

// ─────────────────────────────────────────────────────────────
// Demo Data
// ─────────────────────────────────────────────────────────────

const demoBatteries: BatteryData[] = [
  { id: 'bat-1', manufacturer: 'Panasonic', model: '4680 Cell Pack', chemistry: 'NCA', soh: 69, soc: 95, temp: 47.3, cycles: 1200, riskScore: 91, riskLevel: 'CRITICAL' },
  { id: 'bat-2', manufacturer: 'Samsung SDI', model: 'PRiMX 2170', chemistry: 'NCA', soh: 71, soc: 96, temp: 48.9, cycles: 1050, riskScore: 88, riskLevel: 'CRITICAL' },
  { id: 'bat-3', manufacturer: 'Samsung SDI', model: 'PRiMX 2170', chemistry: 'NCA', soh: 76, soc: 92, temp: 44.1, cycles: 890, riskScore: 78, riskLevel: 'HIGH' },
  { id: 'bat-4', manufacturer: 'LG Energy', model: 'NCMA Pouch 4.0', chemistry: 'NMC', soh: 79, soc: 85, temp: 42.5, cycles: 780, riskScore: 72, riskLevel: 'HIGH' },
  { id: 'bat-5', manufacturer: 'LG Energy', model: 'NCMA Pouch 4.0', chemistry: 'NMC', soh: 82, soc: 88, temp: 41.7, cycles: 650, riskScore: 65, riskLevel: 'HIGH' },
  { id: 'bat-6', manufacturer: 'CATL', model: 'Qilin CTP 3.0', chemistry: 'NMC', soh: 85, soc: 81, temp: 39.8, cycles: 420, riskScore: 52, riskLevel: 'MEDIUM' },
  { id: 'bat-7', manufacturer: 'CATL', model: 'Qilin CTP 3.0', chemistry: 'NMC', soh: 94, soc: 78, temp: 38.5, cycles: 120, riskScore: 32, riskLevel: 'MEDIUM' },
  { id: 'bat-8', manufacturer: 'EVE Energy', model: 'LF280K', chemistry: 'LFP', soh: 88, soc: 70, temp: 35.4, cycles: 310, riskScore: 28, riskLevel: 'MEDIUM' },
  { id: 'bat-9', manufacturer: 'BYD', model: 'Blade Battery 2.0', chemistry: 'LFP', soh: 98, soc: 65, temp: 29.2, cycles: 45, riskScore: 12, riskLevel: 'LOW' },
  { id: 'bat-10', manufacturer: 'CALB', model: 'L221N', chemistry: 'LFP', soh: 95, soc: 42, temp: 27.8, cycles: 80, riskScore: 8, riskLevel: 'LOW' },
  { id: 'bat-11', manufacturer: 'Toshiba', model: 'SCiB 20Ah', chemistry: 'LTO', soh: 97, soc: 50, temp: 26.0, cycles: 2500, riskScore: 5, riskLevel: 'LOW' },
  { id: 'bat-12', manufacturer: 'CATL', model: 'Shenxing Plus', chemistry: 'LFP', soh: 91, soc: 55, temp: 33.0, cycles: 200, riskScore: 22, riskLevel: 'LOW' },
];

// ─────────────────────────────────────────────────────────────
// Utility Components
// ─────────────────────────────────────────────────────────────

function RiskBadge({ level, score }: { level: RiskLevel; score?: number }) {
  const colors: Record<RiskLevel, string> = {
    LOW: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    MEDIUM: 'bg-amber-100 text-amber-800 border-amber-300',
    HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
    CRITICAL: 'bg-red-100 text-red-800 border-red-300',
  };
  const dots: Record<RiskLevel, string> = {
    LOW: 'bg-emerald-500',
    MEDIUM: 'bg-amber-500',
    HIGH: 'bg-orange-500',
    CRITICAL: 'bg-red-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[level]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[level]} ${level === 'CRITICAL' ? 'animate-pulse' : ''}`} />
      {score !== undefined ? score : level}
    </span>
  );
}

function StatCard({ label, value, sublabel, color }: { label: string; value: string | number; sublabel?: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color || 'text-gray-900'}`}>{value}</p>
      {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab Content Components
// ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const critical = demoBatteries.filter(b => b.riskLevel === 'CRITICAL').length;
  const high = demoBatteries.filter(b => b.riskLevel === 'HIGH').length;
  const avgRisk = (demoBatteries.reduce((s, b) => s + b.riskScore, 0) / demoBatteries.length).toFixed(1);
  const maxTemp = Math.max(...demoBatteries.map(b => b.temp));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Fleet Risk Average" value={avgRisk} sublabel="out of 100" />
        <StatCard label="Critical Batteries" value={critical} sublabel="require immediate attention" color="text-red-600" />
        <StatCard label="High Risk Batteries" value={high} sublabel="under monitoring" color="text-orange-600" />
        <StatCard label="Max Temperature" value={`${maxTemp}°C`} sublabel="thermal alert threshold: 45°C" color={maxTemp >= 45 ? 'text-red-600' : 'text-orange-600'} />
      </div>

      {/* Berth Map Preview */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" /> Port Risk Heat Map — Khalifa Port
          </h3>
        </div>
        <div className="p-4">
          <svg viewBox="0 0 700 180" className="w-full h-auto">
            {/* Water */}
            <rect x="0" y="0" width="700" height="180" rx="8" fill="#e0f2fe" />

            {/* Heat zones */}
            <circle cx="120" cy="60" r="50" fill="rgba(249, 115, 22, 0.15)" />
            <circle cx="120" cy="60" r="30" fill="rgba(249, 115, 22, 0.25)" stroke="rgba(249, 115, 22, 0.5)" strokeWidth="1.5" />

            <circle cx="310" cy="60" r="65" fill="rgba(239, 68, 68, 0.15)" />
            <circle cx="310" cy="60" r="40" fill="rgba(239, 68, 68, 0.25)" stroke="rgba(239, 68, 68, 0.6)" strokeWidth="1.5" />
            <circle cx="310" cy="60" r="40" fill="none" stroke="rgba(239, 68, 68, 0.5)" strokeWidth="2">
              <animate attributeName="r" values="40;60;40" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
            </circle>

            <circle cx="580" cy="60" r="45" fill="rgba(34, 197, 94, 0.15)" />
            <circle cx="580" cy="60" r="25" fill="rgba(34, 197, 94, 0.2)" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="1.5" />

            {/* Quay wall */}
            <rect x="0" y="120" width="700" height="5" fill="#475569" />

            {/* Berths */}
            {[
              { x: 30, name: 'K-1', status: 'OCCUPIED', vessel: 'Aurora Spirit', risk: 78, color: '#fef08a', stroke: '#eab308' },
              { x: 220, name: 'K-2', status: 'OCCUPIED', vessel: 'Neptune Carrier', risk: 91, color: '#fef08a', stroke: '#eab308' },
              { x: 410, name: 'K-3', status: 'AVAILABLE', vessel: null, risk: 0, color: '#bbf7d0', stroke: '#22c55e' },
              { x: 530, name: 'K-4', status: 'OCCUPIED', vessel: 'Voltaic Express', risk: 52, color: '#fef08a', stroke: '#eab308' },
            ].map((berth) => (
              <g key={berth.name}>
                <rect x={berth.x} y="127" width="150" height="42" fill={berth.color} stroke={berth.stroke} strokeWidth="2" rx="4" />
                <text x={berth.x + 75} y="148" textAnchor="middle" fontSize="10" fontWeight="600" fill="#334155">Berth {berth.name}</text>
                <text x={berth.x + 75} y="160" textAnchor="middle" fontSize="8" fill="#64748b">{berth.status}</text>
                {berth.vessel && (
                  <g>
                    <rect x={berth.x + 10} y="40" width="130" height="75" fill="#fff" stroke="#94a3b8" strokeWidth="1.5" rx="6" />
                    <text x={berth.x + 75} y="58" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e293b">{berth.vessel}</text>
                    <circle cx={berth.x + 130} cy="48" r="9" fill={berth.risk >= 75 ? '#ef4444' : berth.risk >= 50 ? '#f97316' : '#eab308'} />
                    <text x={berth.x + 130} y="51" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff">{berth.risk}</text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: <Flame className="w-5 h-5 text-red-500" />, title: 'Thermal Runaway Detection', desc: 'Real-time monitoring of battery temperatures against chemistry-specific thermal runaway onset thresholds (NCA: 150°C, NMC: 210°C, LFP: 270°C).' },
          { icon: <BarChart3 className="w-5 h-5 text-amber-500" />, title: 'Multi-Factor Risk Scoring', desc: 'Weighted composite scoring: thermal propagation (35%), chemistry (25%), age/degradation (20%), environmental (10%), SoC (10%).' },
          { icon: <Eye className="w-5 h-5 text-blue-500" />, title: 'AI-Powered Report Parsing', desc: 'Gemini 2.0 Flash extracts SoH, SoC, chemistry, and temperature from CSV and PDF battery health reports automatically.' },
        ].map((feat, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              {feat.icon}
              <h4 className="font-semibold text-sm">{feat.title}</h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FleetTab() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b bg-gray-50">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Ship className="w-4 h-4 text-gray-500" /> Fleet Battery Inventory
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Battery</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Chemistry</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Temp</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">SoH</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">SoC</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Cycles</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {demoBatteries.map((bat) => (
              <tr key={bat.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{bat.manufacturer}</div>
                  <div className="text-xs text-gray-500">{bat.model}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    bat.chemistry === 'NCA' ? 'bg-red-100 text-red-800' :
                    bat.chemistry === 'NMC' ? 'bg-violet-100 text-violet-800' :
                    bat.chemistry === 'LFP' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>{bat.chemistry}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${bat.temp >= 45 ? 'text-red-600' : bat.temp >= 40 ? 'text-orange-600' : bat.temp >= 35 ? 'text-amber-600' : 'text-gray-900'}`}>
                    {bat.temp}°C
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={bat.soh < 80 ? 'text-red-600 font-semibold' : ''}>{bat.soh}%</span>
                </td>
                <td className="px-4 py-3">
                  <span className={bat.soc > 90 ? 'text-amber-600 font-semibold' : ''}>{bat.soc}%</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{bat.cycles.toLocaleString()}</td>
                <td className="px-4 py-3"><RiskBadge level={bat.riskLevel} score={bat.riskScore} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RiskEngineTab() {
  const [selectedBattery, setSelectedBattery] = useState(demoBatteries[0]);

  const chemistryProfiles: Record<string, { onset: number; propagation: string; toxicity: string; baseRisk: number }> = {
    NMC: { onset: 210, propagation: '65%', toxicity: 'HIGH', baseRisk: 45 },
    NCA: { onset: 150, propagation: '80%', toxicity: 'HIGH', baseRisk: 60 },
    LFP: { onset: 270, propagation: '15%', toxicity: 'LOW', baseRisk: 15 },
    LTO: { onset: 300, propagation: '5%', toxicity: 'LOW', baseRisk: 5 },
  };

  const profile = chemistryProfiles[selectedBattery.chemistry] || chemistryProfiles.NMC;

  return (
    <div className="space-y-4">
      {/* Battery Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Gauge className="w-4 h-4 text-gray-500" /> Select Battery for Risk Analysis
        </h3>
        <div className="flex flex-wrap gap-2">
          {demoBatteries.slice(0, 6).map((bat) => (
            <button
              key={bat.id}
              onClick={() => setSelectedBattery(bat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                selectedBattery.id === bat.id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {bat.manufacturer} ({bat.chemistry})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chemistry Profile */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Battery className="w-4 h-4 text-gray-500" /> {selectedBattery.chemistry} Chemistry Profile
          </h4>
          <div className="space-y-3">
            {[
              { label: 'Thermal Runaway Onset', value: `${profile.onset}°C`, color: profile.onset < 200 ? 'text-red-600' : '' },
              { label: 'Propagation Rate', value: profile.propagation, color: '' },
              { label: 'Gas Emission Toxicity', value: profile.toxicity, color: profile.toxicity === 'HIGH' ? 'text-red-600' : 'text-emerald-600' },
              { label: 'Base Risk Score', value: `${profile.baseRisk}/100`, color: '' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                <span className="text-xs text-gray-500">{item.label}</span>
                <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-500" /> Risk Score Breakdown
          </h4>
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-bold">{selectedBattery.riskScore}</span>
            <RiskBadge level={selectedBattery.riskLevel} />
          </div>
          <div className="space-y-2">
            {[
              { label: 'Thermal (35%)', value: Math.min(100, Math.round((selectedBattery.temp - 25) / (profile.onset - 25) * 100)) },
              { label: 'Chemistry (25%)', value: profile.baseRisk },
              { label: 'Age/Degradation (20%)', value: Math.max(0, Math.round((85 - selectedBattery.soh) / 85 * 100 + (selectedBattery.cycles - 500) / 2000 * 60)) },
              { label: 'Environmental (10%)', value: 20 },
              { label: 'SoC Risk (10%)', value: Math.max(0, (selectedBattery.soc - 80) * 2.5) },
            ].map((factor) => (
              <div key={factor.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{factor.label}</span>
                  <span className="font-medium">{Math.max(0, Math.round(factor.value))}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      factor.value >= 60 ? 'bg-red-500' : factor.value >= 40 ? 'bg-orange-500' : factor.value >= 20 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, factor.value))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scoring Weights */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h4 className="font-semibold text-sm mb-3">Weighted Composite Formula</h4>
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-gray-700">
          <p>Overall = (Thermal × 0.35) + (Chemistry × 0.25) + (Age × 0.20) + (Env × 0.10) + (SoC × 0.10)</p>
          <p className="mt-2 text-gray-500">// All calculations use Decimal.js for naval-grade precision</p>
        </div>
      </div>
    </div>
  );
}

function AiParserTab() {
  const [showResult, setShowResult] = useState(false);

  return (
    <div className="space-y-4">
      {/* Upload Demo */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" /> AI Battery Report Parser
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Upload CSV or PDF battery health reports. Gemini 2.0 Flash extracts structured data automatically.
        </p>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
            <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Drop CSV or PDF here</p>
            <p className="text-xs text-gray-400 mt-1">sample-battery-report.csv</p>
          </div>
          <button
            onClick={() => setShowResult(true)}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Parse Demo Report
          </button>
        </div>

        {/* Pipeline visualization */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="rounded bg-emerald-100 text-emerald-700 px-2 py-0.5">CSV Upload</span>
          <ChevronRight className="w-3 h-3" />
          <span className="rounded bg-blue-100 text-blue-700 px-2 py-0.5">Gemini 2.0 Flash</span>
          <ChevronRight className="w-3 h-3" />
          <span className="rounded bg-violet-100 text-violet-700 px-2 py-0.5">Zod Validation</span>
          <ChevronRight className="w-3 h-3" />
          <span className="rounded bg-amber-100 text-amber-700 px-2 py-0.5">Risk Scoring</span>
        </div>
      </div>

      {/* Parsed Results */}
      {showResult && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">MV Horizon Pioneer</h4>
                <p className="text-xs text-gray-500">Report Date: 2026-02-07</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-medium">Gemini AI</span>
                <span className="text-xs text-gray-500">92% confidence</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
              <div><p className="text-gray-500 text-xs">Batteries</p><p className="font-semibold">4</p></div>
              <div><p className="text-gray-500 text-xs">Chemistries</p><p className="font-semibold">NMC, LFP, NCA, LTO</p></div>
              <div><p className="text-gray-500 text-xs">Avg SoH</p><p className="font-semibold">84.8%</p></div>
            </div>
          </div>

          {[
            { mfg: 'CATL', model: 'Qilin CTP 3.0', chem: 'NMC', soh: 91, soc: 72, temp: 36.4, risk: 32, level: 'MEDIUM' as RiskLevel },
            { mfg: 'BYD', model: 'Blade Battery 2.0', chem: 'LFP', soh: 96, soc: 58, temp: 28.1, risk: 10, level: 'LOW' as RiskLevel },
            { mfg: 'Samsung SDI', model: 'PRiMX 2170', chem: 'NCA', soh: 74, soc: 89, temp: 43.7, risk: 72, level: 'HIGH' as RiskLevel },
            { mfg: 'Toshiba', model: 'SCiB 20Ah', chem: 'LTO', soh: 99, soc: 45, temp: 24.5, risk: 3, level: 'LOW' as RiskLevel },
          ].map((bat, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{bat.mfg} {bat.model}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium mt-1 inline-block ${
                    bat.chem === 'NCA' ? 'bg-red-100 text-red-800' : bat.chem === 'NMC' ? 'bg-violet-100 text-violet-800' : bat.chem === 'LFP' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>{bat.chem}</span>
                </div>
                <RiskBadge level={bat.level} score={bat.risk} />
              </div>
              <div className="grid grid-cols-4 gap-3 mt-3 text-xs">
                <div><p className="text-gray-500">SoH</p><p className={`font-semibold ${bat.soh < 80 ? 'text-red-600' : ''}`}>{bat.soh}%</p></div>
                <div><p className="text-gray-500">SoC</p><p className="font-semibold">{bat.soc}%</p></div>
                <div><p className="text-gray-500">Temp</p><p className={`font-semibold ${bat.temp >= 40 ? 'text-orange-600' : ''}`}>{bat.temp}°C</p></div>
                <div><p className="text-gray-500">Risk</p><p className="font-semibold">{bat.risk}/100</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function LithiumSentinel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const tabs: { id: TabId; label: string; icon: JSX.Element }[] = [
    { id: 'overview', label: 'Overview', icon: <Shield className="w-4 h-4" /> },
    { id: 'fleet', label: 'Fleet', icon: <Ship className="w-4 h-4" /> },
    { id: 'risk-engine', label: 'Risk Engine', icon: <Thermometer className="w-4 h-4" /> },
    { id: 'ai-parser', label: 'AI Parser', icon: <FileText className="w-4 h-4" /> },
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center shadow-sm">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Lithium-Sentinel AI</h1>
                <p className="text-xs text-gray-500">EV Battery Fire Risk Management for Port Operations</p>
              </div>
            </div>
            <a
              href="https://github.com/tmeren/Lithium-Sentinel"
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
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'fleet' && <FleetTab />}
        {activeTab === 'risk-engine' && <RiskEngineTab />}
        {activeTab === 'ai-parser' && <AiParserTab />}
      </main>

      {/* Tech Stack Footer */}
      <div className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="font-medium text-gray-700">Tech Stack:</span>
            {['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Prisma', 'Supabase', 'Gemini 2.0 Flash', 'Decimal.js', 'Zod', 'Jest (42 tests)'].map((tech) => (
              <span key={tech} className="rounded-full bg-gray-100 px-2.5 py-0.5">{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
