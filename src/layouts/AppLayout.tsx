import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'
import { ChatPanel } from '../components/ChatPanel'
import { MobileNav } from '../components/MobileNav'

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkBreakpoint = () => {
      const w = window.innerWidth
      setIsMobile(w < 768)
      if (w < 768) {
        setSidebarCollapsed(true)
        setMobileMenuOpen(false)
      } else if (w < 1280) {
        setSidebarCollapsed(true)
      }
    }
    checkBreakpoint()
    window.addEventListener('resize', checkBreakpoint)
    return () => window.removeEventListener('resize', checkBreakpoint)
  }, [])

  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 72 : 260

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Sidebar: hidden on mobile, shown on tablet/desktop */}
      {!isMobile && (
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      )}

      {/* Mobile sidebar drawer */}
      {isMobile && mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 h-full z-50">
            <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} />
          </div>
        </>
      )}

      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <Header
          isMobile={isMobile}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 ${isMobile ? 'pb-20' : ''}`}>
          <Outlet />
        </main>
      </div>

      {/* Chat panel: full-screen on mobile, side panel on desktop */}
      <ChatPanel
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
      />

      {/* Mobile bottom nav */}
      {isMobile && (
        <MobileNav
          onMenuOpen={() => setMobileMenuOpen(true)}
          onChatOpen={() => setChatOpen(true)}
        />
      )}
    </div>
  )
}
