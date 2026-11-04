import { useEffect } from 'react'
import { fullTitle, clip, staticMeta, DEFAULT_DESCRIPTION } from '../data/seoStatic.js'

// The server writes the same tags into the HTML for crawlers and link
// previews (server/seo.js); this keeps them right as the visitor navigates.

function setMeta(name, content, attr = 'name') {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!content) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useSEO({ title, description, path, noindex = false } = {}) {
  useEffect(() => {
    const t = fullTitle(title)
    const desc = clip(description) || DEFAULT_DESCRIPTION
    const url = `${window.location.origin}${path ?? window.location.pathname}`
    document.title = t
    setMeta('description', desc)
    setMeta('robots', noindex ? 'noindex' : null)
    setMeta('og:title', t, 'property')
    setMeta('og:description', desc, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:url', url, 'property')
    setMeta('og:site_name', 'Teemly', 'property')
    setMeta('og:image', `${window.location.origin}/brand/og-image.png`, 'property')
    setMeta('twitter:title', t)
    setMeta('twitter:description', desc)
    setCanonical(url)
  }, [title, description, path, noindex])
}

/** For pages listed in src/data/seoStatic.js: useSEO with that page's entry. */
export function usePageSEO(path) {
  const meta = staticMeta(path) || {}
  useSEO({ title: meta.title, description: meta.description, path })
}
