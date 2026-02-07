import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getAuthUser, canAccessFeature } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

const FEATURE_KEY = 'digital_products';
const PERMISSION_KEY = 'digital_products.*';

async function requireDigitalProductsAccess(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  const user = await getAuthUser(session.uid, session.tid);
  if (!user) return { error: NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 401 }) };
  if (!canAccessFeature(user, FEATURE_KEY, PERMISSION_KEY)) {
    return { error: NextResponse.json({ error: 'Kein Zugriff auf Digitale Produkte' }, { status: 403 }) };
  }
  return { session, user };
}

/** DELETE – Zugang entziehen */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireDigitalProductsAccess(request);
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id } = await params;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const { error } = await supabaseAdmin
      .from('dp_enrollments')
      .delete()
      .eq('id', id)
      .eq('tenant_id', session.tid);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
