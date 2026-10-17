# Home page redesign: change log

All changes below are uncommitted on `master`. Run `npm run build` (already done) and restart the server to see them.

---

## 1. One shared Teemly logo

- **New single source:** `src/brand/logo.js`. The T mark and the "teemly" wordmark are traced from `teemly.jpg.jpeg` as SVG. The wordmark has slightly wider letter spacing so it reads clearly at small sizes.
- **`<Logo />` component** (`src/components/Logo.jsx`), with these options:
  - `variant="full"` (T plus wordmark) or `"mark"` (T only)
  - `size`: `sm`, `md`, `lg` or a pixel height
  - `tone`: `dark` or `light`
- **Used everywhere:** header (34px tall), footer, chatbot, admin sidebar, admin login, hero dashboard, home page sections and cards.
- **Removed:** the old JPG logo (`src/assets/teemly-logo.jpg`), plus duplicate inline T drawings in the Hero, Problem and Integrations sections and the admin "T" letter.
- **Generated files:** `npm run brand` (`scripts/build-brand-assets.mjs`) writes the following from the single source:
  - `public/favicon.svg`
  - into `public/brand/`: `teemly-mark.svg`, `teemly-logo.svg`, `teemly-logo-light.svg`, `teemly-logo.png`, `apple-touch-icon.png` and `og-image.png`
- **Emails and sharing:**
  - The confirmation email now shows the logo (`server/index.js`).
  - The social-share (OG) image and the iPhone home-screen icon are set in `index.html` and `useSEO.js`.

## 2. One module list

- **New file:** `src/data/modules.js` holds the 8 product modules: Dashboard, Teams, Screenshots, Video Recording, Location Tracking, Attendance, Reports and Settings.
- **Where it's used:** "How Teemly Works", the quick facts, the `/product` page, the `/product/:slug` pages (via `moduleContent.js`) and the hero dashboard sidebar.

## 3. Hero

- **Scroll cue removed:** the "Scroll" mouse icon is gone, including its CSS and animation.
- **The "Sales team pulse" card is replaced** by a full Teemly dashboard (`src/components/HeroDashboard.jsx`, `src/home/heroDashboard.css`), modelled on `dashboard-ui.png`:
  - **Sidebar and top bar:** sidebar with the T logo and module icons; top bar with search, Live and the "SM" avatar.
  - **Greeting:** "Good morning, Sam · All teams · Last 30 days".
  - **Stat cards:**
    - Time worked 1,057h ↑8% vs last month
    - Idle time 19h ↓10% vs last month (red)
    - Productivity 78%
    - Online now 89/128
  - **Teemly AI insight strip.**
  - **Activity by month:** jagged line chart peaking at 81%, with a white "● 81%" tooltip and a dashed marker.
  - **Other panels:** top apps, time worked this week, and a live activity table.
- **Floating cards removed:** the "Intelligence" and "Outcome" cards that floated over the old card.
- **"Interactive · Illustrative example" tag removed.**
- **Wider hero:**
  - The hero (and the header on the home page) uses up to 1480px of width.
  - The whole dashboard fits on the first screen at 1920×1080, 1440×900, 1366×768 and 1280×720.
  - Below 1100px wide, the text and dashboard stack.

## 4. Marquee (scrolling strip under the hero)

- **Separator:** the shared T logo, with a gentle bob and glow.
- **Text:** bolder words, alternating navy and brand-gradient with a slow shimmer.
- **Motion:** words fade in and out at the edges, the strip pauses on hover, and reduced motion is supported.

## 5. "Three things connecting" (Problem section)

- **Layout:** People and Work cards on top, the T in the exact centre, Technology below.
- **Lines:** measured from the real card positions, so they start and end on the cards and the T, with a moving signal pulse.
- **The T:** a white circle with a soft brand glow and a gentle float.

## 6. Teemly model

- **Fits the screen:** the section is one screen tall while pinned and starts below the header. It fits from 1920×1080 down to 1280×720.
- **Cards:** product-style cards with a step badge (01–06), the T logo, an accent colour and a hover lift.
- **Product screen per card:**
  - Collect: live signals feed
  - Connect: organisation tree
  - Understand: focus report
  - Advise: recommendation with Accept / Dismiss buttons
  - Act: action plan with 2 of 3 tasks done
  - Improve: outcome compared with the baseline

## 7. Platform

- **Scroll story kept:** the cards on the left take turns being active, and a sticky preview on the right changes with them.
- **Preview:** a dashboard in the same style as the hero (`src/components/PlatformDashboard.jsx`), with content for each topic:
  - Organizational: stat cards, score ring and trend
  - Workforce: teams ranked by productivity
  - Work: top apps and websites
  - Workflow: attendance timeline
  - AI: report insights
- **Equal sizes:** all left cards are the same height, and the dashboard has a fixed size.
- **Calmer scrolling:** there's more scroll distance per card, so it changes less often.
- **Switching fix:** the active card is always the one nearest the middle of the screen, so the preview can't get stuck on the wrong topic.
- **Tablets and phones:** each card shows its own preview inline.

## 8. Solutions

- **Content unchanged.**
- **Auto-scroll:** the cards scroll slowly on their own at 45px a second, in a seamless loop, moved with a GPU transform so there's no lag.
- **Pauses:** on hover, focus, drag or the arrows, while off screen, and for visitors with reduced motion.

## 9. How Teemly Works

- **App window:** sidebar with the logo and all 8 modules (active highlight, arrow-key navigation); on phones the sidebar becomes a tab bar.
- **Layout:** on laptops and desktops, text (title, description, points, link) is on the left and the module screenshot on the right. Tablets and phones are stacked.
- **Same size for every module:** the window doesn't change size when switching modules, and fits the screen from 1920×1080 down to 1280×720 and on phones.
- **Previews scaled as one picture:** each one is drawn at a fixed design width and scaled to fit, so nothing gets squashed.
- **Shape fixes:**
  - Screenshot and video tiles keep a real 16:10 shape (not stretched); phones show 2 per row.
  - Reports heat map cells have a fixed height.
- **Removed:** the separate row of module cards below the window.

## 10. Copy changes (plain language)

| Where | Before | After |
|---|---|---|
| Hero text | "…one real-time record — captured by an agent Teemly built and owns end to end…" | "Teemly brings how your people, work and technology actually operate into one live view, then turns it into clear reports your leaders can act on." |
| Hero badge | "Own EXE agent, no browser extension" | "Lightweight desktop app, no browser extension" |
| Quick fact | "Own agent — no browser extension, no third-party license" | "Lightweight desktop app, with no browser extension or third-party software" |
| Problem | "One model. The whole picture." | "One record. The whole picture." |
| Integrations | "HMAC-signed payloads" / "We're not publishing a partner logo wall…" | "Secure, signed data" / "Export your data whenever you need it…" |
| Segment | "One installer, under 2MB…" | "One small installer for Windows and macOS…" |
| Trust | "Every API call is organisation-scoped…" / "agent payloads… signed URLs" | "Each company's data is kept completely separate…" / "…secure links that expire after 15 minutes." |
| Footer, menu, nav | "Own EXE Agent", "EXE agent, signed payloads" | "Own desktop app", "The desktop app, secure data transfer and storage" |

Also rewritten in plain language: the Problem cards, the Model step descriptions, the Platform descriptions, the module text in "How Teemly Works", and the `/product` intro ("Six modules" → "8 modules").

---

## Files

**New:**
- `src/brand/logo.js`
- `src/data/modules.js`
- `src/components/HeroDashboard.jsx`
- `src/components/PlatformDashboard.jsx`
- `src/home/heroDashboard.css`
- `scripts/build-brand-assets.mjs`
- `public/brand/*`

**Deleted:** `src/assets/teemly-logo.jpg`

**Changed:**
- Root and server: `index.html`, `package.json`, `public/favicon.svg`, `server/index.js`
- Admin: `AdminShell.jsx`, `Login.jsx`, `admin.css`
- Components: `ChatbotWidget.jsx`, `Footer.jsx`, `Header.jsx`, `Logo.jsx`, `header.css`
- Data: `moduleContent.js`, `navigation.js`
- Home styles: `explorer.css`, `hero.css`, `integrations.css`, `marquee.css`, `model.css`, `platform.css`, `problem.css`, `solutions.css`
- Pages and lib: `useSEO.js`, `Home.jsx`, `Product.jsx`
- Sections: `Hero`, `IntegrationsTeaser`, `Marquee`, `PlatformTeaser`, `Problem`, `ProductExplorer`, `QuickFacts`, `Segment`, `SolutionsTeaser`, `TeemlyModel`, `Trust`
