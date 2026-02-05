# Sicherheit: CRM & Website bei Vercel-Deployment

## Was bereits gut ist

- **`.env.local` / `.env`** sind in `.gitignore` – werden nicht mit gepusht, Geheimnisse landen nicht im Repo.
- **Vercel:** Unter *Settings → Environment Variables* gesetzte Variablen sind nur auf dem Server sichtbar – **außer** solche mit Präfix `NEXT_PUBLIC_`.
- **Supabase:** `SUPABASE_SERVICE_ROLE_KEY` und `RESEND_API_KEY` werden nur in API-Routes verwendet (server-seitig), nie im Browser – **sicher**.
- **Supabase RLS:** Row Level Security auf `contact_submissions` ist aktiv; direkte Zugriffe mit dem Anon-Key unterliegen den Policies (z. B. nur INSERT für Öffentlichkeit).
- **Admin-APIs:** Alle `/api/admin/*`-Routes prüfen ein Passwort (Bearer-Header) – ohne gültiges Passwort kein Zugriff.

## Admin-Login: umgesetzt (server-seitiges Passwort + Session-Cookie)

Der Login ist umgebaut: Das Admin-Passwort wird **nur** auf dem Server verwendet und erscheint **nicht** im Frontend.

- **Login:** Nutzer gibt Passwort im Formular ein → `POST /api/admin/login` vergleicht mit `process.env.ADMIN_PASSWORD` → bei Erfolg wird ein signiertes **Session-Cookie** (`admin_session`) gesetzt (httpOnly, 7 Tage).
- **Alle Admin-APIs** prüfen nur noch dieses Cookie (kein Bearer-Passwort mehr).
- **Logout:** `POST /api/admin/logout` löscht das Cookie.

### Vercel: Environment Variables

1. **`ADMIN_PASSWORD`** anlegen (ohne `NEXT_PUBLIC_`) mit Ihrem starken Admin-Passwort.
2. **`NEXT_PUBLIC_ADMIN_PASSWORD`** in Vercel **nicht** setzen oder löschen – wird nicht mehr verwendet.
3. Alle anderen Variablen (Supabase, Resend usw.) wie bisher setzen.

## Checkliste vor dem ersten Production-Push

| Punkt | Status |
|-------|--------|
| `.env*.local` / `.env` im Repo? | ❌ Nein (über .gitignore) |
| Geheimnisse nur in Vercel „Environment Variables“ setzen | ✅ Ja |
| Admin-Passwort nur server-seitig (`ADMIN_PASSWORD`) + Session-Cookie | ✅ Umgesetzt |
| Supabase RLS für `contact_submissions` aktiv | ✅ Ja |
| Service Role Key nur in API-Routes, nie im Client | ✅ Ja |

## Fazit

- **Website (öffentliche Seiten, Formulare):** Für ein typisches Vercel-Deployment mit Supabase und RLS **gut vertretbar**.
- **CRM (/admin):** Login läuft über Session-Cookie; das Passwort bleibt auf dem Server. Für den Einstieg **deutlich sicherer**.
