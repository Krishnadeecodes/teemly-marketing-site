import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import SectionHead from '../components/SectionHead.jsx'
import {
  DashboardMock,
  TeamsMock,
  ScreenshotsMock,
  AttendanceMock,
  ReportsMock,
  SettingsMock,
} from '../components/ProductMockups.jsx'

const modules = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'chart',
    tag: 'DASHBOARD',
    title: 'Everything worth knowing, before your first coffee',
    desc: "Checked-in counts, absentees, a live productivity score and today's activity feed — refreshed the moment your agent reports in, not at end of day.",
    points: [
      'One productivity score for the whole org, updated continuously',
      'Productive vs. unproductive hours, visualised day by day',
      'A live feed of who is working, idle, or in privacy mode right now',
    ],
    Comp: DashboardMock,
  },
  {
    key: 'teams',
    label: 'Teams',
    icon: 'users',
    tag: 'TEAMS & ATTENDANCE',
    title: 'Team health at a glance, individual context on demand',
    desc: 'Roll every employee up into a team score, then drop into a single person\'s day down to the hour — without switching tools.',
    points: [
      'A monthly heat map of hours worked, per team',
      'Team cards ranked by productivity, not headcount',
      'A full profile per employee, down to a 24-hour activity timeline',
    ],
    Comp: TeamsMock,
  },
  {
    key: 'screenshots',
    label: 'Screenshots',
    icon: 'camera',
    tag: 'SCREENSHOT INTELLIGENCE',
    title: "Proof of work, on the employee's terms",
    desc: 'Every capture is tagged productive, neutral or unproductive automatically — and any employee can blur their own screen, with the original image never even written to storage.',
    points: [
      'A privacy toggle that is real, not cosmetic — set per person',
      'Automatic tagging, no manual review required',
      'Employees pause capture themselves via Privacy Mode, no override',
    ],
    Comp: ScreenshotsMock,
  },
  {
    key: 'attendance',
    label: 'Attendance',
    icon: 'clock',
    tag: 'ATTENDANCE',
    title: 'Attendance your team never has to log',
    desc: 'Check-in and check-out are read from real activity, not typed into a form — then laid onto a shared timeline so you can see who was working, and when.',
    points: [
      'No manual check-in, ever',
      'A shared timeline across the whole team, not a spreadsheet',
      'Late arrivals and absences flagged automatically',
    ],
    Comp: AttendanceMock,
  },
  {
    key: 'reports',
    label: 'Reports',
    icon: 'layers',
    tag: 'INTELLIGENCE REPORTS',
    title: 'The questions every manager actually asks — answered',
    desc: 'Work rhythm, burnout risk, focus quality, tool spend, punctuality and team ranking — each report closes with a plain-language note on what to do about it.',
    points: [
      "Notes like 'Friday afternoons are your quietest window' — not just charts",
      'Underused software licences flagged, with the monthly cost attached',
      'Every report scoped to the org, a team, or one person',
    ],
    Comp: ReportsMock,
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: 'gear',
    tag: 'SETTINGS & CONTROLS',
    title: 'As strict — or as light-touch — as your policy needs',
    desc: 'Seven settings groups cover everything from working hours to who can see what. The one exception: invisible tracking, which stays locked until an admin explicitly accepts responsibility for it.',
    points: [
      'Admins see the org; managers see only their teams',
      'A deliberate legal step before silent monitoring can ever switch on',
      'Org-wide defaults, overridden per person when needed',
    ],
    Comp: SettingsMock,
  },
]

export default function ProductExplorer() {
  const [active, setActive] = useState('dashboard')
  const mod = modules.find((m) => m.key === active)

  return (
    <section className="section explorer" id="explorer">
      <div className="container">
        <SectionHead
          center
          eyebrow="How Teemly Works"
          title="One agent. Six views. Nothing left to guess at."
          desc="Every module below reads from the same real-time record — not six disconnected tools stitched together after the fact."
        />

        <div className="explorer-tabs">
          {modules.map((m) => (
            <button
              key={m.key}
              className={`explorer-tab${active === m.key ? ' active' : ''}`}
              onClick={() => setActive(m.key)}
            >
              <Icon name={m.icon} size={16} />
              {m.label}
            </button>
          ))}
        </div>

        <div className="explorer-card">
          <div className="explorer-copy">
            <span className="explorer-tag">{mod.tag}</span>
            <h3>{mod.title}</h3>
            <p>{mod.desc}</p>
            <ul>
              {mod.points.map((p) => (
                <li key={p}>
                  <Icon name="check" size={15} />
                  {p}
                </li>
              ))}
            </ul>
            <Link to={`/product/${mod.key}`} className="tour-link">
              Explore {mod.label}
              <Icon name="arrowRight" size={15} />
            </Link>
          </div>
          <div className="explorer-visual">
            <mod.Comp />
          </div>
        </div>
      </div>
    </section>
  )
}
