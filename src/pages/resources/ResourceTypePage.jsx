import { useParams, Navigate, Link } from 'react-router-dom'
import PageHero from '../../components/PageHero.jsx'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import ResourceCard from './ResourceCard.jsx'
import { useResourceType } from '../../lib/resourcesApi.js'
import { useSEO } from '../../lib/useSEO.js'
import '../pages.css'
import './resources.css'

export default function ResourceTypePage() {
  const { slug } = useParams()
  const { data, loading } = useResourceType(slug)
  const type = data?.category

  useSEO({
    title: type ? `${type.label} — Resources` : 'Resources',
    description: type?.description,
    path: `/resources/${slug}`,
  })

  if (loading) return <div className="res-loading" aria-busy="true" />
  if (!type) return <Navigate to="/resources" replace />

  if (data.terms) {
    return (
      <>
        <PageHero eyebrow="Resources" title={type.label} desc={type.description} />
        <section className="section-tight">
          <div className="container">
            <dl className="glossary-list">
              {data.terms.map((g) => (
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
        {data.items.length > 0 ? (
          <div className="container">
            <div className="res-grid">
              {data.items.map((item) => (
                <ResourceCard key={item.id} item={item} icon={type.icon} />
              ))}
            </div>
          </div>
        ) : (
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
        )}
      </section>
      <FinalCTA />
    </>
  )
}
