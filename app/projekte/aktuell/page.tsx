import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AktuelleProjektePage() {
  const projekte = [
    {
      title: 'Betreutes Wohnen Oberderdingen',
      description: 'Städtische Kommunalbau Oberderdingens beauftragt Südbau mit Planung / Projektsteuerung',
    },
    {
      title: 'Gesundheitscampus Rechberg',
      description: 'Meilenstein für medizinische Versorgung',
    },
    {
      title: 'Ärztehaus Bruchsal',
      description: 'Südbau erwirbt weitere Grundstücke von RKH Kliniken des Landkreises Karlsruhe',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Aktuelle Projekte</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projekte.map((projekt, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {projekt.title}
                </h3>
                <p className="text-gray-700">{projekt.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

