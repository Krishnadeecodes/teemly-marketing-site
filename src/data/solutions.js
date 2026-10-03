// Solution/persona content — grounded in the Capabilities doc. The product is one
// workforce-intelligence tool viewed through different buyer lenses, not 11 different
// feature sets, so capabilities repeat across personas by design.

export const commonFaqs = [
  {
    q: 'Does this feel like surveillance to employees?',
    a: 'Privacy Mode lets any employee pause all tracking instantly, with no admin override. Screenshot and video blur hide content while keeping activity metadata visible, and Silent Tracking stays locked behind an explicit legal acknowledgement before it can ever be enabled.',
  },
  {
    q: 'Can I see this before committing budget?',
    a: 'Yes — Book a Demo for a guided walkthrough, or Take a Tour for a self-guided look at the product. The Starter plan is also priced per seat if you want to try it directly with your team.',
  },
]

export const solutions = [
  {
    slug: 'executives',
    icon: 'briefcase',
    navLabel: 'Executive Intelligence',
    title: 'Organisation-wide visibility, without waiting for the quarterly review',
    problem:
      'Leadership typically sees workforce health in quarterly summaries, assembled by hand, from data nobody fully trusts by the time it reaches the boardroom.',
    whyInsufficient:
      'Dashboards built from spreadsheets are stale the moment they are compiled, and they rarely connect productivity, attendance and technology spend into one picture.',
    howTeemlyHelps:
      'The Dashboard gives a real-time, organisation-wide productivity score, attendance summary and activity feed — the same record every team-level report rolls up from, not a separate executive deck.',
    capabilities: [
      'Org-wide productivity score, refreshed continuously',
      'Team Leaderboard — rankings and rank movement across the organisation',
      'Burnout & Wellbeing signal, visible before it becomes attrition',
      'Tool Intelligence — SaaS spend waste, with the monthly cost attached',
    ],
    relevantModules: ['dashboard'],
    relevantReports: ['Team Leaderboard', 'Burnout & Wellbeing', 'Tool Intelligence'],
    outcome: 'Decisions about headcount, tooling and policy backed by a live record, not a quarterly estimate.',
  },
  {
    slug: 'hr',
    icon: 'users',
    navLabel: 'HR Intelligence',
    title: 'Workforce health, attendance and experience, in one place',
    problem:
      'HR teams reconcile attendance from one tool, engagement from another, and performance anecdotes from managers — rarely in the same timeframe.',
    whyInsufficient:
      'Manual timesheets and ad-hoc check-ins create gaps that only surface during a review cycle, by which point the context is gone.',
    howTeemlyHelps:
      'Attendance is derived automatically from real activity events, and the Burnout & Wellbeing report flags overwork and after-hours patterns before they become a retention problem.',
    capabilities: [
      'Automatic check-in/check-out — no manual punch-in',
      'Burnout & Wellbeing report — overtime, after-hours activity, wellbeing index',
      'Privacy Mode and screenshot/video blur — employee-controlled, no admin override',
      'Perfect-attendance streaks and habitual-late identification',
    ],
    relevantModules: ['attendance', 'teams'],
    relevantReports: ['Burnout & Wellbeing', 'Attendance & Punctuality'],
    outcome: 'Attendance and wellbeing conversations backed by evidence, held before the exit interview.',
  },
  {
    slug: 'managers',
    icon: 'target',
    navLabel: 'Manager Intelligence',
    title: 'Team capacity and coaching opportunities, at a glance',
    problem:
      'Managers often learn about a bottleneck or a struggling team member in the next 1:1 — a week or more after it started.',
    whyInsufficient:
      "Status updates reflect what people choose to report, not what's actually happening across the team's work.",
    howTeemlyHelps:
      'Team cards rank productivity automatically, a monthly heat map shows the pattern, and an individual profile explains the exception — without switching tools.',
    capabilities: [
      'Team list ranked by productivity, with live working/privacy/offline counts',
      'Monthly work-hours calendar heat map per team',
      'Employee profile — hour-by-hour activity timeline',
      'Team Leaderboard — coaching-opportunity flags from rank movement',
    ],
    relevantModules: ['teams'],
    relevantReports: ['Team Leaderboard', 'Work Pulse'],
    outcome: 'Coaching conversations pointed at a real pattern, not a manager\'s best guess.',
  },
  {
    slug: 'operations',
    icon: 'gear',
    navLabel: 'Enterprise Operations',
    title: 'Where process friction actually happens',
    problem:
      'Operational bottlenecks are usually diagnosed after they have already cost a deadline — through a retrospective, not a live signal.',
    whyInsufficient:
      "Without a shared timeline across a team, it's hard to see where coverage gaps or workload imbalance actually sit day to day.",
    howTeemlyHelps:
      'The Attendance Gantt timeline puts every employee on a shared time axis, while Tool Intelligence surfaces which tools are actually adopted versus paid for.',
    capabilities: [
      'Gantt timeline view — shared time axis, live "now" indicator',
      'Work Policy — working days, expected hours, per-employee targets',
      'Tool adoption rates and SaaS spend waste alerts',
      'CSV export across Attendance, Teams and Location data',
    ],
    relevantModules: ['attendance', 'settings'],
    relevantReports: ['Tool Intelligence', 'Work Pulse'],
    outcome: 'Coverage and workload visible on one shared timeline, instead of reconstructed after the fact.',
  },
  {
    slug: 'it',
    icon: 'cpu',
    navLabel: 'IT & Technology Intelligence',
    title: 'Tool adoption, SaaS waste, and an agent built to be audited',
    problem:
      'IT is asked to justify software spend and secure yet another always-on agent, often without good visibility into either.',
    whyInsufficient:
      'Procurement data shows what was purchased, not what is actually used — and a licensed third-party monitoring SDK adds a dependency IT does not control.',
    howTeemlyHelps:
      'Tool Intelligence shows real adoption rates and flags underused licences with cost attached, while the agent itself is built and owned by Teemly end to end — code-signed, HMAC-signed payloads, AES-256 at rest.',
    capabilities: [
      'Tool Intelligence — adoption rates, underused-licence detection',
      'Own EXE agent — Windows EV certificate, macOS notarised',
      'HMAC-SHA256 signed payloads, replay-attack prevention',
      'API access for integrations on Premium and Enterprise',
    ],
    relevantModules: ['settings'],
    relevantReports: ['Tool Intelligence'],
    outcome: 'Software spend and agent security both backed by verifiable facts, not vendor claims.',
  },
  {
    slug: 'finance',
    icon: 'dollar',
    navLabel: 'Capacity & Resource Planning',
    title: 'Workforce hours and tool spend as real planning inputs',
    problem:
      'Capacity and workforce-cost planning is usually built on headcount alone, without a real read on hours actually worked or tools actually used.',
    whyInsufficient:
      'Spreadsheet-based planning is only as current as its last manual update, and rarely connects to real attendance or tooling data.',
    howTeemlyHelps:
      'Attendance and Teams data give a real record of hours worked per person and per team, and Tool Intelligence quantifies software spend that is not being used — both exportable to CSV for your own models.',
    capabilities: [
      'Real attendance and work-hours data, exportable to CSV',
      'Tool Intelligence — underused licences with monthly cost attached',
      'Per-seat pricing that scales predictably with headcount',
      'Team-level and org-level scope on every report',
    ],
    relevantModules: ['attendance'],
    relevantReports: ['Tool Intelligence', 'Attendance & Punctuality'],
    outcome: 'Planning inputs drawn from real hours and real tool usage, not estimates.',
  },
  {
    slug: 'productivity',
    icon: 'bolt',
    navLabel: 'Productivity Intelligence',
    title: 'Focus, rhythm and distraction sources, not just hours logged',
    problem:
      'Hours logged tell you very little about whether that time was spent in deep, uninterrupted work.',
    whyInsufficient:
      'Attendance alone cannot distinguish a focused morning from a fragmented one.',
    howTeemlyHelps:
      'Work Pulse maps peak productivity windows and distraction sources, and Focus Score measures uninterrupted work streaks and context switches per hour.',
    capabilities: [
      'Work Pulse — hourly heat map, day-of-week breakdown, distraction sources',
      'Focus Score — 0–100, context switches per hour, deep-work streaks',
      'Org Productivity Score, refreshed continuously',
      'AI-generated insight cards on every report',
    ],
    relevantModules: ['dashboard', 'reports'],
    relevantReports: ['Work Pulse', 'Focus Score'],
    outcome: 'A real read on focus quality, not just a tally of hours logged.',
  },
  {
    slug: 'workforce',
    icon: 'chart',
    navLabel: 'Workforce Optimization',
    title: 'Right-size teams against how work actually happens',
    problem:
      'Team structure decisions are often made on headcount and tenure, without a real view of comparative workload.',
    whyInsufficient:
      'Org charts do not show which teams are stretched and which have slack — that only shows up in burnout or in missed deadlines, much later.',
    howTeemlyHelps:
      'The Teams work-hours heat map and Team Leaderboard make comparative workload and productivity visible across the organisation, side by side.',
    capabilities: [
      'Work-hours calendar heat map, per team, per month',
      'Team Leaderboard — rankings and 4-week rank-movement trend',
      'Burnout & Wellbeing signal at the team level',
      'CSV export for your own workforce-planning models',
    ],
    relevantModules: ['teams'],
    relevantReports: ['Team Leaderboard', 'Burnout & Wellbeing'],
    outcome: 'Team-sizing conversations grounded in comparative, real workload data.',
  },
  {
    slug: 'workflow',
    icon: 'layers',
    navLabel: 'Workflow Optimization',
    title: 'Where process friction actually shows up',
    problem:
      'Process inefficiency is usually described anecdotally, long after the friction has already slowed a team down.',
    whyInsufficient:
      "We don't claim to mine or map your business processes — that would overstate what the product does today.",
    howTeemlyHelps:
      'What we do have: a shared Gantt timeline for coverage, Work Policy as a measurable baseline, and Tool Intelligence surfacing where tooling itself is the bottleneck.',
    capabilities: [
      'Gantt timeline — shared time axis, coverage visible at a glance',
      'Work Policy baseline — expected hours, check-in time, per-employee targets',
      'Tool adoption and SaaS waste signals',
      'Settings sync to the agent within 1 hour of saving',
    ],
    relevantModules: ['settings', 'attendance'],
    relevantReports: ['Tool Intelligence', 'Work Pulse'],
    outcome: 'Friction points made visible against a real baseline, described honestly rather than inferred.',
  },
  {
    slug: 'ai',
    icon: 'sparkle',
    navLabel: 'AI Impact',
    title: 'Where AI-era productivity gains actually show up',
    problem:
      'Organisations adopting AI tools rarely have a way to see whether that adoption is changing how work actually gets done.',
    whyInsufficient:
      "We don't run a dedicated AI-adoption tracker today — if we said otherwise, it would be a feature that doesn't exist.",
    howTeemlyHelps:
      'Tool Intelligence tracks adoption rates for any application your team uses, AI tools included, and Teemly\'s own reports are themselves AI-generated — 3 insight cards per report, automatically.',
    capabilities: [
      'Tool Intelligence — adoption-rate tracking for any application in use',
      'AI-generated insight cards on all 6 intelligence reports',
      'Focus Score and Work Pulse as productivity baselines to compare against',
      'Org-wide, team and individual scope on every report',
    ],
    relevantModules: ['reports'],
    relevantReports: ['Tool Intelligence', 'Focus Score'],
    outcome: 'A real baseline to compare against as AI tools are rolled out — not a fabricated impact score.',
  },
  {
    slug: 'employee-experience',
    icon: 'heart',
    navLabel: 'Employee Experience',
    title: 'Visibility that does not cost employees their privacy',
    problem:
      'Monitoring tools that ignore employee trust tend to damage the very productivity they claim to measure.',
    whyInsufficient:
      'Tools without a genuine, employee-controlled privacy mode turn visibility into surveillance — and erode the experience they are meant to protect.',
    howTeemlyHelps:
      'Privacy Mode pauses all tracking instantly with no admin override, screenshot and video blur hide content while keeping activity metadata visible, and Silent Tracking stays locked behind an explicit legal gate.',
    capabilities: [
      'Privacy Mode — employee-controlled, no admin override, ever',
      'Screenshot and video blur — original never stored once enabled',
      'Privacy notice shown at EXE installation, before tracking begins',
      'Silent Tracking locked behind mandatory legal acknowledgement',
    ],
    relevantModules: ['screenshots', 'settings'],
    relevantReports: ['Burnout & Wellbeing'],
    outcome: 'Visibility the organisation can use, and employees can actually trust.',
  },
]

export function getSolution(slug) {
  return solutions.find((s) => s.slug === slug)
}
