import { forwardRef } from 'react'
import Icon from './Icon.jsx'
import Logo from './Logo.jsx'
import '../home/heroDashboard.css'

// The Teemly "Organization overview" shown in the home hero: insight about
// how the organisation works (scores, signals and teams) rather than who is
// doing what right now. All numbers are illustrative sample data (the hero
// is labelled "Illustrative example") and match the rest of the site.

// the five intelligence areas
const SIDEBAR = [
  { icon: 'chart', label: 'Organizational Intelligence' },
  { icon: 'users', label: 'Workforce Intelligence' },
  { icon: 'monitor', label: 'Work Intelligence' },
  { icon: 'clock', label: 'Workflow Intelligence' },
  { icon: 'sparkle', label: 'AI Intelligence' },
]

const KPIS = [
  { icon: 'target', label: 'Org Intelligence Score', value: '78', suffix: '/100', trend: '3 pts', dir: 'up', note: 'vs last month' },
  { icon: 'users', label: 'Teams on track', value: '5', suffix: '/6', note: 'Sales needs attention' },
  { icon: 'clock', label: 'Avg focus session', value: '47', suffix: ' min', trend: '6 min', dir: 'up', note: 'vs last month' },
  { icon: 'dollar', label: 'Savings found', value: '₹14,400', suffix: '/mo', note: 'unused licences' },
]

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
// Org Intelligence Score, sampled every few days Apr to Sep: a steady climb
// with ordinary ups and downs, to today's 78.
const ACTIVITY = [
  61, 62, 60, 62, 63, 62, 64, 63, 64, 66, 65, 66, 65, 67, 68, 67, 69, 68, 70, 71, 70, 72, 71, 72, 73, 72, 74, 73,
  74, 75, 74, 76, 75, 76, 77, 76, 78, 77, 77, 76, 77,
]
const PEAK = ACTIVITY.indexOf(Math.max(...ACTIVITY))

// signal health this month, by source
const SIGNALS = [
  { name: 'People', v: 82 },
  { name: 'Work', v: 74 },
  { name: 'Technology', v: 68 },
]

// team health score; Sales is the one that needs attention
const TEAM_HEALTH = [
  { d: 'Des', v: 91 },
  { d: 'Eng', v: 84 },
  { d: 'Mkt', v: 79 },
  { d: 'Ops', v: 76 },
  { d: 'Sup', v: 72 },
  { d: 'Sal', v: 58, late: true },
]

const TEAMS = [
  { n: 'Design', size: '10 people', status: 'On track', s: 'productive', score: '91%', bars: [6, 7, 7, 8, 8, 8, 9, 9, 9, 9] },
  { n: 'Sales', size: '18 people', status: 'Needs attention', s: 'privacy', score: '58%', bars: [8, 8, 7, 7, 7, 6, 6, 6, 5, 6] },
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
        <b>Org Intelligence Score</b>
        <span className="h-db-legend">
          <i /> Last 6 months
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

function Signals() {
  return (
    <div className="h-db-panel">
      <div className="h-db-ph">
        <b>Signals</b>
        <small>This month</small>
      </div>
      <div className="h-db-apps">
        {SIGNALS.map((a) => (
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

function TeamHealth() {
  return (
    <div className="h-db-panel">
      <div className="h-db-ph">
        <b>Team health</b>
        <small>By team</small>
      </div>
      <div className="h-db-week">
        {TEAM_HEALTH.map((t) => (
          <div className="h-db-day" key={t.d}>
            <span className="h-db-stack" style={{ height: `${t.v}%` }}>
              <span className={`prod${t.late ? ' late' : ''}`} style={{ flex: 1 }} />
            </span>
            <small>{t.d}</small>
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
            <span key={m.label} className={i === 0 ? 'on' : ''} title={m.label}>
              <Icon name={m.icon} size={17} />
            </span>
          ))}
        </nav>
      </aside>

      <div className="h-db-main">
        <div className="h-db-top">
          <b>Organization overview</b>
          <span className="h-db-search">Search teams, signals, reports</span>
          <span className="h-db-avatar">SM</span>
        </div>

        <div className="h-db-hello">
          <strong>Good morning, Sam</strong>
          <span>Acme Corp · 6 teams · 128 people · Last 30 days</span>
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
          <Signals />
          <TeamHealth />
        </div>

        <div className="h-db-table">
          <div className="h-db-tr h-db-th">
            <span>Team</span>
            <span>Status</span>
            <span>Score</span>
            <span>Trend</span>
          </div>
          {TEAMS.map((p, i) => (
            <div className="h-db-tr" key={p.n}>
              <span className="h-db-who">
                <i className={`h-db-av a${i}`}>{p.n.slice(0, 2).toUpperCase()}</i>
                <span>
                  <b>{p.n}</b>
                  <small>{p.size}</small>
                </span>
              </span>
              <span className="h-db-now">
                <i className={p.s} />
                {p.status}
              </span>
              <span className="h-db-time">{p.score}</span>
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
