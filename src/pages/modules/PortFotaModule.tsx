import { Radio } from 'lucide-react'
import { modules } from '../../data/moduleKpis'
import ModulePage from './ModulePage'

const mod = modules.find(m => m.id === 'port-fota')!

export default function PortFotaModule() {
  return <ModulePage module={mod} icon={<Radio className="w-6 h-6 text-white" />} />
}
