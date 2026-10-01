import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoriesView, { ALL_SLUG } from "@/components/bo/categories/CategoriesView";
import { loadCategories } from "@/components/bo/categories/loadCategories";

export const metadata: Metadata = { title: "Catégories" };

export default async function CategoryAdminPage({ params }: { params: { slug: string } }) {
  const data = await loadCategories();
  if (params.slug !== ALL_SLUG && !data.categories.some((c) => c.slug === params.slug)) notFound();
  return <CategoriesView {...data} selected={params.slug} />;
}
