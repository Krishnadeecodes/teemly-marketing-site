import { useParams, Navigate, Link } from 'react-router-dom'
import PageHero from '../../components/PageHero.jsx'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import { legalPages, getLegalPage } from '../../data/legalContent.js'
import { useSEO } from '../../lib/useSEO.js'
import '../pages.css'

export default function LegalPage() {
  const { slug } = useParams()
  const page = getLegalPage(slug)

  useSEO({
    title: page ? page.label : 'Legal',
    description: page ? `Teemly's ${page.label} — data-handling practices in plain language.` : undefined,
    path: `/legal/${slug}`,
  })

  if (!page) return <Navigate to="/legal/privacy" replace />

  return (
    <>
      <PageHero eyebrow="Legal" title={page.title} desc="Last reviewed alongside the current Security & Trust pages." />

      <section className="section-tight">
        <div className="container" style={{ maxWidth: 760, margin: '0 auto' }}>
          {page.pendingNotice && (
            <div className="module-plan-note" style={{ marginBottom: 32 }}>
              <Icon name="layers" size={17} />
              <p>
                This page summarises Teemly's real data-handling practices in plain language. It is not a
                finished, counsel-reviewed legal agreement — see Support if you need one for procurement.
              </p>
            </div>
          )}
          {page.sections.map((s) => (
            <div key={s.heading} style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 'var(--fs-lg)', marginBottom: 8 }}>{s.heading}</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>{s.body}</p>
            </div>
          ))}
          <div className="legal-links-row">
            {legalPages
              .filter((p) => p.slug !== slug)
              .map((p) => (
                <Link key={p.slug} to={`/legal/${p.slug}`} className="legal-pill-link">
                  {p.label}
                </Link>
              ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
