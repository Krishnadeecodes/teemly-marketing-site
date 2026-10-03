import { Link } from 'react-router-dom'
import PageHero from '../../components/PageHero.jsx'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import { whyTeemlyPages } from '../../data/whyTeemly.js'
import '../../sections/sections.css'
import '../pages.css'

export default function WhyTeemlyHub() {
  return (
    <>
      <PageHero
        eyebrow="Why Teemly"
        title="Why Organizational Intelligence, and why Teemly"
        desc="The problem we're solving, what makes our approach different, and where the value actually shows up."
      />

      <section className="section-tight">
        <div className="container">
          <div className="tile-grid">
            {whyTeemlyPages.map((p) => (
              <Link to={`/why-teemly/${p.slug}`} className="tile-card" key={p.slug}>
                <span className="tile-icon">
                  <Icon name={p.icon} size={20} />
                </span>
                <h3>{p.label}</h3>
                <p>{p.intro}</p>
                <span className="tile-link">
                  Read more <Icon name="arrowRight" size={14} />
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
