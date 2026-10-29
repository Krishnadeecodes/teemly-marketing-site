# Moving the website's email from teemlyemail@gmail.com to info@teemly.com

Goal: the website's emails are **sent from** info@teemly.com and **arrive in** info@teemly.com. The Gmail account (teemlyemail@gmail.com) is no longer used.

---

## How the website's email works today

All email settings live in the `.env` file (on your computer, and a separate copy on the live server). The address is not written anywhere in the code.

| Setting | What it does | Today |
|---|---|---|
| `MAIL_TO` | The inbox that **receives** the details from every form: Contact, Book a Demo, Take a Tour sign-ups, chat sign-ups, gated PDF downloads | teemlyemail@gmail.com |
| `SMTP_USER` / `SMTP_PASS` | The account the website **signs in to and sends from**: lead notifications to the team and "Thank you" confirmations to visitors | teemlyemail@gmail.com, through Gmail |

Optional per-form inboxes (not set today, so everything goes to `MAIL_TO`): `MAIL_TO_CONTACT`, `MAIL_TO_DEMO`, `MAIL_TO_TOUR`, `MAIL_TO_DOWNLOADS`.

### Why receiving needs no password, but sending does

- **Sending needs a login.** To send, the website signs in to an email account, like signing in to Gmail before sending. `SMTP_USER` and `SMTP_PASS` are that sign-in.
- **Receiving doesn't.** `MAIL_TO` is just the "To:" address. Anyone can send to info@teemly.com without its password, like a letter needs an address, not the house key.

So changing only `MAIL_TO` moves where emails **arrive**. Moving where they're **sent from** also needs info@teemly.com's sending login (`SMTP_USER` / `SMTP_PASS`).

---

## Option A: only change where the details arrive (quick)

Use this if emails can still be sent from the Gmail account. No code change.

1. In `.env` on your computer, change `MAIL_TO=teemlyemail@gmail.com` to `MAIL_TO=info@teemly.com`. Leave `SMTP_USER` and `SMTP_PASS` unchanged.
2. Make the same change in `.env` on the live server.
3. Restart the backend server, on your computer (`npm run server`) and on the live server.
4. Send each form once and check the details arrive at info@teemly.com.
5. The first emails may land in spam. Mark them "Not spam".

---

## Option B: full move, sending from and receiving at info@teemly.com

### Step 1: Find out who hosts info@teemly.com
Google Workspace, Microsoft 365 / Outlook, Zoho Mail, GoDaddy / Hostinger, or another provider. Ask whoever set up the domain if unsure.

### Step 2: Get sending details for info@teemly.com
From that provider:
- **SMTP server address**, for example `smtp.gmail.com` (Google Workspace), `smtp.office365.com` (Microsoft 365) or `smtp.zoho.in` (Zoho)
- **Port and security**, usually 465 (SSL) or 587 (TLS)
- **Username:** info@teemly.com
- **App password:** most providers need a special app password for websites, not the normal login. On Google Workspace, turn on 2-step verification, then create an app password in the account's Security settings.

### Step 3: Allow teemly.com to send email (DNS)
In the domain's DNS settings, add the provider's **SPF**, **DKIM** and ideally **DMARC** records (the provider gives the exact values). Without them, emails from info@teemly.com are likely to land in spam.

### Step 4: Small code change (needed if the provider isn't Google)
The mail server is currently fixed to Gmail (`smtp.gmail.com`, port 465) in `server/index.js`. Change it to read new `SMTP_HOST` and `SMTP_PORT` settings from `.env`, so any provider works. This isn't needed for Google Workspace, but it's recommended anyway, so a future provider change is just a settings change.

### Step 5: Update `.env` on your computer and on the live server
```
SMTP_USER=info@teemly.com
SMTP_PASS=<app password from step 2>
MAIL_TO=info@teemly.com
SMTP_HOST=<server from step 2>     (only after step 4)
SMTP_PORT=<port from step 2>       (only after step 4)
```
- `MAIL_TO`: details arrive at info@teemly.com
- `SMTP_USER` / `SMTP_PASS`: emails are sent from info@teemly.com

Keep the app password secret: type it into `.env` yourself, and don't share it in chats, emails or commits. (`.env` is not committed to git.)

### Step 6: Update the address shown on the website (recommended)
The site shows **hello@teemly.app** as its contact address: on the Contact page, in form error messages and in the chat assistant. That's a different domain (teemly.app). To use info@teemly.com everywhere, change `FALLBACK_EMAIL` in `src/lib/submitForm.js`.

### Step 7: Restart and test
1. Restart the backend on your computer and on the live server.
2. Send each form once: Contact, Book a Demo, Take a Tour sign-up, chat sign-up and a gated PDF download.
3. Check that:
   - the lead email arrives in **info@teemly.com**
   - the visitor's "Thank you" email comes **from info@teemly.com**
   - neither lands in spam
4. If something fails, the backend log shows the email error, usually a wrong app password or a blocked sign-in.

### Step 8: Retire the old account
Keep teemlyemail@gmail.com for about a week as a fallback. Once everything works, remove its app password in Google's security settings.

---

## Who does what

| Step | Who |
|---|---|
| 1–3: provider, app password, DNS records | You, or whoever manages the domain |
| 4 and 6: code changes | Developer |
| 5: `.env` on your computer | Developer or you |
| 5: `.env` on the live server | You or the server admin |
| 7: restart and test | Together |
