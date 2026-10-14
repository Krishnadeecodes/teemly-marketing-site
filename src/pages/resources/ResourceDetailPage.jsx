import { useMemo } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import PageHero from '../../components/PageHero.jsx'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import ResourceCard from './ResourceCard.jsx'
import GatedDownload from './GatedDownload.jsx'
import { useResourceItem, formatDate } from '../../lib/resourcesApi.js'
import { renderMarkdown } from '../../lib/markdown.js'
import { toEmbedUrl } from '../../lib/video.js'
import { useSEO } from '../../lib/useSEO.js'
import '../pages.css'
import './resources.css'

export default function ResourceDetailPage() {
  const { slug, item: itemSlug } = useParams()
  const { data, loading } = useResourceItem(slug, itemSlug)
  const item = data?.item
  const html = useMemo(() => renderMarkdown(item?.body), [item?.body])

  useSEO({
    title: item ? `${item.title} — ${data.category.label}` : 'Resources',
    description: item?.summary,
    path: `/resources/${slug}/${itemSlug}`,
  })

  if (loading) return <div className="res-loading" aria-busy="true" />
  if (!item) return <Navigate to={`/resources/${slug}`} replace />

  const { category, related } = data
  const embed = item.videoUrl && toEmbedUrl(item.videoUrl)
  const meta = item.meta || {}
  const facts = [
    meta.customer && ['Customer', meta.customer],
    meta.industry && ['Industry', meta.industry],
    meta.eventDate && ['When', meta.eventDate],
    meta.duration && ['Length', meta.duration],
    item.author && ['Author', item.author],
    item.publishedAt && ['Published', formatDate(item.publishedAt)],
  ].filter(Boolean)

  return (
    <>
      <PageHero eyebrow={category.label} title={item.title} desc={item.summary} />

      <section className="section-tight">
        <div className="container res-article">
          <div className="res-article-main">
            <Link to={`/resources/${category.slug}`} className="res-back">
              <Icon name="arrowRight" size={14} /> All {category.label.toLowerCase()}
            </Link>

            {embed ? (
              <div className="res-video">
                <iframe
                  src={embed}
                  title={item.title}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
            ) : item.videoUrl ? (
              <a href={item.videoUrl} className="btn btn-outline res-watch" target="_blank" rel="noopener noreferrer">
                <Icon name="play" size={16} /> Watch the recording
              </a>
            ) : (
              item.coverUrl && <img className="res-cover" src={item.coverUrl} alt="" />
            )}

            {meta.results?.length > 0 && (
              <ul className="res-results">
                {meta.results.map((r) => (
                  <li key={r}>
                    <Icon name="check" size={16} /> {r}
                  </li>
                ))}
              </ul>
            )}

            {item.body && <div className="res-prose" dangerouslySetInnerHTML={{ __html: html }} />}
          </div>

          <aside className="res-article-side">
            {facts.length > 0 && (
              <dl className="res-facts">
                {facts.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {item.tags.length > 0 && (
              <div className="res-tags">
                {item.tags.map((t) => (
                  <span className="res-chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            {item.hasFile &&
              (item.gated ? (
                <GatedDownload item={item} />
              ) : (
                <a className="btn btn-primary btn-block" href={`/api/resources/file/${item.id}`}>
                  <Icon name="download" size={16} /> Download PDF
                </a>
              ))}
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-tight">
          <div className="container">
            <h2 className="res-section-title">More {category.label.toLowerCase()}</h2>
            <div className="res-grid">
              {related.map((r) => (
                <ResourceCard key={r.id} item={r} icon={category.icon} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCTA />
    </>
  )
}
