# E-Mail-Benachrichtigungen Setup

## 📧 Automatische E-Mail-Benachrichtigungen bei neuen Leads

Das System sendet automatisch eine E-Mail-Benachrichtigung, wenn ein neuer Lead über das Kontaktformular oder Quiz eingeht.

## 🆓 Kostenfreie Optionen

### Option 1: Resend (EMPFOHLEN) ⭐

**Vorteile:**
- ✅ 3.000 E-Mails/Monat kostenfrei
- ✅ Sehr einfach zu integrieren
- ✅ Gute Zustellrate
- ✅ Moderne API

**Setup:**
1. Gehen Sie zu [resend.com](https://resend.com)
2. Erstellen Sie ein kostenloses Konto
3. Gehen Sie zu "API Keys" und erstellen Sie einen neuen Key
4. Fügen Sie in `.env.local` hinzu:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=noreply@muckenfussundnagel.de
   ```
5. Verifizieren Sie Ihre Domain in Resend (optional, aber empfohlen)

**Kosten:** Kostenfrei bis 3.000 E-Mails/Monat

---

### Option 2: SendGrid

**Vorteile:**
- ✅ 100 E-Mails/Tag kostenfrei
- ✅ Sehr zuverlässig
- ✅ Gute Zustellrate

**Setup:**
1. Gehen Sie zu [sendgrid.com](https://sendgrid.com)
2. Erstellen Sie ein kostenloses Konto
3. Gehen Sie zu "Settings" → "API Keys" und erstellen Sie einen neuen Key
4. Fügen Sie in `.env.local` hinzu:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   SENDGRID_FROM_EMAIL=noreply@muckenfussundnagel.de
   ```

**Kosten:** Kostenfrei bis 100 E-Mails/Tag

---

### Option 3: Nodemailer mit Gmail SMTP

**Vorteile:**
- ✅ Komplett kostenfrei
- ✅ Keine externe API nötig

**Nachteile:**
- ⚠️ Gmail-Limits (500 E-Mails/Tag)
- ⚠️ Erfordert App-Passwort von Gmail
- ⚠️ Weniger zuverlässig als professionelle Services

**Setup:**
1. Erstellen Sie ein Gmail-App-Passwort:
   - Gehen Sie zu [Google Account](https://myaccount.google.com)
   - Sicherheit → 2-Faktor-Authentifizierung aktivieren
   - App-Passwörter → Neues App-Passwort erstellen
2. Fügen Sie in `.env.local` hinzu:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=ihre-email@gmail.com
   SMTP_PASSWORD=ihr-app-passwort
   SMTP_FROM_EMAIL=ihre-email@gmail.com
   ```

**Kosten:** Komplett kostenfrei

---

## ⚙️ Konfiguration

### 1. Empfänger-E-Mail setzen

Fügen Sie in `.env.local` hinzu:
```env
NOTIFICATION_EMAIL=info@muckenfussundnagel.de
```

### 2. Site URL setzen (für Links in E-Mails)

Fügen Sie in `.env.local` hinzu:
```env
NEXT_PUBLIC_SITE_URL=https://muckenfussundnagel.de
```

### 3. Für Vercel Deployment

Fügen Sie alle Environment Variables in Vercel hinzu:
- `RESEND_API_KEY` (wenn Resend verwendet wird)
- `RESEND_FROM_EMAIL` (wenn Resend verwendet wird)
- `SENDGRID_API_KEY` (wenn SendGrid verwendet wird)
- `SENDGRID_FROM_EMAIL` (wenn SendGrid verwendet wird)
- `NOTIFICATION_EMAIL`
- `NEXT_PUBLIC_SITE_URL`

---

## 📱 SMS-Benachrichtigungen

SMS-Benachrichtigungen sind **nicht kostenfrei** verfügbar. Optionen:

1. **Twilio**: Ab ~$0.0075 pro SMS (ca. 0,007€)
2. **Vonage (Nexmo)**: Ab ~€0.05 pro SMS
3. **MessageBird**: Ab ~€0.05 pro SMS

**Empfehlung:** Für den Start reichen E-Mail-Benachrichtigungen völlig aus. SMS kann später hinzugefügt werden, wenn Bedarf besteht.

---

## 🧪 Testen

1. Füllen Sie das Kontaktformular auf der Website aus
2. Prüfen Sie Ihr E-Mail-Postfach (auch Spam-Ordner)
3. Prüfen Sie die Server-Logs für Fehler

---

## 🔍 Troubleshooting

**E-Mails kommen nicht an?**
- Prüfen Sie Spam-Ordner
- Prüfen Sie die API-Keys in `.env.local`
- Prüfen Sie die Server-Logs
- Prüfen Sie, ob die Domain verifiziert ist (bei Resend/SendGrid)

**Fehler in den Logs?**
- Prüfen Sie, ob alle Environment Variables gesetzt sind
- Prüfen Sie die API-Keys auf Gültigkeit
- Prüfen Sie die Rate Limits (bei kostenfreien Plänen)

---

## 📊 E-Mail-Inhalt

Die E-Mail enthält:
- ✅ Name des Leads
- ✅ Kontaktinformationen (E-Mail, Telefon, Adresse)
- ✅ Interessierte Dienstleistung
- ✅ Nachricht (falls vorhanden)
- ✅ Quiz-Daten (falls vorhanden)
- ✅ Link zum CRM-Dashboard
- ✅ Zeitstempel

---

## 🎨 E-Mail-Design

Die E-Mail verwendet:
- Firmenfarben (#182c30, #cb530a)
- Responsive Design
- Professionelles Layout
- Klare Struktur

