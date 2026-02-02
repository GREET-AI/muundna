'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Mail, Phone, MapPin, Calendar, FileText, CheckCircle2, Clock, XCircle, 
  Search, Filter, LogOut, Building2, Wrench, Users, Home, Video, 
  MessageSquare, TrendingUp, BarChart3, Settings, Bell, User, 
  Contact, DollarSign, Target, Briefcase, FolderKanban, ChevronRight
} from 'lucide-react';

interface ContactSubmission {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  street: string | null;
  city: string | null;
  quiz_data: any;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface QuizData {
  location?: string;
  services?: string[];
  timeframe?: string[];
  targetGroup?: string[];
  companySize?: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('alle');
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [notes, setNotes] = useState('');
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline');
  const [activeNav, setActiveNav] = useState('contacts');

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadContacts();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_password', password);
      loadContacts();
    } else {
      alert('Falsches Passwort!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setContacts([]);
  };

  const loadContacts = async () => {
    setLoading(true);
    try {
      const password = localStorage.getItem('admin_password') || ADMIN_PASSWORD;
      const response = await fetch('/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('Nicht autorisiert. Bitte erneut anmelden.');
          handleLogout();
          return;
        }
        throw new Error('Fehler beim Laden der Kontakte');
      }

      const result = await response.json();
      setContacts(result.data || []);
    } catch (error) {
      console.error('Fehler:', error);
      alert('Ein Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const password = localStorage.getItem('admin_password') || ADMIN_PASSWORD;
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren');
      }

      loadContacts();
    } catch (error) {
      console.error('Fehler:', error);
      alert('Fehler beim Aktualisieren des Status.');
    }
  };

  const updateNotes = async (id: number, customNotes?: string) => {
    try {
      const password = localStorage.getItem('admin_password') || ADMIN_PASSWORD;
      const notesToSave = customNotes !== undefined ? customNotes : notes;
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ id, notes: notesToSave })
      });

      if (!response.ok) {
        throw new Error('Fehler beim Speichern');
      }

      setSelectedContact(null);
      setNotes('');
      loadContacts();
    } catch (error) {
      console.error('Fehler:', error);
      alert('Fehler beim Speichern der Notizen.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'neu':
        return 'bg-blue-500 text-white';
      case 'kontaktiert':
        return 'bg-yellow-500 text-white';
      case 'in_bearbeitung':
        return 'bg-[#cb530a] text-white';
      case 'abgeschlossen':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'neu':
        return 'Neu';
      case 'kontaktiert':
        return 'Kontaktiert';
      case 'in_bearbeitung':
        return 'In Bearbeitung';
      case 'abgeschlossen':
        return 'Abgeschlossen';
      default:
        return status;
    }
  };

  const getQuizIcon = (key: string, value: string) => {
    if (key === 'targetGroup') {
      switch (value) {
        case 'handwerksbetrieb':
          return <Wrench className="w-4 h-4" />;
        case 'bauunternehmen':
        case 'hoch-tiefbau':
          return <Building2 className="w-4 h-4" />;
        case 'sanierung':
          return <Home className="w-4 h-4" />;
        default:
          return <Users className="w-4 h-4" />;
      }
    }
    if (key === 'location') {
      switch (value) {
        case 'vor-ort':
          return <MapPin className="w-4 h-4" />;
        case 'online':
          return <Video className="w-4 h-4" />;
        default:
          return <MessageSquare className="w-4 h-4" />;
      }
    }
    if (key === 'services') {
      return <FileText className="w-4 h-4" />;
    }
    if (key === 'timeframe') {
      return <Clock className="w-4 h-4" />;
    }
    return null;
  };

  const getQuizLabel = (key: string, value: string) => {
    const labels: Record<string, Record<string, string>> = {
      targetGroup: {
        'handwerksbetrieb': 'Handwerksbetrieb',
        'bauunternehmen': 'Bauunternehmen',
        'hoch-tiefbau': 'Hoch- & Tiefbau',
        'sanierung': 'Sanierung & Renovierung'
      },
      services: {
        'telefonservice': 'Telefonservice',
        'terminorganisation': 'Terminorganisation',
        'social-media': 'Social Media',
        'google-bewertungen': 'Google Bewertungen',
        'dokumentation': 'Dokumentation',
        'mehrere': 'Mehrere'
      },
      timeframe: {
        'sofort': 'Sofort',
        '1-monat': 'In 1 Monat',
        '3-6-monate': 'In 3-6 Monaten',
        'nach-ruecksprache': 'Nach Rücksprache'
      },
      location: {
        'vor-ort': 'Vor Ort',
        'online': 'Online / Video-Call',
        'egal': 'Egal'
      }
    };
    return labels[key]?.[value] || value;
  };

  const renderQuizData = (quizData: any) => {
    if (!quizData || typeof quizData !== 'object') return null;

    const quiz: QuizData = quizData;
    const sections = [];

    if (quiz.targetGroup && quiz.targetGroup.length > 0) {
      sections.push({
        title: 'Zielgruppe',
        items: quiz.targetGroup,
        key: 'targetGroup'
      });
    }

    if (quiz.services && quiz.services.length > 0) {
      sections.push({
        title: 'Dienstleistungen',
        items: quiz.services,
        key: 'services'
      });
    }

    if (quiz.timeframe && quiz.timeframe.length > 0) {
      sections.push({
        title: 'Zeitrahmen',
        items: quiz.timeframe,
        key: 'timeframe'
      });
    }

    if (quiz.location) {
      sections.push({
        title: 'Beratung',
        items: [quiz.location],
        key: 'location'
      });
    }

    return (
      <div className="space-y-3">
        {sections.map((section, idx) => (
          <div key={idx}>
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              {section.title}
            </p>
            <div className="flex flex-wrap gap-2">
              {section.items.map((item: string, itemIdx: number) => (
                <div
                  key={itemIdx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#fef3ed] border border-[#cb530a]/20 rounded-lg text-sm font-medium text-[#182c30] hover:bg-[#cb530a] hover:text-white transition-colors"
                >
                  {getQuizIcon(section.key, item)}
                  <span>{getQuizLabel(section.key, item)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.phone && contact.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'alle' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });


  const contactsByStatus = {
    neu: filteredContacts.filter(c => c.status === 'neu'),
    kontaktiert: filteredContacts.filter(c => c.status === 'kontaktiert'),
    in_bearbeitung: filteredContacts.filter(c => c.status === 'in_bearbeitung'),
    abgeschlossen: filteredContacts.filter(c => c.status === 'abgeschlossen')
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full border-2 border-gray-200">
          <div className="text-center mb-6">
            <Image
              src="/images/logo.png"
              alt="Muckenfuss & Nagel Logo"
              width={120}
              height={60}
              className="mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Login
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Muckenfuss & Nagel CRM
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a] focus:border-[#cb530a]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#cb530a] text-white font-semibold rounded-lg hover:bg-[#a84308] transition-colors"
            >
              Anmelden
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'contacts', label: 'Kontakte', icon: Contact },
    { id: 'deals', label: 'Abschlüsse', icon: DollarSign },
    { id: 'leads', label: 'Anfragen', icon: Target },
    { id: 'kunden', label: 'Kunden', icon: Building2 },
    { id: 'kundenprojekte', label: 'Kundenprojekte', icon: FolderKanban },
  ];

  // Logik für verschiedene Views basierend auf Status
  const getViewData = () => {
    switch (activeNav) {
      case 'leads':
        // Anfragen: Alle neuen Kontakte (status: neu)
        return {
          title: 'Anfragen',
          description: 'Neue Kontaktanfragen und Interessenten',
          contacts: filteredContacts.filter(c => 
            c.status === 'neu' && (statusFilter === 'alle' || statusFilter === 'neu')
          ),
          showStats: true
        };
      case 'contacts':
        // Kontakte: Alle Kontakte
        return {
          title: 'Kontakte',
          description: 'Alle Kontakte und Ansprechpartner',
          contacts: filteredContacts,
          showStats: true
        };
      case 'deals':
        // Abschlüsse: Kontakte in Bearbeitung (potenzielle Abschlüsse)
        return {
          title: 'Abschlüsse',
          description: 'Aktive Verhandlungen und Angebote',
          contacts: filteredContacts.filter(c => 
            (c.status === 'kontaktiert' || c.status === 'in_bearbeitung') &&
            (statusFilter === 'alle' || c.status === statusFilter)
          ),
          showStats: true
        };
      case 'kunden':
        // Kunden: Abgeschlossene Kontakte (sind zu Kunden geworden)
        return {
          title: 'Kunden',
          description: 'Bestehende Kunden und Partner',
          contacts: filteredContacts.filter(c => 
            c.status === 'abgeschlossen' && (statusFilter === 'alle' || statusFilter === 'abgeschlossen')
          ),
          showStats: true
        };
      case 'kundenprojekte':
        // Kundenprojekte: Projekte für abgeschlossene Kunden
        return {
          title: 'Kundenprojekte',
          description: 'Projekte für bestehende Kunden',
          contacts: filteredContacts.filter(c => c.status === 'abgeschlossen'),
          showStats: false
        };
      default:
        return {
          title: 'Kontakte',
          description: 'Alle Kontakte',
          contacts: filteredContacts,
          showStats: true
        };
    }
  };

  const viewData = getViewData();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Schwarz mit orangenen Akzenten */}
      <aside className="w-64 bg-black border-r border-gray-800 fixed left-0 top-0 bottom-0 overflow-y-auto">
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <Image
              src="/images/logo.png"
              alt="Muckenfuss & Nagel Logo"
              width={180}
              height={90}
              className="h-12 w-auto"
              priority
            />
          </Link>
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#cb530a] text-white font-semibold shadow-lg'
                      : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-white" />}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Schwarze Navbar mit Logo */}
        <header className="bg-black text-white shadow-lg sticky top-0 z-50 border-b border-gray-800">
          <div className="px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-bold">CRM Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-900 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-900 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-900 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Abmelden</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
        {/* View Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{viewData.title}</h2>
          <p className="text-gray-600">{viewData.description}</p>
        </div>

        {/* Stats Overview - nur wenn showStats true */}
        {viewData.showStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Neue Leads</p>
                  <p className="text-2xl font-bold text-gray-800">{contactsByStatus.neu.length}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Kontaktiert</p>
                  <p className="text-2xl font-bold text-gray-800">{contactsByStatus.kontaktiert.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-[#cb530a]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Bearbeitung</p>
                  <p className="text-2xl font-bold text-gray-800">{contactsByStatus.in_bearbeitung.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#cb530a]" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Abgeschlossen</p>
                  <p className="text-2xl font-bold text-gray-800">{contactsByStatus.abgeschlossen.length}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>
        )}

        {/* Filter und Suche */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Suche nach Name, E-Mail oder Telefon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a] focus:border-[#cb530a]"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a] focus:border-[#cb530a] appearance-none bg-white"
                >
                  <option value="alle">Alle Status</option>
                  <option value="neu">Neu</option>
                  <option value="kontaktiert">Kontaktiert</option>
                  <option value="in_bearbeitung">In Bearbeitung</option>
                  <option value="abgeschlossen">Abgeschlossen</option>
                </select>
              </div>
              <div className="flex gap-2 border-2 border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('pipeline')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    viewMode === 'pipeline'
                      ? 'bg-[#cb530a] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Pipeline
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-[#cb530a] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tabelle
                </button>
              </div>
              <button
                onClick={loadContacts}
                disabled={loading}
                className="px-4 py-2 bg-[#cb530a] text-white font-semibold rounded-lg hover:bg-[#a84308] transition-colors disabled:opacity-50"
              >
                {loading ? 'Lädt...' : 'Aktualisieren'}
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {viewData.contacts.length} {viewData.title === 'Kundenprojekte' ? 'Projekt' : 'Kontakt'}{viewData.contacts.length !== 1 ? (viewData.title === 'Kundenprojekte' ? 'e' : 'e') : ''} gefunden
            </p>
          </div>
        </div>

        {/* Kundenprojekte View - Spezielle Ansicht */}
        {activeNav === 'kundenprojekte' ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Projektgruppen</h3>
              <p className="text-gray-600">Verwalten Sie Projekte für Ihre Kunden</p>
            </div>
            
            <div className="space-y-6">
              {/* Neue Projekte */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">Neue Projekte</h4>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {viewData.contacts.filter(c => !c.notes || !c.notes.includes('Projekt abgeschlossen')).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {viewData.contacts
                    .filter(c => !c.notes || !c.notes.includes('Projekt abgeschlossen'))
                    .map((contact) => (
                      <div key={contact.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-[#cb530a] transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800 mb-2">
                              Projekt für {contact.first_name} {contact.last_name}
                            </h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Kunde</p>
                                <p className="font-medium text-gray-800">{contact.first_name} {contact.last_name}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Dienstleistung</p>
                                <p className="font-medium text-gray-800">{contact.service || 'Nicht angegeben'}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Status</p>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(contact.status)}`}>
                                  {getStatusLabel(contact.status)}
                                </span>
                              </div>
                              <div>
                                <p className="text-gray-500">Erstellt</p>
                                <p className="font-medium text-gray-800">
                                  {new Date(contact.created_at).toLocaleDateString('de-DE')}
                                </p>
                              </div>
                            </div>
                            {contact.quiz_data && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                {renderQuizData(contact.quiz_data)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedContact(contact);
                              setNotes(contact.notes || '');
                            }}
                            className="px-3 py-1.5 bg-[#cb530a] text-white rounded-lg text-sm hover:bg-[#a84308] transition-colors font-medium"
                          >
                            Projekt bearbeiten
                          </button>
                          <button
                            onClick={async () => {
                              const newNotes = (contact.notes || '') + '\n\nProjekt abgeschlossen';
                              await updateNotes(contact.id, newNotes);
                            }}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors font-medium"
                          >
                            Als erledigt markieren
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Erledigte Projekte */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">Erledigt</h4>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {viewData.contacts.filter(c => c.notes && c.notes.includes('Projekt abgeschlossen')).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {viewData.contacts
                    .filter(c => c.notes && c.notes.includes('Projekt abgeschlossen'))
                    .map((contact) => (
                      <div key={contact.id} className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800 mb-2">
                              ✓ Projekt für {contact.first_name} {contact.last_name}
                            </h5>
                            <p className="text-sm text-gray-600">{contact.service || 'Nicht angegeben'}</p>
                          </div>
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Pipeline oder Table View für andere Sections */
          viewMode === 'pipeline' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['neu', 'kontaktiert', 'in_bearbeitung', 'abgeschlossen'].map((status) => {
                const statusContacts = viewData.contacts.filter(c => c.status === status);
                return (
                  <div key={status} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></span>
                        {getStatusLabel(status)}
                      </h3>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {statusContacts.length}
                      </span>
                    </div>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {statusContacts.map((contact) => (
                        <ContactCard
                          key={contact.id}
                          contact={contact}
                          onStatusChange={(newStatus) => updateStatus(contact.id, newStatus)}
                          onNotesClick={() => {
                            setSelectedContact(contact);
                            setNotes(contact.notes || '');
                          }}
                          renderQuizData={renderQuizData}
                          getStatusColor={getStatusColor}
                          getStatusLabel={getStatusLabel}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="space-y-4">
              {viewData.contacts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-600">Keine {viewData.title === 'Kundenprojekte' ? 'Projekte' : 'Kontakte'} gefunden.</p>
                </div>
              ) : (
                viewData.contacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onStatusChange={(newStatus) => updateStatus(contact.id, newStatus)}
                    onNotesClick={() => {
                      setSelectedContact(contact);
                      setNotes(contact.notes || '');
                    }}
                    renderQuizData={renderQuizData}
                    getStatusColor={getStatusColor}
                    getStatusLabel={getStatusLabel}
                    fullWidth
                  />
                ))
              )}
            </div>
          )
        )}
        </div>
      </div>

      {/* Notizen Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Notizen für {selectedContact.first_name} {selectedContact.last_name}
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a] focus:border-[#cb530a] mb-4"
              placeholder="Notizen hier eingeben..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => updateNotes(selectedContact.id)}
                className="px-4 py-2 bg-[#cb530a] text-white font-semibold rounded-lg hover:bg-[#a84308] transition-colors"
              >
                Speichern
              </button>
              <button
                onClick={() => {
                  setSelectedContact(null);
                  setNotes('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Contact Card Component
function ContactCard({
  contact,
  onStatusChange,
  onNotesClick,
  renderQuizData,
  getStatusColor,
  getStatusLabel,
  fullWidth = false
}: {
  contact: ContactSubmission;
  onStatusChange: (status: string) => void;
  onNotesClick: () => void;
  renderQuizData: (quizData: any) => React.ReactNode;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  fullWidth?: boolean;
}) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-200 ${fullWidth ? '' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-800">
              {contact.first_name} {contact.last_name}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(contact.status)}`}>
              {getStatusLabel(contact.status)}
            </span>
          </div>
          <div className="space-y-1.5 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#cb530a]" />
              <a href={`mailto:${contact.email}`} className="hover:text-[#cb530a] transition-colors">
                {contact.email}
              </a>
            </div>
            {contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#cb530a]" />
                <a href={`tel:${contact.phone}`} className="hover:text-[#cb530a] transition-colors">
                  {contact.phone}
                </a>
              </div>
            )}
            {(contact.street || contact.city) && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#cb530a]" />
                <span>{contact.street && `${contact.street}, `}{contact.city}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#cb530a]" />
              <span>
                {new Date(contact.created_at).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {contact.service && (
        <div className="mb-3 p-2 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-500 mb-1">Dienstleistung</p>
          <p className="text-sm text-gray-700">{contact.service}</p>
        </div>
      )}

      {contact.message && (
        <div className="mb-3 p-2 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-500 mb-1">Nachricht</p>
          <p className="text-sm text-gray-700 line-clamp-2">{contact.message}</p>
        </div>
      )}

      {contact.quiz_data && (
        <div className="mb-3 p-3 bg-[#fef3ed] rounded-lg border border-[#cb530a]/20">
          <p className="text-xs font-semibold text-[#182c30] mb-2 uppercase tracking-wide">
            Quiz-Daten
          </p>
          {renderQuizData(contact.quiz_data)}
        </div>
      )}

      {contact.notes && (
        <div className="mb-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs font-semibold text-yellow-800 mb-1">Notizen</p>
          <p className="text-sm text-yellow-900">{contact.notes}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
        <select
          value={contact.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-1.5 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#cb530a] focus:border-[#cb530a] bg-white"
        >
          <option value="neu">Neu</option>
          <option value="kontaktiert">Kontaktiert</option>
          <option value="in_bearbeitung">In Bearbeitung</option>
          <option value="abgeschlossen">Abgeschlossen</option>
        </select>
        <button
          onClick={onNotesClick}
          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors font-medium"
        >
          {contact.notes ? 'Notizen bearbeiten' : 'Notizen hinzufügen'}
        </button>
      </div>
    </div>
  );
}
