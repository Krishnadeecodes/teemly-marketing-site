import { useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { MODULES, STEPS } from '../data/tour.js'
import { TourGateForm } from './TourGate.jsx'
import './tourGate.css'

const STATS = [
  { value: MODULES.length, label: 'product modules' },
  { value: Object.keys(STEPS).length, label: 'guided steps' },
]

const PERKS = ['Real product screens, with each part explained', 'Play any module, or watch them in turn', 'No sales call needed']

/**
 * The sign-in popup over /take-a-tour: the tour shows, locked, behind it
 * until the form is sent. Closing it leaves the page, since the tour can't
 * be used without signing in.
 */
export default function TourGatePopup() {
  const navigate = useNavigate()
  const dialogRef = useRef(null)

  const leave = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/'))
  const leaveRef = useRef(leave)
  leaveRef.current = leave

  // the page behind holds still; focus starts in the popup
  useLayoutEffect(() => {
    const root = document.documentElement
    const prev = { overflow: root.style.overflow, gutter: root.style.scrollbarGutter }
    root.style.overflow = 'hidden'
    root.style.scrollbarGutter = 'stable'
    dialogRef.current?.querySelector('input:not([tabindex="-1"])')?.focus({ preventScroll: true })
    return () => {
      root.style.overflow = prev.overflow
      root.style.scrollbarGutter = prev.gutter
    }
  }, [])

  // Esc leaves; Tab stays inside the popup
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        leaveRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const items = [...dialogRef.current.querySelectorAll('a[href], button:not([disabled]), input:not([tabindex="-1"]), select')]
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return createPortal(
    <div className="tg-backdrop" data-lenis-prevent>
      <div className="tu-card tg-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="tg-title">
        <button type="button" className="tg-close" onClick={leave} aria-label="Leave the tour">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div className="tu-showcase">
          <span className="eyebrow">
            <span className="dot" />
            Interactive product tour
          </span>
          <h2 id="tg-title">Sign up to start the tour</h2>
          <p className="tu-lede">Tell us a little about you and the tour opens straight away.</p>

          <ul className="tu-stats">
            {STATS.map((s) => (
              <li key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>

          <ul className="tu-perks">
            {PERKS.map((p) => (
              <li key={p}>
                <Icon name="check" size={15} />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="tu-form">
          <div className="tu-form-head">
            <h3>Get instant access</h3>
            <p>Takes about 30 seconds.</p>
          </div>
          <TourGateForm />
        </div>
      </div>
    </div>,
    document.body,
  )
}
