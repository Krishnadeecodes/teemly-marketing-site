import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import Reveal from '../home/Reveal.jsx'
import TourLink from '../components/TourLink.jsx'
import '../home/finalCta.css'

export default function FinalCTA() {
  return (
    <div className="home-v2">
      <section className="h-final">
        <div className="h-wrap">
          <div className="h-final-card">
            <div className="h-aurora" aria-hidden="true">
              <i className="a1" />
              <i className="a2" />
              <i className="a3" />
            </div>
            <div className="h-final-inner">
              <SplitHeading as="h2" text="Ready to see how your organization really works?" />
              <Reveal as="div">
                <p>Book a demo, take a self-guided tour, or start free and get your first Org Productivity Score today.</p>
                <div className="h-final-ctas">
                  <Link to="/book-a-demo" className="h-btn h-btn-primary">
                    Book a Demo
                    <span className="h-arr" aria-hidden="true">
                      <Icon name="arrowRight" size={14} />
                    </span>
                  </Link>
                  <TourLink className="h-btn h-btn-ghost">Take a Tour</TourLink>
                </div>
                <p className="h-final-note">
                  No credit card required · Live in a day ·{' '}
                  <Link to="/pricing" className="h-textlink">
                    See pricing
                  </Link>
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
