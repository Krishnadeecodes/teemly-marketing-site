// Condensed from Section 9 — Feature-to-Plan Mapping in the Teemly Phase 1 Product Scope doc.
// Values: true = included, false = not included, or a literal string for a scaling value.
export const comparisonGroups = [
  {
    group: 'Dashboard',
    rows: [
      { f: 'Summary stat cards, productivity gauge, work summary chart', v: [true, true, true, true] },
      { f: 'Live screenshot feed', v: ['5 min', '2 min', '1 min', 'Custom'] },
      { f: "Top productive / unproductive panels", v: [true, true, true, true] },
    ],
  },
  {
    group: 'Teams',
    rows: [
      { f: 'Team list, work-hours calendar heat map', v: [true, true, true, true] },
      { f: 'Employee profile — app usage & screenshots tab', v: [false, true, true, true] },
    ],
  },
  {
    group: 'Screenshots',
    rows: [
      { f: 'Screenshot gallery with productivity tags', v: [true, true, true, true] },
      { f: 'Privacy blur (per employee)', v: [false, true, true, true] },
      { f: 'Interval / retention', v: ['5 min · 30d', '2 min · 90d', '1 min · 180d', 'Custom'] },
    ],
  },
  {
    group: 'Video & Location',
    rows: [
      { f: 'Video recording', v: ['Not included', '7-day retention', '30-day retention', 'Custom'] },
      { f: 'Location tracking', v: ['Not included', '30-day retention', '90-day retention', 'Custom'] },
    ],
  },
  {
    group: 'Attendance',
    rows: [
      { f: 'List view + CSV export', v: [true, true, true, true] },
      { f: 'Gantt timeline view', v: [false, true, true, true] },
    ],
  },
  {
    group: 'Reports',
    rows: [
      { f: 'Attendance & Punctuality report', v: [true, true, true, true] },
      { f: 'Work Pulse + Tool Intelligence reports', v: [false, true, true, true] },
      { f: 'Burnout & Wellbeing, Focus Score, Team Leaderboard', v: [false, false, true, true] },
      { f: 'AI auto-generated insights on every report', v: [false, true, true, true] },
    ],
  },
  {
    group: 'Settings',
    rows: [
      { f: 'Teams, People, Work Policy, Monitoring, Org Defaults', v: [true, true, true, true] },
      { f: 'Silent Tracking (legal-gated)', v: [false, true, true, true] },
      { f: 'Custom roles (Permissions & Access)', v: ['2 default', '2 custom', 'Unlimited', 'Unlimited'] },
    ],
  },
  {
    group: 'Security',
    rows: [
      { f: 'JWT + RBAC authentication, DPDP-aligned', v: [true, true, true, true] },
      { f: 'Admin action audit log', v: [false, true, true, true] },
      { f: 'On-premise deployment', v: [false, false, false, true] },
    ],
  },
  {
    group: 'Limits',
    rows: [
      { f: 'Max employees', v: ['50', '200', '500', 'Unlimited'] },
      { f: 'Screenshot storage quota', v: ['10 GB', '50 GB', '200 GB', 'Unlimited'] },
      { f: 'Support SLA', v: ['Email', '48 hrs', '24 hrs', '4 hrs'] },
      { f: 'API access for integrations', v: [false, false, true, true] },
      { f: 'Dedicated account manager', v: [false, false, false, true] },
    ],
  },
]

export const planNames = ['Starter', 'Professional', 'Premium', 'Enterprise']
