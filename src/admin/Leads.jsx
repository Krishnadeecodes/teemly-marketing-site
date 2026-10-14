import { formatDateTime } from './api.js'
import { ErrorBox, Loading, PageHead, useApi } from './ui.jsx'

export default function Leads() {
  const { data, error, loading } = useApi('/downloads')
  const leads = data?.leads || []

  return (
    <>
      <PageHead title="Download leads" desc="People who filled in the form to download a gated PDF. Each one is also emailed to the team.">
        <a className="adm-btn" href="/api/admin/downloads.csv" download>
          Export CSV
        </a>
      </PageHead>
      <ErrorBox>{error}</ErrorBox>
      {loading && !data ? (
        <Loading />
      ) : leads.length === 0 ? (
        <div className="adm-card adm-empty">No downloads yet. Attach a PDF to a report and tick “Require name, email &amp; company”.</div>
      ) : (
        <div className="adm-card adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Resource</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td data-label="Date" className="adm-muted">
                    {formatDateTime(l.created_at)}
                  </td>
                  <td data-label="Name">{l.name}</td>
                  <td data-label="Email">
                    <a href={`mailto:${l.email}`}>{l.email}</a>
                  </td>
                  <td data-label="Company">{l.company}</td>
                  <td data-label="Resource">{l.resource_title}</td>
                  <td data-label="Source" className="adm-muted">
                    {[l.attribution.utm_source, l.attribution.utm_campaign].filter(Boolean).join(' / ') || l.attribution.referrer || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 500 && <p className="adm-hint">Showing the latest 500 — export CSV for the full list.</p>}
        </div>
      )}
    </>
  )
}
