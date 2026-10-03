import Icon from '../components/Icon.jsx'
import Reveal from '../home/Reveal.jsx'
import '../home/quickFacts.css'

const facts = [
  { icon: 'cpu', big: '<2MB', label: 'Own agent — no browser extension, no third-party license' },
  { icon: 'layers', big: '8 modules', label: 'Dashboard, Teams, Screenshots, Video, Location, Attendance, Reports, Settings' },
  { icon: 'bolt', big: '1 day', label: "From install to your org's first productivity score" },
  { icon: 'eyeOff', big: '0', label: 'Keystrokes, emails or clipboard content ever captured' },
]

export default function QuickFacts() {
  return (
    <section className="h-quick-facts">
      <div className="h-wrap h-quick-facts-row">
        {facts.map((f, i) => (
          <Reveal as="div" className="h-quick-fact" delay={i * 0.08} y={20} key={f.label}>
            <span className="h-quick-fact-icon">
              <Icon name={f.icon} size={17} />
            </span>
            <div>
              <strong>{f.big}</strong>
              <p>{f.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
