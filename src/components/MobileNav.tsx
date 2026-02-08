import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Anchor, MessageCircle, Menu } from 'lucide-react'

interface MobileNavProps {
  onMenuOpen: () => void
  onChatOpen: () => void
}

export function MobileNav({ onMenuOpen, onChatOpen }: MobileNavProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isSolution = location.pathname.startsWith('/solutions')

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-ad-white border-t border-border h-16 flex items-center justify-around px-4 safe-area-bottom">
      <button
        onClick={() => navigate('/')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
          isHome ? 'text-ad-red' : 'text-text-muted hover:text-text-secondary'
        }`}
      >
        <LayoutDashboard size={20} />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      <button
        onClick={onMenuOpen}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
          isSolution ? 'text-ad-red' : 'text-text-muted hover:text-text-secondary'
        }`}
      >
        <Anchor size={20} />
        <span className="text-[10px] font-medium">Solutions</span>
      </button>
      <button
        onClick={onChatOpen}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-text-muted hover:text-text-secondary transition-colors"
      >
        <MessageCircle size={20} />
        <span className="text-[10px] font-medium">Chat</span>
      </button>
      <button
        onClick={onMenuOpen}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-text-muted hover:text-text-secondary transition-colors"
      >
        <Menu size={20} />
        <span className="text-[10px] font-medium">More</span>
      </button>
    </div>
  )
}
