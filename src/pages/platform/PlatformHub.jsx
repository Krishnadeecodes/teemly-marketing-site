import { Link } from 'react-router-dom'
import PageHero from '../../components/PageHero.jsx'
import SectionHead from '../../components/SectionHead.jsx'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import { platformPillars } from '../../data/platformPillars.js'
import '../../sections/sections.css'
import '../pages.css'

const principles = [
  'Secure by design',
  'API-first',
  'Privacy-first',
  'Role-aware access',
  'Organisation-scoped data separation',
  'Observable — every sensitive view is logged',
]

export default function PlatformHub() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="One intelligence layer, not six disconnected tools"
        desc="Every pillar below reads from the same real-time record the Teemly agent writes to — organisational context is the model that ties them together."
      />

      <section className="section-tight">
        <div className="container">
          <div className="tile-grid">
            {platformPillars.map((p) => (
              <Link to={`/platform/${p.slug}`} className="tile-card" key={p.slug}>
                <span className="tile-icon">
                  <Icon name={p.icon} size={20} />
                </span>
                <h3>{p.label}</h3>
                <p>{p.intro}</p>
                <span className="tile-link">
                  Learn more <Icon name="arrowRight" size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--surface-soft)' }}>
        <div className="container">
          <SectionHead center eyebrow="Platform Principles" title="What we can actually stand behind" />
          <div className="principle-row">
            {principles.map((p) => (
              <span className="pill-tag principle-pill" key={p}>
                <Icon name="check" size={13} />
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
