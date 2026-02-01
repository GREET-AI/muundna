import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function TeamPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Team</h1>
          <div className="max-w-4xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-12">
              Unser erfahrenes Team steht für Kompetenz, Engagement und
              Leidenschaft im Bauwesen.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Platzhalter für Team-Mitglieder */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                    Team-Mitglied {i}
                  </h3>
                  <p className="text-gray-600 text-center">Position</p>
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

