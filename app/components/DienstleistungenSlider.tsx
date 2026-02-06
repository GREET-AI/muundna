'use client';

import PageHeroSlider from './ui/PageHeroSlider';
import { getRoute } from '../utils/routes';

const slides = [
  {
    headline: 'TELEFONSERVICE & KOMMUNIKATION',
    subtitle: 'Professionelle Kundenbetreuung',
    description: 'Wir übernehmen Anrufe, beantworten Fragen und leiten wichtige Informationen weiter. Professionelle Kundenansprache, Terminvereinbarungen und 24/7 Verfügbarkeit möglich.',
    image: '/images/Dienstleistungen/Telefonieren.jpeg',
    href: '/dienstleistungen/telefonservice',
    linkText: 'Mehr erfahren',
    secondaryHref: getRoute('Quiz'),
    secondaryText: 'Jetzt Anfragen',
  },
  {
    headline: 'TERMINORGANISATION',
    subtitle: 'Effiziente Planung',
    description: 'Wir koordinieren Ihren Kalender und sorgen für optimale Terminverteilung. Kalenderverwaltung, Erinnerungsservice und monatliche Übersichten.',
    image: '/images/Dienstleistungen/Termenirung.jpeg',
    href: '/dienstleistungen/terminorganisation',
    linkText: 'Mehr erfahren',
    secondaryHref: getRoute('Quiz'),
    secondaryText: 'Jetzt Anfragen',
  },
  {
    headline: 'SOCIAL MEDIA BETREUUNG',
    subtitle: 'Online-Präsenz stärken',
    description: 'Professionelle Betreuung Ihrer Social Media Kanäle. Content-Erstellung, Posting & Scheduling, Community Management und Markenaufbau.',
    image: '/images/Dienstleistungen/SocialMedia.jpeg',
    href: '/dienstleistungen/social-media',
    linkText: 'Mehr erfahren',
    secondaryHref: getRoute('Quiz'),
    secondaryText: 'Jetzt Anfragen',
  },
  {
    headline: 'GOOGLE BEWERTUNGEN',
    subtitle: 'Ihr Online-Image',
    description: 'Optimierung und Betreuung Ihrer Google Bewertungen. Bewertungsmanagement, Kundenanfragen für Bewertungen und strategische Optimierung.',
    image: '/images/Dienstleistungen/GoogleBewertungen.jpeg',
    href: '/dienstleistungen/google-bewertungen',
    linkText: 'Mehr erfahren',
    secondaryHref: getRoute('Quiz'),
    secondaryText: 'Jetzt Anfragen',
  },
  {
    headline: 'DOKUMENTATION & REPORTING',
    subtitle: 'Transparenz und Überblick',
    description: 'Klare Dokumentation mit monatlichem Überblick. Monatliche Reports, Aktivitätsdokumentation, KPI-Tracking und individuelle Auswertungen.',
    image: '/images/Dienstleistungen/Raport.jpeg',
    href: '/dienstleistungen/dokumentation',
    linkText: 'Mehr erfahren',
    secondaryHref: getRoute('Quiz'),
    secondaryText: 'Jetzt Anfragen',
  },
  {
    headline: 'WEBDESIGN & APP LÖSUNGEN',
    subtitle: 'Digitale Präsenz',
    description: 'Professionelle Websites und maßgeschneiderte App-Lösungen für Ihr Unternehmen. Moderne, responsive Designs die Kunden überzeugen.',
    image: '/images/Dienstleistungen/SocialMedia.jpeg',
    href: '/dienstleistungen/webdesign-app',
    linkText: 'Mehr erfahren',
    secondaryHref: getRoute('Quiz'),
    secondaryText: 'Jetzt Anfragen',
  },
];

export default function DienstleistungenSlider() {
  return <PageHeroSlider slides={slides} />;
}
