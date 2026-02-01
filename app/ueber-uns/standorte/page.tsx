import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function StandortePage() {
  const standorte = [
    { name: 'Bretten', adresse: 'Hauptstraße 123, 75015 Bretten' },
    { name: 'Bruchsal', adresse: 'Musterstraße 45, 76646 Bruchsal' },
    { name: 'Karlsruhe', adresse: 'Beispielweg 78, 76131 Karlsruhe' },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Standorte</h1>
          <div className="max-w-4xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-12">
              Unsere Standorte in der Region.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {standorte.map((standort, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {standort.name}
                  </h3>
                  <p className="text-gray-700">{standort.adresse}</p>
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

