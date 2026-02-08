import { Globe } from 'lucide-react'
import { modules } from '../../data/moduleKpis'
import ModulePage from './ModulePage'

const mod = modules.find(m => m.id === 'digital-twin')!

export default function DigitalTwinModule() {
  return <ModulePage module={mod} icon={<Globe className="w-6 h-6 text-white" />} />
}
