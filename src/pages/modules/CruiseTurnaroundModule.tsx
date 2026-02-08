import { Anchor } from 'lucide-react'
import { modules } from '../../data/moduleKpis'
import ModulePage from './ModulePage'

const mod = modules.find(m => m.id === 'cruise-turnaround')!

export default function CruiseTurnaroundModule() {
  return <ModulePage module={mod} icon={<Anchor className="w-6 h-6 text-white" />} />
}
