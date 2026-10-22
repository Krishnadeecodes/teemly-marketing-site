import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import SectionHead from '../components/SectionHead.jsx'
import FitScale from '../components/FitScale.jsx'
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
    id: 'dashboard',
    tag: 'Dashboard',
    title: 'The first screen, and often the only one you need',
    desc: 'A real-time snapshot of the whole organisation, refreshed continuously as Teemly\'s agent reports in — not batched together overnight.',
    points: ['A single Org Productivity Score for the whole company', 'Productive vs. unproductive hours, charted by day', 'A live list of who is working, idle, or absent right now'],
    Comp: DashboardMock,
  },
  {
    id: 'teams',
    tag: 'Teams',
    title: 'From org-wide average to one person\'s afternoon',
    desc: 'Team cards summarise the group, a monthly heat map shows the pattern, and an individual profile explains the exception — three depths, one module.',
    points: ['Teams ranked by productivity, sorted automatically', 'A calendar heat map of hours worked, per team, per month', 'Employee profiles down to an hour-by-hour activity timeline'],
    Comp: TeamsMock,
  },
  {
    id: 'screenshots',
    tag: 'Screenshot Intelligence',
    title: 'Evidence, without watching anyone type',
    desc: 'Every capture is tagged automatically — productive, neutral or unproductive — and privacy blur is a real, employee-controlled setting, not a policy footnote.',
    points: ['Blur set per employee — the original image is never stored once it\'s on', 'A gallery tagged by productivity, filterable by person or team', 'Employees pause capture themselves via Privacy Mode, no admin override'],
    Comp: ScreenshotsMock,
  },
  {
    id: 'attendance',
    tag: 'Attendance',
    title: 'Nobody fills in a timesheet',
    desc: 'Check-in is the first activity event of the day; check-out is the last. Absence is simply the absence of events — no manual entry anywhere in the loop.',
    points: ['A shared Gantt timeline compares the whole team at a glance', 'Late arrivals and absences are flagged automatically', 'List and timeline views, both exportable to CSV'],
    Comp: AttendanceMock,
  },
  {
    id: 'reports',
    tag: 'Intelligence Reports',
    title: 'Six reports built to end in a decision, not a chart',
    desc: 'Work Pulse, Burnout & Wellbeing, Focus Score, Tool Intelligence, Attendance & Punctuality and Team Leaderboard — each closes with a plain-language note on what to do next.',
    points: ['Notes like "Friday afternoons are your quietest window"', 'Underused software licences flagged, with the monthly cost attached', 'Every report scoped to the org, a team, or a single employee'],
    Comp: ReportsMock,
  },
  {
    id: 'settings',
    tag: 'Settings & Controls',
    title: 'Configurable everywhere, permissive nowhere by accident',
    desc: 'Seven settings groups run from working hours to role permissions — and the one genuinely invisible feature, Silent Tracking, stays locked behind an explicit legal acknowledgement.',
    points: ['Client Admins see the org; Client Managers see only their teams', 'Silent Tracking requires a signed-off legal acknowledgement to unlock', 'Org-wide defaults that any individual setting can still override'],
    Comp: SettingsMock,
  },
]

export default function ProductTour() {
  return (
    <section className="section tour">
      <div className="container">
        <SectionHead
          center
          eyebrow="Product Tour"
          title="A closer look at every module"
          desc="What follows is a faithful recreation of Teemly's actual interface, module by module — not a mockup dressed up for marketing."
        />

        <div className="tour-list">
          {modules.map((m, i) => (
            <div className={`tour-row${i % 2 === 1 ? ' reverse' : ''}`} id={m.id} key={m.id}>
              <div className="tour-copy">
                <span className="tour-tag">{m.tag}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
                <ul>
                  {m.points.map((p) => (
                    <li key={p}>
                      <Icon name="check" size={15} />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link to={`/product/${m.id}`} className="tour-link">
                  See {m.tag} in action
                  <Icon name="arrowRight" size={15} />
                </Link>
              </div>
              <div className="tour-visual">
                <FitScale width={580}>
                  <m.Comp />
                </FitScale>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
