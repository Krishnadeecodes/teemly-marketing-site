import './glow.css'

export default function GlowOrbit() {
  return (
    <div className="glow-orbit" aria-hidden="true">
      <div className="glow-blob glow-blob-a" />
      <div className="glow-blob glow-blob-b" />
      <svg className="glow-rings" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMin slice">
        <circle cx="600" cy="60" r="330" />
        <circle cx="600" cy="60" r="230" />
      </svg>

      <div className="orbit-track orbit-track-a">
        <span className="orbit-particle" />
      </div>
      <div className="orbit-track orbit-track-a-rev">
        <span className="orbit-particle small" />
      </div>
      <div className="orbit-track orbit-track-b">
        <span className="orbit-particle small" />
      </div>
    </div>
  )
}
