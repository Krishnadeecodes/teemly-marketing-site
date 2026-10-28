import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

/**
 * The thank-you screen after a lead form is sent (Contact, Book a Demo):
 * what was received, where the confirmation went, when to expect a reply,
 * and a few useful places to go while waiting. The heading takes focus.
 */
const FormSuccess = forwardRef(function FormSuccess({ title, message, email, reply, links }, headingRef) {
  return (
    <div className="form-done" role="status">
      <span className="form-done-badge" aria-hidden="true">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="form-done-tag">Request received</span>
      <h2 ref={headingRef} tabIndex={-1}>
        {title}
      </h2>
      <p className="form-done-msg">{message}</p>

      <div className="form-done-facts">
        <span>
          <Icon name="mail" size={15} />
          <span>
            <small>Confirmation sent to</small>
            <b>{email}</b>
          </span>
        </span>
        <span>
          <Icon name="clock" size={15} />
          <span>
            <small>Expect a reply</small>
            <b>{reply}</b>
          </span>
        </span>
      </div>

      <div className="form-done-next">
        <small>While you wait</small>
        <div>
          {links.map((l) => (
            <Link to={l.to} key={l.to}>
              <span className="form-done-icon">
                <Icon name={l.icon} size={16} />
              </span>
              <span>
                <b>{l.label}</b>
                <small>{l.desc}</small>
              </span>
              <Icon name="arrowRight" size={14} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
})

export default FormSuccess
