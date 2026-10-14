import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'
import ModulePage from './pages/ModulePage.jsx'
import Pricing from './pages/Pricing.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

// Platform
import PlatformHub from './pages/platform/PlatformHub.jsx'
import PlatformPillarPage from './pages/platform/PlatformPillarPage.jsx'

// Solutions
import SolutionsHub from './pages/solutions/SolutionsHub.jsx'
import SolutionPage from './pages/solutions/SolutionPage.jsx'

// Industries
import IndustriesHub from './pages/industries/IndustriesHub.jsx'
import IndustryPage from './pages/industries/IndustryPage.jsx'

// Why Teemly
import WhyTeemlyHub from './pages/why-teemly/WhyTeemlyHub.jsx'
import WhyTeemlySubPage from './pages/why-teemly/WhyTeemlySubPage.jsx'

// Conversion tools
import ROICalculator from './pages/ROICalculator.jsx'
import TakeATour from './pages/TakeATour.jsx'
import BookADemo from './pages/BookADemo.jsx'

// Security & Trust
import SecurityHub from './pages/security/SecurityHub.jsx'
import SecuritySubPage from './pages/security/SecuritySubPage.jsx'
import TrustCenter from './pages/TrustCenter.jsx'

// Resources
import ResourcesHub from './pages/resources/ResourcesHub.jsx'
import ResourceTypePage from './pages/resources/ResourceTypePage.jsx'
import ResourceDetailPage from './pages/resources/ResourceDetailPage.jsx'

// Company
import Careers from './pages/company/Careers.jsx'
import Partners from './pages/company/Partners.jsx'
import News from './pages/company/News.jsx'
import Support from './pages/Support.jsx'
import Customers from './pages/Customers.jsx'

// Legal
import LegalPage from './pages/legal/LegalPage.jsx'

// Admin panel: loaded only when someone visits /admin
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

export default function App() {
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
