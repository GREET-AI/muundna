'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Mail, Phone, MapPin, Calendar, FileText, CheckCircle2, Clock, XCircle, 
  Search, Filter, Building2, Wrench, Users, Home, Video, 
  MessageSquare, TrendingUp, BarChart3, User,
  Contact, Euro, Target, Briefcase, FolderKanban, ChevronRight, ChevronLeft,
  Globe, ExternalLink, Loader2, ChevronDown, ChevronUp, Star, Upload, History,
  Flame, AtSign, UserCircle, LogOut, BookOpen, Trash2, GraduationCap, Download, KeyRound, Package, Plus,
  Eye, FileEdit
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { TextGenerateEffect } from '@/app/components/ui/TextGenerateEffect';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { LandingPageBuilder } from '@/app/components/LandingPageBuilder';
import { scrapeGelbeSeiten } from '@/app/actions/scrape-gelbeseiten';
import { scrape11880 } from '@/app/actions/scrape-11880';
import { buildGelbeSeitenSearchUrl, build11880SearchUrl } from '@/lib/scraper-sources';
import { normalizeGermanPhone } from '@/lib/normalize-phone';
import type { ScrapedLeadInsert } from '@/types/scraper-lead';
import type { Product, ContactProduct } from '@/types/product';
import type { CalendarEvent } from '@/types/calendar';

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
  selectedPaket?: string;
  addons?: string | string[];
  bundleSummary?: { paket?: string; totalMonthlyNetto?: number; label?: string };
}

/** Aktuelle Nutzer für Zuweisung/Kalender (username → Anzeige) */
type TeamMember = { id: string; username: string; display_name: string; department_label: string | null };

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [contactsTotal, setContactsTotal] = useState(0);
  const [contactsPage, setContactsPage] = useState(0);
  const CONTACTS_PAGE_SIZE = 80;
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('alle');
  /** Info-Spalte Filter: Mehrfachauswahl – nur Kontakte mit E-Mail / Website / Profil (AND) */
  const [infoFilter, setInfoFilter] = useState<string[]>([]);
  const [infoFilterOpen, setInfoFilterOpen] = useState(false);
  const infoFilterRef = useRef<HTMLDivElement>(null);
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
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('table');
  const [activeNav, setActiveNav] = useState('start');
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
  /** Aktueller User aus /me (für Berechtigungen, z. B. Team-Verwaltung) */
  const [currentUser, setCurrentUser] = useState<{ username?: string; display_name?: string | null; department_label?: string | null; role?: string; permissions?: string[]; features?: string[] } | null>(null);
  /** Team-Verwaltung: Liste + Formular */
  const [teamUsers, setTeamUsers] = useState<Array<{ id: string; username: string; display_name: string | null; department_key: string | null; department_label: string | null; is_active: boolean; last_login_at: string | null; created_at: string; role: string | null }>>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Array<{ key: string; label: string }>>([]);
  const [newUserForm, setNewUserForm] = useState({ username: '', password: '', display_name: '', role: 'mitarbeiter', department_key: '' });
  const [newUserSubmitting, setNewUserSubmitting] = useState(false);
  const [newUserMessage, setNewUserMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  /** Canva-Sidebar: welcher Flyout (Unterpunkte) sichtbar ist; null = zu beim Verlassen der Bar */
  const [sidebarFlyout, setSidebarFlyout] = useState<'tools' | 'kunden' | null>(null);
  const kundenBtnRef = useRef<HTMLButtonElement>(null);
  const toolsBtnRef = useRef<HTMLButtonElement>(null);
  const sidebarWrapRef = useRef<HTMLDivElement>(null);
  const flyoutPanelRef = useRef<HTMLDivElement>(null);
  const flyoutHoveredRef = useRef(false);
  const flyoutCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Flyout: immer Unterkante des Buttons, Menü öffnet immer nach oben */
  const [flyoutPosition, setFlyoutPosition] = useState<{ buttonBottom: number }>({ buttonBottom: 0 });
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
  /** Produkte (Pakete/Add-ons) aus DB – für Mögliche Sales & Angebot */
  const [products, setProducts] = useState<Product[]>([]);
  const [productsMigrationRequired, setProductsMigrationRequired] = useState(false);
  /** Mögliche Sales pro contact_id (Summe zugeordneter Produkte) */
  const [opportunitySums, setOpportunitySums] = useState<Record<string, number>>({});
  /** Produkt-Picker geöffnet für diesen Kontakt (Mögliche Sales) */
  const [productPickerContact, setProductPickerContact] = useState<ContactSubmission | null>(null);
  const [contactProductsForPicker, setContactProductsForPicker] = useState<ContactProduct[]>([]);
  const [productPickerLoading, setProductPickerLoading] = useState(false);
  /** Angebot: Produkt-Auswahl per Popup statt Dropdown */
  const [angebotProductPickerOpen, setAngebotProductPickerOpen] = useState(false);
  /** Status-Popup aus Tabelle (einheitlich: Klick → Popup, wie in Cards) */
  const [statusDialogContact, setStatusDialogContact] = useState<ContactSubmission | null>(null);
  /** Produkt-Tool: Dialog offen (Add/Edit) */
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  /** Produkt-Tool: Bearbeiten (null = Neu anlegen) */
  const [productEditProduct, setProductEditProduct] = useState<Product | null>(null);
  /** Produkt-Tool: Löschen bestätigen (id) */
  const [productDeleteId, setProductDeleteId] = useState<number | null>(null);
  /** Produkt-Tool: Formular-Daten (für Add/Edit Dialog) */
  const [productForm, setProductForm] = useState<{ name: string; description: string; price_display: string; price_period: string; price_min: string; price_once: string; product_type: Product['product_type']; subline: string; features: string[]; sort_order: number; for_package: string }>({
    name: '', description: '', price_display: '', price_period: '€/Monat', price_min: '', price_once: '', product_type: 'single', subline: '', features: [], sort_order: 0, for_package: '',
  });
  /** Digitale Produkte (Ablefy-Modul): Kurse, Downloads, Mitglieder */
  type DpProduct = { id: string; tenant_id: string; type: 'course' | 'download' | 'membership'; title: string; slug: string; description: string | null; price_cents: number; image_url: string | null; is_published: boolean; sort_order: number; created_at: string; updated_at: string; landing_page_sections?: import('@/types/landing-section').LandingSection[] | null; theme_primary_color?: string | null; theme_secondary_color?: string | null; landing_template?: 'standard' | 'parallax' | null };
  type DpProductFile = { id: string; product_id: string; title: string; file_type: 'file' | 'video_url' | 'lesson'; file_url: string | null; sort_order: number };
  const [dpProducts, setDpProducts] = useState<DpProduct[]>([]);
  const [dpMigrationRequired, setDpMigrationRequired] = useState(false);
  const [dpProductDialogOpen, setDpProductDialogOpen] = useState(false);
  const [dpEditProduct, setDpEditProduct] = useState<(DpProduct & { files?: DpProductFile[] }) | null>(null);
  const [dpLandingBuilderOpen, setDpLandingBuilderOpen] = useState(false);
  const [dpDeleteId, setDpDeleteId] = useState<string | null>(null);
  const [dpProductForm, setDpProductForm] = useState<{ type: 'course' | 'download' | 'membership'; title: string; slug: string; description: string; price_cents: number; image_url: string; is_published: boolean; sort_order: number }>({
    type: 'course', title: '', slug: '', description: '', price_cents: 0, image_url: '', is_published: false, sort_order: 0,
  });
  const [dpFileForm, setDpFileForm] = useState<{ title: string; file_type: 'file' | 'video_url' | 'lesson'; file_url: string }>({ title: '', file_type: 'file', file_url: '' });
  type DpPixel = { id: string; provider: string; pixel_id: string | null; name: string | null; created_at?: string };
  const [dpPixels, setDpPixels] = useState<DpPixel[]>([]);
  const [dpPixelForm, setDpPixelForm] = useState<{ provider: string; pixel_id: string; name: string; script_content: string }>({ provider: 'facebook', pixel_id: '', name: '', script_content: '' });
  const [dpProductSubmitting, setDpProductSubmitting] = useState(false);
  /** Digitale Produkte: Sub-Nav (nur in dieser Rubrik) – Produkte vs. Zugänge (freigeschaltete Kunden) */
  type DpEnrollment = { id: string; product_id: string; customer_email: string; access_until: string | null; created_at: string; product_title: string };
  const [dpSubNav, setDpSubNav] = useState<'produkte' | 'zugange'>('produkte');
  const [dpEnrollments, setDpEnrollments] = useState<DpEnrollment[]>([]);
  const [dpEnrollmentForm, setDpEnrollmentForm] = useState({ product_id: '', customer_email: '', access_until: '' });
  /** Kalender: Termine, angezeigter Monat, Filter Vertriebler */
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [calendarFilterSalesRep, setCalendarFilterSalesRep] = useState<string>('alle');
  const [calendarMigrationRequired, setCalendarMigrationRequired] = useState(false);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [calendarEditEvent, setCalendarEditEvent] = useState<CalendarEvent | null>(null);
  const [calendarFromContact, setCalendarFromContact] = useState<ContactSubmission | null>(null);
  const [calendarUpcomingEvents, setCalendarUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [calendarForm, setCalendarForm] = useState<{
    title: string; startDate: string; startTime: string; endDate: string; endTime: string; sales_rep: string; notes: string;
    contact_id: number | null; recommendedProductIds: number[]; website_state: string; google_state: string; social_media_state: string;
  }>({
    title: '', startDate: '', startTime: '09:00', endDate: '', endTime: '09:30', sales_rep: '', notes: '',
    contact_id: null, recommendedProductIds: [], website_state: '', google_state: '', social_media_state: '',
  });
  /** Top-Bar: Anstehende Termine (Dropdown für eingeloggten User) */
  const [upcomingTopbarOpen, setUpcomingTopbarOpen] = useState(false);
  const [upcomingTopbarEvents, setUpcomingTopbarEvents] = useState<CalendarEvent[]>([]);
  const [upcomingTopbarLoading, setUpcomingTopbarLoading] = useState(false);
  const upcomingTopbarRef = useRef<HTMLDivElement>(null);
  /** Spaltenbreiten für Lead-Tabelle; Quelle + E-Mail entfernt, Links → Info (Icons) */
  const TABLE_COLUMN_KEYS = ['vertriebler', 'firmaName', 'telefon', 'info', 'ort', 'sales', 'status'] as const;
  const RESIZABLE_TABLE_COLUMNS: readonly string[] = ['telefon', 'firmaName'];
  const FIXED_COLUMN_WIDTHS: Record<string, number> = {
    vertriebler: 72, info: 88, ort: 64, sales: 108, status: 88
  };

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
    ...FIXED_COLUMN_WIDTHS,
    firmaName: 220, telefon: 130
  });
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const resizeStartRef = useRef<{ x: number; w: number } | null>(null);
  /** Spaltenbreite (fix oder aus State für resizable) */
  const getTableColWidth = (key: string) => RESIZABLE_TABLE_COLUMNS.includes(key) ? (tableColumnWidths[key] ?? 120) : (FIXED_COLUMN_WIDTHS[key] ?? 80);

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

  /** Beim Laden: Session prüfen (Cookie), User-Info + Team-Liste für Dropdowns */
  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.user) {
          setCurrentUser(data.user);
          setIsAuthenticated(true);
          loadContacts();
        }
      })
      .catch(() => {});
  }, []);

  /** Team-Mitglieder für Zuweisung/Kalender-Dropdown (alle eingeloggten User) */
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/api/admin/team-members', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => { setTeamMembers(data.data ?? []); })
      .catch(() => setTeamMembers([]));
  }, [isAuthenticated]);

  /** Abteilungen für Team-Formular (wenn eingeloggt) */
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/api/admin/departments', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => { setDepartments(data.data ?? []); })
      .catch(() => setDepartments([]));
  }, [isAuthenticated]);

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
    setContactsPage(0);
    if (activeNav === 'leads') loadContacts(true, 0);
    else if (['contacts', 'meine-kontakte', 'deals', 'kunden', 'kundenprojekte', 'bewertungs-funnel', 'angebots-erstellung', 'smart-leads-anrufen', 'smart-neue-leads', 'smart-heute-anrufen', 'smart-follow-up', 'smart-kein-kontakt-3'].includes(activeNav)) loadContacts(undefined, 0);
  }, [activeNav, isAuthenticated]);

  useEffect(() => {
    setContactsPage(0);
  }, [searchTerm, statusFilter, infoFilter]);

  useEffect(() => {
    if (!infoFilterOpen) return;
    const close = (e: MouseEvent) => {
      if (infoFilterRef.current && !infoFilterRef.current.contains(e.target as Node)) setInfoFilterOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [infoFilterOpen]);

  /** Flyout schließen, wenn Maus die Sidebar- oder Flyout-Zone verlässt (z. B. zu den Content-Cards) */
  useEffect(() => {
    if (!sidebarFlyout) return;
    const onMouseMove = (e: MouseEvent) => {
      const sidebarEl = sidebarWrapRef.current;
      const flyoutEl = flyoutPanelRef.current;
      if (!sidebarEl || !flyoutEl) return;
      const sr = sidebarEl.getBoundingClientRect();
      const fr = flyoutEl.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      const inSidebar = x >= sr.left && x <= sr.right && y >= sr.top && y <= sr.bottom;
      const inFlyout = x >= fr.left && x <= fr.right && y >= fr.top && y <= fr.bottom;
      if (!inSidebar && !inFlyout) setSidebarFlyout(null);
    };
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [sidebarFlyout]);

  /** Team-Liste laden wenn Team-Bereich sichtbar und Berechtigung */
  const canManageUsers = currentUser?.permissions?.includes('admin') || currentUser?.permissions?.includes('users.manage');
  const canAccessDigitalProducts = Boolean(
    currentUser?.features?.includes('digital_products') &&
    (currentUser?.role === 'superadmin' || currentUser?.permissions?.includes('digital_products.*'))
  );
  useEffect(() => {
    if (!isAuthenticated || activeNav !== 'team' || !canManageUsers) return;
    setTeamLoading(true);
    setTeamError(null);
    fetch('/api/admin/users', { credentials: 'include' })
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 403 ? 'Keine Berechtigung' : 'Fehler beim Laden');
        return r.json();
      })
      .then((data) => { setTeamUsers(data.data ?? []); })
      .catch((e) => { setTeamError(e.message); setTeamUsers([]); })
      .finally(() => setTeamLoading(false));
  }, [isAuthenticated, activeNav, canManageUsers]);

  /** Produkte aus DB laden (für Mögliche Sales & Angebot) */
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/api/admin/products', { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (res.migration_required) setProductsMigrationRequired(true);
        else setProducts(res.data ?? []);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  /** Digitale Produkte laden (wenn Bereich sichtbar) */
  useEffect(() => {
    if (!isAuthenticated || activeNav !== 'digital-products' || !canAccessDigitalProducts) return;
    fetch('/api/admin/digital-products', { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (res.migration_required) setDpMigrationRequired(true);
        else setDpProducts(res.data ?? []);
      })
      .catch(() => setDpProducts([]));
  }, [isAuthenticated, activeNav, canAccessDigitalProducts]);

  /** Zugänge (Enrollments) laden – nur wenn Sub-Nav „Zugänge“ und Bereich Digitale Produkte */
  useEffect(() => {
    if (!isAuthenticated || activeNav !== 'digital-products' || dpSubNav !== 'zugange' || !canAccessDigitalProducts) return;
    fetch('/api/admin/digital-products/enrollments', { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => setDpEnrollments(res.data ?? []))
      .catch(() => setDpEnrollments([]));
  }, [isAuthenticated, activeNav, dpSubNav, canAccessDigitalProducts]);


  /** Opportunity-Summen für sichtbare Kontakte (muss vor jedem early return stehen, gleiche Hook-Reihenfolge) */
  useEffect(() => {
    if (!isAuthenticated) return;
    const search = (searchTerm ?? '').toLowerCase().trim();
    const filtered = contacts.filter((c) => {
      const matchSearch = !search || [c.first_name, c.last_name, c.email, c.phone, c.company].some((v) => String(v ?? '').toLowerCase().includes(search));
      const matchStatus = statusFilter === 'alle' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
    const viewContacts = (() => {
      if (activeNav === 'meine-kontakte' && currentUser?.username) return filtered.filter((c) => c.assigned_to === currentUser.username);
      if (activeNav === 'deals') return filtered.filter((c) => ['offen', 'kontaktversuch', 'verbunden', 'qualifiziert', 'kontaktiert', 'in_bearbeitung'].includes(c.status));
      if (activeNav === 'kunden') return filtered.filter((c) => c.status === 'kunde' || c.status === 'abgeschlossen');
      if (activeNav === 'kundenprojekte') return filtered.filter((c) => c.status === 'abgeschlossen' || c.status === 'kunde');
      if (activeNav === 'smart-heute-anrufen' && currentUser?.username) return filtered.filter((c) => c.assigned_to === currentUser.username && (c.phone || '').trim() && ['neu', 'offen', 'kontaktversuch'].includes(c.status));
      if (activeNav === 'smart-leads-anrufen') return filtered.filter((c) => (c.phone || '').trim() && ['neu', 'offen', 'kontaktversuch', 'verbunden', 'qualifiziert', 'kontaktiert', 'in_bearbeitung'].includes(c.status));
      if (activeNav === 'smart-kein-kontakt-3') { const d = new Date(); d.setDate(d.getDate() - 3); return filtered.filter((c) => new Date(c.updated_at) < d); }
      if (activeNav === 'smart-neue-leads') {
        const leadSources = ['gelbe_seiten', '11880', 'google_places'];
        return filtered.filter((c) => c.status === 'neu' && c.source && leadSources.includes(c.source));
      }
      if (activeNav === 'smart-follow-up') return filtered.filter((c) => c.status === 'wiedervorlage' || c.status === 'qualifiziert');
      return filtered;
    })();
    if (!viewContacts.length) { setOpportunitySums({}); return; }
    const ids = viewContacts.map((c) => c.id).join(',');
    fetch(`/api/admin/contact-products/sums?contact_ids=${ids}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => setOpportunitySums(res.sums ?? {}))
      .catch(() => setOpportunitySums({}));
  }, [isAuthenticated, activeNav, statusFilter, searchTerm, contacts.length, currentUser?.username, contacts]);

  /** Bei geöffnetem Produkt-Picker: Zuordnung für Kontakt laden */
  useEffect(() => {
    if (!productPickerContact?.id) {
      setContactProductsForPicker([]);
      return;
    }
    setProductPickerLoading(true);
    fetch(`/api/admin/contacts/${productPickerContact.id}/products`, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        setContactProductsForPicker(res.data ?? []);
        if (res.migration_required) setProductsMigrationRequired(true);
      })
      .finally(() => setProductPickerLoading(false));
  }, [productPickerContact?.id]);

  /** Kalender: Termine für angezeigten Monat laden */
  useEffect(() => {
    if (!isAuthenticated || activeNav !== 'kalender') return;
    const y = calendarMonth.getFullYear();
    const m = calendarMonth.getMonth();
    const from = new Date(y, m, 1).toISOString();
    const to = new Date(y, m + 1, 0, 23, 59, 59).toISOString();
    const params = new URLSearchParams({ from, to });
    if (calendarFilterSalesRep !== 'alle') params.set('sales_rep', calendarFilterSalesRep);
    fetch(`/api/admin/calendar/events?${params}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (res.migration_required) setCalendarMigrationRequired(true);
        else setCalendarEvents(res.data ?? []);
      })
      .catch(() => setCalendarEvents([]));
  }, [isAuthenticated, activeNav, calendarMonth.getTime(), calendarFilterSalesRep]);

  /** Kalender: Kommende Termine (für Sidebar-Liste, unabhängig vom Monat) */
  useEffect(() => {
    if (!isAuthenticated || activeNav !== 'kalender') return;
    const now = new Date();
    const to = new Date(now);
    to.setDate(to.getDate() + 90);
    const params = new URLSearchParams({ from: now.toISOString(), to: to.toISOString() });
    if (calendarFilterSalesRep !== 'alle') params.set('sales_rep', calendarFilterSalesRep);
    fetch(`/api/admin/calendar/events?${params}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (!res.migration_required) setCalendarUpcomingEvents((res.data ?? []).sort((a: CalendarEvent, b: CalendarEvent) => a.start_at.localeCompare(b.start_at)));
      })
      .catch(() => setCalendarUpcomingEvents([]));
  }, [isAuthenticated, activeNav, calendarFilterSalesRep, calendarDialogOpen]);

  /** Klick außerhalb: Anstehende-Termine-Dropdown schließen */
  useEffect(() => {
    if (!upcomingTopbarOpen) return;
    const handle = (e: MouseEvent) => {
      if (upcomingTopbarRef.current && !upcomingTopbarRef.current.contains(e.target as Node)) setUpcomingTopbarOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [upcomingTopbarOpen]);

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

  /** Beim Wechsel der Seite nach oben scrollen */
  useEffect(() => {
    if (!isAuthenticated) return;
    window.scrollTo(0, 0);
  }, [activeNav, isAuthenticated]);

  /** Spalten-Resize: Mausbewegung/Release global abfangen */
  useEffect(() => {
    if (!resizingColumn || !resizeStartRef.current) return;
    const handleMove = (e: MouseEvent) => {
      if (!RESIZABLE_TABLE_COLUMNS.includes(resizingColumn)) return;
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
        body: JSON.stringify({ username: username.trim() || undefined, password: pwd }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (data.bootstrap) {
          alert('Admin-User wurde angelegt. Bitte ab jetzt mit Username "admin" und Ihrem Passwort anmelden.');
          setUsername('admin');
        }
        const meRes = await fetch('/api/admin/me', { credentials: 'include' });
        const meData = await meRes.json().catch(() => ({}));
        if (meData?.user) setCurrentUser(meData.user);
        setIsAuthenticated(true);
        loadContacts();
      } else {
        alert(data?.error || 'Anmeldung fehlgeschlagen.');
      }
    } catch {
      alert('Anmeldung fehlgeschlagen.');
    }
  };

  const handleLogout = () => {
    fetch('/api/admin/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    setIsAuthenticated(false);
    setCurrentUser(null);
    setContacts([]);
  };

  /** Views mit Server-Pagination (limit/offset) – Tabelle/Pipeline immer nur eine Seite */
  const PAGINATED_VIEWS = ['contacts', 'meine-kontakte', 'deals', 'kunden', 'kundenprojekte', 'leads', 'smart-neue-leads', 'smart-leads-anrufen', 'smart-heute-anrufen', 'smart-follow-up', 'smart-kein-kontakt-3'];
  const isPaginatedView = PAGINATED_VIEWS.includes(activeNav);

  const loadContacts = async (leadsOnly?: boolean, pageOverride?: number) => {
    setLoading(true);
    setLoadError(null);
    try {
      const params = new URLSearchParams();
      const page = pageOverride ?? contactsPage;
      if (activeNav === 'leads') params.set('leads_only', '1');
      if (isPaginatedView) {
        params.set('limit', String(CONTACTS_PAGE_SIZE));
        params.set('offset', String(page * CONTACTS_PAGE_SIZE));
      }
      if (['smart-neue-leads', 'smart-leads-anrufen', 'smart-heute-anrufen', 'smart-follow-up', 'smart-kein-kontakt-3'].includes(activeNav)) {
        params.set('view', activeNav);
      }
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      if (activeNav === 'meine-kontakte' && currentUser?.username) params.set('assigned_to', currentUser.username);
      if (activeNav === 'smart-heute-anrufen' && currentUser?.username) params.set('assigned_to', currentUser.username);
      const statusParam = activeNav === 'deals'
        ? (statusFilter !== 'alle' ? statusFilter : 'offen,kontaktversuch,verbunden,qualifiziert,kontaktiert,in_bearbeitung')
        : (activeNav === 'kunden' || activeNav === 'kundenprojekte')
          ? (statusFilter !== 'alle' ? statusFilter : 'kunde,abgeschlossen')
          : statusFilter;
      if (statusParam && statusParam !== 'alle') params.set('status', statusParam);
      if (infoFilter.includes('email')) params.set('has_email', '1');
      if (infoFilter.includes('website')) params.set('has_website', '1');
      if (infoFilter.includes('profile')) params.set('has_profile', '1');
      if (!isPaginatedView && !['kalender', 'produkt-tool', 'bewertungs-funnel', 'angebots-erstellung', 'scraper-gelbeseiten', 'scraper-11880'].includes(activeNav)) {
        params.set('limit', '3000');
      }
      const url = `/api/admin/contacts?${params.toString()}`;
      const response = await fetch(url, { credentials: 'include' });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        setContacts([]);
        setContactsTotal(0);
        setLoadError('Fehler beim Laden der Kontakte.');
        return;
      }

      const result = await response.json();
      setContacts(result.data || []);
      setContactsTotal(result.total ?? result.data?.length ?? 0);
      setMigrationRequired(result.migration_required === true);
    } catch (error) {
      console.error('Fehler:', error);
      setContacts([]);
      setContactsTotal(0);
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
        body: JSON.stringify({ id, status: newStatus, changed_by: currentUser?.username ?? null })
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
        body: JSON.stringify({ id, notes: notesToSave, changed_by: currentUser?.username ?? null })
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
        body: JSON.stringify({ id, assigned_to: assignedTo || null, changed_by: currentUser?.username ?? null })
      });
      if (!response.ok) throw new Error('Fehler beim Zuweisen');
      loadContacts();
    } catch (error) {
      console.error('Fehler:', error);
      alert('Zuweisung konnte nicht gespeichert werden.');
    }
  };

  const updateContact = async (id: number, payload: { first_name?: string; last_name?: string; email?: string; phone?: string; street?: string; city?: string; company?: string; notes?: string; status?: string }) => {
    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, ...payload, changed_by: currentUser?.username ?? null })
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
    if (!source) return '—';
    switch (source) {
      case 'gelbe_seiten': return 'Gelbe Seiten';
      case '11880': return '11880';
      case 'google_places': return 'Google';
      case 'website_form': case 'quiz': return 'Website';
      case 'product_quiz': return 'Produkt-Quiz';
      default: return source;
    }
  };

  const getSourceBorderClass = (source: string | null | undefined) => {
    if (!source) return 'border-l-4 border-l-neutral-300';
    if (source === 'gelbe_seiten') return 'border-l-4 border-l-amber-400'; // Quelle: nur linker Rand, Hintergrund weiß
    if (source === '11880') return 'border-l-4 border-l-green-500';
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
    if (contact.source === 'gelbe_seiten') return 'Gelbe Seiten Profil';
    if (contact.source === '11880') return '11880 Profil';
    if (!getProfileUrl(contact)) return null;
    const meta = contact.source_meta as { profile_url?: string } | undefined;
    if (meta?.profile_url) return '11880 Profil';
    if ((contact.notes || '').includes('11880-Profil')) return '11880 Profil';
    return 'Gelbe Seiten Profil';
  };

  /** Website aus Notizen parsen (beim Import: "Website: https://...") */
  const getWebsiteFromNotes = (notes: string | null | undefined): string | null => {
    if (!notes) return null;
    const m = notes.match(/Website:\s*(https?:\/\/[^\s\n]+)/i);
    return m ? m[1].trim() : null;
  };

  /** Automatische Potenzial-Erkennung für Vertrieb: Website, Social Media, GmbH */
  const hasWebsite = (c: ContactSubmission) => !!getWebsiteFromNotes(c.notes);
  const hasSocialMedia = (c: ContactSubmission) => {
    const n = (c.notes || '').toLowerCase();
    return /facebook|instagram|linkedin|x\.com|tiktok|social\s*media|socialmedia|twitter/.test(n);
  };
  const isGmbh = (c: ContactSubmission) => /gmbh/i.test(c.company || '');
  type PotentialBadge = { key: string; label: string; title: string; className: string };
  const getPotentialBadges = (c: ContactSubmission): PotentialBadge[] => {
    const badges: PotentialBadge[] = [];
    if (!hasWebsite(c)) badges.push({ key: 'website', label: 'Website-Potenzial', title: 'Keine Website erfasst – Potenzial für Website-Verkauf', className: 'bg-amber-100 text-amber-800 border border-amber-200' });
    if (!hasSocialMedia(c)) badges.push({ key: 'social', label: 'Social-Potenzial', title: 'Kein Social Media erfasst – Potenzial für Social-Media-Ausbau', className: 'bg-sky-100 text-sky-800 border border-sky-200' });
    if (isGmbh(c)) badges.push({ key: 'gmbh', label: 'GmbH', title: 'Firma mit GmbH im Namen – tendenziell höheres Umsatzpotenzial', className: 'bg-emerald-100 text-emerald-800 border border-emerald-200' });
    return badges;
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
    if (key === 'bundle') {
      return <Briefcase className="w-4 h-4 text-[#cb530a]" />;
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

    // Paket & Add-ons zuerst (aus Quiz mit ?paket=1 oder ?paket=2)
    const bundle = quiz.bundleSummary;
    if (bundle && typeof bundle === 'object' && bundle.label) {
      sections.push({
        title: 'Gewähltes Paket',
        items: [bundle.label],
        key: 'bundle' as const
      });
    } else if (quiz.selectedPaket) {
      const paketLabels: Record<string, string> = { '1': 'Paket 1: Basis', '2': 'Paket 2: Professional', 'enterprise': 'Enterprise' };
      const addons = quiz.addons;
      const addonStr = Array.isArray(addons) ? addons.join(', ') : (addons ? String(addons) : '');
      const label = addonStr ? `${paketLabels[quiz.selectedPaket] || quiz.selectedPaket} + ${addonStr}` : (paketLabels[quiz.selectedPaket] || quiz.selectedPaket);
      sections.push({
        title: 'Paket / Add-ons',
        items: [label],
        key: 'bundle' as const
      });
    }

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
  let kpiNeu = contactsByStatus.neu?.length ?? 0;
  let kpiAktiv = (contactsByStatus.offen?.length ?? 0) + (contactsByStatus.kontaktversuch?.length ?? 0) + (contactsByStatus.verbunden?.length ?? 0) + (contactsByStatus.qualifiziert?.length ?? 0) + filteredContacts.filter(c => ['kontaktiert', 'in_bearbeitung'].includes(c.status)).length;
  let kpiNichtQual = (contactsByStatus.nicht_qualifiziert?.length ?? 0) + (contactsByStatus.wiedervorlage?.length ?? 0);
  let kpiKunde = (contactsByStatus.kunde?.length ?? 0) + filteredContacts.filter(c => c.status === 'abgeschlossen').length;
  if (isPaginatedView && ['smart-neue-leads', 'smart-leads-anrufen', 'smart-heute-anrufen', 'smart-follow-up', 'smart-kein-kontakt-3'].includes(activeNav)) {
    kpiNeu = activeNav === 'smart-neue-leads' ? contactsTotal : 0;
    kpiAktiv = ['smart-leads-anrufen', 'smart-heute-anrufen', 'smart-kein-kontakt-3'].includes(activeNav) ? contactsTotal : 0;
    kpiNichtQual = activeNav === 'smart-follow-up' ? contactsTotal : 0;
    kpiKunde = 0;
  }

  if (!isAuthenticated) {
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
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-sm text-gray-600 mt-2">Muckenfuss & Nagel CRM</p>
          </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-username">Benutzername</Label>
                <Input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="z.B. admin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Passwort</Label>
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                Erster Login? Lassen Sie den Benutzernamen leer und geben Sie nur Ihr bisheriges Passwort ein.
              </p>
              <Button type="submit" className="w-full bg-[#cb530a] hover:bg-[#a84308]">
                Anmelden
              </Button>
            </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'contacts', label: 'Alle Kontakte', icon: Contact },
    { id: 'meine-kontakte', label: 'Meine Kontakte', icon: User },
    { id: 'deals', label: 'Abschlüsse', icon: Euro },
  ];
  const kundenSubItems: { id: string; label: string }[] = [
    { id: 'kunden', label: 'Kunden' },
    { id: 'kundenprojekte', label: 'Kundenprojekte' },
  ];
  const isKundenActive = activeNav === 'kunden' || activeNav === 'kundenprojekte';

  /** Akquise: vordefinierte Listen inkl. Leads-Übersicht */
  const smartViewItems: { id: string; label: string; icon: typeof Phone }[] = [
    { id: 'leads', label: 'Leads', icon: Target },
    { id: 'smart-heute-anrufen', label: 'Heute anrufen', icon: Phone },
    { id: 'smart-leads-anrufen', label: 'Hot Leads', icon: Flame },
    { id: 'smart-kein-kontakt-3', label: '3 Tage+', icon: Clock },
    { id: 'smart-neue-leads', label: 'Neue Leads', icon: Target },
    { id: 'smart-follow-up', label: 'Follow-up nötig', icon: Clock },
  ];
  const isSmartView = smartViewItems.some((s) => s.id === activeNav);

  /** Leadmagnet (getYELLOW/getGREEN) ist unter Tools, nicht mehr eigenes Menü */
  const toolsSubItems: { id: string; label: string }[] = [
    { id: 'produkt-tool', label: 'Produkt-Tool' },
    ...(canAccessDigitalProducts ? [{ id: 'digital-products', label: 'Digitale Produkte' }] : []),
    { id: 'bewertungs-funnel', label: 'Bewertungs-Funnel' },
    { id: 'angebots-erstellung', label: 'Angebotserstellung' },
    { id: 'scraper-gelbeseiten', label: 'getYELLOW' },
    { id: 'scraper-11880', label: 'getGREEN' },
  ];
  const isToolsActive = activeNav === 'bewertungs-funnel' || activeNav === 'angebots-erstellung' || activeNav === 'produkt-tool' || activeNav === 'digital-products' || activeNav === 'scraper-gelbeseiten' || activeNav === 'scraper-11880';
  const isScraperActive = activeNav === 'scraper-gelbeseiten' || activeNav === 'scraper-11880';

  /** Startseite: Karten → Rubriken (Zwischenseiten) oder direkt Kalender/Team */
  const startPageCards: { id: string; label: string; description: string; image: string; Icon: typeof Contact }[] = [
    { id: 'rubrik-contacts', label: 'Kontakte', description: 'Alle Kontakte, Leads und Ansprechpartner verwalten – durchsuchen, filtern und zuweisen.', image: '/images/Dienstleistungen/Telefonieren.jpeg', Icon: Contact },
    { id: 'rubrik-kunden', label: 'Kunden', description: 'Bestehende Kunden und Partner – Status, Projekte und Übersicht.', image: '/images/Dienstleistungen/GoogleBewertungen.jpeg', Icon: Building2 },
    { id: 'rubrik-leads', label: 'Akquise & Leads', description: 'Leads, Heute anrufen, Hot Leads, Follow-up – alle Akquise-Listen im Überblick.', image: '/images/Dienstleistungen/SocialMedia.jpeg', Icon: Target },
    { id: 'kalender', label: 'Kalender', description: 'Termine anlegen, Kalender einsehen und anstehende Termine verwalten.', image: '/images/Dienstleistungen/Termenirung.jpeg', Icon: Calendar },
    { id: 'rubrik-tools', label: 'Tools', description: 'Produkt-Tool, Digitale Produkte, Bewertungs-Funnel, Angebotserstellung, getYELLOW und getGREEN.', image: '/images/Dienstleistungen/Raport.jpeg', Icon: Wrench },
    { id: 'team', label: 'Team', description: 'Benutzer und Berechtigungen verwalten – Teammitglieder anlegen und zuweisen.', image: '/images/Team/office1.jpeg', Icon: Users },
  ];

  /** Zwischenseiten: Rubrik-Titel und Unterpunkte (Karten) */
  const rubrikConfig: Record<string, { title: string; subCards: { id: string; label: string }[] }> = {
    'rubrik-contacts': { title: 'Kontakte', subCards: navItems.map((i) => ({ id: i.id, label: i.label })) },
    'rubrik-kunden': { title: 'Kunden', subCards: kundenSubItems },
    'rubrik-leads': { title: 'Akquise & Leads', subCards: smartViewItems.map((i) => ({ id: i.id, label: i.label })) },
    'rubrik-tools': { title: 'Tools', subCards: toolsSubItems },
  };
  const isRubrik = (nav: string): nav is keyof typeof rubrikConfig => nav in rubrikConfig;

  /** Einstiegsseiten von der Startseite (Cards): gleiches Layout wie Start – Hero, Headline, animierter Text, dann Inhalt */
  const sectionEntryConfig: Record<string, { headline: string; introWords: string }> = {
    'rubrik-contacts': {
      headline: 'Jetzt bist du im Kontaktbereich.',
      introWords: 'Hier verwaltest du alle Kontakte, Leads und Ansprechpartner. Wähle unten einen Unterpunkt: Alle Kontakte durchsuchen, nur deine zugewiesenen anzeigen oder Abschlüsse im Blick behalten.',
    },
    'rubrik-kunden': {
      headline: 'Jetzt bist du im Kundenbereich.',
      introWords: 'Bestehende Kunden und Partner – Status, Projekte und Übersicht. Wähle unten, ob du alle Kunden siehst oder direkt zu Kundenprojekten wechselst.',
    },
    'rubrik-leads': {
      headline: 'Jetzt bist du im Akquise- & Lead-Bereich.',
      introWords: 'Leads bearbeiten, Heute anrufen, Hot Leads, 3 Tage+, Neue Leads oder Follow-up – alle Akquise-Listen im Überblick. Wähle unten eine Liste.',
    },
    'kalender': {
      headline: 'Jetzt bist du im Kalender.',
      introWords: 'Termine anlegen, Kalender einsehen und anstehende Termine verwalten. Nach Person filtern und direkt neue Termine hinzufügen.',
    },
    'rubrik-tools': {
      headline: 'Jetzt bist du im Tool-Bereich.',
      introWords: 'Produkt-Tool, Digitale Produkte, Bewertungs-Funnel, Angebotserstellung, getYELLOW und getGREEN – wähle unten das gewünschte Tool.',
    },
    'team': {
      headline: 'Jetzt bist du in den Team-Einstellungen.',
      introWords: 'Benutzer und Berechtigungen verwalten – Teammitglieder anlegen, Abteilungen zuweisen. Neue Benutzer können sich mit Benutzername und Passwort anmelden.',
    },
  };
  const isSectionEntry = (nav: string): nav is keyof typeof sectionEntryConfig => nav in sectionEntryConfig;

  // Logik für verschiedene Views; bei Pagination liefert die API bereits die gefilterte Seite → contacts direkt nutzen
  const getViewData = () => {
    const myContacts = currentUser?.username ? filteredContacts.filter(c => c.assigned_to === currentUser.username) : [];
    if (isPaginatedView) {
      const titles: Record<string, { title: string; description: string; showStats: boolean }> = {
        'contacts': { title: 'Alle Kontakte', description: 'Alle Kontakte und Ansprechpartner. Professionell – Ads automatisch befüllt.', showStats: true },
        'meine-kontakte': { title: 'Meine Kontakte', description: currentUser?.username ? 'Nur Ihnen zugewiesene Leads' : 'Zugewiesene Kontakte', showStats: true },
        'deals': { title: 'Abschlüsse', description: 'Aktive Verhandlungen und Angebote', showStats: true },
        'kunden': { title: 'Kunden', description: 'Bestehende Kunden und Partner', showStats: true },
        'kundenprojekte': { title: 'Kundenprojekte', description: 'Projekte für bestehende Kunden', showStats: false },
        'leads': { title: 'Alle Leads', description: '', showStats: false },
        'smart-heute-anrufen': { title: 'Heute anrufen', description: 'Ihnen zugewiesene Leads mit Telefonnummer (Neu, Offen, Kontaktversuch). Die Zuordnung erfolgt automatisch durch das System.', showStats: true },
        'smart-leads-anrufen': { title: 'Hot Leads', description: 'Alle mit Telefonnummer in aktiven Phasen. Die Zuordnung erfolgt automatisch durch das System.', showStats: true },
        'smart-kein-kontakt-3': { title: '3 Tage+', description: 'Keine Aktivität seit mehr als 3 Tagen – Vertrieb sollte zeitnah nachfassen. Die Zuordnung erfolgt automatisch durch das System.', showStats: true },
        'smart-neue-leads': { title: 'Neue Leads', description: 'Leads aus Gelben Seiten, 11880, Google – Status „Neu“, noch nicht bearbeitet', showStats: true },
        'smart-follow-up': { title: 'Follow-up nötig', description: 'Wiedervorlage oder Qualifiziert – nächster Schritt', showStats: true },
      };
      const config = titles[activeNav] ?? { title: 'Kontakte', description: 'Alle Kontakte. Professionell – Ads automatisch befüllt.', showStats: true };
      return { ...config, contacts };
    }
    switch (activeNav) {
      case 'contacts':
        return {
          title: 'Alle Kontakte',
          description: 'Alle Kontakte und Ansprechpartner. Professionell – Ads automatisch befüllt.',
          contacts: filteredContacts,
          showStats: true
        };
      case 'meine-kontakte':
        return {
          title: 'Meine Kontakte',
          description: currentUser?.username ? 'Nur Ihnen zugewiesene Leads' : 'Zugewiesene Kontakte',
          contacts: myContacts,
          showStats: true
        };
      case 'deals':
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
        return {
          title: 'Kundenprojekte',
          description: 'Projekte für bestehende Kunden',
          contacts: filteredContacts.filter(c => c.status === 'abgeschlossen' || c.status === 'kunde'),
          showStats: false
        };
      case 'leads':
        return {
          title: 'Alle Leads',
          description: '',
          contacts: filteredContacts,
          showStats: false
        };
      case 'smart-heute-anrufen': {
        if (isPaginatedView) {
          return { title: 'Heute anrufen', description: 'Ihnen zugewiesene Leads mit Telefonnummer (Neu, Offen, Kontaktversuch). Die Zuordnung erfolgt automatisch durch das System.', contacts, showStats: true };
        }
        const withPhone = (c: ContactSubmission) => (c.phone || '').trim().length > 0;
        const early = (c: ContactSubmission) => ['neu', 'offen', 'kontaktversuch'].includes(c.status);
        const mine = currentUser?.username ? filteredContacts.filter(c => c.assigned_to === currentUser.username) : filteredContacts;
        return {
          title: 'Heute anrufen',
          description: 'Ihnen zugewiesene Leads mit Telefonnummer (Neu, Offen, Kontaktversuch). Die Zuordnung erfolgt automatisch durch das System.',
          contacts: mine.filter(c => withPhone(c) && early(c)),
          showStats: true
        };
      }
      case 'smart-leads-anrufen': {
        if (isPaginatedView) {
          return { title: 'Hot Leads', description: 'Alle mit Telefonnummer in aktiven Phasen. Die Zuordnung erfolgt automatisch durch das System.', contacts, showStats: true };
        }
        const withPhone = (c: ContactSubmission) => (c.phone || '').trim().length > 0;
        const active = (c: ContactSubmission) => ['neu', 'offen', 'kontaktversuch', 'verbunden', 'qualifiziert', 'kontaktiert', 'in_bearbeitung'].includes(c.status);
        return {
          title: 'Hot Leads',
          description: 'Alle mit Telefonnummer in aktiven Phasen. Die Zuordnung erfolgt automatisch durch das System.',
          contacts: filteredContacts.filter(c => withPhone(c) && active(c)),
          showStats: true
        };
      }
      case 'smart-kein-kontakt-3': {
        if (isPaginatedView) {
          return { title: '3 Tage+', description: 'Keine Aktivität seit mehr als 3 Tagen – Vertrieb sollte zeitnah nachfassen. Die Zuordnung erfolgt automatisch durch das System.', contacts, showStats: true };
        }
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const noContact = (c: ContactSubmission) => new Date(c.updated_at) < threeDaysAgo;
        return {
          title: '3 Tage+',
          description: 'Keine Aktivität seit mehr als 3 Tagen – Vertrieb sollte zeitnah nachfassen. Die Zuordnung erfolgt automatisch durch das System.',
          contacts: filteredContacts.filter(noContact),
          showStats: true
        };
      }
      case 'smart-neue-leads': {
        if (isPaginatedView) {
          return { title: 'Neue Leads', description: 'Leads aus Gelben Seiten, 11880, Google – Status „Neu“, noch nicht bearbeitet', contacts, showStats: true };
        }
        const leadSources = ['gelbe_seiten', '11880', 'google_places'];
        const isFromLeadSource = (c: ContactSubmission) => (c.source && leadSources.includes(c.source)) || false;
        return {
          title: 'Neue Leads',
          description: 'Leads aus Gelben Seiten, 11880, Google – Status „Neu“, noch nicht bearbeitet',
          contacts: filteredContacts.filter(c => c.status === 'neu' && isFromLeadSource(c)),
          showStats: true
        };
      }
      case 'smart-follow-up':
        if (isPaginatedView) {
          return { title: 'Follow-up nötig', description: 'Wiedervorlage oder Qualifiziert – nächster Schritt', contacts, showStats: true };
        }
        return {
          title: 'Follow-up nötig',
          description: 'Wiedervorlage oder Qualifiziert – nächster Schritt',
          contacts: filteredContacts.filter(c => c.status === 'wiedervorlage' || c.status === 'qualifiziert'),
          showStats: true
        };
      case 'kalender':
        return { title: 'Kalender', description: 'Termine anlegen, Kalender einsehen, kommende Termine', contacts: [], showStats: false };
      case 'produkt-tool':
        return { title: 'Produkt-Tool', description: 'Produkte definieren und kombinierbar machen (Pakete, Add-ons, Module – wie auf der Website)', contacts: [], showStats: false };
      case 'bewertungs-funnel':
        return { title: 'Bewertungs-Funnel', description: 'Google-Bewertungs-Einladungen im Namen von Kunden versenden', contacts: [], showStats: false };
      case 'angebots-erstellung':
        return { title: 'Angebotserstellung', description: 'Angebote gestalten, Vorschau anzeigen und als PDF speichern', contacts: [], showStats: false };
      case 'scraper-gelbeseiten':
        return { title: 'getYELLOW', description: 'Lead-Suche über Gelbe Seiten', contacts: [], showStats: false };
      case 'scraper-11880':
        return { title: 'getGREEN', description: 'Lead-Suche über 11880', contacts: [], showStats: false };
      case 'digital-products':
        return { title: 'Digitale Produkte', description: 'Kurse, Downloads, Mitgliederbereiche – eigenes Modul (Ablefy-ähnlich)', contacts: [], showStats: false };
      default:
        return {
          title: 'Kontakte',
          description: 'Alle Kontakte. Professionell – Ads automatisch befüllt.',
          contacts: filteredContacts,
          showStats: true
        };
    }
  };

  const viewData = getViewData();

  const APP_PADDING = 8;
  const SIDEBAR_WIDTH = 127;
  const HEADER_HEIGHT = 40;
  const GAP = 12;
  const contentLeft = APP_PADDING + SIDEBAR_WIDTH + GAP;
  const headerTop = APP_PADDING + HEADER_HEIGHT + GAP;

  return (
    <div className="min-h-screen admin-crm-bg px-2">
      {/* Top-Bar: nur so breit wie Content, abgerundet, mit Abstand – Haus-Icon ist in der Sidebar */}
      <header
        className="fixed z-50 flex items-center justify-between px-4 h-10 bg-white border border-neutral-300 rounded-xl shadow-sm text-neutral-800"
        style={{ left: contentLeft, right: APP_PADDING, top: APP_PADDING }}
      >
        <span className="text-xs text-neutral-600">Eingeloggt als <strong className="text-neutral-800">{currentUser?.display_name && currentUser.display_name !== 'Administrator' ? currentUser.display_name : (currentUser?.username || '—')}</strong>{currentUser?.department_label ? ` · ${currentUser.department_label}` : ''}</span>
        <div className="flex items-center gap-1">
          <div className="relative" ref={upcomingTopbarRef}>
            <button
              type="button"
              onClick={() => {
                if (upcomingTopbarOpen) { setUpcomingTopbarOpen(false); return; }
                if (upcomingTopbarLoading) return;
                setUpcomingTopbarLoading(true);
                const from = new Date().toISOString();
                const to = new Date(); to.setDate(to.getDate() + 14);
                const params = new URLSearchParams({ from, to: to.toISOString() });
                if (calendarFilterSalesRep !== 'alle') params.set('sales_rep', calendarFilterSalesRep);
                fetch(`/api/admin/calendar/events?${params}`, { credentials: 'include' })
                  .then((r) => r.json())
                  .then((res) => { setUpcomingTopbarEvents(res.data ?? []); setUpcomingTopbarLoading(false); setUpcomingTopbarOpen(true); })
                  .catch(() => { setUpcomingTopbarLoading(false); });
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded hover:bg-neutral-300/80 transition-colors"
              title="Anstehende Termine"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">{upcomingTopbarLoading ? 'Lade…' : 'Anstehende Termine'}</span>
              {upcomingTopbarOpen && !upcomingTopbarLoading && <span className="text-xs text-neutral-500">({upcomingTopbarEvents.length})</span>}
            </button>
            {upcomingTopbarOpen && (
              <div className="absolute right-0 top-full mt-1 w-80 max-h-72 overflow-y-auto rounded-lg border border-neutral-300 bg-white shadow-xl z-[100] py-2">
                {upcomingTopbarEvents.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-neutral-500">Keine anstehenden Termine.</p>
                ) : (
                  <ul className="space-y-0">
                    {upcomingTopbarEvents.slice(0, 20).map((ev) => (
                      <li key={ev.id}>
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 text-neutral-800"
                          onClick={() => { setUpcomingTopbarOpen(false); setCalendarFromContact(null); setCalendarEditEvent(ev); setCalendarForm({ title: ev.title, startDate: ev.start_at.slice(0, 10), startTime: ev.start_at.slice(11, 16), endDate: ev.end_at.slice(0, 10), endTime: ev.end_at.slice(11, 16), sales_rep: ev.sales_rep, notes: ev.notes || '', contact_id: ev.contact_id ?? null, recommendedProductIds: ev.recommended_product_ids ?? [], website_state: ev.website_state || '', google_state: ev.google_state || '', social_media_state: ev.social_media_state || '' }); setCalendarDialogOpen(true); }}
                        >
                          <span className="font-medium block">{ev.title}</span>
                          <span className="text-xs text-neutral-500">
                            {new Date(ev.start_at).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })} · {new Date(ev.start_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setHistoryDialogOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded hover:bg-neutral-300/80 transition-colors"
            title="Aktivitätsverlauf"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </header>

      {/* Hintergrund hinter der Sidebar (ganze linke Spalte weiß, inkl. Root-Padding damit kein schmaler Streifen) */}
      <div
        className="fixed z-30 bg-white"
        style={{ left: 0, top: 0, bottom: 0, width: contentLeft + APP_PADDING }}
        aria-hidden
      />
      {/* Sidebar – nur die inneren Cards sichtbar, kein Schatten/Hintergrund */}
      <div
        ref={sidebarWrapRef}
        className="admin-sidebar-wrap fixed z-40 flex"
        style={{ left: APP_PADDING, top: APP_PADDING, bottom: APP_PADDING, width: SIDEBAR_WIDTH }}
        onMouseEnter={() => {
          if (flyoutCloseTimeoutRef.current) { clearTimeout(flyoutCloseTimeoutRef.current); flyoutCloseTimeoutRef.current = null; }
        }}
        onMouseLeave={() => {
          if (flyoutCloseTimeoutRef.current) clearTimeout(flyoutCloseTimeoutRef.current);
          flyoutCloseTimeoutRef.current = setTimeout(() => {
            if (!flyoutHoveredRef.current) setSidebarFlyout(null);
            flyoutCloseTimeoutRef.current = null;
          }, 200);
        }}
      >
        <aside className="w-full h-full flex flex-col shrink-0 bg-white scrollbar-hide">
          <nav className="admin-sidebar-nav scrollbar-hide flex-1 pt-0 pb-2 px-0 min-h-0 overflow-y-auto space-y-1 w-full">
            {/* 1. Logout + Start – komplett weiß */}
            <div className="w-full rounded-xl border border-neutral-300 bg-white px-2 py-4">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex flex-col items-center gap-0.5 py-2 px-1 rounded-md transition-transform duration-200 text-neutral-700 hover:scale-105"
                title="Abmelden"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span className="text-[10px] leading-tight text-center font-medium">Logout</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveNav('start')}
                className={`w-full flex flex-col items-center gap-0.5 py-2 px-1 rounded-md transition-transform duration-200 ${activeNav === 'start' ? 'text-[#cb530a]' : 'text-neutral-700 hover:scale-105'}`}
                title="Startseite"
              >
                <Home className="w-5 h-5 shrink-0" />
                <span className="text-[10px] leading-tight text-center font-medium">Start</span>
              </button>
            </div>
            {/* Create – Meine Homepage (gleiches Styling wie andere Blöcke) */}
            <div className="w-full rounded-xl border border-neutral-300 bg-white px-2 py-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-700 text-center py-1.5">Create</p>
              <button
                type="button"
                onClick={() => setActiveNav('create-homepage')}
                className={`w-full flex flex-col items-center gap-0.5 py-2 px-1 rounded-md transition-transform duration-200 ${activeNav === 'create-homepage' ? 'text-[#cb530a]' : 'text-neutral-700 hover:scale-105'}`}
                title="Startseite bearbeiten"
              >
                <Globe className="w-5 h-5 shrink-0" />
                <span className="text-[10px] leading-tight text-center font-medium max-w-full truncate px-0.5">Meine Homepage</span>
              </button>
            </div>
            {/* 2. CRM – angenehmes Hellgrau */}
            <div className="w-full rounded-xl border border-neutral-300 bg-neutral-100 px-2 py-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-700 text-center py-1.5">CRM</p>
              <div className="space-y-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNav(item.id)}
                      className={`w-full flex flex-col items-center gap-0.5 py-2 px-1 rounded-md transition-transform duration-200 ${
                        isActive ? 'text-[#cb530a]' : 'text-neutral-700 hover:scale-105'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-[10px] leading-tight text-center font-medium max-w-full truncate px-0.5">{item.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-700 text-center py-1.5 mt-1">Kunden</p>
              <button
                ref={kundenBtnRef}
                type="button"
                onClick={() => setActiveNav('kunden')}
                onMouseEnter={() => {
                  const el = kundenBtnRef.current;
                  if (el) {
                    const rect = el.getBoundingClientRect();
                    setFlyoutPosition({ buttonBottom: rect.bottom });
                  }
                  setSidebarFlyout('kunden');
                }}
                className={`w-full flex flex-col items-center gap-0.5 py-2 px-1 rounded-md transition-transform duration-200 ${
                  isKundenActive ? 'text-[#cb530a]' : 'text-neutral-700 hover:scale-105'
                }`}
              >
                <Building2 className="w-5 h-5 shrink-0" />
                <span className="flex items-center gap-0.5 text-[10px] leading-tight font-medium">
                  Kunden
                  <ChevronRight className="w-3 h-3 shrink-0 text-neutral-500 opacity-70" aria-hidden />
                </span>
              </button>
            </div>
            {/* 3. Akquise – transparentes Orange */}
            <div className="w-full rounded-xl border border-neutral-300 bg-[#cb530a]/10 px-2 py-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-700 text-center py-1.5">Akquise</p>
              <div className="space-y-0.5">
                {smartViewItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNav(item.id)}
                      className={`w-full flex flex-col items-center gap-0.5 py-2 px-1 rounded-md transition-transform duration-200 ${
                        isActive ? 'text-[#cb530a]' : 'text-neutral-700 hover:scale-105'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-[10px] leading-tight text-center font-medium max-w-full truncate px-0.5">{item.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-700 text-center py-1.5 mt-1">Termine</p>
              <button
                type="button"
                onClick={() => setActiveNav('kalender')}
                className={`w-full flex flex-col items-center gap-0.5 py-2 px-1 rounded-md transition-transform duration-200 ${
                  activeNav === 'kalender' ? 'text-[#cb530a]' : 'text-neutral-700 hover:scale-105'
                }`}
              >
                <Calendar className="w-5 h-5 shrink-0" />
                <span className="text-[10px] leading-tight text-center font-medium">Kalender</span>
              </button>
            </div>
            {/* 4. Tools & Einstellungen – dunkleres Hellgrau */}
            <div className="w-full rounded-xl border border-neutral-300 bg-neutral-200 px-2 py-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-700 text-center py-1.5">Tools</p>
              <button
                ref={toolsBtnRef}
                type="button"
                onClick={() => setActiveNav(toolsSubItems[0]?.id ?? 'produkt-tool')}
                onMouseEnter={() => {
                  const el = toolsBtnRef.current;
                  if (el) {
                    const rect = el.getBoundingClientRect();
                    setFlyoutPosition({ buttonBottom: rect.bottom });
                  }
                  setSidebarFlyout('tools');
                }}
                className={`w-full flex flex-col items-center gap-0.5 py-2 px-1 rounded-md transition-transform duration-200 ${
                  isToolsActive ? 'text-[#cb530a]' : 'text-neutral-700 hover:scale-105'
                }`}
              >
                <Wrench className="w-5 h-5 shrink-0" />
                <span className="flex items-center gap-0.5 text-[10px] leading-tight font-medium">
                  Tools
                  <ChevronRight className="w-3 h-3 shrink-0 text-neutral-500 opacity-70" aria-hidden />
                </span>
              </button>
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-700 text-center py-1.5 mt-1">Einstellungen</p>
              <button
                type="button"
                onClick={() => setActiveNav('team')}
                className={`w-full flex flex-col items-center gap-0.5 py-2 px-1 rounded-md transition-transform duration-200 ${
                  activeNav === 'team' ? 'text-[#cb530a]' : 'text-neutral-700 hover:scale-105'
                }`}
              >
                <Users className="w-5 h-5 shrink-0" />
                <span className="text-[10px] leading-tight text-center font-medium">Team</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Flyout im gleichen Styling wie die zugehörige Card (Kunden = CRM, Tools = Tools-Card) */}
        {sidebarFlyout && (
          <div
            ref={flyoutPanelRef}
            className={`fixed w-52 border border-neutral-300 rounded-xl flex flex-col py-2.5 z-50 shadow-md ${sidebarFlyout === 'kunden' ? 'bg-neutral-100' : 'bg-neutral-200'}`}
            style={{ left: APP_PADDING + SIDEBAR_WIDTH + 4, bottom: window.innerHeight - flyoutPosition.buttonBottom }}
            onMouseEnter={() => {
              if (flyoutCloseTimeoutRef.current) { clearTimeout(flyoutCloseTimeoutRef.current); flyoutCloseTimeoutRef.current = null; }
              flyoutHoveredRef.current = true;
            }}
            onMouseLeave={() => { flyoutHoveredRef.current = false; setSidebarFlyout(null); }}
          >
            <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-700 text-center py-1.5 px-2">
              {sidebarFlyout === 'kunden' ? 'Kunden' : 'Tools'}
            </p>
            <div className="space-y-0.5 px-1">
              {sidebarFlyout === 'kunden'
                ? kundenSubItems.map((sub) => {
                    const isSubActive = activeNav === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setActiveNav(sub.id)}
                        className={`w-full flex items-center gap-2 px-2 py-2 text-[10px] leading-tight font-medium text-left rounded-md transition-colors ${
                          isSubActive ? 'bg-[#cb530a]/20 text-[#a84308]' : 'text-neutral-700 hover:bg-neutral-200/80'
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })
                : toolsSubItems.map((sub) => {
                    const isSubActive = activeNav === sub.id;
                    const isGetYellow = sub.id === 'scraper-gelbeseiten';
                    const isGetGreen = sub.id === 'scraper-11880';
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setActiveNav(sub.id)}
                        className={`w-full flex items-center gap-2 px-2 py-2 text-[10px] leading-tight font-medium text-left rounded-md transition-colors ${
                          isSubActive
                            ? isGetYellow
                              ? 'bg-amber-100 text-amber-800'
                              : isGetGreen
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-[#cb530a]/20 text-[#a84308]'
                            : 'text-neutral-700 hover:bg-neutral-300/80'
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
            </div>
          </div>
        )}
      </div>

      {/* Main Content – gleiche Breite wie Top-Bar, unter der Top-Bar */}
      <div
        className="flex-1 min-w-0 overflow-x-hidden flex flex-col pr-2 pb-2 bg-white min-h-screen"
        style={{ marginLeft: contentLeft, paddingTop: headerTop }}
      >
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

        {/* Content: Startseite (nach Login), Create Homepage, Team, Kalender, Digitale Produkte, … */}
        {activeNav === 'create-homepage' ? (
          <div className="p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-foreground mb-1">Meine Homepage</h2>
              <p className="text-sm text-muted-foreground mb-4">Deine aktuelle Homepage bearbeiten, Vorschau anzeigen und veröffentlichen.</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#cb530a]/50 text-[#cb530a] hover:bg-[#cb530a]/10 h-9"
                  onClick={() => window.open('/', '_blank')}
                >
                  <Eye className="w-4 h-4 mr-1.5" />
                  Vorschau
                </Button>
                <Link href="/admin/create/homepage/edit">
                  <Button size="sm" className="bg-[#cb530a] hover:bg-[#a84308] h-9">
                    <FileEdit className="w-4 h-4 mr-1.5" />
                    Bearbeiten
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="bg-[#cb530a] hover:bg-[#a84308] h-9"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/admin/homepage', { method: 'GET', credentials: 'include' });
                      const { data } = await res.json();
                      if (!data?.json_data) return;
                      await fetch('/api/admin/homepage', { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, is_published: true }) });
                    } catch {}
                  }}
                >
                  <Upload className="w-4 h-4 mr-1.5" />
                  Veröffentlichen
                </Button>
              </div>
            </div>
          </div>
        ) : activeNav === 'start' ? (
          <div className="min-h-[calc(100vh-4rem)] flex flex-col">
            {/* Hero-Banner (ohne Bild, nur Verlauf) */}
            <div className="shrink-0 mx-4 sm:mx-6 mt-4 rounded-2xl overflow-hidden shadow-lg">
              <section className="relative min-h-[120px] sm:min-h-[140px] hero-gradient-animate flex items-center justify-center">
                <Image src="/logotransparent.png" alt="" width={180} height={72} className="object-contain h-14 sm:h-16 w-auto drop-shadow-md" />
              </section>
            </div>
            <div className="p-4 lg:p-6 flex flex-col">
              {/* Headline, Fließtext, 100px Abstand bis zu den Cards */}
              <div className="text-center mt-2 max-w-[86rem] mx-auto mb-[100px]">
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                  className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-[40px] tracking-wide"
                >
                  Herzlich willkommen, {currentUser?.display_name && currentUser.display_name !== 'Administrator' ? currentUser.display_name : currentUser?.username || 'Sie'}!
                </motion.h2>
                <TextGenerateEffect
                  words="Hier beginnt Ihr Tag im CRM. Alles Wichtige an einem Ort: Kontakte pflegen, Kunden und Projekte im Blick behalten, Leads und Akquise voranbringen – und mit den Tools alles im Griff. Wählen Sie unten einen Bereich oder nutzen Sie das Menü links. Wir wünschen Ihnen einen produktiven und erfolgreichen Tag."
                  className="text-lg sm:text-xl text-foreground leading-snug max-w-[67rem] mx-auto tracking-wide"
                  duration={0.15}
                  cinematic
                  as="p"
                />
              </div>
              {/* Karten quadratisch, mehr Abstand dazwischen */}
              <div className="max-w-[67rem] mx-auto flex items-center justify-center pb-8">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-[50rem] lg:max-w-[58rem]">
                {startPageCards.map((card) => {
                  const Icon = card.Icon;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setActiveNav(card.id)}
                      className="group text-left bg-white rounded-xl shadow border border-neutral-200 overflow-hidden hover:shadow-md hover:border-[#cb530a]/40 transition-all duration-300 aspect-square flex flex-col w-full"
                    >
                      <div className="relative flex-1 min-h-0 overflow-hidden bg-neutral-100">
                        <Image src={card.image} alt={card.label} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 25vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className="text-white text-sm font-semibold drop-shadow-md">{card.label}</span>
                        </div>
                      </div>
                      <div className="p-3 flex-shrink-0 border-t border-neutral-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-8 h-8 rounded-lg bg-[#cb530a]/15 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-[#cb530a]" />
                          </span>
                          <h3 className="text-sm font-bold text-foreground group-hover:text-[#cb530a] transition-colors truncate tracking-wide">{card.label}</h3>
                        </div>
                        <p className="text-muted-foreground leading-snug text-xs line-clamp-2 tracking-wide">{card.description}</p>
                        <span className="inline-flex items-center mt-2 text-[#cb530a] font-semibold text-xs group-hover:translate-x-1 transition-transform">Öffnen →</span>
                      </div>
                    </button>
                  );
                })}
                </div>
              </div>
            </div>
          </div>
        ) : isRubrik(activeNav) && isSectionEntry(activeNav) ? (
          <div className="min-h-[calc(100vh-4rem)] flex flex-col">
            {/* Hero wie Startseite (ohne Bild) */}
            <div className="shrink-0 mx-4 sm:mx-6 mt-4 rounded-2xl overflow-hidden shadow-lg">
              <section className="relative min-h-[120px] sm:min-h-[140px] hero-gradient-animate flex items-center justify-center">
                <Image src="/logotransparent.png" alt="" width={180} height={72} className="object-contain h-14 sm:h-16 w-auto drop-shadow-md" />
              </section>
            </div>
            <div className="p-4 lg:p-6 flex flex-col">
              <div className="text-center mt-2 max-w-[86rem] mx-auto mb-[100px]">
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                  className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-[40px] tracking-wide"
                >
                  {sectionEntryConfig[activeNav].headline}
                </motion.h2>
                <TextGenerateEffect
                  words={sectionEntryConfig[activeNav].introWords}
                  className="text-lg sm:text-xl text-foreground leading-snug max-w-[67rem] mx-auto tracking-wide"
                  duration={0.15}
                  cinematic
                  as="p"
                />
              </div>
              <div className="max-w-[67rem] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rubrikConfig[activeNav].subCards.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setActiveNav(sub.id)}
                      className="group text-left bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden p-6 hover:shadow-xl hover:border-[#cb530a]/40 transition-all duration-300 flex items-center gap-4"
                    >
                      <span className="w-12 h-12 rounded-lg bg-[#cb530a]/15 flex items-center justify-center shrink-0">
                        <ChevronRight className="w-6 h-6 text-[#cb530a]" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-[#cb530a] transition-colors">{sub.label}</h3>
                        <span className="text-[#cb530a] font-semibold text-sm group-hover:translate-x-1 transition-transform inline-block mt-1">Öffnen →</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeNav === 'digital-products' ? (
          <div className="min-h-[calc(100vh-4rem)]">
            {/* Floating Dock nur im Segment Digitale Produkte – Styling wie Main-Page-Dock (Pill, Orange, Gradient-Rand) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[45] sm:bottom-8"
            >
              <div
                className="rounded-full p-[2px] shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.4), #cb530a, #a84308, rgba(255,255,255,0.3))',
                  backgroundSize: '200% 200%',
                  animation: 'dock-border-pulse 4s ease-in-out infinite',
                }}
              >
                <div className="flex h-11 items-center gap-0.5 rounded-full bg-[#d45d0f] px-1 py-1.5 sm:h-12 sm:gap-1 sm:px-1.5">
                  <button
                    type="button"
                    onClick={() => setDpSubNav('produkte')}
                    className={`flex items-center gap-1.5 rounded-full p-2.5 text-sm font-medium text-white transition-colors sm:px-3 sm:py-2 ${dpSubNav === 'produkte' ? 'bg-[#a84308]' : 'hover:bg-white/20'}`}
                    title="Produkte"
                  >
                    <Package className="h-5 w-5 shrink-0 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Produkte</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDpSubNav('zugange')}
                    className={`flex items-center gap-1.5 rounded-full p-2.5 text-sm font-medium text-white transition-colors sm:px-3 sm:py-2 ${dpSubNav === 'zugange' ? 'bg-[#a84308]' : 'hover:bg-white/20'}`}
                    title="Zugänge"
                  >
                    <KeyRound className="h-5 w-5 shrink-0 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Zugänge</span>
                  </button>
                  <div className="w-px h-5 bg-white/30 mx-0.5" aria-hidden />
                  <button
                    type="button"
                    onClick={() => {
                      setDpEditProduct(null);
                      setDpProductForm({ type: 'course', title: '', slug: '', description: '', price_cents: 0, image_url: '', is_published: false, sort_order: dpProducts.length * 10 });
                      setDpProductDialogOpen(true);
                    }}
                    className="flex items-center gap-1.5 rounded-full p-2.5 text-sm font-medium text-white bg-[#a84308] hover:bg-[#8f3a07] transition-colors sm:px-3 sm:py-2"
                    title="Produkt erstellen"
                  >
                    <Plus className="h-5 w-5 shrink-0 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Produkt erstellen</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {dpMigrationRequired && (
              <div className="p-6 pb-0">
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
                  <CardContent className="p-4">
                    <p className="text-sm text-amber-800 dark:text-amber-200">Migration fehlt. Bitte <code className="text-xs bg-amber-100 dark:bg-amber-900/50 px-1 rounded">supabase/migrations/003_digital_products.sql</code> im Supabase SQL Editor ausführen.</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Hero wie Startseite: kleiner Banner mit animiertem Gradient, ohne Hintergrundtext – nur Logo */}
            <div className="shrink-0 mx-4 sm:mx-6 mt-4 rounded-2xl overflow-hidden shadow-lg">
              <section className="relative min-h-[120px] sm:min-h-[140px] hero-gradient-animate flex items-center justify-center">
                <Image src="/logotransparent.png" alt="" width={180} height={72} className="object-contain h-14 sm:h-16 w-auto drop-shadow-md" />
              </section>
            </div>

            {/* Sub-Navigation nur in Digitale Produkte: Produkte | Zugänge (freigeschaltete Kunden) */}
            <div className="p-4 lg:p-6 pt-4 pb-0">
              <div className="flex gap-1 p-1 rounded-xl bg-neutral-100 border border-neutral-200 max-w-xs">
                <button
                  type="button"
                  onClick={() => setDpSubNav('produkte')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${dpSubNav === 'produkte' ? 'bg-white text-[#cb530a] shadow border border-neutral-200' : 'text-neutral-600 hover:text-foreground'}`}
                >
                  Produkte
                </button>
                <button
                  type="button"
                  onClick={() => setDpSubNav('zugange')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${dpSubNav === 'zugange' ? 'bg-white text-[#cb530a] shadow border border-neutral-200' : 'text-neutral-600 hover:text-foreground'}`}
                >
                  Zugänge
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {dpSubNav === 'produkte' ? 'Kurse, Downloads und Mitgliederbereiche anlegen.' : 'Kunden gezielt für ein Produkt freischalten – nur diese haben Zugang zum Mitgliederbereich.'}
              </p>
            </div>

            <div className="p-4 lg:p-6 pb-24">
            {dpSubNav === 'zugange' ? (
              /* Zugänge: Nur freigeschaltete Kunden (Mitgliederbereich exklusiv für Digitale Produkte) */
              <div className="max-w-3xl">
                <h2 className="text-xl font-semibold text-foreground mb-1">Zugänge verwalten</h2>
                <p className="text-sm text-muted-foreground mb-6">Nur hier freigeschaltete E-Mail-Adressen haben Zugang zum jeweiligen Produkt (Kurs/Download/Mitgliederbereich). Nicht jeder CRM-Kunde erhält automatisch Zugang.</p>
                <Card className="rounded-xl border border-border/80 mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Zugang gewähren</CardTitle>
                    <CardDescription>E-Mail und Produkt wählen – optional Ablaufdatum</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label className="text-xs">Produkt</Label>
                        <select
                          value={dpEnrollmentForm.product_id}
                          onChange={(e) => setDpEnrollmentForm(f => ({ ...f, product_id: e.target.value }))}
                          className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                        >
                          <option value="">— wählen —</option>
                          {dpProducts.map((p) => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs">E-Mail des Kunden</Label>
                        <Input
                          type="email"
                          value={dpEnrollmentForm.customer_email}
                          onChange={(e) => setDpEnrollmentForm(f => ({ ...f, customer_email: e.target.value }))}
                          placeholder="kunde@beispiel.de"
                          className="mt-1 h-9"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-xs">Zugang bis (optional)</Label>
                        <Input
                          type="date"
                          value={dpEnrollmentForm.access_until}
                          onChange={(e) => setDpEnrollmentForm(f => ({ ...f, access_until: e.target.value }))}
                          className="mt-1 h-9 max-w-xs"
                        />
                      </div>
                    </div>
                    <Button
                      className="mt-3 bg-[#cb530a] hover:bg-[#a84308]"
                      onClick={async () => {
                        if (!dpEnrollmentForm.product_id || !dpEnrollmentForm.customer_email.trim()) return;
                        const res = await fetch('/api/admin/digital-products/enrollments', {
                          method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            product_id: dpEnrollmentForm.product_id,
                            customer_email: dpEnrollmentForm.customer_email.trim(),
                            access_until: dpEnrollmentForm.access_until || null,
                          }),
                        });
                        const j = await res.json();
                        if (j.data) { setDpEnrollments(prev => [{ ...j.data, product_title: dpProducts.find(p => p.id === j.data.product_id)?.title ?? '—' }, ...prev]); setDpEnrollmentForm({ product_id: dpEnrollmentForm.product_id, customer_email: '', access_until: '' }); }
                        else if (j.error) alert(j.error);
                      }}
                    >
                      Zugang gewähren
                    </Button>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border border-border/80">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Freigeschaltete Zugänge</CardTitle>
                    <CardDescription>Alle E-Mail-Adressen mit Zugang zu einem digitalen Produkt</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {dpEnrollments.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4">Noch keine Zugänge. Oben einen Kunden freischalten.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>E-Mail</TableHead>
                              <TableHead>Produkt</TableHead>
                              <TableHead>Zugang bis</TableHead>
                              <TableHead className="w-20"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {dpEnrollments.map((e) => (
                              <TableRow key={e.id}>
                                <TableCell className="font-medium">{e.customer_email}</TableCell>
                                <TableCell>{e.product_title}</TableCell>
                                <TableCell className="text-muted-foreground">{e.access_until ? new Date(e.access_until).toLocaleDateString('de-DE') : '—'}</TableCell>
                                <TableCell>
                                  <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={async () => {
                                    if (!confirm('Zugang entziehen?')) return;
                                    await fetch(`/api/admin/digital-products/enrollments/${e.id}`, { method: 'DELETE', credentials: 'include' });
                                    setDpEnrollments(prev => prev.filter(x => x.id !== e.id));
                                  }}><Trash2 className="w-3 h-3" /></Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
            {/* Headline + Fließtext wie Startseite, 100px Abstand bis zu den Cards */}
            <div className="text-center mt-2 max-w-[86rem] mx-auto mb-[100px]">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-[40px] tracking-wide"
              >
                Was möchtest du erstellen?
              </motion.h2>
              <TextGenerateEffect
                words="Wähle eine Kategorie, lege in wenigen Schritten die Grundlagen fest und passe danach alle Details an – professionell und ohne Aufwand. Kurse, Downloads und Mitgliederbereiche aus einer Hand."
                className="text-lg sm:text-xl text-foreground leading-snug max-w-[67rem] mx-auto tracking-wide"
                duration={0.15}
                cinematic
                as="p"
              />
            </div>

            {/* Karten quadratisch wie Startseite, gleicher Abstand */}
            <div className="max-w-[67rem] mx-auto flex items-center justify-center pb-8">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-[50rem] lg:max-w-[58rem]">
              {[
                { id: 'course', label: 'Online-Kurs', description: 'Videos, Lektionen und Dateien – alles in einem geschützten Bereich.', image: '/images/Handwerker.png', Icon: GraduationCap },
                { id: 'download', label: 'Download-Datei', description: 'E-Books, Vorlagen oder Dateien – Download-Link über eine Bezahlseite.', image: '/images/Dienstleistungen/Raport.jpeg', Icon: Download },
                { id: 'membership', label: 'Mitgliederbereich', description: 'Geschützter Bereich mit exklusiven Inhalten und optionalem Ablaufdatum.', image: '/images/Team/office1.jpeg', Icon: KeyRound },
              ].map((card) => {
                const Icon = card.Icon;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      setDpEditProduct(null);
                      setDpProductForm({ type: card.id as 'course' | 'download' | 'membership', title: '', slug: '', description: '', price_cents: 0, image_url: '', is_published: false, sort_order: dpProducts.length * 10 });
                      setDpProductDialogOpen(true);
                    }}
                    className="group text-left bg-white rounded-xl shadow border border-neutral-200 overflow-hidden hover:shadow-md hover:border-[#cb530a]/40 transition-all duration-300 aspect-square flex flex-col w-full"
                  >
                    <div className="relative flex-1 min-h-0 overflow-hidden bg-neutral-100">
                      <Image src={card.image} alt={card.label} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 25vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="text-white text-sm font-semibold drop-shadow-md">{card.label}</span>
                      </div>
                    </div>
                    <div className="p-3 flex-shrink-0 border-t border-neutral-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-8 h-8 rounded-lg bg-[#cb530a]/15 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-[#cb530a]" />
                        </span>
                        <h3 className="text-sm font-bold text-foreground group-hover:text-[#cb530a] transition-colors truncate tracking-wide">{card.label}</h3>
                      </div>
                      <p className="text-muted-foreground leading-snug text-xs line-clamp-2 tracking-wide">{card.description}</p>
                      <span className="inline-flex items-center mt-2 text-[#cb530a] font-semibold text-xs group-hover:translate-x-1 transition-transform">Jetzt anlegen →</span>
                    </div>
                  </button>
                );
              })}
              </div>
            </div>

            {/* Liste aller Produkte */}
            <h3 className="text-xl font-semibold text-foreground mb-4">Deine digitalen Produkte</h3>
            <Card className="rounded-xl border border-border/80 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Titel</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Preis</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right w-[180px]">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dpProducts.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-0.5 rounded bg-muted">{p.type === 'course' ? 'Kurs' : p.type === 'download' ? 'Download' : 'Mitgliederbereich'}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{p.slug}</TableCell>
                      <TableCell>{p.price_cents === 0 ? 'Kostenlos' : `${(p.price_cents / 100).toFixed(2)} €`}</TableCell>
                      <TableCell>{p.is_published ? <span className="text-green-600 text-xs">Veröffentlicht</span> : <span className="text-muted-foreground text-xs">Entwurf</span>}</TableCell>
                      <TableCell className="text-right">
                        <Button type="button" variant="outline" size="sm" className="mr-1" onClick={async () => {
                          const r = await fetch(`/api/admin/digital-products/${p.id}`, { credentials: 'include' });
                          const j = await r.json();
                          if (j.data) {
                            setDpEditProduct(j.data);
                            setDpProductForm({ type: j.data.type, title: j.data.title, slug: j.data.slug, description: j.data.description || '', price_cents: j.data.price_cents ?? 0, image_url: j.data.image_url || '', is_published: j.data.is_published ?? false, sort_order: j.data.sort_order ?? 0 });
                            setDpProductDialogOpen(true);
                            const px = await fetch(`/api/admin/digital-products/${j.data.id}/pixels`, { credentials: 'include' }).then((res) => res.json()).catch(() => ({ data: [] }));
                            setDpPixels(px.data ?? []);
                            setDpPixelForm({ provider: 'facebook', pixel_id: '', name: '', script_content: '' });
                          }
                        }}>Bearbeiten</Button>
                        <Button type="button" variant="outline" size="sm" className="mr-1" onClick={async () => {
                          const r = await fetch(`/api/admin/digital-products/${p.id}`, { credentials: 'include' });
                          const j = await r.json();
                          if (j.data) {
                            setDpEditProduct(j.data);
                            setDpLandingBuilderOpen(true);
                          }
                        }}>Website</Button>
                        <Button type="button" variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDpDeleteId(p.id)}>Löschen</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {dpProducts.length === 0 && !dpMigrationRequired && (
                <div className="p-8 text-center text-muted-foreground text-sm">Noch keine digitalen Produkte. Wähle oben eine Kategorie, um ein neues Produkt anzulegen.</div>
              )}
            </Card>

            {/* Dialog: Digitales Produkt anlegen / bearbeiten */}
            <Dialog open={dpProductDialogOpen} onOpenChange={(open) => { if (!open) { setDpProductDialogOpen(false); setDpEditProduct(null); } }}>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{dpEditProduct ? 'Produkt bearbeiten' : 'Produkt anlegen'}</DialogTitle>
                  <DialogDescription>Kurs (Lektionen/Dateien), Download oder Mitgliederbereich. Slug für URLs (z. B. mein-kurs).</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                  <div>
                    <Label className="text-xs">Typ *</Label>
                    <select value={dpProductForm.type} onChange={(e) => setDpProductForm(f => ({ ...f, type: e.target.value as 'course' | 'download' | 'membership' }))} className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                      <option value="course">Kurs</option>
                      <option value="download">Download</option>
                      <option value="membership">Mitgliederbereich</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Titel *</Label>
                    <Input value={dpProductForm.title} onChange={(e) => { const t = e.target.value; setDpProductForm(f => ({ ...f, title: t, slug: dpEditProduct ? f.slug : (f.slug || t).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })); }} placeholder="z. B. SEO Grundlagen" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">Slug * (URL-freundlich)</Label>
                    <Input value={dpProductForm.slug} onChange={(e) => setDpProductForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))} placeholder="seo-grundlagen" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">Beschreibung</Label>
                    <Textarea value={dpProductForm.description} onChange={(e) => setDpProductForm(f => ({ ...f, description: e.target.value }))} rows={2} className="mt-1 text-sm" placeholder="Kurzbeschreibung" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Preis (€ brutto) *</Label>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={dpProductForm.price_cents === 0 ? '' : (dpProductForm.price_cents / 100).toFixed(2)}
                        onChange={(e) => {
                          const raw = e.target.value.replace(',', '.');
                          const euro = raw === '' ? 0 : Math.max(0, parseFloat(raw) || 0);
                          setDpProductForm(f => ({ ...f, price_cents: Math.round(euro * 100) }));
                        }}
                        placeholder="0 = kostenlos, z. B. 800"
                        className="mt-1 h-9"
                      />
                      <p className="text-[10px] text-muted-foreground mt-0.5">z. B. 800 = 800,00 € brutto (MwSt. bei Abrechnung)</p>
                    </div>
                    <div>
                      <Label className="text-xs">Sortierung</Label>
                      <Input type="number" value={dpProductForm.sort_order} onChange={(e) => setDpProductForm(f => ({ ...f, sort_order: Number(e.target.value) || 0 }))} className="mt-1 h-9" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Produktbild</Label>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {dpProductForm.image_url ? (
                        <>
                          <img src={dpProductForm.image_url} alt="" className="h-16 w-24 rounded border object-cover" />
                          <div className="flex flex-col gap-1">
                            <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => setDpProductForm(f => ({ ...f, image_url: '' }))}>Bild entfernen</Button>
                            <span className="text-[10px] text-muted-foreground">oder neues wählen</span>
                          </div>
                        </>
                      ) : null}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const fd = new FormData();
                            fd.append('file', file);
                            try {
                              const res = await fetch('/api/admin/digital-products/upload-image', { method: 'POST', credentials: 'include', body: fd });
                              const j = await res.json();
                              if (j.url) setDpProductForm(f => ({ ...f, image_url: j.url }));
                              else if (j.error) alert(j.error);
                            } catch (err) {
                              alert('Upload fehlgeschlagen.');
                            }
                            e.target.value = '';
                          }}
                        />
                        <span className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 h-9 text-xs font-medium hover:bg-muted/50">
                          {dpProductForm.image_url ? 'Anderes Bild hochladen' : 'Bild hochladen'}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="dp-published" checked={dpProductForm.is_published} onChange={(e) => setDpProductForm(f => ({ ...f, is_published: e.target.checked }))} className="rounded border-input" />
                    <Label htmlFor="dp-published" className="text-xs cursor-pointer">Veröffentlicht (sichtbar für Kunden)</Label>
                  </div>
                  {dpEditProduct && (
                    <>
                      <hr className="my-2" />
                      <p className="text-xs font-medium text-muted-foreground">Dateien / Lektionen</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {(dpEditProduct.files ?? []).map((file) => (
                          <div key={file.id} className="flex items-center justify-between gap-2 text-sm py-1 border-b border-border/50">
                            <span className="truncate">{file.title}</span>
                            <span className="text-xs text-muted-foreground">{file.file_type}</span>
                            <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={async () => {
                              if (!confirm('Datei entfernen?')) return;
                              await fetch(`/api/admin/digital-products/files/${file.id}`, { method: 'DELETE', credentials: 'include' });
                              const r = await fetch(`/api/admin/digital-products/${dpEditProduct.id}`, { credentials: 'include' });
                              const j = await r.json();
                              if (j.data) setDpEditProduct(j.data);
                            }}><Trash2 className="w-3 h-3" /></Button>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 gap-2 pt-2">
                        <Input value={dpFileForm.title} onChange={(e) => setDpFileForm(f => ({ ...f, title: e.target.value }))} placeholder="Titel der Datei/Lektion" className="h-9" />
                        <select value={dpFileForm.file_type} onChange={(e) => setDpFileForm(f => ({ ...f, file_type: e.target.value as 'file' | 'video_url' | 'lesson' }))} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                          <option value="file">Datei (Link/URL)</option>
                          <option value="video_url">Video-URL</option>
                          <option value="lesson">Lektion (Text/Inhalt)</option>
                        </select>
                        <Input value={dpFileForm.file_url} onChange={(e) => setDpFileForm(f => ({ ...f, file_url: e.target.value }))} placeholder="URL oder Pfad" className="h-9" />
                        <Button type="button" variant="outline" size="sm" onClick={async () => {
                          if (!dpFileForm.title.trim()) return;
                          await fetch(`/api/admin/digital-products/${dpEditProduct.id}/files`, {
                            method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ title: dpFileForm.title.trim(), file_type: dpFileForm.file_type, file_url: dpFileForm.file_url.trim() || null }),
                          });
                          setDpFileForm({ title: '', file_type: 'file', file_url: '' });
                          const r = await fetch(`/api/admin/digital-products/${dpEditProduct.id}`, { credentials: 'include' });
                          const j = await r.json();
                          if (j.data) setDpEditProduct(j.data);
                        }}>Datei hinzufügen</Button>
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter className="flex-wrap gap-2">
                  <Button variant="outline" onClick={() => { setDpProductDialogOpen(false); setDpEditProduct(null); setDpPixels([]); }} disabled={dpProductSubmitting}>Abbrechen</Button>
                  <Button
                    className="bg-[#cb530a] hover:bg-[#a84308]"
                    disabled={dpProductSubmitting}
                    onClick={async () => {
                      if (!dpProductForm.title.trim() || !dpProductForm.slug.trim()) {
                        alert('Bitte Titel und Slug ausfüllen.');
                        return;
                      }
                      setDpProductSubmitting(true);
                      try {
                        if (dpEditProduct) {
                          const res = await fetch('/api/admin/digital-products/' + dpEditProduct.id, {
                            method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(dpProductForm),
                          });
                          const j = await res.json();
                          if (j.data) {
                            setDpProducts(prev => prev.map(x => x.id === j.data.id ? j.data : x));
                            setDpProductDialogOpen(false);
                            setDpEditProduct(null);
                            setDpPixels([]);
                          } else {
                            alert(j.error || 'Fehler beim Speichern.');
                          }
                        } else {
                          const res = await fetch('/api/admin/digital-products', {
                            method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(dpProductForm),
                          });
                          const j = await res.json();
                          if (j.data) {
                            setDpProducts(prev => [...prev, j.data]);
                            setDpProductDialogOpen(false);
                            setDpEditProduct(null);
                            setDpPixels([]);
                          } else {
                            alert(j.error || 'Fehler beim Anlegen.');
                          }
                        }
                      } catch (err) {
                        alert('Netzwerkfehler. Bitte erneut versuchen.');
                      } finally {
                        setDpProductSubmitting(false);
                      }
                    }}
                  >
                    {dpProductSubmitting ? (dpEditProduct ? 'Speichern…' : 'Wird angelegt…') : (dpEditProduct ? 'Speichern' : 'Anlegen')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {dpEditProduct && (
              <LandingPageBuilder
                open={dpLandingBuilderOpen}
                onOpenChange={setDpLandingBuilderOpen}
                productId={dpEditProduct.id}
                productSlug={dpEditProduct.slug}
                productTitle={dpEditProduct.title}
                initialSections={dpEditProduct.landing_page_sections ?? null}
                initialThemePrimary={dpEditProduct.theme_primary_color ?? undefined}
                initialThemeSecondary={dpEditProduct.theme_secondary_color ?? undefined}
                initialLandingTemplate={dpEditProduct.landing_template ?? undefined}
                onSaved={(sections, theme, template) => setDpEditProduct(prev => prev ? { ...prev, landing_page_sections: sections, ...(theme && { theme_primary_color: theme.theme_primary_color, theme_secondary_color: theme.theme_secondary_color }), ...(template !== undefined && { landing_template: template }) } : null)}
              />
            )}

            <Dialog open={dpDeleteId != null} onOpenChange={(open) => { if (!open) setDpDeleteId(null); }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Produkt löschen?</DialogTitle>
                  <DialogDescription>Das digitale Produkt und alle zugehörigen Dateien werden gelöscht.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDpDeleteId(null)}>Abbrechen</Button>
                  <Button variant="destructive" onClick={async () => {
                    if (dpDeleteId == null) return;
                    await fetch(`/api/admin/digital-products/${dpDeleteId}`, { method: 'DELETE', credentials: 'include' });
                    setDpProducts(prev => prev.filter(p => p.id !== dpDeleteId));
                    setDpDeleteId(null);
                  }}>Löschen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </>
            )}
            </div>
          </div>
        ) : activeNav === 'team' ? (
          <div className="min-h-[calc(100vh-4rem)] flex flex-col">
            <div className="shrink-0 mx-4 sm:mx-6 mt-4 rounded-2xl overflow-hidden shadow-lg">
              <section className="relative min-h-[120px] sm:min-h-[140px] hero-gradient-animate flex items-center justify-center">
                <Image src="/logotransparent.png" alt="" width={180} height={72} className="object-contain h-14 sm:h-16 w-auto drop-shadow-md" />
              </section>
            </div>
            <div className="p-4 lg:p-6 flex flex-col">
              <div className="text-center mt-2 max-w-[86rem] mx-auto mb-[100px]">
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                  className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-[40px] tracking-wide"
                >
                  {sectionEntryConfig.team.headline}
                </motion.h2>
                <TextGenerateEffect
                  words={sectionEntryConfig.team.introWords}
                  className="text-lg sm:text-xl text-foreground leading-snug max-w-[67rem] mx-auto tracking-wide"
                  duration={0.15}
                  cinematic
                  as="p"
                />
              </div>
              <div className="max-w-[67rem] mx-auto">
            {!canManageUsers ? (
              <Card className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 max-w-md">
                <CardContent className="p-6">
                  <p className="text-sm text-amber-800 dark:text-amber-200">Nur Administratoren können Benutzer anlegen und verwalten. Sie haben keine entsprechende Berechtigung.</p>
                </CardContent>
              </Card>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="rounded-xl border border-border/80">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Benutzer</CardTitle>
                    <CardDescription>Alle Benutzer in Ihrem Team</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {teamLoading ? (
                      <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Lade …</p>
                    ) : teamError ? (
                      <p className="text-sm text-destructive">{teamError}</p>
                    ) : teamUsers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Noch keine Benutzer. Legen Sie unten einen an.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Benutzername</TableHead>
                            <TableHead>Anzeigename</TableHead>
                            <TableHead>Rolle</TableHead>
                            <TableHead>Abteilung</TableHead>
                            <TableHead>Letzter Login</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {teamUsers.map((u) => (
                            <TableRow key={u.id}>
                              <TableCell className="font-medium">{u.username}</TableCell>
                              <TableCell>{u.display_name || '–'}</TableCell>
                              <TableCell>{u.role || '–'}</TableCell>
                              <TableCell>{u.department_label || '–'}</TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {u.last_login_at ? new Date(u.last_login_at).toLocaleString('de-DE') : '–'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="rounded-xl border border-border/80">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Benutzer anlegen</CardTitle>
                    <CardDescription>Neues Teammitglied mit Benutzername und Passwort</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {newUserMessage && (
                      <p className={`text-sm mb-3 ${newUserMessage.type === 'success' ? 'text-green-600' : 'text-destructive'}`}>
                        {newUserMessage.text}
                      </p>
                    )}
                    <form
                      className="space-y-3"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setNewUserMessage(null);
                        setNewUserSubmitting(true);
                        try {
                          const res = await fetch('/api/admin/users', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                              username: newUserForm.username.trim(),
                              password: newUserForm.password,
                              display_name: newUserForm.display_name.trim() || undefined,
                              role: currentUser?.role === 'superadmin' ? newUserForm.role : (['mitarbeiter', 'mitarbeiter_limited'].includes(newUserForm.role) ? newUserForm.role : 'mitarbeiter'),
                              department_key: newUserForm.department_key.trim() || undefined,
                            }),
                          });
                          const data = await res.json().catch(() => ({}));
                          if (res.ok) {
                            setNewUserMessage({ type: 'success', text: data.message ?? 'Benutzer angelegt.' });
                            setNewUserForm({ username: '', password: '', display_name: '', role: 'mitarbeiter', department_key: '' });
                            setTeamUsers((prev) => [...prev, { ...data.data, role: data.data?.role ?? newUserForm.role, department_label: data.data?.department_label ?? null }]);
                          } else {
                            setNewUserMessage({ type: 'error', text: data.error ?? 'Fehler beim Anlegen.' });
                          }
                        } catch {
                          setNewUserMessage({ type: 'error', text: 'Fehler beim Anlegen.' });
                        } finally {
                          setNewUserSubmitting(false);
                        }
                      }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="team-username">Benutzername *</Label>
                        <Input
                          id="team-username"
                          value={newUserForm.username}
                          onChange={(e) => setNewUserForm((f) => ({ ...f, username: e.target.value }))}
                          placeholder="z.B. max.mueller"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="team-password">Passwort * (min. 8 Zeichen)</Label>
                        <Input
                          id="team-password"
                          type="password"
                          value={newUserForm.password}
                          onChange={(e) => setNewUserForm((f) => ({ ...f, password: e.target.value }))}
                          placeholder="••••••••"
                          minLength={8}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="team-display">Anzeigename</Label>
                        <Input
                          id="team-display"
                          value={newUserForm.display_name}
                          onChange={(e) => setNewUserForm((f) => ({ ...f, display_name: e.target.value }))}
                          placeholder="Max Müller"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="team-role">Rolle</Label>
                        <select
                          id="team-role"
                          value={currentUser?.role === 'superadmin' ? newUserForm.role : (['mitarbeiter', 'mitarbeiter_limited'].includes(newUserForm.role) ? newUserForm.role : 'mitarbeiter')}
                          onChange={(e) => setNewUserForm((f) => ({ ...f, role: e.target.value }))}
                          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                        >
                          {currentUser?.role === 'superadmin' && (
                            <>
                              <option value="superadmin">Superadmin (inkl. Digitale Produkte)</option>
                              <option value="admin">Admin (ohne Digitale Produkte)</option>
                            </>
                          )}
                          <option value="mitarbeiter">Mitarbeiter</option>
                          <option value="mitarbeiter_limited">Mitarbeiter (eingeschränkt)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="team-department">Abteilung (optional)</Label>
                        <select
                          id="team-department"
                          value={newUserForm.department_key}
                          onChange={(e) => setNewUserForm((f) => ({ ...f, department_key: e.target.value || '' }))}
                          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                        >
                          <option value="">– Keine –</option>
                          {departments.map((d) => (
                            <option key={d.key} value={d.key}>{d.label}</option>
                          ))}
                        </select>
                      </div>
                      <Button type="submit" className="w-full bg-[#cb530a] hover:bg-[#a84308]" disabled={newUserSubmitting}>
                        {newUserSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Benutzer anlegen
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
            )}
              </div>
            </div>
          </div>
        ) : activeNav === 'kalender' ? (
          <div className="min-h-[calc(100vh-4rem)] flex flex-col">
            <div className="shrink-0 mx-4 sm:mx-6 mt-4 rounded-2xl overflow-hidden shadow-lg">
              <section className="relative min-h-[120px] sm:min-h-[140px] hero-gradient-animate flex items-center justify-center">
                <Image src="/logotransparent.png" alt="" width={180} height={72} className="object-contain h-14 sm:h-16 w-auto drop-shadow-md" />
              </section>
            </div>
            <div className="p-4 lg:p-6 flex flex-col">
              <div className="text-center mt-2 max-w-[86rem] mx-auto mb-[100px]">
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                  className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-[40px] tracking-wide"
                >
                  {sectionEntryConfig.kalender.headline}
                </motion.h2>
                <TextGenerateEffect
                  words={sectionEntryConfig.kalender.introWords}
                  className="text-lg sm:text-xl text-foreground leading-snug max-w-[67rem] mx-auto tracking-wide"
                  duration={0.15}
                  cinematic
                  as="p"
                />
              </div>
              <div className="max-w-[67rem] mx-auto">
            {calendarMigrationRequired && (
              <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/30">
                <CardContent className="p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">Kalender-Tabelle fehlt. Bitte <code className="text-xs bg-amber-100 dark:bg-amber-900/50 px-1 rounded">CALENDAR_MIGRATION.md</code> in Supabase ausführen.</p>
                </CardContent>
              </Card>
            )}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <select
                  value={calendarFilterSalesRep}
                  onChange={(e) => setCalendarFilterSalesRep(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="alle">Alle</option>
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.username}>{m.display_name}{m.department_label ? ` (${m.department_label})` : ''}</option>
                  ))}
                </select>
                <span className="text-sm text-muted-foreground">
                  {calendarMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                </span>
                <Button type="button" variant="outline" size="sm" className="h-9" onClick={() => { const d = new Date(calendarMonth); d.setMonth(d.getMonth() - 1); setCalendarMonth(d); }}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button type="button" variant="outline" size="sm" className="h-9" onClick={() => { const d = new Date(calendarMonth); d.setMonth(d.getMonth() + 1); setCalendarMonth(d); }}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button type="button" variant="outline" size="sm" className="h-9" onClick={() => setCalendarMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}>Heute</Button>
              </div>
              <Button className="bg-[#cb530a] hover:bg-[#a84308]" onClick={() => { setCalendarFromContact(null); setCalendarEditEvent(null); setCalendarForm({ title: '', startDate: '', startTime: '09:00', endDate: '', endTime: '09:30', sales_rep: currentUser?.username || teamMembers[0]?.username || '', notes: '', contact_id: null, recommendedProductIds: [], website_state: '', google_state: '', social_media_state: '' }); setCalendarDialogOpen(true); }}>
                <Calendar className="w-4 h-4 mr-2" />
                Termin hinzufügen
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Monatsansicht */}
              <div className="lg:col-span-2">
                <Card className="rounded-xl border border-border/80 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-7 text-center text-xs font-medium border-b border-border bg-muted/50">
                      {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((d) => (
                        <div key={d} className="py-2">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 auto-rows-fr min-h-[320px]">
                      {(() => {
                        const y = calendarMonth.getFullYear();
                        const m = calendarMonth.getMonth();
                        const first = new Date(y, m, 1);
                        const startOffset = (first.getDay() + 6) % 7;
                        const daysInMonth = new Date(y, m + 1, 0).getDate();
                        const cells = startOffset + daysInMonth;
                        const rows = Math.ceil(cells / 7);
                        const items: { date: Date | null; dayNum: number }[] = [];
                        for (let i = 0; i < rows * 7; i++) {
                          if (i < startOffset) items.push({ date: null, dayNum: 0 });
                          else if (i < startOffset + daysInMonth) items.push({ date: new Date(y, m, i - startOffset + 1), dayNum: i - startOffset + 1 });
                          else items.push({ date: null, dayNum: 0 });
                        }
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return items.map((cell, idx) => {
                          if (!cell.date) return <div key={idx} className="border-b border-r border-border/50 bg-muted/20 min-h-[60px]" />;
                          const d = cell.date;
                          const dayStart = new Date(d);
                          dayStart.setHours(0, 0, 0, 0);
                          const dayEnd = new Date(d);
                          dayEnd.setHours(23, 59, 59, 999);
                          const dayEvents = calendarEvents.filter((e) => {
                            const start = new Date(e.start_at);
                            return start >= dayStart && start <= dayEnd;
                          });
                          const isToday = d.getTime() === today.getTime();
                          return (
                            <div
                              key={idx}
                              className={`border-b border-r border-border/50 min-h-[60px] p-1 overflow-auto ${isToday ? 'bg-[#cb530a]/10' : ''}`}
                            >
                              <span className={`text-xs font-medium ${isToday ? 'text-[#cb530a]' : 'text-muted-foreground'}`}>{d.getDate()}</span>
                              <div className="space-y-0.5 mt-0.5">
                                {dayEvents.map((ev) => (
                                  <button
                                    key={ev.id}
                                    type="button"
                                    className="block w-full text-left text-[10px] px-1.5 py-0.5 rounded bg-[#cb530a]/20 text-foreground truncate hover:bg-[#cb530a]/30"
                                    title={`${ev.title} · ${new Date(ev.start_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`}
                                    onClick={() => { setCalendarFromContact(null); setCalendarEditEvent(ev); setCalendarForm({ title: ev.title, startDate: ev.start_at.slice(0, 10), startTime: ev.start_at.slice(11, 16), endDate: ev.end_at.slice(0, 10), endTime: ev.end_at.slice(11, 16), sales_rep: ev.sales_rep, notes: ev.notes || '', contact_id: ev.contact_id ?? null, recommendedProductIds: ev.recommended_product_ids ?? [], website_state: ev.website_state || '', google_state: ev.google_state || '', social_media_state: ev.social_media_state || '' }); setCalendarDialogOpen(true); }}
                                  >
                                    {new Date(ev.start_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} {ev.title}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Kommende Termine */}
              <div>
                <Card className="rounded-xl border border-border/80">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Kommende Termine</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {(() => {
                      const upcoming = calendarUpcomingEvents.slice(0, 15);
                      if (upcoming.length === 0) return <p className="text-sm text-muted-foreground">Keine anstehenden Termine.</p>;
                      return (
                        <ul className="space-y-2">
                          {upcoming.map((ev) => (
                            <li key={ev.id}>
                              <button
                                type="button"
                                className="w-full text-left text-sm p-2 rounded-lg border border-border/80 hover:bg-muted/50"
                                onClick={() => { setCalendarFromContact(null); setCalendarEditEvent(ev); setCalendarForm({ title: ev.title, startDate: ev.start_at.slice(0, 10), startTime: ev.start_at.slice(11, 16), endDate: ev.end_at.slice(0, 10), endTime: ev.end_at.slice(11, 16), sales_rep: ev.sales_rep, notes: ev.notes || '', contact_id: ev.contact_id ?? null, recommendedProductIds: ev.recommended_product_ids ?? [], website_state: ev.website_state || '', google_state: ev.google_state || '', social_media_state: ev.social_media_state || '' }); setCalendarDialogOpen(true); }}
                              >
                                <span className="font-medium block">{ev.title}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(ev.start_at).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })} · {new Date(ev.start_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} · {teamMembers.find(m => m.username === ev.sales_rep)?.display_name || ev.sales_rep}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>
            </div>

              </div>
            </div>
          </div>
        ) : activeNav === 'bewertungs-funnel' ? (
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
        ) : activeNav === 'produkt-tool' ? (
          <div className="p-6 min-h-[calc(100vh-4rem)]">
            <h2 className="text-xl font-semibold text-foreground mb-1">Produkt-Tool</h2>
            <p className="text-sm text-muted-foreground mb-6">Produkte definieren und kombinierbar machen – abgestimmt mit Main-Page (Pakete, Add-ons, Module wie im Quiz &amp; Konfigurator).</p>
            {productsMigrationRequired && (
              <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/30">
                <CardContent className="p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">Produkte-Tabelle fehlt. Bitte <code className="text-xs bg-amber-100 dark:bg-amber-900/50 px-1 rounded">SUPABASE_PRODUCTS_MIGRATION.md</code> in Supabase ausführen.</p>
                </CardContent>
              </Card>
            )}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <p className="text-sm text-muted-foreground">Pakete (z. B. Basis, Professional, Enterprise), Add-ons (z. B. Google Bewertungen, Social Basic: 1 Plattform/2 Posts Woche, Growth: 3 Plattformen/je 2 Posts, Pro: 3 Plattformen/3 Posts inkl. Reels), Module (Enterprise-Konfigurator), Einzelprodukte.</p>
              <Button className="bg-[#cb530a] hover:bg-[#a84308]" onClick={() => { setProductEditProduct(null); setProductForm({ name: '', description: '', price_display: '', price_period: '€/Monat', price_min: '', price_once: '', product_type: 'single', subline: '', features: [], sort_order: products.length * 10, for_package: '' }); setProductDialogOpen(true); }}>
                <Briefcase className="w-4 h-4 mr-2" />
                Produkt hinzufügen
              </Button>
            </div>
            <Card className="rounded-xl border border-border/80 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[280px]">Name</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Preis (Anzeige)</TableHead>
                    <TableHead>Preis min. (€)</TableHead>
                    <TableHead>Komb. Paket</TableHead>
                    <TableHead className="text-right w-[140px]">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-0.5 rounded bg-muted">{p.product_type === 'package' ? 'Paket' : p.product_type === 'addon' ? 'Add-on' : p.product_type === 'module' ? 'Modul' : 'Einzel'}</span>
                      </TableCell>
                      <TableCell>{p.price_display} {p.price_period || ''}{(p as Product & { price_once?: number })?.price_once != null ? ` · einmalig ${(p as Product & { price_once?: number }).price_once} €` : ''}</TableCell>
                      <TableCell>{p.price_min != null ? p.price_min : '—'}</TableCell>
                      <TableCell>{(p as Product & { for_package?: string })?.for_package || '—'}</TableCell>
                      <TableCell className="text-right">
                        <Button type="button" variant="outline" size="sm" className="mr-1" onClick={() => { setProductEditProduct(p); setProductForm({ name: p.name, description: p.description || '', price_display: p.price_display, price_period: p.price_period || '€/Monat', price_min: p.price_min != null ? String(p.price_min) : '', price_once: (p as Product & { price_once?: number })?.price_once != null ? String((p as Product & { price_once?: number }).price_once) : '', product_type: p.product_type, subline: p.subline || '', features: Array.isArray(p.features) ? [...p.features] : [], sort_order: p.sort_order, for_package: (p as Product & { for_package?: string })?.for_package || '' }); setProductDialogOpen(true); }}>Bearbeiten</Button>
                        <Button type="button" variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => setProductDeleteId(p.id)}>Löschen</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {products.length === 0 && !productsMigrationRequired && (
                <div className="p-8 text-center text-muted-foreground text-sm">Noch keine Produkte. Klicken Sie auf &quot;Produkt hinzufügen&quot; oder führen Sie die Migration aus.</div>
              )}
            </Card>

            {/* Dialog: Produkt anlegen / bearbeiten */}
            <Dialog open={productDialogOpen} onOpenChange={(open) => { if (!open) { setProductDialogOpen(false); setProductEditProduct(null); } }}>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{productEditProduct ? 'Produkt bearbeiten' : 'Produkt anlegen'}</DialogTitle>
                  <DialogDescription>Abgestimmt mit Website: Pakete (Basis/Professional/Enterprise), Add-ons (z. B. Google +99 €, Social Basic: 1 Plattform/2 Posts Woche, Growth: 3 Plattformen/je 2 Posts, Pro: 3 Plattformen/3 Posts inkl. Reels), Module für den Enterprise-Konfigurator.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                  <div>
                    <Label className="text-xs">Name *</Label>
                    <Input value={productForm.name} onChange={(e) => setProductForm(f => ({ ...f, name: e.target.value }))} placeholder="z. B. Paket 1: Basis" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">Typ</Label>
                    <select value={productForm.product_type} onChange={(e) => setProductForm(f => ({ ...f, product_type: e.target.value as Product['product_type'] }))} className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                      <option value="package">Paket</option>
                      <option value="addon">Add-on</option>
                      <option value="module">Modul (Enterprise)</option>
                      <option value="single">Einzelprodukt</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Beschreibung</Label>
                    <Textarea value={productForm.description} onChange={(e) => setProductForm(f => ({ ...f, description: e.target.value }))} rows={2} className="mt-1 text-sm" placeholder="Kurzbeschreibung" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Preis-Anzeige * (z. B. ab 299, +99, Auf Anfrage)</Label>
                      <Input value={productForm.price_display} onChange={(e) => setProductForm(f => ({ ...f, price_display: e.target.value }))} placeholder="ab 299" className="mt-1 h-9" />
                    </div>
                    <div>
                      <Label className="text-xs">Preis-Zeitraum</Label>
                      <Input value={productForm.price_period} onChange={(e) => setProductForm(f => ({ ...f, price_period: e.target.value }))} placeholder="€/Monat" className="mt-1 h-9" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Preis min. (€, für Berechnung)</Label>
                      <Input type="number" value={productForm.price_min} onChange={(e) => setProductForm(f => ({ ...f, price_min: e.target.value }))} placeholder="299" className="mt-1 h-9" />
                    </div>
                    <div>
                      <Label className="text-xs">Einmalpreis (€, z. B. Website)</Label>
                      <Input type="number" value={productForm.price_once} onChange={(e) => setProductForm(f => ({ ...f, price_once: e.target.value }))} placeholder="2000" className="mt-1 h-9" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Subline (optional)</Label>
                    <Input value={productForm.subline} onChange={(e) => setProductForm(f => ({ ...f, subline: e.target.value }))} placeholder="z. B. Optional: Google Bewertungen +99 €/Monat" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">Kombinierbar mit Paket (Add-ons: 1, 2 oder 1,2)</Label>
                    <Input value={productForm.for_package} onChange={(e) => setProductForm(f => ({ ...f, for_package: e.target.value }))} placeholder="1 oder 2 oder 1,2" className="mt-1 h-9" />
                  </div>
                  <div>
                    <Label className="text-xs">Features (eine pro Zeile, optional)</Label>
                    <Textarea value={productForm.features.join('\n')} onChange={(e) => setProductForm(f => ({ ...f, features: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))} rows={3} className="mt-1 text-sm" placeholder="Feature 1&#10;Feature 2" />
                  </div>
                  <div>
                    <Label className="text-xs">Sortierung (Zahl)</Label>
                    <Input type="number" value={productForm.sort_order} onChange={(e) => setProductForm(f => ({ ...f, sort_order: Number(e.target.value) || 0 }))} className="mt-1 h-9" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setProductDialogOpen(false); setProductEditProduct(null); }}>Abbrechen</Button>
                  <Button
                    className="bg-[#cb530a] hover:bg-[#a84308]"
                    onClick={async () => {
                      if (!productForm.name.trim() || !productForm.price_display.trim()) return;
                      try {
                        if (productEditProduct) {
                          const res = await fetch('/api/admin/products', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ id: productEditProduct.id, ...productForm, price_min: productForm.price_min === '' ? null : Number(productForm.price_min), price_once: productForm.price_once === '' ? null : Number(productForm.price_once), for_package: productForm.for_package || null }) });
                          if (!res.ok) { const d = await res.json(); alert(d.error || 'Fehler'); return; }
                          const { data } = await res.json();
                          setProducts(prev => prev.map(p => p.id === data.id ? { ...p, ...data, features: data.features ?? p.features } : p));
                        } else {
                          const res = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ ...productForm, price_min: productForm.price_min === '' ? null : Number(productForm.price_min), price_once: productForm.price_once === '' ? null : Number(productForm.price_once), for_package: productForm.for_package || null }) });
                          if (!res.ok) { const d = await res.json(); alert(d.error || 'Fehler'); return; }
                          const { data } = await res.json();
                          setProducts(prev => [...prev, data].sort((a, b) => a.sort_order - b.sort_order));
                        }
                        setProductDialogOpen(false);
                        setProductEditProduct(null);
                      } catch (e) { console.error(e); alert('Fehler beim Speichern'); }
                    }}
                  >
                    {productEditProduct ? 'Speichern' : 'Anlegen'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Dialog: Produkt löschen bestätigen */}
            <Dialog open={productDeleteId != null} onOpenChange={(open) => { if (!open) setProductDeleteId(null); }}>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Produkt löschen?</DialogTitle>
                  <DialogDescription>Diese Aktion entfernt das Produkt. Zugeordnungen zu Kontakten (Mögliche Sales) werden ebenfalls gelöscht.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setProductDeleteId(null)}>Abbrechen</Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      if (productDeleteId == null) return;
                      try {
                        const res = await fetch(`/api/admin/products?id=${productDeleteId}`, { method: 'DELETE', credentials: 'include' });
                        if (!res.ok) { const d = await res.json(); alert(d.error || 'Fehler'); return; }
                        setProducts(prev => prev.filter(p => p.id !== productDeleteId));
                        setProductDeleteId(null);
                      } catch (e) { console.error(e); alert('Fehler'); }
                    }}
                  >
                    Löschen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <Button type="button" variant="outline" size="sm" className="h-9" onClick={() => setAngebotProductPickerOpen(true)}>
                        Produkt wählen
                      </Button>
                      {angebot.produkt && <span className="text-sm text-muted-foreground">{angebot.produkt} {angebot.preis ? `(${angebot.preis} €)` : ''}</span>}
                    </div>
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

            {/* Popup: Produkt für Angebot wählen (klickbasiert statt Dropdown) */}
            <Dialog open={angebotProductPickerOpen} onOpenChange={setAngebotProductPickerOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Produkt für Angebot wählen</DialogTitle>
                  <DialogDescription>Ein Klick übernimmt Name und Preis in das Angebot.</DialogDescription>
                </DialogHeader>
                {productsMigrationRequired && (
                  <p className="text-sm text-amber-600">Produkte-Tabelle fehlt. Bitte SUPABASE_PRODUCTS_MIGRATION.md ausführen.</p>
                )}
                <div className="grid gap-1.5 max-h-64 overflow-y-auto">
                  {products.map((p) => (
                    <Button
                      key={p.id}
                      type="button"
                      variant="outline"
                      className="justify-start h-auto py-2 text-left"
                      onClick={() => {
                        const priceStr = p.price_display?.replace(/\D/g, '') || (p.price_min != null ? String(p.price_min) : '');
                        setAngebot((a) => ({ ...a, produkt: p.name, preis: priceStr || a.preis }));
                        setAngebotProductPickerOpen(false);
                      }}
                    >
                      <span className="font-medium">{p.name}</span>
                      <span className="ml-2 text-muted-foreground">({p.price_display} {p.price_period || ''})</span>
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

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
          <div className="min-h-[calc(100vh-4rem)] p-6 md:p-8 bg-white rounded-xl border border-neutral-200">
            <h2 className="text-2xl font-bold mb-2 text-foreground">getYELLOW</h2>
            <p className="text-sm mb-6 max-w-2xl text-muted-foreground">
              Lead-Suche über Gelbe Seiten: Keyword und Ort eingeben, Ergebnisse werden gesammelt und können in die Kontaktliste übernommen werden.
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
                    <div className="mb-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                        {scrapePhaseGS === 'anzeigen_sammeln' ? 'Suche läuft…' : `${foundCountGS} Einträge gefunden`}
                      </p>
                      {scrapePhaseGS !== 'anzeigen_sammeln' && (
                        <p className="text-xs text-gray-600 mt-1">Ergebnisse werden geladen. Weitere Tools (z. B. getGREEN) können parallel genutzt werden.</p>
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
                                  setScraperDoneNotification({ source: 'gelbeseiten', label: 'getYELLOW', count: ev.count ?? current.length });
                                  if ((ev.count ?? 0) === 0) setScrapeErrorGS('Keine Treffer für die gewählte Suche.');
                                } else if (ev.phase === 'error') {
                                  setScrapingGS(false);
                                  setScrapeErrorGS(ev.error ?? 'Suche fehlgeschlagen.');
                                  setScraperDoneNotification({ source: 'gelbeseiten', label: 'getYELLOW', count: 0, error: ev.error });
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
                          setScrapeErrorGS(e instanceof Error ? e.message : 'Der Zauber ist leider fehlgeschlagen.');
                          setScraperDoneNotification({ source: 'gelbeseiten', label: 'getYELLOW', count: 0, error: e instanceof Error ? e.message : undefined });
                        }
                      }}
                      disabled={!scrapeKeyword.trim() || !scrapeLocation.trim() || scrapingGS}
                      className="px-4 py-2 bg-[#1a1a1a] text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {scrapingGS ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Zaubern läuft…
                        </>
                      ) : (
                        'Kontakte herbeizaubern'
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
                        Goldenes Buch in neuem Tab öffnen
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
                        {selectedScrapedLeads.filter((s) => !s).length} Duplikat(e) erkannt (bereits in Leads) – abgewählt. Einzelne Zeilen könnt ihr per Klick an- oder abwählen.
                      </p>
                    )}
                    <p className="font-semibold text-gray-800 mb-3">{scrapedLeads.length} herbeigezauberte Kontakte – Auswählen, dann importieren oder CSV</p>
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
                          downloadCsvForHubspot(selected, scrapeKeyword.trim() || 'Suchbegriff', 'getYELLOW');
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
          <div className="min-h-[calc(100vh-4rem)] p-6 md:p-8 bg-white rounded-xl border border-neutral-200">
            <h2 className="text-2xl font-bold mb-2 text-foreground">getGREEN</h2>
            <p className="text-sm mb-6 max-w-2xl text-muted-foreground">
              Lead-Suche über 11880: Branche und Ort eingeben. Die Suche läuft im Hintergrund; bei vielen Treffern kann es einige Minuten dauern. Ergebnisse können in die Kontaktliste übernommen werden.
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
                    <div className="mb-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                        Suche läuft…
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Ergebnisse werden geladen. Bei Abschluss erscheint eine Meldung.</p>
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
                              setScraperDoneNotification({ source: '11880', label: 'getGREEN', count: result.leads.length });
                              if (result.leads.length === 0 && result.error) {
                                setScrapeError11880(result.error);
                              }
                            } else {
                              setScrapeError11880(result.error ?? 'Suche fehlgeschlagen.');
                              setScraperDoneNotification({ source: '11880', label: 'getGREEN', count: 0, error: result.error });
                            }
                          } finally {
                            setScraping11880(false);
                          }
                        }).catch((e) => {
                          setScraping11880(false);
                          setScrapeError11880(e?.message ?? 'Suche fehlgeschlagen.');
                          setScraperDoneNotification({ source: '11880', label: 'getGREEN', count: 0, error: e?.message });
                        });
                      }}
                      disabled={!scrapeKeyword.trim() || !scrapeLocation.trim() || scraping11880}
                      className="px-4 py-2 bg-[#004d28] text-white font-semibold rounded-lg hover:bg-[#003d20] transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {scraping11880 ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Suche läuft…
                        </>
                      ) : (
                        'Suchen'
                      )}
                    </button>
                    {scrapeKeyword.trim() && scrapeLocation.trim() && (
                      <a
                        href={build11880SearchUrl(scrapeKeyword, scrapeLocation)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white border-2 border-emerald-700 rounded-lg font-medium text-emerald-800 hover:bg-emerald-700 hover:text-white transition-colors inline-flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Zauberer-Reich in neuem Tab öffnen
                      </a>
                    )}
                  </div>
                  {scrapeError && (
                  <p className="mt-4 text-sm text-red-700 font-medium">{scrapeError}</p>
                )}
            </div>

            {scrapedLeads.length > 0 && (
              <div className="mb-6 bg-emerald-50 rounded-lg p-6 border border-emerald-200">
                {selectedScrapedLeads.filter((s) => !s).length > 0 && (
                  <p className="text-amber-900 bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 mb-3 text-sm font-medium">
                    {selectedScrapedLeads.filter((s) => !s).length} Duplikat(e) erkannt (bereits in Leads) – abgewählt. Einzelne Zeilen könnt ihr per Klick an- oder abwählen.
                  </p>
                )}
                <p className="font-semibold text-gray-800 mb-3">{scrapedLeads.length} herbeigezauberte Kontakte – Auswählen, dann importieren oder CSV</p>
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
                      downloadCsvForHubspot(selected, scrapeKeyword.trim() || 'Suchbegriff', 'getGREEN');
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

        {/* KPI-Cards – flach, wenig Platz */}
        {viewData.showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            <Card className="rounded-lg border border-border/80 bg-white overflow-hidden border-l-4 border-l-neutral-800">
              <CardContent className="flex items-center justify-between py-1.5 px-2.5">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Neu</p>
                  <p className="text-base font-bold tabular-nums text-foreground leading-tight">{kpiNeu}</p>
                </div>
                <div className="rounded-md bg-neutral-200 p-1.5"><Clock className="w-3.5 h-3.5 text-neutral-700" /></div>
              </CardContent>
            </Card>
            <Card className="rounded-lg border border-border/80 bg-white overflow-hidden border-l-4 border-l-[#cb530a]">
              <CardContent className="flex items-center justify-between py-1.5 px-2.5">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Aktiv</p>
                  <p className="text-base font-bold tabular-nums text-foreground leading-tight">{kpiAktiv}</p>
                </div>
                <div className="rounded-md bg-[#cb530a]/10 p-1.5"><MessageSquare className="w-3.5 h-3.5 text-[#cb530a]" /></div>
              </CardContent>
            </Card>
            <Card className="rounded-lg border border-border/80 bg-white overflow-hidden border-l-4 border-l-neutral-500">
              <CardContent className="flex items-center justify-between py-1.5 px-2.5">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Nicht qual. / Wiedervorlage</p>
                  <p className="text-base font-bold tabular-nums text-foreground leading-tight">{kpiNichtQual}</p>
                </div>
                <div className="rounded-md bg-neutral-200 p-1.5"><XCircle className="w-3.5 h-3.5 text-neutral-600" /></div>
              </CardContent>
            </Card>
            <Card className="rounded-lg border border-border/80 bg-white overflow-hidden border-l-4 border-l-black">
              <CardContent className="flex items-center justify-between py-1.5 px-2.5">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Kunde</p>
                  <p className="text-base font-bold tabular-nums text-foreground leading-tight">{kpiKunde}</p>
                </div>
                <div className="rounded-md bg-neutral-200 p-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-neutral-800" /></div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filter und Suche – kompakt, weiß wie Suchen-Card */}
        <Card className="rounded-lg border border-border/80 bg-white p-3 mb-3">
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
              <div className="relative" ref={infoFilterRef}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs justify-start gap-1.5 min-w-[7rem] border border-input bg-background"
                  onClick={() => setInfoFilterOpen((o) => !o)}
                >
                  <span className="truncate">
                    Info: {infoFilter.length === 0 ? 'alle' : infoFilter.map((k) => k === 'email' ? 'E-Mail' : k === 'website' ? 'Website' : 'Profil').join(', ')}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-60" />
                </Button>
                {infoFilterOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-52 rounded-md border border-border bg-white py-1 shadow-lg">
                    {[
                      { key: 'email', label: 'Hat E-Mail' },
                      { key: 'website', label: 'Hat Website' },
                      { key: 'profile', label: 'Hat Profil' },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs cursor-pointer hover:bg-muted/60"
                      >
                        <input
                          type="checkbox"
                          checked={infoFilter.includes(key)}
                          onChange={(e) => {
                            if (e.target.checked) setInfoFilter((prev) => [...prev, key].sort());
                            else setInfoFilter((prev) => prev.filter((k) => k !== key));
                          }}
                          className="rounded border-input"
                        />
                        {label}
                      </label>
                    ))}
                    <p className="px-3 py-1.5 text-[10px] text-muted-foreground border-t border-border/60 mt-1 pt-1.5">
                      Mehrfachauswahl = alle gewählten Bedingungen (UND)
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-0 rounded-md border border-input overflow-hidden">
                <Button variant={viewMode === 'pipeline' ? 'default' : 'ghost'} size="sm" className="rounded-none h-8 px-2.5 text-xs bg-[#cb530a] hover:bg-[#a84308] data-[variant=ghost]:bg-transparent" onClick={() => setViewMode('pipeline')}>Pipeline</Button>
                <Button variant={viewMode === 'table' ? 'default' : 'ghost'} size="sm" className="rounded-none h-8 px-2.5 text-xs bg-[#cb530a] hover:bg-[#a84308] data-[variant=ghost]:bg-transparent" onClick={() => setViewMode('table')}>Tabelle</Button>
              </div>
              <Button onClick={() => { setContactsPage(0); loadContacts(activeNav === 'leads', 0); }} disabled={loading} size="sm" className="h-8 px-3 text-xs bg-[#cb530a] hover:bg-[#a84308]">
                {loading ? 'Lädt...' : 'Aktualisieren'}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {isPaginatedView ? contactsTotal : viewData.contacts.length} {viewData.title === 'Kundenprojekte' ? 'Projekt' : 'Kontakt'}{(isPaginatedView ? contactsTotal : viewData.contacts.length) !== 1 ? (viewData.title === 'Kundenprojekte' ? 'e' : 'e') : ''} gefunden
            {isPaginatedView && contactsTotal > CONTACTS_PAGE_SIZE && (
              <span className="ml-2 text-muted-foreground">(Seite {contactsPage + 1} von {Math.ceil(contactsTotal / CONTACTS_PAGE_SIZE)})</span>
            )}
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
                            potentialBadges={getPotentialBadges(contact)}
                            leadStatuses={LEAD_STATUSES}
                            onStatusChange={(newStatus) => updateStatus(contact.id, newStatus)}
                            onStatusClick={() => setStatusDialogContact(contact)}
                            onContextMenu={(e) => setContextMenu({ x: e.clientX, y: e.clientY, contact })}
                            onNotesClick={() => { setSelectedContact(contact); setNotes(contact.notes || ''); }}
                            onAssignedChange={(assignedTo) => updateAssignedTo(contact.id, assignedTo)}
                            onCalendarClick={() => { const c = contact; const today = new Date().toISOString().slice(0, 10); const defRep = currentUser?.username || teamMembers[0]?.username || ''; setCalendarFromContact(c); setCalendarForm({ title: c.company || `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Lead', startDate: today, startTime: '09:00', endDate: today, endTime: '09:30', sales_rep: defRep, notes: '', contact_id: c.id, recommendedProductIds: [], website_state: '', google_state: '', social_media_state: '' }); setCalendarEditEvent(null); setCalendarDialogOpen(true); }}
                            getProfileUrl={getProfileUrl}
                            getProfileLabel={getProfileLabel}
                            getWebsiteFromNotes={getWebsiteFromNotes}
                            renderQuizData={renderQuizData}
                            getStatusColor={getStatusColor}
                            getStatusLabel={getStatusLabel}
                            getSourceLabel={getSourceLabel}
                            getSourceBorderClass={getSourceBorderClass}
                            teamMembers={teamMembers}
                        />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {isPaginatedView && contactsTotal > CONTACTS_PAGE_SIZE && (
              <div className="flex items-center justify-between gap-4 py-3 px-4 border-t border-border/80 bg-white rounded-b-xl mt-2">
                <span className="text-sm text-muted-foreground">
                  Einträge {(contactsPage * CONTACTS_PAGE_SIZE) + 1}–{Math.min((contactsPage + 1) * CONTACTS_PAGE_SIZE, contactsTotal)} von {contactsTotal}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8" disabled={contactsPage === 0 || loading} onClick={() => { const prev = contactsPage - 1; setContactsPage(prev); loadContacts(undefined, prev); }}>Zurück</Button>
                  <span className="text-sm tabular-nums">Seite {contactsPage + 1} von {Math.ceil(contactsTotal / CONTACTS_PAGE_SIZE)}</span>
                  <Button variant="outline" size="sm" className="h-8" disabled={contactsPage >= Math.ceil(contactsTotal / CONTACTS_PAGE_SIZE) - 1 || loading} onClick={() => { const next = contactsPage + 1; setContactsPage(next); loadContacts(undefined, next); }}>Weiter</Button>
                </div>
              </div>
            )}
            </>
          ) : (
            /* Table View */
            <div className="space-y-4">
              {viewData.contacts.length === 0 ? (
                <Card className="rounded-2xl border border-border/80 bg-white shadow-sm p-12 text-center">
                  <p className="text-muted-foreground">Keine {viewData.title === 'Kundenprojekte' ? 'Projekte' : 'Kontakte'} gefunden.</p>
                </Card>
              ) : (activeNav === 'leads' || activeNav === 'contacts' || activeNav === 'meine-kontakte' || activeNav === 'kunden' || isSmartView) && viewMode === 'table' ? (
                /* Tabelle – gleiche Breite wie KPI-Cards darüber, keine seitliche Einrückung */
                <div className="min-w-0 overflow-x-auto">
                  <Card className="overflow-visible border-0 shadow-none rounded-none bg-transparent p-0">
                    <Table className="table-fixed w-max min-w-full border-separate border-spacing-x-0 border-spacing-y-2">
                      <colgroup>
                        {TABLE_COLUMN_KEYS.map((key) => (
                          <col key={key} style={{ width: getTableColWidth(key), minWidth: RESIZABLE_TABLE_COLUMNS.includes(key) ? 40 : getTableColWidth(key) }} />
                        ))}
                      </colgroup>
                      <TableHeader>
                        <TableRow className="bg-white border-2 border-neutral-200 border-0 rounded-t-lg hover:bg-white">
                          {TABLE_COLUMN_KEYS.map((key, idx) => (
                            <TableHead
                              key={key}
                              style={{ width: getTableColWidth(key), maxWidth: getTableColWidth(key), minWidth: RESIZABLE_TABLE_COLUMNS.includes(key) ? 40 : getTableColWidth(key) }}
                              className={`relative select-none pr-0 overflow-visible ${idx === 0 ? 'rounded-tl-lg' : ''} ${idx === TABLE_COLUMN_KEYS.length - 1 ? 'rounded-tr-lg' : ''}`}
                            >
                              <span className="block truncate pr-2">
                                {key === 'vertriebler' ? 'Zugewiesen' : key === 'firmaName' ? 'Firma / Name' : key === 'telefon' ? 'Telefon' : key === 'info' ? 'Info' : key === 'ort' ? 'Ort' : key === 'sales' ? 'Mögliche Sales' : 'Status'}
                              </span>
                              {RESIZABLE_TABLE_COLUMNS.includes(key) && (
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
                              )}
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
                              className={`border-b-0 bg-white border-2 border-neutral-200 hover:border-neutral-300 transition-colors ${getSourceBorderClass(contact.source)}`}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                setContextMenu({ x: e.clientX, y: e.clientY, contact });
                              }}
                            >
                              <TableCell style={{ width: getTableColWidth('vertriebler'), maxWidth: getTableColWidth('vertriebler'), minWidth: 0 }} className="overflow-hidden rounded-l-lg min-w-0">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-7 w-full min-w-0 text-xs justify-start"
                                  onClick={() => setAssignDialogContact(contact)}
                                >
                                  {contact.assigned_to ? (teamMembers.find(m => m.username === contact.assigned_to)?.display_name || contact.assigned_to) : '—'}
                                </Button>
                              </TableCell>
                              <TableCell style={{ width: getTableColWidth('firmaName'), maxWidth: getTableColWidth('firmaName'), minWidth: 0 }} className="font-medium overflow-hidden min-w-0">
                                <span className="block truncate min-w-0" title={firmaName}>{firmaName}</span>
                                {getPotentialBadges(contact).length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {getPotentialBadges(contact).map((b) => (
                                      <span key={b.key} className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${b.className}`} title={b.title}>{b.label}</span>
                                    ))}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell style={{ width: getTableColWidth('telefon'), maxWidth: getTableColWidth('telefon'), minWidth: 0 }} className="overflow-hidden min-w-0">
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
                              <TableCell style={{ width: getTableColWidth('info'), maxWidth: getTableColWidth('info'), minWidth: 0 }} className="overflow-hidden min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {/* Quelle: Farbpunkt (Gelb = Gelbe Seiten, Grün = 11880) */}
                                  <span
                                    className="shrink-0 w-3 h-3 rounded-full border border-neutral-300"
                                    style={{ backgroundColor: contact.source === 'gelbe_seiten' ? '#F5C400' : contact.source === '11880' ? 'rgb(34 197 94)' : 'var(--muted)' }}
                                    title={getSourceLabel(contact.source)}
                                  />
                                  {contact.email?.trim() ? (
                                    <button
                                      type="button"
                                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                                      title={`E-Mail kopieren: ${contact.email}`}
                                      onClick={() => { navigator.clipboard.writeText(contact.email!); }}
                                    >
                                      <AtSign className="w-4 h-4" />
                                    </button>
                                  ) : null}
                                  {profileUrl ? (
                                    <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title={profileLabel || 'Profil'}>
                                      <UserCircle className="w-4 h-4" />
                                    </a>
                                  ) : null}
                                  {getWebsiteFromNotes(contact.notes) ? (
                                    <a href={getWebsiteFromNotes(contact.notes)!} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Website">
                                      <Globe className="w-4 h-4" />
                                    </a>
                                  ) : null}
                                </div>
                              </TableCell>
                              <TableCell style={{ width: getTableColWidth('ort'), maxWidth: getTableColWidth('ort'), minWidth: 0 }} className="text-muted-foreground overflow-hidden min-w-0 truncate">{contact.city || '—'}</TableCell>
                              <TableCell style={{ width: getTableColWidth('sales'), maxWidth: getTableColWidth('sales'), minWidth: 0 }} className="overflow-hidden min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {opportunitySums[contact.id] != null && opportunitySums[contact.id] > 0 && (
                                    <span className="text-xs font-medium text-emerald-700 tabular-nums">{opportunitySums[contact.id].toLocaleString('de-DE')} €</span>
                                  )}
                                  <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-xs shrink-0" onClick={() => setProductPickerContact(contact)} title="Produkte / Mögliche Sales">
                                    Produkte
                                  </Button>
                                  <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-xs shrink-0" onClick={() => { const c = contact; const today = new Date().toISOString().slice(0, 10); const defRep = currentUser?.username || teamMembers[0]?.username || ''; setCalendarFromContact(c); setCalendarForm({ title: c.company || `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Lead', startDate: today, startTime: '09:00', endDate: today, endTime: '09:30', sales_rep: defRep, notes: '', contact_id: c.id, recommendedProductIds: [], website_state: '', google_state: '', social_media_state: '' }); setCalendarEditEvent(null); setCalendarDialogOpen(true); }} title="Termin mit diesem Lead">
                                    <Calendar className="w-3.5 h-3.5 mr-0.5 inline" />
                                    Termin
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell style={{ width: getTableColWidth('status'), maxWidth: getTableColWidth('status'), minWidth: 0 }} className="overflow-hidden min-w-0 rounded-r-lg">
                                <Button type="button" variant="outline" size="sm" className={`h-7 w-full min-w-0 text-xs justify-start font-semibold ${getStatusColor(contact.status)} border-current/30`} title="Klicken zum Ändern" onClick={() => setStatusDialogContact(contact)}>
                                  <span className="truncate block">{getStatusLabel(contact.status)}</span>
                                </Button>
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
                    potentialBadges={getPotentialBadges(contact)}
                    leadStatuses={LEAD_STATUSES}
                    onStatusChange={(newStatus) => updateStatus(contact.id, newStatus)}
                    onStatusClick={() => setStatusDialogContact(contact)}
                    onContextMenu={(e) => setContextMenu({ x: e.clientX, y: e.clientY, contact })}
                    onNotesClick={() => { setSelectedContact(contact); setNotes(contact.notes || ''); }}
                    onAssignedChange={(assignedTo) => updateAssignedTo(contact.id, assignedTo)}
                    onProductsClick={() => setProductPickerContact(contact)}
                    onCalendarClick={() => { const c = contact; const today = new Date().toISOString().slice(0, 10); const defRep = currentUser?.username || teamMembers[0]?.username || ''; setCalendarFromContact(c); setCalendarForm({ title: c.company || `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Lead', startDate: today, startTime: '09:00', endDate: today, endTime: '09:30', sales_rep: defRep, notes: '', contact_id: c.id, recommendedProductIds: [], website_state: '', google_state: '', social_media_state: '' }); setCalendarEditEvent(null); setCalendarDialogOpen(true); }}
                    opportunitySum={opportunitySums[contact.id]}
                    getProfileUrl={getProfileUrl}
                    getProfileLabel={getProfileLabel}
                    getWebsiteFromNotes={getWebsiteFromNotes}
                    renderQuizData={renderQuizData}
                    getStatusColor={getStatusColor}
                    getStatusLabel={getStatusLabel}
                    getSourceLabel={getSourceLabel}
                    getSourceBorderClass={getSourceBorderClass}
                    fullWidth
                    teamMembers={teamMembers}
                  />
                ))
              )}
              {isPaginatedView && contactsTotal > CONTACTS_PAGE_SIZE && (
                <div className="flex items-center justify-between gap-4 py-3 px-4 border-t border-border/80 bg-white rounded-b-xl">
                  <span className="text-sm text-muted-foreground">
                    Einträge {(contactsPage * CONTACTS_PAGE_SIZE) + 1}–{Math.min((contactsPage + 1) * CONTACTS_PAGE_SIZE, contactsTotal)} von {contactsTotal}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      disabled={contactsPage === 0 || loading}
                      onClick={() => {
                        const prev = contactsPage - 1;
                        setContactsPage(prev);
                        loadContacts(undefined, prev);
                      }}
                    >
                      Zurück
                    </Button>
                    <span className="text-sm tabular-nums">Seite {contactsPage + 1} von {Math.ceil(contactsTotal / CONTACTS_PAGE_SIZE)}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      disabled={contactsPage >= Math.ceil(contactsTotal / CONTACTS_PAGE_SIZE) - 1 || loading}
                      onClick={() => {
                        const next = contactsPage + 1;
                        setContactsPage(next);
                        loadContacts(undefined, next);
                      }}
                    >
                      Weiter
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        )}
        </div>
        )}
      </div>

      {/* Produkt-Picker: Mögliche Sales – Produkte einem Kontakt zuordnen */}
      <Dialog open={!!productPickerContact} onOpenChange={(open) => { if (!open) { setProductPickerContact(null); if (viewData.contacts?.length) { const ids = viewData.contacts.map((c) => c.id).join(','); fetch(`/api/admin/contact-products/sums?contact_ids=${ids}`, { credentials: 'include' }).then((r) => r.json()).then((res) => setOpportunitySums(res.sums ?? {})).catch(() => {}); } } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Produkte / Mögliche Sales</DialogTitle>
            <DialogDescription>
              {productPickerContact ? (productPickerContact.company || `${productPickerContact.first_name || ''} ${productPickerContact.last_name || ''}`.trim() || 'Kontakt') : ''} – zugeordnete Produkte bestimmen den möglichen Umsatz.
            </DialogDescription>
          </DialogHeader>
          {productsMigrationRequired && (
            <p className="text-sm text-amber-600">Produkte-Tabelle fehlt. Bitte SUPABASE_PRODUCTS_MIGRATION.md ausführen.</p>
          )}
          {productPickerLoading ? (
            <p className="text-sm text-muted-foreground">Lade…</p>
          ) : (
            <div className="space-y-3">
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {contactProductsForPicker.map((cp) => {
                  const p = cp.products ?? (typeof cp.product_id === 'object' ? cp.product_id : null);
                  const name = p && typeof p === 'object' && 'name' in p ? String(p.name) : `Produkt #${cp.product_id}`;
                  const price = p && typeof p === 'object' && 'price_display' in p ? String(p.price_display) : '';
                  return (
                    <li key={cp.id} className="flex items-center justify-between gap-2 rounded-lg border border-border/60 p-2 text-sm">
                      <span className="font-medium truncate">{name}</span>
                      <span className="text-muted-foreground shrink-0">{price}</span>
                      <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0 text-destructive hover:text-destructive" onClick={async () => {
                        if (!productPickerContact) return;
                        await fetch(`/api/admin/contacts/${productPickerContact.id}/products?product_id=${cp.product_id}`, { method: 'DELETE', credentials: 'include' });
                        setContactProductsForPicker((prev) => prev.filter((x) => x.id !== cp.id));
                      }}>×</Button>
                    </li>
                  );
                })}
              </ul>
              {contactProductsForPicker.length === 0 && !productPickerLoading && (
                <p className="text-sm text-muted-foreground">Noch keine Produkte zugeordnet.</p>
              )}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Produkt hinzufügen</p>
                <div className="flex flex-wrap gap-1.5">
                  {products.filter((p) => !contactProductsForPicker.some((cp) => cp.product_id === p.id)).map((p) => (
                    <Button key={p.id} type="button" variant="outline" size="sm" className="text-xs h-8" onClick={async () => {
                      if (!productPickerContact) return;
                      const res = await fetch(`/api/admin/contacts/${productPickerContact.id}/products`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ product_id: p.id, quantity: 1 }),
                      });
                      const data = await res.json();
                      if (data.data) setContactProductsForPicker((prev) => [...prev, data.data]);
                    }}>
                      {p.name} ({p.price_display})
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status-Popup (aus Tabelle geöffnet – einheitlich wie in Cards: Klick → Popup) */}
      <Dialog open={!!statusDialogContact} onOpenChange={(open) => { if (!open) setStatusDialogContact(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Lead-Status ändern</DialogTitle>
            <DialogDescription>
              {statusDialogContact ? (statusDialogContact.company || `${statusDialogContact.first_name || ''} ${statusDialogContact.last_name || ''}`.trim() || 'Kontakt') : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-1.5 py-2">
            {LEAD_STATUSES.map((s) => (
              <Button
                key={s.value}
                variant={statusDialogContact?.status === s.value ? 'default' : 'ghost'}
                size="sm"
                className={`justify-start ${statusDialogContact?.status === s.value ? getStatusColor(s.value) : ''}`}
                onClick={() => {
                  if (statusDialogContact) {
                    updateStatus(statusDialogContact.id, s.value);
                    setContacts((prev) => prev.map((c) => c.id === statusDialogContact.id ? { ...c, status: s.value } : c));
                    setStatusDialogContact(null);
                  }
                }}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup: Scraper fertig (Hintergrund-Lauf) – shadcn Dialog */}
      <Dialog open={!!scraperDoneNotification} onOpenChange={(open) => { if (!open) setScraperDoneNotification(null); }}>
        <DialogContent className="sm:max-w-sm border-2 border-[#cb530a]">
          <DialogHeader>
            <DialogTitle>{scraperDoneNotification?.label}: Suche abgeschlossen</DialogTitle>
            <DialogDescription>
              {scraperDoneNotification?.error ?? `${scraperDoneNotification?.count ?? 0} Kontakt(e) übernommen. Die Liste wurde aktualisiert.`}
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
              Letzte Aktionen im CRM (Status, Notizen, Zuweisung)
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
                  const who = teamMembers.find(m => m.username === entry.sales_rep)?.display_name || entry.sales_rep;
                  let actionText = '';
                  if (entry.action === 'status_change') {
                    const newLabel = getStatusLabel(entry.new_value ?? '');
                    actionText = `Status auf „${newLabel}" geändert`;
                  } else if (entry.action === 'notes_edit') {
                    actionText = 'Notizen bearbeitet';
                  } else if (entry.action === 'assigned') {
                    const to = entry.new_value ? (teamMembers.find(m => m.username === entry.new_value)?.display_name || entry.new_value) : '—';
                    actionText = `Zugewiesen an: ${to}`;
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

      {/* Termin anlegen / bearbeiten (global: aus Kalender oder aus Lead) */}
      <Dialog open={calendarDialogOpen} onOpenChange={(open) => { if (!open) { setCalendarDialogOpen(false); setCalendarEditEvent(null); setCalendarFromContact(null); } }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{calendarEditEvent ? 'Termin bearbeiten' : calendarFromContact ? 'Termin mit Lead' : 'Termin anlegen'}</DialogTitle>
            <DialogDescription>
              {calendarFromContact ? `Lead: ${calendarFromContact.company || `${calendarFromContact.first_name || ''} ${calendarFromContact.last_name || ''}`.trim() || 'Kontakt'}` : 'Person, Titel, Start und Ende.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            {(calendarFromContact || calendarForm.contact_id) && (
              <div className="rounded-lg bg-muted/50 p-2 text-sm text-muted-foreground">
                {calendarFromContact ? `Lead: ${calendarFromContact.company || [calendarFromContact.first_name, calendarFromContact.last_name].filter(Boolean).join(' ').trim() || 'Kontakt'}` : `Lead verknüpft (ID ${calendarForm.contact_id})`}
              </div>
            )}
            <div>
              <Label className="text-xs">Titel *</Label>
              <Input value={calendarForm.title} onChange={(e) => setCalendarForm(f => ({ ...f, title: e.target.value }))} placeholder="z. B. Kundenanruf" className="mt-1 h-9" />
            </div>
            <div>
              <Label className="text-xs">Person</Label>
              <select value={calendarForm.sales_rep} onChange={(e) => setCalendarForm(f => ({ ...f, sales_rep: e.target.value }))} className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.username}>{m.display_name}{m.department_label ? ` (${m.department_label})` : ''}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Start (Datum)</Label>
                <Input type="date" value={calendarForm.startDate} onChange={(e) => setCalendarForm(f => ({ ...f, startDate: e.target.value }))} className="mt-1 h-9" />
              </div>
              <div>
                <Label className="text-xs">Start (Uhrzeit)</Label>
                <Input type="time" value={calendarForm.startTime} onChange={(e) => setCalendarForm(f => ({ ...f, startTime: e.target.value }))} className="mt-1 h-9" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Ende (Datum)</Label>
                <Input type="date" value={calendarForm.endDate} onChange={(e) => setCalendarForm(f => ({ ...f, endDate: e.target.value }))} className="mt-1 h-9" />
              </div>
              <div>
                <Label className="text-xs">Ende (Uhrzeit)</Label>
                <Input type="time" value={calendarForm.endTime} onChange={(e) => setCalendarForm(f => ({ ...f, endTime: e.target.value }))} className="mt-1 h-9" />
              </div>
            </div>
            <div className="border-t pt-3 mt-1">
              <Label className="text-xs font-semibold">Termin-Vorbereitung (Vertrieb)</Label>
              <div className="grid gap-2 mt-2">
                <div>
                  <Label className="text-[10px] text-muted-foreground">Empfohlene Produkte</Label>
                  <div className="flex flex-wrap gap-1 mt-1 max-h-24 overflow-y-auto rounded border border-input p-2">
                    {products.map((p) => {
                      const checked = calendarForm.recommendedProductIds.includes(p.id);
                      return (
                        <label key={p.id} className="inline-flex items-center gap-1 text-xs cursor-pointer">
                          <input type="checkbox" checked={checked} onChange={() => setCalendarForm(f => ({ ...f, recommendedProductIds: checked ? f.recommendedProductIds.filter(id => id !== p.id) : [...f.recommendedProductIds, p.id] }))} className="rounded" />
                          {p.name}
                        </label>
                      );
                    })}
                    {products.length === 0 && <span className="text-xs text-muted-foreground">Keine Produkte angelegt.</span>}
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Website-Zustand</Label>
                  <select value={calendarForm.website_state} onChange={(e) => setCalendarForm(f => ({ ...f, website_state: e.target.value }))} className="mt-0.5 h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                    <option value="">—</option>
                    <option value="keine">Keine</option>
                    <option value="vorhanden">Vorhanden</option>
                    <option value="veraltet">Veraltet</option>
                    <option value="unbekannt">Unbekannt</option>
                  </select>
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Google-Zustand</Label>
                  <select value={calendarForm.google_state} onChange={(e) => setCalendarForm(f => ({ ...f, google_state: e.target.value }))} className="mt-0.5 h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                    <option value="">—</option>
                    <option value="kein_profil">Kein Profil</option>
                    <option value="profil_vorhanden">Profil vorhanden</option>
                    <option value="bewertungen_vorhanden">Bewertungen vorhanden</option>
                    <option value="ausbaufähig">Ausbaufähig</option>
                  </select>
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Social-Media-Zustand</Label>
                  <select value={calendarForm.social_media_state} onChange={(e) => setCalendarForm(f => ({ ...f, social_media_state: e.target.value }))} className="mt-0.5 h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                    <option value="">—</option>
                    <option value="keine">Keine</option>
                    <option value="teilweise">Teilweise</option>
                    <option value="aktiv">Aktiv</option>
                    <option value="unbekannt">Unbekannt</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-xs">Notizen</Label>
              <Textarea value={calendarForm.notes} onChange={(e) => setCalendarForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="mt-1 text-sm" placeholder="Optional" />
            </div>
          </div>
          <DialogFooter>
            {calendarEditEvent && (
              <Button
                variant="destructive"
                className="mr-auto"
                onClick={async () => {
                  if (!confirm('Termin wirklich löschen?')) return;
                  try {
                    const res = await fetch(`/api/admin/calendar/events/${calendarEditEvent.id}`, { method: 'DELETE', credentials: 'include' });
                    if (!res.ok) return;
                    setCalendarEvents(prev => prev.filter(e => e.id !== calendarEditEvent.id));
                    setCalendarUpcomingEvents(prev => prev.filter(e => e.id !== calendarEditEvent.id));
                    setCalendarDialogOpen(false);
                    setCalendarEditEvent(null);
                    setCalendarFromContact(null);
                  } catch (e) { console.error(e); }
                }}
              >
                Löschen
              </Button>
            )}
            <Button variant="outline" onClick={() => { setCalendarDialogOpen(false); setCalendarEditEvent(null); setCalendarFromContact(null); }}>Abbrechen</Button>
            <Button
              className="bg-[#cb530a] hover:bg-[#a84308]"
              onClick={async () => {
                const startDate = calendarForm.startDate || new Date().toISOString().slice(0, 10);
                const endDate = calendarForm.endDate || startDate;
                const start_at = `${startDate}T${calendarForm.startTime || '09:00'}:00`;
                const end_at = `${endDate}T${calendarForm.endTime || '09:30'}:00`;
                if (!calendarForm.title.trim()) return;
                const payload = { title: calendarForm.title, sales_rep: calendarForm.sales_rep, start_at, end_at, notes: calendarForm.notes || null, contact_id: calendarForm.contact_id ?? null, recommended_product_ids: calendarForm.recommendedProductIds, website_state: calendarForm.website_state || null, google_state: calendarForm.google_state || null, social_media_state: calendarForm.social_media_state || null };
                try {
                  if (calendarEditEvent) {
                    const res = await fetch(`/api/admin/calendar/events/${calendarEditEvent.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) });
                    if (!res.ok) { const d = await res.json(); alert(d.error || 'Fehler'); return; }
                    const { data } = await res.json();
                    setCalendarEvents(prev => prev.map(e => e.id === data.id ? data : e));
                    setCalendarUpcomingEvents(prev => prev.map(e => e.id === data.id ? data : e));
                  } else {
                    const res = await fetch('/api/admin/calendar/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) });
                    if (!res.ok) { const d = await res.json(); alert(d.error || 'Fehler'); return; }
                    const { data } = await res.json();
                    setCalendarEvents(prev => [...prev, data].sort((a, b) => a.start_at.localeCompare(b.start_at)));
                    setCalendarUpcomingEvents(prev => [...prev, data].sort((a, b) => a.start_at.localeCompare(b.start_at)));
                  }
                  setCalendarDialogOpen(false);
                  setCalendarEditEvent(null);
                  setCalendarFromContact(null);
                } catch (e) { console.error(e); alert('Fehler'); }
              }}
            >
              {calendarEditEvent ? 'Speichern' : 'Anlegen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Zuweisen – Dialog (Tabelle) */}
      <Dialog open={!!assignDialogContact} onOpenChange={(open) => { if (!open) setAssignDialogContact(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Zuweisen an</DialogTitle>
            <DialogDescription>
              {assignDialogContact && (assignDialogContact.company || `${assignDialogContact.first_name} ${assignDialogContact.last_name}`.trim() || '—')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-1.5 py-2">
            <Button variant="outline" size="sm" className="justify-start" onClick={() => { if (assignDialogContact) { updateAssignedTo(assignDialogContact.id, null); setAssignDialogContact(null); } }}>
              — Keine Zuweisung
            </Button>
            {teamMembers.map((m) => (
              <Button key={m.id} variant="outline" size="sm" className="justify-start" onClick={() => { if (assignDialogContact) { updateAssignedTo(assignDialogContact.id, m.username); setAssignDialogContact(null); } }}>
                {m.display_name}{m.department_label ? ` (${m.department_label})` : ''}
              </Button>
            ))}
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
                      <span className="font-medium">{teamMembers.find(m => m.username === entry.sales_rep)?.display_name || entry.sales_rep}</span>
                      <span className="text-muted-foreground">
                        {entry.action === 'status_change' && 'Status geändert'}
                        {entry.action === 'notes_edit' && 'Notizen bearbeitet'}
                        {entry.action === 'assigned' && 'Zugewiesen'}
                      </span>
                      {entry.new_value != null && entry.action === 'status_change' && (
                        <span>→ {getStatusLabel(entry.new_value)}</span>
                      )}
                      {entry.new_value != null && entry.action === 'assigned' && (
                        <span>→ {entry.new_value ? (teamMembers.find(m => m.username === entry.new_value)?.display_name || entry.new_value) : '—'}</span>
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
  onProductsClick,
  opportunitySum,
  getProfileUrl,
  getProfileLabel,
  getWebsiteFromNotes,
  renderQuizData,
  getStatusColor,
  getStatusLabel,
  getSourceLabel,
  getSourceBorderClass,
  fullWidth = false,
  onAssignedChange,
  onStatusClick,
  onCalendarClick,
  potentialBadges = [],
  teamMembers = [],
}: {
  contact: ContactSubmission;
  leadStatuses: readonly { value: string; label: string }[];
  onStatusChange: (status: string) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onNotesClick: () => void;
  onProductsClick?: () => void;
  opportunitySum?: number;
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
  onStatusClick?: () => void;
  onCalendarClick?: () => void;
  potentialBadges?: { key: string; label: string; title: string; className: string }[];
  teamMembers?: TeamMember[];
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
      className={`rounded-xl border border-border/80 bg-white shadow-sm hover:shadow-md transition-all duration-200 p-4 cursor-context-menu ${getSourceBorderClass(contact.source)}`}
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
            <button
              type="button"
              title="Klicken zum Ändern"
              className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(contact.status)} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50`}
              onClick={() => (onStatusClick ? onStatusClick() : setStatusDialogOpen(true))}
            >
              {getStatusLabel(contact.status)}
            </button>
            {potentialBadges.length > 0 && (
              <span className="flex flex-wrap gap-1">
                {potentialBadges.map((b) => (
                  <span key={b.key} className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${b.className}`} title={b.title}>{b.label}</span>
                ))}
              </span>
            )}
            {onAssignedChange && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 h-7 text-xs"
                  onClick={() => setAssignDialogOpen(true)}
                  title="Zuweisen"
                >
                  Zugewiesen an: {contact.assigned_to ? (teamMembers.find(m => m.username === contact.assigned_to)?.display_name || contact.assigned_to) : '—'}
                </Button>
                <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Zuweisen an</DialogTitle>
                      <DialogDescription>Kontakt: {displayName}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-1.5 py-2">
                      <Button variant="outline" size="sm" className="justify-start" onClick={() => { onAssignedChange(null); setAssignDialogOpen(false); }}>—</Button>
                      <Button variant="outline" size="sm" className="justify-start" onClick={() => { onAssignedChange(null); setAssignDialogOpen(false); }}>— Keine Zuweisung</Button>
                      {teamMembers.map((m) => (
                        <Button key={m.id} variant="outline" size="sm" className="justify-start" onClick={() => { onAssignedChange(m.username); setAssignDialogOpen(false); }}>{m.display_name}{m.department_label ? ` (${m.department_label})` : ''}</Button>
                      ))}
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
            {onProductsClick && (
              <div className="flex items-center gap-2 flex-wrap">
                {opportunitySum != null && opportunitySum > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 tabular-nums">{opportunitySum.toLocaleString('de-DE')} € mögliche Sales</span>
                )}
                <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={onProductsClick}>
                  Produkte / Mögliche Sales
                </Button>
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
          onClick={() => (onStatusClick ? onStatusClick() : setStatusDialogOpen(true))}
          title="Klicken zum Ändern"
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
        {onCalendarClick && (
          <Button type="button" variant="outline" size="sm" className="h-9 rounded-md border-input" onClick={onCalendarClick} title="Termin mit diesem Lead anlegen">
            <Calendar className="w-4 h-4 mr-1.5" />
            Termin legen
          </Button>
        )}
        {!onStatusClick && (
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
        )}
      </div>
    </Card>
  );
}
