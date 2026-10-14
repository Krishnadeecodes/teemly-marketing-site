import { useRef, useState } from 'react'
import { LEAD_FORMS, validateField, validateLead } from './leadForms.js'
import { getAttribution } from './attribution.js'
import { submitForm } from './submitForm.js'

// State + validation for a lead form. Fields validate on blur, re-validate as
// the visitor fixes them, and the whole form validates on submit (focusing the
// first invalid field). Values are never cleared on error.
export function useLeadForm(type, initial) {
  const rules = LEAD_FORMS[type]
  const [values, setValues] = useState({ ...initial, website: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success
  const [formError, setFormError] = useState('')
  const startedAt = useRef(Date.now())
  const inFlight = useRef(false)

  function focusFirst(errs) {
    const first = Object.keys(rules).find((k) => errs[k])
    if (first) document.getElementById(first)?.focus()
  }

  function setFieldError(field, value) {
    if (!rules[field]) return
    const msg = validateField(rules[field], value)
    setErrors((e) => ({ ...e, [field]: msg }))
  }

  function field(name) {
    const err = errors[name]
    return {
      id: name,
      name,
      ...(rules[name]?.checkbox ? { checked: values[name] } : { value: values[name] }),
      onChange: (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setValues((v) => ({ ...v, [name]: value }))
        // Only re-validate live once an error is showing, so typing isn't nagged.
        if (err || e.target.type === 'checkbox' || e.target.tagName === 'SELECT') setFieldError(name, value)
      },
      onBlur: (e) => {
        if (e.target.type !== 'checkbox') setFieldError(name, e.target.value)
      },
      'aria-invalid': err ? true : undefined,
      'aria-describedby': err ? `${name}-error` : undefined,
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (inFlight.current) return

    const errs = validateLead(type, values)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setFormError('Please fix the highlighted fields and try again.')
      focusFirst(errs)
      return
    }

    inFlight.current = true
    setStatus('sending')
    setFormError('')
    try {
      await submitForm(type, { ...values, attribution: getAttribution(), elapsedMs: Date.now() - startedAt.current })
      setStatus('success')
    } catch (err) {
      setStatus('idle')
      setFormError(err.message)
      if (err.fields) {
        setErrors(err.fields)
        focusFirst(err.fields)
      }
    } finally {
      inFlight.current = false
    }
  }

  return { values, errors, status, formError, field, handleSubmit }
}
