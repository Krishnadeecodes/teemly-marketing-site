// Industry framing — the product itself is not verticalized, so this is the
// same feature set viewed through each industry's most common operating pattern.
// No industry-specific case studies or statistics are claimed.

export const industries = [
  {
    slug: 'technology',
    icon: 'cpu',
    label: 'Technology',
    context:
      'Engineering and product teams are often distributed or remote, tool sprawl is constant, and focus time is the scarcest resource.',
    relevantModules: ['screenshots'],
    relevantReports: ['Focus Score', 'Tool Intelligence'],
  },
  {
    slug: 'financial-services',
    icon: 'shield',
    label: 'Financial Services',
    context:
      'Compliance and auditability tend to matter as much as productivity — every sensitive view needs to be logged, and attendance needs to be exact.',
    relevantModules: ['attendance', 'settings'],
    relevantReports: ['Attendance & Punctuality'],
  },
  {
    slug: 'healthcare',
    icon: 'heart',
    label: 'Healthcare',
    context:
      'Shift-based and field staff make real-time attendance and location visibility more useful than desk-based activity tracking alone.',
    relevantModules: ['location-tracking', 'attendance'],
    relevantReports: ['Attendance & Punctuality'],
  },
  {
    slug: 'manufacturing',
    icon: 'gear',
    label: 'Manufacturing',
    context:
      'On-site and plant-floor operations depend on confirmed presence at a location, not just a check-in typed into a form.',
    relevantModules: ['location-tracking', 'attendance'],
    relevantReports: ['Attendance & Punctuality'],
  },
  {
    slug: 'professional-services',
    icon: 'briefcase',
    label: 'Professional Services',
    context:
      'Utilisation and client-site work make tool usage and time allocation the two numbers that actually drive billing and staffing decisions.',
    relevantModules: ['attendance', 'location-tracking'],
    relevantReports: ['Tool Intelligence', 'Work Pulse'],
  },
  {
    slug: 'enterprise',
    icon: 'building',
    label: 'Enterprise',
    context:
      'Multi-team organisations need role-based access that actually scales — custom roles, organisation-scoped data, and an on-premise option where cloud storage is not an option.',
    relevantModules: ['settings'],
    relevantReports: ['Team Leaderboard'],
  },
]

export function getIndustry(slug) {
  return industries.find((i) => i.slug === slug)
}
