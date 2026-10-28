import { useEffect, useState } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Logo from '../components/Logo.jsx'
import { useAuth } from './authContext.js'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'chart', end: true },
  { to: '/admin/resources', label: 'Resources', icon: 'fileText' },
  { to: '/admin/glossary', label: 'Glossary', icon: 'book' },
  { to: '/admin/categories', label: 'Categories', icon: 'layers' },
  { to: '/admin/page-text', label: 'Page text', icon: 'monitor' },
  { to: '/admin/leads', label: 'Download leads', icon: 'download' },
  { to: '/admin/tour-signups', label: 'Sign-ups', icon: 'users' },
  { to: '/admin/users', label: 'Users', icon: 'users', adminOnly: true },
]

export default function AdminShell() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  return (
    <div className={`adm${open ? ' nav-open' : ''}`}>
      <aside className="adm-side">
        <div className="adm-brand">
          <span className="adm-logo">
            <Logo variant="mark" size={24} label={null} />
          </span>
          <div>
            <strong>Teemly</strong>
            <span>Resource admin</span>
          </div>
        </div>
        <nav className="adm-nav" aria-label="Admin">
          {NAV.filter((n) => !n.adminOnly || user.role === 'admin').map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              <Icon name={n.icon} size={17} />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="adm-side-foot">
          <a href="/resources" target="_blank" rel="noopener noreferrer">
            <Icon name="globe" size={16} /> View live site
          </a>
          <Link to="/admin/account" className="adm-user">
            <span className="adm-avatar">{user.name.slice(0, 1).toUpperCase()}</span>
            <span>
              <strong>{user.name}</strong>
              <small>{user.role === 'admin' ? 'Admin' : 'Editor'}</small>
            </span>
          </Link>
          <button type="button" className="adm-btn ghost block" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="adm-main">
        <div className="adm-topbar">
          <button type="button" className="adm-btn ghost" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            ☰ Menu
          </button>
          <strong>Teemly admin</strong>
        </div>
        <div className="adm-scrim" onClick={() => setOpen(false)} aria-hidden="true" />
        <main className="adm-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
