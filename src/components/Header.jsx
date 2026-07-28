import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'
import Icon from './Icon.jsx'
import './header.css'

const productLinks = [
  { to: '/product/dashboard', label: 'Dashboard & Insights', desc: 'A live read on the whole org', icon: 'chart' },
  { to: '/product/teams', label: 'Teams', desc: 'Team scores down to one person', icon: 'users' },
  { to: '/product/screenshots', label: 'Screenshot Intelligence', desc: 'Activity proof, privacy respected', icon: 'camera' },
  { to: '/product/attendance', label: 'Attendance', desc: 'Check-in and check-out, automatic', icon: 'clock' },
  { to: '/product/reports', label: 'Intelligence Reports', desc: 'Six reports that end in a decision', icon: 'layers' },
  { to: '/product/settings', label: 'Settings & Controls', desc: 'Configured per org or per person', icon: 'gear' },
]

const companyLinks = [
  { to: '/about', label: 'About Teemly', desc: 'Who is building this, and why', icon: 'building' },
  { to: '/security', label: 'Security & Privacy', desc: 'How your data is protected', icon: 'shield' },
  { to: '/contact', label: 'Contact', desc: 'Talk to us before you buy', icon: 'mail' },
]

const menus = {
  product: { label: 'Product', width: 640 },
  company: { label: 'Company', width: 520 },
}

export default function Header() {
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
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

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="header-logo" aria-label="Teemly home">
          <Logo size={30} />
        </Link>

        <nav className="header-nav" ref={navRef}>
          <div className="nav-item">
            <button
              className="nav-link"
              aria-expanded={openMenu === 'product'}
              onClick={() => toggleMenu('product')}
            >
              Product
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={openMenu === 'product' ? 'chev-up' : ''}>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            {openMenu === 'product' && (
              <div className="mega-panel" style={{ width: menus.product.width }}>
                <div className="mega-grid">
                  {productLinks.map((item) => (
                    <Link key={item.label} to={item.to} className="mega-item">
                      <span className="mega-icon">
                        <Icon name={item.icon} size={18} />
                      </span>
                      <span>
                        <span className="mega-title">{item.label}</span>
                        <span className="mega-desc">{item.desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>
                <Link to="/product" className="mega-footer-link">
                  See the full product tour
                  <Icon name="arrowRight" size={15} />
                </Link>
              </div>
            )}
          </div>

          <NavLink to="/pricing" className="nav-link">
            Pricing
          </NavLink>

          <div className="nav-item">
            <button
              className="nav-link"
              aria-expanded={openMenu === 'company'}
              onClick={() => toggleMenu('company')}
            >
              Company
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={openMenu === 'company' ? 'chev-up' : ''}>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            {openMenu === 'company' && (
              <div className="mega-panel mega-panel-left" style={{ width: menus.company.width }}>
                <div className="mega-grid mega-grid-1col">
                  {companyLinks.map((item) => (
                    <Link key={item.label} to={item.to} className="mega-item">
                      <span className="mega-icon">
                        <Icon name={item.icon} size={18} />
                      </span>
                      <span>
                        <span className="mega-title">{item.label}</span>
                        <span className="mega-desc">{item.desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>
                <Link to="/pricing" className="mega-footer-link">
                  See pricing
                  <Icon name="arrowRight" size={15} />
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="header-actions">
          <Link to="/contact" className="btn btn-outline btn-sm">
            Book a Demo
          </Link>
          <Link to="/pricing" className="btn btn-primary btn-sm">
            Start Free Trial
          </Link>
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
            <p className="mobile-section-label">Product</p>
            {productLinks.map((item) => (
              <Link key={item.label} to={item.to} className="mobile-link">
                {item.label}
              </Link>
            ))}
            <div className="mobile-divider" />
            <Link to="/pricing" className="mobile-link strong">
              Pricing
            </Link>
            <div className="mobile-divider" />
            <p className="mobile-section-label">Company</p>
            {companyLinks.map((item) => (
              <Link key={item.label} to={item.to} className="mobile-link">
                {item.label}
              </Link>
            ))}
            <div className="mobile-cta-row">
              <Link to="/contact" className="btn btn-outline btn-block">
                Book a Demo
              </Link>
              <Link to="/pricing" className="btn btn-primary btn-block">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
