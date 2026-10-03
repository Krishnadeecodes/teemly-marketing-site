import {
  DashboardMock,
  TeamsMock,
  ScreenshotsMock,
  AttendanceMock,
  ReportsMock,
  SettingsMock,
  VideoRecordingMock,
  LocationTrackingMock,
} from '../components/ProductMockups.jsx'

export const modules = [
  {
    slug: 'dashboard',
    icon: 'chart',
    navLabel: 'Dashboard',
    tag: 'Dashboard',
    title: 'Everything worth knowing, the moment you log in',
    intro:
      "The landing screen for every Client Admin and Client Manager login — a real-time snapshot of the organisation or assigned team, refreshed automatically as Teemly's agent sends events.",
    Comp: DashboardMock,
    roleAccess: [
      { feature: 'Full organisation view', admin: 'All teams, all employees', manager: 'Assigned teams only' },
      { feature: 'Team & date range filters', admin: 'All teams selectable', manager: 'Assigned teams only' },
      { feature: 'Live status scroller', admin: 'All employees', manager: 'Assigned team only' },
      { feature: 'Export / download', admin: 'Yes', manager: 'No' },
    ],
    highlights: [
      { title: 'Four summary stat cards', desc: 'Total Employees, Checked In, Absent and Avg Productivity/Day — each with a trend arrow against the prior period.' },
      { title: 'Org Productivity Score', desc: 'A circular gauge from 0–100 for the selected date range, with a dotted target line and a productive / idle legend.' },
      { title: 'Work Summary chart', desc: "Productive vs. unproductive hours per day, with today's bar highlighted and an hourly tooltip on hover." },
      { title: 'Live screenshot feed', desc: 'The most recent captures across the org, blurred automatically if privacy mode is on for that employee.' },
      { title: 'Live Activity list', desc: "Every employee's current status — Work Mode, Privacy Mode, Offline, or Not Installed — updating without a refresh." },
      { title: 'Top Productive / Unproductive', desc: 'Ranked panels by employee, website or app, each row a progress bar relative to the top performer.' },
      { title: "Today's Activity table", desc: 'Login time, active hours, a progress bar against expected hours, and a live score per employee.' },
    ],
    planNote: 'Screenshot feed interval follows your plan: every 5 minutes on Starter, 2 minutes on Professional, 1 minute on Premium.',
  },
  {
    slug: 'teams',
    icon: 'users',
    navLabel: 'Teams',
    tag: 'Teams',
    title: "Every team, then every person inside it",
    intro:
      'Three depths in one module: an organisation-wide team summary, a team detail view with a monthly heat map, and a full employee profile down to the hour.',
    Comp: TeamsMock,
    roleAccess: [
      { feature: 'View all teams', admin: 'Yes', manager: 'Assigned teams only' },
      { feature: 'View employee profiles', admin: 'All employees', manager: 'Assigned members only' },
      { feature: 'Export CSV', admin: 'Yes', manager: 'No' },
      { feature: 'Add or edit employee', admin: 'Yes, via Settings', manager: 'No' },
    ],
    highlights: [
      { title: 'Team list view', desc: 'Every team as a card — productivity %, average work time, live working/privacy/offline counts and member avatars — sorted by productivity.' },
      { title: 'Work Hours Calendar', desc: 'A monthly heat map of average productive hours per day, colour-coded from excellent to low, per team.' },
      { title: 'Team members table', desc: 'Status, check-in time, active hours, productivity score and most-used app, filterable by working / privacy / offline.' },
      { title: 'Employee profile', desc: 'A 24-hour activity timeline, an app-and-website usage breakdown, attendance history and recent daily records — for any one person.' },
    ],
    planNote: 'App usage breakdown and the screenshots tab on an employee profile are available from the Professional plan up.',
  },
  {
    slug: 'screenshots',
    icon: 'camera',
    navLabel: 'Screenshots',
    tag: 'Screenshot Intelligence',
    title: 'Visual proof of work, without exposing the whole screen',
    intro:
      "Screenshots are captured at a plan-defined interval, stored in Teemly's own cloud storage, and served through a gallery with productivity filters and a full-screen detail view.",
    Comp: ScreenshotsMock,
    roleAccess: [
      { feature: 'View screenshots — all employees', admin: 'Yes', manager: 'No' },
      { feature: 'View screenshots — assigned team', admin: 'Yes', manager: 'Yes' },
      { feature: 'Change blur setting', admin: 'Yes, via Settings', manager: 'No' },
      { feature: 'Export screenshot list', admin: 'Yes', manager: 'No' },
    ],
    highlights: [
      { title: 'Gallery view', desc: 'Filter by date range, by productivity tag, or by employee — grouped by team in the sidebar.' },
      { title: 'Full-screen detail modal', desc: 'Previous/next navigation, a filmstrip of surrounding captures, and a download button for the full-resolution image.' },
      { title: 'Privacy blur, per employee', desc: 'When blur is on, the original image is never written to storage — Teemly applies the blur server-side before saving anything.' },
      { title: 'Audit trail', desc: 'Every screenshot view is logged — who viewed it, which employee, and when.' },
    ],
    planNote:
      'Interval and retention scale with plan: 5 min / 30 days on Starter, 2 min / 90 days on Professional, 1 min / 180 days on Premium. Blur is available from Professional up.',
  },
  {
    slug: 'video-recording',
    icon: 'monitor',
    navLabel: 'Video Recording',
    tag: 'Video Recording',
    title: 'Continuous visual audit, without the manual review',
    intro:
      'Screen recording is captured in configurable segments per employee and organised by session, with in-browser playback — no download required to review a day.',
    Comp: VideoRecordingMock,
    roleAccess: [
      { feature: 'View recordings — all employees', admin: 'Yes', manager: 'No' },
      { feature: 'View recordings — assigned team', admin: 'Yes', manager: 'Yes' },
      { feature: 'Download individual recordings', admin: 'Yes', manager: 'No' },
      { feature: 'Change blur setting', admin: 'Yes, via Settings', manager: 'No' },
    ],
    highlights: [
      { title: 'Configurable segments', desc: 'Recording is captured in 5, 10, 15 or 30-minute segments and stored per employee, per day, organised by session.' },
      { title: 'Gallery & in-browser playback', desc: 'All recordings listed chronologically with a thumbnail preview — no download needed to watch one back.' },
      { title: 'Privacy blur, per employee', desc: 'When blur is on for a recording, the original is never written to storage — same server-side guarantee as screenshots.' },
      { title: 'Silent recording', desc: 'When stealth mode is active there is no visible indicator — gated behind the same legal consent requirement as Silent Tracking.' },
    ],
    planNote:
      'Video Recording is available from the Professional plan up (7-day retention), extending to 30 days on Premium and custom retention on Enterprise. Not available on Starter.',
  },
  {
    slug: 'location-tracking',
    icon: 'pin',
    navLabel: 'Location Tracking',
    tag: 'Location Tracking',
    title: 'GPS visibility for remote, hybrid and field teams',
    intro:
      'Location is captured at a configurable interval and plotted against the working day, with geofencing to confirm presence at the office, a client site, or home.',
    Comp: LocationTrackingMock,
    roleAccess: [
      { feature: 'Team location view', admin: 'Yes', manager: 'Assigned teams only' },
      { feature: 'Location history per employee', admin: 'Yes', manager: 'Assigned members only' },
      { feature: 'Geofence alerts', admin: 'Yes, via Settings', manager: 'No' },
      { feature: 'Export CSV', admin: 'Yes', manager: 'No' },
    ],
    highlights: [
      { title: 'Live & historical view', desc: 'See where each employee is right now, plus a full daily movement log, on a single team map.' },
      { title: 'Geofencing', desc: 'Define work zones — office, client site, home — and get an alert the moment someone enters or exits one.' },
      { title: 'Location-based attendance', desc: 'Presence can be confirmed by geofence entry, with late arrivals flagged against your configured check-in time.' },
      { title: 'Privacy respected', desc: 'Privacy Mode pauses GPS along with everything else — there is no separate override, and coordinates are never shared with peers.' },
    ],
    planNote:
      'Location Tracking is available from the Professional plan up (30-day retention), extending to 90 days on Premium and custom retention on Enterprise. Not available on Starter.',
  },
  {
    slug: 'attendance',
    icon: 'clock',
    navLabel: 'Attendance',
    tag: 'Attendance',
    title: 'Attendance derived from activity, not typed in',
    intro:
      "There is no manual check-in system. Check-in is the first EXE activity event of the working day; check-out is the last — or 'Active' if the employee is still working.",
    Comp: AttendanceMock,
    roleAccess: [
      { feature: "View all employees' attendance", admin: 'Yes', manager: 'Assigned team only' },
      { feature: 'Export CSV', admin: 'Yes', manager: 'No' },
      { feature: 'Gantt timeline view', admin: 'Yes (Professional+)', manager: 'Assigned team (Professional+)' },
      { feature: 'Configure working days', admin: 'Yes, via Settings', manager: 'No' },
    ],
    highlights: [
      { title: 'List view', desc: 'Employees grouped by team, with status, check-in/out times, total and productive hours, and a compact 24-hour activity bar.' },
      { title: 'Gantt timeline view', desc: 'Every employee on a shared time axis, so you can see who was working when, with a live "now" marker.' },
      { title: 'Automatic detection', desc: 'Late check-ins and absences are flagged against your configured expected-in time and grace period.' },
    ],
    planNote: 'The Gantt timeline view is available from the Professional plan up; list view and CSV export are on every plan.',
  },
  {
    slug: 'reports',
    icon: 'layers',
    navLabel: 'Reports',
    tag: 'Intelligence Reports',
    title: 'Six reports, each built to end in a decision',
    intro:
      'Work Pulse, Burnout & Wellbeing, Focus Score, Tool Intelligence, Attendance & Punctuality and Team Leaderboard — every report supports org-wide, by-team or by-employee scope, and closes with AI-generated, plain-language insight cards.',
    Comp: ReportsMock,
    roleAccess: [
      { feature: 'Org-wide reports', admin: 'Yes', manager: 'No' },
      { feature: 'Team- and employee-level reports', admin: 'Yes', manager: 'Assigned teams only' },
      { feature: 'Export (CSV / Excel)', admin: 'Yes', manager: 'No' },
      { feature: 'AI-generated insights', admin: 'Yes (Professional+)', manager: 'Assigned teams (Professional+)' },
    ],
    highlights: [
      { title: 'Work Pulse', desc: 'Peak productivity windows, an hourly heat map by team or person, and a ranked list of top distraction sources.' },
      { title: 'Burnout & Wellbeing', desc: 'Flags overworked and at-risk employees from overtime, after-hours sessions and weekend activity. Premium plan and above.' },
      { title: 'Focus Score', desc: 'Uninterrupted work streaks, context switches per hour, and a 0–100 focus score per employee. Premium plan and above.' },
      { title: 'Tool Intelligence', desc: 'Where time actually goes across apps and sites, plus an underused-licence alert with the monthly cost attached.' },
      { title: 'Attendance & Punctuality', desc: 'Daily attendance rate, late-arrival distribution, and an individual log with streaks and status badges.' },
      { title: 'Team Leaderboard', desc: 'Rankings by productivity score, a 4-week trend table, and a coaching-opportunity callout. Premium plan and above.' },
    ],
    planNote:
      'Work Pulse and Tool Intelligence are available from Professional; Burnout & Wellbeing, Focus Score and Team Leaderboard from Premium. Attendance & Punctuality is on every plan.',
  },
  {
    slug: 'settings',
    icon: 'gear',
    navLabel: 'Settings',
    tag: 'Settings & Controls',
    title: 'Every default, and every exception to it',
    intro:
      'Settings are organised into seven sections under three categories — Organisation & People, Work & Monitoring, and Access & Controls — accessible only to Client Admins.',
    Comp: SettingsMock,
    roleAccess: [
      { feature: 'Teams & Structure, People & Roles', admin: 'Full access', manager: 'No access' },
      { feature: 'Work Policy, Monitoring Controls', admin: 'Full access', manager: 'No access' },
      { feature: 'Silent Tracking', admin: 'Full access, legal gate', manager: 'No access' },
      { feature: 'Org Defaults, Permissions & Access', admin: 'Full access', manager: 'No access' },
    ],
    highlights: [
      { title: 'Teams & Structure', desc: 'Create, rename and delete teams — each shown with a member count and a productivity ring.' },
      { title: 'People & Roles', desc: 'Invite employees, assign teams and roles, and see EXE install status and last-sync time per person.' },
      { title: 'Work Policy', desc: 'Working days, productivity targets, expected hours and check-in time — configurable per employee.' },
      { title: 'Monitoring Controls', desc: 'Screenshot capture, blur and interval, plus idle-detection thresholds, saved per employee.' },
      { title: 'Silent Tracking', desc: 'Invisible monitoring, locked behind a mandatory legal-consent acknowledgement before it can ever switch on.' },
      { title: 'Org Defaults', desc: "The fallback settings applied to every new employee — always overridden by a person's individual settings." },
      { title: 'Permissions & Access', desc: 'Default Admin and Manager roles, plus custom roles with per-module read-only or full access. Professional plan and above.' },
    ],
    planNote: 'Silent Tracking and custom roles beyond the two defaults require the Professional plan or above.',
  },
]

export function getModule(slug) {
  return modules.find((m) => m.slug === slug)
}
