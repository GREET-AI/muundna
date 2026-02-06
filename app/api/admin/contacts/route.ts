import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
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
      return NextResponse.json(
        { error: 'Supabase Admin nicht konfiguriert' },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const leadsOnly = url.searchParams.get('leads_only') === '1';
    const view = url.searchParams.get('view') || null;
    const scrapeBatchId = url.searchParams.get('scrape_batch_id') || null;
    const limitParam = url.searchParams.get('limit');
    const offsetParam = url.searchParams.get('offset');
    const search = (url.searchParams.get('search') ?? '').trim().slice(0, 200);
    const statusFilter = url.searchParams.get('status') || null;
    const assignedTo = url.searchParams.get('assigned_to') || null;
    const hasEmail = url.searchParams.get('has_email') === '1';
    const hasWebsite = url.searchParams.get('has_website') === '1';
    const hasProfile = url.searchParams.get('has_profile') === '1';
    const hasPhone = url.searchParams.get('has_phone') === '1';

    const usePagination = limitParam != null && limitParam !== '';
    const limit = usePagination ? Math.min(Math.max(1, parseInt(limitParam, 10) || 50), 500) : undefined;
    const offset = usePagination ? Math.max(0, parseInt(offsetParam ?? '0', 10)) : 0;

    let query = supabaseAdmin
      .from('contact_submissions')
      .select('*', usePagination ? { count: 'exact' } : undefined)
      .order('created_at', { ascending: false });

    if (leadsOnly) {
      query = query.in('source', ['gelbe_seiten', '11880', 'google_places']);
    }
    if (view === 'smart-neue-leads') {
      query = query.in('source', ['gelbe_seiten', '11880', 'google_places']).eq('status', 'neu');
    }
    if (view === 'smart-leads-anrufen') {
      query = query
        .in('status', ['neu', 'offen', 'kontaktversuch', 'verbunden', 'qualifiziert', 'kontaktiert', 'in_bearbeitung'])
        .not('phone', 'is', null).neq('phone', '');
    }
    if (view === 'smart-heute-anrufen') {
      if (assignedTo) query = query.eq('assigned_to', assignedTo);
      query = query
        .in('status', ['neu', 'offen', 'kontaktversuch'])
        .not('phone', 'is', null).neq('phone', '');
    }
    if (view === 'smart-follow-up') {
      query = query.in('status', ['wiedervorlage', 'qualifiziert']);
    }
    if (view === 'smart-kein-kontakt-3') {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      query = query.lt('updated_at', threeDaysAgo.toISOString());
    }
    if (scrapeBatchId) {
      query = query.eq('scrape_batch_id', scrapeBatchId);
    }
    if (!view && statusFilter && statusFilter !== 'alle') {
      const statuses = statusFilter.split(',').map((s) => s.trim()).filter(Boolean);
      if (statuses.length === 1) query = query.eq('status', statuses[0]);
      else if (statuses.length > 1) query = query.in('status', statuses);
    }
    if (assignedTo && view !== 'smart-heute-anrufen') {
      query = query.eq('assigned_to', assignedTo);
    }
    if (search.length >= 2) {
      const safe = search.replace(/'/g, "''").replace(/\\/g, '\\\\');
      const term = `%${safe}%`;
      query = query.or(
        `first_name.ilike.${term},last_name.ilike.${term},email.ilike.${term},phone.ilike.${term},company.ilike.${term}`
      );
    }
    if (hasEmail) {
      query = query.not('email', 'is', null).not('email', 'eq', '');
    }
    if (hasPhone && !view) {
      query = query.not('phone', 'is', null).neq('phone', '');
    }
    if (hasWebsite) {
      query = query.ilike('notes', '%Website:%');
    }
    if (hasProfile) {
      query = query.or('notes.ilike.%Profil%,notes.ilike.%profile_url%');
    }
    if (limit != null) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      if (error.code === '42703') {
        console.warn('contact_submissions: Spalte source/scrape_batch_id fehlt. Bitte SUPABASE_SCRAPER_MIGRATION.md ausführen.');
        return NextResponse.json(
          { data: [], total: 0, migration_required: true },
          { status: 200 }
        );
      }
      console.error('Fehler beim Laden:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const total = usePagination && typeof count === 'number' ? count : (data ?? []).length;
    return NextResponse.json({
      data: data ?? [],
      total,
      migration_required: false
    }, { status: 200 });
  } catch (error) {
    console.error('Fehler:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase Admin nicht konfiguriert' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { id, status, notes, first_name, last_name, email, phone, street, city, company, assigned_to, changed_by } = body;

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    if (status != null) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (first_name !== undefined) updateData.first_name = String(first_name).slice(0, 100);
    if (last_name !== undefined) updateData.last_name = String(last_name).slice(0, 100);
    if (email !== undefined) updateData.email = email === '' || email == null ? null : String(email).slice(0, 255);
    if (phone !== undefined) updateData.phone = phone === '' || phone == null ? null : String(phone).slice(0, 50);
    if (street !== undefined) updateData.street = street === '' || street == null ? null : String(street).slice(0, 300);
    if (city !== undefined) updateData.city = city === '' || city == null ? null : String(city).slice(0, 100);
    if (company !== undefined) updateData.company = company === '' || company == null ? null : String(company).slice(0, 200);
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to === '' || assigned_to == null ? null : String(assigned_to).slice(0, 50);

    const salesRep = changed_by === 'sven' || changed_by === 'pascal' ? changed_by : null;

    // Alte Werte für Aktivitätslog laden (falls changed_by gesetzt)
    let oldRow: Record<string, unknown> | null = null;
    if (salesRep && id != null) {
      const { data: existing } = await supabaseAdmin.from('contact_submissions').select('*').eq('id', id).single();
      oldRow = (existing as Record<string, unknown>) ?? null;
    }

    let data: unknown = null;
    let error: { code?: string; message: string } | null = null;
    let result = await supabaseAdmin
      .from('contact_submissions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    data = result.data;
    error = result.error;

    if (error?.code === '42703') {
      // Spalte assigned_to oder contact_activity_log fehlt – ohne assigned_to erneut versuchen
      delete updateData.assigned_to;
      result = await supabaseAdmin
        .from('contact_submissions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Fehler beim Aktualisieren:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Aktivitätslog schreiben (wer hat was geändert)
    if (salesRep && id != null) {
      const logInserts: { contact_id: number; sales_rep: string; action: string; old_value: string | null; new_value: string | null }[] = [];
      if (status != null && oldRow?.status !== status) {
        logInserts.push({ contact_id: Number(id), sales_rep: salesRep, action: 'status_change', old_value: (oldRow?.status as string) ?? null, new_value: String(status) });
      }
      if (notes !== undefined && (oldRow?.notes ?? '') !== (notes ?? '')) {
        logInserts.push({ contact_id: Number(id), sales_rep: salesRep, action: 'notes_edit', old_value: null, new_value: notes != null ? String(notes).slice(0, 500) : null });
      }
      if (assigned_to !== undefined && (oldRow?.assigned_to ?? null) !== (assigned_to ?? null)) {
        logInserts.push({ contact_id: Number(id), sales_rep: salesRep, action: 'assigned', old_value: (oldRow?.assigned_to as string) ?? null, new_value: assigned_to ?? null });
      }
      for (const row of logInserts) {
        const { error: logErr } = await supabaseAdmin.from('contact_activity_log').insert(row);
        if (logErr) console.warn('Aktivitätslog:', logErr);
      }
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Fehler:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase Admin nicht konfiguriert' },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id erforderlich' }, { status: 400 });
    }

    const { error: deleteError } = await supabaseAdmin
      .from('contact_submissions')
      .delete()
      .eq('id', Number(id));

    if (deleteError) {
      console.error('Fehler beim Löschen:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Fehler:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}

