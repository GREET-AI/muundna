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
    defaultProps: { headline: 'Deine Immobilien.', headlineLine2: 'Unsere Expertise.', logoUrl: '', secondaryCtaHref: '', headlineFontSizeDesktop: 48, headlineFontSizeTablet: 32, headlineFontSizeMobile: 20 },
    parallaxDefaultProps: { headline: 'Mit vermieteten', headlineLine2: 'Immobilien in die', headlineLine3: 'finanzielle Freiheit.', logoUrl: '', headlineFontSizeDesktop: 48, headlineFontSizeTablet: 32, headlineFontSizeMobile: 20 },
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
    defaultProps: { backgroundSliderImages: ['/images/trust/13.png', '/images/trust/14.png', '/images/trust/15.png'] },
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
      backgroundSliderImages: ['/images/slider1/3.png', '/images/slider1/4.png', '/images/slider1/5.png', '/images/slider1/6.png', '/images/slider1/7.png'],
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
    description: 'Scroll-Animation: 4 Card-Typen (Beratung Trust+CTA, Planung zwei Zeilen+Status, Bau Bild+Overlay, Wert Zahl+CTA)',
    defaultProps: {
      claimHeadlineLine1: 'Ihre Immobilie.',
      claimHeadlineLine2: 'Ihr Vermögen.',
      ctaText: 'Jetzt unverbindlich beraten lassen – Ihr Traumhaus beginnt hier.',
      cardLabel1: 'Individuelle Beratung',
      cardLabel2: 'Planung',
      cardLabel3: 'Bau',
      cardLabel4: 'Ihre Immobilie',
      card1TrustText: 'Unverbindlich & transparent',
      card1ButtonText: 'Jetzt Gespräch buchen',
      card2Line1: 'Strategie',
      card2Line2: 'Objektauswahl',
      card2StatusText: 'Strukturiert',
      card3ImageUrl: '/images/parallax-cards/wohnhaus1.png',
      card3OverlayText: 'Ihr Traumhaus',
      card4NumberText: '875.000€',
      card4ContextText: 'Garantierter Zugang zu exklusivsten Wohnobjekten',
      card4ButtonText: 'Expert werden',
      card1ImageUrl: '/images/trust/14.png',
      card1TextColor: '#000000',
      card2TextColor: '#000000',
      card3TextColor: '#000000',
      card4TextColor: '#000000',
      card1TextSize: 16,
      card2TextSize: 16,
      card3TextSize: 16,
      card4TextSize: 16,
      card1Icon: 'message-circle',
      card2Icon: 'clipboard-list',
      card3Icon: 'home',
      card4Icon: 'trending-up',
      card1IconColor: '#000000',
      card2IconColor: '#000000',
      card3IconColor: '#ffffff',
      card4IconColor: '#000000',
    },
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

/**
 * Eindeutige Anzeigenamen pro Vorlage – gleiche Sektionstypen (z. B. Hero) haben in Vorlage 1 und 2
 * unterschiedliche Logik und Namen (z. B. Slider Hero mit "Mehr erfahren" vs. Parallax Hero mit Login).
 */
export const SECTION_LABELS_BY_TEMPLATE: Record<LandingTemplate, Partial<Record<LandingSectionType, string>>> = {
  standard: {
    website_jeton_hero: 'Slider Hero',
    website_marquee: 'Basic Marquee',
    website_target_groups: 'Basic Zielgruppen',
    website_testimonials: 'Basic Testimonials',
    website_quiz_cta: 'Basic Quiz CTA',
    website_services: 'Basic Services',
    website_benefits: 'Basic Benefits',
    website_pricing: 'Basic Pricing',
    website_trust: 'Basic Trust',
    website_process: 'Basic Prozess',
    website_faq: 'Basic FAQ',
    website_footer: 'Basic Footer',
  },
  parallax: {
    website_jeton_hero: 'Parallax Hero',
    website_marquee: 'Parallax Marquee',
    website_testimonials_infinite: 'Parallax Testimonials',
    website_quiz_cta: 'Parallax Quiz CTA',
    website_beratung: 'Parallax Beratung',
    website_claim_parallax: 'Parallax Claim',
    website_words_parallax: 'Parallax Wörter',
    website_stacked_sheets: 'Parallax Gestapelte Blätter',
    website_images_slider: 'Parallax Bild-Slider',
    website_footer: 'Parallax Footer',
  },
};

/** Anzeigename einer Sektion abhängig von der Vorlage (eindeutig: Basic/Slider vs. Parallax). */
export function getSectionLabel(type: LandingSectionType, template: LandingTemplate): string {
  const byTemplate = SECTION_LABELS_BY_TEMPLATE[template]?.[type];
  if (byTemplate) return byTemplate;
  return LANDING_ELEMENT_DEFINITIONS[type]?.label ?? type;
}

/** Pro Sektion: welche Props im Editor bearbeitet werden können (Texte, Links, Bild, Farben, Schrift) */
export type EditablePropType = 'text' | 'url' | 'textarea' | 'image' | 'image_array' | 'color' | 'fontsize' | 'fontsize_responsive' | 'fontfamily' | 'testimonials';
export type EditablePropDef = { key: string; label: string; type: EditablePropType };

/**
 * Editierbare Props pro Vorlage – nicht alle Sektionen haben in Basic und Parallax dieselben Felder.
 * Z. B. Slider Hero: 2 Headlines + "Mehr erfahren"; Parallax Hero: 3 Headlines, kein "Mehr erfahren".
 */
export function getEditablePropsForSection(type: LandingSectionType, template: LandingTemplate): EditablePropDef[] {
  const base = SECTION_EDITABLE_PROPS[type];
  if (!base) return [];

  if (type === 'website_jeton_hero') {
    if (template === 'standard') {
      return base.filter((p) => p.key !== 'headlineLine3'); // Slider Hero: nur 2 Zeilen, dafür secondaryCtaHref
    }
    return base.filter((p) => p.key !== 'secondaryCtaHref'); // Parallax Hero: 3 Zeilen, kein Mehr-erfahren-Button
  }

  if (type === 'website_marquee') {
    if (template === 'standard') return base.filter((p) => p.key !== 'customQuotes');
    return base.filter((p) => p.key !== 'text'); // Parallax: nur customQuotes + backgroundColor
  }

  return base;
}

/** Einzelne Kundenstimme im Builder */
export type TestimonialItem = { quote: string; name: string; title: string; imageUrl?: string };
export const SECTION_EDITABLE_PROPS: Partial<Record<LandingSectionType, EditablePropDef[]>> = {
  website_jeton_hero: [
    { key: 'headline', label: 'Überschrift Zeile 1', type: 'text' },
    { key: 'headlineLine2', label: 'Überschrift Zeile 2', type: 'text' },
    { key: 'headlineLine3', label: 'Überschrift Zeile 3', type: 'text' },
    { key: 'headlineFontSizeDesktop', label: 'Schriftgröße Desktop (px)', type: 'fontsize_responsive' },
    { key: 'headlineFontSizeTablet', label: 'Schriftgröße Tablet (px)', type: 'fontsize_responsive' },
    { key: 'headlineFontSizeMobile', label: 'Schriftgröße Mobil (px)', type: 'fontsize_responsive' },
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
    { key: 'backgroundSliderImages', label: 'Hintergrund-Slider (Bilder wechseln)', type: 'image_array' },
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
    { key: 'backgroundSliderImages', label: 'Hintergrund-Slider (Bilder wechseln)', type: 'image_array' },
  ],
  website_beratung: [
    { key: 'sectionTitle', label: 'Headline-Text', type: 'textarea' },
    { key: 'highlightWords', label: 'Markierte Wörter (kommagetrennt)', type: 'text' },
  ],
  website_claim_parallax: [
    { key: 'claimHeadlineLine1', label: 'Haupttext Zeile 1', type: 'text' },
    { key: 'claimHeadlineLine2', label: 'Haupttext Zeile 2', type: 'text' },
    { key: 'ctaText', label: 'CTA-Text unter den Cards', type: 'textarea' },
    { key: 'card1ImageUrl', label: 'Card 1 (Beratung) – Bild oben', type: 'image' },
    { key: 'cardLabel1', label: 'Card 1 – Überschrift', type: 'text' },
    { key: 'card1TrustText', label: 'Card 1 – Trust-Text', type: 'text' },
    { key: 'card1ButtonText', label: 'Card 1 – Button-Text', type: 'text' },
    { key: 'card1TextColor', label: 'Card 1 – Textfarbe', type: 'color' },
    { key: 'card1TextSize', label: 'Card 1 – Schriftgröße (px)', type: 'text' },
    { key: 'card1Icon', label: 'Card 1 – Icon (Fallback ohne Bild)', type: 'text' },
    { key: 'card1IconColor', label: 'Card 1 – Icon-Farbe', type: 'color' },
    { key: 'cardLabel2', label: 'Card 2 (Planung) – Überschrift', type: 'text' },
    { key: 'card2Line1', label: 'Card 2 – Zeile 1', type: 'text' },
    { key: 'card2Line2', label: 'Card 2 – Zeile 2', type: 'text' },
    { key: 'card2StatusText', label: 'Card 2 – Status-Text', type: 'text' },
    { key: 'card2TextColor', label: 'Card 2 – Textfarbe', type: 'color' },
    { key: 'card2TextSize', label: 'Card 2 – Schriftgröße (px)', type: 'text' },
    { key: 'card2Icon', label: 'Card 2 – Icon', type: 'text' },
    { key: 'card2IconColor', label: 'Card 2 – Icon-Farbe', type: 'color' },
    { key: 'card3ImageUrl', label: 'Card 3 (Bau) – Bild-URL', type: 'image' },
    { key: 'card3OverlayText', label: 'Card 3 – Overlay-Text', type: 'text' },
    { key: 'card3TextColor', label: 'Card 3 – Textfarbe (Overlay)', type: 'color' },
    { key: 'card3TextSize', label: 'Card 3 – Schriftgröße (px)', type: 'text' },
    { key: 'cardLabel4', label: 'Card 4 (Wert) – Überschrift', type: 'text' },
    { key: 'card4NumberText', label: 'Card 4 – Große Zahl', type: 'text' },
    { key: 'card4ContextText', label: 'Card 4 – Kontext-Text', type: 'text' },
    { key: 'card4ButtonText', label: 'Card 4 – Button-Text', type: 'text' },
    { key: 'card4TextColor', label: 'Card 4 – Textfarbe', type: 'color' },
    { key: 'card4TextSize', label: 'Card 4 – Schriftgröße (px)', type: 'text' },
    { key: 'card4Icon', label: 'Card 4 – Icon', type: 'text' },
    { key: 'card4IconColor', label: 'Card 4 – Icon-Farbe', type: 'color' },
  ],
  website_words_parallax: [],
  website_stacked_sheets: [],
  website_images_slider: [
    { key: 'sectionTitle', label: 'Headline', type: 'text' },
    { key: 'ctaText', label: 'Button-Text', type: 'text' },
  ],
};

/**
 * Element-Kategorien für die Builder-Toolbar: Jede Kategorie hat ein Icon und ein Label.
 * Beim Klick auf eine Sektion werden nur die Icons angezeigt, deren Kategorie in der Sektion vorkommt.
 */
export type ElementKindId =
  | 'headline'
  | 'headline_style'
  | 'logo'
  | 'background'
  | 'section_title'
  | 'section_subtitle'
  | 'marquee'
  | 'cta'
  | 'testimonials'
  | 'testimonials_slider_images'
  | 'copyright'
  | 'highlight'
  | 'other';

/** Prop-Key → Element-Kategorie (für Gruppierung in der Icon-Toolbar). */
export const PROP_TO_ELEMENT_KIND: Record<string, ElementKindId> = {
  headline: 'headline',
  headlineLine2: 'headline',
  headlineLine3: 'headline',
  headlineFontSize: 'headline_style',
  headlineFontSizeDesktop: 'headline_style',
  headlineFontSizeTablet: 'headline_style',
  headlineFontSizeMobile: 'headline_style',
  headlineFontFamily: 'headline_style',
  headlineColor: 'headline_style',
  logoUrl: 'logo',
  backgroundImageUrl: 'background',
  overlayColor: 'background',
  sectionTitle: 'section_title',
  sectionSubtitle: 'section_subtitle',
  text: 'marquee',
  customQuotes: 'marquee',
  backgroundColor: 'marquee',
  buttonText: 'cta',
  ctaText: 'cta',
  title: 'cta',
  subtitle: 'cta',
  secondaryCtaHref: 'cta',
  testimonials: 'testimonials',
  backgroundSliderImages: 'testimonials_slider_images',
  copyrightText: 'copyright',
  highlightWords: 'highlight',
  claimHeadlineLine1: 'headline',
  claimHeadlineLine2: 'headline',
  cardLabel1: 'other',
  cardLabel2: 'other',
  cardLabel3: 'other',
  cardLabel4: 'other',
  card1TextColor: 'headline_style',
  card2TextColor: 'headline_style',
  card3TextColor: 'headline_style',
  card4TextColor: 'headline_style',
  card1TextSize: 'headline_style',
  card2TextSize: 'headline_style',
  card3TextSize: 'headline_style',
  card4TextSize: 'headline_style',
  card1Icon: 'other',
  card2Icon: 'other',
  card3Icon: 'other',
  card4Icon: 'other',
  card1IconColor: 'headline_style',
  card2IconColor: 'headline_style',
  card3IconColor: 'headline_style',
  card4IconColor: 'headline_style',
  card1TrustText: 'section_subtitle',
  card1ButtonText: 'cta',
  card2Line1: 'other',
  card2Line2: 'other',
  card2StatusText: 'other',
  card1ImageUrl: 'background',
  card3ImageUrl: 'background',
  card3OverlayText: 'headline',
  card4NumberText: 'headline',
  card4ContextText: 'section_subtitle',
  card4ButtonText: 'cta',
};

/** Label pro Element-Kategorie (Icon wird im Builder aus lucide gewählt). */
export const ELEMENT_KIND_LABELS: Record<ElementKindId, string> = {
  headline: 'H',
  headline_style: 'Schrift & Farbe',
  logo: 'Logo',
  background: 'Hintergrund',
  section_title: 'Sektions-Titel',
  section_subtitle: 'Untertitel',
  marquee: 'Lauftext',
  cta: 'Button / Link',
  testimonials: 'Kundenstimmen',
  testimonials_slider_images: 'Slider-Bilder',
  copyright: 'Copyright',
  highlight: 'Hervorhebung',
  other: 'Sonstiges',
};

/** Standard-Props für eine Sektion in der gewählten Vorlage (für „Auf Standard zurücksetzen“). */
export function getDefaultPropsForSection(type: LandingSectionType, template: LandingTemplate): Record<string, unknown> {
  const def = LANDING_ELEMENT_DEFINITIONS[type];
  if (!def) return {};
  const base = { ...def.defaultProps };
  if (template === 'parallax' && def.parallaxDefaultProps) {
    Object.assign(base, def.parallaxDefaultProps);
  }
  return base;
}

/** Welche Props zu welcher Kategorie gehören – für eine Sektion die sichtbaren Kategorien ermitteln. */
export function getElementKindsForProps(editableProps: EditablePropDef[]): ElementKindId[] {
  const kinds = new Set<ElementKindId>();
  for (const p of editableProps) {
    kinds.add(PROP_TO_ELEMENT_KIND[p.key] ?? 'other');
  }
  return Array.from(kinds);
}

/** Props einer Sektion nach Kategorie filtern. */
export function getPropsByKind(editableProps: EditablePropDef[], kind: ElementKindId): EditablePropDef[] {
  return editableProps.filter((p) => (PROP_TO_ELEMENT_KIND[p.key] ?? 'other') === kind);
}

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

/** Parallax-Vorlage: eigene Vorschaubilder (Reihenfolge = SECTION_TYPES_BY_TEMPLATE.parallax) */
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
  website_footer: '/landing-previews/section-faq.png',
};
