import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionHead from '../components/SectionHead.jsx'
import Icon from '../components/Icon.jsx'
import FinalCTA from '../sections/FinalCTA.jsx'
import './pages.css'
import './roi.css'

// Money amounts are entered in the selected currency, so each currency has
// its own realistic starting figures (roughly the same scenario at ~₹83 to
// the dollar). Switching currency loads that currency's figures; head-counts
// and the percentage assumptions stay as they are.
const MONEY_DEFAULTS = {
  usd: { avgEmployeeCost: 12000, techSpend: 60000, avgManagerCost: 18000 },
  inr: { avgEmployeeCost: 800000, techSpend: 5000000, avgManagerCost: 1500000 },
}

const defaults = {
  employees: 200,
  ...MONEY_DEFAULTS.usd,
  managerCount: 20,
  productivityPct: 5,
  wastePct: 15,
  coordinationPct: 8,
  attendancePct: 2,
}

function fmt(n, currency) {
  const v = Math.round(n)
  return currency === 'usd' ? `$${v.toLocaleString('en-US')}` : `₹${v.toLocaleString('en-IN')}`
}

export default function ROICalculator() {
  const [v, setV] = useState(defaults)
  const [currency, setCurrency] = useState('usd')

  function chooseCurrency(next) {
    setCurrency(next)
    setV((cur) => ({ ...cur, ...MONEY_DEFAULTS[next] }))
  }

  function update(field) {
    return (e) => setV((cur) => ({ ...cur, [field]: Number(e.target.value) }))
  }

  const result = useMemo(() => {
    const productivityOpportunity = v.employees * v.avgEmployeeCost * (v.productivityPct / 100)
    const technologyOptimization = v.techSpend * (v.wastePct / 100)
    const workflowOpportunity = v.managerCount * v.avgManagerCost * (v.coordinationPct / 100)
    const capacityOptimization = v.employees * v.avgEmployeeCost * (v.attendancePct / 100)
    const total = productivityOpportunity + technologyOptimization + workflowOpportunity + capacityOptimization
    return { productivityOpportunity, technologyOptimization, workflowOpportunity, capacityOptimization, total }
  }, [v])

  const sliders = [
    {
      key: 'productivityPct',
      label: 'Productivity opportunity',
      desc: 'Share of payroll you believe is currently lost to low-visibility inefficiency',
      min: 1,
      max: 15,
    },
    {
      key: 'wastePct',
      label: 'Technology waste',
      desc: 'Share of technology spend on underused or unused licences, per Tool Intelligence',
      min: 1,
      max: 30,
    },
    {
      key: 'coordinationPct',
      label: 'Manager coordination overhead',
      desc: 'Share of manager time spent on coordination rather than coaching',
      min: 1,
      max: 20,
    },
    {
      key: 'attendancePct',
      label: 'Attendance & coverage accuracy',
      desc: 'Value of reduced unplanned coverage gaps from automatic attendance',
      min: 0,
      max: 10,
    },
  ]

  return (
    <>
      <section className="roi-page">
        <div className="container">
          <header className="roi-head">
            <span className="eyebrow">
              <span className="dot" />
              ROI Calculator
            </span>
            <h1>Model your own numbers</h1>
            <p>Every input is yours to set. This is an estimate for your own planning, not a promise or a verified customer result.</p>
          </header>
        </div>
        <div className="container roi-layout">
          <div className="roi-inputs">
            <div className="roi-inputs-head">
              <h2>Your numbers</h2>
              <div className="cycle-toggle roi-currency-toggle">
                <button className={currency === 'usd' ? 'active' : ''} onClick={() => chooseCurrency('usd')}>
                  USD ($)
                </button>
                <button className={currency === 'inr' ? 'active' : ''} onClick={() => chooseCurrency('inr')}>
                  INR (₹)
                </button>
              </div>
            </div>

            <div className="roi-fields">
              <div className="roi-field">
                <label>Number of employees</label>
                <input type="number" inputMode="numeric" min="1" value={v.employees} onChange={update('employees')} />
              </div>
              <div className="roi-field">
                <label>Avg. employee cost / year</label>
                <span className="roi-money">
                  <span aria-hidden="true">{currency === 'usd' ? '$' : '₹'}</span>
                  <input type="number" inputMode="numeric" min="0" value={v.avgEmployeeCost} onChange={update('avgEmployeeCost')} />
                </span>
              </div>
              <div className="roi-field">
                <label>Tech &amp; SaaS spend / year</label>
                <span className="roi-money">
                  <span aria-hidden="true">{currency === 'usd' ? '$' : '₹'}</span>
                  <input type="number" inputMode="numeric" min="0" value={v.techSpend} onChange={update('techSpend')} />
                </span>
              </div>
              <div className="roi-field">
                <label>Number of managers</label>
                <input type="number" inputMode="numeric" min="0" value={v.managerCount} onChange={update('managerCount')} />
              </div>
              <div className="roi-field">
                <label>Avg. manager cost / year</label>
                <span className="roi-money">
                  <span aria-hidden="true">{currency === 'usd' ? '$' : '₹'}</span>
                  <input type="number" inputMode="numeric" min="0" value={v.avgManagerCost} onChange={update('avgManagerCost')} />
                </span>
              </div>
            </div>

            <div className="roi-sliders">
              {sliders.map((s) => (
                <div className="roi-slider" key={s.key}>
                  <div className="roi-slider-head">
                    <span>{s.label}</span>
                    <strong>{v[s.key]}%</strong>
                  </div>
                  <input type="range" min={s.min} max={s.max} value={v[s.key]} onChange={update(s.key)} />
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="roi-output">
            <span className="roi-output-label">Estimated annual opportunity</span>
            <strong className="roi-output-total">{fmt(result.total, currency)}</strong>
            <div className="roi-output-grid">
              <div>
                <span>Productivity opportunity</span>
                <strong>{fmt(result.productivityOpportunity, currency)}</strong>
              </div>
              <div>
                <span>Technology optimization</span>
                <strong>{fmt(result.technologyOptimization, currency)}</strong>
              </div>
              <div>
                <span>Workflow opportunity</span>
                <strong>{fmt(result.workflowOpportunity, currency)}</strong>
              </div>
              <div>
                <span>Capacity optimization</span>
                <strong>{fmt(result.capacityOptimization, currency)}</strong>
              </div>
            </div>
            <Link to="/book-a-demo" className="btn btn-primary btn-block" style={{ marginTop: 20 }}>
              Discuss this with sales
              <Icon name="arrowRight" size={16} />
            </Link>
            <p className="roi-note">
              <Icon name="layers" size={14} />
              Adjustable assumptions applied to your numbers — a modelling tool, not a guaranteed or verified outcome.
            </p>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <SectionHead eyebrow="Methodology" title="How this is calculated" />
          <ul className="sec-list pillar-fact-list">
            <li>Productivity opportunity = employees × average employee cost × your productivity-opportunity assumption</li>
            <li>Technology optimization = technology spend × your technology-waste assumption</li>
            <li>Workflow opportunity = managers × average manager cost × your coordination-overhead assumption</li>
            <li>Capacity optimization = employees × average employee cost × your attendance-accuracy assumption</li>
          </ul>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
