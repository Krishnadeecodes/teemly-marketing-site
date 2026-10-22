// Rule-based Teemly Guide chatbot: plan and pricing questions are calculated
// (chatbotPlans.js); everything else is matched to a written answer by keyword.
import { intents, fallback } from '../data/chatbotKnowledge.js'
import { answerPlans, editDistance } from './chatbotPlans.js'

const byId = Object.fromEntries(intents.map((i) => [i.id, i]))

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9'+\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Pre-normalize keywords once.
const compiled = intents.map((intent) => ({
  intent,
  keywords: intent.keywords.map((k) => {
    const norm = normalize(k)
    return { norm, words: norm.split(' ').length }
  }),
}))

// A single word matches a token exactly, or as a prefix when it is 4+ chars
// ('pric' -> pricing), or with one typo when both are 5+ chars ('priveacy').
// A phrase matches when it appears in the text, with the last word also
// allowed to be a prefix ('screen record' -> screen recording).
function keywordScore({ norm, words }, tokens, padded) {
  if (words === 1) {
    if (tokens.some((t) => t === norm || (norm.length >= 4 && t.startsWith(norm)))) return 2
    if (norm.length >= 5 && tokens.some((t) => t.length >= 5 && Math.abs(t.length - norm.length) <= 1 && editDistance(t, norm) <= 1)) return 1
    return 0
  }
  return padded.includes(` ${norm}`) ? words * 3 : 0
}

export function getIntent(id) {
  return byId[id]
}

// Returns the best-matching intent for free text, or the fallback.
export function matchIntent(input) {
  const text = normalize(input)
  if (!text) return fallback
  const tokens = text.split(' ')
  const padded = ` ${text} `

  let best = null
  let bestScore = 0
  for (const { intent, keywords } of compiled) {
    const score = keywords.reduce((sum, k) => sum + keywordScore(k, tokens, padded), 0)
    if (score > bestScore) {
      best = intent
      bestScore = score
    }
  }
  return best || fallback
}

/**
 * Answers one message. `context` carries the last plan, team size and billing
 * between messages, so follow-ups like "what about yearly?" work; pass back
 * the returned context with the next message.
 */
export function respond(input, context = {}) {
  const planned = answerPlans(input, context)
  if (planned) return planned
  return { answer: matchIntent(input), context: { ...context, last: null } }
}
