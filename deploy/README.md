# Deploying the audit fixes

## 1. New `.env` settings (all optional — the site works without them)

| Variable | What it does | Needs rebuild? |
|---|---|---|
| `SITE_URL=https://teemly.co` | Base for canonical/og:url links, sitemap and robots.txt (defaults to https://teemly.co) | No |
| `SECURITY_CONTACT=mailto:info@teemly.co` | Contact line in `/.well-known/security.txt` (this address is the default) | No |
| `TURNSTILE_SECRET_KEY=...` | Server checks the Cloudflare Turnstile token on all lead forms | No |
| `VITE_TURNSTILE_SITE_KEY=...` | Browser side of Turnstile. **Set together with the secret**, or every form submission is rejected | Yes |
| `VITE_SENTRY_DSN=https://...` | Sends front-end errors to Sentry (public site only, not /admin) | Yes |
| `VITE_PLAUSIBLE_DOMAIN=teemly.co` | Turns on Plausible visit counts (public site only, not /admin). Add the site in Plausible first | Yes |

`VITE_*` values are baked in at build time: set them, then `npm run build`.

## 2. Release

```
npm install          # adds @sentry/react
npm run build
# restart the Node server (pm2 restart / systemctl restart, as you run it today)
```

## 3. nginx

Follow the steps at the top of `deploy/nginx/teemly.conf` (security headers,
hidden version, http→https, rate limits). Always `sudo nginx -t` before reload.

## 4. Check after deploy

```
curl -I https://teemly.co/does-not-exist     # expect 404
curl -I http://teemly.co/                    # expect 301 to https
curl https://teemly.co/robots.txt
curl https://teemly.co/sitemap.xml | head
curl https://teemly.co/.well-known/security.txt
```

Then run securityheaders.com, SSL Labs and PageSpeed Insights, and submit
`https://teemly.co/sitemap.xml` in Google Search Console.
