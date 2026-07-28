import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import GlowOrbit from '../components/GlowOrbit.jsx'

export default function FinalCTA() {
  return (
    <section className="final-cta">
      <GlowOrbit />
      <div className="container final-cta-inner">
        <h2>
          Ready to see how <span className="grad-text">your team really works?</span>
        </h2>
        <p>Start free, invite your team, and get your first Org Productivity Score today.</p>
        <div className="hero-cta-row" style={{ justifyContent: 'center' }}>
          <Link to="/pricing" className="btn btn-primary btn-lg">
            Start Free Trial
            <Icon name="arrowRight" size={18} />
          </Link>
          <Link to="/contact" className="btn btn-outline btn-lg">
            Book a Demo
          </Link>
        </div>
        <p className="hero-subnote">No credit card required · Live in a day · Cancel anytime</p>
      </div>
    </section>
  )
}
