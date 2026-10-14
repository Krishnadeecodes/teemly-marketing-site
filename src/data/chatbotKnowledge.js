// Teemly Guide — rule-based chatbot knowledge.
// Every answer is sourced from content already published on the site
// (src/data/*, Pricing page FAQs). Pricing is generated from plans.js so it
// never drifts from the Pricing page.
//
// Each intent:
//   id        unique key (used by followUps)
//   label     question text shown on suggestion chips
//   keywords  words / phrases that trigger it (words also match as prefixes,
//             so 'pric' matches price, pricing, priced)
//   text      answer paragraph(s)
//   bullets   optional list shown under the answer
//   links     optional buttons that navigate to a page
//   followUps optional intent ids offered as next questions
import { plans } from './plans.js'

const priceLines = plans.map((p) =>
  typeof p.usd === 'number'
    ? `${p.name} — $${p.usd}/seat/month (≈ ₹${p.inr}) · ${p.features[0].toLowerCase()}`
    : `${p.name} — custom pricing · ${p.features[0].toLowerCase()}`,
)

export const intents = [
  {
    id: 'greeting',
    label: 'Hi',
    keywords: ['hi', 'hello', 'hey', 'hii', 'good morning', 'good afternoon', 'good evening', 'namaste'],
    text: 'Hi there! Ask me anything about Teemly — pricing, privacy, how the agent works, or which plan fits your team.',
    followUps: ['what-is-teemly', 'pricing', 'privacy', 'demo'],
  },
  {
    id: 'what-is-teemly',
    label: 'What is Teemly?',
    keywords: ['what is teemly', 'about teemly', 'what does teemly', 'teemly do', 'explain', 'overview', 'how does it work', 'how it works', 'introduce'],
    text:
      'Teemly is a workforce intelligence platform. Our own lightweight desktop agent captures work activity, and the platform turns it into real-time visibility into productivity, attendance and work patterns — with privacy controls employees can actually use.',
    links: [
      { label: 'Why Teemly', to: '/why-teemly' },
      { label: 'See the platform', to: '/platform' },
    ],
    followUps: ['modules', 'agent', 'pricing'],
  },
  {
    id: 'pricing',
    label: 'How much does it cost?',
    keywords: ['pric', 'cost', 'how much', 'plans', 'plan', 'subscription', 'per seat', 'per user', 'per month', 'cheap', 'expensive', 'budget', 'rupee', 'inr', 'usd', 'dollar', 'starter', 'professional', 'premium', 'billing', 'fee', 'charges', 'rate'],
    text: 'Teemly is priced per seat, per month:',
    bullets: [...priceLines, 'Yearly billing saves 15%.'],
    links: [{ label: 'See full pricing', to: '/pricing' }],
    followUps: ['trial', 'compare-plans', 'enterprise'],
  },
  {
    id: 'compare-plans',
    label: 'Which plan should I choose?',
    keywords: ['which plan', 'best plan', 'compare', 'comparison', 'difference between', 'right plan', 'choose', 'recommend', 'suitable'],
    text: 'A quick way to choose:',
    bullets: [
      'Starter — first-time visibility for small teams: dashboard, teams, screenshots and attendance.',
      'Professional — adds video recording, location tracking, privacy blur, audit logs and AI insights.',
      'Premium — the full intelligence suite: Burnout & Wellbeing, Focus Score, Team Leaderboard and API access.',
      'Enterprise — unlimited employees, custom retention, on-premise option and a dedicated account manager.',
    ],
    links: [
      { label: 'Compare plans', to: '/pricing' },
      { label: 'ROI calculator', to: '/roi-calculator' },
    ],
    followUps: ['pricing', 'trial', 'demo'],
  },
  {
    id: 'trial',
    label: 'Is there a free trial?',
    keywords: ['trial', 'free', 'try', 'credit card', 'test it', 'try it'],
    text:
      'Yes — every plan starts with a free trial and no credit card is required. Invite your team and Teemly starts reporting from day one.',
    links: [
      { label: 'View plans', to: '/pricing' },
      { label: 'Book a demo', to: '/book-a-demo' },
    ],
    followUps: ['pricing', 'agent'],
  },
  {
    id: 'enterprise',
    label: 'Do you have an Enterprise plan?',
    keywords: ['enterprise', 'large company', 'big team', 'unlimited', 'on-prem', 'on prem', 'onprem', 'premise', 'self host', 'self-host', 'minio', 'dedicated', 'custom quote'],
    text:
      'Yes. Enterprise includes unlimited employees, custom intervals and retention across every module, unlimited custom roles, a dedicated account manager and a 4-hour support SLA. Full on-premise deployment (using MinIO) is available when data cannot leave your premises.',
    links: [
      { label: 'Talk to sales', to: '/company/contact' },
      { label: 'Enterprise industry page', to: '/industries/enterprise' },
    ],
    followUps: ['data-storage', 'compliance', 'demo'],
  },
  {
    id: 'demo',
    label: 'Can I book a demo?',
    keywords: ['demo', 'walkthrough', 'call', 'meeting', 'schedule', 'book', 'presentation', 'show me'],
    text:
      'Of course. Book a guided walkthrough and we will schedule a call — most demos are set up within one business day. You will see the desktop agent, the real-time dashboard, privacy controls and all modules in your context.',
    links: [
      { label: 'Book a demo', to: '/book-a-demo' },
      { label: 'Take a self-guided tour', to: '/take-a-tour' },
    ],
    followUps: ['pricing', 'contact'],
  },
  {
    id: 'tour',
    label: 'Can I see the product without a call?',
    keywords: ['tour', 'self guided', 'self-guided', 'screenshots of product', 'see the product', 'preview', 'look around'],
    text: 'Yes — Take a Tour gives you a self-guided look at the product, no call needed.',
    links: [{ label: 'Take a tour', to: '/take-a-tour' }],
    followUps: ['demo', 'modules'],
  },
  {
    id: 'contact',
    label: 'How do I contact the team?',
    keywords: ['contact', 'talk to', 'speak', 'human', 'person', 'sales', 'email', 'reach', 'phone', 'call you', 'representative', 'get in touch'],
    text:
      'You can reach a real person through the contact form or by email at hello@teemly.app. We reply within one business day.',
    links: [
      { label: 'Contact us', to: '/company/contact' },
      { label: 'Book a demo', to: '/book-a-demo' },
    ],
    followUps: ['demo', 'support'],
  },
  {
    id: 'support',
    label: 'How does support work?',
    keywords: ['support', 'help desk', 'helpdesk', 'sla', 'issue', 'problem with', 'not working', 'bug', 'ticket', 'customer service'],
    text: 'Support response times depend on your plan:',
    bullets: ['Starter — email support', 'Professional — 48-hour SLA', 'Premium — 24-hour SLA', 'Enterprise — 4-hour SLA with a dedicated account manager'],
    links: [{ label: 'Support centre', to: '/support' }],
    followUps: ['contact', 'pricing'],
  },
  {
    id: 'privacy',
    label: 'Does this feel like surveillance?',
    keywords: ['privacy', 'private', 'surveillance', 'spy', 'spying', 'creepy', 'invasive', 'trust', 'ethical', 'privacy mode', 'pause', 'blur', 'employee consent', 'consent'],
    text:
      'Privacy is enforced in the product, not just promised. Employees can turn on Privacy Mode to pause all tracking — including location and video — and admins cannot override it. Screenshot and video blur hide content while keeping activity metadata, and a privacy notice is shown at install before any tracking begins.',
    links: [
      { label: 'Data privacy', to: '/security/data-privacy' },
      { label: 'Security & trust', to: '/security' },
    ],
    followUps: ['data-collected', 'silent-tracking', 'compliance'],
  },
  {
    id: 'data-collected',
    label: 'What data does Teemly collect?',
    keywords: ['what data', 'collect', 'track', 'tracking', 'monitor', 'keystroke', 'keylogger', 'keylog', 'camera', 'microphone', 'webcam', 'clipboard', 'email content', 'messages', 'chats', 'read my'],
    text: 'Teemly collects work-activity signals — app and window names, website URLs, time per app, check-in/out times, and (if your admin enables them) screenshots, video and GPS.',
    bullets: [
      'Never collected: keystrokes or typed content',
      'Never collected: email, chat or private message content',
      'Never collected: camera, microphone or clipboard data',
      'Never collected: personal files or biometric data',
    ],
    links: [{ label: 'What we collect', to: '/security/data-privacy' }],
    followUps: ['privacy', 'security', 'agent'],
  },
  {
    id: 'silent-tracking',
    label: 'What is Silent Tracking?',
    keywords: ['silent tracking', 'silent', 'stealth', 'invisible', 'hidden', 'without knowing', 'secretly', 'covert'],
    text:
      'Silent Tracking is invisible monitoring, and it is the one feature we deliberately make hard to turn on. It stays locked behind a mandatory legal consent gate, and every sensitive view is logged in the audit trail.',
    links: [{ label: 'Governance', to: '/security/governance' }],
    followUps: ['privacy', 'compliance'],
  },
  {
    id: 'security',
    label: 'How secure is my data?',
    keywords: ['secur', 'safe', 'encrypt', 'hack', 'breach', 'protect', 'access control', 'rbac', 'role', 'permission', 'audit', 'waf', 'firewall'],
    text:
      'Data is encrypted at rest and in transit at every layer — database, file storage and agent payloads. Access control is role-based and organisation-scoped on every API request, sensitive views are written to an audit log, and the infrastructure runs in private subnets behind a WAF with rotating secrets.',
    links: [
      { label: 'Security overview', to: '/security' },
      { label: 'Encryption', to: '/security/encryption' },
      { label: 'Trust centre', to: '/trust-center' },
    ],
    followUps: ['compliance', 'data-storage', 'privacy'],
  },
  {
    id: 'compliance',
    label: 'Are you GDPR / DPDP compliant?',
    keywords: ['gdpr', 'dpdp', 'complian', 'iso', '27001', 'soc', 'soc2', 'soc 2', 'certif', 'regulation', 'legal', 'law', 'audit report'],
    text: 'We publish exactly where certification stands today:',
    bullets: [
      'GDPR — architecture compliant (data minimisation, right-to-erasure by design)',
      'DPDP Act (India) — policies and consent flows in place, formal certification in progress',
      'ISO 27001 — on the Phase 2 roadmap',
      'SOC 2 Type II — planned for Phase 2, for Enterprise clients',
      'Data breach notification within the 72-hour DPDP obligation',
    ],
    links: [{ label: 'Compliance details', to: '/security/compliance' }],
    followUps: ['data-storage', 'security'],
  },
  {
    id: 'data-storage',
    label: 'Where is my data stored?',
    keywords: ['where is', 'stored', 'storage', 'data residency', 'residency', 'server', 'aws', 'cloud', 'region', 'india', 'mumbai', 'host', 'retention', 'delete', 'erasure', 'how long'],
    text:
      'Cloud plans store data in AWS Mumbai (ap-south-1), giving India data residency. Enterprise customers can deploy fully on-premise with MinIO. Retention is enforced per plan with automatic deletion at expiry, and employees can request erasure of their data.',
    links: [
      { label: 'Data platform', to: '/platform/data-platform' },
      { label: 'Infrastructure', to: '/security/infrastructure' },
    ],
    followUps: ['compliance', 'enterprise'],
  },
  {
    id: 'agent',
    label: 'How does the desktop agent work?',
    keywords: ['agent', 'exe', 'install', 'download', 'setup', 'set up', 'windows', 'mac', 'macos', 'linux', 'desktop', 'software', 'application', 'lightweight', 'performance', 'slow'],
    text:
      'Teemly runs on its own desktop agent — not a licensed third-party plugin. It is a sub-2MB installer for Windows and macOS, code-signed with a Windows EV certificate and notarised for macOS. It sends signed, encrypted payloads to the platform, and shows a privacy notice at install before tracking begins.',
    links: [
      { label: 'Our own agent', to: '/why-teemly/difference' },
      { label: 'Data platform', to: '/platform/data-platform' },
    ],
    followUps: ['data-collected', 'privacy', 'trial'],
  },
  {
    id: 'modules',
    label: 'What features are included?',
    keywords: ['feature', 'module', 'what can', 'capabilit', 'functionality', 'includes', 'offer', 'product'],
    text: 'Teemly is built around 8 modules:',
    bullets: ['Dashboard', 'Teams', 'Screenshots', 'Video Recording', 'Location Tracking', 'Attendance', 'Reports (6 AI-powered reports)', 'Settings'],
    links: [{ label: 'Explore the product', to: '/product' }],
    followUps: ['reports', 'screenshots', 'attendance'],
  },
  {
    id: 'screenshots',
    label: 'How do screenshots work?',
    keywords: ['screenshot', 'screen shot', 'screen capture', 'interval', 'how often'],
    text: 'Screenshots are captured automatically, with privacy blur available. Interval and retention depend on the plan:',
    bullets: [
      'Starter — every 5 minutes · 30-day retention',
      'Professional — every 2 minutes · 90-day retention',
      'Premium — every 1 minute · 180-day retention',
      'Enterprise — custom interval and retention',
    ],
    links: [{ label: 'Screenshots module', to: '/product/screenshots' }],
    followUps: ['video', 'privacy'],
  },
  {
    id: 'video',
    label: 'Can Teemly record video?',
    keywords: ['video', 'screen record', 'recording'],
    text:
      'Yes — Video Recording gives a continuous visual audit without manual review, with blur available. It is included from Professional (7-day retention) and Premium (30-day retention); Enterprise retention is custom. It is not part of Starter.',
    links: [{ label: 'Video Recording module', to: '/product/video-recording' }],
    followUps: ['screenshots', 'location', 'pricing'],
  },
  {
    id: 'location',
    label: 'Does it track location?',
    keywords: ['location', 'gps', 'field team', 'field staff', 'geo', 'map', 'where are'],
    text:
      'Location Tracking gives GPS visibility for remote, hybrid and field teams, when enabled by your admin. It is included from Professional (30-day retention) and Premium (90-day retention). Privacy Mode pauses location too.',
    links: [{ label: 'Location Tracking module', to: '/product/location-tracking' }],
    followUps: ['attendance', 'privacy'],
  },
  {
    id: 'attendance',
    label: 'How is attendance calculated?',
    keywords: ['attendance', 'check in', 'check-in', 'checkin', 'check out', 'punch', 'late', 'absent', 'present', 'timesheet', 'working hours', 'hours worked', 'punctual'],
    text:
      'Attendance is derived from activity, not typed in. Check-in is the first agent activity of the day and check-out is the last. If no activity is received on a working day, the employee is marked absent. The Attendance & Punctuality report is on every plan.',
    links: [{ label: 'Attendance module', to: '/product/attendance' }],
    followUps: ['reports', 'location'],
  },
  {
    id: 'reports',
    label: 'What reports do I get?',
    keywords: ['report', 'analytics', 'insight', 'burnout', 'wellbeing', 'focus score', 'leaderboard', 'work pulse', 'tool intelligence', 'productivity score', 'heat map', 'dashboard'],
    text: 'Six reports, each built to end in a decision — at org, team or employee level:',
    bullets: [
      'Attendance & Punctuality — every plan',
      'Work Pulse — peak productivity windows and distraction sources (Professional+)',
      'Tool Intelligence — where time goes, plus underused-licence cost alerts (Professional+)',
      'Burnout & Wellbeing — flags overworked and at-risk employees (Premium+)',
      'Focus Score — uninterrupted streaks and context switches (Premium+)',
      'Team Leaderboard — rankings, 4-week trends and coaching callouts (Premium+)',
    ],
    links: [{ label: 'Reports module', to: '/product/reports' }],
    followUps: ['ai', 'integrations'],
  },
  {
    id: 'ai',
    label: 'Does Teemly use AI?',
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'smart', 'gpt', 'automat', 'insight card'],
    text:
      'Yes — every report closes with AI-generated, plain-language insight cards that flag peak productivity windows, overwork alerts, coaching opportunities and distraction sources. AI insights are available from the Professional plan, built on the same security foundation as the rest of the platform.',
    links: [
      { label: 'AI intelligence', to: '/platform/ai-intelligence' },
      { label: 'AI security', to: '/security/ai-security' },
    ],
    followUps: ['reports', 'security'],
  },
  {
    id: 'integrations',
    label: 'Does it integrate with other tools?',
    keywords: ['integrat', 'api', 'export', 'csv', 'excel', 'xlsx', 'connect', 'slack', 'jira', 'hrms', 'payroll', 'zapier', 'webhook'],
    text:
      'Teams, Attendance, Location and Audit log data export to CSV, and every report exports to CSV and Excel. API access for integrations is available on the Premium and Enterprise plans.',
    links: [{ label: 'Integrations', to: '/platform/integrations' }],
    followUps: ['pricing', 'reports'],
  },
  {
    id: 'roi',
    label: 'What ROI can I expect?',
    keywords: ['roi', 'return on investment', 'worth it', 'save money', 'savings', 'value', 'benefit', 'business impact', 'payback'],
    text:
      'Teemly shows value through recovered productive hours, fewer unused software licences (Tool Intelligence attaches the monthly cost), and earlier burnout signals. Use the ROI calculator to estimate it for your team size.',
    links: [
      { label: 'ROI calculator', to: '/roi-calculator' },
      { label: 'Business impact', to: '/why-teemly/business-impact' },
    ],
    followUps: ['pricing', 'demo'],
  },
  {
    id: 'industries',
    label: 'Which industries do you serve?',
    keywords: ['industr', 'sector', 'technology company', 'it company', 'bank', 'financial services', 'healthcare', 'hospital', 'manufactur', 'factory', 'professional services', 'agency', 'consult'],
    text: 'Teemly is used across:',
    bullets: ['Technology', 'Financial Services', 'Healthcare', 'Manufacturing', 'Professional Services', 'Enterprise'],
    links: [{ label: 'Industries', to: '/industries' }],
    followUps: ['solutions', 'demo'],
  },
  {
    id: 'solutions',
    label: 'How does Teemly help my role?',
    keywords: ['hr', 'human resource', 'manager', 'executive', 'ceo', 'founder', 'operations', 'finance team', 'it team', 'remote team', 'hybrid', 'work from home', 'wfh', 'team lead', 'use case', 'workforce planning', 'capacity planning'],
    text: 'Teemly has dedicated solutions for each team:',
    bullets: [
      'Executives — organisation-wide visibility',
      'HR — workforce health, attendance and experience',
      'Managers — team capacity and coaching opportunities',
      'Operations — where process friction happens',
      'IT — tool adoption and SaaS waste',
      'Finance — workforce hours and tool spend for planning',
    ],
    links: [{ label: 'Explore solutions', to: '/solutions' }],
    followUps: ['industries', 'roi'],
  },
  {
    id: 'careers',
    label: 'Are you hiring?',
    keywords: ['career', 'job', 'hiring', 'vacanc', 'opening', 'work at teemly', 'join', 'internship', 'resume'],
    text: 'Check our careers page for current openings at Teemly.',
    links: [{ label: 'Careers', to: '/company/careers' }],
    followUps: ['contact'],
  },
  {
    id: 'partners',
    label: 'Do you have a partner program?',
    keywords: ['partner', 'reseller', 'affiliate', 'referral', 'resell'],
    text: 'Yes — see the partners page for how to work with Teemly.',
    links: [{ label: 'Partners', to: '/company/partners' }],
    followUps: ['contact'],
  },
  {
    id: 'thanks',
    label: 'Thanks',
    keywords: ['thank', 'thanks', 'thx', 'great', 'awesome', 'helpful', 'cool', 'perfect', 'ok', 'okay'],
    text: 'Happy to help! Anything else you would like to know?',
    followUps: ['pricing', 'demo', 'contact'],
  },
  {
    id: 'bye',
    label: 'Bye',
    keywords: ['bye', 'goodbye', 'see you', 'later', 'that is all', "that's all"],
    text: 'Thanks for stopping by! If you would like a walkthrough, you can book a demo any time.',
    links: [{ label: 'Book a demo', to: '/book-a-demo' }],
  },
]

export const welcome = {
  text: "Hi, I'm the Teemly Guide. Ask me about pricing, privacy, features or how the agent works — or pick a question below.",
  followUps: ['what-is-teemly', 'pricing', 'privacy', 'trial', 'demo'],
}

export const fallback = {
  text: "Sorry, I didn't quite get that. Try asking about pricing, privacy, features or security — or our team can answer directly.",
  links: [
    { label: 'Contact us', to: '/company/contact' },
    { label: 'Book a demo', to: '/book-a-demo' },
  ],
  followUps: ['what-is-teemly', 'pricing', 'modules', 'security'],
}
