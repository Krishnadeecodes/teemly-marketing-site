import { useEffect, useState } from 'react'
import { postForm } from './submitForm.js'

// ---- Sign-in that unlocks the tour (form in sections/TourGate.jsx) ----
// Remembered in this browser for a year, so returning visitors go straight in.
const UNLOCK_KEY = 'teemly_tour_unlocked'
const UNLOCK_EVENT = 'teemly:tour-unlocked'
const UNLOCK_DAYS = 365

export function isTourUnlocked() {
  try {
    const saved = JSON.parse(localStorage.getItem(UNLOCK_KEY) || 'null')
    return !!saved && Date.now() - saved.at < UNLOCK_DAYS * 86400000
  } catch {
    return false
  }
}

function markTourUnlocked() {
  try {
    localStorage.setItem(UNLOCK_KEY, JSON.stringify({ at: Date.now() }))
  } catch {
    // Storage blocked: the tour stays open for this visit only.
  }
  window.dispatchEvent(new CustomEvent(UNLOCK_EVENT))
}

// Submit handler for useLeadForm('tour', …): records the sign-in, then unlocks.
export async function unlockTour(_type, payload) {
  const data = await postForm('/api/tour/unlock', payload)
  markTourUnlocked()
  return data
}

/** Whether the tour is unlocked; updates everywhere once any sign-in form succeeds. */
export function useTourUnlocked() {
  const [unlocked, setUnlocked] = useState(isTourUnlocked)
  useEffect(() => {
    const on = () => setUnlocked(true)
    window.addEventListener(UNLOCK_EVENT, on)
    return () => window.removeEventListener(UNLOCK_EVENT, on)
  }, [])
  return unlocked
}
