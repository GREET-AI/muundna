'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Building2, Wrench, Users, Calendar, MapPin, Phone, Mail, Home } from 'lucide-react';

interface QuizData {
  targetGroup?: string[];
  services?: string[];
  timeframe?: string[];
  location?: string;
  companySize?: string;
}

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    privacyAccepted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const steps = [
    {
      id: 'targetGroup',
      title: 'Ich bin...',
      subtitle: 'Mehrfachauswahl möglich',
      type: 'multiple',
      options: [
        { id: 'handwerksbetrieb', label: 'Handwerksbetrieb', icon: Wrench },
        { id: 'bauunternehmen', label: 'Bauunternehmen', icon: Building2 },
        { id: 'hoch-tiefbau', label: 'Hoch- & Tiefbau', icon: Building2 },
        { id: 'sanierung', label: 'Sanierung & Renovierung', icon: Home },
      ]
    },
    {
      id: 'services',
      title: 'Ich interessiere mich für...',
      subtitle: 'Mehrfachauswahl möglich',
      type: 'multiple',
      options: [
        { id: 'telefonservice', label: 'Telefonservice & Kommunikation' },
        { id: 'terminorganisation', label: 'Terminorganisation' },
        { id: 'social-media', label: 'Social Media Betreuung' },
        { id: 'google-bewertungen', label: 'Google Bewertungen' },
        { id: 'dokumentation', label: 'Dokumentation & Reporting' },
        { id: 'mehrere', label: 'Mehrere Dienstleistungen' },
      ]
    },
    {
      id: 'timeframe',
      title: 'Wann benötigen Sie Unterstützung?',
      subtitle: 'Mehrfachauswahl möglich',
      type: 'multiple',
      options: [
        { id: 'sofort', label: 'Sofort' },
        { id: '1-monat', label: 'In einem Monat' },
        { id: '3-6-monate', label: 'In 3-6 Monaten' },
        { id: 'nach-ruecksprache', label: 'Nach Rücksprache' },
      ]
    },
    {
      id: 'location',
      title: 'Wo dürfen wir Sie beraten?',
      subtitle: '',
      type: 'single',
      options: [
        { id: 'vor-ort', label: 'Bei Ihnen vor Ort', icon: MapPin },
        { id: 'online', label: 'Online / Video-Call', icon: Phone },
        { id: 'egal', label: 'Das ist egal', icon: Mail },
      ]
    },
  ];

  const handleOptionSelect = (stepId: string, optionId: string, type: string) => {
    setQuizData(prev => {
      if (type === 'multiple') {
        const current = prev[stepId as keyof QuizData] as string[] || [];
        const newValue = current.includes(optionId)
          ? current.filter(id => id !== optionId)
          : [...current, optionId];
        return { ...prev, [stepId]: newValue };
      } else {
        return { ...prev, [stepId]: optionId };
      }
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowForm(true);
    }
  };

  const handleBack = () => {
    if (showForm) {
      setShowForm(false);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacyAccepted) {
      alert('Bitte akzeptieren Sie die Datenschutzerklärung.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quizData: quizData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        alert(data.error || 'Ein Fehler ist aufgetreten.');
      }
    } catch (error) {
      console.error('Fehler beim Absenden:', error);
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepData = steps[currentStep];
  const selectedOptions = quizData[currentStepData?.id as keyof QuizData] as string[] || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Header />
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Progress Bar */}
            {!showForm && !submitSuccess && (
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Schritt {currentStep + 1} von {steps.length}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <motion.div
                    className="bg-[#cb530a] h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {submitSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    Vielen Dank! 🎉
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Wir haben Ihre Anfrage erhalten und melden uns schnellstmöglich bei Ihnen.
                  </p>
                  <a
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-[#cb530a] text-white font-semibold rounded-lg hover:bg-[#a84308] transition-colors"
                  >
                    Zur Startseite
                  </a>
                </motion.div>
              ) : showForm ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 md:p-12"
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                      Letzter Schritt 👋
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Bitte teilen Sie uns Ihre Kontaktdaten mit, damit wir mit Ihnen in Kontakt treten können.
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                          Vorname *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a] dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                          Nachname *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a] dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        E-Mail Adresse *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a] dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Ihre Telefonnummer
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a] dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Straße & Haus-Nr.
                      </label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a] dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Ihr Wohnort
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a] dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="privacy"
                        checked={formData.privacyAccepted}
                        onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                        className="mt-1 mr-3 w-4 h-4 text-[#cb530a] border-gray-300 rounded focus:ring-[#cb530a]"
                        required
                      />
                      <label htmlFor="privacy" className="text-sm text-gray-700 dark:text-gray-300">
                        Datenschutzbestimmungen gelesen und akzeptiert *
                      </label>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-[#cb530a] transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Zurück
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center px-6 py-3 bg-[#cb530a] text-white font-semibold rounded-lg hover:bg-[#a84308] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Wird gesendet...' : 'Jetzt anfragen'}
                        {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                >
                  {/* Left: Info Section */}
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-[#cb530a] mb-4">
                      Qualität aus Verantwortung.
                    </h2>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                      Warum für Muckenfuss & Nagel entscheiden?
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      Wählen Sie Muckenfuss & Nagel für innovative Lösungen und erstklassigen Service. 
                      Unsere Bürodienstleistungen kombinieren Branchenkenntnis mit modernster Technologie.
                    </p>
                    <ul className="space-y-3">
                      {[
                        'Made in Germany – Höchste Qualität.',
                        'Branchenkenntnis – 10+ Jahre Bau-Erfahrung.',
                        'Maßgeschneidert – Individuelle Lösungen.',
                        'Zuverlässig – Pünktliche Lieferung.',
                        'Transparent – Klare Dokumentation.',
                        'Eigener Ansprechpartner – Für jedes Projekt'
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-[#cb530a] mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Quiz Section */}
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                      {currentStepData.title}
                    </h2>
                    {currentStepData.subtitle && (
                      <p className="text-gray-600 dark:text-gray-400 mb-8">
                        {currentStepData.subtitle}
                      </p>
                    )}

                    <div className={`grid ${currentStepData.options.length === 4 ? 'grid-cols-2' : 'grid-cols-1'} gap-4 mb-8`}>
                      {currentStepData.options.map((option) => {
                        const Icon = 'icon' in option ? option.icon : undefined;
                        const isSelected = Array.isArray(selectedOptions)
                          ? selectedOptions.includes(option.id)
                          : selectedOptions === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleOptionSelect(currentStepData.id, option.id, currentStepData.type)}
                            className={`p-6 rounded-lg border-2 transition-all text-left ${
                              isSelected
                                ? 'border-[#cb530a] bg-[#fef3ed] dark:bg-gray-800'
                                : 'border-gray-300 dark:border-gray-700 hover:border-[#cb530a]/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {Icon && <Icon className="w-6 h-6 text-[#cb530a] mr-3" />}
                                <span className="font-semibold text-gray-800 dark:text-white">
                                  {option.label}
                                </span>
                              </div>
                              {isSelected && (
                                <div className="w-6 h-6 bg-[#cb530a] rounded-full flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-[#cb530a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Zurück
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={
                          currentStepData.type === 'multiple'
                            ? (selectedOptions as string[]).length === 0
                            : !selectedOptions
                        }
                        className="flex items-center px-6 py-3 bg-[#cb530a] text-white font-semibold rounded-lg hover:bg-[#a84308] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {currentStep === steps.length - 1 ? 'Weiter zum Formular' : 'Weiter'}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

