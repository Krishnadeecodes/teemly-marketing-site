export const whyTeemlyPages = [
  {
    slug: 'problem',
    icon: 'puzzle',
    label: 'The Problem',
    title: 'The problem with fragmented organisational data',
    intro:
      'Every organisation generates signals about how people, work and technology behave. The problem has never been a lack of data — it is that the data stays scattered, delayed and disconnected from the decision that needs it.',
    body: [
      {
        heading: 'People data lags',
        text: 'Attendance sheets get filled in after the fact. By the time a pattern is visible in a spreadsheet, the window to act on it has usually passed.',
      },
      {
        heading: 'Work data is invisible',
        text: 'Work happens across dozens of applications and browser tabs. None of that is visible to a manager unless they ask directly — and by then it is a memory, not a record.',
      },
      {
        heading: 'Technology data goes unchecked',
        text: 'Software licences renew automatically whether anyone uses them or not. Waste is usually only noticed when the invoice arrives, not when the usage actually dropped.',
      },
    ],
  },
  {
    slug: 'difference',
    icon: 'sparkle',
    label: 'How Teemly Is Different',
    title: 'Our own agent, not a licensed plugin',
    intro:
      'Most of what makes Teemly different is architectural, not a marketing claim — it shows up in decisions we made about the agent, privacy and scope.',
    body: [
      {
        heading: 'We built the agent ourselves',
        text: 'No third-party monitoring SDK sits between your data and your dashboard. The sub-2MB EXE agent is code-signed, HMAC-signs every payload, and is owned end to end by Teemly.',
      },
      {
        heading: 'Privacy is a code path, not a policy page',
        text: 'Privacy Mode, screenshot/video blur and the Silent Tracking legal gate are enforced in the product and the API — not just written down in a document nobody reads.',
      },
      {
        heading: 'We say what we don\'t do yet',
        text: "We don't claim workflow mining, a conversational AI assistant, or industry-specific builds we haven't shipped. What's on this site is what's in the product.",
      },
    ],
  },
  {
    slug: 'business-impact',
    icon: 'trendingUp',
    label: 'Business Impact',
    title: 'Where the value actually shows up',
    intro:
      'These are mechanisms already in the product, not projected percentages — use the ROI calculator to see what they could mean at your own headcount and spend.',
    body: [
      {
        heading: 'Software spend, right-sized',
        text: 'Tool Intelligence flags underused licences automatically, with the monthly cost attached.',
      },
      {
        heading: 'Burnout caught earlier',
        text: 'Overtime, after-hours activity and weekend work roll into a Burnout & Wellbeing signal before it becomes attrition.',
      },
      {
        heading: 'Attendance that enforces itself',
        text: 'Late arrivals and absences are flagged automatically from real activity events.',
      },
    ],
  },
  {
    slug: 'roi',
    icon: 'dollar',
    label: 'ROI',
    title: 'How to think about ROI before you buy',
    intro:
      'Teemly\'s ROI calculator is a modelling tool, not a guarantee — every assumption is visible and adjustable, and the result should be read as an estimate, not a verified outcome.',
    body: [
      {
        heading: 'What goes in',
        text: 'Employee count, average employee cost, technology spend, and manager count — inputs you already know, not data we ask you to trust blindly.',
      },
      {
        heading: 'What comes out',
        text: 'An estimated annual opportunity broken into productivity, technology optimisation, workflow and capacity categories — clearly labelled as a model, never presented as a verified customer result.',
      },
    ],
  },
]

export function getWhyTeemlyPage(slug) {
  return whyTeemlyPages.find((p) => p.slug === slug)
}
