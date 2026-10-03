import { useParams, Navigate, Link } from 'react-router-dom'
import PageHero from '../../components/PageHero.jsx'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import { whyTeemlyPages, getWhyTeemlyPage } from '../../data/whyTeemly.js'
import { useSEO } from '../../lib/useSEO.js'
import '../pages.css'

export default function WhyTeemlySubPage() {
  const { slug } = useParams()
  const page = getWhyTeemlyPage(slug)

  useSEO({
    title: page ? `${page.label} — Why Teemly` : 'Why Teemly',
    description: page?.intro,
    path: `/why-teemly/${slug}`,
  })

  if (!page) return <Navigate to="/why-teemly" replace />

  return (
    <>
      <PageHero eyebrow="Why Teemly" title={page.title} desc={page.intro} />

      <section className="section-tight">
        <div className="container">
          <div className="module-highlight-grid">
            {page.body.map((b) => (
              <div className="module-highlight-card" key={b.heading}>
                <h3>{b.heading}</h3>
                <p>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {slug === 'roi' && (
        <section className="section-tight">
          <div className="container" style={{ textAlign: 'center' }}>
            <Link to="/roi-calculator" className="btn btn-primary btn-lg">
              Open the ROI Calculator
              <Icon name="arrowRight" size={18} />
            </Link>
          </div>
        </section>
      )}

      <section className="section-tight">
        <div className="container module-nav-footer">
          <Link to="/why-teemly" className="module-nav-link center">
            All of Why Teemly
          </Link>
          <div style={{ display: 'flex', gap: 16 }}>
            {whyTeemlyPages
              .filter((p) => p.slug !== slug)
              .slice(0, 1)
              .map((p) => (
                <Link to={`/why-teemly/${p.slug}`} className="module-nav-link next" key={p.slug}>
                  <span>
                    <span className="module-nav-label">Also see</span>
                    {p.label}
                  </span>
                  <Icon name="arrowRight" size={15} />
                </Link>
              ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
