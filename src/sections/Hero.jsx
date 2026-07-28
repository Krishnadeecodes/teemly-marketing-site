import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import GlowOrbit from '../components/GlowOrbit.jsx'
import { DashboardMock } from '../components/ProductMockups.jsx'

export default function Hero() {
  return (
    <section className="hero">
      <GlowOrbit />

      <div className="container hero-inner">
        <span className="eyebrow">
          <span className="dot" />
          Workforce Intelligence, Simplified
        </span>

        <h1 className="hero-title">
          See how work really happens. Lead with <span className="grad-text">evidence</span>, not assumptions.
        </h1>

        <p className="hero-sub">
          Teemly turns the everyday signal your team already generates — app usage, attendance, focus — into one
          live, trustworthy record, captured by an agent Teemly built and owns end to end.
        </p>

        <div className="hero-cta-row">
          <Link to="/pricing" className="btn btn-primary btn-lg">
            Start Free Trial
            <Icon name="arrowRight" size={18} />
          </Link>
          <Link to="/contact" className="btn btn-outline btn-lg">
            Book a Demo
          </Link>
        </div>
        <p className="hero-subnote">No credit card required · Live in a day · Cancel anytime</p>

        <div className="hero-visual">
          <DashboardMock />
        </div>
      </div>
    </section>
  )
}
