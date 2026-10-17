// The product modules, in display order. This is the single list behind the
// home page dashboard preview, the module overview cards, the Product page and
// the /product/:slug pages — add, rename or reorder a module here only.
export const MODULES = [
  {
    slug: 'dashboard',
    label: 'Dashboard',
    icon: 'chart',
    summary: 'A live snapshot of attendance, activity and productivity across your organization.',
  },
  {
    slug: 'teams',
    label: 'Teams',
    icon: 'users',
    summary: 'Team health and workload at a glance, with a full profile for every person.',
  },
  {
    slug: 'screenshots',
    label: 'Screenshots',
    icon: 'camera',
    summary: 'Visual proof of work, sorted automatically, with a privacy blur employees control.',
  },
  {
    slug: 'video-recording',
    label: 'Video Recording',
    shortLabel: 'Video',
    icon: 'monitor',
    summary: 'Screen recordings in short segments, ready to play in the browser.',
  },
  {
    slug: 'location-tracking',
    label: 'Location Tracking',
    shortLabel: 'Location',
    icon: 'pin',
    summary: 'Location and work-zone check-ins for remote and field teams.',
  },
  {
    slug: 'attendance',
    label: 'Attendance',
    icon: 'clock',
    summary: 'Check-in and check-out recorded from real activity, never typed in by hand.',
  },
  {
    slug: 'reports',
    label: 'Reports',
    icon: 'layers',
    summary: 'Six reports with plain-language recommendations, kept up to date automatically.',
  },
  {
    slug: 'settings',
    label: 'Settings',
    icon: 'gear',
    summary: 'Decide what is captured, who sees what, and how each policy applies.',
  },
]

export const moduleBySlug = (slug) => MODULES.find((m) => m.slug === slug)
