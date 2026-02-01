'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getRoute } from '../utils/routes';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    functional: true,
    preferences: false,
    statistics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      functional: true,
      preferences: true,
      statistics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      functional: true,
      preferences: false,
      statistics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl"
        >
          <div className="container mx-auto px-4 py-6">
            {!showSettings ? (
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                      Cookie-Zustimmung verwalten
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Um dir ein optimales Erlebnis zu bieten, verwenden wir Technologien wie Cookies, 
                      um Geräteinformationen zu speichern und/oder darauf zuzugreifen. Wenn du diesen 
                      Technologien zustimmst, können wir Daten wie das Surfverhalten oder eindeutige IDs 
                      auf dieser Website verarbeiten.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <Link
                        href={getRoute('Datenschutz')}
                        className="text-[#cb530a] dark:text-[#182c30] hover:underline"
                      >
                        Datenschutz
                      </Link>
                      <span className="text-gray-400">•</span>
                      <Link
                        href={getRoute('Impressum')}
                        className="text-[#cb530a] dark:text-[#182c30] hover:underline"
                      >
                        Impressum
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      Einstellungen
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      Ablehnen
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="px-4 py-2 bg-[#cb530a] text-white rounded-lg hover:bg-[#a84308] transition-colors text-sm font-medium"
                    >
                      Akzeptieren
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                  Cookie-Einstellungen
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="font-semibold text-gray-800 dark:text-white mr-2">
                          Funktional
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Immer aktiv</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Die technische Speicherung oder der Zugang ist unbedingt erforderlich für den 
                        rechtmäßigen Zweck, die Nutzung eines bestimmten Dienstes zu ermöglichen.
                      </p>
                    </div>
                  </div>
                  {['preferences', 'statistics', 'marketing'].map((key) => (
                    <div
                      key={key}
                      className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="font-semibold text-gray-800 dark:text-white">
                            {key === 'preferences' && 'Vorlieben'}
                            {key === 'statistics' && 'Statistiken'}
                            {key === 'marketing' && 'Marketing'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {key === 'preferences' && 'Die technische Speicherung oder der Zugriff ist für den rechtmäßigen Zweck der Speicherung von Präferenzen erforderlich.'}
                          {key === 'statistics' && 'Die technische Speicherung oder der Zugriff, der ausschließlich zu statistischen Zwecken erfolgt.'}
                          {key === 'marketing' && 'Die technische Speicherung oder der Zugriff ist erforderlich, um Nutzerprofile zu erstellen, um Werbung zu versenden.'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input
                          type="checkbox"
                          checked={preferences[key as keyof typeof preferences]}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              [key]: e.target.checked
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#cb530a]/30 dark:peer-focus:ring-[#182c30]/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#cb530a] dark:peer-checked:bg-[#182c30]"></div>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    Zurück
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-4 py-2 bg-[#cb530a] text-white rounded-lg hover:bg-[#a84308] transition-colors text-sm font-medium"
                  >
                    Einstellungen speichern
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

