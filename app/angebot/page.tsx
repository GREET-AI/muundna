'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type AngebotData = {
  headline?: string;
  subline?: string;
  kundeName?: string;
  kundeFirma?: string;
  kundeStrasse?: string;
  kundePlzOrt?: string;
  produkt?: string;
  preis?: string;
  originalPreis?: string;
  laufzeit?: string;
  zusatz?: string;
};

const ABSENDER = {
  firma: 'Muckenfuss & Nagel',
  strasse: 'Oberderdingen',
  plzOrt: 'Deutschland',
};
const GESCHAEFTSFUEHRER = 'Sven Muckenfuss & Pascal Nagel';
const BANK = { konto: '—', blz: '—', bank: '—', iban: '—' };
const KONTAKT = { email: 'info@muckenfussundnagel.de', web: 'www.muckenfussundnagel.de', tel: '—' };

function parseEuro(s: string): number {
  const n = parseFloat(String(s).replace(/[^\d,.-]/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function formatEuro(n: number): string {
  return n.toLocaleString('de-DE', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function AngebotContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<AngebotData | null>(null);

  useEffect(() => {
    const d = searchParams.get('d');
    if (!d) {
      setData(null);
      return;
    }
    try {
      const decoded = decodeURIComponent(d);
      const parsed = JSON.parse(decoded) as AngebotData;
      setData(parsed);
    } catch {
      setData(null);
    }
  }, [searchParams]);

  useEffect(() => {
    if (data) document.title = 'Angebot';
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-600">Keine Angebotsdaten. Bitte Vorschau aus dem CRM öffnen.</p>
      </div>
    );
  }

  const netto = parseEuro(data.preis ?? '');
  const mwst = netto * 0.19;
  const brutto = netto + mwst;
  const originalPreis = data.originalPreis ? parseEuro(data.originalPreis) : 0;
  const showRabatt = originalPreis > netto && netto > 0;
  const heute = new Date();
  const gueltigBis = new Date(heute);
  gueltigBis.setDate(gueltigBis.getDate() + 14);

  return (
    <div className="min-h-screen bg-white" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      <div className="fixed top-4 right-4 z-50 flex gap-2 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 rounded-lg bg-[#a84308] text-white text-sm font-medium shadow hover:bg-[#8f3a07]"
        >
          Als PDF speichern
        </button>
        <Link
          href="/agb"
          target="_blank"
          rel="noopener"
          className="px-4 py-2 rounded-lg bg-neutral-700 text-white text-sm font-medium shadow hover:bg-neutral-800 no-underline"
        >
          AGB
        </Link>
      </div>

      {/* Hero */}
      <div className="relative w-full h-[200px] overflow-hidden">
        <Image src="/images/Büro.png" alt="" fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-black/35" aria-hidden />
        <Image
          src="/logotransparent.png"
          alt="Muckenfuss & Nagel"
          width={160}
          height={44}
          className="absolute top-5 left-6 h-11 w-auto"
          unoptimized
        />
      </div>

      {/* Orangener Balken – immer "Ihr persönliches Angebot" */}
      <div
        className="w-full py-4 px-6 text-white"
        style={{
          background: 'linear-gradient(135deg, #d45d0f 0%, #a84308 100%)',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
      >
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-xl font-bold m-0">Ihr persönliches Angebot</h1>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 pb-32 text-gray-800">
        {/* Empfänger links (mehr Platz), Angebotsnummer/Datum rechts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Empfänger</p>
            {(data.kundeFirma || data.kundeName) && (
              <p className="text-sm m-0 leading-snug">
                {data.kundeFirma && <span className="block">{data.kundeFirma}</span>}
                {data.kundeName && <span className="block">{data.kundeName}</span>}
                {data.kundeStrasse && <span className="block">{data.kundeStrasse}</span>}
                {data.kundePlzOrt && <span className="block">{data.kundePlzOrt}</span>}
              </p>
            )}
            {!data.kundeFirma && !data.kundeName && (
              <p className="text-sm text-gray-500 m-0">Empfänger GmbH<br />Musterstraße 123<br />12345 Berlin</p>
            )}
          </div>
          <div className="md:text-right">
            <p className="text-sm m-0 text-gray-600">
              Angebotsnummer: XXXX<br />
              Datum: {formatDate(heute)}<br />
              Gültig bis: {formatDate(gueltigBis)}
            </p>
            <p className="text-sm font-semibold text-gray-700 mt-3 mb-1">{ABSENDER.firma}</p>
            <p className="text-sm m-0 leading-snug">{ABSENDER.strasse}<br />{ABSENDER.plzOrt}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-center mt-10 mb-6">Angebot</h2>

        <p className="text-sm mb-2">Sehr geehrte Damen und Herren,</p>
        <p className="text-sm mb-6 m-0">vielen Dank für Ihre Anfrage. Gern senden wir Ihnen folgendes Angebot:</p>

        {/* Tabelle Pos. | Beschreibung | Menge | Einzelpreis | Gesamtpreis */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left font-semibold">Pos.</th>
                <th className="border border-gray-300 p-2 text-left font-semibold">Beschreibung</th>
                <th className="border border-gray-300 p-2 text-right font-semibold">Menge</th>
                <th className="border border-gray-300 p-2 text-right font-semibold">Einzelpreis</th>
                <th className="border border-gray-300 p-2 text-right font-semibold">Gesamtpreis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">1</td>
                <td className="border border-gray-300 p-2">{data.produkt || 'Leistung'}</td>
                <td className="border border-gray-300 p-2 text-right">1,00</td>
                <td className="border border-gray-300 p-2 text-right">{netto > 0 ? formatEuro(netto) : '—'}</td>
                <td className="border border-gray-300 p-2 text-right">{netto > 0 ? formatEuro(netto) : '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Preisübersicht rechts */}
        <div className="flex justify-end mt-4">
          <div className="w-full max-w-[280px] text-sm">
            <div className="flex justify-between py-1">
              <span>Nettopreis</span>
              <span>{formatEuro(netto)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>zzgl. Umsatzsteuer</span>
              <span>19 %</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Umsatzsteuer</span>
              <span>{formatEuro(mwst)}</span>
            </div>
            <div
              className="flex justify-between py-2 px-3 mt-2 font-bold bg-amber-100 rounded"
              style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
            >
              <span>Angebotsbetrag</span>
              <span>{formatEuro(brutto)}</span>
            </div>
            {showRabatt && (
              <div
                className="mt-3 py-2 px-3 rounded border-l-4 border-green-600 bg-green-50 text-sm"
                style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
              >
                <span className="line-through text-gray-500 mr-2">Statt {formatEuro(originalPreis)}</span>
                <span className="font-bold text-green-800">jetzt {formatEuro(netto)} netto ({formatEuro(brutto)} brutto)</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm mt-6 mb-4">Zahlungsziel: 14 Tage netto ab Rechnungsdatum.</p>

        {data.zusatz && <p className="text-sm mb-4">{data.zusatz}</p>}

        <p className="text-sm mb-2">Ich freue mich auf Ihre Rückmeldung und stehe für Rückfragen jederzeit zur Verfügung.</p>
        <p className="text-sm mb-1">Mit freundlichen Grüßen</p>
        <p className="text-sm font-semibold m-0">{GESCHAEFTSFUEHRER}</p>

        <p className="text-xs text-gray-500 mt-8 m-0">Angebot freibleibend. Gültig 14 Tage ab Angebotsdatum. Es gelten unsere AGB.</p>

        {/* Kleiner Footer: auf Bildschirm unten, beim Drucken auf jeder Seite */}
        <div
          className="mt-10 pt-4 border-t border-gray-200 text-xs text-gray-600 angebot-footer"
          style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              .angebot-footer { position: fixed; bottom: 0; left: 0; right: 0; margin: 0; margin-top: 0 !important; background: #f9fafb; padding: 6px 24px; }
            }
          `}} />
          <div className="max-w-[800px] mx-auto flex flex-wrap justify-between gap-3">
            <span className="font-semibold text-gray-700">{GESCHAEFTSFUEHRER}</span>
            <span>HRB-Nr. — · Ust-IDNr. —</span>
            <span>Konto: {BANK.konto} · BLZ: {BANK.blz} · {BANK.bank}</span>
            <span>E-Mail: {KONTAKT.email} · {KONTAKT.web} · Tel: {KONTAKT.tel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AngebotPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100"><p className="text-gray-600">Laden …</p></div>}>
      <AngebotContent />
    </Suspense>
  );
}
