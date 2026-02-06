# Supabase: Produkte & Lead-Opportunities (Mögliche Sales)

**Produkt-Tool und CRM** im Admin lesen alle Produkte aus der Tabelle `products` in Supabase. Damit die Liste (Pakete, Add-ons, Enterprise-Module) im Builder und bei „Mögliche Sales“ erscheint, **muss dieses SQL in Supabase ausgeführt werden**.

---

## Checkliste – Was in Supabase tun?

| Situation | Aktion |
|-----------|--------|
| **Noch keine Produkt-Tabellen** | Komplettes Script unten ausführen (CREATE TABLE + INSERT). Danach sind alle Produkte im **Produkt-Tool** und bei **Mögliche Sales** (CRM) sichtbar. |
| **Tabelle existiert, aber leer / alte Liste** | Nur den **INSERT**-Block ausführen. Oder: `DELETE FROM products;` ausführen, dann den INSERT-Block – dann ist die Liste exakt wie unten (inkl. Paket 1–3, Add-ons, Enterprise-Module inkl. Social Basic/Growth/Pro, 24/7, Website). |
| **Spalten `price_once` / `for_package` fehlen** | Zusätzlich den Block **„Optionale Spalte“** am Ende der Datei ausführen. |

**Wo ausführen:** Supabase Dashboard → **SQL Editor** → neue Abfrage → SQL einfügen → **Run**.

---

**Inhalt der Liste (nach INSERT):**
- **Pakete:** Paket 1 Basis, Paket 2 Professional, Paket 3 Enterprise  
- **Add-ons (Quiz):** Google Bewertungen (+99), Social Basic/Growth/Pro (+249 / +449 / +749)  
- **Enterprise-Module:** Telefonie, 24/7-Option, E-Mail/Kalender, Google, Social Basic/Growth/Pro, Reporting, Website  
- **Einzelprodukte:** Telefonservice, Terminorganisation, Individuelles Paket  

Anschließend sind sie im CRM unter **Tools → Produkt-Tool** sichtbar und editierbar sowie bei **Mögliche Sales** pro Kontakt wählbar.

```sql
-- Produkte (Pakete, Einzelprodukte, Add-ons) – abgestimmt mit Main-Page
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_display TEXT NOT NULL,
  price_period TEXT DEFAULT '€/Monat',
  price_min NUMERIC,
  product_type TEXT NOT NULL DEFAULT 'package' CHECK (product_type IN ('package', 'addon', 'module', 'single')),
  subline TEXT,
  features JSONB DEFAULT '[]',
  sort_order INT DEFAULT 0,
  price_once NUMERIC,
  for_package TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_sort ON products(sort_order, id);

-- Zuordnung: welcher Kontakt hat welche Produkte (Mögliche Sales / Opportunity)
CREATE TABLE IF NOT EXISTS contact_products (
  id BIGSERIAL PRIMARY KEY,
  contact_id BIGINT NOT NULL REFERENCES contact_submissions(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1,
  estimated_value_override NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contact_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_contact_products_contact ON contact_products(contact_id);

-- Alle Produkte von der Website (PricingSection, Quiz-Add-ons, Enterprise-Module) + optionale Einzelprodukte
INSERT INTO products (name, description, price_display, price_period, price_min, price_once, product_type, subline, features, sort_order, for_package) VALUES
  -- Pakete (Main-Page PricingSection)
  ('Paket 1: Basis', 'Einsteigerfreundlich – Kernkommunikation', 'ab 299', ' €/Monat', 299, NULL, 'package', 'Optional: Google Bewertungen +99 €/Monat', '["Professionelle Telefonie (Anrufannahme, Weiterleitung)","E-Mail-Betreuung","Kalendermanagement & Terminlegung","Optional: Google Bewertungen (Rezensions-Management, automatisierte Kundenanfragen)","Fair-Use: z. B. 80 Anrufe, 50 E-Mails, 30 Termine/Monat – Extras auf Anfrage"]'::jsonb, 10, NULL),
  ('Paket 2: Professional', 'Erweiterte Telefonbetreuung + optionale Social-Media-Add-ons', 'ab 599', ' €/Monat', 599, NULL, 'package', 'Google Bewertungen inklusive · Social modular: Basic +249 €, Growth +449 €, Pro +749 €', '["Erweiterte Telefonie (Branding, Team-Weiterleitung bis 3 Mitarbeiter)","E-Mail, Kalender & Terminlegung (erweitert)","Google Bewertungen inkl. Rezensions-Management & Optimierung","Monatliches Reporting","Social Media modular: Plattform-, Content- und Häufigkeits-Auswahl"]'::jsonb, 20, NULL),
  ('Paket 3: Enterprise', 'Voll modular – fixe Preise pro Komponente, Volumenrabatte 10–20 %', 'ab ca. 999', ' €/Monat', 999, NULL, 'package', 'Auf Anfrage · Rabatt ab 1.000 € (10 %), ab 1.500 € (15 %), ab 2.000 € (20 %)', '["Telefonie, E-Mail/Kalender, Google Bewertungen, Social (custom) – frei kombinierbar","Reporting & Dokumentation (z. B. 99 €/Monat)","Website: einmalig ab 2.000 € + 99 €/Monat minimale Betreuung","24/7-Option, CRM-Sync, unbegrenzte Google-Anfragen je nach Modul","Individuelle Anpassungen & dedizierter Support"]'::jsonb, 30, NULL),
  -- Add-ons (Quiz: Paket 1 = Google; Paket 2 = Social Basic/Growth/Pro)
  ('Google Bewertungen (Add-on)', 'Rezensions-Management, automatisierte Kundenanfragen', '+99', ' €/Monat', 99, NULL, 'addon', NULL, '["Rezensions-Management","Automatisierte Kundenanfragen"]'::jsonb, 40, '1'),
  ('Social Media Basic', '1–2 Plattformen, 1–2 Posts/Woche', '+249', ' €/Monat', 249, NULL, 'addon', NULL, '["1–2 Plattformen","1–2 Posts/Woche"]'::jsonb, 41, '2'),
  ('Social Media Growth', '2–3 Plattformen, 2–3 Posts/Woche, Community', '+449', ' €/Monat', 449, NULL, 'addon', NULL, '["2–3 Plattformen","2–3 Posts/Woche","Community"]'::jsonb, 42, '2'),
  ('Social Media Pro', '3–4 Plattformen, 3+ Posts/Woche, Community, Basis-Ads', '+749', ' €/Monat', 749, NULL, 'addon', NULL, '["3–4 Plattformen","3+ Posts/Woche","Community","Basis-Ads"]'::jsonb, 43, '2'),
  -- Enterprise-Module (Konfigurator)
  ('Telefonie (erweitert)', 'Max. 500 Anrufe/1.200 Min., Branding bis 10 Mitarbeiter. Extra: 1,80 €/Anruf.', '599', ' €/Monat', 599, NULL, 'module', NULL, '["Max. 500 Anrufe/1.200 Min.","Branding, bis 10 Mitarbeiter"]'::jsonb, 60, NULL),
  ('24/7-Option Telefonie', 'Nur mit Telefonie buchbar', '200', ' €/Monat', 200, NULL, 'module', 'Nur mit Telefonie (erweitert)', '["Telefonie rund um die Uhr"]'::jsonb, 61, NULL),
  ('E-Mail, Kalender & Terminlegung', 'Max. 300 E-Mails, 200 Termine, CRM-Sync. Extra: 0,50 €/E-Mail, 3 €/Termin.', '299', ' €/Monat', 299, NULL, 'module', NULL, '["Max. 300 E-Mails, 200 Termine","CRM-Sync"]'::jsonb, 62, NULL),
  ('Google Bewertungen (erweitert)', 'Unbegrenzt Anfragen, Automatisierung, Reporting. Extra: 3 €/Anfrage.', '199', ' €/Monat', 199, NULL, 'module', NULL, '["Unbegrenzt Anfragen","Automatisierung, Reporting"]'::jsonb, 63, NULL),
  ('Social Media Basic (Enterprise)', '1–2 Plattformen, 1–2 Posts/Woche, max. 8 Posts/Monat', '249', ' €/Monat', 249, NULL, 'module', NULL, '["1–2 Plattformen","1–2 Posts/Woche","Mix Bild/Video","Extra: 30 €/Post"]'::jsonb, 64, NULL),
  ('Social Media Growth (Enterprise)', '2–3 Plattformen, 2–3 Posts/Woche, Community, max. 12 Posts/Monat', '449', ' €/Monat', 449, NULL, 'module', NULL, '["2–3 Plattformen","2–3 Posts/Woche","Community max. 50 Interaktionen","Extra: 25 €/Post"]'::jsonb, 65, NULL),
  ('Social Media Pro (Enterprise)', '3–4 Plattformen, 3+ Posts/Woche, Voll-Community bis 8 Std., max. 20 Posts/Monat', '749', ' €/Monat', 749, NULL, 'module', NULL, '["3–4 Plattformen","3+ Posts/Woche","Voll-Mix + Community","Extra: 20 €/Post"]'::jsonb, 66, NULL),
  ('Reporting & Dokumentation', 'Wöchentliche/Monatliche KPIs, Custom-Dashboards', '99', ' €/Monat', 99, NULL, 'module', NULL, '["Wöchentliche/Monatliche KPIs","Custom-Dashboards"]'::jsonb, 67, NULL),
  ('Website-Entwicklung & Betreuung', 'Einmalig ab 2.000 € + 99 €/Monat (Updates, Hosting). E-Commerce +500 € einmalig.', '99', ' €/Monat', 99, 2000, 'module', 'Einmalig ab 2.000 €', '["Updates, Hosting","Minimale Betreuung","Extra: 50 €/Stunde"]'::jsonb, 68, NULL),
  -- Einzelprodukte / optionale Varianten
  ('Telefonservice & Kommunikation', 'Einzelleistung', 'Auf Anfrage', ' €/Monat', NULL, NULL, 'single', NULL, '[]'::jsonb, 50, NULL),
  ('Terminorganisation', 'Einzelleistung', 'Auf Anfrage', ' €/Monat', NULL, NULL, 'single', NULL, '[]'::jsonb, 51, NULL),
  ('Individuelles Paket', 'Maßgeschneidert', 'Auf Anfrage', ' €/Monat', NULL, NULL, 'single', NULL, '[]'::jsonb, 52, NULL)
;
-- Bei erneutem Ausführen: Tabelle leeren (DELETE FROM products;) oder INSERT weglassen, falls Produkte schon existieren.
```

**Hinweis:** Wenn die Tabelle `products` bereits existiert und Sie die Initial-Daten nur einmal einfügen wollen, führen Sie nur die `INSERT`-Zeilen aus (ohne `ON CONFLICT`). Bei bestehender Tabelle mit Daten ggf. die IDs prüfen.

**Optionale Spalte** (für Kombinationen Add-on ↔ Paket): Falls Sie später Add-ons einem Paket zuordnen wollen (z. B. „nur mit Paket 1“), führen Sie aus:

```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_once NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS for_package TEXT;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_product_type_check;
ALTER TABLE products ADD CONSTRAINT products_product_type_check CHECK (product_type IN ('package', 'addon', 'module', 'single'));
```

Nach der Migration stehen die API-Routen `/api/admin/products` (GET, POST, PATCH, DELETE) und `/api/admin/contacts/[id]/products` zur Verfügung.

---

## Prüfen auf doppelte Produkte (in Supabase)

Falls du den INSERT mehrfach ausgeführt hast oder unsicher bist, ob Doppelte existieren: Im **SQL Editor** diese Abfrage ausführen. Sie listet alle **Namen, die mehrfach vorkommen** (und wie oft):

```sql
SELECT name, COUNT(*) AS anzahl
FROM products
GROUP BY name
HAVING COUNT(*) > 1;
```

- **Leeres Ergebnis:** Keine Doppelte, alles ok.
- **Zeilen mit `anzahl > 1`:** Diese Namen gibt es mehrfach. Dann das folgende **Bereinigungsskript** ausführen – es behält pro Namen die Zeile mit der **kleinsten ID** (ältester Eintrag) und löscht die übrigen Doppelten.

**Doppelte im Produkt-Tool automatisch bereinigen (einmalig ausführen):**

```sql
-- Doppelte Produkte löschen: pro Namen nur die Zeile mit der kleinsten ID behalten
DELETE FROM products
WHERE id NOT IN (
  SELECT MIN(id) FROM products GROUP BY name
);
```

Danach die Prüf-Abfrage oben erneut ausführen; das Ergebnis sollte leer sein. Im **Produkt-Tool** im CRM erscheint dann jede Produktzeile nur noch einmal.
