import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Diese Werte müssen in .env.local gesetzt werden
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Nur Supabase-Client erstellen, wenn beide Werte vorhanden sind
export const supabase: SupabaseClient | null = 
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!supabase) {
  console.warn('Supabase URL oder Key fehlen. Bitte in .env.local setzen. Supabase-Funktionen sind deaktiviert.');
}

