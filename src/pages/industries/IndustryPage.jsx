import { useParams, Navigate } from 'react-router-dom'
import PageHero from '../../components/PageHero.jsx'
import Icon from '../../components/Icon.jsx'
import RelatedModulesSection from '../../components/RelatedModulesSection.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import { industries, getIndustry } from '../../data/industries.js'
import { getModule } from '../../data/moduleContent.js'
import { useSEO } from '../../lib/useSEO.js'
import '../../sections/sections.css'
import '../pages.css'

export default function IndustryPage() {
  const { slug } = useParams()
  const industry = getIndustry(slug)

  useSEO({
    title: industry ? `Teemly for ${industry.label} — Industries` : 'Industries',
    description: industry?.context,
    path: `/industries/${slug}`,
  })

  if (!industry) return <Navigate to="/industries" replace />

  const modules = industry.relevantModules.map(getModule).filter(Boolean)

  return (
    <>
      <PageHero
        eyebrow={`Industries — ${industry.label}`}
        title={`Teemly for ${industry.label}`}
        desc={industry.context}
      />

      <section className="section-tight">
        <div className="container">
          <div className="module-plan-note">
            <Icon name="layers" size={17} />
            <p>
              Teemly is one workforce-intelligence product, not a separate build per industry. Below is what
              tends to matter most for {industry.label.toLowerCase()} teams specifically — everything else in
              the platform is available too.
            </p>
          </div>
        </div>
      </section>

      <RelatedModulesSection
        modules={modules}
        reports={industry.relevantReports}
        eyebrow="Most Relevant"
        title="Where to start"
      />

      <FinalCTA />
    </>
  )
}
