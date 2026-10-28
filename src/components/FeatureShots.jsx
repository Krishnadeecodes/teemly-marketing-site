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

const LANES = [
  [
    'Ananya Rao',
    [
      [4, 34, 'p'],
      [34, 38, 'n'],
      [38, 68, 'p'],
    ],
    ['ok', 'On time'],
  ],
  [
    'Karthik S.',
    [
      [10, 40, 'p'],
      [40, 50, 'v'],
      [50, 68, 'p'],
    ],
    ['warn', 'Late 24m'],
  ],
  [
    'Meera Joshi',
    [
      [6, 30, 'p'],
      [30, 42, 'u'],
      [42, 56, 'p'],
    ],
    ['neutral', 'Left early'],
  ],
  [
    'Rohit Verma',
    [
      [2, 40, 'p'],
      [40, 43, 'n'],
      [43, 68, 'p'],
    ],
    ['ok', 'On time'],
  ],
  ['Daniel Brooks', [], ['bad', 'Absent']],
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
        <Card title="Live Activity" meta="89 / 128 online">
          <LiveList
            rows={[
              ['Ananya Rao', 'ok', 'Work Mode', 'VS Code'],
              ['Karthik Subramanian', 'privacy', 'Privacy Mode', 'Paused by employee'],
              ['Meera Joshi', 'neutral', 'Offline · 12m', 'Last seen 10:31'],
              ['Rohit Verma', 'ok', 'Work Mode', 'Jira'],
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
      <Card title="Engineering · members" meta="Live">
        <table className="ps-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Active today</th>
              <th style={{ width: '30%' }}>Productivity</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Ananya Rao', ['ok', 'Work Mode'], '6h 52m', 88],
              ['Rohit Verma', ['ok', 'Work Mode'], '7h 20m', 81],
              ['Kiran Das', ['privacy', 'Privacy Mode'], '5h 48m', 74],
            ].map(([n, st, act, prod], i) => (
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
                <td>{act}</td>
                <td>
                  <span className="ps-barcell">
                    <Bar value={prod} tone="green" />
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
  ['Figma', 'design', '#f52998', '10:42 AM', ['ok', 'Productive']],
  ['VS Code', 'code', '#0aa1e8', '10:40 AM', ['ok', 'Productive']],
  ['Private window', 'doc', '#9aa1b8', '10:38 AM', ['neutral', 'Blurred'], true],
  ['Google Docs', 'doc', '#2f7cf6', '10:36 AM', ['ok', 'Productive']],
  ['Slack', 'chat', '#6a2cc7', '10:34 AM', ['neutral', 'Neutral']],
  ['YouTube', 'video', '#e6415f', '10:32 AM', ['bad', 'Unproductive']],
]

export function ScreenshotsShot() {
  return (
    <Shot url="screenshots">
      <div className="fs-toolbar">
        <span className="ps-person">
          <Avatar name="Ananya Rao" i={0} />
          <span>
            <b>Ananya Rao</b>
            <small>Engineering · 46 captures today</small>
          </span>
        </span>
        <span className="fs-seg">
          <span className="on">All</span>
          <span>Productive</span>
          <span>Unproductive</span>
        </span>
      </div>
      <div className="fs-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        {CAPTURES.map(([app, kind, color, time, tag, blur]) => (
          <div className="ps-card fs-capture" key={time}>
            <ScreenThumb kind={kind} color={color} blur={blur} />
            <span className="fs-capture-foot">
              <span>
                <b>{app}</b>
                <small>{time}</small>
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
        <Card title="Ananya Rao · Session 3" meta="10:30 – 10:45 AM">
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
        <Card title="Segments" meta="Today · 15 min each">
          <div className="fs-seglist">
            {[
              ['10:30 – 10:45', 'Figma', 'design', '#f52998', ['ok', 'Playing']],
              ['10:15 – 10:30', 'VS Code', 'code', '#0aa1e8', ['ok', 'Productive']],
              ['10:00 – 10:15', 'Private window', 'doc', '#9aa1b8', ['neutral', 'Blurred'], true],
              ['9:45 – 10:00', 'Slack', 'chat', '#6a2cc7', ['neutral', 'Neutral']],
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

export function LocationTrackingShot() {
  return (
    <Shot url="location">
      <div className="fs-grid" style={{ gridTemplateColumns: '1.25fr 1fr' }}>
        <Card title="Team map" meta="Live">
          <span className="fs-map">
            <span className="fs-road h" style={{ top: '34%' }} />
            <span className="fs-road v" style={{ left: '62%' }} />
            <span className="fs-zone office" style={{ left: '12%', top: '30%', width: '36%' }}>
              <em>HQ office</em>
            </span>
            <span className="fs-zone client" style={{ left: '66%', top: '8%', width: '26%' }}>
              <em>Client site</em>
            </span>
            {[
              ['AR', '26%', '54%', 0],
              ['RV', '36%', '68%', 3],
              ['KS', '79%', '28%', 1],
            ].map(([n, l, t, c]) => (
              <span className="fs-pin" key={n} style={{ left: l, top: t, background: AVATAR_COLORS[c] }}>
                <em>{n}</em>
              </span>
            ))}
            <span className="fs-pin alert" style={{ left: '86%', top: '86%' }}>
              <em>DK</em>
            </span>
          </span>
        </Card>
        <Card title="Live location" meta="Geofenced">
          <LiveList
            rows={[
              ['Ananya Rao', 'ok', 'In office', 'HQ · since 9:02 AM'],
              ['Karthik S.', 'info', 'Client site', 'Infosys Park'],
              ['Meera Joshi', 'neutral', 'Remote', 'Home zone'],
              ['Diya Kapoor', 'bad', 'Exited', 'Left zone 11:20'],
            ]}
          />
        </Card>
      </div>
    </Shot>
  )
}

export function AttendanceShot() {
  return (
    <Shot url="attendance">
      <Card title="Team timeline" meta="Today · check-in is the first activity of the day">
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
            <b>Monitoring Controls</b>
            <small>Per employee, on top of org defaults</small>
          </span>
          <span className="fs-select">
            <Avatar name="Ananya Rao" i={0} /> Ananya Rao ▾
          </span>
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

function OrgArea() {
  const weeks = [66, 68, 67, 70, 69, 72, 71, 73, 74, 73, 76, 78]
  const x = (i) => (i / (weeks.length - 1)) * 600
  const y = (v) => 150 - ((v - 60) / 25) * 140
  const line = weeks.map((v, i) => `${x(i)},${y(v)}`).join(' ')
  return (
    <>
      <div className="fs-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        <Stat icon="users" label="Employees" value="128" note="across 6 teams" />
        <Stat icon="trendingUp" label="Org score" value="78" unit="/100" delta="+3 pts" note="vs last month" />
        <Stat icon="clock" label="Avg work time" value="6h 40m" note="per person / day" />
      </div>
      <Card title="Org productivity score" meta="Last 12 weeks">
        <svg className="fs-line" viewBox="0 0 600 160" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="fsArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0aa1e8" stopOpacity="0.25" />
              <stop offset="1" stopColor="#0aa1e8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line className="target" x1="0" x2="600" y1={y(75)} y2={y(75)} />
          <polygon points={`0,160 ${line} 600,160`} fill="url(#fsArea)" />
          <polyline points={line} />
        </svg>
        <span className="fs-axis">
          <small>W1</small>
          <small>W4</small>
          <small>W8</small>
          <small>W12 · 78</small>
        </span>
      </Card>
    </>
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
        <Card title="Burnout & Wellbeing" meta="Above usual hours">
          <LiveList
            rows={[
              ['Rohit Verma', 'warn', '+1h 40m', 'Engineering'],
              ['Priya Nair', 'warn', '+1h 15m', 'Support'],
              ['Vikram Shah', 'warn', '+58m', 'Sales'],
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
      <Card title="Attendance timeline" meta="Today">
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
