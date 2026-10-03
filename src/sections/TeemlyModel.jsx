import { useEffect, useRef } from 'react'
import SplitHeading from '../home/SplitHeading.jsx'
import { gsap, prefersReducedMotion } from '../home/useHomeScroll.js'
import '../home/model.css'

const steps = [
  {
    n: 1,
    color: '#0187E0',
    tag: 'Signals',
    title: 'Collect',
    desc: 'App, web, screenshot, video & location events, every 60 seconds — under rules you set.',
    viz: 'signals',
  },
  {
    n: 2,
    color: '#03A6DD',
    tag: 'Context',
    title: 'Connect',
    desc: 'Signals are rolled up by organisation, team and person.',
    viz: 'context',
  },
  {
    n: 3,
    color: '#032297',
    tag: 'Intelligence',
    title: 'Understand',
    desc: '6 AI-powered reports, auto-generated the moment the data is in.',
    viz: 'trend',
  },
  {
    n: 4,
    color: '#6A3BD8',
    tag: 'Recommendations',
    title: 'Advise',
    desc: 'Plain-language insight cards on every report, routed to the person who can act.',
    viz: 'rec',
  },
  {
    n: 5,
    color: '#F62DA0',
    tag: 'Action',
    title: 'Act',
    desc: 'Policy changes, coaching conversations, licence right-sizing — tracked, not just discussed.',
    viz: 'checklist',
  },
  {
    n: 6,
    color: '#E91E63',
    tag: 'Outcomes',
    title: 'Improve',
    desc: 'Decisions made on evidence, not memory — measured against the baseline you started from.',
    viz: 'before-after',
  },
]

function Viz({ type }) {
  if (type === 'signals') {
    return (
      <div className="h-v-sig">
        {Array.from({ length: 36 }).map((_, i) => (
          <i key={i} style={{ animationDelay: `${(Math.random() * 2.4).toFixed(2)}s` }} />
        ))}
      </div>
    )
  }
  if (type === 'context') {
    return (
      <svg viewBox="0 0 300 130" width="86%">
        <g stroke="#CFD8EA" strokeWidth="2" fill="none">
          <path d="M150 22V50H60V80M150 50H240V80M150 50V80" />
        </g>
        <rect x="118" y="8" width="64" height="26" rx="13" fill="#032297" />
        <rect x="28" y="68" width="64" height="24" rx="12" fill="#0187E0" />
        <rect x="118" y="68" width="64" height="24" rx="12" fill="#03A6DD" />
        <rect x="208" y="68" width="64" height="24" rx="12" fill="#E91E63" />
      </svg>
    )
  }
  if (type === 'trend') {
    return (
      <svg viewBox="0 0 300 120" width="90%">
        <defs>
          <linearGradient id="modelArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#03A6DD" stopOpacity="0.35" />
            <stop offset="1" stopColor="#03A6DD" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 70 C40 60 60 40 100 46 S160 30 190 40 S240 90 300 96 V120 H0Z" fill="url(#modelArea)" />
        <path d="M0 70 C40 60 60 40 100 46 S160 30 190 40 S240 90 300 96" fill="none" stroke="#03A6DD" strokeWidth="3" />
        <circle cx="240" cy="80" r="6" fill="#E91E63" />
      </svg>
    )
  }
  if (type === 'rec') {
    return (
      <div className="h-v-rec">
        <b>Protect a 10–12 AM focus block</b>
        <small>Sales · based on 3 weeks of calendar and activity signals</small>
        <div className="h-v-rec-row">
          <span>Owner: Sales lead</span>
          <span className="p">Accept</span>
        </div>
      </div>
    )
  }
  if (type === 'checklist') {
    return (
      <div className="h-v-chk">
        <div>
          <i />
          Move weekly review to Friday
        </div>
        <div>
          <i />
          Block 10–12 AM for deep work
        </div>
        <div>
          <i className="o" />
          Review impact in 4 weeks
        </div>
      </div>
    )
  }
  return (
    <div className="h-v-ba">
      <div>
        <span style={{ height: 44, background: '#CFD8EA' }} />
        Before
      </div>
      <div>
        <span style={{ height: 86, background: 'linear-gradient(180deg,#F62DA0,#E91E63)' }} />
        After
      </div>
    </div>
  )
}

export default function TeemlyModel() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const railFillRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const mm = gsap.matchMedia()
    mm.add('(min-width: 901px)', () => {
      const track = trackRef.current
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => '+=' + (dist() + window.innerHeight * 0.3),
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
      tl.to(track, { x: () => -dist(), ease: 'none' }, 0)
      if (railFillRef.current) {
        tl.fromTo(railFillRef.current, { scaleX: 0.08 }, { scaleX: 1, ease: 'none' }, 0)
      }
      return () => gsap.set(track, { clearProps: 'transform' })
    })
    mm.add('(max-width: 900px)', () => {
      const panels = trackRef.current ? trackRef.current.querySelectorAll('.h-panel') : []
      panels.forEach((p) => {
        gsap.from(p, { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 88%', once: true } })
      })
      return undefined
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="h-model" ref={sectionRef}>
      <div className="h-wrap h-model-head">
        <div className="h-sec-head">
          <span className="h-kicker">The Teemly model</span>
          <SplitHeading as="h2" text="From raw signals to measurable outcomes" />
        </div>
        <p className="h-model-note">
          Every insight follows the same path, so you can always see where a recommendation came from and what it
          changed.
        </p>
      </div>
      <div className="h-rail" aria-hidden="true">
        <i ref={railFillRef} />
      </div>
      <div className="h-track" ref={trackRef}>
        {steps.map((s) => (
          <article className="h-panel" key={s.tag}>
            <span className="h-panel-num">
              <b style={{ background: s.color }}>{s.n}</b>
              {s.tag}
            </span>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <div className="h-panel-viz">
              <Viz type={s.viz} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
