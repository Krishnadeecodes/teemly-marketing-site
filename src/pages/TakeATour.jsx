import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Icon from '../components/Icon.jsx'
import ProductTour from '../sections/ProductTour.jsx'
import TourPlayer from '../sections/TourPlayer.jsx'
import FinalCTA from '../sections/FinalCTA.jsx'
import './pages.css'

export default function TakeATour() {
  const seeAll = () => document.getElementById('all-modules')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <>
      <PageHero
        eyebrow="Take a Tour"
        title="A self-guided look at the product, before you book a call"
        desc="Pick your role for a guided, step-by-step walkthrough of the screens that matter to you — or scroll through every module below."
      />

      <section className="section-tight">
        <div className="container">
          <TourPlayer onSeeAll={seeAll} />
        </div>
      </section>

      {/* the full walkthrough stays for visitors who prefer to scroll */}
      <div id="all-modules">
        <ProductTour />
      </div>

      <section className="section-tight">
        <div className="container">
          <SectionHead
            center
            eyebrow="Before You Book a Demo"
            title="Check security and governance first, if that's what blocks you"
            desc="Access control, encryption, audit logging and the Silent Tracking legal gate are documented in full on the Security & Trust pages."
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/security" className="btn btn-outline">
              Explore Security &amp; Trust
              <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
