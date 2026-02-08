-- Theme-Farben für Landingpage: eine Primär- und eine Sekundärfarbe pro Produkt.
-- Wenn gesetzt, werden sie an alle Sektionen durchgereicht (Buttons, Akzente, etc.).
ALTER TABLE dp_products
  ADD COLUMN IF NOT EXISTS theme_primary_color TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS theme_secondary_color TEXT DEFAULT NULL;

COMMENT ON COLUMN dp_products.theme_primary_color IS 'Hauptakzentfarbe der Landingpage (z. B. #cb530a). Null = Standard.';
COMMENT ON COLUMN dp_products.theme_secondary_color IS 'Zweite Akzentfarbe (z. B. #a84308). Null = Standard.';
