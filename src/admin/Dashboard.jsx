import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { useAuth } from './authContext.js'
import { formatDateTime } from './api.js'
import { ErrorBox, Loading, PageHead, StatusBadge, useApi } from './ui.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const { data, error, loading } = useApi('/stats')

  return (
    <>
      <PageHead title={`Hi, ${user.name.split(' ')[0]}`} desc="Everything on the public Resource Center is managed here.">
        <Link to="/admin/resources/new" className="adm-btn primary">
          + New resource
        </Link>
      </PageHead>
      <ErrorBox>{error}</ErrorBox>
      {loading && !data ? (
        <Loading />
      ) : (
        data && (
          <>
            <div className="adm-stats">
              {data.byType.map((t) => (
                <Link key={t.slug} to={t.slug === 'glossary' ? '/admin/glossary' : `/admin/resources?type=${t.slug}`} className="adm-card adm-stat">
                  <span className="adm-stat-ic">
                    <Icon name={t.icon} size={18} />
                  </span>
                  <strong>{t.published}</strong>
                  <span>
                    {t.label}
                    {t.slug === 'glossary' ? ' terms' : ' live'}
                  </span>
                  {t.drafts > 0 && <small>{t.drafts} draft{t.drafts > 1 ? 's' : ''}</small>}
                </Link>
              ))}
              <Link to="/admin/leads" className="adm-card adm-stat accent">
                <span className="adm-stat-ic">
                  <Icon name="download" size={18} />
                </span>
                <strong>{data.leads30}</strong>
                <span>Download leads (30 days)</span>
              </Link>
            </div>

            <section className="adm-card">
              <h2 className="adm-card-title">Recently edited</h2>
              {data.recent.length === 0 ? (
                <p className="adm-empty">
                  Nothing yet. <Link to="/admin/resources/new">Create your first resource</Link>.
                </p>
              ) : (
                <ul className="adm-recent">
                  {data.recent.map((r) => (
                    <li key={r.id}>
                      <Link to={`/admin/resources/${r.id}`}>{r.title}</Link>
                      <StatusBadge status={r.status} />
                      <span className="adm-muted">
                        {formatDateTime(r.updatedAt)}
                        {r.updatedBy ? ` · ${r.updatedBy}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )
      )}
    </>
  )
}
