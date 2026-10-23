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
  const cardRefs = useRef([])
  cardRefs.current = []
  const addCard = (el) => el && cardRefs.current.push(el)

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return undefined
    const reduced = prefersReducedMotion()

    let drag = null
    function onDown(e) {
      if (e.pointerType !== 'mouse') return
      drag = { x: e.clientX, s: rail.scrollLeft, moved: false }
      rail.classList.add('drag')
    }
    function onMove(e) {
      if (!drag) return
      const dx = e.clientX - drag.x
      if (Math.abs(dx) > 4) drag.moved = true
      rail.scrollLeft = drag.s - dx
    }
    function onUp() {
      if (!drag) return
      rail.classList.remove('drag')
      drag = null
    }
    rail.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    const tiltHandlers = []
    let stopCards = () => {}
    if (!reduced) {
      cardRefs.current.forEach((c) => {
        const move = (e) => {
          if (drag || e.pointerType !== 'mouse') return
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

      stopCards = reveal(cardRefs.current, { x: isPhone() ? 24 : 100, opacity: 0 }, { stagger: 0.08, duration: isPhone() ? 0.4 : 1 })
    }

    return () => {
      rail.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      tiltHandlers.forEach(([c, move, leave]) => {
        c.removeEventListener('pointermove', move)
        c.removeEventListener('pointerleave', leave)
      })
      stopCards()
    }
  }, [])

  // Continuous drift. The cards sit in a track that is moved with a GPU
  // transform (sub-pixel, so the motion is smooth at any speed). A copy of the
  // cards follows the originals, so when the drift has moved one full set it
  // wraps back seamlessly. It eases to a stop while the visitor hovers,
  // focuses, drags or uses the arrows, and stops whenever it is off screen.
  useEffect(() => {
    const rail = railRef.current
    const track = trackRef.current
    if (!rail || !track || prefersReducedMotion()) return undefined
    rail.classList.add('drift')
    let hovering = false
    let visible = false
    let offset = 0
    let speed = 0
    let last = performance.now()
    let raf = 0
    let loopW = 0
    // the rail's scroll position, cached from scroll events: reading
    // scrollLeft inside the frame loop would force a layout on every frame
    let scrollX = rail.scrollLeft
    const onScroll = () => (scrollX = rail.scrollLeft)
    rail.addEventListener('scroll', onScroll, { passive: true })

    const measure = () => {
      const first = track.querySelector('.h-sol-card')
      const clone = track.querySelector('.h-sol-card.clone')
      loopW = first && clone ? clone.offsetLeft - first.offsetLeft : 0
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)

    const hold = (ms) => {
      holdUntil.current = performance.now() + ms
    }

    function tick(now) {
      const dt = Math.min(now - last, 50) / 1000
      last = now
      const paused = hovering || now < holdUntil.current || rail.classList.contains('drag')
      // ease the speed towards its target so starts and stops are gentle
      const target = paused ? 0 : DRIFT_SPEED
      speed += (target - speed) * Math.min(1, dt * 4)
      offset += speed * dt
      if (loopW > 0) {
        // keep (manual scroll + drift) inside one set of cards
        if (scrollX + offset >= loopW) {
          if (scrollX >= loopW) {
            scrollX -= loopW
            rail.scrollLeft = scrollX
          } else offset -= loopW
        }
      }
      track.style.transform = `translate3d(${-offset.toFixed(2)}px, 0, 0)`
      raf = visible ? requestAnimationFrame(tick) : 0
    }
    const start = () => {
      if (!raf) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) start()
    })
    io.observe(rail)
    const enter = () => (hovering = true)
    const leave = () => {
      hovering = false
      hold(400)
    }
    const userScroll = () => hold(2000)
    rail.addEventListener('pointerenter', enter)
    rail.addEventListener('pointerleave', leave)
    // a tap also focuses the rail (it is tabbable), which used to stop the
    // drift until the visitor tapped elsewhere; only keyboard focus pauses it
    const focusIn = (e) => {
      if (e.target.matches(':focus-visible')) enter()
    }
    rail.addEventListener('focusin', focusIn)
    rail.addEventListener('focusout', leave)
    rail.addEventListener('wheel', userScroll, { passive: true })
    rail.addEventListener('touchstart', userScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      track.style.transform = ''
      rail.classList.remove('drift')
      rail.removeEventListener('scroll', onScroll)
      rail.removeEventListener('pointerenter', enter)
      rail.removeEventListener('pointerleave', leave)
      rail.removeEventListener('focusin', focusIn)
      rail.removeEventListener('focusout', leave)
      rail.removeEventListener('wheel', userScroll)
      rail.removeEventListener('touchstart', userScroll)
    }
  }, [])

  function railStep(dir) {
    holdUntil.current = performance.now() + 2000
    const c = railRef.current.querySelector('.h-sol-card')
    if (!c) return
    railRef.current.scrollBy({ left: dir * (c.offsetWidth + 20), behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <section className="h-solutions">
      <div className="h-wrap h-sol-head">
        <div className="h-sec-head">
          <span className="h-kicker">Solutions</span>
          <SplitHeading as="h2" text="The same record, read differently by every seat at the table" />
          <p>Seven roles, one shared record — everyone gets the view built for their job, not a one-size-fits-all dashboard.</p>
        </div>
        <div className="h-rail-btns">
          <button type="button" aria-label="Previous" onClick={() => railStep(-1)}>
            <Icon name="arrowRight" size={16} className="flip" />
          </button>
          <button type="button" aria-label="Next" onClick={() => railStep(1)}>
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
          {/* copy of the cards so the slow drift can loop seamlessly */}
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
