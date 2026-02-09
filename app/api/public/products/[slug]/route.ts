import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

/** Öffentliche API: ein veröffentlichtes digitales Produkt anhand Slug (und optional Tenant) abrufen – für Landingpages */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: 'Slug fehlt' }, { status: 400 });

    const tenantSlug = request.nextUrl.searchParams.get('tenant')?.trim() || process.env.NEXT_PUBLIC_TENANT_SLUG || null;
    if (!tenantSlug) {
      return NextResponse.json({ error: 'tenant fehlt (Query oder NEXT_PUBLIC_TENANT_SLUG)' }, { status: 400 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Nicht konfiguriert' }, { status: 500 });
    }

    const { data: tenant } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('slug', tenantSlug)
      .single();

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant nicht gefunden' }, { status: 404 });
    }

    const { data: product, error } = await supabaseAdmin
      .from('dp_products')
      .select('id, type, title, slug, description, price_cents, image_url, is_published')
      .eq('tenant_id', tenant.id)
      .eq('slug', slug.toLowerCase().trim())
      .eq('is_published', true)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: 'Produkt nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        ...product,
        price_euro: (product.price_cents / 100).toFixed(2),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
