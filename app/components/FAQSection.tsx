'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Warum sollte ich meine Büroarbeit an Muckenfuss & Nagel auslagern?',
      answer: 'Bei Muckenfuss & Nagel können Sie sich voll auf Ihr Handwerk konzentrieren, während wir alle administrativen Aufgaben übernehmen. Das bedeutet keine monatelange Vertragsbindung, flexible Anpassung nach Bedarf und professionelle Betreuung durch ein Team mit 10+ Jahren Branchenerfahrung. Sie sparen Zeit, steigern Ihre Produktivität und gewinnen neue Kunden durch professionelle Online-Präsenz.'
    },
    {
      question: 'Wie lange bin ich an den Vertrag gebunden?',
      answer: 'Alle unsere Pakete sind monatlich kündbar. Es gibt keine langfristigen Bindungen – Sie können jederzeit flexibel anpassen oder kündigen. Das macht uns zur idealen Lösung für wachsende Unternehmen oder saisonale Schwankungen.'
    },
    {
      question: 'Welche Dienstleistungen sind in den Paketen enthalten?',
      answer: 'Unsere Pakete umfassen Telefonservice, Terminorganisation, Social Media Betreuung, Google Bewertungen und Dokumentation & Reporting. Je nach Paket variieren Umfang und Intensität. Im Enterprise-Paket sind alle Leistungen enthalten plus individuelle Anpassungen und dedizierter Support.'
    },
    {
      question: 'Kann ich mir die Dienstleistungen vorher anschauen?',
      answer: 'Ja, gerne! Wir bieten eine kostenlose, unverbindliche Beratung an. Dabei besprechen wir Ihre individuellen Bedürfnisse und erstellen ein maßgeschneidertes Angebot. Sie können auch einen kostenlosen Probetag nutzen, um unsere Services kennenzulernen.'
    },
    {
      question: 'Wie schnell kann ich starten?',
      answer: 'Nach der unverbindlichen Beratung und Angebotserstellung können wir in der Regel innerhalb von 1-2 Wochen starten. Bei dringenden Anfragen sind auch schnellere Starttermine möglich. Kontaktieren Sie uns einfach für eine individuelle Abstimmung.'
    },
    {
      question: 'Gibt es eine Zufriedenheitsgarantie?',
      answer: 'Ja! Wir bieten eine Zufriedenheitsgarantie: Sollte es Ihnen nach einem Monat nicht gefallen, bekommen Sie Ihr Geld zurück. Zusätzlich können Sie einen kostenlosen Probetag nutzen, um unsere Services risikofrei zu testen.'
    },
    {
      question: 'Betreuen Sie auch Unternehmen außerhalb Deutschlands?',
      answer: 'Ja, wir betreuen Handwerksbetriebe und Bauunternehmen in ganz Deutschland, der Schweiz und Österreich. Unser Standort in Oberderdingen ist ideal gelegen für die Betreuung im gesamten DACH-Raum.'
    },
    {
      question: 'Wie funktioniert die Zusammenarbeit?',
      answer: 'Nach der Beratung und Angebotserstellung erhalten Sie einen dedizierten Ansprechpartner. Wir richten alle notwendigen Systeme ein (Telefon, E-Mail, Social Media, etc.) und starten mit der Betreuung. Sie erhalten monatliche Berichte und haben jederzeit Einblick in alle Aktivitäten.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4 break-words">
              Häufige Fragen
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 break-words">
              Sind bei Ihnen noch Fragen offen?
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
                className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white pr-4 break-words">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform ${
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
                      <div className="px-6 py-4 text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-200 dark:border-gray-800">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Weitere Fragen? Wir helfen Ihnen gerne weiter.
            </p>
            <a
              href="mailto:info@muckenfussundnagel.de"
              className="inline-flex items-center text-[#cb530a] dark:text-[#182c30] font-semibold hover:underline"
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

