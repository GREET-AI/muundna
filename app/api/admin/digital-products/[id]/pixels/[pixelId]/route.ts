import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getAuthUser, canAccessFeature } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

const FEATURE_KEY = 'digital_products';
const PERMISSION_KEY = 'digital_products.*';

async function requireAccess(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  const user = await getAuthUser(session.uid, session.tid);
  if (!user) return { error: NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 401 }) };
  if (!canAccessFeature(user, FEATURE_KEY, PERMISSION_KEY)) {
    return { error: NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 }) };
  }
  return { session };
}

/** DELETE – Pixel entfernen */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pixelId: string }> }
) {
  try {
    const auth = await requireAccess(request);
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id, pixelId } = await params;
    if (!supabaseAdmin) return NextResponse.json({ error: 'Nicht konfiguriert' }, { status: 500 });

    const { data: product } = await supabaseAdmin
      .from('dp_products')
      .select('id')
      .eq('id', id)
      .eq('tenant_id', session.tid)
      .single();
    if (!product) return NextResponse.json({ error: 'Produkt nicht gefunden' }, { status: 404 });

    const { error } = await supabaseAdmin
      .from('landing_tracking_pixels')
      .delete()
      .eq('id', pixelId)
      .eq('product_id', id)
      .eq('tenant_id', session.tid);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
