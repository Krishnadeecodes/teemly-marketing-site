// Single source of truth for header mega-menus and footer columns.
// Structure mirrors the Website Master Blueprint §4.1 (mega-menu) and §22 (footer).

export const platformLinks = [
  { to: '/platform/organizational-intelligence', label: 'Organizational Intelligence', desc: 'The umbrella view across people, work and technology', icon: 'network', tone: 'blue' },
  { to: '/platform/workforce-intelligence', label: 'Workforce Intelligence', desc: 'Teams, attendance and capacity, in one record', icon: 'users', tone: 'purple' },
  { to: '/platform/work-intelligence', label: 'Work Intelligence', desc: 'How work actually happens, app by app', icon: 'monitor', tone: 'pink' },
  { to: '/platform/workflow-intelligence', label: 'Workflow Intelligence', desc: 'Policy, timelines and tool-spend efficiency', icon: 'layers', tone: 'green' },
  { to: '/platform/ai-intelligence', label: 'AI Intelligence', desc: 'Auto-generated insight cards on every report', icon: 'sparkle', tone: 'amber' },
  { to: '/platform/data-platform', label: 'Data Platform', desc: 'The desktop app, secure data transfer and storage', icon: 'server', tone: 'cyan' },
  { to: '/platform/integrations', label: 'Integrations', desc: 'API access and CSV export, by plan', icon: 'puzzle', tone: 'blue' },
  { to: '/platform/architecture', label: 'Platform Architecture', desc: 'How signals become decisions, end to end', icon: 'cpu', tone: 'purple' },
]

export const solutionsLinks = [
  { to: '/solutions/executives', label: 'Executive Intelligence', desc: 'Organisation-wide visibility for leadership', icon: 'briefcase', tone: 'blue' },
  { to: '/solutions/hr', label: 'HR Intelligence', desc: 'Workforce health, attendance and experience', icon: 'users', tone: 'purple' },
  { to: '/solutions/managers', label: 'Manager Intelligence', desc: 'Team capacity, bottlenecks and coaching', icon: 'target', tone: 'pink' },
  { to: '/solutions/operations', label: 'Enterprise Operations', desc: 'Workflow and process friction, surfaced', icon: 'gear', tone: 'green' },
  { to: '/solutions/it', label: 'IT & Technology Intelligence', desc: 'Tool adoption, unused software and licence spend', icon: 'cpu', tone: 'cyan' },
  { to: '/solutions/finance', label: 'Capacity & Resource Planning', desc: 'Workforce cost and capacity planning', icon: 'dollar', tone: 'amber' },
  { to: '/solutions/productivity', label: 'Productivity Intelligence', desc: 'Focus, rhythm and distraction sources', icon: 'bolt', tone: 'blue' },
  { to: '/solutions/workforce', label: 'Workforce Optimization', desc: 'Right-sizing teams against real work patterns', icon: 'chart', tone: 'purple' },
  { to: '/solutions/workflow', label: 'Workflow Optimization', desc: 'Where process friction actually happens', icon: 'layers', tone: 'pink' },
  { to: '/solutions/ai', label: 'AI Impact', desc: 'Where AI-era productivity gains show up', icon: 'sparkle', tone: 'green' },
  { to: '/solutions/employee-experience', label: 'Employee Experience', desc: 'Burnout signals and privacy-respecting visibility', icon: 'heart', tone: 'cyan' },
]

export const whyTeemlyLinks = [
  { to: '/why-teemly/problem', label: 'The Problem', desc: 'Why organisational data stays fragmented', icon: 'puzzle', tone: 'pink' },
  { to: '/why-teemly/difference', label: 'How Teemly Is Different', desc: 'Our own software, not a licensed plugin', icon: 'sparkle', tone: 'blue' },
  { to: '/why-teemly/business-impact', label: 'Business Impact', desc: 'Where the value actually shows up', icon: 'trendingUp', tone: 'green' },
  { to: '/why-teemly/roi', label: 'ROI', desc: 'How to think about return before you buy', icon: 'dollar', tone: 'amber' },
  { to: '/resources/case-studies', label: 'Use Cases', desc: 'How teams put Teemly to work', icon: 'book', tone: 'purple' },
  { to: '/customers', label: 'Customer Stories', desc: 'Who we build Teemly for', icon: 'heart', tone: 'cyan' },
]

export const resourcesLinks = [
  { to: '/resources/research', label: 'Research', desc: 'Original analysis on organisational intelligence', icon: 'chart', tone: 'blue' },
  { to: '/resources/reports', label: 'Reports', desc: 'In-depth reports on workforce data', icon: 'fileText', tone: 'purple' },
  { to: '/resources/guides', label: 'Guides', desc: 'Practical guides to rolling out Teemly', icon: 'book', tone: 'pink' },
  { to: '/resources/case-studies', label: 'Case Studies', desc: 'Real deployments, in detail', icon: 'target', tone: 'green' },
  { to: '/resources/blog', label: 'Blog', desc: 'Product updates and perspective', icon: 'monitor', tone: 'cyan' },
  { to: '/resources/webinars', label: 'Webinars', desc: 'Live and recorded sessions', icon: 'play', tone: 'amber' },
  { to: '/resources/videos', label: 'Videos', desc: 'Short product walkthroughs', icon: 'play', tone: 'blue' },
  { to: '/resources/glossary', label: 'Glossary', desc: 'Organisational intelligence, defined', icon: 'book', tone: 'purple' },
]

export const securityLinks = [
  { to: '/security/data-privacy', label: 'Data Privacy', desc: 'What we collect, and what we never do', icon: 'eyeOff', tone: 'blue' },
  { to: '/security/encryption', label: 'Encryption', desc: 'AES-256 at rest, TLS 1.2+ in transit', icon: 'lock', tone: 'purple' },
  { to: '/security/access-control', label: 'Access Control', desc: 'RBAC, tokens and organisation scoping', icon: 'shield', tone: 'green' },
  { to: '/security/governance', label: 'Governance', desc: 'How Silent Tracking is gated and audited', icon: 'scale', tone: 'amber' },
  { to: '/security/compliance', label: 'Compliance', desc: 'DPDP progress and GDPR-aligned architecture', icon: 'check', tone: 'cyan' },
  { to: '/security/infrastructure', label: 'Infrastructure Security', desc: 'AWS WAF, Shield and private subnets', icon: 'server', tone: 'blue' },
  { to: '/security/ai-security', label: 'AI Security', desc: 'How AI insight generation is scoped and governed', icon: 'sparkle', tone: 'pink' },
]

export const companyLinks = [
  { to: '/company/about', label: 'About Teemly' },
  { to: '/customers', label: 'Customers' },
  { to: '/company/partners', label: 'Partners' },
  { to: '/company/careers', label: 'Careers' },
  { to: '/company/contact', label: 'Contact' },
  { to: '/support', label: 'Support' },
]

export const legalLinks = [
  { to: '/legal/privacy', label: 'Privacy' },
  { to: '/legal/terms', label: 'Terms' },
  { to: '/legal/cookie-policy', label: 'Cookie Policy' },
  { to: '/legal/dpa', label: 'DPA' },
  { to: '/legal/acceptable-use', label: 'Acceptable Use' },
]

// The Resources menus list the categories managed in the admin (see
// useResourceMenu in src/lib/resourcesApi.js); resourcesLinks is the fallback.
export function resourcesFooterLinks(links) {
  return [
    { label: 'Resource Center', to: '/resources' },
    ...links.slice(0, 5).map((l) => ({ label: l.label, to: l.to })),
    { label: 'ROI Calculator', to: '/roi-calculator' },
  ]
}

export const footerColumns = [
  {
    title: 'Platform',
    links: [
      { label: 'Overview', to: '/platform' },
      ...platformLinks.slice(0, 5).map((l) => ({ label: l.label, to: l.to })),
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Overview', to: '/solutions' },
      ...solutionsLinks.slice(0, 6).map((l) => ({ label: l.label, to: l.to })),
    ],
  },
  {
    title: 'Resources',
    links: resourcesFooterLinks(resourcesLinks),
  },
  {
    title: 'Trust',
    links: [
      { label: 'Security Overview', to: '/security' },
      ...securityLinks.map((l) => ({ label: l.label, to: l.to })),
      { label: 'Trust Center', to: '/trust-center' },
    ],
  },
  {
    title: 'Company',
    links: companyLinks,
  },
]
