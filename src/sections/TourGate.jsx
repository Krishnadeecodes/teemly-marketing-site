import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import FieldError from '../components/FieldError.jsx'
import { useLeadForm } from '../lib/useLeadForm.js'
import { ROLE_OPTIONS } from '../lib/leadForms.js'
import { FALLBACK_EMAIL } from '../lib/submitForm.js'
import { unlockTour } from '../lib/tour.js'
import '../pages/pages.css'
import './tourGate.css'

/**
 * The sign-in form that unlocks the product tour (and the chat assistant's
 * answers). On success every gate on the page opens (see useTourUnlocked).
 */
export function TourGateForm({ className = '' }) {
  const { errors, status, formError, field, handleSubmit } = useLeadForm(
    'tour',
    { name: '', email: '', role: '' },
    unlockTour,
  )
  const sending = status === 'sending'

  return (
    <form className={className} id="tour-gate" onSubmit={handleSubmit} noValidate>
      <div className="form-hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input {...field('website')} tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Full name</label>
          <input {...field('name')} required autoComplete="name" />
          <FieldError id="name" error={errors.name} />
        </div>
        <div className="form-field">
          <label htmlFor="email">Work email</label>
          <input {...field('email')} type="email" required autoComplete="email" />
          <FieldError id="email" error={errors.email} />
        </div>
        <div className="form-field full">
          <label htmlFor="role">Role</label>
          <select {...field('role')} required>
            <option value="">Select a role</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <FieldError id="role" error={errors.role} />
        </div>
      </div>
      {formError && (
        <div className="form-error" role="alert">
          <p>{formError}</p>
          <p>
            Still stuck? Email us at <a href={`mailto:${FALLBACK_EMAIL}`}>{FALLBACK_EMAIL}</a>.
          </p>
        </div>
      )}
      <button type="submit" disabled={sending} aria-busy={sending || undefined} className="btn btn-primary btn-block tour-gate-submit">
        {sending ? 'Unlocking…' : 'Start the tour'}
        <Icon name="arrowRight" size={16} />
      </button>
      <p className="tour-gate-notice">
        By continuing you agree that Teemly may contact you and to our <Link to="/legal/privacy">Privacy Policy</Link>.
      </p>
      <p className="tour-gate-trust">
        <span>
          <Icon name="lock" size={13} /> We never share your details
        </span>
        <span>
          <Icon name="check" size={13} /> No sales call needed
        </span>
      </p>
    </form>
  )
}
