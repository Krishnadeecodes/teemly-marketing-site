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
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
