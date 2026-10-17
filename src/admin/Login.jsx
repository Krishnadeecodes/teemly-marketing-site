import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from './api.js'
import Logo from '../components/Logo.jsx'
import { useAuth } from './authContext.js'
import { ErrorBox, Field } from './ui.jsx'

export default function Login() {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { user } = await api.post('/login', { email, password })
      setUser(user)
      navigate(location.state?.from?.startsWith('/admin') ? location.state.from : '/admin', { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="adm-login">
      <form className="adm-card adm-login-card" onSubmit={submit}>
        <div className="adm-brand">
          <span className="adm-logo">
            <Logo variant="mark" size={24} label={null} />
          </span>
          <div>
            <strong>Teemly</strong>
            <span>Resource admin</span>
          </div>
        </div>
        <h1>Sign in</h1>
        <Field label="Email" id="email">
          <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </Field>
        <Field label="Password" id="password">
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <ErrorBox>{error}</ErrorBox>
        <button className="adm-btn primary block" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="adm-hint">No account? Ask an admin to add you under Users.</p>
      </form>
    </div>
  )
}
