import { useParams, Navigate } from 'react-router-dom'
import PageHero from '../../components/PageHero.jsx'
import SectionHead from '../../components/SectionHead.jsx'
import Icon from '../../components/Icon.jsx'
import Accordion from '../../components/Accordion.jsx'
import RelatedModulesSection from '../../components/RelatedModulesSection.jsx'
import FinalCTA from '../../sections/FinalCTA.jsx'
import { solutions, getSolution, commonFaqs } from '../../data/solutions.js'
import { getModule } from '../../data/moduleContent.js'
import { useSEO } from '../../lib/useSEO.js'
import '../../sections/sections.css'
import '../pages.css'

export default function SolutionPage() {
  const { slug } = useParams()
  const solution = getSolution(slug)

  useSEO({
    title: solution ? `${solution.navLabel} — Solutions` : 'Solutions',
    description: solution?.problem,
    path: `/solutions/${slug}`,
  })

  if (!solution) return <Navigate to="/solutions" replace />

  const modules = solution.relevantModules.map(getModule).filter(Boolean)

  return (
    <>
      <PageHero eyebrow={solution.navLabel} title={solution.title} desc={solution.problem} />

      <section className="section-tight">
        <div className="container">
          <div className="module-highlight-grid">
            <div className="module-highlight-card">
              <h3>Why existing approaches fall short</h3>
              <p>{solution.whyInsufficient}</p>
            </div>
            <div className="module-highlight-card">
              <h3>How Teemly helps</h3>
              <p>{solution.howTeemlyHelps}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--surface-soft)' }}>
        <div className="container">
          <SectionHead eyebrow="Key Capabilities" title="What this actually looks like" />
          <ul className="sec-list pillar-fact-list">
            {solution.capabilities.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      <RelatedModulesSection modules={modules} reports={solution.relevantReports} />

      <section className="section-tight">
        <div className="container">
          <div className="outcome-banner">
            <span className="tile-icon">
              <Icon name="trendingUp" size={20} />
            </span>
            <div>
              <h4>Business outcome</h4>
              <p>{solution.outcome}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container faq-container">
          <SectionHead eyebrow="FAQ" title="Questions, answered" />
          <Accordion items={commonFaqs} />
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
