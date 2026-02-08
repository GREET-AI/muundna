/**
 * Auth: User-Session, Berechtigungen, Tenant-Features
 */

import { supabaseAdmin } from './supabase-admin';

export interface SessionPayload {
  uid: string; // user id
  tid: string; // tenant id
  t: number;   // timestamp
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface AuthUser {
  id: string;
  tenant_id: string;
  username: string;
  display_name: string | null;
  sales_rep_key: 'sven' | 'pascal' | null;
  department_key: string | null;
  role: Role;
  permissions: string[];
  features: string[]; // enabled tenant features
}

/** Prüft ob User eine Berechtigung hat */
export function hasPermission(user: AuthUser, permission: string): boolean {
  if (user.permissions.includes('admin')) return true;
  if (user.permissions.includes(permission)) return true;
  // Wildcard: digital_products.* passt auf digital_products.view, digital_products.edit
  const prefix = permission.split('.')[0];
  if (user.permissions.includes(`${prefix}.*`)) return true;
  return false;
}

/** Prüft ob Tenant ein Feature aktiviert hat */
export function hasFeature(user: AuthUser, featureKey: string): boolean {
  return user.features.includes(featureKey);
}

/** Zugriff auf „Digitale Produkte“ nur für Rolle superadmin oder Berechtigung digital_products.* (admin sieht das Tool nicht). */
export function canAccessDigitalProducts(user: AuthUser): boolean {
  if (!hasFeature(user, 'digital_products')) return false;
  if (user.role.name === 'superadmin') return true;
  if (user.permissions.includes('digital_products.*')) return true;
  return false;
}

/** Prüft ob User auf Feature zugreifen darf (Berechtigung + Feature-Flag) */
export function canAccessFeature(user: AuthUser, featureKey: string, permissionKey: string): boolean {
  if (!hasFeature(user, featureKey)) return false;
  return hasPermission(user, permissionKey);
}

/** Lädt User inkl. Rolle, Permissions und Tenant-Features aus der DB */
export async function getAuthUser(userId: string, tenantId: string): Promise<AuthUser | null> {
  if (!supabaseAdmin) return null;
  const { data: userRow, error: userErr } = await supabaseAdmin
    .from('users')
    .select('id, tenant_id, username, display_name, sales_rep_key, department_key, role_id')
    .eq('id', userId)
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .single();
  if (userErr || !userRow) return null;

  const { data: roleRow, error: roleErr } = await supabaseAdmin
    .from('roles')
    .select('id, name, permissions')
    .eq('id', userRow.role_id)
    .single();
  if (roleErr || !roleRow) return null;

  const perms = Array.isArray(roleRow.permissions) ? roleRow.permissions : [];
  const permStrings = perms.map((p: unknown) => String(p));

  const { data: features } = await supabaseAdmin
    .from('tenant_features')
    .select('feature_key')
    .eq('tenant_id', tenantId)
    .eq('enabled', true);
  const featureKeys = (features ?? []).map((f: { feature_key: string }) => f.feature_key);

  return {
    id: userRow.id,
    tenant_id: userRow.tenant_id,
    username: userRow.username,
    display_name: userRow.display_name ?? null,
    sales_rep_key: userRow.sales_rep_key ?? null,
    department_key: (userRow.department_key as string) ?? null,
    role: { id: roleRow.id, name: roleRow.name, permissions: permStrings },
    permissions: permStrings,
    features: featureKeys,
  };
}
