# Auth & Multi-Tenancy Migration

Dieses SQL richtet das vollständige Auth- und Berechtigungssystem ein:

- **Tenants** (Mandanten/Firmen)
- **Users** (Benutzer mit Username + Passwort)
- **Roles** (Rollen mit Berechtigungen)
- **Tenant Features** (Feature-Freischaltung pro Mandant, z.B. digitale Produkte)
- ** tenant_id** in bestehenden Tabellen (Multi-Tenant-ready)

---

## Ausführen

Supabase Dashboard → **SQL Editor** → Neue Abfrage → SQL unten einfügen → **Run**.

**Reihenfolge:** Zuerst dieses Script, dann ggf. die Datenbank-Variablen für den ersten Admin-User setzen.

---

## 1. Tabellen erstellen

```sql
-- ============================================================
-- TENANTS (Mandanten / Firmen)
-- ============================================================
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);

-- ============================================================
-- ROLES (Rollen mit Berechtigungen)
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Berechtigungen: Array von Strings, z.B. ["crm.contacts", "crm.products", "digital_products.*", "admin"]
-- admin = Vollzugriff

-- ============================================================
-- USERS (Benutzer mit Username + Passwort)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  sales_rep_key TEXT CHECK (sales_rep_key IN ('sven', 'pascal') OR sales_rep_key IS NULL),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, username)
);

CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ============================================================
-- TENANT_FEATURES (Feature-Freischaltung pro Mandant)
-- z.B. digital_products, calendar, scraper, ...
-- ============================================================
CREATE TABLE IF NOT EXISTS tenant_features (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, feature_key)
);

CREATE INDEX IF NOT EXISTS idx_tenant_features_tenant ON tenant_features(tenant_id);
```

---

## 2. tenant_id zu bestehenden Tabellen hinzufügen

```sql
-- contact_submissions
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_contact_submissions_tenant ON contact_submissions(tenant_id);

-- products (CRM-Pakete, Add-ons – pro Tenant konfigurierbar)
ALTER TABLE products ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_products_tenant ON products(tenant_id);

-- contact_products (tenant kommt über contact_id, aber Index hilft)
-- Kein tenant_id nötig, da über contact → tenant auflösbar
```

---

## 3. Default-Tenant und Rollen seeden

```sql
-- Rollen (global, nicht pro Tenant)
INSERT INTO roles (id, name, description, permissions) VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'admin', 'Vollzugriff auf alle Bereiche', '["admin"]'::jsonb),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'mitarbeiter', 'Kontakte, Kalender, Produkte – kein Admin', '["crm.contacts", "crm.products", "crm.calendar", "crm.activity", "crm.scraper", "crm.review_funnel", "crm.angebot"]'::jsonb),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'mitarbeiter_limited', 'Nur eigene Kontakte, Kalender', '["crm.contacts.read", "crm.contacts.me", "crm.calendar"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Fallback falls UUID nicht funktioniert:
-- INSERT INTO roles (name, description, permissions) VALUES
--   ('admin', 'Vollzugriff', '["admin"]'::jsonb),
--   ('mitarbeiter', 'Kontakte, Kalender, Produkte', '["crm.contacts", "crm.products", "crm.calendar", ...]'::jsonb)
-- ON CONFLICT (name) DO NOTHING;
```

**Wichtig:** Die Rollen-IDs oben können je nach Supabase-Installation abweichen. Wenn der INSERT mit festen UUIDs fehlschlägt, nutze stattdessen:

```sql
INSERT INTO roles (name, description, permissions) VALUES
  ('admin', 'Vollzugriff auf alle Bereiche', '["admin"]'::jsonb),
  ('mitarbeiter', 'Kontakte, Kalender, Produkte – kein Admin', '["crm.contacts", "crm.products", "crm.calendar", "crm.activity", "crm.scraper", "crm.review_funnel", "crm.angebot"]'::jsonb),
  ('mitarbeiter_limited', 'Nur eigene Kontakte, Kalender', '["crm.contacts.read", "crm.contacts.me", "crm.calendar"]'::jsonb)
ON CONFLICT (name) DO NOTHING;
```

---

## 4. Default-Tenant anlegen

```sql
-- Ein Default-Tenant (z.B. für Muckenfuss & Nagel)
INSERT INTO tenants (id, name, slug) VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Muckenfuss & Nagel', 'muckenfuss-nagel')
ON CONFLICT DO NOTHING;

-- Falls die Tabelle keine UNIQUE auf (id) hat, verwende:
INSERT INTO tenants (name, slug)
SELECT 'Muckenfuss & Nagel', 'muckenfuss-nagel'
WHERE NOT EXISTS (SELECT 1 FROM tenants LIMIT 1);
```

**Einfachere Variante (ohne feste UUID):**

```sql
INSERT INTO tenants (name, slug)
VALUES ('Muckenfuss & Nagel', 'muckenfuss-nagel')
ON CONFLICT (slug) DO NOTHING;
```

---

## 5. Feature-Flags für Default-Tenant

```sql
-- Digital Products (Ablefy) – kann später pro Tenant freigeschaltet werden
INSERT INTO tenant_features (tenant_id, feature_key, enabled)
SELECT id, 'digital_products', true FROM tenants WHERE slug = 'muckenfuss-nagel' LIMIT 1
ON CONFLICT (tenant_id, feature_key) DO UPDATE SET enabled = true;

-- Weitere Features (optional)
INSERT INTO tenant_features (tenant_id, feature_key, enabled)
SELECT id, 'calendar', true FROM tenants WHERE slug = 'muckenfuss-nagel' LIMIT 1
ON CONFLICT (tenant_id, feature_key) DO NOTHING;

INSERT INTO tenant_features (tenant_id, feature_key, enabled)
SELECT id, 'scraper', true FROM tenants WHERE slug = 'muckenfuss-nagel' LIMIT 1
ON CONFLICT (tenant_id, feature_key) DO NOTHING;
```

---

## 6. Ersten Admin-User anlegen (manuell)

**Nach dem Ausführen der App** (die einen bcrypt-Hash erzeugt) kannst du den ersten User anlegen.

Option A: Über die App (empfohlen)
- Beim ersten Login: Wenn `ADMIN_PASSWORD` gesetzt ist und noch keine Users existieren, wird automatisch ein Admin-User `admin` mit diesem Passwort angelegt (Migration vom alten System).
- Danach: Login mit **username** `admin` und **Passwort**.

Option B: Manuell per SQL (bcrypt-Hash muss extern erzeugt werden)
```sql
-- Beispiel: Passwort "changeme123" (bcrypt, 10 Rounds)
-- Hash generieren: node -e "console.log(require('bcryptjs').hashSync('changeme123', 10))"
INSERT INTO users (tenant_id, username, password_hash, display_name, role_id)
SELECT t.id, 'admin', '$2a$10$...', 'Administrator', r.id
FROM tenants t, roles r
WHERE t.slug = 'muckenfuss-nagel' AND r.name = 'admin'
LIMIT 1;
```

---

## 7. Bestehende Daten dem Default-Tenant zuordnen

```sql
-- Bestehende contact_submissions dem Default-Tenant zuweisen
UPDATE contact_submissions
SET tenant_id = (SELECT id FROM tenants WHERE slug = 'muckenfuss-nagel' LIMIT 1)
WHERE tenant_id IS NULL;

-- Bestehende products dem Default-Tenant zuweisen
UPDATE products
SET tenant_id = (SELECT id FROM tenants WHERE slug = 'muckenfuss-nagel' LIMIT 1)
WHERE tenant_id IS NULL;
```

---

## 8. Queries anpassen (nach Migration)

Alle API-Routes, die `contact_submissions` oder `products` lesen, müssen künftig nach `tenant_id` filtern (aus der Session des Users). Das passiert in der App-Logik.

---

## Berechtigungs-Keys (Übersicht)

| Key | Bedeutung |
|-----|-----------|
| `admin` | Vollzugriff (überschreibt alles) |
| `crm.contacts` | Kontakte lesen/schreiben |
| `crm.contacts.read` | Nur lesen |
| `crm.contacts.me` | Nur eigene (assigned_to) |
| `crm.products` | Produkt-Tool |
| `crm.calendar` | Kalender |
| `crm.activity` | Aktivitäten |
| `crm.scraper` | Lead-Scraping |
| `crm.review_funnel` | Bewertungs-Funnel |
| `crm.angebot` | Angebotserstellung |
| `digital_products.*` | Digital Products (Ablefy-Feature) |

---

## Nach der Migration

1. **ADMIN_PASSWORD** bleibt in den Env-Variablen – wird für den ersten Bootstrap-Login genutzt.
2. Beim ersten Login mit dem **bisherigen Passwort** (ohne Username) wird der User `admin` angelegt.
3. Ab dann: Login mit **Username** `admin` und **Passwort**.
4. `ADMIN_PASSWORD` kann danach entfernt werden (optional, schadet nicht wenn es bleibt).
