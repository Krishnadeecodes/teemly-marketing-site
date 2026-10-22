import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'
import FieldError from '../components/FieldError.jsx'
import { useLeadForm } from '../lib/useLeadForm.js'
import { PROBLEM_OPTIONS, ROLE_OPTIONS, SIZE_OPTIONS } from '../lib/leadForms.js'
import { FALLBACK_EMAIL } from '../lib/submitForm.js'
import './pages.css'

const valueProps = [
  { icon: 'cpu', text: 'See the own-built EXE agent and real-time dashboard, live' },
  { icon: 'shield', text: 'Walk through Privacy Mode, blur and the Silent Tracking legal gate' },
  { icon: 'layers', text: 'See all 8 modules and 6 AI-powered reports in your context' },
  { icon: 'clock', text: 'Most demos are scheduled within one business day' },
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
      <PageHero
        eyebrow="Book a Demo"
        title="See Teemly on a real call, with your own questions"
        desc="Tell us a little about your organisation and we'll schedule a guided walkthrough — no automated sales bot in between."
      />

      <section className="section">
        <div className="container contact-layout">
          <div className="contact-info">
            {valueProps.map((v) => (
              <div className="contact-info-card" key={v.text}>
                <span className="contact-info-icon">
                  <Icon name={v.icon} size={19} />
                </span>
                <div>
                  <p>{v.text}</p>
                </div>
              </div>
            ))}
            <div className="contact-info-card form-next">
              <div>
                <h4>What happens next</h4>
                <ol>
                  {nextSteps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="contact-form">
            {status === 'success' ? (
              <div className="form-success" role="status">
                <span className="icon-circle">
                  <Icon name="check" size={26} />
                </span>
                <h3 ref={successRef} tabIndex={-1} style={{ fontSize: 'var(--fs-xl)' }}>
                  Thanks — your demo request is in
                </h3>
                <p style={{ color: 'var(--muted)' }}>
                  We've sent a confirmation to {values.email}. Our team will email you within one business day with
                  time slots to choose from.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
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
                    <label htmlFor="company">Company</label>
                    <input {...field('company')} required autoComplete="organization" />
                    <FieldError id="company" error={errors.company} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="jobTitle">
                      Job title <span className="form-optional">(optional)</span>
                    </label>
                    <input {...field('jobTitle')} autoComplete="organization-title" />
                    <FieldError id="jobTitle" error={errors.jobTitle} />
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
                    <textarea {...field('message')} rows={4} />
                    <FieldError id="message" error={errors.message} />
                  </div>
                </div>
                <label className="consent-check" htmlFor="consent">
                  <input {...field('consent')} type="checkbox" required />
                  <span>
                    I agree to be contacted about this request and have read Teemly's{' '}
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
                <button
                  type="submit"
                  disabled={sending}
                  aria-busy={sending || undefined}
                  className="btn btn-primary btn-block btn-lg"
                  style={{ marginTop: 16 }}
                >
                  {sending ? 'Sending…' : 'Book a Demo'}
                  <Icon name="arrowRight" size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
