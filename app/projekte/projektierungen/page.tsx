import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ProjektierungenPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Projektierungen</h1>
          <div className="max-w-4xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-12">
              Wir übernehmen die vollständige Projektierung Ihrer Bauvorhaben
              von der Planung bis zur Umsetzung.
            </p>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Unsere Leistungen
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li>• Projektplanung und -steuerung</li>
                <li>• Architektur und Design</li>
                <li>• Kostenplanung und Budgetierung</li>
                <li>• Baumanagement</li>
                <li>• Qualitätssicherung</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

