import PageHero from '../../components/PageHero.jsx'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import '../pages.css'

export default function Careers() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="No open roles listed yet"
        desc="We'd rather leave this page honest than list positions that don't exist. If that changes, it will show up here first."
      />
      <section className="section-tight">
        <div className="container resource-empty">
          <span className="tile-icon resource-empty-icon">
            <Icon name="briefcase" size={28} />
          </span>
          <h3>Want to reach out anyway?</h3>
          <p>If you think there's a fit even without a posted role, get in touch through Contact and tell us why.</p>
          <a href="mailto:hello@teemly.app" className="btn btn-primary">
            Email hello@teemly.app
          </a>
        </div>
      </section>
      <FinalCTA />
    </>
  )
}
