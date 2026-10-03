import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import teemlyLogo from '../assets/teemly-logo.jpg'

import MegaMenu from './MegaMenu.jsx'
import Icon from './Icon.jsx'
import ModulePreview from './ModulePreview.jsx'
import { DashboardMock, ReportsMock, TeamsMock } from './ProductMockups.jsx'
import {
  platformLinks,
  solutionsLinks,
  whyTeemlyLinks,
  resourcesLinks,
  securityLinks,
} from '../data/navigation.js'
import './header.css'

function PlatformFeature() {
  return (
    <div className="mega-feature-card">
      <div className="mega-feature-visual">
        <ModulePreview Comp={DashboardMock} scale={0.34} height={150} />
      </div>
      <div>
        <span className="mega-feature-eyebrow">The record underneath</span>
        <div className="mega-feature-title">One org record, not five dashboards</div>
        <p className="mega-feature-desc">Signals → Context → Intelligence → Action, in a single continuous model.</p>
      </div>
      <Link to="/platform/architecture" className="mega-feature-cta">
        See the architecture <Icon name="arrowRight" size={14} />
      </Link>
    </div>
  )
}

function SolutionsFeature() {
  return (
    <div className="mega-feature-card">
      <div className="mega-feature-visual">
        <ModulePreview Comp={ReportsMock} scale={0.3} height={150} />
      </div>
      <div>
        <span className="mega-feature-eyebrow">Not sure which fits?</span>
        <div className="mega-feature-title">Model your own numbers first</div>
        <p className="mega-feature-desc">Every solution reads the same record — see the ROI math before you talk to sales.</p>
      </div>
      <Link to="/roi-calculator" className="mega-feature-cta">
        Open ROI Calculator <Icon name="arrowRight" size={14} />
      </Link>
    </div>
  )
}

function WhyTeemlyFeature() {
  return (
    <div className="mega-feature-card">
      <div className="mega-feature-visual">
        <ModulePreview Comp={TeamsMock} scale={0.34} height={150} />
      </div>
      <div>
        <span className="mega-feature-eyebrow">Built, not licensed</span>
        <div className="mega-feature-title">Our own EXE agent, end to end</div>
        <p className="mega-feature-desc">Not a monitoring plugin wrapped in a dashboard — Teemly owns the full stack.</p>
      </div>
      <Link to="/why-teemly/difference" className="mega-feature-cta">
        See the difference <Icon name="arrowRight" size={14} />
      </Link>
    </div>
  )
}

function ResourcesFeature() {
  return (
    <div className="mega-feature-card">
      <div className="mega-feature-visual mega-glossary-visual">
        <span className="term">Organizational Intelligence</span>
        <p className="pos">noun</p>
        <p className="def">The continuous model connecting people, work and technology signals into one record — the foundation every Teemly report rolls up from.</p>
      </div>
      <Link to="/resources/glossary" className="mega-feature-cta">
        Open the glossary <Icon name="arrowRight" size={14} />
      </Link>
    </div>
  )
}

function SecurityFeature() {
  return (
    <div className="mega-feature-card">
      <div className="mega-feature-visual mega-trust-visual">
        <span className="tile-icon">
          <Icon name="shield" size={20} />
        </span>
        <div className="mega-feature-title" style={{ fontSize: '0.88rem' }}>
          Security & Trust, documented
        </div>
        <div className="mega-trust-chips">
          <span>AES-256</span>
          <span>TLS 1.2+</span>
          <span>GDPR-aligned</span>
        </div>
      </div>
      <Link to="/trust-center" className="mega-feature-cta">
        Visit the Trust Center <Icon name="arrowRight" size={14} />
      </Link>
    </div>
  )
}

const menus = [
  {
    key: 'platform',
    label: 'Platform',
    render: () => (
      <MegaMenu
        items={platformLinks}
        columns={2}
        width={560}
        align="start"
        footerLink={{ to: '/platform', label: 'See the full platform overview' }}
        feature={<PlatformFeature />}
      />
    ),
  },
  {
    key: 'solutions',
    label: 'Solutions',
    render: () => (
      <MegaMenu
        items={solutionsLinks}
        columns={3}
        width={680}
        align="start"
        footerLink={{ to: '/solutions', label: 'See every buyer journey' }}
        feature={<SolutionsFeature />}
      />
    ),
  },
  {
    key: 'why',
    label: 'Why Teemly',
    render: () => (
      <MegaMenu
        items={whyTeemlyLinks}
        columns={2}
        width={480}
        align="start"
        footerLink={{ to: '/why-teemly', label: 'Why Organizational Intelligence' }}
        feature={<WhyTeemlyFeature />}
      />
    ),
  },
  {
    key: 'resources',
    label: 'Resources',
    render: () => (
      <MegaMenu
        items={resourcesLinks}
        columns={2}
        width={480}
        align="start"
        footerLink={{ to: '/resources', label: 'Visit the Resource Center' }}
        feature={<ResourcesFeature />}
      />
    ),
  },
  {
    key: 'security',
    label: 'Security & Trust',
    render: () => (
      <MegaMenu
        items={securityLinks}
        columns={1}
        width={340}
        align="start"
        footerLink={{ to: '/trust-center', label: 'Visit the Trust Center' }}
        feature={<SecurityFeature />}
      />
    ),
  },
]

export default function Header() {
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenMenu(null)
    setMobileSection(null)
  }, [location])

  useEffect(() => {
    function onDocClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  function toggleMenu(key) {
    setOpenMenu((cur) => (cur === key ? null : key))
  }

  function toggleMobileSection(key) {
    setMobileSection((cur) => (cur === key ? null : key))
  }

  const securityMenu = menus.find((m) => m.key === 'security')
  const mainMenus = menus.filter((m) => m.key !== 'security')

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="header-logo" aria-label="Teemly home">
          <img src={teemlyLogo} alt="Teemly" className="header-logo-img" />
        </Link>

        <div className="header-right" ref={navRef}>
          <nav className="header-nav">
            {mainMenus.map((m) => (
              <div className="nav-item" key={m.key}>
                <button
                  className="nav-link"
                  aria-expanded={openMenu === m.key}
                  onClick={() => toggleMenu(m.key)}
                >
                  {m.label}
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={openMenu === m.key ? 'chev-up' : ''}>
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
                {openMenu === m.key && m.render()}
              </div>
            ))}

            <NavLink to="/pricing" className="nav-link">
              Pricing
            </NavLink>
          </nav>

          <div className="header-actions">
            {securityMenu && (
              <div className="nav-item hide-mobile">
                <button
                  className="nav-link"
                  aria-expanded={openMenu === securityMenu.key}
                  onClick={() => toggleMenu(securityMenu.key)}
                >
                  {securityMenu.label}
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={openMenu === securityMenu.key ? 'chev-up' : ''}>
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
                {openMenu === securityMenu.key && securityMenu.render()}
              </div>
            )}
            <Link to="/company/contact" className="nav-signin-link hide-mobile">
              Sign in
            </Link>
            <Link to="/take-a-tour" className="btn btn-outline btn-sm">
              Take a Tour
            </Link>
            <Link to="/book-a-demo" className="btn btn-primary btn-sm">
              Book a Demo
            </Link>
          </div>
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          <div className="container mobile-menu-inner">
            {menus.map((m) => (
              <div key={m.key}>
                <button className="mobile-section-toggle" onClick={() => toggleMobileSection(m.key)}>
                  {m.label}
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={mobileSection === m.key ? 'chev-up' : ''}>
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
                {mobileSection === m.key && (
                  <div className="mobile-submenu">
                    {(m.key === 'platform' ? platformLinks
                      : m.key === 'solutions' ? solutionsLinks
                      : m.key === 'why' ? whyTeemlyLinks
                      : m.key === 'resources' ? resourcesLinks
                      : securityLinks
                    ).map((item) => (
                      <Link key={item.label} to={item.to} className="mobile-link sub">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link to="/pricing" className="mobile-link strong">
              Pricing
            </Link>
            <div className="mobile-divider" />
            <Link to="/company/contact" className="mobile-link">
              Sign in
            </Link>
            <div className="mobile-cta-row">
              <Link to="/take-a-tour" className="btn btn-outline btn-block">
                Take a Tour
              </Link>
              <Link to="/book-a-demo" className="btn btn-primary btn-block">
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
