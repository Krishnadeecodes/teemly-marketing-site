import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, formatDateTime } from './api.js'
import { ConfirmButton, ErrorBox, Loading, PageHead, StatusBadge, useApi, useToast } from './ui.jsx'

export default function ResourceList() {
  const [params, setParams] = useSearchParams()
  const type = params.get('type') || ''
  const status = params.get('status') || ''
  const [q, setQ] = useState(params.get('q') || '')
  const toast = useToast()
  const cats = useApi('/categories')
  const query = new URLSearchParams({ ...(type && { type }), ...(status && { status }), ...(params.get('q') && { q: params.get('q') }) })
  const { data, error, loading, reload } = useApi(`/resources?${query}`)

  // Debounce the search box into the URL.
  useEffect(() => {
    const t = setTimeout(() => setFilter('q', q.trim()), 300)
    return () => clearTimeout(t)
  }, [q]) // eslint-disable-line react-hooks/exhaustive-deps

  function setFilter(key, value) {
    setParams(
      (p) => {
        const next = new URLSearchParams(p)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true },
    )
  }

  const labelOf = (slug) => cats.data?.categories.find((c) => c.slug === slug)?.label || slug

  async function toggle(item) {
    const next = item.status === 'published' ? 'draft' : 'published'
    try {
      await api.patch(`/resources/${item.id}/status`, { status: next })
      toast(next === 'published' ? `“${item.title}” is live` : `“${item.title}” moved to drafts`)
      reload()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  async function remove(item) {
    try {
      await api.del(`/resources/${item.id}`)
      toast(`Deleted “${item.title}”`)
      reload()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  return (
    <>
      <PageHead title="Resources" desc="Research, reports, guides, case studies, blog posts, webinars and videos.">
        <Link to={`/admin/resources/new${type ? `?type=${type}` : ''}`} className="adm-btn primary">
          + New resource
        </Link>
      </PageHead>

      <div className="adm-filters">
        <input type="search" placeholder="Search title, summary or slug…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        <select value={type} onChange={(e) => setFilter('type', e.target.value)} aria-label="Category">
          <option value="">All categories</option>
          {cats.data?.categories
            .filter((c) => c.slug !== 'glossary')
            .map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
        </select>
        <select value={status} onChange={(e) => setFilter('status', e.target.value)} aria-label="Status">
          <option value="">Any status</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      <ErrorBox>{error}</ErrorBox>
      {loading && !data ? (
        <Loading />
      ) : data?.items.length === 0 ? (
        <div className="adm-card adm-empty">
          {type || status || params.get('q') ? 'No resources match these filters.' : 'No resources yet — create the first one.'}
        </div>
      ) : (
        data && (
          <div className="adm-card adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Title">
                      <Link to={`/admin/resources/${item.id}`} className="adm-title-link">
                        {item.title}
                      </Link>
                      <div className="adm-row-flags">
                        {item.featured && <span className="adm-flag">Featured</span>}
                        {item.hasFile && <span className="adm-flag">{item.gated ? 'Gated PDF' : 'PDF'}</span>}
                        {item.hasVideo && <span className="adm-flag">Video</span>}
                        {item.status === 'published' && item.publishedAt > new Date().toISOString().slice(0, 10) && (
                          <span className="adm-flag warn">Scheduled {item.publishedAt}</span>
                        )}
                      </div>
                    </td>
                    <td data-label="Category">{labelOf(item.type)}</td>
                    <td data-label="Status">
                      <StatusBadge status={item.status} />
                    </td>
                    <td data-label="Updated" className="adm-muted">
                      {formatDateTime(item.updatedAt)}
                      {item.updatedBy && <div>{item.updatedBy}</div>}
                    </td>
                    <td className="adm-row-actions">
                      <Link to={`/admin/resources/${item.id}`} className="adm-btn sm">
                        Edit
                      </Link>
                      <button type="button" className="adm-btn sm" onClick={() => toggle(item)}>
                        {item.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      {item.status === 'published' && (
                        <a href={`/resources/${item.type}/${item.slug}`} target="_blank" rel="noopener noreferrer" className="adm-btn sm ghost">
                          View
                        </a>
                      )}
                      <ConfirmButton className="adm-btn sm danger" confirmLabel="Confirm delete" onConfirm={() => remove(item)}>
                        Delete
                      </ConfirmButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </>
  )
}
