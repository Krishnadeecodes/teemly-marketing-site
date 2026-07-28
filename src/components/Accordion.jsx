import { useState } from 'react'
import Icon from './Icon.jsx'
import './accordion.css'

export default function Accordion({ items }) {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <div className="accordion">
      {items.map((item, i) => (
        <div className={`acc-item${openIdx === i ? ' open' : ''}`} key={item.q}>
          <button className="acc-trigger" onClick={() => setOpenIdx(openIdx === i ? -1 : i)}>
            <span>{item.q}</span>
            <span className="acc-icon">
              <Icon name="arrowRight" size={16} className="acc-chevron" />
            </span>
          </button>
          {openIdx === i && <div className="acc-panel">{item.a}</div>}
        </div>
      ))}
    </div>
  )
}
