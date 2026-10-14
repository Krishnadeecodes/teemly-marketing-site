import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({ gfm: true, breaks: false })

// Links in article bodies that leave the site open in a new tab.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && /^https?:\/\//i.test(node.getAttribute('href') || '')) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

// Markdown -> sanitized HTML. Used by the public article page and the admin preview.
export function renderMarkdown(src) {
  return DOMPurify.sanitize(marked.parse(src || ''), { USE_PROFILES: { html: true } })
}
