import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import './pages.css'

export default function NotFound() {
  return (
    <div className="notfound">
      <span className="big">404</span>
      <h1 style={{ fontSize: 'var(--fs-2xl)' }}>This page hasn't clocked in</h1>
      <p style={{ color: 'var(--muted)', maxWidth: 420 }}>
        The page you're looking for doesn't exist — but the rest of Teemly does. Let's get you back on track.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
        <Icon name="arrowRight" size={16} />
      </Link>
    </div>
  )
}
