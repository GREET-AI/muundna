import Footer from '../../components/Footer';

export default function VertriebsbueroPage() {
  return (
    <div className="min-h-screen">
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Vertriebsbüro</h1>
          <div className="max-w-4xl">
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Kontaktinformationen
              </h2>
              <p className="text-gray-700 mb-4">
                Musterstraße 45<br />
                76646 Bruchsal
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Telefon:</strong> +49 123 456790
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Fax:</strong> +49 123 456791
              </p>
              <p className="text-gray-700">
                <strong>E-Mail:</strong> vertrieb@muckenfussundnagel.de
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Öffnungszeiten
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>Montag - Freitag: 9:00 - 18:00 Uhr</li>
                <li>Samstag: 10:00 - 14:00 Uhr</li>
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

