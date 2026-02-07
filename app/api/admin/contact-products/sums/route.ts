import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminSession } from '@/lib/admin-auth';

/** GET ?contact_ids=1,2,3 → { "1": 899, "2": 299 } (Summe mögliche Sales pro Kontakt) */
export async function GET(request: NextRequest) {
  try {
    if (!getAdminSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const url = new URL(request.url);
    const idsParam = url.searchParams.get('contact_ids');
    if (!idsParam) {
      return NextResponse.json({ sums: {} }, { status: 200 });
    }

    const contactIds = idsParam.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !Number.isNaN(n));
    if (contactIds.length === 0) {
      return NextResponse.json({ sums: {} }, { status: 200 });
    }

    const { data: rows, error } = await supabaseAdmin
      .from('contact_products')
      .select('contact_id, quantity, estimated_value_override, products(price_min)')
      .in('contact_id', contactIds);

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({ sums: Object.fromEntries(contactIds.map((id) => [String(id), 0])) }, { status: 200 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const sums: Record<string, number> = {};
    for (const id of contactIds) {
      sums[String(id)] = 0;
    }
    for (const row of rows ?? []) {
      const contactId = String(row.contact_id);
      const qty = Number(row.quantity) || 1;
      const override = row.estimated_value_override != null ? Number(row.estimated_value_override) : null;
      const product = row.products as { price_min?: number | null } | null;
      const price = override ?? (product?.price_min ?? 0) * qty;
      sums[contactId] = (sums[contactId] ?? 0) + price;
    }

    return NextResponse.json({ sums }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
