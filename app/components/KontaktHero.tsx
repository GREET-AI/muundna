'use client';

import PageHero from './ui/PageHero';
import { getRoute } from '../utils/routes';

export default function KontaktHero() {
  return (
    <PageHero
      image="/images/kontakt.png"
      imageAlt="Kontakt Muckenfuss & Nagel"
      headline="KONTAKT"
      subtitle="Kontakt aufnehmen"
      description="Wir freuen uns auf Ihre Nachricht. Erreichen Sie uns per Telefon, E-Mail oder über unser Kontaktformular – wir melden uns schnellstmöglich."
      primaryHref="/kontakt"
      primaryText="Zum Kontaktformular"
      secondaryHref={getRoute('Dienstleistungen')}
      secondaryText="Mehr erfahren"
    />
  );
}
