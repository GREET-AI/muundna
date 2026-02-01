import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function ProjektePage() {
  const projekte = [
    { title: 'Aktuelle Projekte', href: '/projekte/aktuell' },
    { title: 'Wohnen', href: '/projekte/wohnen' },
    { title: 'Seniorenwohnen & Pflege', href: '/projekte/senioren' },
    { title: 'Gesundheitssektor', href: '/projekte/gesundheit' },
    { title: 'Gewerbe- & Industriebau', href: '/projekte/gewerbe' },
    { title: 'Büro & Dienstleistung', href: '/projekte/buero' },
    { title: 'Projektierungen', href: '/projekte/projektierungen' },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Alle Projekte</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projekte.map((projekt, index) => (
              <Link
                key={index}
                href={projekt.href}
                className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {projekt.title}
                </h3>
                <p className="text-gray-600">Mehr erfahren →</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

