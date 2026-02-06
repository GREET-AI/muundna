# Lead-Scraper (Gelbe Seiten / 11880) – Setup für Live-Website

Damit der Scraper auf der **Live-Seite** (z. B. Vercel) funktioniert, nutzt die App einen Remote-Browser bei [Browserless](https://www.browserless.io/). Lokal brauchst du das nicht – dort reicht `npx playwright install`.

---

## 1. Browserless: API-Key besorgen

1. Auf [browserless.io](https://www.browserless.io/) einloggen.
2. **Account → Home** (oder Dashboard).
3. Unter **"Your API Key"** auf **Show** klicken und den Key **Copy** kopieren.
4. Den Key sicher aufbewahren (wird nur für Vercel gebraucht).

---

## 2. Vercel: Umgebungsvariable setzen

**Option A – Nur Token (empfohlen)**  
Europa-Server wird automatisch genutzt.

1. Vercel → dein Projekt → **Settings** → **Environment Variables**.
2. **Add New**:
   - **Name:** `BROWSERLESS_TOKEN`
   - **Value:** dein API-Key von Browserless (ohne Anführungszeichen).
   - **Environment:** Production (und ggf. Preview) aktivieren.
3. **Save**.

**Option B – Komplette WebSocket-URL**  
Wenn du eine andere Region nutzen willst:

- **Name:** `PLAYWRIGHT_BROWSER_WS_URL`
- **Value:** `wss://production-ams.browserless.io?token=DEIN_API_KEY`  
  (Ersetze `DEIN_API_KEY` durch deinen echten Key.)

Regionen (falls du wechseln willst):

- Europa (Amsterdam): `wss://production-ams.browserless.io`
- Europa (London): `wss://production-lon.browserless.io`
- US West: `wss://production-sfo.browserless.io`

---

## 3. Neu deployen

Nach dem Setzen der Variable:

- **Redeploy** auslösen (z. B. **Deployments** → bei letztem Deployment **…** → **Redeploy**),
- oder einen neuen **Commit** pushen.

Ohne Redeploy kennt die Live-App die neue Variable nicht.

---

## 4. Prüfen

1. Auf der Live-Seite einloggen (Admin).
2. **Lead-Scraping** → **Gelbe Seiten** (oder 11880).
3. Keyword + Ort eingeben → **Jetzt scrapen**.

Wenn alles stimmt, erscheinen nach kurzer Wartezeit die Leads. Bei Fehlern prüfen: Variable in Vercel korrekt gesetzt und Redeploy gemacht.

---

## Lokal (ohne Browserless)

- `npm install` und `npx playwright install` ausführen.
- **Keine** `BROWSERLESS_TOKEN` / `PLAYWRIGHT_BROWSER_WS_URL` nötig – der Scraper startet dann den Browser lokal.
