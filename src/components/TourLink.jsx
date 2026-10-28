import { forwardRef } from 'react'
import { Link } from 'react-router-dom'

/** A "Take a Tour" button: goes to the tour page (/take-a-tour). */
const TourLink = forwardRef(function TourLink({ children, ...rest }, ref) {
  return (
    <Link to="/take-a-tour" ref={ref} {...rest}>
      {children}
    </Link>
  )
})

export default TourLink
