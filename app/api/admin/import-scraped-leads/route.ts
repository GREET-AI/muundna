import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import { normalizeGermanPhone } from '../../../../lib/normalize-phone';
import { getAdminSession } from '@/lib/admin-auth';
import type { ScrapedLeadInsert } from '@/types/scraper-lead';

export async function POST(request: NextRequest) {
  try {
    const session = getAdminSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase Admin nicht konfiguriert' },
        { status: 500 }
      );
    }

    let body: { leads?: unknown; source?: string; scrape_batch_id?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, inserted: 0, skipped_duplicates: 0, error: 'Ungültige Anfrage (JSON).' },
        { status: 400 }
      );
    }
    const leads: ScrapedLeadInsert[] = Array.isArray(body.leads) ? body.leads : [];
    const source = (body.source as string) || 'gelbe_seiten';
    const scrapeBatchId = (body.scrape_batch_id as string) || null;

    if (leads.length === 0) {
      return NextResponse.json(
        { ok: false, inserted: 0, skipped_duplicates: 0, error: 'Keine Leads zum Importieren.' },
        { status: 400 }
      );
    }

    const { data: existing } = await supabaseAdmin
      .from('contact_submissions')
      .select('phone, email, company, city')
      .eq('tenant_id', session.tid)
      .in('source', ['gelbe_seiten', '11880', 'google_places']);
    const existingKeys = new Set<string>();
    existing?.forEach((r) => {
      const p = normalizeGermanPhone(r.phone);
      const e = (r.email || '').trim();
      const c = (r.company || '').trim().slice(0, 150);
      const t = (r.city || '').trim().slice(0, 80);
      if (p) existingKeys.add(`p:${p}`);
      if (e) existingKeys.add(`e:${e}`);
      if (c) existingKeys.add(`c:${c}:${t}`);
    });

    const rows: Array<Record<string, unknown>> = [];
    const seenInBatch = new Set<string>();
    for (const lead of leads) {
      const p = normalizeGermanPhone(lead.telefon);
      const e = lead.email?.trim() || '';
      const c = lead.firma.trim().slice(0, 150);
      const t = (lead.plz_ort || '').trim().slice(0, 80);
      const companyKey = `c:${c}:${t}`;
      if (p && existingKeys.has(`p:${p}`)) continue;
      if (e && existingKeys.has(`e:${e}`)) continue;
      if (c && existingKeys.has(companyKey)) continue;
      if (seenInBatch.has(companyKey)) continue;
      seenInBatch.add(companyKey);
      if (p) existingKeys.add(`p:${p}`);
      if (e) existingKeys.add(`e:${e}`);
      if (c) existingKeys.add(companyKey);

      rows.push({
        tenant_id: session.tid,
        first_name: lead.firma.slice(0, 100),
        last_name: '',
        email: (lead.email && lead.email.trim()) || null,
        phone: p || lead.telefon?.trim() || null,
        service: null,
        message: null,
        street: lead.adresse || null,
        city: lead.plz_ort || null,
        quiz_data: null,
        status: 'neu',
        notes: [
          lead.website ? `Website: ${lead.website}` : '',
          lead.gs_profile_url ? (source === '11880' ? `11880-Profil: ${lead.gs_profile_url}` : `GS-Profil: ${lead.gs_profile_url}`) : '',
          lead.gs_email_form_url ? `GS E-Mail-Form: ${lead.gs_email_form_url}` : '',
          lead.notiz || '',
        ]
          .filter(Boolean)
          .join('\n'),
        company: lead.firma.slice(0, 200),
        source,
        source_meta: source === '11880'
          ? { profile_url: lead.gs_profile_url || null }
          : {
              gs_profile_url: lead.gs_profile_url || null,
              gs_email_form_url: lead.gs_email_form_url || null,
            },
        scrape_batch_id: scrapeBatchId,
      });
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: true, inserted: 0, skipped_duplicates: leads.length, scrape_batch_id: scrapeBatchId },
        { status: 200 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('contact_submissions')
      .insert(rows)
      .select('id');

    if (error) {
      console.error('Import scraped leads:', error);
      const message = error.code === '42703'
        ? 'Datenbank-Migration fehlt. Bitte SUPABASE_SCRAPER_MIGRATION.md im Supabase SQL Editor ausführen.'
        : error.message;
      return NextResponse.json(
        { ok: false, inserted: 0, skipped_duplicates: 0, error: message },
        { status: 500 }
      );
    }

    const inserted = data?.length ?? 0;
    const skipped = leads.length - inserted;
    return NextResponse.json(
      { ok: true, inserted, skipped_duplicates: skipped, scrape_batch_id: scrapeBatchId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Import scraped leads:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
