// Posts a form payload to the Node server (server/index.js), which emails it.
// Shown alongside errors so visitors always have a route that bypasses the form.
export const FALLBACK_EMAIL = 'info@teemly.co'

const TIMEOUT_MS = 20000

export function submitForm(type, payload) {
  return postForm(`/api/forms/${type}`, payload)
}

// POSTs JSON and returns the reply; errors carry `fields` for useLeadForm.
export async function postForm(url, payload) {
  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (err) {
    throw new Error(
      err?.name === 'TimeoutError'
        ? 'The request took too long. Your details are still here — please try again.'
        : 'Network error. Please check your connection and try again — your details are still here.',
    )
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(data.error || 'Something went wrong. Please try again.')
    error.fields = data.fields
    throw error
  }
  return data
}
