import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import FieldError from '../components/FieldError.jsx'
import FormSuccess from '../components/FormSuccess.jsx'
import SocialLinks from '../components/SocialLinks.jsx'
import { useLeadForm } from '../lib/useLeadForm.js'
import { SIZE_OPTIONS } from '../lib/leadForms.js'
import { FALLBACK_EMAIL } from '../lib/submitForm.js'
import '../sections/sections.css'
import './pages.css'

const info = [
  { icon: 'mail', title: 'Email us', desc: FALLBACK_EMAIL },
  { icon: 'clock', title: 'Response time', desc: 'Within 24 hours on business days' },
  { icon: 'cpu', title: 'Our own desktop agent', desc: 'Built in-house, with no third-party tools' },
  { icon: 'shield', title: 'Enterprise inquiry?', desc: "Mention your team size and we'll route you to a custom Enterprise quote." },
]

const trust = [
  ['shield', 'Privacy-first by design'],
  ['check', 'DPDP & GDPR-aligned'],
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
      <section className="demo-page contact-page">
        <div className="container">
          <div className="demo-shell">
            {/* how to reach us ... */}
            <div className="demo-intro">
              <span className="eyebrow">
                <span className="dot" />
                Contact
              </span>
              <h1>Talk to the Teemly team</h1>
              <p>Questions, pricing or a demo — tell us a little about your team and we'll get back to you within a business day.</p>
              <ul className="contact-ways">
                {info.map((i) => (
                  <li key={i.title}>
                    <span>
                      <Icon name={i.icon} size={16} />
                    </span>
                    <div>
                      <b>{i.title}</b>
                      <small>{i.title === 'Email us' ? <a href={`mailto:${FALLBACK_EMAIL}`}>{i.desc}</a> : i.desc}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* ... and where else to find us */}
            <div className="demo-aside">
              <h2>Follow Teemly</h2>
              <div className="contact-follow">
                <p>Product news, walkthroughs and updates.</p>
                <SocialLinks />
              </div>
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
                  title="Thanks — message received"
                  message="A Teemly specialist will read it and reply to you directly. For Enterprise enquiries, we'll prepare a quote for your organisation."
                  email={values.email}
                  reply="Within one business day"
                  links={[
                    { to: '/pricing', icon: 'dollar', label: 'See pricing', desc: 'Plans for every team size' },
                    { to: '/security', icon: 'shield', label: 'Security & privacy', desc: 'How Teemly protects your data' },
                    { to: '/take-a-tour', icon: 'play', label: 'Take the product tour', desc: 'See every module, step by step' },
                  ]}
                />
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="demo-form-head">
                    <h2>Send us a message</h2>
                    <span>We reply within a business day</span>
                  </div>
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
                      <textarea {...field('message')} rows={3} placeholder="Tell us about your team and what you're evaluating Teemly for..." />
                      <FieldError id="message" error={errors.message} />
                    </div>
                  </div>
                  <p className="form-notice">
                    We'll use these details only to respond to your enquiry. See our <Link to="/legal/privacy">Privacy Policy</Link>.
                  </p>
                  {formError && (
                    <div className="form-error" role="alert">
                      <p>{formError}</p>
                      <p>
                        Still stuck? Email us at <a href={`mailto:${FALLBACK_EMAIL}`}>{FALLBACK_EMAIL}</a>.
                      </p>
                    </div>
                  )}
                  <button type="submit" disabled={sending} aria-busy={sending || undefined} className="btn btn-primary btn-block btn-lg demo-submit">
                    {sending ? 'Sending…' : 'Send & Book a Demo'}
                    <Icon name="arrowRight" size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
