import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function WasBietenWirPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Was bieten wir?</h1>
          <div className="max-w-4xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-12">
              Als Arbeitgeber bieten wir attraktive Konditionen und
              Entwicklungsmöglichkeiten.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Attraktive Vergütung',
                'Flexible Arbeitszeiten',
                'Weiterbildungsmöglichkeiten',
                'Betriebliche Altersvorsorge',
                'Betriebssport',
                'Mitarbeiter-Events',
              ].map((leistung, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-gray-800">
                    {leistung}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

