import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

export default function CookiesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection
          title="Cookie-Richtlinie"
          subtitle="Rechtliches"
          backgroundImage="/images/herobackgeneral4.png"
        />
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Cookie-Richtlinie</h2>
              
              <div className="mb-8">
                <p className="text-gray-700 mb-4">
                  Diese Cookie-Richtlinie erklärt, wie Muckenfuss & Nagel ("wir", "uns" oder "unser") Cookies und ähnliche Technologien auf unserer Website verwendet und welche Optionen Sie haben.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Was sind Cookies?</h3>
                <p className="text-gray-700 mb-4">
                  Cookies sind kleine Textdateien, die auf Ihrem Gerät (Computer, Tablet oder Mobilgerät) gespeichert werden, wenn Sie eine Website besuchen. Cookies ermöglichen es der Website, Ihr Gerät zu erkennen und sich an bestimmte Informationen über Sie zu erinnern.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Wie verwenden wir Cookies?</h3>
                <p className="text-gray-700 mb-4">
                  Wir verwenden Cookies, um:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Die Funktionalität unserer Website sicherzustellen</li>
                  <li>Ihre Präferenzen zu speichern</li>
                  <li>Die Nutzung unserer Website zu analysieren</li>
                  <li>Ihre Erfahrung zu verbessern</li>
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Arten von Cookies, die wir verwenden</h3>
                
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">Funktionale Cookies (Immer aktiv)</h4>
                  <p className="text-gray-700 mb-2">
                    Die technische Speicherung oder der Zugang ist unbedingt erforderlich für den rechtmäßigen Zweck, die Nutzung eines bestimmten Dienstes zu ermöglichen, der vom Teilnehmer oder Nutzer ausdrücklich gewünscht wird, oder für den alleinigen Zweck, die Übertragung einer Nachricht über ein elektronisches Kommunikationsnetz durchzuführen.
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">Vorlieben-Cookies</h4>
                  <p className="text-gray-700 mb-2">
                    Die technische Speicherung oder der Zugriff ist für den rechtmäßigen Zweck der Speicherung von Präferenzen erforderlich, die nicht vom Abonnenten oder Benutzer angefordert wurden.
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">Statistik-Cookies</h4>
                  <p className="text-gray-700 mb-2">
                    Die technische Speicherung oder der Zugriff, der ausschließlich zu statistischen Zwecken erfolgt. Die technische Speicherung oder der Zugriff, der ausschließlich zu anonymen statistischen Zwecken verwendet wird. Ohne eine Vorladung, die freiwillige Zustimmung deines Internetdienstanbieters oder zusätzliche Aufzeichnungen von Dritten können die zu diesem Zweck gespeicherten oder abgerufenen Informationen allein in der Regel nicht dazu verwendet werden, dich zu identifizieren.
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">Marketing-Cookies</h4>
                  <p className="text-gray-700 mb-2">
                    Die technische Speicherung oder der Zugriff ist erforderlich, um Nutzerprofile zu erstellen, um Werbung zu versenden oder um den Nutzer auf einer Website oder über mehrere Websites hinweg zu ähnlichen Marketingzwecken zu verfolgen.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Ihre Cookie-Einstellungen verwalten</h3>
                <p className="text-gray-700 mb-4">
                  Sie können Ihre Cookie-Einstellungen jederzeit über den Cookie-Banner auf unserer Website verwalten. Sie können auch Ihre Browsereinstellungen ändern, um Cookies zu blockieren oder zu löschen. Bitte beachten Sie jedoch, dass dies die Funktionalität unserer Website beeinträchtigen kann.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Kontakt</h3>
                <p className="text-gray-700 mb-4">
                  Wenn Sie Fragen zu unserer Cookie-Richtlinie haben, kontaktieren Sie uns bitte:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-800 font-semibold mb-2">Muckenfuss & Nagel</p>
                  <p className="text-gray-700 mb-1">E-Mail: info@muckenfussundnagel.de</p>
                  <p className="text-gray-700 mb-1">Tel.: +49 (0) 123 - 456 789</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Änderungen an dieser Richtlinie</h3>
                <p className="text-gray-700 mb-4">
                  Wir behalten uns vor, diese Cookie-Richtlinie von Zeit zu Zeit zu aktualisieren. Wir werden Sie über Änderungen informieren, indem wir die neue Cookie-Richtlinie auf dieser Seite veröffentlichen.
                </p>
                <p className="text-gray-700 mb-4">
                  Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

