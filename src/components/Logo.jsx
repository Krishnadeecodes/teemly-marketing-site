import { useId } from 'react'
import { BRAND_COLORS as C, MARK, VIEWBOX_FULL, VIEWBOX_MARK, WORDMARK, letterOffset } from '../brand/logo.js'

// Height in px for each named size. The full logo is wider, so it gets a
// little less height to sit at the same optical weight as the mark.
const SIZES = {
  full: { sm: 24, md: 32, lg: 44 },
  mark: { sm: 20, md: 28, lg: 40 },
}

/**
 * The one Teemly logo.
 *  variant  'full' (T + wordmark) | 'mark' (T only)
 *  size     'sm' | 'md' | 'lg' | a pixel height
 *  tone     'dark' (navy wordmark, for light backgrounds) | 'light' (white wordmark)
 *  label    accessible name; pass null when a parent link/button already names it
 */
export default function Logo({ variant = 'full', size = 'md', tone = 'dark', label = 'Teemly', className = '', ...rest }) {
  const id = useId().replace(/:/g, '')
  const full = variant === 'full'
  const height = typeof size === 'number' ? size : SIZES[full ? 'full' : 'mark'][size] ?? SIZES.full.md
  const [, , w, h] = (full ? VIEWBOX_FULL : VIEWBOX_MARK).split(' ').map(Number)
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }

  return (
    <svg
      className={`t-logo t-logo-${variant} ${className}`.trim()}
      viewBox={full ? VIEWBOX_FULL : VIEWBOX_MARK}
      height={height}
      width={Math.round((height * w) / h)}
      focusable="false"
      {...a11y}
      {...rest}
    >
      <defs>
        <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={C.barFrom} />
          <stop offset="1" stopColor={C.barTo} />
        </linearGradient>
        <linearGradient id={`${id}-stem`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.stemFrom} />
          <stop offset="1" stopColor={C.stemTo} />
        </linearGradient>
      </defs>
      <g className="t-logo-stem">
        <path d={MARK.stem} fill={`url(#${id}-stem)`} />
        <path d={MARK.fold} fill={C.fold} />
      </g>
      <rect className="t-logo-bar" {...MARK.bar} fill={`url(#${id}-bar)`} />
      {full && (
        <g
          fill="none"
          stroke={tone === 'light' ? '#fff' : C.ink}
          strokeWidth={WORDMARK.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {WORDMARK.paths.map((d, i) => (
            <path key={d} d={d} transform={`translate(${letterOffset(i)} 0)`} />
          ))}
        </g>
      )}
    </svg>
  )
}
