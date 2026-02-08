import { Ship } from 'lucide-react'
import { modules } from '../../data/moduleKpis'
import ModulePage from './ModulePage'

const mod = modules.find(m => m.id === 'trade-flow')!

export default function TradeFlowModule() {
  return <ModulePage module={mod} icon={<Ship className="w-6 h-6 text-white" />} />
}
