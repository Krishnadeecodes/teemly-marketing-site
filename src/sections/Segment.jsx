import SectionHead from '../components/SectionHead.jsx'
import Icon from '../components/Icon.jsx'

const cards = [
  { icon: 'download', title: 'Nothing for IT to configure', desc: 'One installer, under 2MB, for Windows and macOS. Your team is reporting data within minutes of the invite.' },
  { icon: 'bolt', title: 'A day to get live', desc: 'Invite people, assign teams, set your work-hour defaults — Teemly is producing its first scores the same day.' },
  { icon: 'target', title: 'Pricing that grows with headcount', desc: 'Per-seat plans from fifty employees to unlimited, so you pay for the visibility you actually need.' },
]

export default function Segment() {
  return (
    <section className="section segment">
      <div className="container">
        <SectionHead center eyebrow="Who It's Built For" title="Enterprise-grade visibility, without an enterprise rollout" />
        <div className="segment-grid">
          {cards.map((c) => (
            <div className="segment-card" key={c.title}>
              <span className="segment-icon">
                <Icon name={c.icon} size={22} />
              </span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
