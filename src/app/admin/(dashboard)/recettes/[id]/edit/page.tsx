import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRecettes } from "@/lib/contenu/donnees";
import RecipeEditor from "@/components/bo/recipes/RecipeEditor";

export const metadata: Metadata = { title: "Recette" };

export default async function EditRecettePage({ params }: { params: { id: string } }) {
  const recipe = (await getRecettes({ toutes: true })).find((r) => r.id === params.id);
  if (!recipe) notFound();
  return <RecipeEditor key={recipe.id} recipe={recipe} />;
}
