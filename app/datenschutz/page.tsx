import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Datenschutz"
          subtitle="Rechtliches"
          backgroundImage="/images/herobackgeneral3.png"
        />
        <section className="py-20 bg-white dark:bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-800">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  Datenschutzerklärung
                </h2>
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                      1. Datenschutz auf einen Blick
                    </h3>
                    <p>
                      Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
                      personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                      2. Verantwortliche Stelle
                    </h3>
                    <p>
                      Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
                    </p>
                    <p className="mt-2">
                      <strong>Muckenfuss & Nagel</strong><br />
                      Oberderdingen<br />
                      E-Mail: info@muckenfuss-nagel.de
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                      3. Erfassung von Daten auf dieser Website
                    </h3>
                    <p>
                      Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben
                      aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten
                      zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns
                      gespeichert.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                      4. Ihre Rechte
                    </h3>
                    <p>
                      Sie haben jederzeit das Recht, Auskunft über Ihre bei uns gespeicherten
                      personenbezogenen Daten zu erhalten. Außerdem haben Sie ein Recht auf
                      Berichtigung, Löschung oder Einschränkung der Verarbeitung Ihrer Daten.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

