/**
 * Deutsche Telefonnummer: nur eine 0 am Anfang. Kein 00, 000 oder "0 0".
 * Entfernt führende Doppelnullen (auch mit Leerzeichen dazwischen).
 */
export function normalizeGermanPhone(s: string | null | undefined): string {
  if (s == null) return '';
  let t = String(s).trim();
  if (!t) return '';
  // "0 07231...", "00...", "0  0..." → eine führende 0
  t = t.replace(/^0(\s*0)+/, '0').trim();
  return t;
}
