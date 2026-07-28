import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import './pricingcard.css'

export default function PricingCard({ plan, featured = false, cycle = 'monthly', seats = 25 }) {
  const isCustom = plan.usd === 'Custom'
  const priceNum = isCustom ? null : cycle === 'yearly' ? Math.round(plan.usd * 0.85) : plan.usd

  return (
    <div className={`price-card${featured ? ' featured' : ''}`}>
      {featured && <span className="price-badge">Most Popular</span>}
      <h3>{plan.name}</h3>
      <p className="price-tagline">{plan.tagline}</p>

      <div className="price-value">
        {isCustom ? (
          <span className="price-num">Custom</span>
        ) : (
          <>
            <span className="price-num">${priceNum}</span>
            <span className="price-unit">/ seat / mo</span>
          </>
        )}
      </div>
      {!isCustom && <p className="price-inr">≈ ₹{plan.inr}/seat/mo · billed {cycle}</p>}
      {!isCustom && seats && (
        <p className="price-total">
          Est. <strong>${priceNum * seats}/mo</strong> for {seats} seats
        </p>
      )}

      <Link to="/contact" className={`btn ${featured ? 'btn-primary' : 'btn-outline'} btn-block`}>
        {isCustom ? 'Talk to Sales' : 'Start Free Trial'}
      </Link>

      <ul className="price-features">
        {plan.features.map((f) => (
          <li key={f}>
            <Icon name="check" size={15} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}
