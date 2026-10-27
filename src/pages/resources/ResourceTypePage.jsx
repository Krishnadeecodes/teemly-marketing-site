import { useParams, Navigate } from 'react-router-dom'
import FinalCTA from '../../sections/FinalCTA.jsx'
import { LIST_TEMPLATES, DefaultList, GlossaryList } from './templates/lists.jsx'
import { PageSkeleton, useFitCardText, useResourceMotion } from './templates/shared.jsx'
import { useResourceType } from '../../lib/resourcesApi.js'
import { useSEO } from '../../lib/useSEO.js'
import '../pages.css'
import './resources.css'
import './templates/templates.css'

// Each category has its own list layout (templates/lists.jsx); categories
// added in the admin use the template chosen there (see server/resources.js).
export default function ResourceTypePage() {
  const { slug } = useParams()
  const { data, loading } = useResourceType(slug)
  const type = data?.category
  useResourceMotion(data ? `${slug}:${data.items?.length ?? data.terms?.length}` : null)
  useFitCardText()

  useSEO({
    title: type ? `${type.label} — Resources` : 'Resources',
    description: type?.description,
    path: `/resources/${slug}`,
  })

  if (loading) return <PageSkeleton />
  if (!type) return <Navigate to="/resources" replace />

  const List = LIST_TEMPLATES[type.template || type.slug] || DefaultList
  return (
    <>
      {data.terms ? <GlossaryList category={type} terms={data.terms} /> : <List category={type} items={data.items} />}
      <FinalCTA />
    </>
  )
}
