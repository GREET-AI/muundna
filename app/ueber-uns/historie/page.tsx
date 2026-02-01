import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function HistoriePage() {
  const milestones = [
    { year: '2024', event: 'Erweiterung des Portfolios' },
    { year: '2020', event: 'Neue Standorte eröffnet' },
    { year: '2015', event: 'Wachstum im Gesundheitssektor' },
    { year: '2010', event: 'Gründung des Unternehmens' },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Historie</h1>
          <div className="max-w-4xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-12">
              Unsere Unternehmensgeschichte im Überblick.
            </p>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="border-l-4 border-gray-800 pl-6">
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {milestone.year}
                  </div>
                  <p className="text-gray-700">{milestone.event}</p>
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

