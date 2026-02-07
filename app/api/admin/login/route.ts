import { createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  createAdminSessionCookie,
  getAdminSessionCookieName,
  getAdminSessionCookieOptions,
} from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/** Timing-sicherer Vergleich für Legacy-Passwort (Bootstrap) */
function verifyLegacyPassword(password: string, secret: string): boolean {
  const key = 'admin-login-timing-safe-v1';
  const expected = createHmac('sha256', key).update(secret, 'utf8').digest();
  const actual = createHmac('sha256', key).update(password, 'utf8').digest();
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(actual, expected);
}

/** Bootstrap: Erster Admin-User wenn noch keine Users existieren */
async function bootstrapAdminUser(password: string): Promise<{ userId: string; tenantId: string } | null> {
  if (!supabaseAdmin) return null;
  const { data: existing } = await supabaseAdmin.from('users').select('id').limit(1);
  if (existing && existing.length > 0) return null;

  const { data: tenant } = await supabaseAdmin
    .from('tenants')
    .select('id')
    .eq('slug', 'muckenfuss-nagel')
    .limit(1)
    .single();
  if (!tenant?.id) return null;

  const { data: role } = await supabaseAdmin
    .from('roles')
    .select('id')
    .eq('name', 'admin')
    .limit(1)
    .single();
  if (!role?.id) return null;

  const passwordHash = bcrypt.hashSync(password, 10);
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .insert({
      tenant_id: tenant.id,
      username: 'admin',
      password_hash: passwordHash,
      display_name: null,
      role_id: role.id,
    })
    .select('id')
    .single();
  if (error || !user?.id) return null;
  return { userId: user.id, tenantId: tenant.id };
}

/** POST /api/admin/login – Username + Passwort oder Bootstrap mit altem Passwort */
export async function POST(request: NextRequest) {
  try {
    let body: { username?: string; password?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 });
    }
    const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : '';
    const password = (body.password ?? '').trim();
    if (!password) {
      return NextResponse.json({ error: 'Passwort erforderlich' }, { status: 400 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    // Bootstrap: Kein Username, ADMIN_PASSWORD gesetzt → Legacy-Login für ersten User
    if (!username && adminPassword) {
      if (!verifyLegacyPassword(password, adminPassword)) {
        return NextResponse.json({ error: 'Ungültiges Passwort' }, { status: 401 });
      }
      const boot = await bootstrapAdminUser(password);
      if (boot) {
        const cookieValue = createAdminSessionCookie(boot.userId, boot.tenantId);
        if (!cookieValue) {
          return NextResponse.json({ error: 'Session konnte nicht erstellt werden' }, { status: 500 });
        }
        const res = NextResponse.json({
          ok: true,
          bootstrap: true,
          username: 'admin',
          message: 'Admin-User wurde angelegt. Ab jetzt bitte mit Username "admin" anmelden.',
        });
        res.cookies.set(getAdminSessionCookieName(), cookieValue, getAdminSessionCookieOptions());
        return res;
      }
    }

    // Normale Anmeldung: Username + Passwort erforderlich
    if (!username) {
      return NextResponse.json(
        { error: 'Bitte Username und Passwort eingeben. Falls Sie zum ersten Mal einloggen, verwenden Sie Ihr bisheriges Passwort (ohne Username).' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Datenbank nicht verfügbar' }, { status: 500 });
    }

    // User laden (username ist pro Tenant eindeutig; wir suchen erstmal global)
    const { data: userRow, error: userErr } = await supabaseAdmin
      .from('users')
      .select('id, tenant_id, password_hash, is_active')
      .eq('username', username)
      .limit(1)
      .maybeSingle();
    if (userErr || !userRow || !userRow.is_active) {
      return NextResponse.json({ error: 'Ungültiger Benutzername oder Passwort' }, { status: 401 });
    }

    const valid = bcrypt.compareSync(password, userRow.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Ungültiger Benutzername oder Passwort' }, { status: 401 });
    }

    const cookieValue = createAdminSessionCookie(userRow.id, userRow.tenant_id);
    if (!cookieValue) {
      return NextResponse.json({ error: 'Session konnte nicht erstellt werden' }, { status: 500 });
    }

    // last_login_at aktualisieren (nicht blockierend)
    supabaseAdmin
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userRow.id)
      .then(() => {});

    const res = NextResponse.json({ ok: true, username });
    res.cookies.set(getAdminSessionCookieName(), cookieValue, getAdminSessionCookieOptions());
    return res;
  } catch (error) {
    console.error('Login-Fehler:', error);
    return NextResponse.json({ error: 'Ein Fehler ist aufgetreten' }, { status: 500 });
  }
}
