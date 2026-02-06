export type ProductType = 'package' | 'addon' | 'module' | 'single';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price_display: string;
  price_period: string | null;
  price_min: number | null;
  /** Einmalpreis (z. B. Website), optional */
  price_once?: number | null;
  product_type: ProductType;
  subline: string | null;
  features: string[];
  sort_order: number;
  /** Kombinierbar mit Paket (z. B. "1", "2", "1,2") – für Add-ons */
  for_package?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ContactProduct {
  id: number;
  contact_id: number;
  product_id: number;
  quantity: number;
  estimated_value_override: number | null;
  created_at?: string;
  products?: Product | null;
}
