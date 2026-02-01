import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PlanungsbueroPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Planungsbüro</h1>
          <div className="max-w-4xl">
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Kontaktinformationen
              </h2>
              <p className="text-gray-700 mb-4">
                Hauptstraße 123<br />
                75015 Bretten
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Telefon:</strong> +49 123 456789
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Fax:</strong> +49 123 456788
              </p>
              <p className="text-gray-700">
                <strong>E-Mail:</strong> planung@muckenfussundnagel.de
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Öffnungszeiten
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>Montag - Freitag: 8:00 - 17:00 Uhr</li>
                <li>Samstag: Nach Vereinbarung</li>
                <li>Sonntag: Geschlossen</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

