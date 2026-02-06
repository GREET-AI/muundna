import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

export default function ImpressumPage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection
          title="Impressum"
          subtitle="Rechtliches"
          backgroundImage="/images/Referenzen.png"
        />
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Angaben gemäß § 5 TMG</h2>
                
                <div className="space-y-6 text-gray-700 mb-8">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Muckenfuss & Nagel</p>
                    <p className="mb-1">Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen</p>
                    <p className="mb-1">Oberderdingen</p>
                    <p className="mb-1">Deutschland</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Kontakt:</p>
                    <p className="mb-1">Tel.: +49 (0) 123 - 456 789</p>
                    <p className="mb-1">Fax: +49 (0) 123 - 456 790</p>
                    <p className="mb-1">E-Mail: info@muckenfussundnagel.de</p>
                    <p className="mb-1">Website: www.muckenfussundnagel.de</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8 mt-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Verantwortlich für den Inhalt</h3>
                  <p className="text-gray-700 mb-4">
                    Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV ist der Geschäftsführer von Muckenfuss & Nagel.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-8 mt-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Haftungsausschluss</h3>
                  
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">Haftung für Inhalte</h4>
                      <p className="mb-2">
                        Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                      </p>
                      <p>
                        Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">Haftung für Links</h4>
                      <p className="mb-2">
                        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
                      </p>
                      <p>
                        Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">Urheberrecht</h4>
                      <p className="mb-2">
                        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                      </p>
                      <p>
                        Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
