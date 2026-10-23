import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Vite build plugin: lets a visitor who lands directly on an inner page
 * (say /pricing) start downloading that page's code at once, alongside the
 * main bundle, instead of only after the main bundle has run and asked for it.
 *
 * It reads the routes from src/App.jsx (each lazy page is declared as
 * `const X = page(() => import('./pages/X.jsx'))` and mounted with
 * `<Route path="..." element={<X />} />`), finds each page's built files, and
 * writes a small script into index.html that adds <link rel="modulepreload">
 * (and the page's stylesheet) for the route in the address bar.
 */
export default function routePreload() {
  return {
    name: 'route-preload',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, { bundle }) {
        if (!bundle) return html
        const app = readFileSync(resolve('src/App.jsx'), 'utf8')
        const modules = {}
        for (const [, name, file] of app.matchAll(/const (\w+) = page\(\(\) => import\('(.+?)'\)\)/g)) {
          modules[name] = resolve('src', file).replace(/\\/g, '/')
        }

        const chunks = Object.values(bundle).filter((c) => c.type === 'chunk')
        const entry = chunks.find((c) => c.isEntry)
        const skip = new Set([entry.fileName, ...entry.imports])
        const filesFor = (moduleId) => {
          const chunk = chunks.find((c) => c.facadeModuleId && c.facadeModuleId.replace(/\\/g, '/') === moduleId)
          if (!chunk) return null
          const js = new Set()
          const css = new Set()
          const walk = (c) => {
            if (!c || skip.has(c.fileName) || js.has(c.fileName)) return
            js.add(c.fileName)
            c.viteMetadata?.importedCss?.forEach((f) => css.add(f))
            c.imports.forEach((f) => walk(bundle[f]))
          }
          walk(chunk)
          return [[...js], [...css]]
        }

        // Every route is listed, in order, so the first match wins exactly as
        // in the router; routes that need nothing extra (the home page, the
        // redirects) carry empty lists.
        const routes = []
        for (const [, path, rest] of app.matchAll(/<Route\s+path="(.+?)"([^>]*)/g)) {
          const name = rest.match(/element=\{<(\w+)/)?.[1]
          routes.push([path, ...((name && modules[name] && filesFor(modules[name])) || [[], []])])
        }
        if (!routes.some((r) => r[1].length)) return html

        const script = `<script>(function(){var R=${JSON.stringify(routes)};var p=location.pathname.replace(/\\/+$/,'')||'/';var s=p.split('/');for(var i=0;i<R.length;i++){var r=R[i],q=r[0];if(q!=='*'){var t=q.split('/');if(t.length!==s.length)continue;var ok=true;for(var j=0;j<t.length;j++)if(t[j].charAt(0)!==':'&&t[j]!==s[j]){ok=false;break}if(!ok)continue}add(r);return}function add(r){r[1].forEach(function(f){l('modulepreload',f)});r[2].forEach(function(f){l('stylesheet',f)})}function l(rel,f){var e=document.createElement('link');e.rel=rel;e.href='/'+f;if(rel==='modulepreload')e.crossOrigin='';document.head.appendChild(e)}})()</script>`
        return html.replace('</title>', '</title>\n    ' + script)
      },
    },
  }
}
