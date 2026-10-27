import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import ResourceCard from './ResourceCard.jsx'
import { Cover, HeroTitle, SectionTitle, itemUrl, useFitCardText, useResourceMotion } from './templates/shared.jsx'
import { useResourcesHub } from '../../lib/resourcesApi.js'
import { useSEO } from '../../lib/useSEO.js'
import { DEFAULT_SETTINGS } from '../../data/resourcesMeta.js'
import '../../sections/sections.css'
import '../pages.css'
import './resources.css'
import './templates/templates.css'

const PAGE = 9

export default function ResourcesHub() {
  const { data, loading } = useResourcesHub()
  const hub = data?.settings.hub || DEFAULT_SETTINGS.hub
  const categories = data?.categories || []
  const catOf = (slug) => categories.find((c) => c.slug === slug)
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [limit, setLimit] = useState(PAGE)
  const libraryRef = useRef()

  useSEO({ title: 'Resource Center', description: hub.desc, path: '/resources' })
  useResourceMotion(data ? 'hub' : null)
  useFitCardText()

  const latest = data?.latest || []
  // Featured first; fill up to 3 with the latest so the strip isn't half empty.
  const highlights = data ? [...data.featured, ...latest.filter((l) => !data.featured.some((f) => f.id === l.id))].slice(0, 3) : []
  const downloads = data?.downloads || []

  const library = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return latest.filter(
      (r) =>
        (!type || r.type === type) &&
        (!needle || [r.title, r.summary, ...(r.tags || [])].some((s) => s?.toLowerCase().includes(needle))),
    )
  }, [latest, query, type])
  const typesInLibrary = categories.filter((c) => latest.some((r) => r.type === c.slug))

  function search(e) {
    e.preventDefault()
    setLimit(PAGE)
    libraryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const [lead, ...side] = highlights

  return (
    <div className="rt rt-hub">
      <header className="rt-hero rt-hero-soft rt-hub-hero">
        <div className="container rt-hero-inner left">
          <span className="rt-kicker">{hub.eyebrow}</span>
          <HeroTitle text={hub.title} />
          {hub.desc && <p className="rt-dek">{hub.desc}</p>}
          {latest.length > 0 && (
            <form className="rt-search large" role="search" onSubmit={search}>
              <label htmlFor="hub-search" className="sr-only">
                Search resources
              </label>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                id="hub-search"
                type="search"
                enterKeyHint="search"
                placeholder="Search research, guides, webinars…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setLimit(PAGE)
                }}
              />
              <button type="submit" className="btn btn-dark btn-sm">
                Search
              </button>
            </form>
          )}
          <div className="rt-quick" aria-busy={loading || undefined}>
            {categories.map((c) => (
              <Link key={c.slug} to={`/resources/${c.slug}`} className={`t-${c.slug}`}>
                <Icon name={c.icon} size={14} />
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {lead && (
        <section className="section-tight rt-hub-featured">
          <div className="container">
            <SectionTitle kicker="Featured" title="Featured resources" />
            <div className="rt-spotlight">
              <Link to={itemUrl(lead)} className={`rt-spot-lead t-${lead.type}`}>
                <Cover item={lead} icon={catOf(lead.type)?.icon} label={catOf(lead.type)?.label} showTitle />
                <div>
                  <span className="rt-kicker">{catOf(lead.type)?.label}</span>
                  <h3>{lead.title}</h3>
                  {lead.summary && <p>{lead.summary}</p>}
                  <span className="btn btn-primary btn-sm">
                    {lead.hasVideo ? 'Watch now' : lead.hasFile ? 'Download' : 'Read now'} <Icon name="arrowRight" size={14} />
                  </span>
                </div>
              </Link>
              {side.length > 0 && (
                <div className="rt-spot-side">
                  {side.map((r) => (
                    <Link to={itemUrl(r)} key={r.id} className={`rt-spot-item t-${r.type}`}>
                      <Cover item={r} icon={catOf(r.type)?.icon} label={catOf(r.type)?.label} />
                      <div>
                        <span className="rt-kicker">{catOf(r.type)?.label}</span>
                        <h3>{r.title}</h3>
                        <span className="rt-link">
                          {r.hasVideo ? 'Watch' : r.hasFile ? 'Download' : 'Read'} <Icon name="arrowRight" size={14} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {downloads.length > 0 && (
        <section className="section-tight rt-hub-downloads">
          <div className="container">
            <SectionTitle kicker="Most requested" title="Top downloads" />
            <div className="rt-downloads">
              {downloads.map((r) => (
                <Link to={itemUrl(r)} key={r.id} className={`rt-download-card t-${r.type}`}>
                  <div className="rt-book small">
                    <Cover item={r} icon={catOf(r.type)?.icon} label={catOf(r.type)?.label} showTitle />
                  </div>
                  <span className="rt-badge">{catOf(r.type)?.label}</span>
                  <h3>{r.title}</h3>
                  <span className="rt-link">
                    <Icon name="download" size={14} /> Get the PDF
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="section-tight rt-hub-library" ref={libraryRef}>
          <div className="container">
            <SectionTitle kicker="Library" title={query ? `Results for “${query}”` : 'Latest resources'} />
            {typesInLibrary.length > 1 && (
              <div className="rt-chips" role="group" aria-label="Filter by type">
                <button type="button" aria-pressed={!type} onClick={() => setType('')}>
                  All
                </button>
                {typesInLibrary.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    aria-pressed={type === c.slug}
                    onClick={() => {
                      setType(type === c.slug ? '' : c.slug)
                      setLimit(PAGE)
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
            {library.length ? (
              <div className="res-grid">
                {library.slice(0, limit).map((item) => (
                  <ResourceCard key={item.id} item={item} categoryLabel={catOf(item.type)?.label} icon={catOf(item.type)?.icon} />
                ))}
              </div>
            ) : (
              <p className="rt-none">
                Nothing matches that yet.{' '}
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setType('')
                  }}
                >
                  Clear filters
                </button>
                {' '}or try the <Link to="/resources/glossary">glossary</Link>.
              </p>
            )}
            {library.length > limit && (
              <div className="rt-more">
                <button type="button" className="btn btn-outline" onClick={() => setLimit((l) => l + PAGE)}>
                  Load more
                </button>
                <span>
                  Showing {limit} of {library.length}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      <FinalCTA />
    </div>
  )
}
