import { useParams, Link, Navigate } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Icon from '../components/Icon.jsx'
import FitScale from '../components/FitScale.jsx'
import { SHOT_W } from '../components/FeatureShots.jsx'
import FinalCTA from '../sections/FinalCTA.jsx'
import { modules, getModule } from '../data/moduleContent.js'
import '../sections/sections.css'
import './pages.css'

export default function ModulePage() {
  const { slug } = useParams()
  const mod = getModule(slug)

  if (!mod) return <Navigate to="/product" replace />

  const idx = modules.findIndex((m) => m.slug === slug)
  const prev = modules[(idx - 1 + modules.length) % modules.length]
  const next = modules[(idx + 1) % modules.length]

  return (
    <>
      <PageHero eyebrow={mod.tag} title={mod.title} desc={mod.intro} />

      <section className="section-tight">
        <div className="container">
          {/* the feature screenshot, scaled down on narrower screens */}
          <div className="module-shot">
            <FitScale width={SHOT_W} media="all">
              <mod.Comp />
            </FitScale>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <SectionHead eyebrow="On This Screen" title="What you actually see" />
          <div className="module-highlight-grid">
            {mod.highlights.map((h) => (
              <div className="module-highlight-card" key={h.title}>
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <SectionHead eyebrow="Role Access" title="Client Admin vs. Client Manager" />
          <div className="comparison-table-wrap">
            <table className="comparison-table module-role-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Client Admin</th>
                  <th>Client Manager</th>
                </tr>
              </thead>
              <tbody>
                {mod.roleAccess.map((r) => (
                  <tr key={r.feature}>
                    <td>{r.feature}</td>
                    <td>{r.admin}</td>
                    <td>{r.manager}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {mod.planNote && (
            <div className="module-plan-note">
              <Icon name="layers" size={17} />
              <p>{mod.planNote}</p>
            </div>
          )}
        </div>
      </section>

      <section className="section-tight">
        <div className="container module-nav-footer">
          <Link to={`/product/${prev.slug}`} className="module-nav-link prev">
            <Icon name="arrowRight" size={15} className="flip" />
            <span>
              <span className="module-nav-label">Previous</span>
              {prev.navLabel}
            </span>
          </Link>
          <Link to="/product" className="module-nav-link center">
            All modules
          </Link>
          <Link to={`/product/${next.slug}`} className="module-nav-link next">
            <span>
              <span className="module-nav-label">Next</span>
              {next.navLabel}
            </span>
            <Icon name="arrowRight" size={15} />
          </Link>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
