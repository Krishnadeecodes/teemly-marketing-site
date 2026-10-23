import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'

// Every other page is its own chunk, so a visitor's first load only carries
// the shell and the page they landed on. Once the browser is idle the rest are
// fetched in the background, so moving between pages is still instant.
const loaders = []
function page(load) {
  loaders.push(load)
  // A dropped connection gets one retry. If that fails too, the site was
  // probably redeployed (old chunk names are gone), so reload once to pick up
  // the new build instead of leaving a blank page.
  return lazy(() =>
    load()
      .catch(() => new Promise((r) => setTimeout(r, 800)).then(load))
      .catch((err) => {
        let reloaded = false
        try {
          reloaded = sessionStorage.getItem('chunk-reload') === location.pathname
          sessionStorage.setItem('chunk-reload', location.pathname)
        } catch {}
        if (reloaded) throw err
        location.reload()
        return new Promise(() => {})
      }),
  )
}

const Product = page(() => import('./pages/Product.jsx'))
const ModulePage = page(() => import('./pages/ModulePage.jsx'))
const Pricing = page(() => import('./pages/Pricing.jsx'))
const About = page(() => import('./pages/About.jsx'))
const Contact = page(() => import('./pages/Contact.jsx'))
const NotFound = page(() => import('./pages/NotFound.jsx'))

// Platform
const PlatformHub = page(() => import('./pages/platform/PlatformHub.jsx'))
const PlatformPillarPage = page(() => import('./pages/platform/PlatformPillarPage.jsx'))

// Solutions
const SolutionsHub = page(() => import('./pages/solutions/SolutionsHub.jsx'))
const SolutionPage = page(() => import('./pages/solutions/SolutionPage.jsx'))

// Industries
const IndustriesHub = page(() => import('./pages/industries/IndustriesHub.jsx'))
const IndustryPage = page(() => import('./pages/industries/IndustryPage.jsx'))

// Why Teemly
const WhyTeemlyHub = page(() => import('./pages/why-teemly/WhyTeemlyHub.jsx'))
const WhyTeemlySubPage = page(() => import('./pages/why-teemly/WhyTeemlySubPage.jsx'))

// Conversion tools
const ROICalculator = page(() => import('./pages/ROICalculator.jsx'))
const TakeATour = page(() => import('./pages/TakeATour.jsx'))
const BookADemo = page(() => import('./pages/BookADemo.jsx'))

// Security & Trust
const SecurityHub = page(() => import('./pages/security/SecurityHub.jsx'))
const SecuritySubPage = page(() => import('./pages/security/SecuritySubPage.jsx'))
const TrustCenter = page(() => import('./pages/TrustCenter.jsx'))

// Resources
const ResourcesHub = page(() => import('./pages/resources/ResourcesHub.jsx'))
const ResourceTypePage = page(() => import('./pages/resources/ResourceTypePage.jsx'))
const ResourceDetailPage = page(() => import('./pages/resources/ResourceDetailPage.jsx'))

// Company
const Careers = page(() => import('./pages/company/Careers.jsx'))
const Partners = page(() => import('./pages/company/Partners.jsx'))
const News = page(() => import('./pages/company/News.jsx'))
const Support = page(() => import('./pages/Support.jsx'))
const Customers = page(() => import('./pages/Customers.jsx'))

// Legal
const LegalPage = page(() => import('./pages/legal/LegalPage.jsx'))

// Admin panel: loaded only when someone visits /admin
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

function usePrefetchPages() {
  useEffect(() => {
    // Respect data-saver: those visitors load each page when they open it.
    if (navigator.connection?.saveData) return undefined
    let idle = 0
    const run = () => {
      // the page loaded, so a later chunk failure may reload again
      try {
        sessionStorage.removeItem('chunk-reload')
      } catch {}
      const fetchAll = () => loaders.forEach((load) => load().catch(() => {}))
      idle = window.requestIdleCallback ? requestIdleCallback(fetchAll, { timeout: 4000 }) : setTimeout(fetchAll, 1500)
    }
    if (document.readyState === 'complete') run()
    else window.addEventListener('load', run, { once: true })
    return () => {
      window.removeEventListener('load', run)
      if (window.cancelIdleCallback) cancelIdleCallback(idle)
      clearTimeout(idle)
    }
  }, [])
}

export default function App() {
  usePrefetchPages()
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={null}>
            <AdminApp />
          </Suspense>
        }
      />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route path="/platform" element={<PlatformHub />} />
        <Route path="/platform/:slug" element={<PlatformPillarPage />} />

        <Route path="/solutions" element={<SolutionsHub />} />
        <Route path="/solutions/:slug" element={<SolutionPage />} />

        <Route path="/industries" element={<IndustriesHub />} />
        <Route path="/industries/:slug" element={<IndustryPage />} />

        <Route path="/why-teemly" element={<WhyTeemlyHub />} />
        <Route path="/why-teemly/:slug" element={<WhyTeemlySubPage />} />

        <Route path="/roi-calculator" element={<ROICalculator />} />
        <Route path="/take-a-tour" element={<TakeATour />} />
        <Route path="/book-a-demo" element={<BookADemo />} />

        <Route path="/product" element={<Product />} />
        <Route path="/product/:slug" element={<ModulePage />} />

        <Route path="/pricing" element={<Pricing />} />

        <Route path="/security" element={<SecurityHub />} />
        <Route path="/security/:slug" element={<SecuritySubPage />} />
        <Route path="/trust-center" element={<TrustCenter />} />

        <Route path="/resources" element={<ResourcesHub />} />
        <Route path="/resources/:slug" element={<ResourceTypePage />} />
        <Route path="/resources/:slug/:item" element={<ResourceDetailPage />} />

        <Route path="/customers" element={<Customers />} />

        <Route path="/company/about" element={<About />} />
        <Route path="/company/contact" element={<Contact />} />
        <Route path="/company/careers" element={<Careers />} />
        <Route path="/company/partners" element={<Partners />} />
        <Route path="/company/news" element={<News />} />
        <Route path="/about" element={<Navigate to="/company/about" replace />} />
        <Route path="/contact" element={<Navigate to="/company/contact" replace />} />

        <Route path="/support" element={<Support />} />

        <Route path="/legal/:slug" element={<LegalPage />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
