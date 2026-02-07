import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getAuthUser, canAccessFeature } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

const FEATURE_KEY = 'digital_products';
const PERMISSION_KEY = 'digital_products.*';

/** GET – Produkt für Vorschau (per id oder slug, erlaubt Entwürfe). Cookie wird beim fetch vom Admin-Tab mitgeschickt. */
export async function GET(request: NextRequest) {
  try {
    const session = getAdminSession(request);
    if (!session) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

    const user = await getAuthUser(session.uid, session.tid);
    if (!user) return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 401 });
    if (!canAccessFeature(user, FEATURE_KEY, PERMISSION_KEY)) {
      return NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 });
    }

    const id = request.nextUrl.searchParams.get('id');
    const slug = request.nextUrl.searchParams.get('slug');
    if (!id && !slug?.trim()) return NextResponse.json({ error: 'id oder slug fehlt' }, { status: 400 });

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const { data: tenant } = await supabaseAdmin
      .from('tenants')
      .select('id, name')
      .eq('id', session.tid)
      .single();

    if (!tenant) return NextResponse.json({ error: 'Tenant nicht gefunden' }, { status: 404 });

    let product = null;
    if (id) {
      const { data, error } = await supabaseAdmin
        .from('dp_products')
        .select('id, type, title, slug, description, price_cents, image_url, landing_page_sections, is_published, tenant_id')
        .eq('id', id)
        .eq('tenant_id', session.tid)
        .single();
      product = data;
      if (!product && error?.code === 'PGRST116') {
        const { data: anyTenant } = await supabaseAdmin
          .from('dp_products')
          .select('id, tenant_id')
          .eq('id', id)
          .single();
        if (anyTenant) {
          return NextResponse.json({
            error: 'Produkt nicht gefunden',
            hint: 'Das Produkt gehört zu einem anderen Mandanten (tenant_id). Prüfe in Supabase: dp_products → tenant_id muss deinem eingeloggten Mandanten entsprechen.',
          }, { status: 404 });
        }
      }
    }
    if (!product && slug?.trim()) {
      const { data } = await supabaseAdmin
        .from('dp_products')
        .select('id, type, title, slug, description, price_cents, image_url, landing_page_sections, is_published')
        .eq('tenant_id', session.tid)
        .eq('slug', slug.toLowerCase().trim())
        .single();
      product = data;
    }

    if (!product) {
      return NextResponse.json({
        error: 'Produkt nicht gefunden',
        hint: 'Supabase prüfen: Tabelle dp_products vorhanden (Migration 003)? Produkt mit dieser id/slug und tenant_id vorhanden?',
      }, { status: 404 });
    }

    return NextResponse.json({ data: { product, tenant } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
