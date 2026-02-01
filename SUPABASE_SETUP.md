# Supabase Setup für Muckenfuss & Nagel

## 1. Supabase Projekt erstellen

1. Gehen Sie zu [supabase.com](https://supabase.com)
2. Erstellen Sie ein neues Projekt
3. Notieren Sie sich:
   - **Project URL** (z.B. `https://xxxxx.supabase.co`)
   - **anon/public key** (unter Settings > API)

## 2. Datenbank-Tabelle erstellen

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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für bessere Performance
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Row Level Security aktivieren (optional, für mehr Sicherheit)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann neue Einträge erstellen (für Formular)
CREATE POLICY "Allow public insert" ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Nur authentifizierte Benutzer können lesen (optional)
CREATE POLICY "Allow authenticated read" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);
```

## 3. Umgebungsvariablen setzen

Erstellen Sie eine `.env.local` Datei im Root-Verzeichnis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Wichtig:** Fügen Sie `.env.local` zu `.gitignore` hinzu, damit die Keys nicht ins Repository kommen!

## 4. Für Vercel Deployment

1. Gehen Sie zu Ihrem Vercel Projekt
2. Settings > Environment Variables
3. Fügen Sie hinzu:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy erneut

## 5. Daten ansehen

Nach dem Setup können Sie alle Kontaktanfragen in Supabase unter "Table Editor" > "contact_submissions" sehen.

## Alternative: Ohne Supabase

Falls Sie Supabase nicht nutzen möchten, können Sie:
- Die Daten per E-Mail versenden (z.B. mit Resend, SendGrid, Nodemailer)
- Die Daten in eine andere Datenbank speichern
- Die API Route entsprechend anpassen

Die aktuelle Implementierung funktioniert auch ohne Supabase (mit Fallback-Logging).

