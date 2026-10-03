import { Fragment } from 'react'
import Icon from './Icon.jsx'
import './mock.css'

export function MockFrame({ title, children }) {
  return (
    <div className="mock-frame">
      <div className="mock-chrome">
        <span className="mock-dot r" />
        <span className="mock-dot y" />
        <span className="mock-dot g" />
        <span className="mock-chrome-title">{title}</span>
      </div>
      <div className="mock-body">{children}</div>
    </div>
  )
}

const teamColors = ['#0aa1e8', '#f52998', '#6a2cc7', '#1fb87f', '#e21f5c', '#04b8c4']

function Avatar({ initials, i = 0 }) {
  return (
    <span className="avatar" style={{ background: teamColors[i % teamColors.length] }}>
      {initials}
    </span>
  )
}

/* ================= 1. Dashboard ================= */
export function DashboardMock() {
  const stats = [
    { l: 'Total Employees', v: '128', t: null },
    { l: 'Checked In', v: '89', t: '+4% vs yesterday', up: true },
    { l: 'Absent', v: '12', t: '-2 vs yesterday', up: true },
    { l: 'Avg Productivity / Day', v: '6h 12m', t: '+3% vs prev.', up: true },
  ]
  const bars = [62, 74, 58, 81, 90, 40, 20]
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const live = [
    { n: 'Ananya R.', s: 'Work Mode', dot: 'productive' },
    { n: 'Karthik S.', s: 'Privacy Mode', dot: 'privacy' },
    { n: 'Meera J.', s: 'Offline · 12m', dot: 'unproductive' },
    { n: 'Rohit V.', s: 'Work Mode', dot: 'productive' },
  ]

  return (
    <MockFrame title="teemly.app/dashboard">
      <div className="mstat-row">
        {stats.map((s) => (
          <div className="mstat-card" key={s.l}>
            <div className="mstat-label">{s.l}</div>
            <div className="mstat-value">{s.v}</div>
            {s.t && <div className={`mstat-trend ${s.up ? 'up' : 'down'}`}>{s.t}</div>}
          </div>
        ))}
      </div>

      <div className="mock-main-grid">
        <div className="mock-panel">
          <div className="mock-panel-title">Org Productivity Score</div>
          <div
            className="gauge"
            style={{ background: `conic-gradient(var(--status-productive) 0 78%, var(--line-soft) 0)` }}
          >
            <div className="gauge-inner">
              <strong>78</strong>
              <span>/ 100 today</span>
            </div>
          </div>
          <div className="gauge-legend">
            <span className="li">
              <span className="sw" style={{ background: 'var(--status-productive)' }} /> Productive 78%
            </span>
            <span className="li">
              <span className="sw" style={{ background: 'var(--status-neutral)' }} /> Idle 14%
            </span>
          </div>
        </div>

        <div className="mock-panel">
          <div className="mock-panel-title">Work Summary — This Week</div>
          <div className="bars">
            {bars.map((b, i) => (
              <div className="bar-col" key={i}>
                <div className={`bar ${i === 4 ? 'today' : ''}`} style={{ height: `${b}%` }} />
                <div className="bar unproductive" style={{ height: `${100 - b}%`, maxHeight: '30%' }} />
              </div>
            ))}
          </div>
          <div className="bar-labels">
            {days.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
        </div>

        <div className="mock-panel">
          <div className="mock-panel-title">Live Activity · 89/128</div>
          {live.map((r, i) => (
            <div className="live-row" key={r.n}>
              <Avatar initials={r.n[0]} i={i} />
              <span>
                <span className="live-name">{r.n}</span>
                <span className="live-status">
                  <span className={`status-dot ${r.dot}`} /> {r.s}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  )
}

/* ================= 2. Teams ================= */
export function TeamsMock() {
  const teams = [
    { name: 'Engineering', init: 'EN', status: 'Active', pct: 84, present: '32/34', i: 0 },
    { name: 'Sales', init: 'SL', status: 'Attention', pct: 58, present: '14/18', i: 1 },
    { name: 'Design', init: 'DS', status: 'Active', pct: 91, present: '9/10', i: 2 },
  ]
  return (
    <MockFrame title="teemly.app/teams">
      <div className="mstat-row">
        <div className="mstat-card">
          <div className="mstat-label">Total Teams</div>
          <div className="mstat-value">6</div>
        </div>
        <div className="mstat-card">
          <div className="mstat-label">Total Employees</div>
          <div className="mstat-value">128</div>
        </div>
        <div className="mstat-card">
          <div className="mstat-label">Avg Productivity</div>
          <div className="mstat-value">76%</div>
        </div>
        <div className="mstat-card">
          <div className="mstat-label">Avg Work Time</div>
          <div className="mstat-value">6h 40m</div>
        </div>
      </div>

      <div className="team-grid">
        {teams.map((t) => (
          <div className="team-card" key={t.name}>
            <div className="team-card-head">
              <span className="team-initials" style={{ background: teamColors[t.i] }}>
                {t.init}
              </span>
              <span>
                <span className="team-name">{t.name}</span>
                <br />
                <span className={`status-badge ${t.status === 'Active' ? 'productive' : 'privacy'}`}>
                  {t.status}
                </span>
              </span>
            </div>
            <div className="progress-track">
              <div className={`progress-fill ${t.pct > 70 ? 'green' : 'pink'}`} style={{ width: `${t.pct}%` }} />
            </div>
            <div className="team-foot">
              <span>{t.pct}% productivity</span>
              <span>{t.present} present</span>
            </div>
          </div>
        ))}
      </div>
    </MockFrame>
  )
}

/* ================= 3. Screenshots ================= */
export function ScreenshotsMock() {
  const shots = [
    { app: 'Figma', time: '10:42 AM', badge: 'productive', blur: false, g: 'linear-gradient(135deg,#0aa1e8,#04dcd9)' },
    { app: 'Notion', time: '10:38 AM', badge: 'productive', blur: false, g: 'linear-gradient(135deg,#6a2cc7,#f52998)' },
    { app: 'Private', time: '10:31 AM', badge: 'neutral', blur: true, g: 'linear-gradient(135deg,#9aa1b8,#c8cce0)' },
    { app: 'Slack', time: '10:24 AM', badge: 'productive', blur: false, g: 'linear-gradient(135deg,#1fb87f,#0aa1e8)' },
    { app: 'YouTube', time: '10:18 AM', badge: 'unproductive', blur: false, g: 'linear-gradient(135deg,#171b2f,#3d4266)' },
    { app: 'VS Code', time: '10:10 AM', badge: 'productive', blur: false, g: 'linear-gradient(135deg,#0b1f8a,#0aa1e8)' },
  ]
  const emps = [
    { n: 'Ananya R.', dot: 'productive', active: true },
    { n: 'Karthik S.', dot: 'privacy', active: false },
    { n: 'Meera J.', dot: 'unproductive', active: false },
  ]
  return (
    <MockFrame title="teemly.app/screenshots">
      <div className="shot-layout">
        <div className="shot-side">
          <div className="shot-side-group">Engineering · 34</div>
          {emps.map((e) => (
            <div className={`shot-emp-row ${e.active ? 'active' : ''}`} key={e.n}>
              <span className={`status-dot ${e.dot}`} /> {e.n}
            </div>
          ))}
        </div>
        <div>
          <div className="shot-grid">
            {shots.map((s, i) => (
              <div className="shot-card" key={i}>
                <div className={`shot-thumb ${s.blur ? 'blurred' : ''}`} style={{ background: s.g }} />
                {s.blur && (
                  <div className="shot-lock">
                    <Icon name="lock" size={20} />
                  </div>
                )}
                <span className={`status-badge ${s.badge} shot-badge`}>{s.badge}</span>
                <div className="shot-foot">
                  <span>{s.app}</span>
                  <span>{s.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockFrame>
  )
}

/* ================= 4. Attendance ================= */
export function AttendanceMock() {
  const rows = [
    { n: 'Ananya R.', segs: [[0, 45, 'productive'], [45, 5, 'neutral'], [50, 40, 'productive'], [90, 10, 'unproductive']] },
    { n: 'Karthik S.', segs: [[5, 60, 'productive'], [65, 15, 'privacy'], [80, 20, 'productive']] },
    { n: 'Meera J.', segs: [[0, 30, 'productive'], [30, 50, 'unproductive'], [80, 10, 'neutral']] },
    { n: 'Rohit V.', segs: [[10, 70, 'productive'], [80, 20, 'productive']] },
  ]
  const segColor = {
    productive: 'var(--status-productive)',
    neutral: 'var(--status-neutral)',
    unproductive: 'var(--status-unproductive)',
    privacy: 'var(--status-privacy)',
  }
  return (
    <MockFrame title="teemly.app/attendance · timeline">
      <div className="gauge-legend" style={{ justifyContent: 'flex-start', marginBottom: 12 }}>
        <span className="li"><span className="sw" style={{ background: 'var(--status-productive)' }} /> Productive</span>
        <span className="li"><span className="sw" style={{ background: 'var(--status-neutral)' }} /> Neutral</span>
        <span className="li"><span className="sw" style={{ background: 'var(--status-unproductive)' }} /> Unproductive</span>
        <span className="li"><span className="sw" style={{ background: 'var(--status-privacy)' }} /> Privacy</span>
      </div>
      <div className="mock-panel">
        {rows.map((r) => (
          <div className="gantt-row" key={r.n}>
            <span className="gantt-name">{r.n}</span>
            <div className="gantt-track">
              {r.segs.map(([left, width, type], i) => (
                <span
                  key={i}
                  className="gantt-seg"
                  style={{ left: `${left}%`, width: `${width}%`, background: segColor[type] }}
                />
              ))}
              <span className="gantt-now" style={{ left: '68%' }} />
            </div>
          </div>
        ))}
      </div>
    </MockFrame>
  )
}

/* ================= 5. Reports ================= */
export function ReportsMock() {
  const tiles = ['Work Pulse', 'Burnout', 'Focus Score', 'Tool Intel', 'Attendance', 'Leaderboard']
  const heatRows = ['Eng', 'Sales', 'Design']
  const seed = [
    [30, 40, 70, 90, 95, 88, 60, 40, 30, 20],
    [20, 30, 50, 80, 85, 70, 55, 35, 25, 15],
    [40, 55, 75, 92, 96, 90, 65, 45, 35, 25],
  ]
  return (
    <MockFrame title="teemly.app/reports · Work Pulse">
      <div className="tile-row">
        {tiles.map((t, i) => (
          <span className={`tile-btn ${i === 0 ? 'active' : ''}`} key={t}>
            <span className="n">{String(i + 1).padStart(2, '0')}</span> {t}
          </span>
        ))}
      </div>

      <div className="mock-panel" style={{ marginBottom: 12 }}>
        <div className="mock-panel-title">Hourly Productivity Heat Map</div>
        <div className="heatmap">
          <span />
          {['9', '10', '11', '12', '1', '2', '3', '4', '5', '6'].map((h) => (
            <span className="heat-hour" key={h}>
              {h}
            </span>
          ))}
          {heatRows.map((r, ri) => (
            <Fragment key={r}>
              <span className="heat-label">{r}</span>
              {seed[ri].map((v, ci) => (
                <span key={ci} className="heat-cell" style={{ opacity: v / 100 }} />
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="insight-row">
        <div className="insight-card">
          <div className="ic-head">
            <Icon name="sparkle" size={15} />
            <span style={{ fontSize: '0.66rem', fontWeight: 700 }}>AI INSIGHT</span>
          </div>
          <h5>Friday Productivity Drop</h5>
          <p>Org-wide focus falls 18% after 3 PM on Fridays — consider lighter meeting loads.</p>
        </div>
        <div className="insight-card">
          <div className="ic-head">
            <Icon name="sparkle" size={15} />
            <span style={{ fontSize: '0.66rem', fontWeight: 700 }}>AI INSIGHT</span>
          </div>
          <h5>Engineering Sprint Sessions Up 22%</h5>
          <p>Deep-focus sessions rose sharply in week 3 — sprint cadence is working.</p>
        </div>
        <div className="insight-card">
          <div className="ic-head">
            <Icon name="sparkle" size={15} />
            <span style={{ fontSize: '0.66rem', fontWeight: 700 }}>AI INSIGHT</span>
          </div>
          <h5>Morning Sprint Window: 10–11 AM</h5>
          <p>Org-wide peak productivity window — schedule focus blocks here.</p>
        </div>
      </div>
    </MockFrame>
  )
}

/* ================= 6. Video Recording ================= */
export function VideoRecordingMock() {
  const stats = [
    { l: 'Recordings Today', v: '342', t: null },
    { l: 'Avg Session Length', v: '12 min', t: null },
    { l: 'Employees Recording', v: '89', t: null },
    { l: 'Storage Used', v: '4.8 GB', t: null },
  ]
  const sessions = [
    { app: 'Figma', time: '10:30–10:45 AM', badge: 'productive', blur: false, g: 'linear-gradient(135deg,#0aa1e8,#04dcd9)' },
    { app: 'VS Code', time: '10:15–10:30 AM', badge: 'productive', blur: false, g: 'linear-gradient(135deg,#0b1f8a,#0aa1e8)' },
    { app: 'Private', time: '10:00–10:15 AM', badge: 'neutral', blur: true, g: 'linear-gradient(135deg,#9aa1b8,#c8cce0)' },
    { app: 'Slack', time: '9:45–10:00 AM', badge: 'productive', blur: false, g: 'linear-gradient(135deg,#1fb87f,#0aa1e8)' },
    { app: 'Notion', time: '9:30–9:45 AM', badge: 'productive', blur: false, g: 'linear-gradient(135deg,#6a2cc7,#f52998)' },
    { app: 'YouTube', time: '9:15–9:30 AM', badge: 'unproductive', blur: false, g: 'linear-gradient(135deg,#171b2f,#3d4266)' },
  ]
  const emps = [
    { n: 'Ananya R.', dot: 'productive', active: true },
    { n: 'Karthik S.', dot: 'privacy', active: false },
    { n: 'Meera J.', dot: 'unproductive', active: false },
  ]
  return (
    <MockFrame title="teemly.app/video-recordings">
      <div className="mstat-row">
        {stats.map((s) => (
          <div className="mstat-card" key={s.l}>
            <div className="mstat-label">{s.l}</div>
            <div className="mstat-value">{s.v}</div>
          </div>
        ))}
      </div>
      <div className="shot-layout">
        <div className="shot-side">
          <div className="shot-side-group">Engineering · 34</div>
          {emps.map((e) => (
            <div className={`shot-emp-row ${e.active ? 'active' : ''}`} key={e.n}>
              <span className={`status-dot ${e.dot}`} /> {e.n}
            </div>
          ))}
        </div>
        <div>
          <div className="shot-grid">
            {sessions.map((s, i) => (
              <div className="shot-card" key={i}>
                <div className={`shot-thumb ${s.blur ? 'blurred' : ''}`} style={{ background: s.g }} />
                <div className="shot-lock">
                  <Icon name="play" size={20} />
                </div>
                <span className={`status-badge ${s.badge} shot-badge`}>{s.badge}</span>
                <div className="shot-foot">
                  <span>{s.app}</span>
                  <span>{s.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockFrame>
  )
}

/* ================= 7. Location Tracking ================= */
export function LocationTrackingMock() {
  const stats = [
    { l: 'In Office', v: '61', t: null },
    { l: 'Remote', v: '24', t: null },
    { l: 'Client Site', v: '9', t: null },
    { l: 'Off-Site Alert', v: '2', t: null },
  ]
  const people = [
    { n: 'Ananya R.', status: 'In Office', dist: '0.0 km', dot: 'productive' },
    { n: 'Karthik S.', status: 'Client Site', dist: '14.2 km', dot: 'privacy' },
    { n: 'Meera J.', status: 'Remote', dist: '—', dot: 'neutral' },
    { n: 'Rohit V.', status: 'In Office', dist: '0.0 km', dot: 'productive' },
    { n: 'Diya K.', status: 'Off-Site', dist: '32.6 km', dot: 'absent' },
  ]
  return (
    <MockFrame title="teemly.app/location">
      <div className="mstat-row">
        {stats.map((s) => (
          <div className="mstat-card" key={s.l}>
            <div className="mstat-label">{s.l}</div>
            <div className="mstat-value">{s.v}</div>
          </div>
        ))}
      </div>
      <div className="mock-main-grid loc-grid">
        <div className="mock-panel loc-map">
          <div className="mock-panel-title">Team Location View</div>
          <div className="loc-map-canvas">
            <span className="loc-zone loc-zone-office">Office</span>
            <span className="loc-pin" style={{ top: '38%', left: '46%' }} />
            <span className="loc-pin" style={{ top: '34%', left: '52%' }} />
            <span className="loc-pin alert" style={{ top: '70%', left: '80%' }} />
            <span className="loc-pin" style={{ top: '60%', left: '20%' }} />
          </div>
        </div>
        <div className="mock-panel">
          <div className="mock-panel-title">Live Location · 89/128</div>
          {people.map((p, i) => (
            <div className="live-row" key={p.n}>
              <Avatar initials={p.n[0]} i={i} />
              <span>
                <span className="live-name">{p.n}</span>
                <span className="live-status">
                  <span className={`status-dot ${p.dot}`} /> {p.status}
                </span>
              </span>
              <span className="loc-dist">{p.dist}</span>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  )
}

/* ================= 8. Settings ================= */
export function SettingsMock() {
  const nav = [
    { g: 'Organisation & People', items: [['01', 'Teams & Structure'], ['02', 'People & Roles']] },
    { g: 'Work & Monitoring', items: [['03', 'Work Policy'], ['04', 'Monitoring Controls', true], ['05', 'Silent Tracking']] },
    { g: 'Access & Controls', items: [['06', 'Org Defaults'], ['07', 'Permissions & Access']] },
  ]
  return (
    <MockFrame title="teemly.app/settings">
      <div className="settings-layout">
        <div className="settings-nav">
          {nav.map((g) => (
            <div key={g.g}>
              <div className="settings-group-label">{g.g}</div>
              {g.items.map(([n, label, active]) => (
                <div className={`settings-nav-item ${active ? 'active' : ''}`} key={n}>
                  <span className="num">{n}</span> {label}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="settings-panel">
          <div className="mock-panel-title">Monitoring Controls — Ananya R.</div>
          <div className="setting-row">
            <span>
              <span className="setting-label">Screenshot Capture</span>
              <br />
              <span className="setting-desc">Syncs to EXE agent within 1 hour</span>
            </span>
            <span className="toggle on" />
          </div>
          <div className="setting-row">
            <span>
              <span className="setting-label">Privacy Blur</span>
              <br />
              <span className="setting-desc">Original image never stored when on</span>
            </span>
            <span className="toggle" />
          </div>
          <div className="setting-row">
            <span>
              <span className="setting-label">Capture Interval</span>
            </span>
            <span className="stepper">
              <button>−</button> 2 min <button>+</button>
            </span>
          </div>
          <div className="setting-row">
            <span>
              <span className="setting-label">Idle Threshold</span>
            </span>
            <span className="stepper">
              <button>−</button> 5 min <button>+</button>
            </span>
          </div>

          <div className="legal-card">
            <span className="icon-wrap">
              <Icon name="shield" size={17} />
            </span>
            <span>
              <span className="setting-label">Silent Tracking · Legal gate</span>
              <br />
              <span className="setting-desc">
                Requires an explicit admin acknowledgement of local consent law before it can be unlocked —
                Teemly enforces this at the UI and API level.
              </span>
            </span>
          </div>
        </div>
      </div>
    </MockFrame>
  )
}
