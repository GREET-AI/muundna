'use client';

import PageHero from './ui/PageHero';
import { getRoute } from '../utils/routes';

export default function ReferenzenHero() {
  return (
    <PageHero
      image="/images/Referenzen.png"
      imageAlt="Referenzen Muckenfuss & Nagel"
      headline="REFERENZEN"
      subtitle="Unsere Kunden"
      description="Erfolgreiche Zusammenarbeit mit Handwerksbetrieben und Bauunternehmen. Vertrauen Sie auf unsere Erfahrung und Expertise."
      primaryHref={getRoute('Quiz')}
      primaryText="Jetzt Anfragen"
      secondaryHref={getRoute('Dienstleistungen')}
      secondaryText="Mehr erfahren"
    />
  );
}
