import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/** GET /api/admin/departments – Abteilungen für Dropdown (für aktuellen Tenant freigeschaltet) */
export async function GET(request: NextRequest) {
  try {
    const session = getAdminSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const { data: tenantDepts } = await supabaseAdmin
      .from('tenant_departments')
      .select('department_key')
      .eq('tenant_id', session.tid)
      .eq('enabled', true);

    const allowedKeys = tenantDepts?.length
      ? tenantDepts.map((r: { department_key: string }) => r.department_key)
      : null;

    let query = supabaseAdmin
      .from('departments')
      .select('key, label, sort_order')
      .order('sort_order', { ascending: true })
      .order('key');

    if (allowedKeys && allowedKeys.length > 0) {
      query = query.in('key', allowedKeys);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [] }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
