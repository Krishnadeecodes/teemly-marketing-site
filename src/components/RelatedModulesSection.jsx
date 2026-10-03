import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import SectionHead from './SectionHead.jsx'
import ModulePreview from './ModulePreview.jsx'

export default function RelatedModulesSection({
  modules,
  reports = [],
  eyebrow = 'See It In The Product',
  title = 'Where this lives today',
}) {
  if (modules.length === 0 && reports.length === 0) return null

  const [primary, ...rest] = modules

  return (
    <section className="section-tight">
      <div className="container">
        <SectionHead eyebrow={eyebrow} title={title} />
        <div className={`related-showcase${!primary ? ' no-primary' : ''}`}>
          {primary && (
            <Link to={`/product/${primary.slug}`} className="related-preview-card">
              <ModulePreview Comp={primary.Comp} scale={0.5} height={260} />
              <div className="related-preview-cap">
                <span className="tile-icon" style={{ marginBottom: 0 }}>
                  <Icon name={primary.icon} size={16} />
                </span>
                <span>
                  <strong>{primary.navLabel}</strong>
                  <span className="related-sub">Product module — see it in action</span>
                </span>
                <Icon name="arrowRight" size={15} />
              </div>
            </Link>
          )}

          <div className="related-list">
            {rest.map((m) => (
              <Link to={`/product/${m.slug}`} className="related-card" key={m.slug}>
                <span className="tile-icon" style={{ marginBottom: 0 }}>
                  <Icon name={m.icon} size={18} />
                </span>
                <span>
                  <strong>{m.navLabel}</strong>
                  <span className="related-sub">Product module</span>
                </span>
                <Icon name="arrowRight" size={15} />
              </Link>
            ))}
            {reports.map((r) => (
              <div className="related-card static" key={r}>
                <span className="tile-icon" style={{ marginBottom: 0 }}>
                  <Icon name="layers" size={18} />
                </span>
                <span>
                  <strong>{r}</strong>
                  <span className="related-sub">Intelligence report</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
