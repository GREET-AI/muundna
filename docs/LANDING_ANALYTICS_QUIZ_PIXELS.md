# Landingpage-Analytics: Quiz pro Produkt, Funnel-Events, Tracking-Pixels

## Übersicht

- **Quiz pro Landingpage:** Jedes Produkt kann eigene Quiz-Fragen und -Antworten haben (in der DB), nicht mehr nur ein festes Haupt-Quiz.
- **Funnel-Analytics:** Jeder Schritt (Seitenaufruf, Quiz-Start, Frage 1 … N, Absprung, Abschluss) wird als Event gespeichert → Auswertung: „Bei Frage 2 brechen 70 % ab“ → Frage anpassen oder entfernen.
- **Tracking-Pixel pro Landingpage:** Facebook, Google Ads, TikTok etc. pro Produkt konfigurierbar; Aufrufe und Conversion-Events (z. B. Lead) trackbar.
- **Analytics-Bereich (kommt):** Kennzahlen, Funnel-Auswertungen, ggf. Aufrufe und Pixel-Integrationen sichtbar.

---

## 1. Quiz-Konfiguration pro Produkt (andere Fragen/Antworten)

### Idee

- Die Fragen und Antworten des Quiz-Funnels liegen **nicht** mehr nur im Code, sondern pro Produkt in der **Datenbank**.
- Beim Aufruf von `/p/[slug]/quiz` wird die Konfiguration für dieses Produkt geladen; ist keine hinterlegt, wird ein **Default-Quiz** (wie bisher) verwendet.
- Im **Landingpage-Builder** (oder eigener Tab „Quiz“ beim Produkt) kann man pro Produkt:
  - Schritte anlegen/bearbeiten (Titel, Untertitel, Typ: Einfach-/Mehrfachauswahl),
  - Antwort-Optionen pro Schritt (id, label, optional icon/detail).

### Datenmodell (bereits in Migration 005)

- **`dp_products.quiz_config`** (JSONB, optional):
  - Struktur: `{ "steps": [ { "id": "targetGroup", "title": "...", "subtitle": "...", "type": "single"|"multiple", "options": [ { "id": "...", "label": "...", "icon"?: "...", "detail"?: "...", "optional"?: true } ] } ] }`
  - Wenn `quiz_config` null oder leer: Frontend nutzt das **Standard-Quiz** (wie bisher im Code), damit bestehende Produkte sofort laufen.

### Umsetzung (Schritte)

1. **Migration:** Spalte `quiz_config` anlegen (erledigt in 005).
2. **API:** Beim Laden des Produkts (`/api/public/products/[slug]`, oder direkt in der Quiz-Seite) `quiz_config` mit ausliefern.
3. **QuizFunnel:** Statt fester `BASE_STEPS` zuerst `product.quiz_config?.steps` verwenden; Fallback auf Default-Schritte.
4. **Admin/Builder:** UI zum Bearbeiten der Quiz-Schritte pro Produkt (später): Liste der Schritte, pro Schritt Optionen, Reihenfolge per Drag & Drop.

---

## 2. Funnel-Events für Analytics (wer bricht wo ab?)

### Idee

- Jeder relevante Nutzer-Schritt wird als **Event** in die DB geschrieben: Landingpage aufgerufen, Quiz gestartet, Frage 1 angesehen, Frage 1 beantwortet, … Frage N beantwortet, Formular geöffnet, Formular abgeschickt (oder Absprung).
- Mit **session_id** (Cookie oder Fingerprint) können wir pro Besucher eine Session zuordnen und auswerten: „Von 100 Starts haben 70 Frage 2 erreicht, 30 haben bei Frage 1 abgebrochen“ → Drop-off pro Schritt.

### Event-Typen

| event_type        | Bedeutung                          | step_index / step_id      |
|-------------------|-------------------------------------|----------------------------|
| `landing_view`    | Aufruf der Produkt-Landingpage     | –                          |
| `quiz_start`      | Nutzer hat Quiz gestartet          | 0                          |
| `quiz_step_view`  | Nutzer sieht Schritt N              | step_index, step_id        |
| `quiz_step_ok`    | Nutzer hat Schritt N beantwortet    | step_index, step_id         |
| `quiz_abandon`    | Absprung (z. B. Seite verlassen)    | letzter step_index         |
| `quiz_form_view`  | Kontaktformular wird angezeigt      | –                          |
| `quiz_complete`   | Formular erfolgreich abgeschickt    | –                          |

### Datenmodell (Migration 005)

- Tabelle **`landing_funnel_events`**:
  - `id`, `tenant_id`, `product_id` (FK zu dp_products), `event_type`, `step_index` (int, nullable), `step_id` (text, nullable), `session_id` (text, für Zuordnung), `created_at`, `metadata` (JSONB, z. B. `{ "time_on_step_ms": 5000, "selected_options": ["id1"] }`).

### API

- **POST /api/public/funnel-event** (öffentlich, keine Auth):
  - Body: `{ "productSlug": "...", "eventType": "quiz_step_ok", "stepIndex": 1, "stepId": "services", "sessionId": "...", "metadata": {} }`
  - Validierung: productSlug muss zu einem veröffentlichten Produkt gehören; Rate-Limit pro IP/session sinnvoll.
  - Schreibt eine Zeile in `landing_funnel_events` (tenant_id/product_id aus Produkt ermittelt).

### Analytics-Auswertung (später, Analytics-Bereich)

- Pro Produkt / pro Zeitraum:
  - **Funnel-Übersicht:** Anzahl `quiz_start` → `quiz_step_ok` Schritt 1 → Schritt 2 → … → `quiz_complete`.
  - **Drop-off pro Schritt:** z. B. „Schritt 2: 100 Eintritte, 30 Vollständig → 70 % brechen bei Schritt 2 ab“.
  - Darstellung ähnlich **Perspective Funnels**: Balken oder Tabelle mit Conversion pro Stufe; so siehst du, welche Frage optimiert werden sollte (weglassen, kürzer formulieren, andere Optionen).

---

## 3. Tracking-Pixel pro Landingpage

### Idee

- Pro Produkt (Landingpage) können **mehrere Tracking-Pixel** hinterlegt werden: z. B. Facebook Pixel, Google Ads Conversion, TikTok Pixel.
- Beim Aufruf der Landingpage (und ggf. der Quiz-Seiten) werden diese Skripte **nur für dieses Produkt** eingebunden.
- Bei **Conversion** (Formular abgeschickt = Lead) wird das Event an die Pixel gesendet (z. B. `fbq('track', 'Lead')`), damit Werbekampagnen die Konversion zuordnen können.

### Datenmodell (Migration 005)

- Tabelle **`landing_tracking_pixels`**:
  - `id`, `tenant_id`, `product_id` (FK dp_products), `provider` (z. B. `facebook`, `google_ads`, `tiktok`, `custom`), `pixel_id` (z. B. Facebook Pixel-ID), `name` (optional, Anzeige im Admin), `created_at`.
  - Bei `provider = 'custom'`: optional `script_content` (Text) für benutzerdefiniertes Snippet.

### Einbindung

- **Landingpage `/p/[slug]`** und **Quiz `/p/[slug]/quiz`**: Beim Rendern (Server oder Client) die für dieses Produkt hinterlegten Pixel laden:
  - Facebook: Standard-Snippet mit `pixel_id`; bei Lead: `fbq('track', 'Lead')`.
  - Google Ads: gtag oder Google Tag Manager mit Conversion-ID; bei Lead: Conversion-Event senden.
  - TikTok: Standard-Snippet mit pixel_id; bei Lead: `ttq.track('CompleteRegistration')` o. ä.
- **Admin:** Unter „Digitale Produkte“ → Produkt bearbeiten → Bereich „Tracking & Pixel“: Liste der Pixel (Provider, ID/Name), hinzufügen/bearbeiten/löschen.

### Was machen die Profis?

- **Google Tag Manager (GTM):** Viele nutzen **einen** GTM-Container auf der ganzen Seite; darin werden Facebook, Google Ads, TikTok etc. als **Tags** konfiguriert. Trigger: „Alle Seiten“, „Event = Lead“ etc. Vorteil: Keine Code-Änderung nötig, alles in GTM konfigurierbar.
- **Alternativ:** Pro Landingpage eigene Pixel-IDs (wie hier geplant): einfacher, keine GTM-Kenntnisse nötig; Conversion-Events werden von unserer App ausgelöst (z. B. nach Formular-Submit: `fbq('track', 'Lead')` im Frontend oder server-seitig Facebook CAPI).
- **Server-seitiges Tracking (CAPI):** Profis senden Conversion-Events zusätzlich vom Server an Facebook (Facebook Conversion API), um Adblocker zu umgehen und bessere Zuordnung. Dafür braucht man Zugangsdaten (Access Token) pro Pixel; kann später ergänzt werden.
- **Aufrufe tracken:** Entweder über die Pixel selbst (Facebook/Google zählen Page Views) oder über eigene Events (`landing_view` in `landing_funnel_events`). Für reine „Aufrufe pro Landingpage“ reicht unser `landing_view`-Event; für Kampagnen-Optimierung nutzen die Plattformen ihre eigenen Pixel-Page-Views.

---

## 4. Analytics-Bereich (geplant)

- **Kennzahlen pro Produkt / Zeitraum:**
  - Aufrufe Landingpage (Anzahl `landing_view`),
  - Quiz-Starts, Abschlüsse, Drop-off pro Schritt,
  - Conversion-Rate (Starts → Formular abgeschickt).
- **Funnel-Visualisierung:** Wie Perspective: Stufen mit absoluten Zahlen und Prozent („70 % brechen bei Frage 2 ab“).
- **Tracking-Pixel:** Übersicht, welche Pixel pro Produkt aktiv sind; optional „Letzte Conversion“ aus Pixel-API (wenn angeboten).

---

## 5. Reihenfolge der Umsetzung

1. **Migration 005** – Tabellen/Spalten anlegen (quiz_config, landing_funnel_events, landing_tracking_pixels).
2. **Event-API** – POST `/api/public/funnel-event` zum Schreiben der Events.
3. **Frontend** – Auf Landingpage und Quiz: `session_id` setzen (Cookie), bei jedem Schritt `quiz_step_view` / `quiz_step_ok` aufrufen; bei Formular-Submit `quiz_complete`.
4. **Quiz aus DB** – QuizFunnel so erweitern, dass `quiz_config` vom Produkt geladen und genutzt wird (Fallback: Default-Schritte).
5. **Admin: Quiz bearbeiten** – UI im Builder/Produkt für `quiz_config` (Schritte + Optionen).
6. **Admin: Pixel verwalten** – CRUD für `landing_tracking_pixels` pro Produkt; Einbindung der Skripte auf `/p/[slug]` und `/p/[slug]/quiz`.
7. **Analytics-Seite** – Auswertung aus `landing_funnel_events` (Funnel, Drop-off, Aufrufe); optional Pixel-Status.

Damit sind konfigurierbare Quiz-Funnel, Funnel-Analytics (inkl. „wer bricht wo ab“) und Tracking-Pixel pro Landingpage abgedeckt und an das angebunden, was Profis mit GTM/Perspective machen.
