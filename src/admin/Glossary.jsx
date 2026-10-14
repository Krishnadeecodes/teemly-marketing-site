import { useState } from 'react'
import { api } from './api.js'
import { ConfirmButton, ErrorBox, Field, Loading, PageHead, useApi, useToast } from './ui.jsx'

function TermForm({ initial = { term: '', def: '' }, submitLabel, onSubmit, onCancel }) {
  const [v, setV] = useState(initial)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const idp = initial.id ? `t${initial.id}` : 'new'

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    try {
      await onSubmit(v)
      if (!initial.id) setV({ term: '', def: '' })
      setErrors({})
    } catch (err) {
      setErrors({ ...err.fields, _form: err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="adm-term-form" onSubmit={submit} noValidate>
      <Field label="Term" id={`${idp}-term`} error={errors.term}>
        <input id={`${idp}-term`} value={v.term} maxLength={160} onChange={(e) => setV({ ...v, term: e.target.value })} />
      </Field>
      <Field label="Definition" id={`${idp}-def`} error={errors.def}>
        <textarea id={`${idp}-def`} rows={3} value={v.def} maxLength={1000} onChange={(e) => setV({ ...v, def: e.target.value })} />
      </Field>
      {!errors.term && !errors.def && <ErrorBox>{errors._form}</ErrorBox>}
      <div className="adm-inline">
        <button className="adm-btn primary sm" disabled={busy}>
          {busy ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="adm-btn sm ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default function Glossary() {
  const { data, error, loading, setData } = useApi('/glossary')
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('')
  const toast = useToast()
  const terms = data?.terms || []

  async function run(promise, message) {
    const res = await promise
    setData(res)
    if (message) toast(message)
    return res
  }

  function move(index, delta) {
    const ids = terms.map((t) => t.id)
    const j = index + delta
    if (j < 0 || j >= ids.length) return
    ;[ids[index], ids[j]] = [ids[j], ids[index]]
    run(api.put('/glossary-order', { ids })).catch((err) => toast(err.message, 'error'))
  }

  const q = filter.trim().toLowerCase()
  const shown = terms.map((t, i) => ({ ...t, index: i })).filter((t) => !q || t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q))

  return (
    <>
      <PageHead title="Glossary" desc={`${terms.length} terms, shown on /resources/glossary in this order.`}>
        <a href="/resources/glossary" target="_blank" rel="noopener noreferrer" className="adm-btn ghost">
          View on site
        </a>
      </PageHead>

      <div className="adm-card">
        <h2 className="adm-card-title">Add a term</h2>
        <TermForm submitLabel="Add term" onSubmit={(v) => run(api.post('/glossary', v), `Added “${v.term}”`)} />
      </div>

      <ErrorBox>{error}</ErrorBox>
      {loading && !data ? (
        <Loading />
      ) : (
        <div className="adm-card">
          <div className="adm-filters">
            <input type="search" placeholder="Filter terms…" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter terms" />
          </div>
          <ol className="adm-terms">
            {shown.map((t) => (
              <li key={t.id}>
                {editing === t.id ? (
                  <TermForm
                    initial={t}
                    submitLabel="Save"
                    onCancel={() => setEditing(null)}
                    onSubmit={(v) => run(api.put(`/glossary/${t.id}`, v), 'Term updated').then(() => setEditing(null))}
                  />
                ) : (
                  <>
                    <div className="adm-term-text">
                      <strong>{t.term}</strong>
                      <p>{t.def}</p>
                    </div>
                    <div className="adm-row-actions">
                      {!q && (
                        <>
                          <button type="button" className="adm-btn sm ghost" aria-label={`Move ${t.term} up`} disabled={t.index === 0} onClick={() => move(t.index, -1)}>
                            ↑
                          </button>
                          <button
                            type="button"
                            className="adm-btn sm ghost"
                            aria-label={`Move ${t.term} down`}
                            disabled={t.index === terms.length - 1}
                            onClick={() => move(t.index, 1)}
                          >
                            ↓
                          </button>
                        </>
                      )}
                      <button type="button" className="adm-btn sm" onClick={() => setEditing(t.id)}>
                        Edit
                      </button>
                      <ConfirmButton
                        className="adm-btn sm danger"
                        confirmLabel="Confirm"
                        onConfirm={() => run(api.del(`/glossary/${t.id}`), `Deleted “${t.term}”`).catch((err) => toast(err.message, 'error'))}
                      >
                        Delete
                      </ConfirmButton>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ol>
          {shown.length === 0 && <p className="adm-empty">{q ? 'No terms match.' : 'No terms yet.'}</p>}
        </div>
      )}
    </>
  )
}
