import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/** GET /api/admin/activity?limit=100 – Globaler Aktivitätsverlauf (alle Nutzeraktionen) */
export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('admin_session')?.value;
    if (!isAdminAuthenticated(cookie)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase Admin nicht konfiguriert' },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get('limit')) || 80, 200);

    const { data, error } = await supabaseAdmin
      .from('contact_activity_log')
      .select(`
        id,
        contact_id,
        sales_rep,
        action,
        old_value,
        new_value,
        created_at,
        contact_submissions ( company, first_name, last_name )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json(
          { data: [], message: 'Tabelle contact_activity_log fehlt – Migration ausführen.' },
          { status: 200 }
        );
      }
      if (error.code === '42703' || error.message?.includes('contact_submissions')) {
        const { data: fallback } = await supabaseAdmin
          .from('contact_activity_log')
          .select('id, contact_id, sales_rep, action, old_value, new_value, created_at')
          .order('created_at', { ascending: false })
          .limit(limit);
        return NextResponse.json({ data: fallback ?? [] }, { status: 200 });
      }
      console.error('Fehler beim Laden Aktivität:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [] }, { status: 200 });
  } catch (error) {
    console.error('Fehler:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
