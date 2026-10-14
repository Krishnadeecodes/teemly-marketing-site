// Lead form rules shared by the browser (inline validation) and the Node
// server (server/index.js), so both sides always enforce the same contract.
// Plain JS only — the server imports this file directly.

export const SIZE_OPTIONS = ['1–10', '11–50', '51–200', '201–500', '500+']
export const ROLE_OPTIONS = ['CEO/Founder', 'Executive', 'HR', 'People Analytics', 'IT', 'Operations', 'Finance', 'AI/Data', 'Manager', 'Other']
export const PROBLEM_OPTIONS = [
  'Productivity',
  'Workforce Planning',
  'Workflow Optimization',
  'AI Impact',
  'Technology Utilization',
  'Employee Experience',
  'Organizational Intelligence',
  'Other',
]

// Deliberately strict: no whitespace, commas or quotes-as-separators, so a
// value can never expand into extra recipients or headers in an email.
export const EMAIL_RE = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/

// Field rules, in display order. `required` holds the message shown when empty.
export const LEAD_FORMS = {
  contact: {
    name: { required: 'Please enter your name.', max: 100 },
    email: { required: 'Please enter your work email.', email: true, max: 254 },
    company: { max: 120 },
    seats: { options: SIZE_OPTIONS },
    message: { max: 3000 },
  },
  demo: {
    firstName: { required: 'Please enter your first name.', max: 60 },
    lastName: { required: 'Please enter your last name.', max: 60 },
    email: { required: 'Please enter your work email.', email: true, max: 254 },
    company: { required: 'Please enter your company name.', max: 120 },
    jobTitle: { max: 100 },
    country: { required: 'Please enter your country.', max: 80 },
    companySize: { required: 'Please select your company size.', options: SIZE_OPTIONS },
    role: { required: 'Please select your role.', options: ROLE_OPTIONS },
    problem: { required: 'Please select the closest fit.', options: PROBLEM_OPTIONS },
    message: { max: 3000 },
    consent: { checkbox: true, required: 'Please confirm we may contact you about this request.' },
  },
  // Gated report / research PDF downloads (server/resources.js)
  download: {
    name: { required: 'Please enter your name.', max: 100 },
    email: { required: 'Please enter your work email.', email: true, max: 254 },
    company: { required: 'Please enter your company name.', max: 120 },
    consent: { checkbox: true, required: 'Please confirm we may email you about this download.' },
  },
}

export function validateField(rule, value) {
  if (rule.checkbox) return value === true ? '' : rule.required || ''
  const v = typeof value === 'string' ? value.trim() : ''
  if (!v) return rule.required || ''
  if (rule.max && v.length > rule.max) return `Please keep this under ${rule.max} characters.`
  if (rule.email && !EMAIL_RE.test(v)) return 'Please enter a valid email address, like jane@company.com.'
  if (rule.options && !rule.options.includes(v)) return 'Please choose one of the listed options.'
  return ''
}

// Returns { field: message } for every invalid field (empty object when valid).
export function validateLead(type, values) {
  const rules = LEAD_FORMS[type]
  const errors = {}
  for (const [field, rule] of Object.entries(rules)) {
    const msg = validateField(rule, values?.[field])
    if (msg) errors[field] = msg
  }
  return errors
}
