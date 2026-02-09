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
    defaultProps: {
      headline: 'Deine Immobilien.',
      headlineLine2: 'Unsere Expertise.',
      logoUrl: '',
      secondaryCtaHref: '',
      ctaText: 'Jetzt Anfragen',
      secondaryCtaText: 'Mehr erfahren',
      backgroundImageUrl: '/images/slider2/1.png',
      overlayColor: '#cb530a',
    },
    parallaxDefaultProps: {
      headline: 'Mit vermieteten',
      headlineLine2: 'Immobilien in die',
      headlineLine3: 'finanzielle Freiheit.',
      logoUrl: '',
      ctaText: 'Go Expert',
      secondaryCtaText: 'Log in',
      backgroundImageUrl: '/images/slider2/1.png',
      overlayColor: '#60A917',
    },
  },
  website_marquee: {
    label: 'Laufendes Banner',
    description: 'Banner mit Text, der von links nach rechts läuft. Parallax: ImmoSparplan-Text, dunkler Hintergrund.',
    defaultProps: { text: 'Mit vermieteten Immobilien in die finanzielle Freiheit.', customQuotes: MARQUEE_QUOTES_PARALLAX, backgroundColor: '#cb530a', textColor: '#ffffff' },
    parallaxDefaultProps: { customQuotes: MARQUEE_QUOTES_PARALLAX, backgroundColor: '#000000', textColor: '#ffffff' },
  },
  website_target_groups: {
    label: 'Für wen ist dieses Coaching',
    description: 'Zielgruppen-Cards (für Coaching-Zielgruppen anpassbar)',
    defaultProps: {
      sectionTitle: 'Für wen ist dieses Coaching?',
      sectionSubtitle: 'Ob Quereinsteiger oder mit Vorerfahrung – ein System für die richtigen Immobilien und dein Vermögen.',
      targetGroups: [
        { title: 'Quereinsteiger', description: 'Du willst systematisch in Immobilien als Kapitalanlage einsteigen? Mit klarer Strategie, Deal-Flow und 1:1-Betreuung – ohne Trial and Error.', icon: '🚀', href: '#', image: '/images/Landingpage-Coaching/Immobilien/1.png', imageSlogan: 'Quereinsteiger' },
        { title: 'Erste Kapitalanlage', description: 'Du suchst die erste richtige Immobilie zum Kaufen und Vermieten? Wir begleiten dich von der Auswahl bis zur Vermietung.', icon: '🏡', href: '#', image: '/images/Landingpage-Coaching/Immobilien/2.png', imageSlogan: 'Erste Kapitalanlage' },
        { title: 'Portfolio ausbauen', description: 'Du hast bereits Erfahrung und willst skalieren? Exklusiver Deal-Flow und Netzwerk unterstützen dich beim nächsten Schritt.', icon: '📈', href: '#', image: '/images/Landingpage-Coaching/Immobilien/3.png', imageSlogan: 'Portfolio ausbauen' },
        { title: 'Exklusive Strategien', description: 'Zugang zu Methoden und Deals, die nicht jeder kennt. Off-Market, Netzwerk und erprobte Systeme.', icon: '🔐', href: '#', image: '/images/Landingpage-Coaching/Immobilien/4.png', imageSlogan: 'Exklusive Strategien' },
      ] as TargetGroupItem[],
    },
  },
  website_testimonials: {
    label: 'Das sagen unsere Kunden',
    description: 'Kundenstimmen-Slider (Inhalt auf Coaching umschreiben)',
    defaultProps: { backgroundSliderImages: ['/images/trust/13.png', '/images/trust/14.png', '/images/trust/15.png'] },
  },
  website_quiz_cta: {
    label: 'Quiz-Opt-in + Quiz',
    description: 'Expertise erhalten – 4 Fragen, maßgeschneidertes Angebot (Link zum Quiz)',
    defaultProps: {
      title: 'Expertise erhalten',
      subtitle: 'Beantworten Sie 4 kurze Fragen und erhalten Sie ein maßgeschneidertes Angebot',
      buttonText: 'Jetzt starten →',
    },
  },
  website_services: {
    label: 'Was dir unser Coaching ermöglicht',
    description: 'Cards mit Mehrwert (auf Coaching umschreiben)',
    defaultProps: {
      sectionTitle: 'Was dir unser Coaching ermöglicht',
      sectionSubtitle: 'Strategie, Objektauswahl, Finanzierung und Vermietung – alles aus einer Hand.',
      services: [
        { title: 'Deal-Flow & Netzwerk', description: 'Zugang zu exklusiven Off-Market-Deals und einem Netzwerk von Investoren und Partnern. Keine graue Theorie – echte Gelegenheiten.', icon: '🔑', href: '#', image: '/images/Dienstleistungen/Telefonieren.jpeg', imageSlogan: 'Deal-Flow & Netzwerk', buttonText: 'Mehr erfahren' },
        { title: 'Strategie & Auswahl', description: 'Wie du die richtigen Immobilien als Kapitalanlage findest und bewertest. Systematische Kriterien und Due Diligence.', icon: '📋', href: '#', image: '/images/Dienstleistungen/Termenirung.jpeg', imageSlogan: 'Strategie & Auswahl', buttonText: 'Mehr erfahren' },
        { title: 'Kauf & Finanzierung', description: 'Von der Entscheidung bis zum Kauf – Begleitung bei Verhandlung, Finanzierung und Abschluss.', icon: '📄', href: '#', image: '/images/Dienstleistungen/SocialMedia.jpeg', imageSlogan: 'Kauf & Finanzierung', buttonText: 'Mehr erfahren' },
        { title: 'Vermietung & Management', description: 'Erste Vermietung, laufendes Management und Skalierung. Ein klares System für dein Portfolio.', icon: '🏠', href: '#', image: '/images/Dienstleistungen/GoogleBewertungen.jpeg', imageSlogan: 'Vermietung & Management', buttonText: 'Mehr erfahren' },
        { title: '1:1-Coaching', description: 'Individuelle Betreuung und maßgeschneiderte Schritte. Du bleibst nicht allein – wir gehen den Weg mit.', icon: '👤', href: '#', image: '/images/Dienstleistungen/Raport.jpeg', imageSlogan: '1:1-Coaching', buttonText: 'Mehr erfahren' },
        { title: 'Community', description: 'Austausch mit anderen Teilnehmern, laufende Updates und Zugang zu exklusiven Inhalten im Mitgliederbereich.', icon: '🤝', href: '#', image: '/images/Dienstleistungen/SocialMedia.jpeg', imageSlogan: 'Community', buttonText: 'Mehr erfahren' },
      ] as ServiceItem[],
    },
  },
  website_benefits: {
    label: 'Benefits',
    description: '„Davon profitieren Sie“ – 6 Vorteile in Karten',
    defaultProps: {
      sectionTitle: 'Davon profitieren Sie',
      sectionSubtitle: 'Klare Struktur, echte Deals und Begleitung bis zur ersten Immobilie.',
      benefits: [
        { icon: 'MapPin', iconColor: '#cb530a', title: 'Deal-Flow & Netzwerk', description: 'Zugang zu exklusiven Off-Market-Deals und einem Netzwerk von Investoren und Partnern' },
        { icon: 'CheckCircle2', iconColor: '#cb530a', title: 'Systematischer Einstieg', description: 'Klare Strategie: Wie du die richtigen Immobilien findest, bewertest und sicherst' },
        { icon: 'Zap', iconColor: '#cb530a', title: 'Kauf & Vermietung', description: 'Von der Due Diligence bis zur Vermietung – ein komplettes System für Kapitalanlagen' },
        { icon: 'Calendar', iconColor: '#cb530a', title: 'Individuelles Coaching', description: '1:1-Betreuung und maßgeschneiderte Schritte für deine Ziele' },
        { icon: 'Briefcase', iconColor: '#cb530a', title: 'Erprobte Methodik', description: 'Strategien, die in der Praxis funktionieren – keine graue Theorie' },
        { icon: 'BarChart2', iconColor: '#cb530a', title: 'Klare Struktur', description: 'Modulare Inhalte, klare Meilensteine und messbare Fortschritte' },
      ] as BenefitItem[],
    },
  },
  website_pricing: {
    label: 'Unser Angebot (CTA Kauf)',
    description: 'Pakete / Preise – CTA für den Kauf des Coachings',
    defaultProps: {
      sectionTitle: 'Unser Angebot',
      sectionSubtitle: 'Investition in deine finanzielle Zukunft – mit klarem Mehrwert.',
      pricingCards: [
        { title: 'Einstieg', description: 'Systematischer Start in Immobilien als Kapitalanlage', price: 'auf Anfrage', recommendation: 'Ideal für Quereinsteiger', bulletPoints: ['Zugang zu exklusiven Strategien und der Methodik', 'Deal-Flow & Einführung ins Netzwerk', 'Strukturierte Schritte: richtige Immobilie finden, bewerten, sichern', '1:1-Coaching-Sessions', 'Zufriedenheitsgarantie'], buttonText: 'Jetzt Platz sichern', popular: false },
        { title: 'Komplett-System', description: 'Alles von Strategie bis Kauf & Vermietung', price: 'auf Anfrage', recommendation: 'Empfohlen für ernsthafte Einstiege', bulletPoints: ['Volles System: Deal-Flow, Due Diligence, Kauf, Vermietung', 'Exklusiver Zugang zu Off-Market-Deals und Netzwerk', '1:1-Betreuung und maßgeschneiderte Umsetzung', 'Community und laufender Austausch', 'Zufriedenheitsgarantie'], buttonText: 'Jetzt Platz sichern', popular: true },
        { title: 'Premium', description: 'Maximale Betreuung und exklusive Inhalte', price: 'auf Anfrage', recommendation: '', bulletPoints: ['Alles aus dem Komplett-System', 'Intensivere 1:1-Betreuung und Prioritätszugang', 'Individuelle Strategie und Deal-Begleitung', 'Langfristige Begleitung beim Portfolio-Aufbau', 'Zufriedenheitsgarantie'], buttonText: 'Jetzt Platz sichern', popular: false },
      ] as PricingCardItem[],
    },
  },
  website_trust: {
    label: 'Zufriedenheitsgarantie',
    description: 'Garantie + Unverbindliche Beratung',
    defaultProps: {
      sealText: 'ZUFRIEDENHEITSGARANTIE',
      sectionTitle: 'Zufriedenheitsgarantie',
      bodyHtml: 'Sichere dir ein <strong style="color:#cb530a">unverbindliches Kennenlerngespräch</strong> und erlebe, wie das Coaching dich bei deinen ersten Schritten in Immobilien als Kapitalanlage unterstützt. Sollte es dir <strong style="color:#cb530a">nach dem vereinbarten Zeitraum</strong> nicht gefallen, bekommst du dein <strong style="color:#cb530a">Geld zurück</strong>. Starte risikofrei mit einem System, das Deal-Flow, Netzwerk und Umsetzung verbindet.',
      buttonText: 'Jetzt Platz sichern',
    },
  },
  website_process: {
    label: 'So funktioniert das Coaching',
    description: '4 Schritte – Ablauf (auf Coaching umschreiben)',
    defaultProps: {
      sectionTitle: 'So funktioniert das Coaching',
      sectionSubtitle: 'Von der ersten Beratung bis zur Schlüsselübergabe – in klaren Schritten.',
      processSteps: [
        { number: '1', title: 'Kennenlernen', description: 'Kurzes Gespräch: Wo stehst du? Welche Ziele hast du mit Immobilien als Kapitalanlage? Unverbindlich.', ctaText: '', href: '' },
        { number: '2', title: 'Strategie & System', description: 'Du erhältst Zugang zu exklusiven Strategien, Deal-Flow und dem Netzwerk – strukturiert und praxisnah.', ctaText: '', href: '' },
        { number: '3', title: 'Umsetzung', description: 'Von der richtigen Immobilie bis zu Kauf und Vermietung: ein komplettes System mit 1:1-Betreuung.', ctaText: '', href: '' },
        { number: '4', title: 'Jetzt Platz sichern', description: 'Starte durch – mit klarer Methodik und Zugang zu Deals und Community.', ctaText: 'Jetzt Platz sichern', href: '/quiz' },
      ] as ProcessStepItem[],
    },
  },
  website_faq: {
    label: 'FAQ',
    description: 'Häufige Fragen – Accordion mit Tabs (+ hinzufügen, löschen)',
    defaultProps: {
      sectionTitle: 'Häufige Fragen',
      sectionSubtitle: 'Antworten auf die wichtigsten Fragen zum Coaching.',
      faqs: [
        { question: 'Für wen ist das Immobiliencoaching geeignet?', answer: 'Für alle, die systematisch in Immobilien als Kapitalanlage einsteigen oder ihr Portfolio ausbauen wollen – ob Quereinsteiger oder mit Vorerfahrung.' },
        { question: 'Was ist im Coaching enthalten?', answer: 'Ein komplettes System: Strategie zur Auswahl der richtigen Immobilien, Zugang zu Deal-Flow und Off-Market-Deals, Methodik für Due Diligence, Kauf und Vermietung, sowie 1:1-Coaching und Zugang zur Community.' },
        { question: 'Gibt es eine Zufriedenheitsgarantie?', answer: 'Ja. Sollte dir das Coaching nach dem vereinbarten Zeitraum nicht gefallen, bekommst du dein Geld zurück. So kannst du risikofrei starten.' },
      ] as FaqItem[],
    },
  },
  website_footer: {
    label: 'Footer',
    description: 'Copyright, optionale Subline, Icon-Links (intern später)',
    defaultProps: {
      copyrightText: '© Alle Rechte vorbehalten.',
      sublineText: 'Impressum · Datenschutz · Cookies (Links folgen)',
    },
  },
  // Template „ImmoSparplan“
  website_testimonials_infinite: {
    label: 'Testimonials (unendlich)',
    description: 'Kundenstimmen mit Bild-Slider-Hintergrund, endlos laufende Karten',
    defaultProps: {
      sectionTitle: 'Bereits mehr als 230 Kunden freuen sich über den Kauf ihrer Immobilie',
      sectionSubtitle: 'Echte Erfahrungen aus dem Immobiliencoaching.',
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
      sectionTitle: 'Mit vermieteten Immobilien in die finanzielle Freiheit – wir begleiten Sie in 8 Wochen zu Ihrer ersten Immobilie.',
      highlightWords: ['finanzielle Freiheit', '8 Wochen', 'ersten', 'Immobilie'],
      processHeadline: 'Der Prozess – Ihr Weg zur erfolgreichen Immobilieninvestition',
      processBadgeColor: '#cb530a',
      processSteps: [
        { number: '1', title: 'Individuelle Beratung', description: 'Wir analysieren Ihre finanzielle Situation und Anlageziele, um Sie sicher und verständlich durch den Immobilienmarkt zu führen.', icon: '💬' },
        { number: '2', title: 'Gezielte Objektauswahl', description: 'Wir ermitteln Ihre Anforderungen und finden gezielt Immobilien, die perfekt zu Ihnen passen und Ihren Kriterien entsprechen.', icon: '🏠' },
        { number: '3', title: 'Full-Service-Konzept', description: 'Von der Finanzierung über den Notartermin bis zur Verwaltung – wir begleiten Sie in jeder Phase und arbeiten mit erfahrenen Partnern zusammen.', icon: '✅' },
        { number: '4', title: 'Expert werden', description: 'Exklusive Inhalte, Vernetzung mit Investoren und Zugang zur Experten-Plattform.', icon: '🚀', href: '/experts', ctaText: 'Zum Experten-Bereich' },
      ] as BeratungProcessStepItem[],
      statsHeadline: 'Bereits mehr als 230 Kunden freuen sich über den Kauf ihrer Immobilie',
      statsSubheadline: 'Über den Kauf ihrer Immobilie.',
      stats: [
        { value: 230, label: 'Zufriedene Kunden', suffix: '+', icon: '🏠' },
        { value: 8, label: 'Wochen zur ersten Immobilie', suffix: '', icon: '⏱️' },
        { value: 500, label: 'Potenzielle Hochrendite-Immobilien 2026', suffix: '+', icon: '📊' },
        { value: 10, label: 'Jahre Erfahrung am Markt', suffix: '+', icon: '⭐' },
      ] as StatItem[],
    },
  },
  website_claim_parallax: {
    label: 'Claim Parallax',
    description: 'Scroll-Animation: 4 Card-Typen (Beratung Trust+CTA, Planung zwei Zeilen+Status, Bau Bild+Overlay, Wert Zahl+CTA)',
    defaultProps: {
      claimHeadlineLine1: 'Ihre Immobilie.',
      claimHeadlineLine2: 'Ihr Vermögen.',
      ctaText: 'Jetzt unverbindlich beraten lassen – Ihr Traumhaus beginnt hier.',
      listPhaseSidebarText: 'Von der ersten Beratung bis zur Schlüsselübergabe – wir begleiten Sie in jeder Phase Ihres Projekts.',
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
    defaultProps: { word1: 'Expats', word2: 'Experts', word3: 'Exparts' },
  },
  website_stacked_sheets: {
    label: 'Gestapelte Blätter',
    description: 'Scroll: Blätter werden nacheinander weggezogen',
    defaultProps: {
      sheet1Title: 'Expats',
      sheet1Body: 'Investieren wie ein Insider: klar, schnell, planbar. Dein Einstieg in Immobilien – ohne Fachchinesisch.',
      sheet2Title: 'Experts',
      sheet2Body: 'Marketing-Ansatz statt Banken-Drama: Strategie, Deals, Umsetzung. Du bekommst den Plan – wir liefern die Klarheit.',
      sheet3Title: 'Exparts',
      sheet3Body: "Vom ersten Objekt bis zur Routine: wiederholbare Prozesse, starke Partner, echte Ergebnisse. Let's go.",
    },
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
export type EditablePropType = 'text' | 'url' | 'textarea' | 'richtext' | 'image' | 'image_array' | 'color' | 'fontsize' | 'fontsize_responsive' | 'fontfamily' | 'testimonials' | 'target_groups' | 'services' | 'benefits' | 'pricing_cards' | 'process_steps' | 'faq_items' | 'beratung_process_steps' | 'beratung_stats';
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
    // Beide Vorlagen: Lauftext (customQuotes wie Parallax), Hintergrundfarbe, Schriftfarbe – gleiche Eigenschaften
    return base;
  }

  return base;
}

/** Einzelne Kundenstimme im Builder */
export type TestimonialItem = { quote: string; name: string; title: string; imageUrl?: string };

/** Einzelne Zielgruppen-Card (Slider): Bild, Slogan auf dem Bild, Überschrift, Text. */
export type TargetGroupItem = {
  title: string;
  description: string;
  icon?: string;
  href?: string;
  image: string;
  imageSlogan?: string;
};

/** Einzelne Service-Card: Bild, Slogan auf dem Bild, Überschrift, Icon, Text, Button. */
export type ServiceItem = {
  title: string;
  description: string;
  icon?: string;
  href?: string;
  image: string;
  imageSlogan?: string;
  buttonText?: string;
};

/** Einzelne Benefit-Card: Icon (Lucide-Name), Icon-Farbe, Headline, Text. */
export type BenefitItem = {
  icon?: string;
  iconColor?: string;
  title: string;
  description: string;
};

/** Einzelne Pricing-Card: Beschreibung, Unterbeschreibung, Preis, Empfehlung, Bullet-Points, Button (intern verlinkt). */
export type PricingCardItem = {
  title: string;           // Beschreibung, z. B. Einstieg
  description: string;     // Unterbeschreibung
  price: string;           // z. B. auf Anfrage
  recommendation?: string; // unter dem Preis, z. B. Ideal für Quereinsteiger
  bulletPoints: string[];  // Aufzählungspunkte
  buttonText?: string;     // Button-Text, Verlinkung intern/Backend
  popular?: boolean;       // „Stolz empfohlen“-Badge
};

/** Einzelner Prozess-Schritt (Basic Prozess): Nummer-Badge, Headline, Text; Schritt 4 optional Button. */
export type ProcessStepItem = {
  number: string;      // z. B. "1", "2", "3", "4"
  title: string;       // Headline der Card
  description: string; // Fließtext
  /** Nur bei Schritt 4: Button-Text (z. B. Jetzt Platz sichern). */
  ctaText?: string;
  /** Nur bei Schritt 4: Link (z. B. /quiz oder #section-xy). */
  href?: string;
};

/** Einzelne FAQ-Frage (Basic FAQ). */
export type FaqItem = {
  question: string;
  answer: string;
};

/** Prozess-Schritt in Parallax Beratung (Sektion 2): Nummer, Headline, Text, optional Icon; Schritt 4 mit Button. */
export type BeratungProcessStepItem = ProcessStepItem & { icon?: string };

/** Einzelne Stat-Card in Parallax Beratung (Sektion 3): Wert, Label, Suffix, Icon. */
export type StatItem = { value: number; label: string; suffix?: string; icon?: string };

export const SECTION_EDITABLE_PROPS: Partial<Record<LandingSectionType, EditablePropDef[]>> = {
  website_jeton_hero: [
    { key: 'headline', label: 'Überschrift Zeile 1', type: 'richtext' },
    { key: 'headlineLine2', label: 'Überschrift Zeile 2', type: 'richtext' },
    { key: 'headlineLine3', label: 'Überschrift Zeile 3', type: 'richtext' },
    { key: 'secondaryCtaHref', label: 'Mehr erfahren führt zu (Sektion)', type: 'url' },
    { key: 'logoUrl', label: 'Site-Logo', type: 'image' },
    { key: 'backgroundImageUrl', label: 'Hintergrundbild', type: 'image' },
    { key: 'overlayColor', label: 'Overlay über Bild (z. B. dunkler Schleier)', type: 'color' },
  ],
  website_marquee: [
    { key: 'text', label: 'Lauftext (Fallback, wenn keine Zeilen unten)', type: 'text' },
    { key: 'customQuotes', label: 'Lauftext (mehrere Zeilen, ein Text pro Zeile)', type: 'textarea' },
    { key: 'backgroundColor', label: 'Hintergrundfarbe', type: 'color' },
    { key: 'textColor', label: 'Schriftfarbe', type: 'color' },
  ],
  website_target_groups: [
    { key: 'sectionTitle', label: 'Überschrift', type: 'richtext' },
    { key: 'sectionSubtitle', label: 'Untertitel', type: 'richtext' },
    { key: 'targetGroups', label: 'Zielgruppen-Cards', type: 'target_groups' },
  ],
  website_testimonials: [
    { key: 'sectionTitle', label: 'Sektions-Titel', type: 'richtext' },
    { key: 'sectionSubtitle', label: 'Untertitel', type: 'richtext' },
    { key: 'testimonials', label: 'Kundenstimmen', type: 'testimonials' },
    { key: 'backgroundSliderImages', label: 'Hintergrund-Slider (Bilder wechseln)', type: 'image_array' },
  ],
  website_quiz_cta: [
    { key: 'title', label: 'Sektions-Titel', type: 'richtext' },
    { key: 'subtitle', label: 'Untertitel', type: 'richtext' },
    { key: 'buttonText', label: 'Button-Text', type: 'text' },
  ],
  website_services: [
    { key: 'sectionTitle', label: 'Sektions-Titel', type: 'richtext' },
    { key: 'sectionSubtitle', label: 'Untertitel', type: 'richtext' },
    { key: 'services', label: 'Service-Cards', type: 'services' },
  ],
  website_benefits: [
    { key: 'sectionTitle', label: 'Sektions-Titel', type: 'richtext' },
    { key: 'sectionSubtitle', label: 'Untertitel', type: 'richtext' },
    { key: 'benefits', label: 'Benefits-Cards', type: 'benefits' },
  ],
  website_pricing: [
    { key: 'sectionTitle', label: 'Sektions-Titel', type: 'richtext' },
    { key: 'sectionSubtitle', label: 'Untertitel', type: 'richtext' },
    { key: 'pricingCards', label: 'Preis-Cards', type: 'pricing_cards' },
  ],
  website_trust: [
    { key: 'sealText', label: 'Siegel-Text', type: 'richtext' },
    { key: 'sectionTitle', label: 'Überschrift', type: 'richtext' },
    { key: 'bodyHtml', label: 'Text (Fett, Kursiv, Farbe, Größe möglich)', type: 'richtext' },
    { key: 'buttonText', label: 'Button-Text', type: 'text' },
  ],
  website_process: [
    { key: 'sectionTitle', label: 'Sektions-Titel', type: 'richtext' },
    { key: 'sectionSubtitle', label: 'Untertitel', type: 'richtext' },
    { key: 'processSteps', label: '4 Prozess-Cards (Nummer, Headline, Text; Card 4 mit Button)', type: 'process_steps' },
  ],
  website_faq: [
    { key: 'sectionTitle', label: 'Sektions-Titel', type: 'richtext' },
    { key: 'sectionSubtitle', label: 'Untertitel', type: 'richtext' },
    { key: 'faqs', label: 'Fragen (Tabs mit + hinzufügen, löschen)', type: 'faq_items' },
  ],
  website_footer: [
    { key: 'copyrightText', label: 'Copyright-Text', type: 'richtext' },
    { key: 'sublineText', label: 'Zeile unter Copyright (optional)', type: 'richtext' },
  ],
  website_testimonials_infinite: [
    { key: 'sectionTitle', label: 'Sektions-Titel', type: 'richtext' },
    { key: 'sectionSubtitle', label: 'Untertitel', type: 'richtext' },
    { key: 'testimonials', label: 'Kundenstimmen', type: 'testimonials' },
    { key: 'backgroundSliderImages', label: 'Hintergrund-Slider (Bilder wechseln)', type: 'image_array' },
  ],
  website_beratung: [
    { key: 'sectionTitle', label: 'Headline (dicke Überschrift mit Hervorhebung)', type: 'richtext' },
    { key: 'highlightWords', label: 'Markierte Wörter (kommagetrennt)', type: 'text' },
    { key: 'processHeadline', label: 'Prozess-Überschrift', type: 'richtext' },
    { key: 'processBadgeColor', label: 'Farbe Nummer-Badges (Prozess)', type: 'color' },
    { key: 'processSteps', label: '4 Prozess-Cards (Nummer, Headline, Text; Card 4 mit Button)', type: 'beratung_process_steps' },
    { key: 'statsHeadline', label: 'Stats-Überschrift', type: 'richtext' },
    { key: 'statsSubheadline', label: 'Stats-Untertitel', type: 'richtext' },
    { key: 'stats', label: '4 Stat-Cards (Wert, Label, Suffix, Icon)', type: 'beratung_stats' },
  ],
  website_claim_parallax: [
    { key: 'claimHeadlineLine1', label: 'Haupttext Zeile 1', type: 'text' },
    { key: 'claimHeadlineLine2', label: 'Haupttext Zeile 2', type: 'text' },
    { key: 'ctaText', label: 'CTA-Text unter den Cards', type: 'textarea' },
    { key: 'listPhaseSidebarText', label: 'Text rechts neben den Cards (wenn vertikal)', type: 'textarea' },
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
  website_words_parallax: [
    { key: 'word1', label: 'Wort 1 (z. B. Expats)', type: 'text' },
    { key: 'word2', label: 'Wort 2 (z. B. Experts)', type: 'text' },
    { key: 'word3', label: 'Wort 3 (z. B. Exparts)', type: 'text' },
  ],
  website_stacked_sheets: [
    { key: 'sheet1Title', label: 'Blatt 1 – Titel', type: 'text' },
    { key: 'sheet1Body', label: 'Blatt 1 – Text', type: 'textarea' },
    { key: 'sheet2Title', label: 'Blatt 2 – Titel', type: 'text' },
    { key: 'sheet2Body', label: 'Blatt 2 – Text', type: 'textarea' },
    { key: 'sheet3Title', label: 'Blatt 3 – Titel', type: 'text' },
    { key: 'sheet3Body', label: 'Blatt 3 – Text', type: 'textarea' },
  ],
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
  | 'marquee_style'
  | 'target_groups_cards'
  | 'services_cards'
  | 'benefits_cards'
  | 'pricing_cards'
  | 'process_cards'
  | 'faq_items'
  | 'cta'
  | 'testimonials'
  | 'testimonials_slider_images'
  | 'copyright'
  | 'highlight'
  | 'beratung_headline'
  | 'beratung_process'
  | 'beratung_stats'
  | 'other';

/** Prop-Key → Element-Kategorie (für Gruppierung in der Icon-Toolbar). */
export const PROP_TO_ELEMENT_KIND: Record<string, ElementKindId> = {
  headline: 'headline',
  headlineLine2: 'headline',
  headlineLine3: 'headline',
  logoUrl: 'logo',
  backgroundImageUrl: 'background',
  overlayColor: 'background',
  sectionTitle: 'section_title',
  sectionSubtitle: 'section_subtitle',
  sealText: 'section_title',
  bodyHtml: 'section_subtitle',
  targetGroups: 'target_groups_cards',
  services: 'services_cards',
  benefits: 'benefits_cards',
  pricingCards: 'pricing_cards',
  processSteps: 'process_cards',
  faqs: 'faq_items',
  text: 'marquee',
  customQuotes: 'marquee',
  backgroundColor: 'marquee_style',
  textColor: 'marquee_style',
  buttonText: 'cta',
  ctaText: 'cta',
  title: 'section_title',
  subtitle: 'section_subtitle',
  secondaryCtaHref: 'cta',
  testimonials: 'testimonials',
  backgroundSliderImages: 'testimonials_slider_images',
  copyrightText: 'copyright',
  sublineText: 'copyright',
  highlightWords: 'highlight',
  processHeadline: 'beratung_process',
  processBadgeColor: 'beratung_process',
  statsHeadline: 'beratung_stats',
  statsSubheadline: 'beratung_stats',
  stats: 'beratung_stats',
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
  word1: 'highlight',
  word2: 'highlight',
  word3: 'highlight',
  sheet1Title: 'section_title',
  sheet1Body: 'section_subtitle',
  sheet2Title: 'section_title',
  sheet2Body: 'section_subtitle',
  sheet3Title: 'section_title',
  sheet3Body: 'section_subtitle',
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
  marquee_style: 'Hintergrund & Schrift',
  target_groups_cards: 'Zielgruppen-Cards',
  services_cards: 'Service-Cards',
  benefits_cards: 'Benefits-Cards',
  pricing_cards: 'Preis-Cards',
  process_cards: 'Prozess-Cards',
  faq_items: 'FAQ-Fragen',
  cta: 'Button / Link',
  testimonials: 'Kundenstimmen',
  testimonials_slider_images: 'Slider-Bilder',
  copyright: 'Copyright',
  highlight: 'Hervorhebung',
  beratung_headline: 'Headline',
  beratung_process: 'Prozess',
  beratung_stats: 'Kunden & Zahlen',
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

const BERATUNG_HEADLINE_KEYS = ['sectionTitle', 'highlightWords'];
const BERATUNG_PROCESS_KEYS = ['processHeadline', 'processBadgeColor', 'processSteps'];
const BERATUNG_STATS_KEYS = ['statsHeadline', 'statsSubheadline', 'stats'];

/** Welche Props zu welcher Kategorie gehören – für eine Sektion die sichtbaren Kategorien ermitteln. */
export function getElementKindsForProps(editableProps: EditablePropDef[], sectionType?: LandingSectionType): ElementKindId[] {
  if (sectionType === 'website_beratung') {
    return ['beratung_headline', 'beratung_process', 'beratung_stats'];
  }
  const kinds = new Set<ElementKindId>();
  for (const p of editableProps) {
    kinds.add(PROP_TO_ELEMENT_KIND[p.key] ?? 'other');
  }
  return Array.from(kinds);
}

/** Props einer Sektion nach Kategorie filtern. */
export function getPropsByKind(editableProps: EditablePropDef[], kind: ElementKindId, sectionType?: LandingSectionType): EditablePropDef[] {
  if (sectionType === 'website_beratung') {
    const keys = kind === 'beratung_headline' ? BERATUNG_HEADLINE_KEYS : kind === 'beratung_process' ? BERATUNG_PROCESS_KEYS : kind === 'beratung_stats' ? BERATUNG_STATS_KEYS : [];
    return editableProps.filter((p) => keys.includes(p.key));
  }
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
