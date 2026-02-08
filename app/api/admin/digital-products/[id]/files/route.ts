import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getAuthUser, canAccessDigitalProducts } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

async function requireDigitalProductsAccess(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  const user = await getAuthUser(session.uid, session.tid);
  if (!user) return { error: NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 401 }) };
  if (!canAccessDigitalProducts(user)) {
    return { error: NextResponse.json({ error: 'Kein Zugriff auf Digitale Produkte' }, { status: 403 }) };
  }
  return { session, user };
}

/** Prüft ob Produkt zum Tenant gehört */
async function productBelongsToTenant(productId: string, tenantId: string): Promise<boolean> {
  if (!supabaseAdmin) return false;
  const { data } = await supabaseAdmin
    .from('dp_products')
    .select('id')
    .eq('id', productId)
    .eq('tenant_id', tenantId)
    .maybeSingle();
  return !!data;
}

/** GET – Dateien eines Produkts */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireDigitalProductsAccess(request);
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id: productId } = await params;

    const ok = await productBelongsToTenant(productId, session.tid);
    if (!ok) return NextResponse.json({ error: 'Produkt nicht gefunden' }, { status: 404 });

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('dp_product_files')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: data ?? [] }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

/** POST – Datei/Lesson hinzufügen */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireDigitalProductsAccess(request);
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id: productId } = await params;

    const ok = await productBelongsToTenant(productId, session.tid);
    if (!ok) return NextResponse.json({ error: 'Produkt nicht gefunden' }, { status: 404 });

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const body = await request.json();
    const { title, file_type, file_url, sort_order } = body;

    if (!title || !file_type) {
      return NextResponse.json({ error: 'title und file_type erforderlich' }, { status: 400 });
    }
    if (!['file', 'video_url', 'lesson'].includes(file_type)) {
      return NextResponse.json(
        { error: 'file_type muss file, video_url oder lesson sein' },
        { status: 400 }
      );
    }

    const insertPayload = {
      product_id: productId,
      title,
      file_type,
      file_url: file_url ?? null,
      sort_order: sort_order != null ? Number(sort_order) : 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('dp_product_files')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
