# Supabase-Migration: Scraper-Leads in contact_submissions

**Ohne diese Migration funktionieren Leads (Aktuell/Alle), „Neue Leads“ und der Import gescrapten Daten nicht.** Die Fehlermeldung lautet sonst: `column contact_submissions.source does not exist`.

Führen Sie das folgende SQL **einmalig** im Supabase Dashboard unter **SQL Editor** aus (Projekt auswählen → SQL Editor → New query → SQL einfügen → Run).

```sql
-- E-Mail für Scrape-Leads optional (diese haben oft keine E-Mail)
ALTER TABLE contact_submissions
  ALTER COLUMN email DROP NOT NULL;

-- Firmenname (bei Scrape-Leads)
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS company TEXT;

-- Herkunft: 'website_form' | 'quiz' | 'gelbe_seiten' | 'das_oertliche' | 'import'
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'website_form';

-- Zusatzdaten der Quelle (z. B. GS-Profil-URL, GS-E-Mail-Form-URL)
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS source_meta JSONB;

-- Index für Filter nach Quelle
CREATE INDEX IF NOT EXISTS idx_contact_submissions_source ON contact_submissions(source);

-- Batch für "Aktuell" (letzter Scraping-Lauf)
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS scrape_batch_id TEXT;
CREATE INDEX IF NOT EXISTS idx_contact_submissions_scrape_batch_id ON contact_submissions(scrape_batch_id);
```

Nach der Migration können Sie im Admin unter **Lead-Scraping** Treffer in die Datenbank übernehmen; sie erscheinen dann unter Kontakte mit `source = 'gelbe_seiten'`.

**Hinweis Scraping (Playwright):** Der Gelbe-Seiten-Scraper nutzt Playwright mit Chromium. Das funktioniert lokal nach `npx playwright install chromium`. Auf Vercel (Serverless) ist Chromium standardmäßig nicht verfügbar – Scraping dort kann fehlschlagen. Empfehlung: Scraping lokal ausführen oder einen eigenen Node-Server/Worker mit Playwright nutzen.
