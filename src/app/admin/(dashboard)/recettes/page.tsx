import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Recipe } from "@/types";
import RecipesView from "@/components/bo/recipes/RecipesView";

export const metadata: Metadata = { title: "Recettes" };

export default async function AdminRecettesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("recipes").select("*").order("sort_order").order("created_at", { ascending: false });
  return <RecipesView recipes={(data ?? []) as Recipe[]} />;
}
