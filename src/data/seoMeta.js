// Page titles and descriptions for every public route, in one place.
// Used by the Node server (server/seo.js), which
// writes them into the HTML before it is sent — so search engines and link
// previews (LinkedIn, Slack, WhatsApp) see the right title without running
// any JavaScript. Keep this file free of JSX/CSS imports: Node loads it too.
import { MODULES } from './modules.js'
import { industries } from './industries.js'
import { platformPillars } from './platformPillars.js'
import { solutions } from './solutions.js'
import { whyTeemlyPages } from './whyTeemly.js'
import { securityTopics } from './securityTopics.js'
import { legalPages } from './legalContent.js'

import { STATIC, clip } from './seoStatic.js'

export { fullTitle, clip, DEFAULT_TITLE, DEFAULT_DESCRIPTION } from './seoStatic.js'

// Detail pages built from the data files: prefix → (slug) → meta or null.
const DYNAMIC = [
  ['/product/', (s) => {
    const m = MODULES.find((x) => x.slug === s)
    return m && { title: `${m.label} — Product`, description: m.summary }
  }],
  ['/platform/', (s) => {
    const p = platformPillars.find((x) => x.slug === s)
    return p && { title: `${p.label} — Platform`, description: p.intro }
  }],
  ['/solutions/', (s) => {
    const p = solutions.find((x) => x.slug === s)
    return p && { title: `${p.navLabel} — Solutions`, description: p.problem }
  }],
  ['/industries/', (s) => {
    const p = industries.find((x) => x.slug === s)
    return p && { title: `Teemly for ${p.label} — Industries`, description: p.context }
  }],
  ['/why-teemly/', (s) => {
    const p = whyTeemlyPages.find((x) => x.slug === s)
    return p && { title: `${p.label} — Why Teemly`, description: p.intro }
  }],
  ['/security/', (s) => {
    const p = securityTopics.find((x) => x.slug === s)
    return p && { title: `${p.label} — Security & Trust`, description: p.intro }
  }],
  ['/legal/', (s) => {
    const p = legalPages.find((x) => x.slug === s)
    return p && { title: p.label, description: `Teemly's ${p.label} — data-handling practices in plain language.` }
  }],
]

/**
 * Meta for a site path, or null when the path is not a known page.
 * Resource Center category/item pages live in the database, so this returns
 * { resource: true } for them and the server checks the database itself.
 */
export function metaForPath(pathname) {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (STATIC[p]) return { ...STATIC[p], description: clip(STATIC[p].description), path: p }
  for (const [prefix, find] of DYNAMIC) {
    if (p.startsWith(prefix)) {
      const slug = p.slice(prefix.length)
      if (!slug || slug.includes('/')) return null
      const m = find(slug)
      return m ? { ...m, description: clip(m.description), path: p } : null
    }
  }
  if (/^\/resources\/[^/]+(\/[^/]+)?$/.test(p)) return { resource: true, path: p }
  return null
}

/** Every static and data-driven page, for sitemap.xml. */
export function allPaths() {
  return [
    ...Object.keys(STATIC),
    ...MODULES.map((m) => `/product/${m.slug}`),
    ...platformPillars.map((x) => `/platform/${x.slug}`),
    ...solutions.map((x) => `/solutions/${x.slug}`),
    ...industries.map((x) => `/industries/${x.slug}`),
    ...whyTeemlyPages.map((x) => `/why-teemly/${x.slug}`),
    ...securityTopics.map((x) => `/security/${x.slug}`),
    ...legalPages.map((x) => `/legal/${x.slug}`),
  ]
}

