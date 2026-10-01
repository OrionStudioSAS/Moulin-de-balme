import type { Metadata } from "next";
import CategoriesView from "@/components/bo/categories/CategoriesView";
import { loadCategories } from "@/components/bo/categories/loadCategories";

export const metadata: Metadata = { title: "Catégories" };

export default async function CategoriesAdminPage() {
  return <CategoriesView {...await loadCategories()} selected={null} />;
}
