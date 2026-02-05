# Supabase-Migration: Vertriebler-Zuordnung und Aktivitätsprotokoll

**Zweck:** Leads einem Vertriebler (Sven / Pascal) zuordnen, beim Login das Profil wählen und alle Änderungen (Status, Notizen, Zuordnung) protokollieren (wer hat was wann gemacht).

Führen Sie das folgende SQL **einmalig** im Supabase Dashboard unter **SQL Editor** aus.

```sql
-- Vertriebler-Zuordnung pro Kontakt ('sven' | 'pascal' oder NULL)
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS assigned_to TEXT;

-- Optional: Index für Filter nach Vertriebler
CREATE INDEX IF NOT EXISTS idx_contact_submissions_assigned_to ON contact_submissions(assigned_to);

-- Aktivitätsprotokoll: wer hat was wann geändert
CREATE TABLE IF NOT EXISTS contact_activity_log (
  id BIGSERIAL PRIMARY KEY,
  contact_id BIGINT NOT NULL REFERENCES contact_submissions(id) ON DELETE CASCADE,
  sales_rep TEXT NOT NULL,
  action TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_activity_log_contact_id ON contact_activity_log(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_activity_log_created_at ON contact_activity_log(created_at DESC);
```

**Erlaubte Werte:**
- `assigned_to`: `'sven'`, `'pascal'` oder `NULL`
- `contact_activity_log.sales_rep`: `'sven'` oder `'pascal'`
- `contact_activity_log.action`: z. B. `'status_change'`, `'notes_edit'`, `'assigned'`, `'created'`

Nach der Migration können Sie im Admin beim Login Sven oder Pascal wählen; Änderungen werden diesem Profil zugeordnet und im Verlauf pro Kontakt angezeigt.
