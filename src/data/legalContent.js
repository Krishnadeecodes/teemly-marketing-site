// Legal page content. These pages summarise Teemly's real, verified data-handling
// practices in plain language. They are deliberately NOT presented as finished,
// binding legal agreements — drafting those requires counsel review, not an
// automated rebuild of the marketing site.

export const legalPages = [
  {
    slug: 'privacy',
    label: 'Privacy Policy',
    title: 'Privacy Policy',
    pendingNotice: true,
    sections: [
      {
        heading: 'What this page covers',
        body: 'This is a plain-language summary of how Teemly handles data today, grounded in the same facts published on the Security & Trust pages. It is not a substitute for the formal Privacy Policy, which is being finalised with legal counsel.',
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
        body: 'Employees have the right to access their own data and the right to erasure, which triggers a database soft-delete plus storage cleanup. A grievance officer is published at teemly.io/privacy.',
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
        heading: 'Status of this page',
        body: "Teemly's formal Terms of Service is being finalised with legal counsel and is not yet published. We would rather say that plainly than publish contractual language that hasn't been reviewed.",
      },
      {
        heading: 'What is published today',
        body: 'Plan pricing and what is included at each tier is published in full on the Pricing page. Security and data-handling commitments are published in full on the Security & Trust pages.',
      },
      {
        heading: 'Questions before you sign',
        body: 'If you need contractual terms ahead of a purchase — for procurement or legal review — contact Support and we will provide what is available for your plan.',
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
        heading: 'Status of this page',
        body: "A formal, counsel-reviewed Data Processing Agreement template is available on request for Enterprise customers. This page summarises the data-handling facts it will reference.",
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
