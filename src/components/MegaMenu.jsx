import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export default function MegaMenu({ items, columns = 2, footerLink, width = 640, align = 'center', intro, feature }) {
  const colClass = columns === 1 ? ' mega-grid-1col' : columns === 3 ? ' mega-grid-3col' : ''
  const panelRef = useRef(null)

  // A panel that would run past the header's right edge (the menus nearest
  // it, or any menu on a narrower screen) moves left just enough to line up
  // with that edge, before it is drawn.
  useLayoutEffect(() => {
    const panel = panelRef.current
    const header = panel?.closest('.header-inner')
    if (!panel || !header) return
    const edge = header.getBoundingClientRect().right - parseFloat(getComputedStyle(header).paddingRight)
    const over = panel.getBoundingClientRect().right - edge
    if (over > 0) panel.style.marginLeft = `${-Math.ceil(over)}px`
  }, [])

  return (
    <div ref={panelRef} className={`mega-panel${align === 'start' ? ' mega-panel-start' : ''}${feature ? ' has-feature' : ''}`}>
      <div className="mega-main" style={{ width }}>
        {intro && <p className="mega-intro">{intro}</p>}
        <div className={`mega-grid${colClass}`}>
          {items.map((item) => (
            <Link key={item.label} to={item.to} className="mega-item">
              <span className={`mega-icon tone-${item.tone || 'blue'}`}>
                <Icon name={item.icon} size={18} />
              </span>
              <span>
                <span className="mega-title">{item.label}</span>
                {item.desc && <span className="mega-desc">{item.desc}</span>}
              </span>
            </Link>
          ))}
        </div>
        {footerLink && (
          <Link to={footerLink.to} className="mega-footer-link">
            {footerLink.label}
            <Icon name="arrowRight" size={15} />
          </Link>
        )}
      </div>
      {feature && <div className="mega-feature">{feature}</div>}
    </div>
  )
}
