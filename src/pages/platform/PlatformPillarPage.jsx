import { useParams, Navigate, Link } from 'react-router-dom'
import PageHero from '../../components/PageHero.jsx'
import SectionHead from '../../components/SectionHead.jsx'
import Icon from '../../components/Icon.jsx'
import RelatedModulesSection from '../../components/RelatedModulesSection.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import { platformPillars, getPillar } from '../../data/platformPillars.js'
import { getModule } from '../../data/moduleContent.js'
import { useSEO } from '../../lib/useSEO.js'
import '../../sections/sections.css'
import '../pages.css'

export default function PlatformPillarPage() {
  const { slug } = useParams()
  const pillar = getPillar(slug)

  useSEO({
    title: pillar ? `${pillar.label} — Platform` : 'Platform',
    description: pillar?.intro,
    path: `/platform/${slug}`,
  })

  if (!pillar) return <Navigate to="/platform" replace />

  const idx = platformPillars.findIndex((p) => p.slug === slug)
  const prev = platformPillars[(idx - 1 + platformPillars.length) % platformPillars.length]
  const next = platformPillars[(idx + 1) % platformPillars.length]
  const modules = pillar.relatedModules.map(getModule).filter(Boolean)

  return (
    <>
      <PageHero eyebrow="Platform" title={pillar.title} desc={pillar.intro} />

      <section className="section-tight">
        <div className="container">
          <div className="module-highlight-grid">
            {pillar.body.map((b) => (
              <div className="module-highlight-card" key={b.heading}>
                <h3>{b.heading}</h3>
                <p>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--surface-soft)' }}>
        <div className="container">
          <SectionHead eyebrow="What Actually Ships" title="Verified capabilities" />
          <ul className="sec-list pillar-fact-list">
            {pillar.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      <RelatedModulesSection modules={modules} reports={pillar.relatedReports} />

      <section className="section-tight">
        <div className="container module-nav-footer">
          <Link to={`/platform/${prev.slug}`} className="module-nav-link prev">
            <Icon name="arrowRight" size={15} className="flip" />
            <span>
              <span className="module-nav-label">Previous</span>
              {prev.label}
            </span>
          </Link>
          <Link to="/platform" className="module-nav-link center">
            All pillars
          </Link>
          <Link to={`/platform/${next.slug}`} className="module-nav-link next">
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
