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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* startTransition: while the next page's code loads, the current page
        stays on screen instead of blanking to a loading state */}
    <BrowserRouter future={{ v7_startTransition: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
