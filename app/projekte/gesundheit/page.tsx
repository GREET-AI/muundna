import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function GesundheitPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Gesundheitssektor</h1>
          <div className="max-w-4xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-12">
              Wir entwickeln moderne Einrichtungen für die Gesundheitsversorgung.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Gesundheitsprojekt {i}
                  </h3>
                  <p className="text-gray-700">
                    Beschreibung des Gesundheitsprojekts.
                  </p>
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

