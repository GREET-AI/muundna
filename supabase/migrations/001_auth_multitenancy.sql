-- ============================================================
-- AUTH & MULTI-TENANCY MIGRATION
-- Führe dieses Script im Supabase SQL Editor aus.
-- ============================================================

-- TENANTS
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);

-- ROLES
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- USERS
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

-- TENANT_FEATURES
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

-- tenant_id zu bestehenden Tabellen
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_contact_submissions_tenant ON contact_submissions(tenant_id);

ALTER TABLE products ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_products_tenant ON products(tenant_id);

-- Rollen
INSERT INTO roles (name, description, permissions) VALUES
  ('admin', 'Vollzugriff auf alle Bereiche', '["admin"]'::jsonb),
  ('mitarbeiter', 'Kontakte, Kalender, Produkte', '["crm.contacts", "crm.products", "crm.calendar", "crm.activity", "crm.scraper", "crm.review_funnel", "crm.angebot"]'::jsonb),
  ('mitarbeiter_limited', 'Nur eigene Kontakte, Kalender', '["crm.contacts.read", "crm.contacts.me", "crm.calendar"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Default-Tenant
INSERT INTO tenants (name, slug)
VALUES ('Muckenfuss & Nagel', 'muckenfuss-nagel')
ON CONFLICT (slug) DO NOTHING;

-- Tenant Features
INSERT INTO tenant_features (tenant_id, feature_key, enabled)
SELECT id, 'digital_products', true FROM tenants WHERE slug = 'muckenfuss-nagel' LIMIT 1
ON CONFLICT (tenant_id, feature_key) DO UPDATE SET enabled = true;

INSERT INTO tenant_features (tenant_id, feature_key, enabled)
SELECT id, 'calendar', true FROM tenants WHERE slug = 'muckenfuss-nagel' LIMIT 1
ON CONFLICT (tenant_id, feature_key) DO NOTHING;

INSERT INTO tenant_features (tenant_id, feature_key, enabled)
SELECT id, 'scraper', true FROM tenants WHERE slug = 'muckenfuss-nagel' LIMIT 1
ON CONFLICT (tenant_id, feature_key) DO NOTHING;

-- Bestehende Daten dem Default-Tenant zuordnen
UPDATE contact_submissions
SET tenant_id = (SELECT id FROM tenants WHERE slug = 'muckenfuss-nagel' LIMIT 1)
WHERE tenant_id IS NULL;

UPDATE products
SET tenant_id = (SELECT id FROM tenants WHERE slug = 'muckenfuss-nagel' LIMIT 1)
WHERE tenant_id IS NULL;
