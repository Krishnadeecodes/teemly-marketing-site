import { useEffect, useRef } from 'react'
import Icon from '../components/Icon.jsx'
import Logo from '../components/Logo.jsx'
import FitScale from '../components/FitScale.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import { gsap, prefersReducedMotion } from '../home/useHomeScroll.js'
import { reveal } from '../home/reveal.js'
import '../home/model.css'

/* ---- Product screens, one per step (illustrative sample data) ---- */

function Screen({ title, status, children }) {
  return (
    <div className="h-scr" aria-hidden="true">
      <div className="h-scr-bar">
        <Logo variant="mark" size={13} label={null} />
        <b>{title}</b>
        {status && <span className={`h-scr-status ${status.tone || ''}`}>{status.label}</span>}
      </div>
      <div className="h-scr-body">{children}</div>
    </div>
  )
}

function CollectScreen() {
  const rows = [
    { icon: 'monitor', name: 'VS Code', kind: 'App', t: '10:42', tag: 'Productive', tone: 'ok' },
    { icon: 'globe', name: 'docs.google.com', kind: 'Website', t: '10:41', tag: 'Productive', tone: 'ok' },
    { icon: 'camera', name: 'Screenshot', kind: 'Blurred', t: '10:40', tag: 'Private', tone: 'warn' },
    { icon: 'pin', name: 'Office, Bengaluru', kind: 'Location', t: '09:02', tag: 'Checked in', tone: 'info' },
  ]
  return (
    <Screen title="Live signals" status={{ label: 'Capturing', tone: 'live' }}>
      <div className="h-scr-feed">
        {rows.map((r) => (
          <div className="h-scr-feedrow" key={r.name}>
            <span className="h-scr-ic">
              <Icon name={r.icon} size={12} />
            </span>
            <span className="h-scr-main">
              <b>{r.name}</b>
              <small>
                {r.kind} · {r.t}
              </small>
            </span>
            <em className={r.tone}>{r.tag}</em>
          </div>
        ))}
      </div>
    </Screen>
  )
}

function ConnectScreen() {
  const teams = [
    { n: 'Sales', c: '#E91E63', people: ['M', 'R', 'J'] },
    { n: 'Engineering', c: '#0187E0', people: ['K', 'A', 'S'] },
    { n: 'Design', c: '#6A3BD8', people: ['A', 'L'] },
  ]
  return (
    <Screen title="Organization" status={{ label: '128 people' }}>
      <div className="h-scr-org">
        <div className="h-scr-orgroot">
          <Logo variant="mark" size={12} label={null} />
          Acme Corp
        </div>
        <div className="h-scr-orgteams">
          {teams.map((t) => (
            <div className="h-scr-orgteam" key={t.n} style={{ '--c': t.c }}>
              <b>{t.n}</b>
              <span>
                {t.people.map((p, i) => (
                  <i key={i}>{p}</i>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  )
}

function UnderstandScreen() {
  const bars = [62, 70, 66, 74, 58, 49, 44]
  return (
    <Screen title="Report · Focus quality" status={{ label: 'Updated now' }}>
      <div className="h-scr-report">
        <div className="h-scr-kpi">
          <small>Focus time per day</small>
          <b>4.6h</b>
          <em className="bad">↓ 18% in Sales</em>
        </div>
        <div className="h-scr-bars">
          {bars.map((v, i) => (
            <span key={i} className={i >= 4 ? 'dip' : ''} style={{ height: `${v}%` }} />
          ))}
        </div>
      </div>
    </Screen>
  )
}

function AdviseScreen() {
  return (
    <Screen title="Recommendation" status={{ label: 'New', tone: 'pink' }}>
      <div className="h-scr-rec">
        <div className="h-scr-rechead">
          <Icon name="sparkle" size={13} />
          <b>Protect a 10–12 AM focus block</b>
        </div>
        <p>Sales lost focus time after the new review cadence. A daily block would win most of it back.</p>
        <div className="h-scr-recmeta">
          <span>Owner: Sales lead</span>
          <span>Impact: High</span>
        </div>
        <div className="h-scr-recbtns">
          <span className="primary">Accept</span>
          <span>Dismiss</span>
        </div>
      </div>
    </Screen>
  )
}

function ActScreen() {
  const tasks = [
    { t: 'Move weekly review to Friday', who: 'MJ', done: true },
    { t: 'Block 10–12 AM for deep work', who: 'RK', done: true },
    { t: 'Review impact in 4 weeks', who: 'SL', due: 'Due Oct 28' },
  ]
  return (
    <Screen title="Action plan" status={{ label: '2 of 3 done', tone: 'ok' }}>
      <div className="h-scr-tasks">
        <div className="h-scr-progress">
          <span style={{ width: '67%' }} />
        </div>
        {tasks.map((k) => (
          <div className={`h-scr-task${k.done ? ' done' : ''}`} key={k.t}>
            <i />
            <span>{k.t}</span>
            {k.due && <small>{k.due}</small>}
            <b>{k.who}</b>
          </div>
        ))}
      </div>
    </Screen>
  )
}

function ImproveScreen() {
  const rows = [
    { l: 'Selling time', before: 46, after: 52, unit: '%' },
    { l: 'Focus time / day', before: 3.9, after: 4.6, unit: 'h', max: 6 },
  ]
  return (
    <Screen title="Outcome vs baseline" status={{ label: 'Improved', tone: 'ok' }}>
      <div className="h-scr-compare">
        {rows.map((r) => {
          const max = r.max || 60
          return (
            <div className="h-scr-cmp" key={r.l}>
              <div className="h-scr-cmphead">
                <b>{r.l}</b>
                <span>
                  {r.before}
                  {r.unit} → <strong>
                    {r.after}
                    {r.unit}
                  </strong>
                </span>
              </div>
              <div className="h-scr-cmpbar base">
                <span style={{ width: `${(r.before / max) * 100}%` }} />
                <small>Baseline</small>
              </div>
              <div className="h-scr-cmpbar now">
                <span style={{ width: `${(r.after / max) * 100}%` }} />
                <small>Now</small>
              </div>
            </div>
          )
        })}
      </div>
    </Screen>
  )
}

const steps = [
  {
    n: 1,
    color: '#0187E0',
    tag: 'Signals',
    title: 'Collect',
    desc: 'Activity from apps, websites and devices is captured automatically, within the privacy rules you set.',
    Screen: CollectScreen,
  },
  {
    n: 2,
    color: '#03A6DD',
    tag: 'Context',
    title: 'Connect',
    desc: 'Everything is organised by company, team and person, so every view has the right context.',
    Screen: ConnectScreen,
  },
  {
    n: 3,
    color: '#032297',
    tag: 'Intelligence',
    title: 'Understand',
    desc: 'Six AI-powered reports update automatically as new activity comes in.',
    Screen: UnderstandScreen,
  },
  {
    n: 4,
    color: '#6A3BD8',
    tag: 'Recommendations',
    title: 'Advise',
    desc: 'Every report ends with plain-language recommendations, sent to the person who can act on them.',
    Screen: AdviseScreen,
  },
  {
    n: 5,
    color: '#F62DA0',
    tag: 'Action',
    title: 'Act',
    desc: 'Turn recommendations into actions, such as policy changes, coaching or licence clean-ups, and track each one.',
    Screen: ActScreen,
  },
  {
    n: 6,
    color: '#E91E63',
    tag: 'Outcomes',
    title: 'Improve',
    desc: 'Measure what changed against your starting point, so decisions rest on evidence, not memory.',
    Screen: ImproveScreen,
  },
]

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
      return reveal(panels, { y: 14, opacity: 0 }, { phone: true })
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="h-model h-sec-blue" ref={sectionRef}>
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
          <article className="h-panel" key={s.tag} style={{ '--accent': s.color }}>
            <div className="h-panel-top">
              <span className="h-panel-num">
                <b>0{s.n}</b>
                {s.tag}
              </span>
              <Logo variant="mark" size={20} label={null} className="h-panel-logo" />
            </div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            {/* on phones the screen keeps its desktop layout, scaled to fit */}
            <FitScale width={344} height={290} className="h-panel-shot">
              <s.Screen />
            </FitScale>
          </article>
        ))}
      </div>
    </section>
  )
}
