import Icon from '../components/Icon.jsx'

const facts = [
  { icon: 'cpu', big: '<2MB', label: 'Own agent — no browser extension, no third-party license' },
  { icon: 'layers', big: '6 modules', label: 'Dashboard, Teams, Screenshots, Attendance, Reports, Settings' },
  { icon: 'bolt', big: '1 day', label: "From install to your org's first productivity score" },
  { icon: 'eyeOff', big: '0', label: 'Keystrokes, emails or clipboard content ever captured' },
]

export default function QuickFacts() {
  return (
    <section className="quick-facts">
      <div className="container quick-facts-row">
        {facts.map((f) => (
          <div className="quick-fact" key={f.label}>
            <span className="quick-fact-icon">
              <Icon name={f.icon} size={17} />
            </span>
            <div>
              <strong>{f.big}</strong>
              <p>{f.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
