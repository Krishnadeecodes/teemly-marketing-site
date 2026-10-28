import { Outlet, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { prefetchResourcePage } from '../lib/resourcesApi.js'

// The chat assistant (and its answer data) loads once the page is up and the
// browser is idle, so it never competes with the page's own first paint.
const ChatbotWidget = lazy(() => import('./ChatbotWidget.jsx'))

function useWhenIdle() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let id = 0
    const go = () => {
      id = window.requestIdleCallback ? requestIdleCallback(() => setReady(true), { timeout: 3000 }) : setTimeout(() => setReady(true), 1200)
    }
    if (document.readyState === 'complete') go()
    else window.addEventListener('load', go, { once: true })
    return () => {
      window.removeEventListener('load', go)
      if (window.cancelIdleCallback) cancelIdleCallback(id)
      clearTimeout(id)
    }
  }, [])
  return ready
}

export default function Layout() {
  const { pathname, hash, key } = useLocation()
  const chatReady = useWhenIdle()
  // The app decides where each page starts; the browser's own restoration
  // could re-apply the previous page's scroll position after we jump.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])

  // Before paint, so the new page never shows at the old scroll position.
  useLayoutEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace('#', ''))
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
        return
      }
    }
    // Jump without animation. 'instant' overrides the global smooth scrolling
    // (meant for in-page anchors), but some mobile browsers don't honour it
    // and glide up from the old position instead, starting at the new page's
    // footer. So smooth scrolling is also switched off for this one jump;
    // reading the computed style makes the browser apply that before it scrolls.
    const root = document.documentElement
    const prev = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'
    void getComputedStyle(root).scrollBehavior
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    root.style.scrollBehavior = prev
    // key: a link to the page already open is a navigation too, so it also
    // returns to the top instead of doing nothing
  }, [pathname, hash, key])

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
        {/* Shown only when a page is opened directly and its code is still on
            the way; moving between pages keeps the current one up instead. */}
        <Suspense fallback={<div className="route-loading" aria-busy="true" aria-label="Loading" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      {chatReady && (
        <Suspense fallback={null}>
          <ChatbotWidget />
        </Suspense>
      )}
    </>
  )
}
