import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminSession } from '@/lib/admin-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!getAdminSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const { id } = await params;
    const contactId = parseInt(id, 10);
    if (Number.isNaN(contactId)) {
      return NextResponse.json({ error: 'Ungültige contact_id' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('contact_products')
      .select('*, products(*)')
      .eq('contact_id', contactId)
      .order('id', { ascending: true });

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({ data: [], migration_required: true }, { status: 200 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [], migration_required: false }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!getAdminSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const { id } = await params;
    const contactId = parseInt(id, 10);
    if (Number.isNaN(contactId)) {
      return NextResponse.json({ error: 'Ungültige contact_id' }, { status: 400 });
    }

    const body = await request.json();
    const { product_id, quantity, estimated_value_override } = body;
    if (!product_id) {
      return NextResponse.json({ error: 'product_id erforderlich' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('contact_products')
      .upsert(
        {
          contact_id: contactId,
          product_id: Number(product_id),
          quantity: quantity != null ? Number(quantity) : 1,
          estimated_value_override: estimated_value_override != null ? Number(estimated_value_override) : null,
        },
        { onConflict: 'contact_id,product_id' }
      )
      .select('*, products(*)')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!getAdminSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const { id } = await params;
    const contactId = parseInt(id, 10);
    const url = new URL(request.url);
    const productId = url.searchParams.get('product_id');
    if (!productId) {
      return NextResponse.json({ error: 'product_id als Query erforderlich' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('contact_products')
      .delete()
      .eq('contact_id', contactId)
      .eq('product_id', parseInt(productId, 10));

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
