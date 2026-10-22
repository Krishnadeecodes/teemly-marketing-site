// Plan and pricing answers for the Teemly Guide chatbot, calculated from
// plans.js so they always match the Pricing page: monthly = price x seats,
// yearly = round(price x 0.85) x seats per month (PricingCard.jsx).
//
// answerPlans(text, context) reads a question for plan names, a seat count,
// a budget, monthly / yearly billing, rupees / dollars and features, and
// returns { answer, context } — or null when the question isn't about plans,
// so the keyword answers in chatbotKnowledge.js take over.
import { plans } from '../data/plans.js'

const YEARLY_FACTOR = 0.85
const PLAN_KEYS = ['starter', 'professional', 'premium', 'enterprise']
const ENTERPRISE = plans.length - 1

/* ---------------- features: name, words that mention it, first plan with it ---------------- */
const FEATURES = [
  { name: 'video recording', min: 1, words: ['video', 'screen record', 'recording'] },
  { name: 'location tracking', min: 1, words: ['location', 'gps', 'geolocation', 'geo location', 'field staff'] },
  { name: 'privacy blur', min: 1, words: ['blur'] },
  { name: 'Silent Tracking (legal-gated)', min: 1, words: ['silent', 'stealth', 'invisible tracking', 'hidden tracking'] },
  { name: 'audit logs', min: 1, words: ['audit'] },
  { name: 'AI-generated insights', min: 1, words: ['ai insight', 'ai-generated', 'ai generated', 'artificial intelligence'] },
  { name: 'Work Pulse', min: 1, words: ['work pulse'] },
  { name: 'Tool Intelligence', min: 1, words: ['tool intelligence', 'software usage', 'licence usage', 'license usage'] },
  { name: 'Burnout & Wellbeing reports', min: 2, words: ['burnout', 'wellbeing', 'well-being', 'well being'] },
  { name: 'Focus Score', min: 2, words: ['focus score'] },
  { name: 'Team Leaderboard', min: 2, words: ['leaderboard'] },
  { name: 'unlimited custom roles', min: 2, words: ['unlimited role', 'unlimited custom role'] },
  { name: 'on-premise deployment', min: 3, words: ['on-prem', 'on prem', 'onprem', 'premise', 'self host', 'self-host', 'own server', 'minio'] },
  { name: 'a dedicated account manager', min: 3, words: ['account manager', 'dedicated manager'] },
  { name: 'module-level permissions', min: 3, words: ['module-level', 'module level'] },
  { name: 'custom roles', min: 1, words: ['custom role'] },
  { name: 'screenshots', min: 0, words: ['screenshot'] },
  { name: 'attendance tracking', min: 0, words: ['attendance'] },
]

/* ---------------- reading the question ---------------- */
const NUMBER_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70,
  eighty: 80, ninety: 90, dozen: 12,
}
const SEAT_WORDS = /^(seats?|users?|people|persons?|person|employees?|members?|staff|heads?|headcount|licen[cs]es?|agents?|workers?|team-?mates?|devices?|pcs?|computers?)$/
const TIME_WORDS = /^(min|mins|minutes?|hours?|hrs?|days?|weeks?|months?|years?|yrs?|%|percent|gb|mb)$/
const PRICE_WORDS = /\b(price|pricing|priced|cost|costs|costing|how much|pay|paying|charge|charges|charged|total|quote|bill|billed|billing|spend|expense|afford|fee|fees|rate|budget|cheaper|cheapest|save|saving|savings|discount|rupees?|inr|usd|dollars?)\b/
const COMPARE_WORDS = /\b(vs|versus|compare|comparison|difference|differ|better|between)\b/
const RECOMMEND_WORDS = /\b(which plan|what plan|which tier|what tier|best plan|right plan|best for|recommend|suit|suits|suitable|should i|should we|which one|best option|good for)\b/
const INCLUDES_WORDS = /\b(does|do|include|includes|included|have|has|support|supports|come with|comes with|offer|offers|available|get|can)\b/
const ASK_ABOUT_FEATURE = /\b(which plan|what plan|which tier|in which|need|needs|require|required|want|available|included|include|includes|can we|can i|do you|is there|does teemly|do we get|has|have)\b/
const FOLLOW_UP = /^(and|what about|how about|for|in|with|then|ok|okay|also|instead)\b/

// optimal string alignment distance, for spotting typos
export function editDistance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
    }
  }
  return d[a.length][b.length]
}

function planIndex(token) {
  if (token === 'pro') return 1
  const exact = PLAN_KEYS.indexOf(token)
  if (exact >= 0) return exact
  if (token.length < 6) return -1
  for (let i = 0; i < PLAN_KEYS.length; i++) {
    const key = PLAN_KEYS[i]
    // long names forgive two slips, short ones one ('premise' is not 'premium')
    if (editDistance(token, key) <= (key.length >= 10 ? 2 : 1)) return i
  }
  return -1
}

// "twenty five" -> 25, "two hundred" -> 200, "a dozen" -> 12
function wordsToNumbers(tokens) {
  const out = []
  let current = null
  const flush = () => {
    if (current !== null) out.push(String(current))
    current = null
  }
  for (const t of tokens) {
    if (t in NUMBER_WORDS) current = (current || 0) + NUMBER_WORDS[t]
    else if (t === 'hundred') current = (current || 1) * 100
    else if (t === 'thousand') current = (current || 1) * 1000
    else if (t === 'and' && current !== null) continue
    else {
      flush()
      out.push(t)
    }
  }
  flush()
  return out
}

function read(input) {
  const text = ` ${input.toLowerCase()} `
    .replace(/[’']/g, "'")
    .replace(/₹/g, ' inr ')
    .replace(/\$/g, ' usd ')
    .replace(/\brs\.?(?=\s|\d)/g, ' inr ')
    .replace(/(\d),(?=\d{3}\b)/g, '$1')
    .replace(/(\d+(?:\.\d+)?)\s*k\b/g, (_, n) => String(Math.round(parseFloat(n) * 1000)))
    .replace(/(\d)\s*-\s*(person|seat|user|member|employee)/g, '$1 $2')
    .replace(/[^a-z0-9.'\s-]/g, ' ')
    .replace(/(?<!\d)\.|\.(?!\d)/g, ' ')
  const tokens = wordsToNumbers(text.split(/\s+/).filter(Boolean))
  const joined = ` ${tokens.join(' ')} `

  const found = new Set()
  tokens.forEach((t) => {
    const i = planIndex(t)
    if (i >= 0) found.add(i)
  })
  const planIdx = [...found]

  let seats = null
  let money = null
  tokens.forEach((t, i) => {
    if (!/^\d+(\.\d+)?$/.test(t)) return
    const n = parseFloat(t)
    const prev = tokens[i - 1] || ''
    const prev2 = tokens[i - 2] || ''
    const next = tokens[i + 1] || ''
    const next2 = tokens[i + 2] || ''
    const isInr = prev === 'inr' || /^(inr|rupees?|rs)$/.test(next)
    const isUsd = prev === 'usd' || /^(usd|dollars?|bucks)$/.test(next)
    if (isInr || isUsd) {
      if (!money) money = { amount: n, currency: isInr ? 'inr' : 'usd' }
      return
    }
    if (TIME_WORDS.test(next)) return
    const seatAfter = SEAT_WORDS.test(next) || (SEAT_WORDS.test(next2) && !TIME_WORDS.test(next))
    const seatBefore = prev === 'for' || (prev === 'of' && /^(team|group|company|org|organisation|organization|staff)$/.test(prev2))
    if (seats === null && Number.isInteger(n) && n > 0 && (seatAfter || seatBefore)) seats = n
  })

  const cycle = /\b(year|yearly|annual|annually|per annum|12 months)\b/.test(joined)
    ? 'yearly'
    : /\b(monthly|per month|a month|each month|every month)\b/.test(joined)
      ? 'monthly'
      : null
  const currency = /\b(inr|rupees?|rs|indian)\b/.test(joined) ? 'inr' : /\b(usd|dollars?)\b/.test(joined) ? 'usd' : null
  const features = FEATURES.filter((f) => f.words.some((w) => joined.includes(` ${w}`)))
  // "unlimited custom roles" also says "custom roles"; keep the more specific one
  const feats = features.filter((f) => !(f.name === 'custom roles' && features.some((g) => g.name === 'unlimited custom roles')))

  return {
    joined,
    tokens,
    planIdx,
    seats,
    money,
    cycle,
    currency,
    features: feats,
    price: PRICE_WORDS.test(joined),
    compare: COMPARE_WORDS.test(joined),
    recommend: RECOMMEND_WORDS.test(joined),
    includes: INCLUDES_WORDS.test(joined),
    askFeature: ASK_ABOUT_FEATURE.test(joined),
    howMany: /\bhow many\b/.test(joined),
    followUp: FOLLOW_UP.test(joined.trim()) || tokens.length <= 4,
    attrs: {
      employees: /\b(how many (employees|users|people|seats|members|staff)|max|maximum|limit|up to how many|team size|capacity)\b/.test(joined),
      screenshots: /\b(interval|how often|frequency|screenshots? every|every how many)\b/.test(joined),
      retention: /\b(retention|retain|retained|kept|keep|stored|history|how long)\b/.test(joined),
      support: /\b(support|sla|response time)\b/.test(joined),
      roles: /\broles?\b/.test(joined),
    },
  }
}

/* ---------------- money ---------------- */
const usd = (n) => `$${Math.round(n).toLocaleString('en-US')}`
const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`
const perSeat = (plan, cycle, cur = 'usd') => {
  const base = cur === 'inr' ? plan.inr : plan.usd
  return cycle === 'yearly' ? Math.round(base * YEARLY_FACTOR) : base
}
const fmt = (n, cur) => (cur === 'inr' ? inr(n) : usd(n))
const other = (cur) => (cur === 'inr' ? 'usd' : 'inr')
const seatWord = (n) => (n === 1 ? 'seat' : 'seats')
const isCustom = (i) => typeof plans[i].usd !== 'number'
const maxOf = (i) => plans[i].limits.employees
// smallest plan whose employee limit covers `seats`
const planForSeats = (seats) => plans.findIndex((p) => p.limits.employees === null || p.limits.employees >= seats)

const LINKS = {
  pricing: { label: 'See full pricing', to: '/pricing' },
  demo: { label: 'Book a demo', to: '/book-a-demo' },
  sales: { label: 'Talk to sales', to: '/company/contact' },
}

function totalLines(i, seats, cur) {
  const p = plans[i]
  const m = perSeat(p, 'monthly', cur)
  const y = perSeat(p, 'yearly', cur)
  const o = other(cur)
  return [
    `Billed monthly: ${fmt(m, cur)} × ${seats} ${seatWord(seats)} = ${fmt(m * seats, cur)} a month (≈ ${fmt(perSeat(p, 'monthly', o) * seats, o)})`,
    `Billed yearly: ${fmt(y, cur)} × ${seats} = ${fmt(y * seats, cur)} a month — ${fmt(y * seats * 12, cur)} a year, saving ${fmt((m - y) * seats * 12, cur)} a year (≈ ${fmt(perSeat(p, 'yearly', o) * seats, o)} a month)`,
  ]
}

function enterpriseAnswer(seats) {
  return {
    text: `${seats ? `For ${seats.toLocaleString('en-US')} people, Enterprise is the plan. It` : 'Enterprise'} is priced as a custom quote and includes unlimited employees, custom intervals and retention, on-premise deployment, a dedicated account manager and a 4-hour SLA. Our team will put a quote together for you.`,
    links: [LINKS.sales, LINKS.demo],
    followUps: ['enterprise', 'compare-plans'],
  }
}

/* ---------------- answers ---------------- */
function priceAnswer({ plan, seats, cycle, currency }) {
  const cur = currency || 'usd'
  // a plan, no team size: per-seat prices
  if (plan !== null && !seats) {
    if (isCustom(plan)) return enterpriseAnswer(null)
    const p = plans[plan]
    return {
      text: `${p.name} is ${fmt(perSeat(p, 'monthly', cur), cur)} per seat a month (≈ ${fmt(perSeat(p, 'monthly', other(cur)), other(cur))}), or ${fmt(perSeat(p, 'yearly', cur), cur)} per seat a month billed yearly — it covers up to ${maxOf(plan)} employees. Tell me your team size and I'll work out the total.`,
      links: [LINKS.pricing],
      followUps: ['compare-plans', 'trial'],
    }
  }
  // a team size, no plan: every plan side by side
  if (plan === null) {
    const bullets = plans.map((p, i) => {
      if (isCustom(i)) return `${p.name} — custom quote for any team size`
      if (maxOf(i) < seats) return `${p.name} — covers up to ${maxOf(i)} employees, so it doesn't fit ${seats.toLocaleString('en-US')}`
      return `${p.name} — ${fmt(perSeat(p, 'monthly', cur) * seats, cur)} a month, or ${fmt(perSeat(p, 'yearly', cur) * seats, cur)} a month billed yearly`
    })
    const fits = planForSeats(seats)
    return {
      text: `For ${seats.toLocaleString('en-US')} ${seatWord(seats)}, here's what each plan costs:`,
      bullets: fits === ENTERPRISE ? bullets.concat('Above 500 employees, Enterprise is the plan — talk to sales for a quote.') : bullets,
      links: fits === ENTERPRISE ? [LINKS.sales, LINKS.pricing] : [LINKS.pricing, LINKS.demo],
      followUps: ['compare-plans', 'trial'],
    }
  }
  // a plan and a team size
  if (isCustom(plan)) return enterpriseAnswer(seats)
  let use = plan
  let note = ''
  if (maxOf(plan) < seats) {
    use = planForSeats(seats)
    note = `${plans[plan].name} covers up to ${maxOf(plan)} employees, so ${seats.toLocaleString('en-US')} people need ${plans[use].name}${isCustom(use) ? '' : ` (up to ${maxOf(use)})`}. `
    if (isCustom(use)) {
      const e = enterpriseAnswer(seats)
      return { ...e, text: note + e.text }
    }
  }
  const p = plans[use]
  const lines = totalLines(use, seats, cur)
  const lead =
    cycle === 'yearly'
      ? `${fmt(perSeat(p, 'yearly', cur) * seats, cur)} a month billed yearly (${fmt(perSeat(p, 'yearly', cur) * seats * 12, cur)} a year)`
      : `${fmt(perSeat(p, 'monthly', cur) * seats, cur)} a month`
  return {
    text: `${note}${p.name} for ${seats.toLocaleString('en-US')} ${seatWord(seats)} is ${lead}:`,
    bullets: cycle === 'yearly' ? [lines[1], lines[0]] : lines,
    links: [LINKS.pricing, LINKS.demo],
    followUps: ['trial', 'compare-plans'],
  }
}

function budgetAnswer({ money, plan, cycle, joined }) {
  const cur = money.currency
  const monthly = /\b(year|yearly|annual|annually|per annum)\b/.test(joined) ? money.amount / 12 : money.amount
  const fitFor = (i) => {
    const p = plans[i]
    const each = perSeat(p, 'monthly', cur)
    const yEach = perSeat(p, 'yearly', cur)
    const cap = maxOf(i)
    let n = Math.floor(monthly / each)
    let ny = Math.floor(monthly / yEach)
    const capped = n > cap
    n = Math.min(n, cap)
    ny = Math.min(ny, cap)
    return { p, each, yEach, n, ny, cap, capped }
  }
  const budgetText = `${fmt(monthly, cur)} a month`
  if (plan !== null) {
    if (isCustom(plan)) return enterpriseAnswer(null)
    const f = fitFor(plan)
    if (f.n < 1) {
      return {
        text: `${budgetText} is below one ${f.p.name} seat (${fmt(f.each, cur)} a month).`,
        links: [LINKS.pricing],
        followUps: ['pricing'],
      }
    }
    return {
      text: f.capped
        ? `${f.p.name} covers up to ${f.cap} employees, so with ${budgetText} you can cover all ${f.cap} seats (${fmt(f.each * f.cap, cur)} a month). For more people, move up to ${plans[plan + 1].name}.`
        : `With ${budgetText} you can cover ${f.n} ${seatWord(f.n)} on ${f.p.name} (${fmt(f.each, cur)} per seat), or ${f.ny} billed yearly (${fmt(f.yEach, cur)} per seat).`,
      links: [LINKS.pricing],
      followUps: ['compare-plans', 'trial'],
    }
  }
  return {
    text: `With ${budgetText}, you can cover:`,
    bullets: plans
      .map((p, i) => {
        if (isCustom(i)) return null
        const f = fitFor(i)
        return `${p.name} — ${f.n} ${seatWord(f.n)} (${f.ny} billed yearly)${f.capped ? `, its maximum of ${f.cap}` : ''}`
      })
      .filter(Boolean),
    links: [LINKS.pricing],
    followUps: ['compare-plans'],
  }
}

function hasFeature(i, f) {
  return i >= f.min
}
function featureDetail(i, f) {
  const l = plans[i].limits
  if (f.name === 'video recording' && l.video) return `, with ${l.video} of recordings kept`
  if (f.name === 'location tracking' && l.location) return `, with ${l.location} of location history`
  if (f.name === 'screenshots') return `, captured ${l.screenshots} and kept for ${l.retention}`
  if (f.name === 'custom roles' && l.roles) return ` (${l.roles})`
  return ''
}
function fromPrice(i) {
  return isCustom(i) ? 'custom pricing' : `${usd(plans[i].usd)} per seat a month`
}

function includesAnswer(plan, features) {
  const p = plans[plan]
  const bullets = features.map((f) =>
    hasFeature(plan, f)
      ? `Yes — ${p.name} includes ${f.name}${featureDetail(plan, f)}.`
      : `No — ${f.name} isn't included in ${p.name}. It starts on ${plans[f.min].name} (${fromPrice(f.min)})${featureDetail(f.min, f)}.`,
  )
  return {
    text: bullets.length === 1 ? bullets[0] : `Here's what ${p.name} includes:`,
    bullets: bullets.length === 1 ? undefined : bullets,
    links: [LINKS.pricing],
    followUps: ['compare-plans', 'pricing'],
  }
}

function attrAnswer(plan, attrs) {
  const p = plans[plan]
  const l = p.limits
  const out = []
  if (attrs.employees) out.push(l.employees === null ? `${p.name} covers unlimited employees.` : `${p.name} covers up to ${l.employees} employees.`)
  if (attrs.screenshots) out.push(`${p.name} captures screenshots ${l.screenshots}.`)
  if (attrs.retention) {
    const parts = [`screenshots for ${l.retention}`]
    if (l.video) parts.push(`video recordings for ${l.video}`)
    if (l.location) parts.push(`location history for ${l.location}`)
    out.push(`${p.name} keeps ${parts.join(', ')}.`)
  }
  if (attrs.support) out.push(`${p.name} comes with ${l.support}.`)
  if (attrs.roles) out.push(l.roles ? `${p.name} includes ${l.roles}.` : `${p.name} doesn't include custom roles — they start on Professional (up to 5).`)
  return { text: out.join(' '), links: [LINKS.pricing], followUps: ['compare-plans', 'pricing'] }
}

function compareAnswer(a, b) {
  const [lo, hi] = a < b ? [a, b] : [b, a]
  const L = plans[lo]
  const H = plans[hi]
  const v = (x, none = 'not included') => x || none
  const price = (i) => (isCustom(i) ? 'custom' : `${usd(plans[i].usd)}/seat/mo`)
  const extras = FEATURES.filter((f) => f.min > lo && f.min <= hi && f.min > 0).map((f) => f.name)
  return {
    text: `${L.name} vs ${H.name}:`,
    bullets: [
      `Price: ${price(lo)} vs ${price(hi)}`,
      `Employees: up to ${v(L.limits.employees, 'unlimited')} vs ${H.limits.employees === null ? 'unlimited' : `up to ${H.limits.employees}`}`,
      `Screenshots: ${L.limits.screenshots}, kept ${L.limits.retention} vs ${H.limits.screenshots}, kept ${H.limits.retention}`,
      `Video recording: ${v(L.limits.video && `${L.limits.video} kept`)} vs ${v(H.limits.video && `${H.limits.video} kept`)}`,
      `Location tracking: ${v(L.limits.location && `${L.limits.location} kept`)} vs ${v(H.limits.location && `${H.limits.location} kept`)}`,
      `Custom roles: ${v(L.limits.roles, 'none')} vs ${v(H.limits.roles, 'none')}`,
      `Support: ${L.limits.support} vs ${H.limits.support}`,
      ...(extras.length ? [`Only on ${H.name}${hi < ENTERPRISE ? ' and up' : ''}: ${extras.join(', ')}`] : []),
    ],
    links: [LINKS.pricing],
    followUps: ['pricing', 'trial'],
  }
}

function recommendAnswer({ seats, features, cycle, currency }) {
  const bySeats = seats ? planForSeats(seats) : 0
  const byFeatures = features.reduce((m, f) => Math.max(m, f.min), 0)
  const i = Math.max(bySeats, byFeatures)
  const p = plans[i]
  const why = []
  if (seats) why.push(p.limits.employees === null ? 'it has no employee limit' : `it covers up to ${p.limits.employees} employees`)
  const feats = features.filter((f) => f.min > 0)
  if (feats.length) why.push(`it includes ${feats.map((f) => f.name).join(' and ')}`)
  if (!why.length) why.push(`it covers up to ${p.limits.employees} employees with ${p.features[2].toLowerCase()}`)
  if (isCustom(i)) {
    const e = enterpriseAnswer(seats)
    return { ...e, text: `Enterprise is the right fit — ${why.join(', and ')}. ${e.text}` }
  }
  const text = `${p.name} is the best fit — ${why.join(', and ')}.`
  if (seats) {
    const priced = priceAnswer({ plan: i, seats, cycle, currency })
    return { ...priced, text: `${text} ${priced.text}` }
  }
  return {
    text: `${text} It's ${fromPrice(i)} (${usd(perSeat(p, 'yearly'))} billed yearly). Tell me your team size and I'll total it.`,
    links: [LINKS.pricing, LINKS.demo],
    followUps: ['compare-plans', 'trial'],
  }
}

function overviewAnswer(i) {
  const p = plans[i]
  if (isCustom(i)) {
    return { text: `${p.name} — ${p.tagline.toLowerCase()}. It's a custom quote and includes:`, bullets: p.features, links: [LINKS.sales, LINKS.demo], followUps: ['enterprise', 'compare-plans'] }
  }
  return {
    text: `${p.name} — ${p.tagline.toLowerCase()}. ${usd(p.usd)} per seat a month (${usd(perSeat(p, 'yearly'))} billed yearly), and it includes:`,
    bullets: p.features,
    links: [LINKS.pricing, LINKS.demo],
    followUps: ['compare-plans', 'trial'],
  }
}

// two named plans and a team size: just those two, which is cheaper, whether both fit
function pairPriceAnswer(a, b, seats, cycle, currency) {
  const cur = currency || 'usd'
  const [lo, hi] = a < b ? [a, b] : [b, a]
  const line = (i) => {
    const p = plans[i]
    if (isCustom(i)) return `${p.name} — custom quote`
    if (maxOf(i) < seats) return `${p.name} — covers up to ${maxOf(i)} employees, so it doesn't fit ${seats.toLocaleString('en-US')}`
    return `${p.name} — ${fmt(perSeat(p, 'monthly', cur) * seats, cur)} a month, or ${fmt(perSeat(p, 'yearly', cur) * seats, cur)} a month billed yearly`
  }
  const fits = (i) => isCustom(i) || maxOf(i) >= seats
  let text
  const adds = FEATURES.filter((f) => f.min > lo && f.min <= hi).slice(0, 3).map((f) => f.name)
  if (fits(lo) && !isCustom(lo)) text = `For ${seats.toLocaleString('en-US')} ${seatWord(seats)}, ${plans[lo].name} is the cheaper of the two${adds.length ? `; ${plans[hi].name} adds ${adds.join(', ')} and more` : ''}:`
  else if (fits(hi)) text = `For ${seats.toLocaleString('en-US')} ${seatWord(seats)}, only ${plans[hi].name} fits:`
  else text = `Neither fits ${seats.toLocaleString('en-US')} people — that needs ${plans[planForSeats(seats)].name}.`
  return { text, bullets: [line(lo), line(hi)], links: [LINKS.pricing], followUps: ['compare-plans', 'trial'] }
}

function featurePriceAnswer(f) {
  const i = f.min
  if (isCustom(i)) return featurePlanAnswer([f])
  return {
    text: `${f.name[0].toUpperCase()}${f.name.slice(1)} isn't sold separately — ${i === 0 ? 'every plan includes it' : `it's included from ${plans[i].name} upwards`}, so the price is the plan's per-seat price: ${usd(plans[i].usd)} per seat a month (${usd(perSeat(plans[i], 'yearly'))} billed yearly)${featureDetail(i, f)}.`,
    links: [LINKS.pricing],
    followUps: ['compare-plans', 'pricing'],
  }
}

function featurePlanAnswer(features) {
  if (features.length > 1) return recommendAnswer({ seats: null, features })
  const f = features[0]
  const i = f.min
  const text = isCustom(i)
    ? `${f.name[0].toUpperCase()}${f.name.slice(1)} is available on Enterprise, which is custom-priced — talk to sales for a scoped plan.`
    : `${f.name[0].toUpperCase()}${f.name.slice(1)} ${i === 0 ? 'is included on every plan' : `is available from ${plans[i].name} (${fromPrice(i)}) upwards`}${featureDetail(i, f)}.`
  return { text, links: isCustom(i) ? [LINKS.sales] : [LINKS.pricing], followUps: ['compare-plans', 'pricing'] }
}

/* ---------------- routing ---------------- */
export function answerPlans(input, context = {}) {
  const q = read(input)
  const plan = q.planIdx.length === 1 ? q.planIdx[0] : null
  const ctx = context || {}
  const done = (answer, next) => ({ answer, context: { ...ctx, ...next } })

  // "what about yearly?" / "and for 50?" / "in rupees" after a price answer
  if (ctx.last === 'price' && q.followUp && !q.compare && !q.recommend && !q.features.length && !q.money) {
    const bareNumber = q.tokens.find((t) => /^\d+$/.test(t))
    const seats = q.seats || (bareNumber ? parseInt(bareNumber, 10) : null)
    if (q.cycle || q.currency || seats || plan !== null) {
      const next = {
        plan: plan !== null ? plan : ctx.plan,
        seats: seats || ctx.seats,
        cycle: q.cycle || ctx.cycle,
        currency: q.currency || ctx.currency,
        last: 'price',
      }
      if (next.plan !== null || next.seats) return done(priceAnswer(next), next)
    }
  }

  // budget: "$1,000 a month, how many seats on Premium?"
  if (q.money && (q.howMany || /\b(budget|afford|can we get|can i get)\b/.test(q.joined))) {
    return done(budgetAnswer({ money: q.money, plan, cycle: q.cycle, joined: q.joined }), { last: 'budget', plan })
  }

  // "Starter or Professional for 30 people?"
  if (q.planIdx.length >= 2 && q.seats) {
    return done(pairPriceAnswer(q.planIdx[0], q.planIdx[1], q.seats, q.cycle, q.currency), { last: 'compare' })
  }

  // "Starter vs Professional"
  if (q.planIdx.length >= 2 && (q.compare || / (and|or) /.test(q.joined))) {
    return done(compareAnswer(q.planIdx[0], q.planIdx[1]), { last: 'compare' })
  }

  // "does Starter include video?"
  if (plan !== null && q.features.length && q.includes && !q.seats && !q.price) {
    return done(includesAnswer(plan, q.features), { last: 'includes', plan })
  }

  // "what does Premium include?", "Enterprise plan details"
  if (plan !== null && !q.features.length && !q.seats && !q.money && !Object.values(q.attrs).some(Boolean) &&
    /\b(include|includes|including|features?|details?|what do (i|we) get|what's in|what is in|offer|offers|about|tell me|explain)\b/.test(q.joined)) {
    return done(overviewAnswer(plan), { last: 'overview', plan })
  }

  // "screenshot interval on Premium", "how many employees on Starter"
  if (plan !== null && !q.seats && !q.price && Object.values(q.attrs).some(Boolean)) {
    return done(attrAnswer(plan, q.attrs), { last: 'attr', plan })
  }

  // "what is the price of video recording?" — features come with a plan
  if (plan === null && q.price && !q.seats && !q.money && q.features.length === 1 && q.features[0].min > 0) {
    return done(featurePriceAnswer(q.features[0]), { last: 'feature' })
  }

  // "which plan has burnout reports?" is about availability, not a fit
  if (q.recommend && plan === null && !q.seats && q.features.length === 1) {
    return done(featurePlanAnswer(q.features), { last: 'feature' })
  }

  // "which plan for 120 people who need video?"
  if (q.recommend && plan === null) {
    return done(recommendAnswer({ seats: q.seats, features: q.features, cycle: q.cycle, currency: q.currency }), {
      last: 'price',
      plan: null,
      seats: q.seats,
    })
  }

  // "which plan has burnout reports?", "can we host it on our own servers?"
  const askable = q.features.filter((f) => f.min > 0 || /\b(which|what) (plan|tier)\b/.test(q.joined))
  if (plan === null && askable.length && q.askFeature && !q.price) {
    return done(featurePlanAnswer(askable), { last: 'feature' })
  }

  // prices: a team size and / or a plan
  if ((q.price || q.seats) && (q.seats || plan !== null)) {
    const next = { plan, seats: q.seats, cycle: q.cycle, currency: q.currency, last: 'price' }
    return done(priceAnswer(next), next)
  }
  if (q.planIdx.length >= 2 && q.price && q.seats) {
    const next = { plan: q.planIdx[0], seats: q.seats, cycle: q.cycle, currency: q.currency, last: 'price' }
    return done(priceAnswer(next), next)
  }

  return null
}
