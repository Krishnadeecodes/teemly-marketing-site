import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Icon from '../components/Icon.jsx'
import FinalCTA from '../sections/FinalCTA.jsx'
import './pages.css'
import './roi.css'

const defaults = {
  employees: 200,
  avgEmployeeCost: 12000,
  techSpend: 60000,
  managerCount: 20,
  avgManagerCost: 18000,
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
      <PageHero
        eyebrow="ROI Calculator"
        title="Model your own numbers — this is an estimate, not a promise"
        desc="Every input below is yours to set. We don't have verified customer ROI results to cite yet, so nothing here is presented as one."
      />

      <section className="section-tight">
        <div className="container roi-disclaimer">
          <Icon name="layers" size={18} />
          <p>
            This calculator applies adjustable assumptions to the numbers you enter. It is a modelling tool for
            your own planning, not a guaranteed or verified outcome.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container roi-layout">
          <div className="roi-inputs">
            <div className="cycle-toggle roi-currency-toggle">
              <button className={currency === 'usd' ? 'active' : ''} onClick={() => setCurrency('usd')}>
                USD ($)
              </button>
              <button className={currency === 'inr' ? 'active' : ''} onClick={() => setCurrency('inr')}>
                INR (₹)
              </button>
            </div>

            <div className="roi-field">
              <label>Number of employees</label>
              <input type="number" min="1" value={v.employees} onChange={update('employees')} />
            </div>
            <div className="roi-field">
              <label>Average employee cost / year</label>
              <input type="number" min="0" value={v.avgEmployeeCost} onChange={update('avgEmployeeCost')} />
            </div>
            <div className="roi-field">
              <label>Annual technology / SaaS spend</label>
              <input type="number" min="0" value={v.techSpend} onChange={update('techSpend')} />
            </div>
            <div className="roi-field">
              <label>Number of managers</label>
              <input type="number" min="0" value={v.managerCount} onChange={update('managerCount')} />
            </div>
            <div className="roi-field">
              <label>Average manager cost / year</label>
              <input type="number" min="0" value={v.avgManagerCost} onChange={update('avgManagerCost')} />
            </div>

            <div className="roi-sliders">
              {sliders.map((s) => (
                <div className="roi-slider" key={s.key}>
                  <div className="roi-slider-head">
                    <span>{s.label}</span>
                    <strong>{v[s.key]}%</strong>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    value={v[s.key]}
                    onChange={update(s.key)}
                  />
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
