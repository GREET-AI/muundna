/**
 * Landingpage-Builder: zwei getrennte Vorlagen – keine Mischung.
 * standard = klassische Sektionen; parallax = Parallax-Vorlage (Scroll-Effekte).
 */
export type LandingTemplate = 'standard' | 'parallax';

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
  | 'website_footer'          // 12. Footer
  // Template „ImmoSparplan“ (zweite Option)
  | 'website_testimonials_infinite'  // Kundenstimmen mit Slider-Hintergrund
  | 'website_beratung'               // Prozess + Stats (Beratung Composite)
  | 'website_claim_parallax'         // Parallax fliegende Cards
  | 'website_words_parallax'         // Parallax Wörter (Expats/Experts/Exparts)
  | 'website_stacked_sheets'         // Gestapelte Blätter beim Scroll
  | 'website_images_slider';         // Full-Page-Bild-Slider + CTA

export type LandingSection = {
  id: string;
  type: LandingSectionType;
  props: Record<string, unknown>;
};

export const MARQUEE_QUOTES_PARALLAX = [
  'Mit vermieteten Immobilien in die finanzielle Freiheit.',
  'Innerhalb 8 Wochen zu Ihrer ersten Immobilie.',
  'Unabhängige & digitale Beratung – Top Objektauswahl Deutschlandweit.',
  'Hohe steuerliche Abschreibungen – Ihr Mieter tilgt mit.',
  'Bereits mehr als 230 Kunden freuen sich über den Kauf ihrer Immobilie.',
  'Individuelle Beratung – Gezielte Objektauswahl – Full-Service-Konzept.',
  'Kostenlose Beratung – unverbindliches Erstgespräch.',
];

export const LANDING_ELEMENT_DEFINITIONS: Record<
  LandingSectionType,
  { label: string; description: string; defaultProps: Record<string, unknown>; parallaxDefaultProps?: Record<string, unknown> }
> = {
  website_jeton_hero: {
    label: 'Hero',
    description: 'Vollbreiter Hero: Bild, Headline, Login-Button. Parallax: 3 Zeilen (Zeile 1+2 font-medium, Zeile 3 font-bold).',
    defaultProps: { headline: 'Deine Immobilien.', headlineLine2: 'Unsere Expertise.', logoUrl: '', secondaryCtaHref: '' },
    parallaxDefaultProps: { headline: 'Mit vermieteten', headlineLine2: 'Immobilien in die', headlineLine3: 'finanzielle Freiheit.', logoUrl: '', secondaryCtaHref: '' },
  },
  website_marquee: {
    label: 'Laufendes Banner',
    description: 'Banner mit Text, der von links nach rechts läuft. Parallax: ImmoSparplan-Text, dunkler Hintergrund.',
    defaultProps: { text: 'Mit vermieteten Immobilien in die finanzielle Freiheit.' },
    parallaxDefaultProps: { customQuotes: MARQUEE_QUOTES_PARALLAX, backgroundColor: '#000000' },
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
  // Template „ImmoSparplan“
  website_testimonials_infinite: {
    label: 'Testimonials (unendlich)',
    description: 'Kundenstimmen mit Bild-Slider-Hintergrund, endlos laufende Karten',
    defaultProps: {
      sectionTitle: 'Bereits mehr als 230 Kunden freuen sich über den Kauf ihrer Immobilie',
      testimonials: [
        { quote: 'Es war großartig, den gesamten Prozess – von der Objektauswahl bis zur finanziellen Absicherung – strukturiert zu erleben.', name: 'Hanna M', title: 'Architektin' },
        { quote: 'Die Beratung hat mir geholfen, Immobilieninvestments zu verstehen und ein passives Einkommen für die Zukunft aufzubauen.', name: 'Stefan S', title: 'IT-Berater' },
        { quote: 'Wir haben die perfekte Immobilie gefunden und eine klare Strategie für den Vermögensaufbau entwickelt.', name: 'Sophie & Nedim', title: 'Ärztin & Lehrer' },
        { quote: 'Die strukturierte Vorgehensweise und das Fachwissen – jeder Schritt war unkompliziert und stressfrei.', name: 'Alex E', title: 'Unternehmensberater' },
        { quote: 'Innerhalb von acht Wochen von Null auf die erste Immobilie – das hätte ich mir vorher nicht vorstellen können.', name: 'Laura K', title: 'Marketing Managerin' },
        { quote: 'Das Netzwerk und die Deals haben mir den Einstieg enorm erleichtert. Absolute Empfehlung.', name: 'Marcus T', title: 'Ingenieur' },
      ] as TestimonialItem[],
    },
  },
  website_beratung: {
    label: 'Beratung (Prozess + Stats)',
    description: 'Headline mit Highlight-Effekt, Prozess-Schritte und Kennzahlen (ImmoSparplan-Original)',
    defaultProps: {
      sectionTitle: 'Mit vermieteten Immobilien in die finanzielle Freiheit– wir begleiten Sie in 8 Wochen zu Ihrer ersten Immobilie.',
      highlightWords: ['finanzielle Freiheit', '8 Wochen', 'ersten', 'Immobilie'],
    },
  },
  website_claim_parallax: {
    label: 'Claim Parallax',
    description: 'Scroll-Animation: fliegende farbige Cards',
    defaultProps: {},
  },
  website_words_parallax: {
    label: 'Wörter Parallax',
    description: 'Parallax-Sektion mit Expats / Experts / Exparts',
    defaultProps: {},
  },
  website_stacked_sheets: {
    label: 'Gestapelte Blätter',
    description: 'Scroll: Blätter werden nacheinander weggezogen',
    defaultProps: {},
  },
  website_images_slider: {
    label: 'Bild-Slider + CTA',
    description: 'Full-Page-Slider mit Headline und CTA-Button (ImmoSparplan-Original)',
    defaultProps: { sectionTitle: 'Mit ImmoSparplan in die\nfinanzielle Freiheit.', ctaText: 'Jetzt Expert werden →' },
  },
};

/** Sektionstypen pro Vorlage – nur diese werden im Builder angeboten (keine Mischung). */
export const SECTION_TYPES_BY_TEMPLATE: Record<LandingTemplate, readonly LandingSectionType[]> = {
  standard: [
    'website_jeton_hero',
    'website_marquee',
    'website_target_groups',
    'website_testimonials',
    'website_quiz_cta',
    'website_services',
    'website_benefits',
    'website_pricing',
    'website_trust',
    'website_process',
    'website_faq',
    'website_footer',
  ],
  parallax: [
    'website_jeton_hero',
    'website_marquee',
    'website_testimonials_infinite',
    'website_quiz_cta',
    'website_beratung',
    'website_claim_parallax',
    'website_words_parallax',
    'website_stacked_sheets',
    'website_images_slider',
    'website_footer',
  ],
};

/** Pro Sektion: welche Props im Editor bearbeitet werden können (Texte, Links, Bild, Farben, Schrift) */
export type EditablePropType = 'text' | 'url' | 'textarea' | 'image' | 'color' | 'fontsize' | 'fontfamily' | 'testimonials';
export type EditablePropDef = { key: string; label: string; type: EditablePropType };

/** Einzelne Kundenstimme im Builder */
export type TestimonialItem = { quote: string; name: string; title: string; imageUrl?: string };
export const SECTION_EDITABLE_PROPS: Partial<Record<LandingSectionType, EditablePropDef[]>> = {
  website_jeton_hero: [
    { key: 'headline', label: 'Überschrift Zeile 1', type: 'text' },
    { key: 'headlineLine2', label: 'Überschrift Zeile 2', type: 'text' },
    { key: 'headlineLine3', label: 'Überschrift Zeile 3', type: 'text' },
    { key: 'headlineFontSize', label: 'Schriftgröße Überschrift', type: 'fontsize' },
    { key: 'headlineFontFamily', label: 'Schriftart Überschrift', type: 'fontfamily' },
    { key: 'headlineColor', label: 'Farbe Überschrift', type: 'color' },
    { key: 'secondaryCtaHref', label: 'Mehr erfahren führt zu (Sektion)', type: 'url' },
    { key: 'logoUrl', label: 'Site-Logo', type: 'image' },
    { key: 'backgroundImageUrl', label: 'Hintergrundbild', type: 'image' },
    { key: 'overlayColor', label: 'Overlay über Bild (z. B. dunkler Schleier)', type: 'color' },
  ],
  website_marquee: [
    { key: 'text', label: 'Lauftext (Standard: einzelner Text)', type: 'text' },
    { key: 'customQuotes', label: 'Lauftext (Parallax: mehrere Texte, getrennt durch Zeilenumbruch)', type: 'textarea' },
    { key: 'backgroundColor', label: 'Hintergrundfarbe', type: 'color' },
  ],
  website_target_groups: [
    { key: 'sectionTitle', label: 'Sektions-Titel', type: 'text' },
    { key: 'sectionSubtitle', label: 'Untertitel', type: 'textarea' },
  ],
  website_testimonials: [
    { key: 'sectionTitle', label: 'Sektions-Titel', type: 'text' },
    { key: 'sectionSubtitle', label: 'Untertitel', type: 'textarea' },
    { key: 'testimonials', label: 'Kundenstimmen', type: 'testimonials' },
  ],
  website_quiz_cta: [
    { key: 'title', label: 'Titel', type: 'text' },
    { key: 'subtitle', label: 'Untertitel', type: 'textarea' },
    { key: 'buttonText', label: 'Button-Text', type: 'text' },
  ],
  website_services: [
    { key: 'sectionTitle', label: 'Sektions-Titel', type: 'text' },
    { key: 'sectionSubtitle', label: 'Untertitel', type: 'textarea' },
  ],
  website_benefits: [
    { key: 'sectionTitle', label: 'Sektions-Titel', type: 'text' },
    { key: 'sectionSubtitle', label: 'Untertitel', type: 'textarea' },
  ],
  website_pricing: [
    { key: 'sectionTitle', label: 'Sektions-Titel', type: 'text' },
    { key: 'sectionSubtitle', label: 'Untertitel', type: 'textarea' },
  ],
  website_trust: [
    { key: 'sectionTitle', label: 'Sektions-Titel', type: 'text' },
  ],
  website_process: [
    { key: 'sectionTitle', label: 'Sektions-Titel', type: 'text' },
    { key: 'sectionSubtitle', label: 'Untertitel', type: 'textarea' },
  ],
  website_faq: [
    { key: 'sectionTitle', label: 'Sektions-Titel', type: 'text' },
    { key: 'sectionSubtitle', label: 'Untertitel', type: 'textarea' },
  ],
  website_footer: [
    { key: 'copyrightText', label: 'Copyright-Text', type: 'text' },
  ],
  website_testimonials_infinite: [
    { key: 'sectionTitle', label: 'Überschrift', type: 'text' },
    { key: 'testimonials', label: 'Kundenstimmen', type: 'testimonials' },
  ],
  website_beratung: [
    { key: 'sectionTitle', label: 'Headline-Text', type: 'textarea' },
    { key: 'highlightWords', label: 'Markierte Wörter (kommagetrennt)', type: 'text' },
  ],
  website_claim_parallax: [],
  website_words_parallax: [],
  website_stacked_sheets: [],
  website_images_slider: [
    { key: 'sectionTitle', label: 'Headline', type: 'text' },
    { key: 'ctaText', label: 'Button-Text', type: 'text' },
  ],
};

/** Screenshot-Pfade für Sektions-Vorschau (public/landing-previews/) – Standard-Vorlage */
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
  website_testimonials_infinite: '/landing-previews/section-testimonials.png',
  website_beratung: '/landing-previews/section-process.png',
  website_claim_parallax: '/landing-previews/section-benefits.png',
  website_words_parallax: '/landing-previews/section-process.png',
  website_stacked_sheets: '/landing-previews/section-hero.png',
  website_images_slider: '/landing-previews/section-quiz-cta.png',
};

/** Parallax-Vorlage: eigene Vorschaubilder (überschreibt SECTION_PREVIEW_IMAGES wenn template=parallax) */
export const SECTION_PREVIEW_IMAGES_PARALLAX: Partial<Record<LandingSectionType, string>> = {
  website_jeton_hero: '/landing-previews/parallax-hero.png',
  website_marquee: '/landing-previews/parallax-marquee.png',
  website_testimonials_infinite: '/landing-previews/parallax-testimonials.png',
  website_quiz_cta: '/landing-previews/parallax-quiz-cta.png',
  website_beratung: '/landing-previews/parallax-beratung.png',
  website_claim_parallax: '/landing-previews/parallax-claim.png',
  website_words_parallax: '/landing-previews/parallax-words.png',
  website_stacked_sheets: '/landing-previews/parallax-stacked-sheets.png',
  website_images_slider: '/landing-previews/parallax-images-slider.png',
};
