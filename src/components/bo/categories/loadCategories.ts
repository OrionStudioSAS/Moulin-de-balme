import { createClient } from "@/lib/supabase/server";
import type { Category, Subcategory } from "@/types";
import type { DefaultBanner } from "./CategoriesView";

export async function loadCategories() {
  const supabase = await createClient();
  const [{ data: categories }, { data: subcategories }, { data: settings }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("subcategories").select("*").order("sort_order"),
    supabase.from("site_settings").select("value").eq("key", "products_banner").maybeSingle(),
    supabase.from("products").select("category_id"),
  ]);
  const productCounts: Record<string, number> = {};
  for (const p of products ?? []) if (p.category_id) productCounts[p.category_id] = (productCounts[p.category_id] ?? 0) + 1;
  return {
    categories: (categories ?? []) as Category[],
    subcategories: (subcategories ?? []) as Subcategory[],
    defaultBanner: (settings?.value ?? {}) as DefaultBanner,
    productCounts,
  };
}
