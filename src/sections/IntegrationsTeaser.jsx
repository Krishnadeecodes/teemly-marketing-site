import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import Reveal from '../home/Reveal.jsx'
import { gsap, prefersReducedMotion } from '../home/useHomeScroll.js'
import '../home/integrations.css'

const facts = [
  { icon: 'download', label: 'CSV export', angle: -90, radius: 'min(40vw,210px)' },
  { icon: 'fileText', label: 'Excel export', angle: -18, radius: 'min(40vw,210px)' },
  { icon: 'puzzle', label: 'API access', angle: 54, radius: 'min(40vw,210px)' },
  { icon: 'lock', label: 'HMAC-signed payloads', angle: 126, radius: 'min(40vw,210px)' },
]

export default function IntegrationsTeaser() {
  const orbitRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion() || !orbitRef.current) return undefined
    const tween = gsap.from(orbitRef.current, {
      scale: 0.7,
      opacity: 0,
      rotate: -20,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: orbitRef.current, start: 'top 82%', once: true },
    })
    return () => {
      tween.scrollTrigger && tween.scrollTrigger.kill()
      tween.revert()
    }
  }, [])

  return (
    <section className="h-integ">
      <div className="h-wrap h-integ-grid">
        <div>
          <span className="h-kicker">Integrations</span>
          <SplitHeading as="h2" text="Your data, exportable — not locked in" />
          <Reveal as="div">
            <p className="h-integ-lede">
              We're not publishing a partner logo wall until we have verified integrations to show. Here's what actually ships today.
            </p>
            <p style={{ marginTop: 24 }}>
              <Link to="/platform/integrations" className="h-textlink">
                See the Integrations page
              </Link>
            </p>
          </Reveal>
        </div>
        <div className="h-orbit" ref={orbitRef} role="img" aria-label="Data export capabilities: CSV export, Excel export, API access, HMAC-signed payloads">
          <div className="h-ringline h-r1" />
          <div className="h-ringline h-r2" />
          <div className="h-spin">
            {facts.map((f) => (
              <div className="h-orb" style={{ '--a': `${f.angle}deg`, '--r': f.radius }} key={f.label}>
                <span>
                  <Icon name={f.icon} size={14} />
                  {f.label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-hubcore">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <defs>
                <linearGradient id="integBar" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#0187E0" />
                  <stop offset="1" stopColor="#07D7D9" />
                </linearGradient>
                <linearGradient id="integStem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#F62DA0" />
                  <stop offset="1" stopColor="#E91E63" />
                </linearGradient>
              </defs>
              <rect x="2" y="4" width="44" height="20" rx="10" fill="url(#integBar)" />
              <path d="M13 20h20v30a10 10 0 0 1-20 0Z" fill="url(#integStem)" />
              <path d="M13 20h20L13 36Z" fill="#032297" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
