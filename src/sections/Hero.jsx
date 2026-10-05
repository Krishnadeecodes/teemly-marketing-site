import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
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

const BARS = [
  { h: 78, cls: '' }, { h: 82, cls: '' }, { h: 80, cls: '' }, { h: 84, cls: '' }, { h: 81, cls: '' },
  { h: 62, cls: 'dip' }, { h: 57, cls: 'dip' }, { h: 54, cls: 'dip' },
  { h: 70, cls: 'rec' }, { h: 79, cls: 'rec' }, { h: 85, cls: 'rec' }, { h: 88, cls: 'rec' },
]

export default function Hero() {
  const heroRef = useRef(null)
  const l1Ref = useRef(null)
  const l2Ref = useRef(null)
  const introRefs = useRef([])
  const pulseRef = useRef(null)
  const hc1Ref = useRef(null)
  const hc2Ref = useRef(null)
  const primaryBtn = useMagnetic()
  const ghostBtn = useMagnetic()

  introRefs.current = []
  const addIntro = (el) => el && introRefs.current.push(el)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    const words = l1Ref.current ? l1Ref.current.querySelectorAll('.w > span') : []
    const chips = heroRef.current ? heroRef.current.querySelectorAll('.h-hv-chip') : []
    const marks = heroRef.current ? heroRef.current.querySelectorAll('.h-hv-mark') : []
    const bars = heroRef.current ? heroRef.current.querySelectorAll('.h-hv-chart span') : []
    const flow = heroRef.current ? heroRef.current.querySelector('.h-hv-flow') : null

    if (reduced) {
      gsap.set(words, { yPercent: 0 })
      gsap.set([l2Ref.current, ...introRefs.current], { y: 0, opacity: 1 })
      gsap.set([chips, flow, pulseRef.current, bars, marks, hc1Ref.current, hc2Ref.current], { y: 0, opacity: 1, scaleY: 1 })
      return undefined
    }

    gsap.set(words, { yPercent: 110 })
    gsap.set([l2Ref.current, ...introRefs.current], { y: 24, opacity: 0 })

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.to(words, { yPercent: 0, duration: 1.1, stagger: 0.05 })
      .to(l2Ref.current, { y: 0, opacity: 1, duration: 1 }, '-=0.8')
      .to(introRefs.current, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, '-=0.8')
      .from(chips, { y: 16, opacity: 0, stagger: 0.07, duration: 0.7 }, '-=1')
      .from(flow, { opacity: 0, duration: 0.6 }, '-=0.4')
      .from(pulseRef.current, { y: 40, opacity: 0, duration: 1 }, '-=0.5')
      .from(bars, { scaleY: 0, stagger: 0.04, duration: 0.7, ease: 'power3.out' }, '-=0.6')
      .from(marks, { opacity: 0, stagger: 0.25, duration: 0.5 }, '-=0.2')
      .from(hc1Ref.current, { y: 24, opacity: 0, duration: 0.8 }, '-=0.1')
      .from(hc2Ref.current, { y: 24, opacity: 0, duration: 0.8 }, '-=0.45')

    let moveHandler
    let leaveHandler
    const hero = heroRef.current
    if (hero && window.matchMedia('(pointer: fine)').matches) {
      moveHandler = (e) => {
        const r = hero.getBoundingClientRect()
        const mx = (e.clientX - r.left) / r.width - 0.5
        const my = (e.clientY - r.top) / r.height - 0.5
        gsap.to(hc1Ref.current, { x: mx * -18, y: my * -14, duration: 0.8, overwrite: 'auto' })
        gsap.to(hc2Ref.current, { x: mx * 18, y: my * 14, duration: 0.8, overwrite: 'auto' })
        gsap.to(pulseRef.current, { rotateY: mx * 5, rotateX: -my * 5, transformPerspective: 1400, duration: 0.8, overwrite: 'auto' })
      }
      leaveHandler = () => {
        gsap.to([hc1Ref.current, hc2Ref.current], { x: 0, y: 0, duration: 0.8 })
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
            Teemly connects how your people, work and technology actually behave into one real-time record —
            captured by an agent Teemly built and owns end to end, then turned into reports your leaders can act on.
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
              Own EXE agent, no browser extension
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
          aria-label="Illustrative example. Signals from people, work, apps, workflows and AI feed a Sales team pulse. Focus time dropped after a new review cadence; reviews moved to Friday and selling time recovered."
        >
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

          <div className="h-hv-pulse" ref={pulseRef} aria-hidden="true">
            <div className="h-hv-top">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <defs>
                  <linearGradient id="hvBar" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#0187E0" />
                    <stop offset="1" stopColor="#07D7D9" />
                  </linearGradient>
                  <linearGradient id="hvStem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#F62DA0" />
                    <stop offset="1" stopColor="#E91E63" />
                  </linearGradient>
                </defs>
                <path d="M37 40h25v42a12.5 12.5 0 0 1-25 0z" fill="url(#hvStem)" />
                <path d="M37 40h25L37 55z" fill="#032297" />
                <rect x="6" y="16" width="88" height="26" rx="13" fill="url(#hvBar)" />
              </svg>
              Sales team pulse
              <span className="h-hv-range">Last 12 weeks</span>
              <span className="h-hv-live">
                <i /> Live
              </span>
            </div>

            <div className="h-hv-kpis">
              <div className="h-hv-kpi">
                <small>Focus time per day</small>
                <strong>4.6h</strong>
                <em className="up">+0.7h</em>
              </div>
              <div className="h-hv-kpi">
                <small>Review meetings</small>
                <strong>1 / week</strong>
                <em>was 3</em>
              </div>
              <div className="h-hv-kpi">
                <small>Selling time</small>
                <strong>52%</strong>
                <em className="up">+6 pts</em>
              </div>
            </div>

            <div className="h-hv-chart">
              {BARS.map((b, i) => (
                <span key={i} className={b.cls} style={{ height: `${b.h}%` }} />
              ))}
              <em className="h-hv-mark before" style={{ left: '41.6%' }}>
                New review cadence
              </em>
              <em className="h-hv-mark pink" style={{ left: '66.6%' }}>
                Reviews moved to Friday
              </em>
            </div>
            <div className="h-hv-axis">
              <span>12 weeks ago</span>
              <span>This week</span>
            </div>
          </div>

          <div className="h-hv-card h-hv-intel" ref={hc1Ref}>
            <b>Intelligence</b>
            <p>Focus time down 18% in Sales since the new review cadence</p>
          </div>
          <div className="h-hv-card h-hv-out pink" ref={hc2Ref}>
            <b>Outcome</b>
            <p>Reviews moved to Friday. Selling time recovered, tracked weekly.</p>
          </div>
        </div>
      </div>

      <span className="h-illus h-hero-illus">Interactive · Illustrative example</span>

      <div className="h-scroll-cue" aria-hidden="true">
        <span />
        Scroll
      </div>
    </section>
  )
}
