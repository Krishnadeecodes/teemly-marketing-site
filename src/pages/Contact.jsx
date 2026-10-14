import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'
import FieldError from '../components/FieldError.jsx'
import { useLeadForm } from '../lib/useLeadForm.js'
import { SIZE_OPTIONS } from '../lib/leadForms.js'
import { FALLBACK_EMAIL } from '../lib/submitForm.js'
import '../sections/sections.css'
import './pages.css'

const info = [
  { icon: 'mail', title: 'Email us', desc: FALLBACK_EMAIL },
  { icon: 'clock', title: 'Response time', desc: 'Within 24 hours on business days' },
  { icon: 'cpu', title: 'Own EXE agent', desc: 'No third-party dependency, ever' },
]

export default function Contact() {
  const { values, errors, status, formError, field, handleSubmit } = useLeadForm('contact', {
    name: '',
    email: '',
    company: '',
    seats: '',
    message: '',
  })
  const successRef = useRef(null)
  const sending = status === 'sending'

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Book a demo, or talk to sales"
        desc="Tell us a little about your team and we'll get back to you within a business day — no automated sales bot in between."
      />

      <section className="section">
        <div className="container contact-layout">
          <div className="contact-info">
            {info.map((i) => (
              <div className="contact-info-card" key={i.title}>
                <span className="contact-info-icon">
                  <Icon name={i.icon} size={19} />
                </span>
                <div>
                  <h4>{i.title}</h4>
                  <p>{i.title === 'Email us' ? <a href={`mailto:${FALLBACK_EMAIL}`}>{i.desc}</a> : i.desc}</p>
                </div>
              </div>
            ))}
            <div className="contact-info-card">
              <span className="contact-info-icon">
                <Icon name="shield" size={19} />
              </span>
              <div>
                <h4>Enterprise inquiry?</h4>
                <p>Mention your team size and we'll route you straight to a custom Enterprise quote.</p>
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
                  Thanks — message received
                </h3>
                <p style={{ color: 'var(--muted)' }}>
                  We've sent a confirmation to {values.email}. We'll get back to you within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-hp" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input {...field('website')} tabIndex={-1} autoComplete="off" />
                </div>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="name">Full name</label>
                    <input {...field('name')} required autoComplete="name" placeholder="Jane Doe" />
                    <FieldError id="name" error={errors.name} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Work email</label>
                    <input {...field('email')} type="email" required autoComplete="email" placeholder="jane@company.com" />
                    <FieldError id="email" error={errors.email} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="company">
                      Company <span className="form-optional">(optional)</span>
                    </label>
                    <input {...field('company')} autoComplete="organization" placeholder="Company name" />
                    <FieldError id="company" error={errors.company} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="seats">
                      Team size <span className="form-optional">(optional)</span>
                    </label>
                    <select {...field('seats')}>
                      <option value="">Select a range</option>
                      {SIZE_OPTIONS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <FieldError id="seats" error={errors.seats} />
                  </div>
                  <div className="form-field full">
                    <label htmlFor="message">
                      What are you hoping to solve? <span className="form-optional">(optional)</span>
                    </label>
                    <textarea
                      {...field('message')}
                      rows={4}
                      placeholder="Tell us about your team and what you're evaluating Teemly for..."
                    />
                    <FieldError id="message" error={errors.message} />
                  </div>
                </div>
                <p className="form-notice">
                  We'll use these details only to respond to your enquiry. See our{' '}
                  <Link to="/legal/privacy">Privacy Policy</Link>.
                </p>
                {formError && (
                  <div className="form-error" role="alert">
                    <p>{formError}</p>
                    <p>
                      Still stuck? Email us at <a href={`mailto:${FALLBACK_EMAIL}`}>{FALLBACK_EMAIL}</a>.
                    </p>
                  </div>
                )}
                <button type="submit" disabled={sending} aria-busy={sending || undefined} className="btn btn-primary btn-block btn-lg">
                  {sending ? 'Sending…' : 'Send & Book a Demo'}
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
