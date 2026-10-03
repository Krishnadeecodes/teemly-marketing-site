import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import Reveal from '../home/Reveal.jsx'
import '../home/trustPanel.css'

const cards = [
  {
    icon: 'eyeOff',
    title: 'Privacy Mode has no override',
    desc: 'Any employee can pause tracking instantly. Admins see that it happened — never a way to switch it back on for them.',
  },
  {
    icon: 'shield',
    title: 'Silent Tracking behind a legal gate',
    desc: 'Invisible monitoring stays locked until an admin explicitly accepts responsibility for local consent law — enforced in the UI and the API, not just written down.',
  },
  {
    icon: 'lock',
    title: 'Access scoped by design',
    desc: 'Managers see their assigned teams; admins see the org. Every API call is organisation-scoped — there is no query path into another company\'s data.',
  },
  {
    icon: 'server',
    title: 'Encrypted at rest, encrypted in transit',
    desc: 'Every layer — database, file storage and agent payloads — is encrypted: AES-256 at rest, TLS 1.2 minimum in transit, screenshots and recordings served via 15-minute signed URLs.',
  },
]

const policyRows = [
  { label: 'Team-level reporting', desc: 'Insights aggregated to teams by default', on: true },
  { label: 'Individual detail', desc: 'Only for roles you approve', on: false },
  { label: 'Employee transparency page', desc: 'Everyone can see what\'s measured', on: true },
  { label: 'Data retention', desc: 'Delete raw signals after a set period', on: true },
]

function PolicyPanel() {
  const [state, setState] = useState(policyRows.map((r) => r.on))
  return (
    <div className="h-policy">
      <div className="h-policy-head">
        <b>Workspace privacy policy</b>
        <span className="h-illus">Illustrative settings</span>
      </div>
      {policyRows.map((r, i) => (
        <div className="h-pol" key={r.label}>
          <div>
            <strong>{r.label}</strong>
            <small>{r.desc}</small>
          </div>
          <button
            type="button"
            className="h-tog"
            role="switch"
            aria-checked={state[i]}
            aria-label={r.label}
            onClick={() => setState((s) => s.map((v, j) => (j === i ? !v : v)))}
          />
        </div>
      ))}
    </div>
  )
}

export default function Trust() {
  return (
    <section className="h-trust">
      <div className="h-wrap">
        <div className="h-trust-grid">
          <div className="h-sec-head">
            <span className="h-kicker">Responsible By Design</span>
            <SplitHeading as="h2" text="Visibility your team can actually trust" />
            <p>These are not policy promises — they are the same code path every one of your employees runs.</p>
            <div className="h-not-list">
              <span>No keystroke logging</span>
              <span>No email or clipboard content</span>
              <span>No camera / microphone access</span>
              <span>AES-256 encryption at rest &amp; in transit</span>
              <span>Data residency in India (AWS Mumbai)</span>
              <span>DPDP &amp; GDPR-aligned architecture</span>
            </div>
            <div className="h-trust-ctas">
              <Link to="/security" className="h-btn h-btn-primary">
                Explore Security
                <span className="h-arr" aria-hidden="true">
                  <Icon name="arrowRight" size={14} />
                </span>
              </Link>
              <Link to="/trust-center" className="h-btn h-btn-ghost">
                Visit the Trust Center
              </Link>
            </div>
          </div>
          <Reveal as="div">
            <PolicyPanel />
          </Reveal>
        </div>
        <div className="h-trust-pr-grid">
          {cards.map((c, i) => (
            <Reveal as="div" className="h-trust-pr h-spot" delay={i * 0.06} key={c.title}>
              <span className="h-trust-pr-ic">
                <Icon name={c.icon} size={20} />
              </span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
