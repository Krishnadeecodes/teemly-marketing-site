import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { captureAttribution } from './lib/attribution.js'
import './styles/tokens.css'
import './styles/global.css'
import './styles/motion.css'
import './styles/mobile.css'

captureAttribution()

// Error reports to Sentry — off until VITE_SENTRY_DSN is set in .env at build
// time. Loaded after first paint so it never slows the page down.
if (import.meta.env.VITE_SENTRY_DSN) {
  import('@sentry/react')
    .then((Sentry) =>
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        sendDefaultPii: false,
        // the admin panel is internal; report only the public site
        beforeSend: (event) => (location.pathname.startsWith('/admin') ? null : event),
      }),
    )
    .catch(() => {})
}

// Visit counts via Plausible — off until VITE_PLAUSIBLE_DOMAIN is set in .env at
// build time. It sets no cookies, so no consent banner is needed, and it follows
// route changes by itself. The admin panel is internal, so it is not counted.
if (import.meta.env.VITE_PLAUSIBLE_DOMAIN && !location.pathname.startsWith('/admin')) {
  const script = document.createElement('script')
  script.defer = true
  script.dataset.domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN
  script.src = 'https://plausible.io/js/script.js'
  document.head.appendChild(script)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* startTransition: while the next page's code loads, the current page
        stays on screen instead of blanking to a loading state */}
    <BrowserRouter future={{ v7_startTransition: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
