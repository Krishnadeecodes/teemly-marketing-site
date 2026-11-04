// Serves the built single-page app with the right <head> for each URL, and
// the files search engines and security researchers look for.
//
//   - every page gets its own <title>, description, canonical and og:/twitter:
//     tags in the HTML itself, so crawlers and link previews see them without
//     running JavaScript (titles come from src/data/seoMeta.js)
//   - URLs that aren't a page get a real 404 status (no more "soft 404s")
//   - /robots.txt, /sitemap.xml and /.well-known/security.txt
import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import { metaForPath, allPaths, fullTitle, DEFAULT_DESCRIPTION, clip } from '../src/data/seoMeta.js'
import { resourcePageMeta, liveResourcePaths } from './resources.js'

const REDIRECTS = { '/about': '/company/about', '/contact': '/company/contact' }

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function seoRouter({ distDir, siteUrl, securityContact }) {
  const SITE = (siteUrl || 'https://teemly.co').replace(/\/+$/, '')
  const r = express.Router()

  // index.html is read once; a missing build is reported on each request
  // instead of crashing, so `npm run server` still works before `npm run build`.
  let template = null
  function getTemplate() {
    if (!template) template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8')
    return template
  }

  function render({ title, description, path: pagePath, noindex }) {
    const t = esc(fullTitle(title))
    const d = esc(clip(description) || DEFAULT_DESCRIPTION)
    const url = esc(`${SITE}${pagePath}`)
    const image = esc(`${SITE}/brand/og-image.png`)
    const head = [
      `<link rel="canonical" href="${url}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="Teemly" />`,
      `<meta property="og:title" content="${t}" />`,
      `<meta property="og:description" content="${d}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:image" content="${image}" />`,
      `<meta name="twitter:title" content="${t}" />`,
      `<meta name="twitter:description" content="${d}" />`,
      `<meta name="twitter:image" content="${image}" />`,
      noindex ? `<meta name="robots" content="noindex" />` : '',
    ]
      .filter(Boolean)
      .join('\n    ')
    return getTemplate()
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
      .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${d}" />`)
      .replace(/\s*<meta property="og:image" content="[^"]*" \/>/, '')
      .replace('</head>', `    ${head}\n  </head>`)
  }

  function sendPage(res, status, meta) {
    let html
    try {
      html = render(meta)
    } catch (err) {
      console.error('[seo] could not read dist/index.html — run `npm run build`:', err.message)
      return res.status(503).type('text').send('Site is being built. Please try again in a moment.')
    }
    res.status(status).set('Cache-Control', 'no-cache')
    if (meta.noindex) res.set('X-Robots-Tag', 'noindex')
    res.type('html').send(html)
  }

  // ---- Crawler files ----
  r.get('/robots.txt', (req, res) => {
    res.type('text').send(['User-agent: *', 'Disallow: /admin', 'Disallow: /api/', '', `Sitemap: ${SITE}/sitemap.xml`, ''].join('\n'))
  })

  let sitemap = { xml: null, at: 0 }
  r.get('/sitemap.xml', async (req, res, next) => {
    try {
      if (!sitemap.xml || Date.now() - sitemap.at > 60 * 60 * 1000) {
        const resources = await liveResourcePaths().catch((err) => {
          console.error('[seo] sitemap: resources unavailable:', err.message)
          return []
        })
        const urls = [...allPaths().map((p) => ({ path: p })), ...resources]
        const body = urls
          .map((u) => {
            const lastmod = u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString().slice(0, 10)}</lastmod>` : ''
            return `  <url><loc>${esc(SITE + u.path)}</loc>${lastmod}</url>`
          })
          .join('\n')
        sitemap = {
          xml: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
          at: Date.now(),
        }
      }
      res.type('application/xml').set('Cache-Control', 'public, max-age=3600').send(sitemap.xml)
    } catch (err) {
      next(err)
    }
  })

  // RFC 9116. Expires must be under a year away, so it is generated.
  const securityTxt = (req, res) => {
    const expires = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().replace(/\.\d+Z$/, 'Z')
    res.type('text').send(
      [
        `Contact: ${securityContact || 'mailto:info@teemly.co'}`,
        `Expires: ${expires}`,
        'Preferred-Languages: en',
        `Canonical: ${SITE}/.well-known/security.txt`,
        `Policy: ${SITE}/security`,
        '',
      ].join('\n'),
    )
  }
  r.get('/.well-known/security.txt', securityTxt)
  r.get('/security.txt', securityTxt)

  // ---- Pages ----
  r.get(/.*/, async (req, res, next) => {
    const p = req.path
    if (p.startsWith('/api/') || p.startsWith('/uploads/')) return next()

    if (REDIRECTS[p]) return res.redirect(301, REDIRECTS[p])

    // A missing file (old asset, typo'd image) gets a plain 404, not the app.
    if (/\.[a-z0-9]{1,8}$/i.test(p)) return res.status(404).type('text').send('Not found')

    if (p === '/admin' || p.startsWith('/admin/')) {
      return sendPage(res, 200, { title: 'Admin', path: '/admin', noindex: true })
    }

    try {
      let meta = metaForPath(p)
      if (meta?.resource) {
        const [, type, slug] = meta.path.split('/').slice(1)
        const found = await resourcePageMeta(type, slug).catch((err) => {
          // database down: serve the page (it has its own fallback) rather than a false 404
          console.error('[seo] resource lookup failed:', err.message)
          return { title: 'Resources' }
        })
        // A category with nothing published stays reachable but out of search results.
        meta = found && { ...found, path: meta.path, noindex: !!found.empty }
      }
      if (!meta) return sendPage(res, 404, { title: 'Page not found', path: p, noindex: true })
      sendPage(res, 200, meta)
    } catch (err) {
      next(err)
    }
  })

  return r
}
