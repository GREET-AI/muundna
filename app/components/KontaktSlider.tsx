'use client';

import PageHeroSlider from './ui/PageHeroSlider';
import { getRoute } from '../utils/routes';

const slides = [
  {
    headline: 'KONTAKT AUFNEHMEN',
    subtitle: 'Wir freuen uns auf Sie',
    description: 'Erreichen Sie uns per Telefon, E-Mail oder über unser Kontaktformular. Wir melden uns schnellstmöglich bei Ihnen.',
    image: '/images/Büro.png',
    href: '/kontakt',
    linkText: 'Zum Kontaktformular',
    secondaryHref: getRoute('Dienstleistungen'),
    secondaryText: 'Mehr erfahren',
  },
  {
    headline: 'JETZT UNVERBINDLICH ANFRAGEN',
    subtitle: 'Kostenlose Beratung',
    description: 'Lassen Sie uns gemeinsam die optimale Lösung für Ihr Unternehmen finden. Unverbindliches Beratungsgespräch – wir sind für Sie da.',
    image: '/images/Handwerker.png',
    href: '/kontakt',
    linkText: 'Anfrage stellen',
    secondaryHref: getRoute('Dienstleistungen'),
    secondaryText: 'Mehr erfahren',
  },
  {
    headline: 'BERATUNGSGESPRÄCH VEREINBAREN',
    subtitle: 'Persönlich oder digital',
    description: 'Wir beraten Sie gern zu unseren Bürodienstleistungen. Termin vereinbaren – per Telefon, E-Mail oder über das Kontaktformular.',
    image: '/images/Ingenieur.png',
    href: '/kontakt',
    linkText: 'Termin anfragen',
    secondaryHref: getRoute('Dienstleistungen'),
    secondaryText: 'Mehr erfahren',
  },
  {
    headline: 'WIR FREUEN UNS AUF IHRE NACHRICHT',
    subtitle: 'Deutschland, Schweiz, Österreich',
    description: 'Wir betreuen Handwerksbetriebe und Bauunternehmen in ganz DACH. Kontaktieren Sie uns – wir sind für Sie da.',
    image: '/images/Referenzen.png',
    href: '/kontakt',
    linkText: 'Kontakt aufnehmen',
    secondaryHref: getRoute('Dienstleistungen'),
    secondaryText: 'Mehr erfahren',
  },
];

export default function KontaktSlider() {
  return <PageHeroSlider slides={slides} />;
}
