import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

interface FeaturePreview {
  title: string
  description: string
}

interface PlaceholderPageProps {
  title: string
  description: string
  icon?: LucideIcon
  comingSoon?: boolean
  features?: FeaturePreview[]
}

export function PlaceholderPage({ title, description, icon: Icon, comingSoon = true, features }: PlaceholderPageProps) {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto mt-12 md:mt-16">
      {/* Header */}
      <div className="text-center mb-10">
        {Icon && (
          <div className="w-16 h-16 rounded-2xl bg-ad-red/10 flex items-center justify-center mx-auto mb-5">
            <Icon size={28} className="text-ad-red" />
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary font-serif mb-3">{title}</h1>
        <p className="text-text-secondary mb-4 leading-relaxed max-w-2xl mx-auto">{description}</p>
        {comingSoon && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ad-red bg-ad-red/5 px-4 py-2 rounded-full">
            Coming Soon
          </span>
        )}
      </div>

      {/* Feature Preview Cards */}
      {features && features.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-ad-white border border-border rounded-xl p-5 hover:shadow-card-hover transition-shadow"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center mb-3">
                <span className="text-sm font-bold text-ad-red">{i + 1}</span>
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1.5">{f.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Back button */}
      <div className="text-center">
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
