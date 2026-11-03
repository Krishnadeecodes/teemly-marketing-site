# QC — teemly.co audit fixes

Last updated: 3 Nov 2026 · Branch: `audit-fixes`

Source: Claude browser-extension audit of teemly.co (security, SEO, content, legal).
The fixes are split into **Part B** (done in code) and **Part A** (needs the owner's input or server access).

---

## Status at a glance

| Area | Status |
|---|---|
| SEO: page titles, 404s, robots, sitemap, security.txt | ✅ Done (in code, not deployed) |
| Headings running words together | ✅ Done |
| Content contradictions (third-party, SOC 2, Phase 2, teemly.io, $→₹) | ✅ Done |
| Empty Resources sections | ✅ Hidden automatically |
| nginx security headers | 🟡 Config written, **must be applied on the server** |
| Turnstile spam check, Sentry | 🟡 Built in, **off until keys are added** |
| Legal pages (Privacy, Terms, DPA) | 🔴 Waiting on lawyer |
| Grievance officer, company details, roles, trial, spelling… | 🔴 Waiting on owner's answers (Part A) |

---

## Part B — done (what changed)

### SEO & 404
- [x] Server writes each page's `<title>`, description, canonical link and full-URL og:/twitter: tags into the HTML before sending it — `server/seo.js`
- [x] Title table: `src/data/seoStatic.js` (browser) + `src/data/seoMeta.js` (server)
- [x] Unknown URLs return **404** (was 200 + homepage)
- [x] `/about` → `/company/about`, `/contact` → `/company/contact` (301)
- [x] `/robots.txt`, `/sitemap.xml` (static pages + published resources), `/.well-known/security.txt`
- [x] Every page has its own title (≈20 pages were missing one); default title is "Organizational Intelligence Platform"
- [x] `index.html`: og:image is a full URL, title/description match the homepage
- [x] Split headings use real spaces → read as sentences — `SplitHeading.jsx`, `Hero.jsx`, CSS

### Content
- [x] "No third-party dependency/tools" → "no third-party monitoring software/SDK" — `About.jsx`, `Contact.jsx`
- [x] Removed "Phase 1/2" and "formal certification"; SOC 2 & ISO 27001 = "Planned"; DPDP/GDPR = "Aligned" — `securityTopics.js`, `chatbotKnowledge.js`, `Pricing.jsx`
- [x] `teemly.io/privacy` removed — `securityTopics.js`, `legalContent.js`, `TrustCenter.jsx`
- [x] Legal-page "not counsel-reviewed / being finalised" wording replaced — `legalContent.js`, `LegalPage.jsx`
- [x] ROI teaser $45,000 → ₹8,00,000; ROI calculator opens in ₹ — `ROITeaser.jsx`, `ROICalculator.jsx`
- [x] Empty resource categories left out of menu, hub and sitemap — `server/resources.js`, `navigation.js`, `resourcesApi.js`
- [x] "Use Cases" link → `/solutions` (was empty Case Studies)

### Security
- [x] `deploy/nginx/teemly.conf`: HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, nosniff, `server_tokens off`, http→https, rate limits on `/api/`
- [x] `X-Powered-By` removed — `server/index.js`
- [x] Cloudflare Turnstile on contact, demo, tour, chatbot and gated-download forms — `src/lib/turnstile.js`, `server/turnstile.js` (off until keys set)
- [x] Sentry for the public site — `src/main.jsx` (off until DSN set; added `@sentry/react`)

### Verified locally
- [x] `npm run build` passes
- [x] Titles correct on /, /pricing, /company/about, /product/teams, /security/compliance, /resources/*
- [x] /nope, /product/nope, /resources/nope → 404; /assets/missing.js → 404
- [x] robots.txt, sitemap.xml (93 URLs), security.txt served
- [x] Headings read correctly in a real browser; no console errors besides the intended 404

---

## ⚠️ Check before going live
- [ ] **Legal wording I wrote** — Terms page says contract terms "are provided with your order"; DPA page says "available on request for Enterprise". Change if not true.
- [ ] **Turnstile** — set `VITE_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` **together**, or every form submission fails.
- [ ] **CSP** — after applying nginx, click through home, a resource with a video, the contact form and /admin with the console open; add any blocked domain to the CSP line.
- [ ] Review the diff on branch `audit-fixes` and merge into `master`.

---

## Part A — waiting on the owner

### Answers needed (send these and the code changes take ~1 hour)
- [ ] **A1** Grievance officer name + email (Privacy & Compliance pages)
- [ ] **A2** Legal entity name, registered address, GSTIN (footer)
- [ ] **A3** Professional plan: **2 or 5** custom roles? (`plans.js` says 5, `comparison.js` says 2)
- [ ] **A4** Free trial: build signup/login, or change buttons to "Book a demo"? Login URL for existing customers?
- [ ] **A5** Spelling: British ("organisation") or American ("organization")?
- [ ] **A6** Score name: "Org Productivity Score" or "Org Intelligence Score"?
- [ ] **A7** Analytics: Plausible (no cookie banner) or GA4 (needs banner)?
- [ ] **A8** Security contact email (for security.txt — currently `security@teemly.co`)
- [ ] **A9** Optional: one pilot customer quote, or founder/Deecodes lines for the Customers page

### Owner's tasks
- [ ] **A10** Lawyer drafts real Privacy Policy, Terms, DPA, Cookie Policy (slowest — start first)
- [ ] **A11** Apply `deploy/nginx/teemly.conf` on the server (`sudo nginx -t && sudo systemctl reload nginx`)
- [ ] **A12** Accounts: Google Search Console, Plausible/GA4, Cloudflare Turnstile keys, Sentry DSN, uptime/status page
- [ ] **A13** Send a test lead through the contact form; confirm it reaches the inbox/CRM
- [ ] **A14** After deploy: securityheaders.com, SSL Labs, PageSpeed Insights, re-run the extension audit

---

## How to deploy
See `deploy/README.md` (new `.env` settings, `npm install && npm run build`, restart, nginx, post-deploy curl checks).
