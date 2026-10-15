import { useParams, Navigate } from 'react-router-dom'
import FinalCTA from '../../sections/FinalCTA.jsx'
import { DETAIL_TEMPLATES, DefaultDetail } from './templates/details.jsx'
import { PageSkeleton, useResourceMotion } from './templates/shared.jsx'
import { useResourceItem } from '../../lib/resourcesApi.js'
import { useSEO } from '../../lib/useSEO.js'
import '../pages.css'
import './resources.css'
import './templates/templates.css'

// Each category renders with the page template chosen for it (templates/details.jsx).
export default function ResourceDetailPage() {
  const { slug, item: itemSlug } = useParams()
  const { data, loading } = useResourceItem(slug, itemSlug)
  const item = data?.item
  useResourceMotion(item ? `${item.id}:${item.updatedAt || ''}` : null)

  useSEO({
    title: item ? `${item.title} — ${data.category.label}` : 'Resources',
    description: item?.summary,
    path: `/resources/${slug}/${itemSlug}`,
  })

  if (loading) return <PageSkeleton variant="detail" />
  if (!item) return <Navigate to={`/resources/${slug}`} replace />

  const Detail = DETAIL_TEMPLATES[data.category.template || data.category.slug] || DefaultDetail
  return (
    <>
      <Detail key={item.id} item={item} category={data.category} related={data.related} />
      <FinalCTA />
    </>
  )
}
