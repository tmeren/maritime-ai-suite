import { Battery } from 'lucide-react'
import { modules } from '../../data/moduleKpis'
import ModulePage from './ModulePage'

const mod = modules.find(m => m.id === 'lithium-sentinel')!

export default function LithiumSentinelModule() {
  return <ModulePage module={mod} icon={<Battery className="w-6 h-6 text-white" />} />
}
