'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Mail, Phone, MapPin, Calendar, FileText, CheckCircle2, Clock, XCircle, 
  Search, Filter, LogOut, Building2, Wrench, Users, Home, Video, 
  MessageSquare, TrendingUp, BarChart3, User,
  Contact, DollarSign, Target, Briefcase, FolderKanban, ChevronRight,
  Globe, ExternalLink, Loader2, ChevronDown, ChevronUp, Star, Upload, History
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { scrapeGelbeSeiten } from '@/app/actions/scrape-gelbeseiten';
import { scrape11880 } from '@/app/actions/scrape-11880';
import { buildGelbeSeitenSearchUrl, build11880SearchUrl } from '@/lib/scraper-sources';
import { normalizeGermanPhone } from '@/lib/normalize-phone';
import type { ScrapedLeadInsert } from '@/types/scraper-lead';

interface ContactSubmission {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
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
  company?: string | null;
  source?: string | null;
  source_meta?: Record<string, unknown> | null;
  scrape_batch_id?: string | null;
  assigned_to?: string | null;
}

interface ContactActivityEntry {
  id: number;
  contact_id: number;
  sales_rep: string;
  action: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
}

interface QuizData {
  location?: string;
  services?: string[];
  timeframe?: string[];
  targetGroup?: string[];
  companySize?: string;
}

const SALES_REPS = [{ value: 'sven', label: 'Sven' }, { value: 'pascal', label: 'Pascal' }] as const;

export type AngebotForm = {
  headline: string;
  subline: string;
  kundeName: string;
  kundeFirma: string;
  kundeStrasse: string;
  kundePlzOrt: string;
  produkt: string;
  preis: string;
  originalPreis: string;
  laufzeit: string;
  zusatz: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [salesRep, setSalesRep] = useState<'sven' | 'pascal' | null>(null);
  const [loginPendingProfile, setLoginPendingProfile] = useState(false);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('alle');
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [notes, setNotes] = useState('');
  const [contactActivity, setContactActivity] = useState<ContactActivityEntry[]>([]);
  const [assignDialogContact, setAssignDialogContact] = useState<ContactSubmission | null>(null);
  /** Bewertungs-Funnel: Empfänger (Kunden der Kunden) für Google-Bewertungs-Einladungen */
  type ReviewRecipient = { id: string; name: string; email: string; phone: string; kunde: string; googleLink?: string };
  const [reviewRecipients, setReviewRecipients] = useState<ReviewRecipient[]>([]);
  const [reviewTemplate, setReviewTemplate] = useState({ kunde: '', googleLink: '', messageBody: 'Hallo {{name}},\n\n{{kunde}} würde sich sehr über eine Google-Bewertung freuen:\n{{link}}\n\nVielen Dank!' });
  const [reviewManual, setReviewManual] = useState({ name: '', email: '', phone: '', kunde: '', googleLink: '' });
  const [reviewSending, setReviewSending] = useState(false);
  const [reviewSendResult, setReviewSendResult] = useState<{ ok: boolean; sent?: number; error?: string } | null>(null);
  /** Ausgewählter CRM-Kunde für diesen Funnel (Leads mit Status Kunde/Abgeschlossen) */
  const [selectedReviewCustomer, setSelectedReviewCustomer] = useState<ContactSubmission | null>(null);
  const [editingContact, setEditingContact] = useState<ContactSubmission | null>(null);
  const [editForm, setEditForm] = useState<{ first_name: string; last_name: string; email: string; phone: string; street: string; city: string; company: string; notes: string }>({ first_name: '', last_name: '', email: '', phone: '', street: '', city: '', company: '', notes: '' });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; contact: ContactSubmission } | null>(null);
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline');
  const [activeNav, setActiveNav] = useState('contacts');
  // Lead-Scraping (Gelbe Seiten + 11880 – unabhängig, laufen im Hintergrund)
  const [scrapeKeyword, setScrapeKeyword] = useState('');
  const [scrapeLocation, setScrapeLocation] = useState('');
  const [scrapeRadius, setScrapeRadius] = useState(50);
  const [scrapingGS, setScrapingGS] = useState(false);
  const [scraping11880, setScraping11880] = useState(false);
  const [scrapedLeadsGS, setScrapedLeadsGS] = useState<ScrapedLeadInsert[]>([]);
  const [scrapedLeads11880, setScrapedLeads11880] = useState<ScrapedLeadInsert[]>([]);
  const [scrapeErrorGS, setScrapeErrorGS] = useState<string | null>(null);
  const [scrapeError11880, setScrapeError11880] = useState<string | null>(null);
  const [importResultGS, setImportResultGS] = useState<{ ok: boolean; inserted?: number; skipped_duplicates?: number } | null>(null);
  const [importResult11880, setImportResult11880] = useState<{ ok: boolean; inserted?: number; skipped_duplicates?: number } | null>(null);
  /** Scraper-Submenü aufgeklappt (Lead-Scraping) */
  const [scraperMenuOpen, setScraperMenuOpen] = useState(true);
  /** Tools-Submenü aufgeklappt */
  const [toolsMenuOpen, setToolsMenuOpen] = useState(true);
  /** Pro Quelle: ausgewählt für Import/CSV (Duplikate standardmäßig abgewählt) */
  const [selectedScrapedLeadsGS, setSelectedScrapedLeadsGS] = useState<boolean[]>([]);
  const [selectedScrapedLeads11880, setSelectedScrapedLeads11880] = useState<boolean[]>([]);
  /** Popup wenn ein Scraper fertig ist (Hintergrund-Lauf) */
  const [scraperDoneNotification, setScraperDoneNotification] = useState<{ source: 'gelbeseiten' | '11880'; label: string; count: number; error?: string } | null>(null);
  /** Gelbe Seiten: Live-Fortschritt (anzeigen_sammeln → found → done) */
  const [scrapePhaseGS, setScrapePhaseGS] = useState<'idle' | 'anzeigen_sammeln' | 'found' | 'done'>('idle');
  const [foundCountGS, setFoundCountGS] = useState(0);
  /** Während des Streams: gesammelte Leads (für fetchExistingAndSetSelection bei done) */
  const streamingLeadsRef = useRef<ScrapedLeadInsert[]>([]);
  /** Fehler beim Laden der Kontakte (z. B. Failed to fetch) */
  const [loadError, setLoadError] = useState<string | null>(null);
  /** Angebotserstellung: Formular + Vorschau */
  const [angebot, setAngebot] = useState({
    headline: 'Ihr persönliches Angebot',
    subline: 'Ihr Büro. Ihr Geschäft. Unsere Expertise.',
    kundeName: '',
    kundeFirma: '',
    kundeStrasse: '',
    kundePlzOrt: '',
    produkt: '',
    preis: '',
    originalPreis: '',
    laufzeit: '',
    zusatz: '',
  });
  const ANGEBOT_PRODUKTE = [
    'Telefonservice & Kommunikation',
    'Terminorganisation',
    'Social Media Betreuung',
    'Google Bewertungen',
    'Dokumentation & Reporting',
    'Webdesign & App Lösungen',
    'Individuelles Paket',
  ];
  /** History-Dialog: globale Nutzeraktionen */
  type ActivityLogEntry = { id: number; contact_id: number; sales_rep: string; action: string; old_value: string | null; new_value: string | null; created_at: string; contact_submissions?: { company?: string; first_name?: string; last_name?: string } | null };
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyEntries, setHistoryEntries] = useState<ActivityLogEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  /** API meldet: DB-Migration für Leads/Scraping fehlt */
  const [migrationRequired, setMigrationRequired] = useState(false);
  /** Spaltenbreiten für Lead-Tabelle (Excel-artig resizable) */
  const TABLE_COLUMN_KEYS = ['quelle', 'vertriebler', 'firmaName', 'profil', 'telefon', 'email', 'website', 'ort', 'strasse', 'status'] as const;

  /** CRM-Lead-Status (Deutsch): für Pipeline, Filter und Auswahl */
  const LEAD_STATUSES = [
    { value: 'neu', label: 'Neu' },
    { value: 'offen', label: 'Offen / In Bearbeitung' },
    { value: 'kontaktversuch', label: 'Kontaktversuch unternommen' },
    { value: 'verbunden', label: 'Verbunden / Kontakt aufgenommen' },
    { value: 'qualifiziert', label: 'Qualifiziert' },
    { value: 'nicht_qualifiziert', label: 'Nicht qualifiziert / Kein Interesse' },
    { value: 'wiedervorlage', label: 'Schlechtes Timing / Wiedervorlage' },
    { value: 'kunde', label: 'Kunde' },
    // Legacy (DB-Kompatibilität)
    { value: 'kontaktiert', label: 'Kontaktiert' },
    { value: 'in_bearbeitung', label: 'In Bearbeitung' },
    { value: 'abgeschlossen', label: 'Abgeschlossen' },
  ] as const;
  /** Status → Pipeline-Spalte (Legacy zu neu mappen) */
  const statusToPipelineColumn = (status: string) => {
    if (status === 'kontaktiert') return 'verbunden';
    if (status === 'in_bearbeitung') return 'offen';
    if (status === 'abgeschlossen') return 'kunde';
    return status;
  };
  const PIPELINE_COLUMNS = ['neu', 'offen', 'kontaktversuch', 'verbunden', 'qualifiziert', 'nicht_qualifiziert', 'wiedervorlage', 'kunde'] as const;

  const [tableColumnWidths, setTableColumnWidths] = useState<Record<string, number>>({
    quelle: 100, vertriebler: 90, firmaName: 220, profil: 90, telefon: 130, email: 160, website: 90, ort: 90, strasse: 140, status: 90
  });
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const resizeStartRef = useRef<{ x: number; w: number } | null>(null);

  /** Gelbe-Seiten-Branding (Hintergrund wie gelbeseiten.de) */
  const GELBE_SEITEN_YELLOW = '#F5C400';
  const GELBE_SEITEN_BLACK = '#1a1a1a';

  /** Aktuelle Scraper-Daten je nach Seite (damit beide unabhängig laufen können) */
  const scrapedLeads = activeNav === 'scraper-gelbeseiten' ? scrapedLeadsGS : scrapedLeads11880;
  const selectedScrapedLeads = activeNav === 'scraper-gelbeseiten' ? selectedScrapedLeadsGS : selectedScrapedLeads11880;
  const scraping = activeNav === 'scraper-gelbeseiten' ? scrapingGS : scraping11880;
  const scrapeError = activeNav === 'scraper-gelbeseiten' ? scrapeErrorGS : scrapeError11880;
  const importResult = activeNav === 'scraper-gelbeseiten' ? importResultGS : importResult11880;
  const setSelectedScrapedLeadsCurrent = activeNav === 'scraper-gelbeseiten' ? setSelectedScrapedLeadsGS : setSelectedScrapedLeads11880;

  /** Beim Laden: Session prüfen (Cookie), dann Profil aus localStorage wiederherstellen */
  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'include' })
      .then((r) => {
        if (r.ok) {
          setIsAuthenticated(true);
          const profile = localStorage.getItem('admin_profile');
          if (profile === 'sven' || profile === 'pascal') setSalesRep(profile);
          else setLoginPendingProfile(true);
          loadContacts();
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedContact?.id) {
      setContactActivity([]);
      return;
    }
    fetch(`/api/admin/contacts/activity?contact_id=${selectedContact.id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => setContactActivity(res.data ?? []))
      .catch(() => setContactActivity([]));
  }, [selectedContact?.id]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeNav === 'leads') loadContacts(true);
    else if (['contacts', 'meine-kontakte', 'deals', 'kunden', 'kundenprojekte', 'bewertungs-funnel', 'angebots-erstellung'].includes(activeNav)) loadContacts();
  }, [activeNav, isAuthenticated]);

  /** Popup „Scraper fertig“ nach 6 Sekunden ausblenden */
  useEffect(() => {
    if (!scraperDoneNotification) return;
    const t = setTimeout(() => setScraperDoneNotification(null), 6000);
    return () => clearTimeout(t);
  }, [scraperDoneNotification]);

  /** History laden wenn Dialog geöffnet wird */
  useEffect(() => {
    if (!historyDialogOpen || !isAuthenticated) return;
    setHistoryLoading(true);
    fetch('/api/admin/activity?limit=100', { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => setHistoryEntries(res.data ?? []))
      .catch(() => setHistoryEntries([]))
      .finally(() => setHistoryLoading(false));
  }, [historyDialogOpen, isAuthenticated]);

  /** Spalten-Resize: Mausbewegung/Release global abfangen */
  useEffect(() => {
    if (!resizingColumn || !resizeStartRef.current) return;
    const handleMove = (e: MouseEvent) => {
      const start = resizeStartRef.current;
      if (!start) return;
      const delta = e.clientX - start.x;
      setTableColumnWidths((prev) => ({
        ...prev,
        [resizingColumn]: Math.max(40, start.w + delta)
      }));
    };
    const handleUp = () => {
      setResizingColumn(null);
      resizeStartRef.current = null;
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [resizingColumn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const pwd = (password || '').trim();
    if (!pwd) {
      alert('Bitte Passwort eingeben.');
      return;
    }
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: pwd }),
      });
      if (res.ok) {
        setLoginPendingProfile(true);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || 'Falsches Passwort!');
      }
    } catch {
      alert('Anmeldung fehlgeschlagen.');
    }
  };

  const handleProfileSelect = (profile: 'sven' | 'pascal') => {
    setSalesRep(profile);
    localStorage.setItem('admin_profile', profile);
    setIsAuthenticated(true);
    setLoginPendingProfile(false);
    loadContacts();
  };

  const handleLogout = () => {
    fetch('/api/admin/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    setIsAuthenticated(false);
    setSalesRep(null);
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_profile');
    setContacts([]);
  };

  useEffect(() => {
    const stored = localStorage.getItem('admin_profile');
    if (stored === 'sven' || stored === 'pascal') setSalesRep(stored);
  }, []);

  const loadContacts = async (leadsOnly?: boolean) => {
    setLoading(true);
    setLoadError(null);
    try {
      const params = new URLSearchParams();
      if (leadsOnly) params.set('leads_only', '1');
      const qs = params.toString();
      const url = `/api/admin/contacts${qs ? `?${qs}` : ''}`;
      const response = await fetch(url, { credentials: 'include' });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        setContacts([]);
        setLoadError('Fehler beim Laden der Kontakte.');
        return;
      }

      const result = await response.json();
      setContacts(result.data || []);
      setMigrationRequired(result.migration_required === true);
    } catch (error) {
      console.error('Fehler:', error);
      setContacts([]);
      setLoadError('Kontakte konnten nicht geladen werden (z. B. Server nicht erreichbar).');
    } finally {
      setLoading(false);
    }
  };

  /** Bestehende Lead-Keys aus DB holen und Auswahl für gescrapte Leads setzen (Duplikate abgewählt). */
  const fetchExistingAndSetSelection = async (leads: ScrapedLeadInsert[], source: 'gelbeseiten' | '11880') => {
    const res = await fetch('/api/admin/contacts?leads_only=1', { credentials: 'include' });
    const data = await res.json();
    const existing = (data.data || []) as ContactSubmission[];
    const keys = new Set<string>();
    existing.forEach((r) => {
      const p = (r.phone || '').trim();
      const e = (r.email || '').trim();
      const c = (r.company || '').trim().slice(0, 150);
      const t = (r.city || '').trim().slice(0, 80);
      if (p) keys.add(`p:${p}`);
      if (e) keys.add(`e:${e}`);
      if (c) keys.add(`c:${c}:${t}`);
    });
    const selection = leads.map((lead) => {
      const p = normalizeGermanPhone(lead.telefon);
      const e = (lead.email || '').trim();
      const c = lead.firma.trim().slice(0, 150);
      const t = (lead.plz_ort || '').trim().slice(0, 80);
      if (p && keys.has(`p:${p}`)) return false;
      if (e && keys.has(`e:${e}`)) return false;
      if (c && keys.has(`c:${c}:${t}`)) return false;
      return true;
    });
    if (source === 'gelbeseiten') setSelectedScrapedLeadsGS(selection);
    else setSelectedScrapedLeads11880(selection);
  };

  /** CSV für HubSpot (Suchbegriff als Spalte). */
  const downloadCsvForHubspot = (leads: ScrapedLeadInsert[], suchbegriff: string, sourceLabel: string) => {
    const header = 'First Name,Last Name,Email,Phone,Company,Street Address,City,Suchbegriff,Quelle';
    const rows = leads.map((l) => {
      const fn = l.firma.slice(0, 50);
      const email = (l.email || '').replace(/"/g, '""');
      const phone = (normalizeGermanPhone(l.telefon) || (l.telefon || '')).replace(/"/g, '""');
      const company = (l.firma || '').replace(/"/g, '""');
      const addr = (l.adresse || '').replace(/"/g, '""');
      const city = (l.plz_ort || '').replace(/"/g, '""');
      return `"${fn}","","${email}","${phone}","${company}","${addr}","${city}","${suchbegriff}","${sourceLabel}"`;
    });
    const csv = [header, ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-hubspot-${suchbegriff.replace(/\s+/g, '-')}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, status: newStatus, changed_by: salesRep ?? localStorage.getItem('admin_profile') })
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        let msg = errBody?.error || `Fehler beim Aktualisieren (${response.status})`;
        if (typeof msg === 'string' && msg.includes('contact_submissions_status_check')) {
          msg = 'Status wird von der Datenbank nicht erlaubt. Bitte SUPABASE_STATUS_MIGRATION.md im Projekt ausführen (Supabase → SQL Editor).';
        }
        throw new Error(msg);
      }

      loadContacts();
    } catch (error) {
      console.error('Fehler:', error);
      const message = error instanceof Error ? error.message : 'Fehler beim Aktualisieren des Status.';
      alert(message);
    }
  };

  const updateNotes = async (id: number, customNotes?: string) => {
    try {
      const notesToSave = customNotes !== undefined ? customNotes : notes;
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, notes: notesToSave, changed_by: salesRep ?? localStorage.getItem('admin_profile') })
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

  const updateAssignedTo = async (id: number, assignedTo: string | null) => {
    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, assigned_to: assignedTo || null, changed_by: salesRep ?? localStorage.getItem('admin_profile') })
      });
      if (!response.ok) throw new Error('Fehler beim Zuweisen');
      loadContacts();
    } catch (error) {
      console.error('Fehler:', error);
      alert('Vertriebler-Zuordnung konnte nicht gespeichert werden.');
    }
  };

  const updateContact = async (id: number, payload: { first_name?: string; last_name?: string; email?: string; phone?: string; street?: string; city?: string; company?: string; notes?: string; status?: string }) => {
    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, ...payload, changed_by: salesRep ?? localStorage.getItem('admin_profile') })
      });

      if (!response.ok) {
        throw new Error('Fehler beim Speichern');
      }

      setEditingContact(null);
      setEditForm({ first_name: '', last_name: '', email: '', phone: '', street: '', city: '', company: '', notes: '' });
      loadContacts();
    } catch (error) {
      console.error('Fehler:', error);
      alert('Fehler beim Speichern des Leads.');
    }
  };

  const openEditModal = (contact: ContactSubmission) => {
    setEditingContact(contact);
    setEditForm({
      first_name: contact.first_name || '',
      last_name: contact.last_name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      street: contact.street || '',
      city: contact.city || '',
      company: contact.company || '',
      notes: contact.notes || ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'neu':
        return 'bg-emerald-500 text-white';
      case 'offen':
      case 'in_bearbeitung':
        return 'bg-amber-500 text-white';
      case 'kontaktversuch':
        return 'bg-yellow-500 text-white';
      case 'verbunden':
      case 'kontaktiert':
        return 'bg-sky-500 text-white';
      case 'qualifiziert':
        return 'bg-[#cb530a] text-white';
      case 'nicht_qualifiziert':
        return 'bg-gray-500 text-white';
      case 'wiedervorlage':
        return 'bg-purple-500 text-white';
      case 'kunde':
      case 'abgeschlossen':
        return 'bg-emerald-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    const found = LEAD_STATUSES.find(s => s.value === status);
    return found ? found.label : status;
  };

  /** Quelle für Anzeige und Farbcodierung */
  const getSourceLabel = (source: string | null | undefined) => {
    if (!source) return 'Eigene';
    switch (source) {
      case 'gelbe_seiten': return 'Gelbe Seiten';
      case '11880': return '11880';
      case 'google_places': return 'Google';
      case 'website_form': case 'quiz': return 'Website';
      default: return source;
    }
  };

  const getSourceBorderClass = (source: string | null | undefined) => {
    if (!source) return 'border-l-4 border-l-neutral-300'; // Eigene: schwarz/neutral
    if (source === 'gelbe_seiten') return 'border-l-4 border-l-amber-400 bg-amber-50/50'; // Quelle: behalten
    if (source === '11880') return 'border-l-4 border-l-green-500 bg-green-50/50'; // Quelle: behalten
    return 'border-l-4 border-l-neutral-300';
  };

  /** Profil-URL aus source_meta oder aus Notizen parsen (GS-Profil: / 11880-Profil:) */
  const getProfileUrl = (contact: ContactSubmission): string | null => {
    const meta = contact.source_meta as { gs_profile_url?: string; profile_url?: string } | undefined;
    if (meta?.gs_profile_url) return meta.gs_profile_url;
    if (meta?.profile_url) return meta.profile_url;
    const notes = contact.notes || '';
    const gs = notes.match(/(?:GS-Profil|Gelbe-Seiten Profil):\s*(https?:\S+)/i);
    if (gs) return gs[1].trim();
    const p11880 = notes.match(/11880-Profil:\s*(https?:\S+)/i);
    if (p11880) return p11880[1].trim();
    return null;
  };

  const getProfileLabel = (contact: ContactSubmission): string | null => {
    if (contact.source === 'gelbe_seiten') return 'Gelbe-Seiten Profil';
    if (contact.source === '11880') return '11880 Profil';
    if (!getProfileUrl(contact)) return null;
    const meta = contact.source_meta as { profile_url?: string } | undefined;
    if (meta?.profile_url) return '11880 Profil';
    if ((contact.notes || '').includes('11880-Profil')) return '11880 Profil';
    return 'Gelbe-Seiten Profil';
  };

  /** Website aus Notizen parsen (beim Import: "Website: https://...") */
  const getWebsiteFromNotes = (notes: string | null | undefined): string | null => {
    if (!notes) return null;
    const m = notes.match(/Website:\s*(https?:\/\/[^\s\n]+)/i);
    return m ? m[1].trim() : null;
  };

  /** Anzeigename für CRM-Kunden im Bewertungs-Funnel */
  const getReviewCustomerDisplayName = (c: ContactSubmission): string => {
    const company = (c.company || '').trim();
    const name = [c.first_name, c.last_name].filter(Boolean).join(' ').trim();
    return company || name || 'Unbenannt';
  };

  /** Google-Bewertung-Link aus Notizen parsen (z. B. "Google: https://..." oder "Bewertung: https://...") */
  const getGoogleReviewLinkFromNotes = (notes: string | null | undefined): string | null => {
    if (!notes) return null;
    const m = notes.match(/(?:Google|Bewertung|g\.page):\s*(https?:\/\/[^\s\n]+)/i);
    return m ? m[1].trim() : null;
  };

  const deleteContact = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Löschen fehlgeschlagen');
      setContextMenu(null);
      loadContacts();
    } catch (e) {
      console.error(e);
      alert('Lead/Kontakt konnte nicht gelöscht werden.');
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
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.phone && contact.phone.includes(searchTerm)) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'alle' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });


  const contactsByStatus: Record<string, ContactSubmission[]> = {};
  PIPELINE_COLUMNS.forEach(col => {
    contactsByStatus[col] = filteredContacts.filter(c => statusToPipelineColumn(c.status) === col);
  });
  const kpiNeu = contactsByStatus.neu?.length ?? 0;
  const kpiAktiv = (contactsByStatus.offen?.length ?? 0) + (contactsByStatus.kontaktversuch?.length ?? 0) + (contactsByStatus.verbunden?.length ?? 0) + (contactsByStatus.qualifiziert?.length ?? 0) + filteredContacts.filter(c => ['kontaktiert', 'in_bearbeitung'].includes(c.status)).length;
  const kpiNichtQual = (contactsByStatus.nicht_qualifiziert?.length ?? 0) + (contactsByStatus.wiedervorlage?.length ?? 0);
  const kpiKunde = (contactsByStatus.kunde?.length ?? 0) + filteredContacts.filter(c => c.status === 'abgeschlossen').length;

  const showLoginOrProfile = !isAuthenticated || salesRep === null;
  if (showLoginOrProfile) {
    const showProfileStep = loginPendingProfile || (isAuthenticated && salesRep === null);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full border-2 border-gray-200">
          <div className="text-center mb-6">
            <Image
              src="/logoneu.png"
              alt="Muckenfuss & Nagel Logo"
              width={120}
              height={60}
              className="mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              {showProfileStep ? 'Profil wählen' : 'Admin Login'}
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              {showProfileStep ? 'Als welcher Vertriebler möchten Sie arbeiten?' : 'Muckenfuss & Nagel CRM'}
            </p>
          </div>
          {showProfileStep ? (
            <div className="flex flex-col gap-3">
              {SALES_REPS.map(({ value, label }) => (
                <Button
                  key={value}
                  type="button"
                  onClick={() => handleProfileSelect(value)}
                  className="w-full h-12 bg-[#cb530a] hover:bg-[#a84308] text-lg"
                >
                  {label}
                </Button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-password">Passwort</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#cb530a] hover:bg-[#a84308]">
                Anmelden
              </Button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'contacts', label: 'Alle Kontakte', icon: Contact },
    { id: 'meine-kontakte', label: 'Meine Kontakte', icon: User },
    { id: 'deals', label: 'Abschlüsse', icon: DollarSign },
    { id: 'leads', label: 'Leads', icon: Target },
    { id: 'kunden', label: 'Kunden', icon: Building2 },
    { id: 'kundenprojekte', label: 'Kundenprojekte', icon: FolderKanban },
  ];

  const scraperSubItems: { id: string; label: string }[] = [
    { id: 'scraper-gelbeseiten', label: 'Gelbe Seiten' },
    { id: 'scraper-11880', label: '11880.com' },
  ];
  const isScraperActive = activeNav === 'scraper-gelbeseiten' || activeNav === 'scraper-11880';

  const toolsSubItems: { id: string; label: string }[] = [
    { id: 'bewertungs-funnel', label: 'Bewertungs-Funnel' },
    { id: 'angebots-erstellung', label: 'Angebotserstellung' },
  ];
  const isToolsActive = activeNav === 'bewertungs-funnel' || activeNav === 'angebots-erstellung';

  // Logik für verschiedene Views basierend auf Status (und Vertriebler bei "Meine Kontakte")
  const getViewData = () => {
    const myContacts = salesRep ? filteredContacts.filter(c => c.assigned_to === salesRep) : [];
    switch (activeNav) {
      case 'contacts':
        return {
          title: 'Alle Kontakte',
          description: 'Alle Kontakte und Ansprechpartner',
          contacts: filteredContacts,
          showStats: true
        };
      case 'meine-kontakte':
        return {
          title: 'Meine Kontakte',
          description: salesRep ? `Nur Ihnen zugewiesene Leads (${salesRep === 'sven' ? 'Sven' : 'Pascal'})` : 'Zugewiesene Kontakte',
          contacts: myContacts,
          showStats: true
        };
      case 'deals':
        // Abschlüsse: Aktive Phasen (Offen, Kontaktversuch, Verbunden, Qualifiziert + Legacy)
        return {
          title: 'Abschlüsse',
          description: 'Aktive Verhandlungen und Angebote',
          contacts: filteredContacts.filter(c => {
            const active = ['offen', 'kontaktversuch', 'verbunden', 'qualifiziert', 'kontaktiert', 'in_bearbeitung'].includes(c.status);
            return active && (statusFilter === 'alle' || c.status === statusFilter);
          }),
          showStats: true
        };
      case 'kunden':
        // Kunden: Kunde / Abgeschlossen
        return {
          title: 'Kunden',
          description: 'Bestehende Kunden und Partner',
          contacts: filteredContacts.filter(c => {
            const isKunde = c.status === 'kunde' || c.status === 'abgeschlossen';
            return isKunde && (statusFilter === 'alle' || c.status === statusFilter);
          }),
          showStats: true
        };
      case 'kundenprojekte':
        // Kundenprojekte: Projekte für Kunden
        return {
          title: 'Kundenprojekte',
          description: 'Projekte für bestehende Kunden',
          contacts: filteredContacts.filter(c => c.status === 'abgeschlossen' || c.status === 'kunde'),
          showStats: false
        };
      case 'leads':
        return {
          title: 'Leads',
          description: 'Alle gescrapten Leads (Gelbe Seiten, 11880)',
          contacts: filteredContacts,
          showStats: false
        };
      case 'bewertungs-funnel':
        return { title: 'Bewertungs-Funnel', description: 'Google-Bewertungs-Einladungen im Namen von Kunden versenden', contacts: [], showStats: false };
      case 'angebots-erstellung':
        return { title: 'Angebotserstellung', description: 'Angebote gestalten, Vorschau anzeigen und als PDF speichern', contacts: [], showStats: false };
      case 'scraper-gelbeseiten':
        return { title: 'Gelbe Seiten', description: 'Leads aus gelbeseiten.de scrapen', contacts: [], showStats: false };
      case 'scraper-11880':
        return { title: '11880.com', description: 'Leads aus 11880.com scrapen (inkl. E-Mail/Website von Detailseiten)', contacts: [], showStats: false };
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
      {/* Sidebar – Upgrade: klare Hierarchie, weiche Hover/Active, Orange-Akzent */}
      <aside className="w-64 bg-neutral-950 border-r border-neutral-800 fixed left-0 top-0 bottom-0 overflow-y-auto flex flex-col shadow-xl">
        <div className="p-5 border-b border-neutral-800/80 shrink-0">
          <Link href="/" className="flex items-center gap-3 rounded-lg p-2 -m-2 hover:bg-neutral-800/50 transition-colors">
            <Image
              src="/logoneu.png"
              alt="Muckenfuss & Nagel Logo"
              width={180}
              height={90}
              className="h-10 w-auto"
              priority
              loading="eager"
            />
          </Link>
        </div>
        <nav className="p-3 flex-1">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
            CRM
          </p>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[#cb530a] text-white font-medium shadow-md'
                      : 'text-neutral-300 hover:bg-neutral-800/70 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 shrink-0 opacity-90" />}
                </button>
              );
            })}
          </div>
          <p className="px-3 py-2 mt-6 text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
            Lead-Scraping
          </p>
          <div className="mt-0.5">
            <button
              type="button"
              onClick={() => setScraperMenuOpen(!scraperMenuOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isScraperActive ? 'bg-neutral-800 text-white' : 'text-neutral-300 hover:bg-neutral-800/70 hover:text-white'
              }`}
            >
              <Globe className="w-5 h-5 shrink-0 text-neutral-400" />
              <span className="flex-1 text-left">Quellen</span>
              {scraperMenuOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
            </button>
            {scraperMenuOpen && (
              <div className="ml-2 mt-1 pl-4 border-l border-neutral-800 space-y-0.5">
                {scraperSubItems.map((sub) => {
                  const isSubActive = activeNav === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setActiveNav(sub.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isSubActive
                          ? sub.id === 'scraper-gelbeseiten'
                            ? 'bg-[#F5C400]/20 text-[#F5C400] font-medium border-l-2 border-[#F5C400] -ml-px pl-3'
                            : 'bg-[#00a651]/20 text-emerald-300 font-medium border-l-2 border-[#00a651] -ml-px pl-3'
                          : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                      }`}
                    >
                      <span className="flex-1 text-left truncate">{sub.label}</span>
                      {isSubActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <p className="px-3 py-2 mt-6 text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
            Tools
          </p>
          <div className="mt-0.5">
            <button
              type="button"
              onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isToolsActive ? 'bg-neutral-800 text-white' : 'text-neutral-300 hover:bg-neutral-800/70 hover:text-white'
              }`}
            >
              <Wrench className="w-5 h-5 shrink-0 text-neutral-400" />
              <span className="flex-1 text-left">Tools</span>
              {toolsMenuOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
            </button>
            {toolsMenuOpen && (
              <div className="ml-2 mt-1 pl-4 border-l border-neutral-800 space-y-0.5">
                {toolsSubItems.map((sub) => {
                  const isSubActive = activeNav === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setActiveNav(sub.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isSubActive
                          ? 'bg-[#cb530a]/20 text-[#cb530a] font-medium border-l-2 border-[#cb530a] -ml-px pl-3'
                          : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                      }`}
                    >
                      <span className="flex-1 text-left truncate">{sub.label}</span>
                      {isSubActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main Content – min-w-0 verhindert Überlauf; nur Tabellen-Container scrollt horizontal */}
      <div className="flex-1 ml-64 min-w-0 overflow-x-hidden flex flex-col">
        {/* Minimale Top-Bar: Profil + Abmelden */}
        <header className="bg-black text-white border-b border-gray-800 sticky top-0 z-50">
          <div className="px-4 flex items-center justify-between h-10">
            <span className="text-xs text-gray-400">Eingeloggt als <strong className="text-white">{salesRep === 'sven' ? 'Sven' : salesRep === 'pascal' ? 'Pascal' : '—'}</strong></span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHistoryDialogOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm hover:bg-gray-800 rounded transition-colors"
                title="Aktivitätsverlauf"
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm hover:bg-gray-800 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Abmelden</span>
              </button>
            </div>
          </div>
        </header>

        {migrationRequired && (
          <div className="bg-[#cb530a] text-white px-6 py-3 flex items-center justify-between gap-4">
            <span className="font-medium">
              Datenbank-Migration fehlt: Spalten <code className="bg-black/10 px-1 rounded">source</code>, <code className="bg-black/10 px-1 rounded">scrape_batch_id</code> und <code className="bg-black/10 px-1 rounded">company</code> in <code className="bg-black/10 px-1 rounded">contact_submissions</code> anlegen. SQL siehe <strong>SUPABASE_SCRAPER_MIGRATION.md</strong> im Projekt – im Supabase Dashboard unter SQL Editor ausführen.
            </span>
            <button
              type="button"
              onClick={() => setMigrationRequired(false)}
              className="shrink-0 px-3 py-1 bg-white/20 rounded hover:bg-white/30"
            >
              Schließen
            </button>
          </div>
        )}

        {/* Content: Bewertungs-Funnel, Scraper-Seiten oder CRM-Views */}
        {activeNav === 'bewertungs-funnel' ? (
          <div className="p-6 min-h-[calc(100vh-4rem)]">
            <h2 className="text-xl font-semibold text-foreground mb-1">Google-Bewertungs-Funnel</h2>
            <p className="text-sm text-muted-foreground mb-6">Wählen Sie einen Kunden aus dem CRM – dann bauen Sie für diesen Kunden einen eigenen Funnel (Empfänger, Vorlage, Versand).</p>

            {/* CRM-Kunden: nur Leads mit Status Kunde / Abgeschlossen */}
            {(() => {
              const crmCustomers = contacts.filter(c => c.status === 'kunde' || c.status === 'abgeschlossen');
              return (
                <Card className="rounded-xl border border-border/80 bg-card p-5 mb-6">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Building2 className="w-4 h-4" /> Kunde auswählen</h3>
                  <p className="text-xs text-muted-foreground mb-3">Leads mit Status &quot;Kunde&quot; oder &quot;Abgeschlossen&quot; – für jeden Kunden einen eigenen Funnel.</p>
                  {selectedReviewCustomer ? (
                    <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-[#cb530a]/10 border border-[#cb530a]/30">
                      <span className="font-medium text-foreground">Funnel für: {getReviewCustomerDisplayName(selectedReviewCustomer)}</span>
                      <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => {
                        setSelectedReviewCustomer(null);
                        setReviewRecipients([]);
                        setReviewSendResult(null);
                      }}>Anderen Kunden wählen</Button>
                    </div>
                  ) : crmCustomers.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">Keine Kunden im CRM. Bitte zuerst Leads mit Status &quot;Kunde&quot; oder &quot;Abgeschlossen&quot; anlegen.</p>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 max-h-64 overflow-y-auto">
                      {crmCustomers.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className="text-left p-3 rounded-lg border border-border/80 bg-muted/30 hover:bg-[#cb530a]/10 hover:border-[#cb530a]/40 transition-colors"
                          onClick={() => {
                            const name = getReviewCustomerDisplayName(c);
                            const link = getGoogleReviewLinkFromNotes(c.notes) || '';
                            setSelectedReviewCustomer(c);
                            setReviewTemplate(t => ({ ...t, kunde: name, googleLink: link || t.googleLink }));
                            setReviewRecipients([]);
                            setReviewManual(m => ({ ...m, kunde: name }));
                            setReviewSendResult(null);
                          }}
                        >
                          <span className="font-medium text-foreground block truncate">{getReviewCustomerDisplayName(c)}</span>
                          {(c.company || c.email || c.phone) && (
                            <span className="text-xs text-muted-foreground block truncate mt-0.5">{[c.company, c.email, c.phone].filter(Boolean).join(' · ')}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })()}

            {/* Funnel-Inhalt nur wenn ein Kunde ausgewählt ist */}
            {selectedReviewCustomer && (
              <>
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="rounded-xl border border-border/80 bg-card p-5">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Upload className="w-4 h-4" /> CSV hochladen</h3>
                    <p className="text-xs text-muted-foreground mb-3">Spalten: name, email, phone, link (optional). Kunde wird aus der Auswahl übernommen.</p>
                    <input
                      type="file"
                      accept=".csv"
                      className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-input file:bg-muted file:text-foreground"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const kundeName = getReviewCustomerDisplayName(selectedReviewCustomer);
                        const r = new FileReader();
                        r.onload = () => {
                          const text = (r.result as string) || '';
                          const lines = text.split(/\r?\n/).filter(Boolean);
                          if (lines.length < 2) return;
                          const headers = lines[0].toLowerCase().split(/[,;]/).map(h => h.trim());
                          const nameI = headers.findIndex(h => h === 'name' || h === 'vorname');
                          const emailI = headers.findIndex(h => h === 'email' || h === 'e-mail');
                          const phoneI = headers.findIndex(h => h === 'phone' || h === 'telefon');
                          const kundeI = headers.findIndex(h => h === 'kunde' || h === 'client');
                          const linkI = headers.findIndex(h => h === 'link' || h === 'url');
                          const rows: ReviewRecipient[] = [];
                          for (let i = 1; i < lines.length; i++) {
                            const cells = lines[i].split(/[,;]/).map(c => c.trim().replace(/^["']|["']$/g, ''));
                            const name = (nameI >= 0 ? cells[nameI] : cells[0]) || '';
                            const email = (emailI >= 0 ? cells[emailI] : cells[1]) || '';
                            const phone = (phoneI >= 0 ? cells[phoneI] : cells[2]) || '';
                            const kunde = (kundeI >= 0 ? cells[kundeI] : kundeName) || kundeName;
                            const googleLink = linkI >= 0 ? cells[linkI] : '';
                            if (name || email || phone) rows.push({ id: `csv-${i}-${Date.now()}`, name, email, phone, kunde, googleLink: googleLink || undefined });
                          }
                          setReviewRecipients(prev => [...prev, ...rows]);
                        };
                        r.readAsText(f, 'UTF-8');
                        e.target.value = '';
                      }}
                    />
                  </Card>
                  <Card className="rounded-xl border border-border/80 bg-card p-5">
                    <h3 className="font-semibold text-foreground mb-3">Manuell hinzufügen</h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Input placeholder="Name" value={reviewManual.name} onChange={(e) => setReviewManual(m => ({ ...m, name: e.target.value }))} className="h-9" />
                      <Input type="email" placeholder="E-Mail" value={reviewManual.email} onChange={(e) => setReviewManual(m => ({ ...m, email: e.target.value }))} className="h-9" />
                      <Input placeholder="Telefon" value={reviewManual.phone} onChange={(e) => setReviewManual(m => ({ ...m, phone: e.target.value }))} className="h-9" />
                      <Input placeholder="Google-Bewertung-Link (optional)" value={reviewManual.googleLink} onChange={(e) => setReviewManual(m => ({ ...m, googleLink: e.target.value }))} className="h-9 sm:col-span-2" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Kunde: {getReviewCustomerDisplayName(selectedReviewCustomer)}</p>
                    <Button type="button" size="sm" className="mt-2 bg-[#cb530a] hover:bg-[#a84308]" onClick={() => {
                      if (!reviewManual.name && !reviewManual.email && !reviewManual.phone) return;
                      const kundeName = getReviewCustomerDisplayName(selectedReviewCustomer);
                      setReviewRecipients(prev => [...prev, { id: `m-${Date.now()}`, name: reviewManual.name, email: reviewManual.email, phone: reviewManual.phone, kunde: kundeName, googleLink: reviewManual.googleLink || undefined }]);
                      setReviewManual({ name: '', email: '', phone: '', kunde: kundeName, googleLink: '' });
                    }}>Hinzufügen</Button>
                  </Card>
                </div>

                <Card className="mt-6 rounded-xl border border-border/80 bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-3">Empfänger ({reviewRecipients.length})</h3>
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-border/60">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr><th className="text-left p-2">Name</th><th className="text-left p-2">E-Mail</th><th className="text-left p-2">Telefon</th><th className="text-left p-2">Kunde</th><th className="w-8" /></tr>
                      </thead>
                      <tbody>
                        {reviewRecipients.map((r) => (
                          <tr key={r.id} className="border-t border-border/40">
                            <td className="p-2">{r.name || '—'}</td>
                            <td className="p-2">{r.email || '—'}</td>
                            <td className="p-2">{r.phone || '—'}</td>
                            <td className="p-2">{r.kunde || '—'}</td>
                            <td className="p-1"><button type="button" className="text-muted-foreground hover:text-destructive text-xs" onClick={() => setReviewRecipients(prev => prev.filter(x => x.id !== r.id))}>Entfernen</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {reviewRecipients.length > 0 && (
                    <button type="button" className="mt-2 text-xs text-muted-foreground hover:underline" onClick={() => setReviewRecipients([])}>Alle löschen</button>
                  )}
                </Card>

                <Card className="mt-6 rounded-xl border border-border/80 bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-3">Nachrichtenvorlage (für diesen Kunden)</h3>
                  <p className="text-xs text-muted-foreground mb-2">Platzhalter: {'{{name}}'}, {'{{kunde}}'}, {'{{link}}'}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label className="text-xs">Kunde (Auftraggeber)</Label>
                      <Input value={reviewTemplate.kunde} onChange={(e) => setReviewTemplate(t => ({ ...t, kunde: e.target.value }))} placeholder="z. B. Muster GmbH" className="mt-1 h-9" />
                    </div>
                    <div>
                      <Label className="text-xs">Google-Bewertung-Link</Label>
                      <Input value={reviewTemplate.googleLink} onChange={(e) => setReviewTemplate(t => ({ ...t, googleLink: e.target.value }))} placeholder="https://g.page/..." className="mt-1 h-9" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label className="text-xs">Nachrichtentext</Label>
                    <Textarea value={reviewTemplate.messageBody} onChange={(e) => setReviewTemplate(t => ({ ...t, messageBody: e.target.value }))} rows={5} className="mt-1 text-sm" />
                  </div>
                </Card>

                <Card className="mt-6 rounded-xl border border-border/80 bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-3">Versand</h3>
                  {reviewSendResult && (
                    <div className={`mb-3 p-3 rounded-lg text-sm ${reviewSendResult.ok ? 'bg-emerald-500/10 text-emerald-800' : 'bg-destructive/10 text-destructive'}`}>
                      {reviewSendResult.ok ? `${reviewSendResult.sent ?? 0} E-Mail(s) gesendet.` : (reviewSendResult.error || 'Fehler beim Versand.')}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <Button disabled={reviewRecipients.length === 0 || reviewSending} className="bg-[#cb530a] hover:bg-[#a84308]" onClick={async () => {
                      const withEmail = reviewRecipients.filter(r => r.email?.trim());
                      if (withEmail.length === 0) { setReviewSendResult({ ok: false, error: 'Keine Empfänger mit E-Mail.' }); return; }
                      setReviewSending(true); setReviewSendResult(null);
                      try {
                        const res = await fetch('/api/admin/review-funnel/send', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'include',
                          body: JSON.stringify({
                            recipients: withEmail.map(r => ({ name: r.name, email: r.email, kunde: r.kunde || reviewTemplate.kunde, googleLink: r.googleLink || reviewTemplate.googleLink })),
                            template: reviewTemplate
                          })
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || 'Versand fehlgeschlagen');
                        setReviewSendResult({ ok: true, sent: data.sent ?? withEmail.length });
                      } catch (err) {
                        setReviewSendResult({ ok: false, error: err instanceof Error ? err.message : 'Fehler' });
                      } finally {
                        setReviewSending(false);
                      }
                    }}>{reviewSending ? 'Sende…' : 'Per E-Mail senden'}</Button>
                    <Button variant="outline" disabled={reviewRecipients.length === 0} onClick={() => {
                      const kunde = reviewTemplate.kunde || 'Unser Kunde';
                      const link = reviewTemplate.googleLink || '{{link}}';
                      const body = reviewTemplate.messageBody.replace(/\{\{kunde\}\}/g, kunde).replace(/\{\{link\}\}/g, link);
                      const first = reviewRecipients[0];
                      const name = first?.name || 'Sie';
                      const text = body.replace(/\{\{name\}\}/g, name);
                      const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                      window.open(waUrl, '_blank');
                    }}>WhatsApp-Vorlage öffnen (1. Empfänger)</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">E-Mail: Resend-API (RESEND_API_KEY in .env). WhatsApp: Link öffnet Vorlage zum manuellen Versand.</p>
                </Card>
              </>
            )}
          </div>
        ) : activeNav === 'angebots-erstellung' ? (
          <div className="p-6 min-h-[calc(100vh-4rem)]">
            <h2 className="text-xl font-semibold text-foreground mb-1">Angebotserstellung</h2>
            <p className="text-sm text-muted-foreground mb-6">Angebot gestalten, im neuen Tab als Vorschau anzeigen und per Drucken → &quot;Als PDF speichern&quot; herunterladen.</p>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="rounded-xl border border-border/80 bg-card p-5">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><FileText className="w-4 h-4" /> Design &amp; Inhalt</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Überschrift (orangener Balken)</Label>
                    <Input value={angebot.headline} onChange={(e) => setAngebot(a => ({ ...a, headline: e.target.value }))} placeholder="Ihr persönliches Angebot" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">Unterzeile (z. B. Slogan)</Label>
                    <Input value={angebot.subline} onChange={(e) => setAngebot(a => ({ ...a, subline: e.target.value }))} placeholder="Ihr Büro. Ihr Geschäft. Unsere Expertise." className="mt-1 h-9" />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <Label className="text-xs">Kunde (Ansprechpartner)</Label>
                      <Input value={angebot.kundeName} onChange={(e) => setAngebot(a => ({ ...a, kundeName: e.target.value }))} placeholder="Name" className="mt-1 h-9" />
                    </div>
                    <div>
                      <Label className="text-xs">Firma</Label>
                      <Input value={angebot.kundeFirma} onChange={(e) => setAngebot(a => ({ ...a, kundeFirma: e.target.value }))} placeholder="Firmenname" className="mt-1 h-9" />
                    </div>
                    <div>
                      <Label className="text-xs">Straße</Label>
                      <Input value={angebot.kundeStrasse} onChange={(e) => setAngebot(a => ({ ...a, kundeStrasse: e.target.value }))} placeholder="Straße, Hausnr." className="mt-1 h-9" />
                    </div>
                    <div>
                      <Label className="text-xs">PLZ und Ort</Label>
                      <Input value={angebot.kundePlzOrt} onChange={(e) => setAngebot(a => ({ ...a, kundePlzOrt: e.target.value }))} placeholder="12345 Berlin" className="mt-1 h-9" />
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="rounded-xl border border-border/80 bg-card p-5">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Leistung &amp; Konditionen</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Produkt / Leistung</Label>
                    <select
                      value={angebot.produkt} onChange={(e) => setAngebot(a => ({ ...a, produkt: e.target.value }))}
                      className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                    >
                      <option value="">— Bitte wählen —</option>
                      {ANGEBOT_PRODUKTE.map(p => (<option key={p} value={p}>{p}</option>))}
                    </select>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <Label className="text-xs">Unser Preis netto (€)</Label>
                      <Input value={angebot.preis} onChange={(e) => setAngebot(a => ({ ...a, preis: e.target.value }))} placeholder="z. B. 499" className="mt-1 h-9" />
                    </div>
                    <div>
                      <Label className="text-xs">Originalpreis netto (für Rabatt-Anzeige)</Label>
                      <Input value={angebot.originalPreis} onChange={(e) => setAngebot(a => ({ ...a, originalPreis: e.target.value }))} placeholder="z. B. 599 (optional)" className="mt-1 h-9" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Laufzeit</Label>
                    <Input value={angebot.laufzeit} onChange={(e) => setAngebot(a => ({ ...a, laufzeit: e.target.value }))} placeholder="z. B. 12 Monate" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">Zusatz / Anmerkungen (optional)</Label>
                    <Textarea value={angebot.zusatz} onChange={(e) => setAngebot(a => ({ ...a, zusatz: e.target.value }))} rows={2} className="mt-1 text-sm" placeholder="Optionale Details …" />
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                className="bg-[#cb530a] hover:bg-[#a84308]"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const q = encodeURIComponent(JSON.stringify(angebot));
                    window.open('/angebot?d=' + q, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Vorschau in neuem Tab
              </Button>
              <p className="text-sm text-muted-foreground self-center">Öffnet die Angebotsseite unter /angebot. Dort: &quot;Als PDF speichern&quot; oder AGB-Button oben rechts.</p>
            </div>
          </div>
        ) : activeNav === 'scraper-gelbeseiten' ? (
          /* ——— Gelbe Seiten: gesamter Content-Bereich gelb, kein weißes Karten-Element ——— */
          <div
            className="min-h-[calc(100vh-4rem)] p-6 md:p-8"
            style={{ backgroundColor: GELBE_SEITEN_YELLOW }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ color: GELBE_SEITEN_BLACK }}>Gelbe Seiten</h2>
            <p className="text-sm mb-6 max-w-2xl" style={{ color: GELBE_SEITEN_BLACK }}>
                  Keyword und Ort eingeben → &quot;Jetzt scrapen&quot;. Zuerst erscheint &quot;Anzeigen sammeln…&quot;, dann die Anzahl gefundener Anzeigen; die Leads füllen sich live in die Tabelle. Sie können zu 11880 wechseln und dort ebenfalls scrapen. Bei Abschluss erscheint eine Meldung.
            </p>

            <div className="mb-6">
                  <div className="grid gap-4 sm:grid-cols-2 mb-4">
                    <div>
                      <label htmlFor="gs-keyword" className="block text-sm font-semibold text-gray-800 mb-2">Was (Keyword / Branche)</label>
                      <input
                        id="gs-keyword"
                        type="text"
                        placeholder="z. B. Zimmermann"
                        value={scrapeKeyword}
                        onChange={(e) => setScrapeKeyword(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="gs-location" className="block text-sm font-semibold text-gray-800 mb-2">Wo (Ort / Region)</label>
                      <input
                        id="gs-location"
                        type="text"
                        placeholder="z. B. Karlsruhe"
                        value={scrapeLocation}
                        onChange={(e) => setScrapeLocation(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] bg-white"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="gs-radius" className="block text-sm font-semibold text-gray-800 mb-2">Umkreis (km)</label>
                    <select
                      id="gs-radius"
                      value={scrapeRadius}
                      onChange={(e) => setScrapeRadius(Number(e.target.value))}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:border-[#1a1a1a] bg-white"
                    >
                      <option value={0}>Kein Umkreis</option>
                      <option value={10}>10 km</option>
                      <option value={25}>25 km</option>
                      <option value={50}>50 km</option>
                      <option value={100}>100 km</option>
                    </select>
                  </div>
                  {scrapingGS && (
                    <div className="mb-3 p-3 bg-white/80 rounded-lg border border-[#1a1a1a]/20">
                      <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                        {scrapePhaseGS === 'anzeigen_sammeln' ? 'Anzeigen sammeln…' : `${foundCountGS} Anzeigen gefunden`}
                      </p>
                      {scrapePhaseGS !== 'anzeigen_sammeln' && (
                        <p className="text-xs text-gray-600 mt-1">Leads füllen sich live in die Tabelle. Sie können zu 11880 wechseln und dort ebenfalls scrapen.</p>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={async () => {
                        if (!scrapeKeyword.trim() || !scrapeLocation.trim()) return;
                        setScrapingGS(true);
                        setScrapeErrorGS(null);
                        setScrapedLeadsGS([]);
                        streamingLeadsRef.current = [];
                        setScrapePhaseGS('anzeigen_sammeln');
                        setFoundCountGS(0);
                        setImportResultGS(null);
                        try {
                          const res = await fetch('/api/admin/scrape-gelbeseiten-stream', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                              keyword: scrapeKeyword.trim(),
                              location: scrapeLocation.trim(),
                              radiusKm: scrapeRadius > 0 ? scrapeRadius : undefined,
                            }),
                          });
                          if (!res.ok || !res.body) {
                            setScrapingGS(false);
                            setScrapeErrorGS(res.status === 401 ? 'Nicht autorisiert' : 'Stream konnte nicht gestartet werden.');
                            return;
                          }
                          const reader = res.body.getReader();
                          const decoder = new TextDecoder();
                          let buf = '';
                          while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;
                            buf += decoder.decode(value, { stream: true });
                            const lines = buf.split('\n\n');
                            buf = lines.pop() ?? '';
                            for (const line of lines) {
                              const match = line.match(/^data:\s*(.+)$/m);
                              if (!match) continue;
                              try {
                                const ev = JSON.parse(match[1].trim());
                                if (ev.phase === 'anzeigen_sammeln') setScrapePhaseGS('anzeigen_sammeln');
                                else if (ev.phase === 'found') {
                                  setFoundCountGS(ev.count ?? 0);
                                  setScrapePhaseGS('found');
                                } else if (ev.phase === 'lead' && ev.lead) {
                                  streamingLeadsRef.current.push(ev.lead);
                                  setScrapedLeadsGS(streamingLeadsRef.current.slice());
                                } else if (ev.phase === 'done') {
                                  setFoundCountGS(ev.count ?? 0);
                                  setScrapePhaseGS('done');
                                  setScrapingGS(false);
                                  const current = streamingLeadsRef.current;
                                  if (current.length > 0) await fetchExistingAndSetSelection(current, 'gelbeseiten');
                                  setScraperDoneNotification({ source: 'gelbeseiten', label: 'Gelbe Seiten', count: ev.count ?? current.length });
                                  if ((ev.count ?? 0) === 0) setScrapeErrorGS('Keine Treffer.');
                                } else if (ev.phase === 'error') {
                                  setScrapingGS(false);
                                  setScrapeErrorGS(ev.error ?? 'Scraping fehlgeschlagen.');
                                  setScraperDoneNotification({ source: 'gelbeseiten', label: 'Gelbe Seiten', count: 0, error: ev.error });
                                }
                              } catch (_) {}
                            }
                          }
                          if (buf) {
                            const match = buf.match(/^data:\s*(.+)$/m);
                            if (match) {
                              try {
                                const ev = JSON.parse(match[1].trim());
                                if (ev.phase === 'done') setScrapingGS(false);
                                else if (ev.phase === 'error') {
                                  setScrapingGS(false);
                                  setScrapeErrorGS(ev.error ?? '');
                                }
                              } catch (_) {}
                            }
                          }
                        } catch (e) {
                          setScrapingGS(false);
                          setScrapeErrorGS(e instanceof Error ? e.message : 'Scraping fehlgeschlagen.');
                          setScraperDoneNotification({ source: 'gelbeseiten', label: 'Gelbe Seiten', count: 0, error: e instanceof Error ? e.message : undefined });
                        }
                      }}
                      disabled={!scrapeKeyword.trim() || !scrapeLocation.trim() || scrapingGS}
                      className="px-4 py-2 bg-[#1a1a1a] text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {scrapingGS ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Scrapen läuft…
                        </>
                      ) : (
                        'Jetzt scrapen'
                      )}
                    </button>
                    {scrapeKeyword.trim() && scrapeLocation.trim() && (
                      <a
                        href={buildGelbeSeitenSearchUrl(scrapeKeyword, scrapeLocation, scrapeRadius > 0 ? scrapeRadius : undefined)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white border-2 border-[#1a1a1a] rounded-lg font-medium text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors inline-flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Suche in neuem Tab öffnen
                      </a>
                    )}
                  </div>
                  {scrapeError && (
                    <p className="mt-4 text-sm text-red-700 font-medium">{scrapeError}</p>
                  )}
                </div>

                {scrapedLeads.length > 0 && (
                  <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-[#1a1a1a]/20">
                    {selectedScrapedLeads.filter((s) => !s).length > 0 && (
                      <p className="text-[#cb530a] bg-[#cb530a]/10 border border-[#cb530a]/30 rounded-lg px-3 py-2 mb-3 text-sm font-medium">
                        {selectedScrapedLeads.filter((s) => !s).length} Duplikat(e) erkannt (bereits in Leads) – abgewählt. Sie können einzelne Zeilen per Klick an- oder abwählen.
                      </p>
                    )}
                    <p className="font-semibold text-gray-800 mb-3">{scrapedLeads.length} Treffer – Auswählen, dann importieren oder CSV</p>
                    <div className="rounded-lg border overflow-auto max-h-80 mb-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="w-10 p-2 text-center font-semibold text-gray-700">✓</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Firma</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Straße</th>
                            <th className="text-left p-3 font-semibold text-gray-700">PLZ / Ort</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Telefon</th>
                            <th className="text-left p-3 font-semibold text-gray-700">Website</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scrapedLeads.map((lead, i) => (
                            <tr key={i} className={`border-b border-gray-100 hover:bg-gray-50 ${selectedScrapedLeads[i] === false ? 'bg-neutral-100' : ''}`}>
                              <td className="p-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedScrapedLeads[i] !== false}
                                  onChange={() => {
                                    const next = [...(selectedScrapedLeads.length === scrapedLeads.length ? selectedScrapedLeads : scrapedLeads.map(() => true))];
                                    next[i] = !next[i];
                                    setSelectedScrapedLeadsCurrent(next);
                                  }}
                                  className="w-4 h-4 rounded border-gray-300"
                                />
                              </td>
                              <td className="p-3 font-medium text-gray-800">{lead.firma}</td>
                              <td className="p-3 text-gray-600 max-w-[200px]">{lead.adresse || '–'}</td>
                              <td className="p-3 text-gray-600">{lead.plz_ort || '–'}</td>
                              <td className="p-3 text-gray-600">{normalizeGermanPhone(lead.telefon) || '–'}</td>
                              <td className="p-3 max-w-[200px] truncate">
                                {lead.website ? (
                                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-[#1a1a1a] underline hover:no-underline">
                                    {lead.website}
                                  </a>
                                ) : (
                                  '–'
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={async () => {
                          const selected = scrapedLeads.filter((_, i) => selectedScrapedLeads[i] !== false);
                          if (selected.length === 0) {
                            alert('Bitte mindestens einen Lead auswählen.');
                            return;
                          }
                          try {
                            const res = await fetch('/api/admin/import-scraped-leads', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'include',
                              body: JSON.stringify({ leads: selected, source: 'gelbe_seiten' }),
                            });
                            let data: { ok?: boolean; inserted?: number; skipped_duplicates?: number; error?: string };
                            try {
                              data = await res.json();
                            } catch {
                              data = { ok: false, error: res.status === 401 ? 'Nicht autorisiert.' : `Server antwortete mit ${res.status}.` };
                            }
                            setImportResultGS({ ok: Boolean(data.ok), inserted: data.inserted, skipped_duplicates: data.skipped_duplicates });
                            if (data.ok) {
                              loadContacts(true);
                              setScrapedLeadsGS([]);
                              setSelectedScrapedLeadsGS([]);
                            } else {
                              alert(data.error || 'Import fehlgeschlagen.');
                            }
                          } catch (e) {
                            const msg = e instanceof Error ? e.message : 'Unbekannter Fehler';
                            alert(`Import fehlgeschlagen: ${msg}. Bitte prüfen Sie die Datenbank-Migration (SUPABASE_SCRAPER_MIGRATION.md) und dass der Server läuft.`);
                          }
                        }}
                        disabled={scrapedLeads.filter((_, i) => selectedScrapedLeads[i] !== false).length === 0}
                        className="px-4 py-2 bg-[#1a1a1a] text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                      >
                        Leads importieren ({scrapedLeads.filter((_, i) => selectedScrapedLeads[i] !== false).length} ausgewählt)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const selected = scrapedLeads.filter((_, i) => selectedScrapedLeads[i] !== false);
                          if (selected.length === 0) {
                            alert('Bitte mindestens einen Lead auswählen.');
                            return;
                          }
                          downloadCsvForHubspot(selected, scrapeKeyword.trim() || 'Suchbegriff', 'Gelbe Seiten');
                        }}
                        disabled={scrapedLeads.filter((_, i) => selectedScrapedLeads[i] !== false).length === 0}
                        className="px-4 py-2 bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        Download CSV für HubSpot
                      </button>
                    </div>
                  </div>
                )}

                {importResult && (
                  <p className="text-[#cb530a] font-medium">{importResult.ok && importResult.inserted != null && `${importResult.inserted} Lead(s) importiert.`}</p>
                )}
          </div>
        ) : activeNav === 'scraper-11880' ? (
          /* ——— 11880.com: gesamter Content-Bereich grün, kein weißes Karten-Element ——— */
          <div
            className="min-h-[calc(100vh-4rem)] p-6 md:p-8"
            style={{ backgroundColor: '#00a651' }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">11880.com</h2>
            <p className="text-white/95 text-sm mb-6 max-w-2xl">
              Branche und Ort eingeben → &quot;Jetzt scrapen&quot;. Der Scraper läuft im Hintergrund – Sie können zu Gelbe Seiten wechseln und dort ebenfalls scrapen. Bei Abschluss erscheint eine Meldung. Bei vielen Treffern (z. B. 170+) dauert das Auslesen aller Detailseiten mehrere Minuten – das ist normal.
            </p>

            <div className="mb-6">
                  <div className="grid gap-4 sm:grid-cols-2 mb-4">
                    <div>
                      <label htmlFor="11880-keyword" className="block text-sm font-semibold text-gray-800 mb-2">Was (Branche / Keyword)</label>
                      <input
                        id="11880-keyword"
                        type="text"
                        placeholder="z. B. Maurer"
                        value={scrapeKeyword}
                        onChange={(e) => setScrapeKeyword(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a651] focus:border-[#00a651] bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="11880-location" className="block text-sm font-semibold text-gray-800 mb-2">Wo (Ort / Region)</label>
                      <input
                        id="11880-location"
                        type="text"
                        placeholder="z. B. Karlsruhe"
                        value={scrapeLocation}
                        onChange={(e) => setScrapeLocation(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a651] focus:border-[#00a651] bg-white"
                      />
                    </div>
                  </div>
                  {scraping11880 && (
                    <div className="mb-3 p-3 bg-white/15 rounded-lg border border-white/30">
                      <p className="text-sm font-medium text-white flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                        Anzeigen sammeln…
                      </p>
                      <p className="text-xs text-white/90 mt-1">Suchseite → Anzeigen sammeln → Detailseiten nacheinander. Sie können zu Gelbe Seiten wechseln und dort ebenfalls scrapen. Bei Abschluss erscheint eine Meldung.</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        if (!scrapeKeyword.trim() || !scrapeLocation.trim()) return;
                        setScraping11880(true);
                        setScrapeError11880(null);
                        setScrapedLeads11880([]);
                        setImportResult11880(null);
                        scrape11880(scrapeKeyword.trim(), scrapeLocation.trim()).then(async (result) => {
                          try {
                            if (result.ok) {
                              setScrapedLeads11880(result.leads);
                              if (result.leads.length > 0) {
                                await fetchExistingAndSetSelection(result.leads, '11880');
                              }
                              setScraperDoneNotification({ source: '11880', label: '11880.com', count: result.leads.length });
                              if (result.leads.length === 0 && result.error) {
                                setScrapeError11880(result.error);
                              }
                            } else {
                              setScrapeError11880(result.error ?? 'Unbekannter Fehler beim Scrapen.');
                              setScraperDoneNotification({ source: '11880', label: '11880.com', count: 0, error: result.error });
                            }
                          } finally {
                            setScraping11880(false);
                          }
                        }).catch((e) => {
                          setScraping11880(false);
                          setScrapeError11880(e?.message ?? 'Scraping fehlgeschlagen.');
                          setScraperDoneNotification({ source: '11880', label: '11880.com', count: 0, error: e?.message });
                        });
                      }}
                      disabled={!scrapeKeyword.trim() || !scrapeLocation.trim() || scraping11880}
                      className="px-4 py-2 bg-[#004d28] text-white font-semibold rounded-lg hover:bg-[#003d20] transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {scraping11880 ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Scrapen läuft…
                        </>
                      ) : (
                        'Jetzt scrapen'
                      )}
                    </button>
                    {scrapeKeyword.trim() && scrapeLocation.trim() && (
                      <a
                        href={build11880SearchUrl(scrapeKeyword, scrapeLocation)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white border-2 border-[#004d28] rounded-lg font-medium text-[#004d28] hover:bg-[#004d28] hover:text-white transition-colors inline-flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Suche in neuem Tab öffnen
                      </a>
                    )}
                  </div>
                  {scrapeError && (
                  <p className="mt-4 text-sm text-red-700 font-medium">{scrapeError}</p>
                )}
            </div>

            {scrapedLeads.length > 0 && (
              <div className="mb-6 bg-white/10 rounded-lg p-6 border border-white/20">
                {selectedScrapedLeads.filter((s) => !s).length > 0 && (
                  <p className="text-white/95 bg-[#cb530a]/30 border border-[#cb530a]/50 rounded-lg px-3 py-2 mb-3 text-sm font-medium">
                    {selectedScrapedLeads.filter((s) => !s).length} Duplikat(e) erkannt (bereits in Leads) – abgewählt. Sie können einzelne Zeilen per Klick an- oder abwählen.
                  </p>
                )}
                <p className="font-semibold text-white mb-3">{scrapedLeads.length} Treffer – Auswählen, dann importieren oder CSV</p>
                <div className="rounded-lg border border-white/30 overflow-auto max-h-80 mb-4 bg-white">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200">
                        <th className="w-10 p-2 text-center font-semibold text-gray-700">✓</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Firma</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Straße</th>
                        <th className="text-left p-3 font-semibold text-gray-700">PLZ / Ort</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Telefon</th>
                        <th className="text-left p-3 font-semibold text-gray-700">E-Mail</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Website</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scrapedLeads.map((lead, i) => (
                        <tr key={i} className={`border-b border-gray-100 hover:bg-gray-50 ${selectedScrapedLeads[i] === false ? 'bg-neutral-100' : ''}`}>
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              checked={selectedScrapedLeads[i] !== false}
                              onChange={() => {
                                const next = [...(selectedScrapedLeads.length === scrapedLeads.length ? selectedScrapedLeads : scrapedLeads.map(() => true))];
                                next[i] = !next[i];
                                setSelectedScrapedLeadsCurrent(next);
                              }}
                              className="w-4 h-4 rounded border-gray-300"
                            />
                          </td>
                          <td className="p-3 font-medium text-gray-800">{lead.firma}</td>
                          <td className="p-3 text-gray-600 max-w-[200px]">{lead.adresse || '–'}</td>
                          <td className="p-3 text-gray-600">{lead.plz_ort || '–'}</td>
                          <td className="p-3 text-gray-600">{normalizeGermanPhone(lead.telefon) || '–'}</td>
                          <td className="p-3 max-w-[180px] truncate">
                            {lead.email ? (
                              <a href={`mailto:${lead.email}`} className="text-[#00a651] hover:underline">{lead.email}</a>
                            ) : (
                              '–'
                            )}
                          </td>
                          <td className="p-3 max-w-[200px] truncate">
                            {lead.website ? (
                              <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-[#00a651] hover:underline">
                                {lead.website}
                              </a>
                            ) : (
                              '–'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={async () => {
                      const selected = scrapedLeads.filter((_, i) => selectedScrapedLeads[i] !== false);
                      if (selected.length === 0) {
                        alert('Bitte mindestens einen Lead auswählen.');
                        return;
                      }
                      try {
                        const res = await fetch('/api/admin/import-scraped-leads', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'include',
                          body: JSON.stringify({ leads: selected, source: '11880' }),
                        });
                        let data: { ok?: boolean; inserted?: number; skipped_duplicates?: number; error?: string };
                        try {
                          data = await res.json();
                        } catch {
                          data = { ok: false, error: res.status === 401 ? 'Nicht autorisiert.' : `Server antwortete mit ${res.status}.` };
                        }
                        setImportResult11880({ ok: Boolean(data.ok), inserted: data.inserted, skipped_duplicates: data.skipped_duplicates });
                        if (data.ok) {
                          loadContacts(true);
                          setScrapedLeads11880([]);
                          setSelectedScrapedLeads11880([]);
                        } else {
                          alert(data.error || 'Import fehlgeschlagen.');
                        }
                      } catch (e) {
                        const msg = e instanceof Error ? e.message : 'Unbekannter Fehler';
                        alert(`Import fehlgeschlagen: ${msg}. Bitte prüfen Sie die Datenbank-Migration (SUPABASE_SCRAPER_MIGRATION.md) und dass der Server läuft.`);
                      }
                    }}
                    disabled={scrapedLeads.filter((_, i) => selectedScrapedLeads[i] !== false).length === 0}
                    className="px-4 py-2 bg-[#004d28] text-white font-semibold rounded-lg hover:bg-[#003d20] transition-colors disabled:opacity-50"
                  >
                    Leads importieren ({scrapedLeads.filter((_, i) => selectedScrapedLeads[i] !== false).length} ausgewählt)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const selected = scrapedLeads.filter((_, i) => selectedScrapedLeads[i] !== false);
                      if (selected.length === 0) {
                        alert('Bitte mindestens einen Lead auswählen.');
                        return;
                      }
                      downloadCsvForHubspot(selected, scrapeKeyword.trim() || 'Suchbegriff', '11880');
                    }}
                    disabled={scrapedLeads.filter((_, i) => selectedScrapedLeads[i] !== false).length === 0}
                    className="px-4 py-2 bg-white text-[#004d28] font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Download CSV für HubSpot
                  </button>
                </div>
              </div>
            )}

                {importResult && (
                <p className="text-white font-medium">{importResult.ok && importResult.inserted != null && `${importResult.inserted} Lead(s) importiert.`}</p>
              )}
          </div>
        ) : (
          <div className="p-4">
        {/* View Header – kompakt */}
        <div className="mb-3 flex items-baseline gap-3">
          <h2 className="text-lg font-semibold text-foreground">{viewData.title}</h2>
          <p className="text-xs text-muted-foreground">{viewData.description}</p>
        </div>

        {loadError && (
          <Card className="mb-3 rounded-lg border-[#cb530a]/50 bg-[#cb530a]/5 p-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-[#cb530a] font-medium">{loadError}</span>
            <Button variant="outline" size="sm" className="border-[#cb530a]/50 text-[#cb530a] hover:bg-[#cb530a]/10 text-xs h-7" onClick={() => { setLoadError(null); loadContacts(activeNav === 'leads' ? true : undefined); }}>
              Erneut laden
            </Button>
          </Card>
        )}

        {/* KPI-Cards – kompakt */}
        {viewData.showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            <Card className="rounded-lg border border-border/80 bg-card overflow-hidden border-l-4 border-l-neutral-800">
              <CardContent className="flex items-center justify-between p-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Neu</p>
                  <p className="text-lg font-bold tabular-nums text-foreground">{kpiNeu}</p>
                </div>
                <div className="rounded-lg bg-neutral-200 p-2"><Clock className="w-4 h-4 text-neutral-700" /></div>
              </CardContent>
            </Card>
            <Card className="rounded-lg border border-border/80 bg-card overflow-hidden border-l-4 border-l-[#cb530a]">
              <CardContent className="flex items-center justify-between p-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Aktiv</p>
                  <p className="text-lg font-bold tabular-nums text-foreground">{kpiAktiv}</p>
                </div>
                <div className="rounded-lg bg-[#cb530a]/10 p-2"><MessageSquare className="w-4 h-4 text-[#cb530a]" /></div>
              </CardContent>
            </Card>
            <Card className="rounded-lg border border-border/80 bg-card overflow-hidden border-l-4 border-l-neutral-500">
              <CardContent className="flex items-center justify-between p-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Nicht qual. / Wiedervorlage</p>
                  <p className="text-lg font-bold tabular-nums text-foreground">{kpiNichtQual}</p>
                </div>
                <div className="rounded-lg bg-neutral-200 p-2"><XCircle className="w-4 h-4 text-neutral-600" /></div>
              </CardContent>
            </Card>
            <Card className="rounded-lg border border-border/80 bg-card overflow-hidden border-l-4 border-l-black">
              <CardContent className="flex items-center justify-between p-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Kunde</p>
                  <p className="text-lg font-bold tabular-nums text-foreground">{kpiKunde}</p>
                </div>
                <div className="rounded-lg bg-neutral-200 p-2"><CheckCircle2 className="w-4 h-4 text-neutral-800" /></div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filter und Suche – kompakt */}
        <Card className="rounded-lg border border-border/80 bg-card p-3 mb-3">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Suche nach Name, E-Mail oder Telefon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              <div className="relative">
                <Filter className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-7 pr-3 py-1.5 h-8 text-xs rounded-md border border-input bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus:outline-none appearance-none"
                >
                  <option value="alle">Alle Status</option>
                  {LEAD_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-0 rounded-md border border-input overflow-hidden">
                <Button variant={viewMode === 'pipeline' ? 'default' : 'ghost'} size="sm" className="rounded-none h-8 px-2.5 text-xs bg-[#cb530a] hover:bg-[#a84308] data-[variant=ghost]:bg-transparent" onClick={() => setViewMode('pipeline')}>Pipeline</Button>
                <Button variant={viewMode === 'table' ? 'default' : 'ghost'} size="sm" className="rounded-none h-8 px-2.5 text-xs bg-[#cb530a] hover:bg-[#a84308] data-[variant=ghost]:bg-transparent" onClick={() => setViewMode('table')}>Tabelle</Button>
              </div>
              <Button onClick={() => loadContacts()} disabled={loading} size="sm" className="h-8 px-3 text-xs bg-[#cb530a] hover:bg-[#a84308]">
                {loading ? 'Lädt...' : 'Aktualisieren'}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {viewData.contacts.length} {viewData.title === 'Kundenprojekte' ? 'Projekt' : 'Kontakt'}{viewData.contacts.length !== 1 ? (viewData.title === 'Kundenprojekte' ? 'e' : 'e') : ''} gefunden
          </p>
        </Card>

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
                  <span className="bg-neutral-200 text-neutral-800 px-3 py-1 rounded-full text-sm font-semibold">
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
                  <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {viewData.contacts.filter(c => c.notes && c.notes.includes('Projekt abgeschlossen')).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {viewData.contacts
                    .filter(c => c.notes && c.notes.includes('Projekt abgeschlossen'))
                    .map((contact) => (
                      <div key={contact.id} className="bg-neutral-100 rounded-lg p-4 border border-neutral-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800 mb-2">
                              ✓ Projekt für {contact.first_name} {contact.last_name}
                            </h5>
                            <p className="text-sm text-gray-600">{contact.service || 'Nicht angegeben'}</p>
                          </div>
                          <CheckCircle2 className="w-6 h-6 text-neutral-700" />
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
            <>
            {/* Pipeline: horizontal scrollbar nur im Content-Bereich, Sidebar bleibt fix; alle Status-Spalten sichtbar */}
            <div className="min-w-0 overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex gap-6 min-w-max">
                {PIPELINE_COLUMNS.map((status) => {
                  const statusContacts = viewData.contacts.filter(c => statusToPipelineColumn(c.status) === status);
                  return (
                    <div key={status} className="flex flex-col w-[280px] shrink-0">
                      <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 truncate">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getStatusColor(status)}`} />
                          {getStatusLabel(status)}
                        </h3>
                        <span className="rounded-full bg-muted/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground tabular-nums shrink-0">
                          {statusContacts.length}
                        </span>
                      </div>
                      <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
                        {statusContacts.map((contact) => (
                          <ContactCard
                            key={contact.id}
                            contact={contact}
                            leadStatuses={LEAD_STATUSES}
                    onStatusChange={(newStatus) => updateStatus(contact.id, newStatus)}
                    onContextMenu={(e) => setContextMenu({ x: e.clientX, y: e.clientY, contact })}
                    onNotesClick={() => { setSelectedContact(contact); setNotes(contact.notes || ''); }}
                    onAssignedChange={(assignedTo) => updateAssignedTo(contact.id, assignedTo)}
                    getProfileUrl={getProfileUrl}
                    getProfileLabel={getProfileLabel}
                    getWebsiteFromNotes={getWebsiteFromNotes}
                    renderQuizData={renderQuizData}
                    getStatusColor={getStatusColor}
                    getStatusLabel={getStatusLabel}
                    getSourceLabel={getSourceLabel}
                    getSourceBorderClass={getSourceBorderClass}
                        />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            </>
          ) : (
            /* Table View */
            <div className="space-y-4">
              {viewData.contacts.length === 0 ? (
                <Card className="rounded-2xl border border-border/80 bg-card shadow-sm p-12 text-center">
                  <p className="text-muted-foreground">Keine {viewData.title === 'Kundenprojekte' ? 'Projekte' : 'Kontakte'} gefunden.</p>
                </Card>
              ) : (activeNav === 'leads' || activeNav === 'contacts' || activeNav === 'meine-kontakte' || activeNav === 'kunden') && viewMode === 'table' ? (
                /* Tabelle – neues Design: abgerundet, Schatten, klare Zeilen */
                <div className="min-w-0 overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden">
                  <Card className="overflow-visible border-0 shadow-none rounded-none bg-transparent">
                    <Table className="table-fixed w-max min-w-full [&_tr]:border-b [&_tr]:border-border/60">
                      <colgroup>
                        {TABLE_COLUMN_KEYS.map((key) => (
                          <col key={key} style={{ width: tableColumnWidths[key] ?? 100, minWidth: 40 }} />
                        ))}
                      </colgroup>
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40 border-0">
                          {TABLE_COLUMN_KEYS.map((key, idx) => (
                            <TableHead
                              key={key}
                              style={{ width: tableColumnWidths[key], maxWidth: tableColumnWidths[key], minWidth: 40 }}
                              className="relative select-none pr-0 overflow-visible"
                            >
                              <span className="block truncate pr-2">
                                {key === 'quelle' ? 'Quelle' : key === 'vertriebler' ? 'Vertriebler' : key === 'firmaName' ? 'Firma / Name' : key === 'profil' ? '11880 Profil' : key === 'telefon' ? 'Telefon' : key === 'email' ? 'E-Mail' : key === 'website' ? 'Website' : key === 'ort' ? 'Ort' : key === 'strasse' ? 'Straße' : 'Status'}
                              </span>
                              {/* Sichtbarer Spaltentrenner – immer sichtbar, zum Ziehen */}
                              <div
                                role="separator"
                                aria-orientation="vertical"
                                className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-10 shrink-0 border-l-2 border-gray-400 hover:border-[#cb530a] hover:bg-primary/20 active:border-[#cb530a] active:bg-primary/30"
                                style={{ minWidth: 10 }}
                                title="Spaltenbreite ziehen"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setResizingColumn(key);
                                  resizeStartRef.current = { x: e.clientX, w: tableColumnWidths[key] ?? 100 };
                                }}
                              />
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewData.contacts.map((contact) => {
                          const profileUrl = getProfileUrl(contact);
                          const profileLabel = getProfileLabel(contact);
                          const firmaName = contact.company || `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || '—';
                          return (
                            <TableRow
                              key={contact.id}
                              className={`hover:bg-muted/30 transition-colors ${getSourceBorderClass(contact.source)}`}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                setContextMenu({ x: e.clientX, y: e.clientY, contact });
                              }}
                            >
                              <TableCell style={{ width: tableColumnWidths.quelle, maxWidth: tableColumnWidths.quelle, minWidth: 0 }} className="overflow-hidden"><span className="block truncate text-xs font-medium text-muted-foreground min-w-0">{getSourceLabel(contact.source)}</span></TableCell>
                              <TableCell style={{ width: tableColumnWidths.vertriebler, maxWidth: tableColumnWidths.vertriebler, minWidth: 0 }} className="overflow-hidden min-w-0">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-7 w-full min-w-0 text-xs justify-start"
                                  onClick={() => setAssignDialogContact(contact)}
                                >
                                  {contact.assigned_to === 'sven' ? 'Sven' : contact.assigned_to === 'pascal' ? 'Pascal' : '—'}
                                </Button>
                              </TableCell>
                              <TableCell style={{ width: tableColumnWidths.firmaName, maxWidth: tableColumnWidths.firmaName, minWidth: 0 }} className="font-medium overflow-hidden min-w-0" title={firmaName}><span className="block truncate min-w-0">{firmaName}</span></TableCell>
                              <TableCell style={{ width: tableColumnWidths.profil, maxWidth: tableColumnWidths.profil, minWidth: 0 }} className="overflow-hidden min-w-0">
                                {profileUrl ? (
                                  <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium text-xs block truncate min-w-0" title={profileLabel || undefined}>Link →</a>
                                ) : '—'}
                              </TableCell>
                              <TableCell style={{ width: tableColumnWidths.telefon, maxWidth: tableColumnWidths.telefon, minWidth: 0 }} className="overflow-hidden min-w-0">
                                {contact.phone ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-muted-foreground truncate">{contact.phone}</span>
                                    <a
                                      href={`tel:${contact.phone.replace(/\s/g, '')}`}
                                      className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 text-xs font-medium transition-colors"
                                      title="Mit Placetel/Telefon anrufen"
                                    >
                                      <Phone className="w-3.5 h-3.5" />
                                      Anrufen
                                    </a>
                                  </div>
                                ) : '—'}
                              </TableCell>
                              <TableCell style={{ width: tableColumnWidths.email, maxWidth: tableColumnWidths.email, minWidth: 0 }} className="text-muted-foreground overflow-hidden min-w-0 truncate">{contact.email || '—'}</TableCell>
                              <TableCell style={{ width: tableColumnWidths.website, maxWidth: tableColumnWidths.website, minWidth: 0 }} className="overflow-hidden min-w-0">
                                {getWebsiteFromNotes(contact.notes) ? (
                                  <a href={getWebsiteFromNotes(contact.notes)!} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs block truncate min-w-0" title={getWebsiteFromNotes(contact.notes)!}>Website</a>
                                ) : '—'}
                              </TableCell>
                              <TableCell style={{ width: tableColumnWidths.ort, maxWidth: tableColumnWidths.ort, minWidth: 0 }} className="text-muted-foreground overflow-hidden min-w-0 truncate">{contact.city || '—'}</TableCell>
                              <TableCell style={{ width: tableColumnWidths.strasse, maxWidth: tableColumnWidths.strasse, minWidth: 0 }} className="text-muted-foreground overflow-hidden min-w-0 truncate" title={contact.street || ''}>{contact.street || '—'}</TableCell>
                              <TableCell style={{ width: tableColumnWidths.status, maxWidth: tableColumnWidths.status, minWidth: 0 }} className="overflow-hidden min-w-0">
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold truncate max-w-full min-w-0 align-middle ${getStatusColor(contact.status)}`} title={getStatusLabel(contact.status)}>{getStatusLabel(contact.status)}</span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              ) : (
                viewData.contacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    leadStatuses={LEAD_STATUSES}
                    onStatusChange={(newStatus) => updateStatus(contact.id, newStatus)}
                    onContextMenu={(e) => setContextMenu({ x: e.clientX, y: e.clientY, contact })}
                    onNotesClick={() => { setSelectedContact(contact); setNotes(contact.notes || ''); }}
                    onAssignedChange={(assignedTo) => updateAssignedTo(contact.id, assignedTo)}
                    getProfileUrl={getProfileUrl}
                    getProfileLabel={getProfileLabel}
                    getWebsiteFromNotes={getWebsiteFromNotes}
                    renderQuizData={renderQuizData}
                    getStatusColor={getStatusColor}
                    getStatusLabel={getStatusLabel}
                    getSourceLabel={getSourceLabel}
                    getSourceBorderClass={getSourceBorderClass}
                    fullWidth
                  />
                ))
              )}
            </div>
          )
        )}
        </div>
        )}
      </div>

      {/* Popup: Scraper fertig (Hintergrund-Lauf) – shadcn Dialog */}
      <Dialog open={!!scraperDoneNotification} onOpenChange={(open) => { if (!open) setScraperDoneNotification(null); }}>
        <DialogContent className="sm:max-w-sm border-2 border-[#cb530a]">
          <DialogHeader>
            <DialogTitle>{scraperDoneNotification?.label}: Scraping abgeschlossen</DialogTitle>
            <DialogDescription>
              {scraperDoneNotification?.error ?? `${scraperDoneNotification?.count ?? 0} Treffer gefunden. Die Liste wurde aktualisiert.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="w-full bg-[#cb530a] hover:bg-[#a84308]" onClick={() => setScraperDoneNotification(null)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History – Aktivitätsverlauf aller Nutzer */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Aktivitätsverlauf
            </DialogTitle>
            <DialogDescription>
              Letzte Aktionen im CRM (Status, Notizen, Vertriebler-Zuweisung)
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto -mx-6 px-6">
            {historyLoading ? (
              <p className="text-sm text-muted-foreground py-4">Lade…</p>
            ) : historyEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">Noch keine Einträge.</p>
            ) : (
              <ul className="space-y-2 pb-4">
                {historyEntries.map((entry) => {
                  const sub = entry.contact_submissions;
                  const contactName = sub && typeof sub === 'object' && !Array.isArray(sub)
                    ? ((sub.company || '').trim() || [sub.first_name, sub.last_name].filter(Boolean).join(' ').trim() || `Kontakt #${entry.contact_id}`)
                    : `Kontakt #${entry.contact_id}`;
                  const who = entry.sales_rep === 'sven' ? 'Sven' : entry.sales_rep === 'pascal' ? 'Pascal' : entry.sales_rep;
                  let actionText = '';
                  if (entry.action === 'status_change') {
                    const newLabel = getStatusLabel(entry.new_value ?? '');
                    actionText = `Status auf „${newLabel}" geändert`;
                  } else if (entry.action === 'notes_edit') {
                    actionText = 'Notizen bearbeitet';
                  } else if (entry.action === 'assigned') {
                    const to = entry.new_value === 'sven' ? 'Sven' : entry.new_value === 'pascal' ? 'Pascal' : '—';
                    actionText = `Vertriebler: ${to}`;
                  } else {
                    actionText = entry.action;
                  }
                  const time = new Date(entry.created_at).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' });
                  return (
                    <li key={entry.id} className="text-sm border-b border-border/60 pb-2 last:border-0">
                      <span className="font-medium text-foreground">{who}</span>
                      {' · '}
                      <span className="text-muted-foreground">{actionText}</span>
                      {' bei '}
                      <span className="text-foreground">{contactName}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">{time}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Vertriebler zuweisen – Dialog (Tabelle) */}
      <Dialog open={!!assignDialogContact} onOpenChange={(open) => { if (!open) setAssignDialogContact(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Vertriebler zuweisen</DialogTitle>
            <DialogDescription>
              {assignDialogContact && (assignDialogContact.company || `${assignDialogContact.first_name} ${assignDialogContact.last_name}`.trim() || '—')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-1.5 py-2">
            <Button variant="outline" size="sm" className="justify-start" onClick={() => { if (assignDialogContact) { updateAssignedTo(assignDialogContact.id, null); setAssignDialogContact(null); } }}>
              —
            </Button>
            <Button variant="outline" size="sm" className="justify-start" onClick={() => { if (assignDialogContact) { updateAssignedTo(assignDialogContact.id, 'sven'); setAssignDialogContact(null); } }}>
              Sven
            </Button>
            <Button variant="outline" size="sm" className="justify-start" onClick={() => { if (assignDialogContact) { updateAssignedTo(assignDialogContact.id, 'pascal'); setAssignDialogContact(null); } }}>
              Pascal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notizen Modal – shadcn Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={(open) => { if (!open) { setSelectedContact(null); setNotes(''); } }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Notizen für {selectedContact ? `${selectedContact.first_name} ${selectedContact.last_name}`.trim() || selectedContact.company || '—' : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notes-textarea">Notizen</Label>
              <Textarea
                id="notes-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                placeholder="Notizen hier eingeben..."
                className="resize-none"
              />
            </div>
            {contactActivity.length > 0 && (
              <div className="grid gap-2">
                <Label className="text-xs font-medium text-muted-foreground">Aktivität (wer hat was geändert)</Label>
                <div className="rounded-lg border border-border/60 bg-muted/30 max-h-40 overflow-y-auto p-2 space-y-1.5 text-xs">
                  {contactActivity.map((entry) => (
                    <div key={entry.id} className="flex flex-wrap gap-1.5 items-baseline">
                      <span className="font-medium">{entry.sales_rep === 'sven' ? 'Sven' : 'Pascal'}</span>
                      <span className="text-muted-foreground">
                        {entry.action === 'status_change' && 'Status geändert'}
                        {entry.action === 'notes_edit' && 'Notizen bearbeitet'}
                        {entry.action === 'assigned' && 'Vertriebler zugewiesen'}
                      </span>
                      {entry.new_value != null && entry.action === 'status_change' && (
                        <span>→ {getStatusLabel(entry.new_value)}</span>
                      )}
                      {entry.new_value != null && entry.action === 'assigned' && (
                        <span>→ {entry.new_value === 'sven' ? 'Sven' : entry.new_value === 'pascal' ? 'Pascal' : '—'}</span>
                      )}
                      <span className="text-muted-foreground ml-auto">
                        {new Date(entry.created_at).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedContact(null); setNotes(''); }}>Abbrechen</Button>
            <Button className="bg-[#cb530a] hover:bg-[#a84308]" onClick={() => selectedContact && updateNotes(selectedContact.id)}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lead bearbeiten Modal – shadcn Dialog + Input/Label/Textarea */}
      <Dialog open={!!editingContact} onOpenChange={(open) => { if (!open) { setEditingContact(null); setEditForm({ first_name: '', last_name: '', email: '', phone: '', street: '', city: '', company: '', notes: '' }); } }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lead bearbeiten</DialogTitle>
            <DialogDescription>
              {editingContact && `Quelle: ${getSourceLabel(editingContact.source)} – Alle Felder können Sie manuell ergänzen oder anpassen.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-company">Firma</Label>
              <Input id="edit-company" value={editForm.company} onChange={(e) => setEditForm((f) => ({ ...f, company: e.target.value }))} placeholder="Firma" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-first_name">Vorname</Label>
              <Input id="edit-first_name" value={editForm.first_name} onChange={(e) => setEditForm((f) => ({ ...f, first_name: e.target.value }))} placeholder="Vorname" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-last_name">Nachname</Label>
              <Input id="edit-last_name" value={editForm.last_name} onChange={(e) => setEditForm((f) => ({ ...f, last_name: e.target.value }))} placeholder="Nachname" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefon</Label>
              <Input id="edit-phone" value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Telefon" />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="edit-email">E-Mail</Label>
              <Input id="edit-email" type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} placeholder="E-Mail" />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="edit-street">Straße</Label>
              <Input id="edit-street" value={editForm.street} onChange={(e) => setEditForm((f) => ({ ...f, street: e.target.value }))} placeholder="Straße, Hausnummer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-city">Ort / PLZ</Label>
              <Input id="edit-city" value={editForm.city} onChange={(e) => setEditForm((f) => ({ ...f, city: e.target.value }))} placeholder="PLZ Ort" />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="edit-notes">Notizen (z. B. Website: https://…)</Label>
              <Textarea id="edit-notes" value={editForm.notes} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Notizen, Website-URL, GS-Profil-Link usw." className="resize-none" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditingContact(null); setEditForm({ first_name: '', last_name: '', email: '', phone: '', street: '', city: '', company: '', notes: '' }); }}>Abbrechen</Button>
            <Button className="bg-[#cb530a] hover:bg-[#a84308]" onClick={() => editingContact && updateContact(editingContact.id, editForm)}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rechtsklick-Kontextmenü: Löschen | Bearbeiten | Notizen (einheitlich in Tabelle + Pipeline) */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} aria-hidden="true" />
          <div
            className="fixed z-50 flex gap-0.5 py-1 px-1 bg-white rounded-lg shadow-lg border border-gray-200"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="whitespace-nowrap border-neutral-300 text-neutral-700 hover:bg-neutral-100"
              onClick={() => {
                deleteContact(contextMenu.contact.id);
                setContextMenu(null);
              }}
            >
              Löschen
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              className="whitespace-nowrap bg-[#cb530a] hover:bg-[#a84308] text-white"
              onClick={() => {
                openEditModal(contextMenu.contact);
                setContextMenu(null);
              }}
            >
              Bearbeiten
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="whitespace-nowrap"
              onClick={() => {
                setSelectedContact(contextMenu.contact);
                setNotes(contextMenu.contact.notes || '');
                setContextMenu(null);
              }}
            >
              Notizen
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// Contact Card Component – Rechtsklick öffnet Kontextmenü (Löschen | Bearbeiten | Notizen)
function ContactCard({
  contact,
  leadStatuses,
  onStatusChange,
  onContextMenu,
  onNotesClick,
  getProfileUrl,
  getProfileLabel,
  getWebsiteFromNotes,
  renderQuizData,
  getStatusColor,
  getStatusLabel,
  getSourceLabel,
  getSourceBorderClass,
  fullWidth = false,
  onAssignedChange
}: {
  contact: ContactSubmission;
  leadStatuses: readonly { value: string; label: string }[];
  onStatusChange: (status: string) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onNotesClick: () => void;
  getProfileUrl: (c: ContactSubmission) => string | null;
  getProfileLabel: (c: ContactSubmission) => string | null;
  getWebsiteFromNotes: (notes: string | null | undefined) => string | null;
  renderQuizData: (quizData: any) => React.ReactNode;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  getSourceLabel: (source: string | null | undefined) => string;
  getSourceBorderClass: (source: string | null | undefined) => string;
  fullWidth?: boolean;
  onAssignedChange?: (assignedTo: string | null) => void;
}) {
  const profileUrl = getProfileUrl(contact);
  const profileLabel = getProfileLabel(contact);
  const displayName = contact.company || `${contact.first_name} ${contact.last_name}`.trim() || '—';
  const [copied, setCopied] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const copyName = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(displayName).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  };
  return (
    <Card
      className={`rounded-xl border border-border/80 bg-card shadow-sm hover:shadow-md transition-all duration-200 p-4 cursor-context-menu ${getSourceBorderClass(contact.source)}`}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e);
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <button
              type="button"
              onClick={copyName}
              className="text-base font-semibold text-foreground truncate text-left hover:text-[#cb530a] transition-colors underline-offset-2 hover:underline focus:outline-none focus:ring-0"
              title={copied ? 'Kopiert!' : 'Klicken zum Kopieren'}
            >
              {displayName}
            </button>
            {copied && <span className="text-xs text-[#cb530a] font-medium">Kopiert!</span>}
            <span className="shrink-0 px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground">
              {getSourceLabel(contact.source)}
            </span>
            <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(contact.status)}`}>
              {getStatusLabel(contact.status)}
            </span>
            {onAssignedChange && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 h-7 text-xs"
                  onClick={() => setAssignDialogOpen(true)}
                  title="Vertriebler"
                >
                  Vertriebler: {contact.assigned_to === 'sven' ? 'Sven' : contact.assigned_to === 'pascal' ? 'Pascal' : '—'}
                </Button>
                <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Vertriebler zuweisen</DialogTitle>
                      <DialogDescription>Kontakt: {displayName}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-1.5 py-2">
                      <Button variant="outline" size="sm" className="justify-start" onClick={() => { onAssignedChange(null); setAssignDialogOpen(false); }}>—</Button>
                      <Button variant="outline" size="sm" className="justify-start" onClick={() => { onAssignedChange('sven'); setAssignDialogOpen(false); }}>Sven</Button>
                      <Button variant="outline" size="sm" className="justify-start" onClick={() => { onAssignedChange('pascal'); setAssignDialogOpen(false); }}>Pascal</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            {(contact.email != null && contact.email !== '') ? (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#cb530a] shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-[#cb530a] transition-colors truncate">
                  {contact.email}
                </a>
              </div>
            ) : contact.company ? (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#cb530a] shrink-0" />
                <span className="truncate">{contact.company}</span>
              </div>
            ) : null}
            {contact.phone && (
              <div className="flex items-center gap-2 flex-wrap">
                <Phone className="w-4 h-4 text-[#cb530a] shrink-0" />
                <span className="text-muted-foreground">{contact.phone}</span>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 text-sm font-medium transition-colors border border-emerald-500/30"
                  title="Lead anrufen (Placetel/Telefon)"
                >
                  <Phone className="w-4 h-4" />
                  Anrufen
                </a>
              </div>
            )}
            {profileUrl && profileLabel && (
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-[#cb530a] shrink-0" />
                <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#cb530a] transition-colors truncate">
                  {profileLabel}
                </a>
              </div>
            )}
            {getWebsiteFromNotes(contact.notes) && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#cb530a] shrink-0" />
                <a href={getWebsiteFromNotes(contact.notes)!} target="_blank" rel="noopener noreferrer" className="hover:text-[#cb530a] transition-colors truncate max-w-[200px]">
                  Website
                </a>
              </div>
            )}
            {(contact.street || contact.city) && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#cb530a] shrink-0" />
                <span>{contact.street && `${contact.street}, `}{contact.city}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#cb530a] shrink-0" />
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
        <div className="mb-3 p-3 bg-muted/50 rounded-lg border border-border/40">
          <p className="text-xs font-medium text-muted-foreground mb-1">Dienstleistung</p>
          <p className="text-sm text-foreground">{contact.service}</p>
        </div>
      )}

      {contact.message && (
        <div className="mb-3 p-3 bg-muted/50 rounded-lg border border-border/40">
          <p className="text-xs font-medium text-muted-foreground mb-1">Nachricht</p>
          <p className="text-sm text-foreground line-clamp-2">{contact.message}</p>
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

      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/60 items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-md border-input"
          onClick={() => setStatusDialogOpen(true)}
        >
          Lead-Status: {getStatusLabel(contact.status)}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-md border-input"
          onClick={onNotesClick}
        >
          Notizen {contact.notes ? 'bearbeiten' : 'hinzufügen'}
        </Button>
        <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Lead-Status wählen</DialogTitle>
              <DialogDescription>Status für diesen Kontakt setzen.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-1.5 py-2">
              {leadStatuses.map((s) => (
                <Button
                  key={s.value}
                  variant={contact.status === s.value ? 'default' : 'ghost'}
                  size="sm"
                  className={`justify-start ${contact.status === s.value ? getStatusColor(s.value) : ''}`}
                  onClick={() => {
                    onStatusChange(s.value);
                    setStatusDialogOpen(false);
                  }}
                >
                  {s.label}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
