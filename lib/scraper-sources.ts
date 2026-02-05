/**
 * Konfiguration der Lead-Quellen für das CRM-Scraping.
 * Aktiv: Gelbe Seiten, 11880.com (Playwright, menschliches Verhalten).
 * Geplant: Das Örtliche, Google Maps / Places, Handelsregister.
 */

export type ScraperSourceId = 'gelbeseiten' | '11880' | 'das_oertliche' | 'google_places' | 'handelsregister';

export type ScraperSource = {
  id: ScraperSourceId;
  name: string;
  description: string;
  baseUrl: string;
  searchUrlPattern: string;
  supportsRadius: boolean;
  /** Bereits implementiert und nutzbar */
  available: boolean;
};

export const SCRAPER_SOURCES: ScraperSource[] = [
  {
    id: 'gelbeseiten',
    name: 'Gelbe Seiten',
    description: 'gelbeseiten.de – Scraping mit Playwright, zufälligen Wartezeiten und Scrollen.',
    baseUrl: 'https://www.gelbeseiten.de',
    searchUrlPattern: 'https://www.gelbeseiten.de/suche/{keyword}/{location}',
    supportsRadius: true,
    available: true,
  },
  {
    id: '11880',
    name: '11880.com',
    description: 'Deutschlands größte Branchenauskunft – Suche + Deep-Crawl auf Detailseiten (Website, E-Mail, Telefon).',
    baseUrl: 'https://www.11880.com',
    searchUrlPattern: 'https://www.11880.com/suche/{keyword}/{location}',
    supportsRadius: false,
    available: true,
  },
  {
    id: 'das_oertliche',
    name: 'Das Örtliche',
    description: 'das-oertliche.de – Geplant: Suche nach Branche und Ort.',
    baseUrl: 'https://www.dasoertliche.de',
    searchUrlPattern: 'https://www.dasoertliche.de/Controller?form_name=search_nat&ci={location}&kw={keyword}',
    supportsRadius: false,
    available: false,
  },
  {
    id: 'google_places',
    name: 'Google Maps / Places',
    description: 'Geplant: API-basierte Suche (Places API) nach Unternehmen in einer Region.',
    baseUrl: 'https://www.google.com/maps',
    searchUrlPattern: '',
    supportsRadius: true,
    available: false,
  },
  {
    id: 'handelsregister',
    name: 'Handelsregister',
    description: 'Geplant: Unternehmensdaten aus Handelsregister-Abfragen.',
    baseUrl: 'https://www.handelsregister.de',
    searchUrlPattern: '',
    supportsRadius: false,
    available: false,
  },
];

export function buildGelbeSeitenSearchUrl(
  keyword: string,
  location: string,
  radiusKm?: number
): string {
  const k = encodeURIComponent(keyword.trim().toLowerCase().replace(/\s+/g, '-'));
  const l = encodeURIComponent(location.trim().toLowerCase().replace(/\s+/g, '-'));
  if (!k || !l) return '';
  let url = `https://www.gelbeseiten.de/suche/${k}/${l}`;
  if (radiusKm != null && radiusKm > 0) {
    url += `?umkreis=${radiusKm * 1000}`;
  }
  return url;
}

/** Such-URL für 11880.com: /suche/{keyword}/{location} */
export function build11880SearchUrl(keyword: string, location: string): string {
  const k = encodeURIComponent(keyword.trim().toLowerCase().replace(/\s+/g, '-'));
  const l = encodeURIComponent(location.trim().toLowerCase().replace(/\s+/g, '-'));
  if (!k || !l) return '';
  return `https://www.11880.com/suche/${k}/${l}`;
}
