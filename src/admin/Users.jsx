import { useState } from 'react'
import { api, formatDateTime } from './api.js'
import { useAuth } from './authContext.js'
import { ConfirmButton, ErrorBox, Field, Loading, PageHead, useApi, useToast } from './ui.jsx'

const BLANK = { name: '', email: '', role: 'editor', password: '' }

function NewUser({ onCreated }) {
  const [v, setV] = useState(BLANK)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      onCreated(await api.post('/users', v), v)
      setV(BLANK)
      setErrors({})
    } catch (err) {
      setErrors(err.fields)
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="adm-card" onSubmit={submit} noValidate>
      <h2 className="adm-card-title">Add a user</h2>
      <div className="adm-grid-2">
        <Field label="Name" id="nu-name" error={errors.name}>
          <input id="nu-name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
        </Field>
        <Field label="Email" id="nu-email" error={errors.email}>
          <input id="nu-email" type="email" autoComplete="off" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} />
        </Field>
        <Field label="Role" id="nu-role" hint="Editors manage content. Admins can also manage users.">
          <select id="nu-role" value={v.role} onChange={(e) => setV({ ...v, role: e.target.value })}>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </Field>
        <Field label="Temporary password" id="nu-password" error={errors.password} hint="At least 10 characters. They can change it under My account.">
          <input id="nu-password" type="text" autoComplete="new-password" value={v.password} onChange={(e) => setV({ ...v, password: e.target.value })} />
        </Field>
      </div>
      <ErrorBox>{error}</ErrorBox>
      <button className="adm-btn primary sm" disabled={busy}>
        {busy ? 'Adding…' : 'Add user'}
      </button>
    </form>
  )
}

function UserRow({ u, me, onChange }) {
  const [resetting, setResetting] = useState(false)
  const [pw, setPw] = useState('')
  const toast = useToast()
  const isMe = u.id === me.id

  async function update(patch, message) {
    try {
      onChange(await api.put(`/users/${u.id}`, patch))
      toast(message)
      return true
    } catch (err) {
      toast(err.message, 'error')
      return false
    }
  }

  return (
    <tr className={u.active ? '' : 'adm-row-off'}>
      <td data-label="User">
        <strong>{u.name}</strong> {isMe && <span className="adm-flag">You</span>}
        {!u.active && <span className="adm-flag warn">Deactivated</span>}
        <div className="adm-muted">{u.email}</div>
      </td>
      <td data-label="Role">
        <select
          value={u.role}
          disabled={isMe}
          aria-label={`Role for ${u.name}`}
          onChange={(e) => update({ role: e.target.value }, `${u.name} is now ${e.target.value === 'admin' ? 'an admin' : 'an editor'}`)}
        >
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </td>
      <td data-label="Last sign-in" className="adm-muted">
        {u.lastLoginAt ? formatDateTime(u.lastLoginAt) : 'Never'}
      </td>
      <td className="adm-row-actions">
        {isMe ? null : resetting ? (
          <form
            className="adm-inline"
            onSubmit={async (e) => {
              e.preventDefault()
              if (await update({ password: pw }, `Password reset for ${u.name}`)) {
                setResetting(false)
                setPw('')
              }
            }}
          >
            <input type="text" autoComplete="new-password" placeholder="New password (10+ chars)" value={pw} onChange={(e) => setPw(e.target.value)} aria-label="New password" />
            <button className="adm-btn sm primary">Set</button>
            <button type="button" className="adm-btn sm ghost" onClick={() => setResetting(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <>
            <button type="button" className="adm-btn sm" onClick={() => setResetting(true)}>
              Reset password
            </button>
            <button type="button" className="adm-btn sm" onClick={() => update({ active: !u.active }, u.active ? `${u.name} deactivated` : `${u.name} reactivated`)}>
              {u.active ? 'Deactivate' : 'Reactivate'}
            </button>
            <ConfirmButton
              className="adm-btn sm danger"
              confirmLabel="Confirm"
              onConfirm={() =>
                api
                  .del(`/users/${u.id}`)
                  .then((res) => {
                    onChange(res)
                    toast(`${u.name} removed`)
                  })
                  .catch((err) => toast(err.message, 'error'))
              }
            >
              Delete
            </ConfirmButton>
          </>
        )}
      </td>
    </tr>
  )
}

export default function Users() {
  const { user } = useAuth()
  const { data, error, loading, setData } = useApi('/users')
  const toast = useToast()

  return (
    <>
      <PageHead title="Users" desc="Everyone who can sign in to this admin. Deactivating someone signs them out immediately." />
      <NewUser
        onCreated={(res, v) => {
          setData(res)
          toast(`Added ${v.name}`)
        }}
      />
      <ErrorBox>{error}</ErrorBox>
      {loading && !data ? (
        <Loading />
      ) : (
        data && (
          <div className="adm-card adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Last sign-in</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => (
                  <UserRow key={u.id} u={u} me={user} onChange={setData} />
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </>
  )
}
