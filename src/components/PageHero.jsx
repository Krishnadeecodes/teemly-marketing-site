import GlowOrbit from './GlowOrbit.jsx'

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
        <h1>{title}</h1>
        {desc && <p>{desc}</p>}
        {children}
      </div>
    </section>
  )
}
