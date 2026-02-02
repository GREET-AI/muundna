# Vercel Environment Variables Setup

## 📋 Benötigte Umgebungsvariablen

Bevor Sie die Website auf Vercel deployen, müssen Sie folgende Umgebungsvariablen in Vercel einrichten:

### ✅ Erforderlich (für Kontaktformular):

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Format: `https://ihr-projekt-id.supabase.co`
   - Beispiel: `https://fjktvwuqnhmfgbufoioc.supabase.co`
   - ⚠️ NICHT die Dashboard-URL verwenden!

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Der "anon" oder "public" Key aus Ihrem Supabase Dashboard
   - Finden Sie unter: Settings → API → Project API keys → `anon` `public`

### 🔐 Optional (für Admin-Panel):

3. **NEXT_PUBLIC_ADMIN_PASSWORD**
   - Ihr gewähltes Admin-Passwort für das Admin-Panel
   - Beispiel: `Muckenfuss123`

4. **SUPABASE_SERVICE_ROLE_KEY**
   - Der "service_role" Key aus Ihrem Supabase Dashboard
   - ⚠️ WICHTIG: Dieser Key ist sehr sensibel! Niemals öffentlich teilen!
   - Finden Sie unter: Settings → API → Project API keys → `service_role`

---

## 🚀 So richten Sie die Variablen in Vercel ein:

### Schritt 1: Vercel Dashboard öffnen
1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Loggen Sie sich ein
3. Wählen Sie Ihr Projekt aus (oder erstellen Sie ein neues)

### Schritt 2: Environment Variables hinzufügen
1. Klicken Sie auf **Settings** (Einstellungen)
2. Klicken Sie auf **Environment Variables** (Umgebungsvariablen)
3. Fügen Sie jede Variable einzeln hinzu:

#### Variable 1: NEXT_PUBLIC_SUPABASE_URL
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** Ihre Supabase API URL (z.B. `https://fjktvwuqnhmfgbufoioc.supabase.co`)
- **Environment:** ✅ Production, ✅ Preview, ✅ Development (alle auswählen)
- Klicken Sie auf **Save**

#### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Ihr Supabase Anon Key (aus dem Supabase Dashboard)
- **Environment:** ✅ Production, ✅ Preview, ✅ Development (alle auswählen)
- Klicken Sie auf **Save**

#### Variable 3: NEXT_PUBLIC_ADMIN_PASSWORD (optional)
- **Name:** `NEXT_PUBLIC_ADMIN_PASSWORD`
- **Value:** Ihr gewähltes Admin-Passwort
- **Environment:** ✅ Production, ✅ Preview, ✅ Development (alle auswählen)
- Klicken Sie auf **Save**

#### Variable 4: SUPABASE_SERVICE_ROLE_KEY (optional)
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** Ihr Supabase Service Role Key (aus dem Supabase Dashboard)
- **Environment:** ✅ Production, ✅ Preview, ✅ Development (alle auswählen)
- Klicken Sie auf **Save**

### Schritt 3: Deployment neu starten
Nach dem Hinzufügen aller Variablen:
1. Gehen Sie zu **Deployments**
2. Klicken Sie auf die drei Punkte (⋯) neben dem letzten Deployment
3. Wählen Sie **Redeploy**
4. Oder: Machen Sie einen neuen Commit und Push (Vercel deployt automatisch)

---

## ✅ Checkliste vor dem Commit:

- [ ] Alle 4 Umgebungsvariablen in Vercel hinzugefügt
- [ ] Alle Variablen für Production, Preview UND Development aktiviert
- [ ] NEXT_PUBLIC_SUPABASE_URL ist die API-URL (nicht Dashboard-URL!)
- [ ] Alle Keys aus Supabase Dashboard kopiert
- [ ] Admin-Passwort gesetzt (falls Admin-Panel verwendet wird)

---

## 🔍 Wo finde ich meine Supabase Keys?

1. Gehen Sie zu [supabase.com](https://supabase.com)
2. Loggen Sie sich ein
3. Wählen Sie Ihr Projekt aus
4. Klicken Sie auf **Settings** (⚙️) → **API**
5. Unter **Project API keys** finden Sie:
   - **URL:** Das ist Ihre `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public:** Das ist Ihr `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role:** Das ist Ihr `SUPABASE_SERVICE_ROLE_KEY` (⚠️ geheim halten!)

---

## ⚠️ Wichtige Hinweise:

1. **NEXT_PUBLIC_** Variablen sind öffentlich sichtbar im Browser
   - Verwenden Sie KEINE sensiblen Daten in `NEXT_PUBLIC_*` Variablen (außer dem Admin-Passwort, das ist ok)

2. **SUPABASE_SERVICE_ROLE_KEY** ist sehr sensibel
   - Niemals in Git committen
   - Nur in Vercel Environment Variables speichern
   - Nur für Server-seitige API Routes verwenden

3. **Nach dem Hinzufügen der Variablen:**
   - Müssen Sie das Deployment neu starten
   - Die Variablen werden beim nächsten Build geladen

---

## 🧪 Testen nach dem Deployment:

1. Gehen Sie zu Ihrer Live-Website
2. Füllen Sie das Kontaktformular aus
3. Prüfen Sie in Supabase, ob die Daten ankommen
4. Prüfen Sie, ob das Toast-Popup erscheint

---

## 📞 Hilfe benötigt?

Falls etwas nicht funktioniert:
- Prüfen Sie die Vercel Deployment Logs
- Prüfen Sie, ob alle Variablen korrekt gesetzt sind
- Prüfen Sie, ob die Supabase URL die API-URL ist (nicht Dashboard-URL!)

