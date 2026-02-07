-- ============================================================
-- ABTEILUNGEN (Vertrieb, Social Media, …) – statt fester Vertrieblernamen
-- Führe im Supabase SQL Editor aus (nach 001_auth_multitenancy.sql).
-- ============================================================

-- Abteilungen (global, pro Tenant freischaltbar über tenant_departments)
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_departments_key ON departments(key);

-- Welche Abteilungen pro Tenant sichtbar/freigeschaltet sind (optional)
CREATE TABLE IF NOT EXISTS tenant_departments (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  department_key TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, department_key)
);

CREATE INDEX IF NOT EXISTS idx_tenant_departments_tenant ON tenant_departments(tenant_id);

-- users: Abteilung (key aus departments), ersetzt Vertriebler-Name
ALTER TABLE users ADD COLUMN IF NOT EXISTS department_key TEXT;
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_key);

-- Standard-Abteilungen
INSERT INTO departments (key, label, sort_order) VALUES
  ('vertrieb', 'Vertrieb', 10),
  ('social_media', 'Social Media Marketing', 20),
  ('support', 'Support', 30),
  ('marketing', 'Marketing', 40),
  ('leitung', 'Leitung', 50)
ON CONFLICT (key) DO NOTHING;

-- Alle Abteilungen für den Default-Tenant freischalten
INSERT INTO tenant_departments (tenant_id, department_key, enabled)
SELECT t.id, d.key, true
FROM tenants t
CROSS JOIN departments d
WHERE t.slug = 'muckenfuss-nagel'
ON CONFLICT (tenant_id, department_key) DO NOTHING;
