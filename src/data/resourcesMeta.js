export const resourceTypes = [
  { slug: 'research', icon: 'chart', label: 'Research', description: 'Original analysis on organisational intelligence.' },
  { slug: 'reports', icon: 'fileText', label: 'Reports', description: 'In-depth reports on workforce and workplace data.' },
  { slug: 'guides', icon: 'book', label: 'Guides', description: 'Practical guides to rolling out Teemly.' },
  { slug: 'case-studies', icon: 'target', label: 'Case Studies', description: 'Real deployments, in detail.' },
  { slug: 'blog', icon: 'monitor', label: 'Blog', description: 'Product updates and perspective.' },
  { slug: 'webinars', icon: 'play', label: 'Webinars', description: 'Live and recorded sessions.' },
  { slug: 'videos', icon: 'play', label: 'Videos', description: 'Short product walkthroughs.' },
  { slug: 'glossary', icon: 'book', label: 'Glossary', description: 'Organisational intelligence, defined in Teemly\'s own terms.' },
]

export function getResourceType(slug) {
  return resourceTypes.find((r) => r.slug === slug)
}

export const glossaryTerms = [
  { term: 'Organizational Intelligence', def: 'Teemly\'s core model: turning signals from people, work and technology into context, intelligence and action.' },
  { term: 'Signals → Context → Intelligence → Action → Outcomes', def: 'The path every piece of data takes in Teemly — from a raw activity event to a decision a manager actually makes.' },
  { term: 'Workforce Intelligence', def: 'The pillar covering team structure, attendance and capacity — the people side of the model.' },
  { term: 'Work Intelligence', def: 'The pillar covering how work actually happens — screenshots, recordings and tool usage.' },
  { term: 'Workflow Intelligence', def: 'The pillar covering policy, timelines and tool-spend efficiency signals.' },
  { term: 'AI Intelligence', def: 'The auto-generated insight cards and derived scores (productivity, focus, burnout) that every report produces automatically.' },
  { term: 'Org Productivity Score', def: 'A 0–100 gauge summarising organisation-wide productivity for a selected date range, shown on the Dashboard.' },
  { term: 'Focus Score', def: 'A 0–100 measure of deep, uninterrupted work, based on context switches per hour and focus-session length.' },
  { term: 'Privacy Mode', def: 'An employee-controlled setting that pauses all tracking — including screenshots, video and location — with no admin override.' },
  { term: 'Silent Tracking', def: 'Invisible monitoring mode, locked behind a mandatory legal consent acknowledgement before an admin can enable it.' },
  { term: 'EXE Agent', def: 'Teemly\'s own sub-2MB desktop application for Windows and macOS that captures activity at the OS level — built in-house, not licensed from a third party.' },
  { term: 'Signed URL', def: 'A temporary, expiring link (15-minute expiry) used to serve screenshots and video recordings — files are never served directly from storage.' },
  { term: 'Role-Based Access Control (RBAC)', def: 'Access rules enforced in API middleware so admins see the organisation and managers see only their assigned teams.' },
  { term: 'Tool Intelligence', def: 'The report that analyses app and website usage to flag underused software licences and adoption rates.' },
  { term: 'Burnout & Wellbeing Signal', def: 'A derived indicator built from overtime, after-hours activity and weekend work patterns.' },
  { term: 'Org-Scoped Query', def: 'A database query restricted to a single organisation\'s data by design — there is no code path into another organisation\'s records.' },
]
