import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function WenSuchenWirPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Wen suchen wir?</h1>
          <div className="max-w-4xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-12">
              Wir suchen engagierte Fachkräfte, die unsere Vision teilen.
            </p>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Ihre Qualifikationen
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li>• Abgeschlossenes Studium oder Ausbildung im Bauwesen</li>
                <li>• Mehrjährige Berufserfahrung</li>
                <li>• Teamfähigkeit und Kommunikationsstärke</li>
                <li>• Eigeninitiative und Verantwortungsbewusstsein</li>
                <li>• Bereitschaft zur Weiterbildung</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

