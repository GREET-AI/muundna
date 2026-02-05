import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'admin_session';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 Tage

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return '';
  return secret;
}

function base64UrlEncode(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Buffer {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return Buffer.from(b64, 'base64');
}

/** Erstellt einen signierten Cookie-Wert (payload.timestamp + HMAC) */
export function createAdminSessionCookie(): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const payload = JSON.stringify({ t: Date.now() });
  const sig = createHmac('sha256', secret).update(payload).digest();
  return base64UrlEncode(Buffer.from(payload, 'utf8')) + '.' + base64UrlEncode(sig);
}

/** Prüft den Cookie-Wert und gibt true zurück wenn gültig */
export function verifyAdminSessionCookie(cookieValue: string | undefined | null): boolean {
  if (!cookieValue || !cookieValue.includes('.')) return false;
  const secret = getSecret();
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

/** Prüft Request auf gültigen Admin-Session-Cookie (für API-Routes) */
export function isAdminAuthenticated(cookieValue: string | undefined | null): boolean {
  return verifyAdminSessionCookie(cookieValue);
}
