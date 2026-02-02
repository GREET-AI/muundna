# Supabase CRM Setup für Muckenfuss & Nagel

## 1. Supabase Projekt konfigurieren

### Datenbank-Tabelle erstellen

Führen Sie folgendes SQL in der Supabase SQL Editor aus:

```sql
-- Tabelle für Kontaktanfragen erstellen
CREATE TABLE contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT,
  street TEXT,
  city TEXT,
  quiz_data JSONB,
  status TEXT DEFAULT 'neu' CHECK (status IN ('neu', 'kontaktiert', 'in_bearbeitung', 'abgeschlossen')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für bessere Performance
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);

-- Row Level Security aktivieren
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann neue Einträge erstellen (für Formular)
CREATE POLICY "Allow public insert" ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Nur authentifizierte Benutzer können lesen und aktualisieren
-- Für die Admin-Seite müssen Sie Supabase Auth nutzen oder Service Role Key verwenden
-- Option 1: Service Role Key (einfacher für den Start)
-- Option 2: Supabase Auth mit echten Benutzern (sicherer)

-- Für Service Role Key: Erstellen Sie eine Server-seitige API Route
-- die den Service Role Key nutzt (NICHT im Client!)
```

## 2. Umgebungsvariablen setzen

### Lokal (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_ADMIN_PASSWORD=ihr-sicheres-passwort
```

**WICHTIG:** 
- Der `ANON_KEY` ist für öffentliche Zugriffe (Formular)
- Für die Admin-Seite sollten Sie einen `SERVICE_ROLE_KEY` nutzen (nur server-seitig!)
- Das Admin-Passwort sollte stark sein!

### Vercel Environment Variables

1. Gehen Sie zu Ihrem Vercel Projekt
2. Settings > Environment Variables
3. Fügen Sie hinzu:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_PASSWORD` (oder besser: Supabase Auth nutzen)

## 3. Admin-Zugriff

### Aktuell: Einfacher Passwort-Schutz

Die Admin-Seite ist unter `/admin` erreichbar.

**Standard-Passwort:** `admin123` (bitte sofort ändern!)

### Sicherer: Supabase Auth (empfohlen)

Für Produktion sollten Sie Supabase Authentication nutzen:

1. In Supabase: Authentication > Users
2. Einen Admin-User erstellen
3. Die Admin-Seite auf Supabase Auth umstellen
4. Row Level Security Policies anpassen

## 4. CRM-Funktionen

Die Admin-Seite bietet:

- ✅ Alle Kontaktanfragen anzeigen
- ✅ Nach Name, E-Mail, Telefon suchen
- ✅ Nach Status filtern (Neu, Kontaktiert, In Bearbeitung, Abgeschlossen)
- ✅ Status ändern
- ✅ Notizen hinzufügen/bearbeiten
- ✅ Quiz-Daten anzeigen
- ✅ Direkte E-Mail/Telefon-Links

## 5. Alternative Lösungen

### Option A: Supabase (aktuell)
- ✅ Kostenlos für kleine Projekte
- ✅ Einfach zu integrieren
- ✅ Gute Performance
- ⚠️ Admin-UI ist selbst gebaut

### Option B: Externe Tools
- **Airtable**: Tabellen-basiertes CRM
- **Retool**: Custom Admin-Panels
- **Zapier + Google Sheets**: Automatische Weiterleitung
- **HubSpot/CRM**: Professionelles CRM (kostenpflichtig)

### Option C: Supabase + Retool
- Supabase als Datenbank
- Retool für professionelle Admin-UI
- Kosten: ~$10-50/Monat

## 6. Nächste Schritte

1. ✅ Supabase Projekt erstellen
2. ✅ SQL-Script ausführen
3. ✅ Environment Variables setzen
4. ✅ Admin-Seite testen (`/admin`)
5. ⚠️ Passwort ändern!
6. 🔄 Optional: Supabase Auth implementieren
7. 🔄 Optional: E-Mail-Benachrichtigungen bei neuen Kontakten

## 7. E-Mail-Benachrichtigungen (optional)

Sie können Supabase Edge Functions nutzen, um bei neuen Kontakten E-Mails zu versenden:

1. Edge Function erstellen
2. Trigger auf `contact_submissions` INSERT
3. E-Mail via Resend/SendGrid versenden

