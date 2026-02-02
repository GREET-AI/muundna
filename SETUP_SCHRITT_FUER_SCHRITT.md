# Supabase Setup - Schritt für Schritt

## ✅ Schritt 1: Tabelle erstellen (ERLEDIGT)
Die Tabelle `contact_submissions` wurde erfolgreich erstellt!

## 📝 Schritt 2: Supabase Keys finden

1. Gehen Sie in Supabase zu: **Settings** (Zahnrad-Icon) → **API**
2. Notieren Sie sich:
   - **Project URL** (z.B. `https://fjktvwuqnhmfgbufoioc.supabase.co`)
   - **anon public** Key (unter "Project API keys")
   - **service_role** Key (unter "Project API keys" - **GEHEIM!**)

## 🔐 Schritt 3: Environment Variables setzen

### Lokal (.env.local erstellen)

1. Erstellen Sie eine Datei `.env.local` im Root-Verzeichnis des Projekts
2. Fügen Sie folgende Zeilen ein (ersetzen Sie die Platzhalter):

```env
NEXT_PUBLIC_SUPABASE_URL=https://ihr-projekt-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ihr-anon-key-hier
NEXT_PUBLIC_ADMIN_PASSWORD=ihr-sicheres-passwort
SUPABASE_SERVICE_ROLE_KEY=ihr-service-role-key-hier
```

**WICHTIG:**
- Ersetzen Sie `ihr-projekt-id` mit Ihrer tatsächlichen Projekt-ID
- Ersetzen Sie `ihr-anon-key-hier` mit dem anon public key
- Ersetzen Sie `ihr-service-role-key-hier` mit dem service_role key
- Wählen Sie ein sicheres Passwort für `NEXT_PUBLIC_ADMIN_PASSWORD`

## 🧪 Schritt 4: Lokal testen

1. Development Server starten:
   ```bash
   npm run dev
   ```

2. Browser öffnen: `http://localhost:3000`

3. **Test 1: Kontaktformular**
   - Gehen Sie zu `/kontakt`
   - Füllen Sie das Formular aus
   - Absenden
   - Prüfen Sie in Supabase: **Table Editor** → `contact_submissions`
   - Die Daten sollten dort erscheinen!

4. **Test 2: Admin-Seite**
   - Gehen Sie zu `/admin`
   - Login mit dem Passwort aus `.env.local`
   - Sie sollten alle Kontakte sehen können

## 🚀 Schritt 5: Vercel konfigurieren

1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Wählen Sie Ihr Projekt "muundna"
3. **Settings** → **Environment Variables**
4. Fügen Sie alle 4 Variablen hinzu:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_PASSWORD`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. **Save** und **Redeploy**

## ✅ Schritt 6: Finale Prüfung

1. Testen Sie das Kontaktformular auf der Live-Seite
2. Prüfen Sie in Supabase, ob die Daten ankommen
3. Testen Sie die Admin-Seite auf der Live-Seite (`/admin`)

## 🔒 Sicherheitshinweise

- ✅ `.env.local` ist bereits in `.gitignore` (wird nicht ins Repository gepusht)
- ⚠️ **NIEMALS** den Service Role Key im Client-Code verwenden!
- ⚠️ Ändern Sie das Admin-Passwort von `admin123` auf etwas Sicheres!
- 💡 Für Produktion: Später Supabase Auth statt Passwort nutzen

## 🆘 Troubleshooting

**Problem: "Supabase ist nicht konfiguriert"**
- Prüfen Sie, ob `.env.local` existiert
- Prüfen Sie, ob alle Variablen korrekt gesetzt sind
- Starten Sie den Dev-Server neu: `npm run dev`

**Problem: "Unauthorized" in Admin-Seite**
- Prüfen Sie, ob `NEXT_PUBLIC_ADMIN_PASSWORD` korrekt gesetzt ist
- Prüfen Sie, ob Sie das richtige Passwort eingeben

**Problem: Daten kommen nicht in Supabase an**
- Prüfen Sie die Browser-Konsole auf Fehler
- Prüfen Sie die Supabase Logs
- Prüfen Sie, ob Row Level Security Policies korrekt sind

