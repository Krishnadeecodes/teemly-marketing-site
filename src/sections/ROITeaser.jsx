import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import Reveal from '../home/Reveal.jsx'
import { gsap, isPhone, prefersReducedMotion } from '../home/useHomeScroll.js'
import '../home/roi.css'

const DEMO = { employees: 250, cost: 45000, pct: 3 }
const TARGET = Math.round((DEMO.employees * DEMO.cost * DEMO.pct) / 100)

function fmt(v) {
  return '$' + Math.round(v).toLocaleString('en-US')
}

export default function ROITeaser() {
  const numRef = useRef(null)

  useEffect(() => {
    if (!numRef.current) return undefined
    if (prefersReducedMotion()) {
      numRef.current.textContent = fmt(TARGET)
      return undefined
    }
    const obj = { v: 0 }
    const phone = isPhone()
    const tween = gsap.to(obj, {
      v: TARGET,
      duration: phone ? 1 : 1.4,
      ease: 'power2.out',
      onUpdate: () => {
        if (numRef.current) numRef.current.textContent = fmt(obj.v)
      },
      scrollTrigger: { trigger: numRef.current, start: phone ? 'top 98%' : 'top 85%', once: true },
    })
    return () => tween.scrollTrigger && tween.scrollTrigger.kill()
  }, [])

  return (
    <section className="h-roi">
      <div className="h-wrap h-roi-card">
        <div className="h-roi-in">
          <span className="h-kicker">ROI</span>
          <SplitHeading as="h2" text="Model your own numbers before you buy" mode="scroll" />
          <p className="h-roi-p">A transparent calculator, not a sales promise — every assumption is visible and yours to adjust.</p>
          <Reveal as="div">
            <div className="h-roi-pills">
              {['Employees', 'Avg. employee cost', 'Technology spend', 'Manager count'].map((i) => (
                <span className="h-pill" key={i}>
                  {i}
                </span>
              ))}
            </div>
            <Link to="/roi-calculator" className="h-btn h-btn-primary" style={{ marginTop: 26 }}>
              Open the full ROI Calculator
              <span className="h-arr" aria-hidden="true">
                <Icon name="arrowRight" size={14} />
              </span>
            </Link>
          </Reveal>
        </div>
        <Reveal as="div" className="h-roi-out">
          <h3>Estimated annual opportunity</h3>
          <div className="h-roi-big" ref={numRef}>
            $0
          </div>
          <p className="h-roi-assume">
            <strong>{DEMO.employees} employees</strong> × <strong>{fmt(DEMO.cost)}/yr</strong> × <strong>{DEMO.pct}% productivity opportunity</strong>.
          </p>
          <span className="h-illus">Illustrative example — not your numbers</span>
        </Reveal>
      </div>
    </section>
  )
}
