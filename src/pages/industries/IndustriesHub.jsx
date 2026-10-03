import { Link } from 'react-router-dom'
import PageHero from '../../components/PageHero.jsx'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import { industries } from '../../data/industries.js'
import '../../sections/sections.css'
import '../pages.css'

export default function IndustriesHub() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="One platform, applied to how your industry actually works"
        desc="Teemly is not rebuilt per industry — these pages highlight which parts of the platform matter most for each one."
      />

      <section className="section-tight">
        <div className="container">
          <div className="tile-grid">
            {industries.map((i) => (
              <Link to={`/industries/${i.slug}`} className="tile-card" key={i.slug}>
                <span className="tile-icon">
                  <Icon name={i.icon} size={20} />
                </span>
                <h3>{i.label}</h3>
                <p>{i.context}</p>
                <span className="tile-link">
                  Learn more <Icon name="arrowRight" size={14} />
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
