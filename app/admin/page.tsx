'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, FileText, CheckCircle2, Clock, XCircle, Search, Filter } from 'lucide-react';

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

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('alle');
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [notes, setNotes] = useState('');

  // Einfacher Passwort-Schutz (in Produktion sollte man Supabase Auth nutzen)
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

  const updateNotes = async (id: number) => {
    try {
      const password = localStorage.getItem('admin_password') || ADMIN_PASSWORD;
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ id, notes })
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
        return 'bg-blue-100 text-blue-800';
      case 'kontaktiert':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_bearbeitung':
        return 'bg-orange-100 text-orange-800';
      case 'abgeschlossen':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'neu':
        return <Clock className="w-4 h-4" />;
      case 'kontaktiert':
        return <Mail className="w-4 h-4" />;
      case 'in_bearbeitung':
        return <FileText className="w-4 h-4" />;
      case 'abgeschlossen':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return null;
    }
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Admin Login
          </h1>
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
          <p className="text-xs text-gray-500 mt-4 text-center">
            Standard-Passwort: admin123 (bitte in .env.local ändern)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Kontaktverwaltung</h1>
              <p className="text-sm text-gray-600">Muckenfuss & Nagel CRM</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-700 hover:text-[#cb530a] transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter und Suche */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb530a] focus:border-[#cb530a] appearance-none"
              >
                <option value="alle">Alle Status</option>
                <option value="neu">Neu</option>
                <option value="kontaktiert">Kontaktiert</option>
                <option value="in_bearbeitung">In Bearbeitung</option>
                <option value="abgeschlossen">Abgeschlossen</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredContacts.length} Kontakt{filteredContacts.length !== 1 ? 'e' : ''} gefunden
            </p>
            <button
              onClick={loadContacts}
              disabled={loading}
              className="px-4 py-2 bg-[#cb530a] text-white font-semibold rounded-lg hover:bg-[#a84308] transition-colors disabled:opacity-50"
            >
              {loading ? 'Lädt...' : 'Aktualisieren'}
            </button>
          </div>
        </div>

        {/* Kontaktliste */}
        <div className="space-y-4">
          {filteredContacts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600">Keine Kontakte gefunden.</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {contact.first_name} {contact.last_name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(contact.status)}`}>
                        {getStatusIcon(contact.status)}
                        {contact.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${contact.email}`} className="hover:text-[#cb530a]">
                          {contact.email}
                        </a>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${contact.phone}`} className="hover:text-[#cb530a]">
                            {contact.phone}
                          </a>
                        </div>
                      )}
                      {(contact.street || contact.city) && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {contact.street && <span>{contact.street}, </span>}
                          {contact.city && <span>{contact.city}</span>}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(contact.created_at).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {contact.service && (
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-gray-500">Interessierte Dienstleistung:</span>
                    <span className="ml-2 text-sm text-gray-700">{contact.service}</span>
                  </div>
                )}

                {contact.message && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{contact.message}</p>
                  </div>
                )}

                {contact.quiz_data && (
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-semibold text-blue-800 mb-1">Quiz-Daten:</p>
                    <pre className="text-xs text-blue-700 overflow-x-auto">
                      {JSON.stringify(contact.quiz_data, null, 2)}
                    </pre>
                  </div>
                )}

                {contact.notes && (
                  <div className="mb-3 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs font-semibold text-yellow-800 mb-1">Notizen:</p>
                    <p className="text-sm text-yellow-900">{contact.notes}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                  <select
                    value={contact.status}
                    onChange={(e) => updateStatus(contact.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#cb530a]"
                  >
                    <option value="neu">Neu</option>
                    <option value="kontaktiert">Kontaktiert</option>
                    <option value="in_bearbeitung">In Bearbeitung</option>
                    <option value="abgeschlossen">Abgeschlossen</option>
                  </select>
                  <button
                    onClick={() => {
                      setSelectedContact(contact);
                      setNotes(contact.notes || '');
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    Notizen {contact.notes ? 'bearbeiten' : 'hinzufügen'}
                  </button>
                </div>
              </div>
            ))
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

