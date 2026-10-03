import { useEffect, useRef } from 'react'
import Icon from '../components/Icon.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../home/useHomeScroll.js'
import '../home/problem.css'

const cards = [
  {
    icon: 'users',
    title: 'People',
    color: '#0187E0',
    desc: 'Attendance gets filled in after the fact. Who was actually working, when, and for how long stays a guess until the end of the month.',
  },
  {
    icon: 'monitor',
    title: 'Work',
    color: '#03A6DD',
    desc: 'Work happens across dozens of applications and browser tabs a day. None of it is visible until a manager asks, and by then it is a memory.',
  },
  {
    icon: 'cpu',
    title: 'Technology',
    color: '#E91E63',
    desc: 'Software licences renew automatically, whether or not anyone is using them. Nobody notices the waste until the invoice arrives.',
  },
]

export default function Problem() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const siloRefs = useRef([])
  const coreRef = useRef(null)
  const linksRef = useRef(null)
  const cap1Ref = useRef(null)
  const cap2Ref = useRef(null)

  siloRefs.current = []
  const addSilo = (el) => el && siloRefs.current.push(el)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    const silos = siloRefs.current
    const paths = linksRef.current ? linksRef.current.querySelectorAll('path') : []

    if (reduced) {
      gsap.set(silos, { x: 0, y: 0, rotate: 0, opacity: 1, filter: 'none' })
      gsap.set(coreRef.current, { scale: 1, rotate: 0 })
      gsap.set(paths, { strokeDashoffset: 0 })
      gsap.set(cap2Ref.current, { opacity: 1, y: 0 })
      gsap.set(cap1Ref.current, { opacity: 0 })
      return undefined
    }

    const mm = gsap.matchMedia()
    mm.add('(min-width: 901px)', () => {
      const offs = [
        [-90, -60, -12],
        [90, -60, 12],
        [0, 90, 8],
      ]
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      silos.forEach((s, i) => {
        tl.fromTo(
          s,
          { x: offs[i][0], y: offs[i][1], rotate: offs[i][2], opacity: 0.4, filter: 'grayscale(1)' },
          { x: 0, y: 0, rotate: 0, opacity: 1, filter: 'grayscale(0)', duration: 1, ease: 'power2.inOut' },
          0
        )
      })
      tl.fromTo(coreRef.current, { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.6)' }, 0.6)
        .fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.08 }, 0.8)
        .to(cap1Ref.current, { opacity: 0, y: -16, duration: 0.3 }, 0.7)
        .fromTo(cap2Ref.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3 }, 0.88)

      return () => {
        gsap.set(silos, { clearProps: 'all' })
      }
    })

    mm.add('(max-width: 900px)', () => {
      gsap.set(paths, { strokeDashoffset: 1 })
      const tl = gsap.timeline({ scrollTrigger: { trigger: stageRef.current, start: 'top 75%', once: true } })
      tl.from(silos, { scale: 0.82, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'back.out(1.6)' })
        .from(coreRef.current, { scale: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.2')
        .to(paths, { strokeDashoffset: 0, duration: 0.6, stagger: 0.08 }, '-=0.2')
        .to(cap1Ref.current, { opacity: 0, duration: 0.3 }, '+=0.3')
        .to(cap2Ref.current, { opacity: 1, duration: 0.4 })
      return undefined
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="h-problem" ref={sectionRef}>
      <div className="h-wrap h-problem-grid">
        <div>
          <span className="h-kicker pink">The Problem</span>
          <SplitHeading as="h2" text="The signals already exist. They are just scattered." />
          <div className="h-caps">
            <p className="h-cap h-cap1" ref={cap1Ref}>
              <strong>Three systems. Three partial stories.</strong>
              Every tool you run holds a piece of how work happens. None hold the whole thing, so leaders decide on
              instinct and lagging reports.
            </p>
            <p className="h-cap h-cap2" ref={cap2Ref}>
              <strong>One model. The whole picture.</strong>
              Teemly connects the pieces into a shared organisational record, so every decision starts from how work
              really happens.
            </p>
          </div>
        </div>

        <div className="h-stage" ref={stageRef} aria-hidden="true">
          <svg className="h-links" ref={linksRef} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path pathLength="1" d="M20 22 Q 36 30 50 50" stroke="#0187E0" />
            <path pathLength="1" d="M80 22 Q 64 30 50 50" stroke="#07D7D9" />
            <path pathLength="1" d="M50 88 Q 50 70 50 50" stroke="#E91E63" />
          </svg>
          <div className="h-silos">
            {cards.map((c) => (
              <div className="h-silo" key={c.title} ref={addSilo}>
                <div className="h-silo-ic" style={{ background: c.color }}>
                  <Icon name={c.icon} size={18} />
                </div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="h-core" ref={coreRef}>
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <defs>
                <linearGradient id="probBar" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#0187E0" />
                  <stop offset="1" stopColor="#07D7D9" />
                </linearGradient>
                <linearGradient id="probStem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#F62DA0" />
                  <stop offset="1" stopColor="#E91E63" />
                </linearGradient>
              </defs>
              <rect x="2" y="4" width="44" height="20" rx="10" fill="url(#probBar)" />
              <path d="M13 20h20v30a10 10 0 0 1-20 0Z" fill="url(#probStem)" />
              <path d="M13 20h20L13 36Z" fill="#032297" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
