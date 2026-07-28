import { Link } from 'react-router-dom'
import SectionHead from '../components/SectionHead.jsx'
import PricingCard from '../components/PricingCard.jsx'
import Icon from '../components/Icon.jsx'
import { plans } from '../data/plans.js'

export default function PricingTeaser() {
  return (
    <section className="section pricing-teaser">
      <div className="container">
        <SectionHead center eyebrow="Pricing" title="Simple, per-seat pricing that scales with your team" />
        <div className="price-grid">
          {plans.map((p) => (
            <PricingCard plan={p} featured={p.featured} key={p.name} seats={null} />
          ))}
        </div>
        <div className="pricing-teaser-foot">
          <Link to="/pricing" className="btn btn-outline">
            See full plan comparison
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
