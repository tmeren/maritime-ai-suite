import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, Search, Car, Leaf, QrCode, Factory, MapPin, Fuel, Calendar, Hash, Shield, ChevronRight, Info, Copy, Check, Fingerprint, Globe, Gauge } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type TabId = 'lookup' | 'co2' | 'qr-passport';

interface VehiclePassport {
  vin: string;
  make: string;
  model: string;
  year: number;
  assemblyPlant: string;
  countryOfOrigin: string;
  engineType: string;
  bodyStyle: string;
  driveType: string;
  fuelType: string;
  co2: {
    manufacturing: number;
    shipping: number;
    annualDriving: number;
    totalLifecycle: number;
    rating: 'A' | 'B' | 'C' | 'D' | 'E';
  };
}

// ─────────────────────────────────────────────────────────────
// Demo Data — 6 Sample VINs
// ─────────────────────────────────────────────────────────────

const demoVehicles: Record<string, VehiclePassport> = {
  'WVWZZZ3CZWE123456': {
    vin: 'WVWZZZ3CZWE123456',
    make: 'Volkswagen',
    model: 'ID.4 Pro S',
    year: 2025,
    assemblyPlant: 'Emden, Germany',
    countryOfOrigin: 'Germany',
    engineType: 'Electric (150 kW)',
    bodyStyle: 'SUV',
    driveType: 'RWD',
    fuelType: 'Battery Electric',
    co2: { manufacturing: 8.2, shipping: 0.4, annualDriving: 0.0, totalLifecycle: 8.6, rating: 'A' },
  },
  'WBA53EJ06RCK78901': {
    vin: 'WBA53EJ06RCK78901',
    make: 'BMW',
    model: '530e xDrive',
    year: 2024,
    assemblyPlant: 'Dingolfing, Germany',
    countryOfOrigin: 'Germany',
    engineType: 'Plug-in Hybrid (215 kW)',
    bodyStyle: 'Sedan',
    driveType: 'AWD',
    fuelType: 'Petrol / Electric',
    co2: { manufacturing: 7.1, shipping: 0.5, annualDriving: 2.8, totalLifecycle: 38.1, rating: 'C' },
  },
  '5YJ3E1EA8PF234567': {
    vin: '5YJ3E1EA8PF234567',
    make: 'Tesla',
    model: 'Model 3 Long Range',
    year: 2025,
    assemblyPlant: 'Fremont, California',
    countryOfOrigin: 'United States',
    engineType: 'Dual Motor Electric (324 kW)',
    bodyStyle: 'Sedan',
    driveType: 'AWD',
    fuelType: 'Battery Electric',
    co2: { manufacturing: 7.8, shipping: 1.2, annualDriving: 0.0, totalLifecycle: 9.0, rating: 'A' },
  },
  'TMBJB9NE5R0345678': {
    vin: 'TMBJB9NE5R0345678',
    make: 'Škoda',
    model: 'Enyaq iV 80',
    year: 2024,
    assemblyPlant: 'Mladá Boleslav, Czech Republic',
    countryOfOrigin: 'Czech Republic',
    engineType: 'Electric (150 kW)',
    bodyStyle: 'SUV',
    driveType: 'RWD',
    fuelType: 'Battery Electric',
    co2: { manufacturing: 7.9, shipping: 0.3, annualDriving: 0.0, totalLifecycle: 8.2, rating: 'A' },
  },
  'KNAB351ABRA456789': {
    vin: 'KNAB351ABRA456789',
    make: 'Hyundai',
    model: 'IONIQ 6',
    year: 2025,
    assemblyPlant: 'Ulsan, South Korea',
    countryOfOrigin: 'South Korea',
    engineType: 'Electric (239 kW)',
    bodyStyle: 'Sedan',
    driveType: 'AWD',
    fuelType: 'Battery Electric',
    co2: { manufacturing: 7.5, shipping: 0.9, annualDriving: 0.0, totalLifecycle: 8.4, rating: 'A' },
  },
  'W1K2964841B567890': {
    vin: 'W1K2964841B567890',
    make: 'Mercedes-Benz',
    model: 'GLC 300 4MATIC',
    year: 2024,
    assemblyPlant: 'Bremen, Germany',
    countryOfOrigin: 'Germany',
    engineType: 'Turbo Inline-4 (190 kW)',
    bodyStyle: 'SUV',
    driveType: 'AWD',
    fuelType: 'Petrol',
    co2: { manufacturing: 6.8, shipping: 0.6, annualDriving: 4.2, totalLifecycle: 53.6, rating: 'D' },
  },
};

const sampleVins = Object.keys(demoVehicles);

// ─────────────────────────────────────────────────────────────
// Utility Components
// ─────────────────────────────────────────────────────────────

function CO2RatingBadge({ rating }: { rating: string }) {
  const colors: Record<string, string> = {
    A: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    B: 'bg-lime-100 text-lime-800 border-lime-300',
    C: 'bg-amber-100 text-amber-800 border-amber-300',
    D: 'bg-orange-100 text-orange-800 border-orange-300',
    E: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${colors[rating] || colors.C}`}>
      <Leaf className="w-3 h-3" />
      {rating}
    </span>
  );
}

function StatCard({ label, value, sublabel, icon }: { label: string; value: string | number; sublabel?: string; icon?: ReactNode }) {
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

function AnimatedBar({ label, value, max, color, unit, delay }: { label: string; value: number; max: number; color: string; unit: string; delay: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold">{value} {unit}</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${pct}%`, transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab Content Components
// ─────────────────────────────────────────────────────────────

function LookupTab({ selectedVehicle, onSelectVehicle }: { selectedVehicle: VehiclePassport | null; onSelectVehicle: (vin: string) => void }) {
  const [inputVin, setInputVin] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = (vin?: string) => {
    const vinToSearch = (vin || inputVin).replace(/\s/g, '').toUpperCase();
    setError('');

    if (vinToSearch.length !== 17) {
      setError('VIN must be exactly 17 characters.');
      return;
    }

    setShowCard(false);
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
      if (demoVehicles[vinToSearch]) {
        onSelectVehicle(vinToSearch);
        setTimeout(() => setShowCard(true), 50);
      } else {
        setError('VIN not found. Try one of the sample VINs below.');
      }
    }, 800);
  };

  const handleSampleClick = (vin: string) => {
    setInputVin(vin);
    handleSearch(vin);
  };

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" /> VIN Lookup
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Enter a 17-character Vehicle Identification Number to decode the vehicle passport.
        </p>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputVin}
              onChange={(e) => {
                setInputVin(e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '').slice(0, 17));
                setError('');
              }}
              placeholder="e.g. WVWZZZ3CZWE123456"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              maxLength={17}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{inputVin.length}/17</span>
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Decode
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
            <Info className="w-3 h-3" /> {error}
          </p>
        )}
      </div>

      {/* Sample VINs */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-3">Sample VINs</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {sampleVins.map((vin) => {
            const v = demoVehicles[vin];
            return (
              <button
                key={vin}
                onClick={() => handleSampleClick(vin)}
                className="text-left rounded-lg border border-gray-100 p-3 hover:bg-gray-50 hover:border-gray-300 transition-colors group"
              >
                <p className="font-mono text-xs text-gray-600 group-hover:text-gray-900 truncate">{vin}</p>
                <p className="text-xs text-gray-400 mt-0.5">{v.year} {v.make} {v.model}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vehicle Passport Card — animated entrance */}
      {selectedVehicle && (
        <div
          className={`transform transition-all duration-700 ease-out ${
            showCard ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="relative bg-white rounded-2xl border-2 border-gray-900 shadow-lg overflow-hidden">
            {/* Card Header with gradient accent */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                    <Fingerprint className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Vehicle Passport</h3>
                    <p className="text-gray-300 text-xs font-mono">{selectedVehicle.vin}</p>
                  </div>
                </div>
                <CO2RatingBadge rating={selectedVehicle.co2.rating} />
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Car className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedVehicle.year} {selectedVehicle.make}</h4>
                  <p className="text-gray-500">{selectedVehicle.model}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: <Factory className="w-4 h-4" />, label: 'Assembly Plant', value: selectedVehicle.assemblyPlant },
                  { icon: <Globe className="w-4 h-4" />, label: 'Country of Origin', value: selectedVehicle.countryOfOrigin },
                  { icon: <Gauge className="w-4 h-4" />, label: 'Engine Type', value: selectedVehicle.engineType },
                  { icon: <Car className="w-4 h-4" />, label: 'Body Style', value: selectedVehicle.bodyStyle },
                  { icon: <Fuel className="w-4 h-4" />, label: 'Fuel Type', value: selectedVehicle.fuelType },
                  { icon: <Calendar className="w-4 h-4" />, label: 'Model Year', value: String(selectedVehicle.year) },
                ].map((item) => (
                  <div key={item.label} className="py-2">
                    <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                      {item.icon}
                      <span className="text-xs">{item.label}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtle glow effect on border */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.08), inset 0 0 0 2px transparent',
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

function CO2Tab({ vehicle }: { vehicle: VehiclePassport | null }) {
  if (!vehicle) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center">
        <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No vehicle selected</p>
        <p className="text-xs text-gray-400 mt-1">Search for a VIN in the Lookup tab first.</p>
      </div>
    );
  }

  const maxCo2 = 60;
  const isEV = vehicle.fuelType === 'Battery Electric';

  return (
    <div className="space-y-6">
      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Lifecycle CO₂" value={`${vehicle.co2.totalLifecycle}t`} sublabel="tonnes CO₂-equivalent" icon={<Leaf className="w-3.5 h-3.5" />} />
        <StatCard label="Manufacturing" value={`${vehicle.co2.manufacturing}t`} sublabel="production + battery" icon={<Factory className="w-3.5 h-3.5" />} />
        <StatCard label="Shipping" value={`${vehicle.co2.shipping}t`} sublabel="factory to market" icon={<MapPin className="w-3.5 h-3.5" />} />
        <StatCard label="Annual Driving" value={isEV ? '0.0t' : `${vehicle.co2.annualDriving}t`} sublabel={isEV ? 'zero tailpipe emissions' : 'per year (15,000 km)'} icon={<Fuel className="w-3.5 h-3.5" />} />
      </div>

      {/* CO2 Breakdown Bars */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Leaf className="w-4 h-4 text-gray-500" /> Lifecycle CO₂ Breakdown
          </h3>
          <CO2RatingBadge rating={vehicle.co2.rating} />
        </div>

        <div className="space-y-4">
          <AnimatedBar label="Manufacturing (Production + Battery)" value={vehicle.co2.manufacturing} max={maxCo2} color="bg-violet-500" unit="t" delay={0} />
          <AnimatedBar label="Shipping (Factory → Market)" value={vehicle.co2.shipping} max={maxCo2} color="bg-blue-500" unit="t" delay={200} />
          <AnimatedBar label="Annual Driving (15,000 km/yr)" value={vehicle.co2.annualDriving} max={maxCo2} color={isEV ? 'bg-emerald-500' : 'bg-orange-500'} unit="t/yr" delay={400} />
          <AnimatedBar label="Total Lifecycle Estimate (10 yr)" value={vehicle.co2.totalLifecycle} max={maxCo2} color={vehicle.co2.totalLifecycle < 15 ? 'bg-emerald-500' : vehicle.co2.totalLifecycle < 40 ? 'bg-amber-500' : 'bg-red-500'} unit="t" delay={600} />
        </div>
      </div>

      {/* Rating Explanation */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h4 className="font-semibold text-sm mb-3">EU CO₂ Efficiency Rating Scale</h4>
        <div className="flex gap-2">
          {(['A', 'B', 'C', 'D', 'E'] as const).map((r) => {
            const colors: Record<string, string> = {
              A: 'bg-emerald-500',
              B: 'bg-lime-500',
              C: 'bg-amber-500',
              D: 'bg-orange-500',
              E: 'bg-red-500',
            };
            const labels: Record<string, string> = {
              A: '< 15t',
              B: '15–25t',
              C: '25–40t',
              D: '40–55t',
              E: '> 55t',
            };
            return (
              <div key={r} className={`flex-1 rounded-lg p-3 text-center ${vehicle.co2.rating === r ? 'ring-2 ring-gray-900 ring-offset-2' : ''}`}>
                <div className={`w-8 h-8 rounded-full ${colors[r]} mx-auto mb-1 flex items-center justify-center text-white font-bold text-sm`}>{r}</div>
                <p className="text-xs text-gray-500">{labels[r]}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">
            <span className="font-medium">This vehicle: </span>
            {vehicle.year} {vehicle.make} {vehicle.model} —{' '}
            <span className="font-semibold">{vehicle.co2.totalLifecycle}t lifetime CO₂</span> → Rating{' '}
            <span className="font-bold">{vehicle.co2.rating}</span>
            {isEV && ' (zero tailpipe emissions, manufacturing-only footprint)'}
          </p>
        </div>
      </div>

      {/* Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-gray-500" /> How It Compares
        </h4>
        <div className="space-y-2">
          {[
            { label: 'Average EU Car (2024)', value: 47, color: 'bg-orange-500' },
            { label: 'This Vehicle', value: vehicle.co2.totalLifecycle, color: vehicle.co2.totalLifecycle < 15 ? 'bg-emerald-500' : 'bg-amber-500' },
            { label: 'EU 2035 Target', value: 12, color: 'bg-emerald-500' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-semibold">{item.value}t</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.min(100, (item.value / 60) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QRPassportTab({ vehicle }: { vehicle: VehiclePassport | null }) {
  const [copied, setCopied] = useState(false);

  if (!vehicle) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center">
        <QrCode className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No vehicle selected</p>
        <p className="text-xs text-gray-400 mt-1">Search for a VIN in the Lookup tab first.</p>
      </div>
    );
  }

  const passportData = {
    vin: vehicle.vin,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    origin: vehicle.countryOfOrigin,
    plant: vehicle.assemblyPlant,
    engine: vehicle.engineType,
    fuel: vehicle.fuelType,
    co2_lifecycle_tonnes: vehicle.co2.totalLifecycle,
    co2_rating: vehicle.co2.rating,
    issued: new Date().toISOString().split('T')[0],
  };

  const qrValue = JSON.stringify(passportData);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(passportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* QR Code Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <QrCode className="w-4 h-4 text-gray-500" /> Digital Vehicle Passport — QR Code
          </h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* QR Code */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
              <QRCodeSVG
                value={qrValue}
                size={200}
                level="M"
                bgColor="#ffffff"
                fgColor="#1a1a1a"
                includeMargin={false}
              />
              <p className="text-center text-xs text-gray-400 mt-3 font-mono">{vehicle.vin}</p>
            </div>

            {/* Passport Summary */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Fingerprint className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</h4>
                  <p className="text-xs text-gray-500">Issued: {passportData.issued}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'VIN', value: vehicle.vin, mono: true },
                  { label: 'Origin', value: vehicle.countryOfOrigin },
                  { label: 'Fuel', value: vehicle.fuelType },
                  { label: 'CO₂ Rating', value: vehicle.co2.rating },
                  { label: 'Lifecycle CO₂', value: `${vehicle.co2.totalLifecycle}t` },
                  { label: 'Body Style', value: vehicle.bodyStyle },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className={`font-semibold text-gray-900 ${item.mono ? 'font-mono text-xs' : ''}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h4 className="font-semibold text-sm mb-4">Traceability Pipeline</h4>
        <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <span className="rounded bg-violet-100 text-violet-700 px-2.5 py-1 font-medium">VIN Decode</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-blue-100 text-blue-700 px-2.5 py-1 font-medium">CO₂ Calculation</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-emerald-100 text-emerald-700 px-2.5 py-1 font-medium">Passport Generation</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-amber-100 text-amber-700 px-2.5 py-1 font-medium">QR Encoding</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="rounded bg-gray-800 text-white px-2.5 py-1 font-medium">Blockchain-Ready</span>
        </div>
      </div>

      {/* Raw JSON */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Hash className="w-4 h-4 text-gray-500" /> Encoded Passport Data
          </h4>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>
        <pre className="p-4 text-xs font-mono text-gray-700 bg-gray-50 overflow-x-auto">
          {JSON.stringify(passportData, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function VinChain() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('lookup');
  const [selectedVehicle, setSelectedVehicle] = useState<VehiclePassport | null>(null);

  const handleSelectVehicle = (vin: string) => {
    setSelectedVehicle(demoVehicles[vin] || null);
  };

  const tabs: { id: TabId; label: string; icon: ReactNode }[] = [
    { id: 'lookup', label: 'VIN Lookup', icon: <Search className="w-4 h-4" /> },
    { id: 'co2', label: 'CO₂ Footprint', icon: <Leaf className="w-4 h-4" /> },
    { id: 'qr-passport', label: 'QR Passport', icon: <QrCode className="w-4 h-4" /> },
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Fingerprint className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">VIN-Chain Traceability</h1>
                <p className="text-xs text-gray-500">Interactive Vehicle Passport Demo — Decode, Trace, Verify</p>
              </div>
            </div>
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
        {activeTab === 'lookup' && <LookupTab selectedVehicle={selectedVehicle} onSelectVehicle={handleSelectVehicle} />}
        {activeTab === 'co2' && <CO2Tab vehicle={selectedVehicle} />}
        {activeTab === 'qr-passport' && <QRPassportTab vehicle={selectedVehicle} />}
      </main>

      {/* Tech Stack Footer */}
      <div className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="font-medium text-gray-700">Tech Stack:</span>
            {['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'qrcode.react', 'Lucide Icons'].map((tech) => (
              <span key={tech} className="rounded-full bg-gray-100 px-2.5 py-0.5">{tech}</span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2">
            <span className="font-medium text-gray-700">Concepts:</span>
            {['VIN Decoding', 'Vehicle Digital Passport', 'CO₂ Lifecycle Analysis', 'QR Traceability', 'EU Regulation Alignment'].map((concept) => (
              <span key={concept} className="rounded-full bg-gray-100 px-2.5 py-0.5">{concept}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
