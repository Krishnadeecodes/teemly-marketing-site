import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Logo from '../components/Logo.jsx'
import { PlatformShot, SHOT_W } from '../components/FeatureShots.jsx'
import FitScale from '../components/FitScale.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import Reveal from '../home/Reveal.jsx'
import { ScrollTrigger } from '../home/useHomeScroll.js'
import '../home/platform.css'

const areas = [
  {
    to: '/platform/organizational-intelligence',
    title: 'Organizational Intelligence',
    desc: 'One live view of people, work and technology across the whole organization.',
  },
  {
    to: '/platform/workforce-intelligence',
    title: 'Workforce Intelligence',
    desc: 'Team health, capacity and attendance, from the company average down to one person.',
  },
  {
    to: '/platform/work-intelligence',
    title: 'Work Intelligence',
    desc: 'See how work actually happens, app by app, without asking anyone to fill in a timesheet.',
  },
  {
    to: '/platform/workflow-intelligence',
    title: 'Workflow Intelligence',
    desc: 'Working hours, policies and timelines on one shared record, with no manual check-ins.',
  },
  {
    to: '/platform/ai-intelligence',
    title: 'AI Intelligence',
    desc: 'Plain-language insights on every report, so the next step is always clear.',
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
                  {/* phones and tablets: the same screenshot as the desktop panel, scaled to fit */}
                  <div className="h-pl-inline" aria-hidden="true">
                    <FitScale width={SHOT_W} media="all">
                      <PlatformShot index={i} />
                    </FitScale>
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
              {/* the screenshot at its own size, scaled down to fit */}
              <FitScale width={SHOT_W} media="all">
                <PlatformShot index={active} />
              </FitScale>
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
