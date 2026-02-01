import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function KarrierePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Karriere</h1>
          <div className="max-w-4xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-12">
              Werden Sie Teil unseres Teams und gestalten Sie die Zukunft des
              Bauwesens mit.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/karriere/stellenangebote"
                className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Stellenangebote
                </h3>
                <p className="text-gray-600">Aktuelle Jobangebote</p>
              </Link>
              <Link
                href="/karriere/wer-sind-wir"
                className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Wer sind wir?
                </h3>
                <p className="text-gray-600">Lernen Sie uns kennen</p>
              </Link>
              <Link
                href="/karriere/was-machen-wir"
                className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Was machen wir?
                </h3>
                <p className="text-gray-600">Unsere Tätigkeitsfelder</p>
              </Link>
              <Link
                href="/karriere/bewerben"
                className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Bewerben
                </h3>
                <p className="text-gray-600">Jetzt bewerben</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

