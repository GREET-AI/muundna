-- Landingpage-Builder: Reihenfolge und Typ der Sektionen pro Produkt (JSONB).
-- Jede Sektion: { "id": "uuid", "type": "hero"|"text"|"cta"|"product_info"|..., "props": { ... } }
ALTER TABLE dp_products
ADD COLUMN IF NOT EXISTS landing_page_sections JSONB DEFAULT NULL;

COMMENT ON COLUMN dp_products.landing_page_sections IS 'Array of { id, type, props } for builder; null = use default landing layout';
