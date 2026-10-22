import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Mounts Lenis smooth scroll + wires it to GSAP ScrollTrigger for the
 * lifetime of the Home page only. Fully tears down on unmount so every
 * other route keeps native scrolling untouched. Each section removes its own
 * ScrollTriggers; killing them all here also took out triggers that belong
 * to components outside the home page.
 *
 * Lenis only smooths mouse-wheel scrolling, so on touch devices it would
 * just add a per-frame callback; phones and tablets keep native scrolling.
 */
export function useHomeScroll() {
  const lenisRef = useRef(null)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    if (reduced) {
      ScrollTrigger.refresh()
      return undefined
    }

    let lenis = null
    let tick = null
    if (window.matchMedia('(pointer: fine)').matches) {
      lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
        syncTouch: false,
      })
      lenisRef.current = lenis

      lenis.on('scroll', ScrollTrigger.update)

      tick = (time) => {
        lenis.raf(time * 1000)
      }
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }

    // On phones the address bar shows and hides while scrolling, firing a
    // height-only resize each time; a full refresh then stalls the scroll.
    // Only a width change (rotation, window resize) needs one, debounced.
    ScrollTrigger.config({ ignoreMobileResize: true })
    let lastWidth = window.innerWidth
    let resizeTimer = 0
    const resizeHandle = () => {
      if (window.innerWidth === lastWidth) return
      lastWidth = window.innerWidth
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200)
    }
    window.addEventListener('resize', resizeHandle)
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())

    let cancelled = false
    document.fonts?.ready?.then(() => {
      if (!cancelled) ScrollTrigger.refresh()
    })
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', resizeHandle)
      window.removeEventListener('load', onLoad)
      if (lenis) {
        gsap.ticker.remove(tick)
        gsap.ticker.lagSmoothing(500, 33)
        lenis.destroy()
        lenisRef.current = null
      }
    }
  }, [])

  return lenisRef
}

export { gsap, ScrollTrigger }
