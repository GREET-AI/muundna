'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Printer } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-white border-b border-gray-200 px-4 py-3 shadow-sm print:hidden">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#a84308]">
          <Image src="/logoneu.png" alt="Muckenfuss & Nagel" width={120} height={40} className="h-8 w-auto" />
        </Link>
        <Button
          type="button"
          onClick={() => window.print()}
          className="bg-[#a84308] hover:bg-[#8f3a07]"
        >
          <Printer className="w-4 h-4 mr-2" />
          Als PDF speichern
        </Button>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-10 pb-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Allgemeine Geschäftsbedingungen (AGB)</h1>
        <p className="text-sm text-gray-500 mb-8">Muckenfuss & Nagel – Bürodienstleistungen für Handwerk und Bau</p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">§ 1 Geltungsbereich</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen Muckenfuss & Nagel und dem Kunden über Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen. Abweichende Bedingungen des Kunden werden nicht anerkannt, sofern nicht ausdrücklich schriftlich zugestimmt wird.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">§ 2 Vertragsschluss</h2>
            <p>
              Angebote von Muckenfuss & Nagel sind freibleibend. Ein Vertrag kommt durch schriftliche Auftragsbestätigung oder durch Beginn der Leistungserbringung zustande. Mündliche Nebenabreden bestehen nicht.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">§ 3 Leistungsumfang</h2>
            <p>
              Der Umfang der zu erbringenden Leistungen ergibt sich aus der Leistungsbeschreibung im Angebot bzw. der Auftragsbestätigung. Nachträgliche Änderungen und Erweiterungen bedürfen der Schriftform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">§ 4 Preise und Zahlung</h2>
            <p>
              Es gelten die im Angebot genannten Preise. Alle Preise verstehen sich zzgl. der gesetzlichen Mehrwertsteuer. Die Zahlung erfolgt nach Rechnungsstellung mit einer Frist von 14 Tagen, sofern nicht anders vereinbart. Bei Zahlungsverzug sind Verzugszinsen in gesetzlicher Höhe zu entrichten.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">§ 5 Laufzeit und Kündigung</h2>
            <p>
              Die Laufzeit des Vertrages ergibt sich aus dem Angebot. Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Die Kündigung bedarf der Schriftform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">§ 6 Vertraulichkeit</h2>
            <p>
              Beide Parteien verpflichten sich, vertrauliche Informationen der anderen Partei nicht an Dritte weiterzugeben und nur für die Vertragserfüllung zu nutzen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">§ 7 Schlussbestimmungen</h2>
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz von Muckenfuss & Nagel. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-gray-500">
          Stand: Februar 2025 · Muckenfuss & Nagel · Bürodienstleistungen für Handwerk und Bau
        </p>
      </main>
    </div>
  );
}
