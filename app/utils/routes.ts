// URL-freundliche Pfade aus Menü-Items generieren
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Route-Mapping für Navigation - Muckenfuss & Nagel
export const routes = {
  // Über uns
  'Über uns': '/ueber-uns',
  'Unternehmensgeschichte': '/ueber-uns/geschichte',
  'Standort': '/ueber-uns/standort',
  'Erfahrung & Kompetenz': '/ueber-uns/kompetenz',
  
  // Dienstleistungen
  'Dienstleistungen': '/dienstleistungen',
  'Telefonservice & Kommunikation': '/dienstleistungen/telefonservice',
  'Terminorganisation': '/dienstleistungen/terminorganisation',
  'Social Media Betreuung': '/dienstleistungen/social-media',
  'Google Bewertungen': '/dienstleistungen/google-bewertungen',
  'Dokumentation & Reporting': '/dienstleistungen/dokumentation',
  
  // Zielgruppen
  'Zielgruppen': '/zielgruppen',
  'Handwerksbetriebe': '/zielgruppen/handwerksbetriebe',
  'Bauunternehmen': '/zielgruppen/bauunternehmen',
  'Hoch- & Tiefbau': '/zielgruppen/hoch-tiefbau',
  'Straßen- & Brückenbau': '/zielgruppen/strassen-brueckenbau',
  'Sanierung & Renovierung': '/zielgruppen/sanierung',
  'Dachdecker & Zimmermänner': '/zielgruppen/dachdecker-zimmermaenner',
  
  // Referenzen
  'Referenzen': '/referenzen',
  
  // Kontakt
  'Kontakt': '/kontakt',
  'Anfrage': '/kontakt/anfrage',
  'Quiz': '/kontakt/quiz',
  
  // Rechtliches
  'Impressum': '/impressum',
  'Datenschutz': '/datenschutz',
  'Cookies': '/cookies',
};

export function getRoute(item: string): string {
  return routes[item as keyof typeof routes] || `/${slugify(item)}`;
}
