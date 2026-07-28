import { useState } from 'react'
import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'
import '../sections/sections.css'
import './pages.css'

const info = [
  { icon: 'mail', title: 'Email us', desc: 'hello@teemly.app' },
  { icon: 'clock', title: 'Response time', desc: 'Within 24 hours on business days' },
  { icon: 'building', title: 'Built by', desc: 'Deecodes' },
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', seats: '', message: '' })

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

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
                  <p>{i.desc}</p>
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
            {sent ? (
              <div className="form-success">
                <span className="icon-circle">
                  <Icon name="check" size={26} />
                </span>
                <h3 style={{ fontSize: 'var(--fs-xl)' }}>Thanks — message received</h3>
                <p style={{ color: 'var(--muted)' }}>
                  We'll reach out to {form.email || 'you'} within one business day to schedule your demo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="name">Full name</label>
                    <input id="name" required value={form.name} onChange={update('name')} placeholder="Jane Doe" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Work email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={update('email')}
                      placeholder="jane@company.com"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="company">Company</label>
                    <input id="company" value={form.company} onChange={update('company')} placeholder="Company name" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="seats">Team size</label>
                    <select id="seats" value={form.seats} onChange={update('seats')}>
                      <option value="">Select a range</option>
                      <option>1–10</option>
                      <option>11–50</option>
                      <option>51–200</option>
                      <option>201–500</option>
                      <option>500+</option>
                    </select>
                  </div>
                  <div className="form-field full">
                    <label htmlFor="message">What are you hoping to solve?</label>
                    <textarea
                      id="message"
                      rows={4}
                      value={form.message}
                      onChange={update('message')}
                      placeholder="Tell us about your team and what you're evaluating Teemly for..."
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">
                  Send &amp; Book a Demo
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
