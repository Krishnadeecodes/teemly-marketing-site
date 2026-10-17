import { useEffect, useLayoutEffect, useRef } from 'react'
import Icon from '../components/Icon.jsx'
import Logo from '../components/Logo.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import { gsap, prefersReducedMotion } from '../home/useHomeScroll.js'
import '../home/problem.css'

const cards = [
  {
    icon: 'users',
    title: 'People',
    color: '#0187E0',
    desc: 'Attendance is filled in after the fact, so who worked, when and for how long stays a guess until month end.',
  },
  {
    icon: 'monitor',
    title: 'Work',
    color: '#03A6DD',
    desc: 'Work is spread across dozens of apps and tabs a day, and none of it is visible until someone asks.',
  },
  {
    icon: 'cpu',
    title: 'Technology',
    color: '#E91E63',
    desc: 'Software licences renew whether or not anyone uses them, and the waste only shows up on the invoice.',
  },
]

// Draws each connector from the edge of its card to the edge of the centre
// circle, using layout positions (not transforms) so the lines always land on
// the nodes, whatever the screen size or animation state.
function drawLinks(stage, svg, core, silos) {
  const w = stage.offsetWidth
  const h = stage.offsetHeight
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
  const cx = core.offsetLeft + core.offsetWidth / 2
  const cy = core.offsetTop + core.offsetHeight / 2
  const r = core.offsetWidth / 2 + 4
  const paths = svg.querySelectorAll('path')
  silos.forEach((el, i) => {
    const below = el.offsetTop > cy
    const sx = el.offsetLeft + el.offsetWidth / 2
    const sy = below ? el.offsetTop : el.offsetTop + el.offsetHeight
    const dx = sx - cx
    const dy = sy - cy
    const len = Math.hypot(dx, dy) || 1
    const ex = cx + (dx / len) * r
    const ey = cy + (dy / len) * r
    const d = Math.hypot(sx - ex, sy - ey) * 0.5
    const c1y = sy + (below ? -d : d)
    const c2x = ex + (dx / len) * d
    const c2y = ey + (dy / len) * d
    const def = `M${sx.toFixed(1)} ${sy.toFixed(1)}C${sx.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`
    paths[i].setAttribute('d', def)
    paths[i + silos.length].setAttribute('d', def)
  })
}

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

  useLayoutEffect(() => {
    const stage = stageRef.current
    const draw = () => drawLinks(stage, linksRef.current, coreRef.current, siloRefs.current)
    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(stage)
    siloRefs.current.forEach((el) => ro.observe(el))
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const silos = siloRefs.current
    const lines = linksRef.current.querySelectorAll('.line')
    const pulses = linksRef.current.querySelectorAll('.pulse')

    if (prefersReducedMotion()) {
      gsap.set(cap1Ref.current, { opacity: 0 })
      gsap.set(cap2Ref.current, { opacity: 1, y: 0 })
      return undefined
    }

    const offs = [
      [-36, -28],
      [36, -28],
      [0, 36],
    ]
    const mm = gsap.matchMedia()
    mm.add('(min-width: 901px)', () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=110%',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      silos.forEach((s, i) => {
        tl.fromTo(s, { x: offs[i][0], y: offs[i][1], opacity: 0.35 }, { x: 0, y: 0, opacity: 1, duration: 0.7 }, 0)
      })
      tl.fromTo(coreRef.current, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }, 0.45)
        .fromTo(lines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.45, stagger: 0.08 }, 0.7)
        .fromTo(pulses, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 1.1)
        .to(cap1Ref.current, { opacity: 0, y: -16, duration: 0.3 }, 0.8)
        .fromTo(cap2Ref.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3 }, 0.95)
        .to({}, { duration: 0.3 })
      return undefined
    })

    mm.add('(max-width: 900px)', () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: stageRef.current, start: 'top 75%', once: true },
      })
      tl.from(silos, { y: 24, opacity: 0, stagger: 0.1, duration: 0.6 })
        .fromTo(coreRef.current, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' }, '-=0.2')
        .fromTo(lines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.08 }, '-=0.2')
        .fromTo(pulses, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .to(cap1Ref.current, { opacity: 0, duration: 0.3 }, '+=0.3')
        .fromTo(cap2Ref.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 })
      return undefined
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="h-problem" ref={sectionRef}>
      <div className="h-wrap h-problem-grid">
        <div className="h-problem-copy">
          <div className="h-sec-head">
            <span className="h-kicker pink">The Problem</span>
            <SplitHeading as="h2" text="The signals already exist. They are just scattered." />
          </div>
          <div className="h-caps">
            <p className="h-cap h-cap1" ref={cap1Ref}>
              <strong>Three systems. Three partial stories.</strong>
              Each tool you use holds part of the picture. None holds all of it, so leaders end up deciding on
              instinct and month-old reports.
            </p>
            <p className="h-cap h-cap2" ref={cap2Ref}>
              <strong>One record. The whole picture.</strong>
              Teemly brings the pieces together in one shared record, so every decision starts from how work really
              happens.
            </p>
          </div>
        </div>

        <div className="h-stage" ref={stageRef}>
          <svg className="h-links" ref={linksRef} aria-hidden="true">
            {cards.map((c) => (
              <path key={c.title} className="line" pathLength="1" stroke={c.color} />
            ))}
            {cards.map((c) => (
              <path key={c.title} className="pulse" pathLength="1" stroke={c.color} />
            ))}
          </svg>
          {cards.map((c, i) => (
            <div className={`h-silo h-silo-${i + 1}`} key={c.title} ref={addSilo}>
              <div className="h-silo-ic" style={{ background: c.color }} aria-hidden="true">
                <Icon name={c.icon} size={18} />
              </div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
          <div className="h-core" ref={coreRef}>
            <span className="h-core-mark">
              <Logo variant="mark" size={56} label="Teemly connects people, work and technology" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
