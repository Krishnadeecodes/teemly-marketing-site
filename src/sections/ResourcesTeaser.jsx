import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import Reveal from '../home/Reveal.jsx'
import { useResourcesHub, prefetchResourcePage, formatDate } from '../lib/resourcesApi.js'
import { DEFAULT_SETTINGS, getResourceType, glossaryTerms } from '../data/resourcesMeta.js'
import '../home/resources.css'

const MAX_CARDS = 3

// Featured items first, then the latest ones, then the glossary — so the
// section fills itself as content is published in the admin panel.
function pickCards(data) {
  const categories = data?.categories || []
  const labelOf = (slug) => categories.find((c) => c.slug === slug) || getResourceType(slug) || { label: 'Resource', icon: 'fileText' }

  const seen = new Set()
  const cards = []
  for (const item of [...(data?.featured || []), ...(data?.latest || [])]) {
    if (cards.length >= MAX_CARDS) break
    const key = `${item.type}/${item.slug}`
    if (seen.has(key)) continue
    seen.add(key)
    const cat = labelOf(item.type)
    cards.push({
      key,
      to: `/resources/${key}`,
      label: cat.label,
      icon: cat.icon,
      title: item.title,
      desc: item.summary,
      meta: [formatDate(item.publishedAt), item.readMins ? `${item.readMins} min read` : ''].filter(Boolean).join(' · '),
    })
  }

  const glossary = categories.find((c) => c.slug === 'glossary')
  const termCount = glossary?.count ?? (data ? 0 : glossaryTerms.length)
  if (cards.length < MAX_CARDS && termCount > 0) {
    cards.push({
      key: 'glossary',
      to: '/resources/glossary',
      label: 'Glossary',
      icon: 'book',
      title: 'Organizational Intelligence Glossary',
      desc: "Teemly's core terms, defined in plain language.",
      meta: `${termCount} terms`,
    })
  }
  return cards
}

export default function ResourcesTeaser() {
  // Copy is editable in the admin panel (Page text); defaults render until it loads.
  const { data } = useResourcesHub()
  const t = data?.settings.teaser || DEFAULT_SETTINGS.teaser
  const cards = pickCards(data)
  const categories = data?.categories || []

  return (
    <section className="h-resources">
      <div className="h-wrap">
        <div className="h-sec-head center">
          <span className="h-kicker">{t.kicker}</span>
          <SplitHeading key={t.title} as="h2" text={t.title} />
          <p>{t.desc}</p>
        </div>

        <Reveal as="div" className={`h-res-grid n${cards.length}`}>
          {cards.map((c) => (
            <Link key={c.key} to={c.to} className="h-res-card" onMouseEnter={() => prefetchResourcePage(c.to)} onFocus={() => prefetchResourcePage(c.to)}>
              <span className="h-res-top">
                <span className="h-res-ic" aria-hidden="true">
                  <Icon name={c.icon || 'fileText'} size={18} />
                </span>
                <span className="h-res-type">{c.label}</span>
              </span>
              <h3>{c.title}</h3>
              {c.desc && <p>{c.desc}</p>}
              <span className="h-res-meta">
                <span>{c.meta}</span>
                <span className="h-res-go" aria-hidden="true">
                  <Icon name="arrowRight" size={14} />
                </span>
              </span>
            </Link>
          ))}
        </Reveal>

        {categories.length > 1 && (
          <Reveal as="nav" className="h-res-cats" aria-label="Resource categories" delay={0.05}>
            {categories.map((c) => (
              <Link key={c.slug} to={`/resources/${c.slug}`} className="h-res-pill" onMouseEnter={() => prefetchResourcePage(`/resources/${c.slug}`)}>
                {c.label}
              </Link>
            ))}
          </Reveal>
        )}

        <Reveal as="div" className="h-resources-foot" delay={0.1}>
          <Link to="/resources" className="h-btn h-btn-primary" onMouseEnter={() => prefetchResourcePage('/resources')}>
            Explore all resources
            <span className="h-arr" aria-hidden="true">
              <Icon name="arrowRight" size={14} />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
