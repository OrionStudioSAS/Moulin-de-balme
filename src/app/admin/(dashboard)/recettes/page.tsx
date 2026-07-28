import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Recipe } from "@/types";

export default async function AdminRecettesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recipes")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });

  const recipes = (data ?? []) as Recipe[];

  const CATEGORY_LABELS: Record<string, string> = {
    pains: "Pains", viennoiseries: "Viennoiseries",
    patisseries: "Pâtisseries", confitures: "Confitures", farines: "Farines",
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brown uppercase tracking-tight">Recettes</h1>
          <p className="text-sm text-warm-gray mt-1">{recipes.length} recette{recipes.length > 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/recettes/new" className="btn-primary text-sm">
          + Nouvelle recette
        </Link>
      </div>

      <div className="bg-white border border-brown/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-brown/20 bg-cream-dark">
            <tr>
              {["Titre","Catégorie","Difficulté","Temps","Statut","Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase text-warm-gray">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brown/10">
            {recipes.map((r) => (
              <tr key={r.id} className="hover:bg-cream/50">
                <td className="px-4 py-3">
                  <p className="font-medium text-brown">{r.title}</p>
                  <p className="text-[10px] text-warm-gray">{r.slug}</p>
                </td>
                <td className="px-4 py-3 text-xs text-warm-gray">
                  {CATEGORY_LABELS[r.category] ?? r.category}
                </td>
                <td className="px-4 py-3 text-xs text-warm-gray">{r.difficulty}</td>
                <td className="px-4 py-3 text-xs text-warm-gray">{r.total_time ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-1 ${
                    r.is_published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {r.is_published ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/recettes/${r.id}/edit`}
                      className="text-xs text-brown hover:underline">
                      Modifier
                    </Link>
                    <Link href={`/recettes/${r.slug}`} target="_blank"
                      className="text-xs text-brown/40 hover:text-brown">
                      Voir ↗
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {recipes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-warm-gray">
                  Aucune recette — créez votre première recette.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
