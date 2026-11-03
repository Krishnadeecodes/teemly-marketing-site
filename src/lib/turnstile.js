// Cloudflare Turnstile: a privacy-friendly bot check on the lead forms.
// Off until VITE_TURNSTILE_SITE_KEY is set in .env at build time (the server
// checks the token only when TURNSTILE_SECRET_KEY is set — see
// server/turnstile.js). Most visitors never see anything: the check runs at
// submit time, and a small box only appears bottom-right if Cloudflare wants
// the visitor to tick it.

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

let scriptLoad = null
function loadScript() {
  scriptLoad ||= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SCRIPT
    s.async = true
    s.onload = () => resolve(window.turnstile)
    s.onerror = () => {
      scriptLoad = null
      reject(new Error('The spam check could not load. Please check your connection and try again.'))
    }
    document.head.appendChild(s)
  })
  return scriptLoad
}

/** A one-time token for the server, or null when Turnstile is off. */
export async function getTurnstileToken() {
  if (!SITE_KEY) return null
  const turnstile = await loadScript()
  const box = document.createElement('div')
  box.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483000'
  document.body.appendChild(box)
  try {
    return await new Promise((resolve, reject) => {
      turnstile.render(box, {
        sitekey: SITE_KEY,
        appearance: 'interaction-only',
        callback: resolve,
        'error-callback': () => reject(new Error('The spam check failed. Please try again.')),
        'timeout-callback': () => reject(new Error('The spam check timed out. Please try again.')),
      })
    })
  } finally {
    box.remove()
  }
}
