import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../../components/Icon.jsx'
import ResourceCard from '../ResourceCard.jsx'
import { formatDate } from '../../../lib/resourcesApi.js'
import { isUpcoming, splitPair } from '../../../lib/resourceTemplates.js'
import { DateBadge } from './details.jsx'
import { Cover, EmptyState, HeroTitle, Initials, SectionTitle, StatBand, itemUrl, useChipFilter } from './shared.jsx'

function ListHero({ category, variant = 'soft', kicker = 'Resources', children }) {
  return (
    <header className={`rt-hero rt-hero-${variant} rt-list-hero`}>
      <div className="rt-hero-art" aria-hidden="true">
        <span className="rt-hero-orb">
          <Icon name={category.icon} size={56} />
        </span>
        <span className="rt-hero-dot d1" />
        <span className="rt-hero-dot d2" />
        <span className="rt-hero-dot d3" />
      </div>
      <div className="container rt-hero-inner left">
        <nav className="rt-crumbs" aria-label="Breadcrumb">
          <Link to="/resources">Resources</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{category.label}</span>
        </nav>
        <span className="rt-kicker">{kicker}</span>
        <HeroTitle text={category.label} gradient />
        {category.description && <p className="rt-dek">{category.description}</p>}
        {children}
      </div>
    </header>
  )
}

const Arrow = () => (
  <span className="rt-arrow" aria-hidden="true">
    <Icon name="arrowRight" size={16} />
  </span>
)

// ================= Research: lead study + editorial index =================
export function ResearchList({ category, items }) {
  const [lead, ...rest] = items
  return (
    <div className="rt t-research">
      <ListHero category={category} kicker="Teemly Research" />
      {!lead ? (
        <EmptyState type={category} />
      ) : (
        <section className="section-tight">
          <div className="container">
            <Link to={itemUrl(lead)} className="rt-lead">
              <Cover item={lead} icon={category.icon} label="Latest study" showTitle />
              <div className="rt-lead-body">
                <span className="rt-kicker">Latest study · {formatDate(lead.publishedAt)}</span>
                <h2>{lead.title}</h2>
                {lead.summary && <p>{lead.summary}</p>}
                <StatBand stats={(lead.meta?.stats || []).slice(0, 2)} />
                <span className="rt-link">
                  {lead.hasFile ? 'Read & download' : 'Read the study'} <Icon name="arrowRight" size={14} />
                </span>
              </div>
            </Link>
            {rest.length > 0 && (
              <>
                <SectionTitle kicker="Archive" title="All studies" />
                <ol className="rt-index">
                  {rest.map((r, i) => (
                    <li key={r.id}>
                      <Link to={itemUrl(r)}>
                        <span className="rt-index-n">{String(i + 2).padStart(2, '0')}</span>
                        <span className="rt-index-main">
                          <strong>{r.title}</strong>
                          {r.summary && <span>{r.summary}</span>}
                        </span>
                        <span className="rt-index-meta">
                          {formatDate(r.publishedAt)}
                          {r.hasFile && <em>PDF</em>}
                        </span>
                        <Arrow />
                      </Link>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

// ================= Reports: portrait book covers =================
export function ReportsList({ category, items }) {
  return (
    <div className="rt t-reports">
      <ListHero category={category} variant="lp" kicker="Reports & downloads" />
      {!items.length ? (
        <EmptyState type={category} />
      ) : (
        <section className="section-tight">
          <div className="container rt-shelf">
            {items.map((r) => (
              <Link to={itemUrl(r)} className="rt-shelf-item" key={r.id}>
                <div className="rt-book">
                  <Cover item={r} icon={category.icon} label={category.label} showTitle />
                </div>
                <div className="rt-shelf-body">
                  <span className="rt-badge">{r.hasFile ? (r.gated ? 'Free download' : 'PDF') : 'Read online'}</span>
                  <h3>{r.title}</h3>
                  {r.summary && <p>{r.summary}</p>}
                  <span className="rt-link">
                    {r.hasFile ? 'Get the report' : 'Read the report'} <Icon name="arrowRight" size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ================= Guides: numbered playbook rows =================
export function GuidesList({ category, items }) {
  return (
    <div className="rt t-guides">
      <ListHero category={category} kicker="Playbooks & how-tos" />
      {!items.length ? (
        <EmptyState type={category} />
      ) : (
        <section className="section-tight">
          <div className="container rt-guides">
            {items.map((r, i) => (
              <Link to={itemUrl(r)} className="rt-guide-card" key={r.id}>
                <span className="rt-guide-n">Guide {String(i + 1).padStart(2, '0')}</span>
                <h3>{r.title}</h3>
                {r.summary && <p>{r.summary}</p>}
                {r.meta?.takeaways?.length > 0 && (
                  <ul>
                    {r.meta.takeaways.slice(0, 3).map((t) => (
                      <li key={t}>
                        <Icon name="check" size={14} /> {t}
                      </li>
                    ))}
                  </ul>
                )}
                <span className="rt-guide-foot">
                  <span>{r.readMins} min read</span>
                  {r.hasFile && <span>PDF available</span>}
                  <Arrow />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ================= Case studies: customer cards + industry filter =================
export function CaseStudiesList({ category, items }) {
  const [shown, chips] = useChipFilter(items, (i) => [i.meta?.industry], 'All industries')
  return (
    <div className="rt t-case-studies">
      <ListHero category={category} kicker="Customer stories" />
      {!items.length ? (
        <EmptyState type={category} />
      ) : (
        <section className="section-tight">
          <div className="container">
            {chips}
            <div className="rt-stories">
              {shown.map((r) => {
                const stat = r.meta?.stats?.[0] && splitPair(r.meta.stats[0])
                return (
                  <Link to={itemUrl(r)} className="rt-story" key={r.id}>
                    <div className="rt-story-top">
                      <span className="rt-wordmark">{r.meta?.customer || category.label}</span>
                      {r.meta?.industry && <span className="res-chip">{r.meta.industry}</span>}
                    </div>
                    {stat && (
                      <div className="rt-story-stat">
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                      </div>
                    )}
                    <h3>{r.title}</h3>
                    {!stat && r.summary && <p>{r.summary}</p>}
                    <span className="rt-link">
                      Read the story <Icon name="arrowRight" size={14} />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

// ================= Blog: magazine layout + topic filter =================
export function BlogList({ category, items }) {
  const [shown, chips] = useChipFilter(items, (i) => i.tags || [], 'All topics')
  const [lead, ...rest] = shown
  return (
    <div className="rt t-blog">
      <ListHero category={category} kicker="The Teemly blog" />
      {!items.length ? (
        <EmptyState type={category} />
      ) : (
        <section className="section-tight">
          <div className="container">
            {chips}
            {lead && (
              <Link to={itemUrl(lead)} className="rt-feature">
                <Cover item={lead} icon={category.icon} label={category.label} showTitle />
                <div className="rt-feature-body">
                  <span className="rt-kicker">{lead.tags?.[0] || 'Latest'}</span>
                  <h2>{lead.title}</h2>
                  {lead.summary && <p>{lead.summary}</p>}
                  <div className="rt-byline small">
                    {lead.author && <Initials name={lead.author} />}
                    <span>
                      {lead.author && <strong>{lead.author}</strong>} {formatDate(lead.publishedAt)} · {lead.readMins} min read
                    </span>
                  </div>
                </div>
              </Link>
            )}
            {rest.length > 0 && (
              <div className="rt-posts">
                {rest.map((r) => (
                  <Link to={itemUrl(r)} className="rt-post" key={r.id}>
                    <Cover item={r} icon={category.icon} />
                    <span className="rt-post-meta">
                      {r.tags?.[0] && <span className="rt-kicker">{r.tags[0]}</span>}
                      {formatDate(r.publishedAt)} · {r.readMins} min read
                    </span>
                    <h3>{r.title}</h3>
                    {r.summary && <p>{r.summary}</p>}
                    {r.author && <span className="rt-post-author">By {r.author}</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

// ================= Webinars: upcoming events + on-demand library =================
export function WebinarsList({ category, items }) {
  const upcoming = items.filter((i) => isUpcoming(i.meta)).sort((a, b) => a.meta.eventOn.localeCompare(b.meta.eventOn))
  const onDemand = items.filter((i) => !isUpcoming(i.meta))
  return (
    <div className="rt t-webinars">
      <ListHero category={category} kicker="Live & on-demand" />
      {!items.length ? (
        <EmptyState type={category} />
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="section-tight">
              <div className="container">
                <SectionTitle kicker="Register now" title="Upcoming webinars" />
                <div className="rt-events">
                  {upcoming.map((r) => (
                    <Link to={itemUrl(r)} className="rt-event-row" key={r.id}>
                      <DateBadge iso={r.meta.eventOn} />
                      <span className="rt-event-row-main">
                        <strong>{r.title}</strong>
                        <span>
                          {[r.meta.eventDate, r.meta.duration, r.meta.speakers?.length && `${r.meta.speakers.length} speaker${r.meta.speakers.length > 1 ? 's' : ''}`]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      </span>
                      <span className="btn btn-primary btn-sm">Register</span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
          {onDemand.length > 0 && (
            <section className="section-tight">
              <div className="container">
                <SectionTitle kicker="Watch anytime" title="On-demand library" />
                <div className="rt-ondemand">
                  {onDemand.map((r) => (
                    <Link to={itemUrl(r)} className="rt-post" key={r.id}>
                      <Cover item={r} icon="play" label="On demand" />
                      <span className="rt-post-meta">
                        {r.meta?.eventOn ? `Recorded ${formatDate(r.meta.eventOn)}` : formatDate(r.publishedAt)}
                        {r.meta?.duration && ` · ${r.meta.duration}`}
                      </span>
                      <h3>{r.title}</h3>
                      {r.meta?.speakers?.length > 0 && (
                        <span className="rt-post-author">With {r.meta.speakers.map((s) => splitPair(s).value).join(', ')}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

// ================= Videos: featured reel + grid =================
export function VideosList({ category, items }) {
  const [lead, ...rest] = items
  return (
    <div className="rt t-videos">
      <ListHero category={category} kicker="Watch" />
      {!lead ? (
        <EmptyState type={category} />
      ) : (
        <section className="section-tight">
          <div className="container">
            <Link to={itemUrl(lead)} className="rt-reel-lead">
              <Cover item={{ ...lead, hasVideo: true }} icon="play" />
              <span>
                <span className="rt-kicker">Featured</span>
                <strong>{lead.title}</strong>
                {lead.summary && <span className="rt-reel-sum">{lead.summary}</span>}
                {lead.meta?.duration && <small>{lead.meta.duration}</small>}
              </span>
            </Link>
            {rest.length > 0 && (
              <div className="rt-reel">
                {rest.map((r) => (
                  <Link to={itemUrl(r)} key={r.id}>
                    <Cover item={{ ...r, hasVideo: true }} icon="play" />
                    {r.meta?.duration && <span className="rt-duration">{r.meta.duration}</span>}
                    <strong>{r.title}</strong>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

// ================= Glossary: A–Z index with search =================
export function GlossaryList({ category, terms }) {
  const [q, setQ] = useState('')
  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const list = [...terms]
      .filter((t) => !needle || t.term.toLowerCase().includes(needle) || t.def.toLowerCase().includes(needle))
      .sort((a, b) => a.term.localeCompare(b.term))
    const map = new Map()
    for (const t of list) {
      const letter = /[a-z]/i.test(t.term[0]) ? t.term[0].toUpperCase() : '#'
      if (!map.has(letter)) map.set(letter, [])
      map.get(letter).push(t)
    }
    return map
  }, [terms, q])
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  return (
    <div className="rt t-glossary">
      <ListHero category={category} kicker="Reference">
        <label className="rt-search">
          <span className="sr-only">Search the glossary</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input type="search" placeholder={`Search ${terms.length} terms…`} value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </ListHero>
      <section className="section-tight">
        <div className="container rt-glossary">
          <nav className="rt-az" aria-label="Jump to letter">
            {letters.map((l) =>
              groups.has(l) ? (
                <a key={l} href={`#letter-${l}`}>
                  {l}
                </a>
              ) : (
                <span key={l} aria-hidden="true">
                  {l}
                </span>
              ),
            )}
          </nav>
          <div>
            {groups.size === 0 && <p className="rt-dek">No terms match “{q}”.</p>}
            {[...groups].map(([letter, list]) => (
              <section key={letter} id={`letter-${letter}`} className="rt-az-group">
                <h2>{letter}</h2>
                <dl>
                  {list.map((g) => (
                    <div key={g.term}>
                      <dt>{g.term}</dt>
                      <dd>{g.def}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// ================= Default: categories created in the admin =================
export function DefaultList({ category, items }) {
  return (
    <div className="rt">
      <ListHero category={category} />
      {!items.length ? (
        <EmptyState type={category} />
      ) : (
        <section className="section-tight">
          <div className="container">
            <div className="res-grid">
              {items.map((item) => (
                <ResourceCard key={item.id} item={item} icon={category.icon} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export const LIST_TEMPLATES = {
  research: ResearchList,
  reports: ReportsList,
  guides: GuidesList,
  'case-studies': CaseStudiesList,
  blog: BlogList,
  webinars: WebinarsList,
  videos: VideosList,
}
