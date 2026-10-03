import { Link } from 'react-router-dom'
import PageHero from '../../components/PageHero.jsx'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import { resourceTypes } from '../../data/resourcesMeta.js'
import '../../sections/sections.css'
import '../pages.css'

export default function ResourcesHub() {
  return (
    <>
      <PageHero
        eyebrow="Resource Center"
        title="Start with the glossary — the rest is on the way"
        desc="The glossary is live today. Research, guides, reports and case studies are being published as they're genuinely ready."
      />

      <section className="section-tight">
        <div className="container">
          <div className="tile-grid">
            {resourceTypes.map((r) => (
              <Link to={`/resources/${r.slug}`} className="tile-card" key={r.slug}>
                <span className="tile-icon">
                  <Icon name={r.icon} size={20} />
                </span>
                <h3>{r.label}</h3>
                <p>{r.description}</p>
                <span className="tile-link">
                  Explore <Icon name="arrowRight" size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
