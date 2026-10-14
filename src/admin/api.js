// Client for the admin API (server/resources.js). Every call sends the
// X-Teemly-Admin header the server requires for state-changing requests.

let onUnauthorized = () => {}
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}

export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message)
    this.status = status
    this.fields = fields || {}
  }
}

async function request(method, path, body, { raw, headers } = {}) {
  let res
  try {
    res = await fetch(`/api/admin${path}`, {
      method,
      credentials: 'same-origin',
      headers: {
        'X-Teemly-Admin': '1',
        ...(body !== undefined && !raw ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : raw ? body : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('Network error — is the server running (npm run server)?', 0)
  }
  const data = await res.json().catch(() => ({}))
  if (res.status === 401 && path !== '/login') onUnauthorized()
  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status}).`, res.status, data.fields)
  return data
}

export const api = {
  get: (p) => request('GET', p),
  post: (p, b = {}) => request('POST', p, b),
  put: (p, b = {}) => request('PUT', p, b),
  patch: (p, b = {}) => request('PATCH', p, b),
  del: (p) => request('DELETE', p),
  upload: (file) =>
    request('POST', '/uploads', file, {
      raw: true,
      headers: { 'Content-Type': file.type || 'application/octet-stream', 'X-Filename': encodeURIComponent(file.name) },
    }),
}

export function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

export function formatDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function formatBytes(n) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}
