// The Teemly logo, defined once. Everything else is built from this file:
// the <Logo /> component renders it, and `npm run brand` writes the favicon,
// the standalone SVG/PNG files (emails, social preview) from it.
// Coordinates are traced from the master artwork (teemly.jpg.jpeg).

export const BRAND_COLORS = {
  barFrom: '#0187E0',
  barTo: '#07D7D9',
  stemFrom: '#F62DA0',
  stemTo: '#E91E63',
  fold: '#032297',
  ink: '#0B1442',
}

// The T mark: a rounded bar, a stem with a rounded foot, and the folded corner.
export const MARK = {
  bar: { x: 103, y: 80, width: 425, height: 132, rx: 66 },
  stem: 'M257 212H389V484A66 66 0 0 1 257 484Z',
  fold: 'M257 212H389L257 300Z',
}

// The wordmark is monoline, so each letter is a stroked centre line.
// `tracking` opens the letters up slightly so the "e" counters stay clear at
// header sizes; `strokeWidth` is a touch lighter than the print artwork.
export const WORDMARK = {
  strokeWidth: 44,
  tracking: 20,
  paths: [
    'M603 201V372Q603 435 666 435H668M603 266H667', // t
    'M716 344H880M880 347A82 85 0 1 0 864 410', // e
    'M933 344H1097M1097 347A82 85 0 1 0 1081 410', // e
    'M1156 265V435M1156 318A62.5 52 0 0 1 1281 318V435M1281 318A62.5 52 0 0 1 1406 318V435', // m
    'M1480 180V435', // l
    'M1554 268V365A75 70 0 0 0 1704 365M1704 268V455C1704 505 1665 527 1625 527C1605 527 1590 520 1575 512', // y
  ],
}

// Square box around the mark, and the box around mark + wordmark.
export const VIEWBOX_MARK = '75.5 75 480 480'
export const VIEWBOX_FULL = '95 72 1750 486'

// Horizontal offset for letter i of the wordmark.
export const letterOffset = (i) => i * WORDMARK.tracking

// Standalone SVG markup (favicon, files in /public/brand).
export function logoSvg({ full = true, tone = 'dark', idPrefix = 't' } = {}) {
  const c = BRAND_COLORS
  const ink = tone === 'light' ? '#FFFFFF' : c.ink
  const vb = full ? VIEWBOX_FULL : VIEWBOX_MARK
  const [, , w, h] = vb.split(' ').map(Number)
  const b = MARK.bar
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}">
  <title>Teemly</title>
  <defs>
    <linearGradient id="${idPrefix}-bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c.barFrom}"/><stop offset="1" stop-color="${c.barTo}"/></linearGradient>
    <linearGradient id="${idPrefix}-stem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.stemFrom}"/><stop offset="1" stop-color="${c.stemTo}"/></linearGradient>
  </defs>
  <path d="${MARK.stem}" fill="url(#${idPrefix}-stem)"/>
  <path d="${MARK.fold}" fill="${c.fold}"/>
  <rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" rx="${b.rx}" fill="url(#${idPrefix}-bar)"/>${
    full
      ? `
  <g fill="none" stroke="${ink}" stroke-width="${WORDMARK.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${WORDMARK.paths
          .map((d, i) => `<path transform="translate(${letterOffset(i)} 0)" d="${d}"/>`)
          .join('')}</g>`
      : ''
  }
</svg>
`
}
