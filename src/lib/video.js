// Turns a YouTube / Vimeo / Loom share link into an embeddable player URL.
// Returns null for anything else (rendered as a plain "Watch" link instead).
export function toEmbedUrl(url) {
  let u
  try {
    u = new URL(url)
  } catch {
    return null
  }
  const host = u.hostname.replace(/^www\./, '')
  if (host === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    const id = u.searchParams.get('v') || u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)?.[1]
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  if (host === 'vimeo.com') {
    const id = u.pathname.match(/^\/(\d+)/)?.[1]
    return id ? `https://player.vimeo.com/video/${id}` : null
  }
  if (host === 'player.vimeo.com') return u.href
  if (host === 'loom.com') {
    const id = u.pathname.match(/^\/(?:share|embed)\/([\w-]+)/)?.[1]
    return id ? `https://www.loom.com/embed/${id}` : null
  }
  return null
}
