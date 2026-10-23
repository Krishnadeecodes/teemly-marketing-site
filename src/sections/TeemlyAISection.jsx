import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import { ScrollTrigger, prefersReducedMotion } from '../home/useHomeScroll.js'
import { whenInView } from '../home/reveal.js'
import '../home/ai.css'

const QA = [
  {
    q: 'Where is focus dropping across the week?',
    a: 'Org-wide focus falls 18% after 3 PM on Fridays — lighter meeting loads that afternoon would protect the time.',
    bars: [
      ['Mon', 82],
      ['Tue', 88],
      ['Wed', 79],
      ['Thu', 74],
      ['Fri (after 3pm)', 56, true],
    ],
    label: 'Focus score by day, last 4 weeks',
  },
  {
    q: 'Which teams are deep in focus work this sprint?',
    a: 'Engineering deep-focus sessions rose 22% in week 3 — the new sprint cadence is working.',
    bars: [
      ['Engineering', 91, true],
      ['Design', 68],
      ['Sales', 47],
      ['Support', 52],
    ],
    label: 'Deep-work session share by team',
  },
  {
    q: 'Are we paying for software nobody uses?',
    a: 'A design tool licence has gone unused for 21 days across 6 seats — a candidate to right-size next renewal.',
    bars: [
      ['Design tool', 14, true],
      ['Core suite', 94],
      ['Analytics', 61],
      ['Comms', 88],
    ],
    label: 'Seat utilisation by tool, last 30 days',
  },
]

function ThinkingDots() {
  return (
    <div className="h-thinking">
      <i />
      <i />
      <i />
    </div>
  )
}

// `leaving`: the previous answer fading out while the next question types,
// so it clears smoothly instead of vanishing in one frame.
function Answer({ item, barsOn, animate = false, leaving = false }) {
  const fade = animate ? 'h-fadein' : undefined
  return (
    <div className={`h-msg-a${leaving ? ' h-msg-leaving' : ''}`} aria-hidden={leaving || undefined}>
      <div className="h-av">
        <Icon name="sparkle" size={16} />
      </div>
      <div className="h-msg-body">
        <p className={fade}>{item.a}</p>
        <div className={fade}>
          <small>{item.label}</small>
          <div className="h-bars-a">
            {item.bars.map(([label, val, hot]) => (
              <div className="h-bar-row" key={label}>
                <span>{label}</span>
                <span className="h-bar-track">
                  <span className={`h-fill${hot ? ' hot' : ''}`} style={{ width: barsOn ? `${val}%` : '0%' }} />
                </span>
                <b>{val}%</b>
              </div>
            ))}
          </div>
        </div>
        <div className={`h-src${animate ? ' h-fadein' : ''}`}>
          <span>Sources: work activity, team structure</span>
        </div>
      </div>
    </div>
  )
}

export default function TeemlyAISection() {
  const [active, setActive] = useState(0)
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState('typing') // typing | thinking | answered
  const [barsOn, setBarsOn] = useState(false)
  // the answer currently on screen; it changes only once the next one is ready
  const [shown, setShown] = useState(null)
  const sectionRef = useRef(null)
  const started = useRef(false)
  // once the visitor picks a question themselves, the demo stops moving on
  const pickedRef = useRef(false)
  const autoRef = useRef(null)
  const tokenRef = useRef(0)
  const inViewRef = useRef(false)
  const pendingRef = useRef(null)

  function play(i) {
    const token = ++tokenRef.current
    pendingRef.current = null
    setActive(i)
    setTyped('')
    setPhase('typing')
    clearTimeout(autoRef.current)

    const reduced = prefersReducedMotion()
    const q = QA[i].q
    if (reduced) {
      setTyped(q)
      setShown(i)
      setPhase('answered')
      setBarsOn(true)
      return
    }

    let n = 0
    const typeNext = () => {
      if (tokenRef.current !== token) return
      if (n <= q.length) {
        setTyped(q.slice(0, n))
        n += 1
        setTimeout(typeNext, 22)
      } else {
        setPhase('thinking')
        setTimeout(() => {
          if (tokenRef.current !== token) return
          setBarsOn(false)
          setShown(i)
          setPhase('answered')
          requestAnimationFrame(() => requestAnimationFrame(() => setBarsOn(true)))
          if (pickedRef.current) return
          autoRef.current = setTimeout(() => {
            // only move on to the next question while the section is on
            // screen; otherwise resume when the visitor scrolls back
            if (inViewRef.current) play((i + 1) % QA.length)
            else pendingRef.current = (i + 1) % QA.length
          }, 7000)
        }, 900)
      }
    }
    typeNext()
  }

  useEffect(() => {
    if (prefersReducedMotion()) {
      play(0)
      return undefined
    }
    const stopStart = whenInView([sectionRef.current], () => {
      if (!started.current) {
        started.current = true
        play(0)
      }
    })
    const visibility = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => {
        inViewRef.current = self.isActive
        if (self.isActive && pendingRef.current !== null) {
          const next = pendingRef.current
          pendingRef.current = null
          play(next)
        }
      },
    })
    return () => {
      stopStart()
      visibility.kill()
      clearTimeout(autoRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onPromptClick(i) {
    started.current = true
    pickedRef.current = true
    play(i)
  }

  const answered = phase === 'answered' && shown !== null

  return (
    <section className="h-ai h-sec-blue" ref={sectionRef}>
      <div className="h-aurora" aria-hidden="true">
        <i className="a1" />
        <i className="a2" />
      </div>
      <div className="h-wrap h-ai-grid">
        <div>
          <span className="h-kicker pink">Teemly AI</span>
          <SplitHeading as="h2" text="Ask your organization a question. Get an answer with context." />
          <p className="h-ai-lede">
            Plain-language answers grounded in your organisational record, with the source behind every number.
          </p>
          <div className="h-prompts">
            {QA.map((item, i) => (
              <button
                key={item.q}
                type="button"
                aria-pressed={active === i}
                onClick={() => onPromptClick(i)}
              >
                {item.q}
              </button>
            ))}
          </div>
          <p className="h-ai-note">Answers are shown at team level by default. What each person can ask follows the roles you set.</p>
        </div>

        <div className="h-console">
          <div className="h-console-top">
            <Icon name="sparkle" size={18} />
            Teemly AI
            <span className="h-live">
              <i /> Live demo
            </span>
          </div>
          <div className="h-console-body">
            {/* Invisible copies of every finished answer share the live
                answer's grid cell, so the console is always as tall as the
                longest one and the page below never jumps as it cycles. */}
            {QA.map((item) => (
              <div className="h-console-layer h-console-sizer" aria-hidden="true" key={item.q}>
                <div className="h-msg-u">{item.q}</div>
                <Answer item={item} barsOn />
              </div>
            ))}
            <div className="h-console-layer" aria-live="polite">
              {/* the full question sits invisibly underneath, so the bubble
                  is its final size from the start and the text types into it
                  instead of the bubble shrinking and stretching each time */}
              <div className="h-msg-u h-msg-typing">
                <span className="h-msg-ghost" aria-hidden="true">
                  {QA[active].q}
                </span>
                <span>
                  {typed}
                  {phase === 'typing' && <span className="h-caret" />}
                </span>
              </div>
              {answered && <Answer key={shown} item={QA[shown]} barsOn={barsOn} animate />}
              {phase === 'typing' && shown !== null && (
                <Answer key={`leaving-${shown}`} item={QA[shown]} barsOn leaving />
              )}
              {phase === 'thinking' && (
                <div className="h-msg-a">
                  <div className="h-av">
                    <Icon name="sparkle" size={16} />
                  </div>
                  <div className="h-msg-body">
                    <ThinkingDots />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
