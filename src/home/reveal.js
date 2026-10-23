import { gsap } from 'gsap'
import { isPhone, prefersReducedMotion } from './useHomeScroll.js'

/**
 * Scroll reveals for the whole site.
 *
 * These used to be GSAP ScrollTriggers, whose start positions are measured
 * once and go stale whenever an image, a font or a pinned section moves the
 * layout afterwards; text then appeared late, or not until the visitor
 * scrolled back. An IntersectionObserver reads where the element really is,
 * so a reveal can't drift.
 *
 * - Content is hidden in a layout effect (before the first paint), so it
 *   never flashes in, out and in again.
 * - Phones: whatever is already on screen stays as it is (no fade-in), and
 *   the rest starts revealing a quarter of a screen before it scrolls in, so
 *   it is finished by the time it is read.
 * - Anything the visitor jumped past (an anchor link, a fast fling) is shown
 *   once scrolling stops, so nothing is ever left invisible.
 */

const NEUTRAL = { x: 0, y: 0, xPercent: 0, yPercent: 0, rotate: 0, opacity: 1, scale: 1 }

export function inFirstView(el) {
  const r = el.getBoundingClientRect()
  return r.top < window.innerHeight && r.bottom > 0
}

/**
 * Calls `onShow(batch)` for the elements of `els` as they come into view
 * (elements arriving together share one batch). Returns a cleanup.
 */
export function whenInView(els, onShow, phone = isPhone()) {
  const pending = new Set(els)
  if (typeof IntersectionObserver === 'undefined') {
    onShow([...pending])
    return () => {}
  }

  const show = (batch) => {
    batch.forEach((el) => {
      pending.delete(el)
      io.unobserve(el)
    })
    onShow(batch)
    if (!pending.size) stop()
  }

  const io = new IntersectionObserver(
    (entries) => {
      const batch = entries.filter((e) => e.isIntersecting && pending.has(e.target)).map((e) => e.target)
      if (batch.length) show(batch)
    },
    { rootMargin: phone ? '0px 0px 25% 0px' : '0px 0px -8% 0px' },
  )
  pending.forEach((el) => io.observe(el))

  // Safety net for content scrolled past without ever crossing the viewport.
  let idle = 0
  const onScroll = () => {
    clearTimeout(idle)
    idle = setTimeout(() => {
      const passed = [...pending].filter((el) => el.getBoundingClientRect().top < window.innerHeight)
      if (passed.length) show(passed)
    }, 140)
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  function stop() {
    clearTimeout(idle)
    window.removeEventListener('scroll', onScroll)
    io.disconnect()
  }
  return stop
}

/**
 * Hides `targets` with `from` and animates them back to normal as they come
 * into view. Returns a cleanup that stops watching and restores the elements.
 * Options: duration, ease, delay (desktop only), stagger (between elements
 * that arrive together), phone (override the phone check).
 */
export function reveal(targets, from, opts = {}) {
  const els = (targets && targets.length !== undefined ? Array.from(targets) : [targets]).filter(Boolean)
  if (!els.length || prefersReducedMotion() || typeof window === 'undefined') return () => {}

  const phone = opts.phone ?? isPhone()
  const hidden = phone ? els.filter((el) => !inFirstView(el)) : els
  if (!hidden.length) return () => {}

  const to = {}
  Object.keys(from).forEach((k) => {
    if (k in NEUTRAL) to[k] = NEUTRAL[k]
  })
  const clearProps = Object.keys(to).join(',')
  gsap.set(hidden, from)

  // Phones hand the fade to a CSS transition: the compositor runs it, so it
  // stays smooth even while the page's JavaScript is busy (loading the next
  // pages in the background, a scroll handler, a slow device).
  const transition = (batch) =>
    batch.forEach((el) => {
      const d = opts.duration ?? 0.4
      el.style.transition = `opacity ${d}s ease-out, transform ${d}s cubic-bezier(0.2, 0.7, 0.2, 1), translate ${d}s, rotate ${d}s, scale ${d}s`
      gsap.set(el, { clearProps })
      const done = (e) => {
        if (e && e.target !== el) return
        el.style.transition = ''
        el.removeEventListener('transitionend', done)
      }
      el.addEventListener('transitionend', done)
      setTimeout(done, d * 1000 + 100)
    })

  const animate = (batch) =>
    gsap.to(batch, {
      ...to,
      duration: opts.duration ?? 0.9,
      ease: opts.ease ?? 'power3.out',
      delay: opts.delay || 0,
      stagger: opts.stagger || 0,
      overwrite: true,
      clearProps,
    })

  const stop = whenInView(hidden, phone ? transition : animate, phone)

  return () => {
    stop()
    gsap.killTweensOf(hidden)
    gsap.set(hidden, { clearProps })
  }
}
