import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Icon from '../components/Icon.jsx'
import FinalCTA from '../sections/FinalCTA.jsx'
import { securityTopics, getSecurityTopic } from '../data/securityTopics.js'
import './pages.css'

const compliance = getSecurityTopic('compliance').complianceTable

export default function TrustCenter() {
  return (
    <>
      <PageHero
        eyebrow="Trust Center"
        title="Everything verified, in one place"
        desc="A single index of Teemly's security, privacy and compliance posture — each linking to the full detail."
      />

      <section className="section-tight">
        <div className="container">
          <SectionHead eyebrow="Compliance Status" title="Where Teemly stands today" center />
          <div className="compliance-table-wrap">
            <table className="compliance-table">
              <thead>
                <tr>
                  <th>Compliance</th>
                  <th>Status</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {compliance.map((c) => (
                  <tr key={c.name}>
                    <td>
                      <strong>{c.name}</strong>
                    </td>
                    <td>
                      <span className={`compliance-status ${c.status}`}>
                        {c.status === 'done' && <Icon name="check" size={14} />}
                        {c.label}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{c.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--surface-soft)' }}>
        <div className="container">
          <SectionHead eyebrow="Full Detail" title="Every security topic, documented" />
          <div className="related-grid">
            {securityTopics.map((t) => (
              <Link to={`/security/${t.slug}`} className="related-card" key={t.slug}>
                <span className="tile-icon">
                  <Icon name={t.icon} size={18} />
                </span>
                <span>
                  <strong>{t.label}</strong>
                </span>
                <Icon name="arrowRight" size={15} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="module-plan-note">
            <Icon name="layers" size={17} />
            <p>
              Published sub-processors: AWS, Vercel, Datadog and Sentry. A grievance officer is published at
              teemly.io/privacy. Data residency is AWS Mumbai (ap-south-1).
            </p>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
