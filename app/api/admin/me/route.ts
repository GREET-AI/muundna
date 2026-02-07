import { NextRequest, NextResponse } from 'next/server';
import { parseAdminSessionCookie, verifyAdminSessionCookie } from '@/lib/admin-auth';
import { getAuthUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/** GET /api/admin/me – Session prüfen, User-Info + Berechtigungen + Abteilung zurückgeben */
export async function GET(request: NextRequest) {
  try {
    const cookieValue = request.cookies.get('admin_session')?.value;

    if (verifyAdminSessionCookie(cookieValue) && !parseAdminSessionCookie(cookieValue)) {
      return NextResponse.json(
        { error: 'Session abgelaufen. Bitte mit Username und Passwort erneut anmelden.', legacy: true },
        { status: 401 }
      );
    }

    const session = parseAdminSessionCookie(cookieValue);
    if (!session) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
    }

    const user = await getAuthUser(session.uid, session.tid);
    if (!user) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 401 });
    }

    let department_label: string | null = null;
    if (user.department_key && supabaseAdmin) {
      const { data: dept } = await supabaseAdmin
        .from('departments')
        .select('label')
        .eq('key', user.department_key)
        .maybeSingle();
      department_label = dept?.label ?? null;
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        department_key: user.department_key,
        department_label: department_label ?? user.department_key,
        role: user.role.name,
        permissions: user.permissions,
        features: user.features,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }
}
