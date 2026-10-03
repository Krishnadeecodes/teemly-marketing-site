import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import './chatbot.css'

const quickLinks = [
  { label: 'Understand Teemly', to: '/why-teemly' },
  { label: 'Explore Solutions', to: '/solutions' },
  { label: 'See the Platform', to: '/platform' },
  { label: 'Calculate ROI', to: '/roi-calculator' },
  { label: 'Security & Privacy', to: '/security' },
  { label: 'Book a Demo', to: '/book-a-demo' },
]

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  function go(to) {
    setOpen(false)
    navigate(to)
  }

  return (
    <div className="chatbot-root">
      {open && (
        <div className="chatbot-panel" role="dialog" aria-label="Site navigation assistant">
          <div className="chatbot-head">
            <span className="chatbot-avatar">
              <Icon name="sparkle" size={16} />
            </span>
            <div>
              <strong>Teemly Guide</strong>
              <span>Quick links, not a live AI — tap to jump straight there</span>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="chatbot-body">
            <p>Hi, I'm the Teemly site guide. What would you like to explore?</p>
            <div className="chatbot-options">
              {quickLinks.map((q) => (
                <button key={q.to} className="chatbot-option" onClick={() => go(q.to)}>
                  {q.label}
                  <Icon name="arrowRight" size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <button
        className="chatbot-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close site guide' : 'Open site guide'}
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
