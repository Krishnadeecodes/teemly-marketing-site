import { useState } from 'react'
import { formatDateTime } from './api.js'
import { ErrorBox, Loading, PageHead, useApi } from './ui.jsx'

export default function TourSignups() {
  const { data, error, loading } = useApi('/tour-signups')
  const [q, setQ] = useState('')
  const all = data?.signups || []
  const needle = q.trim().toLowerCase()
  const signups = needle ? all.filter((s) => [s.name, s.email, s.company, s.role, s.country].some((v) => v.toLowerCase().includes(needle))) : all

  return (
    <>
      <PageHead title="Tour sign-ups" desc="People who signed in to unlock the product tour. Each new one is also emailed to the team.">
        <a className="adm-btn" href="/api/admin/tour-signups.csv" download>
          Export CSV
        </a>
      </PageHead>
      <ErrorBox>{error}</ErrorBox>
      {loading && !data ? (
        <Loading />
      ) : all.length === 0 ? (
        <div className="adm-card adm-empty">No tour sign-ups yet.</div>
      ) : (
        <>
          <div className="adm-filters">
            <input type="search" placeholder="Search name, email, company…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
          </div>
          <div className="adm-card adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Signed up</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Size</th>
                  <th>Visits</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {signups.map((s) => (
                  <tr key={s.id}>
                    <td data-label="Signed up" className="adm-muted">
                      {formatDateTime(s.created_at)}
                    </td>
                    <td data-label="Name">{s.name}</td>
                    <td data-label="Email">
                      <a href={`mailto:${s.email}`}>{s.email}</a>
                    </td>
                    <td data-label="Company">
                      {s.company}
                      {s.country && <span className="adm-muted"> · {s.country}</span>}
                    </td>
                    <td data-label="Role">{s.role}</td>
                    <td data-label="Size">{s.company_size}</td>
                    <td data-label="Visits" title={`Last visit ${formatDateTime(s.last_seen_at)}`}>
                      {s.visits}
                    </td>
                    <td data-label="Source" className="adm-muted">
                      {[s.attribution.utm_source, s.attribution.utm_campaign].filter(Boolean).join(' / ') || s.attribution.referrer || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {signups.length === 0 && <p className="adm-hint">No sign-ups match “{q}”.</p>}
            {all.length === 500 && <p className="adm-hint">Showing the latest 500 — export CSV for the full list.</p>}
          </div>
        </>
      )}
    </>
  )
}
