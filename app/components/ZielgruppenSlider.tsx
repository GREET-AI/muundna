'use client';

import PageHeroSlider from './ui/PageHeroSlider';
import { getRoute } from '../utils/routes';

const slides = [
  {
    headline: 'HANDWERKSBETRIEBE',
    subtitle: 'Ihre Branche im Fokus',
    description: 'Professionelle Bürodienstleistungen speziell für Handwerksbetriebe. Wir übernehmen Ihre Büroarbeit, damit Sie sich voll auf Ihr Handwerk konzentrieren können.',
    image: '/images/Handwerker.png',
    href: '/zielgruppen/handwerksbetriebe',
    linkText: 'Mehr erfahren',
    secondaryHref: getRoute('Quiz'),
    secondaryText: 'Jetzt Anfragen',
  },
  {
    headline: 'BAUUNTERNEHMEN',
    subtitle: 'Effiziente Lösungen',
    description: 'Komplette Bürodienstleistungen für Bauunternehmen. Von Telefonservice bis Social Media – wir unterstützen Sie bei allen administrativen Aufgaben.',
    image: '/images/Bauunternehmen.png',
    href: '/zielgruppen/bauunternehmen',
    linkText: 'Mehr erfahren',
    secondaryHref: getRoute('Quiz'),
    secondaryText: 'Jetzt Anfragen',
  },
  {
    headline: 'STRASSEN- & BRÜCKENBAU',
    subtitle: 'Bürodienstleistungen für Infrastruktur',
    description: 'Wir unterstützen Straßen- und Brückenbauunternehmen bei allen administrativen Aufgaben. Terminorganisation, Kommunikation und Dokumentation.',
    image: '/images/Brückenbau.png',
    href: '/zielgruppen/strassen-brueckenbau',
    linkText: 'Mehr erfahren',
    secondaryHref: getRoute('Quiz'),
    secondaryText: 'Jetzt Anfragen',
  },
  {
    headline: 'SANIERUNG & RENOVIERUNG',
    subtitle: 'Unterstützung für Ihr Team',
    description: 'Professionelle Unterstützung für Sanierungs- und Renovierungsbetriebe. Effiziente Terminorganisation und Kundenkommunikation für Ihren Erfolg.',
    image: '/images/Renovierung.png',
    href: '/zielgruppen/sanierung',
    linkText: 'Mehr erfahren',
    secondaryHref: getRoute('Quiz'),
    secondaryText: 'Jetzt Anfragen',
  },
  {
    headline: 'DACHDECKER & ZIMMERLEUTE',
    subtitle: 'Professionelle Betreuung',
    description: 'Professionelle Bürodienstleistungen für Dachdecker und Zimmerleute. Wir übernehmen die Büroarbeit – Sie konzentrieren sich auf Ihr Handwerk.',
    image: '/images/Dachdecker.png',
    href: '/zielgruppen/dachdecker-zimmerleute',
    linkText: 'Mehr erfahren',
    secondaryHref: getRoute('Quiz'),
    secondaryText: 'Jetzt Anfragen',
  },
];

export default function ZielgruppenSlider() {
  return <PageHeroSlider slides={slides} />;
}
