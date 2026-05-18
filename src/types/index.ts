export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  available_days: string[]; // ['lundi','mardi',...]
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  category?: Category;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  products?: CollectionProduct[];
}

export interface CollectionProduct {
  collection_id: string;
  product_id: string;
  sort_order: number;
  product?: Product;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  product?: Product;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_date: string;
  pickup_time: string;
  items: OrderItem[];
  total_amount: number;
  status: "pending" | "confirmed" | "ready" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
}

export interface WeeklySchedule {
  day: string;
  label: string;
  hours: string;
  closed: boolean;
}
