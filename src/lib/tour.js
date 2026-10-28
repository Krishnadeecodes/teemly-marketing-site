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
  const data = await postForm('/api/tour/unlock', { ...payload, consent: true })
  markTourUnlocked()
  return data
}

// The chat assistant asks only for a name and email, so its sign-in opens the
// chat but not the tour; the tour's fuller sign-in opens both.
const CHAT_KEY = 'teemly_chat_signed_in'
const CHAT_EVENT = 'teemly:chat-signed-in'

function isChatSignedIn() {
  if (isTourUnlocked()) return true
  try {
    return !!localStorage.getItem(CHAT_KEY)
  } catch {
    return false
  }
}

// Submit handler for useLeadForm('chat', …): records the sign-in with the
// question asked, then opens the chat.
export function signInChat(question) {
  return async (_type, payload) => {
    const data = await postForm('/api/tour/unlock', { ...payload, form: 'chat', source: 'chatbot', question, consent: true })
    try {
      localStorage.setItem(CHAT_KEY, JSON.stringify({ at: Date.now() }))
    } catch {
      // Storage blocked: the chat stays open for this visit only.
    }
    window.dispatchEvent(new CustomEvent(CHAT_EVENT))
    return data
  }
}

/** Whether the chat assistant may answer: after a chat or a tour sign-in. */
export function useChatSignedIn() {
  const [signedIn, setSignedIn] = useState(isChatSignedIn)
  useEffect(() => {
    const on = () => setSignedIn(true)
    window.addEventListener(CHAT_EVENT, on)
    window.addEventListener(UNLOCK_EVENT, on)
    return () => {
      window.removeEventListener(CHAT_EVENT, on)
      window.removeEventListener(UNLOCK_EVENT, on)
    }
  }, [])
  return signedIn
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
