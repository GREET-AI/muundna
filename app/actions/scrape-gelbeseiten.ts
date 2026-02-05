'use server';

import type { Browser } from 'playwright';
import { buildGelbeSeitenSearchUrl } from '@/lib/scraper-sources';
import { extractLeadsFromHtml } from '@/lib/scrape-gelbeseiten-parse';
import type { ScrapedLeadInsert } from '@/types/scraper-lead';

export type ScrapeResult = {
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

export async function scrapeGelbeSeiten(
  keyword: string,
  location: string,
  radiusKm?: number
): Promise<ScrapeResult> {
  const url = buildGelbeSeitenSearchUrl(keyword, location, radiusKm);
  if (!url) {
    return { ok: false, leads: [], error: 'Keyword und Ort sind erforderlich.' };
  }

  let browser: Browser | null = null;

  try {
    const { chromium } = await import('playwright');

    await delay(randomMs(2000, 5000));

    browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080',
      ],
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      locale: 'de-DE',
      timezoneId: 'Europe/Berlin',
    });

    const page = await context.newPage();

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 25000,
    });

    const allLeads: ScrapedLeadInsert[] = [];
    const seenProfileUrl = new Set<string>();
    const maxLoadMore = 25;

    for (let loadMoreCount = 0; loadMoreCount <= maxLoadMore; loadMoreCount++) {
      await delay(randomMs(4000, 10000));
      for (let s = 0; s < 3; s++) {
        await page.evaluate(() => {
          const step = 200 + Math.random() * 600;
          window.scrollBy(0, step);
        });
        await delay(randomMs(1000, 3000));
      }
      const html = await page.content();
      const pageLeads = extractLeadsFromHtml(html);
      for (const lead of pageLeads) {
        const key = lead.gs_profile_url || lead.firma;
        if (key && !seenProfileUrl.has(key)) {
          seenProfileUrl.add(key);
          allLeads.push(lead);
        }
      }
      const moreButton = page.getByText(/Mehr laden|Weitere Treffer/i).first();
      if (!(await moreButton.count())) break;
      await delay(randomMs(2000, 5000));
      await moreButton.click().catch(() => null);
      await delay(randomMs(3000, 7000));
    }

    await context.close();
    await browser.close();
    browser = null;

    return { ok: true, leads: allLeads };
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
