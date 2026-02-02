// Test-Script um Supabase-Verbindung zu testen
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Supabase Verbindung testen...\n');

if (!supabaseUrl || supabaseUrl.includes('ihr-projekt-id')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL ist nicht korrekt gesetzt!');
  console.error('   Bitte ersetzen Sie "ihr-projekt-id" mit Ihrer echten Projekt-ID');
  process.exit(1);
}

if (!supabaseAnonKey || supabaseAnonKey.includes('ihr-anon-key')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY ist nicht korrekt gesetzt!');
  console.error('   Bitte ersetzen Sie "ihr-anon-key-hier" mit Ihrem echten Anon Key');
  process.exit(1);
}

console.log('✅ Environment Variables sind gesetzt');
console.log('   URL:', supabaseUrl.substring(0, 40) + '...');
console.log('   Key:', supabaseAnonKey.substring(0, 20) + '...\n');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test: Versuche einen Test-Eintrag zu erstellen
console.log('🧪 Test: Versuche Test-Eintrag zu erstellen...\n');

supabase
  .from('contact_submissions')
  .insert([
    {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '123456789',
      message: 'Dies ist ein Test-Eintrag',
      status: 'neu',
    },
  ])
  .select()
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Fehler beim Erstellen:', error.message);
      console.error('   Code:', error.code);
      console.error('   Details:', error.details);
      console.error('\n💡 Mögliche Ursachen:');
      console.error('   1. Row Level Security (RLS) blockiert den Insert');
      console.error('   2. Falsche API Keys');
      console.error('   3. Tabelle existiert nicht');
      console.error('\n📝 Lösung:');
      console.error('   Prüfen Sie in Supabase:');
      console.error('   - Settings > API > Row Level Security Policies');
      console.error('   - Table Editor > contact_submissions > RLS Status');
      process.exit(1);
    } else {
      console.log('✅ Test-Eintrag erfolgreich erstellt!');
      console.log('   ID:', data[0].id);
      console.log('   Name:', data[0].first_name, data[0].last_name);
      console.log('\n🧹 Lösche Test-Eintrag...');
      
      // Test-Eintrag löschen
      supabase
        .from('contact_submissions')
        .delete()
        .eq('id', data[0].id)
        .then(() => {
          console.log('✅ Test-Eintrag gelöscht\n');
          console.log('✅ Alles funktioniert! Die Verbindung zu Supabase ist korrekt.');
        });
    }
  })
  .catch((error) => {
    console.error('❌ Unerwarteter Fehler:', error);
    process.exit(1);
  });

