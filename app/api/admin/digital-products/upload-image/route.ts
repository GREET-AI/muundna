import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getAuthUser, canAccessDigitalProducts } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

const BUCKET = 'dp-product-images';

/** Max. Dateigröße für Bild-Uploads (5 MB). */
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

async function requireDigitalProductsAccess(request: NextRequest) {
  const session = getAdminSession(request);
  if (!session) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  const user = await getAuthUser(session.uid, session.tid);
  if (!user) return { error: NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 401 }) };
  if (!canAccessDigitalProducts(user)) {
    return { error: NextResponse.json({ error: 'Kein Zugriff auf Digitale Produkte' }, { status: 403 }) };
  }
  return { session, user };
}

/** POST – Bild für digitales Produkt hochladen (Supabase Storage). Bucket "dp-product-images" muss in Supabase angelegt sein (public). */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireDigitalProductsAccess(request);
    if (auth.error) return auth.error;
    const { session } = auth;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase nicht konfiguriert' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file || !file.size) {
      return NextResponse.json({ error: 'Keine Datei' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Nur JPG, PNG, GIF oder WebP erlaubt.' },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `Datei zu groß. Max. ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.` },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeExt = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) ? ext : 'jpg';
    const path = `${session.tid}/${crypto.randomUUID()}.${safeExt}`;

    const buf = Buffer.from(await file.arrayBuffer());
    const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, buf, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      if (error.message?.includes('Bucket not found') || error.message?.includes('not found')) {
        return NextResponse.json(
          { error: `Storage-Bucket "${BUCKET}" in Supabase anlegen (Storage → New bucket → public).` },
          { status: 502 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: urlData.publicUrl }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Upload fehlgeschlagen' }, { status: 500 });
  }
}
