import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { api } from './api.js'
import { ErrorBox, Field, Loading, PageHead, useApi, useToast } from './ui.jsx'

function CategoryRow({ cat, icons, index, count, onSaved, onMove }) {
  const [v, setV] = useState(cat)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const dirty = JSON.stringify(v) !== JSON.stringify(cat)

  async function save(patch = {}) {
    setBusy(true)
    try {
      const next = { ...v, ...patch }
      const res = await api.put(`/categories/${cat.slug}`, next)
      setErrors({})
      onSaved(res)
      setV(res.categories.find((c) => c.slug === cat.slug))
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
        <Field label="Icon" id={`${cat.slug}-icon`} error={errors.icon}>
          <select id={`${cat.slug}-icon`} value={v.icon} onChange={(e) => setV({ ...v, icon: e.target.value })}>
            {icons.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Description" id={`${cat.slug}-desc`} full>
          <input id={`${cat.slug}-desc`} value={v.description} maxLength={300} onChange={(e) => setV({ ...v, description: e.target.value })} />
        </Field>
      </div>
      <div className="adm-inline">
        <button type="button" className="adm-btn primary sm" disabled={!dirty || busy} onClick={() => save()}>
          Save
        </button>
        <button type="button" className="adm-btn sm" disabled={busy} onClick={() => save({ visible: !cat.visible })}>
          {cat.visible ? 'Hide from site' : 'Show on site'}
        </button>
      </div>
    </li>
  )
}

export default function Categories() {
  const { data, error, loading, setData } = useApi('/categories')
  const toast = useToast()

  function move(index, delta) {
    const slugs = data.categories.map((c) => c.slug)
    const j = index + delta
    ;[slugs[index], slugs[j]] = [slugs[j], slugs[index]]
    api
      .put('/categories-order', { slugs })
      .then((res) => setData((d) => ({ ...d, ...res })))
      .catch((err) => toast(err.message, 'error'))
  }

  return (
    <>
      <PageHead
        title="Categories"
        desc="Rename, reorder or hide the resource types on /resources. Hiding a category also hides everything in it."
      />
      <ErrorBox>{error}</ErrorBox>
      {loading && !data ? (
        <Loading />
      ) : (
        data && (
          <ul className="adm-cats">
            {data.categories.map((c, i) => (
              <CategoryRow
                key={`${c.slug}-${c.sort}-${c.visible}`}
                cat={c}
                icons={data.icons}
                index={i}
                count={data.categories.length}
                onMove={move}
                onSaved={(res) => setData((d) => ({ ...d, ...res }))}
              />
            ))}
          </ul>
        )
      )}
      <p className="adm-hint">The header menu links are set in src/data/navigation.js and don’t change from here.</p>
    </>
  )
}
