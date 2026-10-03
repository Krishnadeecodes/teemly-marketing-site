import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'
import FinalCTA from '../sections/FinalCTA.jsx'
import './pages.css'

export default function Customers() {
  return (
    <>
      <PageHero
        eyebrow="Customers"
        title="We're early — no customer stories to publish yet"
        desc="We'd rather leave this page honest than publish logos or quotes that aren't real. Here's how we approach every customer relationship instead."
      />
      <section className="section-tight">
        <div className="container">
          <div className="tile-grid">
            <div className="tile-card">
              <span className="tile-icon">
                <Icon name="eyeOff" size={20} />
              </span>
              <h3>Privacy respected by default</h3>
              <p>Every deployment ships with Privacy Mode, blur and the Silent Tracking legal gate active — not opt-in extras.</p>
            </div>
            <div className="tile-card">
              <span className="tile-icon">
                <Icon name="clock" size={20} />
              </span>
              <h3>Live in a day, not a quarter</h3>
              <p>A sub-2MB installer means onboarding doesn't require an IT rollout project.</p>
            </div>
            <div className="tile-card">
              <span className="tile-icon">
                <Icon name="shield" size={20} />
              </span>
              <h3>Security documented, not just promised</h3>
              <p>Every claim on the Security &amp; Trust pages traces to a real, specific control — not a marketing line.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-tight" style={{ background: 'var(--surface-soft)', textAlign: 'center' }}>
        <div className="container">
          <Link to="/book-a-demo" className="btn btn-primary btn-lg">
            Be one of our first case studies
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>
      </section>
      <FinalCTA />
    </>
  )
}
