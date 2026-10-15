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

const sanitize = (html) => DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })

// Bodies saved by the rich-text editor are HTML; older ones are Markdown.
export const isHtmlBody = (src) => /^\s*<(p|h[1-6]|ul|ol|blockquote|img|figure|div|table|pre|hr)[\s>/]/i.test(src || '')

// Markdown -> sanitized HTML.
export function renderMarkdown(src) {
  return sanitize(marked.parse(src || ''))
}

// Any stored body (HTML or Markdown) -> sanitized HTML. Used by the public article pages.
export function renderBody(src) {
  return isHtmlBody(src) ? sanitize(src) : renderMarkdown(src)
}
