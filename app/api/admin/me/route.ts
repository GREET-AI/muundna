import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionCookie } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/** GET /api/admin/me – Prüft ob gültige Admin-Session (Cookie) vorhanden ist */
export async function GET(request: NextRequest) {
  try {
    const cookieName = request.cookies.get('admin_session');
    const cookieValue = cookieName?.value;
    const valid = verifyAdminSessionCookie(cookieValue);
    if (!valid) {
      return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  }
}
