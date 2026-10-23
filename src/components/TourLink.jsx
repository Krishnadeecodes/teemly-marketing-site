import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { loadTourModal, openTour } from '../lib/tour.js'

/**
 * A "Take a Tour" button. A plain click opens the tour popup in place; it is
 * still a real link to /take-a-tour, so opening it in a new tab, or a visitor
 * without JavaScript, gets the tour page instead.
 */
const TourLink = forwardRef(function TourLink({ onClick, children, ...rest }, ref) {
  const handleClick = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    openTour()
  }
  const warm = () => loadTourModal().catch(() => {})
  return (
    <Link
      to="/take-a-tour"
      ref={ref}
      onClick={handleClick}
      onPointerEnter={warm}
      onTouchStart={warm}
      onFocus={warm}
      aria-haspopup="dialog"
      {...rest}
    >
      {children}
    </Link>
  )
})

export default TourLink
