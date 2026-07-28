import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import './footer.css'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Dashboard & Insights', to: '/product/dashboard' },
      { label: 'Teams', to: '/product/teams' },
      { label: 'Screenshot Intelligence', to: '/product/screenshots' },
      { label: 'Attendance', to: '/product/attendance' },
      { label: 'Intelligence Reports', to: '/product/reports' },
      { label: 'Settings & Controls', to: '/product/settings' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Teemly', to: '/about' },
      { label: 'Security & Privacy', to: '/security' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Get Started',
    links: [
      { label: 'Start Free Trial', to: '/pricing' },
      { label: 'Book a Demo', to: '/contact' },
      { label: 'Sign in', to: '/contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="brand-bar" />
      <div className="container footer-top">
        <div className="footer-brand">
          <Logo variant="light" size={30} />
          <p>
            Workforce Intelligence Platform. Real-time visibility into productivity, attendance and work
            patterns — powered by Teemly's own lightweight desktop agent.
          </p>
          <div className="footer-badges">
            <span className="pill-tag foot-pill">Own EXE Agent</span>
            <span className="pill-tag foot-pill">No Browser Extension</span>
          </div>
        </div>

        <div className="footer-cols">
          {columns.map((col) => (
            <div key={col.title} className="footer-col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Teemly, by Deecodes. All rights reserved.</p>
        <div className="footer-legal">
          <Link to="/security">Privacy</Link>
          <Link to="/security">Terms</Link>
          <Link to="/security">DPDP &amp; GDPR</Link>
        </div>
      </div>
    </footer>
  )
}
