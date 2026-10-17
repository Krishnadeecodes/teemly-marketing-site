import { Fragment } from 'react'
import Logo from '../components/Logo.jsx'
import '../home/marquee.css'

const items = [
  'Organizational Intelligence',
  'Workforce Intelligence',
  'Work Intelligence',
  'Workflow Intelligence',
  'AI Intelligence',
  'Tool Intelligence',
]

function Track({ hidden }) {
  return (
    <div className="h-marquee-item" aria-hidden={hidden || undefined}>
      {items.map((label, i) => (
        <Fragment key={label}>
          <span className={`h-marquee-word${i % 2 ? ' g' : ''}`}>{label}</span>
          <span className="h-marquee-sep" style={{ '--d': `${(i % 3) * -0.8}s` }}>
            <Logo variant="mark" size={30} label={null} />
          </span>
        </Fragment>
      ))}
    </div>
  )
}

export default function Marquee() {
  return (
    <div className="h-marquee" aria-label="Teemly intelligence areas">
      <div className="h-marquee-track">
        <Track />
        <Track hidden />
      </div>
    </div>
  )
}
