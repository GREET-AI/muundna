import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/** GET /api/admin/team-members – Minimale Nutzerliste für Zuweisung-Dropdown (alle eingeloggten User, gleicher Tenant) */
export async function GET(request: NextRequest) {
  try {
    const session = getAdminSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, username, display_name, department_key')
      .eq('tenant_id', session.tid)
      .eq('is_active', true)
      .order('username');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const departmentKeys = [...new Set((users ?? []).map((u: { department_key?: string }) => u.department_key).filter(Boolean))];
    const labelMap: Record<string, string> = {};
    if (departmentKeys.length > 0) {
      try {
        const { data: depts } = await supabaseAdmin.from('departments').select('key, label').in('key', departmentKeys);
        (depts ?? []).forEach((d: { key: string; label: string }) => { labelMap[d.key] = d.label; });
      } catch {
        // departments-Tabelle evtl. noch nicht migriert
      }
    }

    const list = (users ?? []).map((u: Record<string, unknown>) => ({
      id: u.id,
      username: u.username,
      display_name: u.display_name ?? u.username,
      department_key: u.department_key ?? null,
      department_label: u.department_key ? (labelMap[u.department_key as string] ?? (u.department_key as string)) : null,
    }));

    return NextResponse.json({ data: list }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
