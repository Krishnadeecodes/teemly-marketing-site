import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Icon from '../components/Icon.jsx'
import FinalCTA from '../sections/FinalCTA.jsx'
import './pages.css'

const categories = [
  { icon: 'dollar', title: 'Contact Sales', desc: 'Pricing, plans and a live walkthrough.', action: { label: 'Book a Demo', to: '/book-a-demo', internal: true } },
  { icon: 'gear', title: 'Contact Support', desc: 'Existing customers with a product question.', action: { label: 'Email Support', to: 'mailto:hello@teemly.app' } },
  { icon: 'shield', title: 'Security Inquiry', desc: 'Questions for the security or compliance team.', action: { label: 'Email Security', to: 'mailto:hello@teemly.app' } },
  { icon: 'puzzle', title: 'Partnership Inquiry', desc: 'Reseller, implementation or integration partnerships.', action: { label: 'See Partners', to: '/company/partners', internal: true } },
  { icon: 'fileText', title: 'Media Inquiry', desc: 'Press and media requests.', action: { label: 'See News', to: '/company/news', internal: true } },
  { icon: 'mail', title: 'General Inquiry', desc: 'Anything else.', action: { label: 'Contact Us', to: '/company/contact', internal: true } },
]

const slaRows = [
  { plan: 'Starter', sla: 'Email support' },
  { plan: 'Professional', sla: '48-hour response SLA' },
  { plan: 'Premium', sla: '24-hour response SLA' },
  { plan: 'Enterprise', sla: '4-hour response SLA, dedicated account manager' },
]

export default function Support() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Routed to the right place, not a generic inbox"
        desc="Pick the category closest to your question."
      />

      <section className="section-tight">
        <div className="container">
          <div className="tile-grid">
            {categories.map((c) => (
              <div className="tile-card" key={c.title}>
                <span className="tile-icon">
                  <Icon name={c.icon} size={20} />
                </span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                {c.action.internal ? (
                  <Link to={c.action.to} className="tile-link">
                    {c.action.label} <Icon name="arrowRight" size={14} />
                  </Link>
                ) : (
                  <a href={c.action.to} className="tile-link">
                    {c.action.label} <Icon name="arrowRight" size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--surface-soft)' }}>
        <div className="container">
          <SectionHead center eyebrow="Support SLA" title="Response times, by plan" />
          <div className="related-grid">
            {slaRows.map((r) => (
              <div className="related-card static" key={r.plan}>
                <span className="tile-icon">
                  <Icon name="clock" size={18} />
                </span>
                <span>
                  <strong>{r.plan}</strong>
                  <span className="related-sub">{r.sla}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
