import { createHmac, timingSafeEqual } from 'crypto';
import type { SessionPayload } from './auth';

const COOKIE_NAME = 'admin_session';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 Tage

function getSigningSecret(): string {
  // SESSION_SECRET bevorzugt (für Rotation); Fallback: ADMIN_PASSWORD
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
}

function base64UrlEncode(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Buffer {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return Buffer.from(b64, 'base64');
}

/** Erstellt signierten Cookie mit user_id + tenant_id (neues Format) */
export function createAdminSessionCookie(userId: string, tenantId: string): string | null {
  const secret = getSigningSecret();
  if (!secret) return null;
  const payload = JSON.stringify({ uid: userId, tid: tenantId, t: Date.now() });
  const sig = createHmac('sha256', secret).update(payload).digest();
  return base64UrlEncode(Buffer.from(payload, 'utf8')) + '.' + base64UrlEncode(sig);
}

/** Parst und prüft Cookie; gibt Session-Payload oder null */
export function parseAdminSessionCookie(cookieValue: string | undefined | null): SessionPayload | null {
  if (!cookieValue || !cookieValue.includes('.')) return null;
  const secret = getSigningSecret();
  if (!secret) return null;
  const [payloadB64, sigB64] = cookieValue.split('.');
  if (!payloadB64 || !sigB64) return null;
  let payload: string;
  try {
    payload = base64UrlDecode(payloadB64).toString('utf8');
  } catch {
    return null;
  }
  let data: { uid?: string; tid?: string; t?: number };
  try {
    data = JSON.parse(payload);
  } catch {
    return null;
  }
  const t = data?.t;
  if (typeof t !== 'number') return null;
  if (Date.now() - t > MAX_AGE_MS) return null;
  const expectedSig = createHmac('sha256', secret).update(payload).digest();
  const actualSig = base64UrlDecode(sigB64);
  if (expectedSig.length !== actualSig.length) return null;
  if (!timingSafeEqual(expectedSig, actualSig)) return null;

  // Neues Format: uid + tid
  if (typeof data?.uid === 'string' && typeof data?.tid === 'string') {
    return { uid: data.uid, tid: data.tid, t };
  }
  return null;
}

/** Prüft ob gültige Session (beliebiges Format) */
export function verifyAdminSessionCookie(cookieValue: string | undefined | null): boolean {
  const parsed = parseAdminSessionCookie(cookieValue);
  if (parsed) return true;
  // Legacy: nur Timestamp (alte Sessions vor User-Migration)
  if (!cookieValue || !cookieValue.includes('.')) return false;
  const secret = getSigningSecret();
  if (!secret) return false;
  const [payloadB64, sigB64] = cookieValue.split('.');
  if (!payloadB64 || !sigB64) return false;
  let payload: string;
  try {
    payload = base64UrlDecode(payloadB64).toString('utf8');
  } catch {
    return false;
  }
  let data: { t?: number };
  try {
    data = JSON.parse(payload);
  } catch {
    return false;
  }
  const t = data?.t;
  if (typeof t !== 'number') return false;
  if (Date.now() - t > MAX_AGE_MS) return false;
  const expectedSig = createHmac('sha256', secret).update(payload).digest();
  const actualSig = base64UrlDecode(sigB64);
  if (expectedSig.length !== actualSig.length) return false;
  return timingSafeEqual(expectedSig, actualSig);
}

export function getAdminSessionCookieName(): string {
  return COOKIE_NAME;
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 Tage in Sekunden
    path: '/',
  };
}

/** Prüft Request auf gültigen Admin-Session-Cookie (Legacy-Sessions werden als gültig akzeptiert) */
export function isAdminAuthenticated(cookieValue: string | undefined | null): boolean {
  return verifyAdminSessionCookie(cookieValue);
}

/** Holt Session-Payload (user_id, tenant_id) – nur neues Format, Legacy = null. Für API-Routes verwenden. */
export function getAdminSession(request: { cookies: { get: (name: string) => { value?: string } | undefined } }): SessionPayload | null {
  const cookie = request.cookies.get('admin_session')?.value;
  return parseAdminSessionCookie(cookie);
}
