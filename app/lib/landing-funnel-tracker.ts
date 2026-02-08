/**
 * Client-seitiges Tracking für Landingpage/Quiz-Funnel.
 * Sendet Events an POST /api/public/funnel-event für spätere Analytics (Drop-off pro Schritt).
 */

const SESSION_KEY = 'landing_funnel_session_id';
const EVENT_API = '/api/public/funnel-event';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `s_${Date.now()}`;
  }
}

export type FunnelEventType =
  | 'landing_view'
  | 'quiz_start'
  | 'quiz_step_view'
  | 'quiz_step_ok'
  | 'quiz_abandon'
  | 'quiz_form_view'
  | 'quiz_complete';

export function trackFunnelEvent(
  productSlug: string,
  eventType: FunnelEventType,
  options?: { stepIndex?: number; stepId?: string; metadata?: Record<string, unknown> }
): void {
  const sessionId = getOrCreateSessionId();
  if (!sessionId) return;

  fetch(EVENT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productSlug,
      eventType,
      stepIndex: options?.stepIndex,
      stepId: options?.stepId,
      sessionId,
      metadata: options?.metadata ?? {},
    }),
  }).catch(() => {});
}

export { getOrCreateSessionId };
