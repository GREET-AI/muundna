import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminSession } from '@/lib/admin-auth';
import { getAuthUser, hasPermission } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/** Prüft ob der eingeloggte User Team-Mitglieder verwalten darf */
async function requireUserManagement(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  const user = await getAuthUser(session.uid, session.tid);
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (!hasPermission(user, 'admin') && !hasPermission(user, 'users.manage')) {
    return { error: NextResponse.json({ error: 'Keine Berechtigung zur Benutzerverwaltung' }, { status: 403 }) };
  }
  return { session, user };
}

/** GET /api/admin/users – Liste aller Benutzer des eigenen Tenants (nur Admin/users.manage) */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireUserManagement(request);
    if ('error' in auth) return auth.error;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, username, display_name, department_key, is_active, last_login_at, created_at, role_id')
      .eq('tenant_id', auth.session.tid)
      .order('username');

    if (error) {
      console.error('Users list error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const roleIds = [...new Set((users ?? []).map((u: { role_id?: string }) => u.role_id).filter(Boolean))];
    const roleMap: Record<string, string> = {};
    if (roleIds.length > 0) {
      const { data: roles } = await supabaseAdmin.from('roles').select('id, name').in('id', roleIds);
      (roles ?? []).forEach((r: { id: string; name: string }) => { roleMap[r.id] = r.name; });
    }

    const deptKeys = [...new Set((users ?? []).map((u: { department_key?: string }) => u.department_key).filter(Boolean))];
    const deptMap: Record<string, string> = {};
    if (deptKeys.length > 0) {
      try {
        const { data: depts } = await supabaseAdmin.from('departments').select('key, label').in('key', deptKeys);
        (depts ?? []).forEach((d: { key: string; label: string }) => { deptMap[d.key] = d.label; });
      } catch {
        // departments evtl. noch nicht migriert
      }
    }

    const list = (users ?? []).map((u: Record<string, unknown>) => ({
      id: u.id,
      username: u.username,
      display_name: u.display_name,
      department_key: u.department_key ?? null,
      department_label: u.department_key ? (deptMap[u.department_key as string] ?? (u.department_key as string)) : null,
      is_active: u.is_active,
      last_login_at: u.last_login_at,
      created_at: u.created_at,
      role: roleMap[(u.role_id as string) ?? ''] ?? null,
    }));

    return NextResponse.json({ data: list }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

/** POST /api/admin/users – Neuen Benutzer anlegen (nur Admin/users.manage) */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireUserManagement(request);
    if ('error' in auth) return auth.error;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    let body: { username?: string; password?: string; display_name?: string; role?: string; department_key?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Ungültige Anfrage (JSON)' }, { status: 400 });
    }

    const username = (body.username ?? '').trim().toLowerCase();
    const password = (body.password ?? '').trim();
    const displayName = (body.display_name ?? '').trim() || null;
    const roleName = (body.role ?? 'mitarbeiter').trim();
    const departmentKey = (body.department_key ?? '').trim() || null;

    // Nur Superadmin darf Superadmins und Admins anlegen; Admin darf nur andere Rollen (mitarbeiter, mitarbeiter_limited)
    const requesterRole = auth.user.role.name;
    if (requesterRole !== 'superadmin' && (roleName === 'superadmin' || roleName === 'admin')) {
      return NextResponse.json(
        { error: 'Nur Superadmins dürfen Benutzer mit Rolle Superadmin oder Admin anlegen.' },
        { status: 403 }
      );
    }

    if (!username || username.length < 2) {
      return NextResponse.json({ error: 'Benutzername erforderlich (mind. 2 Zeichen)' }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Passwort erforderlich (mind. 8 Zeichen)' }, { status: 400 });
    }

    const { data: roleRow, error: roleErr } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('name', roleName)
      .limit(1)
      .maybeSingle();

    if (roleErr || !roleRow?.id) {
      return NextResponse.json({ error: `Rolle "${roleName}" nicht gefunden` }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('tenant_id', auth.session.tid)
      .eq('username', username)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Dieser Benutzername existiert in Ihrem Team bereits' }, { status: 409 });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const { data: newUser, error: insertErr } = await supabaseAdmin
      .from('users')
      .insert({
        tenant_id: auth.session.tid,
        username,
        password_hash: passwordHash,
        display_name: displayName,
        department_key: departmentKey,
        role_id: roleRow.id,
        is_active: true,
      })
      .select('id, username, display_name, department_key, created_at')
      .single();

    if (insertErr) {
      console.error('User insert error:', insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    let department_label: string | null = null;
    if (departmentKey) {
      try {
        const { data: dept } = await supabaseAdmin.from('departments').select('label').eq('key', departmentKey).maybeSingle();
        department_label = dept?.label ?? null;
      } catch {
        department_label = departmentKey;
      }
    }

    return NextResponse.json({
      data: {
        ...newUser,
        role: roleName,
        department_label,
      },
      message: 'Benutzer wurde angelegt.',
    }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
