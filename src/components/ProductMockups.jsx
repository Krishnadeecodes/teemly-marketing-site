import { Fragment } from 'react'
import Icon from './Icon.jsx'
import { AppWindow, AVATAR_COLORS, Avatar, Bar, Btn, Card, Chip, Donut, Kpis, ScreenThumb, Toggle } from './appUi.jsx'
import './mockups.css'

/*
 * The product screens shown on the module pages, the Product page, the home
 * page Product Explorer, the header menu and the Take a Tour player: one per
 * module, each in the Teemly app window (appUi.jsx). They fill their
 * container's width. Sample data only, matching the module pages' copy.
 *
 * The tour (src/data/tour.js) highlights parts of these screens by class:
 * .mstat-row, .mock-main-grid > .mock-panel, .live-row, .team-grid,
 * .shot-grid, .shot-card, .mock-panel, .tile-row, .insight-row,
 * .settings-nav, .settings-panel and .legal-card — keep them in place.
 */

const TOP_ACTIONS = (
  <>
    <Btn>All teams ▾</Btn>
    <Btn icon="clock">Today ▾</Btn>
    <Btn icon="download" primary>
      Export
    </Btn>
  </>
)

function ModuleWindow({ module, url, title, actions = TOP_ACTIONS, children }) {
  return (
    <AppWindow url={`teemly.app/${url}`} active={module} crumb={`Modules › ${title}`} title={title} actions={actions} className="mock-frame">
      {children}
    </AppWindow>
  )
}

/* ================= 1. Dashboard ================= */
export function DashboardMock() {
  const week = [
    ['Mon', 5.6, 1.1],
    ['Tue', 5.9, 0.9],
    ['Wed', 6.1, 1.2],
    ['Thu', 5.8, 1.0],
    ['Fri', 6.3, 0.8],
    ['Sat', 1.2, 0.3],
    ['Sun', 0.4, 0.1],
  ]
  const live = [
    ['Ananya Rao', 'ok', 'Work Mode', 'VS Code'],
    ['Karthik Subramanian', 'privacy', 'Privacy Mode', 'Paused by employee'],
    ['Meera Joshi', 'neutral', 'Offline · 12m', 'Last seen 10:31'],
    ['Rohit Verma', 'ok', 'Work Mode', 'Jira'],
    ['Priya Nair', 'warn', 'Idle · 6m', 'Zendesk'],
  ]
  const today = [
    ['Ananya Rao', '8:58 AM', '6h 52m', 86, 88],
    ['Rohit Verma', '8:41 AM', '7h 20m', 92, 81],
    ['Meera Joshi', '9:05 AM', '6h 05m', 76, 92],
    ['Daniel Brooks', '9:11 AM', '6h 31m', 82, 79],
  ]
  return (
    <ModuleWindow module="dashboard" url="dashboard" title="Dashboard">
      <Kpis
        className="mstat-row"
        items={[
          { icon: 'users', label: 'Total employees', value: '128', note: 'across 6 teams', spark: [120, 122, 123, 125, 126, 128] },
          { icon: 'check', label: 'Checked in', value: '89', delta: '+4%', tone: 'good', note: 'vs yesterday', spark: [80, 84, 82, 86, 85, 89] },
          { icon: 'eyeOff', label: 'Absent', value: '12', delta: '−2', tone: 'good', note: 'vs yesterday', spark: [16, 15, 14, 15, 14, 12] },
          { icon: 'trendingUp', label: 'Avg productivity / day', value: '6h 12m', delta: '+3%', tone: 'good', note: 'vs prev.', spark: [5.6, 5.8, 5.7, 6.0, 6.1, 6.2] },
        ]}
      />
      <div className="mock-main-grid">
        <Card title="Org Productivity Score" meta="Today" className="mock-panel">
          <div className="mk-gauge">
            <span className="mk-gauge-ring">
              <Donut
                parts={[
                  { v: 78, color: '#1fb87f' },
                  { v: 14, color: '#c9cee0' },
                  { v: 8, color: '#eef1f7' },
                ]}
              />
              <span className="mk-gauge-target" style={{ '--t': 75 }} />
              <span className="ps-donut-center">
                <b>78</b>
                <small>/ 100 today</small>
              </span>
            </span>
            <span className="ps-keyrow mk-center">
              <span>
                <i style={{ background: '#1fb87f' }} /> Productive 78%
              </span>
              <span>
                <i style={{ background: '#c9cee0' }} /> Idle 14%
              </span>
            </span>
            <small className="mk-target-note">Target 75 · ↑ 3 pts vs last week</small>
          </div>
        </Card>
        <Card title="Work Summary" meta="This week · hours" className="mock-panel">
          <div className="mk-bars">
            {week.map(([d, p, u], i) => (
              <span className={`mk-bar-col${i === 4 ? ' today' : ''}`} key={d}>
                {i === 4 && <em className="mk-tip">Fri · 6h 18m</em>}
                <span className="mk-stack">
                  <i className="u" style={{ height: `${(u / 8) * 100}%` }} />
                  <i className="p" style={{ height: `${(p / 8) * 100}%` }} />
                </span>
                <small>{d}</small>
              </span>
            ))}
          </div>
          <span className="ps-keyrow">
            <span>
              <i style={{ background: '#1fb87f' }} /> Productive
            </span>
            <span>
              <i style={{ background: '#171b2f' }} /> Unproductive
            </span>
          </span>
        </Card>
        <Card title="Live Activity" meta="89 / 128 online" className="mock-panel">
          <div className="mk-live">
            {live.map(([n, tone, status, app], i) => (
              <div className="live-row" key={n}>
                <Avatar name={n} i={i} />
                <span className="mk-live-text">
                  <b>{n}</b>
                  <small>{app}</small>
                </span>
                <Chip tone={tone}>{status}</Chip>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="mk-row mk-dash-bottom">
        <Card title="Today's Activity" meta="Engineering, Design + 4" action="View all →">
          <table className="ps-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Login</th>
                <th>Active</th>
                <th style={{ width: '30%' }}>vs expected 8h</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {today.map(([n, login, active, exp, score], i) => (
                <tr key={n}>
                  <td>
                    <span className="ps-person">
                      <Avatar name={n} i={i + 2} />
                      {n}
                    </span>
                  </td>
                  <td>{login}</td>
                  <td>{active}</td>
                  <td>
                    <Bar value={exp} tone="blue" />
                  </td>
                  <td>
                    <b className="mk-score">{score}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Top productive apps" meta="Today">
          <ul className="mk-rank">
            {[
              ['VS Code', '#0aa1e8', 100, '2h 10m'],
              ['Figma', '#f52998', 66, '1h 25m'],
              ['Google Docs', '#2f7cf6', 50, '1h 05m'],
              ['Jira', '#1868db', 40, '52m'],
            ].map(([n, c, v, t]) => (
              <li key={n}>
                <span className="ps-appicon" style={{ background: c }}>
                  {n[0]}
                </span>
                <span className="mk-rank-text">
                  <b>{n}</b>
                  <Bar value={v} tone="green" />
                </span>
                <small>{t}</small>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </ModuleWindow>
  )
}

/* ================= 2. Teams ================= */
const TEAM_CARDS = [
  { name: 'Design', prod: 91, time: '6h 52m', live: [8, 1, 1], status: ['ok', 'Active'] },
  { name: 'Engineering', prod: 84, time: '7h 05m', live: [29, 2, 3], status: ['ok', 'Active'] },
  { name: 'Marketing', prod: 79, time: '6h 31m', live: [11, 1, 2], status: ['ok', 'Active'] },
  { name: 'Operations', prod: 76, time: '6h 40m', live: [24, 2, 4], status: ['ok', 'Active'] },
  { name: 'Support', prod: 72, time: '6h 18m', live: [17, 1, 4], status: ['ok', 'Active'] },
  { name: 'Sales', prod: 58, time: '5h 46m', live: [11, 3, 4], status: ['warn', 'Needs attention'] },
]

export function TeamsMock() {
  return (
    <ModuleWindow
      module="teams"
      url="teams"
      title="Teams"
      actions={
        <>
          <Btn>Sort: Productivity ▾</Btn>
          <Btn icon="download" primary>
            Export CSV
          </Btn>
        </>
      }
    >
      <Kpis
        items={[
          { icon: 'layers', label: 'Total teams', value: '6', note: 'sorted by productivity' },
          { icon: 'users', label: 'Total employees', value: '128', note: '89 online now' },
          { icon: 'trendingUp', label: 'Avg productivity', value: '76%', delta: '+2 pts', tone: 'good', note: 'vs last month', spark: [71, 72, 74, 73, 75, 76] },
          { icon: 'clock', label: 'Avg work time', value: '6h 40m', note: 'per person / day', spark: [6.3, 6.5, 6.4, 6.6, 6.7, 6.7] },
        ]}
      />
      <div className="team-grid mk-teams">
        {TEAM_CARDS.map((t, i) => (
          <div className={`ps-card mk-team${t.status[0] === 'warn' ? ' warn' : ''}`} key={t.name}>
            <div className="mk-team-head">
              <span className="ps-team-badge" style={{ background: AVATAR_COLORS[i] }}>
                {t.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="mk-team-name">
                <b>{t.name}</b>
                <small>{t.live[0] + t.live[1] + t.live[2]} members</small>
              </span>
              <Chip tone={t.status[0]}>{t.status[1]}</Chip>
            </div>
            <div className="mk-team-metric">
              <strong>{t.prod}%</strong>
              <small>productivity · {t.time} avg</small>
            </div>
            <Bar value={t.prod} tone={t.prod < 65 ? 'pink' : 'green'} />
            <div className="mk-team-foot">
              <span className="mk-counts">
                <span>
                  <i className="ok" /> {t.live[0]}
                </span>
                <span>
                  <i className="privacy" /> {t.live[1]}
                </span>
                <span>
                  <i className="off" /> {t.live[2]}
                </span>
              </span>
              <span className="mk-stack-avatars">
                {['A R', 'K S', 'M J'].map((n, j) => (
                  <Avatar name={n} i={i + j} key={n} />
                ))}
                <em>+{t.live[0] + t.live[1] + t.live[2] - 3}</em>
              </span>
            </div>
          </div>
        ))}
      </div>
      <Card title="Engineering · members" meta="34 people · live" action="Working ▾" className="mk-members">
        <table className="ps-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Check-in</th>
              <th>Active</th>
              <th style={{ width: '22%' }}>Productivity</th>
              <th>Most used app</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Ananya Rao', ['ok', 'Work Mode'], '8:58 AM', '6h 52m', 88, 'VS Code'],
              ['Rohit Verma', ['ok', 'Work Mode'], '8:41 AM', '7h 20m', 81, 'Jira'],
              ['Kiran Das', ['privacy', 'Privacy Mode'], '9:10 AM', '5h 48m', 74, 'Figma'],
            ].map(([n, st, inT, act, prod, app], i) => (
              <tr key={n}>
                <td>
                  <span className="ps-person">
                    <Avatar name={n} i={i} />
                    {n}
                  </span>
                </td>
                <td>
                  <Chip tone={st[0]}>{st[1]}</Chip>
                </td>
                <td>{inT}</td>
                <td>{act}</td>
                <td>
                  <span className="ps-barcell">
                    <Bar value={prod} tone="green" />
                    <b>{prod}%</b>
                  </span>
                </td>
                <td>{app}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </ModuleWindow>
  )
}

/* ================= 3. Screenshots ================= */
const SHOTS = [
  { app: 'Figma', kind: 'design', color: '#f52998', time: '10:42 AM', tag: ['ok', 'Productive'] },
  { app: 'VS Code', kind: 'code', color: '#0aa1e8', time: '10:40 AM', tag: ['ok', 'Productive'] },
  { app: 'Private window', kind: 'doc', color: '#9aa1b8', time: '10:38 AM', tag: ['neutral', 'Neutral'], blur: true },
  { app: 'Google Docs', kind: 'doc', color: '#2f7cf6', time: '10:36 AM', tag: ['ok', 'Productive'] },
  { app: 'Slack', kind: 'chat', color: '#6a2cc7', time: '10:34 AM', tag: ['neutral', 'Neutral'] },
  { app: 'YouTube', kind: 'video', color: '#e6415f', time: '10:32 AM', tag: ['bad', 'Unproductive'] },
]

const SHOT_PEOPLE = [
  ['Engineering', 34, [['Ananya Rao', 'ok', true], ['Rohit Verma', 'ok'], ['Kiran Das', 'neutral']]],
  ['Design', 10, [['Meera Joshi', 'neutral'], ['Arjun Mehta', 'ok']]],
  ['Sales', 18, [['Karthik Subramanian', 'privacy']]],
]

function PeopleSide({ title }) {
  return (
    <div className="shot-side mk-side">
      <span className="mk-side-title">{title}</span>
      {SHOT_PEOPLE.map(([team, n, people]) => (
        <Fragment key={team}>
          <span className="mk-side-group">
            {team} <small>{n}</small>
          </span>
          {people.map(([name, tone, on], i) => (
            <span className={`mk-side-person${on ? ' on' : ''}`} key={name}>
              <i className={`mk-dot ${tone}`} />
              {name}
            </span>
          ))}
        </Fragment>
      ))}
    </div>
  )
}

export function ScreenshotsMock() {
  return (
    <ModuleWindow
      module="screenshots"
      url="screenshots?employee=ananya-rao"
      title="Screenshots"
      actions={
        <>
          <Btn icon="clock">Today ▾</Btn>
          <Btn icon="download" primary>
            Export list
          </Btn>
        </>
      }
    >
      <div className="shot-layout mk-split">
        <PeopleSide title="Teams" />
        <div className="mk-gallery">
          <div className="mk-toolbar">
            <span className="mk-person-head">
              <Avatar name="Ananya Rao" i={0} />
              <span>
                <b>Ananya Rao</b>
                <small>Engineering · 46 captures today · every 2 min</small>
              </span>
            </span>
            <span className="mk-seg">
              <span className="on">All</span>
              <span>Productive</span>
              <span>Neutral</span>
              <span>Unproductive</span>
            </span>
          </div>
          <div className="shot-grid mk-shots">
            {SHOTS.map((s) => (
              <div className="shot-card mk-shot" key={s.time}>
                <ScreenThumb kind={s.kind} color={s.color} blur={s.blur} />
                <div className="mk-shot-foot">
                  <span>
                    <b>{s.app}</b>
                    <small>{s.time}</small>
                  </span>
                  <Chip tone={s.tag[0]}>{s.tag[1]}</Chip>
                </div>
              </div>
            ))}
          </div>
          <small className="mk-audit">
            <Icon name="shield" size={11} /> Every view is logged to the audit trail · Blur is applied before anything is stored
          </small>
        </div>
      </div>
    </ModuleWindow>
  )
}

/* ================= 4. Video Recording ================= */
const SEGMENTS = [
  ['10:30 – 10:45', 'Figma', 'design', '#f52998', ['ok', 'Productive']],
  ['10:15 – 10:30', 'VS Code', 'code', '#0aa1e8', ['ok', 'Productive']],
  ['10:00 – 10:15', 'Private window', 'doc', '#9aa1b8', ['neutral', 'Blurred'], true],
  ['9:45 – 10:00', 'Slack', 'chat', '#6a2cc7', ['neutral', 'Neutral']],
]

export function VideoRecordingMock() {
  return (
    <ModuleWindow
      module="video"
      url="recordings?employee=ananya-rao"
      title="Video Recording"
      actions={
        <>
          <Btn icon="clock">Today ▾</Btn>
          <Btn icon="download" primary>
            Download
          </Btn>
        </>
      }
    >
      <Kpis
        items={[
          { icon: 'play', label: 'Recordings today', value: '342', note: 'segments' },
          { icon: 'clock', label: 'Segment length', value: '15', unit: ' min', note: 'set in Settings' },
          { icon: 'users', label: 'Employees recording', value: '89', note: 'of 128' },
          { icon: 'server', label: 'Storage used', value: '4.8', unit: ' GB', note: '7-day retention' },
        ]}
      />
      <div className="mk-row mk-video">
        <Card title="Ananya Rao · Session 3" meta="10:30 – 10:45 AM · Figma" action="Full screen ⤢">
          <div className="mk-player">
            <ScreenThumb kind="design" color="#f52998" />
            <span className="mk-play">
              <Icon name="play" size={18} />
            </span>
          </div>
          <div className="mk-scrub">
            <span className="mk-pp">
              <Icon name="play" size={11} />
            </span>
            <small>06:12</small>
            <span className="mk-track">
              <span className="mk-track-fill" style={{ width: '41%' }} />
              <span className="mk-track-knob" style={{ left: '41%' }} />
            </span>
            <small>15:00</small>
            <small className="mk-speed">1×</small>
          </div>
          <div className="mk-session-bar" title="Today's segments">
            {['ok', 'ok', 'ok', 'neutral', 'ok', 'blur', 'ok', 'ok', 'bad', 'ok', 'ok', 'ok', 'now'].map((t, i) => (
              <i className={t} key={i} />
            ))}
          </div>
          <small className="mk-session-axis">
            <span>9:00</span>
            <span>10:00</span>
            <span>11:00</span>
            <span>12:00</span>
          </small>
        </Card>
        <Card title="Segments" meta="Today · newest first">
          <ul className="mk-seglist">
            {SEGMENTS.map(([t, app, kind, c, tag, blur], i) => (
              <li className={i === 0 ? 'on' : ''} key={t}>
                <span className="mk-seg-thumb">
                  <ScreenThumb kind={kind} color={c} blur={blur} />
                </span>
                <span className="mk-seg-text">
                  <b>{t}</b>
                  <small>{app} · 15 min</small>
                </span>
                <Chip tone={tag[0]}>{tag[1]}</Chip>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </ModuleWindow>
  )
}

/* ================= 5. Location Tracking ================= */
export function LocationTrackingMock() {
  const people = [
    ['Ananya Rao', 'Office · HQ', 'ok', 'Inside', '9:02 AM'],
    ['Karthik Subramanian', 'Client · Infosys Park', 'info', 'Client site', '10:14 AM'],
    ['Meera Joshi', 'Home', 'neutral', 'Remote', '9:05 AM'],
    ['Rohit Verma', 'Office · HQ', 'ok', 'Inside', '8:41 AM'],
    ['Diya Kapoor', 'Outside work zones', 'bad', 'Exited 11:20', '—'],
  ]
  return (
    <ModuleWindow
      module="location"
      url="location"
      title="Location"
      actions={
        <>
          <Btn>All teams ▾</Btn>
          <Btn icon="clock">Live ▾</Btn>
          <Btn icon="download" primary>
            Export CSV
          </Btn>
        </>
      }
    >
      <Kpis
        items={[
          { icon: 'building', label: 'In office', value: '61', note: 'inside the HQ zone' },
          { icon: 'globe', label: 'Remote', value: '24', note: 'home zone' },
          { icon: 'briefcase', label: 'Client site', value: '9', note: '3 client zones' },
          { icon: 'flag', label: 'Geofence alerts', value: '2', tone: 'bad', delta: '2', note: 'exits today' },
        ]}
      />
      <div className="mock-main-grid loc-grid mk-row mk-loc">
        <Card title="Team map" meta="Live · updated 1 min ago" className="mock-panel">
          <div className="mk-map">
            <span className="mk-road h" style={{ top: '30%' }} />
            <span className="mk-road h" style={{ top: '68%' }} />
            <span className="mk-road v" style={{ left: '24%' }} />
            <span className="mk-road v" style={{ left: '62%' }} />
            <span className="mk-park" style={{ left: '66%', top: '6%', width: '22%', height: '20%' }} />
            <span className="mk-zone office" style={{ left: '30%', top: '36%', width: '26%' }}>
              <em>HQ office</em>
            </span>
            <span className="mk-zone client" style={{ left: '70%', top: '46%', width: '16%' }}>
              <em>Client site</em>
            </span>
            {[
              ['AR', '40%', '50%', 0],
              ['RV', '46%', '58%', 3],
              ['SK', '37%', '60%', 6],
              ['KS', '77%', '56%', 1],
              ['MJ', '12%', '20%', 2],
            ].map(([n, l, t, c]) => (
              <span className="mk-pin" key={n} style={{ left: l, top: t, background: AVATAR_COLORS[c] }}>
                <em>{n}</em>
              </span>
            ))}
            <span className="mk-pin alert" style={{ left: '90%', top: '84%' }}>
              <em>DK</em>
            </span>
            <span className="mk-map-legend">
              <span>
                <i className="office" /> Office
              </span>
              <span>
                <i className="client" /> Client
              </span>
              <span>
                <i className="alert" /> Alert
              </span>
            </span>
          </div>
        </Card>
        <Card title="Live location" meta="89 / 128 sharing" className="mock-panel">
          <div className="mk-live">
            {people.map(([n, zone, tone, state, since], i) => (
              <div className="live-row" key={n}>
                <Avatar name={n} i={i} />
                <span className="mk-live-text">
                  <b>{n}</b>
                  <small>
                    {zone} · since {since}
                  </small>
                </span>
                <Chip tone={tone}>{state}</Chip>
              </div>
            ))}
          </div>
          <small className="mk-audit">
            <Icon name="shield" size={11} /> Privacy Mode pauses GPS too · never shared with peers
          </small>
        </Card>
      </div>
    </ModuleWindow>
  )
}

/* ================= 6. Attendance ================= */
const ROWS = [
  { n: 'Ananya Rao', in: '8:58', out: 'Active', segs: [[8, 32, 'p'], [32, 36, 'n'], [36, 62, 'p'], [62, 66, 'u'], [66, 68, 'p']], st: ['ok', 'On time'] },
  { n: 'Karthik Subramanian', in: '9:24', out: 'Active', segs: [[12, 40, 'p'], [40, 50, 'v'], [50, 68, 'p']], st: ['warn', 'Late 24m'] },
  { n: 'Meera Joshi', in: '9:05', out: '4:10', segs: [[9, 30, 'p'], [30, 44, 'u'], [44, 58, 'p']], st: ['neutral', 'Left early'] },
  { n: 'Rohit Verma', in: '8:41', out: 'Active', segs: [[6, 38, 'p'], [38, 41, 'n'], [41, 68, 'p']], st: ['ok', 'On time'] },
  { n: 'Priya Nair', in: '9:01', out: 'Active', segs: [[8, 26, 'p'], [26, 34, 'n'], [34, 68, 'p']], st: ['ok', 'On time'] },
  { n: 'Daniel Brooks', in: '—', out: '—', segs: [], st: ['bad', 'Absent'] },
  { n: 'Sara Khan', in: '9:12', out: 'Active', segs: [[10, 44, 'p'], [44, 47, 'n'], [47, 68, 'p']], st: ['ok', 'On time'] },
  { n: 'Arjun Mehta', in: '8:52', out: 'Active', segs: [[7, 20, 'p'], [20, 30, 'v'], [30, 55, 'p'], [55, 60, 'u'], [60, 68, 'p']], st: ['ok', 'On time'] },
  { n: 'Kiran Das', in: '9:19', out: 'Active', segs: [[11, 36, 'p'], [36, 42, 'n'], [42, 68, 'p']], st: ['warn', 'Late 19m'] },
]

export function AttendanceMock() {
  const hours = ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM']
  return (
    <ModuleWindow
      module="attendance"
      url="attendance?view=timeline"
      title="Attendance"
      actions={
        <>
          <span className="mk-seg">
            <span>List</span>
            <span className="on">Timeline</span>
          </span>
          <Btn icon="clock">Today ▾</Btn>
          <Btn icon="download" primary>
            Export CSV
          </Btn>
        </>
      }
    >
      <Kpis
        items={[
          { icon: 'check', label: 'Present', value: '116', note: 'of 128 today' },
          { icon: 'clock', label: 'Late check-ins', value: '3', delta: '−2', tone: 'good', note: 'vs last week' },
          { icon: 'eyeOff', label: 'Absent', value: '12', note: 'no activity yet' },
          { icon: 'bolt', label: 'Avg check-in', value: '9:12', unit: ' AM', note: 'first activity of the day' },
        ]}
      />
      <Card title="Team timeline" meta="Engineering, Sales, Design + 3" action="Expected 9:00 AM · 15 min grace" className="mock-panel mk-grow">
        <div className="mk-gantt">
          <div className="mk-gantt-head">
            <span>Employee</span>
            <span>In</span>
            <span>Out</span>
            <span className="mk-gantt-hours">
              {hours.map((h) => (
                <small key={h}>{h}</small>
              ))}
            </span>
            <span>Status</span>
          </div>
          {ROWS.map((r, i) => (
            <div className="mk-gantt-row" key={r.n}>
              <span className="ps-person">
                <Avatar name={r.n} i={i} />
                <b>{r.n}</b>
              </span>
              <small>{r.in}</small>
              <small className={r.out === 'Active' ? 'mk-active' : ''}>{r.out}</small>
              <span className="mk-lane">
                {r.segs.length ? (
                  r.segs.map(([a, b, t], k) => <i key={k} className={t} style={{ left: `${a}%`, width: `${b - a}%` }} />)
                ) : (
                  <em>No activity today</em>
                )}
              </span>
              <Chip tone={r.st[0]}>{r.st[1]}</Chip>
            </div>
          ))}
          <span className="mk-now" style={{ '--x': 0.68 }}>
            <em>Now</em>
          </span>
        </div>
        <span className="ps-keyrow">
          <span>
            <i style={{ background: '#1fb87f' }} /> Productive
          </span>
          <span>
            <i style={{ background: '#9aa1b8' }} /> Neutral
          </span>
          <span>
            <i style={{ background: '#171b2f' }} /> Unproductive
          </span>
          <span>
            <i style={{ background: '#f0a83c' }} /> Privacy Mode
          </span>
        </span>
      </Card>
    </ModuleWindow>
  )
}

/* ================= 7. Reports ================= */
const REPORT_TABS = [
  ['bolt', 'Work Pulse'],
  ['heart', 'Burnout & Wellbeing'],
  ['target', 'Focus Score'],
  ['dollar', 'Tool Intelligence'],
  ['clock', 'Attendance & Punctuality'],
  ['trendingUp', 'Team Leaderboard'],
]

const HEAT = [
  ['Engineering', [30, 52, 78, 92, 95, 60, 72, 88, 70, 40]],
  ['Design', [42, 66, 84, 94, 90, 58, 76, 82, 64, 36]],
  ['Marketing', [28, 48, 70, 82, 80, 52, 66, 74, 58, 30]],
  ['Operations', [36, 58, 74, 80, 78, 56, 68, 70, 54, 34]],
  ['Support', [44, 62, 70, 72, 74, 60, 64, 66, 60, 46]],
  ['Sales', [22, 40, 58, 66, 62, 44, 50, 46, 34, 20]],
]

export function ReportsMock() {
  return (
    <ModuleWindow
      module="reports"
      url="reports/work-pulse"
      title="Reports"
      actions={
        <>
          <span className="mk-seg">
            <span className="on">Org</span>
            <span>Team</span>
            <span>Employee</span>
          </span>
          <Btn icon="clock">Last 30 days ▾</Btn>
          <Btn icon="download" primary>
            Export
          </Btn>
        </>
      }
    >
      <Kpis
        items={[
          { icon: 'target', label: 'Peak window', value: '10–11', unit: ' AM', note: 'org-wide' },
          { icon: 'clock', label: 'Avg focus session', value: '47', unit: ' min', delta: '+6 min', tone: 'good', note: 'vs last month' },
          { icon: 'eyeOff', label: 'Distraction time', value: '38', unit: ' min / day', delta: '−9 min', tone: 'good', note: 'vs last month' },
          { icon: 'trendingUp', label: 'Productive share', value: '74%', delta: '+3 pts', tone: 'good', note: 'vs last month', spark: [69, 70, 72, 71, 73, 74] },
        ]}
      />
      <div className="tile-row mk-tabs">
        {REPORT_TABS.map(([icon, label], i) => (
          <span className={i === 0 ? 'on' : ''} key={label}>
            <Icon name={icon} size={12} /> {label}
          </span>
        ))}
      </div>
      <div className="mk-row mk-reports">
        <Card title="Hourly productivity heat map" meta="By team · last 30 days" className="mock-panel">
          <div className="mk-heat">
            <span />
            {['9', '10', '11', '12', '1', '2', '3', '4', '5', '6'].map((h) => (
              <small key={h}>{h}</small>
            ))}
            {HEAT.map(([team, vals]) => (
              <Fragment key={team}>
                <small className="mk-heat-label">{team}</small>
                {vals.map((v, i) => (
                  <i key={i} style={{ background: `rgba(10, 161, 232, ${(v / 100) ** 1.6})` }} />
                ))}
              </Fragment>
            ))}
          </div>
        </Card>
        <Card title="Peak windows" meta="Org-wide">
          <ul className="mk-rank">
            {[
              ['10 – 11 AM', 100, 'Best'],
              ['3 – 4 PM', 82, ''],
              ['11 AM – 12', 78, ''],
            ].map(([w, v, tag]) => (
              <li key={w}>
                <span className="mk-rank-text">
                  <b>
                    {w} {tag && <Chip tone="ok">{tag}</Chip>}
                  </b>
                  <Bar value={v} tone="blue" />
                </span>
              </li>
            ))}
          </ul>
          <div className="mk-distract">
            <small>Top distraction sources</small>
            <span>
              <b>YouTube</b> 38m · <b>Instagram</b> 21m · <b>News</b> 14m
            </span>
          </div>
        </Card>
      </div>
      <div className="insight-row mk-insights">
        {[
          ['Friday productivity drop', 'Org-wide focus falls 18% after 3 PM on Fridays — consider lighter meeting loads.', 'warn', 'Attention'],
          ['Engineering focus up 22%', 'Deep-focus sessions rose sharply in week 3 — the sprint cadence is working.', 'ok', 'Improving'],
          ['Best window: 10–11 AM', 'The organisation does its best work here — protect it for focus blocks.', 'info', 'Insight'],
        ].map(([t, d, tone, tag]) => (
          <div className="ps-card mk-insight" key={t}>
            <span className="mk-insight-head">
              <span className="mk-ai">
                <Icon name="sparkle" size={11} /> Teemly AI
              </span>
              <Chip tone={tone}>{tag}</Chip>
            </span>
            <b>{t}</b>
            <small>{d}</small>
          </div>
        ))}
      </div>
    </ModuleWindow>
  )
}

/* ================= 8. Settings ================= */
const SETTINGS_NAV = [
  ['Organisation & People', [['Teams & Structure'], ['People & Roles']]],
  ['Work & Monitoring', [['Work Policy'], ['Monitoring Controls', true], ['Silent Tracking', false, true]]],
  ['Access & Controls', [['Org Defaults'], ['Permissions & Access']]],
]

function SettingRow({ label, desc, children }) {
  return (
    <div className="mk-setting">
      <span>
        <b>{label}</b>
        <small>{desc}</small>
      </span>
      {children}
    </div>
  )
}

export function SettingsMock() {
  return (
    <ModuleWindow
      module="settings"
      url="settings/monitoring"
      title="Settings"
      actions={
        <>
          <Btn>Discard</Btn>
          <Btn icon="check" primary>
            Save changes
          </Btn>
        </>
      }
    >
      <div className="settings-layout mk-settings">
        <div className="settings-nav mk-snav">
          {SETTINGS_NAV.map(([group, items]) => (
            <Fragment key={group}>
              <span className="mk-snav-group">{group}</span>
              {items.map(([label, on, locked], i) => (
                <span className={on ? 'on' : ''} key={label}>
                  {label}
                  {locked && <Icon name="lock" size={11} />}
                </span>
              ))}
            </Fragment>
          ))}
        </div>
        <div className="settings-panel ps-card mk-spanel">
          <div className="mk-spanel-head">
            <span>
              <b>Monitoring Controls</b>
              <small>Per employee, on top of org defaults</small>
            </span>
            <span className="mk-select">
              <Avatar name="Ananya Rao" i={0} /> Ananya Rao ▾
            </span>
            <Chip tone="info">Overrides org default</Chip>
          </div>
          <SettingRow label="Screenshot capture" desc="Synced to the desktop agent within 1 hour">
            <Toggle on />
          </SettingRow>
          <SettingRow label="Privacy blur" desc="The original image is never stored when on">
            <Toggle on />
          </SettingRow>
          <SettingRow label="Capture interval" desc="Professional plan · 2 min minimum">
            <span className="mk-select">2 min ▾</span>
          </SettingRow>
          <SettingRow label="Idle threshold" desc="No input for this long counts as idle">
            <span className="mk-select">5 min ▾</span>
          </SettingRow>
          <SettingRow label="Video recording" desc="Segment length for in-browser playback">
            <span className="mk-inline">
              <span className="mk-select">15 min ▾</span>
              <Toggle on />
            </span>
          </SettingRow>
          <SettingRow label="Location tracking" desc="Geofence check-ins · paused by Privacy Mode">
            <Toggle />
          </SettingRow>
          <div className="legal-card mk-legal">
            <span className="mk-legal-icon">
              <Icon name="shield" size={16} />
            </span>
            <span>
              <b>Silent Tracking · Legal gate</b>
              <small>
                Locked until an admin explicitly acknowledges local consent law. Enforced in the interface and the API.
              </small>
            </span>
            <span className="ps-btn mk-disabled">
              <Icon name="lock" size={11} /> Acknowledge to unlock
            </span>
          </div>
        </div>
      </div>
    </ModuleWindow>
  )
}
