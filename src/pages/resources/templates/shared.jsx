import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../../components/Icon.jsx'
import GatedDownload from '../GatedDownload.jsx'
import { renderBody } from '../../../lib/markdown.js'
import { toEmbedUrl } from '../../../lib/video.js'
import { formatDate } from '../../../lib/resourcesApi.js'
import { splitPair } from '../../../lib/resourceTemplates.js'
import SplitHeading from '../../../home/SplitHeading.jsx'
import { gsap, isPhone, prefersReducedMotion } from '../../../home/useHomeScroll.js'
import { reveal } from '../../../home/reveal.js'

export const itemUrl = (item) => `/resources/${item.type}/${item.slug}`

// ---------- Motion (same feel as the rest of the site) ----------
// Page title whose words slide up one by one on load, like PageHero. With
// `gradient`, one gradient runs across the whole title: each word shows the
// slice of it that sits behind that word.
export function HeroTitle({ text, gradient = false }) {
  const ref = useRef()
  useLayoutEffect(() => {
    const h = ref.current?.firstElementChild
    if (!gradient || !h) return undefined
    const paint = () => {
      const width = h.clientWidth
      for (const word of h.querySelectorAll('.w')) {
        word.firstElementChild.style.backgroundSize = `${width}px 100%`
        word.firstElementChild.style.backgroundPosition = `${-word.offsetLeft}px 0`
      }
    }
    paint()
    const ro = new ResizeObserver(paint)
    ro.observe(h)
    return () => ro.disconnect()
  }, [text, gradient])
  return (
    <span ref={ref} style={{ display: 'contents' }}>
      <SplitHeading as="h1" text={text} mode="load" className={`rt-title${gradient ? ' rt-title-grad' : ''}`} />
    </span>
  )
}

// Banner details (label, intro, meta, buttons, artwork) that rise in after the title.
const HERO_PARTS =
  '.rt-crumbs, .rt-kicker, .rt-pill, .rt-dek, .rt-metaline, .rt-byline, .rt-event-meta, .rt-hero-ctas, .rt-hero-inner > .btn, .rt-search, .rt-quick, .rt-stats, .rt-checklist, .rt-date, .rt-hero-art, .rt-hub-art, .rt-wordmark, .rt-lp-side, .rt-case-cover, .rt-theatre-grid > div > :not(h1), .rt-upnext'
// Content blocks that rise into view as they're scrolled to, a few at a time.
const SCROLL_PARTS =
  '.res-card, .rt-spot-lead, .rt-spot-item, .rt-download-card, .tile-card, .rt-lead, .rt-index li, .rt-shelf-item, .rt-guide-card, .rt-story, .rt-feature, .rt-post, .rt-event-row, .rt-reel-lead, .rt-reel > a, .rt-az-group, .rt-side-card, .rt-main > .rt-checklist, .rt-main > .res-cover, .rt-main > .res-video, .rt-band .rt-stats > div, .rt-editorial-media, .resource-empty'

const topLevel = (els) => els.filter((el) => !els.some((other) => other !== el && other.contains(el)))

// Runs the page's entrance and scroll animations once its content is on screen.
// `key` changes when a different page (or its data) is shown. On phones the
// banner details are simply there with the title; nothing waits to slide in.
export function useResourceMotion(key) {
  useLayoutEffect(() => {
    const root = document.querySelector('main')
    if (!key || !root || prefersReducedMotion()) return undefined
    const heroes = [...root.querySelectorAll('.rt-hero, .rt-theatre')]
    const inHero = (el) => heroes.some((h) => h.contains(el))
    const intro = isPhone() ? [] : topLevel([...root.querySelectorAll(HERO_PARTS)].filter(inHero))
    const items = topLevel([...root.querySelectorAll(SCROLL_PARTS)].filter((el) => !inHero(el)))
    if (intro.length) {
      gsap.from(intro, { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.05, delay: 0.1, clearProps: 'transform,opacity' })
    }
    const stopItems = reveal(items, { y: 32, opacity: 0 }, { duration: 0.8, stagger: 0.08 })
    return () => {
      stopItems()
      gsap.killTweensOf(intro)
      gsap.set(intro, { clearProps: 'transform,opacity' })
    }
  }, [key])
}

// ---------- Body with heading anchors (feeds the guide's table of contents) ----------
const slugifyHeading = (t) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'section'

export function ArticleBody({ body, onHeadings, className = '' }) {
  const ref = useRef()
  const html = useMemo(() => renderBody(body), [body])
  useLayoutEffect(() => {
    if (!ref.current) return
    const used = new Set()
    const heads = [...ref.current.querySelectorAll('h2, h3')].map((h) => {
      let id = slugifyHeading(h.textContent)
      while (used.has(id)) id += '-x'
      used.add(id)
      h.id = id
      return { id, text: h.textContent, level: h.tagName === 'H2' ? 2 : 3 }
    })
    onHeadings?.(heads)
  }, [html]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!body?.trim()) return null
  return <div ref={ref} className={`res-prose ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}

// Highlights the TOC entry for the section currently being read.
export function useActiveHeading(headings) {
  const [active, setActive] = useState('')
  useEffect(() => {
    if (!headings.length) return undefined
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-90px 0px -65% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [headings])
  return active
}

export function ReadingProgress() {
  const bar = useRef()
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return <div className="rt-progress" ref={bar} aria-hidden="true" />
}

// ---------- Small pieces ----------
export function Breadcrumbs({ category, item }) {
  return (
    <nav className="rt-crumbs" aria-label="Breadcrumb">
      <Link to="/resources">Resources</Link>
      <span aria-hidden="true">/</span>
      <Link to={`/resources/${category.slug}`}>{category.label}</Link>
      {item && (
        <>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{item.title}</span>
        </>
      )}
    </nav>
  )
}

export function MetaLine({ item, readTime = true, extra = [] }) {
  const parts = [
    item.publishedAt && <time key="d" dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>,
    readTime && item.readMins > 0 && <span key="r">{item.readMins} min read</span>,
    ...extra,
  ].filter(Boolean)
  return (
    <div className="rt-metaline">
      {parts.map((p, i) => (
        <span key={i} className="rt-metaline-part">
          {p}
        </span>
      ))}
    </div>
  )
}

export function StatBand({ stats, variant = 'light' }) {
  const list = (stats || []).map(splitPair).filter((s) => s.value)
  if (!list.length) return null
  return (
    <dl className={`rt-stats rt-stats-${variant}`} style={{ '--n': list.length }}>
      {list.map((s) => (
        <div key={s.value + s.label}>
          <dt>{s.value}</dt>
          {s.label && <dd>{s.label}</dd>}
        </div>
      ))}
    </dl>
  )
}

export function Checklist({ title, items, numbered }) {
  if (!items?.length) return null
  return (
    <div className={`rt-checklist${numbered ? ' numbered' : ''}`}>
      {title && <h2>{title}</h2>}
      <ol>
        {items.map((t, i) => (
          <li key={t}>
            <span className="rt-checklist-mark" aria-hidden="true">
              {numbered ? String(i + 1).padStart(2, '0') : <Icon name="check" size={14} />}
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function Initials({ name }) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
  return (
    <span className="rt-avatar" aria-hidden="true">
      {letters || '?'}
    </span>
  )
}

export function Tags({ tags }) {
  if (!tags?.length) return null
  return (
    <div className="res-tags">
      {tags.map((t) => (
        <span className="res-chip" key={t}>
          {t}
        </span>
      ))}
    </div>
  )
}

export function ShareLinks({ title, vertical }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window === 'undefined' ? '' : window.location.href
  const enc = encodeURIComponent
  return (
    <div className={`rt-share${vertical ? ' vertical' : ''}`}>
      <span className="rt-share-label">Share</span>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
        in
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
        𝕏
      </a>
      <a href={`mailto:?subject=${enc(title)}&body=${enc(url)}`} aria-label="Share by email">
        <Icon name="mail" size={15} />
      </a>
      <button
        type="button"
        aria-label="Copy link"
        onClick={() =>
          navigator.clipboard?.writeText(url).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
          })
        }
      >
        {copied ? (
          <Icon name="check" size={15} />
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
            <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
          </svg>
        )}
      </button>
    </div>
  )
}

// PDF download: email-gated form or a direct link.
export function DownloadPanel({ item, title = 'Get the full PDF' }) {
  if (!item.hasFile) return null
  if (item.gated) return <GatedDownload item={item} title={title} />
  return (
    <div className="res-download">
      <h3>
        <Icon name="download" size={18} /> {title}
      </h3>
      <p className="form-notice">Free, no sign-up needed.</p>
      <a className="btn btn-primary btn-block" href={`/api/resources/file/${item.id}`}>
        <Icon name="download" size={16} /> Download PDF
      </a>
    </div>
  )
}

export function Media({ item, className = '' }) {
  const embed = item.videoUrl && toEmbedUrl(item.videoUrl)
  if (embed) {
    return (
      <div className={`res-video ${className}`}>
        <iframe
          src={embed}
          title={item.title}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    )
  }
  if (item.videoUrl) {
    return (
      <a href={item.videoUrl} className="btn btn-outline res-watch" target="_blank" rel="noopener noreferrer">
        <Icon name="play" size={16} /> Watch the recording
      </a>
    )
  }
  return item.coverUrl ? <img className={`res-cover ${className}`} src={item.coverUrl} alt="" /> : null
}

// Cover image, or generated cover art in the category's accent colour (t-<type> sets --accent).
export function Cover({ item, icon = 'fileText', label, showTitle = false, className = '' }) {
  return (
    <div className={`rt-cover t-${item.type} ${className}`}>
      {item.coverUrl ? (
        <img src={item.coverUrl} alt="" loading="lazy" />
      ) : (
        <div className="rt-cover-art" aria-hidden="true">
          <span className="rt-cover-icon">
            <Icon name={item.hasVideo ? 'play' : icon} size={22} />
          </span>
          {label && <span className="rt-cover-label">{label}</span>}
          {showTitle && <span className="rt-cover-title">{item.title}</span>}
        </div>
      )}
      {item.hasVideo && (
        <span className="rt-play" aria-hidden="true">
          <Icon name="play" size={18} />
        </span>
      )}
    </div>
  )
}

export function SectionTitle({ kicker, title, action }) {
  return (
    <div className="rt-section-title">
      <div>
        {kicker && <span className="rt-kicker">{kicker}</span>}
        <SplitHeading key={title} as="h2" text={title} />
      </div>
      {action}
    </div>
  )
}

export function EmptyState({ type }) {
  return (
    <div className="container resource-empty">
      <span className="tile-icon resource-empty-icon">
        <Icon name={type.icon} size={28} />
      </span>
      <h3>Nothing published here yet</h3>
      <p>
        We're not dressing up placeholder content as finished {type.label.toLowerCase()} — this section goes live as
        soon as there is something real to publish.
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
  )
}

// Chip filter over a list (industry, tag…). Returns [filtered, chips element].
export function useChipFilter(items, getValues, allLabel = 'All') {
  const [value, setValue] = useState('')
  const options = useMemo(() => [...new Set(items.flatMap((i) => getValues(i).filter(Boolean)))].sort(), [items]) // eslint-disable-line react-hooks/exhaustive-deps
  const filtered = value ? items.filter((i) => getValues(i).includes(value)) : items
  const chips =
    options.length > 1 ? (
      <div className="rt-chips" role="group" aria-label="Filter">
        <button type="button" aria-pressed={!value} onClick={() => setValue('')}>
          {allLabel}
        </button>
        {options.map((o) => (
          <button key={o} type="button" aria-pressed={value === o} onClick={() => setValue(value === o ? '' : o)}>
            {o}
          </button>
        ))}
      </div>
    ) : null
  return [filtered, chips]
}

// Placeholder shaped like a resource page, shown while its data loads, so the
// layout (and the footer below it) doesn't collapse and jump.
export function PageSkeleton({ variant = 'list' }) {
  return (
    <div className="rt rt-skeleton" aria-busy="true" aria-label="Loading">
      <div className="rt-loadbar" aria-hidden="true" />
      <header className="rt-hero rt-hero-soft">
        <div className="container rt-hero-inner left" aria-hidden="true">
          <span className="sk sk-line" style={{ width: 160 }} />
          <span className="sk sk-pill" />
          <span className="sk sk-title" style={{ width: variant === 'detail' ? '72%' : 260 }} />
          {variant === 'detail' && <span className="sk sk-title" style={{ width: '48%' }} />}
          <span className="sk sk-line" style={{ width: '46%' }} />
        </div>
      </header>
      <section className="section-tight" aria-hidden="true">
        {variant === 'detail' ? (
          <div className="container rt-two-col">
            <div className="rt-main">
              <span className="sk sk-media" />
              <span className="sk sk-line" />
              <span className="sk sk-line" style={{ width: '92%' }} />
              <span className="sk sk-line" style={{ width: '80%' }} />
            </div>
            <span className="sk sk-side" />
          </div>
        ) : (
          <div className="container res-grid">
            {[0, 1, 2].map((i) => (
              <div className="sk-card" key={i}>
                <span className="sk sk-media" />
                <span className="sk sk-line" style={{ width: '40%' }} />
                <span className="sk sk-line" />
                <span className="sk sk-line" style={{ width: '70%' }} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
