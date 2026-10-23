import { useEffect, useRef } from 'react'
import Icon from '../components/Icon.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import Reveal from '../home/Reveal.jsx'
import { gsap, isPhone, prefersReducedMotion } from '../home/useHomeScroll.js'
import { whenInView } from '../home/reveal.js'
import '../home/outcomes.css'

export default function BusinessOutcomes() {
  const ringRef = useRef(null)
  const stackRefs = useRef([])
  stackRefs.current = []
  const addStack = (el) => el && stackRefs.current.push(el)

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (ringRef.current) ringRef.current.style.strokeDashoffset = '28'
      stackRefs.current.forEach((s) => (s.style.width = s.dataset.w))
      return undefined
    }
    const phone = isPhone()
    const ring = ringRef.current
    const stacks = stackRefs.current
    const stops = []
    if (ring) {
      stops.push(
        whenInView([ring], () =>
          gsap.to(ring, { strokeDashoffset: 28, duration: phone ? 0.7 : 1.4, ease: 'power3.out' })
        )
      )
    }
    stops.push(
      whenInView(stacks, (batch) =>
        batch.forEach((s) =>
          gsap.to(s, {
            width: s.dataset.w,
            duration: phone ? 0.7 : 1.1,
            delay: phone ? 0 : stacks.indexOf(s) * 0.12,
            ease: 'power3.out',
          })
        )
      )
    )
    return () => {
      stops.forEach((stop) => stop())
      gsap.killTweensOf([ring, ...stacks].filter(Boolean))
    }
  }, [])

  return (
    <section className="h-outcomes">
      <div className="h-wrap">
        <div className="h-sec-head">
          <span className="h-kicker pink">Business Outcomes</span>
          <SplitHeading as="h2" text="Where the value actually shows up" />
          <p>These are mechanisms in the product today, not projected percentages — see the ROI calculator for what that could mean at your headcount.</p>
        </div>

        <div className="h-bento">
          <Reveal as="article" className="h-oc h-oc-a h-spot">
            <div className="h-oc-top">
              <h3>Software spend, right-sized</h3>
            </div>
            <p>Tool Intelligence flags underused licences automatically, with the monthly cost attached — not buried in a spreadsheet nobody opens.</p>
            <div className="h-oc-ring">
              <svg viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(11,20,66,0.08)" strokeWidth="4" />
                <circle
                  ref={ringRef}
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="url(#h-ring-grad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  pathLength="100"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                  transform="rotate(-90 18 18)"
                />
                <defs>
                  <linearGradient id="h-ring-grad" x1="0" x2="1">
                    <stop offset="0" stopColor="#0187E0" />
                    <stop offset="1" stopColor="#07D7D9" />
                  </linearGradient>
                </defs>
              </svg>
              <span>72% seat utilisation, modelled</span>
            </div>
          </Reveal>

          <Reveal as="article" className="h-oc h-oc-b h-spot" delay={0.08}>
            <h3>Burnout caught earlier</h3>
            <p>Overtime, after-hours activity and weekend work roll into a Burnout &amp; Wellbeing signal before it becomes attrition.</p>
            <div className="h-flowdots" aria-hidden="true">
              <b />
              <i />
              <b />
              <i style={{ background: 'var(--h-line)' }} />
              <b className="p" />
              <i />
              <b />
            </div>
          </Reveal>

          <Reveal as="article" className="h-oc h-oc-c h-spot" delay={0.14}>
            <div className="h-oc-top">
              <h3>Attendance that enforces itself</h3>
            </div>
            <p>Late arrivals and absences are flagged automatically from real activity events — nobody has to chase a timesheet.</p>
            <div className="h-stackbar" aria-hidden="true">
              <div>
                <span data-w="91%" ref={addStack} />
              </div>
              <div>
                <span data-w="68%" ref={addStack} />
              </div>
              <div>
                <span data-w="44%" ref={addStack} style={{ background: 'var(--h-grad-stem)' }} />
              </div>
            </div>
          </Reveal>

          <Reveal as="article" className="h-oc h-oc-d h-spot" delay={0.2}>
            <h3>Coaching, pointed at the right person</h3>
            <p>Team Leaderboard ranks productivity and rank movement over time, turning a quarterly guess into a weekly conversation.</p>
            <span className="h-oc-icon">
              <Icon name="trendingUp" size={22} />
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
