import Header from '../../components/Header';
import HeroSection from '../../components/HeroSection';
import Footer from '../../components/Footer';

export default function AnfragePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Anfrage stellen"
          subtitle="Kontakt"
          description="Lassen Sie uns gemeinsam die optimale Lösung für Ihr Unternehmen finden"
          backgroundImage="/images/herobackgeneral6.png"
        />
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Unverbindliche Anfrage
                </h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Name / Firma *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Interessierte Dienstleistung
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a]">
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
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a]"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full text-lg px-6 py-3 bg-[#cb530a] text-white font-semibold rounded-lg shadow-lg hover:bg-[#a84308] transition-colors"
                  >
                    Anfrage absenden
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

