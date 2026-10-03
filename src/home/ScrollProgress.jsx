import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from './useHomeScroll.js'

export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion() || !barRef.current) return undefined
    const tween = gsap.to(barRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    })
    return () => {
      tween.scrollTrigger && tween.scrollTrigger.kill()
      tween.kill()
    }
  }, [])

  return <div id="home-progress" ref={barRef} aria-hidden="true" />
}
