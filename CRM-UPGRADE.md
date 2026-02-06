# CRM-Upgrade: Close-inspiriert + Placetel

Kurze Analyse von **Close CRM** ([close.com](https://www.close.com/)) und dem Video „Close CRM in Rekordzeit einrichten“ sowie konkrete Schritte, um euer bestehendes CRM (Muckenfuss & Nagel Admin) vertriebsstärker zu machen und mit **Placetel** zu verbinden.

---

## Was Close ausmacht (aus Video + Website)

- **Inbox** mit Primary, E-Mails, Anrufe, SMS, Aufgaben, Erinnerungen
- **Smart Views**: vordefinierte Listen wie „Daily Calling List“, „Leads to Call“, „No Contact > 7 Days“, „Leads Never Emailed“, „Opportunity Follow-up“, „Untouched Leads“
- **Lead-Status & Pipeline**: z. B. Neue Leads → Terminiert → No Show → Follow Up → Kunden → Inaktiv
- **Opportunity-Pipeline**: Closing → Gewonnen / Verloren
- **Kommunikation**: integrierter **Dialer**, Phone & Voicemail, E-Mail, SMS aus dem CRM
- **Integrationen**: Zapier, JustCall, KrispCall, viele weitere
- **Workflows**: Automatisierung von Follow-ups, Aufgaben, Lead-Routing

---

## Was ihr schon habt

- **Pipeline & Status**: Lead-Status (Neu, Offen, Kontaktversuch, Verbunden, Qualifiziert, …), Pipeline- und Tabellenansicht
- **Vertriebler-Zuweisung**: Sven / Pascal, „Meine Kontakte“
- **Lead-Scraping**: Gelbe Seiten, 11880, Import ins CRM
- **Anrufen-Button**: `tel:`-Link (öffnet Standard-Telefon-App / Softphone)
- **Bewertungs-Funnel, Angebotserstellung**

---

## Umgesetzte Upgrades

### 1. Smart Views (Close-Style)

In der Sidebar gibt es jetzt einen Bereich **SMART VIEWS** mit vordefinierten Listen:

| Smart View | Bedeutung |
|------------|-----------|
| **Heute anrufen** | Ihnen zugewiesene Leads mit Telefonnummer in frühen Phasen (Neu, Offen, Kontaktversuch) |
| **Leads zum Anrufen** | Alle mit Telefonnummer in aktiven Phasen (bis Qualifiziert) |
| **Kein Kontakt > 7 Tage** | Keine Aktivität (updated_at) seit mehr als 7 Tagen |
| **Neue Leads** | Status „Neu“ |
| **Follow-up nötig** | Status Wiedervorlage oder Qualifiziert (nächster Schritt geplant) |

So könnt ihr wie bei Close schnell „Daily Calling List“ und „Leads to Call“ abarbeiten.

---

## Placetel-Anbindung (Auto-Dialer / Click-to-Call)

### Option A: Tel-Link (aktuell)

- Der Button **„Anrufen“** nutzt `tel:+49...`.  
- Wenn auf dem PC/Handy eine **Placetel-App** oder ein **Softphone** (z. B. Placetel Web Client) installiert und als Standard-Telefonie-App eingestellt ist, wird beim Klick dort angewählt.  
- **Vorteil**: Keine Entwicklung nötig.  
- **Nachteil**: Abhängig von der Geräte-Konfiguration; kein zentraler „Auto-Dialer“ aus dem CRM.

### Option B: Placetel API (Click-to-Call aus dem CRM)

Placetel bietet:

- **REST API** ([api.placetel.de/v2/docs](https://api.placetel.de/v2/docs)): Konfiguration, Nutzer, Rufnummern
- **Call Control / Notify API**: Anrufe starten, annehmen, beenden, Events empfangen

**API-Key**: Im Placetel-Kundenportal unter **AppStore → Web API** den Key erzeugen und sicher speichern.

**Möglicher Ablauf für „Mit Placetel anrufen“:**

1. Im CRM auf **„Anrufen“** klicken (wie jetzt).
2. Optional: Statt direkt `tel:` zu öffnen, einen eigenen Button **„Mit Placetel anrufen“** anbieten.
3. Backend (z. B. Next.js API-Route) ruft mit dem **Ziel-Rufnummer** und der **Nebenstelle** (Vertriebler) die Placetel Call-Control-API auf und startet den Anruf.
4. Das Telefon des Vertrieblers (Placetel-App/Softphone) klingelt, nach Annahme wird die Zielnummer angewählt.

**Technik:**  
- Umgebungsvariable z. B. `PLACETEL_API_KEY` (oder Token).  
- In der Placetel-Doku die genaue **Call-Control-API** für „Anruf initiieren“ nachschlagen (Endpunkt, Parameter: z. B. `from` = Nebenstelle, `to` = Kundennummer).  
- API-Route nur für eingeloggte Admin-Nutzer aufrufbar machen und Nummer validieren (z. B. nur deutsche Nummern, Rate-Limit).

Wenn ihr euch für Option B entscheidet, kann als Nächstes eine konkrete API-Route und ein Button „Mit Placetel anrufen“ (optional neben dem bestehenden `tel:`-Link) eingebaut werden.

### Option C: Close + Placetel

Close hat integrierte Telefonie und Integrationen (z. B. JustCall, KrispCall). **Placetel** ist bei Close nicht als fertige Integration gelistet; möglich wären:

- **Zapier/Make**: Close ↔ Zapier ↔ Placetel (falls Placetel dort angeboten wird).  
- Oder: Bei euch bleibt das eigene CRM (wie jetzt), und ihr nutzt **Smart Views + Placetel** (Option A oder B) für Anrufe – ohne Wechsel zu Close.

---

## Weitere sinnvolle Erweiterungen (später)

1. **Aufgaben / Erinnerungen**  
   Tabelle z. B. `contact_tasks` (contact_id, due_date, title, done). In der Sidebar oder oben eine kleine **Inbox** „Heute fällig“ anzeigen.

2. **Custom Fields**  
   Z. B. „Kennenlern-Termin“, „Closing-Termin“ (wie im Close-Setup-Video). Entweder als zusätzliche Spalten in der DB oder als strukturierte Notizen/JSON.

3. **Pipeline für Opportunities (Deals)**  
   Z. B. „Closing“ → „Gewonnen“ / „Verloren“ mit optionalem Deal-Wert – entweder als eigener Bereich oder Erweiterung der bestehenden Lead-Status.

4. **E-Mail/SMS aus dem CRM**  
   Wenn gewünscht: E-Mail-Versand (z. B. Resend) oder SMS-API aus dem Kontakt heraus, mit Protokoll in den Notizen oder in einer Aktivitätszeitleiste.

---

## Zusammenfassung

- **Smart Views** sind eingebaut und bringen euch Close-ähnliche Listen (Heute anrufen, Leads zum Anrufen, Kein Kontakt > 7 Tage, Neue Leads, Follow-up nötig).
- **Placetel**: Aktuell nutzt ihr den **tel:-Link** (Option A). Für echten **Click-to-Call über Placetel** (Option B) braucht ihr den Placetel API-Key und eine kleine Backend-Route; die genaue Call-Control-Dokumentation nehmt ihr von [Placetel Developers](https://www.placetel.de/developers) / [REST API](https://www.placetel.de/hilfe/telefonanlage/rest-api) / Call Control.
- Wenn ihr wollt, kann als nächster Schritt die **Placetel-API-Integration** (Button „Mit Placetel anrufen“ + API-Route) konkret ausprogrammiert werden.
