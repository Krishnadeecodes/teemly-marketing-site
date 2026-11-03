// Checks the Cloudflare Turnstile token sent with lead forms.
// Off (every request passes) until TURNSTILE_SECRET_KEY is set in .env; set it
// together with VITE_TURNSTILE_SITE_KEY and rebuild (npm run build).
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(req, res, next) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return next()
  const token = req.body?.turnstileToken
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'The spam check did not complete. Please reload the page and try again.' })
  }
  try {
    const r = await fetch(VERIFY_URL, {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, remoteip: req.ip }),
      signal: AbortSignal.timeout(8000),
    })
    const data = await r.json()
    if (data.success) return next()
    console.warn('[turnstile] rejected:', (data['error-codes'] || []).join(', '))
    return res.status(400).json({ error: 'The spam check failed. Please reload the page and try again.' })
  } catch (err) {
    // Cloudflare unreachable: let the lead through (honeypot and rate limits
    // still apply) rather than lose a real enquiry.
    console.error('[turnstile] verify failed, allowing request:', err.message)
    return next()
  }
}
