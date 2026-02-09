-- ============================================================
-- PAGE_TEMPLATES + PAGES (Homepage-Builder)
-- Templates: Vorlagen (type 'homepage'), tenant_id nullable = System-Vorlage.
-- Pages: Veröffentlichte Seiten pro Tenant (type 'homepage' | 'landing'), slug z. B. 'home'.
-- ============================================================

-- Vorlagen (z. B. "Standard Homepage"); tenant_id NULL = globale Vorlage
CREATE TABLE IF NOT EXISTS page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('homepage')),
  json_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_templates_type ON page_templates(type);
CREATE INDEX IF NOT EXISTS idx_page_templates_tenant ON page_templates(tenant_id);

-- Seiten pro Tenant (Homepage, später ggf. weitere); eine Homepage pro Tenant (slug = 'home')
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('homepage', 'landing')),
  slug TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  json_data JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, type, slug)
);

CREATE INDEX IF NOT EXISTS idx_pages_tenant ON pages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pages_tenant_published ON pages(tenant_id, is_published) WHERE is_published = true;

-- Optionale System-Vorlage (tenant_id NULL). Vollständiges JSON kommt aus lib/homepage-template.ts / API.
INSERT INTO page_templates (id, tenant_id, name, type, json_data, created_at, updated_at)
SELECT gen_random_uuid(), NULL, 'Standard Homepage', 'homepage', '{}'::jsonb, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM page_templates WHERE type = 'homepage' AND tenant_id IS NULL LIMIT 1);
