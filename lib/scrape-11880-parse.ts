/**
 * 11880.com: URL-Extraktion aus Suchergebnis-HTML (ohne 'use server').
 * Wird von Scraper-Action und Test-API genutzt.
 * Akzeptiert /branchenbuch/..., /eintrag/... und alle www.11880.com-Links die wie Detailseiten aussehen.
 */
import * as cheerio from 'cheerio';

const NON_DETAIL_PATHS = new Set([
  'suche', 'such', 'impressum', 'datenschutz', 'agb', 'login', 'anmelden',
  'kontakt', 'hilfe', 'faq', 'ueber-uns', 'jobs', 'branchen', 'produkte',
  'cookie', 'rechtliches', 'anb', 'neu', 'top', 'favoriten',
]);

function cleanDetailUrl(href: string | undefined, base: string): string {
  if (!href || href.startsWith('#') || href.startsWith('javascript:')) return '';
  try {
    const u = new URL(href, base);
    if (!u.hostname.includes('11880.com')) return '';
    if (u.hostname.startsWith('unternehmen.') || u.hostname.startsWith('firma-')) return '';
    const path = u.pathname.replace(/\/$/, '');
    const segments = path.split('/').filter(Boolean);
    if (segments.length < 2) return '';
    if (NON_DETAIL_PATHS.has(segments[0].toLowerCase())) return '';
    if (segments[0] === 'branchen' && segments.length === 2 && /^[a-z]$/i.test(segments[1])) return '';
    return u.href;
  } catch {
    return '';
  }
}

/** Detailseiten-URLs aus der Suchergebnis-HTML extrahieren (mehrere Selektoren für verschiedene 11880-Strukturen) */
export function extract11880DetailUrls(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const urls = new Set<string>();

  const addUrl = (href: string | undefined) => {
    const full = cleanDetailUrl(href, baseUrl);
    if (full) urls.add(full);
  };

  $('a[href*="/branchenbuch/"]').each((_, el) => addUrl($(el).attr('href')));
  $('a[href*="/eintrag/"]').each((_, el) => addUrl($(el).attr('href')));
  $('a[href*="11880.com/"]').each((_, el) => addUrl($(el).attr('href')));

  return Array.from(urls);
}
