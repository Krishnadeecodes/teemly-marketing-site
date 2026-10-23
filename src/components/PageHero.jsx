import GlowOrbit from './GlowOrbit.jsx'
import Reveal from '../home/Reveal.jsx'
import SplitHeading from '../home/SplitHeading.jsx'

export default function PageHero({ eyebrow, title, desc, children }) {
  return (
    <section className="page-hero">
      <GlowOrbit />
      <div className="container page-hero-inner">
        {eyebrow && (
          <span className="eyebrow">
            <span className="dot" />
            {eyebrow}
          </span>
        )}
        <SplitHeading as="h1" text={title} mode="load" />
        {desc && (
          <Reveal as="p" delay={0.15}>
            {desc}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}
