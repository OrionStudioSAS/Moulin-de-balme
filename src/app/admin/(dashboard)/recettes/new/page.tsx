import type { Metadata } from "next";
import RecipeEditor from "@/components/bo/recipes/RecipeEditor";

export const metadata: Metadata = { title: "Nouvelle recette" };

export default function NewRecettePage() {
  return <RecipeEditor />;
}
