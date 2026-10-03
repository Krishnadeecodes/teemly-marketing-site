import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import SplitHeading from '../home/SplitHeading.jsx'
import Icon from '../components/Icon.jsx'
import { gsap, prefersReducedMotion } from '../home/useHomeScroll.js'
import { solutionsLinks } from '../data/navigation.js'
import '../home/solutions.css'

const slugs = ['executives', 'hr', 'managers', 'operations', 'it', 'finance', 'ai']
const toneColor = { blue: '#0187E0', purple: '#6A3BD8', pink: '#E91E63', green: '#1fb87f', cyan: '#03A6DD', amber: '#f0a83c' }
const featured = slugs.map((s) => solutionsLinks.find((l) => l.to.endsWith(`/${s}`))).filter(Boolean)

export default function SolutionsTeaser() {
  const railRef = useRef(null)
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
    let cardTween = null
    if (!reduced) {
      cardRefs.current.forEach((c) => {
        const move = (e) => {
          if (drag) return
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

      cardTween = gsap.from(cardRefs.current, {
        x: 100,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: rail, start: 'top 85%', once: true },
      })
    }

    return () => {
      rail.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      tiltHandlers.forEach(([c, move, leave]) => {
        c.removeEventListener('pointermove', move)
        c.removeEventListener('pointerleave', leave)
      })
      if (cardTween) {
        cardTween.scrollTrigger && cardTween.scrollTrigger.kill()
        cardTween.revert()
      }
    }
  }, [])

  function railStep(dir) {
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
      </div>
    </section>
  )
}
