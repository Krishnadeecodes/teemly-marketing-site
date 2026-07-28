import SectionHead from '../components/SectionHead.jsx'
import Icon from '../components/Icon.jsx'

const cards = [
  {
    icon: 'cpu',
    title: 'An agent Teemly owns, end to end',
    desc: 'No browser extension, no licensed third-party SDK. A sub-2MB installer for Windows and macOS captures activity natively, at the OS level.',
  },
  {
    icon: 'sparkle',
    title: 'Scoring that explains itself',
    desc: 'Every report closes in plain language, not just a chart — the kind of note a manager can act on in the next stand-up, not decode in a spreadsheet.',
  },
  {
    icon: 'shield',
    title: 'Privacy enforced in the product',
    desc: 'Blur, Privacy Mode and the Silent Tracking consent gate are real code paths, not policy pages — a prospect can see them before they are ever a customer.',
  },
]

export default function Capabilities() {
  return (
    <section className="section capabilities">
      <div className="container">
        <SectionHead center eyebrow="Under The Hood" title="Built on Teemly's own agent — not someone else's plugin" />
        <div className="cap-grid">
          {cards.map((c) => (
            <div className="cap-card" key={c.title}>
              <span className="cap-icon">
                <Icon name={c.icon} size={20} />
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
