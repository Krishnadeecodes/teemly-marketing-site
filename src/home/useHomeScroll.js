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
 * other route keeps native scrolling untouched.
 */
export function useHomeScroll() {
  const lenisRef = useRef(null)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    if (reduced) {
      ScrollTrigger.refresh()
      return undefined
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const resizeHandle = () => ScrollTrigger.refresh()
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
      window.removeEventListener('resize', resizeHandle)
      window.removeEventListener('load', onLoad)
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return lenisRef
}

export { gsap, ScrollTrigger }
