/**
 * Tenant-System: type-safe Zugriff auf Mandanten.
 * - Admin/API: tenant_id immer aus Session (getAdminSession).
 * - Öffentliche Routen (/p/[tenant]/...): Tenant aus URL-Slug, nie aus Session.
 * Kein Hardcode (z. B. muckenfuss-nagel) – fehlender Tenant = 401 oder redirect /login.
 */

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminSession } from '@/lib/admin-auth';
import type { SessionPayload } from '@/lib/auth';

export type TenantRow = { id: string; name: string; slug: string };

/**
 * Holt Tenant anhand Slug (für öffentliche Routen: /p/[tenant]/...).
 * Gibt null wenn Slug fehlt oder Tenant nicht existiert.
 */
export async function getTenantBySlug(slug: string): Promise<TenantRow | null> {
  if (!slug || typeof slug !== 'string') return null;
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from('tenants')
    .select('id, name, slug')
    .eq('slug', slug.trim().toLowerCase())
    .single();
  if (error || !data) return null;
  return data as TenantRow;
}

/**
 * Holt Tenant-ID anhand Slug (nur id, für Queries).
 */
export async function getTenantIdBySlug(slug: string): Promise<string | null> {
  const tenant = await getTenantBySlug(slug);
  return tenant?.id ?? null;
}

/**
 * Session aus Request lesen. Fehlt Session oder tenant_id → null.
 * Admin-Routes sollen damit prüfen und 401/redirect zu /login zurückgeben.
 */
export function getSessionFromRequest(request: { cookies: { get: (name: string) => { value?: string } | undefined } }): SessionPayload | null {
  return getAdminSession(request);
}

/**
 * Erzwingt gültige Admin-Session. Gibt Session zurück oder null (dann 401/redirect).
 * Nutzung in API: const session = requireAdminSession(request); if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 */
export function requireAdminSession(request: { cookies: { get: (name: string) => { value?: string } | undefined } }): SessionPayload | null {
  const session = getAdminSession(request);
  if (!session?.uid || !session?.tid) return null;
  return session;
}

/**
 * Tenant-Slug aus öffentlichen API-Anfragen (Body oder Query).
 * Erlaubt: body.tenant, searchParams tenant.
 */
export function getTenantSlugFromPublicRequest(
  request: { nextUrl?: { searchParams?: { get: (k: string) => string | null } }; json?: () => Promise<Record<string, unknown>> },
  body?: { tenant?: string }
): string | null {
  const fromUrl = request.nextUrl?.searchParams?.get?.('tenant');
  if (fromUrl && typeof fromUrl === 'string') return fromUrl.trim() || null;
  if (body?.tenant && typeof body.tenant === 'string') return body.tenant.trim() || null;
  return null;
}
