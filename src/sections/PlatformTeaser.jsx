import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SplitHeading from '../home/SplitHeading.jsx'
import Reveal from '../home/Reveal.jsx'
import { ScrollTrigger, prefersReducedMotion } from '../home/useHomeScroll.js'
import { DashboardMock, TeamsMock, ScreenshotsMock, AttendanceMock, ReportsMock } from '../components/ProductMockups.jsx'
import '../home/platform.css'

const steps = [
  {
    to: '/platform/organizational-intelligence',
    title: 'Organizational Intelligence',
    desc: 'The umbrella view across people, work and technology, refreshed in real time.',
    points: ['4 KPI stat cards, refreshed continuously', 'Org productivity score gauge', 'Live activity feed, no refresh needed'],
    Comp: DashboardMock,
  },
  {
    to: '/platform/workforce-intelligence',
    title: 'Workforce Intelligence',
    desc: 'Team health, capacity and attendance, rolled up from org average to one person.',
    points: ['Monthly heat map of hours worked, per team', 'Team cards ranked by productivity', 'Full profile per employee'],
    Comp: TeamsMock,
  },
  {
    to: '/platform/work-intelligence',
    title: 'Work Intelligence',
    desc: 'How work actually happens, app by app — not a self-reported guess.',
    points: ['Automatic productive/neutral/unproductive tagging', 'Employee-controlled privacy blur', 'No manual review required'],
    Comp: ScreenshotsMock,
  },
  {
    to: '/platform/workflow-intelligence',
    title: 'Workflow Intelligence',
    desc: 'Policy, timelines and tool-spend efficiency on a shared record.',
    points: ['No manual check-in, ever', 'A shared timeline across the whole team', 'Late arrivals flagged automatically'],
    Comp: AttendanceMock,
  },
  {
    to: '/platform/ai-intelligence',
    title: 'AI Intelligence',
    desc: 'Auto-generated insight cards on every report, in plain language.',
    points: ['6 AI-powered reports, auto-generated', "Notes like 'Friday afternoons are quietest'", 'Scoped to org, team or person'],
    Comp: ReportsMock,
  },
]

export default function PlatformTeaser() {
  const sectionRef = useRef(null)
  const stepRefs = useRef([])
  const [active, setActive] = useState(0)

  stepRefs.current = []
  const addStep = (el) => el && stepRefs.current.push(el)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const triggers = stepRefs.current.map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && setActive(i),
      })
    )
    return () => triggers.forEach((t) => t.kill())
  }, [])

  const ActiveComp = steps[active].Comp

  return (
    <section className="h-platform" ref={sectionRef}>
      <div className="h-wrap">
        <div className="h-sec-head">
          <span className="h-kicker">Platform</span>
          <SplitHeading as="h2" text="One intelligence layer across your organization" />
          <p>Five connected areas, built on the same organizational record. Not five separate dashboards.</p>
        </div>

        <div className="h-pl-grid">
          <div>
            {steps.map((s, i) => (
              <div className={`h-pl-step${active === i ? ' active' : ''}`} key={s.to} ref={addStep}>
                <span className="h-pl-idx">0{i + 1} / 0{steps.length}</span>
                <h3>{s.title}</h3>
                <Reveal as="div">
                  <p>{s.desc}</p>
                  <ul>
                    {s.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <div className="h-pl-inline">
                    <div className="h-dash">
                      <s.Comp />
                    </div>
                  </div>
                  <Link to={s.to} className="h-textlink" style={{ marginTop: 14, display: 'inline-block' }}>
                    Explore {s.title}
                  </Link>
                </Reveal>
              </div>
            ))}
          </div>
          <div className="h-pl-sticky">
            <div className="h-dash">
              <ActiveComp />
              <div className="h-dash-foot">
                <div className="h-pips">
                  {steps.map((_, j) => (
                    <i key={j} className={j === active ? 'on' : ''} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
