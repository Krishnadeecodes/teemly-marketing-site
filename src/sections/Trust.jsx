import Icon from '../components/Icon.jsx'
import SectionHead from '../components/SectionHead.jsx'

const cards = [
  {
    icon: 'eyeOff',
    title: 'Privacy Mode has no override',
    desc: 'Any employee can pause tracking instantly. Admins see that it happened — never a way to switch it back on for them.',
  },
  {
    icon: 'shield',
    title: 'Silent Tracking behind a legal gate',
    desc: 'Invisible monitoring stays locked until an admin explicitly accepts responsibility for local consent law — enforced in the UI and the API, not just written down.',
  },
  {
    icon: 'lock',
    title: 'Access scoped by design',
    desc: 'Managers see their assigned teams; admins see the org. Every API call is organisation-scoped — there is no query path into another company\'s data.',
  },
]

export default function Trust() {
  return (
    <section className="trust-band">
      <div className="container">
        <SectionHead
          center
          dark
          eyebrow="Responsible By Design"
          title="Visibility your team can actually trust"
          desc="These are not policy promises — they are the same code path every one of your employees runs."
        />

        <div className="trust-grid">
          {cards.map((c) => (
            <div className="trust-card" key={c.title}>
              <span className="trust-icon">
                <Icon name={c.icon} size={22} />
              </span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="trust-strip">
          <span><Icon name="check" size={16} /> No keystroke logging</span>
          <span><Icon name="check" size={16} /> No email or clipboard content</span>
          <span><Icon name="check" size={16} /> No camera / microphone access</span>
          <span><Icon name="check" size={16} /> DPDP &amp; GDPR-aligned architecture</span>
        </div>
      </div>
    </section>
  )
}
