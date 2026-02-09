import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getMainpageTemplateJson } from '@/lib/mainpage-template';

const HOMEPAGE_SLUG = 'home';

/**
 * GET – Homepage des aktuellen Tenants (pages) oder Standard-Vorlage.
 * tenant_id ausschließlich aus Session (kein Query-Param).
 */
export async function GET(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session?.tid) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'Datenbank nicht verfügbar' }, { status: 500 });

  const { data: page } = await supabaseAdmin
    .from('pages')
    .select('id, title, json_data, is_published')
    .eq('tenant_id', session.tid)
    .eq('type', 'homepage')
    .eq('slug', HOMEPAGE_SLUG)
    .maybeSingle();

  if (page) {
    return NextResponse.json({
      data: {
        id: page.id,
        title: page.title,
        json_data: page.json_data ?? {},
        is_published: page.is_published ?? false,
      },
      fromTemplate: false,
    });
  }

  // Keine Seite vorhanden → Main-Page-Template (Startseiten-Struktur mit Platzhaltern)
  const template = getMainpageTemplateJson();
  return NextResponse.json({
    data: {
      id: null,
      title: template.title,
      json_data: { title: template.title, components: template.components },
      is_published: false,
    },
    fromTemplate: true,
  });
}

/**
 * PUT – Homepage speichern (upsert in pages, tenant_id aus Session).
 */
export async function PUT(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session?.tid) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'Datenbank nicht verfügbar' }, { status: 500 });

  let body: { title?: string; json_data?: Record<string, unknown>; is_published?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültiger Body' }, { status: 400 });
  }

  const json_data = body.json_data ?? {};
  const title = typeof body.title === 'string' ? body.title : 'Startseite';
  const is_published = body.is_published === undefined ? undefined : Boolean(body.is_published);

  const { data: existing } = await supabaseAdmin
    .from('pages')
    .select('id, is_published')
    .eq('tenant_id', session.tid)
    .eq('type', 'homepage')
    .eq('slug', HOMEPAGE_SLUG)
    .maybeSingle();

  const payload: Record<string, unknown> = {
    tenant_id: session.tid,
    type: 'homepage',
    slug: HOMEPAGE_SLUG,
    title,
    json_data,
    updated_at: new Date().toISOString(),
  };
  if (is_published !== undefined) payload.is_published = is_published;
  else if (existing?.id && existing?.is_published !== undefined) payload.is_published = existing.is_published;

  if (existing?.id) {
    const { data, error } = await supabaseAdmin
      .from('pages')
      .update(payload)
      .eq('id', existing.id)
      .select('id, title, json_data, is_published')
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  const insertPayload: Record<string, unknown> = { ...payload, created_at: new Date().toISOString() };
  if (insertPayload.is_published === undefined) insertPayload.is_published = false;
  const { data, error } = await supabaseAdmin
    .from('pages')
    .insert(insertPayload)
    .select('id, title, json_data, is_published')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
