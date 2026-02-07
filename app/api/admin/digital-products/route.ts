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

/** GET – Liste aller digitalen Produkte des Tenants */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireDigitalProductsAccess(request);
    if (auth.error) return auth.error;
    const { session } = auth;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('dp_products')
      .select('*')
      .eq('tenant_id', session.tid)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({ data: [], migration_required: true }, { status: 200 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [] }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

/** POST – Neues digitales Produkt anlegen */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireDigitalProductsAccess(request);
    if (auth.error) return auth.error;
    const { session } = auth;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const body = await request.json();
    const { type, title, slug, description, price_cents, image_url, is_published, sort_order } = body;

    if (!type || !title || !slug) {
      return NextResponse.json(
        { error: 'type, title und slug erforderlich' },
        { status: 400 }
      );
    }
    if (!['course', 'download', 'membership'].includes(type)) {
      return NextResponse.json({ error: 'type muss course, download oder membership sein' }, { status: 400 });
    }

    const insertPayload = {
      tenant_id: session.tid,
      type,
      title,
      slug: String(slug).trim().toLowerCase().replace(/\s+/g, '-'),
      description: description ?? null,
      price_cents: price_cents != null ? Number(price_cents) : 0,
      image_url: image_url ?? null,
      is_published: Boolean(is_published),
      sort_order: sort_order != null ? Number(sort_order) : 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('dp_products')
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
