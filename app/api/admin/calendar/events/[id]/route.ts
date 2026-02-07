import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminSession } from '@/lib/admin-auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!getAdminSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const { id } = await params;
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) {
      return NextResponse.json({ error: 'Ungültige ID' }, { status: 400 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    const allowed = ['sales_rep', 'title', 'start_at', 'end_at', 'contact_id', 'notes', 'recommended_product_ids', 'website_state', 'google_state', 'social_media_state'] as const;
    for (const key of allowed) {
      if (body[key] !== undefined) {
        if (key === 'contact_id') updates[key] = body[key] == null ? null : body[key];
        else if (key === 'recommended_product_ids') updates[key] = Array.isArray(body[key]) ? body[key] : [];
        else if (['website_state', 'google_state', 'social_media_state'].includes(key)) updates[key] = body[key] ?? null;
        else updates[key] = body[key];
      }
    }
    if (body.sales_rep && body.sales_rep !== 'sven' && body.sales_rep !== 'pascal') {
      return NextResponse.json({ error: 'sales_rep muss sven oder pascal sein' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('calendar_events')
      .update(updates)
      .eq('id', numId)
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!getAdminSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const { id } = await params;
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) {
      return NextResponse.json({ error: 'Ungültige ID' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('calendar_events').delete().eq('id', numId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
