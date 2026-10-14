import type { Metadata } from "next";
import { getCategories, getProduits } from "@/lib/contenu/donnees";
import ProductsView from "@/components/bo/products/ProductsView";

export const metadata: Metadata = { title: "Produits" };

export default async function AdminProduitsPage() {
  const [products, categories] = await Promise.all([getProduits(), getCategories()]);
  return <ProductsView products={products} categories={categories} />;
}
