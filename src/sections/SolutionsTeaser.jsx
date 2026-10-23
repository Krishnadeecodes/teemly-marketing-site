import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import SplitHeading from '../home/SplitHeading.jsx'
import Icon from '../components/Icon.jsx'
import { isPhone, prefersReducedMotion } from '../home/useHomeScroll.js'
import { reveal } from '../home/reveal.js'
import { solutionsLinks } from '../data/navigation.js'
import '../home/solutions.css'

const slugs = ['executives', 'hr', 'managers', 'operations', 'it', 'finance', 'ai']
const toneColor = { blue: '#0187E0', purple: '#6A3BD8', pink: '#E91E63', green: '#1fb87f', cyan: '#03A6DD', amber: '#f0a83c' }
const featured = slugs.map((s) => solutionsLinks.find((l) => l.to.endsWith(`/${s}`))).filter(Boolean)

// Auto-scroll speed for the solutions rail, in pixels per second.
const DRIFT_SPEED = 45

export default function SolutionsTeaser() {
  const railRef = useRef(null)
  const trackRef = useRef(null)
  const holdUntil = useRef(0)
  const stepRef = useRef(() => {})
  const cardRefs = useRef([])
  cardRefs.current = []
  const addCard = (el) => el && cardRefs.current.push(el)

  // card tilt (mouse only) and the cards' entrance
  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const tiltHandlers = []
    cardRefs.current.forEach((c) => {
      const move = (e) => {
        if (railRef.current?.classList.contains('drag') || e.pointerType !== 'mouse') return
        const r = c.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        c.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`
        c.style.setProperty('--mx', `${e.clientX - r.left}px`)
        c.style.setProperty('--my', `${e.clientY - r.top}px`)
      }
      const leave = () => {
        c.style.transform = ''
      }
      c.addEventListener('pointermove', move)
      c.addEventListener('pointerleave', leave)
      tiltHandlers.push([c, move, leave])
    })
    const stopCards = reveal(cardRefs.current, { x: isPhone() ? 24 : 100, opacity: 0 }, { stagger: 0.08, duration: isPhone() ? 0.4 : 1 })
    return () => {
      tiltHandlers.forEach(([c, move, leave]) => {
        c.removeEventListener('pointermove', move)
        c.removeEventListener('pointerleave', leave)
      })
      stopCards()
    }
  }, [])

  // One position (`offset`) moves the cards, whatever moves it: the slow
  // drift, the arrows, a mouse drag or a finger swipe. The track is shifted
  // with a GPU transform and a copy of the cards follows the originals, so the
  // position simply wraps around one set of cards in either direction: Back
  // from the first card shows the last ones, and there is never an empty end.
  // (Mixing native scrolling with the drift used to leave nothing before the
  // first card, and made swipes jump on phones.)
  useEffect(() => {
    const rail = railRef.current
    const track = trackRef.current
    if (!rail || !track) return undefined
    const reduced = prefersReducedMotion()
    rail.classList.add('loop')
    let loopW = 0
    let step = 0
    let offset = 0
    let speed = 0 // drift speed, eased
    let glide = 0 // velocity left over from a swipe, px/s
    let target = null // where an arrow press is heading
    let hovering = false
    let visible = false
    let drag = null
    let raf = 0
    let last = performance.now()

    const measure = () => {
      const first = track.querySelector('.h-sol-card')
      const clone = track.querySelector('.h-sol-card.clone')
      const second = first?.nextElementSibling
      loopW = first && clone ? clone.offsetLeft - first.offsetLeft : 0
      step = first && second ? second.offsetLeft - first.offsetLeft : 0
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)

    const wrap = (x) => (loopW > 0 ? ((x % loopW) + loopW) % loopW : Math.max(0, x))
    const paint = () => {
      track.style.transform = `translate3d(${-wrap(offset).toFixed(2)}px, 0, 0)`
    }
    const hold = (ms) => {
      holdUntil.current = Math.max(holdUntil.current, performance.now() + ms)
    }

    function tick(now) {
      const dt = Math.min(now - last, 50) / 1000
      last = now
      if (target !== null) {
        // an arrow press: ease to the next card
        offset += (target - offset) * Math.min(1, dt * (reduced ? 60 : 9))
        if (Math.abs(target - offset) < 0.5) {
          offset = target
          target = null
        }
      } else if (glide && !drag) {
        // a swipe keeps going for a moment and slows down naturally
        offset += glide * dt
        glide *= Math.pow(0.04, dt)
        if (Math.abs(glide) < 8) glide = 0
      }
      const paused = reduced || hovering || drag || target !== null || glide || now < holdUntil.current
      speed += ((paused ? 0 : DRIFT_SPEED) - speed) * Math.min(1, dt * 4)
      offset += speed * dt
      // wrap into one set of cards; anything measured against the old value
      // moves with it, so a wrap is never visible
      const before = offset
      offset = wrap(offset)
      const shift = offset - before
      if (shift) {
        if (target !== null) target += shift
        if (drag) drag.o += shift
      }
      paint()
      const busy = !reduced || target !== null || glide || drag
      raf = visible && busy ? requestAnimationFrame(tick) : 0
    }
    const start = () => {
      if (!raf && visible) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }
    // an arrow press, from the buttons or the keyboard
    stepRef.current = (dir) => {
      if (!step) return
      glide = 0
      hold(2500)
      const from = target ?? offset
      // land on a card edge, one card further in the chosen direction
      target = Math.round(from / step) * step + dir * step
      if (Math.abs(target - from) < step * 0.25) target += dir * step
      start()
    }

    // drag with the mouse, swipe with a finger; vertical swipes stay with
    // the page (touch-action: pan-y in solutions.css)
    let moved = false
    let samples = []
    function onDown(e) {
      if (e.button !== 0) return
      drag = { x: e.clientX, y: e.clientY, o: offset, id: e.pointerId, horizontal: e.pointerType === 'mouse' }
      moved = false
      samples = [{ t: performance.now(), x: e.clientX }]
      target = null
      glide = 0
      start()
    }
    function onMove(e) {
      if (!drag || e.pointerId !== drag.id) return
      const dx = e.clientX - drag.x
      const dy = e.clientY - drag.y
      if (!drag.horizontal) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
        if (Math.abs(dy) > Math.abs(dx)) {
          drag = null // the page is being scrolled
          return
        }
        drag.horizontal = true
      }
      if (Math.abs(dx) > 4 && !moved) {
        moved = true
        rail.classList.add('drag')
      }
      offset = drag.o - dx
      samples.push({ t: performance.now(), x: e.clientX })
      if (samples.length > 5) samples.shift()
      paint()
    }
    function onUp(e) {
      if (!drag || e.pointerId !== drag.id) return
      if (moved && samples.length > 1) {
        const a = samples[0]
        const b = samples[samples.length - 1]
        glide = (-(b.x - a.x) / Math.max(1, b.t - a.t)) * 1000
      }
      drag = null
      rail.classList.remove('drag')
      hold(2500)
      start()
    }
    // a drag that ends on a card's link must not open it
    const onClick = (e) => {
      if (moved) {
        e.preventDefault()
        e.stopPropagation()
        moved = false
      }
    }
    rail.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    rail.addEventListener('click', onClick, true)

    // keyboard: ← → move a card when the rail has focus. Tabbing to a card's
    // link makes the browser scroll the rail itself; that scroll is folded
    // into the position instead.
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault()
        stepRef.current(e.key === 'ArrowRight' ? 1 : -1)
      }
    }
    const onScroll = () => {
      if (!rail.scrollLeft) return
      offset = wrap(offset + rail.scrollLeft)
      rail.scrollLeft = 0
      hold(2500)
      paint()
    }
    rail.addEventListener('keydown', onKey)
    rail.addEventListener('scroll', onScroll, { passive: true })

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) start()
    })
    io.observe(rail)
    const enter = (e) => {
      if (e.pointerType === 'mouse') hovering = true
    }
    const leave = () => {
      hovering = false
      hold(400)
    }
    // a tap also focuses the rail (it is tabbable); only keyboard focus pauses
    const focusIn = (e) => {
      if (e.target.matches(':focus-visible')) hovering = true
    }
    rail.addEventListener('pointerenter', enter)
    rail.addEventListener('pointerleave', leave)
    rail.addEventListener('focusin', focusIn)
    rail.addEventListener('focusout', leave)
    paint()

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      stepRef.current = () => {}
      track.style.transform = ''
      rail.classList.remove('loop', 'drag')
      rail.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      rail.removeEventListener('click', onClick, true)
      rail.removeEventListener('keydown', onKey)
      rail.removeEventListener('scroll', onScroll)
      rail.removeEventListener('pointerenter', enter)
      rail.removeEventListener('pointerleave', leave)
      rail.removeEventListener('focusin', focusIn)
      rail.removeEventListener('focusout', leave)
    }
  }, [])

  return (
    <section className="h-solutions">
      <div className="h-wrap h-sol-head">
        <div className="h-sec-head">
          <span className="h-kicker">Solutions</span>
          <SplitHeading as="h2" text="The same record, read differently by every seat at the table" />
          <p>Seven roles, one shared record — everyone gets the view built for their job, not a one-size-fits-all dashboard.</p>
        </div>
        <div className="h-rail-btns">
          <button type="button" aria-label="Previous" onClick={() => stepRef.current(-1)}>
            <Icon name="arrowRight" size={16} className="flip" />
          </button>
          <button type="button" aria-label="Next" onClick={() => stepRef.current(1)}>
            <Icon name="arrowRight" size={16} />
          </button>
        </div>
      </div>
      <div className="h-sol-rail" ref={railRef} tabIndex={0} aria-label="Solutions by role">
        <div className="h-sol-track" ref={trackRef}>
          {featured.map((s) => (
            <article className="h-sol-card h-spot" key={s.to} ref={addCard}>
              <span className="h-sol-role">
                <i style={{ background: toneColor[s.tone] || '#0187E0' }}>
                  <Icon name={s.icon} size={16} />
                </i>
                {s.label}
              </span>
              <h3>{s.desc}</h3>
              <Link to={s.to} className="h-textlink">
                See solutions for {s.label}
              </Link>
            </article>
          ))}
          {/* copy of the cards so the rail loops seamlessly in both directions */}
          {featured.map((s) => (
            <article className="h-sol-card h-spot clone" key={`clone-${s.to}`} aria-hidden="true">
              <span className="h-sol-role">
                <i style={{ background: toneColor[s.tone] || '#0187E0' }}>
                  <Icon name={s.icon} size={16} />
                </i>
                {s.label}
              </span>
              <h3>{s.desc}</h3>
              <Link to={s.to} className="h-textlink" tabIndex={-1}>
                See solutions for {s.label}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
