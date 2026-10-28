import Icon from './Icon.jsx'
import Logo from './Logo.jsx'
import './appUi.css'

// The Teemly app as it appears in product screenshots across the site: the
// window (browser bar, sidebar, top bar) and the pieces screens are built
// from. Used by the full app screens in the Take a Tour player
// (ProductMockups.jsx) and the focused marketing screenshots
// (FeatureShots.jsx). Sample data only.

export const AVATAR_COLORS = ['#0aa1e8', '#f52998', '#6a2cc7', '#1fb87f', '#f0a83c', '#09124b', '#04b5b3']

export const AREA_NAV = [
  { key: 'organizational', icon: 'chart', label: 'Organizational' },
  { key: 'workforce', icon: 'users', label: 'Workforce' },
  { key: 'work', icon: 'monitor', label: 'Work' },
  { key: 'workflow', icon: 'clock', label: 'Workflow' },
  { key: 'ai', icon: 'sparkle', label: 'AI' },
]

export const MODULE_NAV = [
  { key: 'dashboard', icon: 'layers', label: 'Dashboard' },
  { key: 'teams', icon: 'users', label: 'Teams' },
  { key: 'screenshots', icon: 'camera', label: 'Screenshots' },
  { key: 'video', icon: 'play', label: 'Video Recording' },
  { key: 'location', icon: 'pin', label: 'Location' },
  { key: 'attendance', icon: 'clock', label: 'Attendance' },
  { key: 'reports', icon: 'fileText', label: 'Reports' },
  { key: 'settings', icon: 'gear', label: 'Settings' },
]

/**
 * The app window. `active` is the sidebar item to highlight (an AREA_NAV or
 * MODULE_NAV key). It fills its container's width, and below ~780px wide the
 * sidebar folds to an icon rail (container queries in appUi.css).
 */
export function AppWindow({ url, active, crumb, title, actions, className = '', style, children }) {
  return (
    <div className={`ps-app ${className}`} style={style}>
      <div className="ps-chrome">
        <span className="ps-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="ps-url">
          <Icon name="lock" size={10} /> {url}
        </span>
        <span className="ps-chrome-end" />
      </div>
      <div className="ps-body">
        <div className="ps-side">
          <div className="ps-brand">
            <Logo variant="mark" size={22} label={null} />
            <b>Teemly</b>
          </div>
          <div className="ps-workspace">
            <span className="ps-ws-logo">AC</span>
            <span className="ps-ws-text">
              <b>Acme Corp</b>
              <small>128 seats · Enterprise</small>
            </span>
            <span className="ps-caret">▾</span>
          </div>
          <span className="ps-nav-label">Intelligence</span>
          <div className="ps-nav">
            {AREA_NAV.map((t) => (
              <span key={t.key} className={t.key === active ? 'on' : ''}>
                <Icon name={t.icon} size={14} /> <em>{t.label}</em>
              </span>
            ))}
          </div>
          <span className="ps-nav-label">Modules</span>
          <div className="ps-nav">
            {MODULE_NAV.map((m) => (
              <span key={m.key} className={m.key === active ? 'on' : ''}>
                <Icon name={m.icon} size={14} /> <em>{m.label}</em>
              </span>
            ))}
          </div>
          <div className="ps-user">
            <Avatar name="Sana Mehta" i={1} />
            <span className="ps-user-text">
              <b>Sana Mehta</b>
              <small>Client Admin</small>
            </span>
          </div>
        </div>
        <div className="ps-main">
          <div className="ps-top">
            <div className="ps-title">
              <small>{crumb}</small>
              <b>{title}</b>
            </div>
            <span className="ps-search">
              <Icon name="eye" size={12} /> Search people, teams, apps…
            </span>
            {actions}
            <span className="ps-live">
              <i /> Live
            </span>
          </div>
          <div className="ps-content">{children}</div>
        </div>
      </div>
    </div>
  )
}

/** A top-bar button; `primary` is the pink one. */
export function Btn({ icon, primary, children }) {
  return (
    <span className={`ps-btn${primary ? ' primary' : ''}`}>
      {icon && <Icon name={icon} size={12} />} {children}
    </span>
  )
}

export function Avatar({ name, i = 0 }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
  return (
    <span className="ps-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
      {initials}
    </span>
  )
}

export function Chip({ tone = 'neutral', children }) {
  return <span className={`ps-chip ${tone}`}>{children}</span>
}

export function Spark({ data, tone = 'blue' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 60},${18 - ((v - min) / (max - min || 1)) * 16}`).join(' ')
  return (
    <svg className={`ps-spark ${tone}`} viewBox="0 0 60 20" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts} />
    </svg>
  )
}

/** A row of KPI cards. */
export function Kpis({ items, className = '' }) {
  return (
    <div className={`ps-kpis ${className}`} style={{ '--n': items.length }}>
      {items.map((k) => (
        <div className="ps-kpi" key={k.label}>
          <span className="ps-kpi-label">
            <Icon name={k.icon} size={12} /> {k.label}
          </span>
          <div className="ps-kpi-row">
            <strong>
              {k.value}
              {k.unit && <small>{k.unit}</small>}
            </strong>
            {k.spark && <Spark data={k.spark} tone={k.tone === 'bad' ? 'pink' : 'blue'} />}
          </div>
          <span className={`ps-kpi-note ${k.tone || ''}`}>
            {k.delta && <b>{k.delta}</b>} {k.note}
          </span>
        </div>
      ))}
    </div>
  )
}

export function Card({ title, meta, action, className = '', children }) {
  return (
    <div className={`ps-card ${className}`}>
      <div className="ps-card-head">
        <b>{title}</b>
        {meta && <small>{meta}</small>}
        {action && <span className="ps-card-action">{action}</span>}
      </div>
      {children}
    </div>
  )
}

export function Bar({ value, tone = 'blue' }) {
  return (
    <span className="ps-bar">
      <span className={tone} style={{ width: `${value}%` }} />
    </span>
  )
}

/** A ring chart; `parts` are { v (percent), color }. */
export function Donut({ parts }) {
  let acc = 0
  const stops = parts.map((p) => {
    const from = acc
    acc += p.v
    return `${p.color} ${from}% ${acc}%`
  })
  return <span className="ps-donut" style={{ background: `conic-gradient(${stops.join(', ')})` }} />
}

/** An on/off switch, drawn (not interactive). */
export function Toggle({ on }) {
  return <span className={`ps-toggle${on ? ' on' : ''}`} />
}

// line widths (%) and indents for the drawn screens
const CODE = [
  [0, 46],
  [1, 62],
  [2, 38],
  [2, 54],
  [1, 30],
  [0, 20],
  [0, 50],
  [1, 66],
  [2, 42],
  [1, 26],
]
const DOC = [92, 86, 95, 70, 88, 60]

/** What a captured screen shows, drawn in blocks, for each kind of app. */
function ThumbContent({ kind }) {
  if (kind === 'code') return CODE.map(([indent, w], i) => <i key={i} style={{ marginLeft: `${indent * 7}%`, width: `${w}%` }} />)
  if (kind === 'design')
    return (
      <>
        <span className="ps-art a">
          <i />
          <i />
        </span>
        <span className="ps-art b" />
        <span className="ps-art c">
          <i />
        </span>
      </>
    )
  if (kind === 'chat')
    return [70, 52, 84, 46].map((w, i) => (
      <span className="ps-msg" key={i}>
        <b />
        <span>
          <i style={{ width: '30%' }} />
          <i style={{ width: `${w}%` }} />
        </span>
      </span>
    ))
  if (kind === 'video')
    return (
      <>
        <span className="ps-vplay" />
        <span className="ps-vbar" />
      </>
    )
  return (
    <>
      <i className="h" />
      {DOC.map((w, i) => (
        <i key={i} style={{ width: `${w}%` }} />
      ))}
      <span className="ps-img" />
    </>
  )
}

/**
 * A stand-in for a captured screen: an app window drawn in blocks, in the
 * app's colour. `kind` picks the layout: code, design, doc, chat or video.
 */
export function ScreenThumb({ kind = 'doc', color = '#0aa1e8', blur = false }) {
  return (
    <span className={`ps-thumb k-${kind}${blur ? ' blur' : ''}`} style={{ '--c': color }}>
      <span className="ps-thumb-bar">
        <i />
        <i />
        <i />
      </span>
      <span className="ps-thumb-body">
        <span className="ps-thumb-side" />
        <span className="ps-thumb-main">
          <ThumbContent kind={kind} />
        </span>
      </span>
      {blur && (
        <span className="ps-thumb-lock">
          <Icon name="lock" size={14} /> Privacy blur
        </span>
      )}
    </span>
  )
}
