import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Recipe } from "@/types";
import RecipeEditor from "@/components/bo/recipes/RecipeEditor";

export const metadata: Metadata = { title: "Recette" };

export default async function EditRecettePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data } = await supabase.from("recipes").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  return <RecipeEditor key={data.id} recipe={data as Recipe} />;
}
