'use client';

import { useState } from 'react';
import Footer from '../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, User, Mail, Phone, Home, MapPin } from 'lucide-react';
import IconInput from '../../components/ui/IconInput';
import Toast from '../../components/ui/Toast';
import Link from 'next/link';

const SOCIAL_IDS = ['social-basic', 'social-growth', 'social-pro'] as const;

const ENTERPRISE_MODULES = [
  { id: 'telefonie', label: 'Telefonie (erweitert)', price: 599, details: 'Max. 500 Anrufe/1.200 Min., Branding bis 10 Mitarbeiter. Extra: 1,80 €/Anruf.' },
  { id: 'telefonie-24h', label: '24/7-Option (nur mit Telefonie)', price: 200, details: 'Telefonie rund um die Uhr', requires: 'telefonie' as const },
  { id: 'email-kalender', label: 'E-Mail, Kalender & Terminlegung', price: 299, details: 'Max. 300 E-Mails, 200 Termine, CRM-Sync. Extra: 0,50 €/E-Mail, 3 €/Termin.' },
  { id: 'google', label: 'Google Bewertungen (erweitert)', price: 199, details: 'Unbegrenzt Anfragen, Automatisierung, Reporting. Basis max. 100; Extra: 3 €/Anfrage.' },
  { id: 'social-basic', label: 'Social Media Basic', price: 249, details: '1–2 Plattformen, 1–2 Posts/Woche (Mix Bild/Video), max. 8 Posts/Monat. Extra: 30 €/Post.' },
  { id: 'social-growth', label: 'Social Media Growth', price: 449, details: '2–3 Plattformen, 2–3 Posts/Woche, Community max. 50 Interaktionen, max. 12 Posts/Monat. Extra: 25 €/Post.' },
  { id: 'social-pro', label: 'Social Media Pro', price: 749, details: '3–4 Plattformen, 3+ Posts/Woche, Voll-Mix + Community bis 8 Std., max. 20 Posts/Monat. Extra: 20 €/Post.' },
  { id: 'reporting', label: 'Reporting & Dokumentation', price: 99, details: 'Wöchentliche/monatliche KPIs, Custom-Dashboards.' },
  { id: 'website', label: 'Website-Entwicklung & Betreuung', priceOnce: 2000, priceMonthly: 99, details: 'Einmalig ab 2.000 € (Basis-Site: responsiv, SEO) + 99 €/Monat (Updates, Hosting, max. 4 Std. Änderungen; Extra: 50 €/Stunde). E-Commerce +500 € einmalig.' },
] as const;

function getDiscount(monthlySum: number): { percent: number; label: string } {
  if (monthlySum >= 2000) return { percent: 20, label: '20 % Rabatt' };
  if (monthlySum >= 1500) return { percent: 15, label: '15 % Rabatt' };
  if (monthlySum >= 1000) return { percent: 10, label: '10 % Rabatt' };
  return { percent: 0, label: '' };
}

export default function EnterpriseKonfiguratorPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    privacyAccepted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const toggleModule = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        if (id === 'telefonie') next.delete('telefonie-24h');
      } else {
        if (SOCIAL_IDS.includes(id as typeof SOCIAL_IDS[number])) {
          SOCIAL_IDS.forEach((s) => next.delete(s));
          next.add(id);
        } else if (id === 'telefonie-24h') {
          if (next.has('telefonie')) next.add(id);
        } else if (id === 'telefonie') {
          next.add(id);
        } else {
          next.add(id);
        }
      }
      return next;
    });
  };

  const monthlySum = ENTERPRISE_MODULES.reduce((sum, m) => {
    if (!selected.has(m.id)) return sum;
    if ('requires' in m && m.requires && !selected.has(m.requires)) return sum;
    if ('priceMonthly' in m && m.priceMonthly) return sum + m.priceMonthly;
    if ('price' in m) return sum + (m as { price: number }).price;
    return sum;
  }, 0);

  const onceSum = ENTERPRISE_MODULES.reduce((sum, m) => {
    if (!selected.has(m.id) || !('priceOnce' in m) || !m.priceOnce) return sum;
    return sum + (m as { priceOnce: number }).priceOnce;
  }, 0);

  const discount = getDiscount(monthlySum);
  const monthlyAfterDiscount = discount.percent ? Math.round(monthlySum * (1 - discount.percent / 100)) : monthlySum;
  const saved = monthlySum - monthlyAfterDiscount;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacyAccepted) {
      alert('Bitte akzeptieren Sie die Datenschutzerklärung.');
      return;
    }
    setIsSubmitting(true);
    try {
      const selectedModules = ENTERPRISE_MODULES.filter((m) => selected.has(m.id)).map((m) => {
        const mo = m as { priceOnce?: number; priceMonthly?: number; price?: number };
        if (mo.priceOnce != null && mo.priceMonthly != null) return `${m.label} (einmalig ${mo.priceOnce} € + ${mo.priceMonthly} €/Monat)`;
        return `${m.label} (${mo.price ?? 0} €/Monat)`;
      });
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quizData: {
            paket: 'enterprise',
            enterpriseModuleSelection: Array.from(selected),
            enterpriseSummary: {
              monthlyNetto: monthlyAfterDiscount,
              monthlyBrutto: Math.round(monthlyAfterDiscount * 1.19),
              onceNetto: onceSum,
              discount: discount.percent,
              selectedModules,
            },
          },
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitSuccess(true);
        setToastMessage('Ihre Anfrage wurde erfolgreich übermittelt! Wir melden uns schnellstmöglich bei Ihnen.');
        setToastType('success');
        setShowToast(true);
      } else {
        setToastMessage(data.error || 'Ein Fehler ist aufgetreten.');
        setToastType('error');
        setShowToast(true);
      }
    } catch {
      setToastMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <Link href="/#pricing" className="text-[#cb530a] hover:underline text-sm flex items-center gap-1">
                ← Zurück zu den Paketen
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
                Paket 3: Enterprise – Ihr Paket zusammenstellen
              </h1>
              <p className="text-gray-600 mt-1">
                Wählen Sie die Module. Volumenrabatt wird automatisch berechnet (10 % ab 1.000 €, 15 % ab 1.500 €, 20 % ab 2.000 € monatlich).
              </p>
            </div>

            <AnimatePresence mode="wait">
              {submitSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Vielen Dank!</h2>
                  <p className="text-gray-600 mb-8">
                    Wir haben Ihre Enterprise-Anfrage erhalten und melden uns schnellstmöglich bei Ihnen mit einem passenden Angebot.
                  </p>
                  <Link href="/" className="inline-flex items-center px-6 py-3 bg-[#cb530a] text-white font-semibold rounded-lg hover:bg-[#a84308] transition-colors">
                    Zur Startseite
                  </Link>
                </motion.div>
              ) : showForm ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-lg p-6 md:p-8"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Ihre Auswahl – Nächster Schritt</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Monatlich (netto): <strong>{monthlyAfterDiscount.toLocaleString('de-DE')} €</strong>
                    {onceSum > 0 && (
                      <> · Einmalig: <strong>{onceSum.toLocaleString('de-DE')} €</strong></>
                    )}
                    {discount.percent > 0 && (
                      <span className="ml-2 text-green-600">({discount.label}, Sie sparen {saved} €/Monat)</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mb-6">Bitte Kontaktdaten angeben – wir erstellen Ihr individuelles Angebot.</p>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <IconInput icon={<User className="w-5 h-5" />} name="firstName" type="text" placeholder="Vorname" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                      <IconInput icon={<User className="w-5 h-5" />} name="lastName" type="text" placeholder="Nachname" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                    </div>
                    <IconInput icon={<Mail className="w-5 h-5" />} name="email" type="email" placeholder="E-Mail" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    <IconInput icon={<Phone className="w-5 h-5" />} name="phone" type="tel" placeholder="Telefon" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    <IconInput icon={<Home className="w-5 h-5" />} name="street" type="text" placeholder="Straße & Hausnr." value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} />
                    <IconInput icon={<MapPin className="w-5 h-5" />} name="city" type="text" placeholder="Ort" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                    <div className="flex items-start">
                      <input type="checkbox" id="privacy" checked={formData.privacyAccepted} onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })} className="mt-1 mr-3 w-5 h-5 text-[#cb530a] border-gray-300 rounded focus:ring-[#cb530a] cursor-pointer" required />
                      <label htmlFor="privacy" className="text-sm text-gray-700 cursor-pointer">
                        Datenschutz gelesen und akzeptiert * <a href="/datenschutz" className="text-[#cb530a] hover:underline">Datenschutzerklärung</a>
                      </label>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                        Zurück
                      </button>
                      <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 bg-[#cb530a] text-white font-semibold rounded-lg hover:bg-[#a84308] disabled:opacity-70">
                        {isSubmitting ? 'Wird gesendet…' : 'Anfrage absenden'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div key="config" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                  <div className="space-y-4 mb-8">
                    {ENTERPRISE_MODULES.map((m) => {
                      const isSelected = selected.has(m.id);
                      const requires = 'requires' in m ? (m as { requires?: string }).requires : undefined;
                      const isDisabled = requires && !selected.has(requires);
                      const priceLabel = 'priceOnce' in m
                        ? `Einmalig ${(m as { priceOnce?: number }).priceOnce?.toLocaleString('de-DE')} € + ${(m as { priceMonthly?: number }).priceMonthly} €/Monat`
                        : `${(m as { price: number }).price.toLocaleString('de-DE')} €/Monat`;
                      return (
                        <label
                          key={m.id}
                          className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-colors ${
                            isDisabled ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-75' : 'cursor-pointer'
                          } ${isSelected ? 'border-[#cb530a] bg-[#fef3ed]' : !isDisabled ? 'border-gray-200 hover:border-gray-300' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={!!isDisabled}
                            onChange={() => !isDisabled && toggleModule(m.id)}
                            className="mt-1 w-5 h-5 text-[#cb530a] border-gray-300 rounded focus:ring-[#cb530a] disabled:opacity-50"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-semibold text-gray-800">{m.label}</span>
                              <span className="text-sm font-medium text-[#cb530a]">{priceLabel}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{m.details}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Monatlich (netto, nur wiederkehrende Module)</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {monthlySum > 0 ? monthlySum.toLocaleString('de-DE') : '0'} €
                          {discount.percent > 0 && (
                            <span className="text-lg font-normal text-green-600 ml-2">
                              → {monthlyAfterDiscount.toLocaleString('de-DE')} € {discount.label}
                            </span>
                          )}
                        </p>
                        {onceSum > 0 && (
                          <p className="text-sm text-gray-600 mt-1">Einmalig: {onceSum.toLocaleString('de-DE')} € (zählt nicht in Rabatt)</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(true)}
                      disabled={selected.size === 0}
                      className="flex-1 px-6 py-3 bg-[#cb530a] text-white font-semibold rounded-lg hover:bg-[#a84308] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Jetzt zusammenstellen und Anfrage senden
                    </button>
                  </div>
                  {selected.size === 0 && <p className="text-sm text-gray-500 mt-2">Bitte wählen Sie mindestens ein Modul.</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
      <Toast message={toastMessage} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
