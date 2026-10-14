import { Link } from 'react-router-dom'
import PageHero from '../../components/PageHero.jsx'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import ResourceCard from './ResourceCard.jsx'
import { useResourcesHub } from '../../lib/resourcesApi.js'
import { useSEO } from '../../lib/useSEO.js'
import { DEFAULT_SETTINGS } from '../../data/resourcesMeta.js'
import '../../sections/sections.css'
import '../pages.css'
import './resources.css'

export default function ResourcesHub() {
  const { data, loading } = useResourcesHub()
  const hub = data?.settings.hub || DEFAULT_SETTINGS.hub
  const categories = data?.categories || []
  const labelOf = (slug) => categories.find((c) => c.slug === slug)

  useSEO({ title: 'Resource Center', description: hub.desc, path: '/resources' })

  // Featured first; fill up to 3 with the latest so the strip isn't half empty.
  const highlights = data ? [...data.featured, ...data.latest.filter((l) => !data.featured.some((f) => f.id === l.id))].slice(0, 3) : []

  return (
    <>
      {/* key: re-run the heading reveal if edited copy differs from the default */}
      <PageHero key={hub.title} eyebrow={hub.eyebrow} title={hub.title} desc={hub.desc} />

      {highlights.length > 0 && (
        <section className="section-tight res-featured">
          <div className="container">
            <h2 className="res-section-title">Featured &amp; latest</h2>
            <div className="res-grid">
              {highlights.map((item) => (
                <ResourceCard key={item.id} item={item} categoryLabel={labelOf(item.type)?.label} icon={labelOf(item.type)?.icon} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-tight">
        <div className="container">
          {highlights.length > 0 && <h2 className="res-section-title">Browse by type</h2>}
          <div className="tile-grid" aria-busy={loading || undefined}>
            {categories.map((r) => (
              <Link to={`/resources/${r.slug}`} className="tile-card" key={r.slug}>
                <span className="tile-icon">
                  <Icon name={r.icon} size={20} />
                </span>
                <h3>{r.label}</h3>
                <p>{r.description}</p>
                <span className="tile-link">
                  {r.count > 0 ? `${r.count} ${r.slug === 'glossary' ? 'terms' : r.count === 1 ? 'item' : 'items'}` : 'Explore'}{' '}
                  <Icon name="arrowRight" size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
