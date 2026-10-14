import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { parisToday } from "@/lib/bo/dates";
import { getCategories, getProduitParId, getSousCategories } from "@/lib/contenu/donnees";
import ProductEditor from "@/components/bo/products/ProductEditor";

export const metadata: Metadata = { title: "Produit" };

export default async function EditProduitPage({ params }: { params: { id: string } }) {
  const [product, categories, subcategories] = await Promise.all([getProduitParId(params.id), getCategories(), getSousCategories()]);
  if (!product) notFound();
  return <ProductEditor key={product.id} product={product} categories={categories} subcategories={subcategories} today={parisToday()} />;
}
