import Icon from './Icon.jsx'
import Logo from './Logo.jsx'
import '../home/heroDashboard.css'

// The Platform section's preview: the same dashboard frame as the home hero,
// with content for the active intelligence area. Sample data only.

export const AREA_TABS = [
  { icon: 'chart', label: 'Organizational Intelligence' },
  { icon: 'users', label: 'Workforce Intelligence' },
  { icon: 'monitor', label: 'Work Intelligence' },
  { icon: 'clock', label: 'Workflow Intelligence' },
  { icon: 'sparkle', label: 'AI Intelligence' },
]

function Kpis({ items }) {
  return (
    <div className="h-db-kpis">
      {items.map((k) => (
        <div className="h-db-kpi" key={k.label}>
          <div className="h-db-kpi-head">
            <span>{k.label}</span>
            <Icon name={k.icon} size={15} />
          </div>
          <strong>
            {k.value}
            {k.suffix && <small>{k.suffix}</small>}
          </strong>
          <em className={k.tone || ''}>
            {k.trend && <span aria-hidden="true">{k.up ? '↑' : '↓'}</span>}
            {k.trend} <span>{k.note}</span>
          </em>
        </div>
      ))}
    </div>
  )
}

function Panel({ title, meta, children, className = '' }) {
  return (
    <div className={`h-db-panel ${className}`}>
      <div className="h-db-ph">
        <b>{title}</b>
        {meta && <small>{meta}</small>}
      </div>
      {children}
    </div>
  )
}

/* 1. Organizational */
function OrgView() {
  const spark = [58, 62, 60, 66, 64, 70, 68, 73, 71, 76, 74, 78]
  const pts = spark.map((v, i) => `${(i / (spark.length - 1)) * 300},${90 - ((v - 50) / 35) * 80}`).join(' ')
  return (
    <>
      <Kpis
        items={[
          { icon: 'users', label: 'Employees', value: '128', note: 'across 6 teams' },
          { icon: 'check', label: 'Checked in', value: '89', trend: '4%', up: true, tone: 'good', note: 'vs yesterday' },
          { icon: 'eyeOff', label: 'Absent', value: '12', trend: '2', tone: 'good', note: 'vs yesterday' },
          { icon: 'trendingUp', label: 'Productivity', value: '78%', trend: '3 pts', up: true, tone: 'good', note: 'vs last month' },
        ]}
      />
      <div className="h-pd-row">
        <Panel title="Org productivity score" meta="Today">
          <div className="h-pd-gauge" style={{ '--v': 78 }}>
            <span>
              <b>78</b>
              <small>/ 100</small>
            </span>
          </div>
          <div className="h-pd-legend">
            <span><i className="p" /> Productive 78%</span>
            <span><i className="n" /> Idle 14%</span>
          </div>
        </Panel>
        <Panel title="Productivity trend" meta="Last 12 weeks" className="h-pd-grow">
          <svg className="h-pd-spark" viewBox="0 0 300 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pdSpark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#07D7D9" stopOpacity="0.25" />
                <stop offset="1" stopColor="#07D7D9" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={`0,100 ${pts} 300,100`} fill="url(#pdSpark)" />
            <polyline points={pts} />
          </svg>
        </Panel>
      </div>
    </>
  )
}

/* 2. Workforce */
function WorkforceView() {
  const teams = [
    { n: 'Design', v: 91, s: 'On track' },
    { n: 'Engineering', v: 84, s: 'On track' },
    { n: 'Support', v: 72, s: 'On track' },
    { n: 'Sales', v: 58, s: 'Needs attention', warn: true },
  ]
  return (
    <>
      <Kpis
        items={[
          { icon: 'layers', label: 'Teams', value: '6', note: '128 people' },
          { icon: 'trendingUp', label: 'Avg productivity', value: '76%', trend: '2 pts', up: true, tone: 'good', note: 'vs last month' },
          { icon: 'clock', label: 'Avg work time', value: '6h 40m', note: 'per person / day' },
          { icon: 'heart', label: 'Burnout risk', value: '3', suffix: ' people', trend: '1', up: true, tone: 'bad', note: 'vs last month' },
        ]}
      />
      <Panel title="Teams by productivity" meta="This month" className="h-pd-grow">
        <div className="h-pd-teams">
          {teams.map((t) => (
            <div className="h-pd-team" key={t.n}>
              <b>{t.n}</b>
              <span className="h-db-apptrack">
                <span className={`h-db-appfill${t.warn ? ' warn' : ''}`} style={{ width: `${t.v}%` }} />
              </span>
              <span className="h-pd-pct">{t.v}%</span>
              <em className={t.warn ? 'warn' : 'ok'}>{t.s}</em>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

/* 3. Work */
function WorkView() {
  const apps = [
    { name: 'VS Code', t: '2h 10m', v: 92, c: 'p' },
    { name: 'Figma', t: '1h 25m', v: 62, c: 'p' },
    { name: 'Google Docs', t: '1h 05m', v: 48, c: 'p' },
    { name: 'Slack', t: '48m', v: 34, c: 'n' },
    { name: 'YouTube', t: '12m', v: 9, c: 'u' },
  ]
  return (
    <>
      <Kpis
        items={[
          { icon: 'check', label: 'Productive', value: '74%', trend: '3 pts', up: true, tone: 'good', note: 'vs last week' },
          { icon: 'clock', label: 'Neutral', value: '18%', note: 'of work time' },
          { icon: 'eyeOff', label: 'Unproductive', value: '8%', trend: '2 pts', tone: 'good', note: 'vs last week' },
          { icon: 'monitor', label: 'Apps & sites', value: '46', note: 'tagged automatically' },
        ]}
      />
      <Panel title="Top apps & websites" meta="Today · per person" className="h-pd-grow">
        <div className="h-pd-share">
          <span className="p" style={{ flex: 74 }} />
          <span className="n" style={{ flex: 18 }} />
          <span className="u" style={{ flex: 8 }} />
        </div>
        <div className="h-pd-apps">
          {apps.map((a) => (
            <div className="h-pd-app" key={a.name}>
              <i className={a.c} />
              <b>{a.name}</b>
              <span className="h-db-apptrack">
                <span className={`h-pd-fill ${a.c}`} style={{ width: `${a.v}%` }} />
              </span>
              <small>{a.t}</small>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

/* 4. Workflow */
function WorkflowView() {
  const rows = [
    { n: 'Ananya R.', from: 3, to: 88, ok: true },
    { n: 'Karthik S.', from: 14, to: 94, late: true },
    { n: 'Meera J.', from: 5, to: 72, ok: true },
    { n: 'Rohit V.', from: 2, to: 84, ok: true },
  ]
  return (
    <>
      <Kpis
        items={[
          { icon: 'check', label: 'On time', value: '92%', trend: '3 pts', up: true, tone: 'good', note: 'vs last week' },
          { icon: 'clock', label: 'Late arrivals', value: '3', trend: '2', tone: 'good', note: 'vs last week' },
          { icon: 'bolt', label: 'Avg check-in', value: '9:12', suffix: ' AM', note: 'from real activity' },
          { icon: 'flag', label: 'Overtime', value: '6h', trend: '1h', up: true, tone: 'bad', note: 'vs last week' },
        ]}
      />
      <Panel title="Attendance timeline" meta="Today" className="h-pd-grow">
        <div className="h-pd-axis">
          <span>9 AM</span>
          <span>12 PM</span>
          <span>3 PM</span>
          <span>6 PM</span>
        </div>
        <div className="h-pd-lanes">
          {rows.map((r) => (
            <div className="h-pd-lanerow" key={r.n}>
              <b>{r.n}</b>
              <span className="h-pd-lane">
                <span style={{ left: `${r.from}%`, width: `${r.to - r.from}%` }} />
              </span>
              <em className={r.late ? 'warn' : 'ok'}>{r.late ? 'Late' : 'On time'}</em>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

/* 5. AI */
function AiView() {
  const reports = [
    { icon: 'clock', n: 'Work rhythm', note: 'Friday afternoons are your quietest window', tag: 'New', tone: 'pink' },
    { icon: 'heart', n: 'Burnout risk', note: '3 people above their usual hours for 2 weeks', tag: 'Attention', tone: 'warn' },
    { icon: 'target', n: 'Focus quality', note: 'Engineering focus time up 22% this sprint', tag: 'Improving', tone: 'ok' },
    { icon: 'dollar', n: 'Tool spend', note: '6 unused design licences, ₹14,400 a month', tag: 'Save', tone: 'info' },
  ]
  return (
    <>
      <div className="h-db-ai">
        <span className="h-db-ai-tag">
          <Icon name="sparkle" size={12} /> Teemly AI
        </span>
        <p>
          Focus time is down 18% in Sales since the new review cadence. <b>Try moving reviews to Friday.</b>
        </p>
      </div>
      <Panel title="Report insights" meta="Updated just now" className="h-pd-grow">
        <div className="h-pd-reports">
          {reports.map((r) => (
            <div className="h-pd-report" key={r.n}>
              <span className="h-pd-ric">
                <Icon name={r.icon} size={14} />
              </span>
              <span className="h-pd-rtext">
                <b>{r.n}</b>
                <small>{r.note}</small>
              </span>
              <em className={r.tone}>{r.tag}</em>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

const VIEWS = [OrgView, WorkforceView, WorkView, WorkflowView, AiView]

export default function PlatformDashboard({ index }) {
  const View = VIEWS[index]
  return (
    <div className="h-db h-pd">
      <aside className="h-db-side">
        <Logo variant="mark" size={26} label={null} />
        <nav>
          {AREA_TABS.map((t, i) => (
            <span key={t.label} className={i === index ? 'on' : ''}>
              <Icon name={t.icon} size={17} />
            </span>
          ))}
        </nav>
      </aside>
      <div className="h-db-main">
        <div className="h-db-top">
          <b>{AREA_TABS[index].label}</b>
          <span className="h-db-search">Search people, teams, apps</span>
          <span className="h-db-live">
            <i /> Live
          </span>
          <span className="h-db-avatar">SM</span>
        </div>
        <div className="h-pd-view" key={index}>
          <View />
        </div>
      </div>
    </div>
  )
}
