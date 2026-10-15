import { useCallback, useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { api, setUnauthorizedHandler } from './api.js'
import AdminShell from './AdminShell.jsx'
import Login from './Login.jsx'
import Dashboard from './Dashboard.jsx'
import ResourceList from './ResourceList.jsx'
import ResourceEditor from './ResourceEditor.jsx'
import Glossary from './Glossary.jsx'
import Categories from './Categories.jsx'
import PageText from './PageText.jsx'
import Leads from './Leads.jsx'
import Users from './Users.jsx'
import Account from './Account.jsx'
import { ToastProvider } from './ui.jsx'
import { AuthContext, useAuth } from './authContext.js'
import '../pages/resources/resources.css' // .res-prose for the editor body
import './admin.css'


function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return children
}

function RequireAdmin({ children }) {
  const { user } = useAuth()
  return user?.role === 'admin' ? children : <Navigate to="/admin" replace />
}

export default function AdminApp() {
  const [user, setUser] = useState(undefined) // undefined = checking session

  useEffect(() => {
    // Keep the admin out of search engines.
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    document.documentElement.classList.add('adm-root') // admin-only scaling (admin.css)
    document.title = 'Admin | Teemly'
    setUnauthorizedHandler(() => setUser(null))
    api
      .get('/me')
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
    return () => {
      meta.remove()
      document.documentElement.classList.remove('adm-root')
    }
  }, [])

  const logout = useCallback(async () => {
    await api.post('/logout').catch(() => {})
    setUser(null)
  }, [])

  if (user === undefined) return <div className="adm-boot" aria-busy="true" />

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      <ToastProvider>
        <Routes>
          <Route path="login" element={user ? <Navigate to="/admin" replace /> : <Login />} />
          <Route
            element={
              <RequireAuth>
                <AdminShell />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="resources" element={<ResourceList />} />
            <Route path="resources/new" element={<ResourceEditor />} />
            <Route path="resources/:id" element={<ResourceEditor />} />
            <Route path="glossary" element={<Glossary />} />
            <Route path="categories" element={<Categories />} />
            <Route path="page-text" element={<PageText />} />
            <Route path="leads" element={<Leads />} />
            <Route
              path="users"
              element={
                <RequireAdmin>
                  <Users />
                </RequireAdmin>
              }
            />
            <Route path="account" element={<Account />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthContext.Provider>
  )
}
