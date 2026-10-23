import { useLayoutEffect, useRef } from 'react'
import { gsap, isPhone, prefersReducedMotion } from './useHomeScroll.js'
import { reveal, whenInView } from './reveal.js'
import './splitHeading.css'

/**
 * Renders text split into per-word spans and reveals them word-by-word.
 * mode="load"   -> plays immediately on mount (page titles)
 * mode="scroll" -> plays once the element scrolls into view
 *
 * Runs in a layout effect so the words are hidden before the first paint,
 * never shown, hidden and shown again.
 */
export default function SplitHeading({ as: Tag = 'h2', text, className = '', mode = 'scroll', delay = 0 }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return undefined
    const words = el.querySelectorAll('.w > span')
    const phone = isPhone()

    // phones: a page title is simply there from the first frame; other
    // headings fade up as a whole (or stay put when already on screen)
    if (phone) return mode === 'scroll' ? reveal(el, { y: 12, opacity: 0 }) : undefined

    const play = () =>
      gsap.to(words, {
        yPercent: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.04,
        delay,
        overwrite: true,
        clearProps: 'transform',
      })

    gsap.set(words, { yPercent: 110 })
    const stop = mode === 'load' ? (play(), () => {}) : whenInView([el], play)
    return () => {
      stop()
      gsap.killTweensOf(words)
      gsap.set(words, { clearProps: 'transform' })
    }
  }, [mode, delay, text])

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
