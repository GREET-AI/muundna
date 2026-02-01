import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Muckenfuss & Nagel - Bürodienstleistungen für Handwerksbetriebe",
  description: "Professionelle Bürodienstleistungen für Handwerksbetriebe und Bauunternehmen: Telefonservice, Kommunikation, Terminorganisation, Social Media Betreuung und Google Bewertungen. Deutschland, Schweiz, Österreich.",
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
