import { createClient } from '@supabase/supabase-js';

// Service Role Key für Admin-Zugriff (NUR server-seitig verwenden!)
// Dieser Key hat volle Zugriffsrechte - NIEMALS im Client-Code verwenden!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Admin-Client mit Service Role Key (für server-seitige API Routes)
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

if (!supabaseAdmin && process.env.NODE_ENV === 'development') {
  console.warn('Supabase Service Role Key fehlt. Admin-Funktionen sind deaktiviert.');
}

