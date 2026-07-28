import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Icon from '../components/Icon.jsx'
import FinalCTA from '../sections/FinalCTA.jsx'
import '../sections/sections.css'
import './pages.css'

const values = [
  {
    icon: 'cpu',
    title: 'Own the whole stack',
    desc: 'Teemly ships its own EXE agent, its own storage, its own scoring — no third-party dependency sits between your data and your dashboard.',
  },
  {
    icon: 'eyeOff',
    title: 'Monitoring, not surveillance',
    desc: 'Privacy Mode, screenshot blur and a legal-consent gate for Silent Tracking are real, shipping features — not settings we hope you never notice.',
  },
  {
    icon: 'target',
    title: 'Built for how you actually work',
    desc: 'Per-seat pricing, a sub-2MB agent and a one-day setup — enterprise-grade visibility without enterprise-grade rollout.',
  },
]

const team = [
  { name: 'Deepan', role: 'CEO', color: '#0aa1e8' },
  { name: 'Krishna', role: 'Product Manager', color: '#f52998' },
  { name: 'Prinisha', role: 'Head of Delivery', color: '#6a2cc7' },
]

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Teemly"
        title="Workforce intelligence, built by Deecodes"
        desc="We're a small product team building the visibility layer we felt was missing between spreadsheet timesheets and heavy-handed employee surveillance."
      />

      <section className="section">
        <div className="container about-story">
          <div>
            <span className="eyebrow">
              <span className="dot" />
              Our Story
            </span>
            <h2 style={{ marginTop: 14, fontSize: 'var(--fs-3xl)' }}>
              Most teams don't lack effort. They lack visibility.
            </h2>
            <p>
              Attendance sheets get filled in after the fact. Productivity gets discussed once a quarter, in a
              review meeting, using data nobody trusts. Teemly exists to close that gap — a real-time, ownable
              record of how work actually happens, without turning the workplace into a surveillance system.
            </p>
            <p>
              We built our own lightweight desktop agent rather than license someone else's, because workforce
              data is too sensitive to route through a third party. Everything from capture to storage to
              scoring is Teemly's own — end to end.
            </p>
          </div>
          <div className="pv-ring" style={{ margin: '0 auto' }}>
            <div className="pv-core" style={{ background: 'var(--grad-mark)' }}>
              <Icon name="sparkle" size={26} />
              <span>Deecodes</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--surface-soft)' }}>
        <div className="container">
          <SectionHead center eyebrow="What We Believe" title="Principles the product is built around" />
          <div className="about-values">
            {values.map((v) => (
              <div className="value-card" key={v.title}>
                <span className="segment-icon" style={{ margin: 0 }}>
                  <Icon name={v.icon} size={20} />
                </span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="Founding Team" title="Small team, shipping fast" />
          <div className="team-row">
            {team.map((m) => (
              <div className="team-member" key={m.name}>
                <span className="team-avatar" style={{ background: m.color }}>
                  {m.name[0]}
                </span>
                <h4>{m.name}</h4>
                <span>{m.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
