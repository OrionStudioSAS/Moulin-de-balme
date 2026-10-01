import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { parisToday } from "@/lib/bo/dates";
import type { Category, Subcategory } from "@/types";
import ProductEditor from "@/components/bo/products/ProductEditor";

export const metadata: Metadata = { title: "Nouveau produit" };

export default async function NouveauProduitPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: subcategories }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("subcategories").select("*").order("sort_order"),
  ]);
  return <ProductEditor categories={(categories ?? []) as Category[]} subcategories={(subcategories ?? []) as Subcategory[]} today={parisToday()} />;
}
