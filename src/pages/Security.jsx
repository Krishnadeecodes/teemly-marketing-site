import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Icon from '../components/Icon.jsx'
import FinalCTA from '../sections/FinalCTA.jsx'
import '../sections/sections.css'
import './pages.css'

const cards = [
  {
    icon: 'lock',
    title: 'Authentication & Access',
    items: [
      <><strong>JWT</strong> with secure HTTP-only cookies</>,
      <>Sessions expire after <strong>8 hours</strong> of inactivity</>,
      <>Role-based access control on every API endpoint</>,
      <>Multi-tenant isolation — no cross-org data leakage is architecturally possible</>,
      <>Password policy: 8+ characters, uppercase, number, special character</>,
    ],
  },
  {
    icon: 'shield',
    title: 'Data Security',
    items: [
      <>All traffic over <strong>HTTPS (TLS 1.2+)</strong></>,
      <>Database <strong>encrypted at rest (AES-256)</strong></>,
      <>Screenshots stored in private, S3-compatible object storage — served only via signed, temporary URLs</>,
      <>When blur is on, the <strong>original unblurred image is never stored</strong></>,
      <>EXE agent events are HMAC-signed for integrity</>,
    ],
  },
  {
    icon: 'eyeOff',
    title: 'Privacy Controls',
    items: [
      <>Employees can activate Privacy Mode any time — <strong>no admin override</strong></>,
      <>Per-employee screenshot blur — content hidden, activity metadata still visible</>,
      <>Silent monitoring requires an explicit legal acknowledgement before it can be enabled</>,
      <>Teemly never collects keystrokes, email content, camera/mic access, or clipboard data</>,
      <>Employees are notified during EXE install — a visible system tray icon by default</>,
    ],
  },
  {
    icon: 'layers',
    title: 'Audit & Compliance Logging',
    items: [
      <>Every admin action logged with timestamp and IP — <strong>1-year retention</strong></>,
      <>Every screenshot view logged — who viewed, which employee, when</>,
      <>Before/after values captured for every settings change</>,
      <>EXE event log retained per plan (30 / 90 / 180 days)</>,
    ],
  },
]

const compliance = [
  { name: 'DPDP Act (India)', status: 'progress', label: 'In Progress · Q3 2026', detail: 'Data processing policies, consent flows and employee notification in place for India compliance.' },
  { name: 'GDPR Alignment', status: 'done', label: 'Architecture Compliant', detail: 'Data minimisation, right-to-erasure hooks, privacy-by-design — formal certification not yet pursued.' },
  { name: 'ISO 27001', status: 'roadmap', label: 'Phase 2 Roadmap', detail: 'Security management framework — targeting certification in Phase 2.' },
  { name: 'SOC 2 Type II', status: 'roadmap', label: 'Enterprise Tier Roadmap', detail: 'Available for Enterprise clients — audit process planned for Phase 2.' },
  { name: 'On-Premise Deployment', status: 'done', label: 'Supported (Enterprise)', detail: 'Full on-premise option for clients where data cannot leave premises.' },
]

export default function Security() {
  return (
    <>
      <PageHero
        eyebrow="Security & Compliance"
        title="Built to be trusted with sensitive workforce data"
        desc="Multi-tenant isolation, encryption in transit and at rest, and privacy controls that are enforced in the product — not just promised in a policy document."
      />

      <section className="section">
        <div className="container">
          <div className="sec-grid">
            {cards.map((c) => (
              <div className="sec-card" key={c.title}>
                <div className="sec-card-head">
                  <span className="sec-icon">
                    <Icon name={c.icon} size={20} />
                  </span>
                  <h3>{c.title}</h3>
                </div>
                <ul className="sec-list">
                  {c.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <SectionHead eyebrow="Compliance Status" title="Where Teemly stands today" center />
          <div className="compliance-table-wrap">
            <table className="compliance-table">
              <thead>
                <tr>
                  <th>Compliance</th>
                  <th>Status</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {compliance.map((c) => (
                  <tr key={c.name}>
                    <td><strong>{c.name}</strong></td>
                    <td>
                      <span className={`compliance-status ${c.status}`}>
                        {c.status === 'done' && <Icon name="check" size={14} />}
                        {c.label}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{c.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
