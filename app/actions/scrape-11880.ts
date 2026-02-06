'use server';

import * as cheerio from 'cheerio';
import type { Browser } from 'playwright';
import { build11880SearchUrl } from '@/lib/scraper-sources';
import { extract11880DetailUrls } from '@/lib/scrape-11880-parse';
import { normalizeGermanPhone } from '@/lib/normalize-phone';
import type { ScrapedLeadInsert } from '@/types/scraper-lead';

export type Scrape11880Result = {
  ok: boolean;
  leads: ScrapedLeadInsert[];
  error?: string;
};

function randomMs(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function cleanWebsite(href: string | undefined): string {
  if (!href) return '';
  try {
    const u = new URL(href);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    if (u.hostname.includes('11880.com')) return '';
    return href.slice(0, 500);
  } catch {
    return '';
  }
}

/** Einzelne Detailseite parsen: Firma, Adresse, Telefon, E-Mail, Website */
function parse11880DetailPage(html: string, pageUrl: string): ScrapedLeadInsert | null {
  const $ = cheerio.load(html);
  let firma = $('h1').first().text().trim() || $('title').text().split('|')[0].trim();
  if (!firma || firma.length < 2) return null;

  let telefon = '';
  let adresse = '';
  let plz_ort = '';
  let email = '';
  let website = '';

  $('a[href^="tel:"]').each((_, el) => {
    const t = $(el).attr('href')?.replace(/^tel:/i, '').trim();
    if (t && t.length > 5) telefon = t;
  });
  if (!telefon) {
    const body = $('body').text();
    const phoneMatch = body.match(/\(0\d{2,4}\)\s*[\d\s\-/]+/);
    if (phoneMatch) telefon = phoneMatch[0].trim();
  }

  $('a[href^="mailto:"]').each((_, el) => {
    const e = $(el).attr('href')?.replace(/^mailto:/i, '').split('?')[0].trim();
    if (e && e.includes('@')) email = e;
  });

  $('a[href^="http"]').each((_, el) => {
    const $link = $(el);
    const href = $link.attr('href');
    const w = cleanWebsite(href);
    const text = $link.text().trim().toLowerCase();
    if (w && (text === 'website' || text === 'webseite' || text.includes('webseite'))) website = w;
  });
  if (!website) {
    $('a[href^="http"]').each((_, el) => {
      const href = $(el).attr('href');
      const w = cleanWebsite(href);
      if (w) website = w;
    });
  }

  const body = $('body').text();
  // PLZ + Stadt (inkl. Ortsteil in Klammern, z. B. "76189 Karlsruhe (Daxlanden)")
  const plzOrtRegex = /(\d{5})\s+([A-Za-zäöüÄÖÜß\-\.]+(?:\s+[A-Za-zäöüÄÖÜß\-\.]+)*(?:\s*\([^)]+\))?)/g;
  const plzOrtCandidates: { plz: string; ort: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = plzOrtRegex.exec(body)) !== null) {
    const plz = m[1];
    const ort = m[2].trim();
    if (plz === '11880') continue;
    if (/fachportale|11880|branchenbuch|suche|such/i.test(ort)) continue;
    plzOrtCandidates.push({ plz, ort });
  }
  const chosen = plzOrtCandidates.find(c => /^[0-9]{5}$/.test(c.plz) && c.ort.length > 2) || plzOrtCandidates[0];
  if (chosen) {
    plz_ort = `${chosen.plz} ${chosen.ort}`;
    // Straße genau übernehmen (z. B. "Kastanienallee 25", "Maxauer Str. 19")
    const strassenMatch = body.match(/([A-Za-zäöüÄÖÜß\-\.\s]+(?:straße|str\.|strasse|weg|platz|allee|ring|gasse)\s*\d*[a-z]?)\s*[,]?\s*\d{5}/i);
    if (strassenMatch) adresse = strassenMatch[1].trim().slice(0, 300);
    else adresse = plz_ort;
  }

  return {
    firma: firma.slice(0, 200),
    adresse: adresse.slice(0, 300),
    plz_ort: plz_ort.slice(0, 100),
    telefon: normalizeGermanPhone(telefon) || telefon.slice(0, 50),
    website: website || '',
    email: email ? email.slice(0, 200) : undefined,
    gs_profile_url: pageUrl.slice(0, 500),
    gs_email_form_url: '',
    notiz: '',
    lead_score: 5,
    status: 'neu',
  };
}

/**
 * 11880.com scrapen: Suchseite → Detailseiten (menschlich mit Delays).
 * Pro Detailseite: Firma, Adresse, Telefon, E-Mail, Website.
 */
export async function scrape11880(
  keyword: string,
  location: string
): Promise<Scrape11880Result> {
  const url = build11880SearchUrl(keyword, location);
  if (!url) {
    return { ok: false, leads: [], error: 'Keyword und Ort sind erforderlich.' };
  }

  let browser: Browser | null = null;
  const baseUrl = 'https://www.11880.com';

  try {
    const { launchScraperBrowser } = await import('@/lib/playwright-browser');
    await delay(randomMs(2000, 5000));
    browser = await launchScraperBrowser();

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      locale: 'de-DE',
      timezoneId: 'Europe/Berlin',
    });

    const page = await context.newPage();

    const detailUrls = new Set<string>();
    const maxPages = 18;
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const pageUrl = pageNum === 1 ? url : `${url}?seite=${pageNum}`;
      await page.goto(pageUrl, {
        waitUntil: 'load',
        timeout: 30000,
      });
      await delay(randomMs(4000, 8000));
      try {
        await page.waitForSelector('a[href*="/branchenbuch/"], a[href*="/eintrag/"], a[href*="11880.com/"]', { timeout: 10000 });
      } catch {
        // Kein expliziter Selector – weiter mit aktuellem HTML
      }
      for (let s = 0; s < 4; s++) {
        await page.evaluate(() => window.scrollBy(0, 300 + Math.random() * 400));
        await delay(randomMs(800, 2000));
      }
      const searchHtml = await page.content();
      const urlsOnPage = extract11880DetailUrls(searchHtml, baseUrl);
      urlsOnPage.forEach((u) => detailUrls.add(u));
      if (urlsOnPage.length < 2) break;
    }

    const detailUrlsArray = Array.from(detailUrls);

    if (detailUrlsArray.length === 0) {
      await context.close();
      await browser.close();
      return {
        ok: true,
        leads: [],
        error: 'Keine Detailseiten gefunden. Evtl. hat 11880.com die Struktur geändert oder blockiert den Zugriff.',
      };
    }

    const leads: ScrapedLeadInsert[] = [];
    const seenFirma = new Set<string>();

    for (let i = 0; i < detailUrlsArray.length; i++) {
      await delay(randomMs(1500, 3500));
      try {
        await page.goto(detailUrlsArray[i], {
          waitUntil: 'domcontentloaded',
          timeout: 20000,
        });
        await delay(randomMs(1200, 2800));
        const detailHtml = await page.content();
        const lead = parse11880DetailPage(detailHtml, detailUrlsArray[i]);
        if (lead && !seenFirma.has(lead.firma)) {
          seenFirma.add(lead.firma);
          leads.push(lead);
        }
      } catch {
        // Einzelne Detailseite fehlgeschlagen – überspringen
      }
    }

    await context.close();
    await browser.close();
    browser = null;

    return { ok: true, leads };
  } catch (e) {
    if (browser) {
      try {
        await browser.close();
      } catch {
        // ignore
      }
    }
    const message = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      leads: [],
      error: message,
    };
  }
}
