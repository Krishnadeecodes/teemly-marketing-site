import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import FitScale from '../components/FitScale.jsx'
import { PLAYLIST, SCREENS, STEPS } from '../data/tour.js'
import { useTourUnlocked } from '../lib/tour.js'
import TourGatePopup from './TourUnlock.jsx'
import './tourPlaylist.css'

/*
 * The product tour on /take-a-tour, laid out as a playlist: what is playing
 * on the left, stepped through with Back / Next, and every entry of the tour
 * under "More Modules" on the right — the product overview first, then each
 * module. Picking an entry plays it; "Next" plays the one after. Until the
 * visitor signs up, the tour shows locked behind the sign-up popup.
 */

const byId = Object.fromEntries(PLAYLIST.map((m) => [m.id, m]))

// Every step's text is laid out in the step box at once, in one cell, with
// only the current one shown — so the box keeps one size whatever is playing.
const ALL_SCREENS = Object.keys(SCREENS)
const ALL_STEPS = Object.keys(STEPS)

// The player's screen box: the product screens' design width, and the box's
// height as a share of its width. Each screen is scaled to fill the box as
// fully as it can without cropping — short screens to its width, tall ones
// to its height — so the box keeps one size and every screen shows large.
const SCREEN_W = 900
const BOX_RATIO = 472 / SCREEN_W

/** Scales every screen layer inside `boxRef` to fit the box, centred. */
function useScreenFit(boxRef) {
  const [fit, setFit] = useState({ height: null, scales: {} })

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return undefined
    const measure = () => {
      const w = box.clientWidth
      if (!w) return
      const h = Math.round(w * BOX_RATIO)
      const scales = {}
      box.querySelectorAll('[data-screen]').forEach((layer) => {
        const natural = layer.offsetHeight || 1
        scales[layer.dataset.screen] = Math.min(w / SCREEN_W, h / natural)
      })
      setFit({ height: h, scales })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    box.querySelectorAll('[data-screen]').forEach((layer) => ro.observe(layer))
    document.fonts?.ready?.then(measure)
    return () => ro.disconnect()
  }, [boxRef])

  return fit
}

// ?module=teams opens the tour on that entry, so it can be shared.
function initialIndex() {
  const i = PLAYLIST.findIndex((m) => m.id === new URLSearchParams(window.location.search).get('module'))
  return Math.max(i, 0)
}

// Keeps the address in step without a router navigation, which would scroll
// the page to the top (see Layout.jsx).
function writeUrl(id) {
  const q = new URLSearchParams(window.location.search)
  q.set('module', id)
  window.history.replaceState(window.history.state, '', `${window.location.pathname}?${q}${window.location.hash}`)
}

/** Puts a ring around the step's target and dims the rest of the screen; `fit` re-measures it after a rescale. */
function useSpotlight(stageRef, target, fit) {
  const [spot, setSpot] = useState(null)

  const measure = useCallback(() => {
    const stage = stageRef.current
    if (!stage || !target) return
    const el = stage.querySelectorAll(target.sel)[target.index || 0]
    if (!el) {
      setSpot(null)
      return
    }
    // the screen is scaled to fit the player; work in its unscaled pixels
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
  }, [measure, stageRef, fit])

  return spot
}

/** A step's count, labels, title and description. */
function StepText({ s, n, total, showScreen }) {
  return (
    <>
      <p className="tp-step-meta">
        <span>
          Step {n} of {total}
        </span>
        {showScreen && <span className="tp-chip">{SCREENS[s.screen].label}</span>}
        {s.trust && (
          <span className="tp-trust">
            <Icon name="shield" size={12} /> Privacy &amp; control
          </span>
        )}
      </p>
      <h4>{s.title}</h4>
      <p>{s.body}</p>
    </>
  )
}

/** The entry playing: its screens with the current part highlighted, and the step below. */
function Player({ item, step, setStep, onNextItem, active }) {
  const stageRef = useRef(null)
  const boxRef = useRef(null)
  const rootRef = useRef(null)
  const touch = useRef(null)
  const total = item.steps.length
  const current = STEPS[item.steps[step]]
  const fit = useScreenFit(boxRef)
  const spot = useSpotlight(stageRef, current.target, fit)
  const last = step === total - 1
  const overview = item.id === 'overview'

  const next = useCallback(() => (last ? onNextItem() : setStep(step + 1)), [last, onNextItem, setStep, step])
  const back = useCallback(() => step > 0 && setStep(step - 1), [setStep, step])

  // ← → step through while the player is on screen and no field has focus
  useEffect(() => {
    if (!active) return undefined
    function onKey(e) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.target.closest?.('input, textarea, select, [contenteditable]')) return
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
      const r = rootRef.current?.getBoundingClientRect()
      if (!r || r.bottom < 0 || r.top > window.innerHeight) return
      e.preventDefault()
      if (e.key === 'ArrowRight') next()
      else back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, next, back])

  return (
    <div className="tp-frame" ref={rootRef}>
      <div
        className="tp-screen"
        onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
        onTouchEnd={(e) => {
          if (!touch.current) return
          const dx = e.changedTouches[0].clientX - touch.current.x
          const dy = e.changedTouches[0].clientY - touch.current.y
          touch.current = null
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : back)()
        }}
      >
        <div className="tp-stage" ref={boxRef} style={{ height: fit.height ?? undefined }} aria-hidden="true">
          {ALL_SCREENS.map((id) => {
            const Screen = SCREENS[id].Comp
            const on = id === current.screen
            return (
              <div
                className={`tp-layer${on ? ' on' : ''}`}
                key={id}
                data-screen={id}
                ref={on ? stageRef : undefined}
                style={{ width: SCREEN_W, '--fit': fit.scales[id] ?? 0 }}
              >
                <Screen />
                {on && spot && <div className="tp-spot" style={spot} />}
              </div>
            )
          })}
        </div>
      </div>

      <div className="tp-step">
        <div className="tp-step-text">
          <div aria-live="polite">
            <StepText s={current} n={step + 1} total={total} showScreen={overview} />
          </div>
          {ALL_STEPS.map((id) => (
            <div className="tp-step-sizer" aria-hidden="true" key={id}>
              <StepText s={STEPS[id]} n={10} total={10} showScreen />
            </div>
          ))}
        </div>
        <div className="tp-step-nav">
          <button type="button" className="tp-round" onClick={back} disabled={step === 0} aria-label="Previous step">
            <Icon name="arrowRight" size={16} className="tp-flip" />
          </button>
          <ol className="tp-dots" aria-label="Steps">
            {item.steps.map((id, i) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  aria-label={`Step ${i + 1}: ${STEPS[id].title}`}
                  aria-current={i === step ? 'step' : undefined}
                />
              </li>
            ))}
          </ol>
          <button type="button" className="tp-round primary" onClick={next} aria-label={last ? 'Next in the tour' : 'Next step'}>
            <Icon name="arrowRight" size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TourPlaylist() {
  const unlocked = useTourUnlocked()
  const [index, setIndex] = useState(initialIndex)
  const [step, setStep] = useState(0)
  const mainRef = useRef(null)
  const titleRef = useRef(null)
  const focusTitle = useRef(false)
  const seen = useRef(new Set())

  const item = PLAYLIST[index]
  const upNext = PLAYLIST[(index + 1) % PLAYLIST.length]
  seen.current.add(item.id)

  useEffect(() => {
    if (unlocked) writeUrl(item.id)
  }, [unlocked, item.id])

  useEffect(() => {
    if (!focusTitle.current) return
    focusTitle.current = false
    titleRef.current?.focus({ preventScroll: true })
  })

  const play = useCallback((i) => {
    setIndex(i)
    setStep(0)
  }, [])

  const watchNext = useCallback(() => play((index + 1) % PLAYLIST.length), [play, index])

  function pick(i) {
    play(i)
    focusTitle.current = true
    const r = mainRef.current?.getBoundingClientRect()
    if (r && r.top < 0) mainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const demoState = {
    tour: {
      message: `I took the self-guided tour and looked at: ${[...seen.current].map((id) => byId[id].label).join(', ')}.`,
    },
  }

  return (
    <>
      {!unlocked && <TourGatePopup />}
      <div className={`tp${unlocked ? '' : ' is-locked'}`} inert={unlocked ? undefined : ''} aria-hidden={unlocked ? undefined : true}>
        <div className="tp-main" ref={mainRef}>
          <div className="tp-info">
            <span className="tp-info-icon">
              <Icon name={item.icon} size={18} />
            </span>
            <div className="tp-info-text">
              <span className="tp-now">Now playing</span>
              <h3 ref={titleRef} tabIndex={-1}>
                {item.label}
              </h3>
            </div>
            <div className="tp-actions">
              <Link to="/book-a-demo" state={demoState} className="btn btn-outline btn-sm">
                Book a demo
              </Link>
              <button type="button" className="btn btn-primary btn-sm" onClick={watchNext}>
                <span>
                  Next<span className="tp-next-name">: {upNext.label}</span>
                </span>
                <Icon name="arrowRight" size={14} />
              </button>
            </div>
          </div>
          <Player item={item} step={step} setStep={setStep} onNextItem={watchNext} active={unlocked} />
        </div>

        <aside className="tp-list" aria-label="Tour contents">
          <h3>More Modules</h3>
          <ol>
            {PLAYLIST.map((m, i) => {
              const Screen = SCREENS[STEPS[m.steps[0]].screen].Comp
              const on = i === index
              return (
                <li className={`tp-item tint-${i % 4}${on ? ' on' : ''}`} key={m.id}>
                  <span className="tp-item-head">
                    <button type="button" onClick={() => pick(i)} aria-current={on ? 'true' : undefined}>
                      {m.label}
                    </button>
                    {on && <span className="tp-playing">Now playing</span>}
                  </span>
                  <span className="tp-thumb" aria-hidden="true" inert="">
                    {/* zoomed in: the screen is scaled as if it were 560px wide, and the
                        card crops it to its top-left part, so the picture reads larger */}
                    <span className="tp-thumb-screen">
                      <FitScale width={560} media="all">
                        <span className="tp-thumb-full">
                          <Screen />
                        </span>
                      </FitScale>
                    </span>
                  </span>
                </li>
              )
            })}
          </ol>
        </aside>
      </div>
    </>
  )
}
