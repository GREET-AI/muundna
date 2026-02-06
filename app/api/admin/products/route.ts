import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAdminAuthenticated } from '@/lib/admin-auth';

function checkAdminAuth(request: NextRequest): boolean {
  const cookie = request.cookies.get('admin_session')?.value;
  return isAdminAuthenticated(cookie);
}

export async function GET(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({ data: [], migration_required: true }, { status: 200 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const products = (data ?? []).map((p: Record<string, unknown>) => ({
      ...p,
      features: Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? [] : []),
    }));

    return NextResponse.json({ data: products, migration_required: false }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price_display,
      price_period,
      price_min,
      price_once,
      product_type,
      subline,
      features,
      sort_order,
      for_package,
    } = body;

    if (!name || !price_display) {
      return NextResponse.json({ error: 'name und price_display erforderlich' }, { status: 400 });
    }

    const insertPayload: Record<string, unknown> = {
      name,
      description: description ?? null,
      price_display,
      price_period: price_period ?? '€/Monat',
      price_min: price_min != null && price_min !== '' ? Number(price_min) : null,
      product_type: product_type ?? 'single',
      subline: subline ?? null,
      features: Array.isArray(features) ? features : [],
      sort_order: sort_order != null ? Number(sort_order) : 0,
      updated_at: new Date().toISOString(),
    };
    if (price_once != null && price_once !== '') insertPayload.price_once = Number(price_once);
    if (for_package !== undefined) insertPayload.for_package = for_package ?? null;

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const body = await request.json();
    const id = body.id;
    if (id == null) {
      return NextResponse.json({ error: 'id erforderlich' }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    const optional = [
      'name', 'description', 'price_display', 'price_period', 'price_min', 'price_once',
      'product_type', 'subline', 'features', 'sort_order', 'for_package',
    ] as const;
    for (const key of optional) {
      if (body[key] !== undefined) {
        if (key === 'price_min' || key === 'price_once') updates[key] = body[key] === '' || body[key] == null ? null : Number(body[key]);
        else if (key === 'features') updates[key] = Array.isArray(body[key]) ? body[key] : [];
        else if (key === 'for_package') updates[key] = body[key] ?? null;
        else if (key === 'sort_order') updates[key] = body[key] != null ? Number(body[key]) : 0;
        else updates[key] = body[key];
      }
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id == null) {
      return NextResponse.json({ error: 'id erforderlich' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
