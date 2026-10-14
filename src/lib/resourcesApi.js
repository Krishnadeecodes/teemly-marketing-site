import { useEffect, useState } from 'react'
import { resourceTypes, glossaryTerms, DEFAULT_SETTINGS, getResourceType } from '../data/resourcesMeta.js'

// Public Resource Center data from the Node server (server/resources.js).
// If the API is unreachable (e.g. `npm run dev` without `npm run server`),
// pages fall back to the static seed data so the site still renders.

const cache = new Map()

const fallbacks = {
  hub: () => ({
    categories: resourceTypes.map((r, i) => ({ ...r, sort: i, visible: true, count: r.slug === 'glossary' ? glossaryTerms.length : 0 })),
    featured: [],
    latest: [],
    settings: DEFAULT_SETTINGS,
  }),
  type: (slug) => {
    const category = getResourceType(slug)
    if (!category) return null
    return slug === 'glossary' ? { category, terms: glossaryTerms } : { category, items: [] }
  },
  item: () => null,
}

async function load(path) {
  const res = await fetch(`/api/resources${path}`, { headers: { Accept: 'application/json' } })
  if (res.status === 404) return null
  const type = res.headers.get('content-type') || ''
  if (!res.ok || !type.includes('application/json')) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// { data, loading } — data is null when the resource doesn't exist.
function useResourceData(path, fallback) {
  const [state, setState] = useState(() => (cache.has(path) ? { data: cache.get(path), loading: false } : { data: null, loading: true }))

  useEffect(() => {
    let alive = true
    if (!cache.has(path)) setState({ data: null, loading: true })
    load(path)
      .then((data) => {
        cache.set(path, data)
        if (alive) setState({ data, loading: false })
      })
      .catch(() => {
        if (alive) setState({ data: fallback(), loading: false })
      })
    return () => {
      alive = false
    }
  }, [path]) // eslint-disable-line react-hooks/exhaustive-deps

  return state
}

export const useResourcesHub = () => useResourceData('', fallbacks.hub)
export const useResourceType = (slug) => useResourceData(`/${encodeURIComponent(slug)}`, () => fallbacks.type(slug))
export const useResourceItem = (type, slug) =>
  useResourceData(`/${encodeURIComponent(type)}/${encodeURIComponent(slug)}`, fallbacks.item)

export async function unlockDownload(type, slug, payload) {
  const res = await fetch(`/api/resources/${encodeURIComponent(type)}/${encodeURIComponent(slug)}/unlock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {
    throw new Error('Network error. Please check your connection and try again.')
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || 'Something went wrong. Please try again.')
    err.fields = data.fields
    throw err
  }
  return data
}

export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
