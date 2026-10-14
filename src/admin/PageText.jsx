import { useEffect, useState } from 'react'
import { api } from './api.js'
import { ErrorBox, Field, Loading, PageHead, useApi, useToast } from './ui.jsx'

const GROUPS = [
  {
    key: 'hub',
    title: 'Resource Center page',
    where: '/resources',
    fields: [
      ['eyebrow', 'Eyebrow', 'input'],
      ['title', 'Heading', 'input'],
      ['desc', 'Intro', 'textarea'],
    ],
  },
  {
    key: 'teaser',
    title: 'Home page — Resources section',
    where: '/',
    fields: [
      ['kicker', 'Kicker', 'input'],
      ['title', 'Heading', 'input'],
      ['desc', 'Intro', 'textarea'],
      ['cardTitle', 'Card title', 'input'],
      ['cardDesc', 'Card text', 'input'],
    ],
  },
]

function Group({ group, value, defaults }) {
  const [v, setV] = useState(value)
  const [saved, setSaved] = useState(value)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()
  useEffect(() => {
    setV(value)
    setSaved(value)
  }, [value])
  const dirty = JSON.stringify(v) !== JSON.stringify(saved)

  async function save() {
    setBusy(true)
    setError('')
    try {
      const res = await api.put(`/settings/${group.key}`, v)
      setV(res[group.key])
      setSaved(res[group.key])
      toast(`${group.title} updated`)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="adm-card">
      <h2 className="adm-card-title">
        {group.title}{' '}
        <a className="adm-muted" href={group.where} target="_blank" rel="noopener noreferrer">
          {group.where}
        </a>
      </h2>
      {group.fields.map(([k, label, kind]) => (
        <Field key={k} label={label} id={`${group.key}-${k}`}>
          {kind === 'textarea' ? (
            <textarea id={`${group.key}-${k}`} rows={3} maxLength={600} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
          ) : (
            <input id={`${group.key}-${k}`} maxLength={600} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
          )}
        </Field>
      ))}
      <ErrorBox>{error}</ErrorBox>
      <div className="adm-inline">
        <button type="button" className="adm-btn primary sm" disabled={!dirty || busy} onClick={save}>
          {busy ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className="adm-btn sm ghost" disabled={busy} onClick={() => setV(defaults)}>
          Reset to original wording
        </button>
      </div>
    </section>
  )
}

export default function PageText() {
  const { data, error, loading } = useApi('/settings')
  return (
    <>
      <PageHead
        title="Page text"
        desc="Once real content is live, update the “the rest is on the way” wording here. Empty fields fall back to the original text."
      />
      <ErrorBox>{error}</ErrorBox>
      {loading && !data ? <Loading /> : data && GROUPS.map((g) => <Group key={g.key} group={g} value={data[g.key]} defaults={data.defaults[g.key]} />)}
    </>
  )
}
