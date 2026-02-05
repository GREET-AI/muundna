/**
 * Gemeinsame Parsing-Logik für Gelbe Seiten (Scraper + Streaming-API).
 * Kein 'use server' – kann von API-Routen importiert werden.
 */

import * as cheerio from 'cheerio';
import { normalizeGermanPhone } from './normalize-phone';
import type { ScrapedLeadInsert } from '@/types/scraper-lead';

export function parseAddressLine(text: string): { adresse: string; plz_ort: string } {
  const t = text.trim();
  const plzOrtMatch = t.match(/(\d{5})\s+([^0-9]+?)(?:\s+\d+[,.]?\d*\s*km)?$/);
  if (plzOrtMatch) {
    const plz_ort = `${plzOrtMatch[1]} ${plzOrtMatch[2].trim()}`;
    const rest = t.replace(plzOrtMatch[0], '').replace(/\s*,\s*$/, '').trim();
    return { adresse: rest || plz_ort, plz_ort };
  }
  return { adresse: t, plz_ort: '' };
}

function cleanWebsite(href: string | undefined): string {
  if (!href) return '';
  try {
    const u = new URL(href);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    return href.slice(0, 500);
  } catch {
    return '';
  }
}

/**
 * Von einer Gelbe-Seiten-Profilseite (gsbiz/…) Website und E-Mail auslesen
 * (Website-Button, E-Mail-Button / mailto).
 */
export function parseGelbeSeitenProfilePage(html: string): { website: string; email: string } {
  const $ = cheerio.load(html);
  let website = '';
  let email = '';

  $('a[href^="http"]').each((_, el) => {
    const $el = $(el);
    const href = $el.attr('href') ?? '';
    const text = $el.text().trim().toLowerCase();
    const aria = ($el.attr('aria-label') ?? '').toLowerCase();
    if ((text === 'website' || text === 'webseite' || aria.includes('webseite')) && href.startsWith('http')) {
      const w = cleanWebsite(href);
      if (w && !w.includes('gelbeseiten.de')) website = w;
    }
  });

  $('a[href^="mailto:"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) {
      const addr = href.replace(/^mailto:/i, '').split('?')[0].trim();
      if (addr && addr.includes('@')) email = addr.slice(0, 255);
    }
  });

  return { website, email };
}

export function extractLeadsFromHtml(html: string): ScrapedLeadInsert[] {
  const $ = cheerio.load(html);
  const leads: ScrapedLeadInsert[] = [];
  const seen = new Set<string>();

  function addLead(
    $card: cheerio.Cheerio<any>,
    $a: cheerio.Cheerio<any>,
    firma: string
  ) {
    if (!firma || firma.length < 2 || seen.has(firma)) return;
    seen.add(firma);

    let adresse = '';
    let plz_ort = '';
    let telefon = '';
    let website = '';
    let gs_profile_url = '';
    let gs_email_form_url = '';

    const cardText = $card.text();
    let addrMatch = cardText.match(
      /([^\n]+,\s*\d{5}\s+[^\n]+?)(?:\s+\d+[,.]?\d*\s*km)?/
    );
    if (addrMatch) {
      const parsed = parseAddressLine(addrMatch[1].trim());
      adresse = parsed.adresse;
      plz_ort = parsed.plz_ort;
    } else {
      const fallback = cardText.match(/([A-Za-zäöüÄÖÜß\-\.\s]+(?:straße|str\.|strasse|weg|platz|allee|ring|gasse)\s*\d*[a-z]?)\s*[,]?\s*(\d{5}\s+[A-Za-zäöüÄÖÜß\-\.\s\(\)]+?)(?:\s+\d+[,.]?\d*\s*km)?/i);
      if (fallback) {
        adresse = fallback[1].trim().slice(0, 300);
        plz_ort = fallback[2].trim().replace(/\s+\d+[,.]?\d*\s*km$/, '').slice(0, 100);
      }
    }
    const profileHref = $a.attr('href');
    if (profileHref) {
      try {
        gs_profile_url = new URL(profileHref, 'https://www.gelbeseiten.de').href;
      } catch {
        // ignore
      }
    }

    const telLink = $card.find('a[href^="tel:"]').attr('href');
    if (telLink) telefon = telLink.replace(/^tel:/i, '').trim();
    else {
      const phoneMatch = cardText.match(/0\d[\d\s\/\-]{5,}/);
      if (phoneMatch) telefon = phoneMatch[0].trim();
    }
    telefon = normalizeGermanPhone(telefon) || telefon;
    $card.find('a[href^="http"]').each((__, link) => {
      const $link = $(link);
      if (
        $link.text().trim() === 'Webseite' ||
        $link.attr('aria-label')?.includes('Webseite')
      ) {
        website = cleanWebsite($link.attr('href'));
      }
      const href = $link.attr('href') ?? '';
      if (href.includes('#email-schreiben') || /e-mail/i.test($link.text())) {
        try {
          gs_email_form_url = new URL(href, 'https://www.gelbeseiten.de').href;
        } catch {
          // ignore
        }
      }
    });

    leads.push({
      firma: firma.slice(0, 200),
      adresse: adresse.slice(0, 300),
      plz_ort: plz_ort.slice(0, 100),
      telefon: telefon.slice(0, 50),
      website: website || '',
      gs_profile_url: gs_profile_url || '',
      gs_email_form_url: gs_email_form_url || '',
      notiz: '',
      lead_score: 5,
      status: 'neu',
    });
  }

  const blocks =
    $('article[data-href*="/gsbiz/"]').length > 0
      ? $('article[data-href*="/gsbiz/"]')
      : $('[data-href*="/gsbiz/"]').length > 0
        ? $('[data-href*="/gsbiz/"]')
        : $('article').length > 0
          ? $('article')
          : $('.mod-Treffer, .mod-Hit, [class*="Treffer"], [class*="Hit"]');

  if (blocks.length === 0) {
    $('a[href*="/gsbiz/"]').each((_, el) => {
      const $a = $(el);
      const $card = $a
        .closest(
          "article, [data-href], .mod-Treffer, .mod-Hit, li, div[class*='mod-']"
        )
        .length
        ? $a.closest(
            "article, [data-href], .mod-Treffer, .mod-Hit, li, div[class*='mod-']"
          )
        : $a.parent().parent();
      const firma = ($card.find('h2').first().text() || $a.text())
        .trim()
        .replace(/\s+/g, ' ');
      addLead($card, $a, firma);
    });
  } else {
    blocks.each((_, block) => {
      const $card = $(block);
      const $a = $card.find('a[href*="/gsbiz/"]').first();
      const firma = ($card.find('h2').first().text() || $a.text())
        .trim()
        .replace(/\s+/g, ' ');
      addLead($card, $a, firma);
    });
  }

  return leads;
}
