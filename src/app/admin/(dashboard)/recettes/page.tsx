import type { Metadata } from "next";
import { getRecettes } from "@/lib/contenu/donnees";
import RecipesView from "@/components/bo/recipes/RecipesView";

export const metadata: Metadata = { title: "Recettes" };

export default async function AdminRecettesPage() {
  const recettes = (await getRecettes({ toutes: true })).sort((a, b) => a.sort_order - b.sort_order);
  return <RecipesView recipes={recettes} />;
}
