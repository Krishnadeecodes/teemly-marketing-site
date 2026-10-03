// Platform pillar content — grounded in Teemly_Capabilities_updated.docx.
// "Organizational Context" (Blueprint §4.1) is folded into the Organizational
// Intelligence pillar rather than given a separate, thinly-sourced page.

export const platformPillars = [
  {
    slug: 'organizational-intelligence',
    icon: 'network',
    label: 'Organizational Intelligence',
    title: 'The umbrella view that ties people, work and technology together',
    intro:
      'Organizational Intelligence is the model underneath every other pillar: Signals → Context → Intelligence → Action → Outcomes. It is what turns six separate modules into one coherent read on the organisation.',
    body: [
      {
        heading: 'Context, not just data',
        text: "The Dashboard is where this comes together — four KPI stat cards, an org-wide productivity score gauge, a work summary chart, a live activity feed and an attendance summary, all refreshed in real time via server-sent events rather than a nightly batch job.",
      },
      {
        heading: 'Scoped by who is looking',
        text: 'The same organisational context is visible to admins across the whole company, and scoped down to assigned teams only for managers — role-based access enforced at the API level, not just hidden in the UI.',
      },
    ],
    facts: [
      '4 KPI stat cards: employees, checked in, absent, average work hours',
      'Org productivity score gauge (0–100) for the selected date range',
      'Live activity list — Work / Privacy / Offline status per employee, updating without a refresh',
      'Filters by date range, team and business-hours toggle',
    ],
    relatedModules: ['dashboard'],
    relatedReports: ['Attendance & Punctuality', 'Team Leaderboard'],
  },
  {
    slug: 'workforce-intelligence',
    icon: 'users',
    label: 'Workforce Intelligence',
    title: 'Team health and capacity, from org average to one person',
    intro:
      'Workforce Intelligence covers the people side of the model — team structure, attendance and the reports that turn both into coaching decisions rather than quarterly guesswork.',
    body: [
      {
        heading: 'Three depths, one module',
        text: 'Teams gives you an org-wide team summary, a team detail view with a monthly work-hours heat map, and a full employee profile down to an hour-by-hour activity timeline — without switching tools.',
      },
      {
        heading: 'Attendance that enforces itself',
        text: 'Check-in is the first EXE activity event of the day; check-out is the last. Late arrivals and absences are flagged automatically, with a shared Gantt timeline available from the Professional plan up.',
      },
    ],
    facts: [
      'Team cards ranked by productivity, with live working/privacy/offline counts',
      'Monthly work-hours calendar heat map per team',
      'Auto check-in/check-out from real activity events — no manual punch-in',
      'Perfect-attendance streaks and habitual-late identification',
    ],
    relatedModules: ['teams', 'attendance'],
    relatedReports: ['Team Leaderboard', 'Attendance & Punctuality', 'Burnout & Wellbeing'],
  },
  {
    slug: 'work-intelligence',
    icon: 'monitor',
    label: 'Work Intelligence',
    title: 'How work actually happens, app by app and session by session',
    intro:
      'Work Intelligence is the visual and behavioural record of work itself — screenshots, screen recordings and the Tool Intelligence report that tells you where the time actually goes.',
    body: [
      {
        heading: 'Visual proof, with privacy built in',
        text: 'Screenshots and Video Recording are both tagged productive, neutral or unproductive automatically. When privacy blur is on for an employee, the original image or recording is never written to storage — blurred server-side before anything is saved.',
      },
      {
        heading: 'Where the time actually goes',
        text: 'Tool Intelligence turns raw app and website usage into productivity classification per tool, underused-licence detection, and SaaS spend waste alerts — not just a list of open windows.',
      },
    ],
    facts: [
      'Screenshot and video intervals scale by plan: 5/2/1 min or custom',
      'Privacy blur — original never stored once enabled, server-side guarantee',
      'In-browser video playback, no download required',
      'Underused software licences flagged with the monthly cost attached',
    ],
    relatedModules: ['screenshots', 'video-recording'],
    relatedReports: ['Tool Intelligence', 'Focus Score'],
  },
  {
    slug: 'workflow-intelligence',
    icon: 'layers',
    label: 'Workflow Intelligence',
    title: 'Policy, timelines and tool spend — the efficiency signals we actually capture',
    intro:
      "Teemly does not claim to map or mine business processes today. Workflow Intelligence is the honest, narrower version: the Work Policy configuration, shared timelines, and tool-spend signals that reveal where process friction shows up.",
    body: [
      {
        heading: 'Policy as the baseline',
        text: 'Work Policy sets working days, expected hours, check-in time and target percentage per employee — the baseline every attendance and productivity signal is measured against.',
      },
      {
        heading: 'Friction, surfaced not mined',
        text: "The Attendance Gantt timeline puts every employee on a shared time axis so bottlenecks in coverage are visible at a glance, while Tool Intelligence's adoption-rate and licence-waste data points at where tooling itself is the friction.",
      },
    ],
    facts: [
      'Work Policy — working days, expected hours, check-in time, per-employee targets',
      'Gantt timeline view — shared time axis across the whole team (Professional plan up)',
      'Tool adoption rates and SaaS spend waste alerts',
      'Settings sync to the EXE agent within 1 hour of saving',
    ],
    relatedModules: ['settings', 'attendance'],
    relatedReports: ['Tool Intelligence', 'Work Pulse'],
  },
  {
    slug: 'ai-intelligence',
    icon: 'sparkle',
    label: 'AI Intelligence',
    title: 'Insight cards, not a black box',
    intro:
      "Today, AI Intelligence means every one of the 6 reports auto-generates plain-language insight cards from real activity data. It is not a conversational assistant you can ask arbitrary questions — we'd rather say that plainly than imply it.",
    body: [
      {
        heading: 'What ships today',
        text: 'Each report closes with 3 AI-generated insight cards — flagging peak productivity windows, overwork alerts, coaching recommendations, distraction sources and team-rhythm observations, generated automatically from the same real-time record every other module reads from.',
      },
      {
        heading: 'Where scoring is applied',
        text: 'The same automated analysis layer powers the Org Productivity Score, Focus Score and Burnout & Wellbeing signal — derived metrics, not raw surveillance data, and never shown to an employee\'s peers.',
      },
    ],
    facts: [
      '3 AI-generated insight cards on every report, automatically',
      'Org Productivity Score, Focus Score and Burnout signal are all derived metrics',
      'No manual report writing required',
      'Insight generation reads the same org-scoped record as every other module',
    ],
    relatedModules: ['reports'],
    relatedReports: ['Work Pulse', 'Burnout & Wellbeing', 'Focus Score', 'Tool Intelligence', 'Attendance & Punctuality', 'Team Leaderboard'],
  },
  {
    slug: 'data-platform',
    icon: 'server',
    label: 'Data Platform',
    title: 'The agent, the payloads, and where everything is stored',
    intro:
      "Teemly builds and ships its own desktop agent rather than licensing a third party — because workforce data is too sensitive to route through someone else's SDK.",
    body: [
      {
        heading: 'The EXE agent',
        text: 'A sub-2MB installer for Windows and macOS, code-signed with a Windows EV certificate and notarised for macOS. It captures activity at the OS level every 60 seconds and streams HMAC-SHA256 signed payloads to the API over HTTPS, with offline tracking that syncs once reconnected.',
      },
      {
        heading: 'Storage and retention',
        text: 'Screenshots, video recordings and location data are stored in a private AWS S3 bucket in Mumbai (ap-south-1), served only via signed URLs with a 15-minute expiry. The database is encrypted at rest (AES-256) and lives in a private subnet with no public endpoint. Enterprise clients can deploy MinIO on-premise instead, with the same signed-URL and blur-before-write guarantees.',
      },
    ],
    facts: [
      'Own EXE agent — no third-party monitoring SDK, Windows & macOS',
      'HMAC-SHA256 signed payloads with replay-attack prevention',
      'AWS S3 (Mumbai, ap-south-1) for cloud plans · MinIO on-premise for Enterprise',
      'AES-256 encryption at rest, TLS 1.2 minimum in transit',
    ],
    relatedModules: ['settings'],
    relatedReports: [],
  },
  {
    slug: 'integrations',
    icon: 'puzzle',
    label: 'Integrations',
    title: 'API access and clean exports — not a partner logo wall',
    intro:
      "We are not publishing a list of named integration partners until we have verified ones to show. Here is exactly what ships today instead.",
    body: [
      {
        heading: 'What exists now',
        text: 'Teams, Attendance, Location and Audit log data all export to CSV. Every report exports to both CSV and Excel (.xlsx). API access for integrations is available on the Premium and Enterprise plans.',
      },
      {
        heading: 'Built to connect, when it is verified',
        text: "The agent's own signed-payload architecture (HMAC-SHA256, HTTPS, org-scoped) is the same pattern any future integration would need to meet. We'd rather ship that honestly than list connectors that don't exist yet.",
      },
    ],
    facts: [
      'CSV export — Teams, Attendance, Location, Audit logs',
      'Report export — CSV and Excel (.xlsx) on every report',
      'API access for integrations — Premium and Enterprise plans',
      'No named third-party integration partners published yet',
    ],
    relatedModules: [],
    relatedReports: [],
  },
  {
    slug: 'architecture',
    icon: 'cpu',
    label: 'Platform Architecture',
    title: 'How signals become decisions, end to end',
    intro:
      'One continuous path from the desktop agent to the report on a manager\'s screen — no disconnected tools stitched together after the fact.',
    body: [
      {
        heading: 'The real path',
        text: 'EXE Agent (Windows/macOS) → HMAC-signed HTTPS payload → API (JWT auth, RBAC, org-scoped on every query) → PostgreSQL (encrypted) + private S3 (screenshots, video, location, via signed URLs) → Dashboard, Reports and AI insight cards → admin or manager action.',
      },
      {
        heading: 'Principles we can actually stand behind',
        text: 'Secure by design, API-first, privacy-first, and role-aware access are not slogans here — they map directly to the JWT/RBAC middleware, org-scoped database queries, and the Silent Tracking legal gate described on the Security pages.',
      },
    ],
    facts: [
      'Secure by design — RBAC middleware enforced on every API route',
      'Org-scoped — every database query is scoped by org_id from the JWT, never the request body',
      'Privacy-first — Silent Tracking locked behind an explicit legal acknowledgement',
      'Observable — every admin action and every screenshot/recording/location view is logged',
    ],
    relatedModules: [],
    relatedReports: [],
  },
]

export function getPillar(slug) {
  return platformPillars.find((p) => p.slug === slug)
}
