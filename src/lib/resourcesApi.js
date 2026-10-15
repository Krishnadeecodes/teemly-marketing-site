import { useEffect, useState } from 'react'
import { resourceTypes, glossaryTerms, DEFAULT_SETTINGS, getResourceType } from '../data/resourcesMeta.js'
import { resourcesLinks } from '../data/navigation.js'

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

// One request per path at a time, shared by prefetching and the page hooks.
const inflight = new Map()
const fetchedAt = new Map()
const FRESH_MS = 10_000 // data this recent isn't refetched when its page opens
function fetchInto(path) {
  if (!inflight.has(path)) {
    inflight.set(
      path,
      load(path)
        .then((data) => {
          cache.set(path, data)
          fetchedAt.set(path, Date.now())
          return data
        })
        .finally(() => inflight.delete(path)),
    )
  }
  return inflight.get(path)
}

// { data, loading } — data is null when the resource doesn't exist.
// Cached pages render immediately and refresh quietly in the background.
function useResourceData(path, fallback) {
  const [state, setState] = useState(() => (cache.has(path) ? { data: cache.get(path), loading: false } : { data: null, loading: true }))

  useEffect(() => {
    let alive = true
    setState(cache.has(path) ? { data: cache.get(path), loading: false } : { data: null, loading: true })
    if (cache.has(path) && !inflight.has(path) && Date.now() - (fetchedAt.get(path) || 0) < FRESH_MS) return undefined
    fetchInto(path)
      .then((data) => {
        if (alive) setState({ data, loading: false })
      })
      .catch(() => {
        if (alive && !cache.has(path)) setState({ data: fallback(), loading: false })
      })
    return () => {
      alive = false
    }
  }, [path]) // eslint-disable-line react-hooks/exhaustive-deps

  return state
}

// Warm the cache for a site path like /resources/blog/my-post, so the page
// opens instantly when the link is clicked. Fresh entries are left alone.
const prefetched = new Map()
const PREFETCH_TTL = 30_000
export function prefetchResourcePage(pathname) {
  const m = /^\/resources(?:\/([^/?#]+))?(?:\/([^/?#]+))?\/?$/.exec(pathname)
  if (!m) return
  const path = m[1] ? `/${m[1]}${m[2] ? `/${m[2]}` : ''}` : ''
  const at = prefetched.get(path)
  if (at && Date.now() - at < PREFETCH_TTL) return
  prefetched.set(path, Date.now())
  fetchInto(path).catch(() => prefetched.delete(path))
}

export const useResourcesHub = () => useResourceData('', fallbacks.hub)
export const useResourceType = (slug) => useResourceData(`/${encodeURIComponent(slug)}`, () => fallbacks.type(slug))
export const useResourceItem = (type, slug) =>
  useResourceData(`/${encodeURIComponent(type)}/${encodeURIComponent(slug)}`, fallbacks.item)

// Header/footer menu links for the visible categories, in admin order.
// Loaded once per page view; the static list shows until then (or if the API is down).
const TONES = ['blue', 'purple', 'pink', 'green', 'cyan', 'amber']
let menuLinks = null
let menuRequest = null

export function useResourceMenu() {
  const [links, setLinks] = useState(menuLinks || resourcesLinks)
  useEffect(() => {
    let alive = true
    menuRequest ||= load('/categories')
      .then((data) => {
        menuLinks = data.categories.map((c, i) => ({
          to: `/resources/${c.slug}`,
          label: c.label,
          desc: c.description,
          icon: c.icon,
          tone: TONES[i % TONES.length],
        }))
        return menuLinks
      })
      .catch(() => null)
    menuRequest.then((l) => alive && l && setLinks(l))
    return () => {
      alive = false
    }
  }, [])
  return links
}

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
