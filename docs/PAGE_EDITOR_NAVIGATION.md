# Page-Editor: Navigation & Toolbars – Übersicht

Diese Übersicht definiert, wie die Bearbeitung im Page-Editor funktioniert: welche Toolbar wann erscheint, was editierbar ist und was nicht.

---

## 1. Drei Ebenen der Auswahl

| Ebene | Aktion | Wo sichtbar | Toolbar erscheint |
|-------|--------|-------------|-------------------|
| **Sektion** | Klick auf Sektion (Canvas oder linke Sidebar-Preview) | Canvas: Rahmen um Sektion; Sidebar: hervorgehobenes Preview-Fenster | **Sektions-Toolbar** oben rechts auf der Sektion |
| **Element (Text)** | Klick auf Text (Headline, Untertitel, Button-Text, …) | Text wird markiert (Rahmen/Outline) | **Text-Toolbar** (Schriftgröße, Farbe, Fett, Kursiv, …) |
| **Element (Farbe/Fläche)** | Klick auf farbiges Element (Hintergrund, Badge, Button-Füllung, …) | Element wird markiert | **Farb-Toolbar** (Farbe ändern) |

Je nach ausgewähltem Objekt **muss** eine andere Toolbar mit anderen Buttons erscheinen.

---

## 2. Sektions-Toolbar (wenn Sektion ausgewählt)

**Position:** Oben rechts auf der ausgewählten Sektion (wie im Referenz-Screenshot).

**Buttons:**

| Button | Funktion |
|--------|----------|
| **Bearbeiten** | Öffnet Einstellungen für die **ganze Sektion**: z. B. Hintergrundbild, Slider-Bilder, Overlay-Farbe, Sektion-spezifische Optionen. Nicht für Texte – die bearbeitet man per Klick im Content. |
| **Hoch** | Sektion eine Position nach oben verschieben. |
| **Runter** | Sektion eine Position nach unten verschieben. |
| **Mülleimer** | Sektion löschen. |

**Nur bei Sektions-Auswahl sichtbar** – nicht bei Text- oder Farb-Auswahl.

---

## 3. Text-Toolbar (wenn Text-Element ausgewählt)

**Position:** Über oder neben dem ausgewählten Text (kontextabhängig).

**Optionen (wie Elementor/WordPress):**

- Schriftgröße
- Schriftfarbe
- Fett, Kursiv, Unterstrichen
- Optional: Schriftart, Zeilenabstand

**Bearbeitung:** Direkt im Screen tippen (Inline-Edit), Werte in der Toolbar anpassen.

**Welche Texte sind editierbar?**

- Alle Headlines (Hero, Sektionen, Karten)
- Alle Untertitel / Beschreibungstexte
- Button-Texte
- Tabellen- oder Listen-Texte, sofern als „text“-Prop hinterlegt

**Welche Texte sind NICHT editierbar?**

- System-Texte (z. B. „4.9“, „100+ REVIEWS“ wenn sie fest im Layout sind und keine Props haben)
- Platzhalter, die wir explizit als `editable: false` markieren (siehe Datenmodell unten)

---

## 4. Farb-Toolbar (wenn farbiges Element ausgewählt)

**Position:** Neben dem ausgewählten Element (z. B. Button, Badge, Hintergrundfläche).

**Option:** Nur **Farbe** (Farbwähler / Hex).

**Welche farbigen Elemente sind editierbar?**

- Hero-Overlay-Farbe
- Button-Hintergrund (wenn als Prop abgebildet)
- Badge-/Nummer-Farben (z. B. Prozess-Badges)
- Marquee-Hintergrund / -Textfarbe
- Sektions-Hintergrundfarben, sofern als Prop vorhanden

**Welche sind NICHT editierbar?**

- Farben, die nur aus dem Theme (Primary/Secondary) kommen und nicht pro Element überschrieben werden
- Dekorative Elemente, die wir als `editable: false` markieren (z. B. feste Icon-Farben)

---

## 5. Elemente fest als „nicht editierbar“ markieren

Damit der User nicht alles ändern kann, brauchen wir eine klare Definition:

**Im Datenmodell (z. B. pro Sektionstyp / Prop):**

- Jede **Prop** ist entweder **editierbar** (Text, Farbe, Bild, …) oder **nicht editierbar**.
- Zusätzlich können wir pro **Sektionstyp** Listen definieren:
  - `editableTextProps`: [ 'headline', 'sectionTitle', … ]  
  - `editableColorProps`: [ 'overlayColor', 'buttonPrimaryColor', … ]  
  - `nonEditableProps`: [ … ] – werden im Editor nicht angeboten und nicht klickbar gemacht.

**Im UI:**

- Nur Elemente, die zu einer **editierbaren Prop** gehören, bekommen:
  - Klick-Handler
  - Outline bei Hover
  - Toolbar bei Klick
- Alles andere ist „nur Anzeige“ (kein Klick, keine Toolbar).

**Beispiel Nicht-editierbar:**

- Fester Trust-Badge-Text (wenn kein Prop)
- Vordefinierte Icons (Emoji/Icon-Name), sofern wir sie nicht als Prop freigeben
- Layout-Größen (z. B. feste Abstände), die wir nicht als „Spacing“-Prop anbieten

---

## 6. Linke Sidebar – Sektionen als Preview-Fenster

- **Darstellung:** Jede Sektion = ein **Preview-Fenster** (Bild), untereinander.
- **Bilder:** Wie im bisherigen Menü – Preview-Bilder aus `SECTION_PREVIEW_IMAGES` / `SECTION_PREVIEW_IMAGES_PARALLAX` (oder Mini-Render der Sektion).
- **Klick auf Preview:** Sektion wird ausgewählt (Canvas springt zu Sektion, Sektions-Toolbar erscheint).
- **Neue Sektion:** Kein Button „Sektion hinzufügen“, sondern **ein klickbares „+“-Fenster** (oder ein leeres Fenster) – Klick öffnet Auswahl der Sektionstypen bzw. fügt eine vordefinierte Sektion hinzu.

---

## 7. Rechts: Kein festes Sidebar-Panel für Text

- **Gewünscht:** Texte **direkt im Screen** bearbeiten (wie Elementor/Hostinger), nicht in einer rechten Sidebar.
- **Umsetzung:**  
  - Klick auf Text → Text-Toolbar erscheint.  
  - Inhalt: Inline-Edit (contentEditable oder Overlay-Input).  
  - Formatierung: nur über die **Toolbar** (Größe, Farbe, Fett, Kursiv).  
- Ein **rechtes Panel** nur dann, wenn wir es explizit für „Sektion bearbeiten“ (Hintergrund, Slider-Bilder) nutzen – also nach Klick auf **Bearbeiten** in der Sektions-Toolbar.

---

## 8. Kurz: Ablauf für den User

1. **Sektion wählen:** Klick auf Sektion im Canvas oder auf Preview in der linken Sidebar → Sektions-Toolbar (Bearbeiten, Hoch, Runter, Mülleimer).
2. **Sektion anpassen:** „Bearbeiten“ → Panel/Modal für Hintergrund, Slider-Bilder, Sektion-Optionen.
3. **Text anpassen:** Klick auf Text im Content → Text-Toolbar, direkt auf der Seite tippen + Formatierung in der Toolbar.
4. **Farbe anpassen:** Klick auf farbiges Element → Farb-Toolbar, Farbe wählen.
5. **Nicht editierbare Elemente:** Kein Klick-Handler, keine Toolbar – bleiben unverändert.

---

## 9. Technische Zuordnung (für Implementierung)

- **Sektion** → `selectedSectionIndex` → Sektions-Toolbar.
- **Text-Element** → `selectedElement = { sectionIndex, propKey }` mit `propKey` aus `editableTextProps` → Text-Toolbar + Inline-Edit.
- **Farb-Element** → `selectedElement` mit `propKey` aus `editableColorProps` → Farb-Toolbar.
- **Nicht editierbar** → Props in `nonEditableProps` oder nicht in `editableTextProps`/`editableColorProps` → kein Handler, keine Toolbar.

Diese Übersicht kann als Spezifikation für den weiteren Ausbau des Page-Editors (Inline-Text, dynamische Toolbars, Sperrung nicht editierbarer Elemente) verwendet werden.
