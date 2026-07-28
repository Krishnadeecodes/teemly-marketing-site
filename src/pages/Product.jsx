import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'
import ProductTour from '../sections/ProductTour.jsx'
import Trust from '../sections/Trust.jsx'
import FinalCTA from '../sections/FinalCTA.jsx'
import '../sections/sections.css'
import './pages.css'

const modules = [
  { id: 'dashboard', label: 'Dashboard', icon: 'chart' },
  { id: 'teams', label: 'Teams', icon: 'users' },
  { id: 'screenshots', label: 'Screenshots', icon: 'camera' },
  { id: 'attendance', label: 'Attendance', icon: 'clock' },
  { id: 'reports', label: 'Reports', icon: 'layers' },
  { id: 'settings', label: 'Settings', icon: 'gear' },
]

export default function Product() {
  return (
    <>
      <PageHero
        eyebrow="Product"
        title="Everything Teemly captures, in one place"
        desc="Six modules, one underlying record. Jump to any of them below, or scroll through the full walkthrough."
      />

      <section className="section-tight">
        <div className="container">
          <div className="module-nav-strip">
            {modules.map((m) => (
              <a href={`#${m.id}`} key={m.id}>
                <Icon name={m.icon} size={16} />
                {m.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <ProductTour />
      <Trust />
      <FinalCTA />
    </>
  )
}
