export type CalendarEventSalesRep = 'sven' | 'pascal';

export interface CalendarEvent {
  id: number;
  sales_rep: CalendarEventSalesRep;
  title: string;
  start_at: string;
  end_at: string;
  contact_id: number | null;
  notes: string | null;
  recommended_product_ids?: number[];
  website_state?: string | null;
  google_state?: string | null;
  social_media_state?: string | null;
  created_at?: string;
  updated_at?: string;
}
