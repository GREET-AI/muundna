import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const VALID_EVENT_TYPES = [
  'landing_view',
  'quiz_start',
  'quiz_step_view',
  'quiz_step_ok',
  'quiz_abandon',
  'quiz_form_view',
  'quiz_complete',
] as const;

/** Öffentliche API: Funnel-Event für Analytics speichern (Landingpage/Quiz). */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Nicht konfiguriert' }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const {
      productSlug,
      eventType,
      stepIndex,
      stepId,
      sessionId,
      metadata = {},
    } = body as {
      productSlug?: string;
      eventType?: string;
      stepIndex?: number;
      stepId?: string;
      sessionId?: string;
      metadata?: Record<string, unknown>;
    };

    if (!productSlug || typeof productSlug !== 'string') {
      return NextResponse.json({ error: 'productSlug fehlt' }, { status: 400 });
    }
    if (!eventType || !VALID_EVENT_TYPES.includes(eventType as (typeof VALID_EVENT_TYPES)[number])) {
      return NextResponse.json({ error: 'Ungültiger eventType' }, { status: 400 });
    }
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'sessionId fehlt' }, { status: 400 });
    }

    const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || 'muckenfuss-nagel';
    const { data: tenant } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('slug', tenantSlug)
      .single();

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant nicht gefunden' }, { status: 404 });
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from('dp_products')
      .select('id')
      .eq('tenant_id', tenant.id)
      .eq('slug', productSlug.toLowerCase().trim())
      .eq('is_published', true)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: 'Produkt nicht gefunden' }, { status: 404 });
    }

    const { error: insertError } = await supabaseAdmin.from('landing_funnel_events').insert({
      tenant_id: tenant.id,
      product_id: product.id,
      event_type: eventType,
      step_index: stepIndex != null ? Number(stepIndex) : null,
      step_id: stepId ?? null,
      session_id: sessionId.slice(0, 256),
      metadata: typeof metadata === 'object' && metadata !== null ? metadata : {},
    });

    if (insertError) {
      console.error('landing_funnel_events insert:', insertError);
      return NextResponse.json({ error: 'Speichern fehlgeschlagen' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
