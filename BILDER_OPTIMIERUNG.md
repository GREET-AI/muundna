# Bilddateien & Optimierung

## Aktuelle Hero-Bilder (public/images/)

Die Hero- und Slider-Bilder nutzen beschriftete Dateien in `public/images/`:

| Datei | Verwendung (Beispiele) |
|-------|-------------------------|
| Handwerker.png | HeroSlider (Bürodienstleistungen), ZielgruppenSlider, ReferenzenSlider, KontaktSlider, TargetGroupsSection, Handwerksbetriebe |
| Handwerker (2).png | (optional, Alternative) |
| Bauunternehmen.png | HeroSlider, ZielgruppenSlider, ReferenzenSlider, TargetGroupsSection, Bauunternehmen |
| Brückenbau.png | ZielgruppenSlider (Straßen- & Brückenbau), strassen-brueckenbau |
| Büro.png | HeroSlider, KontaktSlider, HeroSection-Fallback, Cookies, Datenschutz, Kontakt/Anfrage |
| Dachdecker.png | ZielgruppenSlider, ReferenzenSlider, dachdecker-zimmerleute |
| Ingenieur.png | HeroSlider (10+ Jahre), KontaktSlider, hoch-tiefbau |
| Referenzen.png | HeroSlider (DACH), KontaktSlider, Impressum |
| Renovierung.png | ZielgruppenSlider, ReferenzenSlider, TargetGroupsSection, sanierung |
| Zimmermann.png | (optional) |
| 10.png | (optional, allgemein) |
| Team/ | team.png, office1.jpeg, office 2.jpeg – Über-uns, UeberUnsSlider |
| Dienstleistungen/ | Telefonieren, Termenirung, SocialMedia, GoogleBewertungen, Raport – Dienstleistungs-Seiten |

---

## Verhalten Vercel / Next.js

- **Vercel komprimiert Ihre Quell-Assets nicht.** Die Dateien in `public/` werden so deployed, wie sie im Repo sind.
- **`next/image`** (Image-Komponente) optimiert **beim Ausliefern**: z. B. WebP/AVIF, responsive Größen. Das reduziert die **übertragene** Datenmenge pro Request, aber **nicht** die Größe der Dateien im Repo oder das Deployment-Volumen.
- Große PNGs in `public/` vergrößern also: **Repo-Größe, Clone-Zeit, Build/Deploy-Zeit und Speicher auf Vercel.**

---

## Empfehlung: Bilder austauschen / komprimieren

1. **Lokal komprimieren oder durch kleinere ersetzen**
   - **WebP:** Gleiche Auflösung, oft 70–90 % kleiner als PNG.  
     z. B. mit [Squoosh](https://squoosh.app/) oder Sharp – z. B. `Handwerker.png` → `Handwerker.webp`.
   - **PNG komprimieren:** z. B. mit [TinyPNG](https://tinypng.com/) oder `pngquant` / `optipng` – oft 50–70 % Ersparnis ohne sichtbaren Qualitätsverlust.
   - **Auflösung reduzieren:** Hero-Hintergründe müssen nicht in 4K vorliegen. z. B. max. 1920px Breite reicht für die meisten Displays.

2. **Im Projekt ersetzen**
   - Neue Dateien (z. B. `.webp`) in `public/images/` legen und in den betroffenen Seiten/Komponenten den Pfad anpassen.
   - Alte, nicht mehr referenzierte Dateien aus `public/images/` entfernen.

3. **Git & Vercel**
   - Nach dem Ersetzen: Commit + Push.  
   - Alte große Dateien bleiben in der Git-Historie, aber neue Builds und Clones nutzen nur noch die kleineren Assets.

**Kurz:** Vercel liefert Bilder nur aus; sie werden nicht automatisch komprimiert oder ersetzt. Für weniger Repo- und Deploy-Größe die großen PNGs lokal komprimieren oder durch WebP ersetzen und die Referenzen im Code anpassen.
