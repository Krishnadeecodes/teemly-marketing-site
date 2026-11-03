// Legal page content: Teemly's real, verified data-handling practices in plain
// language. These are summaries, not the counsel-drafted agreements — replace
// the privacy, terms and DPA sections with the lawyer's text once it is ready.

export const legalPages = [
  {
    slug: 'privacy',
    label: 'Privacy Policy',
    title: 'Privacy Policy',
    pendingNotice: true,
    sections: [
      {
        heading: 'What this page covers',
        body: 'This is a plain-language summary of how Teemly handles data today, grounded in the same facts published on the Security & Trust pages. Questions about this policy can be sent through the Contact page.',
      },
      {
        heading: 'What we collect',
        body: 'App name and window title, website URL and domain, time spent per app and site, screenshots, video recordings and GPS location (each only with admin configuration), check-in/check-out times, and a derived productivity score.',
      },
      {
        heading: 'What we never collect',
        body: 'Keystrokes or typed content, email content, camera or microphone data, personal files, clipboard content, biometric data, or private message content.',
      },
      {
        heading: 'Data residency and retention',
        body: 'All data is stored in AWS Mumbai (ap-south-1). Retention is enforced per plan, with auto-delete at expiry, and video/location retention enforced separately from screenshots.',
      },
      {
        heading: 'Your rights',
        body: 'Employees have the right to access their own data and the right to erasure, which triggers a database soft-delete plus storage cleanup. To exercise these rights or raise a grievance about how your data is handled, contact us through the Contact page (teemly.co/company/contact) and we will respond within the timelines required by the DPDP Act.',
      },
    ],
  },
  {
    slug: 'terms',
    label: 'Terms of Service',
    title: 'Terms of Service',
    pendingNotice: true,
    sections: [
      {
        heading: 'About this page',
        body: "This page summarises what governs your use of Teemly. Contractual terms for your plan are provided with your order; contact us if you need them for procurement or legal review.",
      },
      {
        heading: 'What is published today',
        body: 'Plan pricing and what is included at each tier is published in full on the Pricing page. Security and data-handling commitments are published in full on the Security & Trust pages.',
      },
      {
        heading: 'Questions before you sign',
        body: 'If you need contractual terms ahead of a purchase — for procurement or legal review — contact us and we will send them for your plan.',
      },
    ],
  },
  {
    slug: 'cookie-policy',
    label: 'Cookie Policy',
    title: 'Cookie Policy',
    pendingNotice: false,
    sections: [
      {
        heading: 'This website',
        body: 'This marketing website does not set tracking or advertising cookies.',
      },
      {
        heading: 'The Teemly product',
        body: 'The Teemly application (separate from this website) uses a single authentication cookie — a 7-day, HTTP-only, Secure, SameSite=Strict refresh token — to keep admins and managers signed in. It is not used for tracking or advertising.',
      },
    ],
  },
  {
    slug: 'dpa',
    label: 'Data Processing Agreement',
    title: 'Data Processing Agreement',
    pendingNotice: true,
    sections: [
      {
        heading: 'About this page',
        body: "A Data Processing Agreement is available on request for Enterprise customers. This page summarises the data-handling commitments it covers.",
      },
      {
        heading: 'Sub-processors',
        body: 'Published sub-processors: AWS, Vercel, Datadog and Sentry.',
      },
      {
        heading: 'Breach notification',
        body: 'Data breach notification follows the 72-hour DPDP obligation.',
      },
      {
        heading: 'Storage and residency',
        body: 'Data is stored in AWS Mumbai (ap-south-1) for cloud plans, with a full on-premise option (MinIO) available for Enterprise customers who cannot use third-party cloud storage.',
      },
    ],
  },
  {
    slug: 'acceptable-use',
    label: 'Acceptable Use',
    title: 'Acceptable Use',
    pendingNotice: false,
    sections: [
      {
        heading: 'Customer responsibility',
        body: 'Customers are responsible for using Silent Tracking, screenshots, video recording and location tracking in compliance with local employee-monitoring and consent laws in their jurisdiction.',
      },
      {
        heading: 'The Silent Tracking gate',
        body: 'Silent Tracking is deliberately locked behind an explicit legal acknowledgement in the product — an admin must confirm they have met local consent requirements before it can be enabled.',
      },
      {
        heading: 'Employee notice',
        body: 'A privacy notice is shown at EXE installation, before any tracking begins, regardless of configuration.',
      },
    ],
  },
]

export function getLegalPage(slug) {
  return legalPages.find((p) => p.slug === slug)
}
