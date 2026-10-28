import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import SocialLinks from './SocialLinks.jsx'
import { footerColumns, legalLinks, resourcesFooterLinks } from '../data/navigation.js'
import { useResourceMenu } from '../lib/resourcesApi.js'
import './footer.css'

// The footer stays mounted across routes, so its "teemly" wordmark reveals with
// its own observer rather than a GSAP ScrollTrigger: the home page kills every
// ScrollTrigger when it unmounts, which used to leave this text stuck invisible.
function useInView() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, inView]
}

export default function Footer() {
  const resourceLinks = resourcesFooterLinks(useResourceMenu())
  const [bigRef, bigIn] = useInView()
  return (
    <footer className="site-footer">
      <div className="brand-bar" />
      <div className="container footer-top">
        <div className="footer-brand">
          <Logo tone="light" size="md" />
          <p>
            Organizational Intelligence Platform. Teemly connects signals from people, work and technology into
            one live view, captured by Teemly’s own lightweight desktop app.
          </p>
          <div className="footer-badges">
            <span className="pill-tag foot-pill">Own desktop app</span>
            <span className="pill-tag foot-pill">DPDP &amp; GDPR-aligned</span>
          </div>
          <SocialLinks className="footer-social" />
        </div>

        <div className="footer-cols">
          {footerColumns.map((col) => (
            <div key={col.title} className="footer-col">
              <h4>{col.title}</h4>
              <ul>
                {(col.title === 'Resources' ? resourceLinks : col.links).map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={`foot-big${bigIn ? ' is-in' : ''}`} ref={bigRef} aria-hidden="true">
        teemly
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Teemly. All rights reserved.</p>
        <div className="footer-legal">
          {legalLinks.map((l) => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
