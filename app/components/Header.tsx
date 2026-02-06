'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getRoute } from '../utils/routes';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  const menuItems = [
    { title: 'Über uns' },
    {
      title: 'Dienstleistungen',
      submenu: [
        'Telefonservice & Kommunikation',
        'Terminorganisation',
        'Social Media Betreuung',
        'Google Bewertungen',
        'Dokumentation & Reporting',
        'Webdesign & App Lösungen'
      ]
    },
    {
      title: 'Zielgruppen',
      submenu: [
        'Handwerksbetriebe',
        'Bauunternehmen',
        'Straßen- & Brückenbau',
        'Sanierung & Renovierung',
        'Dachdecker & Zimmerleute'
      ]
    },
    { title: 'Referenzen' },
    { title: 'Kontakt' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="relative w-16 h-16 md:w-24 md:h-24">
              <Image
                src="/logoneu.png"
                alt="Muckenfuss & Nagel Logo"
                fill
                className="object-contain"
                priority
                loading="eager"
                unoptimized
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <div key={index} className="relative group">
                {item.submenu ? (
                  <>
                    <Link
                      href={getRoute(item.title)}
                      className="text-white hover:text-[#cb530a] font-medium py-2 block transition-colors"
                    >
                      {item.title}
                    </Link>
                    <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                      <ul className="py-2">
                        <li>
                          <Link
                            href={getRoute(item.title)}
                            className="block px-4 py-2 text-gray-700 hover:bg-[#fef3ed] hover:text-[#cb530a] transition-colors font-semibold"
                          >
                            Übersicht
                          </Link>
                        </li>
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={getRoute(subItem)}
                              className="block px-4 py-2 text-gray-700 hover:bg-[#fef3ed] hover:text-[#cb530a] transition-colors"
                            >
                              {subItem}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    href={getRoute(item.title)}
                    className="text-white hover:text-[#cb530a] font-medium py-2 block transition-colors"
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <Link
              href={getRoute('Quiz')}
              className="hidden lg:inline-flex items-center justify-center px-6 py-2.5 bg-[#cb530a] hover:bg-[#a84308] text-white font-semibold rounded-lg shadow-lg transition-all hover:shadow-xl"
            >
              Jetzt Anfragen
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-white"
              aria-label="Navigation"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black border-t border-gray-800 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.submenu ? (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={getRoute(item.title)}
                          className="flex-1 text-white font-medium py-2 hover:text-[#cb530a]"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() =>
                            setOpenSubmenu(openSubmenu === index ? null : index)
                          }
                          className="p-2 text-white hover:text-[#cb530a] shrink-0"
                          aria-label={openSubmenu === index ? 'Untermenü schließen' : 'Untermenü öffnen'}
                        >
                          <svg
                            className={`w-5 h-5 transition-transform ${
                              openSubmenu === index ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                      {openSubmenu === index && (
                        <ul className="pl-4 mt-2 space-y-1 border-l-2 border-[#cb530a]/30">
                          {item.submenu.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                href={getRoute(subItem)}
                                className="block py-2 text-gray-300 text-sm hover:text-[#cb530a] hover:pl-2 transition-all"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subItem}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={getRoute(item.title)}
                      className="block text-white font-medium py-2 hover:text-[#cb530a]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <Link
                href={getRoute('Quiz')}
                className="block w-full text-center px-6 py-3 bg-[#cb530a] hover:bg-[#a84308] text-white font-semibold rounded-lg shadow-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Jetzt Anfragen
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
