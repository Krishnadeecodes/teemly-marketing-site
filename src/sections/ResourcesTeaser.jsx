import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import Reveal from '../home/Reveal.jsx'
import '../home/resources.css'

export default function ResourcesTeaser() {
  return (
    <section className="h-resources">
      <div className="h-wrap">
        <div className="h-sec-head center">
          <span className="h-kicker">Resources</span>
          <SplitHeading as="h2" text="Start with the glossary, the rest is on the way" />
          <p>
            The Resource Center is live today with an Organizational Intelligence glossary. Research, guides and
            case studies are being published as they're ready — nothing placeholder gets dressed up as finished
            content.
          </p>
        </div>

        <Reveal as="div" className="h-res-card">
          <span className="h-res-ic">
            <Icon name="book" size={22} />
          </span>
          <div>
            <h3>Organizational Intelligence Glossary</h3>
            <p>Teemly's core terms, defined in plain language — available now.</p>
          </div>
        </Reveal>

        <Reveal as="div" className="h-resources-foot" delay={0.1}>
          <Link to="/resources/glossary" className="h-btn h-btn-ghost">
            Read the Glossary
          </Link>
          <Link to="/resources" className="h-btn h-btn-primary">
            Visit the Resource Center
            <span className="h-arr" aria-hidden="true">
              <Icon name="arrowRight" size={14} />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
