# QC — teemly.co audit fixes

Last updated: 4 Nov 2026 · Branch: `master` (audit fixes are pushed; the Part A answers below are not committed yet)

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
| Roles, trial buttons, spelling, score name, Plausible, contact emails | ✅ Done in code, not committed or deployed |
| Plausible analytics | 🟡 Built in, **off until `VITE_PLAUSIBLE_DOMAIN` is set** |
| Text stored in the database (glossary, categories, resources) | 🔴 Still British/old wording; needs a decision |
| Company details, grievance officer name, customer login URL | 🔴 Waiting on owner's answers (Part A) |

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
- [ ] Commit `5102f8c` (marked WIP, Resources wording) is on `master`: check it before deploying.
- [ ] **Temporary contacts** — grievance and security both use `info@teemly.co` for now.

---

## Part A — waiting on the owner

### Answers
- [ ] **A1** Grievance officer: `info@teemly.co` is live on the Privacy & Compliance pages for now. **Name still needed**; email to change later
- [ ] **A2** Legal entity name, registered address, GSTIN (footer) — skipped for now
- [x] **A3** Professional plan = **2** custom roles — `plans.js`, `chatbotPlans.js`
- [x] **A4** Trial buttons → "Book a Demo" (`/book-a-demo`); Pricing FAQ, chatbot and final CTA reworded. **Login URL for existing customers still needed**
- [x] **A5** American spelling across site code. Database text not done (see status table)
- [x] **A6** "Org Intelligence Score" for the org-level score. Per-employee "productivity score" unchanged
- [x] **A7** Plausible built in — `src/main.jsx`, CSP in `deploy/nginx/teemly.conf`, Cookie Policy
- [x] **A8** Security contact = `info@teemly.co` (temporary) — `server/seo.js`, `Support.jsx`
- [ ] **A9** Optional: one pilot customer quote, or founder/Deecodes lines for the Customers page

### Owner's tasks
- [ ] **A10** Lawyer drafts real Privacy Policy, Terms, DPA, Cookie Policy (slowest — start first)
- [ ] **A11** Apply `deploy/nginx/teemly.conf` on the server (`sudo nginx -t && sudo systemctl reload nginx`)
- [ ] **A12** Accounts: Google Search Console, Plausible (add the site, then set `VITE_PLAUSIBLE_DOMAIN=teemly.co` and rebuild), Cloudflare Turnstile keys, Sentry DSN, uptime/status page
- [ ] **A13** Send a test lead through the contact form; confirm it reaches the inbox/CRM
- [ ] **A14** After deploy: securityheaders.com, SSL Labs, PageSpeed Insights, re-run the extension audit

---

## How to deploy
See `deploy/README.md` (new `.env` settings, `npm install && npm run build`, restart, nginx, post-deploy curl checks).
