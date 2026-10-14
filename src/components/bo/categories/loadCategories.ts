import { getCategories, getProduits, getReglages, getSousCategories } from "@/lib/contenu/donnees";
import type { DefaultBanner } from "./CategoriesView";

export async function loadCategories() {
  const [categories, subcategories, reglages, produits] = await Promise.all([getCategories(), getSousCategories(), getReglages(), getProduits()]);
  const productCounts: Record<string, number> = {};
  for (const p of produits) if (p.category_id) productCounts[p.category_id] = (productCounts[p.category_id] ?? 0) + 1;
  return { categories, subcategories, defaultBanner: reglages.banniereProduits as DefaultBanner, productCounts };
}
