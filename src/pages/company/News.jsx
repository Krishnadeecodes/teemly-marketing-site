import PageHero from '../../components/PageHero.jsx'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import '../pages.css'

export default function News() {
  return (
    <>
      <PageHero
        eyebrow="News"
        title="Nothing published here yet"
        desc="Announcements and press updates will appear here as they happen — this page isn't being filled with placeholder content in the meantime."
      />
      <section className="section-tight">
        <div className="container resource-empty">
          <span className="tile-icon resource-empty-icon">
            <Icon name="fileText" size={28} />
          </span>
          <h3>Media inquiry?</h3>
          <p>Reach out directly and we'll get back to you.</p>
          <a href="mailto:hello@teemly.app" className="btn btn-primary">
            Email hello@teemly.app
          </a>
        </div>
      </section>
      <FinalCTA />
    </>
  )
}
