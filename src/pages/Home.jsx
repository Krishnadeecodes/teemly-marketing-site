import Hero from '../sections/Hero.jsx'
import QuickFacts from '../sections/QuickFacts.jsx'
import ProductExplorer from '../sections/ProductExplorer.jsx'
import Capabilities from '../sections/Capabilities.jsx'
import Trust from '../sections/Trust.jsx'
import Segment from '../sections/Segment.jsx'
import PricingTeaser from '../sections/PricingTeaser.jsx'
import FinalCTA from '../sections/FinalCTA.jsx'
import '../sections/sections.css'

export default function Home() {
  return (
    <>
      <Hero />
      <QuickFacts />
      <ProductExplorer />
      <Capabilities />
      <Trust />
      <Segment />
      <PricingTeaser />
      <FinalCTA />
    </>
  )
}
