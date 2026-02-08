# Parallax-Editor: Vorschaubilder in der linken Pipeline

## Wo die Bilder liegen

**Dateisystem (im Projekt):**
```
public/landing-previews/
```

**Im Code/Browser (URL-Pfad):**
```
/landing-previews/<dateiname>.png
```
→ Next.js liefert alles aus `public/` unter der Root-URL.

---

## Reihenfolge in der linken Leiste (Parallax-Vorlage)

Die Liste kommt aus `SECTION_TYPES_BY_TEMPLATE.parallax` in **types/landing-section.ts**.  
Welches Bild zu welcher Karte gehört, steht in **SECTION_PREVIEW_IMAGES_PARALLAX** (ebenfalls types/landing-section.ts).

| # | Sektion (Name in der linken Pipeline) | Datei (unter `public/landing-previews/`) | URL |
|---|--------------------------------------|------------------------------------------|-----|
| 1 | Parallax Hero | `parallax-hero.png` | `/landing-previews/parallax-hero.png` |
| 2 | Parallax Marquee | `parallax-marquee.png` | `/landing-previews/parallax-marquee.png` |
| 3 | Parallax Testimonials | `parallax-testimonials.png` | `/landing-previews/parallax-testimonials.png` |
| 4 | Parallax Quiz CTA | `parallax-quiz-cta.png` | `/landing-previews/parallax-quiz-cta.png` |
| 5 | **Parallax Beratung** | **`parallax-beratung.png`** | `/landing-previews/parallax-beratung.png` |
| 6 | **Parallax Claim** | **`parallax-claim.png`** | `/landing-previews/parallax-claim.png` |
| 7 | **Parallax Wörter** | **`parallax-words.png`** | `/landing-previews/parallax-words.png` |
| 8 | **Parallax Gestapelte Blätter** | **`parallax-stacked-sheets.png`** | `/landing-previews/parallax-stacked-sheets.png` |
| 9 | Parallax Bild-Slider | `parallax-images-slider.png` | `/landing-previews/parallax-images-slider.png` |
| 10 | Parallax Footer | `section-faq.png` | `/landing-previews/section-faq.png` |

---

## So änderst du ein Vorschaubild

- Bild für **„Parallax Beratung”** anpassen → Datei ersetzen: **`public/landing-previews/parallax-beratung.png`**
- Bild für **„Parallax Claim”** → **`public/landing-previews/parallax-claim.png`**
- Bild für **„Parallax Wörter”** → **`public/landing-previews/parallax-words.png`**
- Bild für **„Parallax Gestapelte Blätter”** → **`public/landing-previews/parallax-stacked-sheets.png`**

Die Zuordnung Sektion ↔ Dateiname steht **nur** in **types/landing-section.ts** (Objekt `SECTION_PREVIEW_IMAGES_PARALLAX`). Es werden keine anderen Ordner oder Dateien für diese linke Pipeline verwendet.

---

## Warum die Vorschaubilder im Frontend falsch sein konnten

- **Next.js `<Image>`** optimiert und cached Bilder. Dadurch konnte dieselbe gecachte Version für verschiedene URLs geladen werden.
- **Fix:** In der linken Pipeline wird jetzt ein **natives `<img>`** mit **`key={src}`** verwendet. Jede URL wird direkt geladen, ohne Next-Image-Cache; React rendert pro URL genau ein Bild.
- **Footer:** Der Footer zeigte vorher `section-process.png` (Prozess-Sektion), das oft wie der Bild-Slider aussieht. Er zeigt jetzt `section-faq.png` (FAQ-Ansicht, wirkt eher wie Footer/Text).
