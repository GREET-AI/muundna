'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Building2, Wrench, Users, Calendar, MapPin, Phone, Mail, Home, User } from 'lucide-react';
import IconInput from '../../components/ui/IconInput';
import Toast from '../../components/ui/Toast';

interface QuizData {
  targetGroup?: string[];
  services?: string[];
  timeframe?: string[];
  location?: string;
  companySize?: string;
  selectedPaket?: string;
  optionalAddons?: string | string[];
}

const BASE_STEPS = [
    {
      id: 'targetGroup',
      title: 'Ich bin...',
      subtitle: 'Mehrfachauswahl möglich',
      type: 'multiple',
      options: [
        { id: 'handwerksbetrieb', label: 'Handwerksbetrieb', icon: Wrench },
        { id: 'bauunternehmen', label: 'Bauunternehmen', icon: Building2 },
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
        { id: 'webdesign-app', label: 'Webdesign & App Lösungen' },
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

const ADDON_STEP_PAKET1 = {
  id: 'addons',
  title: 'Optionale Zusatzleistungen (Paket 1)',
  subtitle: 'Sie können Ihr Paket um folgende Option erweitern:',
  type: 'multiple' as const,
  options: [
    { id: 'google-bewertungen', label: 'Google Bewertungen +99 €/Monat (Rezensions-Management, automatisierte Kundenanfragen)' },
  ]
};

const ADDON_STEP_PAKET2 = {
  id: 'addons',
  title: 'Optionale Zusatzleistungen (Paket 2)',
  subtitle: 'Wählen Sie optional ein Social-Media-Add-on:',
  type: 'single' as const,
  options: [
    { id: 'social-none', label: 'Kein Social-Media-Add-on' },
    { id: 'social-basic', label: 'Social Basic +249 €/Monat (1–2 Plattformen, 1–2 Posts/Woche)' },
    { id: 'social-growth', label: 'Social Growth +449 €/Monat (2–3 Plattformen, 2–3 Posts/Woche, Community)' },
    { id: 'social-pro', label: 'Social Pro +749 €/Monat (3–4 Plattformen, 3+ Posts/Woche, Community, Basis-Ads)' },
  ]
};

function QuizContent() {
  const searchParams = useSearchParams();
  const paket = searchParams.get('paket'); // '1' | '2' | null

  const steps = useMemo(() => {
    // Mit Paket: zuerst Paket-Add-ons, dann allgemeine Fragen (ohne „Ich interessiere mich für…“)
    if (paket === '1') return [ADDON_STEP_PAKET1, BASE_STEPS[0], BASE_STEPS[2], BASE_STEPS[3]];
    if (paket === '2') return [ADDON_STEP_PAKET2, BASE_STEPS[0], BASE_STEPS[2], BASE_STEPS[3]];
    // Ohne Paket-Parameter: ursprünglicher Funnel mit allen Schritten
    return BASE_STEPS;
  }, [paket]);

  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>({ ...(paket && { selectedPaket: paket }) });
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

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
        setToastMessage('Ihre Anfrage wurde erfolgreich übermittelt! Wir melden uns schnellstmöglich bei Ihnen.');
        setToastType('success');
        setShowToast(true);
      } else {
        const errorMessage = data.error || 'Ein Fehler ist aufgetreten.';
        setToastMessage(errorMessage);
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Fehler beim Absenden:', error);
      const errorMessage = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepData = steps[currentStep];
  const selectedOptions = quizData[currentStepData?.id as keyof QuizData] ?? (currentStepData?.type === 'multiple' ? [] : '');
  const isAddonStep = currentStepData?.id === 'addons';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3e7] via-white to-[#ffe1c7] relative overflow-hidden quiz-bg">
      {/* Orange animierter Hintergrund-Effekt */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#cb530a]/40 rounded-full blur-3xl animate-quiz-pulse" />
        <div className="absolute top-40 -right-32 w-96 h-96 bg-[#a84308]/30 rounded-full blur-3xl animate-quiz-pulse-delayed" />
      </div>

      <main className="relative z-10 pt-20 pb-16 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Progress Bar */}
            {!showForm && !submitSuccess && (
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Schritt {currentStep + 1} von {steps.length}
                  </span>
                  <span className="text-sm text-gray-600">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
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
                  className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-12 text-center"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 break-words">
                    Vielen Dank! 🎉
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 break-words px-2">
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
                  className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 lg:p-12"
                >
                  <div className="mb-6 md:mb-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 break-words">
                      Letzter Schritt 👋
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 break-words">
                      Bitte teilen Sie uns Ihre Kontaktdaten mit, damit wir mit Ihnen in Kontakt treten können.
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <IconInput
                        icon={<User className="w-5 h-5" />}
                        name="firstName"
                        type="text"
                        placeholder="Vorname"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                      <IconInput
                        icon={<User className="w-5 h-5" />}
                        name="lastName"
                        type="text"
                        placeholder="Nachname"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                    
                    <IconInput
                      icon={<Mail className="w-5 h-5" />}
                      name="email"
                      type="email"
                      placeholder="E-Mail Adresse"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    
                    <IconInput
                      icon={<Phone className="w-5 h-5" />}
                      name="phone"
                      type="tel"
                      placeholder="Ihre Telefonnummer"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    
                    <IconInput
                      icon={<Home className="w-5 h-5" />}
                      name="street"
                      type="text"
                      placeholder="Straße & Haus-Nr."
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    />
                    
                    <IconInput
                      icon={<MapPin className="w-5 h-5" />}
                      name="city"
                      type="text"
                      placeholder="Ihr Wohnort"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="privacy"
                        checked={formData.privacyAccepted}
                        onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
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

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:text-[#cb530a] transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Zurück
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-[#cb530a] text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-[#a84308] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-white/70">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#cb530a] mb-3 break-words">
                      Qualität aus Verantwortung.
                    </h2>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 break-words">
                      Warum für Muckenfuss & Nagel entscheiden?
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base mb-4">
                      Wählen Sie Muckenfuss & Nagel für innovative Lösungen und erstklassigen Service. 
                      Unsere Bürodienstleistungen kombinieren Branchenkenntnis mit modernster Technologie.
                    </p>
                    <ul className="space-y-2 text-sm">
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
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Quiz Section */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-white/70">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 break-words">
                      {currentStepData.title}
                    </h2>
                    {currentStepData.subtitle && (
                      <p className="text-sm sm:text-base text-gray-600 mb-6 md:mb-8 break-words">
                        {currentStepData.subtitle}
                      </p>
                    )}

                    <div className={`grid ${currentStepData.options.length === 4 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-2 sm:gap-3 mb-6 md:mb-8`}>
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
                            className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-left w-full ${
                              isSelected
                                ? 'border-[#cb530a] bg-[#fef3ed]'
                                : 'border-gray-300 hover:border-[#cb530a]/50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center flex-1 min-w-0">
                                {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#cb530a] mr-2 sm:mr-3 flex-shrink-0" />}
                                <span className="font-semibold text-sm sm:text-sm text-gray-800 break-words">
                                  {option.label}
                                </span>
                              </div>
                              {isSelected && (
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#cb530a] rounded-full flex items-center justify-center flex-shrink-0">
                                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:text-[#cb530a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Zurück
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={
                          isAddonStep
                            ? false
                            : currentStepData.type === 'multiple'
                              ? (selectedOptions as string[]).length === 0
                              : !selectedOptions
                        }
                        className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-[#cb530a] text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-[#a84308] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">{currentStep === steps.length - 1 ? 'Weiter zum Formular' : 'Weiter'}</span>
                        <span className="sm:hidden">{currentStep === steps.length - 1 ? 'Zum Formular' : 'Weiter'}</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
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

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Laden…</p>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}

