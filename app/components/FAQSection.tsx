'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RichTextBlock } from './ui/RichTextBlock';
import type { FaqItem } from '@/types/landing-section';

const DEFAULT_PRIMARY = '#cb530a';

const DEFAULT_FAQ_TITLE = 'Häufige Fragen';
const DEFAULT_FAQ_SUBTITLE = 'Rund um unsere Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen';

const WEBSITE_FAQS = [
  { question: 'Warum sollten Sie Ihre Büroarbeit an Muckenfuss & Nagel auslagern?', answer: 'Bei Muckenfuss & Nagel können Sie sich voll auf Ihr Handwerk konzentrieren, während wir alle administrativen Aufgaben übernehmen. Das bedeutet keine monatelange Vertragsbindung, flexible Anpassung nach Bedarf und professionelle Betreuung durch ein Team mit 10+ Jahren Branchenerfahrung. Sie sparen Zeit, steigern Ihre Produktivität und gewinnen neue Kunden durch professionelle Online-Präsenz.' },
  { question: 'Wie lange sind Sie an den Vertrag gebunden?', answer: 'Unsere Pakete sind monatlich kündbar – keine langfristigen Bindungen. Sie können die Zusammenarbeit flexibel anpassen.' },
  { question: 'Welche Dienstleistungen sind in den Paketen enthalten?', answer: 'Je nach Paket: Telefonie (Anrufannahme, Weiterleitung), E-Mail-Betreuung, Kalender & Terminlegung, optional Google Bewertungen, bei Professional erweiterte Telefonie und Social Media modular. Enterprise ist voll modular – alle Komponenten frei kombinierbar. Details im Kennenlerngespräch.' },
  { question: 'Können Sie sich die Dienstleistungen vorher anschauen?', answer: 'Ja. Vereinbaren Sie ein unverbindliches Erstgespräch. Wir besprechen Ihren Bedarf und zeigen, wie die Zusammenarbeit aussehen kann. Außerdem gilt unsere Zufriedenheitsgarantie.' },
  { question: 'Wie schnell können Sie starten?', answer: 'Nach dem Kennenlerngespräch und Ihrer Entscheidung starten wir in der Regel zeitnah – keine langen Wartezeiten, wir sind schnell und flexibel.' },
  { question: 'Gibt es eine Zufriedenheitsgarantie?', answer: 'Ja. Sollte es Ihnen nach einem Monat nicht gefallen, bekommen Sie Ihr Geld zurück. So können Sie risikofrei starten.' },
  { question: 'Betreuen Sie auch Unternehmen außerhalb Deutschlands?', answer: 'Ja. Wir betreuen Kunden in Deutschland, Schweiz und Österreich – überregionale Betreuung im DACH-Raum.' },
  { question: 'Wie funktioniert die Zusammenarbeit?', answer: 'In vier Schritten: Erstgespräch (unverbindlich), Bedarfsanalyse, maßgeschneidertes Angebot, Start. Wir übernehmen Ihre Büroarbeit – Sie konzentrieren sich auf Ihr Kerngeschäft.' },
];

const COACHING_FAQS = [
  { question: 'Für wen ist das Immobiliencoaching geeignet?', answer: 'Für alle, die systematisch in Immobilien als Kapitalanlage einsteigen oder ihr Portfolio ausbauen wollen – ob Quereinsteiger oder mit Vorerfahrung. Du erhältst Zugang zu exklusiven Strategien, Deal-Flow und einem Netzwerk, plus 1:1-Betreuung und ein klares System von der Auswahl bis zu Kauf und Vermietung.' },
  { question: 'Was ist im Coaching enthalten?', answer: 'Ein komplettes System: Strategie zur Auswahl der richtigen Immobilien, Zugang zu Deal-Flow und Off-Market-Deals, Methodik für Due Diligence, Kauf und Vermietung, sowie 1:1-Coaching und Zugang zur Community. Die genauen Module und den Umfang besprechen wir im Kennenlerngespräch.' },
  { question: 'Kann ich das Coaching vorher unverbindlich kennenlernen?', answer: 'Ja. Du kannst ein unverbindliches Kennenlerngespräch vereinbaren. Dort besprechen wir deine Ziele und ob das Coaching zu dir passt. Außerdem gilt unsere Zufriedenheitsgarantie – solltest du nach dem vereinbarten Zeitraum nicht zufrieden sein, bekommst du dein Geld zurück.' },
  { question: 'Wie schnell kann ich starten?', answer: 'Nach dem Kennenlerngespräch und deiner Entscheidung startest du in der Regel innerhalb kurzer Zeit. Die genaue Dauer und Ablauf hängen vom gewählten Modul und deiner Verfügbarkeit ab.' },
  { question: 'Gibt es eine Zufriedenheitsgarantie?', answer: 'Ja. Sollte dir das Coaching nach dem vereinbarten Zeitraum nicht gefallen, bekommst du dein Geld zurück. So kannst du risikofrei starten.' },
  { question: 'Was unterscheidet dieses Coaching von anderen Angeboten?', answer: 'Die Kombination aus exklusiven Strategien, echtem Deal-Flow und Netzwerk, 1:1-Betreuung und einem durchgängigen System – von der richtigen Immobilie bis zu Kauf und Vermietung. Keine graue Theorie, sondern praxisnah und umsetzbar.' },
  { question: 'Wie funktioniert der Zugang zum Mitgliederbereich?', answer: 'Nach deiner Buchung erhältst du Zugang zum geschützten Mitgliederbereich mit allen Inhalten, dem Netzwerk und der Community. Der Login erfolgt über die Login-Seite mit deinen Zugangsdaten.' },
];

export default function FAQSection({ primaryColor = DEFAULT_PRIMARY, secondaryColor, sectionTitle, sectionSubtitle, faqs: faqsProp }: { primaryColor?: string; secondaryColor?: string; sectionTitle?: string; sectionSubtitle?: string; faqs?: FaqItem[] } = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isWebsite = sectionTitle === undefined && sectionSubtitle === undefined && (faqsProp == null || faqsProp.length === 0);
  const fallbackFaqs = isWebsite ? WEBSITE_FAQS : COACHING_FAQS;
  const faqs = Array.isArray(faqsProp) && faqsProp.length > 0 ? faqsProp : fallbackFaqs;
  const faqTitle = sectionTitle ?? DEFAULT_FAQ_TITLE;
  const faqSubtitle = sectionSubtitle ?? (isWebsite ? DEFAULT_FAQ_SUBTITLE : 'Sind bei dir noch Fragen offen?');

  return (
    <section className="py-20 bg-white bg-dot-pattern relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 break-words">
              <RichTextBlock html={faqTitle} tag="span" />
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 break-words">
              <RichTextBlock html={faqSubtitle} tag="span" />
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base text-gray-800 pr-4 break-words">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 text-gray-700 leading-relaxed border-t border-gray-200">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              {isWebsite ? 'Weitere Fragen? Wir helfen Ihnen gerne weiter.' : 'Weitere Fragen? Wir helfen dir gerne weiter.'}
            </p>
            <a
              href="mailto:info@muckenfussundnagel.de"
              className="inline-flex items-center font-semibold hover:underline"
              style={{ color: primaryColor }}
            >
              Kontakt aufnehmen
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

