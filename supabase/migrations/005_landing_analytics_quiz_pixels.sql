-- ============================================================
-- Landingpage-Analytics: Quiz pro Produkt, Funnel-Events, Pixels
-- Nach 004 ausführen. Siehe docs/LANDING_ANALYTICS_QUIZ_PIXELS.md
-- ============================================================

-- Quiz-Konfiguration pro Produkt (eigene Fragen/Antworten; null = Default-Quiz)
ALTER TABLE dp_products
ADD COLUMN IF NOT EXISTS quiz_config JSONB DEFAULT NULL;

COMMENT ON COLUMN dp_products.quiz_config IS 'Optional: { "steps": [ { "id", "title", "subtitle", "type": "single"|"multiple", "options": [ { "id", "label", "icon?", "detail?", "optional?" } ] } ] }. If null, use default quiz in code.';

-- Funnel-Events für Analytics (wer bricht bei welcher Frage ab?)
CREATE TABLE IF NOT EXISTS landing_funnel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES dp_products(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  step_index INT,
  step_id TEXT,
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_landing_funnel_events_product ON landing_funnel_events(product_id);
CREATE INDEX IF NOT EXISTS idx_landing_funnel_events_created ON landing_funnel_events(created_at);
CREATE INDEX IF NOT EXISTS idx_landing_funnel_events_session ON landing_funnel_events(session_id);
CREATE INDEX IF NOT EXISTS idx_landing_funnel_events_type ON landing_funnel_events(event_type);

COMMENT ON TABLE landing_funnel_events IS 'Events: landing_view, quiz_start, quiz_step_view, quiz_step_ok, quiz_abandon, quiz_form_view, quiz_complete';

-- Tracking-Pixel pro Landingpage (Facebook, Google Ads, TikTok, custom)
CREATE TABLE IF NOT EXISTS landing_tracking_pixels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES dp_products(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('facebook', 'google_ads', 'google_analytics', 'tiktok', 'custom')),
  pixel_id TEXT,
  name TEXT,
  script_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_landing_tracking_pixels_product ON landing_tracking_pixels(product_id);

COMMENT ON TABLE landing_tracking_pixels IS 'Per-product pixels for /p/[slug] and /p/[slug]/quiz; script_content for provider=custom';
