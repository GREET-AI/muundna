# Bild- und Asset-Struktur (public/)

Übersicht, wo welche Bilder liegen und wofür sie genutzt werden – damit du alles schnell findest.

---

## 1. `public/` (Root)

| Inhalt | Verwendung |
|--------|------------|
| `favicon.png`, `favicon-16x16.png`, `favicon-32x32.png` | Browser-Tab / PWA |
| `Logo schwarz.jpeg`, `logoneu.png`, `logotransparent.png` | Logos (je nach Kontext) |
| `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | Icons / Platzhalter |
| **`images/`** | Alle Inhaltsbilder (siehe unten) |
| **`landing-previews/`** | Vorschaubilder für den Landingpage-Builder (siehe unten) |

---

## 2. `public/images/` – Inhaltsbilder

Alles, was auf der Website als **Inhalt** angezeigt wird (Hero, Slider, Karten, Team, etc.).  
Pfade in der App immer mit `/images/…` (z. B. `/images/trust/13.png`).

### 2.1 Nach Kontext

| Ordner / Datei | Inhalt | Verwendung in der App |
|----------------|--------|------------------------|
| **`Dienstleistungen/`** | Icons/Bilder für Dienstleistungen | Admin-Rubriken, ServicesOverview, Zielgruppen (Coaching) |
| | `Telefonieren.jpeg`, `Termenirung.jpeg`, `SocialMedia.jpeg`, `GoogleBewertungen.jpeg`, `Raport.jpeg` | |
| **`Landingpage-Coaching/Immobilien/`** | Bilder 1–7 für Coaching-Landing | z. B. Produkt-Landing, Slider |
| **`parallax-cards/`** | service, vertrauen, wohnhaus1, wohnhaus2 | Parallax / Sektionen |
| **`slider1/`** | 3.png – 7.png | Testimonials Infinite, Stacked Sheets, Parallax Testimonials (Hintergrund-Slider) |
| **`slider2/`** | 1.png, 2.png | Parallax-Hero Hintergrund (Default) |
| **`trust/`** | 13.png, 14.png, 15.png | Basic Testimonials Slider-Hintergrund |
| **`Team/`** | office1.jpeg, office 2.jpeg, team.png | Admin-Bereich, Mitgliederbereich |
| **Root** (ohne Unterordner) | Handwerker.png, Bauunternehmen.png, Brückenbau.png, Dachdecker.png, Renovierung.png, Zimmermann.png, etc. | Zielgruppen, Admin-Kacheln, Hero-Fallback |

### 2.2 Kurz-Übersicht Pfade

- Hero (Standard): `/images/Handwerker%20(2).png`
- Hero (Parallax): `/images/slider2/1.png`
- Testimonials (Basic): `/images/trust/13.png`, 14, 15
- Testimonials (Parallax/Infinite): `/images/slider1/3.png` … 7.png
- Zielgruppen / Coaching-Karten: `/images/Handwerker.png`, Bauunternehmen.png, Brückenbau.png, Renovierung.png
- Admin / Rubriken: `/images/Dienstleistungen/…`, `/images/Team/…`

---

## 3. `public/landing-previews/` – Builder-Vorschaubilder

Nur für den **Landingpage-Editor**: kleine Screenshots pro Sektionstyp, damit man im Modal sieht, wie die Sektion aussieht.

- **Standard-Vorlage:** `section-*.png` (z. B. section-hero.png, section-marquee.png, section-benefits.png, …)
- **Parallax-Vorlage:** `parallax-*.png` (parallax-hero.png, parallax-beratung.png, parallax-claim.png, parallax-words.png, parallax-stacked-sheets.png, parallax-images-slider.png, parallax-testimonials.png, parallax-quiz-cta.png, parallax-marquee.png)
- **Footer** (Parallax): nutzt aktuell `section-process.png` als Fallback

Zuordnung Sektion → Datei steht in **`types/landing-section.ts`**:  
`SECTION_PREVIEW_IMAGES` (Standard) und `SECTION_PREVIEW_IMAGES_PARALLAX` (Parallax).

---

## 4. Empfohlene Ordnung (optional)

Wenn du später aufräumen willst:

1. **`public/images/`** thematisch halten:
   - `hero/` – nur Hero-Hintergründe
   - `sliders/` – alle Slider-Bilder (slider1, slider2, trust zusammen oder Unterordner)
   - `sections/` – z. B. trust, parallax-cards, Landingpage-Coaching
   - `team/`, `dienstleistungen/`, `zielgruppen/` (oder `coaching/`) – wie jetzt, nur klarer benannt

2. **Landing-Previews** so lassen: ein Ordner `landing-previews/` mit klaren Namen (`parallax-beratung.png` etc.) reicht.

3. **Logos** in einen Ordner `public/logos/` legen und in der App alle Logo-Pfade darauf umstellen (dann findest du alle Logos an einem Ort).

Aktuell ist die Struktur schon nutzbar; die Tabelle oben sagt dir genau, wo was liegt und wofür es verwendet wird.
