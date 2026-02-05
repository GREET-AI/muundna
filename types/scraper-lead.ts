/**
 * Typen für gescrapte Leads (z. B. Gelbe Seiten).
 * Werden in contact_submissions gemappt (company, first_name, phone, street, city, source, source_meta).
 */

export type ScrapedLeadStatus = 'neu' | 'kontaktiert' | 'interessiert' | 'kunde' | 'abgelehnt';

export interface ScrapedLeadInsert {
  firma: string;
  adresse: string;
  plz_ort: string;
  telefon: string;
  website: string;
  /** E-Mail (z. B. von 11880 Detailseite) */
  email?: string;
  gs_profile_url: string;
  gs_email_form_url: string;
  notiz: string;
  lead_score: number;
  status: ScrapedLeadStatus;
}
