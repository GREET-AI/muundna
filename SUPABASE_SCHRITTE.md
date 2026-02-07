# Supabase: Schritte damit alles funktioniert

Damit Login (Username + Passwort), Team, Abteilungen und Multi-Tenancy laufen, musst du **zwei SQL-Migrationen** im Supabase Dashboard ausführen – in dieser Reihenfolge.

---

## Voraussetzung

Diese Tabellen müssen **bereits existieren** (wie bisher im Projekt):

- **contact_submissions** (aus SUPABASE_CRM_SETUP.md / Scraper-Migration)
- **products** (aus SUPABASE_PRODUCTS_MIGRATION.md)

Falls du Supabase neu aufsetzt: zuerst die SQL-Skripte aus diesen Docs ausführen, danach die Schritte unten.

---

## Schritt 1: Auth & Multi-Tenancy

1. Im Supabase Dashboard: **SQL Editor** → **New query**.
2. Den **kompletten Inhalt** von  
   `supabase/migrations/001_auth_multitenancy.sql`  
   reinkopieren.
3. **Run** (oder Strg+Enter).

Das Script legt an:

- Tabellen: **tenants**, **roles**, **users**, **tenant_features**
- Spalte **tenant_id** in `contact_submissions` und `products`
- Rollen: admin, mitarbeiter, mitarbeiter_limited
- Default-Tenant „Muckenfuss & Nagel“
- Ordnet bestehende Kontakte und Produkte diesem Tenant zu

---

## Schritt 2: Abteilungen

1. Wieder **SQL Editor** → **New query**.
2. Den **kompletten Inhalt** von  
   `supabase/migrations/002_departments.sql`  
   reinkopieren.
3. **Run**.

Das Script legt an:

- Tabelle **departments** (Vertrieb, Social Media, Support, …)
- Tabelle **tenant_departments** (welche Abteilungen pro Tenant sichtbar sind)
- Spalte **department_key** in **users**
- Schreibt die Standard-Abteilungen und schaltet sie für den Default-Tenant frei

---

## Schritt 3: Ersten Admin-User anlegen (Login)

Es gibt noch **keinen** User in der Tabelle **users**. Beim ersten Login macht die App das automatisch:

1. **Umgebungsvariable** (lokal in `.env.local` und in Vercel):
   - `ADMIN_PASSWORD` = dein gewünschtes Admin-Passwort (das du bisher für /admin genutzt hast oder ein neues).

2. Im Browser: **/admin** aufrufen.

3. **Erster Login:**
   - **Benutzername leer lassen**
   - Nur **Passwort** eintragen (das von `ADMIN_PASSWORD`)
   - Auf „Anmelden“ klicken.

4. Die App erstellt dann automatisch den User **admin** mit diesem Passwort und meldet dich an. Beim nächsten Mal: **Username „admin“** + **Passwort** eingeben.

---

## Optional: Umgebungsvariablen

| Variable | Pflicht? | Beschreibung |
|----------|----------|---------------|
| `ADMIN_PASSWORD` | Ja (für ersten Login) | Wird für den Bootstrap-Login und ggf. Cookie-Signatur genutzt. |
| `SESSION_SECRET` | Nein | Wenn gesetzt: wird für die Cookie-Signatur genutzt (statt `ADMIN_PASSWORD`). Sinnvoll für Rotation. |
| `DEFAULT_TENANT_SLUG` | Nein | Slug des Tenants für neue Kontaktformular-Einträge (Standard: `muckenfuss-nagel`). |

Supabase brauchst du wie bisher:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Kurz-Checkliste

- [ ] **001_auth_multitenancy.sql** im SQL Editor ausgeführt
- [ ] **002_departments.sql** im SQL Editor ausgeführt
- [ ] `ADMIN_PASSWORD` in .env.local (und Vercel) gesetzt
- [ ] Einmal **/admin** mit leerem Benutzername + Passwort aufgerufen → User „admin“ wird angelegt
- [ ] Ab dann: Login mit **admin** + Passwort; Team-Bereich unter **Einstellungen → Team** nutzbar

Wenn etwas fehlschlägt (z. B. „relation contact_submissions does not exist“): zuerst die Basis-Setup-Docs (CRM, Produkte, ggf. Scraper) ausführen, danach 001 und 002.
