'use client';

import PageHeroSlider from './ui/PageHeroSlider';

const slides = [
  { headline: 'Unser Team', subtitle: 'Über uns', description: '10+ Jahre Erfahrung im Bauwesen', image: '/images/Team/team.png', href: '/ueber-uns#team', linkText: 'Team & Büro entdecken →' },
  { headline: 'Unser Büro', subtitle: 'Über uns', description: 'Professionelle Arbeitsumgebung', image: '/images/Team/office1.jpeg', href: '/ueber-uns#team', linkText: 'Team & Büro entdecken →' },
  { headline: 'Team & Büro', subtitle: 'Über uns', description: 'Hier entstehen Ihre Bürolösungen', image: '/images/Team/office%202.jpeg', href: '/ueber-uns#team', linkText: 'Mehr erfahren →' },
];

export default function UeberUnsSlider() {
  return <PageHeroSlider slides={slides} />;
}
