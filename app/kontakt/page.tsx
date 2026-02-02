'use client';

import { useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import CTASection from '../components/CTASection';
import GlowingEffect from '../components/ui/GlowingEffect';
import StatefulButton from '../components/ui/StatefulButton';
import VanishInput from '../components/ui/VanishInput';
import IconInput from '../components/ui/IconInput';
import Confetti from '../components/ui/Confetti';
import Toast from '../components/ui/Toast';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, CheckCircle2, MessageSquare, Calendar, Users, User, Home } from 'lucide-react';
import ExpertiseCTABanner from '../components/ExpertiseCTABanner';

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    service: '',
    message: ''
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!privacyAccepted) {
      alert('Bitte akzeptieren Sie die Datenschutzerklärung.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setShowConfetti(true);
        setToastMessage('Ihre Anfrage wurde erfolgreich übermittelt! Wir melden uns schnellstmöglich bei Ihnen.');
        setToastType('success');
        setShowToast(true);
        // Formular zurücksetzen
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          street: '',
          city: '',
          service: '',
          message: ''
        });
        setPrivacyAccepted(false);
        // Confetti wird automatisch nach 3 Sekunden ausgeblendet
      } else {
        setToastMessage(data.error || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        setToastType('error');
        setShowToast(true);
        setSubmitError(data.error || 'Ein Fehler ist aufgetreten.');
      }
    } catch (error) {
      console.error('Fehler beim Absenden:', error);
      const errorMessage = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const quickContactItems = [
    {
      icon: Phone,
      title: 'Telefon',
      content: '+49 (0) 123 - 456 789',
      description: 'Von 08:00 – 18:00 Uhr erreichbar.',
      link: 'tel:+49123456789',
      color: 'text-[#cb530a]'
    },
    {
      icon: Mail,
      title: 'E-Mail',
      content: 'info@muckenfussundnagel.de',
      description: 'Wir antworten schnellstmöglich.',
      link: 'mailto:info@muckenfussundnagel.de',
      color: 'text-[#cb530a]'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      content: 'Oberderdingen',
      description: 'Deutschland, Schweiz, Österreich',
      link: '#',
      color: 'text-[#cb530a]'
    }
  ];

  const whyContactItems = [
    {
      icon: CheckCircle2,
      title: 'Kostenlose Beratung',
      description: 'Unverbindliches Erstgespräch ohne Verpflichtungen'
    },
    {
      icon: MessageSquare,
      title: 'Schnelle Antwort',
      description: 'Wir antworten innerhalb von 24 Stunden'
    },
    {
      icon: Calendar,
      title: 'Flexible Termine',
      description: 'Wir passen uns Ihrem Zeitplan an'
    },
    {
      icon: Users,
      title: 'Erfahrene Experten',
      description: '10+ Jahre Erfahrung im Bauwesen'
    }
  ];

  const contactFAQs = [
    {
      question: 'Wie schnell erhalte ich eine Antwort?',
      answer: 'Wir antworten auf alle Anfragen innerhalb von 24 Stunden. Bei dringenden Anliegen können Sie uns auch telefonisch erreichen.'
    },
    {
      question: 'Kann ich einen Termin vor Ort vereinbaren?',
      answer: 'Ja, gerne! Wir bieten sowohl Online-Beratungen als auch Termine vor Ort in Oberderdingen an. Kontaktieren Sie uns einfach für eine Terminvereinbarung.'
    },
    {
      question: 'Gibt es eine kostenlose Erstberatung?',
      answer: 'Ja, wir bieten eine kostenlose, unverbindliche Erstberatung an. Dabei besprechen wir Ihre individuellen Bedürfnisse und erstellen ein maßgeschneidertes Angebot.'
    },
    {
      question: 'Welche Zahlungsmethoden akzeptieren Sie?',
      answer: 'Wir akzeptieren verschiedene Zahlungsmethoden. Die Details besprechen wir gerne in einem persönlichen Gespräch.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Kontakt"
          subtitle="Kontakt aufnehmen"
          description="Wie Sie uns erreichen können"
          backgroundImage="/images/herobackgeneral5.png"
        />

        <ExpertiseCTABanner />

        {/* Schnell-Kontakt Sektion */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Schnell-Kontakt
                </h2>
                <p className="text-xl text-gray-600">
                  Erreichen Sie uns auf dem Weg, der für Sie am bequemsten ist
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {quickContactItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fef3ed] mb-4 ${item.color}`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <div className="p-6 text-center">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {item.title}
                          </h3>
                          <a
                            href={item.link}
                            className={`block text-lg font-semibold ${item.color} mb-2 hover:underline`}
                          >
                            {item.content}
                          </a>
                          <p className="text-gray-600 text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Warum uns kontaktieren */}
        <section className="py-20 bg-[#fef3ed]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Warum uns kontaktieren?
                </h2>
                <p className="text-xl text-gray-600">
                  Vorteile einer Zusammenarbeit mit Muckenfuss & Nagel
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyContactItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#cb530a] text-white mb-4">
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Kontaktformular */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Schreiben Sie uns
                </h2>
                <p className="text-xl text-gray-600">
                  Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen
                </p>
              </div>

              <GlowingEffect className="mb-8">
                <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-gray-200 hover:border-[#cb530a]/50 transition-all duration-300 hover:shadow-2xl">
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <IconInput
                        icon={<User className="w-5 h-5" />}
                        name="firstName"
                        type="text"
                        placeholder="Vorname"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange(e)}
                      />
                      <IconInput
                        icon={<User className="w-5 h-5" />}
                        name="lastName"
                        type="text"
                        placeholder="Nachname"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange(e)}
                      />
                    </div>
                    
                    <IconInput
                      icon={<Mail className="w-5 h-5" />}
                      name="email"
                      type="email"
                      placeholder="E-Mail Adresse"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange(e)}
                    />
                    
                    <IconInput
                      icon={<Phone className="w-5 h-5" />}
                      name="phone"
                      type="tel"
                      placeholder="Ihre Telefonnummer"
                      value={formData.phone}
                      onChange={(e) => handleInputChange(e)}
                    />
                    
                    <IconInput
                      icon={<Home className="w-5 h-5" />}
                      name="street"
                      type="text"
                      placeholder="Straße & Haus-Nr."
                      value={formData.street || ''}
                      onChange={(e) => handleInputChange(e)}
                    />
                    
                    <IconInput
                      icon={<MapPin className="w-5 h-5" />}
                      name="city"
                      type="text"
                      placeholder="Ihr Wohnort"
                      value={formData.city || ''}
                      onChange={(e) => handleInputChange(e)}
                    />
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Interessierte Dienstleistung
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a] focus:border-[#cb530a] transition-all hover:border-gray-400"
                      >
                        <option value="">Bitte wählen...</option>
                        <option>Telefonservice & Kommunikation</option>
                        <option>Terminorganisation</option>
                        <option>Social Media Betreuung</option>
                        <option>Google Bewertungen</option>
                        <option>Dokumentation & Reporting</option>
                        <option>Mehrere Dienstleistungen</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Nachricht *
                      </label>
                      <textarea
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Ihre Nachricht an uns..."
                        required
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a] focus:border-[#cb530a] transition-all hover:border-gray-400"
                      ></textarea>
                    </div>
                    
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="privacy"
                        checked={privacyAccepted}
                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                        className="mt-1 mr-3 w-5 h-5 text-[#cb530a] border-gray-300 rounded focus:ring-[#cb530a] cursor-pointer"
                        required
                      />
                      <label htmlFor="privacy" className="text-sm text-gray-700 cursor-pointer">
                        Datenschutzbestimmungen gelesen und akzeptiert *
                        <a href="/datenschutz" className="text-[#182c30] hover:underline ml-1">
                          (Datenschutzerklärung)
                        </a>
                      </label>
                    </div>
                    
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-800 text-sm">{submitError}</p>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center px-6 py-4 bg-[#cb530a] text-white text-lg font-semibold rounded-lg hover:bg-[#a84308] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Wird gesendet...' : (
                        <>
                          Jetzt anfragen
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </GlowingEffect>
            </div>
          </div>
        </section>

        {/* Öffnungszeiten & Standort */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <Clock className="w-8 h-8 text-[#cb530a] mr-3" />
                    <h3 className="text-2xl font-bold text-gray-800">
                      Öffnungszeiten
                    </h3>
                  </div>
                  <div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="font-semibold text-gray-800">Montag - Freitag</span>
                      <span className="text-gray-600">08:00 – 18:00 Uhr</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="font-semibold text-gray-800">Samstag</span>
                      <span className="text-gray-600">Nach Vereinbarung</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Sonntag</span>
                      <span className="text-gray-600">Geschlossen</span>
                    </div>
                  </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <MapPin className="w-8 h-8 text-[#cb530a] mr-3" />
                    <h3 className="text-2xl font-bold text-gray-800">
                      Standort & Betreuung
                    </h3>
                  </div>
                  <div>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-gray-800 mb-2">Büro Oberderdingen</p>
                      <p className="text-gray-600">
                        Deutschland
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="font-semibold text-gray-800 mb-2">Betreuungsgebiet</p>
                      <p className="text-gray-600">
                        Deutschland, Schweiz, Österreich
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="font-semibold text-gray-800 mb-2">Zielgruppe</p>
                      <p className="text-gray-600">
                        Handwerksbetriebe & Bauunternehmen
                      </p>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Sektion */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Häufige Fragen zum Kontakt
                </h2>
                <p className="text-xl text-gray-600">
                  Antworten auf die am häufigsten gestellten Fragen
                </p>
              </div>
              
              <div className="space-y-4">
                {contactFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Sektion */}
        <CTASection
          title="Bereit für die Zusammenarbeit?"
          description="Kontaktieren Sie uns noch heute und lassen Sie uns gemeinsam die optimale Lösung für Ihr Unternehmen finden."
          primaryButtonText="Jetzt unverbindlich anfragen"
          variant="gradient"
        />
      </main>
      <Footer />
      <Confetti trigger={showConfetti} duration={3000} />
      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
        duration={5000}
      />
    </div>
  );
}
