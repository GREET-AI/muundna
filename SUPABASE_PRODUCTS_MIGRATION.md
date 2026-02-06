# Supabase: Produkte & Lead-Opportunities (Mögliche Sales)

**Was ihr in Supabase machen müsst:**  
Im **Supabase Dashboard** → **SQL Editor** → neue Abfrage anlegen und das komplette SQL unten einfügen und **Run** ausführen. Damit werden die Tabellen `products` und `contact_products` angelegt und **alle Produkte von der Website** (Pakete, Add-ons, Enterprise-Module, Einzelprodukte) inkl. Features und Kombinationslogik (`for_package`, `price_once`) eingetragen. Anschließend sind sie im CRM unter **Tools → Produkt-Tool** sichtbar und editierbar.

- **Erstmalige Einrichtung:** Komplettes Script ausführen (CREATE TABLE + INSERT).
- **Tabelle existiert schon, Produkte fehlen:** Nur den **INSERT**-Block ausführen (oder zuerst `DELETE FROM products;`, dann INSERT, wenn ihr die Standard-Liste neu aufsetzen wollt).
- **Spalten für Kombinationen fehlen:** Zusätzlich den Block „Optionale Spalte“ ausführen.

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
  ('Telefonie (erweitert)', 'Max. 500 Anrufe/1200 Min., Branding, bis 10 Mitarbeiter, 24/7-Option +200 €', '599', ' €/Monat', 599, NULL, 'module', NULL, '["Max. 500 Anrufe/1200 Min.","Branding, bis 10 Mitarbeiter","24/7-Option +200 €"]'::jsonb, 60, NULL),
  ('E-Mail, Kalender & Terminlegung', 'Max. 300 E-Mails, 200 Termine, CRM-Sync', '299', ' €/Monat', 299, NULL, 'module', NULL, '["Max. 300 E-Mails, 200 Termine","CRM-Sync"]'::jsonb, 61, NULL),
  ('Google Bewertungen (erweitert)', 'Unbegrenzt Anfragen, Automatisierung, Reporting', '199', ' €/Monat', 199, NULL, 'module', NULL, '["Unbegrenzt Anfragen","Automatisierung, Reporting"]'::jsonb, 62, NULL),
  ('Social Media (custom)', 'Bis 4 Plattformen, bis 5 Posts/Woche, Community', '249', ' €/Monat', 249, NULL, 'module', NULL, '["Bis 4 Plattformen","bis 5 Posts/Woche","Community"]'::jsonb, 63, NULL),
  ('Reporting & Dokumentation', 'Wöchentliche/Monatliche KPIs, Custom-Dashboards', '99', ' €/Monat', 99, NULL, 'module', NULL, '["Wöchentliche/Monatliche KPIs","Custom-Dashboards"]'::jsonb, 64, NULL),
  ('Website-Entwicklung & Betreuung', 'Einmalig ab 2.000 € + 99 €/Monat (Updates, Hosting)', '99', ' €/Monat', 99, 2000, 'module', 'Einmalig ab 2.000 €', '["Updates, Hosting","Minimale Betreuung"]'::jsonb, 65, NULL),
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
