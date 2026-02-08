import { Gavel } from 'lucide-react'
import { modules } from '../../data/moduleKpis'
import ModulePage from './ModulePage'

const mod = modules.find(m => m.id === 'slot-bid')!

export default function SlotBidModule() {
  return <ModulePage module={mod} icon={<Gavel className="w-6 h-6 text-white" />} />
}
