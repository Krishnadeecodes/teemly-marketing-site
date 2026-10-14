import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { api } from './api.js'

// ---- Toasts ----
const ToastContext = createContext(() => {})
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = useCallback((message, tone = 'ok') => {
    const id = Math.random()
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), tone === 'error' ? 6000 : 3000)
  }, [])
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="adm-toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`adm-toast ${t.tone}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ---- Data loading ----
export function useApi(path) {
  const [state, setState] = useState({ data: null, error: '', loading: true })
  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true }))
    return api
      .get(path)
      .then((data) => setState({ data, error: '', loading: false }))
      .catch((err) => setState({ data: null, error: err.message, loading: false }))
  }, [path])
  useEffect(() => {
    load()
  }, [load])
  return { ...state, reload: load, setData: (data) => setState((s) => ({ ...s, data: typeof data === 'function' ? data(s.data) : data })) }
}

export function PageHead({ title, desc, children }) {
  return (
    <header className="adm-page-head">
      <div>
        <h1>{title}</h1>
        {desc && <p>{desc}</p>}
      </div>
      {children && <div className="adm-page-actions">{children}</div>}
    </header>
  )
}

export function Loading() {
  return <div className="adm-loading">Loading…</div>
}

export function ErrorBox({ children }) {
  return children ? (
    <div className="adm-error" role="alert">
      {children}
    </div>
  ) : null
}

export function Field({ label, id, error, hint, children, full }) {
  return (
    <div className={`adm-field${full ? ' full' : ''}`}>
      {label && <label htmlFor={id}>{label}</label>}
      {children}
      {hint && !error && <p className="adm-hint">{hint}</p>}
      {error && (
        <p className="adm-field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

// Two-step destructive button: first click arms it, second click confirms.
export function ConfirmButton({ onConfirm, children, confirmLabel = 'Click again to confirm', className = 'adm-btn danger', ...rest }) {
  const [armed, setArmed] = useState(false)
  const timer = useRef()
  useEffect(() => () => clearTimeout(timer.current), [])
  return (
    <button
      type="button"
      className={`${className}${armed ? ' armed' : ''}`}
      onClick={() => {
        if (armed) {
          setArmed(false)
          onConfirm()
        } else {
          setArmed(true)
          timer.current = setTimeout(() => setArmed(false), 4000)
        }
      }}
      {...rest}
    >
      {armed ? confirmLabel : children}
    </button>
  )
}

export function StatusBadge({ status }) {
  return <span className={`adm-badge ${status}`}>{status === 'published' ? 'Published' : 'Draft'}</span>
}
