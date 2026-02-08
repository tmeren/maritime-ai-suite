import { Link2 } from 'lucide-react'
import { modules } from '../../data/moduleKpis'
import ModulePage from './ModulePage'

const mod = modules.find(m => m.id === 'vin-chain')!

export default function VinChainModule() {
  return <ModulePage module={mod} icon={<Link2 className="w-6 h-6 text-white" />} />
}
