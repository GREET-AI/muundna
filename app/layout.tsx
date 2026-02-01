import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://muckenfussundnagel.de'),
  title: "Muckenfuss & Nagel - Bürodienstleistungen für Handwerksbetriebe",
  description: "Professionelle Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen: Telefonservice, Kommunikation, Terminorganisation, Social Media Betreuung und Google Bewertungen. Deutschland, Schweiz, Österreich.",
  keywords: ["Bürodienstleistungen", "Handwerksbetriebe", "Bauunternehmen", "Telefonservice", "Terminorganisation", "Social Media", "Google Bewertungen", "DACH"],
  authors: [{ name: "Muckenfuss & Nagel" }],
  creator: "Muckenfuss & Nagel",
  publisher: "Muckenfuss & Nagel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://muckenfussundnagel.de",
    siteName: "Muckenfuss & Nagel",
    title: "Muckenfuss & Nagel - Bürodienstleistungen für Handwerksbetriebe",
    description: "Professionelle Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen: Telefonservice, Kommunikation, Terminorganisation, Social Media Betreuung und Google Bewertungen.",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Muckenfuss & Nagel Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muckenfuss & Nagel - Bürodienstleistungen für Handwerksbetriebe",
    description: "Professionelle Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen.",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/favicon-32x32.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
