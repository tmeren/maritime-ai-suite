import { BatteryCharging } from 'lucide-react'
import { modules } from '../../data/moduleKpis'
import ModulePage from './ModulePage'

const mod = modules.find(m => m.id === 'battery-health')!

export default function BatteryHealthModule() {
  return <ModulePage module={mod} icon={<BatteryCharging className="w-6 h-6 text-white" />} />
}
