-- ============================================================
-- DIGITALE PRODUKTE (Ablefy-Modul) – Kurse, Downloads, Mitglieder
-- Führe im Supabase SQL Editor aus (nach 001 + 002).
-- Getrennt von CRM-Produkten (products). Pro Tenant.
-- ============================================================

-- Digitale Produkte (Kurs, Download, Mitgliederbereich)
CREATE TABLE IF NOT EXISTS dp_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('course', 'download', 'membership')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  price_cents INT DEFAULT 0,
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_dp_products_tenant ON dp_products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dp_products_published ON dp_products(tenant_id, is_published) WHERE is_published = true;

-- Dateien/Lessons pro Produkt (PDF, Video-URL, Lektion)
CREATE TABLE IF NOT EXISTS dp_product_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES dp_products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('file', 'video_url', 'lesson')),
  file_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dp_product_files_product ON dp_product_files(product_id);

-- Zugänge (Käufer/Teilnehmer) – E-Mail oder später CRM-Kontakt
CREATE TABLE IF NOT EXISTS dp_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES dp_products(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  access_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, customer_email)
);

CREATE INDEX IF NOT EXISTS idx_dp_enrollments_tenant ON dp_enrollments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dp_enrollments_product ON dp_enrollments(product_id);
CREATE INDEX IF NOT EXISTS idx_dp_enrollments_email ON dp_enrollments(tenant_id, customer_email);

-- Optional: Berechtigung digital_products.* für Rolle "mitarbeiter" (admins haben bereits "admin")
UPDATE roles
SET permissions = permissions || '["digital_products.*"]'::jsonb
WHERE name = 'mitarbeiter'
  AND NOT (permissions @> '["digital_products.*"]'::jsonb);
