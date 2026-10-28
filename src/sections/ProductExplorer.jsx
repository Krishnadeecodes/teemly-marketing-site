import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import Reveal from '../home/Reveal.jsx'
import FitScale from '../components/FitScale.jsx'
import {
  DashboardShot,
  TeamsShot,
  ScreenshotsShot,
  AttendanceShot,
  ReportsShot,
  SettingsShot,
  VideoRecordingShot,
  LocationTrackingShot,
  SHOT_W,
} from '../components/FeatureShots.jsx'
import '../home/explorer.css'

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
    Comp: DashboardShot,
  },
  {
    key: 'teams',
    label: 'Teams',
    icon: 'users',
    tag: 'TEAMS',
    title: 'Team health at a glance, individual context on demand',
    desc: 'Roll every employee up into a team score, then drop into a single person\'s day down to the hour — without switching tools.',
    points: [
      'A monthly heat map of hours worked, per team',
      'Team cards ranked by productivity, not headcount',
      'A full profile per employee, down to a 24-hour activity timeline',
    ],
    Comp: TeamsShot,
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
    Comp: ScreenshotsShot,
  },
  {
    key: 'video-recording',
    label: 'Video',
    icon: 'monitor',
    tag: 'VIDEO RECORDING',
    title: 'Continuous visual audit, in configurable segments',
    desc: 'Screen recording captured in 5–30 minute segments per employee, organised by session, with in-browser playback — no download required to review a day.',
    points: [
      'Gallery view with thumbnail preview, playable right in the browser',
      'Privacy blur per employee — original recording never stored when on',
      'Silent recording under stealth mode, gated behind the same legal consent as Silent Tracking',
    ],
    Comp: VideoRecordingShot,
  },
  {
    key: 'location-tracking',
    label: 'Location',
    icon: 'pin',
    tag: 'LOCATION TRACKING',
    title: 'GPS visibility, built for remote and field teams',
    desc: 'Location captured at a configurable interval and plotted against the working day, with geofencing to confirm presence at the office, a client site, or home.',
    points: [
      'Live team map plus a full daily movement log per employee',
      'Geofence entry/exit alerts for defined work zones',
      'Privacy Mode pauses GPS too — no separate override, ever',
    ],
    Comp: LocationTrackingShot,
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
    Comp: AttendanceShot,
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
    Comp: ReportsShot,
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
    Comp: SettingsShot,
  },
]

export default function ProductExplorer() {
  const [active, setActive] = useState('dashboard')
  const mod = modules.find((m) => m.key === active)

  return (
    <section className="h-explorer" id="explorer">
      <div className="h-wrap">
        <div className="h-sec-head center">
          <span className="h-kicker">How Teemly Works</span>
          <SplitHeading as="h2" text="Connect. Understand. Improve." className="h-split-center" />
          <p>One agent, eight modules, all reading from the same real-time record — not disconnected tools stitched together after the fact.</p>
        </div>

        <div className="h-explorer-tabs">
          {modules.map((m) => (
            <button
              key={m.key}
              className={`h-explorer-tab${active === m.key ? ' active' : ''}`}
              onClick={() => setActive(m.key)}
            >
              <Icon name={m.icon} size={15} />
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        <Reveal as="div" className="h-explorer-card" key={mod.key}>
          <div className="h-explorer-copy">
            <span className="h-explorer-tag">{mod.tag}</span>
            <h3>{mod.title}</h3>
            <p>{mod.desc}</p>
            <ul>
              {mod.points.map((p) => (
                <li key={p}>
                  <Icon name="check" size={14} />
                  {p}
                </li>
              ))}
            </ul>
            <Link to={`/product/${mod.key}`} className="h-textlink">
              Explore {mod.label}
            </Link>
          </div>
          <div className="h-explorer-visual">
            {/* the screen at desktop size, scaled down to fit like a screenshot */}
            <FitScale width={SHOT_W} media="all">
              <mod.Comp />
            </FitScale>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
