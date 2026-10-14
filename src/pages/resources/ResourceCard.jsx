import { Link } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import { formatDate } from '../../lib/resourcesApi.js'

export default function ResourceCard({ item, categoryLabel, icon = 'fileText' }) {
  return (
    <Link to={`/resources/${item.type}/${item.slug}`} className="res-card">
      <div className="res-card-media">
        {item.coverUrl ? (
          <img src={item.coverUrl} alt="" loading="lazy" />
        ) : (
          <span className="res-card-placeholder" aria-hidden="true">
            <Icon name={item.hasVideo ? 'play' : icon} size={28} />
          </span>
        )}
        {item.hasVideo && item.coverUrl && (
          <span className="res-card-play" aria-hidden="true">
            <Icon name="play" size={18} />
          </span>
        )}
      </div>
      <div className="res-card-body">
        <div className="res-card-meta">
          {categoryLabel && <span className="res-chip">{categoryLabel}</span>}
          {item.publishedAt && <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>}
        </div>
        <h3>{item.title}</h3>
        {item.summary && <p>{item.summary}</p>}
        <span className="tile-link">
          {item.hasVideo ? 'Watch' : item.hasFile ? 'Get the report' : 'Read more'} <Icon name="arrowRight" size={14} />
        </span>
      </div>
    </Link>
  )
}
