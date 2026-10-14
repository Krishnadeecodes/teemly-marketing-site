// Keyword matcher for the rule-based Teemly Guide chatbot.
import { intents, fallback } from '../data/chatbotKnowledge.js'

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
// ('pric' -> pricing). A phrase matches when it appears in the text, with the
// last word also allowed to be a prefix ('screen record' -> screen recording).
function keywordScore({ norm, words }, tokens, padded) {
  if (words === 1) {
    const hit = tokens.some((t) => t === norm || (norm.length >= 4 && t.startsWith(norm)))
    return hit ? 2 : 0
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
