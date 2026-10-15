import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { api, slugify, formatBytes, formatDateTime } from './api.js'
import { ErrorBox, Field, Loading, PageHead, StatusBadge, ConfirmButton, useApi, useToast } from './ui.jsx'
import { toEmbedUrl } from '../lib/video.js'
import { templateFor } from '../lib/resourceTemplates.js'
import RichTextEditor from './RichTextEditor.jsx'

// Which optional field groups each page template shows.
const PDF_TYPES = ['research', 'reports', 'guides']
const GATED_BY_DEFAULT = ['research', 'reports']
const VIDEO_TYPES = ['webinars', 'videos']

const EMPTY = {
  type: '',
  title: '',
  slug: '',
  summary: '',
  body: '',
  coverUrl: '',
  author: '',
  publishedAt: '',
  status: 'draft',
  featured: false,
  tags: [],
  videoUrl: '',
  fileId: null,
  file: null,
  gated: false,
  meta: {},
}

function UploadButton({ accept, label, onUploaded, disabled }) {
  const input = useRef()
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  return (
    <>
      <button type="button" className="adm-btn sm" disabled={busy || disabled} onClick={() => input.current.click()}>
        {busy ? 'Uploading…' : label}
      </button>
      <input
        ref={input}
        type="file"
        accept={accept}
        hidden
        onChange={async (e) => {
          const file = e.target.files[0]
          e.target.value = ''
          if (!file) return
          setBusy(true)
          try {
            onUploaded(await api.upload(file))
          } catch (err) {
            toast(err.message, 'error')
          } finally {
            setBusy(false)
          }
        }}
      />
    </>
  )
}

// One-per-line list field (stored as an array of strings).
function LinesField({ label, id, hint, value, onChange, rows = 4, placeholder }) {
  return (
    <Field label={label} id={id} hint={hint} full>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        value={(value || []).join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n'))}
      />
    </Field>
  )
}

export default function ResourceEditor() {
  const { id } = useParams()
  const isNew = !id
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const cats = useApi('/categories')
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(null) // last saved snapshot (for dirty check)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [slugTouched, setSlugTouched] = useState(!isNew)
  // A category's page template (built-in categories default to their own slug).
  const templateKey = (slug) => cats.data?.categories.find((c) => c.slug === slug)?.template || slug

  useEffect(() => {
    if (isNew) {
      const type = params.get('type') || ''
      const f = { ...EMPTY, type, gated: GATED_BY_DEFAULT.includes(templateKey(type)) }
      setForm(f)
      setSaved(f)
      return
    }
    api
      .get(`/resources/${id}`)
      .then(({ item }) => {
        const f = { ...EMPTY, ...item, publishedAt: item.publishedAt || '' }
        setForm(f)
        setSaved(f)
      })
      .catch((err) => setFormError(err.message))
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const dirty = form && saved && JSON.stringify(form) !== JSON.stringify(saved)

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return undefined
    const handler = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const setMeta = (patch) => setForm((f) => ({ ...f, meta: { ...f.meta, ...patch } }))

  async function save(status = form.status) {
    if (saving) return
    setSaving(true)
    setFormError('')
    setErrors({})
    try {
      const body = { ...form, status }
      const { item } = isNew ? await api.post('/resources', body) : await api.put(`/resources/${id}`, body)
      const f = { ...EMPTY, ...item, publishedAt: item.publishedAt || '' }
      setForm(f)
      setSaved(f)
      toast(status === 'published' ? (form.status === 'published' ? 'Changes are live' : 'Published') : 'Draft saved')
      if (isNew) navigate(`/admin/resources/${item.id}`, { replace: true })
    } catch (err) {
      setFormError(err.message)
      setErrors(err.fields || {})
    } finally {
      setSaving(false)
    }
  }

  // Ctrl/Cmd + S saves without changing status.
  const saveRef = useRef(save)
  saveRef.current = save
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        saveRef.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function remove() {
    try {
      await api.del(`/resources/${id}`)
      setSaved(form)
      toast('Resource deleted')
      navigate('/admin/resources')
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  if (!form) return formError ? <ErrorBox>{formError}</ErrorBox> : <Loading />

  const categories = cats.data?.categories.filter((c) => c.slug !== 'glossary') || []
  const showPdf = PDF_TYPES.includes(templateKey(form.type)) || form.fileId
  const showVideo = VIDEO_TYPES.includes(templateKey(form.type)) || form.videoUrl
  const template = templateFor(templateKey(form.type))
  const extras = form.type ? template.extras : []
  const live = !isNew && saved.status === 'published'
  const embed = form.videoUrl && toEmbedUrl(form.videoUrl)

  return (
    <form
      className="adm-editor"
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
      noValidate
    >
      <PageHead title={isNew ? 'New resource' : form.title || 'Untitled'} desc={!isNew && `Last saved ${formatDateTime(saved.updatedAt)}${saved.updatedBy ? ` by ${saved.updatedBy}` : ''}`}>
        <Link to="/admin/resources" className="adm-btn ghost">
          ← All resources
        </Link>
        {live && (
          <a href={`/resources/${saved.type}/${saved.slug}`} target="_blank" rel="noopener noreferrer" className="adm-btn">
            View on site
          </a>
        )}
      </PageHead>

      <div className="adm-editor-grid">
        <div className="adm-editor-main">
          <div className="adm-card">
            <div className="adm-grid-2">
              <Field label="Category" id="type" error={errors.type}>
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) => {
                    const type = e.target.value
                    set({ type, ...(isNew && !form.fileId ? { gated: GATED_BY_DEFAULT.includes(templateKey(type)) } : {}) })
                  }}
                >
                  <option value="">Choose…</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                      {c.visible ? '' : ' (hidden)'}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Author" id="author" hint="Optional — shown on the article page.">
                <input id="author" value={form.author} onChange={(e) => set({ author: e.target.value })} maxLength={100} />
              </Field>
              <Field label="Title" id="title" error={errors.title} full>
                <input
                  id="title"
                  value={form.title}
                  maxLength={200}
                  onChange={(e) => set({ title: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) })}
                />
              </Field>
              <Field
                label="URL slug"
                id="slug"
                error={errors.slug}
                hint={`teemly.app/resources/${form.type || '…'}/${form.slug || '…'}${live ? ' — changing it breaks existing links' : ''}`}
                full
              >
                <input
                  id="slug"
                  value={form.slug}
                  maxLength={120}
                  onChange={(e) => {
                    setSlugTouched(true)
                    set({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })
                  }}
                />
              </Field>
              <Field label="Summary" id="summary" hint={`${form.summary.length}/400 — used on cards, the page intro and search results.`} full>
                <textarea id="summary" rows={3} maxLength={400} value={form.summary} onChange={(e) => set({ summary: e.target.value })} />
              </Field>
            </div>
          </div>

          {extras.length > 0 && (
            <div className="adm-card">
              <h2 className="adm-card-title">{template.name} details</h2>
              <div className="adm-grid-2">
                {extras.includes('customer') && (
                  <>
                    <Field label="Customer" id="customer">
                      <input id="customer" value={form.meta.customer || ''} maxLength={120} onChange={(e) => setMeta({ customer: e.target.value })} />
                    </Field>
                    <Field label="Industry" id="industry">
                      <input id="industry" value={form.meta.industry || ''} maxLength={80} onChange={(e) => setMeta({ industry: e.target.value })} />
                    </Field>
                    <Field label="Company size" id="companySize" hint="e.g. 1,200 employees">
                      <input id="companySize" value={form.meta.companySize || ''} maxLength={60} onChange={(e) => setMeta({ companySize: e.target.value })} />
                    </Field>
                  </>
                )}
                {extras.includes('event') && (
                  <>
                    <Field label="Event date" id="eventOn" error={errors.eventOn} hint="Before this date the page shows “Register”; after it, the recording.">
                      <input id="eventOn" type="date" value={form.meta.eventOn || ''} onChange={(e) => setMeta({ eventOn: e.target.value })} />
                    </Field>
                    <Field label="Time" id="eventDate" hint="e.g. 4pm GMT — or “On demand”">
                      <input id="eventDate" value={form.meta.eventDate || ''} maxLength={40} onChange={(e) => setMeta({ eventDate: e.target.value })} />
                    </Field>
                    <Field label="Registration link" id="registerUrl" error={errors.registerUrl} hint="Zoom, Teams, HubSpot… (https://)">
                      <input id="registerUrl" value={form.meta.registerUrl || ''} maxLength={500} onChange={(e) => setMeta({ registerUrl: e.target.value })} />
                    </Field>
                  </>
                )}
                {(extras.includes('event') || extras.includes('duration')) && (
                  <Field label="Length" id="duration" hint="e.g. 45 min">
                    <input id="duration" value={form.meta.duration || ''} maxLength={40} onChange={(e) => setMeta({ duration: e.target.value })} />
                  </Field>
                )}
                {extras.includes('stats') && (
                  <LinesField
                    label="Headline stats"
                    id="stats"
                    rows={4}
                    hint="Up to 4, one per line as value | label — shown as big numbers."
                    placeholder={'73% | of managers can’t see where time goes\n2.4× | faster reporting'}
                    value={form.meta.stats}
                    onChange={(stats) => setMeta({ stats })}
                  />
                )}
                {extras.includes('results') && (
                  <LinesField
                    label="Key results"
                    id="results"
                    hint="Up to 6, one per line — shown as a highlighted checklist."
                    value={form.meta.results}
                    onChange={(results) => setMeta({ results })}
                  />
                )}
                {extras.includes('quote') && (
                  <>
                    <Field label="Customer quote" id="quote" full>
                      <textarea id="quote" rows={3} maxLength={600} value={form.meta.quote || ''} onChange={(e) => setMeta({ quote: e.target.value })} />
                    </Field>
                    <Field label="Quote by" id="quoteBy" hint="Name, role" full>
                      <input id="quoteBy" value={form.meta.quoteBy || ''} maxLength={120} onChange={(e) => setMeta({ quoteBy: e.target.value })} />
                    </Field>
                  </>
                )}
                {extras.includes('speakers') && (
                  <LinesField
                    label="Speakers"
                    id="speakers"
                    rows={3}
                    hint="Up to 6, one per line as Name | Role, Company"
                    placeholder="Priya Shah | Head of People Analytics, Acme"
                    value={form.meta.speakers}
                    onChange={(speakers) => setMeta({ speakers })}
                  />
                )}
                {extras.includes('takeaways') && (
                  <LinesField
                    label={template.takeawaysLabel}
                    id="takeaways"
                    hint="Up to 8, one per line."
                    value={form.meta.takeaways}
                    onChange={(takeaways) => setMeta({ takeaways })}
                  />
                )}
              </div>
            </div>
          )}

          <div className="adm-card">
            <h2 className="adm-card-title">Body</h2>
            <RichTextEditor key={form.id || 'new'} value={form.body} onChange={(body) => set({ body })} />
          </div>
        </div>

        <aside className="adm-editor-side">
          <div className="adm-card">
            <div className="adm-status-row">
              <span>Status</span>
              <StatusBadge status={form.status} />
            </div>
            <Field label="Publish date" id="publishedAt" error={errors.publishedAt} hint="A future date schedules it — it stays hidden until then.">
              <input id="publishedAt" type="date" value={form.publishedAt} onChange={(e) => set({ publishedAt: e.target.value })} />
            </Field>
            <label className="adm-check">
              <input type="checkbox" checked={form.featured} onChange={(e) => set({ featured: e.target.checked })} />
              Feature on the Resource Center
            </label>
            <ErrorBox>{formError}</ErrorBox>
            <div className="adm-save">
              {form.status === 'published' ? (
                <>
                  <button type="button" className="adm-btn primary block" disabled={saving} onClick={() => save('published')}>
                    {saving ? 'Saving…' : 'Update live version'}
                  </button>
                  <button type="button" className="adm-btn block" disabled={saving} onClick={() => save('draft')}>
                    Unpublish (move to drafts)
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="adm-btn primary block" disabled={saving} onClick={() => save('published')}>
                    {saving ? 'Saving…' : 'Publish'}
                  </button>
                  <button type="button" className="adm-btn block" disabled={saving} onClick={() => save('draft')}>
                    Save draft
                  </button>
                </>
              )}
              <p className="adm-hint">{dirty ? 'Unsaved changes · Ctrl+S to save' : 'All changes saved'}</p>
            </div>
          </div>

          {form.type && (
            <div className="adm-card adm-template">
              <span className="adm-template-kicker">Page template</span>
              <strong>{template.name}</strong>
              <p className="adm-hint">{template.layout}</p>
            </div>
          )}

          <div className="adm-card">
            <h2 className="adm-card-title">Cover image</h2>
            {form.coverUrl && <img className="adm-cover" src={form.coverUrl} alt="" />}
            <Field id="coverUrl" error={errors.coverUrl} hint="16:9 works best. PNG, JPEG, WebP or GIF up to 5 MB.">
              <input id="coverUrl" placeholder="Upload, or paste an https:// image link" value={form.coverUrl} onChange={(e) => set({ coverUrl: e.target.value })} />
            </Field>
            <div className="adm-inline">
              <UploadButton accept="image/png,image/jpeg,image/webp,image/gif" label="Upload image" onUploaded={(u) => set({ coverUrl: u.url })} />
              {form.coverUrl && (
                <button type="button" className="adm-btn sm ghost" onClick={() => set({ coverUrl: '' })}>
                  Remove
                </button>
              )}
            </div>
          </div>

          {showVideo && (
            <div className="adm-card">
              <h2 className="adm-card-title">Video</h2>
              <Field id="videoUrl" error={errors.videoUrl} hint={form.videoUrl && !embed ? 'Not a YouTube/Vimeo/Loom link — shown as a “Watch” button.' : 'YouTube, Vimeo or Loom links embed automatically.'}>
                <input id="videoUrl" placeholder="https://www.youtube.com/watch?v=…" value={form.videoUrl} onChange={(e) => set({ videoUrl: e.target.value })} />
              </Field>
              {embed && (
                <div className="res-video">
                  <iframe src={embed} title="Video preview" loading="lazy" allowFullScreen />
                </div>
              )}
            </div>
          )}

          {showPdf && (
            <div className="adm-card">
              <h2 className="adm-card-title">PDF download</h2>
              {form.file ? (
                <div className="adm-file">
                  <a href={`/api/admin/uploads/${form.file.id}/file`} target="_blank" rel="noopener noreferrer">
                    {form.file.name}
                  </a>
                  <span className="adm-muted">{formatBytes(form.file.size)}</span>
                </div>
              ) : (
                <p className="adm-hint">No PDF attached.</p>
              )}
              {errors.fileId && <p className="adm-field-error">{errors.fileId}</p>}
              <div className="adm-inline">
                <UploadButton
                  accept="application/pdf"
                  label={form.file ? 'Replace PDF' : 'Upload PDF'}
                  onUploaded={(u) => set({ fileId: u.id, file: { id: u.id, name: u.name, size: u.size } })}
                />
                {form.file && (
                  <button type="button" className="adm-btn sm ghost" onClick={() => set({ fileId: null, file: null })}>
                    Remove
                  </button>
                )}
              </div>
              <label className="adm-check">
                <input type="checkbox" checked={form.gated} disabled={!form.fileId} onChange={(e) => set({ gated: e.target.checked })} />
                Require name, email &amp; company to download
              </label>
              <p className="adm-hint">Gated downloads are emailed to the team and listed under Download leads. PDFs up to 25 MB.</p>
            </div>
          )}

          <div className="adm-card">
            <Field label="Tags" id="tags" hint="Comma-separated, up to 12.">
              <input
                id="tags"
                value={form.tags.join(', ')}
                onChange={(e) => set({ tags: e.target.value.split(',').map((t) => t.trimStart()) })}
                onBlur={() => set({ tags: form.tags.map((t) => t.trim()).filter(Boolean) })}
              />
            </Field>
          </div>

          {!isNew && (
            <div className="adm-card">
              <ConfirmButton className="adm-btn danger block" confirmLabel="Click again to delete permanently" onConfirm={remove}>
                Delete resource
              </ConfirmButton>
            </div>
          )}
        </aside>
      </div>
    </form>
  )
}
