import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import FitScale from '../components/FitScale.jsx'
import { PATHS, SCREENS, STEPS, getPath } from '../data/tour.js'
import './tourPlayer.css'

const SAVE_KEY = 'teemly_tour'
const SECONDS_PER_STEP = 20

function readSaved() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null')
    return s && getPath(s.role) ? s : null
  } catch {
    return null
  }
}

function save(value) {
  try {
    if (value) localStorage.setItem(SAVE_KEY, JSON.stringify(value))
    else localStorage.removeItem(SAVE_KEY)
  } catch {
    // storage blocked: the tour just won't offer to resume
  }
}

// ?role=hr&step=4 (or step=end) opens the tour straight at that point, so a
// step can be shared with a colleague.
function readUrl() {
  const q = new URLSearchParams(window.location.search)
  const path = getPath(q.get('role'))
  if (!path) return null
  if (q.get('step') === 'end') return { role: path.id, step: path.steps.length - 1, done: true }
  const n = parseInt(q.get('step'), 10)
  const step = Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), path.steps.length - 1) : 0
  return { role: path.id, step, done: false }
}

// Keeps the address in step with the tour without a router navigation: a
// navigation would scroll the page to the top on every step (see Layout.jsx).
function writeUrl(role, step, done) {
  const q = new URLSearchParams(window.location.search)
  if (role) {
    q.set('role', role)
    q.set('step', done ? 'end' : String(step + 1))
  } else {
    q.delete('role')
    q.delete('step')
  }
  const search = q.toString()
  const url = window.location.pathname + (search ? `?${search}` : '') + window.location.hash
  window.history.replaceState(window.history.state, '', url)
}

const BUBBLE_GAP = 16

/**
 * Where the step bubble goes. On wide screens it sits in the lane beside the
 * product screen, level with the highlighted part, so the layout stays
 * balanced and the screen is never covered; a connector line bridges any gap
 * to the highlight. Without a lane it goes beside the highlight (right, then
 * left), else below or above it, else over its lower edge. Always inside
 * `canvasRef`; re-measured when the step, the bubble or the size changes.
 */
function useBubble(canvasRef, layerRef, bubbleRef, target, enabled) {
  const [pos, setPos] = useState(null)

  const place = useCallback(() => {
    const canvas = canvasRef.current
    const layer = layerRef.current
    const bubble = bubbleRef.current
    if (!enabled || !canvas || !layer || !bubble || !target) return
    const el = layer.querySelectorAll(target.sel)[target.index || 0]
    if (!el) return
    const c = canvas.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    const t = { left: r.left - c.left, top: r.top - c.top, right: r.right - c.left, bottom: r.bottom - c.top }
    const cx = (t.left + t.right) / 2
    const cy = (t.top + t.bottom) / 2
    const bw = bubble.offsetWidth
    const bh = bubble.offsetHeight
    const clamp = (v, min, max) => Math.max(min, Math.min(v, max))
    const g = BUBBLE_GAP
    const fitY = (y) => clamp(y, 0, Math.max(0, c.height - bh))
    const fitX = (x) => clamp(x, 0, Math.max(0, c.width - bw))
    let side
    let left
    let top
    let link = null
    const screen = canvas.querySelector('.tour-screen')?.getBoundingClientRect()
    const lane = screen ? screen.right - c.left + g : Infinity
    if (lane + bw <= c.width) {
      side = 'right'
      left = lane
      top = fitY(cy - bh / 2)
      // bridge from the highlight's right edge to the bubble's arrow
      if (left - t.right > g + 4) link = { left: t.right, width: left - t.right, top: cy }
    } else if (c.width - t.right >= bw + g) {
      side = 'right'
      left = t.right + g
      top = fitY(cy - bh / 2)
    } else if (t.left >= bw + g) {
      side = 'left'
      left = t.left - g - bw
      top = fitY(cy - bh / 2)
    } else if (c.height - t.bottom >= bh + g) {
      side = 'bottom'
      top = t.bottom + g
      left = fitX(cx - bw / 2)
    } else if (t.top >= bh + g) {
      side = 'top'
      top = t.top - g - bh
      left = fitX(cx - bw / 2)
    } else {
      side = 'over'
      top = fitY(t.bottom - bh - g)
      left = fitX(cx - bw / 2)
    }
    // the arrow sits on the edge facing the target, lined up with its centre
    const arrow = side === 'left' || side === 'right' ? clamp(cy - top, 22, bh - 22) : clamp(cx - left, 22, bw - 22)
    setPos({ side, left: Math.round(left), top: Math.round(top), arrow: Math.round(arrow), link })
  }, [canvasRef, layerRef, bubbleRef, target, enabled])

  useLayoutEffect(() => {
    place()
    if (!enabled) return undefined
    const ro = new ResizeObserver(place)
    if (canvasRef.current) ro.observe(canvasRef.current)
    if (bubbleRef.current) ro.observe(bubbleRef.current)
    document.fonts?.ready?.then(place)
    return () => ro.disconnect()
  }, [place, enabled, canvasRef, bubbleRef])

  return enabled ? pos : null
}

/** A step's label, count, title and description. */
function StepText({ s, n, total, headingRef }) {
  return (
    <>
      <div className="tour-meta">
        <span className="tour-chip">{SCREENS[s.screen].label}</span>
        {s.trust && (
          <span className="tour-trust">
            <Icon name="shield" size={13} /> Privacy &amp; control
          </span>
        )}
      </div>
      <p className="tour-count">
        Step {n} of {total}
      </p>
      <h2 className="tour-title" ref={headingRef} tabIndex={headingRef ? -1 : undefined}>
        {s.title}
      </h2>
      <p className="tour-body">{s.body}</p>
    </>
  )
}

/** True while `query` matches; follows rotation and window resizes. */
function useMedia(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

function minutes(stepCount) {
  return Math.max(1, Math.round((stepCount * SECONDS_PER_STEP) / 60))
}

/** Puts a ring around the step's target and dims the rest of the screen. */
function useSpotlight(stageRef, target) {
  const [spot, setSpot] = useState(null)

  const measure = useCallback(() => {
    const stage = stageRef.current
    if (!stage || !target) return
    const el = stage.querySelectorAll(target.sel)[target.index || 0]
    if (!el) {
      setSpot(null)
      return
    }
    // the stage may be scaled down by FitScale; work in its unscaled pixels
    const s = stage.getBoundingClientRect()
    const scale = s.width / stage.offsetWidth || 1
    const r = el.getBoundingClientRect()
    const pad = 6
    setSpot({
      left: (r.left - s.left) / scale - pad,
      top: (r.top - s.top) / scale - pad,
      width: r.width / scale + pad * 2,
      height: r.height / scale + pad * 2,
    })
  }, [stageRef, target])

  useLayoutEffect(() => {
    measure()
    const stage = stageRef.current
    if (!stage) return undefined
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    document.fonts?.ready?.then(measure)
    return () => ro.disconnect()
  }, [measure, stageRef])

  return spot
}

export default function TourPlayer({ onSeeAll }) {
  const initial = useRef(readUrl())
  const [role, setRole] = useState(initial.current?.role || null)
  const [step, setStep] = useState(initial.current?.step || 0)
  const [done, setDone] = useState(initial.current?.done || false)
  const [saved, setSaved] = useState(() => (initial.current ? null : readSaved()))

  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const headingRef = useRef(null)
  const endRef = useRef(null)
  const chooserRef = useRef(null)
  const focusNext = useRef(null)
  const touch = useRef(null)
  const fullRef = useRef(null)
  const canvasRef = useRef(null)
  const bubbleRef = useRef(null)
  const historyEntry = useRef(false)
  const leaving = useRef(false)

  const path = getPath(role)
  const total = path ? path.steps.length : 0
  const current = path ? STEPS[path.steps[step]] : null
  const spot = useSpotlight(stageRef, current?.target)

  // On phones a running tour takes over the whole screen, so the product
  // screen, the explanation and Back / Next are all visible together.
  const phone = useMedia('(max-width: 760px)')
  const full = phone && !!path
  // Wide screens: the step is a speech bubble pointing at the highlight.
  // Tablets keep the explanation in a panel under the screen.
  const wide = useMedia('(min-width: 1001px)')
  const bubble = useBubble(canvasRef, stageRef, bubbleRef, current?.target, wide && !!path && !done)

  // address bar and resume point follow the tour
  useEffect(() => {
    writeUrl(role, step, done)
    if (role) save({ role, step, done })
  }, [role, step, done])

  // move focus after a change of view (not on every Next, so the button keeps it)
  useEffect(() => {
    const target = { step: headingRef, end: endRef, chooser: chooserRef }[focusNext.current]
    focusNext.current = null
    target?.current?.focus({ preventScroll: true })
  })

  function bringIntoView() {
    const r = rootRef.current?.getBoundingClientRect()
    if (r && (r.top < 0 || r.top > window.innerHeight * 0.4)) {
      rootRef.current.scrollIntoView({ block: 'start' })
    }
  }

  function start(id, at = 0, isDone = false) {
    setRole(id)
    setStep(at)
    setDone(isDone)
    setSaved(null)
    focusNext.current = isDone ? 'end' : 'step'
    bringIntoView()
  }

  function exit() {
    setRole(null)
    setStep(0)
    setDone(false)
    save(null)
    focusNext.current = 'chooser'
    bringIntoView()
  }

  // closes the full-screen tour but keeps the place, so the chooser offers to continue
  const close = useCallback(() => {
    setSaved({ role, step, done })
    setRole(null)
    setStep(0)
    setDone(false)
    focusNext.current = 'chooser'
  }, [role, step, done])
  const closeRef = useRef(close)
  closeRef.current = close
  const latest = useRef({ role, step, done })
  latest.current = { role, step, done }

  // Full screen on a phone: one extra history entry, so the phone's back
  // button closes the tour instead of leaving the page.
  useEffect(() => {
    if (!full) return undefined
    window.history.pushState(window.history.state, '', window.location.href)
    historyEntry.current = true
    leaving.current = false
    const onPop = () => {
      historyEntry.current = false
      closeRef.current()
    }
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      // closed another way (✕, Esc, finished, rotated): drop the extra entry,
      // unless a link inside the tour is taking the visitor to another page.
      // The entry it returns to still has the old address, so write the
      // current one back once it lands.
      if (historyEntry.current && !leaving.current) {
        window.addEventListener(
          'popstate',
          () => {
            const s = latest.current
            writeUrl(s.role, s.step, s.done)
          },
          { once: true },
        )
        window.history.back()
      }
      historyEntry.current = false
    }
  }, [full])

  // while full screen: the page behind doesn't scroll and focus stays inside
  useEffect(() => {
    if (!full) return undefined
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    function trap(e) {
      if (e.key !== 'Tab' || !fullRef.current) return
      const items = [...fullRef.current.querySelectorAll('a[href], button:not([disabled])')]
      if (!items.length) return
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
    document.addEventListener('keydown', trap)
    return () => {
      root.style.overflow = prev
      document.removeEventListener('keydown', trap)
    }
  }, [full])

  const next = useCallback(() => {
    if (!path) return
    if (step < total - 1) setStep(step + 1)
    else {
      setDone(true)
      focusNext.current = 'end'
    }
  }, [path, step, total])

  const back = useCallback(() => {
    if (step > 0) setStep(step - 1)
  }, [step])

  // arrow keys and Esc, while the tour is on screen and no field has focus
  useEffect(() => {
    if (!path || done) return undefined
    function onKey(e) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.target.closest?.('input, textarea, select, [contenteditable]')) return
      const r = rootRef.current?.getBoundingClientRect()
      if (!r || r.bottom < 0 || r.top > window.innerHeight) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        back()
      } else if (e.key === 'Escape') {
        if (full) close()
        else exit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [path, done, next, back, full, close])

  // swipe left / right on the screen
  function onTouchStart(e) {
    const t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }
  function onTouchEnd(e) {
    if (!touch.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touch.current.x
    const dy = t.clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : back)()
  }

  /* ---------- 1. choose a path ---------- */
  if (!path) {
    return (
      <div className="tour-guide" ref={rootRef}>
        <div className="tour-chooser">
          <h2 ref={chooserRef} tabIndex={-1}>
            What’s your role?
          </h2>
          <p className="tour-lede">Pick a path and we’ll walk you through the screens that matter to you, one step at a time.</p>

          {saved && (
            <div className="tour-resume">
              <span>
                <Icon name="clock" size={18} />
                {saved.done
                  ? `You finished the ${getPath(saved.role).label} tour.`
                  : `You were on step ${saved.step + 1} of ${getPath(saved.role).steps.length} of the ${getPath(saved.role).label} tour.`}
              </span>
              <span className="tour-resume-actions">
                <button type="button" className="btn btn-primary btn-sm" onClick={() => start(saved.role, saved.step, saved.done)}>
                  {saved.done ? 'Review it' : 'Continue'}
                </button>
                <button
                  type="button"
                  className="tour-textbtn"
                  onClick={() => {
                    save(null)
                    setSaved(null)
                  }}
                >
                  Dismiss
                </button>
              </span>
            </div>
          )}

          <div className="tour-paths">
            {PATHS.map((p) => (
              <button type="button" className={`tour-path${p.id === 'all' ? ' all' : ''}`} key={p.id} onClick={() => start(p.id)}>
                <span className="tour-path-icon">
                  <Icon name={p.icon} size={20} />
                </span>
                <span className="tour-path-text">
                  <strong>{p.label}</strong>
                  <span>{p.blurb}</span>
                  <small>
                    {p.steps.length} steps · about {minutes(p.steps.length)} min
                  </small>
                </span>
                <Icon name="arrowRight" size={16} />
              </button>
            ))}
          </div>

          <p className="tour-alt">
            Prefer to scroll?{' '}
            <button type="button" className="tour-textbtn" onClick={onSeeAll}>
              See every module on one page
            </button>
          </p>
        </div>
      </div>
    )
  }

  // On phones the player and the end screen open in a full-screen dialog;
  // elsewhere they sit in the page.
  const frame = (content) =>
    full ? (
      <div className="tour-full" ref={fullRef} role="dialog" aria-modal="true" aria-label={`${path.label} tour`}>
        <div className="tour-full-bar">
          <strong>{path.label}</strong>
          <span>{done ? 'Done' : `${step + 1} / ${total}`}</span>
          <button type="button" className="tour-full-close" onClick={close} aria-label="Close the tour">
            <CloseIcon />
          </button>
        </div>
        {!done && (
          <div className="tour-full-progress" aria-hidden="true">
            <i style={{ width: `${((step + 1) / total) * 100}%` }} />
          </div>
        )}
        <div className="tour-full-body">{content}</div>
      </div>
    ) : (
      content
    )

  /* ---------- 3. end of the tour ---------- */
  if (done) {
    const viewed = [...new Set(path.steps.map((id) => SCREENS[STEPS[id].screen].label))]
    const demoState = {
      tour: {
        role: path.demoRole,
        problem: path.demoProblem,
        message: `I took the self-guided tour (${path.label} path) and looked at: ${viewed.join(', ')}.`,
      },
    }
    return frame(
      <div className="tour-guide" ref={rootRef}>
        <div className="tour-end">
          <span className="tour-end-icon">
            <Icon name="check" size={26} />
          </span>
          <h2 ref={endRef} tabIndex={-1}>
            That’s the {path.label} tour
          </h2>
          <p className="tour-lede">On a demo we run the same screens on your own questions, live. Here’s what you saw:</p>
          <ol className="tour-recap">
            {path.steps.map((id, i) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => {
                    setDone(false)
                    setStep(i)
                    focusNext.current = 'step'
                  }}
                >
                  <span className="n">{i + 1}</span>
                  <span>
                    {STEPS[id].title}
                    <small>{SCREENS[STEPS[id].screen].label}</small>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="tour-end-ctas">
            <Link to="/book-a-demo" state={demoState} className="btn btn-primary btn-lg" onClick={() => (leaving.current = true)}>
              Book a demo
              <Icon name="arrowRight" size={16} />
            </Link>
            <button type="button" className="btn btn-outline btn-lg" onClick={exit}>
              Take another path
            </button>
          </div>
          <p className="tour-end-note">
            The demo form opens with your role and what you viewed filled in — change anything you like. Or read{' '}
            <Link to={path.learnMore.to} onClick={() => (leaving.current = true)}>
              {path.learnMore.label}
            </Link>
            .
          </p>
        </div>
      </div>
    )
  }

  /* ---------- 2. the step-by-step player ---------- */
  // Every screen of the path sits in the same grid cell with only the current
  // one shown (and, in the panel, every step's text likewise), so the screen
  // area keeps one size for the whole tour.
  const pathScreens = [...new Set(path.steps.map((id) => STEPS[id].screen))]
  const progress = (
    <div
      className="tour-progress"
      role="progressbar"
      aria-label={`${path.label} tour progress`}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step + 1}
    >
      <i style={{ width: `${((step + 1) / total) * 100}%` }} />
    </div>
  )
  const navButtons = (
    <div className="tour-nav">
      <button type="button" className="btn btn-outline" onClick={back} disabled={step === 0}>
        <Icon name="arrowRight" size={16} className="tour-flip" />
        Back
      </button>
      <button type="button" className="btn btn-primary" onClick={next}>
        {step === total - 1 ? 'Finish' : 'Next'}
        <Icon name="arrowRight" size={16} />
      </button>
    </div>
  )
  return frame(
    <div className="tour-guide" ref={rootRef}>
      <div className={`tour-player${wide ? ' bubble-mode' : ''}`}>
        <div className="tour-canvas" ref={canvasRef}>
          <div className="tour-screen" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <FitScale width={900} media="all">
            <div className="tour-stage" aria-hidden="true">
              {pathScreens.map((id) => {
                const Screen = SCREENS[id].Comp
                const on = id === current.screen
                return (
                  <div className={`tour-layer${on ? ' on' : ''}`} key={id} ref={on ? stageRef : undefined}>
                    <Screen />
                    {on && spot && <div className="tour-spot" style={spot} />}
                  </div>
                )
              })}
            </div>
          </FitScale>
          </div>

          {bubble?.link && (
            <span
              className="tour-connector"
              aria-hidden="true"
              style={{ left: bubble.link.left, top: bubble.link.top, width: bubble.link.width }}
            />
          )}

          {wide && (
            <div
              className={`tour-bubble side-${bubble?.side || 'right'}`}
              ref={bubbleRef}
              role="group"
              aria-label={`${path.label} tour, step ${step + 1} of ${total}`}
              style={bubble ? { left: bubble.left, top: bubble.top } : { visibility: 'hidden' }}
            >
              <button type="button" className="tour-bubble-close" onClick={close} aria-label="Close the tour">
                <CloseIcon />
              </button>
              <div aria-live="polite">
                <StepText s={current} n={step + 1} total={total} headingRef={headingRef} />
              </div>
              {progress}
              <div className="tour-bubble-foot">
                <button type="button" className="tour-textbtn" onClick={exit}>
                  Change role
                </button>
                {navButtons}
              </div>
              {bubble && bubble.side !== 'over' && (
                <span
                  className="tour-arrow"
                  style={bubble.side === 'left' || bubble.side === 'right' ? { top: bubble.arrow } : { left: bubble.arrow }}
                />
              )}
            </div>
          )}
        </div>

        {!wide && (
        <div className="tour-panel">
          <div className="tour-text">
            <div aria-live="polite">
              <StepText s={current} n={step + 1} total={total} headingRef={headingRef} />
            </div>
            {path.steps.map((id, i) => (
              <div className="tour-text-sizer" aria-hidden="true" key={id}>
                <StepText s={STEPS[id]} n={i + 1} total={total} />
              </div>
            ))}
          </div>

          {progress}

          {navButtons}

          <ol className="tour-dots" aria-label="Steps">
            {path.steps.map((id, i) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  aria-label={`Step ${i + 1}: ${STEPS[id].title}`}
                  aria-current={i === step ? 'step' : undefined}
                  className={i < step ? 'seen' : undefined}
                />
              </li>
            ))}
          </ol>

          <div className="tour-foot">
            <button type="button" className="tour-textbtn" onClick={exit}>
              Change role
            </button>
            <span className="tour-hint">Use ← → keys or swipe</span>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
