import { useEffect, useRef } from 'react'
import { gsap, isPhone, prefersReducedMotion } from './useHomeScroll.js'
import './splitHeading.css'

/**
 * Renders text split into per-word spans and reveals them word-by-word.
 * mode="load"   -> plays immediately on mount (hero h1)
 * mode="scroll" -> plays once the element scrolls into view
 */
export default function SplitHeading({ as: Tag = 'h2', text, className = '', mode = 'scroll', delay = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const words = el.querySelectorAll('.w > span')
    if (prefersReducedMotion()) {
      gsap.set(words, { yPercent: 0, opacity: 1 })
      return undefined
    }
    if (mode === 'scroll' && isPhone()) {
      // phones: the whole heading fades up at once
      const fade = gsap.from(el, {
        y: 12,
        opacity: 0,
        duration: 0.45,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 98%', once: true },
      })
      return () => {
        fade.scrollTrigger && fade.scrollTrigger.kill()
        fade.revert()
      }
    }
    gsap.set(words, { yPercent: 110 })
    const tween = gsap.to(words, {
      yPercent: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.04,
      delay,
      paused: mode === 'scroll',
      scrollTrigger:
        mode === 'scroll'
          ? { trigger: el, start: 'top 85%', once: true }
          : undefined,
    })
    if (mode === 'load') tween.play()
    return () => {
      tween.scrollTrigger && tween.scrollTrigger.kill()
      tween.kill()
    }
  }, [mode, delay])

  const words = text.split(/\s+/)

  return (
    <Tag className={`h-split ${className}`} ref={ref} aria-label={text}>
      {words.map((w, i) => (
        <span className="w" key={i} aria-hidden="true">
          <span>{w}</span>
        </span>
      ))}
    </Tag>
  )
}
