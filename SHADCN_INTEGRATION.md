# shadcn/ui Integration – sicher, ohne Logik zu ändern

## Garantie: Nichts geht kaputt

- **Scraping** (Gelbe Seiten, 11880): `app/actions/scrape-*.ts`, `app/api/admin/scrape-*`, `lib/scrape-*` – **werden nicht geändert**.
- **Lead-/Kontakt-Logik**: `app/api/admin/contacts/`, `app/api/admin/import-scraped-leads/`, alle States und Handler in `app/admin/page.tsx` – **bleiben unverändert** (nur Darstellung/UI-Komponenten können getauscht werden).
- **Supabase**: `lib/supabase*.ts`, Migrationen – **unberührt**.
- **Rechtsklick-Kontextmenü**: Verhalten (Löschen, Bearbeiten, Notizen) bleibt; nur die **Darstellung** kann auf shadcn-Komponenten umgestellt werden.

## Vorgehen

1. **shadcn nur als neues UI-Layer** – neue Komponenten in `components/ui/` (oder Unterordner), bestehende Logik bleibt.
2. **Schrittweise ersetzen** – z. B. zuerst Buttons/Dialoge, dann Tabellen-Styling. Jeder Schritt ist testbar; Scraping und Leads weiter nutzbar.
3. **Rollback** – falls etwas nicht passt: neue shadcn-Komponenten einfach nicht mehr verwenden, alte Klassen/JSX wieder nutzen. Keine Änderung an API oder Actions nötig.

## Was wir anpassen (nur Optik / Komponenten)

- Buttons, Dialoge, Dropdowns (z. B. Kontextmenü) können schrittweise durch shadcn-Varianten ersetzt werden.
- Tabellen- und Karten-Styling kann an shadcn angeglichen werden.
- Eure Farben (`--primary: #cb530a`, etc.) bleiben in `globals.css` und werden in shadcn genutzt.

## Was wir nicht anfassen

- Keine Änderungen in: `app/actions/`, `app/api/admin/` (Routes), `lib/` (supabase, scrape, normalize-phone), `types/`.
- Keine Änderung an Datenmodell, API-Contracts oder Scraper-Ablauf.

Nach diesem Plan bleibt alles, was jetzt funktioniert (Scraping, Leads, Kontakte, Kunden, Anzeige), erhalten; nur die Oberfläche wird schrittweise modernisiert.

---

## Erledigt (erster Schritt)

- **shadcn (Canary) initialisiert** – Tailwind v4, `app/globals.css` um shadcn-Variablen ergänzt.
- **Eure Corporate-Farben** (`--primary: #cb530a`, `--secondary: #182c30`) in `:root` wiederhergestellt und von shadcn genutzt.
- **Button-Komponente** hinzugefügt: `app/components/ui/button.tsx`.
- **Kontextmenü (Rechtsklick)** nutzt jetzt shadcn-Buttons (Löschen, Bearbeiten, Notizen) – gleiche Logik, nur anderes UI.
- **Keine Änderung** an: `app/actions/`, `app/api/` (Logik), `lib/`, Scraping, Lead-Import.

Weitere shadcn-Komponenten jederzeit mit `npx shadcn@canary add <name>` nachrüstbar; sie landen in `app/components/ui/`.

---

## Umstyling Admin (erledigt)

- **Dialog**: Notizen-Modal, Bearbeiten-Modal und Scraper-fertig-Popup nutzen shadcn Dialog (DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription).
- **Input, Label, Textarea**: Login-Passwort, Suchfeld, Bearbeiten-Formular und Notizen-Textarea nutzen shadcn Input/Label/Textarea.
- **Button**: Kontextmenü, Dialog-Footer, Login, Aktualisieren, Pipeline/Tabelle-Toggle, Scraper-OK.
- **Card**: Filter-/Suchbereich, KPI-Boxen (Neu/Kontaktiert/In Bearbeitung/Abgeschlossen), Lead-Tabelle (Tabelle in Card).
- **Table**: Lead-/Kontakt-Tabelle nutzt shadcn Table (TableHeader, TableBody, TableRow, TableHead, TableCell).
- **Logik unverändert**: Scraping, APIs, Rechtsklick-Aktionen, loadContacts, updateNotes, updateContact usw. bleiben gleich.
