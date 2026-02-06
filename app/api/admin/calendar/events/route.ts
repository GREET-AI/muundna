import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminAuthenticated } from '@/lib/admin-auth';

function checkAdminAuth(request: NextRequest): boolean {
  const cookie = request.cookies.get('admin_session')?.value;
  return isAdminAuthenticated(cookie);
}

export async function GET(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const sales_rep = searchParams.get('sales_rep');

    let query = supabaseAdmin
      .from('calendar_events')
      .select('*')
      .order('start_at', { ascending: true });

    if (from) query = query.gte('start_at', from);
    if (to) query = query.lte('end_at', to);
    if (sales_rep && (sales_rep === 'sven' || sales_rep === 'pascal')) {
      query = query.eq('sales_rep', sales_rep);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({ data: [], migration_required: true }, { status: 200 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [], migration_required: false }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const body = await request.json();
    const { sales_rep, title, start_at, end_at, contact_id, notes, recommended_product_ids, website_state, google_state, social_media_state } = body;

    if (!sales_rep || !title || !start_at || !end_at) {
      return NextResponse.json(
        { error: 'sales_rep, title, start_at und end_at erforderlich' },
        { status: 400 }
      );
    }
    if (sales_rep !== 'sven' && sales_rep !== 'pascal') {
      return NextResponse.json({ error: 'sales_rep muss sven oder pascal sein' }, { status: 400 });
    }

    const insertPayload: Record<string, unknown> = {
      sales_rep,
      title,
      start_at,
      end_at,
      contact_id: contact_id ?? null,
      notes: notes ?? null,
      updated_at: new Date().toISOString(),
    };
    if (Array.isArray(recommended_product_ids)) insertPayload.recommended_product_ids = recommended_product_ids;
    if (website_state !== undefined) insertPayload.website_state = website_state ?? null;
    if (google_state !== undefined) insertPayload.google_state = google_state ?? null;
    if (social_media_state !== undefined) insertPayload.social_media_state = social_media_state ?? null;

    const { data, error } = await supabaseAdmin
      .from('calendar_events')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
