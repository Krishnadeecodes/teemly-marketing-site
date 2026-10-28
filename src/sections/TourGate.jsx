import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import FieldError from '../components/FieldError.jsx'
import { useLeadForm } from '../lib/useLeadForm.js'
import { ROLE_OPTIONS, SIZE_OPTIONS } from '../lib/leadForms.js'
import { FALLBACK_EMAIL } from '../lib/submitForm.js'
import { unlockTour } from '../lib/tour.js'
import '../pages/pages.css'
import './tourGate.css'

/**
 * The sign-in form that unlocks the product tour (in the popup and on
 * /take-a-tour). On success every gate on the page opens (see useTourUnlocked).
 */
export function TourGateForm({ className = '' }) {
  const { errors, status, formError, field, handleSubmit } = useLeadForm(
    'tour',
    { name: '', email: '', company: '', role: '', companySize: '', country: '', consent: false },
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
        <div className="form-field">
          <label htmlFor="company">Company</label>
          <input {...field('company')} required autoComplete="organization" />
          <FieldError id="company" error={errors.company} />
        </div>
        <div className="form-field">
          <label htmlFor="role">Role</label>
          <select {...field('role')} required>
            <option value="">Select a role</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <FieldError id="role" error={errors.role} />
        </div>
        <div className="form-field">
          <label htmlFor="companySize">Company size</label>
          <select {...field('companySize')} required>
            <option value="">Select a range</option>
            {SIZE_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <FieldError id="companySize" error={errors.companySize} />
        </div>
        <div className="form-field">
          <label htmlFor="country">
            Country <span className="form-optional">(optional)</span>
          </label>
          <input {...field('country')} autoComplete="country-name" />
          <FieldError id="country" error={errors.country} />
        </div>
      </div>
      <label className="consent-check" htmlFor="consent">
        <input {...field('consent')} type="checkbox" required />
        <span>
          I agree that Teemly may contact me about the product and have read the <Link to="/legal/privacy">Privacy Policy</Link>.
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
      <button type="submit" disabled={sending} aria-busy={sending || undefined} className="btn btn-primary btn-block tour-gate-submit">
        {sending ? 'Unlocking…' : 'Start the tour'}
        <Icon name="arrowRight" size={16} />
      </button>
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
