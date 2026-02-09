/**
 * Öffentliche Produktdaten für Landingpages.
 * Tenant kommt aus URL-Slug (öffentliche Routen) oder aus Session (Admin-Vorschau).
 */

import { supabaseAdmin } from '@/lib/supabase-admin';

export type ProductLandingData = {
  product: {
    id: string;
    type: string;
    title: string;
    slug: string;
    description: string | null;
    price_cents: number;
    image_url: string | null;
    landing_page_sections?: unknown;
    is_published?: boolean;
    theme_primary_color?: string | null;
    theme_secondary_color?: string | null;
    landing_template?: string | null;
  };
  tenant: { id: string; name: string };
};

export async function getProductForPublic(
  tenantSlug: string,
  productSlug: string,
  allowDraft = false
): Promise<ProductLandingData | null> {
  if (!supabaseAdmin || !tenantSlug || !productSlug) return null;
  const { data: tenant, error: tenantErr } = await supabaseAdmin
    .from('tenants')
    .select('id, name')
    .eq('slug', tenantSlug.trim().toLowerCase())
    .single();
  if (tenantErr || !tenant) return null;
  let query = supabaseAdmin
    .from('dp_products')
    .select('id, type, title, slug, description, price_cents, image_url, landing_page_sections, is_published, theme_primary_color, theme_secondary_color, landing_template')
    .eq('tenant_id', tenant.id)
    .eq('slug', productSlug.toLowerCase().trim());
  if (!allowDraft) query = query.eq('is_published', true);
  const { data: product, error } = await query.single();
  if (error || !product) return null;
  return { product: product as ProductLandingData['product'], tenant };
}
