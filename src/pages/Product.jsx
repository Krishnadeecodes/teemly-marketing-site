import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import { MODULES } from '../data/modules.js'
import Icon from '../components/Icon.jsx'
import ProductTour from '../sections/ProductTour.jsx'
import Trust from '../sections/Trust.jsx'
import FinalCTA from '../sections/FinalCTA.jsx'
import '../sections/sections.css'
import './pages.css'

// Modules with a section in the walkthrough below link to it; the rest open their own page.
const TOUR_IDS = ['dashboard', 'teams', 'screenshots', 'attendance', 'reports', 'settings']

export default function Product() {
  return (
    <>
      <PageHero
        eyebrow="Product"
        title="Everything Teemly captures, in one place"
        desc={`${MODULES.length} modules, one shared record. Jump to any of them, or scroll through the walkthrough below.`}
      />

      <section className="section-tight">
        <div className="container">
          <div className="module-nav-strip">
            {MODULES.map((m) =>
              TOUR_IDS.includes(m.slug) ? (
                <a href={`#${m.slug}`} key={m.slug}>
                  <Icon name={m.icon} size={16} />
                  {m.label}
                </a>
              ) : (
                <Link to={`/product/${m.slug}`} key={m.slug}>
                  <Icon name={m.icon} size={16} />
                  {m.label}
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <ProductTour />
      {/* Trust is a home-page section: its styles are scoped to .home-v2 */}
      <div className="home-v2">
        <Trust />
      </div>
      <FinalCTA />
    </>
  )
}
