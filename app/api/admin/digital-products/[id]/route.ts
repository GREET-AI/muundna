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

/** GET – Einzelprodukt inkl. Dateien */
export async function GET(
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

    const { data: product, error: productError } = await supabaseAdmin
      .from('dp_products')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', session.tid)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: 'Produkt nicht gefunden' }, { status: 404 });
    }

    const { data: files } = await supabaseAdmin
      .from('dp_product_files')
      .select('*')
      .eq('product_id', id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    return NextResponse.json({
      data: { ...product, files: files ?? [] },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

/** PATCH – Produkt aktualisieren */
export async function PATCH(
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

    const body = await request.json();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    const optional = [
      'type', 'title', 'slug', 'description', 'price_cents', 'image_url', 'is_published', 'sort_order',
    ] as const;
    for (const key of optional) {
      if (body[key] !== undefined) {
        if (key === 'price_cents' || key === 'sort_order') updates[key] = Number(body[key]);
        else if (key === 'is_published') updates[key] = Boolean(body[key]);
        else if (key === 'slug') updates[key] = String(body[key]).trim().toLowerCase().replace(/\s+/g, '-');
        else updates[key] = body[key];
      }
    }
    if (body.type && !['course', 'download', 'membership'].includes(body.type)) {
      return NextResponse.json({ error: 'type muss course, download oder membership sein' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('dp_products')
      .update(updates)
      .eq('id', id)
      .eq('tenant_id', session.tid)
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

/** DELETE – Produkt löschen */
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
      .from('dp_products')
      .delete()
      .eq('id', id)
      .eq('tenant_id', session.tid);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
