import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../../components/Icon.jsx'
import ResourceCard from '../ResourceCard.jsx'
import { formatDate } from '../../../lib/resourcesApi.js'
import { isUpcoming, splitPair } from '../../../lib/resourceTemplates.js'
import { toEmbedUrl } from '../../../lib/video.js'
import {
  ArticleBody,
  Breadcrumbs,
  HeroTitle,
  Checklist,
  Cover,
  DownloadPanel,
  Initials,
  Media,
  MetaLine,
  ReadingProgress,
  SectionTitle,
  ShareLinks,
  StatBand,
  Tags,
  itemUrl,
  useActiveHeading,
} from './shared.jsx'

function Related({ title, related, category }) {
  if (!related?.length) return null
  return (
    <section className="section-tight rt-related">
      <div className="container">
        <SectionTitle
          title={title}
          action={
            <Link to={`/resources/${category.slug}`} className="rt-link">
              View all <Icon name="arrowRight" size={14} />
            </Link>
          }
        />
        <div className="res-grid">
          {related.map((r) => (
            <ResourceCard key={r.id} item={r} icon={category.icon} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ================= Research: data-report =================
export function ResearchDetail({ item, category, related }) {
  const meta = item.meta || {}
  return (
    <div className="rt t-research">
      <header className="rt-hero rt-hero-soft">
        <div className="container rt-hero-inner">
          <Breadcrumbs category={category} />
          <span className="rt-kicker">{category.label}</span>
          <HeroTitle text={item.title} />
          {item.summary && <p className="rt-dek">{item.summary}</p>}
          <MetaLine item={item} extra={[item.author && <span key="a">By {item.author}</span>]} />
          {item.hasFile && (
            <a href="#download" className="btn btn-primary">
              <Icon name="download" size={16} /> Download the full study
            </a>
          )}
          <StatBand stats={meta.stats} variant="hero" />
        </div>
      </header>

      <section className="section-tight">
        <div className="container rt-two-col">
          <div className="rt-main">
            <Checklist title="Key findings" items={meta.takeaways} numbered />
            <Media item={item} />
            <ArticleBody body={item.body} />
            <Tags tags={item.tags} />
          </div>
          <aside className="rt-side" id="download">
            <DownloadPanel item={item} title="Download the full study" />
            <div className="rt-side-card">
              <span className="rt-kicker">About this research</span>
              <dl className="rt-facts">
                {item.publishedAt && (
                  <div>
                    <dt>Published</dt>
                    <dd>{formatDate(item.publishedAt)}</dd>
                  </div>
                )}
                {item.author && (
                  <div>
                    <dt>Author</dt>
                    <dd>{item.author}</dd>
                  </div>
                )}
                <div>
                  <dt>Format</dt>
                  <dd>{item.hasFile ? 'PDF study + online summary' : 'Online study'}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
      <Related title="More research" related={related} category={category} />
    </div>
  )
}

// ================= Report: gated-asset landing page =================
export function ReportDetail({ item, category, related }) {
  const meta = item.meta || {}
  return (
    <div className="rt t-reports">
      <header className="rt-hero rt-hero-lp">
        <div className="container rt-lp">
          <div className="rt-lp-copy">
            <Breadcrumbs category={category} />
            <span className="rt-kicker">{category.label}</span>
            <HeroTitle text={item.title} />
            {item.summary && <p className="rt-dek">{item.summary}</p>}
            <Checklist title="What’s inside" items={meta.takeaways} />
          </div>
          <div className="rt-lp-side">
            <div className="rt-book" aria-hidden="true">
              <Cover item={item} icon={category.icon} label={category.label} showTitle />
            </div>
            {item.hasFile ? (
              <DownloadPanel item={item} title="Get your free copy" />
            ) : (
              <div className="res-download">
                <h3>Read it online</h3>
                <p className="form-notice">The full report is below — no download needed.</p>
                <a href="#report" className="btn btn-primary btn-block">
                  Start reading <Icon name="arrowRight" size={16} />
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {meta.stats?.length > 0 && (
        <section className="rt-band">
          <div className="container">
            <StatBand stats={meta.stats} />
          </div>
        </section>
      )}

      {(item.body || item.videoUrl) && (
        <section className="section-tight" id="report">
          <div className="container rt-narrow">
            <SectionTitle kicker="Preview" title="Inside the report" />
            <Media item={{ ...item, coverUrl: '' }} />
            <ArticleBody body={item.body} />
            <Tags tags={item.tags} />
          </div>
        </section>
      )}
      <Related title="More reports" related={related} category={category} />
    </div>
  )
}

// ================= Guide: chaptered long-form with TOC =================
export function GuideDetail({ item, category, related }) {
  const meta = item.meta || {}
  const [headings, setHeadings] = useState([])
  const active = useActiveHeading(headings)
  const chapters = headings.filter((h) => h.level === 2).length
  return (
    <div className="rt t-guides">
      <ReadingProgress />
      <header className="rt-hero rt-hero-soft">
        <div className="container rt-hero-inner left">
          <Breadcrumbs category={category} />
          <span className="rt-kicker">{category.label}</span>
          <HeroTitle text={item.title} />
          {item.summary && <p className="rt-dek">{item.summary}</p>}
          <MetaLine item={item} extra={[chapters > 1 && <span key="c">{chapters} chapters</span>, item.author && <span key="a">By {item.author}</span>]} />
        </div>
      </header>

      <section className="section-tight">
        <div className="container rt-guide">
          <aside className="rt-toc">
            {headings.length > 0 && (
              <nav aria-label="On this page">
                <span className="rt-kicker">On this page</span>
                <ol>
                  {headings.map((h) => (
                    <li key={h.id} className={`lvl-${h.level}${active === h.id ? ' active' : ''}`}>
                      <a href={`#${h.id}`}>{h.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <DownloadPanel item={item} title="Take the guide with you" />
          </aside>
          <div className="rt-main">
            {meta.takeaways?.length > 0 && (
              <div className="rt-callout">
                <Checklist title="What you’ll learn" items={meta.takeaways} />
              </div>
            )}
            <Media item={item} />
            <ArticleBody body={item.body} onHeadings={setHeadings} />
            <Tags tags={item.tags} />
            <ShareLinks title={item.title} />
          </div>
        </div>
      </section>
      <Related title="More guides" related={related} category={category} />
    </div>
  )
}

// ================= Case study: customer story =================
export function CaseStudyDetail({ item, category, related }) {
  const meta = item.meta || {}
  const facts = [
    meta.customer && ['Customer', meta.customer],
    meta.industry && ['Industry', meta.industry],
    meta.companySize && ['Company size', meta.companySize],
    item.publishedAt && ['Published', formatDate(item.publishedAt)],
  ].filter(Boolean)
  return (
    <div className="rt t-case-studies">
      <header className="rt-hero rt-hero-case">
        <div className="container rt-case-hero">
          <div>
            <Breadcrumbs category={category} />
            {meta.customer && <span className="rt-wordmark">{meta.customer}</span>}
            <HeroTitle text={item.title} />
            {item.summary && <p className="rt-dek">{item.summary}</p>}
          </div>
          <Cover item={item} icon={category.icon} label={meta.industry || category.label} className="rt-case-cover" />
        </div>
      </header>

      {meta.stats?.length > 0 && (
        <section className="rt-band rt-band-brand">
          <div className="container">
            <StatBand stats={meta.stats} variant="brand" />
          </div>
        </section>
      )}

      <section className="section-tight">
        <div className="container rt-two-col">
          <div className="rt-main">
            {meta.results?.length > 0 && (
              <div className="rt-callout">
                <Checklist title="Results at a glance" items={meta.results} />
              </div>
            )}
            {item.videoUrl && <Media item={item} />}
            <ArticleBody body={item.body} />
            {meta.quote && (
              <figure className="rt-quote">
                <blockquote>“{meta.quote}”</blockquote>
                {meta.quoteBy && (
                  <figcaption>
                    <Initials name={meta.quoteBy} />
                    {meta.quoteBy}
                  </figcaption>
                )}
              </figure>
            )}
            <Tags tags={item.tags} />
          </div>
          <aside className="rt-side">
            {facts.length > 0 && (
              <div className="rt-side-card">
                <span className="rt-kicker">At a glance</span>
                <dl className="rt-facts">
                  {facts.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            <DownloadPanel item={item} title="Download this story" />
            <div className="rt-side-card rt-side-cta">
              <h3>See what Teemly would show you</h3>
              <p>Get a walkthrough built around your own teams and tools.</p>
              <Link to="/book-a-demo" className="btn btn-primary btn-block">
                Book a demo
              </Link>
            </div>
          </aside>
        </div>
      </section>
      <Related title="More customer stories" related={related} category={category} />
    </div>
  )
}

// ================= Blog: editorial article =================
export function BlogDetail({ item, category, related }) {
  return (
    <div className="rt t-blog">
      <ReadingProgress />
      <header className="rt-hero rt-hero-editorial">
        <div className="container rt-editorial-head">
          <Breadcrumbs category={category} />
          <HeroTitle text={item.title} />
          {item.summary && <p className="rt-dek">{item.summary}</p>}
          <div className="rt-byline">
            {item.author && <Initials name={item.author} />}
            <div>
              {item.author && <strong>{item.author}</strong>}
              <MetaLine item={item} />
            </div>
          </div>
        </div>
      </header>
      {(item.coverUrl || item.videoUrl) && (
        <div className="container rt-editorial-media">
          <Media item={item} />
        </div>
      )}
      <section className="section-tight rt-editorial-body">
        <div className="container rt-editorial">
          <aside className="rt-editorial-rail">
            <ShareLinks title={item.title} vertical />
          </aside>
          <div className="rt-main">
            <ArticleBody body={item.body} className="rt-prose-lg" />
            <DownloadPanel item={item} />
            <div className="rt-editorial-foot">
              <Tags tags={item.tags} />
              <ShareLinks title={item.title} />
            </div>
          </div>
        </div>
      </section>
      <Related title="Keep reading" related={related} category={category} />
    </div>
  )
}

// ================= Webinar: event page =================
function DateBadge({ iso, large }) {
  if (!iso) return null
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return null
  return (
    <span className={`rt-date${large ? ' large' : ''}`} aria-label={formatDate(iso)}>
      <span>{d.toLocaleDateString('en-GB', { month: 'short' })}</span>
      <strong>{d.getDate()}</strong>
    </span>
  )
}
export { DateBadge }

export function WebinarDetail({ item, category, related }) {
  const meta = item.meta || {}
  const upcoming = isUpcoming(meta)
  const speakers = (meta.speakers || []).map(splitPair)
  return (
    <div className="rt t-webinars">
      <header className="rt-hero rt-hero-soft rt-hero-event">
        <div className="container rt-event">
          <DateBadge iso={meta.eventOn} large />
          <div className="rt-event-copy">
            <Breadcrumbs category={category} />
            <span className={`rt-pill ${upcoming ? 'live' : ''}`}>{upcoming ? 'Upcoming webinar' : 'On-demand webinar'}</span>
            <HeroTitle text={item.title} />
            {item.summary && <p className="rt-dek">{item.summary}</p>}
            <div className="rt-event-meta">
              {meta.eventOn && (
                <span>
                  <Icon name="clock" size={15} /> {formatDate(meta.eventOn)}
                  {meta.eventDate ? ` · ${meta.eventDate}` : ''}
                </span>
              )}
              {meta.duration && <span>{meta.duration}</span>}
              {speakers.length > 0 && <span>{speakers.length === 1 ? '1 speaker' : `${speakers.length} speakers`}</span>}
            </div>
            <div className="rt-hero-ctas">
              {upcoming && meta.registerUrl && (
                <a href={meta.registerUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                  Save my seat <Icon name="arrowRight" size={16} />
                </a>
              )}
              {!upcoming && item.videoUrl && (
                <a href="#watch" className="btn btn-primary">
                  <Icon name="play" size={16} /> Watch now
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="section-tight">
        <div className="container rt-two-col">
          <div className="rt-main" id="watch">
            {upcoming ? item.coverUrl && <img className="res-cover" src={item.coverUrl} alt="" /> : <Media item={item} />}
            <Checklist title="What you’ll learn" items={meta.takeaways} />
            <ArticleBody body={item.body} />
            <Tags tags={item.tags} />
          </div>
          <aside className="rt-side">
            {speakers.length > 0 && (
              <div className="rt-side-card">
                <span className="rt-kicker">Speakers</span>
                <ul className="rt-speakers">
                  {speakers.map((s) => (
                    <li key={s.value}>
                      <Initials name={s.value} />
                      <div>
                        <strong>{s.value}</strong>
                        {s.label && <span>{s.label}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {upcoming && meta.registerUrl && (
              <div className="rt-side-card rt-side-cta">
                <h3>Join us live</h3>
                <p>Can’t make it? Register anyway and we’ll send you the recording.</p>
                <a href={meta.registerUrl} className="btn btn-primary btn-block" target="_blank" rel="noopener noreferrer">
                  Register free
                </a>
              </div>
            )}
            <DownloadPanel item={item} title="Download the slides" />
          </aside>
        </div>
      </section>
      <Related title="More webinars" related={related} category={category} />
    </div>
  )
}

// ================= Video: theatre =================
export function VideoDetail({ item, category, related }) {
  const meta = item.meta || {}
  const embed = item.videoUrl && toEmbedUrl(item.videoUrl)
  return (
    <div className="rt t-videos">
      <section className="rt-theatre">
        <div className="container">
          <Breadcrumbs category={category} />
          <div className="rt-theatre-grid">
            <div>
              {embed ? (
                <Media item={item} className="rt-player" />
              ) : (
                <a href={item.videoUrl || '#'} className="rt-player-fallback" target="_blank" rel="noopener noreferrer">
                  <Cover item={{ ...item, hasVideo: true }} icon="play" />
                </a>
              )}
              <HeroTitle text={item.title} />
              <MetaLine item={item} readTime={false} extra={[meta.duration && <span key="d">{meta.duration}</span>]} />
              {item.summary && <p className="rt-dek">{item.summary}</p>}
            </div>
            {related.length > 0 && (
              <aside className="rt-upnext" aria-label="Up next">
                <span className="rt-kicker">Up next</span>
                <ul>
                  {related.map((r) => (
                    <li key={r.id}>
                      <Link to={itemUrl(r)}>
                        <Cover item={{ ...r, hasVideo: true }} icon="play" />
                        <span>
                          <strong>{r.title}</strong>
                          {r.meta?.duration && <small>{r.meta.duration}</small>}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to={`/resources/${category.slug}`} className="rt-link">
                  All videos <Icon name="arrowRight" size={14} />
                </Link>
              </aside>
            )}
          </div>
        </div>
      </section>
      {(item.body || item.tags.length > 0) && (
        <section className="section-tight">
          <div className="container rt-narrow">
            <ArticleBody body={item.body} />
            <Tags tags={item.tags} />
          </div>
        </section>
      )}
    </div>
  )
}

// ================= Default: categories created in the admin =================
export function DefaultDetail({ item, category, related }) {
  const meta = item.meta || {}
  const facts = [
    item.author && ['Author', item.author],
    item.publishedAt && ['Published', formatDate(item.publishedAt)],
    item.readMins && ['Reading time', `${item.readMins} min`],
  ].filter(Boolean)
  return (
    <div className="rt">
      <header className="rt-hero rt-hero-soft">
        <div className="container rt-hero-inner left">
          <Breadcrumbs category={category} />
          <span className="rt-kicker">{category.label}</span>
          <HeroTitle text={item.title} />
          {item.summary && <p className="rt-dek">{item.summary}</p>}
        </div>
      </header>
      <section className="section-tight">
        <div className="container rt-two-col">
          <div className="rt-main">
            <Media item={item} />
            <Checklist items={meta.results} />
            <ArticleBody body={item.body} />
          </div>
          <aside className="rt-side">
            {facts.length > 0 && (
              <div className="rt-side-card">
                <dl className="rt-facts">
                  {facts.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            <Tags tags={item.tags} />
            <DownloadPanel item={item} />
          </aside>
        </div>
      </section>
      <Related title={`More ${category.label.toLowerCase()}`} related={related} category={category} />
    </div>
  )
}

export const DETAIL_TEMPLATES = {
  research: ResearchDetail,
  reports: ReportDetail,
  guides: GuideDetail,
  'case-studies': CaseStudyDetail,
  blog: BlogDetail,
  webinars: WebinarDetail,
  videos: VideoDetail,
}
