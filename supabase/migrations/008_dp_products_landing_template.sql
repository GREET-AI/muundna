-- Vorlage der Landingpage: 'standard' (klassische Sektionen) oder 'parallax' (Parallax-Vorlage).
-- Es darf nur eine Vorlage pro Produkt genutzt werden; die Elemente-Liste im Builder wird danach gefiltert.
ALTER TABLE dp_products
  ADD COLUMN IF NOT EXISTS landing_template TEXT DEFAULT 'standard';

COMMENT ON COLUMN dp_products.landing_template IS 'Landing-Vorlage: standard oder parallax. Bestimmt, welche Sektionen im Builder angeboten werden.';

-- Nur erlaubte Werte erzwingen (optional, für strikte DB-Integrität)
ALTER TABLE dp_products
  DROP CONSTRAINT IF EXISTS dp_products_landing_template_check;
ALTER TABLE dp_products
  ADD CONSTRAINT dp_products_landing_template_check
  CHECK (landing_template IS NULL OR landing_template IN ('standard', 'parallax'));
