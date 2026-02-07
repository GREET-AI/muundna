# Digitale Produkte & Ablefy-Style (Landingpages + Mitgliederbereich)

**Wichtig:** Der Mitgliederbereich ist **nur** für das Erstellen/Verkaufen digitaler Produkte und für **explizit freigeschaltete** Kunden gedacht. Nicht jeder CRM-Kunde erhält automatisch einen Zugang. Im Menü erscheint alles nur unter der Rubrik **Digitale Produkte** (Tools → Digitale Produkte) mit eigener **Sub-Navigation**: **Produkte** (Kurse/Downloads/Mitgliederbereiche anlegen) und **Zugänge** (Kunden gezielt pro Produkt freischalten oder entziehen).

## Was ist umgesetzt

- **Produkt anlegen:** Typ (Kurs / Download / Mitgliederbereich), Titel, Slug, Beschreibung, **Preis in € brutto** (z. B. 800 = 800,00 €, MwSt. bei Abrechnung), **Bild-Upload** (kein URL-Feld mehr), Sortierung, Veröffentlicht.
- **Preis:** Eingabe in Euro; Speicherung intern in Cent. Anzeige z. B. „800,00 €“.
- **Bild:** Upload über API → Supabase Storage; URL wird in `image_url` gespeichert und ist beim Bearbeiten änderbar (anderes Bild hochladen / entfernen).
- **Landingpages für Coachings/Kurse:** Öffentliche Route **`/p/[slug]`** mit Titel, Beschreibung, Bild, Preis, CTA „Jetzt anfragen“; API **`GET /api/public/products/[slug]`** (nur veröffentlichte Produkte); Tenant über `NEXT_PUBLIC_TENANT_SLUG` oder Default.
- **Landingpage-Builder:** Beim Bearbeiten eines Produkts: Button „Landingpage gestalten“. Elemente (Hero, Text, CTA, Produktinfo, Testimonial) mit **Mini-Vorschaubild** und Beschreibung auswählen, per **Drag & Drop** anordnen, Speichern. **Vorschau (Vollbild)** lädt die Daten per API (Cookie wird mitgeschickt) und rendert die Seite im Overlay – kein neuer Tab, kein Iframe, daher zuverlässig. Wenn das Produkt gespeicherte Sektionen hat, wird die öffentliche Seite aus diesen Blöcken aufgebaut. Die Builder-Elemente sind **dieselben Sektionen**, die auf `/p/[slug]` gerendert werden (keine Platzhalter). **Original-Sektionen der Main-Page:** Aktuell sind es generische Typen; um echte Website-Komponenten (z. B. FAQSection, BenefitsSection) einzubinden, siehe Fahrplan „Main-Page-Sektionen als Builder-Elemente“ – Zuordnung oder neue Typen, **keine Screenshots nötig** (optional: Thumbnails pro Sektion).
- **Zugänge:** Unter Digitale Produkte → Zugänge: Kunden per E-Mail einem Produkt zuordnen, Ablaufdatum setzen, Zugänge auflisten und entziehen.

## Supabase: Was du für Produktbilder machen musst

Damit der **Bild-Upload** bei „Produkt anlegen“ funktioniert, musst du in Supabase **einmalig** einen Storage-Bucket anlegen:

1. **Supabase Dashboard** öffnen → linke Seite **Storage** → **New bucket**
2. **Name:** genau **`dp-product-images`** (wird so in der API erwartet)
3. **Public bucket:** aktivieren (Häkchen), damit die Bild-URLs später ohne Login abrufbar sind (z. B. für Landingpages)
4. **Create bucket** klicken

Fertig. Danach speichert die App hochgeladene Produktbilder in diesem Bucket und legt die URL im Produkt ab. Ohne diesen Bucket erscheint beim Upload eine Fehlermeldung mit dem Hinweis auf den Bucket-Namen.

**Landingpage-Builder:** Für die Spalte `landing_page_sections` (JSONB) die Migration **`supabase/migrations/004_dp_landing_page_sections.sql`** im Supabase SQL Editor ausführen (einmalig).

### Builder: Nur 12 Sektionen (1:1 wie Startseite)

Im Builder gibt es **nur noch** diese 12 Sektionen (alle anderen wurden entfernt):

1. **Hero** (website_jeton_hero)  
2. **Laufendes Banner** (website_marquee)  
3. **Für wen ist dieses Coaching** (website_target_groups)  
4. **Das sagen unsere Kunden** (website_testimonials)  
5. **Quiz-Opt-in + Quiz** (website_quiz_cta)  
6. **Was dir unser Coaching ermöglicht** (website_services)  
7. **Benefits** (website_benefits)  
8. **Unser Angebot / CTA Kauf** (website_pricing)  
9. **Zufriedenheitsgarantie** (website_trust)  
10. **So funktioniert das Coaching** (website_process)  
11. **FAQ** (website_faq)  
12. **Footer** (website_footer)  

**Supabase:** Es ist **keine neue Migration** nötig. Die Spalte `landing_page_sections` (JSONB) bleibt unverändert. Wenn bestehende Produkte noch alte Typen haben (z. B. `hero`, `product_info`, `text`), werden diese Sektionen **nicht mehr gerendert**. Empfehlung: Im Admin die Landingpage pro Produkt neu aufbauen und nur die neuen 12 Typen verwenden. Gespeichert wird weiterhin ein JSON-Array wie: `[{"id":"...","type":"website_jeton_hero","props":{...}}, ...]`.

---

## Vision: Ablefy-Style (Landingpages + Mitgliederbereich)

### Ziel

- **Landingpages** für jeden Kurs/ jedes Produkt (z. B. `/kunde-slug/kurs-slug`).
- **Mitgliederbereich** pro CRM-Kunde (Firma), der das Paket gekauft hat.
- Im Mitgliederbereich: **Produkte je nach Abo freischaltbar** (Subscription).

### Wie es Profis typischerweise machen

1. **Multi-Tenant:** Jeder CRM-Kunde = ein Tenant (habt ihr mit `tenant_id`).
2. **Produkte pro Tenant:** Jeder Tenant hat seine eigenen Kurse/Downloads/Mitgliederbereiche (`dp_products`).
3. **Landingpages:**  
   - Pro Produkt eine eigene Seite, z. B.  
     `/{tenant-slug}/{product-slug}` oder Subdomain `tenant.ihredomain.de/kurs-slug`.  
   - Dort: Verkauf (Preis, CTA), später Checkout/ Zahlung.
4. **Mitgliederbereich:**  
   - Nach Kauf/Subscription: Login (E-Mail + Passwort oder Magic Link).  
   - Zugriff nur auf die Produkte, die zur Subscription gehören (z. B. in `dp_enrollments` oder einer Subscription-Tabelle).
5. **Freischaltung:**  
   - Tabelle z. B. `dp_subscriptions` (Tenant, Kunde, Paket, gültig bis) oder Erweiterung von `dp_enrollments`.  
   - Pro Produkt: „Welche Pakete schalten dieses Produkt frei?“ (z. B. viele-zu-viele oder JSONB mit product_ids).

### Sinnvolle nächste Schritte (Reihenfolge)

1. **Storage-Bucket anlegen** (siehe oben) → Bild-Upload nutzbar.
2. **Öffentliche Landingpage pro Produkt** ✅ **umgesetzt**  
   - Route: **`/p/[slug]`** (Tenant aus `NEXT_PUBLIC_TENANT_SLUG` oder Default `muckenfuss-nagel`).  
   - Öffentliche API: **`GET /api/public/products/[slug]?tenant=…`** (nur veröffentlichte Produkte).  
   - Seite: Titel, Beschreibung, Bild, Preis (€ brutto), CTA „Jetzt anfragen“ (Link zu `/kontakt?produkt=…`).  
   - SEO: `generateMetadata` mit Titel/Beschreibung.
3. **Checkout / Zahlung:**  
   Stripe, PayPal oder weiterhin „Anfrage senden“ + manuell Zugang anlegen (erstmal ohne Zahlung).
4. **Zugang verwalten:**  
   Bereits umgesetzt: `dp_enrollments` (customer_email, product_id, access_until) in der Admin-UI unter Digitale Produkte → Zugänge.  
   Offen: **Login für Mitglieder** (E-Mail + Passwort oder Magic Link), damit Nutzer „Mein Bereich“ nutzen können.
5. **Videokurs-Bereich / Mitgliederbereich-UI:**  
   - Geschützte Route(n) für eingeloggte Mitglieder (z. B. `/bereich` oder `/meine-kurse`).  
   - Login: E-Mail + einmaliges Passwort/Link (Magic Link) oder Token aus E-Mail; Session/Cookie.  
   - **„Meine Kurse“:** Liste der freigeschalteten Produkte aus `dp_enrollments` (access_until berücksichtigen).  
   - **Kursansicht:** Pro Produkt (Typ „course“) Lektionen/Inhalte aus `dp_product_files` (video_url, title, sort_order) anzeigen; Video-Player (embed oder Link).  
   - Downloads: Bei Typ „download“ Dateien/Links aus `dp_product_files` anzeigen.
6. **Subscription-Pakete (später):**  
   Pakete definieren (z. B. „Basic“, „Pro“), jedem Paket Produkte zuordnen; bei Kauf/Abonnement Zugriff in `dp_enrollments` oder Subscription-Tabelle.

Wenn du möchtest, können wir als Nächstes konkret den **Mitglieder-Login** (Magic Link oder Token) und die **Mitgliederbereich-UI** (Meine Kurse, Videokurs-Inhalte) ausarbeiten.

---

## Fahrplan: Was als Erstes (Reihenfolge)

### 1. Landingpage-Builder zum Laufen bringen

- **Migration 004** im Supabase SQL Editor ausführen (Spalte `landing_page_sections`), falls noch nicht geschehen.
- **„Landingpage gestalten“:** Element links anklicken (z. B. Hero, Text) → erscheint in der Reihenfolge; Speichern klicken. Bei Fehlermeldung (z. B. Spalte fehlt) Hinweis in der Doku beachten.
- Die **Builder-Elemente** (Hero, Text, CTA, Produktinfo, Testimonial) haben jetzt **Coaching-Beispieltexte** als Standard, die beim Hinzufügen gesetzt werden (in `types/landing-section.ts`).

### 2. Main-Page-Sektionen als Builder-Elemente verfügbar machen

**Ziel:** Bestimmte Blöcke eurer Hauptwebsite (z. B. von `/`) als wählbare Elemente im Landingpage-Builder nutzen – gleicher Stil, gleiche Komponenten.

**Schritte:**

1. **Sektionen festlegen:** Aus der Main-Page-Komponenten-Liste die Blöcke auswählen, die für Produkt-Landingpages genutzt werden sollen, z. B.:
   - `HeroSection` / `PageHero` → bereits abgebildet als **Hero**
   - `ContentSection` / `BenefitsSection` → als **Text** oder neuer Typ „Benefits“
   - `CTASection` / `ExpertiseCTABanner` → als **CTA**
   - `TestimonialsSection` → als **Testimonial**
   - `PricingSection` → optional als **Produktinfo** oder eigener Block
   - `FAQSection`, `ProcessSection`, `TrustSection` usw. → pro gewünschtem Block ein neuer Element-Typ

2. **Zuordnung:** Für jede gewählte Sektion entscheiden:
   - Entweder einem **bestehenden** Builder-Element zuordnen (Hero, Text, CTA, Produktinfo, Testimonial) und das Rendering in `/p/[slug]` so anpassen, dass dieselbe Website-Komponente (oder ein vereinfachtes Pendant) genutzt wird.
   - Oder ein **neues** Element im Builder anlegen (z. B. `faq`, `process`, `trust`) und in `types/landing-section.ts` + `app/p/[slug]/page.tsx` ergänzen.

3. **Beispieltexte für Coaching:** Pro Element in `LANDING_ELEMENT_DEFINITIONS` passende Default-Texte für Coaching/Kurse pflegen (bereits für Hero-Subline, Text, Testimonial ergänzt). Weitere Blöcke beim Hinzufügen mit Coaching-Vorlagen versehen.

4. **Optional:** Im Builder pro Sektion ein **Vorschaubild** (Thumbnail) der echten Website-Sektion hinterlegen, damit man sie beim Auswählen erkennt.

**Ergebnis:** Ihr habt eine klare Liste „diese Main-Page-Sektionen sind im Builder wählbar“ und die Landingpage wird im Stil eurer Website gebaut.

### 3. Mitgliederbereich designen

**Ziel:** Den Bereich, in dem freigeschaltete Kunden ihre Kurse/Downloads sehen, optisch und strukturell gestalten (Layout, Branding, Navigation).

**Schritte:**

1. **Route festlegen:** z. B. `/bereich` oder `/meine-kurse` (geschützt, nur nach Login).
2. **Layout:** Gemeinsames Layout für alle Mitglieder-Seiten (Header mit Logo/Tenant-Name, „Meine Kurse“, „Profil“, „Abmelden“).
3. **Design:** Farben, Typo, Abstände an eure Hauptwebsite oder an ein eigenes „Member Area“-Theme anpassen; optional Konfiguration pro Tenant (Logo, Primärfarbe) in der DB.
4. **Inhalte:** Liste der freigeschalteten Produkte aus `dp_enrollments`; Klick auf einen Kurs führt in die Kursansicht (siehe Punkt 4).

### 4. Videokurs-Bereich (Kajabi-Style)

**Ziel:** Pro Kurs eine Ansicht mit Modulen/Lektionen, Video-Player und Fortschritt – ähnlich Kajabi/Teachable.

**Schritte:**

1. **Datenmodell:** Bereits vorhanden – `dp_product_files` mit `file_type` (z. B. `video_url`, `lesson`), `title`, `file_url`, `sort_order`. Optional: Gruppierung in „Module“ (z. B. neues Feld `module_title` oder eigene Tabelle `dp_course_modules`).
2. **Kursansicht-Route:** z. B. `/bereich/kurs/[productId]` oder `/bereich/kurs/[slug]`.
3. **Layout:**
   - **Links (oder oben auf Mobile):** Liste der Lektionen/Module mit Fortschritt (z. B. Häkchen für „gesehen“). Aus `dp_product_files` lesen, sortiert nach `sort_order`.
   - **Hauptbereich:** Aktuelle Lektion – Titel, Video-Player (embed von `file_url` z. B. Vimeo/YouTube) oder Text/PDF-Link. „Vorherige“ / „Nächste“ Navigation.
4. **Fortschritt (optional):** Tabelle `dp_lesson_progress` (enrollment_id, product_file_id, completed_at) und Anzeige „x von y Lektionen abgeschlossen“.
5. **Styling:** An Mitgliederbereich anpassen; Player-Container, Buttons, Sidebar wie bei typischen Kurs-Plattformen.

**Reihenfolge empfohlen:** Zuerst 1 (Builder stabil), dann 2 (Main-Page-Sektionen festlegen), dann 3 (Mitgliederbereich-Design), dann 4 (Videokurs-UI). Login für Mitglieder (Magic Link oder Token) kann parallel zu 3 ausgearbeitet werden.
