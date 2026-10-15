import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useLayoutEffect } from 'react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ChatbotWidget from './ChatbotWidget.jsx'
import { prefetchResourcePage } from '../lib/resourcesApi.js'

export default function Layout() {
  const { pathname, hash } = useLocation()

  // Before paint, so the new page never shows at the old scroll position.
  // 'instant' overrides the global smooth scrolling, which is for in-page anchors.
  useLayoutEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace('#', ''))
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  // Start loading a Resource Center page as soon as its link is pointed at,
  // focused or touched, so it's usually ready by the time it's clicked.
  useEffect(() => {
    function warm(e) {
      const a = e.target.closest?.('a[href^="/resources"]')
      if (a && a.origin === window.location.origin) prefetchResourcePage(a.pathname)
    }
    document.addEventListener('pointerover', warm, { passive: true })
    document.addEventListener('focusin', warm)
    document.addEventListener('touchstart', warm, { passive: true })
    return () => {
      document.removeEventListener('pointerover', warm)
      document.removeEventListener('focusin', warm)
      document.removeEventListener('touchstart', warm)
    }
  }, [])

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
    </>
  )
}
