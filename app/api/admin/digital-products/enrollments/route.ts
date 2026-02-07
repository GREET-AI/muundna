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

/** GET – Liste aller Zugänge (Enrollments) des Tenants – nur für Digitale Produkte, nur freigeschaltete Kunden */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireDigitalProductsAccess(request);
    if (auth.error) return auth.error;
    const { session } = auth;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const { data: rows, error } = await supabaseAdmin
      .from('dp_enrollments')
      .select('id, product_id, customer_email, access_until, created_at')
      .eq('tenant_id', session.tid)
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({ data: [], migration_required: true }, { status: 200 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const productIds = [...new Set((rows ?? []).map((r) => r.product_id))];
    const products = productIds.length
      ? await supabaseAdmin.from('dp_products').select('id, title').in('id', productIds)
      : { data: [] as { id: string; title: string }[] };
    const titleBy = Object.fromEntries((products.data ?? []).map((p) => [p.id, p.title]));

    const data = (rows ?? []).map((r) => ({
      ...r,
      product_title: titleBy[r.product_id] ?? '—',
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

/** POST – Zugang gewähren (Kunde für ein Produkt freischalten) */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireDigitalProductsAccess(request);
    if (auth.error) return auth.error;
    const { session } = auth;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const body = await request.json();
    const { product_id, customer_email, access_until } = body;

    if (!product_id || !customer_email || typeof customer_email !== 'string') {
      return NextResponse.json(
        { error: 'product_id und customer_email erforderlich' },
        { status: 400 }
      );
    }

    const email = String(customer_email).trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: 'E-Mail ungültig' }, { status: 400 });
    }

    const { data: product } = await supabaseAdmin
      .from('dp_products')
      .select('id')
      .eq('id', product_id)
      .eq('tenant_id', session.tid)
      .single();

    if (!product) {
      return NextResponse.json({ error: 'Produkt nicht gefunden' }, { status: 404 });
    }

    const insertPayload = {
      tenant_id: session.tid,
      product_id: String(product_id),
      customer_email: email,
      access_until: access_until || null,
    };

    const { data, error } = await supabaseAdmin
      .from('dp_enrollments')
      .upsert(insertPayload, { onConflict: 'product_id,customer_email' })
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
