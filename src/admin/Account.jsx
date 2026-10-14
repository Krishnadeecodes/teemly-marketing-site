import { useState } from 'react'
import { api } from './api.js'
import { useAuth } from './authContext.js'
import { ErrorBox, Field, PageHead, useToast } from './ui.jsx'

export default function Account() {
  const { user, setUser } = useAuth()
  const toast = useToast()
  const [v, setV] = useState({ name: user.name, currentPassword: '', newPassword: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setErrors({})
    try {
      const res = await api.put('/me', v)
      setUser(res.user)
      toast(v.newPassword ? 'Password changed — other devices were signed out' : 'Profile saved')
      setV({ name: res.user.name, currentPassword: '', newPassword: '' })
    } catch (err) {
      setErrors(err.fields)
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHead title="My account" desc={`${user.email} · ${user.role === 'admin' ? 'Admin' : 'Editor'}`} />
      <form className="adm-card adm-narrow" onSubmit={submit} noValidate>
        <Field label="Display name" id="acc-name" error={errors.name}>
          <input id="acc-name" value={v.name} maxLength={100} onChange={(e) => setV({ ...v, name: e.target.value })} />
        </Field>
        <h2 className="adm-card-title">Change password</h2>
        <p className="adm-hint">Leave blank to keep your current password.</p>
        <Field label="Current password" id="acc-current" error={errors.currentPassword}>
          <input id="acc-current" type="password" autoComplete="current-password" value={v.currentPassword} onChange={(e) => setV({ ...v, currentPassword: e.target.value })} />
        </Field>
        <Field label="New password" id="acc-new" error={errors.newPassword} hint="At least 10 characters.">
          <input id="acc-new" type="password" autoComplete="new-password" value={v.newPassword} onChange={(e) => setV({ ...v, newPassword: e.target.value })} />
        </Field>
        <ErrorBox>{error}</ErrorBox>
        <button className="adm-btn primary" disabled={busy}>
          {busy ? 'Saving…' : 'Save'}
        </button>
      </form>
    </>
  )
}
