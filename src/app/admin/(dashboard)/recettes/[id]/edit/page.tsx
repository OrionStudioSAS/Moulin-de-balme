import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Recipe } from "@/types";
import RecipeForm from "@/components/admin/RecipeForm";

export default async function EditRecettePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }   = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("recipes").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-brown uppercase tracking-tight mb-2">
        Modifier la recette
      </h1>
      <p className="text-sm text-warm-gray mb-8">{(data as Recipe).title}</p>
      <RecipeForm recipe={data as Recipe} />
    </div>
  );
}
