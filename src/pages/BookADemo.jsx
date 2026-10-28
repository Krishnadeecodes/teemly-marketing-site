import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import FieldError from '../components/FieldError.jsx'
import FormSuccess from '../components/FormSuccess.jsx'
import { useLeadForm } from '../lib/useLeadForm.js'
import { PROBLEM_OPTIONS, ROLE_OPTIONS, SIZE_OPTIONS } from '../lib/leadForms.js'
import { FALLBACK_EMAIL } from '../lib/submitForm.js'
import './pages.css'

const valueProps = [
  { icon: 'cpu', text: 'See the Teemly desktop agent and live dashboard in action' },
  { icon: 'shield', text: 'Walk through Privacy Mode, blur and the Silent Tracking legal gate' },
  { icon: 'layers', text: 'See all 8 modules and 6 AI-powered reports in your context' },
  { icon: 'clock', text: 'Most demos are scheduled within one business day' },
]

const trust = [
  ['shield', 'Privacy-first by design'],
  ['check', 'DPDP & GDPR-aligned'],
  ['clock', 'Reply within one business day'],
]

const nextSteps = [
  'You get an email confirming we received your request.',
  'Within one business day, our team emails you a few time slots to choose from.',
  'We run a guided walkthrough tailored to the problem you selected — bring your team and your questions.',
]

export default function BookADemo() {
  // Arriving from the end of the guided tour: start from the visitor's role
  // and what they viewed. Only values the form itself offers are used.
  const tour = useLocation().state?.tour
  const fromTour = {
    role: ROLE_OPTIONS.includes(tour?.role) ? tour.role : '',
    problem: PROBLEM_OPTIONS.includes(tour?.problem) ? tour.problem : '',
    message: typeof tour?.message === 'string' ? tour.message.slice(0, 500) : '',
  }
  const { values, errors, status, formError, field, handleSubmit } = useLeadForm('demo', {
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    country: '',
    companySize: '',
    role: fromTour.role,
    problem: fromTour.problem,
    message: fromTour.message,
    consent: false,
  })
  const successRef = useRef(null)
  const sending = status === 'sending'

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  return (
    <>
      <section className="demo-page book-demo">
        <div className="container">
          <div className="demo-shell">
            {/* the brand panel: what the call covers ... */}
            <div className="demo-intro">
              <span className="eyebrow">
                <span className="dot" />
                Book a Demo
              </span>
              <h1>See Teemly on a live call</h1>
              <p>Tell us a little about your organisation and we'll schedule a guided walkthrough — no sales bot in between.</p>
              <ul className="demo-points">
                {valueProps.map((v) => (
                  <li key={v.text}>
                    <span>
                      <Icon name={v.icon} size={16} />
                    </span>
                    {v.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* ... and what happens after you send the form */}
            <div className="demo-aside">
              <h2>What happens next</h2>
              <ol className="demo-steps">
                {nextSteps.map((s, i) => (
                  <li key={s}>
                    <b>{i + 1}</b>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <ul className="demo-trust">
                {trust.map(([icon, label]) => (
                  <li key={label}>
                    <Icon name={icon} size={13} /> {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="demo-form contact-form">
              {status === 'success' ? (
                <FormSuccess
                  ref={successRef}
                  title="Thanks — your demo request is in"
                  message="Our team will email you a few time slots to choose from, then walk you through Teemly on your own questions."
                  email={values.email}
                  reply="Within one business day"
                  links={[
                    { to: '/take-a-tour', icon: 'play', label: 'Take the product tour', desc: 'See every module, step by step' },
                    { to: '/platform', icon: 'layers', label: 'Explore the platform', desc: 'Five intelligence areas, one record' },
                    { to: '/roi-calculator', icon: 'trendingUp', label: 'Calculate your ROI', desc: 'Estimate what Teemly returns' },
                  ]}
                />
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="demo-form-head">
                    <h2>Request your demo</h2>
                    <span>Takes about 2 minutes</span>
                  </div>
                  {fromTour.message && (
                    <p className="form-prefill">
                      <Icon name="check" size={15} />
                      We’ve filled in your role and what you viewed on the tour — change anything you like.
                    </p>
                  )}
                  <div className="form-hp" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input {...field('website')} tabIndex={-1} autoComplete="off" />
                  </div>
                  <div className="form-grid">
                    <span className="demo-group">About you</span>
                    <div className="form-field">
                      <label htmlFor="firstName">First name</label>
                      <input {...field('firstName')} required autoComplete="given-name" />
                      <FieldError id="firstName" error={errors.firstName} />
                    </div>
                    <div className="form-field">
                      <label htmlFor="lastName">Last name</label>
                      <input {...field('lastName')} required autoComplete="family-name" />
                      <FieldError id="lastName" error={errors.lastName} />
                    </div>
                    <div className="form-field">
                      <label htmlFor="email">Work email</label>
                      <input {...field('email')} type="email" required autoComplete="email" />
                      <FieldError id="email" error={errors.email} />
                    </div>
                    <div className="form-field">
                      <label htmlFor="jobTitle">
                        Job title <span className="form-optional">(optional)</span>
                      </label>
                      <input {...field('jobTitle')} autoComplete="organization-title" />
                      <FieldError id="jobTitle" error={errors.jobTitle} />
                    </div>
                    <span className="demo-group">Your organisation</span>
                    <div className="form-field">
                      <label htmlFor="company">Company</label>
                      <input {...field('company')} required autoComplete="organization" />
                      <FieldError id="company" error={errors.company} />
                    </div>
                    <div className="form-field">
                      <label htmlFor="country">Country</label>
                      <input {...field('country')} required autoComplete="country-name" />
                      <FieldError id="country" error={errors.country} />
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
                      <label htmlFor="role">Role</label>
                      <select {...field('role')} required>
                        <option value="">Select a role</option>
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                      <FieldError id="role" error={errors.role} />
                    </div>
                    <span className="demo-group">What you need</span>
                    <div className="form-field full">
                      <label htmlFor="problem">Primary problem</label>
                      <select {...field('problem')} required>
                        <option value="">Select the closest fit</option>
                        {PROBLEM_OPTIONS.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                      <FieldError id="problem" error={errors.problem} />
                    </div>
                    <div className="form-field full">
                      <label htmlFor="message">
                        What would you like to discuss? <span className="form-optional">(optional)</span>
                      </label>
                      <textarea {...field('message')} rows={2} />
                      <FieldError id="message" error={errors.message} />
                    </div>
                  </div>
                  <label className="consent-check" htmlFor="consent">
                    <input {...field('consent')} type="checkbox" required />
                    <span>
                      I agree to be contacted about this request and have read Teemly's <Link to="/legal/privacy">Privacy Policy</Link>.
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
                  <button type="submit" disabled={sending} aria-busy={sending || undefined} className="btn btn-primary btn-block btn-lg demo-submit">
                    {sending ? 'Sending…' : 'Book a Demo'}
                    <Icon name="arrowRight" size={18} />
                  </button>
                  <p className="demo-privacy">
                    <Icon name="lock" size={12} /> We use your details only to arrange your demo. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
