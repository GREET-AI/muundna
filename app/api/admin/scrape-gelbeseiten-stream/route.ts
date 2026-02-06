/**
 * Gelbe-Seiten-Scraper als Streaming-API: sendet Live-Fortschritt (Anzeigen sammeln → Anzahl → Leads nacheinander).
 * Verhindert Timeouts bei langen Läufen und liefert Fortschritt für die UI.
 */

import { NextRequest } from 'next/server';
import type { Browser } from 'playwright';
import { buildGelbeSeitenSearchUrl } from '@/lib/scraper-sources';
import { extractLeadsFromHtml, parseGelbeSeitenProfilePage } from '@/lib/scrape-gelbeseiten-parse';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { launchScraperBrowser } from '@/lib/playwright-browser';
import type { ScrapedLeadInsert } from '@/types/scraper-lead';

function randomMs(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function sse(data: object): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('admin_session')?.value;
  if (!isAdminAuthenticated(cookie)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  let body: { keyword?: string; location?: string; radiusKm?: number };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Ungültiger JSON-Body' }), { status: 400 });
  }

  const keyword = (body.keyword ?? '').trim();
  const location = (body.location ?? '').trim();
  const radiusKm = body.radiusKm;

  if (!keyword || !location) {
    return new Response(JSON.stringify({ error: 'Keyword und Ort sind erforderlich.' }), { status: 400 });
  }

  const url = buildGelbeSeitenSearchUrl(keyword, location, radiusKm && radiusKm > 0 ? radiusKm : undefined);
  if (!url) {
    return new Response(JSON.stringify({ error: 'Ungültige Suchparameter.' }), { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: object) => controller.enqueue(new TextEncoder().encode(sse(obj)));
      let browser: Browser | null = null;

      try {
        send({ phase: 'anzeigen_sammeln' });

        await delay(randomMs(1500, 4000));
        browser = await launchScraperBrowser();

        const context = await browser.newContext({
          viewport: { width: 1920, height: 1080 },
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          locale: 'de-DE',
          timezoneId: 'Europe/Berlin',
        });

        const page = await context.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });

        const seenProfileUrl = new Set<string>();
        const allLeads: ScrapedLeadInsert[] = [];
        const maxLoadMore = 25;

        for (let loadMoreCount = 0; loadMoreCount <= maxLoadMore; loadMoreCount++) {
          await delay(randomMs(3000, 8000));
          for (let s = 0; s < 3; s++) {
            await page.evaluate(() => window.scrollBy(0, 200 + Math.random() * 600));
            await delay(randomMs(800, 2500));
          }
          const html = await page.content();
          const pageLeads = extractLeadsFromHtml(html);

          for (const lead of pageLeads) {
            const key = lead.gs_profile_url || lead.firma;
            if (key && !seenProfileUrl.has(key)) {
              seenProfileUrl.add(key);
              if (lead.gs_profile_url) {
                await delay(randomMs(1500, 3500));
                try {
                  await page.goto(lead.gs_profile_url, { waitUntil: 'domcontentloaded', timeout: 15000 });
                  await delay(randomMs(1000, 2500));
                  const profileHtml = await page.content();
                  const { website: profileWebsite, email: profileEmail } = parseGelbeSeitenProfilePage(profileHtml);
                  if (profileWebsite) lead.website = profileWebsite;
                  if (profileEmail) lead.email = profileEmail;
                } catch {
                  // Profilseite nicht erreichbar – Lead trotzdem mit Listen-Daten senden
                }
              }
              allLeads.push(lead);
              send({ phase: 'lead', lead });
            }
          }
          send({ phase: 'found', count: allLeads.length });

          const moreButton = page.getByText(/Mehr laden|Weitere Treffer/i).first();
          if (!(await moreButton.count())) break;
          await delay(randomMs(2000, 4500));
          await moreButton.click().catch(() => null);
          await delay(randomMs(2500, 6000));
        }

        await context.close();
        await browser.close();
        browser = null;

        send({ phase: 'done', count: allLeads.length });
      } catch (e) {
        if (browser) {
          try {
            await browser.close();
          } catch {
            // ignore
          }
        }
        const message = e instanceof Error ? e.message : String(e);
        send({ phase: 'error', error: message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
