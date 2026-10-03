import { useParams, Navigate, Link } from 'react-router-dom'
import PageHero from '../../components/PageHero.jsx'
import SectionHead from '../../components/SectionHead.jsx'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import { securityTopics, getSecurityTopic } from '../../data/securityTopics.js'
import { useSEO } from '../../lib/useSEO.js'
import '../pages.css'

export default function SecuritySubPage() {
  const { slug } = useParams()
  const topic = getSecurityTopic(slug)

  useSEO({
    title: topic ? `${topic.label} — Security & Trust` : 'Security & Trust',
    description: topic?.intro,
    path: `/security/${slug}`,
  })

  if (!topic) return <Navigate to="/security" replace />

  const idx = securityTopics.findIndex((t) => t.slug === slug)
  const prev = securityTopics[(idx - 1 + securityTopics.length) % securityTopics.length]
  const next = securityTopics[(idx + 1) % securityTopics.length]

  return (
    <>
      <PageHero eyebrow="Security & Trust" title={topic.title} desc={topic.intro} />

      <section className="section-tight">
        <div className="container">
          <ul className="sec-list pillar-fact-list">
            {topic.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      {topic.collects && (
        <section className="section-tight" style={{ background: 'var(--surface-soft)' }}>
          <div className="container">
            <SectionHead eyebrow="In Plain Terms" title="Collects vs. never collects" />
            <div className="collect-grid">
              <div>
                <h4 className="collect-head yes">Teemly collects</h4>
                <ul className="sec-list">
                  {topic.collects.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="collect-head no">Teemly never collects</h4>
                <ul className="sec-list">
                  {topic.neverCollects.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {topic.complianceTable && (
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
                  {topic.complianceTable.map((c) => (
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
      )}

      <section className="section-tight">
        <div className="container module-nav-footer">
          <Link to={`/security/${prev.slug}`} className="module-nav-link prev">
            <Icon name="arrowRight" size={15} className="flip" />
            <span>
              <span className="module-nav-label">Previous</span>
              {prev.label}
            </span>
          </Link>
          <Link to="/security" className="module-nav-link center">
            Security overview
          </Link>
          <Link to={`/security/${next.slug}`} className="module-nav-link next">
            <span>
              <span className="module-nav-label">Next</span>
              {next.label}
            </span>
            <Icon name="arrowRight" size={15} />
          </Link>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
