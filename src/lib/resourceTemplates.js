// Each Resource Center category renders with its own page template (see
// src/pages/resources/templates). This describes them for the admin editor:
// which extra fields a template uses and what the page looks like.
// Categories created in the admin without an entry here use `default`.
export const TEMPLATES = {
  research: {
    name: 'Research study',
    layout: 'Data-report hero with headline stats, numbered key findings and a sticky download panel.',
    extras: ['stats', 'takeaways'],
    takeawaysLabel: 'Key findings',
  },
  reports: {
    name: 'Report landing page',
    layout: 'Gated-asset landing page: 3D report cover, “What’s inside” checklist and the download form above the fold.',
    extras: ['stats', 'takeaways'],
    takeawaysLabel: 'What’s inside',
  },
  guides: {
    name: 'Long-form guide',
    layout: 'Chaptered guide with a sticky table of contents built from your headings and a reading-progress bar.',
    extras: ['takeaways'],
    takeawaysLabel: 'What you’ll learn',
  },
  'case-studies': {
    name: 'Customer story',
    layout: 'Customer hero with company facts, a big-number results band, a pull quote and the story.',
    extras: ['customer', 'stats', 'results', 'quote'],
  },
  blog: {
    name: 'Editorial article',
    layout: 'Magazine-style article: centred reading column, author byline, reading time and share links.',
    extras: [],
  },
  webinars: {
    name: 'Event page',
    layout: 'Event hero with a date badge; shows “Register” before the date and the recording afterwards, plus speakers.',
    extras: ['event', 'speakers', 'takeaways'],
    takeawaysLabel: 'What you’ll learn',
  },
  videos: {
    name: 'Video theatre',
    layout: 'Theatre layout with a large player and an “Up next” playlist.',
    extras: ['duration'],
  },
  default: {
    name: 'Standard article',
    layout: 'Article with a facts sidebar, tags and an optional PDF download.',
    extras: [],
  },
}

export const templateFor = (slug) => TEMPLATES[slug] || TEMPLATES.default

// "73% | of managers lack data" -> { value: '73%', label: 'of managers lack data' }
export function splitPair(line) {
  const i = String(line).indexOf('|')
  return i === -1 ? { value: line.trim(), label: '' } : { value: line.slice(0, i).trim(), label: line.slice(i + 1).trim() }
}

// Upcoming webinar = event date today or later.
export function isUpcoming(meta) {
  if (!meta?.eventOn) return false
  return meta.eventOn >= new Date().toISOString().slice(0, 10)
}
