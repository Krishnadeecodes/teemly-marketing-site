// First-touch campaign attribution for lead forms. Captured once per browser
// session on the first page view, then sent along with any form submission.
const KEY = 'teemly_attribution'
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

export function captureAttribution() {
  try {
    if (sessionStorage.getItem(KEY)) return
    const params = new URLSearchParams(window.location.search)
    const data = {
      landingPage: window.location.pathname + window.location.search,
      referrer: document.referrer || '',
    }
    for (const k of UTM_KEYS) {
      const v = params.get(k)
      if (v) data[k] = v
    }
    sessionStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // Storage blocked (private mode, disabled cookies) — attribution is best-effort.
  }
}

export function getAttribution() {
  let stored = {}
  try {
    stored = JSON.parse(sessionStorage.getItem(KEY) || '{}')
  } catch {
    // ignore
  }
  return { ...stored, pagePath: window.location.pathname }
}
