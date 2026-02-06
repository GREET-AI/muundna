'use client';

const QUOTES = [
  'Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen.',
  'Telefonservice · Terminorganisation · Social Media · Google Bewertungen · Dokumentation · Webdesign & Apps.',
  'Professionell. Zuverlässig. Individuell.',
  '10+ Jahre Erfahrung im Bauwesen.',
  'Deutschland, Schweiz, Österreich – überregionale Betreuung.',
  'Wir übernehmen Ihre Büroarbeit – Sie konzentrieren sich auf Ihr Kerngeschäft.',
  'Maßgeschneiderte Lösungen für Ihre Branche.',
  'Jetzt unverbindlich anfragen.',
  'Muckenfuss & Nagel – Ihr Partner für Bürodienstleistungen.',
];

export default function MarqueeBanner() {
  return (
    <div className="w-full py-4 overflow-hidden bg-[#cb530a] border-y border-white/20">
      <div className="flex w-max items-center whitespace-nowrap text-sm md:text-base font-normal uppercase tracking-wide animate-marquee-right text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">
        {QUOTES.map((quote, index) => (
          <span key={index} className="mx-8 shrink-0">
            {quote}
          </span>
        ))}
        {QUOTES.map((quote, index) => (
          <span key={`dup-${index}`} className="mx-8 shrink-0">
            {quote}
          </span>
        ))}
      </div>
    </div>
  );
}
