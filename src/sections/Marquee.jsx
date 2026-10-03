import { Fragment } from 'react'
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
          {i % 2 === 1 ? <span className="o">{label}</span> : label}
          <span className="h-marquee-sep" />
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
