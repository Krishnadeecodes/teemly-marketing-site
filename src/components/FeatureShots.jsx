import Icon from './Icon.jsx'
import { AVATAR_COLORS, Avatar, Bar, Card, Chip, Donut, ScreenThumb, Toggle } from './appUi.jsx'
import './featureShots.css'

/*
 * Focused product screenshots for the marketing pages: the two or three
 * panels that show what a feature does, larger and easy to read, in a light
 * browser frame — no sidebar or app chrome. (The Take a Tour player shows the
 * full app screens instead: ProductMockups.jsx.) Laid out for SHOT_W wide and
 * scaled down where there is less room. Sample data only, matching the rest
 * of the site.
 */

export const SHOT_W = 760

function Shot({ url, className = '', children }) {
  return (
    <div className={`ps-app fs ${className}`}>
      <div className="ps-chrome">
        <span className="ps-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="ps-url">
          <Icon name="lock" size={10} /> teemly.app/{url}
        </span>
        <span className="ps-chrome-end" />
      </div>
      <div className="fs-body">{children}</div>
    </div>
  )
}

/** One big number with a label and a change. */
function Stat({ icon, label, value, unit, delta, tone = 'good', note }) {
  return (
    <div className="ps-card fs-stat">
      <span className="fs-stat-label">
        <Icon name={icon} size={14} /> {label}
      </span>
      <strong>
        {value}
        {unit && <small>{unit}</small>}
      </strong>
      <span className={`fs-stat-note ${tone}`}>
        {delta && <b>{delta}</b>} {note}
      </span>
    </div>
  )
}

function ScoreRing({ value = 78, label = '/ 100 today', target = 75 }) {
  return (
    <span className="fs-ring">
      <Donut
        parts={[
          { v: value, color: '#1fb87f' },
          { v: 100 - value, color: '#e6e9f2' },
        ]}
      />
      {target && <span className="fs-ring-target" style={{ '--t': target }} />}
      <span className="ps-donut-center">
        <b>{value}</b>
        <small>{label}</small>
      </span>
    </span>
  )
}

function LiveList({ rows }) {
  return (
    <div className="fs-list">
      {rows.map(([name, tone, status, sub], i) => (
        <div className="fs-list-row" key={name}>
          <Avatar name={name} i={i} />
          <span className="fs-list-text">
            <b>{name}</b>
            <small>{sub}</small>
          </span>
          <Chip tone={tone}>{status}</Chip>
        </div>
      ))}
    </div>
  )
}

function WeekBars({ today = 4 }) {
  const week = [
    ['Mon', 5.6, 1.1],
    ['Tue', 5.9, 0.9],
    ['Wed', 6.1, 1.2],
    ['Thu', 5.8, 1.0],
    ['Fri', 6.3, 0.8],
    ['Sat', 1.2, 0.3],
    ['Sun', 0.4, 0.1],
  ]
  return (
    <div className="fs-bars">
      {week.map(([d, p, u], i) => (
        <span className={`fs-bar${i === today ? ' today' : ''}`} key={d}>
          {i === today && <em>{d} · 6h 18m</em>}
          <span className="fs-bar-stack">
            <i className="u" style={{ height: `${(u / 8) * 100}%` }} />
            <i className="p" style={{ height: `${(p / 8) * 100}%` }} />
          </span>
          <small>{d}</small>
        </span>
      ))}
    </div>
  )
}

function Legend({ items }) {
  return (
    <span className="ps-keyrow fs-legend">
      {items.map(([label, color]) => (
        <span key={label}>
          <i style={{ background: color }} /> {label}
        </span>
      ))}
    </span>
  )
}

function Timeline({ rows, now = 0.68 }) {
  return (
    <div className="fs-gantt">
      <div className="fs-gantt-axis">
        <span />
        <span className="fs-gantt-hours">
          {['9 AM', '12 PM', '3 PM', '6 PM'].map((h) => (
            <small key={h}>{h}</small>
          ))}
        </span>
        <span />
      </div>
      {rows.map(([name, segs, st], i) => (
        <div className="fs-gantt-row" key={name}>
          <span className="ps-person">
            <Avatar name={name} i={i} />
            <b>{name}</b>
          </span>
          <span className="fs-lane">
            {segs.length ? segs.map(([a, b, t], k) => <i key={k} className={t} style={{ left: `${a}%`, width: `${b - a}%` }} />) : <em>No activity today</em>}
          </span>
          <Chip tone={st[0]}>{st[1]}</Chip>
        </div>
      ))}
      <span className="fs-now" style={{ '--x': now }}>
        <em>Now</em>
      </span>
    </div>
  )
}

// attendance by team (a team's working day, from first to last activity)
const LANES = [
  [
    'Engineering',
    [
      [4, 34, 'p'],
      [34, 38, 'n'],
      [38, 68, 'p'],
    ],
    ['ok', '94% on time'],
  ],
  [
    'Design',
    [
      [6, 40, 'p'],
      [40, 44, 'n'],
      [44, 68, 'p'],
    ],
    ['ok', '100% on time'],
  ],
  [
    'Sales',
    [
      [12, 40, 'p'],
      [40, 50, 'v'],
      [50, 68, 'p'],
    ],
    ['warn', '3 late'],
  ],
  [
    'Support',
    [
      [2, 30, 'p'],
      [30, 36, 'u'],
      [36, 62, 'p'],
    ],
    ['neutral', '2 left early'],
  ],
  [
    'Operations',
    [
      [5, 42, 'p'],
      [42, 45, 'n'],
      [45, 68, 'p'],
    ],
    ['ok', '96% on time'],
  ],
]

const LANE_KEY = [
  ['Productive', '#1fb87f'],
  ['Neutral', '#9aa1b8'],
  ['Unproductive', '#171b2f'],
  ['Privacy Mode', '#f0a83c'],
]

/* ================= Module screenshots ================= */

export function DashboardShot() {
  return (
    <Shot url="dashboard">
      <div className="fs-grid" style={{ gridTemplateColumns: '0.85fr 1.15fr' }}>
        <Card title="Org Productivity Score" meta="Today">
          <div className="fs-center">
            <ScoreRing />
            <Legend
              items={[
                ['Productive 78%', '#1fb87f'],
                ['Idle 14%', '#c9cee0'],
              ]}
            />
          </div>
        </Card>
        <Card title="Team health" meta="6 teams · this month">
          <LiveList
            rows={[
              ['Design', 'ok', 'On track', '91% productive · 10 people'],
              ['Engineering', 'ok', 'On track', '84% productive · 34 people'],
              ['Support', 'neutral', 'Steady', '72% productive · 22 people'],
              ['Sales', 'warn', 'Needs attention', '58% productive · 18 people'],
            ]}
          />
        </Card>
      </div>
      <Card title="Work Summary" meta="This week · productive vs unproductive hours">
        <WeekBars />
      </Card>
    </Shot>
  )
}

const TEAMS = [
  ['Design', 10, 91, ['ok', 'Active']],
  ['Engineering', 34, 84, ['ok', 'Active']],
  ['Sales', 18, 58, ['warn', 'Needs attention']],
]

export function TeamsShot() {
  return (
    <Shot url="teams">
      <div className="fs-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        {TEAMS.map(([name, members, prod, st], i) => (
          <div className={`ps-card fs-team${st[0] === 'warn' ? ' warn' : ''}`} key={name}>
            <span className="fs-team-head">
              <span className="ps-team-badge" style={{ background: AVATAR_COLORS[i] }}>
                {name.slice(0, 2).toUpperCase()}
              </span>
              <span>
                <b>{name}</b>
                <small>{members} members</small>
              </span>
            </span>
            <strong className="fs-team-pct">{prod}%</strong>
            <small>productivity this month</small>
            <Bar value={prod} tone={prod < 65 ? 'pink' : 'green'} />
            <Chip tone={st[0]}>{st[1]}</Chip>
          </div>
        ))}
      </div>
      <Card title="Teams compared" meta="This month">
        <table className="ps-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Focus time / day</th>
              <th>Trend</th>
              <th style={{ width: '30%' }}>Productivity</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Design', '5h 12m', '+4 pts', 91],
              ['Engineering', '4h 48m', '+2 pts', 84],
              ['Sales', '2h 26m', '−6 pts', 58],
            ].map(([n, focus, trend, prod], i) => (
              <tr key={n}>
                <td>
                  <span className="ps-team">
                    <span className="ps-team-badge" style={{ background: AVATAR_COLORS[i] }}>
                      {n.slice(0, 2).toUpperCase()}
                    </span>
                    {n}
                  </span>
                </td>
                <td>{focus}</td>
                <td className={trend.startsWith('−') ? 'ps-down' : 'ps-up'}>{trend}</td>
                <td>
                  <span className="ps-barcell">
                    <Bar value={prod} tone={prod < 65 ? 'pink' : 'green'} />
                    <b>{prod}%</b>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Shot>
  )
}

const CAPTURES = [
  ['Figma', 'Design', 'design', '#f52998', ['ok', 'Productive']],
  ['VS Code', 'Engineering', 'code', '#0aa1e8', ['ok', 'Productive']],
  ['Private window', 'Blur on', 'doc', '#9aa1b8', ['neutral', 'Blurred'], true],
  ['Google Docs', 'Operations', 'doc', '#2f7cf6', ['ok', 'Productive']],
  ['Slack', 'Support', 'chat', '#6a2cc7', ['neutral', 'Neutral']],
  ['YouTube', 'Sales', 'video', '#e6415f', ['bad', 'Unproductive']],
]

export function ScreenshotsShot() {
  return (
    <Shot url="screenshots">
      <div className="fs-toolbar">
        <span className="fs-capture-stats">
          <b>All teams · this week</b>
          <span>
            <Chip tone="ok">74% productive</Chip>
            <Chip tone="neutral">18% neutral</Chip>
            <Chip tone="bad">8% unproductive</Chip>
          </span>
        </span>
        <span className="fs-seg">
          <span className="on">All</span>
          <span>Productive</span>
          <span>Unproductive</span>
        </span>
      </div>
      <div className="fs-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        {CAPTURES.map(([app, team, kind, color, tag, blur]) => (
          <div className="ps-card fs-capture" key={app}>
            <ScreenThumb kind={kind} color={color} blur={blur} />
            <span className="fs-capture-foot">
              <span>
                <b>{app}</b>
                <small>{team}</small>
              </span>
              <Chip tone={tag[0]}>{tag[1]}</Chip>
            </span>
          </div>
        ))}
      </div>
    </Shot>
  )
}

export function VideoRecordingShot() {
  return (
    <Shot url="recordings">
      <div className="fs-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <Card title="Design · Figma session" meta="15-min segment · in-browser playback">
          <span className="fs-player">
            <span className="fs-zoom">
              <ScreenThumb kind="design" color="#f52998" />
            </span>
            <span className="fs-play">
              <Icon name="play" size={20} />
            </span>
          </span>
          <span className="fs-scrub">
            <span className="fs-pp">
              <Icon name="play" size={12} />
            </span>
            <small>06:12</small>
            <span className="fs-track">
              <span style={{ width: '41%' }} />
            </span>
            <small>15:00</small>
          </span>
          <span className="fs-segments">
            {['ok', 'ok', 'ok', 'neutral', 'ok', 'blur', 'ok', 'ok', 'bad', 'ok', 'ok', 'now'].map((t, i) => (
              <i className={t} key={i} />
            ))}
          </span>
        </Card>
        <Card title="Segments" meta="Tagged automatically">
          <div className="fs-seglist">
            {[
              ['Figma', 'Design · productive', 'design', '#f52998', ['ok', 'Playing']],
              ['VS Code', 'Engineering · productive', 'code', '#0aa1e8', ['ok', 'Productive']],
              ['Private window', 'Blurred before storage', 'doc', '#9aa1b8', ['neutral', 'Blurred'], true],
              ['Slack', 'Support · neutral', 'chat', '#6a2cc7', ['neutral', 'Neutral']],
            ].map(([t, app, kind, c, tag, blur], i) => (
              <span className={`fs-seg-row${i === 0 ? ' on' : ''}`} key={t}>
                <span className="fs-seg-thumb">
                  <ScreenThumb kind={kind} color={c} blur={blur} />
                </span>
                <span className="fs-seg-text">
                  <b>{t}</b>
                  <small>{app}</small>
                </span>
              </span>
            ))}
          </div>
        </Card>
      </div>
    </Shot>
  )
}

const LOCATION_MIX = [
  ['Engineering', 70, 26, 4],
  ['Sales', 22, 18, 60],
  ['Design', 80, 20, 0],
  ['Support', 55, 45, 0],
]

export function LocationTrackingShot() {
  return (
    <Shot url="location">
      <div className="fs-grid" style={{ gridTemplateColumns: '1.25fr 1fr' }}>
        <Card title="Work locations" meta="Today · geofenced zones">
          <span className="fs-map">
            <span className="fs-road h" style={{ top: '34%' }} />
            <span className="fs-road v" style={{ left: '62%' }} />
            <span className="fs-zone office" style={{ left: '12%', top: '30%', width: '36%' }}>
              <em>HQ office</em>
            </span>
            <span className="fs-zone client" style={{ left: '66%', top: '8%', width: '26%' }}>
              <em>Client sites</em>
            </span>
            <span className="fs-count office" style={{ left: '30%', top: '62%' }}>
              61
            </span>
            <span className="fs-count client" style={{ left: '79%', top: '30%' }}>
              9
            </span>
            <span className="fs-count remote" style={{ left: '82%', top: '74%' }}>
              24 <small>remote</small>
            </span>
          </span>
        </Card>
        <Card title="Location mix by team" meta="Office · remote · client">
          <div className="fs-mix">
            {LOCATION_MIX.map(([team, office, remote, client]) => (
              <span key={team}>
                <b>{team}</b>
                <span className="fs-mix-bar">
                  <i className="office" style={{ flex: office }} />
                  <i className="remote" style={{ flex: remote }} />
                  <i className="client" style={{ flex: client }} />
                </span>
              </span>
            ))}
          </div>
          <Legend
            items={[
              ['Office', '#0aa1e8'],
              ['Remote', '#9aa1b8'],
              ['Client', '#6a2cc7'],
            ]}
          />
          <span className="fs-mix-alert">
            <Chip tone="warn">2 geofence alerts today</Chip>
          </span>
        </Card>
      </div>
    </Shot>
  )
}

export function AttendanceShot() {
  return (
    <Shot url="attendance">
      <Card title="Attendance by team" meta="Today · check-in is the first activity of the day">
        <Timeline rows={LANES} />
        <Legend items={LANE_KEY} />
      </Card>
    </Shot>
  )
}

const REPORTS = ['Work Pulse', 'Burnout & Wellbeing', 'Focus Score', 'Tool Intelligence', 'Attendance', 'Leaderboard']
const HEAT = [
  ['Engineering', [30, 52, 78, 92, 95, 60, 72, 88, 70, 40]],
  ['Design', [42, 66, 84, 94, 90, 58, 76, 82, 64, 36]],
  ['Sales', [22, 40, 58, 66, 62, 44, 50, 46, 34, 20]],
]

export function ReportsShot() {
  return (
    <Shot url="reports/work-pulse">
      <span className="fs-tabs">
        {REPORTS.map((r, i) => (
          <span className={i === 0 ? 'on' : ''} key={r}>
            {r}
          </span>
        ))}
      </span>
      <Card title="Hourly productivity" meta="By team · last 30 days">
        <span className="fs-heat">
          <span />
          {['9', '10', '11', '12', '1', '2', '3', '4', '5', '6'].map((h) => (
            <small key={h}>{h}</small>
          ))}
          {HEAT.flatMap(([team, vals]) => [
            <small className="fs-heat-label" key={team}>
              {team}
            </small>,
            ...vals.map((v, i) => <i key={`${team}${i}`} style={{ background: `rgba(10, 161, 232, ${(v / 100) ** 1.6})` }} />),
          ])}
        </span>
      </Card>
      <div className="ps-card fs-insight">
        <span className="fs-ai">
          <Icon name="sparkle" size={13} /> Teemly AI
        </span>
        <b>Friday afternoons are your quietest window</b>
        <small>Org-wide focus falls 18% after 3 PM on Fridays — consider lighter meeting loads.</small>
      </div>
    </Shot>
  )
}

export function SettingsShot() {
  const rows = [
    ['Screenshot capture', 'Synced to the desktop agent within 1 hour', <Toggle on key="t" />],
    ['Privacy blur', 'The original image is never stored when on', <Toggle on key="t" />],
    [
      'Capture interval',
      'Professional plan · 2 min minimum',
      <span className="fs-select" key="s">
        2 min ▾
      </span>,
    ],
    [
      'Idle threshold',
      'No input for this long counts as idle',
      <span className="fs-select" key="s">
        5 min ▾
      </span>,
    ],
  ]
  return (
    <Shot url="settings/monitoring">
      <div className="ps-card fs-settings">
        <span className="fs-settings-head">
          <span>
            <b>Monitoring policy</b>
            <small>Org-wide defaults · any person or team can be set differently</small>
          </span>
          <span className="fs-select">All teams ▾</span>
        </span>
        {rows.map(([label, desc, control]) => (
          <span className="fs-setting" key={label}>
            <span>
              <b>{label}</b>
              <small>{desc}</small>
            </span>
            {control}
          </span>
        ))}
      </div>
      <div className="ps-card fs-legal">
        <span className="fs-legal-icon">
          <Icon name="shield" size={18} />
        </span>
        <span>
          <b>Silent Tracking · Legal gate</b>
          <small>Locked until an admin acknowledges local consent law. Enforced in the interface and the API.</small>
        </span>
        <Icon name="lock" size={16} />
      </div>
    </Shot>
  )
}

/* ================= Platform area screenshots (home page) ================= */

// Organizational Intelligence: signals from people, work and technology
// become one score, and the score becomes an action.
function OrgArea() {
  const weeks = [66, 68, 67, 70, 69, 72, 71, 73, 74, 73, 76, 78]
  const line = weeks.map((v, i) => `${(i / (weeks.length - 1)) * 200},${40 - ((v - 64) / 16) * 36}`).join(' ')
  const signals = [
    ['users', 'People', '128 employees', '89 online now', 'blue'],
    ['monitor', 'Work', '74% productive', 'time this week', 'green'],
    ['cpu', 'Technology', '46 apps', 'tagged automatically', 'purple'],
  ]
  return (
    <div className="fs-org">
      <div className="fs-org-col">
        <span className="fs-org-label">Signals</span>
        {signals.map(([icon, name, value, note, tone]) => (
          <div className="ps-card fs-signal" key={name}>
            <span className={`fs-signal-icon ${tone}`}>
              <Icon name={icon} size={16} />
            </span>
            <span>
              <small>{name}</small>
              <b>{value}</b>
              <small>{note}</small>
            </span>
          </div>
        ))}
      </div>

      <span className="fs-org-arrow" aria-hidden="true" />

      <div className="fs-org-col">
        <span className="fs-org-label">Intelligence</span>
        <div className="ps-card fs-org-score">
          <small>Org productivity score</small>
          <ScoreRing label="/ 100" target={null} />
          <span className="fs-org-delta">↑ 3 pts vs last month</span>
          <svg className="fs-org-trend" viewBox="0 0 200 44" preserveAspectRatio="none" aria-hidden="true">
            <polyline points={line} />
          </svg>
          <small>Last 12 weeks</small>
        </div>
      </div>

      <span className="fs-org-arrow" aria-hidden="true" />

      <div className="fs-org-col">
        <span className="fs-org-label">Action</span>
        <div className="ps-card fs-org-alert">
          <span className="fs-org-alert-head">
            <span className="ps-team-badge" style={{ background: AVATAR_COLORS[5] }}>
              SA
            </span>
            <Chip tone="warn">Needs attention</Chip>
          </span>
          <b>Sales · 58%</b>
          <small>Productivity down 6 pts this month</small>
        </div>
        <div className="ps-card fs-org-ai">
          <span className="fs-ai">
            <Icon name="sparkle" size={12} /> Teemly AI
          </span>
          <b>Move Sales reviews to Friday afternoon</b>
          <small>Your quietest window — frees up focus time.</small>
          <span className="fs-org-cta">
            View report <Icon name="arrowRight" size={12} />
          </span>
        </div>
      </div>
    </div>
  )
}

function WorkforceArea() {
  const teams = [
    ['Design', 91],
    ['Engineering', 84],
    ['Marketing', 79],
    ['Support', 72],
    ['Sales', 58],
  ]
  return (
    <>
      <div className="fs-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        <Stat icon="layers" label="Teams" value="6" note="128 people" />
        <Stat icon="trendingUp" label="Avg productivity" value="76%" delta="+2 pts" note="vs last month" />
        <Stat icon="heart" label="Burnout risk" value="3" unit=" people" delta="+1" tone="bad" note="vs last month" />
      </div>
      <div className="fs-grid" style={{ gridTemplateColumns: '1.3fr 1fr' }}>
        <Card title="Teams by productivity" meta="This month">
          <div className="fs-rank">
            {teams.map(([t, v], i) => (
              <span key={t}>
                <span className="ps-team-badge" style={{ background: AVATAR_COLORS[i] }}>
                  {t.slice(0, 2).toUpperCase()}
                </span>
                <b>{t}</b>
                <Bar value={v} tone={v < 65 ? 'pink' : 'green'} />
                <em>{v}%</em>
              </span>
            ))}
          </div>
        </Card>
        <Card title="Burnout & Wellbeing" meta="Teams above usual hours">
          <LiveList
            rows={[
              ['Engineering', 'warn', '+1h 40m', '3 people · 2 weeks'],
              ['Support', 'warn', '+1h 15m', '2 people · 2 weeks'],
              ['Sales', 'warn', '+58m', '1 person · 1 week'],
            ]}
          />
        </Card>
      </div>
    </>
  )
}

function WorkArea() {
  const apps = [
    ['VS Code', '#0aa1e8', 92, '2h 10m', 'ok'],
    ['Figma', '#f52998', 62, '1h 25m', 'ok'],
    ['Google Docs', '#2f7cf6', 48, '1h 05m', 'ok'],
    ['Slack', '#6a2cc7', 34, '48m', 'neutral'],
    ['YouTube', '#e6415f', 9, '12m', 'bad'],
  ]
  return (
    <>
      <div className="fs-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        <Stat icon="check" label="Productive time" value="74%" delta="+3 pts" note="vs last week" />
        <Stat icon="monitor" label="Apps & sites" value="46" note="tagged automatically" />
        <Stat icon="target" label="Avg focus session" value="47" unit=" min" delta="+6 min" note="vs last month" />
      </div>
      <div className="fs-grid" style={{ gridTemplateColumns: '0.8fr 1.2fr' }}>
        <Card title="Time breakdown" meta="This week">
          <div className="fs-center">
            <span className="fs-ring">
              <Donut
                parts={[
                  { v: 74, color: '#1fb87f' },
                  { v: 18, color: '#c9cee0' },
                  { v: 8, color: '#171b2f' },
                ]}
              />
              <span className="ps-donut-center">
                <b>74%</b>
                <small>productive</small>
              </span>
            </span>
            <Legend
              items={[
                ['Neutral 18%', '#c9cee0'],
                ['Unproductive 8%', '#171b2f'],
              ]}
            />
          </div>
        </Card>
        <Card title="Top apps & websites" meta="Tagged automatically">
          <div className="fs-rank">
            {apps.map(([n, c, v, t, tone]) => (
              <span key={n}>
                <span className="ps-appicon" style={{ background: c }}>
                  {n[0]}
                </span>
                <b>{n}</b>
                <Bar value={v} tone={tone === 'bad' ? 'dark' : tone === 'neutral' ? 'grey' : 'green'} />
                <em>{t}</em>
              </span>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}

function WorkflowArea() {
  return (
    <>
      <div className="fs-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        <Stat icon="check" label="On time" value="92%" delta="+3 pts" note="vs last week" />
        <Stat icon="bolt" label="Avg check-in" value="9:12" unit=" AM" note="from real activity" />
        <Stat icon="clock" label="Late arrivals" value="3" delta="−2" note="vs last week" />
      </div>
      <Card title="Attendance by team" meta="Today">
        <Timeline rows={LANES.slice(0, 4)} />
      </Card>
    </>
  )
}

function AiArea() {
  const reports = [
    ['heart', 'Burnout & Wellbeing', '3 people above their usual hours for 2 weeks.', ['warn', 'Attention']],
    ['target', 'Focus Score', 'Engineering focus time is up 22% this sprint.', ['ok', 'Improving']],
    ['dollar', 'Tool Intelligence', '6 unused design licences — ₹14,400 a month.', ['pink', 'Save']],
  ]
  return (
    <>
      <div className="ps-card fs-ai-banner">
        <span className="fs-ai-icon">
          <Icon name="sparkle" size={20} />
        </span>
        <span>
          <span className="fs-ai">Teemly AI · Recommended</span>
          <b>Move Sales reviews to Friday afternoon</b>
          <small>Focus time in Sales is down 18% since the new review cadence — Friday afternoon is your quietest window.</small>
        </span>
      </div>
      <div className="fs-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        {reports.map(([icon, name, note, tag]) => (
          <div className="ps-card fs-report" key={name}>
            <span className="fs-report-head">
              <span className="fs-report-icon">
                <Icon name={icon} size={14} />
              </span>
              <Chip tone={tag[0]}>{tag[1]}</Chip>
            </span>
            <b>{name}</b>
            <small>{note}</small>
          </div>
        ))}
      </div>
    </>
  )
}

const AREAS = [
  ['intelligence/organizational', OrgArea],
  ['intelligence/workforce', WorkforceArea],
  ['intelligence/work', WorkArea],
  ['intelligence/workflow', WorkflowArea],
  ['intelligence/ai', AiArea],
]

/** The home page Platform section's screenshot for intelligence area `index`. */
export function PlatformShot({ index }) {
  const [url, Area] = AREAS[index]
  return (
    <Shot url={url} className="fs-platform">
      <div className="fs-swap" key={index}>
        <Area />
      </div>
    </Shot>
  )
}
