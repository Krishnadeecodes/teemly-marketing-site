import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import FitScale from '../components/FitScale.jsx'
import { MODULES, PATHS, SCREENS, STEPS, getPath, getTopic } from '../data/tour.js'
import { CloseIcon, StepText, useSpotlight } from './TourPlayer.jsx'
import './tourPlayer.css'
import './tourModal.css'

/*
 * The "Take a Tour" popup (opened by TourLink anywhere on the site).
 *
 *   1. demo   – the full walkthrough plays by itself, one screen after another
 *   2. topics – then every part is offered separately: by role or by module
 *   3. topic  – the chosen part, stepped through with Back / Next
 *   4. done   – what was seen, and where to go next
 */

const DEMO = getPath('all')
const DEMO_SECONDS = 7
const ROLES = PATHS.filter((p) => p.id !== 'all')

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  )
}

function minutes(stepCount, seconds) {
  return Math.max(1, Math.round((stepCount * seconds) / 60))
}

/** The product screen with the step's part spotlighted, and its explanation beside it. */
function Player({ steps, step, headingRef, onSwipe, children }) {
  const stageRef = useRef(null)
  const touch = useRef(null)
  const current = STEPS[steps[step]]
  const spot = useSpotlight(stageRef, current.target)
  // every screen of the tour shares one cell (see tourPlayer.css), so the
  // screen area keeps one size from step to step
  const screens = [...new Set(steps.map((id) => STEPS[id].screen))]

  return (
    <div className="tm-player">
      <div
        className="tm-screen"
        onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
        onTouchEnd={(e) => {
          if (!touch.current) return
          const dx = e.changedTouches[0].clientX - touch.current.x
          const dy = e.changedTouches[0].clientY - touch.current.y
          touch.current = null
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) onSwipe(dx < 0 ? 1 : -1)
        }}
      >
        <FitScale width={900} media="all">
          <div className="tour-stage" aria-hidden="true">
            {screens.map((id) => {
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

      <div className="tm-side">
        <div className="tour-text">
          <div aria-live="polite">
            <StepText s={current} n={step + 1} total={steps.length} headingRef={headingRef} />
          </div>
          {steps.map((id, i) => (
            <div className="tour-text-sizer" aria-hidden="true" key={id}>
              <StepText s={STEPS[id]} n={i + 1} total={steps.length} />
            </div>
          ))}
        </div>
        <div className="tm-controls">{children}</div>
      </div>
    </div>
  )
}

/** One choice on the topics screen. */
function Option({ icon, title, text, meta, onClick }) {
  return (
    <button type="button" className="tm-option" onClick={onClick}>
      <span className="tm-option-icon">
        <Icon name={icon} size={18} />
      </span>
      <span className="tm-option-text">
        <strong>{title}</strong>
        {text && <span>{text}</span>}
        <small>{meta}</small>
      </span>
      <Icon name="arrowRight" size={16} />
    </button>
  )
}

export default function TourModal({ onClose }) {
  const [view, setView] = useState('demo')
  const [topicId, setTopicId] = useState(null)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(() => !reducedMotion())
  const [demoSeen, setDemoSeen] = useState(false)

  const dialogRef = useRef(null)
  const stepHeadingRef = useRef(null)
  const viewHeadingRef = useRef(null)
  const focusView = useRef(false)
  const leaving = useRef(false)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const topic = view === 'demo' ? DEMO : getTopic(topicId)
  const steps = topic ? topic.steps : []
  const total = steps.length

  function show(nextView, nextStep = 0) {
    setView(nextView)
    setStep(nextStep)
    focusView.current = true
  }
  const openTopic = (id) => {
    setTopicId(id)
    show('topic')
  }
  const toTopics = () => {
    setDemoSeen(true)
    show('topics')
  }
  const replay = () => {
    setPlaying(!reducedMotion())
    show('demo')
  }

  const next = useCallback(() => {
    if (step < total - 1) setStep(step + 1)
    else if (view === 'demo') toTopics()
    else show('done', step)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, total, view])
  const back = useCallback(() => {
    if (step > 0) setStep(step - 1)
  }, [step])

  // a new view moves focus to its heading; Next / Back keep it on the button
  useEffect(() => {
    if (!focusView.current) return
    focusView.current = false
    ;(viewHeadingRef.current || stepHeadingRef.current)?.focus({ preventScroll: true })
  })

  // opening: focus the popup, keep the page behind still; closing: give focus back
  useLayoutEffect(() => {
    const opener = document.activeElement
    const root = document.documentElement
    const prev = { overflow: root.style.overflow, gutter: root.style.scrollbarGutter }
    root.style.overflow = 'hidden'
    root.style.scrollbarGutter = 'stable'
    dialogRef.current?.focus({ preventScroll: true })
    return () => {
      root.style.overflow = prev.overflow
      root.style.scrollbarGutter = prev.gutter
      if (opener && opener.isConnected && !leaving.current) opener.focus({ preventScroll: true })
    }
  }, [])

  // The phone's (or browser's) back button closes the popup instead of
  // leaving the page: opening adds one history entry for it. Deferred a tick
  // so a development double-mount doesn't add and remove entries in a race.
  useEffect(() => {
    let added = false
    const onPop = () => {
      added = false
      onCloseRef.current()
    }
    const t = setTimeout(() => {
      window.history.pushState(window.history.state, '', window.location.href)
      added = true
      window.addEventListener('popstate', onPop)
    }, 0)
    return () => {
      clearTimeout(t)
      window.removeEventListener('popstate', onPop)
      // closed with ✕ or Esc: drop the extra entry again (not when a link in
      // the popup is taking the visitor to another page)
      if (added && !leaving.current) window.history.back()
    }
  }, [])

  // keyboard: Esc closes, ← → step, space pauses the demo; Tab stays inside
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current()
        return
      }
      if (e.key === 'Tab') {
        const items = [...dialogRef.current.querySelectorAll('a[href], button:not([disabled])')]
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
        return
      }
      if (view !== 'demo' && view !== 'topic') return
      if (e.altKey || e.ctrlKey || e.metaKey) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        back()
      } else if (e.key === ' ' && view === 'demo' && !e.target.closest?.('button, a')) {
        e.preventDefault()
        setPlaying((p) => !p)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [view, next, back])

  // the demo holds still while the tab is in the background
  useEffect(() => {
    const onVis = () => document.hidden && setPlaying(false)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const swipe = (dir) => (dir > 0 ? next() : back())

  /* ---------- views ---------- */
  let title
  let body
  if (view === 'demo') {
    title = 'Full product demo'
    body = (
      <Player steps={steps} step={step} headingRef={stepHeadingRef} onSwipe={swipe}>
        <div className="tm-nav">
          <button type="button" className="btn btn-outline tm-icon-btn" onClick={back} disabled={step === 0} aria-label="Previous screen">
            <Icon name="arrowRight" size={16} className="tour-flip" />
          </button>
          <button
            type="button"
            className="btn btn-primary tm-play"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause the demo' : 'Play the demo'}
          >
            {playing ? <PauseIcon /> : <Icon name="play" size={16} />}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button type="button" className="btn btn-outline tm-icon-btn" onClick={next} aria-label="Next screen">
            <Icon name="arrowRight" size={16} />
          </button>
        </div>
        <button type="button" className="tour-textbtn tm-skip" onClick={toTopics}>
          Skip — explore by topic
        </button>
      </Player>
    )
  } else if (view === 'topic') {
    title = topic.label
    body = (
      <Player steps={steps} step={step} headingRef={stepHeadingRef} onSwipe={swipe}>
        <div className="tour-progress" aria-hidden="true">
          <i style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
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
        <button type="button" className="tour-textbtn tm-skip" onClick={() => show('topics')}>
          All topics
        </button>
      </Player>
    )
  } else if (view === 'topics') {
    title = 'Explore in detail'
    body = (
      <div className="tm-topics">
        <h2 ref={viewHeadingRef} tabIndex={-1}>
          {demoSeen ? 'Now, explore the part that matters to you' : 'Explore the part that matters to you'}
        </h2>
        <p className="tour-lede">
          {demoSeen
            ? 'That was the whole product in about a minute. Pick a role or a module to go through it at your own pace.'
            : 'Pick a role or a module to go through it at your own pace.'}
        </p>

        <h3 className="tm-group">By role</h3>
        <div className="tm-options">
          {ROLES.map((p) => (
            <Option
              key={p.id}
              icon={p.icon}
              title={p.label}
              text={p.blurb}
              meta={`${p.steps.length} steps`}
              onClick={() => openTopic(p.id)}
            />
          ))}
        </div>

        <h3 className="tm-group">By module</h3>
        <div className="tm-options">
          {MODULES.map((m) => (
            <Option
              key={m.id}
              icon={m.icon}
              title={m.label}
              meta={m.steps.length === 1 ? '1 step' : `${m.steps.length} steps`}
              onClick={() => openTopic(m.id)}
            />
          ))}
        </div>

        <button type="button" className="tour-textbtn tm-replay" onClick={replay}>
          <Icon name="play" size={14} />
          Watch the full demo again (about {minutes(DEMO.steps.length, DEMO_SECONDS)} min)
        </button>
      </div>
    )
  } else {
    title = 'Done'
    const viewed = [...new Set(steps.map((id) => SCREENS[STEPS[id].screen].label))]
    const demoState = {
      tour: {
        role: topic.demoRole || '',
        problem: topic.demoProblem || '',
        message: `I took the self-guided tour (${topic.label}) and looked at: ${viewed.join(', ')}.`,
      },
    }
    body = (
      <div className="tm-done">
        <span className="tour-end-icon">
          <Icon name="check" size={26} />
        </span>
        <h2 ref={viewHeadingRef} tabIndex={-1}>
          That’s the {topic.label} tour
        </h2>
        <p className="tour-lede">On a demo we run the same screens on your own questions, live.</p>
        <div className="tm-done-ctas">
          <Link to="/book-a-demo" state={demoState} className="btn btn-primary btn-lg" onClick={() => (leaving.current = true)}>
            Book a demo
            <Icon name="arrowRight" size={16} />
          </Link>
          <button type="button" className="btn btn-outline btn-lg" onClick={() => show('topics')}>
            Explore another topic
          </button>
        </div>
        <button type="button" className="tour-textbtn tm-replay" onClick={replay}>
          <Icon name="play" size={14} />
          Watch the full demo again
        </button>
      </div>
    )
  }

  return createPortal(
    <div
      className="tm-backdrop"
      data-lenis-prevent
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="tm-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-label="Teemly product tour" tabIndex={-1}>
        <div className="tm-head">
          <div className="tm-bar">
            <strong>{title}</strong>
            {(view === 'demo' || view === 'topic') && (
              <span className="tm-count">
                {step + 1} / {total}
              </span>
            )}
            <button type="button" className="tm-close" onClick={onClose} aria-label="Close the tour">
              <CloseIcon />
            </button>
          </div>
          {view === 'demo' && (
            // story-style progress: one segment per screen; the running one
            // times the demo, so pausing it pauses the tour
            <div className="tm-stories" aria-hidden="true">
              {steps.map((id, i) => (
                <span key={id} className={i < step ? 'seen' : undefined}>
                  {i === step && (
                    <i
                      key={step}
                      className="run"
                      style={{ animationDuration: `${DEMO_SECONDS}s`, animationPlayState: playing ? 'running' : 'paused' }}
                      onAnimationEnd={next}
                    />
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="tm-body">{body}</div>
      </div>
    </div>,
    document.body,
  )
}
