import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

/** Öffentlich: Pixel-Liste für eine veröffentlichte Landingpage (für Skript-Einbindung). */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: 'Slug fehlt' }, { status: 400 });
    if (!supabaseAdmin) return NextResponse.json({ error: 'Nicht konfiguriert' }, { status: 500 });

    const tenantSlug = request.nextUrl.searchParams.get('tenant')?.trim() || process.env.NEXT_PUBLIC_TENANT_SLUG || null;
    if (!tenantSlug) return NextResponse.json({ error: 'tenant fehlt' }, { status: 400 });
    const { data: tenant } = await supabaseAdmin.from('tenants').select('id').eq('slug', tenantSlug).single();
    if (!tenant) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });

    const { data: product } = await supabaseAdmin
      .from('dp_products')
      .select('id')
      .eq('tenant_id', tenant.id)
      .eq('slug', slug.toLowerCase().trim())
      .eq('is_published', true)
      .single();
    if (!product) return NextResponse.json({ error: 'Produkt nicht gefunden' }, { status: 404 });

    const { data: pixels, error } = await supabaseAdmin
      .from('landing_tracking_pixels')
      .select('id, provider, pixel_id, name, script_content')
      .eq('product_id', product.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ pixels: pixels ?? [] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
