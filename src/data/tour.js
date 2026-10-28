import {
  DashboardMock,
  TeamsMock,
  ScreenshotsMock,
  AttendanceMock,
  ReportsMock,
  SettingsMock,
} from '../components/ProductMockups.jsx'
import { moduleBySlug } from './modules.js'

// The guided tour on /take-a-tour. Every step shows one of the product
// screens and spotlights a part of it; `target` is a selector inside that
// screen (with an optional index when it matches several elements). The copy
// only describes what the product does and what the screen shows — the same
// facts as the module pages — so keep it in step with them.

export const SCREENS = {
  dashboard: { label: 'Dashboard', Comp: DashboardMock },
  teams: { label: 'Teams', Comp: TeamsMock },
  screenshots: { label: 'Screenshot Intelligence', Comp: ScreenshotsMock },
  attendance: { label: 'Attendance', Comp: AttendanceMock },
  reports: { label: 'Intelligence Reports', Comp: ReportsMock },
  settings: { label: 'Settings & Controls', Comp: SettingsMock },
}

export const STEPS = {
  score: {
    screen: 'dashboard',
    target: { sel: '.mock-main-grid > .mock-panel', index: 0 },
    title: 'One score for the whole organisation',
    body: 'The Org Productivity Score sums up the company in a single number, refreshed continuously as the Teemly agent reports in — not batched together overnight.',
  },
  headcount: {
    screen: 'dashboard',
    target: { sel: '.mstat-row' },
    title: 'Who is in today, without a register',
    body: 'Headcount, check-ins, absences and average productive time sit at the top of the first screen, compared with yesterday automatically.',
  },
  week: {
    screen: 'dashboard',
    target: { sel: '.mock-main-grid > .mock-panel', index: 1 },
    title: 'Productive and unproductive hours, day by day',
    body: 'The week is charted as productive versus unproductive time, so a slow afternoon or a heavy Friday shows up as a shape, not a hunch.',
  },
  live: {
    screen: 'dashboard',
    target: { sel: '.mock-main-grid > .mock-panel', index: 2 },
    title: 'Who is working right now',
    body: 'A live list shows who is in Work Mode, idle, offline or in Privacy Mode at this moment — the same record the reports are built from.',
  },
  privacyMode: {
    screen: 'dashboard',
    target: { sel: '.live-row', index: 1 },
    title: 'Employees can pause capture themselves',
    body: 'Privacy Mode lets an employee pause data collection instantly. Admins can see that it happened, but there is no override to switch it back on for them.',
    trust: true,
  },
  teams: {
    screen: 'teams',
    target: { sel: '.team-grid' },
    title: 'From the org-wide average to each team',
    body: 'Team cards summarise every group and are ranked by productivity automatically, so the team that needs attention — here, Sales — surfaces on its own.',
  },
  tagged: {
    screen: 'screenshots',
    target: { sel: '.shot-grid' },
    title: 'Evidence, without watching anyone type',
    body: 'Every capture is tagged automatically as productive, neutral or unproductive, and the gallery filters by person or team.',
  },
  blur: {
    screen: 'screenshots',
    target: { sel: '.shot-card', index: 2 },
    title: 'Privacy blur is a real setting',
    body: 'Blur is set per employee. Once it is on, the original image is never stored — it is not a policy footnote.',
    trust: true,
  },
  attendance: {
    screen: 'attendance',
    target: { sel: '.mock-panel' },
    title: 'Nobody fills in a timesheet',
    body: 'Check-in is the first activity of the day and check-out the last. A shared timeline compares the whole team, and late arrivals and absences are flagged automatically.',
  },
  reports: {
    screen: 'reports',
    target: { sel: '.tile-row' },
    title: 'Six reports built to end in a decision',
    body: 'Work Pulse, Burnout & Wellbeing, Focus Score, Tool Intelligence, Attendance & Punctuality and Team Leaderboard — each scoped to the org, a team or one employee.',
  },
  heatmap: {
    screen: 'reports',
    target: { sel: '.mock-panel', index: 0 },
    title: 'When the organisation actually focuses',
    body: 'The hourly heat map shows each team’s productive hours across the day, so meeting loads and focus time can be planned around real patterns.',
  },
  insights: {
    screen: 'reports',
    target: { sel: '.insight-row' },
    title: 'Every report ends with what to do next',
    body: 'Plain-language AI insights close each report — like a Friday-afternoon dip, or the window when the whole organisation does its best work.',
  },
  controls: {
    screen: 'settings',
    target: { sel: '.settings-panel' },
    title: 'Monitoring is configured per person',
    body: 'Screenshot capture, privacy blur, capture interval and idle threshold are set per employee, on top of org-wide defaults that any individual setting can override.',
    trust: true,
  },
  roles: {
    screen: 'settings',
    target: { sel: '.settings-nav' },
    title: 'Access follows the org chart',
    body: 'Client Admins see the whole organisation; Client Managers see only their own teams. Permissions and access sit in their own settings group.',
    trust: true,
  },
  legalGate: {
    screen: 'settings',
    target: { sel: '.legal-card' },
    title: 'Silent Tracking sits behind a legal gate',
    body: 'The one invisible feature stays locked until an admin explicitly acknowledges local consent law — enforced in the interface and the API.',
    trust: true,
  },
}

// The tour on /take-a-tour is a playlist (src/sections/TourPlaylist.jsx):
// the overview below, then one entry per module — that screen's steps above,
// in the order listed. The one-line summary is the module's own, from
// src/data/modules.js, so the tour never says more than the module pages.
const MODULE_ICONS = {
  dashboard: 'chart',
  teams: 'users',
  screenshots: 'camera',
  attendance: 'clock',
  reports: 'fileText',
  settings: 'gear',
}

export const MODULES = Object.entries(SCREENS).map(([id, s]) => ({
  id,
  label: s.label,
  icon: MODULE_ICONS[id],
  summary: moduleBySlug(id).summary,
  steps: Object.keys(STEPS).filter((key) => STEPS[key].screen === id),
}))

// Played first: the whole product in one walkthrough, a few steps from each
// module, before the modules one by one.
export const OVERVIEW = {
  id: 'overview',
  label: 'Product Overview',
  icon: 'layers',
  summary: 'Every module in one walkthrough, start to finish.',
  steps: ['score', 'live', 'teams', 'tagged', 'blur', 'attendance', 'heatmap', 'insights', 'controls', 'legalGate'],
}

// The tour's playlist, in order.
export const PLAYLIST = [OVERVIEW, ...MODULES]
