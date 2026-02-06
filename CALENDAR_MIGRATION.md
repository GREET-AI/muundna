# Kalender: Termine für Vertriebler

Im **Supabase SQL Editor** ausführen, um die Tabelle für Termine anzulegen.

```sql
CREATE TABLE IF NOT EXISTS calendar_events (
  id BIGSERIAL PRIMARY KEY,
  sales_rep TEXT NOT NULL CHECK (sales_rep IN ('sven', 'pascal')),
  title TEXT NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  contact_id BIGINT REFERENCES contact_submissions(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_start ON calendar_events(start_at);
CREATE INDEX IF NOT EXISTS idx_calendar_events_sales_rep ON calendar_events(sales_rep);
```

**Optionale Spalten** (Termin-Vorbereitung: empfohlene Produkte, Website/Google/Social-Zustand):

```sql
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS recommended_product_ids JSONB DEFAULT '[]';
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS website_state TEXT;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS google_state TEXT;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS social_media_state TEXT;
```

Danach stehen die Routen `/api/admin/calendar/events` (GET, POST) und `/api/admin/calendar/events/[id]` (PATCH, DELETE) zur Verfügung.
