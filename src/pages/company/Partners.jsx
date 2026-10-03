import PageHero from '../../components/PageHero.jsx'
import Icon from '../../components/Icon.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import '../pages.css'

export default function Partners() {
  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="No named partner program yet"
        desc="We don't publish a partner directory until there are verified partners to list. If you're interested in partnering with Teemly, we'd rather talk directly."
      />
      <section className="section-tight">
        <div className="container resource-empty">
          <span className="tile-icon resource-empty-icon">
            <Icon name="puzzle" size={28} />
          </span>
          <h3>Interested in partnering?</h3>
          <p>Tell us what you have in mind and who you are — resellers, implementation partners and integration partners are all worth a conversation.</p>
          <a href="mailto:hello@teemly.app" className="btn btn-primary">
            Email hello@teemly.app
          </a>
        </div>
      </section>
      <FinalCTA />
    </>
  )
}
