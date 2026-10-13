# Deploying to the VPS

The Node server (`server/index.js`) serves the built site from `dist/` **and** handles
the Contact / Book a Demo forms (`POST /api/forms/contact`, `POST /api/forms/demo`),
emailing each submission through Gmail SMTP.

## 1. Gmail setup (one time)
1. Turn on 2-Step Verification for the sending Gmail account.
2. Create an App Password at https://myaccount.google.com/apppasswords.

## 2. On the server
Requires Node.js 20.12+.

```bash
git clone <repo> teemly-website && cd teemly-website
npm ci
npm run build                 # creates dist/
cp .env.example .env          # then edit .env with real values
npm start                     # quick test: http://SERVER_IP:3001
```

## 3. Keep it running with PM2
```bash
npm install -g pm2
pm2 start server/index.js --name teemly
pm2 save
pm2 startup                   # follow the printed command to start on boot
```

## 4. Nginx reverse proxy + HTTPS
`/etc/nginx/sites-available/teemly`:
```nginx
server {
    server_name teemly.app www.teemly.app;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/teemly /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d teemly.app -d www.teemly.app
```

## Updating the site
```bash
git pull && npm ci && npm run build && pm2 restart teemly
```

## Local development
Run both in separate terminals — Vite proxies `/api` to the Node server:
```bash
npm run server   # needs .env
npm run dev
```

## Troubleshooting
- `535 Username and Password not accepted` → wrong App Password, or 2-Step Verification is off.
- Works locally but times out on the VPS → hosting provider blocks outbound SMTP; ask them to open port 465.
- Logs: `pm2 logs teemly`.
