import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import Logo from './Logo.jsx'
import { welcome } from '../data/chatbotKnowledge.js'
import { getIntent, respond } from '../lib/chatbot.js'
import { signInChat, useChatSignedIn } from '../lib/tour.js'
import { useLeadForm } from '../lib/useLeadForm.js'
import { FALLBACK_EMAIL } from '../lib/submitForm.js'
import FieldError from './FieldError.jsx'
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

/** The chat's sign-in: name and work email, sent with the question asked. */
function ChatSignIn({ question }) {
  const { errors, status, formError, field, handleSubmit } = useLeadForm('chat', { name: '', email: '' }, signInChat(question))
  const sending = status === 'sending'
  return (
    <form className="chatbot-gate-form" onSubmit={handleSubmit} noValidate>
      <div className="form-hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input {...field('website')} tabIndex={-1} autoComplete="off" />
      </div>
      <label htmlFor="name">Name</label>
      <input {...field('name')} autoComplete="name" placeholder="Jane Doe" required />
      <FieldError id="name" error={errors.name} />
      <label htmlFor="email">Work email</label>
      <input {...field('email')} type="email" autoComplete="email" placeholder="jane@company.com" required />
      <FieldError id="email" error={errors.email} />
      {formError && (
        <p className="chatbot-gate-error" role="alert">
          {formError} Or email <a href={`mailto:${FALLBACK_EMAIL}`}>{FALLBACK_EMAIL}</a>.
        </p>
      )}
      <button type="submit" disabled={sending} aria-busy={sending || undefined}>
        {sending ? 'One moment…' : 'Show my answer'}
        <Icon name="arrowRight" size={14} />
      </button>
      <small>
        By continuing you agree that Teemly may contact you and to our <a href="/legal/privacy">Privacy Policy</a>.
      </small>
    </form>
  )
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => [botMessage(welcome)])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const rootRef = useRef(null)
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const timerRef = useRef(null)
  // the last plan, team size and billing asked about, for follow-ups like
  // "what about yearly?"
  const contextRef = useRef({})
  // Answers need a quick sign-in (name and email; a tour sign-in counts too).
  // The first question asked before it waits here until the visitor signs in.
  const signedIn = useChatSignedIn()
  const signedInRef = useRef(signedIn)
  signedInRef.current = signedIn
  const [pending, setPending] = useState(null)

  // Keep the latest message in view; with the sign-in showing, from the
  // question just above it, so the visitor sees what they asked and why.
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const gate = el.querySelector('.chatbot-gate')
    const from = gate?.previousElementSibling || gate
    el.scrollTop = from ? el.scrollTop + from.getBoundingClientRect().top - el.getBoundingClientRect().top - 12 : el.scrollHeight
  }, [messages, typing, open])

  // Signed in (here or on the tour page): the waiting answer arrives.
  useEffect(() => {
    if (!signedIn || !pending) return
    setMessages((m) => [
      ...m.filter((x) => !x.gate),
      { id: nextId++, from: 'bot', text: "Thanks — you're signed in. Here's your answer:", followUps: [] },
      botMessage(pending),
    ])
    setPending(null)
  }, [signedIn, pending])

  useEffect(() => {
    if (!open) return undefined
    inputRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  // Close when the visitor clicks or taps anywhere outside the chat.
  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  // ...and when another page opens.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  function reply(userText, answer) {
    if (typing || pending) return
    setMessages((m) => [...m, { id: nextId++, from: 'user', text: userText }])
    setTyping(true)
    timerRef.current = setTimeout(() => {
      if (signedInRef.current) {
        setMessages((m) => [...m, botMessage(answer)])
      } else {
        // not signed in yet: ask for it, and keep the answer until then
        setPending(answer)
        setMessages((m) => [...m, { id: nextId++, from: 'bot', gate: true, question: userText, followUps: [] }])
      }
      setTyping(false)
    }, TYPING_MS)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    const { answer, context } = respond(text, contextRef.current)
    contextRef.current = context
    reply(text, answer)
  }

  function go(to) {
    setOpen(false)
    navigate(to)
  }

  function restart() {
    clearTimeout(timerRef.current)
    setTyping(false)
    setPending(null)
    contextRef.current = {}
    setMessages([botMessage(welcome)])
  }

  const last = messages[messages.length - 1]

  return (
    <div className="chatbot-root" ref={rootRef}>
      {open && (
        // data-lenis-prevent: the home page's smooth scrolling leaves the wheel to the chat
        <div className="chatbot-panel" role="dialog" aria-label="Teemly Guide chat" data-lenis-prevent>
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
            {messages.map((m) =>
              m.gate ? (
                <div key={m.id} className="chatbot-msg bot chatbot-gate">
                  <div className="chatbot-bubble">
                    <p>
                      <strong>Just your name and email</strong> and your answer appears straight away.
                    </p>
                  </div>
                  <ChatSignIn question={m.question} />
                </div>
              ) : (
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
              ),
            )}
            {typing && (
              <div className="chatbot-msg bot">
                <div className="chatbot-bubble chatbot-typing" aria-label="Typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            {!typing && !pending && last.from === 'bot' && last.followUps.length > 0 && (
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
              placeholder={pending ? 'Sign in above to get your answer' : 'e.g. price for 25 people on Professional'}
              disabled={!!pending}
              maxLength={300}
              enterKeyHint="send"
              autoComplete="off"
              aria-label="Type your question"
            />
            <button type="submit" disabled={!input.trim() || typing || !!pending} aria-label="Send">
              <Icon name="arrowRight" size={16} />
            </button>
          </form>
        </div>
      )}
      <button className="chatbot-fab" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close Teemly Guide' : 'Open Teemly Guide'}>
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
