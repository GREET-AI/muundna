# Supabase-Migration: Status-Werte für contact_submissions

**Problem:** Die CHECK-Constraint `contact_submissions_status_check` erlaubt nur die alten Status `neu`, `kontaktiert`, `in_bearbeitung`, `abgeschlossen`. Das Admin-CRM nutzt zusätzlich z. B. `kunde`, `offen`, `verbunden` usw. Beim Ändern des Status erscheint sonst:  
`new row for relation "contact_submissions" violates check constraint "contact_submissions_status_check"`.

**Lösung:** Constraint entfernen und mit allen im CRM verwendeten Status-Werten neu anlegen.

**Im Supabase Dashboard → SQL Editor ausführen:**

```sql
-- Alte Status-Constraint entfernen
ALTER TABLE contact_submissions
  DROP CONSTRAINT IF EXISTS contact_submissions_status_check;

-- Neue Constraint mit allen CRM-Statuswerten
ALTER TABLE contact_submissions
  ADD CONSTRAINT contact_submissions_status_check CHECK (
    status IN (
      'neu',
      'offen',
      'kontaktversuch',
      'verbunden',
      'qualifiziert',
      'nicht_qualifiziert',
      'wiedervorlage',
      'kunde',
      'kontaktiert',
      'in_bearbeitung',
      'abgeschlossen'
    )
  );
```

Danach können Sie im Admin alle Lead-Status (inkl. „Kunde“, „Offen“, „Verbunden“ usw.) ohne Fehler setzen.
