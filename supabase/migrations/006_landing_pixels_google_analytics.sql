-- Google Analytics 4 (Measurement-ID G-...) als weiteren Pixel-Provider
ALTER TABLE landing_tracking_pixels
  DROP CONSTRAINT IF EXISTS landing_tracking_pixels_provider_check;

ALTER TABLE landing_tracking_pixels
  ADD CONSTRAINT landing_tracking_pixels_provider_check
  CHECK (provider IN ('facebook', 'google_ads', 'google_analytics', 'tiktok', 'custom'));
