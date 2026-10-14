export default function Logo({ variant = 'dark', size = 28, withText = true, viewBox = '0 0 64 64' }) {
  const textColor = variant === 'light' ? '#ffffff' : 'var(--navy)'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.36,
        lineHeight: 1,
      }}
    >
      <svg width={size} height={size} viewBox={viewBox} aria-hidden="true">
        <defs>
          <linearGradient id="logoBar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0aa1e8" />
            <stop offset="1" stopColor="#04dcd9" />
          </linearGradient>
          <linearGradient id="logoLeg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7a2cc7" />
            <stop offset="0.45" stopColor="#f52998" />
            <stop offset="1" stopColor="#eb214f" />
          </linearGradient>
          <clipPath id="legClip">
            <rect x="13" y="20" width="20" height="42" rx="10" />
          </clipPath>
        </defs>
        <rect x="2" y="4" width="44" height="20" rx="10" fill="url(#logoBar)" />
        <g clipPath="url(#legClip)">
          <rect x="13" y="20" width="20" height="42" fill="url(#logoLeg)" />
          <polygon points="13,20 33,20 13,40" fill="#0b1f8a" />
        </g>
      </svg>
      {withText && (
        <span
          style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 700,
            fontSize: size * 0.86,
            color: textColor,
            letterSpacing: '-0.02em',
          }}
        >
          teemly
        </span>
      )}
    </span>
  )
}
