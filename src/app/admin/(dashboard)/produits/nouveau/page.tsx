import type { Metadata } from "next";
import { parisToday } from "@/lib/bo/dates";
import { getCategories, getSousCategories } from "@/lib/contenu/donnees";
import ProductEditor from "@/components/bo/products/ProductEditor";

export const metadata: Metadata = { title: "Nouveau produit" };

export default async function NouveauProduitPage() {
  const [categories, subcategories] = await Promise.all([getCategories(), getSousCategories()]);
  return <ProductEditor categories={categories} subcategories={subcategories} today={parisToday()} />;
}
