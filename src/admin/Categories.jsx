import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { api, slugify } from './api.js'
import { useAuth } from './authContext.js'
import { ConfirmButton, ErrorBox, Field, Loading, PageHead, useApi, useToast } from './ui.jsx'

const NEW = { label: '', slug: '', description: '', icon: 'book', template: 'default', visible: false }

function TemplateSelect({ id, value, templates, error, onChange }) {
  const chosen = templates.find((t) => t.key === value)
  return (
    <Field label="Page template" id={id} error={error} hint={chosen?.layout} full>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {templates.map((t) => (
          <option key={t.key} value={t.key}>
            {t.name}
          </option>
        ))}
      </select>
    </Field>
  )
}

function IconSelect({ id, value, icons, error, onChange }) {
  return (
    <Field label="Icon" id={id} error={error}>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {icons.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
    </Field>
  )
}

function NewCategory({ icons, templates, onCreated, onCancel }) {
  const [v, setV] = useState(NEW)
  const [slugTouched, setSlugTouched] = useState(false)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const toast = useToast()

  async function create(e) {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await api.post('/categories', v)
      onCreated(res)
      toast(`${v.label} created`)
    } catch (err) {
      setErrors(err.fields || {})
      toast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="adm-card adm-cat adm-cat-new" onSubmit={create} noValidate>
      <h2 className="adm-card-title">New category</h2>
      <div className="adm-grid-2">
        <Field label="Label" id="new-label" error={errors.label}>
          <input
            id="new-label"
            value={v.label}
            maxLength={60}
            autoFocus
            onChange={(e) => setV({ ...v, label: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value).slice(0, 60) }) })}
          />
        </Field>
        <Field label="URL" id="new-slug" error={errors.slug} hint={`teemly.app/resources/${v.slug || '…'} — can’t be changed later`}>
          <input
            id="new-slug"
            value={v.slug}
            maxLength={60}
            onChange={(e) => {
              setSlugTouched(true)
              setV({ ...v, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })
            }}
          />
        </Field>
        <Field label="Description" id="new-desc" hint="Shown on the Resource Center and in the header menu." full>
          <input id="new-desc" value={v.description} maxLength={300} onChange={(e) => setV({ ...v, description: e.target.value })} />
        </Field>
        <IconSelect id="new-icon" value={v.icon} icons={icons} error={errors.icon} onChange={(icon) => setV({ ...v, icon })} />
        <Field label="Visibility" id="new-visible">
          <label className="adm-check">
            <input id="new-visible" type="checkbox" checked={v.visible} onChange={(e) => setV({ ...v, visible: e.target.checked })} />
            Show on the website now
          </label>
        </Field>
        <TemplateSelect id="new-template" value={v.template} templates={templates} error={errors.template} onChange={(template) => setV({ ...v, template })} />
      </div>
      {!v.visible && <p className="adm-hint">Tip: keep it hidden until you’ve published a few resources in it, then click “Show on site”.</p>}
      <div className="adm-inline">
        <button type="submit" className="adm-btn primary sm" disabled={busy}>
          Create category
        </button>
        <button type="button" className="adm-btn sm ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function DeletePanel({ cat, others, onDeleted, onCancel }) {
  const [moveTo, setMoveTo] = useState('')
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const n = cat.total

  async function remove() {
    setBusy(true)
    try {
      const res = await api.del(`/categories/${cat.slug}${n ? `?moveTo=${encodeURIComponent(moveTo)}` : ''}`)
      onDeleted(res)
      toast(n ? `${cat.label} deleted — ${res.moved} moved to ${others.find((o) => o.slug === moveTo)?.label}` : `${cat.label} deleted`)
    } catch (err) {
      toast(err.message, 'error')
      setBusy(false)
    }
  }

  return (
    <div className="adm-cat-delete" role="region" aria-label={`Delete ${cat.label}`}>
      {n ? (
        <Field label={`Move its ${n} resource${n === 1 ? '' : 's'} to`} id={`${cat.slug}-move`} hint="Their URLs change to the new category, so old links will stop working.">
          <select id={`${cat.slug}-move`} value={moveTo} onChange={(e) => setMoveTo(e.target.value)}>
            <option value="">Choose a category…</option>
            {others.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      ) : (
        <p>This category is empty. Deleting it removes /resources/{cat.slug} from the site.</p>
      )}
      <div className="adm-inline">
        <ConfirmButton className="adm-btn danger sm" disabled={busy || (n > 0 && !moveTo)} onConfirm={remove}>
          {n ? 'Move & delete' : 'Delete category'}
        </ConfirmButton>
        <button type="button" className="adm-btn sm ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}

function CategoryRow({ cat, icons, templates, others, isAdmin, index, count, onSaved, onMove }) {
  const [v, setV] = useState(cat)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const toast = useToast()
  const glossary = cat.slug === 'glossary'
  const dirty = ['label', 'description', 'icon', 'template'].some((k) => v[k] !== cat[k])

  async function save(patch = {}) {
    setBusy(true)
    try {
      const next = { ...v, ...patch }
      const res = await api.put(`/categories/${cat.slug}`, next)
      setErrors({})
      onSaved(res)
      toast(`${next.label} saved`)
    } catch (err) {
      setErrors(err.fields || {})
      toast(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <li className={`adm-card adm-cat${cat.visible ? '' : ' is-hidden'}`}>
      <div className="adm-cat-head">
        <span className="adm-stat-ic">
          <Icon name={v.icon} size={18} />
        </span>
        <code>/resources/{cat.slug}</code>
        <span className="adm-flag">
          {cat.total} {glossary ? (cat.total === 1 ? 'term' : 'terms') : cat.total === 1 ? 'resource' : 'resources'}
        </span>
        {!cat.visible && <span className="adm-flag warn">Hidden from site</span>}
        <div className="adm-row-actions">
          <button type="button" className="adm-btn sm ghost" aria-label="Move up" disabled={index === 0} onClick={() => onMove(index, -1)}>
            ↑
          </button>
          <button type="button" className="adm-btn sm ghost" aria-label="Move down" disabled={index === count - 1} onClick={() => onMove(index, 1)}>
            ↓
          </button>
        </div>
      </div>
      <div className="adm-grid-2">
        <Field label="Label" id={`${cat.slug}-label`} error={errors.label}>
          <input id={`${cat.slug}-label`} value={v.label} maxLength={60} onChange={(e) => setV({ ...v, label: e.target.value })} />
        </Field>
        <IconSelect id={`${cat.slug}-icon`} value={v.icon} icons={icons} error={errors.icon} onChange={(icon) => setV({ ...v, icon })} />
        <Field label="Description" id={`${cat.slug}-desc`} full>
          <input id={`${cat.slug}-desc`} value={v.description} maxLength={300} onChange={(e) => setV({ ...v, description: e.target.value })} />
        </Field>
        {!glossary && (
          <TemplateSelect
            id={`${cat.slug}-template`}
            value={v.template}
            templates={templates}
            error={errors.template}
            onChange={(template) => setV({ ...v, template })}
          />
        )}
      </div>
      <div className="adm-inline">
        <button type="button" className="adm-btn primary sm" disabled={!dirty || busy} onClick={() => save()}>
          Save
        </button>
        <button type="button" className="adm-btn sm" disabled={busy} onClick={() => save({ visible: !cat.visible })}>
          {cat.visible ? 'Hide from site' : 'Show on site'}
        </button>
        <Link to={glossary ? '/admin/glossary' : `/admin/resources?type=${cat.slug}`} className="adm-btn sm ghost">
          {glossary ? 'Edit terms' : 'View resources'}
        </Link>
        {cat.visible && (
          <a href={`/resources/${cat.slug}`} target="_blank" rel="noopener noreferrer" className="adm-btn sm ghost">
            View on site ↗
          </a>
        )}
        {isAdmin && !glossary && !deleting && (
          <button type="button" className="adm-btn sm ghost adm-cat-del" onClick={() => setDeleting(true)}>
            Delete…
          </button>
        )}
      </div>
      {deleting && <DeletePanel cat={cat} others={others} onDeleted={onSaved} onCancel={() => setDeleting(false)} />}
    </li>
  )
}

export default function Categories() {
  const { data, error, loading, setData } = useApi('/categories')
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [adding, setAdding] = useState(false)
  const toast = useToast()
  const update = (res) => setData((d) => ({ ...d, ...res }))

  function move(index, delta) {
    const slugs = data.categories.map((c) => c.slug)
    const j = index + delta
    ;[slugs[index], slugs[j]] = [slugs[j], slugs[index]]
    api
      .put('/categories-order', { slugs })
      .then(update)
      .catch((err) => toast(err.message, 'error'))
  }

  return (
    <>
      <PageHead
        title="Categories"
        desc="Add, rename, reorder, hide or delete the resource types on /resources. Hiding a category also hides everything in it."
      >
        {isAdmin && !adding && data && (
          <button type="button" className="adm-btn primary" onClick={() => setAdding(true)}>
            + New category
          </button>
        )}
      </PageHead>
      <ErrorBox>{error}</ErrorBox>
      {loading && !data ? (
        <Loading />
      ) : (
        data && (
          <>
            {adding && (
              <NewCategory
                icons={data.icons}
                templates={data.templates}
                onCancel={() => setAdding(false)}
                onCreated={(res) => {
                  update(res)
                  setAdding(false)
                }}
              />
            )}
            <ul className="adm-cats">
              {data.categories.map((c, i) => (
                <CategoryRow
                  key={`${c.slug}-${c.sort}-${c.visible}-${c.template}-${c.label}-${c.icon}-${c.description}-${c.total}`}
                  cat={c}
                  icons={data.icons}
                  templates={data.templates}
                  others={data.categories.filter((o) => o.slug !== c.slug && o.slug !== 'glossary')}
                  isAdmin={isAdmin}
                  index={i}
                  count={data.categories.length}
                  onMove={move}
                  onSaved={update}
                />
              ))}
            </ul>
          </>
        )
      )}
      <p className="adm-hint">Visible categories appear in the site’s header menu automatically, in this order.</p>
    </>
  )
}
