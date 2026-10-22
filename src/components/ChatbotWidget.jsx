import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import Logo from './Logo.jsx'
import { welcome } from '../data/chatbotKnowledge.js'
import { getIntent, matchIntent } from '../lib/chatbot.js'
import './chatbot.css'

const TYPING_MS = 550

let nextId = 0
function botMessage(answer) {
  return {
    id: nextId++,
    from: 'bot',
    text: answer.text,
    bullets: answer.bullets,
    links: answer.links,
    followUps: (answer.followUps || []).map(getIntent).filter(Boolean),
  }
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => [botMessage(welcome)])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const navigate = useNavigate()
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  // Keep the latest message in view.
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing, open])

  useEffect(() => {
    if (!open) return undefined
    inputRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function reply(userText, answer) {
    if (typing) return
    setMessages((m) => [...m, { id: nextId++, from: 'user', text: userText }])
    setTyping(true)
    timerRef.current = setTimeout(() => {
      setMessages((m) => [...m, botMessage(answer)])
      setTyping(false)
    }, TYPING_MS)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    reply(text, matchIntent(text))
  }

  function go(to) {
    setOpen(false)
    navigate(to)
  }

  function restart() {
    clearTimeout(timerRef.current)
    setTyping(false)
    setMessages([botMessage(welcome)])
  }

  const last = messages[messages.length - 1]

  return (
    <div className="chatbot-root">
      {open && (
        <div className="chatbot-panel" role="dialog" aria-label="Teemly Guide chat">
          <div className="chatbot-head">
            <span className="chatbot-avatar">
              <Logo variant="mark" size={22} label={null} />
            </span>
            <div>
              <strong>Teemly Guide</strong>
              <span>Instant answers about Teemly</span>
            </div>
            <button className="chatbot-restart" onClick={restart} aria-label="Start over" title="Start over">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="chatbot-messages" ref={listRef} aria-live="polite">
            {messages.map((m) => (
              <div key={m.id} className={`chatbot-msg ${m.from}`}>
                <div className="chatbot-bubble">
                  <p>{m.text}</p>
                  {m.bullets && (
                    <ul>
                      {m.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {m.links && (
                  <div className="chatbot-links">
                    {m.links.map((l) => (
                      <button key={l.to} className="chatbot-option" onClick={() => go(l.to)}>
                        {l.label}
                        <Icon name="arrowRight" size={14} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="chatbot-msg bot">
                <div className="chatbot-bubble chatbot-typing" aria-label="Typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            {!typing && last.from === 'bot' && last.followUps.length > 0 && (
              <div className="chatbot-chips">
                {last.followUps.map((f) => (
                  <button key={f.id} className="chatbot-chip" onClick={() => reply(f.label, f)}>
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              maxLength={300}
              enterKeyHint="send"
              autoComplete="off"
              aria-label="Type your question"
            />
            <button type="submit" disabled={!input.trim() || typing} aria-label="Send">
              <Icon name="arrowRight" size={16} />
            </button>
          </form>
        </div>
      )}
      <button
        className="chatbot-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close Teemly Guide' : 'Open Teemly Guide'}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        ) : (
          <Icon name="message" size={22} />
        )}
      </button>
    </div>
  )
}
