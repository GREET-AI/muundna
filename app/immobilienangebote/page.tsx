import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ImmobilienangebotePage() {
  const immobilien = [
    {
      title: 'Wohnung in Bretten',
      location: 'Bretten',
      size: '85 m²',
      rooms: '3 Zimmer',
      price: 'Auf Anfrage',
    },
    {
      title: 'Einfamilienhaus Bruchsal',
      location: 'Bruchsal',
      size: '150 m²',
      rooms: '5 Zimmer',
      price: 'Auf Anfrage',
    },
    {
      title: 'Büroräume Karlsruhe',
      location: 'Karlsruhe',
      size: '200 m²',
      rooms: 'Bürofläche',
      price: 'Auf Anfrage',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Immobilienangebote
          </h1>
          <div className="max-w-4xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-12">
              Aktuelle Immobilienangebote von Südbau.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {immobilien.map((immobilie, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {immobilie.title}
                  </h3>
                  <div className="space-y-2 text-gray-700 mb-4">
                    <p>📍 {immobilie.location}</p>
                    <p>📐 {immobilie.size}</p>
                    <p>🚪 {immobilie.rooms}</p>
                    <p className="font-bold text-gray-800">{immobilie.price}</p>
                  </div>
                  <button className="w-full bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 transition-colors">
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

