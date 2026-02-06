'use client';

import PageHeroSlider from './ui/PageHeroSlider';
import { getRoute } from '../utils/routes';

const slides = [
  {
    headline: 'REFERENZ – UNSERE KUNDEN VERTRAUEN UNS',
    subtitle: 'Referenz 1',
    description: 'Professionelle Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen. Telefonservice, Terminorganisation und mehr.',
    image: '/images/trust/13.png',
    href: getRoute('Quiz'),
    linkText: 'Jetzt anfragen',
    secondaryHref: getRoute('Dienstleistungen'),
    secondaryText: 'Mehr erfahren',
  },
  {
    headline: 'REFERENZ – ERFOLGREICHE ZUSAMMENARBEIT',
    subtitle: 'Referenz 2',
    description: 'Zuverlässige Betreuung und maßgeschneiderte Lösungen für Ihre Branche. Überregionale Betreuung in D-A-CH.',
    image: '/images/trust/14.png',
    href: getRoute('Quiz'),
    linkText: 'Jetzt anfragen',
    secondaryHref: getRoute('Dienstleistungen'),
    secondaryText: 'Mehr erfahren',
  },
  {
    headline: 'REFERENZ – PARTNER FÜR BÜRODIENSTLEISTUNGEN',
    subtitle: 'Referenz 3',
    description: 'Wir übernehmen Ihre Büroarbeit – Sie konzentrieren sich auf Ihr Kerngeschäft. Jetzt unverbindlich anfragen.',
    image: '/images/trust/15.png',
    href: getRoute('Quiz'),
    linkText: 'Jetzt anfragen',
    secondaryHref: getRoute('Dienstleistungen'),
    secondaryText: 'Mehr erfahren',
  },
];

export default function ReferenzenSlider() {
  return <PageHeroSlider slides={slides} />;
}
