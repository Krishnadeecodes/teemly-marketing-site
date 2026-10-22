import { useLayoutEffect, useRef } from 'react'
import './fitScale.css'

/**
 * Shows a product screen exactly as it looks on desktop, shrunk to fit.
 *
 * Below `width` pixels of available space the children are laid out at
 * `width` (and `height`, when given) and scaled down as one picture, like a
 * screenshot, instead of reflowing into a squeezed mobile layout. The wrapper
 * takes the scaled height so nothing overlaps. With enough room, or when the
 * `media` query doesn't match (so desktop layouts are never touched), the
 * children render normally.
 */
export default function FitScale({ width, height, media = '(max-width: 900px)', className = '', children }) {
  const outerRef = useRef(null)
  const innerRef = useRef(null)

  useLayoutEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return undefined

    const mq = window.matchMedia(media)
    const fit = () => {
      const scale = outer.clientWidth / width
      if (scale >= 1 || !mq.matches) {
        outer.classList.remove('is-scaled')
        inner.style.transform = ''
        outer.style.height = ''
        return
      }
      outer.classList.add('is-scaled')
      inner.style.transform = `scale(${scale})`
      outer.style.height = `${inner.offsetHeight * scale}px`
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(outer)
    ro.observe(inner)
    mq.addEventListener('change', fit)
    return () => {
      ro.disconnect()
      mq.removeEventListener('change', fit)
    }
  }, [width, media])

  return (
    <div className={`fit-scale ${className}`} ref={outerRef} style={{ '--fit-w': `${width}px`, '--fit-h': height ? `${height}px` : 'auto' }}>
      <div className="fit-scale-inner" ref={innerRef}>
        {children}
      </div>
    </div>
  )
}
