import Header from '../components/Header';
import Footer from '../components/Footer';

export default function NewsPage() {
  const news = [
    {
      title: 'Städtische Kommunalbau Oberderdingens beauftragt Südbau',
      date: '15. Januar 2024',
      category: 'Projekte',
    },
    {
      title: 'Ärztehaus auf dem Rechberg in Bretten feiert Richtfest',
      date: '10. Dezember 2023',
      category: 'Projekte',
    },
    {
      title: 'Südbau erwirbt weitere Grundstücke von RKH Kliniken',
      date: '5. November 2023',
      category: 'Unternehmen',
    },
    {
      title: 'Fertigstellung Dienstleistungszentrum Bretten',
      date: '20. Oktober 2023',
      category: 'Projekte',
    },
    {
      title: 'Einweihung Kindergarten Kraichgau Hüpfer',
      date: '1. September 2023',
      category: 'Projekte',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">News / Presse</h1>
          <div className="max-w-4xl">
            <div className="space-y-6">
              {news.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm text-gray-500">{item.date}</span>
                    <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {item.title}
                  </h3>
                  <button className="mt-4 text-gray-800 font-medium hover:text-gray-600">
                    Weiterlesen →
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

