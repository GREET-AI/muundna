import { NextRequest, NextResponse } from 'next/server';
import { scrape11880 } from '@/app/actions/scrape-11880';
import { build11880SearchUrl } from '@/lib/scraper-sources';
import { extract11880DetailUrls } from '@/lib/scrape-11880-parse';
import { getAdminSession } from '@/lib/admin-auth';

/**
 * Backend-Test für 11880-Scraper.
 * GET /api/admin/test-11880?keyword=Maurer&location=Eppingen
 * GET /api/admin/test-11880?keyword=Maurer&location=Eppingen&dry=1  → nur Suchseite per fetch, keine Playwright
 * Auth: Session-Cookie (nach Login unter /admin)
 */
export async function GET(request: NextRequest) {
  if (!getAdminSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') ?? 'Maurer';
  const location = searchParams.get('location') ?? 'Eppingen';
  const dry = searchParams.get('dry') === '1';

  const searchUrl = build11880SearchUrl(keyword, location);

  if (dry) {
    try {
      const res = await fetch(searchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
        signal: AbortSignal.timeout(15000),
      });
      const html = await res.text();
      const urls = extract11880DetailUrls(html, 'https://www.11880.com');
      return NextResponse.json({
        keyword,
        location,
        searchUrl,
        dry: true,
        status: res.status,
        htmlLength: html.length,
        detailUrlCount: urls.length,
        sampleDetailUrls: urls.slice(0, 5),
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return NextResponse.json({
        keyword,
        location,
        searchUrl,
        dry: true,
        error: message,
      }, { status: 500 });
    }
  }

  try {
    const result = await scrape11880(keyword, location);
    return NextResponse.json({
      keyword,
      location,
      searchUrl,
      ok: result.ok,
      leadsCount: result.leads?.length ?? 0,
      error: result.error ?? null,
      leads: result.leads ?? [],
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const stack = e instanceof Error ? e.stack : undefined;
    return NextResponse.json({
      keyword,
      location,
      searchUrl,
      ok: false,
      leadsCount: 0,
      error: message,
      leads: [],
      thrown: { message, stack },
    }, { status: 500 });
  }
}
