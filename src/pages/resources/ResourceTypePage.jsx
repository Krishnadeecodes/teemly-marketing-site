import { useParams, Navigate, Link } from 'react-router-dom'
import PageHero from '../../components/PageHero.jsx'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import { getResourceType } from '../../data/resourcesMeta.js'
import { glossaryTerms } from '../../data/resourcesMeta.js'
import { useSEO } from '../../lib/useSEO.js'
import '../pages.css'

export default function ResourceTypePage() {
  const { slug } = useParams()
  const type = getResourceType(slug)

  useSEO({
    title: type ? `${type.label} — Resources` : 'Resources',
    description: type?.description,
    path: `/resources/${slug}`,
  })

  if (!type) return <Navigate to="/resources" replace />

  if (slug === 'glossary') {
    return (
      <>
        <PageHero eyebrow="Resources" title="Glossary" desc={type.description} />
        <section className="section-tight">
          <div className="container">
            <dl className="glossary-list">
              {glossaryTerms.map((g) => (
                <div className="glossary-item" key={g.term}>
                  <dt>{g.term}</dt>
                  <dd>{g.def}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
        <FinalCTA />
      </>
    )
  }

  return (
    <>
      <PageHero eyebrow="Resources" title={type.label} desc={type.description} />
      <section className="section-tight">
        <div className="container resource-empty">
          <span className="tile-icon resource-empty-icon">
            <Icon name={type.icon} size={28} />
          </span>
          <h3>Nothing published here yet</h3>
          <p>
            We're not dressing up placeholder content as finished {type.label.toLowerCase()} — this section goes
            live as soon as there is something real to publish.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/resources/glossary" className="btn btn-outline">
              Read the Glossary instead
            </Link>
            <Link to="/resources" className="btn btn-primary">
              Back to Resource Center
            </Link>
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  )
}
