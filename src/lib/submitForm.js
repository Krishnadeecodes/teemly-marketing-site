// Posts a form payload to the Node server (server/index.js), which emails it.
export async function submitForm(type, payload) {
  let res
  try {
    res = await fetch(`/api/forms/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Network error. Please check your connection and try again.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
  return data
}
