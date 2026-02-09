/**
 * Öffentliche Homepage laden: Tenant aus Slug, eine veröffentlichte Homepage pro Tenant.
 * tenant_id wird ausschließlich aus dem Tenant-Slug ermittelt (keine Session).
 */

import { supabaseAdmin } from '@/lib/supabase-admin';

export type HomepagePageRow = {
  id: string;
  title: string;
  json_data: { title?: string; components?: unknown[] };
  is_published: boolean;
};

export async function getPublishedHomepage(tenantSlug: string): Promise<HomepagePageRow | null> {
  if (!tenantSlug?.trim() || !supabaseAdmin) return null;
  const { data: tenant } = await supabaseAdmin
    .from('tenants')
    .select('id')
    .eq('slug', tenantSlug.trim().toLowerCase())
    .single();
  if (!tenant?.id) return null;
  const { data: page } = await supabaseAdmin
    .from('pages')
    .select('id, title, json_data, is_published')
    .eq('tenant_id', tenant.id)
    .eq('type', 'homepage')
    .eq('slug', 'home')
    .eq('is_published', true)
    .maybeSingle();
  return page as HomepagePageRow | null;
}
