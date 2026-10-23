// Opens the product tour popup from anywhere on the site. Layout.jsx listens
// for the event and mounts the popup, whose code loads on demand.
export const TOUR_EVENT = 'teemly:open-tour'

export function openTour() {
  window.dispatchEvent(new CustomEvent(TOUR_EVENT))
}

// Pointing at or touching a tour button starts loading the popup, so it is
// usually ready by the time the click lands.
export const loadTourModal = () => import('../sections/TourModal.jsx')
