import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import Reveal from '../home/Reveal.jsx'
import { footerColumns, legalLinks, resourcesFooterLinks } from '../data/navigation.js'
import { useResourceMenu } from '../lib/resourcesApi.js'
import './footer.css'

export default function Footer() {
  const resourceLinks = resourcesFooterLinks(useResourceMenu())
  return (
    <footer className="site-footer">
      <div className="brand-bar" />
      <div className="container footer-top">
        <div className="footer-brand">
          <Logo variant="light" size={30} />
          <p>
            Organizational Intelligence Platform. Teemly connects signals from people, work and technology into
            one real-time record — captured by an agent Teemly built and owns end to end.
          </p>
          <div className="footer-badges">
            <span className="pill-tag foot-pill">Own EXE Agent</span>
            <span className="pill-tag foot-pill">DPDP &amp; GDPR-aligned</span>
          </div>
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

      <Reveal as="div" className="foot-big" aria-hidden="true">
        teemly
      </Reveal>

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
