import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/types";
import ProductsView from "@/components/bo/products/ProductsView";

export const metadata: Metadata = { title: "Produits" };

export default async function AdminProduitsPage() {
  const supabase = await createClient();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*, category:categories(*)").order("sort_order").order("name"),
    supabase.from("categories").select("*").order("sort_order"),
  ]);
  return <ProductsView products={(products ?? []) as (Product & { category?: Category })[]} categories={(categories ?? []) as Category[]} />;
}
