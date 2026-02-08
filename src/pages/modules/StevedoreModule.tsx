import { Cpu } from 'lucide-react'
import { modules } from '../../data/moduleKpis'
import ModulePage from './ModulePage'

const mod = modules.find(m => m.id === 'stevedore-ai')!

export default function StevedoreModule() {
  return <ModulePage module={mod} icon={<Cpu className="w-6 h-6 text-white" />} />
}
