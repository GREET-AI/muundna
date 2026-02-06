import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminSessionCookie,
  getAdminSessionCookieName,
  getAdminSessionCookieOptions,
} from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/** Timing-sicherer Passwort-Vergleich (verhindert Timing-Attacken). */
function verifyPassword(password: string, secret: string): boolean {
  const key = 'admin-login-timing-safe-v1';
  const expected = createHmac('sha256', key).update(secret, 'utf8').digest();
  const actual = createHmac('sha256', key).update(password, 'utf8').digest();
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(actual, expected);
}

/** POST /api/admin/login – Passwort prüfen, bei Erfolg Session-Cookie setzen (nur server-seitig, kein NEXT_PUBLIC_Passwort) */
export async function POST(request: NextRequest) {
  try {
    const secret = process.env.ADMIN_PASSWORD;
    if (!secret) {
      return NextResponse.json(
        { error: 'ADMIN_PASSWORD nicht konfiguriert (Vercel: Environment Variables)' },
        { status: 500 }
      );
    }

    let body: { password?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 });
    }
    const password = (body.password ?? '').trim();
    if (!password) {
      return NextResponse.json({ error: 'Passwort erforderlich' }, { status: 400 });
    }

    if (!verifyPassword(password, secret)) {
      return NextResponse.json({ error: 'Ungültiges Passwort' }, { status: 401 });
    }

    const cookieValue = createAdminSessionCookie();
    if (!cookieValue) {
      return NextResponse.json({ error: 'Session konnte nicht erstellt werden' }, { status: 500 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(getAdminSessionCookieName(), cookieValue, getAdminSessionCookieOptions());
    return res;
  } catch (error) {
    console.error('Login-Fehler:', error);
    return NextResponse.json({ error: 'Ein Fehler ist aufgetreten' }, { status: 500 });
  }
}
