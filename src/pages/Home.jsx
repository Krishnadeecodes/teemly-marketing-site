import { useSEO } from '../lib/useSEO.js'
import { useHomeScroll } from '../home/useHomeScroll.js'
import ScrollProgress from '../home/ScrollProgress.jsx'
import Hero from '../sections/Hero.jsx'
import Marquee from '../sections/Marquee.jsx'
import QuickFacts from '../sections/QuickFacts.jsx'
import Problem from '../sections/Problem.jsx'
import TeemlyModel from '../sections/TeemlyModel.jsx'
import PlatformTeaser from '../sections/PlatformTeaser.jsx'
import SolutionsTeaser from '../sections/SolutionsTeaser.jsx'
import TeemlyAISection from '../sections/TeemlyAISection.jsx'
import BusinessOutcomes from '../sections/BusinessOutcomes.jsx'
import ROITeaser from '../sections/ROITeaser.jsx'
import ProductExplorer from '../sections/ProductExplorer.jsx'
import Segment from '../sections/Segment.jsx'
import IntegrationsTeaser from '../sections/IntegrationsTeaser.jsx'
import Trust from '../sections/Trust.jsx'
import Proof from '../sections/Proof.jsx'
import PricingTeaser from '../sections/PricingTeaser.jsx'
import ResourcesTeaser from '../sections/ResourcesTeaser.jsx'
import FinalCTA from '../sections/FinalCTA.jsx'
import '../home/homeTheme.css'
import '../sections/sections.css'

export default function Home() {
  useSEO({
    description:
      "Teemly connects how your people, work and technology actually behave into one real-time record, captured by Teemly's own agent, then turned into reports your leaders can act on.",
    path: '/',
  })
  useHomeScroll()

  return (
    <div className="home-v2">
      <ScrollProgress />
      <Hero />
      <Marquee />
      <QuickFacts />
      <Problem />
      <TeemlyModel />
      <PlatformTeaser />
      <SolutionsTeaser />
      <TeemlyAISection />
      <BusinessOutcomes />
      <ROITeaser />
      <ProductExplorer />
      <Segment />
      <IntegrationsTeaser />
      <Trust />
      <Proof />
      <PricingTeaser />
      <ResourcesTeaser />
      <FinalCTA />
    </div>
  )
}
