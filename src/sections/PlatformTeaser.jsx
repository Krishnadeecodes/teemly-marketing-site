import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Logo from '../components/Logo.jsx'
import PlatformDashboard from '../components/PlatformDashboard.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import Reveal from '../home/Reveal.jsx'
import { ScrollTrigger } from '../home/useHomeScroll.js'
import '../home/platform.css'

/* ---- Mini product previews (illustrative sample data) ---- */

function Chrome({ title, children }) {
  return (
    <div className="h-mini" aria-hidden="true">
      <div className="h-mini-bar">
        <Logo variant="mark" size={14} label={null} />
        <span>{title}</span>
        <i className="h-mini-live">Live</i>
      </div>
      <div className="h-mini-body">{children}</div>
    </div>
  )
}

function OverviewPreview() {
  const spark = [52, 58, 55, 63, 61, 68, 72, 70, 76, 78]
  const pts = spark.map((v, i) => `${(i / (spark.length - 1)) * 100},${58 - ((v - 50) / 30) * 54}`).join(' ')
  return (
    <Chrome title="Overview">
      <div className="h-mini-kpis">
        <div>
          <small>Employees</small>
          <b>128</b>
        </div>
        <div>
          <small>Checked in</small>
          <b>89</b>
        </div>
        <div>
          <small>Absent</small>
          <b>12</b>
        </div>
      </div>
      <div className="h-mini-split">
        <div className="h-mini-gauge" style={{ '--v': 78 }}>
          <span>
            <b>78</b>
            <small>score</small>
          </span>
        </div>
        <svg className="h-mini-spark" viewBox="0 0 100 60" preserveAspectRatio="none">
          <polyline points={pts} />
        </svg>
      </div>
    </Chrome>
  )
}

function TeamsPreview() {
  const teams = [
    { n: 'Engineering', v: 84, s: 'On track' },
    { n: 'Design', v: 91, s: 'On track' },
    { n: 'Sales', v: 58, s: 'Needs attention', warn: true },
  ]
  return (
    <Chrome title="Teams">
      <div className="h-mini-rows">
        {teams.map((t) => (
          <div className="h-mini-team" key={t.n}>
            <div className="h-mini-team-head">
              <b>{t.n}</b>
              <small>{t.v}% productive</small>
              <em className={t.warn ? 'warn' : 'ok'}>{t.s}</em>
            </div>
            <div className="h-mini-track">
              <span className={t.warn ? 'warn' : ''} style={{ width: `${t.v}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Chrome>
  )
}

function AppsPreview() {
  const apps = [
    { n: 'VS Code', t: '2h 10m', c: 'p', w: 100 },
    { n: 'Figma', t: '1h 25m', c: 'p', w: 66 },
    { n: 'Slack', t: '48m', c: 'n', w: 37 },
    { n: 'YouTube', t: '12m', c: 'u', w: 10 },
  ]
  return (
    <Chrome title="Apps & websites">
      <div className="h-mini-stack">
        <span className="p" style={{ flex: 74 }} />
        <span className="n" style={{ flex: 18 }} />
        <span className="u" style={{ flex: 8 }} />
      </div>
      <div className="h-mini-rows tight">
        {apps.map((a) => (
          <div className="h-mini-app" key={a.n}>
            <i className={a.c} />
            <b>{a.n}</b>
            <span className="h-mini-app-bar">
              <span className={a.c} style={{ width: `${a.w}%` }} />
            </span>
            <small>{a.t}</small>
          </div>
        ))}
      </div>
    </Chrome>
  )
}

function TimelinePreview() {
  const rows = [
    { n: 'Ananya R.', from: 4, to: 86 },
    { n: 'Karthik S.', from: 14, to: 92, late: true },
    { n: 'Meera J.', from: 6, to: 70 },
  ]
  return (
    <Chrome title="Attendance · Today">
      <div className="h-mini-axis">
        <span>9 AM</span>
        <span>1 PM</span>
        <span>6 PM</span>
      </div>
      <div className="h-mini-rows tight">
        {rows.map((r) => (
          <div className="h-mini-time" key={r.n}>
            <b>{r.n}</b>
            <span className="h-mini-lane">
              <span style={{ left: `${r.from}%`, width: `${r.to - r.from}%` }} />
            </span>
            {r.late ? <em className="warn">Late</em> : <em className="ok">On time</em>}
          </div>
        ))}
      </div>
    </Chrome>
  )
}

function InsightPreview() {
  const days = [72, 78, 80, 76, 44]
  return (
    <Chrome title="Reports · Work rhythm">
      <div className="h-mini-insight">
        <Icon name="sparkle" size={14} />
        <p>Friday afternoons are your quietest window. Consider moving reviews there.</p>
      </div>
      <div className="h-mini-days">
        {days.map((v, i) => (
          <div key={i}>
            <span className={i === 4 ? 'hl' : ''} style={{ height: `${v}%` }} />
            <small>{'MTWTF'[i]}</small>
          </div>
        ))}
      </div>
    </Chrome>
  )
}

const areas = [
  {
    to: '/platform/organizational-intelligence',
    title: 'Organizational Intelligence',
    desc: 'One live view of people, work and technology across the whole organization.',
    Preview: OverviewPreview,
  },
  {
    to: '/platform/workforce-intelligence',
    title: 'Workforce Intelligence',
    desc: 'Team health, capacity and attendance, from the company average down to one person.',
    Preview: TeamsPreview,
  },
  {
    to: '/platform/work-intelligence',
    title: 'Work Intelligence',
    desc: 'See how work actually happens, app by app, without asking anyone to fill in a timesheet.',
    Preview: AppsPreview,
  },
  {
    to: '/platform/workflow-intelligence',
    title: 'Workflow Intelligence',
    desc: 'Working hours, policies and timelines on one shared record, with no manual check-ins.',
    Preview: TimelinePreview,
  },
  {
    to: '/platform/ai-intelligence',
    title: 'AI Intelligence',
    desc: 'Plain-language insights on every report, so the next step is always clear.',
    Preview: InsightPreview,
  },
]

export default function PlatformTeaser() {
  const cellRefs = useRef([])
  const [active, setActive] = useState(0)

  // On every scroll, the card whose centre is nearest the middle of the screen
  // is the active one, and the sticky panel shows its dashboard. Measuring on
  // each update (rather than per-card enter/leave events) means a fast scroll
  // can never leave the panel showing the wrong topic.
  useEffect(() => {
    const pick = () => {
      const mid = window.innerHeight * 0.55
      let best = 0
      let bestDist = Infinity
      cellRefs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - mid)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      setActive(best)
    }
    // Track the whole page rather than the list's own range: that range goes
    // stale when pinned sections above are re-created (e.g. after crossing the
    // 900px breakpoint), which froze the active card part-way through.
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: pick,
      onRefresh: pick,
    })
    pick()
    return () => trigger.kill()
  }, [])

  return (
    <section className="h-platform">
      <div className="h-wrap">
        <div className="h-sec-head">
          <span className="h-kicker">Platform</span>
          <SplitHeading as="h2" text="One intelligence layer across your organization" />
          <p>Five connected areas, built on the same organizational record. Not five separate dashboards.</p>
        </div>

        <div className="h-pl-story">
          <div className="h-pl-list">
            {areas.map((a, i) => (
              <div className="h-pl-cell" key={a.to} ref={(el) => (cellRefs.current[i] = el)}>
                <article className={`h-pl-card${active === i ? ' active' : ''}`}>
                  <div className="h-pl-cardtop">
                    <span className="h-pl-idx">
                      0{i + 1} / 0{areas.length}
                    </span>
                    <Logo variant="mark" size={20} label={null} />
                  </div>
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                  <div className="h-pl-inline">
                    <a.Preview />
                  </div>
                  <Link to={a.to} className="h-textlink h-pl-link">
                    Explore {a.title}
                  </Link>
                </article>
              </div>
            ))}
          </div>

          <div className="h-pl-sticky" aria-hidden="true">
            <div className="h-pl-stage">
              <PlatformDashboard index={active} />
              <div className="h-pips">
                {areas.map((a, j) => (
                  <i key={a.to} className={j === active ? 'on' : ''} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="h-pl-ctarow">
          <Reveal className="h-pl-cell" y={24}>
            <article className="h-pl-card h-pl-card-cta">
              <Logo variant="mark" size={44} label={null} />
              <h3>All five, on one record</h3>
              <p>Every area reads from the same data, so the numbers always agree and nothing needs reconciling.</p>
              <Link to="/platform" className="h-btn h-btn-primary">
                See the platform
                <span className="h-arr" aria-hidden="true">
                  <Icon name="arrowRight" size={14} />
                </span>
              </Link>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
