import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import Reveal from '../home/Reveal.jsx'
import { useResourcesHub } from '../lib/resourcesApi.js'
import { DEFAULT_SETTINGS } from '../data/resourcesMeta.js'
import '../home/resources.css'

export default function ResourcesTeaser() {
  // Copy is editable in the admin panel (Page text); defaults render until it loads.
  const { data } = useResourcesHub()
  const t = data?.settings.teaser || DEFAULT_SETTINGS.teaser

  return (
    <section className="h-resources">
      <div className="h-wrap">
        <div className="h-sec-head center">
          <span className="h-kicker">{t.kicker}</span>
          <SplitHeading key={t.title} as="h2" text={t.title} />
          <p>{t.desc}</p>
        </div>

        <Reveal as="div" className="h-res-card">
          <span className="h-res-ic">
            <Icon name="book" size={22} />
          </span>
          <div>
            <h3>{t.cardTitle}</h3>
            <p>{t.cardDesc}</p>
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
