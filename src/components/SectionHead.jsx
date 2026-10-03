import Reveal from '../home/Reveal.jsx'
import SplitHeading from '../home/SplitHeading.jsx'

export default function SectionHead({ eyebrow, title, desc, center = false, dark = false }) {
  return (
    <Reveal as="div" className={`section-head${center ? ' center' : ''}`}>
      {eyebrow && (
        <span className={`eyebrow${dark ? ' on-dark' : ''}`}>
          <span className="dot" />
          {eyebrow}
        </span>
      )}
      <SplitHeading as="h2" text={title} className={dark ? 'on-dark-heading' : ''} />
      {desc && <p style={dark ? { color: 'var(--dark-text)' } : undefined}>{desc}</p>}
    </Reveal>
  )
}
