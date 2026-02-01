import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function StellenangebotePage() {
  const stellen = [
    {
      title: 'Projektmanager (m/w/d)',
      location: 'Bretten',
      type: 'Vollzeit',
    },
    {
      title: 'Architekt (m/w/d)',
      location: 'Karlsruhe',
      type: 'Vollzeit',
    },
    {
      title: 'Bauleiter (m/w/d)',
      location: 'Bruchsal',
      type: 'Vollzeit',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Stellenangebote</h1>
          <div className="max-w-4xl">
            <div className="space-y-6">
              {stellen.map((stelle, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {stelle.title}
                  </h3>
                  <div className="flex gap-4 text-gray-600 mb-4">
                    <span>📍 {stelle.location}</span>
                    <span>⏰ {stelle.type}</span>
                  </div>
                  <button className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 transition-colors">
                    Mehr erfahren
                  </button>
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

