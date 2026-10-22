import { useEffect } from 'react'

/**
 * Marks each direct child of `rootRef` with `is-offscreen` while it is out
 * of view; motion.css pauses every CSS animation inside a marked block.
 *
 * Several always-running animations (signal pulses, orbits, ripples, glows)
 * animate properties the GPU cannot take over, so the browser repaints them
 * on every frame even when they are far off screen. On phones that constant
 * background work is what made scrolling stutter.
 */
export function usePauseOffscreen(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('is-offscreen', !e.isIntersecting)),
      { rootMargin: '200px 0px' },
    )
    Array.from(root.children).forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [rootRef])
}
