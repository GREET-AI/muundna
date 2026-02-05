import { NextResponse } from 'next/server';
import { getAdminSessionCookieName } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/** POST /api/admin/logout – Session-Cookie löschen */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getAdminSessionCookieName(), '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return res;
}
