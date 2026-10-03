import { Link } from 'react-router-dom'
import PageHero from '../../components/PageHero.jsx'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import { solutions } from '../../data/solutions.js'
import '../../sections/sections.css'
import '../pages.css'

export default function SolutionsHub() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="The same record, read differently by every seat at the table"
        desc="Executives, HR, managers, operations, IT, finance and more all ask different questions of the same underlying data."
      />

      <section className="section-tight">
        <div className="container">
          <div className="tile-grid">
            {solutions.map((s) => (
              <Link to={`/solutions/${s.slug}`} className="tile-card" key={s.slug}>
                <span className="tile-icon">
                  <Icon name={s.icon} size={20} />
                </span>
                <h3>{s.navLabel}</h3>
                <p>{s.problem}</p>
                <span className="tile-link">
                  See the solution <Icon name="arrowRight" size={14} />
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
