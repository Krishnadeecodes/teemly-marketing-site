import Icon from '../components/Icon.jsx'
import '../home/marquee.css'

// A "trusted by" style logo strip: muted, logo-like marks running slowly.
const items = [
  { label: 'Organizational Intelligence', icon: 'building' },
  { label: 'Workforce Intelligence', icon: 'users' },
  { label: 'Work Intelligence', icon: 'briefcase' },
  { label: 'Workflow Intelligence', icon: 'network' },
  { label: 'AI Intelligence', icon: 'sparkle' },
  { label: 'Tool Intelligence', icon: 'layers' },
]

function Track({ hidden }) {
  return (
    <ul className="h-marquee-item" aria-hidden={hidden || undefined}>
      {items.map((it) => (
        <li key={it.label} className="h-marquee-logo">
          <span className="h-marquee-mark">
            <Icon name={it.icon} size={18} />
          </span>
          {it.label}
        </li>
      ))}
    </ul>
  )
}

export default function Marquee() {
  return (
    <section className="h-marquee" aria-label="Teemly intelligence areas">
      <div className="h-marquee-rail">
        <div className="h-marquee-track">
          <Track />
          <Track hidden />
        </div>
      </div>
    </section>
  )
}
