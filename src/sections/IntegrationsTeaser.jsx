import { useEffect, useRef } from 'react'
import Logo from '../components/Logo.jsx'
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
  { icon: 'lock', label: 'Secure, signed data', angle: 126, radius: 'min(40vw,210px)' },
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
              Export your data whenever you need it, or connect it to the tools you already use. Here's what's available today.
            </p>
            <p style={{ marginTop: 24 }}>
              <Link to="/platform/integrations" className="h-textlink">
                See the Integrations page
              </Link>
            </p>
          </Reveal>
        </div>
        <div className="h-orbit" ref={orbitRef} role="img" aria-label="Data export capabilities: CSV export, Excel export, API access, secure signed data">
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
            <Logo variant="mark" size={40} label={null} />
          </div>
        </div>
      </div>
    </section>
  )
}
