import Icon from '../components/Icon.jsx'
import SplitHeading from '../home/SplitHeading.jsx'
import Reveal from '../home/Reveal.jsx'
import '../home/segment.css'

const cards = [
  { icon: 'download', title: 'Nothing for IT to configure', desc: 'One installer, under 2MB, for Windows and macOS. Your team is reporting data within minutes of the invite.' },
  { icon: 'bolt', title: 'A day to get live', desc: 'Invite people, assign teams, set your work-hour defaults — Teemly is producing its first scores the same day.' },
  { icon: 'target', title: 'Pricing that grows with headcount', desc: 'Per-seat plans from fifty employees to unlimited, so you pay for the visibility you actually need.' },
]

export default function Segment() {
  return (
    <section className="h-segment">
      <div className="h-wrap">
        <div className="h-sec-head center">
          <span className="h-kicker">Who It's Built For</span>
          <SplitHeading as="h2" text="Enterprise-grade visibility, without an enterprise rollout" />
          <p>No IT project and no months-long onboarding — teams are live with their first scores the same day they install.</p>
        </div>
        <div className="h-pr-grid">
          {cards.map((c, i) => (
            <Reveal as="div" className="h-pr" delay={i * 0.08} key={c.title}>
              <span className="h-pr-ic">
                <Icon name={c.icon} size={20} />
              </span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
