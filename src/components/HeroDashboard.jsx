import { forwardRef } from 'react'
import Icon from './Icon.jsx'
import Logo from './Logo.jsx'
import { MODULES } from '../data/modules.js'
import '../home/heroDashboard.css'

// The Teemly dashboard shown in the home hero. All numbers are illustrative
// sample data (the hero is labelled "Illustrative example").

const SIDEBAR = MODULES.filter((m) => !['video-recording', 'location-tracking'].includes(m.slug))

const KPIS = [
  { icon: 'clock', label: 'Time worked', value: '1,057h', trend: '8%', dir: 'up', note: 'vs last month' },
  { icon: 'eyeOff', label: 'Idle time', value: '19h', trend: '10%', dir: 'down', note: 'vs last month' },
  { icon: 'trendingUp', label: 'Productivity', value: '78%', trend: '3 pts', dir: 'up', note: 'vs last month' },
  { icon: 'users', label: 'Online now', value: '89', suffix: '/128', note: 'checked in today' },
]

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
// Productive share of work time (%), sampled every few days Apr → Sep:
// flat and jittery, a climb to one clear 81% peak, then easing back down.
const ACTIVITY = [
  52, 53, 51, 52, 54, 52, 53, 51, 53, 55, 54, 56, 55, 58, 61, 59, 64, 62, 67, 70, 68, 76, 81, 77, 75, 76, 73, 71,
  72, 68, 66, 67, 63, 60, 58, 56, 61, 64, 61, 62, 60,
]
const PEAK = ACTIVITY.indexOf(Math.max(...ACTIVITY))

const APPS = [
  { name: 'VS Code', v: 92 },
  { name: 'Google Docs', v: 68 },
  { name: 'Figma', v: 44 },
  { name: 'Slack', v: 21 },
]

// hours per day: productive, idle
const WEEK = [
  { d: 'Mon', p: 6.4, i: 0.7 },
  { d: 'Tue', p: 6.8, i: 0.5 },
  { d: 'Wed', p: 7.1, i: 0.6, late: true },
  { d: 'Thu', p: 4.6, i: 1.3 },
  { d: 'Fri', p: 7.4, i: 1.6 },
  { d: 'Sat', p: 1.1, i: 0.4 },
]

const PEOPLE = [
  { n: 'Ananya R.', team: 'Design', app: 'Figma', t: '6h 12m', s: 'productive', bars: [5, 7, 6, 8, 9, 7, 8, 6, 9, 8] },
  { n: 'Karthik S.', team: 'Engineering', app: 'VS Code', t: '5h 48m', s: 'productive', bars: [6, 8, 9, 7, 8, 9, 6, 7, 8, 9] },
]


const W = 300
const H = 72
const pts = ACTIVITY.map((v, i) => [(i / (ACTIVITY.length - 1)) * W, H - (v / 100) * H])
const LINE = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('')
const AREA = `${LINE}L${W} ${H}L0 ${H}Z`
const [peakX, peakY] = pts[PEAK]

function ActivityChart() {
  return (
    <div className="h-db-panel h-db-activity">
      <div className="h-db-ph">
        <b>Activity by month</b>
        <span className="h-db-legend">
          <i /> Productive time
        </span>
      </div>
      <div className="h-db-linewrap">
        <div className="h-db-yaxis">
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>
        <div className="h-db-plot">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="hdbArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#07D7D9" stopOpacity="0.28" />
                <stop offset="1" stopColor="#07D7D9" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hdbLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#0187E0" />
                <stop offset="1" stopColor="#07D7D9" />
              </linearGradient>
            </defs>
            <g className="h-db-grid">
              <line x1="0" y1="0.5" x2={W} y2="0.5" />
              <line x1="0" y1={H / 2} x2={W} y2={H / 2} />
              <line x1="0" y1={H - 0.5} x2={W} y2={H - 0.5} />
            </g>
            <path className="h-db-area" d={AREA} fill="url(#hdbArea)" />
            <path className="h-db-line" d={LINE} pathLength="1" stroke="url(#hdbLine)" />
            <line className="h-db-peakline" x1={peakX} y1={peakY} x2={peakX} y2={H} />
          </svg>
          <span className="h-db-peak" style={{ left: `${(peakX / W) * 100}%`, top: `${(peakY / H) * 100}%` }}>
            <i />
            <em>
              <b />
              {ACTIVITY[PEAK]}%
            </em>
          </span>
        </div>
      </div>
      <div className="h-db-xaxis">
        {MONTHS.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  )
}

function TopApps() {
  return (
    <div className="h-db-panel">
      <div className="h-db-ph">
        <b>Top apps</b>
        <small>This month</small>
      </div>
      <div className="h-db-apps">
        {APPS.map((a) => (
          <div className="h-db-app" key={a.name}>
            <span>{a.name}</span>
            <span className="h-db-apptrack">
              <span className="h-db-appfill" style={{ width: `${a.v}%` }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WeekChart() {
  const max = 9
  return (
    <div className="h-db-panel">
      <div className="h-db-ph">
        <b>Time worked</b>
        <small>This week</small>
      </div>
      <div className="h-db-week">
        {WEEK.map((w) => (
          <div className="h-db-day" key={w.d}>
            <span className="h-db-stack" style={{ height: `${((w.p + w.i) / max) * 100}%` }}>
              <span className="idle" style={{ flex: w.i }} />
              <span className={`prod${w.late ? ' late' : ''}`} style={{ flex: w.p }} />
            </span>
            <small>{w.d}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

const HeroDashboard = forwardRef(function HeroDashboard(props, ref) {
  return (
    <div className="h-db" ref={ref} aria-hidden="true">
      <aside className="h-db-side">
        <Logo variant="mark" size={26} label={null} />
        <nav>
          {SIDEBAR.map((m, i) => (
            <span key={m.slug} className={i === 0 ? 'on' : ''} title={m.label}>
              <Icon name={m.icon} size={17} />
            </span>
          ))}
        </nav>
      </aside>

      <div className="h-db-main">
        <div className="h-db-top">
          <b>Dashboard</b>
          <span className="h-db-search">Search people, teams, apps</span>
          <span className="h-db-live">
            <i /> Live
          </span>
          <span className="h-db-avatar">SM</span>
        </div>

        <div className="h-db-hello">
          <strong>Good morning, Sam</strong>
          <span>All teams · Last 30 days</span>
        </div>

        <div className="h-db-kpis">
          {KPIS.map((k) => (
            <div className="h-db-kpi" key={k.label}>
              <div className="h-db-kpi-head">
                <span>{k.label}</span>
                <Icon name={k.icon} size={15} />
              </div>
              <strong>
                {k.value}
                {k.suffix && <small>{k.suffix}</small>}
              </strong>
              <em className={k.dir ? (k.dir === 'up' || k.good ? 'good' : 'bad') : ''}>
                {k.dir && <span aria-hidden="true">{k.dir === 'up' ? '↑' : '↓'}</span>}
                {k.trend} <span>{k.note}</span>
              </em>
            </div>
          ))}
        </div>

        <div className="h-db-ai">
          <span className="h-db-ai-tag">
            <Icon name="sparkle" size={12} /> Teemly AI
          </span>
          <p>
            Focus time is down 18% in Sales since the new review cadence. <b>Try moving reviews to Friday.</b>
          </p>
        </div>

        <div className="h-db-row">
          <ActivityChart />
          <TopApps />
          <WeekChart />
        </div>

        <div className="h-db-table">
          <div className="h-db-tr h-db-th">
            <span>Employee</span>
            <span>Current activity</span>
            <span>Today</span>
            <span>Activity</span>
          </div>
          {PEOPLE.map((p, i) => (
            <div className="h-db-tr" key={p.n}>
              <span className="h-db-who">
                <i className={`h-db-av a${i}`}>{p.n[0]}</i>
                <span>
                  <b>{p.n}</b>
                  <small>{p.team}</small>
                </span>
              </span>
              <span className="h-db-now">
                <i className={p.s} />
                {p.app}
              </span>
              <span className="h-db-time">{p.t}</span>
              <span className="h-db-spark">
                {p.bars.map((b, j) => (
                  <i key={j} style={{ height: `${b * 10}%` }} />
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export default HeroDashboard
