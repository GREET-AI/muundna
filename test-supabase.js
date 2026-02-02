// Einfaches Test-Script um zu prüfen, ob Supabase-Verbindung funktioniert
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Supabase Konfiguration prüfen...\n');

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL fehlt!');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY fehlt!');
  process.exit(1);
}

console.log('✅ NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl.substring(0, 30) + '...');
console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey.substring(0, 20) + '...');

if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('✅ SUPABASE_SERVICE_ROLE_KEY:', 'vorhanden');
} else {
  console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY:', 'fehlt (optional für Admin)');
}

if (process.env.NEXT_PUBLIC_ADMIN_PASSWORD && process.env.NEXT_PUBLIC_ADMIN_PASSWORD !== 'ihr-sicheres-passwort') {
  console.log('✅ NEXT_PUBLIC_ADMIN_PASSWORD:', 'gesetzt');
} else {
  console.log('⚠️  NEXT_PUBLIC_ADMIN_PASSWORD:', 'noch nicht gesetzt (bitte ändern!)');
}

console.log('\n✅ Alle erforderlichen Variablen sind vorhanden!');
console.log('\n📝 Nächste Schritte:');
console.log('1. Admin-Passwort in .env.local setzen');
console.log('2. Dev-Server starten: npm run dev');
console.log('3. Kontaktformular testen: http://localhost:3000/kontakt');
console.log('4. Admin-Seite testen: http://localhost:3000/admin');

