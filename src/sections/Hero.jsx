import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import HeroDashboard from '../components/HeroDashboard.jsx'
import FitScale from '../components/FitScale.jsx'
import { useMagnetic } from '../home/useMagnetic.js'
import { gsap, prefersReducedMotion } from '../home/useHomeScroll.js'
import '../home/hero.css'

const CHIPS = [
  { label: 'People', color: '#0187E0' },
  { label: 'Work', color: '#03A6DD' },
  { label: 'Apps', color: '#07D7D9' },
  { label: 'Workflows', color: '#6A3BD8' },
  { label: 'AI', color: '#F62DA0' },
]


export default function Hero() {
  const heroRef = useRef(null)
  const l1Ref = useRef(null)
  const l2Ref = useRef(null)
  const introRefs = useRef([])
  const pulseRef = useRef(null)
  const primaryBtn = useMagnetic()
  const ghostBtn = useMagnetic()

  introRefs.current = []
  const addIntro = (el) => el && introRefs.current.push(el)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    const words = l1Ref.current ? l1Ref.current.querySelectorAll('.w > span') : []
    const chips = heroRef.current ? heroRef.current.querySelectorAll('.h-hv-chip') : []
    const q = (s) => (heroRef.current ? heroRef.current.querySelectorAll(s) : [])
    const line = q('.h-db-line')
    const fills = q('.h-db-appfill')
    const stacks = q('.h-db-stack')
    const peak = q('.h-db-peak, .h-db-peakline, .h-db-area')
    const flow = heroRef.current ? heroRef.current.querySelector('.h-hv-flow') : null

    if (reduced) {
      gsap.set(words, { yPercent: 0 })
      gsap.set([l2Ref.current, ...introRefs.current], { y: 0, opacity: 1 })
      gsap.set([chips, flow, pulseRef.current, peak], { y: 0, opacity: 1 })
      gsap.set(line, { strokeDashoffset: 0 })
      return undefined
    }

    gsap.set(words, { yPercent: 110 })
    gsap.set([l2Ref.current, ...introRefs.current], { y: 24, opacity: 0 })

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.to(words, { yPercent: 0, duration: 1.1, stagger: 0.05 })
      .to(l2Ref.current, { y: 0, opacity: 1, duration: 1 }, '-=0.8')
      .to(introRefs.current, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, '-=0.8')
      .from(chips, { y: 16, opacity: 0, duration: 0.7 }, 0.2)
      .from(flow, { opacity: 0, duration: 0.6 }, 0.2)

    // The dashboard arrives as one finished screen alongside the headline:
    // every card, number and row is present at once (no per-item stagger).
    // Only the charts get a quick, simultaneous draw-in on wider screens.
    tl.from(pulseRef.current, { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.2)
    if (window.matchMedia('(min-width: 901px)').matches) {
      tl.fromTo(line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out' }, 0.3)
        .from(fills, { scaleX: 0, transformOrigin: '0 50%', duration: 0.9, ease: 'power3.out' }, 0.3)
        .from(stacks, { scaleY: 0, transformOrigin: '50% 100%', duration: 0.9, ease: 'power3.out' }, 0.3)
        .from(peak, { opacity: 0, duration: 0.4 }, 0.8)
    } else {
      gsap.set(line, { strokeDashoffset: 0 })
    }

    let moveHandler
    let leaveHandler
    const hero = heroRef.current
    if (hero && window.matchMedia('(pointer: fine)').matches) {
      moveHandler = (e) => {
        const r = hero.getBoundingClientRect()
        const mx = (e.clientX - r.left) / r.width - 0.5
        const my = (e.clientY - r.top) / r.height - 0.5
        gsap.to(pulseRef.current, { rotateY: mx * 5, rotateX: -my * 5, transformPerspective: 1400, duration: 0.8, overwrite: 'auto' })
      }
      leaveHandler = () => {
        gsap.to(pulseRef.current, { rotateX: 0, rotateY: 0, duration: 0.8 })
      }
      hero.addEventListener('pointermove', moveHandler)
      hero.addEventListener('pointerleave', leaveHandler)
    }

    return () => {
      tl.revert()
      if (hero && moveHandler) {
        hero.removeEventListener('pointermove', moveHandler)
        hero.removeEventListener('pointerleave', leaveHandler)
      }
    }
  }, [])

  return (
    <section className="h-hero h-dots" ref={heroRef}>
      <div className="h-aurora" aria-hidden="true">
        <i className="a1" />
        <i className="a2" />
        <i className="a3" />
      </div>

      <div className="h-wrap h-hero-grid">
        <div className="h-hero-copy">
          <span className="h-kicker" ref={addIntro}>
            Organizational Intelligence Platform
          </span>

          <h1>
            <span className="h-split" ref={l1Ref} aria-hidden="true">
              {'Turn everyday work signals into'.split(' ').map((w, i) => (
                <span className="w" key={i}>
                  <span>{w}</span>
                </span>
              ))}
            </span>
            <span className="h-l2" ref={l2Ref}>
              organizational intelligence.
            </span>
          </h1>

          <p className="h-hero-sub" ref={addIntro}>
            Teemly brings how your people, work and technology actually operate into one live view, then turns it
            into clear reports your leaders can act on.
          </p>

          <div className="h-hero-ctas" ref={addIntro}>
            <Link to="/book-a-demo" className="h-btn h-btn-primary" ref={primaryBtn}>
              Book a Demo
              <span className="h-arr" aria-hidden="true">
                <Icon name="arrowRight" size={14} />
              </span>
            </Link>
            <Link to="/take-a-tour" className="h-btn h-btn-ghost" ref={ghostBtn}>
              Take a Tour
            </Link>
          </div>

          <div className="h-hero-meta" ref={addIntro}>
            <span>
              <i />
              Lightweight desktop app, no browser extension
            </span>
            <span>
              <i />
              Privacy controls built in
            </span>
          </div>
        </div>

        <div
          className="h-hero-vis"
          role="img"
          aria-label="Illustrative example of the Teemly dashboard. Signals from people, work, apps, workflows and AI feed one dashboard showing time worked, idle time, productivity, people online, activity by month, top apps, hours this week and live activity, with an AI insight: focus time is down 18% in Sales since a new review cadence."
        >
          {/* phones see the full desktop visual, scaled down like a screenshot */}
          <FitScale width={720} media="(max-width: 760px)">
            <div className="h-hv-sources" aria-hidden="true">
              {CHIPS.map((c) => (
                <span className="h-hv-chip" key={c.label}>
                  <i style={{ background: c.color }} />
                  {c.label}
                </span>
              ))}
            </div>

            <svg className="h-hv-flow" viewBox="0 0 520 64" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="hvGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="64">
                  <stop offset="0" stopColor="#07D7D9" />
                  <stop offset="1" stopColor="#F62DA0" />
                </linearGradient>
              </defs>
              <g className="base">
                <path d="M52 0C52 38 260 26 260 64" />
                <path d="M156 0C156 34 260 30 260 64" />
                <path d="M260 0V64" />
                <path d="M364 0C364 34 260 30 260 64" />
                <path d="M468 0C468 38 260 26 260 64" />
              </g>
              <g className="pulse">
                <path d="M52 0C52 38 260 26 260 64" />
                <path d="M156 0C156 34 260 30 260 64" />
                <path d="M260 0V64" />
                <path d="M364 0C364 34 260 30 260 64" />
                <path d="M468 0C468 38 260 26 260 64" />
              </g>
            </svg>

            <HeroDashboard ref={pulseRef} />
          </FitScale>
        </div>
      </div>

    </section>
  )
}
