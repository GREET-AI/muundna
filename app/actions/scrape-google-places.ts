'use server';

import type { ScrapedLeadInsert } from '@/types/scraper-lead';

export type ScrapeGooglePlacesResult = {
  ok: boolean;
  leads: ScrapedLeadInsert[];
  error?: string;
};

/**
 * Google Maps / Places Scraper – Stub.
 * Gibt aktuell keine Leads zurück. Später: Places API oder Playwright-Scraping.
 */
export async function scrapeGooglePlaces(
  _keyword: string,
  _location: string,
  _radiusKm?: number
): Promise<ScrapeGooglePlacesResult> {
  return { ok: true, leads: [] };
}
