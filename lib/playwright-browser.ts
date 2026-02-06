/**
 * Einheitlicher Browser-Zugang für Lead-Scraping (Gelbe Seiten, 11880).
 * - Lokal: chromium.launch() (npx playwright install nötig).
 * - Live (z. B. Vercel): Verbindung zu Browserless über WebSocket (PLAYWRIGHT_BROWSER_WS_URL oder BROWSERLESS_TOKEN).
 */

import type { Browser } from 'playwright';

const DEFAULT_BROWSERLESS_ENDPOINT = 'wss://production-ams.browserless.io';

function getBrowserWsUrl(): string {
  const url = process.env.PLAYWRIGHT_BROWSER_WS_URL?.trim();
  if (url && url.startsWith('wss://')) return url;

  const token = process.env.BROWSERLESS_TOKEN?.trim();
  if (token) {
    const base = process.env.BROWSERLESS_ENDPOINT?.trim() || DEFAULT_BROWSERLESS_ENDPOINT;
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}token=${encodeURIComponent(token)}`;
  }

  return '';
}

/**
 * Startet einen Browser fürs Scraping: lokal (launch) oder Remote (Browserless connectOverCDP).
 */
export async function launchScraperBrowser(): Promise<Browser> {
  const { chromium } = await import('playwright');
  const wsUrl = getBrowserWsUrl();

  if (wsUrl) {
    return chromium.connectOverCDP(wsUrl);
  }

  return chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080',
    ],
  });
}
