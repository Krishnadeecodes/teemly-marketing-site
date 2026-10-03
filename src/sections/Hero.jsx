import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import ParticleT from '../home/ParticleT.jsx'
import { useMagnetic } from '../home/useMagnetic.js'
import { gsap, prefersReducedMotion } from '../home/useHomeScroll.js'
import '../home/hero.css'

export default function Hero() {
  const heroRef = useRef(null)
  const l1Ref = useRef(null)
  const l2Ref = useRef(null)
  const introRefs = useRef([])
  const hc1Ref = useRef(null)
  const hc2Ref = useRef(null)
  const primaryBtn = useMagnetic()
  const ghostBtn = useMagnetic()

  introRefs.current = []
  const addIntro = (el) => el && introRefs.current.push(el)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    const words = l1Ref.current ? l1Ref.current.querySelectorAll('.w > span') : []

    if (reduced) {
      gsap.set(words, { yPercent: 0 })
      gsap.set([l2Ref.current, ...introRefs.current], { y: 0, opacity: 1 })
      if (hc1Ref.current) hc1Ref.current.classList.add('show')
      if (hc2Ref.current) hc2Ref.current.classList.add('show')
      return undefined
    }

    gsap.set(words, { yPercent: 110 })
    gsap.set([l2Ref.current, ...introRefs.current], { y: 24, opacity: 0 })

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.to(words, { yPercent: 0, duration: 1.1, stagger: 0.05 })
      .to(l2Ref.current, { y: 0, opacity: 1, duration: 1 }, '-=0.8')
      .to(introRefs.current, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, '-=0.8')

    const t1 = setTimeout(() => hc1Ref.current && hc1Ref.current.classList.add('show'), 2300)
    const t2 = setTimeout(() => hc2Ref.current && hc2Ref.current.classList.add('show'), 2700)
    return () => {
      tl.kill()
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <section className="h-hero h-dots" ref={heroRef}>
      <div className="h-aurora" aria-hidden="true">
        <i className="a1" />
        <i className="a2" />
        <i className="a3" />
      </div>
      <ParticleT heroRef={heroRef} />

      <div className="h-wrap">
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
      </div>

      <div className="h-hero-float" aria-hidden="true">
        <div className="h-hero-card h-hc1" ref={hc1Ref}>
          <b>Own Agent</b>
          <p>Under 2MB installer — no browser extension, no third-party license</p>
        </div>
        <div className="h-hero-card h-hc2 pink" ref={hc2Ref}>
          <b>Fast Rollout</b>
          <p>Live in a day, from install to your org's first productivity score</p>
        </div>
      </div>

      <div className="h-scroll-cue" aria-hidden="true">
        <span />
        Scroll
      </div>
    </section>
  )
}
