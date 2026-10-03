import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Icon from '../components/Icon.jsx'
import ProductTour from '../sections/ProductTour.jsx'
import FinalCTA from '../sections/FinalCTA.jsx'
import './pages.css'

const journeys = [
  { to: '/solutions/executives', label: 'Executive experience', icon: 'briefcase' },
  { to: '/solutions/managers', label: 'Manager experience', icon: 'target' },
  { to: '/solutions/hr', label: 'HR experience', icon: 'users' },
  { to: '/solutions/operations', label: 'Operations experience', icon: 'gear' },
  { to: '/platform/ai-intelligence', label: 'AI Intelligence', icon: 'sparkle' },
  { to: '/platform/workflow-intelligence', label: 'Workflow Intelligence', icon: 'layers' },
  { to: '/security', label: 'Security and governance', icon: 'shield' },
]

export default function TakeATour() {
  return (
    <>
      <PageHero
        eyebrow="Take a Tour"
        title="A self-guided look at the product, before you book a call"
        desc="Pick the journey closest to your role, or scroll through the full module-by-module walkthrough below."
      />

      <section className="section-tight">
        <div className="container">
          <div className="related-grid">
            {journeys.map((j) => (
              <Link to={j.to} className="related-card" key={j.to}>
                <span className="tile-icon">
                  <Icon name={j.icon} size={18} />
                </span>
                <span>
                  <strong>{j.label}</strong>
                </span>
                <Icon name="arrowRight" size={15} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ProductTour />

      <section className="section-tight">
        <div className="container">
          <SectionHead
            center
            eyebrow="Before You Book a Demo"
            title="Check security and governance first, if that's what blocks you"
            desc="Access control, encryption, audit logging and the Silent Tracking legal gate are documented in full on the Security & Trust pages."
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/security" className="btn btn-outline">
              Explore Security &amp; Trust
              <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
