import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function WerSindWirPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Wer sind wir?</h1>
          <div className="max-w-4xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Südbau ist ein führendes Unternehmen im Bereich Bauentwicklung
              und Projektmanagement. Wir verbinden jahrzehntelange Erfahrung
              mit innovativen Lösungen.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Unsere Werte
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Qualität und Präzision</li>
                  <li>• Nachhaltigkeit</li>
                  <li>• Kundenorientierung</li>
                  <li>• Innovation</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Unser Team
                </h3>
                <p className="text-gray-700">
                  Ein engagiertes Team aus erfahrenen Fachkräften, die gemeinsam
                  erfolgreiche Projekte realisieren.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

