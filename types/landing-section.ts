/**
 * Landingpage-Builder: nur die 11 Sektionen + Footer der Mainpage, 1:1 wie auf der Website.
 * Für Online-Coaching / Videokurs-Landingpage (Inhalt später auf Use-Case umschreiben).
 */
export type LandingSectionType =
  | 'website_jeton_hero'      // 1. Hero (Startseite)
  | 'website_marquee'         // 2. Laufendes Banner (Text links→rechts)
  | 'website_target_groups'   // 3. Für wen ist dieses Coaching – Zielgruppen-Cards
  | 'website_testimonials'    // 4. Das sagen unsere Kunden
  | 'website_quiz_cta'        // 5. Quiz-Opt-in (+ Link zum Quiz)
  | 'website_services'        // 6. Was dir unser Coaching ermöglicht (ehem. Dienstleistungen)
  | 'website_benefits'        // 7. Benefits – Davon profitieren Sie
  | 'website_pricing'         // 8. Unser Angebot – CTA Kauf Coaching
  | 'website_trust'           // 9. Zufriedenheitsgarantie
  | 'website_process'         // 10. So funktioniert das Coaching
  | 'website_faq'             // 11. FAQ
  | 'website_footer';         // 12. Footer

export type LandingSection = {
  id: string;
  type: LandingSectionType;
  props: Record<string, unknown>;
};

export const LANDING_ELEMENT_DEFINITIONS: Record<
  LandingSectionType,
  { label: string; description: string; defaultProps: Record<string, unknown> }
> = {
  website_jeton_hero: {
    label: 'Hero',
    description: 'Vollbreiter Hero: Handwerker-Bild, Headline, „Mehr erfahren“ + „Jetzt Anfragen“',
    defaultProps: { headline: '', ctaText: 'Jetzt Anfragen', ctaHref: '/kontakt', secondaryCtaText: 'Mehr erfahren', secondaryCtaHref: '/dienstleistungen' },
  },
  website_marquee: {
    label: 'Laufendes Banner',
    description: 'Banner mit Text, der von links nach rechts läuft',
    defaultProps: {},
  },
  website_target_groups: {
    label: 'Für wen ist dieses Coaching',
    description: 'Zielgruppen-Cards (für Coaching-Zielgruppen anpassbar)',
    defaultProps: {},
  },
  website_testimonials: {
    label: 'Das sagen unsere Kunden',
    description: 'Kundenstimmen-Slider (Inhalt auf Coaching umschreiben)',
    defaultProps: {},
  },
  website_quiz_cta: {
    label: 'Quiz-Opt-in + Quiz',
    description: 'Expertise erhalten – 4 Fragen, maßgeschneidertes Angebot (Link zum Quiz)',
    defaultProps: {},
  },
  website_services: {
    label: 'Was dir unser Coaching ermöglicht',
    description: 'Cards mit Mehrwert (auf Coaching umschreiben)',
    defaultProps: {},
  },
  website_benefits: {
    label: 'Benefits',
    description: '„Davon profitieren Sie“ – 6 Vorteile in Karten',
    defaultProps: {},
  },
  website_pricing: {
    label: 'Unser Angebot (CTA Kauf)',
    description: 'Pakete / Preise – CTA für den Kauf des Coachings',
    defaultProps: {},
  },
  website_trust: {
    label: 'Zufriedenheitsgarantie',
    description: 'Garantie + Unverbindliche Beratung',
    defaultProps: {},
  },
  website_process: {
    label: 'So funktioniert das Coaching',
    description: '4 Schritte – Ablauf (auf Coaching umschreiben)',
    defaultProps: {},
  },
  website_faq: {
    label: 'FAQ',
    description: 'Häufige Fragen – Accordion',
    defaultProps: {},
  },
  website_footer: {
    label: 'Footer',
    description: 'Footer mit Links (Impressum, Datenschutz, etc.)',
    defaultProps: {},
  },
};

/** Screenshot-Pfade für Sektions-Vorschau (public/landing-previews/) – 11 echte Screenshots, Footer ohne Bild */
export const SECTION_PREVIEW_IMAGES: Partial<Record<LandingSectionType, string>> = {
  website_jeton_hero: '/landing-previews/section-hero.png',
  website_marquee: '/landing-previews/section-marquee.png',
  website_target_groups: '/landing-previews/section-target-groups.png',
  website_testimonials: '/landing-previews/section-testimonials.png',
  website_quiz_cta: '/landing-previews/section-quiz-cta.png',
  website_services: '/landing-previews/section-services.png',
  website_benefits: '/landing-previews/section-benefits.png',
  website_pricing: '/landing-previews/section-pricing.png',
  website_trust: '/landing-previews/section-trust.png',
  website_process: '/landing-previews/section-process.png',
  website_faq: '/landing-previews/section-faq.png',
};
