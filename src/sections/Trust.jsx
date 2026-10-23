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
    desc: 'Any employee can pause data collection instantly. Admins see that it happened — never a way to switch it back on for them.',
  },
  {
    icon: 'shield',
    title: 'Unannounced Mode behind a legal gate',
    desc: 'Unannounced collection stays locked until an admin explicitly accepts responsibility for local consent law. The platform enforces this; it is not just a policy.',
  },
  {
    icon: 'lock',
    title: 'Access scoped by design',
    desc: "Managers see their own teams; admins see the whole organization. Each company's data is kept completely separate from every other company's.",
  },
  {
    icon: 'server',
    title: 'Encrypted at rest, encrypted in transit',
    desc: 'All data is encrypted with industry-standard protocols, at rest and in transit. Visual snapshots and session replays open through secure links that expire after 15 minutes.',
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
    <section className="h-trust h-sec-blue">
      <div className="h-wrap">
        <div className="h-trust-grid">
          <div className="h-sec-head">
            <span className="h-kicker">Responsible By Design</span>
            <SplitHeading as="h2" text="Visibility your team can actually trust" />
            <p>These are not policy promises — they are the same code path every one of your employees runs.</p>
            <div className="h-not-list">
              <span>No typed-content capture</span>
              <span>No personal message or copied content</span>
              <span>No audio or video device access</span>
              <span>Enterprise-grade encryption at rest &amp; in transit</span>
              <span>Data residency in India</span>
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
