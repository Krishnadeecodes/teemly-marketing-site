import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import FieldError from '../../components/FieldError.jsx'
import { useLeadForm } from '../../lib/useLeadForm.js'
import { unlockDownload } from '../../lib/resourcesApi.js'
import { FALLBACK_EMAIL } from '../../lib/submitForm.js'

// Email-gated PDF download: on success the server returns a short-lived signed link.
export default function GatedDownload({ item, title = 'Get the full PDF' }) {
  const { errors, status, formError, result, field, handleSubmit } = useLeadForm(
    'download',
    { name: '', email: '', company: '', consent: false },
    (_type, payload) => unlockDownload(item.type, item.slug, payload),
  )
  const sending = status === 'sending'

  useEffect(() => {
    if (result?.url) window.location.assign(result.url)
  }, [result])

  if (status === 'success' && result?.url) {
    return (
      <div className="res-download form-success" role="status">
        <span className="icon-circle">
          <Icon name="check" size={24} />
        </span>
        <h3>Your download has started</h3>
        <p>
          If it didn't, <a href={result.url}>download the PDF here</a>. The link works for 30 minutes.
        </p>
      </div>
    )
  }

  return (
    <form className="res-download" onSubmit={handleSubmit} noValidate>
      <h3>
        <Icon name="download" size={18} /> {title}
      </h3>
      <p className="form-notice">Tell us where to send updates and the download starts straight away.</p>
      <div className="form-hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input {...field('website')} tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-field">
        <label htmlFor="name">Full name</label>
        <input {...field('name')} autoComplete="name" required />
        <FieldError id="name" error={errors.name} />
      </div>
      <div className="form-field">
        <label htmlFor="email">Work email</label>
        <input {...field('email')} type="email" autoComplete="email" required />
        <FieldError id="email" error={errors.email} />
      </div>
      <div className="form-field">
        <label htmlFor="company">Company</label>
        <input {...field('company')} autoComplete="organization" required />
        <FieldError id="company" error={errors.company} />
      </div>
      <label className="consent-check" htmlFor="consent">
        <input {...field('consent')} type="checkbox" required />
        <span>
          I agree that Teemly may email me about this download and have read the{' '}
          <Link to="/legal/privacy">Privacy Policy</Link>.
        </span>
      </label>
      <FieldError id="consent" error={errors.consent} />
      {formError && (
        <div className="form-error" role="alert">
          <p>{formError}</p>
          <p>
            Still stuck? Email us at <a href={`mailto:${FALLBACK_EMAIL}`}>{FALLBACK_EMAIL}</a>.
          </p>
        </div>
      )}
      <button type="submit" disabled={sending} aria-busy={sending || undefined} className="btn btn-primary btn-block">
        {sending ? 'Preparing…' : 'Download PDF'}
        <Icon name="download" size={16} />
      </button>
    </form>
  )
}
