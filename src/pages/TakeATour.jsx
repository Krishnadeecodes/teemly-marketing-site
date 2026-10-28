import { Link } from 'react-router-dom'
import SectionHead from '../components/SectionHead.jsx'
import Icon from '../components/Icon.jsx'
import TourPlaylist from '../sections/TourPlaylist.jsx'
import FinalCTA from '../sections/FinalCTA.jsx'
import './pages.css'

export default function TakeATour() {
  return (
    <>
      <section className="tour-page">
        <div className="container">
          <header className="tour-page-head">
            <h1>Teemly Product Tour</h1>
            <p>The real product, explained step by step.</p>
          </header>
          <TourPlaylist />
        </div>
      </section>

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
