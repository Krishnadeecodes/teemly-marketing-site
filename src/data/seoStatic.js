// Titles and descriptions for the fixed pages, plus the shared helpers.
// Kept separate from seoMeta.js (which also reads every data file) so the
// browser only downloads this small table. Node loads it too: no JSX/CSS.
import { MODULES } from './modules.js'

export const SITE_NAME = 'Teemly'
export const DEFAULT_TITLE = 'Teemly — Organizational Intelligence Platform'
export const DEFAULT_DESCRIPTION =
  'Teemly brings how your people, work and technology actually operate into one live view, then turns it into clear reports your leaders can act on.'

// Search results show ~60 characters of a title.
const TITLE_MAX = 60

export function fullTitle(title) {
  if (!title) return DEFAULT_TITLE
  const full = `${title} | ${SITE_NAME}`
  // A long title that already names Teemly doesn't need the suffix too.
  return full.length > TITLE_MAX && title.includes(SITE_NAME) ? title : full
}

// "Title — Category", dropping the category when it would make the title too long.
export function resourceTitle(title, category) {
  const withCategory = `${title} — ${category}`
  return fullTitle(withCategory).length > TITLE_MAX ? title : withCategory
}

// Search results show ~155 characters; cut long intros at a word boundary.
export function clip(text, max = 158) {
  if (!text) return text
  const t = String(text).replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1).replace(/[\s,;:—-]+\S*$/, '')}…`
}

export const STATIC = {
  '/': { title: null, description: DEFAULT_DESCRIPTION },
  '/platform': {
    title: 'Platform',
    description: 'One platform for workforce, work, workflow and AI intelligence — built on Teemly’s own desktop agent, storage and scoring.',
  },
  '/solutions': {
    title: 'Solutions',
    description: 'How executives, HR, managers, operations, IT and finance teams use Teemly to see how work really happens across the organization.',
  },
  '/industries': {
    title: 'Industries',
    description: 'Teemly for technology, financial services, BPO, healthcare and other teams that need live visibility into how work gets done.',
  },
  '/why-teemly': {
    title: 'Why Teemly',
    description: 'Why organizational data stays fragmented, how Teemly is different, and where the business impact shows up.',
  },
  '/product': {
    title: 'Product',
    description: 'Dashboard, Teams, Screenshots, Attendance, Reports and every other Teemly module — what each one shows and which plan includes it.',
  },
  '/pricing': {
    title: 'Pricing',
    description: 'Teemly plans and pricing — Starter, Professional, Premium and Enterprise, with a full feature comparison.',
  },
  '/roi-calculator': {
    title: 'ROI Calculator',
    description: 'Estimate the return Teemly could deliver for your team — recovered hours, idle time and unused software spend.',
  },
  '/take-a-tour': {
    title: 'Take a Tour',
    description: 'Walk through the Teemly product screen by screen — no sign-up call needed.',
  },
  '/book-a-demo': {
    title: 'Book a Demo',
    description: 'See Teemly with your own use case. Book a live demo with the team.',
  },
  '/security': {
    title: 'Security & Trust',
    description: 'How Teemly protects workforce data — encryption, access control, governance, compliance and infrastructure security.',
  },
  '/trust-center': {
    title: 'Trust Center',
    description: 'Teemly’s security, privacy and compliance posture in one place.',
  },
  '/resources': {
    title: 'Resource Center',
    description: 'Guides, research and a glossary on organizational intelligence from the Teemly team.',
  },
  '/customers': {
    title: 'Customers',
    description: 'Who Teemly is built for, and how teams put organizational intelligence to work.',
  },
  '/company/about': {
    title: 'About',
    description: 'Teemly builds its own desktop agent, storage and scoring so organizations can understand how work really happens.',
  },
  '/company/contact': {
    title: 'Contact',
    description: 'Talk to the Teemly team about pricing, deployment, security reviews or partnerships.',
  },
  '/company/careers': { title: 'Careers', description: 'Work on Teemly — open roles and how we work.' },
  '/company/partners': { title: 'Partners', description: 'Partner with Teemly to bring organizational intelligence to your clients.' },
  '/company/news': { title: 'News', description: 'Teemly announcements and product news.' },
  '/support': { title: 'Support', description: 'Get help with Teemly — setup, the desktop agent, billing and account questions.' },
}

/** Meta for a fixed page or a product module page (what useSEO needs in the browser). */
export function staticMeta(path) {
  const m = STATIC[path]
  if (m) return { ...m, description: clip(m.description) }
  const mod = path.startsWith('/product/') && MODULES.find((x) => `/product/${x.slug}` === path)
  return mod ? { title: `${mod.label} — Product`, description: mod.summary } : null
}
