import { useRef, useState } from 'react'
import { useEditor, useEditorState, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { TableKit } from '@tiptap/extension-table'
import { api } from './api.js'
import { useToast } from './ui.jsx'
import { isHtmlBody, renderMarkdown } from '../lib/markdown.js'

const IMAGE_ACCEPT = 'image/png,image/jpeg,image/webp,image/gif'
const MIN_WIDTH = 10
const clampWidth = (w) => Math.min(100, Math.max(MIN_WIDTH, Math.round(w)))

// ---------- Resizable, alignable image ----------
// Width is stored as a percentage of the text column so images stay
// responsive on the public site: <img data-width="50" data-align="left" style="width:50%">
function ImageView({ node, updateAttributes, deleteNode, selected, editor }) {
  const { src, alt, width, align } = node.attrs
  const [live, setLive] = useState(null) // width while dragging

  function startResize(e, side) {
    e.preventDefault()
    e.stopPropagation()
    const column = editor.view.dom.clientWidth || 1
    const startX = e.clientX
    const startW = width
    // Centred images grow from both sides, so each pixel of drag counts double.
    const factor = (align === 'center' ? 2 : 1) * (side === 'left' ? -1 : 1)
    let next = startW
    const move = (ev) => {
      next = clampWidth(startW + ((ev.clientX - startX) * factor * 100) / column)
      setLive(next)
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      setLive(null)
      updateAttributes({ width: next })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const shown = live ?? width
  const editable = editor.isEditable

  return (
    <NodeViewWrapper
      className={`rte-img align-${align}${selected ? ' is-selected' : ''}${live ? ' is-resizing' : ''}`}
      style={{ width: `${shown}%` }}
      data-drag-handle
    >
      <img src={src} alt={alt || ''} draggable={false} />
      {editable && (
        <>
          <span className="rte-img-handle left" onPointerDown={(e) => startResize(e, 'left')} aria-hidden="true" />
          <span className="rte-img-handle right" onPointerDown={(e) => startResize(e, 'right')} aria-hidden="true" />
          {live && <span className="rte-img-size">{live}%</span>}
          {selected && !live && (
            <div className="rte-img-bar" contentEditable={false} onMouseDown={(e) => e.preventDefault()}>
              {[25, 50, 75, 100].map((w) => (
                <button key={w} type="button" aria-pressed={width === w} onClick={() => updateAttributes({ width: w })}>
                  {w}%
                </button>
              ))}
              <span className="rte-sep" />
              {[
                ['left', 'Float left — text wraps on the right'],
                ['center', 'Centre'],
                ['right', 'Float right — text wraps on the left'],
              ].map(([a, title]) => (
                <button key={a} type="button" title={title} aria-pressed={align === a} onClick={() => updateAttributes({ align: a })}>
                  <AlignIcon dir={a} />
                </button>
              ))}
              <span className="rte-sep" />
              <button
                type="button"
                title="Alt text (describes the image for screen readers and search)"
                className={alt ? '' : 'warn'}
                onClick={() => {
                  const next = window.prompt('Alt text — describe the image', alt || '')
                  if (next !== null) updateAttributes({ alt: next.trim() })
                }}
              >
                Alt
              </button>
              <button type="button" title="Remove image" onClick={deleteNode}>
                ✕
              </button>
            </div>
          )}
        </>
      )}
    </NodeViewWrapper>
  )
}

const ResizableImage = Image.extend({
  draggable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 100,
        parseHTML: (el) => {
          const pct = Number(el.getAttribute('data-width')) || parseFloat((el.style.width || '').replace('%', ''))
          return pct ? clampWidth(pct) : 100
        },
        renderHTML: (a) => (a.width && a.width < 100 ? { 'data-width': a.width, style: `width: ${a.width}%` } : {}),
      },
      height: { default: null, parseHTML: () => null, renderHTML: () => ({}) },
      align: {
        default: 'center',
        parseHTML: (el) => (['left', 'right', 'center'].includes(el.getAttribute('data-align')) ? el.getAttribute('data-align') : 'center'),
        renderHTML: (a) => ({ 'data-align': a.align }),
      },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageView)
  },
})

// ---------- Toolbar ----------
function AlignIcon({ dir }) {
  const rows = { left: [14, 10, 14, 8], center: [14, 10, 14, 10], right: [14, 10, 14, 8] }[dir]
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      {rows.map((w, i) => {
        const x = dir === 'left' ? 1 : dir === 'right' ? 15 - w : 8 - w / 2
        return <rect key={i} x={x} y={2 + i * 3.5} width={w} height="1.8" rx=".9" fill="currentColor" />
      })}
    </svg>
  )
}

function Btn({ on, title, onClick, disabled, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={on === undefined ? undefined : !!on}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // keep the editor selection
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor, onImage, uploading }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      block: e.isActive('heading', { level: 2 }) ? 'h2' : e.isActive('heading', { level: 3 }) ? 'h3' : e.isActive('heading', { level: 4 }) ? 'h4' : 'p',
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      highlight: e.isActive('highlight'),
      code: e.isActive('code'),
      link: e.isActive('link'),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      codeBlock: e.isActive('codeBlock'),
      table: e.isActive('table'),
      alignLeft: e.isActive({ textAlign: 'left' }),
      alignCenter: e.isActive({ textAlign: 'center' }),
      alignRight: e.isActive({ textAlign: 'right' }),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })
  const chain = () => editor.chain().focus()

  function setLink() {
    const prev = editor.getAttributes('link').href || ''
    const url = window.prompt('Link URL (leave empty to remove)', prev || 'https://')
    if (url === null) return
    const href = url.trim()
    if (!href || href === 'https://') return chain().extendMarkRange('link').unsetLink().run()
    if (!/^(https?:\/\/|mailto:|\/|#)/i.test(href)) return window.alert('Use a full https:// link, a mailto: address or a /site path.')
    chain().extendMarkRange('link').setLink({ href }).run()
  }

  return (
    <div className="rte-bar" role="toolbar" aria-label="Formatting">
      <select
        aria-label="Text style"
        value={s.block}
        onChange={(e) => {
          const v = e.target.value
          if (v === 'p') chain().setParagraph().run()
          else chain().setHeading({ level: Number(v[1]) }).run()
        }}
      >
        <option value="p">Paragraph</option>
        <option value="h2">Heading</option>
        <option value="h3">Subheading</option>
        <option value="h4">Small heading</option>
      </select>
      <span className="rte-sep" />
      <Btn title="Bold (Ctrl+B)" on={s.bold} onClick={() => chain().toggleBold().run()}>
        <b>B</b>
      </Btn>
      <Btn title="Italic (Ctrl+I)" on={s.italic} onClick={() => chain().toggleItalic().run()}>
        <i>I</i>
      </Btn>
      <Btn title="Underline (Ctrl+U)" on={s.underline} onClick={() => chain().toggleUnderline().run()}>
        <u>U</u>
      </Btn>
      <Btn title="Strikethrough" on={s.strike} onClick={() => chain().toggleStrike().run()}>
        <s>S</s>
      </Btn>
      <Btn title="Highlight" on={s.highlight} onClick={() => chain().toggleHighlight().run()}>
        <mark>H</mark>
      </Btn>
      <Btn title="Inline code" on={s.code} onClick={() => chain().toggleCode().run()}>
        {'</>'}
      </Btn>
      <Btn title="Link (Ctrl+K)" on={s.link} onClick={setLink}>
        Link
      </Btn>
      <span className="rte-sep" />
      <Btn title="Bulleted list" on={s.bullet} onClick={() => chain().toggleBulletList().run()}>
        • List
      </Btn>
      <Btn title="Numbered list" on={s.ordered} onClick={() => chain().toggleOrderedList().run()}>
        1. List
      </Btn>
      <Btn title="Quote" on={s.quote} onClick={() => chain().toggleBlockquote().run()}>
        “ ”
      </Btn>
      <Btn title="Code block" on={s.codeBlock} onClick={() => chain().toggleCodeBlock().run()}>
        {'{ }'}
      </Btn>
      <Btn title="Divider" onClick={() => chain().setHorizontalRule().run()}>
        —
      </Btn>
      <span className="rte-sep" />
      <Btn title="Align left" on={s.alignLeft} onClick={() => chain().setTextAlign('left').run()}>
        <AlignIcon dir="left" />
      </Btn>
      <Btn title="Align centre" on={s.alignCenter} onClick={() => chain().setTextAlign('center').run()}>
        <AlignIcon dir="center" />
      </Btn>
      <Btn title="Align right" on={s.alignRight} onClick={() => chain().setTextAlign('right').run()}>
        <AlignIcon dir="right" />
      </Btn>
      <span className="rte-sep" />
      <Btn title={uploading ? 'Uploading…' : 'Insert image (or paste / drop one)'} disabled={uploading} onClick={onImage}>
        {uploading ? 'Uploading…' : 'Image'}
      </Btn>
      <Btn title="Insert table" onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
        Table
      </Btn>
      {s.table && (
        <span className="rte-group" aria-label="Table tools">
          <Btn title="Add row below" onClick={() => chain().addRowAfter().run()}>
            +Row
          </Btn>
          <Btn title="Add column right" onClick={() => chain().addColumnAfter().run()}>
            +Col
          </Btn>
          <Btn title="Delete row" onClick={() => chain().deleteRow().run()}>
            −Row
          </Btn>
          <Btn title="Delete column" onClick={() => chain().deleteColumn().run()}>
            −Col
          </Btn>
          <Btn title="Delete table" onClick={() => chain().deleteTable().run()}>
            ✕ Table
          </Btn>
        </span>
      )}
      <span className="rte-spacer" />
      <Btn title="Undo (Ctrl+Z)" disabled={!s.canUndo} onClick={() => chain().undo().run()}>
        ↶
      </Btn>
      <Btn title="Redo (Ctrl+Shift+Z)" disabled={!s.canRedo} onClick={() => chain().redo().run()}>
        ↷
      </Btn>
    </div>
  )
}

// ---------- Editor ----------
// Uncontrolled: `value` seeds the editor once (remount with a `key` to reset).
// Older Markdown bodies are converted to HTML on load; saving stores HTML.
export default function RichTextEditor({ value, onChange, placeholder = 'Start writing…' }) {
  const toast = useToast()
  const fileInput = useRef()
  const [uploading, setUploading] = useState(false)
  const baseline = useRef(null) // HTML right after load, to tell real edits from normalisation
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const original = useRef(value)

  async function uploadImages(files, pos) {
    const images = [...files].filter((f) => /^image\/(png|jpe?g|webp|gif)$/.test(f.type))
    if (!images.length) return false
    setUploading(true)
    try {
      for (const file of images) {
        const u = await api.upload(file)
        const node = { type: 'image', attrs: { src: u.url, alt: u.name.replace(/\.\w+$/, '').replace(/[-_]+/g, ' ') } }
        if (pos == null) editor.chain().focus().insertContent(node).run()
        else editor.chain().insertContentAt(pos, node).run()
      }
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setUploading(false)
    }
    return true
  }
  const uploadRef = useRef(uploadImages)
  uploadRef.current = uploadImages

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      ResizableImage,
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      TableKit.configure({ table: { resizable: false } }),
    ],
    content: isHtmlBody(value) ? value : renderMarkdown(value),
    editorProps: {
      attributes: { class: 'res-prose rte-content', 'aria-label': 'Body', spellcheck: 'true' },
      handlePaste: (view, event) => {
        const files = event.clipboardData?.files
        if (!files?.length || ![...files].some((f) => f.type.startsWith('image/'))) return false
        event.preventDefault()
        uploadRef.current(files)
        return true
      },
      handleDrop: (view, event, slice, moved) => {
        const files = event.dataTransfer?.files
        if (moved || !files?.length || ![...files].some((f) => f.type.startsWith('image/'))) return false
        event.preventDefault()
        const at = view.posAtCoords({ left: event.clientX, top: event.clientY })
        uploadRef.current(files, at?.pos)
        return true
      },
      handleKeyDown: (view, event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
          event.preventDefault()
          document.querySelector('.rte-bar button[title^="Link"]')?.click()
          return true
        }
        return false
      },
    },
    onCreate: ({ editor: e }) => {
      baseline.current = e.getHTML()
    },
    onUpdate: ({ editor: e }) => {
      const html = e.getHTML()
      if (html === baseline.current) onChangeRef.current(original.current)
      else onChangeRef.current(e.isEmpty ? '' : html)
    },
  })

  const counts = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      const words = e ? e.getText().split(/\s+/).filter(Boolean).length : 0
      return { words, mins: Math.max(1, Math.round(words / 220)) }
    },
  })

  if (!editor) return null

  return (
    <div className="rte">
      <Toolbar editor={editor} uploading={uploading} onImage={() => fileInput.current.click()} />
      <input
        ref={fileInput}
        type="file"
        accept={IMAGE_ACCEPT}
        multiple
        hidden
        onChange={(e) => {
          const files = [...e.target.files]
          e.target.value = ''
          uploadImages(files)
        }}
      />
      <EditorContent editor={editor} />
      <div className="rte-foot">
        <span>
          {counts.words.toLocaleString()} words · ~{counts.mins} min read
        </span>
        <span>Select an image to resize, align or add alt text · drag its edges to resize freely</span>
      </div>
    </div>
  )
}
