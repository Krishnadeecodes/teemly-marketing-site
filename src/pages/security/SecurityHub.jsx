import { Link } from 'react-router-dom'
import PageHero from '../../components/PageHero.jsx'
import SectionHead from '../../components/SectionHead.jsx'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import { securityTopics } from '../../data/securityTopics.js'
import '../../sections/sections.css'
import '../pages.css'

export default function SecurityHub() {
  return (
    <>
      <PageHero
        eyebrow="Security & Trust"
        title="Built to be trusted with sensitive workforce data"
        desc="Multi-tenant isolation, encryption in transit and at rest, and privacy controls that are enforced in the product — not just promised in a policy document."
      />

      <section className="section-tight">
        <div className="container">
          <div className="tile-grid">
            {securityTopics.map((t) => (
              <Link to={`/security/${t.slug}`} className="tile-card" key={t.slug}>
                <span className="tile-icon">
                  <Icon name={t.icon} size={20} />
                </span>
                <h3>{t.label}</h3>
                <p>{t.intro}</p>
                <span className="tile-link">
                  Read more <Icon name="arrowRight" size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--surface-soft)' }}>
        <div className="container">
          <SectionHead center eyebrow="Have A Specific Question?" title="Talk to the team directly" />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/trust-center" className="btn btn-outline">
              Visit the Trust Center
              <Icon name="arrowRight" size={16} />
            </Link>
            <Link to="/support" className="btn btn-primary">
              Contact Security Team
              <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
