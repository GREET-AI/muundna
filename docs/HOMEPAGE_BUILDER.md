# Homepage-Builder (Februar 2026)

## Überblick

- **Landingpages** (digitale Produkte): `type = 'landing'`, freier Slug, Pfad `/p/[slug]?tenant=...`.
- **Homepage**: `type = 'homepage'`, Slug fest `home`, Pfad `/` (Tenant aus `?tenant=` oder `NEXT_PUBLIC_TENANT_SLUG`).

Design (Farben, Sidebar, Buttons, Editor-UI) wurde nicht verändert – nur neuer Menüpunkt und neue Seiten.

---

## Wichtige neue / geänderte Dateien

### Neu

| Datei | Zweck |
|-------|--------|
| `supabase/migrations/010_page_templates_and_pages.sql` | Tabellen `page_templates` (Vorlagen), `pages` (Homepage/Landing pro Tenant). Seed: eine Zeile „Standard Homepage“. |
| `lib/homepage-template.ts` | Standard-Homepage-JSON (neutrale Platzhalter), Schema `{ title, components: LandingSection[] }`. |
| `lib/homepage-public.ts` | `getPublishedHomepage(tenantSlug)` – lädt veröffentlichte Homepage für Tenant (nur über Slug, keine Session). |
| `app/api/admin/homepage/route.ts` | GET: Homepage des Tenants (aus Session) oder Vorlage. PUT: Speichern in `pages` (tenant_id aus Session). |
| `app/admin/create/homepage/edit/page.tsx` | Editor-Route: lädt Homepage, öffnet denselben `LandingPageBuilder` im Homepage-Modus (Speichern über `/api/admin/homepage`). |

### Geändert

| Datei | Änderung |
|-------|----------|
| `app/admin/page.tsx` | Sidebar: neuer Block „Create“ mit „Meine Homepage“ (gleiches Styling/Icon wie bisher). Inhalt bei `activeNav === 'create-homepage'`: Text, Vorschau-, Bearbeiten-, Veröffentlichen-Button. |
| `app/components/LandingPageBuilder.tsx` | Optional `homepageMode`, `productId`/`productSlug`/`productTitle` optional. Im Homepage-Modus: Speichern via PUT `/api/admin/homepage`, Vorschau = `/`, kein Pixel-Tab. |
| `app/p/[slug]/page.tsx` | `ProductLandingSections` als **export** für Wiederverwendung auf der Startseite. |
| `app/page.tsx` | Wenn `?tenant=` oder `NEXT_PUBLIC_TENANT_SLUG` gesetzt: veröffentlichte Homepage aus `pages` laden und mit `ProductLandingSections` rendern. Sonst: unveränderte statische Startseite. |

---

## tenant_id-Sicherheit

- **Admin (Homepage laden/speichern)**  
  - `GET/PUT /api/admin/homepage`: `tenant_id` kommt **nur** aus der Session (`getAdminSession(request).tid`).  
  - Kein Tenant in der Session → 401.  
  - Alle Lese-/Schreibzugriffe auf `pages` und Vorlagen sind an diese `tenant_id` gebunden.

- **Öffentliche Homepage (/)**
  - Tenant wird **nur** aus der URL/Umgebung ermittelt: `searchParams.tenant` oder `NEXT_PUBLIC_TENANT_SLUG`.  
  - `getPublishedHomepage(tenantSlug)` ermittelt `tenant_id` serverseitig über `tenants.slug` und liest nur Zeilen aus `pages` mit dieser `tenant_id`, `type = 'homepage'`, `slug = 'home'`, `is_published = true`.  
  - Keine Session, kein Zugriff auf andere Mandanten.

- **Tabellen**
  - `pages`: jede Zeile hat `tenant_id` (NOT NULL); Abfragen filtern immer nach `tenant_id`.  
  - `page_templates`: `tenant_id` nullable (NULL = System-Vorlage); tenant-spezifische Vorlagen später möglich.

---

## Ablauf

1. **Migration ausführen**  
   Im Supabase SQL Editor: `010_page_templates_and_pages.sql` ausführen.

2. **Admin**  
   - Sidebar → Create → „Meine Homepage“: Übersicht mit Vorschau, Bearbeiten, Veröffentlichen.  
   - „Bearbeiten“ → `/admin/create/homepage/edit`: gleicher Editor wie bei Landingpages, Speichern in `pages` (homepage, slug `home`).  
   - „Veröffentlichen“ setzt `is_published = true` für die aktuelle Homepage des Tenants.

3. **Öffentliche Startseite**  
   - Aufruf z. B. `/?tenant=mein-tenant` oder mit gesetztem `NEXT_PUBLIC_TENANT_SLUG`:  
     Es wird die veröffentlichte Homepage dieses Tenants aus `pages` geladen und mit dem gleichen Section-Renderer wie unter `/p/[slug]` gerendert.  
   - Ohne Tenant oder ohne veröffentlichte Homepage: bisherige statische Startseite (unverändert).
