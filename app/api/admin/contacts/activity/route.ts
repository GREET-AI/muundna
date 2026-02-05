import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/** GET /api/admin/contacts/activity?contact_id=123 – Aktivitätsverlauf eines Kontakts */
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
    const contactId = url.searchParams.get('contact_id');
    if (!contactId) {
      return NextResponse.json({ error: 'contact_id erforderlich' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('contact_activity_log')
      .select('id, contact_id, sales_rep, action, old_value, new_value, created_at')
      .eq('contact_id', Number(contactId))
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({ data: [], message: 'Tabelle contact_activity_log fehlt – Migration ausführen.' }, { status: 200 });
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
