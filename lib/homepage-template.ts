/**
 * Standard-Homepage-Vorlage: Aufbau wie aktuelle Startseite (/),
 * Inhalte neutral (Platzhalter). Wird für page_templates und erste pages genutzt.
 * Schema: { title: string, components: { id, type, props }[] } – identisch zu Landing.
 */

import type { LandingSection } from '@/types/landing-section';

export type HomepageJson = {
  title: string;
  components: LandingSection[];
};

const STANDARD_HOMEPAGE: HomepageJson = {
  title: 'Startseite',
  components: [
    {
      id: 'hero-1',
      type: 'website_jeton_hero',
      props: {
        headline: 'Ihre Überschrift.',
        headlineLine2: 'Ihr Angebot. Unsere Expertise.',
        ctaText: 'Jetzt Anfragen',
        ctaHref: '/kontakt',
        secondaryCtaText: 'Mehr erfahren',
        secondaryCtaHref: '#leistungen',
        backgroundImageUrl: '/images/slider2/1.png',
        overlayColor: '#cb530a',
        logoUrl: '',
      },
    },
    {
      id: 'marquee-1',
      type: 'website_marquee',
      props: {
        text: 'Lorem ipsum – Ihr Slogan oder Key Message hier.',
        backgroundColor: '#cb530a',
        textColor: '#ffffff',
      },
    },
    {
      id: 'target-1',
      type: 'website_target_groups',
      props: {
        sectionTitle: 'Für wen ist das Angebot?',
        sectionSubtitle: 'Kurze Beschreibung Ihrer Zielgruppen.',
        targetGroups: [
          { title: 'Zielgruppe 1', description: 'Lorem ipsum Beschreibung.', icon: '🚀', href: '#', image: '/images/slider2/1.png', imageSlogan: 'Zielgruppe 1' },
          { title: 'Zielgruppe 2', description: 'Lorem ipsum Beschreibung.', icon: '🏡', href: '#', image: '/images/slider2/2.png', imageSlogan: 'Zielgruppe 2' },
        ],
      },
    },
    {
      id: 'testimonials-1',
      type: 'website_testimonials',
      props: {
        sectionTitle: 'Das sagen unsere Kunden',
        sectionSubtitle: 'Echte Stimmen – Platzhalter ersetzen.',
        backgroundSliderImages: ['/images/trust/13.png', '/images/trust/14.png'],
      },
    },
    {
      id: 'quiz-cta-1',
      type: 'website_quiz_cta',
      props: {
        title: 'Kostenlose Beratung',
        subtitle: 'Kurze Fragen – maßgeschneidertes Angebot.',
        buttonText: 'Jetzt starten →',
      },
    },
    {
      id: 'services-1',
      type: 'website_services',
      props: {
        sectionTitle: 'Unsere Leistungen',
        sectionSubtitle: 'Was wir für Sie tun – Platzhalter anpassen.',
        services: [
          { title: 'Leistung 1', description: 'Lorem ipsum.', icon: '🔑', href: '#', image: '/images/Dienstleistungen/Telefonieren.jpeg', imageSlogan: 'Leistung 1', buttonText: 'Mehr' },
          { title: 'Leistung 2', description: 'Lorem ipsum.', icon: '📋', href: '#', image: '/images/Dienstleistungen/Termenirung.jpeg', imageSlogan: 'Leistung 2', buttonText: 'Mehr' },
        ],
      },
    },
    {
      id: 'benefits-1',
      type: 'website_benefits',
      props: {
        sectionTitle: 'Ihre Vorteile',
        sectionSubtitle: 'Davon profitieren Sie.',
        benefits: [
          { icon: 'CheckCircle2', iconColor: '#cb530a', title: 'Vorteil 1', description: 'Kurze Beschreibung.' },
          { icon: 'Zap', iconColor: '#cb530a', title: 'Vorteil 2', description: 'Kurze Beschreibung.' },
        ],
      },
    },
    {
      id: 'pricing-1',
      type: 'website_pricing',
      props: {
        sectionTitle: 'Angebot',
        sectionSubtitle: 'Preise und Pakete – Platzhalter.',
        pricingCards: [
          { title: 'Paket 1', description: 'Beschreibung', price: 'auf Anfrage', recommendation: '', bulletPoints: [], buttonText: 'Anfragen', popular: false },
        ],
      },
    },
    {
      id: 'trust-1',
      type: 'website_trust',
      props: {
        sealText: 'GARANTIE',
        sectionTitle: 'Ihre Sicherheit',
        bodyHtml: 'Lorem ipsum – Vertrauen und Garantie.',
        buttonText: 'Jetzt anfragen',
      },
    },
    {
      id: 'process-1',
      type: 'website_process',
      props: {
        sectionTitle: 'So funktioniert es',
        sectionSubtitle: 'Schritte in Kürze.',
        processSteps: [
          { number: '1', title: 'Schritt 1', description: 'Lorem.', ctaText: '', href: '' },
          { number: '2', title: 'Schritt 2', description: 'Lorem.', ctaText: '', href: '' },
          { number: '3', title: 'Schritt 3', description: 'Lorem.', ctaText: '', href: '' },
          { number: '4', title: 'Loslegen', description: 'Lorem.', ctaText: 'Anfragen', href: '/kontakt' },
        ],
      },
    },
    {
      id: 'faq-1',
      type: 'website_faq',
      props: {
        sectionTitle: 'Häufige Fragen',
        sectionSubtitle: 'Antworten auf die wichtigsten Fragen.',
        faqs: [
          { question: 'Frage 1?', answer: 'Antwort 1.' },
          { question: 'Frage 2?', answer: 'Antwort 2.' },
        ],
      },
    },
    {
      id: 'footer-1',
      type: 'website_footer',
      props: {
        copyrightText: '© Alle Rechte vorbehalten.',
        sublineText: 'Impressum · Datenschutz',
      },
    },
  ],
};

export function getStandardHomepageJson(): HomepageJson {
  return JSON.parse(JSON.stringify(STANDARD_HOMEPAGE));
}
