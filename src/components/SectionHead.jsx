export default function SectionHead({ eyebrow, title, desc, center = false, dark = false }) {
  return (
    <div className={`section-head${center ? ' center' : ''}`}>
      {eyebrow && (
        <span className={`eyebrow${dark ? ' on-dark' : ''}`}>
          <span className="dot" />
          {eyebrow}
        </span>
      )}
      <h2 style={dark ? { color: '#fff' } : undefined}>{title}</h2>
      {desc && <p style={dark ? { color: 'var(--dark-text)' } : undefined}>{desc}</p>}
    </div>
  )
}
