import { Construction, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PlaceholderPageProps {
  title: string
  description: string
  comingSoon?: boolean
}

export function PlaceholderPage({ title, description, comingSoon }: PlaceholderPageProps) {
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto mt-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-secondary flex items-center justify-center mx-auto mb-6">
        <Construction size={28} className="text-text-muted" />
      </div>
      <h1 className="text-2xl font-bold text-text-primary font-serif mb-3">{title}</h1>
      <p className="text-text-secondary mb-6 leading-relaxed">{description}</p>
      {comingSoon && (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ad-red bg-ad-red/5 px-4 py-2 rounded-full mb-6">
          <Construction size={16} />
          Coming Soon
        </span>
      )}
      <div className="mt-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-medium text-ad-red hover:text-ad-red-dark transition-colors"
        >
          Back to Dashboard <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
