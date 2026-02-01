import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

export default function ImpressumPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Impressum"
          subtitle="Rechtliches"
          backgroundImage="/images/herobackgeneral2.png"
        />
        <section className="py-20 bg-white dark:bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-800">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  Angaben gemäß § 5 TMG
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p>
                    <strong>Muckenfuss & Nagel</strong><br />
                    Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen
                  </p>
                  <p>
                    <strong>Standort:</strong><br />
                    Oberderdingen<br />
                    Deutschland
                  </p>
                  <p>
                    <strong>Kontakt:</strong><br />
                    E-Mail: info@muckenfuss-nagel.de
                  </p>
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      Verantwortlich für den Inhalt
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV ist der Geschäftsführer
                      von Muckenfuss & Nagel.
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

