import { useState } from 'react'
import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'
import './pages.css'

const valueProps = [
  { icon: 'cpu', text: 'See the own-built EXE agent and real-time dashboard, live' },
  { icon: 'shield', text: 'Walk through Privacy Mode, blur and the Silent Tracking legal gate' },
  { icon: 'layers', text: 'See all 8 modules and 6 AI-powered reports in your context' },
  { icon: 'clock', text: 'Most demos are scheduled within one business day' },
]

const roleOptions = ['CEO/Founder', 'Executive', 'HR', 'People Analytics', 'IT', 'Operations', 'Finance', 'AI/Data', 'Manager', 'Other']
const problemOptions = [
  'Productivity',
  'Workforce Planning',
  'Workflow Optimization',
  'AI Impact',
  'Technology Utilization',
  'Employee Experience',
  'Organizational Intelligence',
  'Other',
]

export default function BookADemo() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    country: '',
    companySize: '',
    role: '',
    problem: '',
    message: '',
    consent: false,
  })

  function update(field) {
    return (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
      setForm((f) => ({ ...f, [field]: value }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

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
          </div>

          <div className="contact-form">
            {sent ? (
              <div className="form-success">
                <span className="icon-circle">
                  <Icon name="check" size={26} />
                </span>
                <h3 style={{ fontSize: 'var(--fs-xl)' }}>Thanks — your demo request is in</h3>
                <p style={{ color: 'var(--muted)' }}>
                  We'll reach out to {form.email || 'you'} within one business day to find a time.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="firstName">First name</label>
                    <input id="firstName" required value={form.firstName} onChange={update('firstName')} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="lastName">Last name</label>
                    <input id="lastName" required value={form.lastName} onChange={update('lastName')} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Work email</label>
                    <input id="email" type="email" required value={form.email} onChange={update('email')} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="company">Company</label>
                    <input id="company" required value={form.company} onChange={update('company')} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="jobTitle">Job title</label>
                    <input id="jobTitle" value={form.jobTitle} onChange={update('jobTitle')} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="country">Country</label>
                    <input id="country" required value={form.country} onChange={update('country')} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="companySize">Company size</label>
                    <select id="companySize" required value={form.companySize} onChange={update('companySize')}>
                      <option value="">Select a range</option>
                      <option>1–10</option>
                      <option>11–50</option>
                      <option>51–200</option>
                      <option>201–500</option>
                      <option>500+</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="role">Role</label>
                    <select id="role" required value={form.role} onChange={update('role')}>
                      <option value="">Select a role</option>
                      {roleOptions.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field full">
                    <label htmlFor="problem">Primary problem</label>
                    <select id="problem" required value={form.problem} onChange={update('problem')}>
                      <option value="">Select the closest fit</option>
                      {problemOptions.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field full">
                    <label htmlFor="message">What would you like to discuss?</label>
                    <textarea id="message" rows={4} value={form.message} onChange={update('message')} />
                  </div>
                </div>
                <label className="consent-check">
                  <input type="checkbox" checked={form.consent} onChange={update('consent')} required />
                  I agree to be contacted about this request and understand Teemly's privacy practices.
                </label>
                <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 16 }}>
                  Book a Demo
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
