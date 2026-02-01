# Südbau Website

Eine vollständige Nachbildung der Südbau-Website, erstellt mit Next.js, TypeScript und Tailwind CSS.

## Features

- 🎨 Modernes, responsives Design
- 📱 Mobile-optimierte Navigation
- 🖼️ Hero-Slider mit automatischem Wechsel
- 🚀 Optimiert für Vercel Deployment
- ⚡ Schnelle Ladezeiten durch Next.js

## Technologien

- **Next.js 16** - React Framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS Framework
- **React 19** - UI Library

## Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die Website ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Deployment auf Vercel

1. Erstelle ein Konto auf [Vercel](https://vercel.com)
2. Verbinde dein GitHub Repository
3. Vercel erkennt automatisch Next.js und konfiguriert das Projekt
4. Klicke auf "Deploy"

Alternativ mit Vercel CLI:

```bash
# Vercel CLI installieren
npm i -g vercel

# Deployment starten
vercel
```

## Projektstruktur

```
jahnbau/
├── app/
│   ├── components/
│   │   ├── Header.tsx          # Navigation und Header
│   │   ├── HeroSlider.tsx      # Hero-Slider Komponente
│   │   ├── AboutSection.tsx    # Über uns Sektion
│   │   ├── ContentSection.tsx  # Content-Bereiche
│   │   └── Footer.tsx          # Footer Komponente
│   ├── layout.tsx              # Root Layout
│   ├── page.tsx                # Hauptseite
│   └── globals.css             # Globale Styles
├── public/
│   └── images/                 # Bilder für die Website
└── vercel.json                 # Vercel Konfiguration
```

## Bilder hinzufügen

Um die Hero-Slider Bilder zu verwenden, füge die folgenden Bilder in `public/images/` ein:

- `hero-1.jpg` - Betreutes Wohnen Oberderdingen
- `hero-2.jpg` - Gesundheitscampus Rechberg
- `hero-3.jpg` - Ärztehaus Bruchsal
- `hero-4.jpg` - Dienstleistungszentrum Bretten
- `hero-5.jpg` - Kindergarten Kraichgau Hüpfer

Die Website funktioniert auch ohne diese Bilder (zeigt Platzhalter).

## Anpassungen

### Farben anpassen

Die Farben können in den Komponenten-Dateien angepasst werden. Die Hauptfarben sind:
- Grau: `bg-gray-600`, `text-gray-800`
- Gelb: `bg-yellow-400` (für Highlight-Boxen)
- Weiß: `bg-white`

### Inhalte bearbeiten

Die Inhalte können direkt in den Komponenten-Dateien bearbeitet werden:
- Navigation: `app/components/Header.tsx`
- Slider-Inhalte: `app/components/HeroSlider.tsx`
- Footer: `app/components/Footer.tsx`

## License

Dieses Projekt ist eine Nachbildung der Südbau-Website für Lern- und Demonstrationszwecke.
