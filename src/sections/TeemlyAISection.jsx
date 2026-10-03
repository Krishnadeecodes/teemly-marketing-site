import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import { ScrollTrigger, prefersReducedMotion } from '../home/useHomeScroll.js'
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

export default function TeemlyAISection() {
  const [active, setActive] = useState(0)
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState('typing') // typing | thinking | answered
  const [barsOn, setBarsOn] = useState(false)
  const sectionRef = useRef(null)
  const started = useRef(false)
  const autoRef = useRef(null)
  const tokenRef = useRef(0)

  function play(i) {
    const token = ++tokenRef.current
    setActive(i)
    setTyped('')
    setBarsOn(false)
    setPhase('typing')
    clearTimeout(autoRef.current)

    const reduced = prefersReducedMotion()
    const q = QA[i].q
    if (reduced) {
      setTyped(q)
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
          setPhase('answered')
          requestAnimationFrame(() => requestAnimationFrame(() => setBarsOn(true)))
          autoRef.current = setTimeout(() => play((i + 1) % QA.length), 7000)
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
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      once: true,
      onEnter: () => {
        if (!started.current) {
          started.current = true
          play(0)
        }
      },
      onEnterBack: () => {
        if (!started.current) {
          started.current = true
          play(0)
        }
      },
    })
    return () => {
      trigger.kill()
      clearTimeout(autoRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onPromptClick(i) {
    started.current = true
    play(i)
  }

  const current = QA[active]

  return (
    <section className="h-ai" ref={sectionRef}>
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
          <div className="h-console-body" aria-live="polite">
            <div className="h-msg-u">
              {typed}
              {phase === 'typing' && <span className="h-caret" />}
            </div>
            {(phase === 'thinking' || phase === 'answered') && (
              <div className="h-msg-a">
                <div className="h-av">
                  <Icon name="sparkle" size={16} />
                </div>
                <div className="h-msg-body">
                  {phase === 'thinking' ? (
                    <div className="h-thinking">
                      <i />
                      <i />
                      <i />
                    </div>
                  ) : (
                    <>
                      <p className="h-fadein">{current.a}</p>
                      <div className="h-fadein">
                        <small>{current.label}</small>
                        <div className="h-bars-a">
                          {current.bars.map(([label, val, hot]) => (
                            <div className="h-bar-row" key={label}>
                              <span>{label}</span>
                              <span className="h-bar-track">
                                <span
                                  className={`h-fill${hot ? ' hot' : ''}`}
                                  style={{ width: barsOn ? `${val}%` : '0%' }}
                                />
                              </span>
                              <b>{val}%</b>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="h-src h-fadein">
                        <span>Sources: work activity, team structure</span>
                        <span className="h-illus">Illustrative</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
