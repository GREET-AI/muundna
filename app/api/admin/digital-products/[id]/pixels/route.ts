import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getAuthUser, canAccessDigitalProducts } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
const PROVIDERS = ['facebook', 'google_ads', 'google_analytics', 'tiktok', 'custom'] as const;

async function requireAccess(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  const user = await getAuthUser(session.uid, session.tid);
  if (!user) return { error: NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 401 }) };
  if (!canAccessDigitalProducts(user)) {
    return { error: NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 }) };
  }
  return { session };
}

/** GET – Pixel-Liste für dieses Produkt */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAccess(request);
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id } = await params;
    if (!supabaseAdmin) return NextResponse.json({ error: 'Nicht konfiguriert' }, { status: 500 });

    const { data: product } = await supabaseAdmin
      .from('dp_products')
      .select('id')
      .eq('id', id)
      .eq('tenant_id', session.tid)
      .single();
    if (!product) return NextResponse.json({ error: 'Produkt nicht gefunden' }, { status: 404 });

    const { data: pixels, error } = await supabaseAdmin
      .from('landing_tracking_pixels')
      .select('id, provider, pixel_id, name, created_at')
      .eq('product_id', id)
      .order('created_at', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: pixels ?? [] });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

/** POST – Pixel hinzufügen */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAccess(request);
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id } = await params;
    if (!supabaseAdmin) return NextResponse.json({ error: 'Nicht konfiguriert' }, { status: 500 });

    const { data: product } = await supabaseAdmin
      .from('dp_products')
      .select('id')
      .eq('id', id)
      .eq('tenant_id', session.tid)
      .single();
    if (!product) return NextResponse.json({ error: 'Produkt nicht gefunden' }, { status: 404 });

    const body = await request.json().catch(() => ({}));
    const provider = body.provider as string;
    const pixelId = body.pixel_id != null ? String(body.pixel_id).trim() : null;
    const name = body.name != null ? String(body.name).trim() || null : null;
    const scriptContent = body.script_content != null ? String(body.script_content).trim() || null : null;

    if (!provider || !PROVIDERS.includes(provider as (typeof PROVIDERS)[number])) {
      return NextResponse.json({ error: 'Ungültiger Anbieter' }, { status: 400 });
    }
    if (provider !== 'custom' && !pixelId) {
      return NextResponse.json({ error: 'Pixel-ID / Measurement-ID ist erforderlich' }, { status: 400 });
    }
    if (provider === 'custom' && !scriptContent) {
      return NextResponse.json({ error: 'Benutzerdefiniertes Skript ist erforderlich' }, { status: 400 });
    }

    const { data: row, error } = await supabaseAdmin
      .from('landing_tracking_pixels')
      .insert({
        tenant_id: session.tid,
        product_id: id,
        provider,
        pixel_id: provider === 'custom' ? null : pixelId,
        name: name || null,
        script_content: provider === 'custom' ? scriptContent : null,
      })
      .select('id, provider, pixel_id, name, created_at')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: row });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
