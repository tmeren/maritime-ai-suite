import { Plane } from 'lucide-react'
import { modules } from '../../data/moduleKpis'
import ModulePage from './ModulePage'

const mod = modules.find(m => m.id === 'sky-link')!

export default function SkyLinkModule() {
  return <ModulePage module={mod} icon={<Plane className="w-6 h-6 text-white" />} />
}
