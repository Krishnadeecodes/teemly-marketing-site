import { useState, Fragment } from 'react'
import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import PricingCard from '../components/PricingCard.jsx'
import Accordion from '../components/Accordion.jsx'
import FinalCTA from '../sections/FinalCTA.jsx'
import Icon from '../components/Icon.jsx'
import { plans } from '../data/plans.js'
import { comparisonGroups, planNames } from '../data/comparison.js'
import './pages.css'

const seatSteps = [5, 10, 25, 50, 100, 250]

const faqs = [
  {
    q: 'Is there a free trial, and do I need a credit card?',
    a: 'Yes — every plan starts with a free trial and no credit card is required. Invite your team and Teemly starts reporting from day one.',
  },
  {
    q: 'How is attendance calculated — do employees check in manually?',
    a: 'No manual check-in exists in Phase 1. Check-in is the first EXE activity event of the day and check-out is the last. If no events are received on a working day, the employee is marked absent.',
  },
  {
    q: 'What happens when an employee turns on Privacy Mode?',
    a: 'Tracking pauses immediately and the admin sees a "Privacy Mode" status — there is no admin override. It\'s a genuine, employee-controlled pause, not a cosmetic toggle.',
  },
  {
    q: 'Can I switch plans as my team grows?',
    a: 'Yes. Plans are per-seat and scoped by employee count, screenshot interval and retention window — you can move up a tier at any time as your organisation grows.',
  },
  {
    q: 'Do you offer on-premise deployment?',
    a: 'Yes, for Enterprise customers where data cannot leave your premises. Talk to sales for a scoped rollout plan.',
  },
]

export default function Pricing() {
  const [cycle, setCycle] = useState('monthly')
  const [seatIdx, setSeatIdx] = useState(1)
  const seats = seatSteps[seatIdx]

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Per-seat pricing that scales with your team"
        desc="No hidden tiers, no per-feature paywalls beyond what's listed below. Pick a plan, set your seat count, and see exactly what you'll pay."
      />

      <section className="section pricing-controls-section">
        <div className="container">
          <div className="pricing-controls">
            <div className="seat-slider">
              <div className="seat-slider-head">
                <span>Team size</span>
                <strong>{seats} seats</strong>
              </div>
              <input
                type="range"
                min="0"
                max={seatSteps.length - 1}
                step="1"
                value={seatIdx}
                onChange={(e) => setSeatIdx(Number(e.target.value))}
              />
              <div className="seat-slider-ticks">
                {seatSteps.map((s) => (
                  <span key={s}>{s}+</span>
                ))}
              </div>
            </div>

            <div className="cycle-toggle">
              <button className={cycle === 'monthly' ? 'active' : ''} onClick={() => setCycle('monthly')}>
                Monthly
              </button>
              <button className={cycle === 'yearly' ? 'active' : ''} onClick={() => setCycle('yearly')}>
                Yearly <span className="save-badge">Save 15%</span>
              </button>
            </div>
          </div>

          <div className="price-grid">
            {plans.map((p) => (
              <PricingCard plan={p} featured={p.featured} cycle={cycle} seats={seats} key={p.name} />
            ))}
          </div>
        </div>
      </section>

      <section className="section comparison-section">
        <div className="container">
          <SectionHead center eyebrow="Compare Plans" title="Every feature, side by side" />
          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  {planNames.map((n) => (
                    <th key={n}>{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonGroups.map((g) => (
                  <Fragment key={g.group}>
                    <tr className="group-row">
                      <td colSpan={5}>{g.group}</td>
                    </tr>
                    {g.rows.map((r) => (
                      <tr key={r.f}>
                        <td>{r.f}</td>
                        {r.v.map((val, i) => (
                          <td key={i}>
                            {typeof val === 'boolean' ? (
                              val ? (
                                <Icon name="check" size={17} className="yes-icon" />
                              ) : (
                                <span className="no-dash">—</span>
                              )
                            ) : (
                              <span className="val-text">{val}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container faq-container">
          <SectionHead eyebrow="FAQ" title="Questions, answered" />
          <Accordion items={faqs} />
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
