import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import Reveal from '../home/Reveal.jsx'
import { plans } from '../data/plans.js'
import '../home/pricing.css'

export default function PricingTeaser() {
  return (
    <section className="h-pricing">
      <div className="h-wrap">
        <div className="h-sec-head center">
          <span className="h-kicker">Pricing</span>
          <SplitHeading as="h2" text="Simple, per-seat pricing that scales with your team" />
          <p>Pick the plan that matches your team today — every tier shows exactly what's included before you talk to anyone.</p>
        </div>

        <div className="h-price-grid">
          {plans.map((p, i) => (
            <Reveal
              as="article"
              className={`h-price-card${p.featured ? ' featured' : ''}`}
              delay={i * 0.06}
              key={p.name}
            >
              <div>
                <div className="h-price-name">{p.name}</div>
                <p className="h-price-tagline">{p.tagline}</p>
              </div>
              <div>
                <div className="h-price-amount">
                  <b>{typeof p.usd === 'number' ? `$${p.usd}` : p.usd}</b>
                  {typeof p.usd === 'number' && <span>/ seat / mo</span>}
                </div>
                <div className="h-price-inr">
                  {typeof p.inr === 'number' ? `₹${p.inr} / seat / mo` : p.inr}
                </div>
              </div>
              <ul>
                {p.features.map((f) => (
                  <li key={f}>
                    <Icon name="check" size={14} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="h-price-cta">
                <Link to="/pricing" className={`h-btn ${p.featured ? 'h-btn-primary' : 'h-btn-ghost'}`}>
                  See full plan
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="h-pricing-foot">
          <Link to="/pricing" className="h-textlink">
            See full plan comparison
          </Link>
        </div>
      </div>
    </section>
  )
}
